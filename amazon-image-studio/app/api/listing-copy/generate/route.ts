import { NextResponse } from "next/server";

type Marketplace = "US" | "DE";

type KeywordRow = {
  keyword: string;
  volume: string;
  type: string;
};

type Bullet = {
  copy: string;
  translation: string;
};

type TitleCheck = {
  label: string;
  passed: boolean;
  detail: string;
};

type GeneratedCopy = {
  competitorSummary: string[];
  suggestions: string[];
  title: string;
  titleTranslation: string;
  titleChecks: TitleCheck[];
  bullets: Bullet[];
  backendTerms: string;
};

type GenerateRequest = {
  marketplace?: Marketplace;
  brand?: string;
  productQuantity?: string;
  keywordText?: string;
  competitorText?: string;
  listingPrompt?: string;
  model?: string;
};

const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1";
const DEFAULT_MODEL = process.env.MINIMAX_MODEL || "MiniMax-M2.7";
const ALLOWED_MODELS = new Set([
  "MiniMax-M3",
  "MiniMax-M2.7",
  "MiniMax-M2.7-highspeed",
  "MiniMax-M2.5",
  "MiniMax-M2.5-highspeed",
  "MiniMax-M2.1",
  "MiniMax-M2.1-highspeed",
  "M2-her"
]);

const riskWords = ["original", "genuine", "oem", "official", "factory", "best", "guaranteed"];
const titleMaxLength = 200;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "缺少 MINIMAX_API_KEY。请在 .env.local 中配置后重启 dev server。"
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as GenerateRequest;
    const marketplace = body.marketplace === "US" ? "US" : "DE";
    const model = getModel(body.model);
    const keywords = parseKeywords(body.keywordText || "");
    const payload = buildPromptPayload({
      marketplace,
      brand: body.brand || "",
      productQuantity: body.productQuantity || "",
      keywordText: body.keywordText || "",
      competitorText: body.competitorText || "",
      listingPrompt: body.listingPrompt || "",
      keywords
    });

    const response = await fetch(`${MINIMAX_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(marketplace)
          },
          {
            role: "user",
            content: payload
          }
        ],
        temperature: 0.45,
        top_p: 0.9,
        max_completion_tokens: 2600,
        ...(model === "MiniMax-M3" ? { thinking: { type: "disabled" } } : {})
      })
    });

    const rawResponse = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: getProviderError(rawResponse, response.status)
        },
        { status: response.status }
      );
    }

    const content = rawResponse?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "模型没有返回可解析内容，请重试。" }, { status: 502 });
    }

    const parsed = parseModelJson(content);
    const copy = normalizeCopy(parsed, marketplace);

    return NextResponse.json({
      provider: "minimax",
      model,
      copy,
      usage: rawResponse?.usage || null
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "生成失败，请稍后重试。"
      },
      { status: 500 }
    );
  }
}

function getModel(model?: string) {
  if (model && ALLOWED_MODELS.has(model)) return model;
  return ALLOWED_MODELS.has(DEFAULT_MODEL) ? DEFAULT_MODEL : "MiniMax-M3";
}

function buildSystemPrompt(marketplace: Marketplace) {
  const language = marketplace === "DE" ? "German for Amazon Germany" : "American English for Amazon US";
  const compatibility = marketplace === "DE" ? "kompatibel mit" : "compatible with";

  return [
    "You are an Amazon marketplace listing copywriter and compliance reviewer.",
    `Write customer-facing copy in ${language}.`,
    "Always include Chinese translations for the title and every bullet.",
    "The competitor analysis fields competitorSummary and suggestions must be written in Simplified Chinese only, even when marketplace copy is German or English.",
    "Use competitor input only for pattern analysis. Never copy competitor phrasing or unsupported claims.",
    `Use '${compatibility}' for compatibility wording when needed.`,
    "Title rules: max 200 characters; front-load brand, core keyword, model/package quantity in the first 80 characters; avoid keyword stuffing; do not repeat the same meaningful word more than twice; avoid Original, Genuine, OEM, official, factory, best, guaranteed unless explicitly confirmed.",
    "Bullets rules: exactly 5 bullets; each bullet starts with a buyer benefit and then supports it with concrete product facts; do not invent certifications, sizes, materials, quantities, warranty, or compatibility.",
    "The product brief may only contain brand and package quantity/count. Do not invent product facts that were not supplied by keywords, competitor input, or the user's listing prompt.",
    "Follow the user's listingPrompt for competitor analysis, title restrictions, bullet restrictions, risk words, and translation requirements, unless it conflicts with JSON output or marketplace compliance.",
    "Backend Search Terms: include useful long-tail terms and model terms not fully covered by the title; no commas; no duplicate words; for German use no-umlaut spellings where useful.",
    "Return only valid JSON. Do not wrap it in markdown."
  ].join("\n");
}

function buildPromptPayload(input: {
  marketplace: Marketplace;
  brand: string;
  productQuantity: string;
  keywordText: string;
  competitorText: string;
  listingPrompt: string;
  keywords: KeywordRow[];
}) {
  const marketName = input.marketplace === "DE" ? "Amazon DE" : "Amazon US";

  return JSON.stringify(
    {
      task: "Generate Amazon listing title and five bullet points.",
      marketplace: marketName,
      outputSchema: {
        competitorSummary: ["string - simplified Chinese only; summarize what competitors do well"],
        suggestions: ["string - simplified Chinese only; optimization suggestions and risk warnings"],
        title: "string",
        titleTranslation: "string - Chinese translation",
        bullets: [
          {
            copy: "string",
            translation: "string - Chinese translation"
          }
        ],
        backendTerms: "string"
      },
      requirements: [
        "Return exactly one title.",
        "Return exactly five bullets.",
        "competitorSummary must be Simplified Chinese only.",
        "suggestions must be Simplified Chinese only.",
        "Return Chinese translation directly under title and every bullet.",
        "Title must stay within 200 characters.",
        "First 80 characters of title should include the most important buyer search intent.",
        "Avoid risky words and competitor brand terms unless they are explicitly confirmed as allowed.",
        "Preserve keyword search volume priorities without stuffing.",
        "Use productQuantity/package count naturally in title or bullets when relevant.",
        "Do not invent specs, materials, certifications, included accessories, or compatible models that were not provided."
      ],
      product: {
        brand: input.brand || "Brand",
        productQuantity: input.productQuantity || "No package quantity provided."
      },
      listingPrompt:
        input.listingPrompt ||
        "竞对分析用中文输出；标题控制在200字符内，前80字符优先放品牌、核心关键词、型号/数量；五点必须生成5条并带中文翻译，不编造未提供事实。",
      keywords: input.keywords,
      rawKeywordInput: input.keywordText,
      competitorTitleAndBullets: input.competitorText || "No competitor copy provided."
    },
    null,
    2
  );
}

function parseModelJson(content: string) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("模型返回格式不是 JSON，请重新生成。");
    return JSON.parse(match[0]);
  }
}

function normalizeCopy(raw: unknown, marketplace: Marketplace): GeneratedCopy {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const title = asString(record.title);
  const bullets = Array.isArray(record.bullets)
    ? record.bullets.slice(0, 5).map((bullet) => {
        const item = bullet && typeof bullet === "object" ? (bullet as Record<string, unknown>) : {};
        return {
          copy: asString(item.copy),
          translation: asString(item.translation)
        };
      })
    : [];

  if (!title) throw new Error("模型返回缺少标题，请重新生成。");
  if (bullets.length !== 5 || bullets.some((bullet) => !bullet.copy)) {
    throw new Error("模型返回的五点不完整，请重新生成。");
  }

  return {
    competitorSummary: asStringArray(record.competitorSummary).slice(0, 4),
    suggestions: asStringArray(record.suggestions).slice(0, 4),
    title: title.slice(0, 260),
    titleTranslation: asString(record.titleTranslation),
    titleChecks: getTitleChecks(title),
    bullets,
    backendTerms: normalizeBackendTerms(asString(record.backendTerms), marketplace)
  };
}

function parseKeywords(input: string): KeywordRow[] {
  return input
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line
        .split(/,|\t/)
        .map((part) => part.trim())
        .filter(Boolean);
      const keyword = parts[0] || line;
      return {
        keyword,
        volume: parts[1] || "无数据",
        type: classifyKeyword(keyword)
      };
    })
    .slice(0, 80);
}

function classifyKeyword(keyword: string) {
  const lower = keyword.toLowerCase();
  if (riskWords.some((word) => lower.includes(word))) return "风险/排除词";
  if (/\b[a-z]{1,4}\d{2,}|\d{3,}\b/i.test(keyword)) return "型号词";
  if (lower.includes("compatible") || lower.includes("kompatibel")) return "兼容词";
  if (lower.includes("pack") || lower.includes("washable") || lower.includes("foam") || lower.includes("filter")) {
    return "产品属性词";
  }
  if (keyword.split(/\s+/).length >= 4) return "长尾词";
  return "核心词";
}

function getTitleChecks(title: string): TitleCheck[] {
  const lowerTitle = title.toLowerCase();
  const first80 = title.slice(0, 80).toLowerCase();
  const repeated = findRepeatedWords(title);
  const risky = riskWords.filter((word) => lowerTitle.includes(word));

  return [
    {
      label: "长度",
      passed: title.length <= titleMaxLength,
      detail: `${title.length}/${titleMaxLength}`
    },
    {
      label: "核心前置",
      passed: /\b(filter|replacement|kit|ersatz|kompatibel|compatible|vf\d+|\d+\s*pack)\b/i.test(first80),
      detail: "前80字符应包含核心搜索意图"
    },
    {
      label: "重复词",
      passed: repeated.length === 0,
      detail: repeated.length ? `${repeated.join(", ")} 超过2次` : "未发现明显堆砌"
    },
    {
      label: "风险词",
      passed: risky.length === 0,
      detail: risky.length ? `避开 ${risky.join(", ")}` : "未使用 Original/OEM/official 等词"
    }
  ];
}

function findRepeatedWords(title: string) {
  const counts = new Map<string, number>();
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !["with", "compatible", "kompatibel", "fuer", "pack"].includes(word))
    .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  return Array.from(counts.entries())
    .filter(([, count]) => count > 2)
    .map(([word]) => word);
}

function normalizeBackendTerms(value: string, marketplace: Marketplace) {
  const fallback =
    marketplace === "DE"
      ? "ersatzfilter zubehoer nass trockensauger filter set waschbar"
      : "vacuum accessory replacement filter washable maintenance kit";
  const source = value || fallback;
  return Array.from(new Set(source.replace(/,/g, " ").split(/\s+/).filter(Boolean))).slice(0, 48).join(" ");
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => asString(item)).filter(Boolean) : [];
}

function getProviderError(rawResponse: unknown, status: number) {
  const record = rawResponse && typeof rawResponse === "object" ? (rawResponse as Record<string, unknown>) : {};
  const error = record.error && typeof record.error === "object" ? (record.error as Record<string, unknown>) : null;
  const message = asString(error?.message) || asString(record.message) || asString(record.status_msg);
  return message || `Minimax API 请求失败，HTTP ${status}`;
}

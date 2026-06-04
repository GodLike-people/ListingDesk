"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Globe2,
  Languages,
  Lightbulb,
  ListChecks,
  RefreshCcw,
  Sparkles,
  Upload
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import styles from "./listing-copy.module.css";

type Marketplace = "US" | "DE";
type LlmModel =
  | "MiniMax-M3"
  | "MiniMax-M2.7"
  | "MiniMax-M2.7-highspeed"
  | "MiniMax-M2.5"
  | "MiniMax-M2.5-highspeed"
  | "M2-her";

type KeywordRow = {
  keyword: string;
  volume: string;
  type: string;
  notes: string;
};

type Bullet = {
  copy: string;
  translation: string;
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

type TitleCheck = {
  label: string;
  passed: boolean;
  detail: string;
};

const marketConfig = {
  US: {
    name: "Amazon US",
    language: "English",
    compatibility: "compatible with",
    titleTail: "Replacement Parts for Daily Home Care",
    tone: "Natural American English"
  },
  DE: {
    name: "Amazon DE",
    language: "Deutsch",
    compatibility: "kompatibel mit",
    titleTail: "Ersatzteile fuer den taeglichen Gebrauch",
    tone: "Praezise deutsche Listing-Sprache"
  }
};

const defaultKeywords =
  "replacement filter kit, 1200\nvacuum filter replacement, 880\nwashable foam filter, 420\nVF3500 filter, 360\n2 pack filter, 260\ncompatible with shop vacuum, 210";

const defaultCompetitor =
  "Competitor title: Vacuum Filter Replacement Kit Compatible with VF3500, Washable Foam Filter, 2 Pack\n\nCompetitor bullets:\n1. Designed for easy replacement and daily cleaning.\n2. Washable material helps extend use.\n3. Compatible with selected wet dry vacuum models.\n4. Package includes two filters.\n5. Simple installation, no extra tools required.";

const defaultListingPrompt =
  "竞对分析：必须用中文输出，先总结竞对标题和五点哪里好、哪里不好、有哪些风险词和可借鉴结构，不能复制竞对原句。\n标题限制：符合 Amazon 标题自查表，200 字符以内；前 80 字符优先放品牌、核心关键词、产品型号/数量；避免关键词堆砌，同一重要词不超过 2 次；不要使用 Original、OEM、official、best、guaranteed 等风险词。\n五点限制：生成 5 条，每条只做一个卖点任务，围绕价值、材料/结构、使用场景、适配/数量、信任收尾；必须基于关键词、竞对信息和产品数量，不要编造未提供的规格、认证、包装内容或兼容型号；每条下面必须带中文翻译。";

const riskWords = ["original", "genuine", "oem", "official", "factory", "best", "guaranteed"];
const titleMaxLength = 200;
const modelOptions: { value: LlmModel; label: string; note: string }[] = [
  { value: "MiniMax-M2.7", label: "MiniMax-M2.7", note: "Token Plan 推荐，质量优先" },
  { value: "MiniMax-M2.7-highspeed", label: "MiniMax-M2.7 Highspeed", note: "更快，适合多次改稿" },
  { value: "MiniMax-M2.5-highspeed", label: "MiniMax-M2.5 Highspeed", note: "性价比高，适合常规生成" },
  { value: "MiniMax-M2.5", label: "MiniMax-M2.5", note: "稳定通用" },
  { value: "MiniMax-M3", label: "MiniMax-M3", note: "备用：需确认当前账号可用" },
  { value: "M2-her", label: "M2-her", note: "对话模型，备用" }
];

export function ListingCopyTool() {
  const [marketplace, setMarketplace] = useState<Marketplace>("DE");
  const [brand, setBrand] = useState("Vitalumix");
  const [productQuantity, setProductQuantity] = useState("2 Pack");
  const [keywordText, setKeywordText] = useState(defaultKeywords);
  const [competitorText, setCompetitorText] = useState(defaultCompetitor);
  const [listingPrompt, setListingPrompt] = useState(defaultListingPrompt);
  const [uploadedName, setUploadedName] = useState("");
  const [model, setModel] = useState<LlmModel>("MiniMax-M2.7");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [generationMeta, setGenerationMeta] = useState("本地规则预览");
  const [generated, setGenerated] = useState<GeneratedCopy>(() =>
    generateCopy("DE", "Vitalumix", "2 Pack", parseKeywords(defaultKeywords), defaultCompetitor)
  );

  const keywordRows = useMemo(() => parseKeywords(keywordText), [keywordText]);
  const config = marketConfig[marketplace];

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedName(file.name);

    if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
      file.text().then((text) => {
        if (text.trim()) setKeywordText(text);
      });
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/listing-copy/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          marketplace,
          brand,
          productQuantity,
          keywordText,
          competitorText,
          listingPrompt,
          model
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "后台生成失败，请稍后重试。");
      }

      setGenerated(payload.copy);
      setGenerationMeta(`MiniMax API · ${payload.model || model}`);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "后台生成失败，请稍后重试。");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link className={styles.backLink} href="/">
          <ArrowLeft size={18} />
          返回首页
        </Link>
        <div className={styles.brand}>
          <span>
            <Sparkles size={18} />
          </span>
          Listing 标题五点生成器
        </div>
        <button className={styles.exportButton}>
          <Download size={17} />
          导出文案
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            <Languages size={16} />
            Amazon US / DE Listing Copy
          </p>
          <h1>生成标题和五点，并自动带中文翻译</h1>
          <p>
            关键词、品牌、套装数量和竞对标题五点分开输入；后台会结合 Listing 规则 Prompt 生成标题、五点和中文竞对分析。
          </p>
        </div>
        <div className={styles.marketSwitch} aria-label="Marketplace">
          <button className={marketplace === "DE" ? styles.active : ""} onClick={() => setMarketplace("DE")}>
            <Globe2 size={17} />
            德国站
          </button>
          <button className={marketplace === "US" ? styles.active : ""} onClick={() => setMarketplace("US")}>
            <Globe2 size={17} />
            美国站
          </button>
        </div>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.inputPanel}>
          <PanelTitle icon={<FileSpreadsheet size={18} />} title="1. 关键词" note="Excel / CSV / 手动输入" />
          <label className={styles.uploadBox}>
            <input accept=".xlsx,.xls,.csv,.txt" type="file" onChange={handleFile} />
            <Upload size={24} />
            <strong>{uploadedName || "上传关键词表"}</strong>
            <span>支持 Excel 选择；CSV / TXT 会自动填入文本框</span>
          </label>
          <textarea
            className={styles.textarea}
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder="每行一个关键词，可写成：keyword, search volume"
          />

          <PanelTitle icon={<ListChecks size={18} />} title="商品 Brief" note={config.name} />
          <div className={styles.formGrid}>
            <label>
              <span>品牌</span>
              <input value={brand} onChange={(event) => setBrand(event.target.value)} />
            </label>
            <label>
              <span>产品数量 / 套装只数</span>
              <input value={productQuantity} onChange={(event) => setProductQuantity(event.target.value)} />
            </label>
          </div>

          <PanelTitle icon={<BarChart3 size={18} />} title="2. 竞对标题&五点" note="可选" />
          <textarea
            className={styles.textarea}
            value={competitorText}
            onChange={(event) => setCompetitorText(event.target.value)}
            placeholder="粘贴竞对标题和五点，系统会先分析优缺点和建议"
          />

          <PanelTitle icon={<Lightbulb size={18} />} title="3. Listing 生成规则 Prompt" note="传给后台" />
          <textarea
            className={styles.textarea}
            value={listingPrompt}
            onChange={(event) => setListingPrompt(event.target.value)}
            placeholder="写给模型的 listing 生成限制，例如竞对分析、标题规则、五点规则、风险词、翻译要求等"
          />

          <PanelTitle icon={<Sparkles size={18} />} title="4. 模型选择" note="Minimax 国内版" />
          <label className={styles.fullLabel}>
            <span>大模型</span>
            <select
              className={styles.select}
              value={model}
              onChange={(event) => setModel(event.target.value as LlmModel)}
            >
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} · {option.note}
                </option>
              ))}
            </select>
          </label>

          {generationError ? <p className={styles.errorText}>{generationError}</p> : null}

          <button className={styles.generateButton} disabled={isGenerating} onClick={handleGenerate}>
            <Sparkles size={19} />
            {isGenerating ? "后台生成中..." : "生成标题五点"}
          </button>
        </aside>

        <section className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <div>
              <p className={styles.eyebrow}>{config.name}</p>
              <h2>{config.language} 标题与五点</h2>
              <p className={styles.modelMeta}>{generationMeta}</p>
            </div>
            <button className={styles.refreshButton} disabled={isGenerating} onClick={handleGenerate}>
              <RefreshCcw size={17} />
              {isGenerating ? "生成中" : "重新生成"}
            </button>
          </div>

          <div className={styles.resultGrid}>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <BadgeCheck size={18} />
                <h3>最终标题</h3>
              </div>
              <p className={styles.titleCopy}>{generated.title}</p>
              <div className={styles.titleMeta}>
                <span>{generated.title.length} / {titleMaxLength} 字符</span>
                <span>前 80 字符优先放品牌、核心词和产品类型</span>
              </div>
              <div className={styles.titleChecklist}>
                {generated.titleChecks.map((check) => (
                  <span className={check.passed ? styles.pass : styles.warn} key={check.label}>
                    {check.label}: {check.detail}
                  </span>
                ))}
              </div>
              <p className={styles.translation}>中文翻译：{generated.titleTranslation}</p>
            </article>

            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <Lightbulb size={18} />
                <h3>竞对分析与建议</h3>
              </div>
              <div className={styles.analysisColumns}>
                <div>
                  <strong>哪里好</strong>
                  {generated.competitorSummary.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
                <div>
                  <strong>建议优化</strong>
                  {generated.suggestions.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <article className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <ListChecks size={18} />
              <h3>五点描述</h3>
            </div>
            <ol className={styles.bullets}>
              {generated.bullets.map((bullet, index) => (
                <li key={bullet.copy}>
                  <strong>{index + 1}. {bullet.copy}</strong>
                  <span>中文翻译：{bullet.translation}</span>
                </li>
              ))}
            </ol>
          </article>

          <div className={styles.lowerGrid}>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <BarChart3 size={18} />
                <h3>关键词分类</h3>
              </div>
              <div className={styles.keywordTable}>
                <div className={styles.tableHead}>
                  <span>类型</span>
                  <span>关键词</span>
                  <span>搜索量</span>
                </div>
                {keywordRows.slice(0, 9).map((row) => (
                  <div className={styles.tableRow} key={`${row.keyword}-${row.volume}`}>
                    <span>{row.type}</span>
                    <strong>{row.keyword}</strong>
                    <span>{row.volume}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <ChevronDown size={18} />
                <h3>后台 Search Terms</h3>
              </div>
              <p className={styles.backendTerms}>{generated.backendTerms}</p>
              <p className={styles.helperText}>
                后台会结合关键词、竞对内容、套装数量和 Listing 规则 Prompt 生成，并持续规避风险词。
              </p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}

function PanelTitle({ icon, title, note }: { icon: ReactNode; title: string; note: string }) {
  return (
    <div className={styles.panelTitle}>
      <span>{icon}</span>
      <strong>{title}</strong>
      <em>{note}</em>
    </div>
  );
}

function parseKeywords(input: string): KeywordRow[] {
  return input
    .split(/\r?\n|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/,|\t/).map((part) => part.trim()).filter(Boolean);
      const keyword = parts[0] || line;
      const volume = parts[1] || "无数据";
      return {
        keyword,
        volume,
        type: classifyKeyword(keyword),
        notes: keyword.toLowerCase().includes("oem") ? "风险词" : "可用于覆盖买家搜索意图"
      };
    });
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

function generateCopy(
  marketplace: Marketplace,
  brand: string,
  productQuantity: string,
  keywords: KeywordRow[],
  competitorText: string
): GeneratedCopy {
  const config = marketConfig[marketplace];
  const cleanBrand = brand.trim() || "Brand";
  const cleanQuantity = productQuantity.trim() || "2 Pack";
  const topKeywords = keywords.filter((item) => item.type !== "风险/排除词").slice(0, 5).map((item) => item.keyword);
  const primaryKeyword = topKeywords[0] || "replacement filter kit";
  const productPhrase = primaryKeyword;
  const modelKeyword = keywords.find((item) => item.type === "型号词")?.keyword || (marketplace === "DE" ? "ausgewaehlte Modelle" : "selected models");
  const competitorLines = competitorText.split(/\r?\n/).filter((line) => line.trim()).length;
  const title = buildCompliantTitle(marketplace, cleanBrand, productPhrase, primaryKeyword, modelKeyword, cleanQuantity);
  const titleChecks = getTitleChecks(title, cleanBrand, productPhrase, primaryKeyword);

  const competitorSummary =
    competitorText.trim().length > 0
      ? [
          `竞对内容覆盖了 ${competitorLines} 行信息，适合提取标题结构和五点任务。`,
          "优点通常在于型号、数量和使用场景表达清楚，买家能快速识别产品。"
        ]
      : ["未填写竞对内容，当前结果主要根据关键词、品牌和套装数量生成。"];

  const suggestions =
    competitorText.trim().length > 0
      ? [
          "避免照搬竞对句式，标题前半段优先放核心关键词和产品类型。",
          "五点不要重复同一个卖点，分别覆盖价值、材料、场景、兼容和信心。"
        ]
      : ["建议后续补充 2-3 个竞对标题五点，便于识别常见关键词和表达空白。"];

  if (marketplace === "DE") {
    return {
      competitorSummary,
      suggestions,
      title,
      titleChecks,
      titleTranslation: `${cleanBrand} ${primaryKeyword}，${cleanQuantity} 替换套装，兼容 ${modelKeyword}，适合日常使用`,
      bullets: [
        {
          copy: `Klare Ersatzloesung: ${cleanQuantity} ${productPhrase} fuer Kaeufer, die ${primaryKeyword} suchen und eine einfache Wartung bevorzugen.`,
          translation: `清晰的替换方案：适合搜索 ${primaryKeyword}、希望简单维护的买家。`
        },
        {
          copy: `Mengenangabe im Fokus: ${cleanQuantity} wird klar genannt, ohne ungepruefte Details zu erfinden.`,
          translation: `突出数量信息：清楚表达 ${cleanQuantity}，同时不编造未确认的规格细节。`
        },
        {
          copy: `Praktisch im Alltag: Hilft dabei, Zubehoer schnell zu wechseln, zu reinigen und nach dem Trocknen wieder einzusetzen.`,
          translation: "日常使用更方便：帮助快速更换、清洗，并在干燥后重新安装配件。"
        },
        {
          copy: `Passform beachten: ${config.compatibility} ${modelKeyword}; bitte Modellnummer und Lieferumfang vor dem Kauf pruefen.`,
          translation: `请注意适配性：兼容 ${modelKeyword}；购买前请确认型号和包装内容。`
        },
        {
          copy: `Saubere Listing-Struktur: Titel und Bullet Points decken wichtige Suchbegriffe ab, ohne die Lesbarkeit zu verlieren.`,
          translation: "清晰的 Listing 结构：标题和五点覆盖重要搜索词，同时保持可读性。"
        }
      ],
      backendTerms: buildBackendTerms(topKeywords, "ersatzfilter zubehoer fuer nass trockensauger filter set waschbar"),
    };
  }

  return {
    competitorSummary,
    suggestions,
    title,
    titleChecks,
    titleTranslation: `${cleanBrand} ${primaryKeyword}，${cleanQuantity} 替换套装，兼容 ${modelKeyword}，适合日常家用维护`,
    bullets: [
      {
        copy: `Built for replacement needs: ${cleanQuantity} ${productPhrase} helps shoppers looking for ${primaryKeyword} refresh their routine maintenance setup.`,
        translation: `针对替换需求设计：${productPhrase} 帮助搜索 ${primaryKeyword} 的买家更新日常维护配件。`
      },
      {
        copy: `Clear package count: ${cleanQuantity} is stated naturally while avoiding unconfirmed specs or included accessories.`,
        translation: `套装数量清晰：自然表达 ${cleanQuantity}，同时避免编造未确认的规格或配件内容。`
      },
      {
        copy: "Easy to manage: remove, rinse, dry, and reinstall the filter set as part of a regular care routine.",
        translation: "易于维护：可拆下、冲洗、晾干并重新安装，适合作为定期保养流程的一部分。"
      },
      {
        copy: `Check fit before purchase: ${config.compatibility} ${modelKeyword}; confirm your model number and package contents first.`,
        translation: `购买前请确认适配：兼容 ${modelKeyword}；请先核对型号和包装内容。`
      },
      {
        copy: "Balanced keyword coverage: title and bullets keep the main search terms visible while staying readable for buyers.",
        translation: "关键词覆盖更平衡：标题和五点保留主要搜索词，同时保持买家易读。"
      }
    ],
    backendTerms: buildBackendTerms(topKeywords, "vacuum accessory replacement filter washable maintenance kit"),
  };
}

function buildCompliantTitle(
  marketplace: Marketplace,
  brand: string,
  productPhrase: string,
  primaryKeyword: string,
  modelKeyword: string,
  productQuantity: string
) {
  const quantity = productQuantity.trim();
  const feature = marketplace === "DE" ? "waschbares Filter-Set" : "Washable Filter Set";
  const compatibility = marketplace === "DE" ? `kompatibel mit ${modelKeyword}` : `compatible with ${modelKeyword}`;
  const useCase = marketplace === "DE" ? "fuer Nass- und Trockensauger" : "for Wet Dry Vacuum Maintenance";
  const titleParts =
    marketplace === "DE"
      ? [brand, primaryKeyword, feature, compatibility, quantity, useCase]
      : [brand, toTitleCase(primaryKeyword), toTitleCase(productPhrase), feature, compatibility, quantity, useCase];

  return enforceTitleLimit(dedupeTitlePhrases(titleParts.filter(Boolean).join(", ")));
}

function dedupeTitlePhrases(title: string) {
  const seen = new Set<string>();
  return title
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ")
    .replace(/\s+/g, " ")
    .trim();
}

function enforceTitleLimit(title: string) {
  if (title.length <= titleMaxLength) return title;
  const parts = title.split(",").map((part) => part.trim()).filter(Boolean);
  while (parts.join(", ").length > titleMaxLength && parts.length > 4) {
    parts.pop();
  }
  return parts.join(", ");
}

function getTitleChecks(title: string, brand: string, productPhrase: string, primaryKeyword: string): TitleCheck[] {
  const lowerTitle = title.toLowerCase();
  const first80 = title.slice(0, 80).toLowerCase();
  const repeated = findRepeatedWords(title);
  const risky = riskWords.filter((word) => lowerTitle.includes(word));

  return [
    {
      label: "结构完整",
      passed: lowerTitle.includes(brand.toLowerCase()) && hasAnyTerm(lowerTitle, productPhrase) && hasAnyTerm(lowerTitle, primaryKeyword),
      detail: "品牌 + 核心词 + 产品类型/规格"
    },
    {
      label: "长度",
      passed: title.length <= titleMaxLength,
      detail: `${title.length}/${titleMaxLength}`
    },
    {
      label: "核心前置",
      passed: hasAnyTerm(first80, primaryKeyword) || hasAnyTerm(first80, productPhrase),
      detail: "前80字符包含核心搜索意图"
    },
    {
      label: "重复词",
      passed: repeated.length === 0,
      detail: repeated.length ? `${repeated.join(", ")} 超过2次` : "同一关键词不超过2次"
    },
    {
      label: "风险词",
      passed: risky.length === 0,
      detail: risky.length ? `避开 ${risky.join(", ")}` : "未使用 Original/OEM/official 等词"
    }
  ];
}

function hasAnyTerm(text: string, phrase: string) {
  return phrase
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .some((word) => text.includes(word));
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

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function buildBackendTerms(keywords: string[], fallback: string) {
  return Array.from(new Set([...keywords.slice(1), fallback].join(" ").split(/\s+/).filter(Boolean)))
    .slice(0, 28)
    .join(" ");
}

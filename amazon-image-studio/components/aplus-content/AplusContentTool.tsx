"use client";

import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Box,
  ChevronDown,
  Download,
  FileImage,
  Globe2,
  ImagePlus,
  Layers3,
  LayoutTemplate,
  ListChecks,
  Monitor,
  Palette,
  RefreshCcw,
  Smartphone,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import styles from "./aplus-content.module.css";

type Marketplace = "US" | "DE";
type ViewMode = "desktop" | "mobile";

type AplusModule = {
  index: number;
  theme: string;
  purpose: string;
  connection: string;
  layout: string;
  heading: string;
  body: string;
  desktopDirection: string;
  desktopPrompt: string;
  mobileDirection: string;
  mobilePrompt: string;
  assets: string[];
  notes: string;
};

type AplusPlan = {
  productConfirmation: string;
  strategy: string;
  competitorAnalysis: string[];
  brandDirection: string;
  storyline: string;
  modules: AplusModule[];
  comparisonChart: string[];
  brandStory: string;
  missingFacts: string[];
};

const marketConfig = {
  US: {
    name: "Amazon US",
    language: "English",
    tone: "clear, benefit-led, conversion-focused, mobile-readable",
    headings: [
      "Built for a Cleaner Replacement Routine",
      "Why the Right Filter Fit Matters",
      "Details Buyers Can See",
      "Made for Everyday Cleanup",
      "Check the Fit Before You Buy",
      "A Simple Care Rhythm"
    ]
  },
  DE: {
    name: "Amazon DE",
    language: "Deutsch",
    tone: "clean, precise, trustworthy, practical, technically clear",
    headings: [
      "Sauberer Ersatz fuer den Alltag",
      "Warum die passende Filterloesung wichtig ist",
      "Details, die Kaeufer sehen koennen",
      "Praktisch fuer regelmaessige Reinigung",
      "Passform vor dem Kauf pruefen",
      "Einfach pflegen und wiederverwenden"
    ]
  }
};

const defaultFacts =
  "VF3500 filter replacement kit, 2 pack washable foam filters, blue and black, for wet dry vacuum maintenance, easy to rinse, dry, and reuse.";

const defaultListingContext =
  "Title keywords: replacement filter kit, washable foam filter, wet dry vacuum filter, VF3500 filter. Bullets focus on replacement needs, material details, everyday use, fit confirmation, and care routine.";

const defaultMainImagePlan =
  "Main image sequence: 1 white background product-only, 2 core benefit, 3 structure details, 4 use scenario, 5 problem solution, 6 package/compatibility, 7 care and trust closer.";

const defaultCompetitor =
  "Competitor A+ pages often use a product hero, filter structure diagram, lifestyle cleaning scene, package contents, and model compatibility chart. Some pages repeat the same product angle and use too much small text on mobile.";

export function AplusContentTool() {
  const [marketplace, setMarketplace] = useState<Marketplace>("DE");
  const [brand, setBrand] = useState("Vitalumix");
  const [productName, setProductName] = useState("VF3500 Filter Kit");
  const [productFacts, setProductFacts] = useState(defaultFacts);
  const [listingContext, setListingContext] = useState(defaultListingContext);
  const [mainImagePlan, setMainImagePlan] = useState(defaultMainImagePlan);
  const [competitorNotes, setCompetitorNotes] = useState(defaultCompetitor);
  const [brandStyle, setBrandStyle] = useState("Clean technical style, blue accent color, restrained logo use, product-first layout.");
  const [productLine, setProductLine] = useState("VF3500 standard kit, VF3500 value pack, brush roll bundle");
  const [buyerObjections, setBuyerObjections] = useState("Will it fit my model? What is included? Can the filter be washed and reused?");
  const [productFiles, setProductFiles] = useState<string[]>([]);
  const [competitorFiles, setCompetitorFiles] = useState<string[]>([]);
  const [brandFiles, setBrandFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [plan, setPlan] = useState<AplusPlan>(() =>
    generateAplusPlan(
      "DE",
      "Vitalumix",
      "VF3500 Filter Kit",
      defaultFacts,
      defaultListingContext,
      defaultMainImagePlan,
      defaultCompetitor,
      "Clean technical style, blue accent color, restrained logo use, product-first layout.",
      "VF3500 standard kit, VF3500 value pack, brush roll bundle",
      "Will it fit my model? What is included? Can the filter be washed and reused?",
      0,
      0,
      0
    )
  );

  const selectedModule = useMemo(
    () => plan.modules.find((module) => module.index === selectedIndex) || plan.modules[0],
    [plan.modules, selectedIndex]
  );
  const config = marketConfig[marketplace];

  function collectFileNames(event: ChangeEvent<HTMLInputElement>, setter: (files: string[]) => void) {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    setter(files);
  }

  function handleGenerate() {
    const nextPlan = generateAplusPlan(
      marketplace,
      brand,
      productName,
      productFacts,
      listingContext,
      mainImagePlan,
      competitorNotes,
      brandStyle,
      productLine,
      buyerObjections,
      productFiles.length,
      competitorFiles.length,
      brandFiles.length
    );
    setPlan(nextPlan);
    setSelectedIndex(1);
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
            <LayoutTemplate size={18} />
          </span>
          A+ 内容规划器
        </div>
        <button className={styles.exportButton} onClick={() => exportAplusDocument(plan, brand, productName, marketplace)}>
          <Download size={17} />
          导出 A+ Brief
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            <WandSparkles size={16} />
            Amazon A+ Content Workflow
          </p>
          <h1>生成一套连续的 A+ 页面模块和双尺寸 Prompt</h1>
          <p>
            A+ 不重复主图，而是继续解释产品、场景、兼容、使用和品牌信任；每个模块都生成 PC 与 Mobile 两个版本。
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
          <PanelTitle icon={<Box size={18} />} title="产品确认" note={config.name} />
          <div className={styles.formGrid}>
            <label>
              <span>品牌</span>
              <input value={brand} onChange={(event) => setBrand(event.target.value)} />
            </label>
            <label>
              <span>产品名 / 型号</span>
              <input value={productName} onChange={(event) => setProductName(event.target.value)} />
            </label>
          </div>
          <label className={styles.fullLabel}>
            <span>产品事实</span>
            <textarea value={productFacts} onChange={(event) => setProductFacts(event.target.value)} />
          </label>

          <PanelTitle icon={<FileImage size={18} />} title="素材上传" note="前端记录文件名" />
          <div className={styles.uploadGrid}>
            <UploadBox label="产品图" files={productFiles} onChange={(event) => collectFileNames(event, setProductFiles)} />
            <UploadBox label="竞对 A+" files={competitorFiles} onChange={(event) => collectFileNames(event, setCompetitorFiles)} />
            <UploadBox label="Logo/品牌" files={brandFiles} onChange={(event) => collectFileNames(event, setBrandFiles)} />
          </div>

          <PanelTitle icon={<ListChecks size={18} />} title="标题五点 / 关键词" note="承接 Listing" />
          <textarea className={styles.textarea} value={listingContext} onChange={(event) => setListingContext(event.target.value)} />

          <PanelTitle icon={<ImagePlus size={18} />} title="主图 7 张方案" note="可粘贴上一步结果" />
          <textarea className={styles.textarea} value={mainImagePlan} onChange={(event) => setMainImagePlan(event.target.value)} />

          <PanelTitle icon={<BarChart3 size={18} />} title="竞对 A+ 观察" note="可选" />
          <textarea className={styles.textarea} value={competitorNotes} onChange={(event) => setCompetitorNotes(event.target.value)} />

          <PanelTitle icon={<Palette size={18} />} title="品牌与产品线" note="可选" />
          <textarea className={styles.textareaSmall} value={brandStyle} onChange={(event) => setBrandStyle(event.target.value)} />
          <textarea className={styles.textareaSmall} value={productLine} onChange={(event) => setProductLine(event.target.value)} />

          <PanelTitle icon={<BookOpen size={18} />} title="买家疑虑 / FAQ" note="可选" />
          <textarea className={styles.textareaSmall} value={buyerObjections} onChange={(event) => setBuyerObjections(event.target.value)} />

          <button className={styles.generateButton} onClick={handleGenerate}>
            <Sparkles size={19} />
            生成 A+ 模块
          </button>
        </aside>

        <section className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <div>
              <p className={styles.eyebrow}>{config.name} · {config.language}</p>
              <h2>{productName} A+ 内容方案</h2>
            </div>
            <button className={styles.refreshButton} onClick={handleGenerate}>
              <RefreshCcw size={17} />
              重新生成
            </button>
          </div>

          <div className={styles.strategyGrid}>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <BadgeCheck size={18} />
                <h3>A+ 策略</h3>
              </div>
              <p>{plan.strategy}</p>
              <p className={styles.confirmation}>{plan.productConfirmation}</p>
            </article>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <Layers3 size={18} />
                <h3>连续页面故事线</h3>
              </div>
              <p>{plan.storyline}</p>
              <p>{plan.brandDirection}</p>
            </article>
          </div>

          <section className={styles.board}>
            <div className={styles.moduleRail}>
              {plan.modules.map((module) => (
                <button
                  className={selectedIndex === module.index ? styles.selectedModuleButton : styles.moduleButton}
                  key={module.index}
                  onClick={() => setSelectedIndex(module.index)}
                >
                  <span>{String(module.index).padStart(2, "0")}</span>
                  <strong>{module.theme}</strong>
                  <small>{module.purpose}</small>
                </button>
              ))}
            </div>

            <article className={styles.detailCard}>
              <div className={styles.detailTop}>
                <div>
                  <p className={styles.eyebrow}>Module {String(selectedModule.index).padStart(2, "0")}</p>
                  <h3>{selectedModule.heading}</h3>
                </div>
                <div className={styles.viewSwitch}>
                  <button className={viewMode === "desktop" ? styles.active : ""} onClick={() => setViewMode("desktop")}>
                    <Monitor size={16} />
                    PC
                  </button>
                  <button className={viewMode === "mobile" ? styles.active : ""} onClick={() => setViewMode("mobile")}>
                    <Smartphone size={16} />
                    Mobile
                  </button>
                </div>
              </div>

              <div className={styles.previewStage}>
                <div className={viewMode === "desktop" ? styles.desktopPreview : styles.mobilePreview}>
                  <div className={styles.productMock}>
                    <span className={styles.filterOne} />
                    <span className={styles.filterTwo} />
                    <span className={styles.brush} />
                  </div>
                  <div className={styles.previewCopy}>
                    <strong>{selectedModule.heading}</strong>
                    <span>{selectedModule.body}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailGrid}>
                <InfoBlock title="模块目的" text={selectedModule.purpose} />
                <InfoBlock title="上下承接" text={selectedModule.connection} />
                <InfoBlock title="布局" text={selectedModule.layout} />
                <InfoBlock title="正文" text={selectedModule.body} />
                <InfoBlock title="所需素材" text={selectedModule.assets.join("，")} />
                <InfoBlock title="注意事项" text={selectedModule.notes} />
              </div>

              <div className={styles.promptGrid}>
                <PromptBlock title="Desktop 1464 x 600 px" direction={selectedModule.desktopDirection} prompt={selectedModule.desktopPrompt} />
                <PromptBlock title="Mobile 600 x 450 px" direction={selectedModule.mobileDirection} prompt={selectedModule.mobilePrompt} />
              </div>
            </article>
          </section>

          <div className={styles.lowerGrid}>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <BarChart3 size={18} />
                <h3>竞对 A+ 洞察</h3>
              </div>
              {plan.competitorAnalysis.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </article>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <ChevronDown size={18} />
                <h3>比较表 / 品牌收尾</h3>
              </div>
              {plan.comparisonChart.map((item) => (
                <p key={item}>{item}</p>
              ))}
              <p className={styles.confirmation}>{plan.brandStory}</p>
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

function UploadBox({
  label,
  files,
  onChange
}: {
  label: string;
  files: string[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={styles.uploadBox}>
      <input accept="image/*,.pdf" multiple type="file" onChange={onChange} />
      <Upload size={22} />
      <strong>{label}</strong>
      <span>{files.length ? `${files.length} 个文件` : "选择文件"}</span>
    </label>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className={styles.infoBlock}>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function PromptBlock({ title, direction, prompt }: { title: string; direction: string; prompt: string }) {
  return (
    <div className={styles.promptBox}>
      <div className={styles.cardHeader}>
        <Monitor size={18} />
        <h3>{title}</h3>
      </div>
      <strong>{direction}</strong>
      <p>{prompt}</p>
    </div>
  );
}

function generateAplusPlan(
  marketplace: Marketplace,
  brand: string,
  productName: string,
  productFacts: string,
  listingContext: string,
  mainImagePlan: string,
  competitorNotes: string,
  brandStyle: string,
  productLine: string,
  buyerObjections: string,
  productFileCount: number,
  competitorFileCount: number,
  brandFileCount: number
): AplusPlan {
  const config = marketConfig[marketplace];
  const cleanBrand = brand.trim() || "Brand";
  const cleanProduct = productName.trim() || "Product";
  const facts = productFacts.trim() || "exact product facts need to be confirmed";
  const hasProductImage = productFileCount > 0;
  const logoNote = brandFileCount > 0 ? "Logo and brand references available for restrained placement." : "No logo uploaded; use brand color and typography direction only.";
  const confirmation = hasProductImage
    ? `产品图已上传 ${productFileCount} 个，A+ 方案可按当前商品外观继续细化。`
    : "尚未上传清晰产品图，当前 A+ 方案应视为草稿；最终生成前需要确认产品形状、颜色、数量和包含配件。";

  const competitorAnalysis = competitorNotes.trim()
    ? [
        `已记录 ${competitorFileCount} 个竞对 A+ 素材文件和文字观察，用于分析模块顺序、信息密度和常见卖点。`,
        "竞对可借鉴的是买家问题顺序，不复制模块布局、图标、场景、色块和品牌表达。",
        "当前建议让 A+ 承接主图，但不要重复主图：更多解释 fit、care、package 和 practical proof。"
      ]
    : ["未输入竞对 A+ 观察；当前模块顺序按通用 A+ 买家旅程生成。"];

  const assets = [hasProductImage ? "Uploaded product photo" : "Clear product image needed", brandFileCount > 0 ? "Logo / brand reference" : "Brand style notes"];
  const heading = config.headings;

  return {
    productConfirmation: confirmation,
    strategy: `${config.name} 方向：${config.tone}。A+ 作为主图和标题五点后的深度解释区，用来回答买家对 ${cleanProduct} 的适配、使用、内容物和维护疑虑。`,
    competitorAnalysis,
    brandDirection: `${cleanBrand} 品牌方向：${brandStyle || "clean product-first A+ design"}. ${logoNote}`,
    storyline: `从“这是什么”开始，接着解释为什么需要、结构细节、日常使用、购买前确认，最后用品牌/护理收尾，让页面像一条连续滚动故事，而不是独立散图。`,
    comparisonChart: buildComparisonNotes(productLine),
    brandStory: `${cleanBrand} 的收尾模块建议强调稳定、清晰、可复用的维护体验；不加入价格、评论、折扣、外链或未经证明的承诺。`,
    missingFacts: buildMissingFacts(hasProductImage, productFacts, buyerObjections),
    modules: [
      buildModule(1, "产品 Hero", "建立页面级承诺", "从 Listing 主图进入 A+，先确认产品身份和核心用途。", "宽幅产品 Hero，左侧标题文案，右侧产品大图，背景简洁。", heading[0], "A focused replacement kit designed to make routine maintenance easier to understand.", `${cleanProduct} product hero, brand-level opening module, product large and clear, subtle brand color, headline area with generous white space`, `${config.name} A+ desktop module 1464 x 600 px for ${cleanProduct}, ${facts}, product hero composition, ${config.tone}, heading "${heading[0]}", body text area clean and readable, ${logoNote}, no competitor brand, no review stars, no discounts, no external links, no watermark.`, `Mobile-optimized stacked hero, larger product, shorter heading, minimal secondary text`, `${config.name} A+ mobile module 600 x 450 px for ${cleanProduct}, simplified stacked product hero, large product, heading "${heading[0]}", fewer elements, readable mobile text, no desktop-style tiny labels, no competitor brand, no watermark.`, assets, "不要复制主图构图；A+ Hero 要扩展品牌和产品承诺。"),
      buildModule(2, "问题与解决", "说明为什么这个产品重要", "承接 Hero，解释买家为什么需要更换/维护，而不是只展示产品。", "左右分栏：买家问题在左，产品解决路径在右。", heading[1], "A clear fit and replacement routine helps reduce uncertainty before purchase.", `Problem and solution A+ desktop scene, buyer friction around fit, replacement, maintenance, clean explanatory layout`, `${config.name} A+ desktop module 1464 x 600 px, problem-solution layout for ${cleanProduct}, include factual buyer concerns from: ${buyerObjections}, heading "${heading[1]}", clear visual hierarchy, no exaggerated claims, no copied competitor layout.`, `Mobile layout with one problem statement and one product solution block`, `${config.name} A+ mobile module 600 x 450 px, one buyer concern and one simple solution block, product visible, heading "${heading[1]}", large type, minimal callouts.`, assets, "避免过度承诺，不写 guaranteed、best 或官方暗示。"),
      buildModule(3, "结构细节", "证明材料/结构/数量", "从问题进入证据，用细节支持卖点。", "产品局部放大，2-4 个清晰标注，强调材料、数量、颜色或结构。", heading[2], "Show the product details buyers need to confirm before choosing a replacement kit.", `Feature proof module, close-up product detail, material and package fact callouts`, `${config.name} A+ desktop module 1464 x 600 px, feature deep dive for ${cleanProduct}, product facts: ${facts}, close-up detail labels, heading "${heading[2]}", clean technical style, no unsupported certifications or percentages.`, `Mobile version with fewer callouts and larger close-up detail`, `${config.name} A+ mobile module 600 x 450 px, simplified feature proof, larger close-up, 2 readable callouts max, heading "${heading[2]}", no tiny text.`, assets, "所有标注必须来自产品事实。"),
      buildModule(4, "使用场景", "把产品放入真实使用语境", "从结构证据进入日常场景，让买家理解使用时机。", "家庭清洁/维护场景，产品与使用环境同屏，保持产品清晰。", heading[3], "Connect the kit to regular cleanup, care, and replacement moments.", `Lifestyle A+ desktop module, practical home or workshop cleaning context, product visible and accurate`, `${config.name} A+ desktop module 1464 x 600 px, practical use scenario for ${cleanProduct}, based on main image plan: ${mainImagePlan}, heading "${heading[3]}", product visible, no extra included accessories implied.`, `Mobile scenario with product foreground and one short message`, `${config.name} A+ mobile module 600 x 450 px, practical use scene, product foreground, heading "${heading[3]}", simple mobile composition, no clutter.`, assets, "场景道具不能暗示包含在购买内。"),
      buildModule(5, "规格/兼容/内容物", "回答购买前事实问题", "从使用场景回到购买确认，降低退货和误购风险。", "内容物平铺或清晰信息表，包含数量、适配、包装或尺寸。", heading[4], "Make the package contents and fit information easy to review before purchase.", `Specs and package contents module, compatibility and included parts layout`, `${config.name} A+ desktop module 1464 x 600 px, specs package and fit confirmation for ${cleanProduct}, facts: ${facts}, listing context: ${listingContext}, heading "${heading[4]}", readable table or labeled layout, no unconfirmed models, no competitor brand.`, `Mobile specs card with fewer rows and larger labels`, `${config.name} A+ mobile module 600 x 450 px, simplified specs and package contents card, larger labels, heading "${heading[4]}", no tiny table text.`, assets, "未确认的型号、尺寸、认证不要写进图。"),
      buildModule(6, "品牌/护理收尾", "建立最后信任感", "最后不重复卖点，用护理节奏或品牌理念收尾。", "产品 + 简洁护理步骤或品牌承诺；保持干净、有呼吸感。", heading[5], "Close with a simple care rhythm and a calm brand message.", `Brand closer A+ module, care steps, product and restrained logo placement`, `${config.name} A+ desktop module 1464 x 600 px, brand trust closer for ${cleanProduct}, care rhythm based on facts: ${facts}, heading "${heading[5]}", restrained brand style: ${brandStyle}, no warranty, no discount, no review language.`, `Mobile closer with product, short heading, and 2-3 simple care steps`, `${config.name} A+ mobile module 600 x 450 px, simplified brand closer, product large, heading "${heading[5]}", 2-3 readable care steps, no unsupported claims.`, assets, "不写保修、认证、终身承诺，除非提供证明。")
    ]
  };
}

function buildModule(
  index: number,
  theme: string,
  purpose: string,
  connection: string,
  layout: string,
  heading: string,
  body: string,
  desktopDirection: string,
  desktopPrompt: string,
  mobileDirection: string,
  mobilePrompt: string,
  assets: string[],
  notes: string
): AplusModule {
  return {
    index,
    theme,
    purpose,
    connection,
    layout,
    heading,
    body,
    desktopDirection,
    desktopPrompt,
    mobileDirection,
    mobilePrompt,
    assets,
    notes
  };
}

function buildComparisonNotes(productLine: string) {
  if (!productLine.trim()) {
    return ["未填写产品线信息，首版不强制生成比较表。", "如果后续有多个 SKU、尺寸、套装或变体，可加入品牌自有产品比较表。"];
  }
  return [
    `可根据产品线信息制作品牌内部比较表：${productLine}`,
    "比较表只比较自有产品版本、尺寸、套装或适配范围，不做竞品攻击。"
  ];
}

function buildMissingFacts(hasProductImage: boolean, productFacts: string, buyerObjections: string) {
  const missing: string[] = [];
  if (!hasProductImage) missing.push("需要清晰产品图确认外观、颜色、数量和包含部件。");
  if (!productFacts.toLowerCase().includes("pack")) missing.push("建议确认包装数量。");
  if (!buyerObjections.trim()) missing.push("建议补充买家疑虑、FAQ 或退货原因。");
  return missing.length ? missing : ["当前输入足够生成 A+ 草稿，最终出图前仍需人工确认商品事实。"];
}

function exportAplusDocument(plan: AplusPlan, brand: string, productName: string, marketplace: Marketplace) {
  const lines = [
    "# Amazon A+ 内容方案",
    "",
    `Brand: ${brand || "未填写"}`,
    `Product: ${productName || "未填写"}`,
    `Marketplace: ${marketConfig[marketplace].name}`,
    "",
    "## Product Confirmation",
    plan.productConfirmation,
    "",
    "## A+ Strategy",
    plan.strategy,
    "",
    "## Competitor A+ Analysis",
    ...plan.competitorAnalysis.map((item) => `- ${item}`),
    "",
    "## Brand Direction",
    plan.brandDirection,
    "",
    "## Continuous Storyline",
    plan.storyline,
    "",
    ...plan.modules.flatMap((module) => [
      `## Module ${String(module.index).padStart(2, "0")} - ${module.theme}`,
      `Purpose: ${module.purpose}`,
      `Connection: ${module.connection}`,
      `Layout: ${module.layout}`,
      `Heading: ${module.heading}`,
      `Body: ${module.body}`,
      `Desktop direction, 1464 x 600 px: ${module.desktopDirection}`,
      `Desktop prompt: ${module.desktopPrompt}`,
      `Mobile direction, 600 x 450 px: ${module.mobileDirection}`,
      `Mobile prompt: ${module.mobilePrompt}`,
      `Assets: ${module.assets.join(", ")}`,
      `Notes: ${module.notes}`,
      ""
    ]),
    "## Comparison / Brand Story",
    ...plan.comparisonChart.map((item) => `- ${item}`),
    plan.brandStory,
    "",
    "## Missing Facts",
    ...plan.missingFacts.map((item) => `- ${item}`)
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(productName || "aplus-content")}-aplus-brief.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "aplus-content";
}

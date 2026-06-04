"use client";

import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Camera,
  ChevronDown,
  Download,
  FileImage,
  Globe2,
  ImagePlus,
  Layers3,
  LayoutGrid,
  ListChecks,
  MousePointer2,
  Palette,
  RefreshCcw,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import styles from "./main-images.module.css";

type Marketplace = "US" | "DE";

type ImagePlan = {
  index: number;
  theme: string;
  job: string;
  layout: string;
  onImageCopy: string;
  prompt: string;
  requiredAssets: string[];
  note: string;
};

type GeneratedPlan = {
  strategy: string;
  competitorInsights: string[];
  brandDirection: string;
  images: ImagePlan[];
};

const marketConfig = {
  US: {
    name: "Amazon US",
    language: "English",
    style: "clear, benefit-led, mobile-readable, product-first",
    copy: {
      benefit: "Easy Replacement",
      proof: "Washable Filter Set",
      scenario: "Ready for Daily Cleanup",
      problem: "Refresh Your Vacuum",
      bundle: "What You Receive",
      trust: "Rinse, Dry, Reuse"
    }
  },
  DE: {
    name: "Amazon DE",
    language: "Deutsch",
    style: "clean, precise, technical, trustworthy, product-first",
    copy: {
      benefit: "Einfacher Austausch",
      proof: "Waschbares Filter-Set",
      scenario: "Bereit fuer den Alltag",
      problem: "Saugleistung auffrischen",
      bundle: "Lieferumfang",
      trust: "Ausspuelen, trocknen, wiederverwenden"
    }
  }
};

const defaultBrief =
  "2 pack washable foam filter set, blue and black, replacement accessory for wet dry vacuum maintenance, easy to rinse and dry before reuse.";

const defaultCompetitor =
  "Competitors often show a white-background main image, one benefit infographic, one dimensions image, one package contents image, and a simple installation/use image. Some competitor images are text-heavy and repeat compatibility claims too often.";

export function MainImagesTool() {
  const [marketplace, setMarketplace] = useState<Marketplace>("DE");
  const [brand, setBrand] = useState("Vitalumix");
  const [productName, setProductName] = useState("VF3500 Filter Kit");
  const [category, setCategory] = useState("Vacuum replacement accessory");
  const [brief, setBrief] = useState(defaultBrief);
  const [keywords, setKeywords] = useState("replacement filter kit, washable foam filter, wet dry vacuum filter, VF3500 filter");
  const [competitorNotes, setCompetitorNotes] = useState(defaultCompetitor);
  const [brandStyle, setBrandStyle] = useState("Clean technical style, blue accent, restrained product-first layout.");
  const [productFiles, setProductFiles] = useState<string[]>([]);
  const [competitorFiles, setCompetitorFiles] = useState<string[]>([]);
  const [logoFiles, setLogoFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [plan, setPlan] = useState<GeneratedPlan>(() =>
    generateMainImagePlan("DE", "Vitalumix", "VF3500 Filter Kit", "Vacuum replacement accessory", defaultBrief, "replacement filter kit, washable foam filter, wet dry vacuum filter, VF3500 filter", defaultCompetitor, "Clean technical style, blue accent, restrained product-first layout.", 0, 0, 0)
  );

  const selectedImage = useMemo(
    () => plan.images.find((image) => image.index === selectedIndex) || plan.images[0],
    [plan.images, selectedIndex]
  );
  const config = marketConfig[marketplace];

  function collectFileNames(event: ChangeEvent<HTMLInputElement>, setter: (files: string[]) => void) {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    setter(files);
  }

  function handleGenerate() {
    const nextPlan = generateMainImagePlan(
      marketplace,
      brand,
      productName,
      category,
      brief,
      keywords,
      competitorNotes,
      brandStyle,
      productFiles.length,
      competitorFiles.length,
      logoFiles.length
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
            <ImagePlus size={18} />
          </span>
          主图 7 张规划器
        </div>
        <button className={styles.exportButton} onClick={() => exportPromptDocument(plan, brand, productName, marketplace)}>
          <Download size={17} />
          导出 Prompt
        </button>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            <WandSparkles size={16} />
            Amazon Main Image Sequence
          </p>
          <h1>生成一套亚马逊主图 7 张的出图方案</h1>
          <p>
            输入商品信息、关键词、品牌风格和竞对参考，先得到每张图的主题、布局、画面文案和模型 Prompt。
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
          <PanelTitle icon={<Box size={18} />} title="商品 Brief" note={config.name} />
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
            <span>类目</span>
            <input value={category} onChange={(event) => setCategory(event.target.value)} />
          </label>
          <label className={styles.fullLabel}>
            <span>产品事实</span>
            <textarea value={brief} onChange={(event) => setBrief(event.target.value)} />
          </label>

          <PanelTitle icon={<FileImage size={18} />} title="素材上传" note="前端记录文件名" />
          <div className={styles.uploadGrid}>
            <UploadBox label="产品图" files={productFiles} onChange={(event) => collectFileNames(event, setProductFiles)} />
            <UploadBox label="竞对图" files={competitorFiles} onChange={(event) => collectFileNames(event, setCompetitorFiles)} />
            <UploadBox label="Logo/品牌" files={logoFiles} onChange={(event) => collectFileNames(event, setLogoFiles)} />
          </div>

          <PanelTitle icon={<ListChecks size={18} />} title="关键词 / 标题五点上下文" note="可选" />
          <textarea className={styles.textarea} value={keywords} onChange={(event) => setKeywords(event.target.value)} />

          <PanelTitle icon={<Camera size={18} />} title="竞对图观察" note="可选" />
          <textarea className={styles.textarea} value={competitorNotes} onChange={(event) => setCompetitorNotes(event.target.value)} />

          <PanelTitle icon={<Palette size={18} />} title="品牌风格" note="可选" />
          <textarea className={styles.textareaSmall} value={brandStyle} onChange={(event) => setBrandStyle(event.target.value)} />

          <button className={styles.generateButton} onClick={handleGenerate}>
            <Sparkles size={19} />
            生成 7 张主图方案
          </button>
        </aside>

        <section className={styles.outputPanel}>
          <div className={styles.outputHeader}>
            <div>
              <p className={styles.eyebrow}>{config.name} · {config.language}</p>
              <h2>{productName} 主图方案</h2>
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
                <h3>整体视觉策略</h3>
              </div>
              <p>{plan.strategy}</p>
            </article>
            <article className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <MousePointer2 size={18} />
                <h3>竞对参考洞察</h3>
              </div>
              {plan.competitorInsights.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </article>
          </div>

          <section className={styles.board}>
            <div className={styles.imageRail}>
              {plan.images.map((image) => (
                <button
                  className={selectedIndex === image.index ? styles.selectedImageButton : styles.imageButton}
                  key={image.index}
                  onClick={() => setSelectedIndex(image.index)}
                >
                  <span>{String(image.index).padStart(2, "0")}</span>
                  <strong>{image.theme}</strong>
                  <small>{image.job}</small>
                </button>
              ))}
            </div>

            <article className={styles.detailCard}>
              <div className={styles.detailTop}>
                <div>
                  <p className={styles.eyebrow}>Image {String(selectedImage.index).padStart(2, "0")}</p>
                  <h3>{selectedImage.theme}</h3>
                </div>
                <span>{selectedImage.index === 1 ? "White Background" : "Infographic / Lifestyle"}</span>
              </div>

              <div className={styles.previewStage}>
                <div className={selectedImage.index === 1 ? styles.whitePreview : styles.infoPreview}>
                  <div className={styles.productMock}>
                    <span className={styles.filterOne} />
                    <span className={styles.filterTwo} />
                    <span className={styles.brush} />
                  </div>
                  {selectedImage.index !== 1 && <strong>{selectedImage.onImageCopy}</strong>}
                </div>
              </div>

              <div className={styles.detailGrid}>
                <InfoBlock title="布局" text={selectedImage.layout} />
                <InfoBlock title="画面文案" text={selectedImage.onImageCopy || "不放文字"} />
                <InfoBlock title="所需素材" text={selectedImage.requiredAssets.join("，")} />
                <InfoBlock title="注意事项" text={selectedImage.note} />
              </div>

              <div className={styles.promptBox}>
                <div className={styles.cardHeader}>
                  <Layers3 size={18} />
                  <h3>Image-generation Prompt</h3>
                </div>
                <p>{selectedImage.prompt}</p>
              </div>
            </article>
          </section>

          <article className={styles.resultCard}>
            <div className={styles.cardHeader}>
              <LayoutGrid size={18} />
              <h3>7 张图任务总览</h3>
            </div>
            <div className={styles.sequenceTable}>
              {plan.images.map((image) => (
                <div className={styles.sequenceRow} key={image.index}>
                  <span>{String(image.index).padStart(2, "0")}</span>
                  <strong>{image.theme}</strong>
                  <em>{image.onImageCopy || "白底主图不放文字"}</em>
                </div>
              ))}
            </div>
          </article>
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

function generateMainImagePlan(
  marketplace: Marketplace,
  brand: string,
  productName: string,
  category: string,
  brief: string,
  keywords: string,
  competitorNotes: string,
  brandStyle: string,
  productFileCount: number,
  competitorFileCount: number,
  logoFileCount: number
): GeneratedPlan {
  const config = marketConfig[marketplace];
  const cleanBrand = brand.trim() || "Brand";
  const cleanProduct = productName.trim() || "Product";
  const cleanCategory = category.trim() || "Amazon product";
  const productDetails = brief.trim() || "exact product details from uploaded product images";
  const keywordHint = keywords.trim() || cleanCategory;
  const logoNote = logoFileCount > 0 ? "Use brand logo only in non-main images with restrained placement." : "No logo uploaded; keep brand styling subtle.";

  const competitorInsights = competitorNotes.trim()
    ? [
        `已记录 ${competitorFileCount} 个竞对素材文件和文字观察，用于判断常见构图、卖点与信息密度。`,
        "竞对参考只用于提炼市场规律，不复制背景、图标、布局、颜色块或品牌表达。",
        "当前建议减少文字堆叠，让每张图只解决一个买家问题。"
      ]
    : ["未输入竞对观察；当前方案主要根据商品事实、站点风格和关键词生成。"];

  const assetBase = productFileCount > 0 ? "Uploaded product photos" : "Clear product photo needed";

  return {
    strategy: `${config.name} 方向：${config.style}。围绕 ${cleanProduct} 建立 7 张连续转化图，第一张只负责识别商品，后续依次讲卖点、结构、场景、痛点、包装/兼容和信任收尾。`,
    competitorInsights,
    brandDirection: `${cleanBrand}: ${brandStyle || "clean product-first visual language"}. ${logoNote}`,
    images: [
      {
        index: 1,
        theme: "白底主图",
        job: "2 秒识别售卖内容",
        layout: "纯白背景，产品居中偏大，展示购买包含的全部部件；轻微自然阴影，不放文字、不放 Logo、不放道具。",
        onImageCopy: "",
        requiredAssets: [assetBase, "Package contents confirmation"],
        note: "只展示实际售卖内容；避免徽章、水印、促销、道具和任何文字。",
        prompt: `${config.name} product-only Amazon main image for ${cleanProduct}, ${productDetails}, pure white background, centered large product arrangement, clean studio lighting, subtle natural shadow, show only included items, no text, no logo, no props, no watermark, no competitor brand, no extra accessories.`
      },
      {
        index: 2,
        theme: "核心卖点图",
        job: "快速说明为什么值得买",
        layout: "产品大图居中或右侧，左侧放一个大标题和 2-3 个短 callout；背景保持浅色、留白充足。",
        onImageCopy: config.copy.benefit,
        requiredAssets: [assetBase, "Keyword/title context"],
        note: "只放一个核心利益点，避免把标题五点全部塞进画面。",
        prompt: `${config.name} benefit-led infographic for ${cleanProduct}, ${cleanCategory}, ${keywordHint}, product large and sharp, light neutral background, one mobile-readable headline "${config.copy.benefit}", two concise callouts tied to product facts: ${productDetails}, clean modern Amazon listing style, no unsupported claims, no copied competitor layout, no watermark.`
      },
      {
        index: 3,
        theme: "结构/材质证明",
        job: "用可视化细节支撑卖点",
        layout: "产品局部放大，配 2-4 个指向式标注；可展示材质、层数、尺寸、颜色或关键结构。",
        onImageCopy: config.copy.proof,
        requiredAssets: [assetBase, "Close-up/detail references"],
        note: "标注必须来自产品事实；没有证明的百分比、认证、性能承诺不要写。",
        prompt: `${config.name} feature proof image for ${cleanProduct}, close-up product details, material and structure callouts, clean technical composition, headline "${config.copy.proof}", restrained arrows and labels, use facts only: ${productDetails}, no certification badges unless provided, no unrealistic claims, no competitor visuals.`
      },
      {
        index: 4,
        theme: "使用场景图",
        job: "让买家想象拥有后的使用环境",
        layout: "真实生活/清洁场景，产品清晰可见；文字少，强调日常使用和适配场景。",
        onImageCopy: config.copy.scenario,
        requiredAssets: [assetBase, "Scene direction"],
        note: "场景道具不能暗示包含在购买内；产品仍然要清晰。",
        prompt: `${config.name} lifestyle use scenario for ${cleanProduct}, practical clean home or workshop setting based on ${cleanCategory}, product visible and accurate, headline "${config.copy.scenario}", natural lighting, realistic scale, no extra included accessories implied, no copied competitor scene, no watermark.`
      },
      {
        index: 5,
        theme: "痛点解决图",
        job: "解释买家问题和产品解决方式",
        layout: "左右对比或前后关系，但不用夸张 before/after；突出更换、维护、清洁、适配等实际问题。",
        onImageCopy: config.copy.problem,
        requiredAssets: [assetBase, "Buyer pain point"],
        note: "避免夸大效果；不写 guaranteed、best、官方等风险表达。",
        prompt: `${config.name} problem-solution Amazon image for ${cleanProduct}, show buyer pain point and clean replacement solution in a factual way, headline "${config.copy.problem}", product remains central, simple visual hierarchy, short callouts from facts: ${productDetails}, no exaggerated before-after, no guarantees, no competitor brand, no watermark.`
      },
      {
        index: 6,
        theme: "包装/兼容/内容物",
        job: "回答买家购买前的事实问题",
        layout: "平铺展示包装内容、数量、兼容型号或尺寸；信息清晰，适合移动端阅读。",
        onImageCopy: config.copy.bundle,
        requiredAssets: [assetBase, "Model/compatibility facts", "Package contents"],
        note: "兼容表达要准确；未确认的型号不要写进画面。",
        prompt: `${config.name} package contents and compatibility detail image for ${cleanProduct}, neatly arranged included items, quantity and fit information, headline "${config.copy.bundle}", mobile-readable labels, product facts: ${productDetails}, compatibility context from keywords: ${keywordHint}, no unconfirmed models, no competitor brand, no clutter.`
      },
      {
        index: 7,
        theme: "信任收尾图",
        job: "给买家最后的使用信心",
        layout: "产品 + 简洁维护步骤或品牌风格收尾；可展示冲洗、晾干、复用等真实流程。",
        onImageCopy: config.copy.trust,
        requiredAssets: [assetBase, logoFileCount > 0 ? "Logo" : "Brand color/style"],
        note: "不写保修、认证、终身承诺，除非后续提供证明材料。",
        prompt: `${config.name} trust closer image for ${cleanProduct}, clean product-first composition, simple care or reuse steps, headline "${config.copy.trust}", ${logoNote}, factual and calm brand tone, based on facts: ${productDetails}, no warranty claims, no certification claims without proof, no copied competitor layout, no watermark.`
      }
    ]
  };
}

function exportPromptDocument(plan: GeneratedPlan, brand: string, productName: string, marketplace: Marketplace) {
  const lines = [
    `# Amazon 主图 7 张方案`,
    ``,
    `Brand: ${brand || "未填写"}`,
    `Product: ${productName || "未填写"}`,
    `Marketplace: ${marketConfig[marketplace].name}`,
    ``,
    `## Overall Visual Strategy`,
    plan.strategy,
    ``,
    `## Competitor Insights`,
    ...plan.competitorInsights.map((item) => `- ${item}`),
    ``,
    `## Brand Direction`,
    plan.brandDirection,
    ``,
    ...plan.images.flatMap((image) => [
      `## Image ${String(image.index).padStart(2, "0")} - ${image.theme}`,
      `Job: ${image.job}`,
      `Layout: ${image.layout}`,
      `On-image copy: ${image.onImageCopy || "不放文字"}`,
      `Required assets: ${image.requiredAssets.join(", ")}`,
      `Notes: ${image.note}`,
      `Prompt: ${image.prompt}`,
      ``
    ])
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(productName || "main-images")}-prompts.md`;
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
    .slice(0, 80) || "main-images";
}

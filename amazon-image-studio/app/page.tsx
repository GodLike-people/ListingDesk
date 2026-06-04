"use client";

import Link from "next/link";
import styles from "./home.module.css";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  DollarSign,
  Download,
  FileImage,
  Globe2,
  ImagePlus,
  Languages,
  Layers3,
  MessageSquareText,
  MousePointer2,
  PenLine,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";

const samples = ["滤芯套装", "厨房小家电", "宠物工具"];

const painPoints = [
  {
    icon: DollarSign,
    title: "少花冤枉设计费",
    text: "把主图、A+、卖点布局放进同一个流程里，先用 AI 快速出方向，再让设计师或运营做最后判断。",
    imageClass: "sample-cost"
  },
  {
    icon: Languages,
    title: "多站点文案一起规划",
    text: "围绕 Amazon US、DE、UK 等站点组织语言和视觉重点，避免不同市场反复重写。",
    imageClass: "sample-language"
  },
  {
    icon: Layers3,
    title: "主图与 A+ 不再割裂",
    text: "先确定 7 张主图的转化任务，再延展到 A+ 连续页面，让整套素材讲同一个产品故事。",
    imageClass: "sample-system"
  }
];

const steps = [
  {
    kicker: "第一步",
    title: "上传商品图并填写 Brief",
    text: "放入产品图、Logo、竞品参考和基础参数，系统先整理商品身份、站点语言和视觉方向。",
    icon: Upload
  },
  {
    kicker: "第二步",
    title: "生成主图与 A+ 方案",
    text: "自动拆出白底主图、卖点图、结构图、场景图，以及 PC / Mobile A+ 模块提示词。",
    icon: WandSparkles
  },
  {
    kicker: "第三步",
    title: "选择模型、编辑并导出",
    text: "按图片选择 OpenAI、Gemini 或 Imagen，保留版本，最终导出主图、A+ 和 Prompt 文档。",
    icon: Download
  }
];

const gallery = [
  { title: "Image 01", label: "白底主图", className: "gallery-white" },
  { title: "Image 02", label: "核心卖点", className: "gallery-blue" },
  { title: "A+ 01", label: "品牌 Hero", className: "gallery-green" },
  { title: "A+ 03", label: "结构拆解", className: "gallery-amber" }
];

const stats = [
  { value: "7", label: "主图任务位" },
  { value: "5-7", label: "A+ 模块" },
  { value: "3", label: "生图模型入口" },
  { value: "1", label: "套图导出流程" }
];

export default function Home() {
  return (
    <main className={c("site-shell")}>
      <header className={c("nav")}>
        <a className={c("logo")} href="#">
          <span>
            <Sparkles size={20} />
          </span>
          ListingDesk Studio
        </a>
        <nav className={c("nav-links")} aria-label="Primary">
          <a href="#tools">工具</a>
          <Link href="/main-images">主图</Link>
          <Link href="/aplus-content">A+</Link>
          <Link href="/listing-copy">标题五点</Link>
          <a href="#workflow">流程</a>
          <a href="#examples">示例</a>
        </nav>
        <div className={c("nav-actions")}>
          <button className={c("language-button")}>
            <Globe2 size={16} />
            简体中文
            <ChevronDown size={16} />
          </button>
          <button className={c("secondary-button")}>登录</button>
          <Link className={c("primary-button")} href="/listing-copy">
            开始创作
            <ArrowRight size={17} />
          </Link>
        </div>
      </header>

      <section className={c("hero")}>
        <div className={c("hero-copy")}>
          <div className={c("tool-pill")}>
            <WandSparkles size={16} />
            Amazon 主图 + A+ 内容生成器
          </div>
          <h1>用 AI 快速搭建高转化的亚马逊主图和 A+ 页面</h1>
          <p>
            面向运营团队的一站式出图入口：上传商品图，填写 Brief，选择模型，生成主图方案、A+
            模块和可编辑 Prompt。
          </p>
          <div className={c("hero-actions")}>
            <Link className={c("hero-button")} href="/listing-copy">
              <Sparkles size={18} />
              生成标题五点
            </Link>
            <Link className={c("outline-button")} href="/main-images">
              主图 7 张规划
              <ArrowRight size={17} />
            </Link>
            <Link className={c("outline-button")} href="/aplus-content">
              A+ 模块规划
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className={c("trust-row")}>
            <span>
              <BadgeCheck size={16} />
              支持 OpenAI / Gemini / Imagen
            </span>
            <span>
              <Clock3 size={16} />
              先做前端体验
            </span>
          </div>
        </div>

        <div className={c("hero-tool")} aria-label="Upload mockup">
          <div className={c("preview-card")}>
            <div className={c("preview-top")}>
              <span>A+ Generator</span>
              <strong>VF3500 Filter Kit</strong>
            </div>
            <div className={c("product-stage")}>
              <span className={c("filter-card", "filter-left")} />
              <span className={c("filter-card", "filter-right")} />
              <span className={c("brush-stick")} />
              <span className={c("callout", "callout-one")}>White main image</span>
              <span className={c("callout", "callout-two")}>A+ desktop & mobile</span>
            </div>
          </div>

          <div className={c("upload-card")}>
            <div className={c("upload-icon")}>
              <Upload size={28} />
            </div>
            <h2>选择图片</h2>
            <p>或将商品图、Logo、竞品参考拖放到这里</p>
            <button className={c("upload-button")}>
              <FileImage size={18} />
              上传素材
            </button>
          </div>

          <div className={c("sample-strip")}>
            <p>暂时没有图片？试试这些示例</p>
            <div>
              {samples.map((sample) => (
                <button key={sample}>{sample}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={c("section")} id="tools">
        <div className={c("section-heading", "centered")}>
          <p>为什么要做这个工具</p>
          <h2>消除亚马逊 Listing 出图的三大瓶颈</h2>
          <span>把原本分散在设计、运营、翻译和模型提示词里的工作，收进一个清晰的页面。</span>
        </div>
        <div className={c("pain-grid")}>
          {painPoints.map((item) => {
            const Icon = item.icon;
            return (
              <article className={c("pain-card")} key={item.title}>
                <div className={c("pain-visual", item.imageClass)}>
                  <div className={c("mini-browser")}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className={c("mini-product")} />
                </div>
                <div className={c("pain-icon")}>
                  <Icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link className={c("text-button")} href="/listing-copy">
                  免费体验
                  <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className={c("section", "process-section")} id="workflow">
        <div className={c("section-heading", "centered")}>
          <p>工作流程</p>
          <h2>3 步创建主图和 A+ 内容草稿</h2>
        </div>
        <div className={c("step-grid")}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className={c("step-card")} key={step.title}>
                <div className={c("step-count")}>{String(index + 1).padStart(2, "0")}</div>
                <div className={c("step-shot")}>
                  <Icon size={34} />
                </div>
                <p>{step.kicker}</p>
                <h3>{step.title}</h3>
                <span>{step.text}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className={c("showcase")} id="examples">
        <div className={c("showcase-copy")}>
          <p className={c("section-label")}>生成结果预览</p>
          <h2>从一张商品图延展成完整 Listing 视觉系统</h2>
          <span>
            页面视觉参考 Pic Copilot 的上传式工具入口，但内容针对 ListingDesk 的内部主图和 A+ 工作流重新组织。
          </span>
          <div className={c("feature-list")}>
            <span>
              <ImagePlus size={18} />
              主图 7 张任务拆解
            </span>
            <span>
              <Layers3 size={18} />
              A+ PC / Mobile 双尺寸
            </span>
            <span>
              <MessageSquareText size={18} />
              Prompt 可编辑
            </span>
            <span>
              <MousePointer2 size={18} />
              版本选择与最终版标记
            </span>
          </div>
        </div>
        <div className={c("gallery-grid")}>
          {gallery.map((item) => (
            <article className={c("gallery-card", item.className)} key={item.title}>
              <div className={c("gallery-product")} />
              <strong>{item.title}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={c("section", "stats-section")}>
        <div className={c("stats-copy")}>
          <p className={c("section-label")}>ListingDesk AI</p>
          <h2>为内部运营节省重复沟通和试错时间</h2>
          <Link className={c("primary-button")} href="/listing-copy">
            开始免费创建
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className={c("stats-grid")}>
          {stats.map((stat) => (
            <div className={c("stat-card")} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className={c("footer")}>
        <div>
          <a className={c("logo", "footer-logo")} href="#">
            <span>
              <Sparkles size={20} />
            </span>
            ListingDesk Studio
          </a>
          <p>让亚马逊 Listing 出图流程更简单、高效、可控。</p>
        </div>
        <div className={c("footer-links")}>
          <a href="#tools">工具</a>
          <a href="#workflow">流程</a>
          <a href="#examples">示例</a>
        </div>
        <button className={c("footer-button")}>
          <PenLine size={17} />
          记录需求
        </button>
      </footer>
    </main>
  );
}

function c(...names: string[]) {
  return names.map((name) => styles[name] || name).join(" ");
}

"use client";

import {
  Archive,
  Box,
  ChevronDown,
  Download,
  FileImage,
  ImagePlus,
  Layers3,
  LayoutGrid,
  ListChecks,
  PanelRight,
  Play,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Sparkles,
  Upload
} from "lucide-react";

const projects = [
  { name: "VF3500 Filter Kit", market: "Amazon US", status: "主图规划", active: true },
  { name: "Vitalumix Brush Roll", market: "Amazon DE", status: "A+ 草稿", active: false },
  { name: "Pet Grooming Set", market: "Amazon UK", status: "素材整理", active: false }
];

const mainImages = [
  { index: "01", title: "白底主图", type: "Main", tone: "Product only", status: "Ready" },
  { index: "02", title: "核心卖点", type: "Infographic", tone: "Benefit", status: "Draft" },
  { index: "03", title: "结构细节", type: "Proof", tone: "Technical", status: "Draft" },
  { index: "04", title: "使用场景", type: "Lifestyle", tone: "Clean home", status: "Draft" },
  { index: "05", title: "痛点解决", type: "Problem", tone: "Before/After", status: "Draft" },
  { index: "06", title: "包装兼容", type: "Details", tone: "Fit guide", status: "Draft" },
  { index: "07", title: "品牌收尾", type: "Trust", tone: "Care", status: "Draft" }
];

const modules = [
  { title: "Hero Promise", size: "1464 x 600 / 600 x 450", copy: "Clean replacement, confident fit" },
  { title: "Feature Deep Dive", size: "1464 x 600 / 600 x 450", copy: "Structure, material, airflow path" },
  { title: "Use Scenario", size: "1464 x 600 / 600 x 450", copy: "Daily cleanup and quick replacement" },
  { title: "Package Detail", size: "1464 x 600 / 600 x 450", copy: "What buyers receive" },
  { title: "Brand Closer", size: "1464 x 600 / 600 x 450", copy: "Consistent care rhythm" }
];

const assets = [
  { label: "Product Photo", meta: "4 files", color: "asset-blue" },
  { label: "Logo", meta: "1 file", color: "asset-teal" },
  { label: "Competitors", meta: "8 files", color: "asset-amber" },
  { label: "Brand Style", meta: "3 files", color: "asset-rose" }
];

const versions = ["v03 selected", "v02", "v01"];

export default function Home() {
  return (
    <main className="studio-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>
          <div>
            <h1>Amazon Image Studio</h1>
            <p>ListingDesk internal</p>
          </div>
        </div>

        <button className="primary-action">
          <Plus size={18} />
          新建项目
        </button>

        <label className="search-box">
          <Search size={17} />
          <input placeholder="搜索 SKU / 品牌" />
        </label>

        <nav className="project-list" aria-label="Projects">
          {projects.map((project) => (
            <button className={project.active ? "project-item active" : "project-item"} key={project.name}>
              <span className="project-name">{project.name}</span>
              <span className="project-meta">
                {project.market} · {project.status}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button>
            <Settings size={17} />
            模型配置
          </button>
          <button>
            <Archive size={17} />
            导出记录
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Amazon US · Replacement Filter Kit</p>
            <h2>VF3500 Filter Kit</h2>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">
              <Upload size={17} />
              上传素材
            </button>
            <button className="dark-button">
              <Download size={17} />
              导出套图
            </button>
          </div>
        </header>

        <div className="content-grid">
          <section className="brief-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Brief</p>
                <h3>商品信息</h3>
              </div>
              <button className="icon-button" aria-label="Collapse brief">
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="brief-fields">
              <Field label="Marketplace" value="Amazon US" />
              <Field label="Language" value="English" />
              <Field label="Category" value="Vacuum accessory" />
              <Field label="Package" value="2 filters + 1 brush" />
              <Field label="Color" value="Blue / Black" />
              <Field label="Material" value="Washable foam, pleated filter" />
            </div>

            <div className="asset-strip">
              {assets.map((asset) => (
                <button className="asset-tile" key={asset.label}>
                  <span className={`asset-thumb ${asset.color}`}>
                    <FileImage size={19} />
                  </span>
                  <span>
                    <strong>{asset.label}</strong>
                    <small>{asset.meta}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="main-panel">
            <div className="tabs">
              <button className="tab active">
                <LayoutGrid size={17} />
                主图 7 张
              </button>
              <button className="tab">
                <Layers3 size={17} />
                A+ 模块
              </button>
              <button className="tab">
                <ListChecks size={17} />
                Prompt 文档
              </button>
            </div>

            <div className="canvas-row">
              <div className="preview-stage">
                <div className="mock-image">
                  <div className="product-visual">
                    <span className="filter-shape one" />
                    <span className="filter-shape two" />
                    <span className="brush-shape" />
                  </div>
                  <div className="image-label">Image 01 · White Background Main Image</div>
                </div>
              </div>

              <div className="generation-panel">
                <div className="section-heading compact">
                  <div>
                    <p className="eyebrow">Generate</p>
                    <h3>模型设置</h3>
                  </div>
                  <button className="icon-button" aria-label="More settings">
                    <PanelRight size={18} />
                  </button>
                </div>

                <div className="segmented">
                  <button className="active">OpenAI</button>
                  <button>Gemini</button>
                  <button>Imagen</button>
                </div>

                <label className="select-row">
                  <span>模型</span>
                  <select>
                    <option>Quality default</option>
                    <option>Fast draft</option>
                    <option>High detail</option>
                  </select>
                </label>

                <label className="prompt-box">
                  <span>当前 Prompt</span>
                  <textarea
                    value={
                      "Pure white background Amazon main image, product-only composition, exact replacement filter kit, clean studio lighting, no props, no text, no watermark."
                    }
                    readOnly
                  />
                </label>

                <div className="button-pair">
                  <button className="dark-button stretch">
                    <Play size={17} />
                    生成
                  </button>
                  <button className="ghost-button square" aria-label="Regenerate">
                    <RefreshCcw size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="task-grid">
              {mainImages.map((image) => (
                <button className={image.index === "01" ? "task-card selected" : "task-card"} key={image.index}>
                  <span className="task-index">{image.index}</span>
                  <span className="task-copy">
                    <strong>{image.title}</strong>
                    <small>
                      {image.type} · {image.tone}
                    </small>
                  </span>
                  <span className={image.status === "Ready" ? "status ready" : "status"}>{image.status}</span>
                </button>
              ))}
            </div>

            <section className="aplus-band">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">A+ Content</p>
                  <h3>PC / Mobile 模块</h3>
                </div>
                <button className="ghost-button">
                  <ImagePlus size={17} />
                  生成模块
                </button>
              </div>

              <div className="module-list">
                {modules.map((module, index) => (
                  <button className="module-row" key={module.title}>
                    <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <strong>{module.title}</strong>
                      <small>{module.copy}</small>
                    </span>
                    <em>{module.size}</em>
                  </button>
                ))}
              </div>
            </section>
          </section>

          <aside className="right-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Versions</p>
                <h3>生成版本</h3>
              </div>
              <Box size={18} />
            </div>
            <div className="version-list">
              {versions.map((version) => (
                <button className={version.includes("selected") ? "version active" : "version"} key={version}>
                  <span>{version}</span>
                  <small>1024 x 1024</small>
                </button>
              ))}
            </div>

            <div className="final-box">
              <p className="eyebrow">Final Asset</p>
              <h3>Image 01</h3>
              <p>白底主图 · OpenAI · Quality default</p>
              <button className="primary-action">设为最终版</button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

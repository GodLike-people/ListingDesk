# Flomo2Obsidian

把 flomo 的官方 HTML/ZIP 导出同步到 Obsidian vault。工具会按日期归档，每条 memo 生成一个 Markdown 文件，并通过本地状态文件实现去重和增量更新。

## 快速开始

1. 双击 `安装依赖.bat`。
2. 双击 `同步Flomo到Obsidian.bat`。
3. 首次运行时按提示输入 Obsidian vault 路径。
4. 浏览器打开后登录 flomo，程序会尝试触发官方导出并等待 ZIP 下载。

如果自动导出失败，把你从 flomo 手动下载的 ZIP 放到 `imports` 文件夹里，再双击 `同步Flomo到Obsidian.bat`。

## 网页控制台

更简单的方式是使用网页控制台：

1. 双击 `运行网页控制台.bat`。
2. 浏览器打开 `http://127.0.0.1:8765`。
3. 在页面里填写 Obsidian 笔记库路径。
4. 点 `自动打开 flomo 并同步`，或把 ZIP 放到 `imports` 后点 `同步本地 ZIP`。

自动同步会先打开 `https://v.flomoapp.com/login`。首次登录完成后，工具会再进入 `https://v.flomoapp.com/mine?source=export` 寻找导出按钮。

在 VSCode 里也可以运行：

1. 用 VSCode 打开这个项目文件夹。
2. 按 `Ctrl+Shift+P`。
3. 输入 `Tasks: Run Task`。
4. 选择 `启动网页控制台`。
5. 打开 `http://127.0.0.1:8765`。

## 输出结构

默认输出到 Obsidian vault 中：

```text
Flomo/
  2026/
    06/
      2026-06-08_103000_memo-title_ab12cd34ef56.md
  _attachments/
    2026/
      06/
        ab12cd34ef56_01_image.png
```

Markdown frontmatter 会包含：

```yaml
flomo_id: ...
created: ...
updated: ...
tags: [...]
source: ...
content_hash: ...
```

## 配置

首次运行会生成 `config.yaml`。常用配置：

```yaml
vault_path: D:\Your\Obsidian\Vault
notes_root: Flomo
attachment_root: Flomo/_attachments
import_dir: imports
download_dir: downloads
flomo_login_url: https://v.flomoapp.com/login
flomo_export_url: https://v.flomoapp.com/mine?source=export
export_timeout_seconds: 300
```

本工具不会保存 flomo 密码。浏览器登录状态保存在 `.browser-profile`。

## 命令行

```powershell
python -m flomo_obsidian configure
python -m flomo_obsidian sync --auto-download
python -m flomo_obsidian sync --zip imports\flomo.zip
python -m flomo_obsidian sync --no-auto-download
```

## 说明

flomo 官方公开 API 主要用于写入 memo，不提供稳定的公开增量读取接口。这个工具采用官方导出的 ZIP/HTML 作为数据源，因此下载阶段可能仍是完整导出；写入 Obsidian 阶段会严格去重，已同步且未变化的 memo 不会重复写入。

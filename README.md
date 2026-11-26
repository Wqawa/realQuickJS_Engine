# RealQuickJS Engine — 网站改版

极简黑白排版风格的单页站点，替换原来的深色霓虹模板。纯静态，无构建步骤。

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 全部结构与文案，语义化标签 + 无障碍属性 |
| `style.css` | 样式；配色集中在顶部 `:root` / `html[data-theme="dark"]` |
| `app.js` | 主题切换、滚动进度、入场动画、导航高亮、复制按钮、Releases 拉取、引擎切换演示、处刑区遮罩、档案手风琴 |
| `assets/contributors/` | 参与区三张头像 + Maopou 的 Programmer 名片 |
| `assets/people/` | 处刑区两张原图（默认被黑块遮住） |
| `assets/issues/` | 档案区 19 条 issue 正文里的图片 |
| `assets/bili/` | B 站动态（opus）正文里的图片 |
| `_dev/` | 本次改版用过的临时工具与产物（抓取/渲染/截图/审计脚本、Chrome 调试 profile、B 站头像原件），不参与发布；`_dev/.gitignore` 已让它整体不进仓库 |

## 页面结构

hero → 01 特性 → 02 三引擎 → 03 兼容细节 → 04 下载 → 05 文档 → **06 上游** → **07 参与** → **08 公开处刑** → **09 档案**

后四块是第二轮加的内容：

- **上游（#upstream）**：四张卡说明本仓站在谁的肩膀上（Psych Engine 上游 / NovaFlare Engine 思路参考 / quickjs-ng 运行时 / 被替代的 PE-QuickJs-Engine），加一份完整仓库目录树、三格 LICENSE 说明。目录树里的每行都带中文注解，直接当「仓库导览」看。
- **参与（#community）**：DeepSeek / WQ / Maopou 三位带方框头像（默认灰度，悬停回彩），第四格是 Issues 入口，下面接 Maopou 的名片。
- **公开处刑（#pillory）**：两个人的头像各自压在一块纯黑遮罩下，遮罩上只有 UID 和「点击 / 悬停揭示」。鼠标悬停、键盘 Tab 聚焦、点击都能揭开；点击是锁定式开关。目的是「不点就看不见」，而不是打码。
- **档案（#archive）**：B 站动态原文 + 19 条 GitHub issue 原文，折叠列表，一次只展开一条（长报告不会把页面撑爆）。

## 原文搬运的规矩

档案区是**搬运**，不是转述：

- issue 正文由 `marked` 从 GitHub API 拿到的 markdown 原样渲染，标题、正文、代码块、表格、GFM alert 都不改一个字；只做排版层适配（`.issue-body` 里的一整套 markdown 样式）。
- 图片路径从 `images/xxx` 换成本地 `assets/issues/xxx`，除此之外不动。
- 文件名里带 `%` 的两张（`LICENSE%20FILES-0-critical.png`、`HYPOCRISY-100%25-critical.png`）在磁盘上是字面量文件名，所以 HTML 里写成 `%2520` / `%2525`，浏览器请求时才是正确的一次性解码。
- B 站那段按原帖顺序保留文字段、图片、时间戳（`00:06` 之类），不重排语义。
- issue 里三个 shields.io 徽章（`STATUS-UNFIXED-critical`、`LICENSE%20FILES-0-critical`、`HYPOCRISY-100%25-critical`）从上游拿到的其实是 SVG 源码却被存成了 `.png`，浏览器按位图解码会失败。这里按 SVG 原生尺寸（1x，不放大）离屏渲染回同名 PNG，路径与分辨率都不动。

## 本地预览

直接双击 `index.html` 即可（下载区需要联网读 GitHub Releases）。或者：

```bash
python -m http.server 8000
# 打开 http://localhost:8000
```

## 设计要点

- **黑白双主题**：顶栏右上角 `INVERT` 按钮切换纸白 / 墨黑，选择存 localStorage；首次访问跟随系统 `prefers-color-scheme`。
- **字体**：无衬线大字标题（Helvetica 系），等宽字体承担所有标签/元信息，引文用宋体衬线做对比。
- **网格**：hero 区 1px 竖线分区，正文全部靠 1px 分隔线组织，无圆角、无阴影、无渐变。
- **首屏交互**：hero 右侧的 `engine.txt` 面板可点击切换，会同步高亮「三引擎」表格中对应的行 —— 用页面本身解释「一个 exe 三套引擎」。
- **下载区**：自动读 `Wqawa/FNF-PE_RealQuickJs_Engine` 的 Releases，为空时回退到 `Wqawa/realQuickJS_Engine`，两者都空则显示空状态文案。
- **明暗反转不是换色**：`.section-invert` 是把 `--fg` 当背景、`--bg` 当文字，所以反转主题时整块跟着翻，不需要第二套规则。这一块里的局部元素要注意用 `var(--bg)` 当文字色。

## 改文案

- 所有中文文案都在 `index.html` 里，按区块顺序排好（hero → 特性 → 三引擎 → 兼容细节 → 下载 → 文档 → 上游 → 参与 → 处刑 → 档案）。
- 换主色：把 `:root` 的 `--ink` / `--paper` 改成别的深浅两色即可，整套视觉仍是单色。
- 换仓库：改 `app.js` 顶部 `REPOS` 数组。
- 换处刑对象：改 `#pillory` 里的 `<button class="exhibit-frame">`（换 `img src` 与 `figcaption` 里的 UID / 链接），删掉一个 `figure` 即可减员。

## 响应式

- ≥1080px：完整导航（9 项），双栏 hero、五列引擎表。
- 900–1080px：导航缩小字号与间距。
- 720–900px：隐藏品牌文字，只留 RQ 方块标。
- ≤720px：导航折到第二行、可横向滚动；GitHub 按钮隐藏；引擎表转为带「源码/资产/MOD」前缀的纵向卡片；特性行、上游卡、处刑区、名片全部单列；档案条目标题折成四行堆叠。

## 发布

推到 `Wqawa/realQuickJS_Engine` 的 `main` 分支，GitHub Pages 自动更新（`.nojekyll` 已存在）。

发布前可以把 `_dev/` 整个删掉，不影响站点。留着的话也不会被推上去：`_dev/.gitignore` 里写着 `*` / `!.gitignore`，除它自己以外全部忽略，所以 Pages 上看不到这些文件。

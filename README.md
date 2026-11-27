# RealQuickJS Engine — 网站改版

极简黑白排版风格的单页站点，替换原来的深色霓虹模板。纯静态，无构建步骤。

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 全部结构与文案，语义化标签 + 无障碍属性 |
| `style.css` | 样式；配色集中在顶部 `:root` / `html[data-theme="dark"]` |
| `app.js` | 主题切换、滚动进度、入场动画、导航高亮、复制按钮、Releases 拉取、引擎切换演示、处刑区遮罩与左右抽屉（含拖动改宽）、分层档案夹、预览窗（开/关/最小化/还原/最大化都有补间）、档案手风琴 |
| `assets/contributors/` | 参与区三张头像 + Maopou 的 Programmer 名片 |
| `assets/people/` | 处刑区两张原图（默认被黑块遮住） |
| `assets/issues/` | 档案区 19 条 issue 正文里的图片 |
| `assets/bili/` | B 站动态（opus）正文里的图片 |
| `assets/evidence/` | 脱敏证据原图与 GitHub 记录，按 `guxue/` `dingling/` `build/` 三个目录分好 |
| `evidence-data.js` | 证据清单（由 `build_evidence.js` 自动生成），预览窗按它取标题、尺寸、日期 |
| `_dev/` | 本次改版用过的临时工具与产物（抓取/渲染/截图/审计脚本、Chrome 调试 profile、B 站头像原件），不参与发布；`_dev/.gitignore` 已让它整体不进仓库 |

## 页面结构

hero → 01 特性 → 02 三引擎 → 03 兼容细节 → 04 下载 → 05 文档 → **06 上游** → **07 参与** → **08 公开处刑** → **09 游戏本体** → **10 档案**

下面几块是第二轮之后陆续加的：

- **上游（#upstream）**：四张卡说明本仓站在谁的肩膀上（Psych Engine 上游 / NovaFlare Engine 思路参考 / quickjs-ng 运行时 / 被替代的 PE-QuickJs-Engine），加一份完整仓库目录树、三格 LICENSE 说明。目录树里的每行都带中文注解，直接当「仓库导览」看。
- **参与（#community）**：DeepSeek / WQ / Maopou 三位带方框头像（默认灰度，悬停回彩），第四格是 Issues 入口，下面接 Maopou 的名片。
- **公开处刑（#pillory）**：两个人的头像各自压在一块纯黑遮罩下，遮罩上只有 UID 和「点击 / 悬停揭示」。鼠标悬停、键盘 Tab 聚焦、点击都能揭开；点击是锁定式开关。目的是「不点就看不见」，而不是打码。
- **抽屉 + 档案夹（处刑区第二层）**：黑布已经揭开时**再点一次同一个头像**，从页面左右两侧各拉出一只抽屉，中间仍看得见被压暗的网页本身。
  - 左抽屉（黑底）：`SUSPECT 01/02`、头像、名字、UID、GitHub / Bilibili / QQ 联系方式，以及一段「人物说明」（`Description`）。故雪没有 GitHub 账号，那里写「无账号」；丁铃的账号是 `rongtang2026`，两人的 QQ 号也都填了真号。
  - 右抽屉（跟随主题）：一摞分层档案夹。每层右上角贴着一张斜着的便签，点层标题展开一层，里面再套一层小文件夹，点小标题展开，最里层是「Windows 资源管理器」式的文件网格 —— 每张证据都是一张带缩略图、文件名、像素尺寸的卡片。
  - 收回：左抽屉底部「收回抽屉」按钮、点中间那层网页、按 Esc，三条路都行。收回时黑布一起盖回去、焦点还给原头像按钮，同时只开一组、开着时锁页面滚动。
  - 调宽：右抽屉左侧有一根把柄（`role="separator"`）。左右拖动改宽度，区间是 320px 到「整屏减左抽屉」；拖到最左就是整屏（`.is-wide`），再往右拖回来即可。键盘聚焦把柄后 ←/→ 按 40px 步进（Shift 时 120px），Home 全屏、End 收窄。
  - 左栏刻意固定成黑底（像一页卷宗封面），右栏则**跟随主题**：亮色下是纸白，切到墨黑主题时整块档案夹连便签、分隔线、卡片边框一起翻黑，靠 `color-mix(in srgb, var(--fg) N%, transparent)` 派生所有灰阶，不写死颜色。
  - 档案夹里的每层标题只写归属（`QQ`、`GitHub`、`Bilibili · 3 号楼`），不带 `· D 文件夹` 之类的目录后缀。
- **游戏本体（#build）**：引擎自身的问题记录，5 张 QJSE 截图，同样是资源管理器式网格，单独开一节，不参与处刑。
- **档案（#archive）**：B 站动态原文 + 19 条 GitHub issue 原文，折叠列表，一次只展开一条（长报告不会把页面撑爆）。

## 证据文件与预览窗口

脱敏素材按归属分进三个目录，共 75 个文件：

- **故雪**（`assets/evidence/guxue/`，23 个）：QQ 端 G 目录 8 个、B 站 1G / 2G / 5G / 6G / 13G 楼层 9 个、B 站根目录散图 6 个。
- **铃铃铃丁铃铛铛铛铛**（`assets/evidence/dingling/`，47 个）：GitHub 全部 10 个（6 图 + 4 个 txt：`Thanks` / `happy` / `issues` / `r-1.2 Estimated update`）、QQ 端 D 目录 16 个、B 站 3/4/6/7/8/9/10/11/12 楼层 15 个、他人评价 6 个。
- **游戏本体**（`assets/evidence/build/`，5 个）：QJSE-01…05。

界面是 Windows 资源管理器式的：地址栏（`此电脑 › 证据 › 某人 › 某楼`）、文件计数、文件网格。点卡片弹出**独立预览窗**，不是页内灯箱：

- 右上角三颗键：最小化（`—`，收进右下角任务栏）、最大化（`□`）、关闭（`×`）。
- 可以同时开多个窗口，点哪个哪个到最前，任务栏上的条目也同步高亮。
- 图片默认适应窗口；点一下图体切到 1:1 原始像素（超出就滚动），再点回适应。
- 文本证据（.txt）以等宽字体只读展示，状态栏显示字节数和日期。
- 窗口可拖动标题栏移动，右下角可拖拽改大小；Esc 关最上面那个窗（有窗时不会连带关掉抽屉）。

B 站楼层按截图时间先后排好，每个数字文件夹是一位评论楼主及其回复。「他人评价」这一类归在丁铃名下（共 6 张）。

窗口的动效都走同一套缓动：弹出时从下方 14px 轻轻抬起并放大到 100%，关闭时缩回 96.6% 再淡出，最小化朝右下角任务栏收拢（`translate(16%, 22%) scale(.62)`），还原时从同一处展开；最大化 / 改尺寸也是补间而不是瞬跳。拖动标题栏时会临时关掉 transition，避免拖影。系统开了「减少动态效果」时全部退化为无动画。

## 原文搬运的规矩

档案区是**搬运**，不是转述：

- issue 正文取自 `engine/docs/ISSUE_ARCHIVE.md` 的快照，由 `marked` 渲染，标题、正文、代码块、表格、GFM alert 都不改一个字；只做排版层适配（`.issue-body` 里的一整套 markdown 样式）。原仓库的 issue 已删除，这份快照是抓取时留下的完整版。
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

- 所有中文文案都在 `index.html` 里，按区块顺序排好（hero → 特性 → 三引擎 → 兼容细节 → 下载 → 文档 → 上游 → 参与 → 处刑 → 游戏本体 → 档案）。
- 换主色：把 `:root` 的 `--ink` / `--paper` 改成别的深浅两色即可，整套视觉仍是单色。
- 换仓库：改 `app.js` 顶部 `REPOS` 数组。
- 换处刑对象：改 `#pillory` 里的 `<button class="exhibit-frame">`（换 `img src` 与 `figcaption` 里的 UID / 链接），删掉一个 `figure` 即可减员。
- 补抽屉内容：`#scene-<id>` 里左抽屉是 `.drawer-contact`（GitHub / Bilibili / QQ 三行，没有账号的写 `class="is-todo"` 的纯文字）与 `.drawer-desc`（人物说明）；右抽屉是 `.folder-stack`。新增一个人要同时加 `figure.exhibit` 和对应的 `.drawer-scene`，并保证 `aria-controls` 与 `.drawer-scene` 的 `id` 对齐。
- 加证据：把文件按归属丢进 `assets/evidence/{guxue,dingling,build}/<分类目录>/`，然后跑
  ```bash
  node _dev/tools_md/build_evidence.js   # 扫描目录、生成 assets/evidence/evidence-data.js
  node _dev/tools_md/gen_evidence_ui.js  # 重新生成抽屉里的文件网格与 #build 一节
  node _dev/tools_md/splice_evidence.js  # 把新 HTML 拼回 index.html
  ```
  三个脚本的分工：`build_evidence.js` 负责扫盘 + 读图片尺寸 + 套归属规则；`gen_evidence_ui.js` 负责把清单渲染成 `.folder / .subfolder / .file-card` 结构；`splice_evidence.js` 负责替换 `index.html` 里 `#scene-guxue` / `#scene-dingling` 两个抽屉的内容与 `#build` 的文件网格。

## 响应式

- ≥1080px：完整导航（10 项），双栏 hero、五列引擎表、文件网格四列。
- 900–1080px：导航缩小字号与间距。
- 720–900px：隐藏品牌文字，只留 RQ 方块标。
- ≤720px：导航折到第二行、可横向滚动；GitHub 按钮隐藏；引擎表转为带「源码/资产/MOD」前缀的纵向卡片；特性行、上游卡、处刑区、名片全部单列；档案条目标题折成四行堆叠；长 SHA-256 之类的行内 `code` 用 `overflow-wrap: anywhere` 断行，不会顶出横向滚动条；抽屉改成上下两半 —— 左抽屉占上半屏（头像改成 96px 的方图靠左浮动，省出高度），右抽屉从下方顶上来占下半屏，两边各自滚动；把柄在手机上隐藏，宽度固定为整宽。文件网格收成两列；预览窗贴边留 8px，标题栏换成紧凑版。
- 抽屉被拖得很窄时（≤430px 宽）：靠 `@container` 容器查询（不是窗口宽度）收掉便签字号、标题字号与内边距，把柄提示隐藏，保证窄条里也读得下。
- 矮视口（高度 ≤760px）：导航与内容不变，抽屉里的标题与内边距收一档，始终能滚到「收回抽屉」。

## 发布

推到 `Wqawa/realQuickJS_Engine` 的 `main` 分支，GitHub Pages 自动更新（`.nojekyll` 已存在）。

发布前可以把 `_dev/` 整个删掉，不影响站点。留着的话也不会被推上去：`_dev/.gitignore` 里写着 `*` / `!.gitignore`，除它自己以外全部忽略，所以 Pages 上看不到这些文件。

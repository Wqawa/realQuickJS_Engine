# realQuickJS_Engine

RealQuickJS Engine 的项目主页，纯静态文件，托管在 GitHub Pages。

访问地址：https://wqawa.github.io/realQuickJS_Engine/

## 改文案

- `index.html` — 页面结构和所有文字，搜「写」「在这里」就能找到占位内容。
- `style.css` — 颜色在文件顶部的 `:root` 里，改 `--accent` 就能换主色。
- `app.js` — 下载区自动读 Releases。如果要换成别的仓库，改第一行 `REPO`。

## 本地看效果

直接双击 `index.html`，或者：

```bash
python -m http.server 8000
```

然后打开 http://localhost:8000 。下载区要联网才会显示内容。

## 发布

推送到 `main` 分支，GitHub Pages 会自动更新，一般 1～10 分钟。

如果站点还没开 Pages：仓库 Settings → Pages → Build and deployment → Source 选
`Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存即可。

# MC 三国时代服务器主页

Minecraft Three Kingdoms Era 服务器的静态主页，使用原生 HTML、CSS 和 JavaScript 编写，可直接部署到 GitHub Pages，无需构建工具或后端服务。

## 服务器信息

- 服务器名称：MC三国时代（Minecraft Three Kingdoms Era）
- 支持版本：1.21.11
- Java 版地址：`mc.ithink537.top`（默认端口）
- 基岩版地址：`mc.ithink537.top`，端口 `11003`
- 玩家交流群：QQ群 `1091127792`
- 首次进入服务器后输入 `/guoji` 选择国籍

## 目录结构

```text
.
├── index.html          # 页面结构、新闻卡片与 HTML 文章正文
├── css/
│   └── style.css       # 页面样式、响应式布局与文章弹窗样式
├── js/
│   └── main.js         # 复制按钮与文章弹窗交互
├── fonts/
│   └── Minecraft.ttf  # Minecraft 点阵字体
└── images/
    └── server-icon.png # 服务器图标
```

## 本地预览

可以直接用浏览器打开 `index.html` 预览。若浏览器限制本地文件的部分功能，也可以用任意静态 HTTP 服务打开项目目录。复制按钮在安全上下文中使用剪贴板 API；本地文件预览时会显示手动复制提示。

## 添加新闻和长文章

新闻卡片与文章正文都维护在 `index.html` 中。每篇文章由一张卡片和一个 HTML `<template>` 组成；点击卡片会在弹窗中显示对应的完整文章。

1. 在 `#news` 下复制一段已有的 `<button class="news-card" ...>`，填写卡片标题与摘要。
2. 将卡片的 `data-article` 设为一个唯一 ID，并将 `data-title` 设置为弹窗标题。
3. 在文件末尾的文章模板区域复制一个 `<template>`，其 `id` 必须和卡片的 `data-article` 一致。
4. 在 `<template>` 内用 HTML 编写文章正文，例如 `<h1>`、`<h2>`、`<p>`、`<ul>`、`<ol>`、`<strong>`、`<a>` 等。
5. 保存并部署。图片可放入 `images/`，在正文中使用相对路径引用。

模板中的文章内容会作为 HTML 渲染。只应编辑并部署可信内容，不要将未经审查的用户提交 HTML 直接放入文章模板。

当前内置文章包括「三国时代 - 入群必看」规则公告、入服指南和文章编辑指南。群规重点：服务器有经济系统并可自由买卖领地；未经许可不得在他国境内建造设施，违规者封禁 3 天；新人首次进入需输入 `/guoji` 选择国籍。

## 部署到 GitHub Pages

1. 将本项目推送到 GitHub 仓库。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 选择要发布的分支（例如 `main`）和目录（根目录 `/`），然后保存。
5. 等待 GitHub Pages 完成发布，并通过仓库 Pages 页面显示的网址访问主页。

所有网页资源均使用相对路径，支持从 GitHub Pages 项目子路径加载。更新页面后，将修改提交并推送到已配置的发布分支即可。

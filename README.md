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
├── index.html          # 页面结构与新闻卡片
├── articles.html       # 独立维护的 HTML 文章正文模板
├── css/
│   └── style.css       # 页面样式、Hero 动效、响应式布局与文章弹窗样式
├── js/
│   └── main.js         # 复制按钮、文章弹窗与图片预览交互
├── fonts/
│   └── Minecraft.ttf  # Minecraft 点阵字体
└── images/
    ├── server-logo.png # 服务器 Logo
    └── server-logo.jpg # 服务器 Logo 图片
```

## 本地预览

由于文章正文通过 Fetch API 从 `articles.html` 加载，请通过本地静态 HTTP 服务预览，而不是直接双击打开 `index.html`（`file://` 会限制跨文件读取）。部署到 GitHub Pages 后会正常加载。复制按钮在安全上下文中使用剪贴板 API；不支持时会显示手动复制提示。

## 添加新闻和长文章

新闻卡片维护在 `index.html`，文章正文统一维护在 `articles.html`。每篇文章由一张卡片和一个 HTML `<template>` 组成；点击卡片会在弹窗中显示对应的完整文章。

1. 在 `articles.html` 中复制一个已有的 `<template>`，设置唯一的 `id`，并用 HTML 编写文章正文。
2. 在 `index.html` 的 `#news` 下复制一段已有的 `<button class="news-card" ...>`，填写卡片标题与摘要。
3. 将卡片的 `data-article` 设为模板的 `id`，并将 `data-title` 设置为弹窗标题。
4. 保存并部署。图片可放入 `images/`，在正文中使用相对路径引用。

文章内的图片会自动缩放至文章栏宽度。点击图片可打开大图预览；可使用左右箭头按钮或键盘方向键切换同一篇文章中的图片，按 Esc 或关闭按钮退出预览。

主页 Hero 区域带有文字依次进入和背景光晕呼吸效果；灯箱关闭与切换图标已针对圆形按钮做垂直视觉居中。文章长图不限制高度，仅按文章栏最大宽度缩放并保持原始比例。页面遵循系统的“减少动态效果”偏好，启用时会停用入场与光晕动画。

模板中的文章内容会作为 HTML 渲染。只应编辑并部署可信内容，不要将未经审查的用户提交 HTML 直接放入文章模板。

当前内置文章包括「三国时代 - 入群必看」规则公告、入服指南和文章编辑指南。群规重点：服务器有经济系统并可自由买卖领地；未经许可不得在他国境内建造设施，违规者封禁 3 天；新人首次进入需输入 `/guoji` 选择国籍。

## 部署到 GitHub Pages

1. 将本项目推送到 GitHub 仓库。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 选择要发布的分支（例如 `main`）和目录（根目录 `/`），然后保存。
5. 等待 GitHub Pages 完成发布，并通过仓库 Pages 页面显示的网址访问主页。

所有网页资源均使用相对路径，支持从 GitHub Pages 项目子路径加载。更新页面后，将修改提交并推送到已配置的发布分支即可。

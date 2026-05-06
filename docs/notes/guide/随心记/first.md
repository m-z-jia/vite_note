# VuePress 笔记网站搭建指南

## 一、环境准备

### 1. 安装 Node.js 和 npm

如果你还没配置好 Node.js 环境，需要先安装 Node.js 和 npm：

- 下载地址：[Node.js 官网](https://nodejs.org/)
- 推荐版本：LTS 长期支持版

### 2. 创建项目文件夹

```bash
mkdir my-notes
cd my-notes
```

## 二、项目初始化

### 1. 初始化 package.json

```bash
npm init -y
```

### 2. 安装 VuePress

```bash
# 开发依赖安装（推荐）
npm install vuepress -D

# 全局安装（可选）
npm install vuepress -g
```

**区别：**

- `-D`：仅在当前项目安装，记录在 `devDependencies` 中
- `-g`：全局安装，所有项目共享同一个版本

## 三、配置项目

### 1. 修改 package.json

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```

### 2. 创建 docs 文件夹

```bash
mkdir docs
```

## 四、启动项目

### 1. 本地开发

```bash
npm run dev
```

### 2. 生产构建

```bash
npm run build
```

## 五、项目结构

```
my-notes/
├── docs/
│   ├── .vuepress/
│   │   └── config.js
│   └── README.md
└── package.json
```

## 六、常用配置

### 1. 基础配置

在 `docs/.vuepress/config.js` 中添加：

```javascript
module.exports = {
  title: "我的笔记",
  description: "使用 VuePress 搭建的笔记网站",
  base: "/my-notes/",
};
```

### 2. 主题配置

```javascript
module.exports = {
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "前端", link: "/frontend/" },
    ],
    sidebar: [{ text: "Vue 学习", link: "/vue/" }],
  },
};
```

## 七、部署到 GitHub Pages

### 1. 准备工作

确保你的 GitHub 仓库已经创建，并且你已经将代码推送到 GitHub 上。

### 2. 配置 Base 路径

在 `docs/.vuepress/config.js` 中，确保 `base` 配置正确。如果你的仓库名是 `my-notes`，则：

```javascript
base: "/my-notes/",
```

### 3. 创建 GitHub Actions 配置文件

在项目根目录下创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master] # 或者是 main
    paths: ["docs/**"]

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build VuePress site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./docs/.vuepress/dist"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4. GitHub 仓库设置

1. 进入 GitHub 仓库设置页面 (**Settings**)。
2. 在左侧菜单点击 **Pages**。
3. 在 **Build and deployment** > **Source** 下拉菜单中选择 **GitHub Actions**。

### 5. 推送代码

完成上述配置后，每次向 `master` 分支推送代码，GitHub Actions 都会自动构建并部署你的网站。

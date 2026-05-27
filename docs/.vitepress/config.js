import mathjax3 from "markdown-it-mathjax3";

export default {
  base: process.env.GITHUB_ACTIONS ? "/vite_note/" : "/",
  title: "蘑菇",
  description: "记录学习与成长的点点滴滴",
  head: [["link", { rel: "icon", href: "/img/mushroom.png" }]],
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
  },
  themeConfig: {
    logo: "/img/logo.png",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "笔记分类",
        items: [
          { text: "机器学习", link: "/notes/guide/机器学习/L1-L2正则化" },
          { text: "前端相关", link: "/notes/guide/前端相关/组件调用" },
          { text: "随心记", link: "/notes/guide/随心记/first" },
        ],
      },
    ],
    footer: {
      message: "知识的星辉照亮成长之路 — 记录只是开始，思考没有终点。",
      copyright: "mzj",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    search: {
      provider: "local",
    },
    outline: {
      label: "页面导航",
      level: [2, 3],
    },
    sidebar: [
      {
        text: "机器学习",
        collapsed: true,
        items: [
          {
            text: "L1、L2 范数 + 正则化",
            link: "/notes/guide/机器学习/L1-L2正则化",
          },
          {
            text: "梯度下降算法梳理",
            link: "/notes/guide/机器学习/一些梯度下降算法",
          },
          {
            text: "特征工程",
            link: "/notes/guide/机器学习/特征工程",
          },
        ],
      },
      {
        text: "前端相关",
        collapsed: true,
        items: [
          {
            text: "组件间调用",
            link: "/notes/guide/前端相关/组件调用",
          },
          {
            text: "JSON.stringify",
            link: "/notes/guide/前端相关/JSON.stringify",
          },
        ],
      },
      {
        text: "随心记",
        collapsed: true,
        items: [
          {
            text: "Markdown 常用语法",
            link: "/notes/guide/随心记/Markdown常用语法",
          },
          {
            text: "VuePress 笔记网站搭建指南",
            link: "/notes/guide/随心记/first",
          },
        ],
      },
    ],
  },
};

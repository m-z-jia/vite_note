import mathjax3 from "markdown-it-mathjax3";

export default {
  base: process.env.GITHUB_ACTIONS ? "/vite_note/" : "/",
  title: "蘑菇",
  description: "我的个人博客",
  head: [["link", { rel: "icon", href: "/img/mushroom.png" }]],
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
  },
  themeConfig: {
    logo: "/img/logo.png",
    nav: [{ text: "首页", link: "/" }],
    footer: {
      message: "由 VitePress 驱动",
      copyright: "我的笔记站",
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
            link: "/notes/first",
          },
        ],
      },
    ],
  },
};

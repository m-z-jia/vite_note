export default {
  base: process.env.GITHUB_ACTIONS ? "/mzj-note/" : "/",
  title: "蘑菇",
  description: "我的个人博客",
  head: [["link", { rel: "icon", href: "/img/mushroom.png" }]],
  themeConfig: {
    logo: "/img/logo.png",
    nav: [{ text: "首页", link: "/" }],
    footer: {
      message: "由 VitePress 驱动",
      copyright: "我的笔记站",
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
        text: "待添加",
        collapsed: true,
        items: [],
      },
      {
        text: "前端相关",
        collapsed: true,
        items: [
          {
            text: "组件间调用",
            link: "/notes/guide/前端相关/组件调用",
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
            text: "属性解释",
            link: "/notes/guide/随心记/属性解释",
          },
        ],
      },
    ],
  },
};

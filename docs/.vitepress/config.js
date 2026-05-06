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
    nav: [{ text: "首页", link: "/" }],
    footer: {
      message:
        "恭喜你成为尊贵的星辉-奔驰车主！愿知识的星辉照亮你的学习与成长之路—— 一记天时，二录地利，三写人和。星光不问赶路人，时光不负有心人。愿您出走半生，归来仍是少年。记录只是开始，思考没有终点。知识星辉为你领航，往后风雨同路，落笔顺遂。从今天起，笔记星徽将陪伴你驶向每一段璀璨旅程。",
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
          }
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

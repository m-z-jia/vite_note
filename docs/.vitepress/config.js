import mathjax3 from "markdown-it-mathjax3";

export default {
  base: process.env.GITHUB_ACTIONS ? "/vite_note/" : "/",
  title: "蘑菇",
  description: "记录学习与成长的点点滴滴",
  head: [["link", { rel: "icon", href: "/img/mushroom.png" }]],
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(mathjax3);
    },
  },
  themeConfig: {
    logo: "/img/logo.png",
    nav: [
      { text: "首页", link: "/" },
      // {
      //   text: "笔记分类",
      //   items: [
      //     { text: "机器学习", link: "/notes/guide/机器学习/L1-L2正则化" },
      //     { text: "前端相关", link: "/notes/guide/前端相关/组件调用" },
      //     { text: "作业", link: "/notes/guide/作业/需求1-Java反射机制" },
      //     { text: "随心记", link: "/notes/guide/随心记/first" },
      //   ],
      // },
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
        text: "作业",
        collapsed: true,
        items: [
          {
            text: "Java反射机制",
            link: "/notes/guide/作业/需求1-Java反射机制",
          },
          {
            text: "文本文件复制",
            link: "/notes/guide/作业/需求2-文本文件复制",
          },
          {
            text: "计算方法执行时间+匿名内部类",
            link: "/notes/guide/作业/需求3-计算方法执行时间+匿名内部类",
          },
          {
            text: "形式化方法",
            link: "/notes/guide/作业/需求4-形式化方法",
          },
          {
            text: "Prime Numbers素数",
            link: "/notes/guide/作业/需求5-Prime-Numbers素数",
          },
          {
            text: "枚举类型应用场景",
            link: "/notes/guide/作业/需求6-枚举类型应用场景",
          },
          {
            text: "实验4 App运行说明",
            link: "/notes/guide/作业/需求7-实验4-App运行说明",
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
          {
            text: "skills - AI 编程工程化指令集",
            link: "/notes/guide/随心记/skills",
          },
          {
            text: "codegraph - 代码语义图谱索引工具",
            link: "/notes/guide/随心记/codegraph",
          },
        ],
      },
    ],
  },
};

module.exports = {
  title: "蘑菇", // 网站的标题
  description: "我的个人博客", // 网站的描述
  base: '/mzj-note/', // 部署到github相关的配置
  themeConfig: {
    logo: "/aseets/img/logo.png",
    //顶部导航栏配置
    nav: [
      { text: "首页", link: "/" },

      {
        text: "技术笔记",
        items: [
          {
            text: "前端",
            items: [
              { text: "HTML & CSS", link: "/guide/前端学习笔记/" },
              { text: "JavaScript", link: "/guide/japanese/" },
              { text: "Vue", link: "/guide/japanese/" },
            ],
          },

          {
            text: "后端",
            items: [
              { text: "前端学习笔记", link: "/guide/前端学习笔记/" },
              { text: "Java学习笔记", link: "/guide/japanese/" },
            ],
          },
        ],
      },

      {
        text: "常见问题",
        items: [
          { text: "Chinese", link: "/language/chinese/" },
          { text: "Japanese", link: "/language/japanese/" },
        ],
      },
      {
        text: "面试常问",
        items: [
          { text: "Chinese", link: "/language/chinese/" },
          { text: "Japanese", link: "/language/japanese/" },
        ],
      },
      {
        text: "开源项目",
        items: [
          { text: "Chinese", link: "/language/chinese/" },
          // { text: 'Japanese', link: '/language/japanese/' }
        ],
      },
      { text: "关于我", link: "/about/about.md" },
    ],
    sidebar: [
      {
        title: "待添加", // 必要的
        // path: '/前端学习笔记/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          {
            title: "HTML基础学习",
            path: "/guide/前端学习笔记/01html基础.md",
          },
          {
            title: "bas",
            path: "/guide/前端学习笔记/00html基础.md",
          },
        ],
      },
      {
        title: "随心记",
        // path: "/guide/随心记/笔记网站.md",
        children: [
          {
            title: "vuepress笔记网站",
            path: "/notes/guide/随心记/笔记网站.md",
          },
          {
            title: "属性解释",
            path: "/notes/guide/随心记/属性解释.md",
          },
        ],
        //   initialOpenGroupIndex: -1 // 可选的, 默认值是 0
      },
    ],
  },
};

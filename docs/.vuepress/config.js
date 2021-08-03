const fs = require("fs");
const path = require("path");
const process = require("process");

const ignoreList = [".DS_Store"];
const ignoreSiderList = [".vuepress", ".DS_Store", "README.md", "temp"];

const workPath = path.join(process.cwd() + "/docs");

function getSiderChildren(parentName) {
  const currentPath = path.join(workPath + `/${parentName}`);
  const filterFiles = fs
    .readdirSync(currentPath)
    .filter((file) => !ignoreList.includes(file));
  const files = filterFiles.map((file) => {
    if (file === "README.md") {
      return `/${parentName}/`;
    }
    if (file.endsWith(".md")) {
      const fileName = file.split(".")[0];
      return `/${parentName}/${fileName}`;
    }
    let currentFile = { title: file };
    const subPath = `${currentPath}/${file}`;
    if (fs.statSync(subPath).isDirectory()) {
      return {
        ...currentFile,
        children: getSiderChildren(`${parentName}/${file}`),
      };
    }
  });
  return files.filter((item) => item);
}

const getSortList = (parentName) => {
  const list = getSiderChildren(parentName);
  return [...new Set([`/${parentName}/`, ...list])];
};

const getSiderList = () => {
  let siderObj = {};
  const siderFiles = fs
    .readdirSync(workPath)
    .filter((file) => !ignoreSiderList.includes(file));
  for (let val of siderFiles) {
    siderObj = {
      ...siderObj,
      [`/${val}/`]: getSortList(val),
    };
  }
  return siderObj;
};

const sidebar = getSiderList();

const getBaiduTongji = () => {
  return `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?0088ce24040b03f2947322ab31d23414";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
  `;
};

const getBaiduSpa = () => {
  return `
  var _hmt = _hmt || [];
  _hmt.push(['_requirePlugin', 'UrlChangeTracker', {
    shouldTrackUrlChange: function (newPath, oldPath) {
      newPath = newPath.split('#')[0];
      oldPath = oldPath.split('#')[0];
      return newPath != oldPath;
    }}
  ]);
  `;
};

const baiduTongji = getBaiduTongji();
const baiduSpa = getBaiduSpa();
const base = "/";
// const base = '/note/';

const nav = [
  { text: "博客", link: "https://note.qdzhou.cn/" },
  {
    text: "JS",
    link: "/javascript/",
    items: [
      {
        text: "js基础",
        items: [
          {
            text: "《js代码片段》",
            link: "/javascript/2-代码片段/代码片段-2",
          },
          {
            text: "《常用正则》",
            link: "/javascript/3-常用正则/emoji",
          },
          {
            text: "《常用问题》",
            link: "/javascript/4-常见问题/qa",
          },
          {
            text: "《js重要类型》",
            link: "/javascript/1-重要类型/Map",
          },
        ],
      },
    ],
  },
  { text: "CSS", link: "/c3/" },
  { text: "可视化", link: "/visual/" },
  { text: "Vue", link: "/vue/" },
  { text: "小程序", link: "/mini-program/" },
  { text: "随笔", link: "/other/" },
];

module.exports = {
  title: "qd blog",
  description: "qd前端相关知识总结",
  base,
  port: 9199,
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "qd-blog,js,vuepress,leetcode,react,react进阶,css,js进阶,react性能优化,js设计模式",
      },
    ],
    ["script", {}, baiduTongji],
    ["script", {}, baiduSpa],
  ],
  plugins: [
    ["@vuepress/medium-zoom", true],
    ["@vuepress/back-to-top", true],
    ["vuepress-plugin-code-copy", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
  themeConfig: {
    sidebarDepth: 2,
    searchMaxSuggestions: 10,
    lastUpdated: "上次更新",
    editLinks: true,
    smoothScroll: true,
    nav,
    sidebar,
  },
};

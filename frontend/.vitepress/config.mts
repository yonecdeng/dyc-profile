import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";
import { formatSidebarAndNav, formatPublicNav } from "../src/utils/fs.js";
const markdownPath = path.resolve(__dirname, "../markdown");
const { nav, sidebar } = formatSidebarAndNav(markdownPath, "public");
const publicNav = formatPublicNav(markdownPath + "/public");

export default defineConfig({
  // 应用级别
  title: "dyc-profile",
  description: "markdown record",

  // 主题样式
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [...nav, publicNav],
    sidebar,
    outline: [1, 6],
    socialLinks: [
      { icon: "github", link: "https://github.com/yonecdeng/dyc-profile" },
    ],
    // search: {
    //   provider: "algolia",
    //   options: {
    //     appId: "8J64VVRP8K",
    //     apiKey: "a18e2f4cc5665f6602c5631fd868adfd",
    //     indexName: "vitepress",
    //   },
    // },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },

  // 构建
  srcDir: "./markdown",
  ignoreDeadLinks: true,

  // markdown
  markdown: {
    image: {
      // 默认禁用图片懒加载
      lazyLoading: true,
    },
  },

  //vite
  vite: {
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "../src"),
        },
        {
          find: "@markdown",
          replacement: path.resolve(__dirname, "../markdown"),
        },
        {
          find: /^.*\/VPDocOutlineItem\.vue$/,
          replacement: fileURLToPath(
            new URL(
              "../src/components/custom-vitepress/DocOutlineItem.vue",
              import.meta.url
            )
          ),
        },
      ],
    },
    plugins: [],
  },

  //vue
  vue: {
    // exclude: [/\/markdown\/.*\.md$/],
  },
});

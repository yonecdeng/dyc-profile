import { defineConfig } from "vitepress";
import ElementPlus from "unplugin-element-plus/vite";

import { fileURLToPath, URL } from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";
import { formatSidebarAndNav } from "../src/utils/fs";
const markdownPath = path.resolve(__dirname, "../markdown");
const { nav, sidebar } = formatSidebarAndNav(markdownPath);
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 应用级别
  title: "dyc-profile",
  description: "markdown record",

  // 主题样式
  themeConfig: {
    // 应该用脚本去跑某个目录
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    outline: [1, 6],
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
  },

  //vue
  vue: {
    // exclude: [/\/markdown\/.*\.md$/],
  },
});
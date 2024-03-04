#!/usr/bin/env zx

import fs from "fs";
function extractUrls(text) {
  // 此正则表达式旨在匹配大多数URL
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  // 使用正则表达式匹配文本
  const urls = text.match(urlRegex);
  return urls || [];
}
async function uploadImageToImgur(imageUrl) {
  if (!imageUrl) return null;
  try {
    // 构建你的命令
    const res =
      await $`/Applications/uPic.app/Contents/MacOS/uPic -u ${imageUrl}`;
    const url = extractUrls(res.stdout);
    console.log("上传成功newUrl为", url);
    return url.length > 0 ? url[0] : undefined; // 上传后的图片URL在这里
  } catch (error) {
    console.error(`${imageUrl}上传失败:`, error);
    return null;
  }
}

function getImgRuntime(whole, oldUrl, newUrl) {
  let correctInImgContent = `src="${newUrl}" alt="${newUrl}"`;
  if (whole.startsWith("<img")) {
    let inImgContent = [];
    const regex = /<img\s+([^>]+?)\s*\/?>/g; // 提取出原img标签里的内容，有可能加原img标签里加了一些属性如style="zoom:33%;"
    while ((inImgContent = regex.exec(whole)) !== null) {
      correctInImgContent = inImgContent[1].replace(oldUrl, newUrl);
    }
    console.log("correctInImgContent", correctInImgContent);
  }
  return `<picture>
    <source type="image/avif" srcset="${newUrl}?imageMogr2/format/avif">
    <source type="image/webp" srcset="${newUrl}?imageMogr2/format/webp">
    <img ${correctInImgContent} loading="lazy"/>
  </picture>`;
}

function getMdImg(content) {
  // 匹配 Markdown 图片链接和 HTML <img> 标签，同时提取 URL
  const regex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["'].*?>/g;

  // 用于存储匹配结果和URLs
  let matches = [];

  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({
      whole: match[0], // 将完整匹配添加到matches数组
      url: match[1] || match[2], // URL可能在match[1]或match[2]，取决于匹配的是Markdown图片还是HTML<img>
    });
  }
  return matches;
}

async function replaceImageLinks(url) {
  if (
    !url.startsWith(
      "https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com"
    ) &&
    !url.startsWith("data:image") // 过滤掉base64
  ) {
    const newUrl = await uploadImageToImgur(url);
    return newUrl || url;
  }
  return url;
}

/**将img换成picture的写法兼容多种格式，且如果不是我的oss的链接会上传到我的oss并替换 */
async function replaceImgToPicture(filePath) {
  let markdownContent = fs.readFileSync(filePath, "utf8");
  const noPictureText = markdownContent.replace(
    //过滤掉已经是<picture>格式的
    /<picture>[\s\S]*?<\/picture>/g,
    ""
  );
  const matches = getMdImg(noPictureText);
  for (const match of matches) {
    const correctUrl = await replaceImageLinks(match.url);
    const runtime = getImgRuntime(match.whole, match.url, correctUrl);
    markdownContent = markdownContent.replace(match.whole, runtime);
  }
  // 将更新后的Markdown内容写回文件
  fs.writeFileSync(filePath, markdownContent);
  // await $`npx prettier ${filePath} --write`; // 格式化文件
  console.log(`${filePath}所有图片格式替换完成`);
}
export default replaceImgToPicture;

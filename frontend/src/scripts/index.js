import fs from "fs";
import path from "path";
import replaceImgToPicture from "./features/replaceImgToPicture.js";
import { fileURLToPath } from "url";
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
console.log("Current directory path:", currentDirectoryPath);

const directoryPath = path.resolve(
  currentDirectoryPath,
  "../../markdown/前端笔记",
); // 替换成你的目录路径
/**遍历目录下的所有.md文件 */
function processFilesInDirectory(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      throw new Error(`Error reading directory:${err}`);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      fs.stat(filePath, async (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        if (stats.isDirectory()) {
          processFilesInDirectory(filePath);
        } else if (stats.isFile() && path.extname(file) === ".md") {
          //在这里面搞事情
          console.log("filePath", filePath);
          await replaceImgToPicture(filePath);
        }
      });
    });
  });
}
processFilesInDirectory(directoryPath);

import * as fs from "node:fs";
import * as path from "node:path";
/**遍历某个目录下的所有子目录，如果子目录中缺少某文件则创建一个某文件 */
export function createIndexFileRecursive(
  directoryPath: string,
  addData: { fileName: string; data: string | NodeJS.ArrayBufferView },
) {
  // 读取目录内容
  const directoryContents = fs.readdirSync(directoryPath);

  // 遍历目录内容
  directoryContents.forEach((item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // 如果是子目录，则递归调用函数
      createIndexFileRecursive(itemPath, addData);

      // 检查子目录中是否缺少 index.md 文件
      const indexPath = path.join(itemPath, addData?.fileName);
      if (!fs.existsSync(indexPath)) {
        fs.writeFileSync(indexPath, addData.data);
        console.log(`Created index.md in ${itemPath}`);
      }
    }
  });
}

/**递归读取某个目录下的所有目录及其文件，过滤掉隐藏文件 */
function readDirectory(dir: string, filterDir?: string): any[] {
  const files = fs.readdirSync(dir);

  return files.reduce((acc, file) => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      if (filterDir && filePath.includes(filterDir)) {
        return [...acc];
      }
      // 如果是目录，递归读取
      const nestedFiles = readDirectory(filePath, filterDir);
      return [...acc, { directory: file, files: nestedFiles }];
    } else if (file.startsWith(".")) {
      // 过滤隐藏文件
      return [...acc];
    } else {
      return [...acc, file];
    }
  }, []);
}

/**格式化出vitepress需要的nav和sidebar */
export function formatSidebarAndNav(dir: string, filterDir?: string) {
  const files = readDirectory(dir, filterDir).filter(
    (item) => typeof item === "object",
  );
  const nav = new Array<{ text: string; link: string }>();
  const sidebar = new Array<{ text: string; items: any[] }>();
  files.forEach((item) => {
    const curNav = {
      text: item.directory,
      link: `/${item.directory}/${item.files[0]}`,
    };
    nav.push(curNav);

    const curSidebar = {
      text: item.directory,
      items: item.files.map((file) => {
        return {
          text: file,
          link: `/${item.directory}/${file}`,
        };
      }),
    };
    sidebar.push(curSidebar);
  });
  return {
    nav,
    sidebar,
  };
}

export function formatPublicNav(dir: string) {
  const files = readDirectory(dir);
  const items = files.map((item) => {
    return {
      text: item.directory,
      link: `/${item.directory}/index.html`,
      target: "_blank",
    };
  });
  return {
    text: "mini-games",
    items,
  };
}

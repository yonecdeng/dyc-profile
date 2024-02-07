

# 基本

## **什么是TypeScript？**

### 优点

[TypeScript](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2F) 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。

1. 提供了基于类的面向对象编程

2. TS 在开发时就能给出编译错误， 而 JS 错误则需要在运行时才能暴露。所以如果不用ts，我们不得不加上一些防御性代码

   ```js
               if ( obj && typeof obj.show === 'function' ){
                 obj.show();
               }
   ```

   

3. 作为强类型语言，你可以明确知道数据的类型

   1. VSCode提示

      例如：定义者指定了一个方法：

      ```ts
      export function foo(name: string): number {
        return name.length
      }
      ```

      那么作为使用者， 你会很清晰的通过**VSCode**的提示了解到该函数的参数和返回值信息





### 缺点

费精力：

比如查看Vue.js3 源码中的 runtime-core/src/apiDefineComponent.ts 文件，整个文件里真正会在浏览器中运行的代码其实只有 3 行，但是全部的代码接近 200 行，其实这些代码都是在为类型支持服务。由此可见，框架想要做到完善的类型支持，需要付出相当大的努力



## TypeScript 与 JavaScript 的区别

| TypeScript                                     | JavaScript                               |
| ---------------------------------------------- | ---------------------------------------- |
| JavaScript 的超集用于解决大型项目的代码复杂性  | 一种脚本语言，用于创建动态网页           |
| 可以在编译期间发现并纠正错误                   | 作为一种解释型语言，只能在运行时发现错误 |
| 强类型，支持静态和动态类型                     | 弱类型，没有静态类型选项                 |
| 最终被编译成 JavaScript 代码，使浏览器可以理解 | 可以直接在浏览器中使用                   |
| 支持模块、泛型和接口                           | 不支持模块，泛型或接口                   |









## 面向对象的三大特性

![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-mU7LSb.gif)

### 封装

封装最好理解了。封装是面向对象的特征之一，是对象和类概念的主要特性。

封装，也就是把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏。



### 继承

> ts不支持多重继承,  继承多个接口就可以

#### 泛化（Generalization）

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-DUef1H.gif)

在上图中，空心的三角表示继承关系（类继承），在UML的术语中，这种关系被称为泛化（Generalization）。Person(人)是基类，Teacher(教师)、Student(学生)、Guest(来宾)是子类。

若在逻辑上B是A的“一种”，并且A的所有功能和属性对B而言都有意义，则允许B继承A的功能和属性。

例如，教师是人，Teacher 是Person的“一种”（a kind of ）。那么类Teacher可以从类Person派生（继承）。



#### 聚合（组合）

![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-RMJG7t.gif)

若在逻辑上A是B的“一部分”（a part of），则不允许B从A派生，而是要用A和其它东西组合出B。

例如，眼（Eye）、鼻（Nose）、口（Mouth）、耳（Ear）是头（Head）的一部分，所以类Head应该由类Eye、Nose、Mouth、Ear组合而成，不是派生（继承）而成。



### 多态

js因为是动态类型，本身不需要支持重载，直接对参数进行类型判断即可，但是ts为了保证类型安全，支持了函数签名的类型重载，即多个overload signatures和一个implementation signatures

在父类中定义一个方法，在子类中有多个实现，在程序运行的时候，根据不同的对象执行不同的操作，实现运行时的绑定。





# 项目

## typescript的配置

初始化：

`npx tsc --init`

`tsconfig.json`文件主要供`tsc`编译器使用



貌似没找到如何配置使编译出来的文件里的路径带上`.js`扩展名，所以一般是在ts文件里的引用ts文件的路径加上`.js`后缀，如：

```js
import { createDevServer } from "./dev.js"; //dev其实是ts文件
```







## 引入类型

只导入类型（使用 import { type ... } 语法）时，这不会导致实际的运行时导入，因此不会将该文件打包进来。


这是因为类型只在编译阶段存在，用于类型检查，而在运行时会被移除。所以，当你只导入类型时，打包工具（如 webpack 或 rollup）不会将该模块包含在最终的打包结果中。



## 编译运行ts代码

#### 方法一 tsc 官方编辑工具

```shell
$ npm i -g typescript
$ tsc -v #查看版本
$ tsc hello.ts #终端输入下面后，同级目录中回出现一个同名的js文件

$ node hello.js
```



好的 IDE 支持对 TypeScript 的即时编译。但是，如果你想在使用 `tsconfig.json` 时从命令行手动运行 TypeScript 编译器，你可以通过以下方式：

- 运行 tsc，它会在当前目录或者是父级目录寻找 `tsconfig.json` 文件。
- 运行 `tsc -p ./path-to-project-directory` 。当然，这个路径可以是绝对路径，也可以是相对于当前目录的相对路径。

你甚至可以使用 `tsc -w` 来启用 TypeScript 编译器的观测模式，在检测到文件改动之后，它将重新编译。





#### 方法二 ts-node库

```
npm i -g ts-node

ts-node hello.ts
```





#### 方法三 tsx库（推荐）

安装这个库吧





#### 线上的 [TypeScript Playground](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay%2F) 

线上的 [TypeScript Playground](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay%2F) 来学习新的语法或新特性。通过配置 **TS Config** 的 Target，可以设置不同的编译目标，从而编译生成不同的目标代码。













## 编译上下文

### 生成tsconfig.json文件

```shell
$ pnpm i -g typescript
$ pnpm tsc --init #它会找到.bin目录下的tsc命令,生成该文件
```



### tsconfig.json 的作用

- 用于标识 TypeScript 项目的根路径；
- 用于配置 TypeScript 编译器；
- 用于指定编译的文件。

### tsconfig.json 重要字段

- files - 设置要编译的文件的名称；
- include - 设置需要进行编译的文件，支持路径模式匹配；使用 `globs`：`**/*` （一个示例用法：`some/folder/**/*`）意味着匹配所有的文件夹和所有文件（扩展名为 `.ts/.tsx`，当开启了 `allowJs: true` 选项时，扩展名可以是 `.js/.jsx`）。与`files`不同，`includes`不仅可以列出具体的文件，还可以列出文件夹，让TypeScript编译器自动查找该文件夹下所有需要编译的文件。使用Webpack等构建工具，使用`includes`可以让Webpack监听文件变化并自动编译。
- exclude - 设置无需进行编译的文件，支持路径模式匹配；
- extends  - 作用是将一个 tsconfig.json 文件的配置选项复制到另一个 tsconfig.json 文件中。同时还可以在当前项目中覆盖或扩展这些选项。(目前唯一不会被继承的属性是`references`。)

  ```
  {
    "extends": "../A/tsconfig.json",
    "compilerOptions": {
      // ...
    }
  }
  ```

  这样，当前项目 就会继承项目 A 的所有编译选项，同时还可以在 compilerOptions 中添加或覆盖特定的选项。
- compilerOptions - 设置与编译流程相关的选项。
-  `references` 属性，它的作用是帮助 TypeScript 编译器在项目中处理跨包依赖和项目之间的依赖关系。

  `references` 属性主要用于以下两个方面：

  1. **项目间依赖的处理**：当你的 TypeScript 项目由多个子项目组成，其中某些项目之间存在依赖关系时，可以使用 `references` 属性来描述这些项目之间的依赖关系。在编译时，TypeScript 编译器会按照 `references` 属性中的顺序依次编译这些项目。
  2. **增量编译**：在一个大型 TypeScript 项目中，每次修改代码后都需要重新编译整个项目，这样会浪费大量的时间。而使用 `references` 属性，TypeScript 编译器就可以只重新编译发生了变化的子项目，这样就可以显著减少编译时间。

  ```json
  {
      "files": [],
      "references": [{ "path": "./tsconfig.node.json" }]
  }
  ```

  

  

### compilerOptions 选项

compilerOptions 支持很多选项，常见的有 `baseUrl`、 `target`、`baseUrl`、 `moduleResolution` 和 `lib` 等。

compilerOptions 每个选项的详细说明如下：

```json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```





## `lib.d.ts`

当你安装 `TypeScript` 时，会顺带安装一个 `lib.d.ts` 声明文件。这个文件包含 JavaScript 运行时以及 DOM 中存在各种常见的环境声明。

- 它自动包含在 TypeScript 项目的编译上下文中；
- 它能让你快速开始书写经过类型检查的 JavaScript 代码。

你可以通过指定 `--noLib` 的编译器命令行标志（或者在 `tsconfig.json` 中指定选项 `noLib: true`）从上下文中排除此文件。









## vue

安装vscode插件TypeScript Vue Plugin (Volar)即可







## 类型声明文件

### js工具库在vscode中如何能看到其对应的类型声明呢？

有两种方式：

- 工具库本身就有内置的类型声明文件，这样的话直接就能看了
- 如果库本身没有类型声明文件，vscode会提示你安装该工具的类型提示包







### declare

#### 总览

declare 关键字用来告诉编译器某个类型是存在的。比如 自己的脚本使用外部库定义的函数，编译器会因为不知道外部函数的类型定义而报错，这时就可以在自己的脚本里面使用`declare`关键字，告诉编译器外部函数的类型。

注意，declare 关键字只用来给出类型描述，是纯的类型代码，不允许设置变量的初始值，也不能涉及实现。

declare 关键字可以描述以下类型。

- 变量（const、let、var 命令声明）
- type 或者 interface 命令声明的类型
- class
- enum
- 函数（function）
- 模块（module）
- 命名空间（namespace）





#### declare module ......

##### 使用

（1）`declare module NAME`语法里面的模块名`NAME`，跟 import 和 export 的模块名规则是一样的，且必须跟当前文件加载该模块的语句写法保持一致。

```tsx
// b.ts
import { A } from './a';
declare module './a' { //***
  interface A {
    y: number;
  }
}
```



（2）不能创建新的顶层类型。也就是说，只能对`a.ts`模块中已经存在的类型进行扩展。

（3）不能对默认的`default`接口进行扩展，只能对 export 命令输出的命名接口进行扩充。

某些第三方模块，原始作者没有提供接口类型，这时可以在自己的脚本顶部加上下面一行命令。加上这命令以后，外部模块即使没有类型声明，也可以通过编译。但是，从该模块输入的所有接口都将为`any`类型。

```tsx
declare module "模块名";

// 例子
declare module "hot-new-module";
```



##### declare module 用于类型声明文件

为整个项目定义一个大的`.d.ts`文件，在这个文件里面使用`declare module`定义每个模块脚本的类型。

注意：`export=`  === `export default`

下面的示例是`node.d.ts`文件的一部分。

```tsx
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

上面示例中，`url`和`path`都是单独的模块脚本，但是它们的类型都定义在`node.d.ts`这个文件里面。



##### 通配符

declare module 描述的模块名可以使用通配符。

```tsx
declare module 'my-plugin-*' {
  interface PluginOptions {
    enabled: boolean;
    priority: number;
  }

  function initialize(options: PluginOptions): void;
  export = initialize;
}
```

上面示例中，模块名`my-plugin-*`表示适配所有以`my-plugin-`开头的模块名（比如`my-plugin-logger`）。



#### declare global

如果要为 JavaScript 引擎的原生对象添加属性和方法，可以使用`declare global {}`语法。

```tsx
export {};

declare global {
  interface String {
    toSmallString(): string;
  }
}
```

第一行的空导出语句`export {}`，作用是强制编译器将这个脚本当作模块处理。这是因为`declare global`必须用在模块里面。



#### 作用

##### 1.声明某个js文件的类型

ts打包出来就是js，所以所有库都有一个.d.ts文件里用declare声明类型



##### 2.扩展

###### 扩展某个库里的某个类型

```ts
/**拓展axios里request config的类型 */
import 'axios'; // 导入原始 Axios 类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    retryDelay?: number; //单位为毫秒表示过多少毫秒后进行重传
    retryLimit?: number; //最大重试次数
    __retryCount?: number; //重试次数
    isGlobalLoading?: boolean;
    interceptors?: Interceptors;
  }
}
```



###### 扩展全局类型

```ts
declare global {
  interface Window {
    myProperty: string;
  }
}

window.myProperty = "Hello World";
```





### `.d.ts`

#### 介绍

单独使用的模块，一般会同时提供一个单独的类型声明文件（declaration file），把本模块的外部接口的所有类型都写在这个文件里面，便于模块使用者了解接口，也便于编译器检查使用者的用法是否正确。



#### 类型声明文件的来源 [#](https://wangdoc.com/typescript/d.ts#类型声明文件的来源) 

类型声明文件主要有以下三种来源。

##### TypeScript 编译器自动生成

使用编译选项`declaration`，编译器就会在编译时自动生成单独的类型声明文件。这个一般写库的时候都会开启。

```json
{
  "compilerOptions": {
    "declaration": true
  }
}
```









##### TypeScript 内置类型文件

安装 TypeScript 语言时，会同时安装一些内置的类型声明文件，主要是内置的全局对象（JavaScript 语言接口和运行环境 API）的类型声明。

这些内置声明文件位于 TypeScript 语言安装目录的`lib`文件夹内，数量大概有几十个，下面是其中一些主要文件。

- lib.d.ts
- lib.dom.d.ts
- lib.es2015.d.ts
- lib.es2016.d.ts
- lib.es2017.d.ts
- lib.es2018.d.ts
- lib.es2019.d.ts
- lib.es2020.d.ts
- lib.es5.d.ts
- lib.es6.d.ts

TypeScript 编译器会自动根据编译目标`target`的值，加载对应的内置声明文件，所以不需要特别的配置。但是，可以使用编译选项`lib`，指定加载哪些内置声明文件。

```
{
  "compilerOptions": {
    "lib": ["dom", "es2021"]
  }
}
```

上面示例中，`lib`选项指定加载`dom`和`es2021`这两个内置类型声明文件。

编译选项`noLib`会禁止加载任何内置声明文件。











##### 外部模块的类型声明文件

如果项目中使用了外部的某个第三方代码库，那么就需要这个库的类型声明文件。

分成三种情况:

###### （1）这个库自带了类型声明文件

如果这个库的源码包含了`[vendor].d.ts`文件。比如`moment`这个库就自带`moment.d.ts`。用的时候就不用操心了。





###### （2）这个库没有自带，但是可以找到社区制作的类型声明文件

TypeScript 社区主要使用 [DefinitelyTyped 仓库](https://github.com/DefinitelyTyped/DefinitelyTyped)，各种类型声明文件都会提交到那里。

这些声明文件都会作为一个单独的库，发布到 npm 的`@types`名称空间之下。比如，jQuery 的类型声明文件就发布成`@types/jquery`这个库，使用时安装这个库就可以了。

```
$ npm install @types/jquery --save-dev
```

执行上面的命令，`@types/jquery`这个库就安装到项目的`node_modules/@types/jquery`目录，里面的`index.d.ts`文件就是 jQuery 的类型声明文件。如果类型声明文件不是`index.d.ts`，那么就需要在`package.json`的`types`或`typings`字段，指定类型声明文件的文件名。

TypeScript 会自动加载`node_modules/@types`目录下的模块，但可以使用编译选项`typeRoots`改变这种行为。

```
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

上面示例表示，TypeScript 不再去`node_modules/@types`目录，而是去跟当前`tsconfig.json`同级的`typings`和`vendor/types`子目录，加载类型模块了。

默认情况下，TypeScript 会自动加载`typeRoots`目录里的所有模块，编译选项`types`可以指定加载哪些模块。

```
{
  "compilerOptions": {
    "types" : ["jquery"]
  }
}
```

上面设置中，`types`属性是一个数组，成员是所要加载的类型模块，要加载几个模块，这个数组就有几个成员，每个类型模块在`typeRoots`目录下都有一个自己的子目录。这样的话，TypeScript 就会自动去`jquery`子目录，加载 jQuery 的类型声明文件。





###### （3）找不到类型声明文件，需要自己写

有时实在没有第三方库的类型声明文件，又很难完整给出该库的类型描述，这时你可以告诉 TypeScript 相关对象的类型是`any`。比如，使用 jQuery 的脚本可以写成下面这样。

```
declare var $:any

// 或者
declare type JQuery = any;
declare var $:JQuery;
```

上面代码表示，jQuery 的`$`对象是外部引入的，类型是`any`，也就是 TypeScript 不用对它进行类型检查。

也可以采用下面的写法，将整个外部模块的类型设为`any`。

```
declare module '模块名';
```

上面的命令指定模块的所有接口都将视为`any`类型。



#### 模块发布

当前模块如果包含自己的类型声明文件，可以在 package.json 文件里面添加一个`types`字段或`typings`字段，指明类型声明文件的位置。这样别人用你的库的时候就不用做额外处理该库类型的事情了。注意，如果类型声明文件名为`index.d.ts`，且在项目的根目录中，那就不需要在`package.json`里面注明了。

```json
{
  "name": "awesome",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts" //***
}
```

有时，类型声明文件会单独发布成一个 npm 模块，这时用户就必须同时加载该模块。

```json
{
  "name": "browserify-typescript-extension",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts",
  "dependencies": {
    "browserify": "latest",
    "@types/browserify": "latest",
    "typescript": "next"
  }
}
```



### 三斜杠语法

全部看这：https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html 一般现在都用import代替了



#### 介绍

如果打开了编译参数`noResolve`，则忽略三斜杠指令。将其当作一般的注释，原样保留在编译产物中。

如果类型声明文件的内容非常多，可以拆分成多个文件，然后入口文件使用三斜杠命令，加载其他拆分后的文件。

举例来说，入口文件是`main.d.ts`，里面的接口定义在`interfaces.d.ts`，函数定义在`functions.d.ts`。那么，`main.d.ts`里面可以用三斜杠命令，加载后面两个文件。

```
/// <reference path="./interfaces.d.ts" />
/// <reference path="./functions.d.ts" />
```

三斜杠命令（`///`）是一个 TypeScript 编译器命令，用来指定编译器行为。它只能用在文件的头部，如果用在其他地方，会被当作普通的注释。另外，若一个文件中使用了三斜线命令，那么在三斜线命令之前只允许使用单行注释、多行注释和其他三斜线命令，否则三斜杠命令也会被当作普通的注释。

除了拆分类型声明文件，三斜杠命令也可以用于普通脚本加载类型声明文件。

三斜杠命令主要包含三个参数，代表三种不同的命令。

- path
- types
- lib

#### 



#### `/// <reference path="" />`

告诉编译器在编译时需要包括的文件，常用来声明当前脚本依赖的类型文件。

```
/// <reference path="./lib.ts" />

let count = add(1, 2);
```

编译当前脚本时，还会同时编译`./lib.ts`。编译产物会有两个 JS 文件，一个当前脚本，另一个就是`./lib.js`。

下面的例子是当前脚本依赖于 Node.js 类型声明文件。

```
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("https://www.typescriptlang.org");
```

编译器会在预处理阶段，找出所有三斜杠引用的文件，将其添加到编译列表中，然后一起编译。

`path`参数指定了所引入文件的路径。如果该路径是一个相对路径，则基于当前脚本的路径进行计算。



默认情况下，每个三斜杠命令引入的脚本，都会编译成单独的 JS 文件。如果希望编译后只产出一个合并文件，可以使用编译选项`outFile`。但是，`outFile`编译选项不支持合并 CommonJS 模块和 ES 模块，只有当编译参数`module`的值设为 None、System 或 AMD 时，才能编译成一个文件。



#### `/// <reference types="" />`

types 参数用来告诉编译器当前脚本依赖某个 DefinitelyTyped 类型库，通常安装在`node_modules/@types`目录。

types 参数的值是类型库的名称，也就是安装到`node_modules/@types`目录中的子目录的名字。

```
/// <reference types="node" />
```

上面示例中，这个三斜杠命令表示编译时添加 Node.js 的类型库，实际添加的脚本是`node_modules`目录里面的`@types/node/index.d.ts`。

可以看到，这个命令的作用类似于`import`命令。

注意，这个命令只在你自己手写类型声明文件（`.d.ts`文件）时，才有必要用到，也就是说，只应该用在`.d.ts`文件中，普通的`.ts`脚本文件不需要写这个命令。如果是普通的`.ts`脚本，可以使用`tsconfig.json`文件的`types`属性指定依赖的类型库。

#### `/// <reference lib="" />`

`/// <reference lib="..." />`命令允许脚本文件显式包含内置 lib 库，等同于在`tsconfig.json`文件里面使用`lib`属性指定 lib 库。

前文说过，安装 TypeScript 软件包时，会同时安装一些内置的类型声明文件，即内置的 lib 库。这些库文件位于 TypeScript 安装目录的`lib`文件夹中，它们描述了 JavaScript 语言和引擎的标准 API。

库文件并不是固定的，会随着 TypeScript 版本的升级而更新。库文件统一使用“lib.[description].d.ts”的命名方式，而`/// <reference lib="" />`里面的`lib`属性的值就是库文件名的`description`部分，比如`lib="es2015"`就表示加载库文件`lib.es2015.d.ts`。

```
/// <reference lib="es2017.string" />
```

上面示例中，`es2017.string`对应的库文件就是`lib.es2017.string.d.ts`。





## TS检查

### js文件

#### 使用 @ts-check 启用检查

要在 JavaScript 文件中启用错误检查，请在文件的第一行添加：// @ts-check。
使用 jsconfig.json 启用批量检查
目录中存在 tsconfig.json 文件表明该目录是 TypeScript 项目的根目录。该 tsconfig.json 文件指定编译项目所需的根文件和编译器选项。
JavaScript 项目可以使用 jsconfig.json 文件来代替，它的作用几乎相同，但默认启用了一些与 JavaScript 相关的编译器标志。

更多参见：https://www.typescriptlang.org/docs/handbook/tsconfig-json.html



#### 使用 @ts-nocheck 跳过检查

当使用 jsconfig.json 启用批量检查时，可以通过在文件第一行添加 // @ts-nocheck 跳过对该文件的检查。



### ts文件

#### 使用 @ts-ignore 或 @ts-expect-error 来忽略错误

可以通过在前一行添加// @ts-ignore或//@ts-expect-error忽略特定行上的错误。



使用 `// @ts-nocheck` 注释会忽略整个文件的类型检查，而使用 `// @ts-ignore` 注释会忽略特定行或代码块的类型检查。




## TypeScript 开发辅助工具

#### [TypeScript exercises](https://typescript-exercises.github.io/#exercise=3&file=%2Findex.ts)

ts习题

#### 16.1 [TypeScript Playground](https://www.typescriptlang.org/play)

> 简介：TypeScript 官方提供的在线 TypeScript 运行环境，利用它你可以方便地学习 TypeScript 相关知识与不同版本的功能特性。
>
> 在线地址：[www.typescriptlang.org/play/](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay%2F)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-BItm42.jpg)

除了 TypeScript 官方的 Playground 之外，你还可以选择其他的 Playground，比如 [codepen.io](https://link.juejin.cn?target=https%3A%2F%2Fcodepen.io%2F)、[stackblitz](https://link.juejin.cn?target=https%3A%2F%2Fstackblitz.com%2F) 或 [jsbin.com](https://link.juejin.cn?target=https%3A%2F%2Fjsbin.com%2F%3Fjs) 等。

#### 16.2 [TypeScript UML Playground](https://link.juejin.cn?target=https%3A%2F%2Ftsuml-demo.firebaseapp.com%2F)

> 简介：一款在线 TypeScript UML 工具，利用它你可以为指定的 TypeScript 代码生成 UML 类图。
>
> 在线地址：[tsuml-demo.firebaseapp.com/](https://link.juejin.cn?target=https%3A%2F%2Ftsuml-demo.firebaseapp.com%2F)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-cut0Nn.jpg)

#### 16.3 [JSON TO TS](https://link.juejin.cn?target=http%3A%2F%2Fwww.jsontots.com%2F)

> 简介：一款 TypeScript 在线工具，利用它你可以为指定的 JSON 数据生成对应的 TypeScript 接口定义。
>
> 在线地址：[www.jsontots.com/](https://link.juejin.cn?target=http%3A%2F%2Fwww.jsontots.com%2F)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-hr14V8.jpg)

除了使用 [jsontots](https://link.juejin.cn?target=http%3A%2F%2Fwww.jsontots.com%2F) 在线工具之外，对于使用 VSCode IDE 的小伙们还可以安装 [JSON to TS](https://link.juejin.cn?target=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3DMariusAlchimavicius.json-to-ts) 扩展来快速完成  **JSON to TS** 的转换工作。

#### 16.4 [Schemats](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSweetIQ%2Fschemats)

> 简介：利用 Schemats，你可以基于（Postgres，MySQL）SQL 数据库中的 schema 自动生成 TypeScript 接口定义。
>
> 在线地址：[github.com/SweetIQ/sch…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FSweetIQ%2Fschemats)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-0JKHu4.jpg)

#### 16.5 [TypeScript AST Viewer](https://link.juejin.cn?target=https%3A%2F%2Fts-ast-viewer.com%2F)

> 简介：一款 TypeScript AST 在线工具，利用它你可以查看指定 TypeScript 代码对应的 AST（Abstract Syntax Tree）抽象语法树。
>
> 在线地址：[ts-ast-viewer.com/](https://link.juejin.cn?target=https%3A%2F%2Fts-ast-viewer.com%2F)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vTMz5J.jpg)

对于了解过 AST 的小伙伴来说，对 [astexplorer](https://link.juejin.cn?target=https%3A%2F%2Fastexplorer.net%2F) 这款在线工具应该不会陌生。该工具除了支持 JavaScript 之外，还支持 CSS、JSON、RegExp、GraphQL 和 Markdown 等格式的解析。

#### 16.6 [TypeDoc](https://link.juejin.cn?target=https%3A%2F%2Ftypedoc.org%2F)

> 简介：TypeDoc 用于将 TypeScript 源代码中的注释转换为 HTML 文档或 JSON 模型。它可灵活扩展，并支持多种配置。
>
> 在线地址：[typedoc.org/](https://link.juejin.cn?target=https%3A%2F%2Ftypedoc.org%2F)









# 关键字、运算符





## 关键字

### 命名空间`namespace` 

`namespace` 关键字来描述分组，如下所示。

```ts
namespace Utility {
  export function log(msg) {
    console.log(msg);
  }
  export function error(msg) {
    console.log(msg);
  }
}

// usage
Utility.log('Call me');
Utility.error('maybe');
```



### 键值获取 keyof

keyof 可以获取一个类型所有键，<font color="red">返回一个联合类型</font>，如下：

```typescript
type Person = {
  name: string;
  age: number;
}
type PersonKey = keyof Person;  // PersonKey得到的类型为 'name' | 'age'
```

keyof 的一个典型用途是限制访问对象的 key 合法化，因为 any 做索引是不被接受的。

```typescript
function getValue (p: Person, k: keyof Person) {
  return p[k];  // 如果k不如此定义，则无法以p[k]的代码格式通过编译
}
```



### 实例类型获取 typeof

typeof 是获取一个对象/实例的类型，它会根据左侧值自动决定应该执行哪种行为。如下：

```typescript
const me: Person = { name: 'gzx', age: 16 };
type P = typeof me;  // { name: string, age: number | undefined }
const you: typeof me = { name: 'mabaoguo', age: 69 }  // 可以通过编译

function toArray(x: number): Array<number> {
  return [x];
}
type Func = typeof toArray; // -> (x: number) => number[]

const typestr = typeof me;   // typestr的值为"object"
```

typeof 可以和 keyof 一起使用(因为 typeof 是返回一个类型嘛)，如下：

```typescript
type PersonKey = keyof typeof me;   // 'name' | 'age'
```



### 遍历属性 in

#### 用于对类型进行遍历

in 只能用在类型的定义中，可以对类型进行遍历，如下：

```typescript
// 这个类型可以将任何类型的键值转化成number类型
type TypeToNumber<T> = {
  [key in keyof T]: number
}
```

`keyof`返回泛型 T 的所有键枚举类型，`key`是自定义的任何变量名，中间用`in`链接，外围用`[]`包裹起来(这个是固定搭配)，冒号右侧`number`将所有的`key`定义为`number`类型。

于是可以这样使用了：

```typescript
const obj: TypeToNumber<Person> = { name: 10, age: 10 }
```



#### 用于类型保护

```tsx
if ('role' in person) { // 这样ts就能确定 person 有 role属性。
    additionalInformation = person.role;
}
```









### is

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

Is关键字经常用来封装”类型保护函数”，其实跟断言一样，都是手动指定，从而缩小参数的类型范围。

```tsx
interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

export function isAdmin(person: Person): person is Admin { /*******************/
    return person.type === 'admin';
}

export function isUser(person: Person): person is User { /*********************/
    return person.type === 'user';
}

export function logPerson(person: Person) {
    let additionalInformation: string = '';
    if (isAdmin(person)) { //如果没有 前面的 is 则下面的.role会报错
        additionalInformation = person.role;
    }
    if (isUser(person)) { //
        additionalInformation = person.occupation;
    }
    console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}
```



### satisfies

`satisfies`运算符用来检测某个值是否符合指定类型。有时候，不方便将某个值指定为某种类型，但是希望这个值符合类型条件，这时候就可以用`satisfies`运算符对其进行检测。

使用`satisfies`运算符，对`palette`进行类型检测，但是不改变 TypeScript 对`palette`的类型推断。

```typescript
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255] // 报错
} satisfies Record<Colors, string|RGB>;

const greenComponent = palette.green.substring(1); // 不报错
```

上面示例中，变量`palette`的值后面增加了`satisfies Record<Colors, string|RGB>`，表示该值必须满足`Record<Colors, string|RGB>`这个条件，所以能够检测出属性名`bleu`的拼写错误。同时，它不会改变`palette`的类型推断，所以，TypeScript 知道`palette.green`是一个字符串，对其调用`substring()`方法就不会报错。





### const

将这个表达式的每个属性、每个成员以及嵌套的对象和数组都标记为只读。这样，这个表达式将不再被认为是一个可变的对象，而是一个不可更改的字面量值。

```ts
typescriptCopy code
const person = {
  name: "John",
  age: 30,
  hobbies: ["reading", "coding"] as const,
} as const;

// person 的类型变为：
// {
//   readonly name: "John";
//   readonly age: 30;
//   readonly hobbies: readonly ["reading", "coding"];
// }
```





### readonly

只读属性可用于 接口 和 类的定义中

```typescript
interface Person {
  readonly name: string;
  age?: number;
}
```



在对象中使用 as const 也可以把属性变成只读的

```tsx
const iconProps={
    size: [Number, String],
    color: String
} as const  
```





### extends

1. 用于接口或类的继承
2. 用于泛型约束



## 运算符

### 非空断言运算符 !

这个运算符可以用在变量名或者函数名之后，用来强调对应的元素是非 null|undefined 的

```typescript
function onClick(callback?: () => void) {
  callback!();		// 参数是可选入参，加了这个感叹号!之后，TS编译不报错
}
```



### 数字分隔符_

```typescript
let num:number = 1_2_345.6_78_9
```

_可以用来对长数字做任意的分隔，主要设计是为了便于数字的阅读，编译出来的代码是没有下划线的。





### 方括号运算符（`[]`）

用于取出对象的键类型，比如`T[K]`会返回对象`T`的属性`K`的类型。

```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

// Age 的类型是 number
type Age = Person['age'];
```

上面示例中，`Person['age']`返回属性`age`的类型，本例是`number`。

方括号的参数如果是联合类型，那么返回的也是联合类型。

```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

// number|string|boolean
type A = Person[keyof Person];
```

上面示例中，方括号里面是属性名的联合类型，所以返回的也是对应的属性值的联合类型。

方括号运算符的参数也可以是属性名的索引类型。

```tsx
type TestObj = {
    x:number,
    y:string
}
type Obj = {
    [key:string]: number|boolean|TestObj,
  };
  
  const obj:Obj = {
    a:1,
    b:true,
    c:3,
    d:{
        x:1,
        y:'1'
    }
  }
```

上面示例中，`Obj`的属性名是字符串的索引类型，所以可以写成`Obj[string]`，代表所有字符串属性名。

这个语法对于数组也适用，可以使用`number`作为方括号的参数。

```
// MyArray 的类型是 { [key:number]: string }
const MyArray = ['a','b','c'];

// 等同于 (typeof MyArray)[number]
// 返回 string
type Person = typeof MyArray[number];
```







# 类型



## 各种类型及其类型注解

### **any、never 、 void 的区别**

- any
  - TS中对于被标记为 `any` 类型的变量，是没有进行类型检查而直接通过编译阶段的检查。
  - 允许赋值为任意类型
  - 可以访问任意属性和方法
  - 变量如果在声明的时候未指定其类型，那么他会被识别为任意值类型

- void 表示没有任何类型（可以被赋值为 null 和 undefined）。
- never 表示一个不包含值的类型，即表示永远不存在的值。
- 拥有 void 返回值类型的函数能正常运行。拥有 never 返回值类型的函数无法正常返回，无法终止，或会抛出异常。



### Any和Unknown 

#### any

在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的<font color="red">顶级类型</font>（也被称作全局超级类型）。

```typescript
let notSure: any = 666;
notSure = "semlinker";
notSure = false;
```

TypeScript 允许我们对 `any` 类型的值执行任何操作，而无需事先执行任何形式的检查。变回js了。

隐式具有any类型的情况：

1. 声明变量 不提供类型也不提供默认值
2. 函数参数不加类型



#### unknown

##### 介绍

就像所有类型都可以赋值给 `any`，所有类型也<font color="red">都可以赋值给 `unknown`。</font>这使得 `unknown` 成为 TypeScript 类型系统的另一种更安全的顶级类型。（就理解成替代any的）

但是`unknown` 类型<font color="red">只能被赋值给 `any` 类型和 `unknown` 类型本身</font>。

unknown 不能调用任何方法，而 any 可以。

```typescript
let value: unknown;

value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```





##### 缩小 `unknown` 类型范围

###### 通过if去限制

我们可以通过不同的方式将 `unknown` 类型缩小为更具体的类型范围，包括 `typeof` 运算符，`instanceof` 运算符和自定义类型保护函数。以下示例说明了 `value` 如何在两个 `if` 语句分支中获得更具体的类型：

```typescript
function stringifyForLogging(value: unknown): string {
  if (typeof value === "function") {
    // Within this branch, `value` has type `Function`,
    // so we can access the function's `name` property
    const functionName = value.name || "(anonymous)";
    return `[function ${functionName}]`;
  }

  if (value instanceof Date) {
    // Within this branch, `value` has type `Date`,
    // so we can call the `toISOString` method
    return value.toISOString();
  }

  return String(value);
}
```



###### 使用类型断言

如果要强制编译器信任类型为 `unknown` 的值为给定类型，则可以使用类似这样的类型断言：

```typescript
const value: unknown = "Hello World";
const someString: string = value as string;
const otherString = someString.toUpperCase();  // "HELLO WORLD"
```



##### unknown海纳百川

###### 联合类型中的 `unknown` 类型

在联合类型中，`unknown` 类型会吸收任何类型。这就意味着如果任一组成类型是 `unknown`，联合类型也会相当于 `unknown`：

```typescript
type UnionType1 = unknown | null;       // unknown
type UnionType2 = unknown | undefined;  // unknown
type UnionType3 = unknown | string;     // unknown
type UnionType4 = unknown | number[];   // unknown
```

这条规则的一个意外是 `any` 类型。如果至少一种组成类型是 `any`，联合类型会相当于 `any`：

```pgsql
type UnionType5 = unknown | any;  // any
```

所有类型的值都可以被定义为 `unknown` 类型，其中也包括了所有的 `string` 类型，因此，`unknown | string` 就是表示和 `unknown` 类型本身相同的值集。因此，编译器可以将联合类型简化为 `unknown` 类型。



###### 交叉类型中的 `unknown` 类型

在交叉类型中，任何类型都可以吸收 `unknown` 类型。这意味着将任何类型与 `unknown` 相交不会改变结果类型：

```typescript
type IntersectionType1 = unknown & null;       // null
type IntersectionType2 = unknown & undefined;  // undefined
type IntersectionType3 = unknown & string;     // string
type IntersectionType4 = unknown & number[];   // number[]
type IntersectionType5 = unknown & any;        // any
```



##### 要运算类型 `unknown` 

`unknown` 类型的值不能用作大多数运算符的操作数。这是因为如果我们不知道我们正在使用的值的类型，大多数运算符不太可能产生有意义的结果。

你可以在类型为 `unknown` 的值上使用的运算符只有四个相等和不等运算符：

- `===`
- `==`
- `!==`
- `!=`







### Void 类型

某种程度上来说，void 类型像是与 any 类型相反，它表示没有任何类型。当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```typescript
// 声明函数返回值为void
function warnUser(): void {
  console.log("This is my warning message");
}
```

需要注意的是，声明一个 void 类型的变量没有什么作用，因为在严格模式下，它的值只能为 `undefined`：

```typescript
let unusable: void = undefined;
```



### Never 类型

`never` 类型表示的是那些<font color="red">永不存在的值的类型。 不能给他赋任何值。但他可以赋给任何值</font>没有类型是 `never` 的子类型或可以赋值给 `never` 类型（除了 `never` 本身之外）。 即使 `any` 也不可以赋值给 `never`。`never` 类型是那些总是会抛出异常或函数无法正常返回，无法终止，或会抛出异常。还有永远没有相交的类型也会变成never类型。

```typescript
type human = 'boy' & 'girl' // 这两个单独的字符串类型并不可能相交，故human为never类型

function foo(): never { throw new Error('error message') }  // throw error 返回值是never
function foo(): never { while(true){} }  // 这个死循环的也会无法正常退出
function foo(): never { let count = 1; while(count){ count ++; } }  // Error: 这个无法将返回值定义为never，因为无法在静态编译阶段直接识别出

/*在一个函数中调用了返回 never 的函数后，之后的代码都会变成deadcode*/
function test() {
  foo();  		// 这里的foo指上面返回never的函数
  console.log(111); 	// Error: 编译器报错，此行代码永远不会执行到
}
```



任何类型联合上 never 类型，还是原来的类型：

```typescript
type language = 'ts' | never   // language的类型还是'ts'类型
```





在 TypeScript 中，可以利用 never 类型的特性来实现全面性检查，具体示例如下：

```typescript
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

注意在 else 分支里面，我们把收窄为 never 的 foo 赋值给一个显示声明的 never 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事修改了 Foo 的类型：

```typescript
type Foo = string | number | boolean;
```

然而他忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 else 分支的 foo 类型会被收窄为 `boolean` 类型，导致无法赋值给 never 类型，这时就会产生一个编译错误。通过这个方式，我们可以确保`controlFlowAnalysisWithNever` 方法总是穷尽了 Foo 的所有可能类型。<font color="red">**使用 never 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。**</font>





### 基本类型

number、string、boolean、null、undifined、binint、symbol 直接写

```typescript
let age:number=15
let a: symbol = Symbol()
```

TypeScript 中还有一个 **unique symbol** 类型，它是symbol的子类型，这种类型的值只能由`Symbol()`或`Symbol.for()`创建。这种类型的值只能用于常量的定义和用于属性名。定义unique symbol类型的值，必须用 const 而不能用let来声明。下面来看在TypeScript中使用Symbol值作为属性名的例子：

```typescript
const key1: unique symbol = Symbol()
let key2: symbol = Symbol()
const obj = {
    [key1]: 'value1',
    [key2]: 'value2'
}
console.log(obj[key1]) // value1
console.log(obj[key2]) // value2
```









### 数组

#### 两种写法

```typescript
let nums:number[]=[1,3,5] 或 let nums:[number,string] // 即
let str:Array<string｜number>=['a','b','c']
```

TypeScript 还提供了 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，用以确保数组创建后再也不能被修改。

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```





#### 函数数组

```tsx
type MyFunctionType = (arg1: string, arg2: number) => boolean;

const myFunctionArray: MyFunctionType[]
```









### 元组

元组是另一种类型的数组，它明确包含多少个元素以及特定索引对应的类型。**数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组**。元组可用于定义具有有限数量的未命名属性的类型。

```tsx
let position:[number,number]=[1,2]
```

元组初始化的时候，我们必须提供每个属性的值







### 枚举

#### 介绍

它既是一种类型，也是一个值。Enum 结构是一个值，编译后会变成 JavaScript 对象，留在代码中。Enum 结构比较适合的场景是，成员的值不重要，名字更重要，从而增加代码的可读性和可维护性。



#### 用法



如果枚举值里所有成员都是字面量类型的值，那么枚举的每个成员和枚举值本身都可以作为类型来使用。满足条件的枚举成员的值有以下三种：

- 没有初始值的枚举成员，例如：`enum E { A }`
- 值为字符串字面量，例如：`enum E { A = 'a' }`
- 值为数值字面量，或者带有`-`符号的数值字面量，例如：`enum E { A = 1 }`、`enum E { A = -1 }`

成员可以当类型使用，枚举本身也可以当类型使用

```typescript
enum Animal {
  Dog = 1,
  Cat = 2
}

interface Dog {
  type: Animal.Dog; 
}
interface Cat {
  type: Animal.Cat; 
}

let cat: Cat = {
  type: Animal.Dog // error [ts] 不能将类型“Animal.Dog”分配给类型“Animal.Cat”
};
let dog: Dog = {
  type: Animal.Dog
};
```



#### 枚举分类



##### 数字枚举

枚举成员是有值的，默认是从0开始自增的数值，当然也可以自己初始化

```typescript
enum Direction{Up=10,Down=4,Left=8,Right=99}
//或
enum Direction{Up=10,Down,Left,Right}//此时Down为11，Left为12，Right为13
```



根据编译后的结果可知：<font color="red">数字枚举还支持反向映射</font>

```tsx
"use strict";
var Direction;
(function (Direction) {
  Direction[(Direction["NORTH"] = 0)] = "NORTH";
  Direction[(Direction["SOUTH"] = 1)] = "SOUTH";
  Direction[(Direction["EAST"] = 2)] = "EAST";
  Direction[(Direction["WEST"] = 3)] = "WEST";
})(Direction || (Direction = {}));
var dir = Direction.NORTH;
```





##### 字符串枚举

```typescript
enum Direction{Up='UP',Down='DOWN',Left='LEFT',Right='RIGHT'} 
//因为字符串不会自增长，所以字符串枚举的每个成员都必须有初始值
```





##### 异构枚举

异构枚举的成员值是数字和字符串的混合：

```typescript
enum Enum {
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}
```

以上代码对于的 ES5 代码如下：

```typescript
"use strict";
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
    Enum[Enum["B"] = 1] = "B";
    Enum["C"] = "C";
    Enum["D"] = "D";
    Enum[Enum["E"] = 8] = "E";
    Enum[Enum["F"] = 9] = "F";
})(Enum || (Enum = {}));
```

通过观察上述生成的 ES5 代码，我们可以发现数字枚举相对字符串枚举多了 “反向映射”：

```javascript
console.log(Enum.A) //输出：0
console.log(Enum[0]) // 输出：A
```



##### 常量枚举

在TypeScript中，定义了枚举值之后，编译成 JavaScript 的代码会创建一个对应的对象，这个对象可以在程序运行时使用。TypeScript 中有一个const enum(常量枚举)，在定义枚举的语句之前加上`const`关键字，这样编译后的代码<font color="red">不会创建这个对象</font>，只是会从枚举里拿到相应的值进行替换：

```typescript
enum Status {
  Off,
  On
}
const enum Animal { // 常量枚举
  Dog,
  Cat
}
const status = Status.On;
const animal = Animal.Dog;
```

上面的代码编译成 JavaScript 之后是这样的：

```typescript
var Status;
(function(Status) {
  Status[(Status["Off"] = 0)] = "Off";
  Status[(Status["On"] = 1)] = "On";
})(Status || (Status = {}));
var status = Status.On;
var animal = 0; // Dog 
```

对于 Status 的处理，先是定义一个变量 Status，然后定义一个立即执行函数，在函数内给 Status 添加对应属性，首先`Status[“Off”] = 0`是给`Status`对象设置`Off`属性，并且值设为 0，这个赋值表达式的返回值是等号右边的值，也就是 0，所以`Status[Status[“Off”] = 0] = "Off"`相当于`Status[0] = “Off”`。创建了这个对象之后，将 Status 的 On 属性值赋值给 status；

#### 数值 Enum 存在反向映射

数值 Enum 存在反向映射，即可以通过成员值获得成员名。

```ts
enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

console.log(Weekdays[3]) // Wednesday
```

上面示例中，Enum 成员`Wednesday`的值等于3，从而可以从成员值`3`取到对应的成员名`Wednesday`，这就叫反向映射。

这是因为 TypeScript 会将上面的 Enum 结构，编译成下面的 JavaScript 代码。

```ts
var Weekdays;
(function (Weekdays) {
    Weekdays[Weekdays["Monday"] = 1] = "Monday";
    Weekdays[Weekdays["Tuesday"] = 2] = "Tuesday";
    Weekdays[Weekdays["Wednesday"] = 3] = "Wednesday";
    Weekdays[Weekdays["Thursday"] = 4] = "Thursday";
    Weekdays[Weekdays["Friday"] = 5] = "Friday";
    Weekdays[Weekdays["Saturday"] = 6] = "Saturday";
    Weekdays[Weekdays["Sunday"] = 7] = "Sunday";
})(Weekdays || (Weekdays = {}));
```

上面代码中，实际进行了两组赋值，以第一个成员为例。

```ts
Weekdays[
  Weekdays["Monday"] = 1
] = "Monday";
```

上面代码有两个赋值运算符（`=`），实际上等同于下面的代码。

```ts
Weekdays["Monday"] = 1;
Weekdays[1] = "Monday";
```

注意，这种情况只发生在数值 Enum，对于字符串 Enum，不存在反向映射。这是因为字符串 Enum 编译后只有一组赋值。

```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 编译后
var MyEnum;
(function (MyEnum) {
    MyEnum["A"] = "a";
    MyEnum["B"] = "b";
})(MyEnum || (MyEnum = {}));
```





#### 枚举合并

说完常见的枚举类型，最后来看看枚举合并的概念。对于枚举类型的值，我们可以分开进行声明：

```typescript
enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY
 }

enum Day {
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
 }

```

这时 TypeScript 就会对这个枚举值进行**合并操作**，合并后编译为JavaScript的代码如下：

```typescript
var Day = void 0;
(function (Day) {
  Day[Day["SUNDAY"] = 0] = "SUNDAY";
  Day[Day["MONDAY"] = 1] = "MONDAY";
  Day[Day["TUESDAY"] = 2] = "TUESDAY";
  Day[Day["WEDNESDAY"] = 3] = "WEDNESDAY";
  Day[Day["THURSDAY"] = 4] = "THURSDAY";
  Day[Day["FRIDAY"] = 5] = "FRIDAY";
  Day[Day["SATURDAY"] = 6] = "SATURDAY";
})(Day || (Day = {}));
```



#### 不能被直接keyof

取出 Enum 结构的所有成员名：

```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// 'A'|'B'
type Foo = keyof typeof MyEnum;
```



如果直接keyof Enum：

```ts
type Foo = keyof MyEnum; //这样相当于keyof number。
// "toString" | "toFixed" | "toExponential" |
// "toPrecision" | "valueOf" | "toLocaleString"
```

这是因为 Enum 作为类型，本质上属于`number`或`string`的一种变体，而`typeof MyEnum`会将`MyEnum`当作一个值处理，从而先其转为对象类型，就可以再用`keyof`运算符返回该对象的所有属性名。



#### 如果想取出Enum所有的成员值

可以使用`in`运算符。

```ts
enum MyEnum {
  A = 'a',
  B = 'b'
}

// { a: any, b: any }
type Foo = { [key in MyEnum]: any };
```





### 对象

#### 用法

```typescript
let obj: object

let person: {
  name?: string; //对象里面的可选属性可以放在任何位置
  age: number //若一行只指定一个属性类型，可以去掉分号
  isProgrammer: boolean;
};

person = {
  name: 'ConardLi',
  age: 17,
  isProgrammer: true,
};

//上面也可以写到一起去：
let person: {name: string;sayHi(age:string):void}={//在一行代码中指定对象的多个属性类型时使用分号来分隔
  name:'jace',
  sayHi(){}
}
//函数也可以写成 sayHi:()=>void  的形式
```







#### Object 类型

Object 类型：它是所有 Object 类的实例的类型，它由以下两个接口来定义：

- Object 接口定义了 Object.prototype 原型对象上的属性；

```typescript
// node_modules/typescript/lib/lib.es5.d.ts
interface Object {
  constructor: Function;
  toString(): string;
  toLocaleString(): string;
  valueOf(): Object;
  hasOwnProperty(v: PropertyKey): boolean;
  isPrototypeOf(v: Object): boolean;
  propertyIsEnumerable(v: PropertyKey): boolean;
}
```

- ObjectConstructor 接口定义了 Object 类的属性。

```typescript
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  /** Invocation via `new` */
  new(value?: any): Object;
  /** Invocation via function calls */
  (value?: any): any;
  readonly prototype: Object;
  getPrototypeOf(o: any): any;
  // ···
}

declare var Object: ObjectConstructor;
```

Object 类的所有实例都继承了 Object 接口中的所有属性。

#### {} 类型

{} 类型描述了一个没有成员的对象。当你试图访问这样一个对象的任意属性时，TypeScript 会产生一个编译时错误。

```typescript
// Type {}
const obj = {};

// Error: Property 'prop' does not exist on type '{}'.
obj.prop = "semlinker";
```

但是，你仍然可以使用在 Object 类型上定义的所有属性和方法，这些属性和方法可通过 JavaScript 的原型链隐式地使用：

```typescript
// Type {}
const obj = {};

// "[object Object]"
obj.toString();
```





### 字面量类型

#### 字面量就是常量

```typescript
let num: 1 | 2 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';
```

以上示例中的 `1`、`2` 或 `'click'` 被称为字面量类型，用来约束取值只能是某几个值中的一个。





#### 模板字面量类型

##### 基本使用

模板字面量类型被括在反引号中，同时可以包含 `${T}` 形式的占位符，其中类型变量 T 的类型可以是 `string`、`number`、`boolean` 或 `bigint` 类型。

模板字面量类型不仅为我们提供了连接字符串字面量的能力，而且还可以把非字符串基本类型的字面量转换为对应的字符串字面量类型。下面我们来举一些具体的例子：

```typescript
type EventName<T extends string> = `${T}Changed`;
type Concat<S1 extends string, S2 extends string> = `${S1}-${S2}`;
type ToString<T extends string | number | boolean | bigint> = `${T}`;

type T0 = EventName<"foo">; // 'fooChanged'
type T1 = Concat<"Hello", "World">; // 'Hello-World'
type T2 = ToString<"阿宝哥" | 666 | true | -1234n>; // "阿宝哥" | "true" | "666" | "-1234"

/*当类型占位符的实际类型是联合类型时*/
type T3 = EventName<"foo" | "bar" | "baz">; // "fooChanged" | "barChanged" | "bazChanged"
type T4 = Concat<"top" | "bottom", "left" | "right">; // "top-left" | "top-right" | "bottom-left" | "bottom-right"
```



##### 当类型占位符的实际类型是联合类型

当类型占位符的实际类型是联合类型（A ｜B ｜C）的话，就会被自动展开：

```typescript
`[${A|B|C}]` => `[${A}]` | `[${B}]` | `[${C}]`
```

对于包含多个类型占位符的情形，比如 `Concat` 工具类型。多个占位符中的联合类型解析为叉积：

```typescript
`${A|B}-${C|D}` => `${A}-${C}` | `${A}-${D}` | `${B}-${C}` | `${B}-${D}`
```





##### 结合工具类型使用

在使用模板字面量类型的过程中，我们还可以使用 TypeScript 提供的，用于处理字符串类型的内置工具类型，比如 **Uppercase**、**Lowercase**、**Capitalize** 和 **Uncapitalize**。具体的使用方式是这样的：

```typescript
type GetterName<T extends string> = `get${Capitalize<T>}`;
type Cases<T extends string> = `${Uppercase<T>} ${Lowercase<T>} ${Capitalize<T>} ${Uncapitalize<T>}`;

type T5 = GetterName<'foo'>;  // "getFoo"
type T6 = Cases<'bar'>;  // "BAR bar Bar bar"
```



##### 结合类型推断

结合 TypeScript 的条件类型和 infer 关键字我们还可以实现类型推断。

```typescript
type Direction = "left" | "right" | "top" | "bottom";
type InferRoot<T> = T extends `${infer R}${Capitalize<Direction>}` ? R : T;

type T7 = InferRoot<"marginRight">; // "margin"
type T8 = InferRoot<"paddingLeft">; // "padding"
```







### 函数

#### 函数类型接口

```ts
interface discount2{
  (price:number):number; // 只能写这一个，写多个就不行了
}
let cost:discount2 = (price)=>{
   return price * .8;
}
```







#### 设置参数及返回值类型

##### 直接定义函数类型

两种方法：

- 单独指定

```typescript
function add(num1:number,num2:number):number{
	return num1+num2
}//可以写声明函数
const add = (num1:number,num2:number):number=>{
	return num1+num2 
}//也可以写函数表达式
```

- 麻烦指定

```typescript
const add:(num1:number,num2:number)=>number = (num1,num2)=>{
	return num1+num2
}//只适用于函数表达式
```



##### 参数和返回值类型为泛型

注意 T 定义的位置

```typescript
function a <T>(fn:() => T | Promise<T>){
	fn()
}
```

```typescript
const getObjectKeys = <T>(a:T)=>Object.keys(a) as (keyof T)[]
```





##### 接口定义函数类型

```tsx
interface Add {
  (x: number, y: number): number;
}
let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; 
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”
```



##### 类型别名定义函数类型

```tsx
type Add = (x: number, y: number) => number;
let add: Add = (arg1: string, arg2: string): string => arg1 + arg2; 
// error 不能将类型“(arg1: string, arg2: string) => string”分配给类型“Add”
```







#### 没有返回值时要返回空类型 void

```typescript
function greet(name:string):void{
	console.log('hello',name)
}
```



#### 参数

##### 设置有无数个参数

fn: (...args: any[]) => void

##### this参数

如果你给编译器设置了`--noImplicitThis`标记，那么当你在一个函数里用到`this`时，如果`this`的类型为`any`就会报错：`'this' implicitly has type 'any' because it does not have a type annotation.`

为了不报错可以给函数提供一个显式的`this`参数。 `this`参数是个假的参数，它出现在参数列表的最前面，只为了用于标识出this在这个函数中的类型：

```ts
function f(this: Deck) { // 现在TypeScript知道这个函数内的this的类型了。当然你显示标识this为any那也不会报错了,`this:any`
   
}

interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
```





##### 可选参数

在参数后面加个问号, 没加问号的都是必选参数。**注意可选参数只能出现在参数列表的最后**

```typescript
function greet(name?:string):void{
	console.log('hello',name)
}
```



##### 剩余参数

在 TypeScript 中可以为剩余参数指定类型：

```tsx
const handleData = (arg1: number, ...args: number[]) => {

};
handleData(1, "a"); // error 类型"string"的参数不能赋给类型"number"的参数
```



####  函数重载

**TypeScript的函数重载通过为一个函数指定多个函数类型定义，从而对函数调用的返回值进行检查**：

```tsx
const handleData = (x: string): number;
const handleData = (x: number): string;
const handleData = (x: null): number;
const handleData = (x: string | number | null): any => {
  if (typeof x === 'string') {
    return Number(x);
  }
  if (typeof x === 'number') {
    return String(x);
  }
  return -1;
};
handleData(996)   // "996"
handleData("996") // 996
handleData(false)  // error
```

定义了同名的函数，没有实际的函数体，而是只定义函数名、参数及参数类型以及函数的返回值类型。最后一个定义的同名函数，是一个完整的实体函数，包含函数名、参数及参数类型、返回值类型和函数体<font color="red">且这个函数必须包含上面的所有类型</font>。这四个定义组成了一个完整的带有类型定义的函数，前三个`function`定义的就称为函数重载，而第四个`function`并不算重载。

在调用 handleData 函数时，TypeScript 会从上到下查找函数重载列表中与入参类型匹配的类型，并优先使用第一个匹配的重载定义。因此，我们需要把最精确的函数重载放到前面。

来看下匹配规则，当调用这个函数并且传入参数的时候，会从上而下在函数重载里匹配和这个参数个数和类型匹配的重载：

- 第一次调用，传入了一个数字996，从上到下匹配重载是符合第二个的，所以它的返回值应该是字符串类型，返回"996"；
- 第二次调用，传入了一个字符串"996"，从上到下匹配重载是符合第一个的，所以它的返回值应该是数字类型。返回996；
- 第三次调用，传入了一个布尔类型值false，匹配不到重载，所以会报错；

<font color="red">函数重载不能使用接口、类型别名来定义。</font>





#### 构造函数类型

- 包含一个或多个构造签名的对象类型被称为构造函数类型；
- 构造函数类型可以使用构造函数类型字面量或包含构造签名的对象类型字面量来编写。

##### 构造签名

在 TypeScript 接口中，你可以使用 `new` 关键字来描述一个构造函数：

```typescript
interface Point {
  new (x: number, y: number): Point;
}
```

以上接口中的 `new (x: number, y: number)` 我们称之为构造签名，其语法如下：

> *ConstructSignature:* `new` *TypeParametersopt* `(` *ParameterListopt* `)` *TypeAnnotationopt*

在上述的构造签名中，`TypeParametersopt` 、`ParameterListopt` 和 `TypeAnnotationopt` 分别表示：可选的类型参数、可选的参数列表和可选的类型注解。与该语法相对应的几种常见的使用形式如下：

```tsx
new C  
new C ( ... )  
new C < ... > ( ... )
```

介绍完构造签名，我们再来介绍一个与之相关的概念，即构造函数类型。





##### 构造函数类型字面量

构造函数类型字面量是包含单个构造函数签名的对象类型的简写。具体来说，构造函数类型字面量的形式如下：

```javascript
new < T1, T2, ... > ( p1, p2, ... ) => R
```

该形式与以下对象类型字面量是等价的：

```scss
{ new < T1, T2, ... > ( p1, p2, ... ) : R }
```

下面我们来举个实际的示例：

```typescript
// 构造函数类型字面量
new (x: number, y: number) => Point
```

等价于以下对象类型字面量：

```typescript
{
   new (x: number, y: number): Point;
}
```

##### 构造函数类型的应用

来看个例子：

```typescript
interface Point {
  new (x: number, y: number): Point;
  x: number;
  y: number;
}

class Point2D implements Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const point: Point = new Point2D(1, 2);
```

对于以上的代码，TypeScript 编译器会提示以下错误信息：

```rust
Class 'Point2D' incorrectly implements interface 'Point'.
Type 'Point2D' provides no match for the signature 'new (x: number, y: number): Point'.
```

相信很多刚接触 TypeScript 不久的小伙伴都会遇到上述的问题。要解决这个问题，我们就需要把对前面定义的 `Point` 接口进行分离，即把接口的属性和构造函数类型进行分离：

```typescript
interface Point {
  x: number;
  y: number;
}

interface PointConstructor {
  new (x: number, y: number): Point;
}
```

完成接口拆分之后，除了前面已经定义的 `Point2D` 类之外，我们又定义了一个 `newPoint` 工厂函数，该函数用于根据传入的 PointConstructor 类型的构造函数，来创建对应的 Point 对象。

```typescript
class Point2D implements Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function newPoint(
  pointConstructor: PointConstructor,
  x: number,
  y: number
): Point {
  return new pointConstructor(x, y);
}

const point: Point = newPoint(Point2D, 1, 2);
```





##### 使用泛型创建对象

了解完构造签名和构造函数类型之后，下面我们来开始解决上面遇到的问题，首先我们需要重构一下 `create` 方法，具体如下所示：

```tsx
class GenericCreator<T> {
  create<T>(c: { new (): T }): T {
    return new c();
  }
}
```

在以上代码中，我们重新定义了 `create` 成员方法，根据该方法的签名，我们可以知道该方法接收一个参数，其类型是构造函数类型，且该构造函数不包含任何参数，调用该构造函数后，会返回类型 T 的实例。

如果构造函数含有参数的话，比如包含一个 `number` 类型的参数时，我们可以这样定义 create 方法：

```tsx
create<T>(c: { new(a: number): T; }, num: number): T {
  return new c(num);
}
```

更新完 `GenericCreator` 泛型类，我们就可以使用下面的方式来创建 `FirstClass` 和 `SecondClass` 类的实例：

```tsx
const creator1 = new GenericCreator<FirstClass>();
const firstClass: FirstClass = creator1.create(FirstClass);

const creator2 = new GenericCreator<SecondClass>();
const secondClass: SecondClass = creator2.create(SecondClass);
```





#### 函数数组

```tsx
type MyFunctionType = (arg1: string, arg2: number) => boolean;

const myFunctionArray: MyFunctionType[]
```







### 类型别名type

#### 简介

当同一复杂类型被多次使用时可以用 关键字type 为其起个别名来复用

```typescript
type CustomArr=(number|string)[]
let arr1:CustomArr=[1,'a',3,'b']

type Counter = {
  (): void; 
  count: number; 
}
```







#### 索引查询类型

![image-20220417165612988](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-u4PqGL.png)







![image-20220417165744130](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-0eWhTP.png)







### 接口

#### 简介

在面向对象语言中，接口是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类去实现。

TypeScript 中的接口除了可用于[对类的一部分行为进行抽象](https://link.juejin.cn/?target=https%3A%2F%2Fts.xcatliu.com%2Fadvanced%2Fclass-and-interfaces.html%23%E7%B1%BB%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3)以外，也常用于对「对象的形状（Shape）」进行描述。

可以像对像一样访问属性：`Person['type']`。

编译之后这部分就消失啦。







#### 多余属性检查

先来看下面的例子：

```typescript
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables) => {
  return `A ${color ? color + " " : ""}${type}`;
};

getVegetables({
  type: "tomato",
  size: "big"     // 'size'不在类型'Vegetables'中
});
```

这里没有传入 color 属性，因为它是一个可选属性，所以没有报错。但是多传入了一个 size 属性，这时就会报错，TypeScript就会提示接口上不存在这个多余的属性，所以只要是接口上没有定义这个属性，在调用时出现了，就会报错。

有时	不希望TypeScript这么严格的对数据进行检查，比如上面的函数，只需要保证传入`getVegetables`的对象有`type`属性就可以了，至于实际使用的时候传入对象有没有多余的属性，多余属性的属性值是什么类型，我们就不管了，那就需要**绕开多余属性检查，有如下方式：**

##### (1) 使用类型断言

类型断言就是告诉 TypeScript，已经自行进行了检查，确保这个类型没有问题，希望 TypeScript 对此不进行检查，这是最简单的实现方式，类型断言使用 as 关键字来定义（这里不细说，后面进阶篇会专门介绍类型断言）：

```typescript
interface Vegetables {
  color?: string;
  type: string;
}

const getVegetables = ({ color, type }: Vegetables) => {
  return `A ${color ? color + " " : ""}${type}`;
};

getVegetables({
  type: "tomato",
  size: 12,
  price: 1.2
} as Vegetables);
复制代码
```

##### (2) 添加索引签名

更好的方式是添加字符串索引签名：

```typescript
interface Vegetables {
  color: string;
  type: string;
  [prop: string]: any;
}

const getVegetables = ({ color, type }: Vegetables) => {
  return `A ${color ? color + " " : ""}${type}`;
};

getVegetables({
  color: "red",
  type: "tomato",
  size: 12,
  price: 1.2
});
```

#### 索引类型接口(无法确定对象中有哪些属性)

有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 **索引签名** 的形式来满足上述要求。注意，可以设置索引类型为 number。但是这样如果将属性名设置为字符串类型，则会报错；但是<font color="red">如果设置索引类型为字符串类型，那么即便属性名设置的是数值类型，也没问题。因为 JS 在访问属性值时，如果属性名是数值类型，会先将数值类型转为字符串，然后再去访问</font>

![image-20220417163713703](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-YbHkmk.png)

```javascript
// 数字索引——约束数组
// index 是随便取的名字，可以任意取名
// 只要 index 的类型是 number，那么值的类型必须是 string
interface StringArray {
  // key 的类型为 number ，一般都代表是数组
  // 限制 value 的类型为 string
  [index:number]:string
}
let arr:StringArray = ['aaa','bbb'];
console.log(arr);


// 字符串索引——约束对象
// 只要 index 的类型是 string，那么值的类型必须是 string
interface StringObject {
  // key 的类型为 string ，一般都代表是对象
  // 限制 value 的类型为 string
  [index:string]:string
}
let obj:StringObject = {name:'ccc'};
```

我们还可以给索引设置`readonly`，从而防止索引返回值被修改：

```typescript
interface RoleDic {
  readonly [id: number]: string;
}

const role: RoleDic = {
  0: "super_admin"
};

role[0] = "admin"; // error 类型"RoleDic"中的索引签名仅允许读取
```







#### **函数类型接口**

**对方法传入的参数和返回值进行约束**

```javascript
/*注意区别*/
// 普通的接口
interface discount1{
  getNum : (price:number) => number
}

// 函数类型接口
interface discount2{
  (price:number):number; // 只能写这一个，写多个就不行了
}
let cost:discount2 = (price)=>{
   return price * .8;
}

// 也可以使用类型别名。很少使用接口类型来定义函数类型，更多使用内联类型或类型别名配合箭头函数语法来定义函数类型。
type Add = (x: number, y: number) => number
let add: Add = (a: number, b: number) => a + b
```



#### **类类型接口**

- **如果接口用于一个类的话，那么接口会表示“行为的抽象”**
- **对类的约束，让类去实现接口，类可以实现多个接口**
- **接口只能约束类的公有成员（实例属性/方法），无法约束私有成员、构造函数、静态属性/方法**

```javascript
// 接口可以在面向对象编程中表示为行为的抽象
interface Speakable {
    name: string;
    speak(words: string): void
}

interface Speakable2 {
    age: number;
}

class Dog implements Speakable, Speakable2 {
    name!: string;
    age = 18;

    speak(words: string) {
        console.log(words);
    }
}

let dog = new Dog();
dog.speak('汪汪汪');
```



#### **混合类型接口**

**一个对象可以同时做为函数和对象使用**，其实就是因为js是允许给函数加属性的。

```tsx
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```



#### Declaration merging

与类型别名不同，接口可以定义多次，会被自动合并为单个接口。

```typescript
interface Point { x: number; }
interface Point { y: number; }

const point: Point = { x: 1, y: 2 };
```



#### 继承extends

接口和类型别名都能够被扩展，但语法有所不同。

##### **Interface extends interface**

```typescript
interface PartialPointX { x: number; }
interface Point extends PartialPointX { 
  y: number; 
}
```

##### **Type alias extends type alias**

```typescript
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };
```

##### **Interface extends type alias**

```typescript
type PartialPointX = { x: number; };
interface Point extends PartialPointX { y: number; }
```

##### **Type alias extends interface**

```typescript
interface PartialPointX { x: number; }
type Point = PartialPointX & { y: number; };
```



##### 接口继承类

接口可以继承一个类，当接口继承了该类后，会继承类的成员，但是不包括其实现，也就是只继承成员以及成员类型。接口还会继承类的`private`和`protected`修饰的成员，当接口继承的这个类中包含这两个修饰符修饰的成员时，这个接口只可被这个类或他的子类实现：

```typescript
class A {
  protected name: string;
}
interface I extends A {}
class B implements I {} // error Property 'name' is missing in type 'B' but required in type 'I'
class C implements I {
  // error 属性“name”受保护，但类型“C”并不是从“A”派生的类
  name: string;
}
class D extends A implements I {
  getName() {
    return this.name;
  }
}
```







#### interface与type的区别

- 相同点：都可以给对象指定类型

- 不同点：

  1.<font color = "red">接口只能给对象指定类型，而类型别名可以给任意类型指定别名</font>

```tsx
type NumStr = number | string
```

​				2.<font color = "red">`interface` 是可以重复定义且自动合并类型的，但是 `type` 不支持重复定义</font>

```typescript
interface Animal {
  name: string
}

interface Animal {
  tail: boolean
}

const dog: Animal = {
  name: "Tom",
  tail: true,
}


type Animal = {
  name: string
}

type Animal = {
  tail: boolean
}
// ERROR: Duplicate identifier 'Animal'.
```

3. type 比 interface 更方便拓展一些，假如有以下两个定义：

```tsx
type Name = { name: string };
interface IName { name: string };
```

​				想要做类型的扩展的话，type 只需要一个`&`，而 interface 要多写不少代码。

```typescript
type Person = Name & { age: number };
interface IPerson extends IName { age: number };
```



4. type 有一些 interface 做不到的事情，比如使用`|`进行枚举类型的组合，使用`typeof`获取定义的类型等等。







## 交叉类型&

##### 简介

&  用于将多个对象类型组合为一个类型

```typescript
interface Person{name:string}
interface Contact{phone:string}
type PersonDetail = Person & Contact
```



##### 存在相同成员时

###### 成员类型为基本数据类型

在混入多个对象类型时，若存在相同的成员，且成员类型为基本数据类型，则混入后会成为never类型；比如：

```tsx
interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

type XY = X & Y;
let p: XY;
p = { c: 6, d: "d", e: "e" };  // 这样 c 是会报错的
```

混入后成员 c 的类型为 `string & number`，即成员 c 的类型既可以是 `string` 类型又可以是 `number` 类型。很明显这种类型是不存在的，所以混入后成员 c 的类型为 `never`。



###### 成员类型为非基本数据类型

在混入多个对象类型时，若存在相同的成员，且成员类型为非基本数据类型，那么是可以成功合并。比如：

```tsx
interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }

type ABC = A & B & C;

let abc: ABC = {
  x: {
    d: true,
    e: 'semlinker',
    f: 666
  }
};
// 这样上面是不会报错的
```











## 联合类型｜

### 用法

表示该变量可以有多种类型

```typescript
let arr:(number|string)[]=[1,'a',3,'b']
```

注意与下面这种区分

```typescript
let arr:number|string[[]  //这表示arr既可以是number，也可以是string[]

arr=['a','b']
arr=12
```



### 可辨识联合(加上类型守卫)

TypeScript 可辨识联合（Discriminated Unions）类型，也称为代数数据类型或标签联合类型。<font color="red">其实就是一种用法，并不是真的一种类型。</font>

这种类型的本质是结合联合类型和字面量类型的一种类型保护方法。<font color="red">**如果一个类型是多个类型的联合类型，且多个类型含有一个公共属性，那么就可以利用这个公共属性，来创建不同的类型保护区块。**</font>

#### 第一步：每个联合类型中都有一个同样的属性

可辨识要求联合类型中的每个元素都含有一个单例类型属性，比如：

下列代码中，我们分别定义了 `Motorcycle`、 `Car` 和 `Truck` 三个接口，在这些接口中都包含一个 `vType` 属性，该属性被称为可辨识的属性，而其它的属性只跟特性的接口相关。

```typescript
enum CarTransmission {
  Automatic = 200,
  Manual = 300
}

interface Motorcycle {
  vType: "motorcycle"; // discriminant
  make: number; // year
}

interface Car {
  vType: "car"; // discriminant
  transmission: CarTransmission
}

interface Truck {
  vType: "truck"; // discriminant
  capacity: number; // in tons
}
```



#### 第二步：类型守卫(收缩联合类型)

本质就是通过选择判断来进行守卫

下面我们来定义一个 `evaluatePrice` 方法，该方法用于根据车辆的类型、容量和评估因子来计算价格，具体实现如下：

```typescript
const EVALUATION_FACTOR = Math.PI; 

function evaluatePrice(vehicle: Vehicle) {
  return vehicle.capacity * EVALUATION_FACTOR;
}

const myTruck: Truck = { vType: "truck", capacity: 9.5 };
evaluatePrice(myTruck);
```

对于以上代码，TypeScript 编译器将会提示以下错误信息：

```bash
Property 'capacity' does not exist on type 'Vehicle'.
Property 'capacity' does not exist on type 'Motorcycle'.
```

原因是在 Motorcycle 接口中，并不存在 `capacity` 属性，而对于 Car 接口来说，它也不存在 `capacity` 属性。那么，现在我们应该如何解决以上问题呢？这时，我们可以使用类型守卫。

##### 使用 `switch` 和 `case` 运算符

我们使用 `switch` 和 `case` 运算符来实现类型守卫，从而确保在 `evaluatePrice` 方法中，我们可以安全地访问 `vehicle` 对象中的所包含的属性：

```typescript
function evaluatePrice(vehicle: Vehicle) {
  switch(vehicle.vType) {
    case "car":
      return vehicle.transmission * EVALUATION_FACTOR;
    case "truck":
      return vehicle.capacity * EVALUATION_FACTOR;
    case "motorcycle":
      return vehicle.make * EVALUATION_FACTOR;
  }
}
```





##### 使用`in`

```ts
interface User {
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    name: string;
    age: number;
    role: string;
}

export type Person = User | Admin;

export function logPerson(person: Person) {
    let additionalInformation: string;
    if ("role" in person) {
        additionalInformation = person.role;
    } else {
        additionalInformation = person.occupation;
    }
}
```





##### 利用`is`自定义类型守卫函数

```ts
interface User {
    type: 'user';
    occupation: string;
}

interface Admin {
    type: 'admin';
    role: string;
}

export type Person = User | Admin;

export const persons: Person[] = [];

export function isAdmin(person: Person): person is Admin { /*************/
    return person.type === 'admin';
}

export function isUser(person: Person): person is User { /***************/
    return person.type === 'user';
}

export function logPerson(person: Person) {
    let additionalInformation: string = '';
    if (isAdmin(person)) {
        additionalInformation = person.role;
    }
    if (isUser(person)) {
        additionalInformation = person.occupation;
    }
    console.log(` - ${person.name}, ${person.age}, ${additionalInformation}`);
}
```



也可以这样：

```typescript
isLevel2Card(item.type) //比如item是联合类型，把 type的类型收缩之后，item的类型也能收缩了
```

```typescript
export const isLevel2Card = (cardClass: string): cardClass is Level2CardType => {
    return ['HUOLI', 'ZHIHUI', 'MEIMAN', 'FENDOU', 'ZHAOCAI'].includes(cardClass);
};
```







## 类型推论

没写类型注释时，以下两种情况  类型推论机制会帮助提供类型

- 声明变量并初始化

```typescript
let age=19 //在vscode中鼠标移过来会显示出这个变量的类型为number
```



- 函数返回值

```typescript
function add(num1:number,num2:number){return num1+num2}
```







## 类型断言

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。

### 类型断言的两种基本语法

#### 1.“尖括号” 语法

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
复制代码
```

#### 2.as 语法

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```



### 非空断言

`!` 可以用于断言操作对象是非 null 和非 undefined 类型。**比如，x! 将从 x 值域中排除 null 和 undefined 。**

```tsx
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}


type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

因为 `!` 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

```typescript
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); 
复制代码
```

以上 TS 代码会编译生成以下 ES5 代码：

```javascript
"use strict";
const a = undefined;
const b = a;
console.log(b);
复制代码
```

虽然在 TS 代码中，我们使用了非空断言，使得 `const b: number = a!;` 语句可以通过 TypeScript 类型检查器的检查。但在生成的 ES5 代码中，`!` 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 `undefined`。<font color="red">因为通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。</font>



### 确定赋值断言

在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。

```typescript
let x: number;
initialize();
// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

通过 `let x!: number;` 确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值。





### 例子

```typescript
/*我们有时需要在还不确定类型的时候就访问其中一个类型特有的属性或方法，比如：*/

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof animal.swim === 'function') {
        return true;
    }
    return false;
}

// index.ts:11:23 - error TS2339: Property 'swim' does not exist on type 'Cat | Fish'.
//   Property 'swim' does not exist on type 'Cat'.
上面的例子中，获取 animal.swim 的时候会报错。

此时可以使用类型断言，将 animal 断言成 Fish：

interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
这样就可以解决访问 animal.swim 时报错的问题了
```

获取dom元素的属性时很常用

```typescript
const form = document.getElementById('signup-form') as HTMLFormElement;//不写这个as是获取不到其属性的

console.log(form.method);//post
```

小技巧：console.dir()打印DOM元素，在属性列表的最后面可看到该元素的类型





## 类型兼容性

基本原则是，**如果x要兼容y，那么y至少要具有与x相同的属性。**

### 类的类型兼容性

比较两个类的类型兼容性时，**只有实例成员和方法会相比较，类的静态成员和构造函数不进行比较**：

```typescript
class Animal {
  static age: number;
  constructor(public name: string) {}
}

class People {
  static age: string;
  constructor(public name: string) {}
}

class Food {
  constructor(public name: number) {}
}

let a: Animal;
let p: People;
let f: Food;
a = p; // ok
a = f; // 不能将类型“Food”分配给类型“Animal”。
```

**类的私有成员和受保护成员：** 类的私有成员和受保护成员会影响类的兼容性。当检查类的实例兼容性时，如果目标（要被赋值的那个值）类型（这里实例类型就是创建它的类）包含一个私有成员，那么源（用来赋值的值）类型必须包含来自同一个类的这个私有成员，这就允许子类赋值给父类：

```typescript
class Parent {
  private age: number;
  constructor() {}
}

class Children extends Parent {
  constructor() {
    super();
  }
}

class Other {
  private age: number;
  constructor() {}
}

const children: Parent = new Children();
const other: Parent = new Other(); // 不能将类型“Other”分配给类型“Parent”。类型具有私有属性“age”的单独声明
```

当指定 `other` 为 `Parent` 类类型，给 `other` 赋值 `Other` 创建的实例的时候，会报错。因为 `Parent` 的 `age` 属性是私有成员，外面是无法访问到的，所以会类型不兼容。而`children`的类型我们指定为了`Parent`类类型，然后给它赋值为`Children`类的实例，没有问题，是因为`Children`类继承`Parent`类，且实例属性没有差异，`Parent`类有私有属性`age`，但是因为`Children`类继承了`Parent`类，所以可以赋值。

同样，使用 `protected` 受保护修饰符修饰的属性，也是一样的：

```typescript
class Parent {
  protected age: number;
  constructor() {}
}

class Children extends Parent {
  constructor() {
    super();
  }
}

class Other {
  protected age: number;
  constructor() {}
}

const children: Parent = new Children();
const other: Parent = new Other(); // 不能将类型“Other”分配给类型“Parent”。属性“age”受保护，但类型“Other”并不是从“Parent”派生的类
```





### 接口与接口之间、类与接口之间

TS采用结构化类型系统，即如果两个对象的结构相同，那么就认为他们属于同一类型 （反正就是成员多的可以赋值给成员少的）

```typescript
class Point{x:number;y:number}
class Point3D{x:number;y:number;z:number}

const p:Point = new Point3D() //这样是可以的，point3D的成员 至少 与point相同，则point兼容point3D（向上兼容）
```



### 函数间

要考虑三个要素：

1. 参数个数：参数少的可以赋值给参数多的

2. 参数类型：相同位置的参数类型要相同（基本类型）或兼容（对象）

3. 函数参数双向协变即**参数类型无需绝对相同**：

   ```typescript
   let funcA = function(arg: number | string): void {};
   let funcB = function(arg: number): void {};
   // funcA = funcB 和 funcB = funcA都可以
   ```

   这里 `funcA` 和 `funcB` 的参数类型并不完全一样，`funcA` 的参数类型为一个联合类型 `number | string`，而 `funcB` 的参数类型为 `number | string `中的 `number`，这两个函数也是兼容的。

   

4. 返回值类型：若返回值类型是原始类型，则两个类型要相同；

   ​						若返回值类型是对象类型，则成员多的可赋值给成员少的。

5. ### 函数重载

   带有重载的函数，要求被赋值的函数的每个重载都能在用来赋值的函数上找到对应的签名：

   ```typescript
   function merge(arg1: number, arg2: number): number; // merge函数重载的一部分
   function merge(arg1: string, arg2: string): string; // merge函数重载的一部分
   function merge(arg1: any, arg2: any) { // merge函数实体
     return arg1 + arg2;
   }
   function sum(arg1: number, arg2: number): number; // sum函数重载的一部分
   function sum(arg1: any, arg2: any): any { // sum函数实体
     return arg1 + arg2;
   }
   let func = merge;
   func = sum; // error 不能将类型“(arg1: number, arg2: number) => number”分配给类型“{ (arg1: number, arg2: number): number; (arg1: string, arg2: string): string; }”
   ```

   `sum` 函数的重载缺少参数都为`string`返回值为`string`的情况，与`merge`函数不兼容，所以赋值时就会报错。



### 枚举的类型兼容性

数字枚举成员类型与数字类型是互相兼容的：

```typescript
enum Status {
  On,
  Off
}
let s = Status.On;
s = 1;
s = 3;
复制代码
```

虽然 `Status.On` 的值是 0，但是因为数字枚举成员类型和数值类型是互相兼容的，所以这里给`s`赋值为 3 是没问题的。但是不同枚举值之间是不兼容的：

```typescript
enum Status {
  On,
  Off
}
enum Color {
  White,
  Black
}
let s = Status.On;
s = Color.White; // 不能将类型“Color.White”分配给类型“Status”。
复制代码
```

虽然 `Status.On` 和 `Color.White` 的值都是 0，但它们是不兼容的。

字符串枚举成员类型和字符串类型是不兼容的：

```typescript
enum Status {
  On = 'on',
  Off = 'off'
}
let s = Status.On
s = 'TypeScript' // 不能将类型"TypeScript"分配给类型“Status”
```



### 泛型类型兼容性

泛型中包含类型参数，这个类型参数可能是任何类型，使用时类型参数会被指定为特定的类型，而这个类型只影响使用了类型参数的部分：

```typescript
interface Data<T> {}

let data1: Data<number>;
let data2: Data<string>;
data1 = data2; // ✅
复制代码
```

`data1` 和 `data2` 都是 Data 接口的实现，但是指定的泛型参数的类型不同，TS 是结构性类型系统，所以上面将 `data2` 赋值给 `data1` 是兼容的，因为 `data2` 指定了类型参数为 `string` 类型，但是接口里没有用到参数 `T`，所以传入 `string` 类型还是传入 `number` 类型并没有影响。

再来看个例子：

```typescript
interface Data<T> {
  data: T;
}

let data1: Data<number>;
let data2: Data<string>;
data1 = data2; // 不能将类型“Data<string>”分配给类型“Data<number>”。不能将类型“string”分配给类型“number”
复制代码
```

现在结果就不一样了，赋值时报错，因为 `data1` 和 `data2` 传入的泛型参数类型不同，生成的结果结构是不兼容的。





# class

## 构造函数

```typescript
class Person{
	age:number //成员初始化后，构造函数里才可以用this来访问
	gender:string
	
	constructor(age:number,gender:string){ //构造函数不需要返回值，所以这里不用给他加类型
		this.age = age
		this.gender = gender
	}
}
```









## 继承

### extends（继承父类）

派生类如果包含一个构造函数constructor，则必须在构造函数中调用 super() 方法，这是 TypeScript 强制执行的一条重要规则。否则就会报错：Constructors for derived classes must contain a 'super' call. 

那这个 super() 有作用呢？其实这里的 super 函数会调用基类的构造函数，当我们把鼠标放在super方法上面时，可以看到一个提示，它的类型是基类 A 的构造函数：`constructorA(name: string,age: number): A`。并且指明了需要传递两个参数，不然TypeScript就会报错。

```tsx
class A {
  name: string;
  age: number;
  constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
  }
  getName() {
      return this.name;
  }
}

class B extends A {
  job: string;
  constructor(name: string, age: number) {
      super(name, age);
      this.job = "IT";
  }
  getNameAndJob() {
      return super.getName() + this.job; // 用super去调用父类
  }
}
```





### implements（实现接口 或 类型别名）

即这个类必须实现接口中指定的所有属性和方法。

类可以以相同的方式实现接口或类型别名，但类不能实现使用类型别名定义的联合类型：

```typescript
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x = 1;
  y = 2;
}

type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}

type PartialPoint = { x: number; } | { y: number; };

// A class can only implement an object type or 
// intersection of object types with statically known members.
class SomePartialPoint implements PartialPoint { // Error
  x = 1;
  y = 2;
}
```





## 修饰符

### 可访问性修饰符

#### public

默认就是这个值，任何地方都可访问



#### protected

对实例不可见，在子类的方法内部可以通过this来访问父类中受保护的成员。<font color="red">`protected`还能用来修饰 constructor 构造函数，加了`protected`修饰符之后，这个类就不能再用来创建实例，只能被子类继承。</font>

```tsx
class Parent {
  protected constructor() {}
}
const p = new Parent(); // error Constructor of class 'Parent' is protected and only accessible within the class declaration.
class Child extends Parent {
  constructor() {
    super();
  }
}
const c = new Child();
```





#### private

子类和实例都不可见





### readonly

如果只读修饰符和可见性修饰符同时出现，需要将只读修饰符写在可见修饰符后面。

只能修饰属性不能修饰方法

接口或者对象也可以使用readonly

```typescript
class Person{
	readonly age:number=18//属性age后面如果不加类型注解，则age的类型为18（字面量类型）
	constructor(age:number){
		this.age=age
	}
}
```



## 属性类型

### （1）参数属性

在上面的例子中，都是在类的定义的顶部初始化实例属性，在 constructor 里接收参数然后对实例属性进行赋值，可以使用参数属性来简化这个过程。<font color="red">参数属性就是在 constructor 构造函数的参数前面加上访问限定符</font>

```typescript
class A {
  constructor(name: string) {}
}
const a = new A("aaa");
console.log(a.name); // error 类型“A”上不存在属性“name”

class B {
  constructor(public name: string) {}
}
const b = new B("bbb");
console.log(b.name); // "bbb"
```

可以看到，在定义类 B 时，构造函数有一个参数 name，这个 name 使用访问修饰符 public 修饰，此时即为 name 声明了参数属性，也就无需再显式地在类中初始化这个属性了。

### （2）静态属性

#### 用法

在 TypeScript 中和 ES6 中一样使用`static`关键字来指定属性或方法是静态的，实例将不会添加这个静态属性，也不会继承这个静态方法。可以使用修饰符和 static 关键字来指定一个属性或方法：

```typescript
class Parent {
  public static age: number = 18;
  public static getAge() {
    return Parent.age;
  }
  constructor() {}
}
const p = new Parent();
console.log(p.age); // error Property 'age' is a static member of type 'Parent'
console.log(Parent.age); // 18
```

#### 成员方法与静态方法的区别

```typescript
class Greeter {
  // 静态属性
  static cname: string = "Greeter";
  // 成员属性
  greeting: string;

  // 构造函数 - 执行初始化操作
  constructor(message: string) {
    this.greeting = message;
  }

  // 静态方法
  static getClassName() {
    return "Class name is Greeter";
  }

  // 成员方法
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

成员方法与静态方法有什么区别呢？直接看一下编译生成的 ES5 代码：

```javascript
"use strict";
var Greeter = /** @class */ (function () {
    // 构造函数 - 执行初始化操作
    function Greeter(message) {
      this.greeting = message;
    }
    // 静态方法
    Greeter.getClassName = function () {
      return "Class name is Greeter";
    };
    // 成员方法
    Greeter.prototype.greet = function () {
      return "Hello, " + this.greeting;
    };
    // 静态属性
    Greeter.cname = "Greeter";
    return Greeter;
}());
var greeter = new Greeter("world");
```



### （3）可选类属性

TypeScript 还支持可选类属性，也是使用`?`符号来标记：

```typescript
class Info {
  name: string;
  age?: number;
  constructor(name: string, age?: number, public sex?: string) {
    this.name = name;
    this.age = age;
  }
}
const info1 = new Info("TypeScript");
const info2 = new Info("TypeScript", 18);
const info3 = new Info("TypeScript", 18, "man");
```







## 存取器

存取器就是 ES6 标准中的存值函数和取值函数

```typescript
class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}
```







## 抽象类

不能直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。<font color="red">抽象方法和抽象存取器都不能包含实际的代码块。抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。抽象类的属性不用在子类中重新定义</font>

```ts
abstract class Department {
    constructor(public name: string) {}
    printName(): void {
        console.log('Department name: ' + this.name);
    }
    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用！！!
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```





## 类类型

```typescript
class People {
  constructor(public name: string) {}
}
let people: People = new People("TypeScript");
```

创建实例时指定 p 的类型为 People 并不是必须的，TS 会推断出他的类型。虽然指定了类型，但是当再定义一个和 People 类同样实现的类 Animal，并且创建实例赋值给 p 的时候，是没有问题的。因为<font color="red">TypeScript 的核心原则之一是对值所具有的结构进行类型检查，并且只要两个对象的结构一致，属性和方法的类型一致，则它们的类型就是一致的。</font>

```typescript
class Animal {
  constructor(public name: string) {}
}
let people = new Animal("JavaScript");
```

所以，如果想实现对创建实例的类的判断，还是需要用到`instanceof`关键字。



## 在泛型中使用类类型

先来看个例子：

```typescript
const create = <T>(c: { new (): T }): T => {
  return new c();
};
class Info {
  age: number;
}
create(Info).age;
create(Info).name; // error 类型“Info”上不存在属性“name”
复制代码
```

这里创建了一个 create 函数，传入的参数是一个类，返回的是一个类创建的实例，注意：

- 参数 c 的类型定义中，new()代表调用类的构造函数，他的类型也就是类创建实例后的实例的类型。
- return new c()这里使用传进来的类 c 创建一个实例并返回，返回的实例类型也就是函数的返回值类型。







# 泛型

## 介绍

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，使用时再去指定类型的一种特性。可以把泛型理解为代表类型的参数。泛型可以是隐式的或显式的。

**隐式传递泛型类型：** TypeScript 可以根据上下文自动推断泛型类型，这意味着你不需要显式地传递泛型参数。例如，当你调用一个带有泛型参数的函数时，如果传递的参数类型可以直接确定泛型的类型，TypeScript 就会自动推断出泛型类型。

```ts
function identity<T>(value: T): T {
  return value;
}

const result = identity(42); // TypeScript 可以推断出 T 为 number 类型
```



## 用法

如果对一个类型名定义了泛型，那么使用此类型名的时候一定要把泛型类型也写上去。而对于变量来说，它的类型可以在调用时推断出来的话，就可以省略泛型书写。

```typescript
// 普通类型定义
type Dog<T> = { name: string, type: T }
// 普通类型使用
const dog: Dog<number> = { name: 'ww', type: 20 }

// 类定义
class Cat<T> {
  private type: T;
  constructor(type: T) { this.type = type; }
}
// 类使用
const cat: Cat<number> = new Cat<number>(20); // 或简写 const cat = new Cat(20)

// 函数定义
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

identity(68, "Semlinker"); //省略尖括号

/*TS会自动根据变量定义时的类型推导出变量类型，这一般是发生在函数调用的场合的。*/
type Dog<T> = { name: string, type: T }
function adopt<T>(dog: Dog<T>) { return dog };
const dog = { name: 'ww', type: 'hsq' };  // 这里按照Dog类型的定义一个type为string的对象
adopt(dog);  // Pass: 函数会根据入参类型推断出type为string
```



## 用途

### 泛型接口

![image-20220408182541605](https://gitee.com/charleydeng/md-picture/raw/master/typescriptNotes/泛型接口.png)





### 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```



## 泛型参数默认类型

当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推断出类型时，这个默认类型就会起作用。

泛型参数默认类型与普通函数默认值类似，对应的语法很简单，即 `<T=Default Type>`，对应的使用示例如下：

```tsx
interface A<T=string> {
  name: T;
}

const strA: A = { name: "Semlinker" };
const numB: A<number> = { name: 101 };
```

泛型参数的默认类型遵循以下规则：

- <font color="red">有默认类型的类型参数被认为是可选的。</font>
- 如果类型参数有约束，类型参数的默认类型必须满足这个约束。
- 一个被现有类或接口合并的类或者接口的声明可以为现有类型参数引入默认类型。
- 一个被现有类或接口合并的类或者接口的声明可以引入新的类型参数，只要它指定了默认类型。



## 泛型约束extends

泛型可以代表任意类型，但是我们有时候需要添加约束来收缩其类型。

####  后面跟一个接口则约束变量必须实现了该接口

让类型变量 `extends` 一个含有我们所需属性的接口，比如这样：

```tsx
interface Length {
  length: number;
}

function identity<T extends Length>(arg: T): T {
  console.log(arg.length); // 可以获取length属性
  return arg;
}

// or
function id<Type extends {length: number}>(value: Type): Type{
	...
}
```

#### 后面跟基本类型则约束变量是该基本类型

```ts
type ObjectWithNewProp<T, K extends string, V> = T & {[NK in K]: V};
```





### 检查对象上的键是否存在

泛型约束的另一个常见的使用场景就是检查对象上的键是否存在。通过 `keyof` 操作符，我们就可以获取指定类型的所有键，之后我们就可以结合前面介绍的 `extends` 约束，即限制输入的属性名包含在 `keyof` 返回的联合类型中。具体的使用方式如下：

```tsx
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

在以上的 `getProperty` 函数中，我们通过 `K extends keyof T` 确保参数 key 一定是对象中含有的键。

下面我们来看一下如何使用 `getProperty` 函数：

```tsx
enum Difficulty {
  Easy,
  Intermediate,
  Hard
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let tsInfo = {
   name: "Typescript",
   supersetOf: "Javascript",
   difficulty: Difficulty.Intermediate
}
 
let difficulty: Difficulty = 
  getProperty(tsInfo, 'difficulty'); // OK

let supersetOf: string = 
  getProperty(tsInfo, 'superset_of'); // Error： Argument of type '"superset_of"' is not assignable to parameter of type  '"difficulty" | "name" | "supersetOf"'.(2345)
```





## 泛型条件类型

### 简介

条件类型会以一个条件表达式进行类型关系检测，从而在两种类型中选择其一：

```java
T extends U ? X : Y
```

以上表达式的意思是：若<font color="red"> `T` 能够赋值给 `U`</font>，那么类型是 `X`，否则为 `Y`。



### infer关键字

`infer`关键字用来定义泛型里面推断出来的类型参数，而不是外部传入的类型参数。

它通常跟条件运算符一起使用，用在`extends`关键字后面的父类型之中。

```
type Flatten<Type> =
  Type extends Array<infer Item> ? Item : Type;
```

上面示例中，`infer Item`表示`Item`这个参数是 TypeScript 自己推断出来的，不用显式传入，而`Flatten<Type>`则表示`Type`这个类型参数是外部传入的。`Type extends Array<infer Item>`则表示，如果参数`Type`是一个数组，那么就将该数组的成员类型推断为`Item`，即`Item`是从`Type`推断出来的。

一旦使用`Infer Item`定义了`Item`，后面的代码就可以直接调用`Item`了。下面是上例的泛型`Flatten<Type>`的用法。

```
// string
type Str = Flatten<string[]>;

// number
type Num = Flatten<number>;
```

上面示例中，第一个例子`Flatten<string[]>`传入的类型参数是`string[]`，可以推断出`Item`的类型是`string`，所以返回的是`string`。第二个例子`Flatten<number>`传入的类型参数是`number`，它不是数组，所以直接返回自身。



```
type ReturnPromise<T> =
  T extends (...args: infer A) => infer R 
  ? (...args: A) => Promise<R> 
  : T;
```

上面示例中，如果`T`是函数，就返回这个函数的 Promise 版本，否则原样返回。`infer A`表示该函数的参数类型为`A`，`infer R`表示该函数的返回值类型为`R`。

如果不使用`infer`，就不得不把`ReturnPromise<T>`写成`ReturnPromise<T, A, R>`，这样就很麻烦，相当于开发者必须人肉推断编译器可以完成的工作。

























## 泛型工具

还有很多的内置的类型工具，可以参考[TypeScript Handbook](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Futility-types.html)获得更详细的信息，同时 Github 上也有很多第三方类型辅助工具，如[utility-types](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpiotrwitek%2Futility-types)等。

![image-20220417160818470](https://gitee.com/charleydeng/md-picture/raw/master/typescriptNotes/泛型工具.png)



### Partial可选

`Partial<T>` 的作用就是将某个类型里的属性全部变为可选项 `?`。

**定义：**

```tsx
/**
 * node_modules/typescript/lib/lib.es5.d.ts
 * Make all properties in T optional
 */
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

在以上代码中，首先通过 `keyof T` 拿到 `T` 的所有属性名，然后使用 `in` 进行遍历，将值赋给 `P`，最后通过 `T[P]` 取得相应的属性值。中间的 `?` 号，用于将所有属性变为可选。

![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8EdW4r.webp)



**示例：**

```tsx
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter"
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash"
});
```





### Readonly

![image-20220417161245085](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-WfzyiU.png)





### `Required<T>`必选

此工具可以将类型 T 中所有的属性变为必选项。

定义：

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

这里有一个很有意思的语法`-?`，你可以理解为就是 TS 中把?可选属性减去的意思。





### Pick挑出子属性

`Pick<T, K extends keyof T>` 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。

**定义：**

```tsx
// node_modules/typescript/lib/lib.es5.d.ts

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

**示例：**

```tsx
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false
};
```





### Exclude<T, U>联合类型去除

`Exclude<T, U>` 的作用是将某个联合类型中属于另一个的类型移除掉。

**定义：**

```php
// node_modules/typescript/lib/lib.es5.d.ts

/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

如果 `T` 能赋值给 `U` 类型的话，那么就会返回 `never` 类型，否则返回 `T` 类型。最终实现的效果就是将 `T` 中某些属于 `U` 的类型移除掉。

**示例：**

```typescript
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```







### `Extract` 

`Extract` 类型接受一个联合类型和一个要提取的子联合类型，返回包含这些子联合类型的新类型。

```typescript
type ExtractedTypes = Extract<MyUnion, A | B>;
```





### Omit<T, K>对象去除键值对

此工具可认为是适用于键值对对象的 Exclude，它会去除类型 T 中包含 K 的键值对。

定义：

```typescript
type Omit = Pick<T, Exclude<keyof T, K>>
```

在定义中，第一步先从 T 的 key 中去掉与 K 重叠的 key，接着使用 Pick 把 T 类型和剩余的 key 组合起来即可。



示例：

```typescript
type Animal = {
  name: string,
  category: string,
  age: number,
  eat: () => number
}

const OmitAnimal:Omit<Animal, 'name'|'age'> = { category: 'lion', eat: () => { console.log('eat') } }
```







### Record 转化成接口

`Record<K, T>` 的作用是将 `K` 中所有的属性变为接口的key，接口的value为 `T` 类型。

**定义：**

```scala
/**
 * node_modules/typescript/lib/lib.es5.d.ts
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

**示例：**

```css
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" }
};
```



### `ReturnType<T>` 

`ReturnType<T>` 的作用是用于获取函数 `T` 的返回类型。

**定义：**

```scala
// node_modules/typescript/lib/lib.es5.d.ts

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

**示例：**

```typescript
type T0 = ReturnType<() => string>; // string
type T1 = ReturnType<(s: string) => void>; // void
type T2 = ReturnType<<T>() => T>; // {}
type T3 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T4 = ReturnType<any>; // any
type T5 = ReturnType<never>; // any
type T6 = ReturnType<string>; // Error
type T7 = ReturnType<Function>; // Error
```





## 映射类型

![image-20220417173831090](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-3auiAy.png)



![image-20220417173859867](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-YEMuoq.png)



TypeScript 4.1 版本允许我们使用 as 子句对映射类型中的键进行重新映射。它的语法如下：

```ts
type MappedTypeWithNewKeys<T> = {
    [K in keyof T as NewKeyType]: T[K]
    //            ^^^^^^^^^^^^^
    //            这是新的语法！
}
```

其中 NewKeyType 的类型必须是 string | number | symbol 联合类型的子类型。使用 as 子句，我们可以定义一个 Getters 工具类型，用于为对象类型生成对应的 Getter 类型：

```tsx
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-hl4Of6.webp)



# 模块

## 定义一个模块的类型

```ts
declare module 'str-utils' {
    type StrUtil = (input: string) => string;

    export const strReverse: StrUtil;
    export const strToLower: StrUtil;
}
```



## Shorthand ambient modules

If you don’t want to take the time to write out declarations before using a new module, you can use a shorthand declaration to get started quickly.

##### declarations.d.ts

```
declare module "hot-new-module";
```

All imports from a shorthand module will have the `any` type.

```ts
import x, { y } from "hot-new-module";
x(y);
```





# TypeScript 装饰器

## 装饰器是什么

- 它是一个表达式
- 该表达式被执行后，返回一个函数
- 函数的入参分别为 target、name 和 descriptor
- 执行该函数后，可能返回 descriptor 对象，用于配置 target 对象

## 装饰器的分类

- 类装饰器（Class decorators）
- 属性装饰器（Property decorators）
- 方法装饰器（Method decorators）
- 参数装饰器（Parameter decorators）

#### 类装饰器

类装饰器声明：

```typescript
declare type ClassDecorator = <TFunction extends Function>(
  target: TFunction
) => TFunction | void;
```

类装饰器顾名思义，就是用来装饰类的。它接收一个参数：

- target: TFunction - 被装饰的类

来个例子：

```javascript
function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log("Hello Semlinker!");
  };
}

@Greeter
class Greeting {
  constructor() {}
}

let myGreeting = new Greeting();
myGreeting.greet(); // console output: 'Hello Semlinker!';
```

上面的例子中，我们定义了 `Greeter` 类装饰器，同时我们使用了 `@Greeter` 语法糖，来使用装饰器。

有的读者可能想问，例子中总是输出 `Hello Semlinker!` ，能自定义输出的问候语么 ？这个问题很好，答案是可以的。

具体实现如下：

```javascript
function Greeter(greeting: string) {
  return function (target: Function) { //返回一个函数
    target.prototype.greet = function (): void {
      console.log(greeting);
    };
  };
}

@Greeter("Hello TS!") //调用这个函数之后返回一个函数
class Greeting {
  constructor() {}
}

let myGreeting = new Greeting();
myGreeting.greet(); // console output: 'Hello TS!';
```

#### 属性装饰器

属性装饰器声明：

```typescript
declare type PropertyDecorator = (target:Object, 
  propertyKey: string | symbol ) => void;
```

属性装饰器顾名思义，用来装饰类的属性。它接收两个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 被装饰类的属性名

来个例子热热身：

```typescript
function logProperty(target: any, key: string) {
  delete target[key];

  const backingField = "_" + key;

  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true
  });

  // property getter
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };

  // property setter
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };

  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class Person { 
  @logProperty
  public name: string;

  constructor(name : string) { 
    this.name = name;
  }
}

const p1 = new Person("semlinker");
p1.name = "kakuqo";
```

以上代码我们定义了一个 `logProperty` 函数，来跟踪用户对属性的操作，当代码成功运行后，在控制台会输出以下结果：

```ini
Set: name => semlinker
Set: name => kakuqo
```

#### 方法装饰器

方法装饰器声明：

```typescript
declare type MethodDecorator = <T>(target:Object, propertyKey: string | symbol, 	 	
  descriptor: TypePropertyDescript<T>) => TypedPropertyDescriptor<T> | void;
```

方法装饰器顾名思义，用来装饰类的方法。它接收三个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 方法名
- descriptor: TypePropertyDescript - 属性描述符

上例子：

```typescript
function LogOutput(tarage: Function, key: string, descriptor: any) {
  let originalMethod = descriptor.value;
  let newMethod = function(...args: any[]): any {
    let result: any = originalMethod.apply(this, args);
    if(!this.loggedOutput) {
      this.loggedOutput = new Array<any>();
    }
    this.loggedOutput.push({
      method: key,
      parameters: args,
      output: result,
      timestamp: new Date()
    });
    return result;
  };
  descriptor.value = newMethod;
}

class Calculator {
  @LogOutput
  double (num: number): number {
    return num * 2;
  }
}

let calc = new Calculator();
calc.double(11);
// console ouput: [{method: "double", output: 22, ...}]
console.log(calc.loggedOutput); 
复制代码
```



#### 参数装饰器

参数装饰器声明：

```typescript
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, 
  parameterIndex: number ) => void
```

参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 方法名
- parameterIndex: number - 方法中参数的索引值

```typescript
function Log(target: Function, key: string, parameterIndex: number) {
  let functionLogged = key || target.prototype.constructor.name;
  console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has
	been decorated`);
}

class Greeter {
  greeting: string;
  constructor(@Log phrase: string) {
	this.greeting = phrase; 
  }
}

// console output: The parameter in position 0 
// at Greeter has been decorated
```





## 装饰器的用途

比如想给方法添加发请求的功能（即先发请求再执行这个方法--比如小野森森的那个todolist），或者想计算这个方法执行了多长时间（比如我想统计上传文件花了多长时间）









# 实践中遇到的问题

## 不能在`.vue`中`export` `enum`

因为枚举会编译成一个对象导出，所以只能新建一个type.ts文件导出，或者使用 `const enum ..` ，因为这样写之后enum就不会被编译成对象，会消失。




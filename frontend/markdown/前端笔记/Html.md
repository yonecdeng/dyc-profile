

# 标签




## 语义化

### 对语义化的理解

*语义元素清楚地向浏览器和开发人员描述了它的含义。*。语义化的好处在于：

- 对于开发团队而言，代码更加容易维护
- 在css没有加载出来的情况下也能很好的展示结构
- **更便于 SEO 优化** — 比起使用非语义化的`<div>`标签，搜索引擎更加重视在“标题、链接等”里面的关键字，使用语义化可使网页更容易被用户搜索到。
- 更好地支持各种终端，例如无障碍阅读和有声小说，屏幕阅读器等。如果你都用div，屏幕阅读器没有任何东西可以用作路标，所以你无法检索有用的目录，整个页面被看作一个巨大的块，所以它只是一次读出所有的内容。

### 语义化标签

！！看这：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element！！

#### 布局相关(都是块级)

##### nav

```html
nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/">About</a></li>
    <li><a href="/">Contact</a></li>
  </ul>
</nav>
```

nav 用来标记一系列导航连接的元素。

可以帮助屏幕阅读器判断是否现在就展示所属内容。`nav` 元素的最佳实践是 HTML 文档中的导航链接代码块。

##### main

```html
<body>
  <main>
    <h1>The Godfather of All Content</h1>
    <h2>The Wedding</h2>
    <p>
      Why did you go to the police? Why didn't you come to me first? Vito, how do
      you like my little angel? Isn't she beautiful? Only don't tell me you're
      innocent. Because it insults my intelligence and makes me very angry. I see
      you took the name of the town. What was your father's name? The hotel, the
      casino. The Corleone Family wants to buy you out.
    </p>
  </main>
</body>
```

该元素将页面或者文档的主要内容打包成一个块级元素。

##### section

```html
<section>
  <h1>The Best Sandwich Ever</h1>
</section>
<section>
  <p>
    The best sandwich is a mutton, lettuce and tomato, where the mutton is nice
    and lean. It's so perky, I love that.
  </p>
</section>
```

`<section>`用于区分不同内容。在上面的例子中，我们将一段介绍和段落开头区分成两个 section。







##### header

```html
<header>
  <picture>
    <source type="image/avif" srcset="/?imageMogr2/format/avif">
    <source type="image/webp" srcset="/?imageMogr2/format/webp">
    <img src="/" id="logo" loading="lazy"/>
  </picture>
</header>
```



##### footer

```html
<footer>
  <p>© 2021 All rights reserved. Don't steal.</p>
  <p>Contact: <a href="mailto:jiffy@jiffysites.com">Email Jiffy!</a></p>
</footer>
```

`<footer>` 的典型案例是展示版权和作者信息。





##### aside

侧边栏

```html
<p>
  My favorite TV show of all time is The Muppet Show. It's sweet, funny and
  brilliant.
</p>
<aside>
  <h3>The Muppet Show</h3>
  <p>The Muppet Show was created by Jim Henson and aired from 1976 – 1981.</p>
</aside>
```





#### 内容区分

##### code

如果想要将代码和普通文本区分开来，可以使用 `<code> `元素。

```html
<p>
  You can use this for a piece of code such as:
  <code class="gray-code">const muppetFrog = 'Kermit'</code>, which looks
  different from the other text.
</p>
```

上面示例在浏览器的渲染结果（添加了一点 CSS 样式）如下：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-15-09-image-20230909150959394.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-15-09-image-20230909150959394.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-15-09-image-20230909150959394.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-15-09-image-20230909150959394.png" loading="lazy"/>
  </picture>





##### article

```html
<article class="all-muppets">
  <h1>Muppets</h1>
  <article class="kermit">
    <p>Kermit is the Muppet leader.</p>
  </article>
  <article class="fozzy">
    <p>Fozzy is a stand-up bear.</p>
  </article>
  <article class="piggy">
    <p>Don't mess with Miss Piggy.</p>
  </article>
</article>
```

`<article>`自成一体，和主内容区分开来。





##### `<blockquote> `引用



##### mark

```html
<p>
  This is a sentence about the best Muppet ever, which happens to be
  <mark>Pepe the King Prawn</mark>.
</p>
```

`<mark>` 元素不仅可以使文本高亮，也可以使文档内容更易被理解







## DOCTYPE(⽂档类型) 的作⽤

doctype 声明不属于 HTML 标签； 它是一条指令，告诉浏览器编写页面所用的标记的版本 和 文档使用的规范。

在 HTML 4.01 中有 3 个不同的文档类型，在 HTML 5 中只有一个：

```html
<!DOCTYPE HTML>
```

这个声明的目的是防止浏览器在渲染文档时，切换到我们称为“[怪异模式 (兼容模式)](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)”的渲染模式。“`<!DOCTYPE html>`" 确保浏览器按照最佳的相关规范进行渲染

浏览器渲染页面的两种模式（可通过document.compatMode获取，比如，语雀官网的文档类型是**CSS1Compat**）：

- **CSS1Compat：标准模式（Strick mode）**，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- **BackCompat：怪异模式(混杂模式)(Quick mode)**，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。









## DOMContentLoaded & Load

在 DOM树构建完成之后，DOMContentLoaded 事件触发。

当一个资源及其依赖资源已完成加载时，还加载完成了所有外部资源时将触发load事件。



## 自闭合标签

它的术语叫作 void element，它的完整列表如下：

```js
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr'
```

可以在 WHATWG 的规范中查看完整的 void element。



## `Html`标签

html标签就是整个浏览器可视区的根元素（块级元素）(html标签默认不是跟浏览器可视区的高度一样的，你要将其高设为100%才是一样的)



## `<link>`标签

Icon图标设置

```html
<link rel="icon" href="ico图标路径" type="image/x-icon">
```

rel属性的属性值preload、prefetch和modulepreload都用于资源预加载，但它们在具体的用途和加载时机上有所区别。

1. rel="preload"：用于指定需要在页面加载时提前加载的关键资源。这些资源通常是当前页面所必需的资源，如CSS文件、字体文件、JavaScript文件等。通过使用rel="preload"，浏览器可以在页面加载过程中提前请求和加载这些资源，以提高页面加载速度。
2. rel="prefetch"：用于指定需要在将来页面中可能会用到的资源。这些资源通常是当前页面并不紧急需要加载的，但在后续页面中可能会用到的资源。通过使用rel="prefetch"，浏览器可以在空闲时间预先请求和加载这些资源，以提高后续页面的加载速度。
3. rel="modulepreload"：用于指定需要在ES模块化脚本中预加载的模块资源。这些资源通常是在ES模块化脚本中通过import语句引入的模块文件。通过使用rel="modulepreload"，浏览器可以在页面加载过程中提前请求和加载这些模块资源，以提高模块化脚本的执行效率。

## 常⽤的meta标签

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些`name`作为大家使用的共识，开发者还可以自定义name。

常用的meta标签： 

（1）`charset`，用来描述HTML文档的编码类型：

```html
<meta charset="UTF-8" >
复制代码
```

（2） `keywords`，页面关键词：

```html
<meta name="keywords" content="关键词" />
复制代码
```

（3）`description`，页面描述：

```html
<meta name="description" content="页面描述内容" />
复制代码
```

（4）`refresh`，页面重定向和刷新：

```html
<meta http-equiv="refresh" content="0;url=" />
复制代码
```

（5）`viewport`，适配移动端，可以控制视口的大小和比例：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

meta标签的content属性里包含两个选项。首先，它告诉浏览器当解析CSS时将设备的当前宽度作为假定宽度，而不是一个全屏的桌面浏览器的宽度。其次当页面加载时，它使用initial-scale将缩放比设置为100%。

其中，`content` 参数有以下几种：

- `width` ：宽度(数值/device-width)
- `height` ：高度(数值/device-height)
- `initial-scale` ：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale` ：最小缩放比例
- `user-scalable` ：是否允许用户缩放(yes/no）

（6）搜索引擎索引方式：

```html
<meta name="robots" content="index,follow" />
复制代码
```

其中，`content` 参数有以下几种：

- `all`：文件将被检索，且页面上的链接可以被查询；
- `none`：文件将不被检索，且页面上的链接不可以被查询；
- `index`：文件将被检索；
- `follow`：页面上的链接可以被查询；
- `noindex`：文件将不被检索；
- `nofollow`：页面上的链接不可以被查询。



## `<a>`标签

1.  a href = “javascript:;” 含义
    让超链接去执行js函数,点击此超链接时,页面不会进行任何操作，其中javascript:是一个伪协议,可以让我们通过超链接去调用javascript函数,但是这个函数为空,所以我们调用的是一个空函数,相当于"javascript:void(0)"

2.  a href="#" 含义
    将href="#“是指连接到当前页面,这是一个锚链接,可以用来访问锚点






## SEO三大标签

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/SEO三大标签.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/SEO三大标签.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/SEO三大标签.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/SEO三大标签.png" loading="lazy"/>
  </picture>





## `<input>`各种type

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-07-14-09-image-20230807140919977.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-07-14-09-image-20230807140919977.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-07-14-09-image-20230807140919977.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-07-14-09-image-20230807140919977.png" loading="lazy"/>
  </picture>



## iframe

#### iframe 的好处

1. 解决跨域 iframe 嵌套支持 postMessage 方法，完美避开跨域的问题,点[这里](https://juejin.cn/post/6982759183179317279)查看 postMesage 的具体用法
2. 复用功能 避免重复开发功能
3. 加载广告 广告页面与顶层页面一般不涉及页面间通信，仅使用嵌套功能非常适合
4. 天然的沙箱 实现了 css 隔离和 js 隔离，在微前端实践中占有一席之地

#### iframe 的缺点

1. 页面样式风格不统一
    顶层页面和内嵌页面的样式风格迥异，页面看起来不美观，没有项目的一体感，用户体验下降。
2. 阻塞顶层页面的 onload 事件
    内嵌页面加载完毕之后，主页面才加载完毕。
3. 共享连接池
    顶层页面和内层页面共享连接池，在 chrome 下同时只能发送 6 个 http 请求，iframe 的嵌入会影响主页面的资源加载。





## script标签

https://juejin.cn/post/6917898288481959943#heading-3





### script标签中defer和async的区别

下图可以直观的看出三者之间的区别:(蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析)

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-zuVjnR.webp?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-zuVjnR.webp?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-zuVjnR.webp" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-zuVjnR.webp" loading="lazy"/>
  </picture>

#### `<script>`

浏览器加载 HTML 时遇到 `<script>...</script>` 标签或者外部脚本 `<script src="..."></script>` 时，浏览器就不能继续构建 DOM，它必须立刻下载并执行此脚本。

#### `<script defer>`

`defer` 特性让浏览器将继续处理 HTML，构建 DOM。脚本会“在后台”并行下载，然后等 DOM 构建完成后，脚本会等到 DOM 解析完毕，但在 `DOMContentLoaded` 事件==之前==执行。脚本的执行顺序还是跟写的代码顺序一样。 **`defer` 特性仅适用于外部脚本**，如果 `<script>` 脚本没有 `src`，则会忽略 `defer` 特性。

`defer` 属性对[模块脚本](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)也不会生效——它们默认是 defer 的。

#### `<script async>`

`async` 脚本就是一个 会在加载完成时就马上执行的 完全独立的 脚本。DOM 和其他脚本不会等待它们，它们也不会等待其它的东西。async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。

- 适用场景：当我们将独立的第三方脚本集成到页面时，此时采用异步加载方式是非常棒的：计数器，广告等，因为它们不依赖于我们的脚本，我们的脚本也不应该等待它们：

```html
<!-- Google Analytics 脚本通常是这样嵌入页面的 -->
<script async src="https://google-analytics.com/analytics.js"></script>
```



#### document.createElement

使用 document.createElement 创建的 script 默认是async的，示例如下。

```javascript
console.log(document.createElement("script").async); // true
```

所以，通过动态添加 script 标签引入 JavaScript 文件默认是不会阻塞页面的。如果想同步执行，需要将 async 属性人为设置为 false。







## 标签总览

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-41-image-20230429134119021.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-41-image-20230429134119021.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-41-image-20230429134119021.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-41-image-20230429134119021.png" loading="lazy"/>
  </picture>





# 属性

### HTML Attributes 与 DOM Properties

**HTML Attributes** 指的就是定义在 HTML 标签上的属性，这里指的就是 id="my-input"、type="text" 和 value="foo"。

当浏览器解析这段 HTML 代码后，会创建一个与之相符的 DOM 元素对象，这个 DOM 对象会包含很多属性（properties），这些属性就是所谓的 **DOM Properties**。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-12-28-image-20240112122845399.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-12-28-image-20240112122845399.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-12-28-image-20240112122845399.png" alt="image-20240112122845399" style="zoom:33%;" loading="lazy"/>
  </picture>



很多 HTML Attributes 在 DOM 对象上有与之同名的 DOM Properties，例如 id="my-input" 对应 el.id，type="text" 对应el.type，value="foo" 对应 el.value 等。但 DOM Properties 与 HTML Attributes 的名字不总是一模一样的，例如：**class对应的 DOM Properties 则是 el.className**。另外，并不是所有HTML Attributes 都有与之对应的 DOM Properties，例如：aria-* 类的 HTML Attributes 就没有与之对应的 DOM Properties。类似地，也不是所有 DOM Properties 都有与之对应的 HTML Attributes，例如可以用 el.textContent 来设置元素的文本内容，但并没有与之对应的 HTML Attributes 来完成同样的工作。



<mark>HTML Attributes 的作用是设置与之对应的 DOM Properties 的初始值。</mark>一旦值改变，那么 DOM Properties 始终存储着当前值，而通过 getAttribute 函数得到的仍然是初始值。也可以通过 el.defaultValue 来访问初始值。这说明一个 HTML Attributes 可能关联多个 DOM Properties。例如value="foo" 与 el.value 和 el.defaultValue 都有关联。

如果你通过HTML Attributes 提供的默认值不合法，那么浏览器会使用内建的合法值作为对应DOM Properties 的默认值，例如：为 `<input/>` 标签的 type 属性指定字符串 'foo' 是不合法的，因此浏览器会矫正这个不合法的值。所以当我们尝试读取 el.type 时，得到的其实是矫正后的值，即字符串 'text'，而非字符串 'foo'。





### `rel`

**`rel`** 属性定义了所链接的资源与当前文档的关系，在 `<a>`、`<area>`、`<link>`元素上有效。支持的值取决于拥有该属性的元素。

关系的类型是由 `rel` 属性的值给出的，如果存在的话，它的值必须是一组无序的、唯一的、用空格隔开的关键字。



### inert

inert 是一个 attribute，可以让拥有该属性的 dom 与其子元素无法被访问，即无法被点击、选中、也无法通过快捷键选中：

```
<div inert>...</div>
```



# 元素

### 行内元素和块级元素

- 行内元素有：`a b span img button input select strong iframe `；
- 块级元素有：`div ul ol li dl dt dd h1-6 p`；

#### 块级元素和行内元素的区别

1. 块级元素会独占一行，其宽度自动填满其父元素宽度。如果没有人为设定高度的话，高度随内容改变。
   行内元素不会独占一行，相邻的行内元素会排列在同一行里，知道一行排不下，才会换行，其宽度和高度都随元素的内容而变化

2. 块级元素可以设置 width, height属性，【注意：块级元素即使设置了宽度，仍然是独占一行的】
   行内元素设置width, height无效;

3. 块级元素可以设置margin 和 padding.
   行内元素的水平方向的padding-left,padding-right,margin-left,margin-right 都产生边距效果，但是竖直方向的padding-top,padding-bottom,margin-top,margin-bottom都不会产生边距效果。（水平方向有效，竖直方向无效）。所以需要设置行高，还需要一行显示多个，那就设为inline-block



#### 使行内元素可以设置宽高的方法

1. 变为块级或行内块
2. 脱标（浮动、绝对定位、固定定位）



块级元素脱标后其宽度就变成随内容改变而改变



### 空(void)元素有那些

（它是空元素跟它是块级还是行内没有半毛钱关系）

空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签：空标签是用不了伪元素的

- 常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`；





## 替换元素的概念及计算规则

> 通过修改某个属性值呈现的内容就可以被替换的元素就称为“替换元素”。

#### 典型的可替换元素有：

- [`iframe`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe)
- [`video`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video)
- [`embed`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/embed)
- [`img`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)

有些元素仅在特定情况下被作为可替换元素处理，例如：

- [`option`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/option)
- [`audio`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio)
- [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)
- [`object`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/object)
- [`applet`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/applet)

HTML 规范也说了` <input> `元素可替换，因为 "image" 类型的` <input> `元素就像`<img>`一样被替换。但是其他形式的控制元素，包括其他类型的 `<input> `元素，被明确地列为非可替换元素（non-replaced elements）

用 CSS [`content`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content) 属性插入的对象是匿名的可替换元素。它们并不存在于 HTML 标记中，因此是“匿名的”。

#### 替换元素除了内容可替换这一特性以外，还有以下特性：

- **内容的外观不受页面上的CSS的影响**：用专业的话讲就是在样式表现在CSS作用域之外。如何更改替换元素本身的外观需要类似appearance属性，或者浏览器自身暴露的一些样式接口。
- **有自己的尺寸**：在Web中，很多替换元素在没有明确尺寸设定的情况下，其默认的尺寸（不包括边框）是300像素×150像素，如
- **在很多CSS属性上有自己的一套表现规则**：比较具有代表性的就是vertical-align属性，对于替换元素和非替换元素，vertical-align属性值的解释是不一样的。比方说vertical-align的默认值的baseline，很简单的属性值，基线之意，被定义为字符x的下边缘，而替换元素的基线却被硬生生定义成了元素的下边缘。
- **所有的替换元素都是内联水平元素**：也就是替换元素和替换元素、替换元素和文字都是可以在一行显示的。但是，替换元素默认的display值却是不一样的，有的是inline，有的是inline-block。

#### 替换元素的尺寸从内而外分为三类：

- **固有尺寸：** 指的是替换内容原本的尺寸。例如，图片、视频作为一个独立文件存在的时候，都是有着自己的宽度和高度的。
- **HTML尺寸：** 只能通过HTML原生属性改变，这些HTML原生属性包括的width和height属性、的size属性。
- **CSS尺寸：** 特指可以通过CSS的width和height或者max-width/min-width和max-height/min-height设置的尺寸，对应盒尺寸中的content box。

这三层结构的计算规则具体如下： （1）如果没有CSS尺寸和HTML尺寸，则使用固有尺寸作为最终的宽高。 （2）如果没有CSS尺寸，则使用HTML尺寸作为最终的宽高。 （3）如果有CSS尺寸，则最终尺寸由CSS属性决定。 （4）如果“固有尺寸”含有固有的宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例显示。 （5）如果上面的条件都不符合，则最终宽度表现为300像素，高度为150像素。 （6）内联替换元素和块级替换元素使用上面同一套尺寸计算规则



# 字符

## 空格

`&nbsp;`表示一个空格



## 换行

`<br>` 是一个空元素，表示换行，不需要闭合标签。



## 乘法符号

HTML字符&times；可以显示为这个字符，

在CSS的content属性里，必须写成转义的Unicode数字：\00D7。

```css
.classname::after{
	content: "\00D7";
}
```



## 汉堡包菜单字符

Unicode字符（\2261）。这个字符是一个数学符号，由三条横线组成，即汉堡包菜单。



# 绘图canvas与svg与webgl

## 对比

首先明确Dom最大的问题在于重排重绘，所以图表不会用dom来画

### 总览

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-25-image-20230429142507857.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-25-image-20230429142507857.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-25-image-20230429142507857.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-25-image-20230429142507857.png" loading="lazy"/>
  </picture>





### 适用场景

小画布、大数据量的场景适合用 Canvas，譬如热力图、大数据量的散点图等。如果画布非常大，有缩放、平移等高频的交互，或者移动端对内存占用量非常敏感等场景，可以使用 SVG 的方案,svg 绘制的是矢量图，放大后不会失真，所以很适合做地图。

下图从通用层面描述不同渲染技术各自适合的场景。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IkLBom.jpg?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IkLBom.jpg?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IkLBom.jpg" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IkLBom.jpg" loading="lazy"/>
  </picture>

### 性能差异

<mark>Canvas 的性能受画布尺寸影响更大，而 SVG 的性能受图形元素个数影响更大（因为svg的渲染过程跟 DOM 一样也要渲染树的生成、布局合成、绘制）。</mark>而且在小数据量的情况下，SVG 的方案通常内存占用会更小，做缩放、平移等操作的时候往往帧率也更高，缩放功能时不会模糊。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-15-19-15-image-20231215191522858.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-15-19-15-image-20231215191522858.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-15-19-15-image-20231215191522858.png" alt="image-20231215191522858" style="zoom:50%;" loading="lazy"/>
  </picture>



1. **绘图方式**：Canvas 使用基于像素的绘图方式，而 SVG 使用基于矢量的绘图方式。在 Canvas 中，图形被转换为像素，并直接绘制在画布上。而在 SVG 中，图形是通过数学公式和几何描述来定义的，需要在每次渲染时重新计算和绘制。这使得 Canvas 在处理大量图形元素时更高效。
2. **渲染方式**：Canvas 绘制后的图形是静态的位图，不会保留图形的结构信息。而 SVG 保留了图形的结构和属性信息，因此在每次渲染时都需要解析和计算这些信息。这使得 Canvas 在动态更新和频繁重绘时更快。
3. **复杂性**：由于 SVG 保留了图形的结构信息，它可以更容易地进行交互和修改。但这也增加了渲染的复杂性和计算量。相比之下，Canvas 简单地将图形绘制在画布上，不需要处理图形的结构信息，因此更高效。



## canvas

### 介绍

**`Canvas` 是 HTML5 中的一个元素，它提供了一个用于绘制图形、动画和图像的空白画布**。Canvas 可以通过 JavaScript 来操作，使开发者可以在网页上实时绘制和渲染图形。





### 使用

#### 总览

所有api汇总：https://www.canvasapi.cn/

canvas dom 节点有两个属性 `width 和 Height`，分别代表 Canvas 的宽和高；canvas dom 节点有`三个方法`，分别是 getContext、toDataURL 和 toBlob。

getContext 返回一个绘图上下文对象，用于在 Canvas 上绘制。还有两个不太常见的 API，在下载传输的时候我们会用到：

- `toDataURL`：用于将 Canvas 图像数据转换为数据 URL。它接收一个参数，表示图像的格式（默认为 `image/png` ）。该方法返回一个包含图像数据的 Base64 编码的数据 URL，可以使用这个数据 URL 来显示图像或在 HTML 中嵌入图像。
- `toBlob`：用于将 Canvas 图像数据转换为 Blob 对象。它接收两个参数，第一个参数是一个回调函数，用于接收生成的 Blob 对象，第二个参数是图像的格式（默认为 `image/png` ）。该方法将生成的 Blob 对象作为回调函数的参数传递。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-30-21-54-image-20240130215447275.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-30-21-54-image-20240130215447275.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-30-21-54-image-20240130215447275.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-30-21-54-image-20240130215447275.png" loading="lazy"/>
  </picture>

```html
<body>
    <canvas id="myCanvas">
        // 一旦浏览器不兼容canvas，会默认渲染内部结构
        浏览器不支持canvas
    </canvas>
</body>
```





#### 设置canvas环境

##### 元素属性

[`width`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas#attr-width)和[`height`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas#attr-height)。当没有设置宽度和高度的时候，canvas 会初始化宽度为 300 像素和高度为 150 像素。<mark>也可以使用[CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS)来定义大小，但在绘制时图像会伸缩以适应它的框架尺寸：如果 CSS 的尺寸与初始画布的比例不一致，它会出现扭曲。</mark>

>  **备注：** 如果你绘制出来的图像是扭曲的，尝试用 width 和 height 属性为`<canvas>`明确规定宽高，而不是使用 CSS。



##### 渲染上下文

[`getContext()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext) ，这个方法是用来获得渲染上下文和它的绘画功能。`getContext()`接受一个参数，即上下文的类型。

```js
var canvas = document.getElementById('tutorial');//得到 DOM 对象
var ctx = canvas.getContext('2d');//有了元素对象，你可以通过使用它的 getContext() 方法来访问绘画上下文。
```

Canvas 上下文容器不仅仅可以获取 2D 的上下文，还可以获取 3D 的上下文，比如 WebGL。





##### [检查支持性](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Basic_usage#检查支持性)

通过简单的测试 `getContext()` 方法的存在，脚本可以检查编程支持性。

```js
var canvas = document.getElementById('tutorial');

if (canvas.getContext){
  var ctx = canvas.getContext('2d');
  // drawing code here
} else {
  // canvas-unsupported code here
}
```



#### 绘制图形

[`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 只支持两种形式的图形绘制：矩形和路径（由一系列点连成的线段）

##### 栅格

canvas 元素默认被网格所覆盖。通常来说网格中的一个单元相当于 canvas 元素中的一像素。栅格的起点为左上角（坐标为（0,0））。所有元素的位置都相对于原点定位。



##### 绘制矩形



canvas 提供了三种方法绘制矩形：

- [`fillRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillRect)

  绘制一个填充的矩形

- [`strokeRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeRect)

  绘制一个矩形的边框

- [`clearRect(x, y, width, height)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/clearRect)

  清除指定矩形区域，让清除部分完全透明。

上面提供的方法之中每一个都包含了相同的参数。x 与 y 指定了在 canvas 画布上所绘制的矩形的左上角（相对于原点）的坐标。width 和 height 设置矩形的尺寸。

也有 rect() 方法，将一个矩形路径增加到当前路径上。

- `rect(x, y, width, height)`

  绘制一个左上角坐标为（x,y），宽高为 width 以及 height 的矩形。

当该方法执行的时候，moveTo() 方法自动设置坐标参数（0,0）。也就是说，当前笔触自动重置回默认坐标。



#### 绘制路径

##### 绘制步骤

使用路径绘制图形需要一些额外的步骤。

1. 首先，你需要创建路径起始点。
2. 然后你使用[画图命令](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D#paths)去画出路径。
3. 之后你把路径封闭。
4. 一旦路径生成，你就能通过描边或填充路径区域来渲染图形。

以下是所要用到的函数：

- `beginPath()`

  新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。

- `closePath()`

  闭合路径之后图形绘制命令又重新指向到上下文中。

- `stroke()`

  通过线条来绘制图形轮廓。

- `fill()`

  通过填充路径的内容区域生成实心的图形。

第一步叫做 beginPath()。本质上，路径是由很多子路径构成，这些子路径都是在一个列表中，所有的子路径（线、弧形、等等）构成图形。而每次这个方法调用之后，列表清空重置，然后我们就可以重新绘制新的图形。

> **当前路径为空，即调用 beginPath() 之后，或者 canvas 刚建的时候，第一条路径构造命令通常被视为是 moveTo（）**

第二步就是调用函数指定绘制路径。

第三，就是闭合路径 closePath(),不是必需的。这个方法会通过绘制一条从当前点到开始点的直线来闭合图形。如果图形是已经闭合了的，即当前点为开始点，该函数什么也不做。

> 当你调用 fill() 函数时，所有没有闭合的形状都会自动闭合，所以你不需要调用 closePath() 函数。但是调用 stroke() 时不会自动闭合，所以如果想要闭合则要调用closePath函数。





##### [移动笔触](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#移动笔触)

这个函数实际上并不能画出任何东西，也是上面所描述的路径列表的一部分，这个函数就是`moveTo()`。或者你可以想象一下在纸上作业，一支钢笔或者铅笔的笔尖从一个点到另一个点的移动过程。

- `moveTo(x, y)`

  将笔触移动到指定的坐标 x 以及 y 上。



##### 画线

- [`lineTo(x, y)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineTo)

  绘制一条从当前位置到指定 x 以及 y 位置的直线。

该方法有两个参数：x 以及 y，代表坐标系中直线结束的点。开始点和之前的绘制路径有关，之前路径的结束点就是接下来的开始点，开始点也可以通过`moveTo()`函数改变。





##### 圆弧

- [`arc(x, y, radius, startAngle, endAngle, anticlockwise)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arc)

  画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。

- [`arcTo(x1, y1, x2, y2, radius)`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/arcTo)

  根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点。

这里详细介绍一下 arc 方法，该方法有六个参数：`x,y`为绘制圆弧所在圆上的圆心坐标。`radius`为半径。`startAngle`以及`endAngle`参数用弧度定义了开始以及结束的弧度。这些都是以 x 轴为基准。参数`anticlockwise`为一个布尔值。为 true 时，是逆时针方向，否则顺时针方向。

>  **备注：** `arc()` 函数中表示角的单位是弧度，不是角度。角度与弧度的 js 表达式：**弧度=(Math.PI/180)\*角度。**





##### [二次贝塞尔曲线及三次贝塞尔曲线](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#二次贝塞尔曲线及三次贝塞尔曲线)

###### 介绍

- `quadraticCurveTo(cp1x, cp1y, x, y)`

  绘制二次贝塞尔曲线，`cp1x,cp1y` 为一个控制点，`x,y` 为结束点。

- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)`

  绘制三次贝塞尔曲线，`cp1x,cp1y`为控制点一，`cp2x,cp2y`为控制点二，`x,y`为结束点。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-LTUaZy.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-LTUaZy.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-LTUaZy.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-LTUaZy.png" loading="lazy"/>
  </picture>左边的图能够很好的描述两者的关系，二次贝塞尔曲线有一个开始点（蓝色）、一个结束点（蓝色）以及一个控制点（红色)，而三次贝塞尔曲线有两个控制点。

参数 x、y 在这两个方法中都是结束点坐标。`cp1x,cp1y`为坐标中的第一个控制点，`cp2x,cp2y`为坐标中的第二个控制点。

###### 二次贝塞尔曲线例子

这个例子使用多个贝塞尔曲线来渲染对话气泡。

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    // 二次贝塞尔曲线
    ctx.beginPath();
    ctx.moveTo(75, 25);
    ctx.quadraticCurveTo(25, 25, 25, 62.5);
    ctx.quadraticCurveTo(25, 100, 50, 100);
    ctx.quadraticCurveTo(50, 120, 30, 125);
    ctx.quadraticCurveTo(60, 120, 65, 100);
    ctx.quadraticCurveTo(125, 100, 125, 62.5);
    ctx.quadraticCurveTo(125, 25, 75, 25);
    ctx.stroke();
   }
}
```



###### 三次贝塞尔曲线例子

这个例子使用贝塞尔曲线绘制心形。

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

     //三次贝塞尔曲线
    ctx.beginPath();
    ctx.moveTo(75, 40);
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    ctx.fill();
  }
}
```



#### [Path2D 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#path2d_对象)

用来缓存或记录绘画命令

- [`Path2D()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Path2D/Path2D)

  `Path2D()`会返回一个新初始化的 Path2D 对象（可能将某一个路径作为变量——创建一个它的副本，或者将一个包含 SVG path 数据的字符串作为变量）。

```js
new Path2D();     // 空的 Path 对象
new Path2D(path); // 克隆 Path 对象
new Path2D(d);    // 从 SVG 建立 Path 对象,这将使你获取路径时可以以 SVG 或 canvas 的方式来重用它们。
```

所有的路径方法比如`moveTo`, `rect`, `arc`或`quadraticCurveTo`等，如我们前面见过的，都可以在 Path2D 中使用。

Path2D API 添加了 `addPath`作为将`path`结合起来的方法。当你想要从几个元素中来创建对象时，这将会很实用。比如：

- **[`Path2D.addPath(path [, transform\])`](https://developer.mozilla.org/zh-CN/docs/Web/API/Path2D/addPath)**

  添加了一条路径到当前路径（可能添加了一个变换矩阵）。

##### [Path2D 示例](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#path2d_示例)

在这个例子中，我们创造了一个矩形和一个圆。它们都被存为 Path2D 对象，后面再派上用场。随着新的 Path2D API 产生，几种方法也相应地被更新来使用 Path2D 对象而不是当前路径。在这里，带路径参数的`stroke`和`fill`可以把对象画在画布上。

```js
function draw() {
  var canvas = document.getElementById('canvas');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');

    var rectangle = new Path2D();
    rectangle.rect(10, 10, 50, 50);

    var circle = new Path2D();
    circle.moveTo(125, 35);
    circle.arc(100, 35, 25, 0, 2 * Math.PI);

    ctx.stroke(rectangle);
    ctx.fill(circle);
  }
}
```





#### 样式和颜色



##### [色彩 Colors](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors#色彩_colors)

到目前为止，我们只看到过绘制内容的方法。如果我们想要给图形上色，有两个重要的属性可以做到：`fillStyle` 和 `strokeStyle`。

- [`fillStyle = color`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle)

  设置图形的填充颜色。

- [`strokeStyle = color`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle)

  设置图形轮廓的颜色。

`color` 可以是表示 CSS 颜色值的字符串，渐变对象或者图案对象。我们迟些再回头探讨渐变和图案对象。默认情况下，线条和填充颜色都是黑色（CSS 颜色值 `#000000`）。

> 一旦您设置了 `strokeStyle` 或者 `fillStyle` 的值，那么这个新值就会成为新绘制的图形的默认值。如果你要给每个图形上不同的颜色，你需要重新设置 `fillStyle` 或 `strokeStyle` 的值。



其余教程看这里https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors







#### 变形 Transformations

##### [状态的保存和恢复 Saving and restoring state](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Transformations#状态的保存和恢复_saving_and_restoring_state)

- [`save()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save)

  保存画布 (canvas) 的所有状态

- [`restore()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/restore)

  save 和 restore 方法是用来保存和恢复 canvas 状态的，都没有参数。Canvas 的状态就是当前画面应用的所有样式和变形的一个快照。

Canvas 状态存储在栈中，每当`save()`方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

- 当前应用的变形（即移动，旋转和缩放，见下）
- 以及下面这些属性：[`strokeStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/strokeStyle), [`fillStyle`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/fillStyle), [`globalAlpha`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalAlpha), [`lineWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineWidth), [`lineCap`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap), [`lineJoin`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin), [`miterLimit`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/miterLimit), [`lineDashOffset`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineDashOffset), [`shadowOffsetX`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX), [`shadowOffsetY`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY), [`shadowBlur`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowBlur), [`shadowColor`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/shadowColor), [`globalCompositeOperation`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation), [`font`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/font), [`textAlign`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textAlign), [`textBaseline`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/textBaseline), [`direction`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/direction), [`imageSmoothingEnabled`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled)
- 当前的[裁切路径（clipping path）](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing#clipping_paths)，会在下一节介绍

你可以调用任意多次 `save`方法。每一次调用 `restore` 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。



### 库

konva



## svg

### 简介

**可缩放矢量图形**（**Scalable Vector Graphics，SVG**）基于 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML) 标记语言，用于描述二维的[矢量图形](https://zh.wikipedia.org/wiki/矢量图形)。解决网站图标问题的最佳方案。

SVG 图像及其相关行为被定义于 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML/XML_Introduction) 文本文件之中，这意味着可以对它们进行搜索、索引、编写脚本以及压缩。此外，这也意味着可以使用任何文本编辑器和绘图软件来创建和编辑它们。SVG 只是文本，因此可以使用 GZip 对其进行有效压缩。

和传统的点阵图像模式（如 [JPEG](https://developer.mozilla.org/zh-CN/docs/Glossary/jpeg) 和 [PNG](https://developer.mozilla.org/zh-CN/docs/Glossary/PNG)）不同的是，SVG 格式提供的是矢量图，这意味着它的图像能够被无限放大而不失真或降低质量，并且可以方便地修改内容，无需图形编辑器。

<mark>SVG 中保存的是点、线、面的信息，用数学公式和几何描述来定义图形，与分辨率和图形大小无关，只是跟图像的复杂程度有关，所以图像文件所占的存储空间通常会比 png 小。</mark>

它的渲染过程跟 DOM 一样也要渲染树的生成、布局合成、绘制，这也就意味着大批量的图形对于 SVG 来说很容易造成卡顿。可以使用事件直接对元素做绑定。

### 使用

#### Web 端引入 SVG 的不同方式

1. **img**。这个是将 SVG 图像添加到网页的最简单方法。若要使用此方法，请将元素添加到 HTML 文档中并在属性中引用它，如下所示：

> `<img>`尽管我们可以更改通过标签添加的 SVG 图像的大小，但如果你想对 SVG 图像进行重大样式更改，仍然存在一些限制。

```js
js
复制代码<img src = "happy.svg" alt="My Happy SVG"/>
```

1. **background-image**。如下：

```js
js
复制代码body {
  background-image: url(happy.svg);
}
```

1. **内联 SVG**。SVG 图像可以使用标签直接写入 HTML 文档。`<svg> </svg>`。
2. **object**。你还可以通过 HTML 元素使用以下代码语法将 SVG 图像添加到网页：

```
<object>
html
复制代码<object data="happy.svg" width="300" height="300"> </object>
```

1. **iframe**。使用此格式添加的 SVG 图像不可缩放，同时 SEO 也会有问题。
2. **embed**。我们在 HTML 中可以使用嵌入的方式引用，比如这样：`<embed><embed src="happy.svg" />`，但是该标签已经在大多数浏览器弃用了，不再推荐使用。

#### 属性

##### xmlns

`xmlns` 是 XML 命名空间属性，用于指定所使用的 XML 命名空间。命名空间是一种用于区分不同 XML 元素和属性的机制，以确保不同来源的 XML 数据可以正确解析和处理。但是，如果嵌入在 HTML 内部，xmlns 属性是可以被省略的。



>xmlns 和 xmlns:xlink 是 XML 命名空间的属性，而 xlink:href 是 XLink 规范中的属性。它们之间的区别如下：
>
>1. xmlns 属性用于定义 XML 文档中的默认命名空间。它指定了 XML 元素和属性的命名空间，如果没有指定其他命名空间，则默认使用该命名空间。
>
>2. xmlns:xlink 属性也是用于定义 XML 文档中的命名空间，但它是为了支持 XLink（XML 链接）规范而定义的。xmlns:xlink 属性指定了用于解析和处理 XLink 链接的命名空间。
>
>3. xlink:href 是 XLink 规范中的属性，用于指定链接的目标。它是在具有 XLink 命名空间的 XML 文档中使用的属性，通过该属性可以指定链接的目标资源。
>
>   **综上所述，xmlns 属性用于定义默认命名空间，xmlns:xlink 属性用于定义 XLink 命名空间，而 xlink:href 属性用于指定 XLink 链接的目标资源。**





##### Css属性

CSS 属性的权重是比 SVG 的属性大的。

在 [Property Index — SVG 2 (w3.org)](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3.org%2FTR%2FSVG%2Fpropidx.html) 中查看所有可影响 SVG 的 CSS 属性。



#### 画基本形状

##### [矩形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#矩形)

`rect`元素会在屏幕上绘制一个矩形。其实只要 6 个基本属性就可以控制它在屏幕上的位置和形状。上面的图例中最先展示了 2 个矩形，虽然这有点冗余了。右边的那个图形设置了 rx 和 ry 属性用来控制圆角。如果没有设置圆角，则默认为 0。

```
<svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
<rect x="10" y="10" width="30" height="30"/>
<rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
</svg>
```

- x

  矩形左上角的 x 位置

- y

  矩形左上角的 y 位置

- width

  矩形的宽度

- height

  矩形的高度

- rx

  圆角的 x 方位的半径

- ry

  圆角的 y 方位的半径

##### [圆形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#圆形)

正如你猜到的，`circle`元素会在屏幕上绘制一个圆形。它只有 3 个属性用来设置圆形。

```
<circle cx="25" cy="75" r="20"/>
```

Copy to Clipboard

- r

  圆的半径

- cx

  圆心的 x 位置

- cy

  圆心的 y 位置

##### [椭圆](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#椭圆)

[Ellipse](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/ellipse) 是`circle`元素更通用的形式，你可以分别缩放圆的 x 半径和 y 半径（通常数学家称之为长轴半径和短轴半径）。

```
<ellipse cx="75" cy="75" rx="20" ry="5"/>
```

- rx

  椭圆的 x 半径

- ry

  椭圆的 y 半径

- cx

  椭圆中心的 x 位置

- cy

  椭圆中心的 y 位置

##### [线条](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#线条)

[Line](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/line) 绘制直线。它取两个点的位置作为属性，指定这条线的起点和终点位置。

```
<line x1="10" x2="50" y1="110" y2="150"/>
```

- x1

  起点的 x 位置

- y1

  起点的 y 位置

- x2

  终点的 x 位置

- y2

  终点的 y 位置

##### [折线](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#折线)

[Polyline](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/polyline)是一组连接在一起的直线。因为它可以有很多的点，折线的的所有点位置都放在一个 points 属性中：

```
<polyline points="60 110, 65 120, 70 115, 75 130, 80 125, 85 140, 90 135, 95 150, 100 145"/>
```

- points

  点集数列。每个数字用空白、逗号、终止命令符或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。所以点列表 (0,0), (1,1) 和 (2,2) 可以写成这样：“0 0, 1 1, 2 2”。

##### [多边形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#多边形)

[`polygon`](https://developer.mozilla.org/zh-CN/docs/SVG/Element/polygon)和折线很像，它们都是由连接一组点集的直线构成。不同的是，`polygon`的路径在最后一个点处自动回到第一个点。需要注意的是，矩形也是一种多边形，如果需要更多灵活性的话，你也可以用多边形创建一个矩形。

```
<polygon points="50 160, 55 180, 70 180, 60 190, 65 205, 50 195, 35 205, 40 190, 30 180, 45 180"/>
```

- points

  点集数列。每个数字用空白符、逗号、终止命令或者换行符分隔开。每个点必须包含 2 个数字，一个是 x 坐标，一个是 y 坐标。所以点列表 (0,0), (1,1) 和 (2,2) 可以写成这样：“0 0, 1 1, 2 2”。路径绘制完后闭合图形，所以最终的直线将从位置 (2,2) 连接到位置 (0,0)。

#### 画[路径](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes#路径)

##### 简介

`path`可能是 SVG 中最常见的形状。你可以用 path 元素绘制矩形（直角矩形或者圆角矩形）、圆形、椭圆、折线形、多边形，以及一些其他的形状，例如贝塞尔曲线、2 次曲线等曲线。因为 path 很强大也很复杂，所以会在[下一章](https://developer.mozilla.org/zh-CN/docs/SVG/Tutorial/Paths)进行详细介绍。这里只介绍一个定义路径形状的属性。

```
<path d="M 20 230 Q 40 205, 50 230 T 90230"/>
```

- d

  一个点集数列以及其它关于如何绘制路径的信息。请阅读[Paths](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths) 章节以了解更多信息。

##### [直线命令](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#直线命令)

`<path>`元素里有 5 个画直线的命令，顾名思义，直线命令就是在两个点之间画直线。首先是“Move to”命令，M，前面已经提到过，它需要两个参数，分别是需要移动到的点的 x 轴和 y 轴的坐标。假设，你的画笔当前位于一个点，在使用 M 命令移动画笔后，只会移动画笔，但不会在两点之间画线。因为 M 命令仅仅是移动画笔，但不画线。所以 M 命令经常出现在路径的开始处，用来指明从何处开始画。

```
M x y
```

Copy to Clipboard

或

```
m dx dy
```

Copy to Clipboard

这有一个比较好的例子，不过我们没画任何东西，只是将画笔移动到路径的起点，所以我们不会看到任何图案。但是，我把我们移动到的点标注出来了，所以在下面的例子里会看到 (10,10) 坐标上有一个点。注意，如果只画 path，这里什么都不会显示。（这段不太好理解，说明一下：为了更好地展示路径，下面的所有例子里，在用 path 绘制路径的同时，也会用 circle 标注路径上的点。）

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Ie6Ykf.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Ie6Ykf.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Ie6Ykf.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Ie6Ykf.png" loading="lazy"/>
  </picture>

```
<?xml version="1.0" standalone="no"?>

<svg width="200px" height="200px" version="1.1" xmlns="http://www.w3.org/2000/svg">

  <path d="M10 10"/>

  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>

</svg>
```

Copy to Clipboard

能够真正画出线的命令有三个（M 命令是移动画笔位置，但是不画线），最常用的是“Line to”命令，`L`，`L`需要两个参数，分别是一个点的 x 轴和 y 轴坐标，L 命令将会在当前位置和新位置（L 前面画笔所在的点）之间画一条线段。

```
 L x y (or l dx dy)
```

Copy to Clipboard

另外还有两个简写命令，用来绘制水平线和垂直线。`H`，绘制水平线。`V`，绘制垂直线。这两个命令都只带一个参数，标明在 x 轴或 y 轴移动到的位置，因为它们都只在坐标轴的一个方向上移动。

```
 H x (or h dx)
 V y (or v dy)
```

Copy to Clipboard

现在我们已经掌握了一些命令，可以开始画一些东西了。先从简单的地方开始，画一个简单的矩形（同样的效果用`<rect/>`元素可以更简单的实现），矩形是由水平线和垂直线组成的，所以这个例子可以很好地展现前面讲的画线的方法。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IXpW1m.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IXpW1m.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IXpW1m.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IXpW1m.png" loading="lazy"/>
  </picture>

```
<?xml version="1.0" standalone="no"?>

<svg width="100px" height="100px" version="1.1" xmlns="http://www.w3.org/2000/svg">

  <path d="M10 10 H 90 V 90 H 10 L 10 10"/>

  <!-- Points -->
  <circle cx="10" cy="10" r="2" fill="red"/>
  <circle cx="90" cy="90" r="2" fill="red"/>
  <circle cx="90" cy="10" r="2" fill="red"/>
  <circle cx="10" cy="90" r="2" fill="red"/>

</svg>
```

Copy to Clipboard

最后，我们可以通过一个“闭合路径命令”Z 来简化上面的 path，`Z`命令会从当前点画一条直线到路径的起点，尽管我们不总是需要闭合路径，但是它还是经常被放到路径的最后。另外，Z 命令不用区分大小写。

```
 Z (or z)
```

Copy to Clipboard

所以上面例子里用到的路径，可以简化成这样：

```
 <path d="M10 10 H 90 V 90 H 10 Z" fill="transparent" stroke="black"/>
```

Copy to Clipboard

你也可以使用这些命令的相对坐标形式来绘制相同的图形，如之前所述，相对命令使用的是小写字母，它们的参数不是指定一个明确的坐标，而是表示相对于它前面的点需要移动多少距离。例如前面的示例，画的是一个 80*80 的正方形，用相对命令可以这样描述：

```
 <path d="M10 10 h 80 v 80 h -80 Z" fill="transparent" stroke="black"/>
```

Copy to Clipboard

上述路径是：画笔移动到 (10,10) 点，由此开始，向右移动 80 像素构成一条水平线，然后向下移动 80 像素，然后向左移动 80 像素，然后再回到起点。

你可能会问这些命令有什么用，因为 `<polygon>` 和 `<polyline>` 可以做到画出一样的图形。答案是，这些命令可以做得更多。如果你只是画直线，那么其他元素可能会更好用，但是，path 却是众多开发者在 SVG 绘制中经常用到的。据我所知，它们之间不存在性能上的优劣。但是通过脚本生成 path 可能有所不同，因为另外两种方法只需要指明点，而 path 在这方面的语法会更复杂一些。

##### [曲线命令](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#曲线命令)

绘制平滑曲线的命令有三个，其中两个用来绘制贝塞尔曲线，另外一个用来绘制弧形或者说是圆的一部分。如果你在 Inkscape、Illustrator 或者 Photoshop 中用过路径工具，可能对贝塞尔曲线有一定程度的了解。欲了解贝塞尔曲线的完整数学讲解，请阅读这份[Wikipedia 的文档](http://en.wikipedia.org/wiki/Bézier_curve)。在这里不用讲得太多。贝塞尔曲线的类型有很多，但是在 path 元素里，只存在两种贝塞尔曲线：三次贝塞尔曲线 C，和二次贝塞尔曲线 Q。

###### [贝塞尔曲线](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#贝塞尔曲线)

我们从稍微复杂一点的三次贝塞尔曲线 C 入手，三次贝塞尔曲线需要定义一个点和两个控制点，所以用 C 命令创建三次贝塞尔曲线，需要设置三组坐标参数：

```
C x1 y1, x2 y2, x y
(or)
c dx1 dy1, dx2 dy2, dx dy
```

这里的最后一个坐标 (x,y) 表示的是曲线的终点，另外两个坐标是控制点，(x1,y1) 是起点的控制点，(x2,y2) 是终点的控制点。如果你熟悉代数或者微积分的话，会更容易理解控制点，控制点描述的是曲线起始点的斜率，曲线上各个点的斜率，是从起点斜率到终点斜率的渐变过程。（文字描述不好，维基百科上有图示，更直观。）

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Xn79c6.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Xn79c6.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Xn79c6.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Xn79c6.png" loading="lazy"/>
  </picture>

```
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  <path d="M 70 10 C 70 20, 110 20, 110 10" stroke="black" fill="transparent"/>
  <path d="M 130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
  <path d="M 10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
  <path d="M 70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
  <path d="M 130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
  <path d="M 10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
  <path d="M 70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
  <path d="M 130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/>

</svg>
```

Copy to Clipboard

上面的例子里，创建了 9 个三次贝塞尔曲线。有一点比较遗憾，标记控制点的代码会比较庞大，所以在这里舍弃了。（之前所有点都用 circle 标记，此处一样，只不过没把代码列出来）。如果你想更准确地控制它们，可以自己动手把他们画出来。图例上的曲线从左往右看，控制点在水平方向上逐渐分开，图例上的曲线从上往下看，控制点和曲线坐标之间离得越来越远。这里要注意观察，曲线沿着起点到第一控制点的方向伸出，逐渐弯曲，然后沿着第二控制点到终点的方向结束。

你可以将若干个贝塞尔曲线连起来，从而创建出一条很长的平滑曲线。通常情况下，一个点某一侧的控制点是它另一侧的控制点的对称（以保持斜率不变）。这样，你可以使用一个简写的贝塞尔曲线命令 S，如下所示：

```
S x2 y2, x y
(or)
s dx2 dy2, dx dy
```

Copy to Clipboard

S 命令可以用来创建与前面一样的贝塞尔曲线，但是，如果 S 命令跟在一个 C 或 S 命令后面，则它的第一个控制点会被假设成前一个命令曲线的第二个控制点的中心对称点。如果 S 命令单独使用，前面没有 C 或 S 命令，那当前点将作为第一个控制点。下面是 S 命令的语法示例，图中左侧红色标记的点对应的控制点即为蓝色标记点。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CHely8.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CHely8.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CHely8.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CHely8.png" loading="lazy"/>
  </picture>

```
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
</svg>
```

Copy to Clipboard

另一种可用的贝塞尔曲线是二次贝塞尔曲线 Q，它比三次贝塞尔曲线简单，只需要一个控制点，用来确定起点和终点的曲线斜率。因此它需要两组参数，控制点和终点坐标。

```
Q x1 y1, x y
(or)
q dx1 dy1, dx dy
```

Copy to Clipboard

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-UFWrgk.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-UFWrgk.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-UFWrgk.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-UFWrgk.png" loading="lazy"/>
  </picture>

```
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 Q 95 10 180 80" stroke="black" fill="transparent"/>
</svg>
```

Copy to Clipboard

就像三次贝塞尔曲线有一个 S 命令，二次贝塞尔曲线有一个差不多的 T 命令，可以通过更简短的参数，延长二次贝塞尔曲线。

```
T x y
(or)
t dx dy
```

Copy to Clipboard

和之前一样，快捷命令 T 会通过前一个控制点，推断出一个新的控制点。这意味着，在你的第一个控制点后面，可以只定义终点，就创建出一个相当复杂的曲线。需要注意的是，T 命令前面必须是一个 Q 命令，或者是另一个 T 命令，才能达到这种效果。如果 T 单独使用，那么控制点就会被认为和终点是同一个点，所以画出来的将是一条直线。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8CqcIv.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8CqcIv.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8CqcIv.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8CqcIv.png" loading="lazy"/>
  </picture>

```
<svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 80 Q 52.5 10, 95 80 T 180 80" stroke="black" fill="transparent"/>
</svg>
```

Copy to Clipboard

虽然三次贝塞尔曲线拥有更大的自由度，但是两种曲线能达到的效果总是差不多的。具体使用哪种曲线，通常取决于需求，以及对曲线对称性的依赖程度。

###### [弧形](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths#弧形)

弧形命令 A 是另一个创建 SVG 曲线的命令。基本上，弧形可以视为圆形或椭圆形的一部分。假设，已知椭圆形的长轴半径和短轴半径，并且已知两个点（在椭圆上），根据半径和两点，可以画出两个椭圆，在每个椭圆上根据两点都可以画出两种弧形。所以，仅仅根据半径和两点，可以画出四种弧形。为了保证创建的弧形唯一，A 命令需要用到比较多的参数：

```
 A rx ry x-axis-rotation large-arc-flag sweep-flag x y
 a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
```

Copy to Clipboard

弧形命令 A 的前两个参数分别是 x 轴半径和 y 轴半径，它们的作用很明显，不用多做解释，如果你不是很清楚它们的作用，可以参考一下椭圆[ellipse](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/ellipse)命令中的相同参数。弧形命令 A 的第三个参数表示弧形的旋转情况，下面的例子可以很好地解释它：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vEfIzM.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vEfIzM.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vEfIzM.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vEfIzM.png" loading="lazy"/>
  </picture>

```
<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 315
           L 110 215
           A 30 50 0 0 1 162.55 162.45
           L 172.55 152.45
           A 30 50 -45 0 1 215.1 109.9
           L 315 10" stroke="black" fill="green" stroke-width="2" fill-opacity="0.5"/>
</svg>
```

Copy to Clipboard

如图例所示，画布上有一条对角线，中间有两个椭圆弧被对角线切开 (x radius = 30, y radius = 50)。第一个椭圆弧的 x-axis-rotation（x 轴旋转角度）是 0，所以弧形所在的椭圆是正置的（没有倾斜）。在第二个椭圆弧中，x-axis-rotation 设置为 -45，所以这是一个旋转了 45 度的椭圆，并以短轴为分割线，形成了两个对称的弧形。参看图示中的第二个椭圆形。

对于上图没有旋转的椭圆，只有 2 种弧形可以选择，不是 4 种，因为两点连线（也就是对角线）正好穿过了椭圆的中心。像下面这张图，就是普通的情况，可以画出两个椭圆，四种弧。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-akw0G2.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-akw0G2.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-akw0G2.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-akw0G2.png" loading="lazy"/>
  </picture>

```
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">
  <path d="M 10 315
           L 110 215
           A 36 60 0 0 1 150.71 170.29
           L 172.55 152.45
           A 30 50 -45 0 1 215.1 109.9
           L 315 10" stroke="black" fill="green" stroke-width="2" fill-opacity="0.5"/>
  <circle cx="150.71" cy="170.29" r="2" fill="red"/>
  <circle cx="110" cy="215" r="2" fill="red"/>
  <ellipse cx="144.931" cy="229.512" rx="36" ry="60" fill="transparent" stroke="blue"/>
  <ellipse cx="115.779" cy="155.778" rx="36" ry="60" fill="transparent" stroke="blue"/>
</svg>
```

Copy to Clipboard

上面提到的四种不同路径将由接下来的两个参数决定。如前所讲，还有两种可能的椭圆用来形成路径，它们给出的四种可能的路径中，有两种不同的路径。这里要讲的参数是 large-arc-flag（角度大小）和 sweep-flag（弧线方向），large-arc-flag 决定弧线是大于还是小于 180 度，0 表示小角度弧，1 表示大角度弧。sweep-flag 表示弧线的方向，0 表示从起点到终点沿逆时针画弧，1 表示从起点到终点沿顺时针画弧。下面的例子展示了这四种情况。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-HDxQNB.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-HDxQNB.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-HDxQNB.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-HDxQNB.png" loading="lazy"/>
  </picture>

```
<svg width="325" height="325" xmlns="http://www.w3.org/2000/svg">
  <path d="M 80 80
           A 45 45, 0, 0, 0, 125 125
           L 125 80 Z" fill="green"/>
  <path d="M 230 80
           A 45 45, 0, 1, 0, 275 125
           L 275 80 Z" fill="red"/>
  <path d="M 80 230
           A 45 45, 0, 0, 1, 125 275
           L 125 230 Z" fill="purple"/>
  <path d="M 230 230
           A 45 45, 0, 1, 1, 275 275
           L 275 230 Z" fill="blue"/>
</svg>
```

Copy to Clipboard

你应该已经猜到了，最后两个参数是指定弧形的终点，弧形可以简单地创建圆形或椭圆形图标，比如你可以创建若干片弧形，组成一个*饼图*。







#### 填充和边框

可以使用几种方法来着色（包括指定对象的属性）使用内联 CSS 样式、内嵌 CSS 样式，或者使用外部 CSS 样式文件。大多数的 web 网站的 SVG 使用的是内联样式 CSS，对于这些方法都有优缺点。

##### [Fill 和 Stroke 属性](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes#fill_和_stroke_属性)

###### [上色](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes#上色)

大多数基本的涂色可以通过在元素上设置两个属性来搞定：`fill`属性和`stroke`属性。`fill`属性设置对象内部的颜色，`stroke`属性设置绘制对象的线条的颜色。你可以使用在 HTML 中的 CSS 颜色命名方案定义它们的颜色，比如说颜色名（像*red*这种）、rgb 值（像 rgb(255,0,0) 这种）、十六进制值、rgba 值，等等。

```
 <rect x="10" y="10" width="100" height="100" stroke="blue" fill="purple"
       fill-opacity="0.5" stroke-opacity="0.8"/>
```

此外，在 SVG 中你可以分别定义填充色和边框色的不透明度，属性`fill-opacity`控制填充色的不透明度，属性`stroke-opacity`控制描边的不透明度。

**备注：** FireFox 3+ 支持 rgba 值，并且能够提供同样的效果，但是为了在其他浏览器中保持兼容，最好将它和填充/描边的不透明度分开使用。如果同时指定了 rgba 值和填充/描边不透明度，它们将都被调用。

###### [描边](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes#描边)

除了颜色属性，还有其他一些属性用来控制绘制描边的方式。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-ghOn7g.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-ghOn7g.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-ghOn7g.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-ghOn7g.png" loading="lazy"/>
  </picture>

```
<?xml version="1.0" standalone="no"?>
<svg width="160" height="140" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <line x1="40" x2="120" y1="20" y2="20" stroke="black" stroke-width="20" stroke-linecap="butt"/>
  <line x1="40" x2="120" y1="60" y2="60" stroke="black" stroke-width="20" stroke-linecap="square"/>
  <line x1="40" x2="120" y1="100" y2="100" stroke="black" stroke-width="20" stroke-linecap="round"/>
</svg>
```

`stroke-width`属性定义了描边的宽度。注意，描边是以路径为中心线绘制的，在上面的例子里，路径是粉红色的，描边是黑色的。如你所见，路径的每一侧都有均匀分布的描边。

第二个影响描边的属性是`stroke-linecap`属性，如上所示。它控制边框终点的形状。

`stroke-linecap`属性的值有三种可能值：

- `butt`用直边结束线段，它是常规做法，线段边界 90 度垂直于描边的方向、贯穿它的终点。
- `square`的效果差不多，但是会稍微超出`实际路径`的范围，超出的大小由`stroke-width`控制。
- `round`表示边框的终点是圆角，圆角的半径也是由`stroke-width`控制的。

还有一个`stroke-linejoin`属性，用来控制两条描边线段之间，用什么方式连接。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-dQ9dmL.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-dQ9dmL.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-dQ9dmL.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-dQ9dmL.png" loading="lazy"/>
  </picture>

```
<?xml version="1.0" standalone="no"?>
<svg width="160" height="280" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polyline points="40 60 80 20 120 60" stroke="black" stroke-width="20"
      stroke-linecap="butt" fill="none" stroke-linejoin="miter"/>

  <polyline points="40 140 80 100 120 140" stroke="black" stroke-width="20"
      stroke-linecap="round" fill="none" stroke-linejoin="round"/>

  <polyline points="40 220 80 180 120 220" stroke="black" stroke-width="20"
      stroke-linecap="square" fill="none" stroke-linejoin="bevel"/>
</svg>
```



每条折线都是由两个线段连接起来的，连接处的样式由`stroke-linejoin`属性控制，它有三个可用的值，`miter`是默认值，表示用方形画笔在连接处形成尖角，`round`表示用圆角连接，实现平滑效果。最后还有一个值`bevel`，连接处会形成一个斜接。

最后，你可以通过指定`stroke-dasharray`属性，将虚线类型应用在描边上。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-If949V.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-If949V.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-If949V.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-If949V.png" loading="lazy"/>
  </picture>

```
<?xml version="1.0" standalone="no"?>
<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <path d="M 10 75 Q 50 10 100 75 T 190 75" stroke="black"
    stroke-linecap="round" stroke-dasharray="5,10,5" fill="none"/>
  <path d="M 10 75 L 190 75" stroke="red"
    stroke-linecap="round" stroke-width="1" stroke-dasharray="5,5" fill="none"/>
</svg>
```



`stroke-dasharray`属性的参数，是一组用逗号分割的数字组成的数列。注意，和`path`不一样，这里的数字**必须**用逗号分割（空格会被忽略）。每一组数字，第一个用来表示填色区域的长度，第二个用来表示非填色区域的长度。所以在上面的例子里，第二个路径会先做 5 个像素单位的填色，紧接着是 5 个空白单位，然后又是 5 个单位的填色。如果你想要更复杂的虚线模式，你可以定义更多的数字。第一个例子指定了 3 个数字，这种情况下，数字会循环两次，形成一个偶数的虚线模式（奇数个循环两次变偶数个）。所以该路径首先渲染 5 个填色单位，10 个空白单位，5 个填色单位，然后回头以这 3 个数字做一次循环，但是这次是创建 5 个空白单位，10 个填色单位，5 个空白单位。通过这两次循环得到偶数模式，并将这个偶数模式不断重复。

另外还有一些关于填充和边框的属性，包括`fill-rule`，用于定义如何给图形重叠的区域上色；`stroke-miterlimit`，定义什么情况下绘制或不绘制边框连接的`miter`效果；还有`stroke-dashoffset`，定义虚线开始的位置。

##### [使用 CSS](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes#使用_css)

除了定义对象的属性外，你也可以通过 CSS 来样式化`填充`和`描边`。语法和在 HTML 里使用 CSS 一样，只不过你要把`background-color`、`border`改成`fill`和`stroke`。注意，不是所有的属性都能用 CSS 来设置。上色和填充的部分一般是可以用 CSS 来设置的，比如`fill`，`stroke`，`stroke-dasharray`等，但是不包括下面会提到的渐变和图案等功能。另外，`width`、`height`，以及路径的命令等等，都不能用 CSS 设置。判断它们能不能用 CSS 设置还是比较容易的。

**备注：** [SVG 规范](https://www.w3.org/TR/SVG/propidx.html)将属性区分成 properties 和其他 attributes，前者是可以用 CSS 设置的，后者不能。

CSS 可以利用 style 属性插入到元素的行间：

```
 <rect x="10" height="180" y="10" width="180" style="stroke: black; fill: red;"/>
```



或者利用 `<style>` 设置一段样式段落。就像在 HTML 里这样的 `<style>` 一般放在`<head>`里，在 svg 里 `<style>` 则放在`<defs>`标签里，这里面可以定义一些不会在 SVG 图形中出现、但是可以被其他元素使用的元素。

```
<?xml version="1.0" standalone="no"?>
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <style type="text/css"><![CDATA[
       #MyRect {
         stroke: black;
         fill: red;
       }
    ]]></style>
  </defs>
  <rect x="10" height="180" y="10" width="180" id="MyRect"/>
</svg>
```



如上把样式放到一块你可以更轻松地调整一大组元素的样式，同样你也可以使用**hover**这样的伪类来创建翻转之类的效果：

```
 #MyRect:hover {
   stroke: black;
   fill: blue;
 }
```



你最好读一下 CSS 教程以便掌握它，一些可以在 HTML 里使用的 CSS，在 svg 里可能无法正常工作，比如`before`和`after`伪类。所以这里需要一点经验。

你也可以定义一个外部的样式表，但是要符合[normal XML-stylesheet syntax](https://www.w3.org/TR/xml-stylesheet/)的 CSS 规则：

```
<?xml version="1.0" standalone="no"?>
<?xml-stylesheet type="text/css" href="style.css"?>

<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect height="10" width="10" id="MyRect"/>
</svg>
```



style.css 看起来就像这样：

```
#MyRect {
  fill: red;
  stroke: black;
}
```





### svg动画

这文章讲的不错：https://juejin.cn/post/6976876179496124430?searchId=2023121419285278B199FDD8271D199956#heading-1





### 如何优化 SVG 图像

渲染矢量格式时，我们必须编写一些额外的 SVG 代码。最终结果应使用不同的服务进行优化。

大多数情况下，为了优化 SVG，我们可以使用 [SVGO](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsvg%2Fsvgo)。

`SVG Optimizer `是一个基于 Node.js 的工具，用于优化 SVG 矢量图形文件，可以针对元数据、注释、隐藏元素、默认值或非最佳值以及其他可以安全删除或转换的内容，而不会影响 SVG 渲染结果。







### 库

#### D3

`D3` 为我们解决了比如链式调用、数据驱动的思想、复杂数学的处理、比例尺的封装技巧等问题，为了高效开发我们更应该学习更灵活的 D3 设计思想及开发技巧，这能让我们**上升到库的开发的层面**。

但是同时也伴随了一个新的问题，它的渲染过程跟 DOM 一样也要渲染树的生成、布局合成、绘制，这也就意味着大批量的图形对于 SVG 来说很容易造成卡顿。



## webgl

可以通过 CSS 来模拟三维、Canvas 或 SVG 来二维模拟三维，但是它们都是二维的图形接口。为了解决三维的图形接口问题，WebGL 诞生了。

WebGl 概念：

> WebGL（Web图形库）是一个 JavaScript API，可在任何兼容的 Web 浏览器中渲染高性能的交互式 3D 和 2D 图形。它是基于 OpenGL ES（OpenGL for Embedded Systems）标准的一个 JavaScript API。<mark>该 API在 HTML5 [canvas](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FHTML%2FElement%2Fcanvas) 元素中使用。 </mark>这种一致性使 API 可以利用用户设备提供的硬件图形加速。



### WebGL 绘图模式

WebGL 中的保留模式（Retained Mode）和即时模式（Immediate Mode）是两种不同的渲染方式。

1. 在`保留模式`下，WebGL 应用程序通过创建和管理图形对象的持久性表示来进行渲染。它使用缓冲区和纹理等数据结构来存储和管理几何形状、纹理等渲染相关的数据。在保留模式中，一旦图形对象被创建，它们可以在多个帧之间保持不变，从而提高渲染效率。**保留模式适用于复杂的场景和需要频繁重绘的情况。**
2. 在`即时模式`下，WebGL 应用程序通过即时绘制命令来进行渲染，每一帧都需要重新指定要绘制的几何形状和纹理等信息。在即时模式中，渲染命令直接发送给 GPU，并立即执行，每一帧都需要重新指定渲染状态和数据。**即时模式适用于简单的场景和需要频繁变化的情况。**

### WebGL 渲染过程

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-31-20-25-image-20240131202526849.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-31-20-25-image-20240131202526849.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-31-20-25-image-20240131202526849.png" alt="image-20240131202526849" style="zoom:50%;" loading="lazy"/>
  </picture>

接下来将逐步来讲解每个阶段：

1. **html + css + js + Shader Source Code**。在 WebGL 渲染过程中，通常需要使用 HTML、CSS 和 JavaScript 来创建并嵌入 WebGL 的上下文，同时还需要编写着色器源代码来定义顶点着色器和片段着色器的行为。
2. **WebGL API**。WebGL API 是一组用于在 Web 上进行图形渲染的 JavaScript 接口。它提供了许多函数和方法，用于创建和管理 WebGL 上下文、加载和绑定纹理、创建和操作缓冲区对象、设置着色器程序、执行渲染操作等。此时会将 3D 的绘制信息传递到 GPU 中。
3. **vertex shader**。顶点着色器是在 WebGL 渲染管线中的第一个阶段，用于对输入的顶点数据进行处理和变换。它通过对每个顶点应用一系列变换操作，将顶点从模型空间转换到裁剪空间，并输出变换后的坐标和其他属性。
4. **NDC**。NDC 之前会执行裁剪，即对坐标（x, y, z, w）中的 w 用于除法，将 xyz 的值映射到[-1, 1]，转换后即为 NDC 坐标系。NDC 是标准化设备坐标，是 WebGL 渲染管线中的一个阶段。在这个阶段，裁剪空间中的坐标被映射到标准化设备坐标空间，这个阶段对应于视口变换和投影变换。
5. **Primitive Assembly**。图元装配是 WebGL 渲染管线的一个阶段，它将顶点组装成基本图元，如点、线段或三角形。在这个阶段，顶点数据被组合成一组基本图元，以供后续的光栅化操作使用。
6. **Rasterization**。光栅化是 WebGL 渲染管线的一个阶段，它将基本图元转换为屏幕上的像素。在这个阶段，基本图元被分解为一系列离散的像素，并计算每个像素的位置和属性。
7. **fragment shader**。片段着色器是 WebGL 渲染管线中的一个阶段，用于对光栅化后的片段进行处理。它可以根据片段的位置、纹理坐标、光照等信息，计算出片段的颜色和其他属性。
8. **Multisampling**。多重采样是一种抗锯齿技术，用于减少图形渲染中的锯齿边缘。在 WebGL 中，可以通过启用多重采样功能，对每个像素进行多次采样，并根据采样结果进行平滑处理，以获得更平滑的边缘效果。说白了就是对边缘锐度高的地方，扩大边缘的像素范围并过渡。
9. **Fragment Operations**。片段操作是 WebGL 渲染管线中的一个阶段，用于对光栅化后的片段进行进一步处理。这个阶段包括深度测试、模板测试、剪裁等操作，以决定是否绘制片段以及如何绘制。
10. **Z-buffer**。Z 缓冲区是用于深度测试的一种缓冲区。在 WebGL 中，每个像素都有一个深度值，表示该像素在三维场景中的深度。Z 缓冲区可以用于比较深度值，并根据比较结果决定是否绘制该像素。
11. **blending**。混合是一种将新绘制的像素与已存在的像素进行混合的技术。在 WebGL 中，可以配置混合函数和混合因子，以控制颜色的混合方式，实现透明效果、颜色叠加等效果。
12. **dithering**。抖动是一种通过在颜色之间引入噪声来减少颜色带宽的技术。在 WebGL 中，可以使用抖动算法对颜色进行抖动，从而在颜色较少的情况下实现更平滑的渐变效果。
13. **painting**。绘制是 WebGL 渲染管线的最后一个阶段，它将经过所有前面阶段处理的片段最终绘制到屏幕上。在这个阶段，可以通过绘制命令将片段的颜色值写入到帧缓冲区中，实现最终的图形渲染效果。







### Shader

操作 WebGL 的三维图形 API 本质上其实就是处理着色器 Shader。

`Shader（着色器）`是计算机图形学中用于描述光照、材质和渲染效果的程序。它是一种在图形渲染管线中执行的小型程序，用于控制图形的绘制和渲染过程。

Shader 着色器通常由两个主要部分组成：顶点着色器（Vertex Shader）和片段着色器（Fragment Shader）。

- **顶点着色器**是在图形渲染管线的顶点处理阶段执行的程序。它接收输入的顶点数据，并对每个顶点进行一系列的计算和变换，如位置变换、法线变换、纹理坐标变换等并输出。
- **片段着色器**是在图形渲染管线的片段处理阶段执行的程序。它接收顶点着色器传递过来的数据，并对每个片段（像素）进行计算。片段着色器通常用于计算光照、纹理采样、颜色插值等操作，并最终确定片段的最终颜色。也就是屏幕的显示效果是它来决定的。

Shader 的上手门槛很高，但是 Shader 的优势是可以让我们用几 kb 来实现通过几百 M 搭建的建模场景。

看看别人做的：https://www.shadertoy.com/view/XltGRX







### 库

#### three.js



## WebGPU

### 背景

WebGL 是一个较为古老的技术，它的标准是基于 OpenGL 继承而来的。OpenGL 的历史可以追溯到 1992 年，而这些早期的设计理念与现代 GPU 的工作原理并不完全匹配。对于浏览器开发者来说，不同的 GPU 新特性的适配是很麻烦的事情。

2014 年，苹果发布了 Metal 图形框架。随后苹果放弃了 OpenGL ES。

微软在 2015 年发布了自己的 D3D12（Direct3D 12）图形框架。紧随其后的是 Khronos Group，这是图形界的国际组织，类似于前端的 W3C、TC39。而 WebGL 是该组织的标准。然而，随着时间的推移，WebGL 逐渐淡化，取而代之的是对现代图形框架 Vulkan 的支持。

迄今为止，Metal、D3D12 和 Vulkan 被视为现代的三大图形框架。这些框架充分发挥了 GPU 的可编程能力，使开发者能够更自由地控制 GPU。

同样重要的是要注意，当今的主流操作系统不再将 OpenGL 作为主要图形支持。这意味着编写的每一行 WebGL 代码都有 90% 的机会不会由 OpenGL 进行绘制。在 Windows 上使用 DirectX 进行绘制，在 Mac 上使用 Metal 进行绘制。

所以，WebGPU 诞生了……



### 介绍

**`WebGPU` 是一种新的 Web 标准，用于在 Web 浏览器中进行高性能图形渲染和计算**。它旨在提供比 WebGL 更底层、更直接的硬件访问，并且更好地与现代图形 API（如 Vulkan、Metal 和 Direct3D 12）对接。

WebGPU 的设计目标是提供一个**跨平台、高性能**的图形和计算编程接口，使开发者能够更好地利用 GPU 的计算能力。它为开发者提供了更多的控制权和灵活性，以实现更高效、更复杂的图形渲染和计算任务。

WebGPU 的特点包括：

1. **低级别的硬件访问**：WebGPU 提供了更底层的硬件访问接口，使开发者能够更直接地控制 GPU 的功能和性能。
2. **线程安全**：WebGPU 支持多线程操作，使开发者能够更好地利用多核 CPU 和多个 GPU。
3. **强大的计算能力**：WebGPU 提供了强大的计算能力，使开发者能够在浏览器中进行复杂的计算任务，如图像处理、物理模拟等。
4. **跨平台支持**：WebGPU 的设计目标是跨平台的，可以在不同的操作系统和设备上运行，包括桌面、移动设备和虚拟/增强现实设备。

WebGPU 的发展是由 Khronos Group（图形界的国际组织）主导的，该组织也负责制定其他图形 API 标准，如 OpenGL、Vulkan 等。





# 新东西

## Shadow DOM

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-21-image-20230429142110473.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-21-image-20230429142110473.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-21-image-20230429142110473.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-21-image-20230429142110473.png" loading="lazy"/>
  </picture>



## WebAssembly

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-48-image-20230429144853300.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-48-image-20230429144853300.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-48-image-20230429144853300.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-48-image-20230429144853300.png" loading="lazy"/>
  </picture>





# 特性原理

 html 里连续多个空格就会被合并成只有一个空格
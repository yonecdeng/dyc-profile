

# 基本

## 开发者工具看样式

![image-20221021174716830](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221021174716830.png)





## 建议的编写css顺序

1、定位属性:

> position、display、float、left、top、right、bottom、overflow、clear、z-index

2、自身属性:

> width、height、padding、border、margin、background

3、文字样式:

> font-family、font-size、font-style、font-weight、font-varient、color

4、文本属性:

> text-align、vertical-align、text-wrap、text-transform、text-indent、text-decoration、letter-spacing、word-spacing、white-space、text-overflow

5、CSS3 中新增属性:

> content、box-shadow、border-radius、transform







## css规范

在 CSS 2 之后，CSS 工作组意识到这门语言已经变得非常庞大，再也无法把它塞进单个规范中了。于是将 CSS 打散到多个不同的规范（模块）中，每个模块都可以独立更新版本。这其中，那些延续 CSS 2.1 已有特性的模块会升级到 3 这个版本号。比如以下模块： 

 CSS 语法（http://w3.org/TR/css-syntax-3） 

 CSS 层叠与继承（http://w3.org/TR/css-cascade-3） 

 CSS 颜色（http://w3.org/TR/css3-color） 

 选择符（http://w3.org/TR/selectors） 

 CSS 背景与边框（http://w3.org/TR/css3-background） 

 CSS 值与单位（http://w3.org/TR/css-values-3） 

 CSS 文本排版（http://w3.org/TR/css-text-3） 

 CSS 文本装饰效果（http://w3.org/TR/css-text-decor-3） 

 CSS 字体（http://w3.org/TR/css3-fonts） 

 CSS 基本 UI 特性（http://w3.org/TR/css3-ui）

此外，如果某个模块是前所未有的新概念，那它的版本号将从 1 开始。

比如下面这些： 

 CSS 变形（http://w3.org/TR/css-transforms-1） 

 图像混合效果（http://w3.org/TR/compositing-1） 

 滤镜效果（http://w3.org/TR/fifilter-effects-1） 

 CSS 遮罩（http://w3.org/TR/css-masking-1） 

 CSS 伸缩盒布局（http://w3.org/TR/css-flflexbox-1） 

 CSS 网格布局（http://w3.org/TR/css-grid-1）

“CSS3”这个名词非常流行，但实际上并没有在任何规范中定义过，它包括 CSS 规范第三版（Level 3）再加上一些版本号还是 1 的新规范。由 于 CSS 的各个模块在近些年里以不同的速度在推进，我们已经越来越难以把这些规范以 CSS3、CSS4 这样的方式来划分了，而且这样也难以被大众理解和接受。

### 浏览器前缀

#### 最常见的前缀

Firefox 的 -moz-、IE 的 -ms-、Opera的 -o- 以及 Safari 和 Chrome 的 -webkit-。

#### 浏览器前缀的起因

浏览器想在该css规范落实之前，尝试先支持这个规范让开发者去使用，继而能让这个css规范能得到一些使用上的反馈。。 

这种让开发者尝试新特性的方案就导致了一个问题：开发者发现这个属性这么好用就在生产环境中使用了。但是这个属性在上某个版本的浏览器中可能是需要前缀才能正常使用，所以出现了autoprefixer这种东西。当然还有可能加了前缀也不能用。

所以目前浏览器厂商已经很少以前缀的方式来实验性地实现新特性了。取而代之的是，这些实验性特性需要通过配置开关来启用。这样就能避免开发者在生产环境中使用这些新特性（你总不能要求用户还得设置一下浏览器才能打开你的网站吧所以开发者就自觉不用了）。

### *CSS3* 新增了那些东西

这里列举出一些关键的新增内容：

- 选择器
- 盒子模型属性：*border-radius、box-shadow、border-image*
- 背景：*background-size、background-origin、background-clip*
- 文本效果：*text-shadow、word-wrap*
- 颜色：新增 *RGBA，HSLA* 模式
- 渐变：线性渐变、径向渐变
- 字体：*@font-face*
- 2D/3D转换：*transform、transform-origin*
- 过渡与动画：*transition、@keyframes、animation*
- 多列布局
- 媒体查询



## css编码技巧

### 防卫性编码方式

合理使用简写是一种良好的防卫性编码方式，可以抵御未来的风险。(因为如果你用的是展开式的单个属性（background-color），那这个元素的背景最终有可能会显示为一个粉色图案、一张猫的图片或其他任何东西，因为同时可能会有一条 background-image 声明在起作用。展开式写法并不会帮助你清空所有相关的其他属性，从而可能会干扰你想要达到的效果。)

当然，如果我们要明确地去覆盖某个具体的展开式属性并保留其他相关样式，那就需要用展开式属性。







## 导入css的三种方式

使用CSS有三种方式：使用link标签在html文件中引入、@import、内联样式，其中link和@import都是导入外部样式。它们之间的区别：

- **link**：浏览器会派发一个新的线程(HTTP线程)去加载资源文件，与此同时GUI渲染线程会继续向下渲染代码
- **@import**：GUI渲染线程会暂时停止渲染，去服务器加载资源文件，资源文件没有返回之前不会继续渲染(==阻碍==浏览器渲染).所以，在开发过程中，导入外部样式使用link，而不用@import。
- **style**：GUI直接渲染 `<p style="font-size: 20px;color: red;font-weight: bold;">侠课岛欢迎你！</p>`

外部样式如果长时间没有加载完毕，浏览器为了用户体验，会使用浏览器默认样式确保首次渲染的速度。所以CSS一般写在header中，让浏览器尽快发送请求去获取css样式。



## 标准流

![image-20220429185101661](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/标准流.png)

普通文档流——指的是网页元素的默认布局行为。行内元素跟随文字的方向从左到右排列，当到达容器边缘时会换行。块级元素会占据完整的一行，前后都有换行。普通文档流是为限定的宽度和无限的高度设计的。内容会填满视口的宽度，然后在必要的时候折行。因此，容器的高度由内容天然地决定，而不是容器自己决定。

脱离标准流的规则：

1. 浮动，导致块级元素不再自动占满父元素的宽度即==使块级元素的默认宽度为0，由内容决定宽度==
2. `position:fixed`， 导致块级元素不再自动占满父元素的宽度即块级元素的默认宽度为0，由内容决定宽度
3. `position:absolute` ， 导致块级元素不再自动占满父元素的宽度即块级元素的默认宽度为0，由内容决定宽度
4. flex和grid的子元素，设置了display：flex/grid 的元素自身还是用标准流的规则



## [层叠上下文](https://mp.weixin.qq.com/s?__biz=Mzg2Nzc0NzQ3OQ==&mid=2247485491&idx=1&sn=3c4a47ef08109607b969d1a6f2aad6da&chksm=ceb79bcbf9c012dd750d606560b905e1707f3aaaa93cadcd68ba9aebeaa442fd0635fdff47cb&token=928131015&lang=zh_CN&scene=21#wechat_redirect)

#### 简介

渲染树（render tree）代表了每个元素的视觉样式和位置。同时还决定浏览器绘制元素的顺序。<mark>如果元素刚好重叠，后绘制的元素就会出现在先绘制的元素前面。</mark>

通常情况下（使用定位之前），元素在HTML里出现的顺序决定了绘制的顺序。定位元素时，这种行为会改变。<mark>浏览器会先绘制所有非定位的元素，然后绘制定位元素。</mark>默认情况下，所有的定位元素会出现在非定位元素前面。

一个层叠上下文是由许多拥有z-index属性元素形成的平面构成的；有z-index属性的元素又会形成一个子层叠上下文（这里的z-index必须是被有效设置的）。<mark>z-index只在层叠上下文中才生效，而且z-index只在当前层叠上下文中有意义。在层叠上下文中的内部元素，其层级都在这个层叠上下文之上（哪怕是负数）。</mark>当多个层叠等级相同的元素重叠时，按照html中出现的顺序决定堆叠上下关系，后出现的在上面。

![image-20230430114757404](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-30-11-47-image-20230430114757404.png)

#### 层叠顺序

<img src="https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTaub9mhKL5cPOpUlq74eLXpeIvQutvAAOEfiaL96vDbH7GxNQgB7pEcFdlPBicOJPoKUjf1Niaun048VDQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:67%;" />

所有层叠上下文内的元素会按照以下顺序叠放：

❑ 层叠上下文的根

❑ z-index为负的定位元素（及其子元素）

❑ 非定位元素

❑ z-index为auto的定位元素（及其子元素）

❑ z-index为正的定位元素（及其子元素）







#### 产生层叠上下文

文档中的层叠上下文由满足以下任意一个条件的元素形成：

- 文档根元素（`<html>`）--- 最外层的层叠上下文；

- [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 值为 `absolute`（绝对定位）或 `relative`（相对定位）且设置了 [`z-index`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index) 值不为 `auto` 的元素（z-index默认为0）；

- [`position`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position) 值为 `fixed`（固定定位）或 `sticky`（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；

- flex ([`flexbox` (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)) 容器的子元素，且==设置了== [`z-index`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index) 值不为 `auto`；

- grid ([`grid`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid)) 容器的子元素，且==设置了== [`z-index`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/z-index) 值不为 `auto`；

- [`opacity`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity) 属性值小于 `1` 的元素（参见 [the specification for opacity](https://www.w3.org/TR/css3-color/#transparency)）；

- [`will-change`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（参考[这篇文章](https://dev.opera.com/articles/css-will-change-property/)）；

- [`contain`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 属性值为 `layout`、`paint` 或包含它们其中之一的合成值（比如 `contain: strict`、`contain: content`）的元素。

- 以下任意属性值不为  none  的元素：

  - [`transform`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
  - [`filter`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)
  - [`perspective`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/perspective)
  - [`clip-path`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
  - [`mask`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask) / [`mask-image`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask-image) / [`mask-border`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask-border)

- [`mix-blend-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode) 属性值不为 `normal` 的元素；

- [`isolation`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/isolation) 属性值为 `isolate` 的元素；

- [`-webkit-overflow-scrolling`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-webkit-overflow-scrolling) 属性值为 `touch` 的元素；

  

  若元素设置了float浮动则会使z-index失效





#### 如何实现父元素覆盖子元素

(难办的是父子之间的层叠，因为父元素可能是层叠上下午的根元素，根元素永远在最底层，兄弟之间由于处于同一层叠下直接改z-index就行，貌似也可以改z-index来控制自己跟父亲的兄弟的层叠关系)

给父元素设置一个很大的z-index是没有用的。因为这样他就成为一个层叠上下文的根元素了，无论子元素被如何设置都会在这个层叠上下文根元素之上。正确的解法是把子元素的z-index设置为负数，而父元素只是一个普普通通的块级元素，z-index<0 的子元素会在块级元素之下，就可以实现我们想要的效果



#### 用变量记录z-index

如果没有清晰的说明，开发人员就设置一个高得离谱的z-index，比如999999。为了处理这个问题，将所有的z-index都定义为变量放到同一个地方，如下代码片段所示。

```css
--z-loading-indicator: 100;
--z-nav-menu: 200;
--z-dropdown-menu: 300;
--z-modal-backdrop: 400;
--z-modal-body: 410;
```

这样就能清晰地看到哪些元素在前哪些元素在后。将增量设为10或者100，这样就能在需要的时候往中间插入新值。





#### 使用场景

网页很复杂时，很难判断是哪个层叠上下文导致的问题。尽可能将独立的定位元素（比如模态框）放到DOM的顶层。这样就没有外部的层叠上下文能束缚它们了。



# 选择器

## 区分大小写

即可以写大写字母。

## 样式层叠优先级

层叠会依据三种条件解决冲突：

1. 样式表的来源：包括你写的样式和浏览器默认样式(也叫用户代理样式)。
   1. 优先级按照由高到低排列如下所示：
      1. 作者的！important    (标记了！important的声明会被当作更高优先级的来源)
      2. 作者
      3. 用户代理

2. 选择器优先级：如果无法用 来源 解决冲突声明，浏览器会尝试检查它们的优先级。浏览器将优先级分为两部分：HTML的行内样式和选择器的样式。

3. 源码顺序：如果两个声明的来源和优先级相同，其中一个声明在样式表中出现较晚，或者位于页面较晚引入的样式表中，则该声明胜出。

![image-20221011221300288](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221011221300288.png)



总结：

- 继承得到的样式的优先级最低
- 内联样式 > `<style>标签` > 外部样式  > 浏览器默认样式
- 选择器 **从右往左** 解析

| **选择器**             | **格式**      | **优先级权重**                                     |
| ---------------------- | ------------- | -------------------------------------------------- |
| id选择器               | #id           | 100                                                |
| 类选择器               | .classname    | 10                                                 |
| 属性选择器             | a[ref=“eee”]  | 10                                                 |
| 伪类选择器             | li:last-child | 10                                                 |
| 标签选择器             | div           | 1                                                  |
| 伪元素选择器           | li:after      | 1                                                  |
| 通配符选择器、:where() | *             | 0                                                  |
| :is()  :not()  :has()  |               | 本身不计入优先级，以里面的参数中的最高的优先级为准 |



## 基础选择器

❑ tagname——类型选择器或者标签选择器。该选择器匹配目标元素的标签名。它的优先级是0,0,1。例如：p、h1、strong。

❑ .class——类选择器。该选择器匹配class属性中有指定类名的元素。它的优先级是0,1,0。例如：.media、.nav-menu。

❑ #id——ID选择器。该选择器匹配拥有指定ID属性的元素。它的优先级是1,0,0。例如：#sidebar。

❑ ＊——通用选择器。该选择器匹配所有元素。它的优先级是0,0,0。

​	（猫头鹰选择器）猫头鹰选择器（lobotomized owl selector），它长这样：＊ + ＊。该选择器开头是一个通用选择器（＊），它可以选中所有元素，后面是一个相邻兄弟组合器（+），最后是另一个通用选择器。 它会选中直接跟在其他元素后面的所有元素。

一般会将body放在选择器的前面，这样该选择器就只能选中body内的元素。如果直接使用猫头鹰选择器，它还会选中`<body>`元素，因为它是`<head>`元素的相邻兄弟节点。接下来用猫头鹰选择器给页面元素加上顶部外边距。这样除了每个容器下的第一个元素，其他都会有顶部外边距。

```css
body * + * {
	margin-top: 1.5em;
}
```





## 组合器

组合器将多个基础选择器连接起来组成一个复杂选择器。

❑ 后代组合器（ ）—— 两个基础选择器之间的空格(也可以没有空格)被称作后代组合器（descendant combinator）。

❑ 子组合器（>）——匹配的目标元素是其他元素的直接后代。例如：.parent >.child。

❑ 相邻兄弟组合器（+）——匹配的目标元素紧跟在其他元素后面。例如：p +h2。

❑ 通用兄弟组合器（~）——匹配所有跟随在指定元素之后的兄弟元素。注意，它不会选中目标元素之前的兄弟元素。例如：li.active ~ li。

❑ 多选（,）





## 复合选择器

多个基础选择器可以连起来（不使用空格或者其他组合器）组成一个复合（compound）选择器（例如：h1.page-header）。复合选择器选中的元素将匹配其全部基础选择器。例如，.dropdown.is-active能够选中`<div class="dropdown is-active">`，但是无法选中`<div class="dropdown">`。

```css
.xtx-entry .indicator li.active { /*选到含有active类的li元素*/
  background-color: #fff;
}


.box:hover::before{ /*选到 box被hover 的情况下的box的伪元素*/
  transform: translateX(-100%);
}
```





## 伪类选择器

伪类选择器用于选中处于某个特定状态的元素。这种状态可能是由于用户交互，也可能是由于元素相对于其父级或兄弟元素的位置。伪类选择器始终以一个冒号（:）开始。优先级等于一个类选择器（0,1,0）。



### 结构伪类选择器

以下并未列出全部伪类选择器。请参阅MDN文档Pseudo-classes，查看MDN上的完整清单。

常用的有：

❑ :first-child——匹配的元素是其父元素的第一个子元素。

❑ :last-child——匹配的元素是其父元素的最后一个子元素。

❑ :only-child——匹配的元素是其父元素的唯一一个子元素（没有兄弟元素）。

❑ :nth-child(an+b)——匹配的元素在兄弟元素中间有特定的位置。公式an+b里面的a和b是整数，该公式指定要选中哪个元素。<strong style="color: red;">从0开始代入n的所有整数值，公式的计算结果指定了目标元素的位置。</strong>

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221024191247962.png" alt="image-20221024191247962" style="zoom:50%;" />



❑ :nth-last-child(an+b)——类似于：nth-child()，但不是从第一个元素往后数，而是从最后一个元素往前数。括号内的公式与：nth-child()里的公式的规则相同。

❑ :first-of-type——类似于：first-child，但不是根据在全部子元素中的位置查找元素，而是根据拥有相同标签名的子元素中的数字顺序查找第一个元素。

❑ :last-of-type——匹配每种类型的最后一个子元素。

❑ :only-of-type——该选择器匹配的元素是满足该类型的唯一一个子元素。

❑ :nth-of-type(an+b)——根据目标元素在特定类型下的数字顺序以及特定公式选择元素，类似于：nth-child。

❑ nth-last-of-type(an+b)——根据元素类型以及特定公式选择元素，从其中最后一个元素往前算，类似于：nth-last-child。

❑ :not(`<selector>`)——匹配的元素不匹配括号内的选择器。括号内的选择器必须是基础选择器，它只能指定元素本身，无法用于排除祖先元素，同时不允许包含另一个排除选择器。

❑ :empty——匹配的元素必须没有子元素。注意，如果元素包含空格就无法由该选择器匹配，因为空格在DOM中属于文本节点。写作本书时，W3C正在考虑：blank伪类选择器，它跟：empty的行为类似，但是能选中仅包含空格的元素，目前还没有浏览器支持：blank。

❑ :root——匹配文档根元素。对HTML来说，这是`<html>元素，除了优先级 更高之外，与 `html` 选择器相同。但是CSS还可以应用到XML或者类似于XML的文档上，比如SVG。在这些情况下，该选择器的选择范围更广。

❑ :has()——可以用来表示具有某些子元素的父元素：

```
.parent:has(.child) {}
```

表示选中那些有用 `.child` 子节点的 `.parent` 



`:where` 的权重为 0，`:is` 作为伪类选择器的权重为 10。



### 状态伪类选择器

❑ :focus——匹配通过鼠标点击、触摸屏幕或者按Tab键导航而获得焦点的元素。在Chrome浏览器中点击按钮时，你会发现按钮周围环绕了一个浅蓝色的光圈，这是浏览器为按钮的：focus状态默认添加的轮廓线。可以通过设置．button:focus{ outline: none; }来移除轮廓线。建议你在移除轮廓线的同时，添加一些其他特效来代替，这样当用户使用键盘导航的时候，就可以看到当前焦点状态在哪里。

![image-20220505170435515](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/链接伪类选择器.png)

因为优先级相同时，后出现的样式会覆盖先出现的样式。如果一个元素同时处于两个或者更多状态，最后一个状态就能覆盖其他状态。比如用户将鼠标悬停在一个访问过的链接上，悬停效果会生效；同时用户在鼠标悬停时激活了链接（即点击了它），激活的样式会生效（激活的样式就会覆盖掉悬停的样式）。













## 伪元素选择器

这些选择器以双冒号（::）开头，尽管大多数浏览器也支持单冒号的语法以便向后兼容。伪元素选择器的优先级与类型选择器（0,0,1）相等。

伪元素：（伪元素默认是行内元素，可以通过display去改）在内容元素的前后插入额外的元素或样式，但是这些元素实际上并不在文档中生成。它们只在外部显示可见，但不会在文档的源代码中找到它们，因此，称为“伪”元素。

❑ ::before——创建一个伪元素，使其成为匹配元素的第一个子元素。该元素默认是行内元素，可用于插入文字、图片或其他形状。<font color="red">必须指定content属性才能让元素出现</font>，例如：.menu::before。

❑ ::after——创建一个伪元素，使其成为匹配元素的最后一个子元素。该元素默认是行内元素，可用于插入文字、图片或其他形状。<font color="red">必须指定content属性才能让元素出现</font>，例如：.menu::after。

❑ ::first-letter——用于指定匹配元素的第一个文本字符的样式，例如：h2::first-letter。

❑ ::first-line——用于指定匹配元素的第一行文本的样式。

❑ ::selection——用于指定用户使用鼠标高亮选择的任意文本的样式。通常用于改变选中文本的background-color。只有少数属性可以使用，包括color、background-color、cursor、text-decoration。



## 属性选择器

属性选择器用于根据HTML属性匹配元素。其优先级与一个类选择器（0,1,0）相等。

❑`[attr]`——匹配的元素拥有指定属性attr，无论属性值是什么，例如：input[disabled]。

❑ `[attr="value"]`——匹配的元素拥有指定属性attr，且属性值等于指定的字符串值，例如：input[type="radio"]。

❑ `[attr^="value"]`——“开头”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值的开头是指定的字符串值，例如：a[href^="https"]。

❑ `[attr$="value"]`——“结尾”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值的结尾是指定的字符串值，例如：a[href$= ".pdf"]。❑ [attr＊="value"]——“包含”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值包含指定的字符串值，例如：[class＊="sprite-"]。

❑` [attr＊="value"]`——“包含”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值包含指定的字符串值，例如：[class＊="sprite-"]。

❑` [attr~="value"]`——“空格分隔的列表”属性选择器。该选择器匹配的元素拥有指定属性attr，且属性值是一个空格分隔的值列表，列表中的某个值等于指定的字符串值，例如：a[rel="author"]。

❑` [attr|="value"]`——匹配的元素拥有指定属性attr，且属性值要么等于指定的字符串值，要么以该字符串开头且紧跟着一个连字符（-）。适用于语言属性，因为该属性有时候会指定一种语言的子集（比如墨西哥西班牙语，es-MX，或者普通的西班牙语，es），例如：[lang|="es"]。



不区分大小写的属性选择器上述属性选择器都是区分大小写的。选择器规范Level4提出了一种不区分大小写的修饰符，可以作用于任何属性选择器。它的用法是将i添加到结束方括号前面，例如：input[value="search"i]。很多浏览器还不支持该特性。不支持的浏览器会直接忽略。因此，如果使用了不区分大小写修饰符，请确保提供一个常规的区分大小写的回退方案。





## 选择器玩出花来

### 根据兄弟元素的数量范围来匹配元素

在列表项的总数是 4 或更多时选中所有列表项：

```css
li:first-child:nth-last-child(n+4),
li:first-child:nth-last-child(n+4) ~ li {
 /* 当列表至少包含四项时，命中所有列表项 */
}
```



![image-20230707153412588](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-07-15-34-image-20230707153412588.png)



列表中有 4 个或更少的列表项时（参见图 7-12），要选中所有列表项可以这样写:

```css
li:first-child:nth-last-child(-n+4),
li:first-child:nth-last-child(-n+4) ~ li {
 /* 当列表最多包含四项时，命中所有列表项 */
}
```



假设我们希望在列表包含 2 ～ 6 个列表项时命中所有的列表项，可以这样写：

```css
li:first-child:nth-last-child(n+2):nth-last-child(-n+6),
li:first-child:nth-last-child(n+2):nth-last-child(-n+6) ~ li {
 /* 当列表包含2～6项时，命中所有列表项 */
}
```







# 函数

## 自定义属性var()

### 用法

变量名前面必须有两个连字符（--），用来跟CSS属性区分，剩下的部分可以随意命名。变量必须在一个声明块内声明。比如在：root选择器内声明，则该变量可以在整个网页使用。调用函数var()就能使用该变量。

var()函数接受第二个参数，它指定了备用值。如果第一个参数指定的变量未定义，那么就会使用第二个值。如果var()函数算出来的是一个非法值，对应的属性就会设置为其初始值。

###  动态改变自定义属性

自定义属性就像作用域变量一样。可以定义一个变量为黑色，然后在某个容器中重新将其定义为白色。那么基于该变量的任何样式，在容器外部会动态解析为黑色，在容器内部会动态解析为白色。

### 使用JavaScript改变自定义属性

![image-20221021200233872](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221021200233872.png)可以用JavaScript为--main-bg动态设置一个新值。





## calc()

### 简介

calc()函数内可以对两个及其以上的值进行基本运算。它支持的运算包括：加（+）、减（−）、乘（×）、除（÷）。加号和减号两边必须有空白。这个规则如此怪异，是为了向前兼容：未来，在 calc() 内部可能会允许使用关键字，而这些关键字可能会包含连字符（即减

号）。

### 使用场景

#### 使用calc()定义字号。

比如calc(1px + 1vw)。1em保证了最小字号，1vw则确保了字体会随着视口缩放。



## `attr()`

attr 可以让我们更方便引用 HTML 的自定义属性。



## `clamp()`

``clamp(<首选值>, <最小值>, <最大值>)` 只要尺寸不超过最小和最大边界，就会遵循首选值。相比媒体查询，可以更简洁方便地处理响应式。

```css
.page-wrap { width: clamp(320px, 80%, 1200px) } 
body { font-size: clamp(12px, 1rem + 2vw, 18px) }
```





# 属性

## 初始值

每个 CSS 属性都有自己的默认值或初始值，但这些默认值并不一定相同。

一些 CSS 属性有明确的默认值，这意味着如果没有为该属性指定值，浏览器会应用其默认值。例如，`color` 属性的默认值是浏览器的默认文本颜色（通常是黑色）。

然而，其他一些 CSS 属性没有明确的默认值，而是根据上下文和元素类型来确定其初始值。这些初始值通常是由浏览器或用户代理样式表定义的。例如，`font-size` 属性在不同的浏览器或设备上可能具有不同的默认值。

另外，可以通过使用 CSS 的 `initial` 关键字来重置属性值为其初始值。这个关键字可以将属性值还原为其默认值或初始值。



## @规则



### 特性查询

@supports规则后面跟着一个小括号包围的声明。如果浏览器理解这个声明（在本例中，浏览器支持网格），它就会使用大括号里面的所有样式规则。如果它不理解小括号里的声明，就不会使用这些样式规则。--- 渐进增强

```css
@supports (display: grid){
	...
}
```



❑ @supports not(`<declaration>`)——只有当不支持查询声明里的特性时才使用里面的样式规则。

❑ @supports (`<declaration>`) or (`<declaration>`)——查询声明里的两个特性只要有一个支持就使用里面的样式规则。关键字or适合查询带浏览器前缀的属性

❑ @supports (`<declaration>`) and (`<declaration>`)——查询声明里的两个特性都支持才使用里面的样式规则。

回退代码和其他基础样式（比如颜色）放在了特性查询外面，因此它们始终适用。







### @layer

解决业务代码的 !important 问题。为什么业务代码需要用 !important 解决问题？因为 css 优先级由文件申明顺序有关，而现在大量业务使用动态插入 css 的方案，插入的时机与 js 文件加载与执行时间有关，这就导致了样式优先级不固定。

`@layer` 允许业务定义样式优先级，层越靠后优先级越高，比如下面的例子，`override` 定义的样式优先级比 `framework` 高：

```
@layer framework, override;

@layer override {
  .title {
    color: white;
  }
}

@layer framework {
  .title {
    color: red;
  }
}
```



### @container（容器查询）

@container 使元素可以响应某个特定容器大小。在 @container 出来之前，我们只能用 @media 响应设备整体的大小，而 @container 可以将相应局限在某个 DOM 容器内：

```css
// 将 .container 容器的 container-name 设置为 abc
.container {
  container-name: abc;
}
// 根据 abc 容器大小做出响应
@container abc (max-width: 200px) {
  .text {
    font-size: 14px;
  }
}
```

一个使用场景是：元素在不同的 `.container` 元素内的样式可以是不同的，取决于当前所在 `.container` 的样式。









## 可继承的属性

页面的根元素是 `<html>`

主要是跟文本相关的属性：color、font、font-family、font-size、font-weight、font-variant、font-style、line-height、letter-spacing、text-align、text-indent、text-transform、white-space以及word-spacing。还有比如列表属性：list-style、list-style-type、list-style-position以及list-style-image。表格的边框属性border-collapse和border-spacing也能被继承。（注意，这些属性控制的是表格的边框行为，而不是常用于指定非表格元素边框的属性）。还有 visibility、cursor



width、height的继承如下：

| 属性   | box-sizing: content-box                                      | box-sizing: border-box                                       |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| width  | 子元素的width==通过百分比==，只继承父元素的内容区域 content的width，子父元素的border、padding都不参与其中 | 子元素的width==通过百分比==，只继承父元素的内容区域 content的width，子元素的border、padding参与其中 |
| height | 子元素的height通过百分比，只继承父元素的内容区域 content的height，子父元素的border、padding都不参与其中 | 子元素的height通过百分比，只继承父元素的内容区域 content的height，子父元素的border、padding参与其中 |



## 可以赋给任意属性的两个特殊值

### inherit

该元素会继承其父元素的值。还可以使用inherit关键字强制继承一个通常不会被继承的属性，比如边框和内边距。



### initial

如果将initial值赋给某个属性，那么就会将其设置为默认值。



## 简写属性

大多数简写属性可以省略一些值，省略的值会被隐式地设置为初始值。比如，如果给网页标题使用简写属性font时，省略font-weight，那么字体粗细就会被设置为normal。

简写属性会尽量包容指定的属性值的顺序。可以设置border: 1px solid black或者border: black 1px solid，两者都会生效。这是因为浏览器知道宽度、颜色、边框样式分别对应什么类型的值。但是有很多属性的值很模糊。在这种情况下，值的顺序很关键。这些属性的值是==按顺时针方向，从上边开始的。没有指定的一边会取其对边的值。==还有一些属性只支持最多指定两个值，这些属性包括background-position、box-shadow、text-shadow（虽然严格来讲它们并不是简写属性）。这些属性值的顺序是==先水平、再垂直==。





## css属性推荐书写顺序

![image-20220505222845182](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/css.png)



## 自定义属性var()

### 用法

变量名前面必须有两个连字符（--），用来跟CSS属性区分，剩下的部分可以随意命名。变量必须在一个声明块内声明。比如在：root选择器内声明，则该变量可以在整个网页使用。调用函数var()就能使用该变量。

`var()`函数接受第二个参数，它指定了备用值。如果第一个参数指定的变量未定义，那么就会使用第二个值。如果var()函数算出来的是一个非法值，对应的属性就会设置为其初始值。

###  动态改变自定义属性

自定义属性就像作用域变量一样。可以定义一个变量为黑色，然后在某个容器中重新将其定义为白色。那么基于该变量的任何样式，在容器外部会动态解析为黑色，在容器内部会动态解析为白色。

### 使用JavaScript改变自定义属性

![image-20221021200233872](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221021200233872.png)可以用JavaScript为--main-bg动态设置一个新值。







## display



#### 属性值

| **属性值**   | **作用**                                                     |
| ------------ | ------------------------------------------------------------ |
| none         | 元素不显示，并且会从文档流中移除。                           |
| block        | 块类型。默认宽度为父元素宽度，会独占一行，多个元素会另起一行，可以设置width、height、margin和padding属性 |
| inline       | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。设置margin和padding会生效，只是不会撑大父元素而已（详情可见[这里](https://q.shanyue.tech/fe/css/281.html)） |
| inline-block | 默认宽度为内容宽度，可以设置宽高，同行显示。The inside of an inline-block is formatted as a block box, and the element itself is formatted as an atomic inline-level box.(MDN描述) |
| list-item    | 像块类型元素一样显示，并添加样式列表标记。                   |
| table        | 此元素会作为块级表格来显示。                                 |
| inherit      | 规定应该从父元素继承display属性的值。                        |
| grid         |                                                              |

```
html` 根元素的默认 `display` 为 `block
```

vertical-align声明只会影响行内元素或者table-cell元素

#### 隐藏元素的方法

**display: none**：渲染树不会包含该渲染对象。非继承，通过修改子孙节点属性无法显示。 回流。读屏器不会读取display: none元素内容。transition对于display无效

**visibility: hidden**：不会让元素从渲染树消失，元素在页面中<font color="red">仍占据空间</font>，但是==不会响应绑定的监听事件（即不能点击）==。会继承，可通过设置visibility: visible;可以让子孙节点显示。重绘。读屏器能读取visibility: hidden元素内容 。visibility可以支持动画。为它设置过渡不会使其逐渐消失，但transition-delay可以生效。

**opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中<font color="red">仍占据空间</font>，并且能够响应元素绑定的监听事件（即可以点击）。会继承，不能通过设置子元素opacity:0来重新显示。重绘。==transition 对于opacity有效==

**position** 为 absolute 或 fixed，通过设置 top、left 等值，将其移出可视区域。

```css
position:absolute;
left: -99999px;
```

**position** 设置 position 为 relative，通过设置 top、left 等值，将其移出可视区域。

```css
position: relative;
left: -99999px;
height: 0
```

设置 margin 值，将其移出可视区域范围（可视区域占位）。

```js
margin-left: -99999px;
height: 0;
```



**z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。

**clip/clip-path** ：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。因为他将元素提升为一个合成层，所以不会导致回流和重绘。

**transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。因为他将元素提升为一个合成层，所以不会导致回流和重绘。





#### 行内元素和行内块元素会显示间隙

**原因**：

​		浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格。

**解决办法：**

1. 为自身设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。

2. 将所有元素写在同一行。不足：代码不美观。

3. `margin`使用负值解决

4. **通过父元素的word-spacing **解决  不足：影响了单词间的间距，要通过调整自身的word-spacing为正常值来恢复正常

   ```html
   <!--示例-->
     <style>
       body{
         word-spacing: -10px;
       }
       .left{
         display: inline-block;
         width:100px;
         height:100px;
         background-color: antiquewhite;
         word-spacing: normal;
       }
       .right{
         display: inline-block;
         width: 100px;;
         height:100px;
         background-color: aquamarine;
         word-spacing: normal;
   
       }
     </style>
   </head>
   <body>
     <div class="left">this are apple banana lusa</div>
     <div class="right">this are apple banana lusa</div>
   </body>
   ```

   

5. 将父元素内的字符尺寸直接设为0，即font-size:0。不足：父元素中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari浏览器依然会出现空白间隔。

6. 消除父元素的字符间隔letter-spacing:-8px，不足：这也设置了自身内的字符间隔，因此需要将自身内的字符间隔设为默认letter-spacing:normal。

```html
<!--示例-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    ul{
      letter-spacing: -8px;
    }
    li {
      display: inline-block;
      width:25%;
      height:100px;
      background-color: aquamarine;
      letter-spacing: normal;
    }
  </style>
</head>
<body>
  <ul>
    <li>nihao达成更浓就是看见了</li><li>nihao达成更浓就是看见了</li>
    <li>nihao达成更浓就是看见了</li>
    <li>nihao达成更浓就是看见了</li>
    <li>nihao达成更浓就是看见了</li>
  </ul>
</body>
</html>
```







## `pointer-events` 

`pointer-events` 是 CSS 属性，用于控制元素对鼠标事件和触摸事件的响应方式。该属性有一些不同的值，可以用来灵活地控制元素是否接收这些事件。这主要用于解决以下场景：

1. **事件透明性：**
   - **Visible Element Overlapping:** 当页面上的元素重叠时，`pointer-events` 可以使位于上方的元素不接收鼠标事件，让下方的元素接收。这对于创建自定义的交互式组件，如弹出框、定制的下拉菜单等，是非常有用的。
2. **点击穿透问题：**
   - **Overlay or Modal Windows:** 在创建模态窗口或覆盖层时，可以使用 `pointer-events` 防止点击穿透，即避免点击到位于下方的元素。
3. **拖拽和滑动：**
   - **Drag-and-Drop Interfaces:** 在拖拽和滑动的用户界面中，通过设置 `pointer-events` 可以灵活控制哪些区域能够触发拖拽或滑动。

这是一个简单的例子，演示了 `pointer-events` 如何用于点击穿透问题：

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none; /* 让点击事件穿透该元素 */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  pointer-events: auto; /* 阻止点击事件穿透该元素 */
}
```

在这个例子中，`.overlay` 是一个半透明的背景层，通过 `pointer-events: none;` 让点击事件穿透，而 `.modal` 是一个位于上方的模态框，通过 `pointer-events: auto;` 阻止点击事件穿透。这样用户只能点击模态框上的元素，而无法点击背景层上的元素。











# 布局

## 概述

![image-20230430104148645](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-30-10-41-image-20230430104148645.png)



**定位上下文**：当一个元素的 `position` 属性设置为 `relative` 时，它就成为一个定位上下文（也称为定位容器，在实际应用中，元素的 `position` 属性为 `relative`、`absolute`、`fixed`、或 `sticky` 时都会形成定位上下文）。一个定位容器内的子元素，其 `position` 属性设置为 `absolute`，会相对于这个定位容器进行定位，而不是相对于整个页面。



## 盒子模型

### 盒模型介绍

每个元素身上都存在三个矩形框（参见浏览器开发者工具中）：

border box（边框的外沿框）、padding box（内边距的外沿框）和 content box。（内容区的外沿框）

CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：`外边距（margin）`、`边框（border）`、`内边距（padding）`、`实际内容（width,height）`四个方面。

![image-20230429150339944](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-15-03-image-20230429150339944.png)

### box-sizing（两种盒模型）

会影响内容区的大小！！！

这两个属性值最大的区别就是计算宽高的区域

box-sizing 属性可以被用来调整这些表现:

- `content-box` 是默认值。整个盒子的宽度为`width + padding + border` 。（就是以content-box来充当box-sizing）
- `border-box` （怪异盒模型）内容区的实际宽度是width减去(border + padding)的值。即width就是整个盒子的宽度。（就是以border-box来充当box-sizing）

通过继承的方式稳健地让你开发的网站里的盒子都为`border-box`：（考虑到可能会引用第三方组件库，你不能把人家组件库里的盒子模型也改了）

![image-20221021201745353](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221021201745353.png)



### Width/height

#### 普通文档流是为限定的宽度和无限的高度设计的

行内内容会填满视口的宽度，然后在必要的时候折行。(这里可以理解成如果文本没有超出父元素的宽度则行内元素的宽度由文本决定，如果文本超过父元素的宽度则会折行所以是由父元素决定)。

容器的高度由内容天然地决定，而不是容器自己决定。避免明确设置元素的高度，以免出现溢出问题。



#### 想让父盒子宽度由内部因素来决定，而不是由外部因素来决定

利用`**width**: min-content; `

`min-content; max-content; fit-content;`



#### 用百分比指定高度时会存在问题

百分比参考的是元素容器块的大小，但是容器的高度通常是由子元素的高度决定的。这样会造成死循环，浏览器处理不了，因此它会忽略这个声明。<strong style="color: red">要想让百分比高度生效，必须给父元素明确定义一个高度。</strong>





#### min-height和max-height

你可以用这两个属性指定最小或最大值，而不是明确定义高度，这样元素就可以在这些界限内自动决定高度。









### 内容区

<strong style="color: red">内容区要么由父盒子模型决定（设定了宽高），要么有子元素大小决定（没设宽高）。</strong>

当你发现div元素里的宽度大于其子元素（都是span元素）所有宽度相加时有可能就是内容区的大小比里面的span加起来大，当然如果你不设定宽高，那么内容区的大小无法确定，那么内容区就会由子元素撑开。



### 边框

#### `border-collapse`

`border-collapse`是一个容器属性， 应用在`<table>`上让其子元素生效





#### 实战

##### 实现渐变边框

![image-20230429151911666](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-15-19-image-20230429151911666.png)





##### 只用一个元素实现边框内圆角

```css
background: tan;
border-radius: .8em;
padding: 1em;
box-shadow: 0 0 0 .6em #655;
outline: .6em solid #655;
```



这样能实现的原因是 描边并不会跟着元素的圆角走（因而显示出直角，参见图 2-16），但 box-shadow 却是会的（参见图 2-17）。因此，如果我们

把这两者叠加到一起，box-shadow 会刚好填补描边和容器圆角之间的空隙，这两者的组合达成了我们想要的效果。

![image-20230706195637838](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-19-56-image-20230706195637838.png)

请注意，我们为 box-shadow 属性指定的扩张值并不一定等于描边的宽

度，我们只需要指定一个足够填补“空隙”的扩张值就可以了。事实上，指

定一个等于描边宽度的扩张值在某些浏览器中可能会得到渲染异常，因此我

推荐一个稍小些的值。这又引出了另一个问题：到底多大的投影扩张值可以

填补这些空隙呢？

为了解答这个问题，我们需要回忆起中学时学过的勾股定理，用来计算

直角三角形各边的长度。为了避免每次都要计算，你可以直接使用

圆角半径的一半，因为
$$
\sqrt2-1 < 0.5
$$


请注意，该计算过程揭示了这个方法的另一个限制：为了让这个效果得以达成，扩张半径需要比描边的宽度值小，但它同时又要比 
$$
\sqrt2-1 < 0.5
$$


（这里的 *r* 表示 border-radius）。

![image-20230706201551599](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-20-15-image-20230706201551599.png)









##### 生成多重边框的方案

###### box-shadow 方案

- 实现

它还接受第四个参数（称作“扩张半径”），通过指定正值或负值，可以让投影面积加大或者减小。一个正值的扩张半径加

上两个为零的偏移量以及为零的模糊值，得到的“投影”其实就像一道实线边框。

box-shadow 的好处在于，它支持逗号分隔语法，我们可以创建任意数量的投影。

```css
background: yellowgreen;
box-shadow: 0 0 0 10px #655, 0 0 0 15px deeppink;
```



- 缺点

无法实现虚线边框。



- 注意事项

 投影的行为跟边框不完全一致，因为它不会影响布局，而且也不会受到 box-sizing 属性的影响。不过，你还是可以通过内边距或外边

距（这取决于投影是内嵌和还是外扩的）来额外模拟出边框所需要占据的空间。 

 上述方法所创建出的假“边框”出现在元素的外圈。它们并不会响应鼠标事件，比如悬停或点击。如果这一点非常重要，你可以给

box-shadow 属性加上 inset 关键字，来使投影绘制在元素的内圈。请注意，此时你需要增加额外的内边距来腾出足够的空隙。



###### outline（描边） 方案

- 实现

如果你只需要两层边框，那就可以先设置一层常规边框，再加上 outline（描边）属性来产生外层的边框。描边的另一个好处在于，你可以通过 outline-offset 属性来控制它跟元素边缘之间的间距，这个属性甚至可以接受负值。这对于某些效果来说非

常有用。举个例子实现简单的缝边效果：![image-20230706163844073](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-16-38-image-20230706163844073.png)





- 缺点

只适用于双层“边框”的场景 







### 外边距

#### 处理容器中的间距（猫头鹰选择器）

使用猫头鹰选择器全局设置堆叠元素之间的外边距。

猫头鹰选择器（lobotomized owl selector），它长这样：＊ + ＊。该选择器开头是一个通用选择器（＊），它可以选中所有元素，后面是一个相邻兄弟组合器（+），最后是另一个通用选择器。 它会选中直接跟在其他元素后面的所有元素。

一般会将body放在选择器的前面，这样该选择器就只能选中body内的元素。如果直接使用猫头鹰选择器，它还会选中`<body>`元素，因为它是`<head>`元素的相邻兄弟节点。接下来用猫头鹰选择器给页面元素加上顶部外边距。这样除了每个容器下的第一个元素，其他都会有顶部外边距。

```css
body * + * {
	margin-top: 1.5em;
}
```

使用猫头鹰选择器是需要权衡的。它省去了许多的需要设置外边距的地方，但是在某些不想加外边距的地方则需要覆盖。通常只在有并列元素，或者有多列布局时这样使用。有时还需要根据设计，给段落和标题设置特定的外边距。



#### margin-right只对别人生效，而不对自己生效





#### 外边距折叠

<strong style="color: red">标准流下才会发生</strong>

（外边距折叠只发生在垂直方向上）有两种情况：

1. 外边距合并（兄弟）

   垂直布局的块级元素（兄弟），其上下的margin会合并，导致两者距离为两者margin的最大值（如果两者都是负值，则取绝对值中的最大值）

   解决方法：1. 只给其中一个盒子设置margin。2. 一个设为正值，一个设为负值，则可以变成两者之和。3. 在两个外边距之间加上边框（border）或者内边距（padding），防止它们折叠。

   

2. 外边距塌陷（父子）

   互相嵌套的块级元素（父子），子元素的margin-top会作用到父元素上，导致父元素一起往下移动

   解决方法：

   1. 给父元素再额外设置`border-top`或`padding-top`，这样父元素的margin就不会与子元素的margin接触了，就不会有塌陷的问题
   2. 父元素开启BFC，使得父子在不同的BFC中

如下方法可以防止外边距折叠。

❑ 对容器使用overflow: auto（或者非visible的值），防止内部元素的外边距跟容器外部的外边距折叠。这种方式副作用最小。

❑ 在两个外边距之间加上边框（border）或者内边距（padding），防止它们折叠。

❑ 如果容器为浮动元素、内联块、绝对定位或固定定位时，外边距不会在它外面折叠。

❑ 当使用Flexbox布局时，弹性布局内的元素之间不会发生外边距折叠。网格布局（参见第6章）同理。（只有普通文档流才会外边距折叠）

❑ 当元素显示为table-cell时不具备外边距属性，因此它们不会折叠。此外还有table-row和大部分其他表格显示类型，但不包括table、table-inline、table-caption。



#### 负外边距

<strong style="color: red">不同于内边距和边框宽度，外边距可以设置为负值。</strong>如果设置左边或顶部的负外边距，元素就会相应地向左或向上移动，导致元素与它前面的元素重叠，如果设置右边或者底部的负外边距，并不会移动元素，而是将它后面的元素拉过来。给元素底部加上负外边距并不等同于给它下面的元素顶部加上负外边距。如果不给一个块级元素指定宽度，它会自然地填充容器的宽度。但如果在右边加上负外边距，则会把它拉出容器。如果在左边再加上相等的负外边距，元素的两边都会扩展到容器外面。如果元素被别的元素遮挡，利用负外边距让元素重叠的做法可能导致元素不可点击。





#### auto属性

##### 核心

<strong style="color: red">margin的auto属性的作用是用来分配剩余空间</strong>，所以对于有剩余空间的元素才有效哦（块及元素）。比如图片设置margin: 0 auto是无效的，因为图片是内联元素，不是占一整行，没有剩余空间。



##### 作用

###### 块级元素水平方向居中：

原理：两侧auto，则平分剩余空间，相当于水平居中。

`div { margin-right: auto;  margin-left: auto; width:200px;  height: 200px }` 当然也可以这样写 `div { margin: 0 auto; width:200px;  height: 200px }`  跟垂直方向无关，垂直方向可随便设置，只要水平左右都设置为auto即可。<strong style="color: red">注意width宽度一定要设置，没有宽度的块默认就是100%，就没有auto值了。</strong>



###### 块级元素水平居右：

原理：一侧auto，一侧没设置，则设置auto的一侧分配所有剩余空。

想让div居右显示，已经很简单了。把margin-left 的值设置为auto 即可。代码如下：

`div { width:200px; height: 200px; margin-left: auto;}`



###### 一侧定值,一侧auto,auto为剩余空间大小。代码如下：

`div { width:200px; height: 200px; margin-left: auto; margn-right: 100px; }`



###### 垂直方向的居中要结合绝对定位

```css
div  {
                background: #FF0000;
                width: 200px;
                height: 200px;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
```



`margin: auto;`  是关键，没有设置此项，也不会水平垂直居中。

解释下原理:

1.在普通内容流中，`margin:auto`的效果等同于`margin-top:0;margin-bottom:0`。

2.`position:absolute`使绝对定位块跳出了内容流，内容流中的其余部分渲染时绝对定位部分不进行渲染。

3.为块区域设置`top: 0; left: 0; bottom: 0; right: 0;`将给浏览器重新分配一个边界框，此时该块块将填充其父元素的所有可用空间，所以margin 垂直方向上有了可分配的空间。

4.再设置margin 垂直方向上下为auto，即可实现垂直居中。（注意高度得设置）。









### Block-Formatting-Context

#### 介绍

block formatting context，中文为“块级格式化上下文”。简而言之，BFC里的内容不会跟外部的元素重叠或者相互影响。如果说一个盒子是BFC或者有BFC特性，那么这个盒子<strong style="color: red">内部</strong>形成了一个新的块级格式化上下文。但是<strong style="color: red">这个盒子本身还是在它上一级的BFC中。</strong>

#### 两个特点

1. BFC内部的元素不影响外部

   作用：

   1. 解决高度塌陷（清除 浮动带来的影响）：将父元素开启BFC，则子元素是浮动的情况下也不会造成父元素高度塌陷。因为如果父元素还是高度塌陷，则必然会影响父元素后面的元素布局和定位，这显然有违 BFC元素的子元素不会影响外部元素的设定。
   2. 解决父元素与子元素的外边距塌陷问题： 因为如果外边距塌陷是会影响外面的元素的；

2. 两个BFC间互不干扰。

   作用：

   1. 给父元素开启BFC后，其子元素就不会被另一个同级的float元素覆盖了。

  





#### BFC的渲染规则

##### 简洁版

在一个BFC中，盒子会从包含块的顶部开始，按序垂直排列。同级盒子间的垂直距离会由“margin”属性决定。相邻两个块级盒子之间的垂直间距会遵循外边距折叠原则被折叠。



##### 详细版

BFC就是一个决定如何渲染元素的容器。我们要了解的就是它的渲染规则。

- 1、内部的块级元素会在垂直方向，一个接一个地放置。
- 2、块级元素垂直方向的距离由margin决定。属于同一个BFC的两个相邻块级元素的margin会发生重叠。
- 3、对于从左往右的格式化，每个元素（块级元素与行内元素）的左边缘，与包含块的左边缘相接触，(对于从右往左的格式化则相反)。即使包含块中的元素存在浮动也是如此，除非其中元素再生成一个BFC。[详情可看这里](https://juejin.cn/post/6844904145388830728#heading-7)
- 4、BFC的区域不会与浮动元素重叠。
- 5、BFC是一个隔离的独立容器，容器里面的子元素和外面的元素互不影响。
- 6、计算BFC容器的高度时，浮动元素也参与计算。








#### 开启BFC的方式

有非常多，可去查文档，这里介绍一部分

1.  `<html>`根元素；
2.  float的值不为none；
3.  overflow的值为auto、scroll或hidden；
4.  display的值为table-cell、table-caption和inline-block中的任何一个；
5.  position的值不为relative和static。



#### 特殊情况

某些情况下，BFC中的内容可能还会与别的BFC的内容重叠。比如，内容溢出了容器（比如内容太宽）或者因为负外边距导致内容被拉到容器外面。





### IFC的概念和应用

IFC的全称是Inline Formatting Contexts，也就是“内联格式化上下文”。

行内格式化上下文是一个网页的渲染结果的一部分。其中，各行内框（inline boxes）一个接一个地排列，其排列顺序根据书写模式（writing-mode）的设置来决定。

在下面给出的例子中，<strong style="color: red">带黑色边框的两个 ([`div`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div)) 元素组成了一个[块级格式化上下文（block formatting context）](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)，其中的每一个单词都参与一个行内格式化上下文中。</strong>水平书写模式下的各个框水平地排列，垂直书写模式下的各个框垂直地排列。

![image-20230710172501541](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-17-25-image-20230710172501541.png)





#### 行内框盒子模型

`line boxes`模型，下面是一段示例代码：

```html
<p>这是一行普通的文字，这里有个 <em>em</em> 标签。</p>
```

在这段代码中涉及到 4 个`boxes`：

- 1、首先是`<p>`标签所在的`containing block`（包含块）。由一行一行的行框盒子组成。
- 2、`line box`（行框盒子)，在`containing boxes`里面，一个个的`inline boxes`组成了`line boxes`，每一行就是一个行框盒子。

- 3、然后是`inline box`（内联盒子），如果(文字)外部包含`inline`水平的标签(`span、a、em、strong`等)，则属于内联盒子。如果是个光秃秃的文字，则属于匿名内联盒子。如下图标注，`inline boxes`不会让内容成块显示，而是排成一行。

![image-20230720004055615](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-20-00-40-image-20230720004055615.png)

- 4、`content area`（内容区域），内容区域指一种围绕文字看不见的盒子，其大小仅受字符本身特性控制(与`font-size`大小和`font-family`相关)，本质上是一个字符盒子(`character box`)，但是有些元素，如图片这样的替换元素，其内容显然不是文字，不存在字符盒子之类的，对于这些元素，内容区域可以看成元素自身。

<strong style="color: red">在 line box 模型中，`inline boxes`的高度直接受`line-height`控制，而`line boxes`高度则等于内部最高的`inline box`的高度，而这些`line boxes`的高度垂直堆叠形成了`containing box`的高度，也就是我们见到的`<p>`或者`<div>`标签的高度。</strong>





#### baseline

![image-20230710155501870](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-15-55-image-20230710155501870.png)

在 CSS 中有两个重要属性，<strong style="color:red">`line-height`和`vertical-align`都与基线有关，`line-height`行高的定义就是两个基线之间的距离，`vertical-align`的默认值就`baseline`，也就是基线对齐。对于内联元素，虽然`vertical-align`与`line-height`可能没有写上去，但实际上**到处都是**！</strong>



一个<strong style="color:red">`inline-block`</strong>元素，如果里面没有`inline`内联元素，或者`overflow`不是`visible`，则该元素的基线就是其<strong style="color:red">`margin`底边缘(比如图片)</strong>，否则，其基线就是<strong style="color:red">元素里面最后一行内联元素的基线。</strong>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>test</title>
    <style>
      .father {
        font-size: 40px;
        background-color: red;
      }
      img {
        width: 100px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div class="father">
      <img src="./img.png" />
      <span>askbspxj</span>
    </div>
  </body>
</html>
```

上述代码表现：![image-20230721161149935](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-21-16-11-image-20230721161149935.png)



#### 幽灵节点

##### 介绍

HTML5 规范：

> "Each line box （感觉是特指inline-block） starts with a zero-width inline box with the element's font and line height properties. We call that imaginary box a 'strut'."

跟vertical-align和line-height属性有关。



##### 示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>test</title>
    <style>
      .father {
        font-size: 40px;
        background-color: red;
      }
      .child {
        display: inline-block; /****************************************/
      }
    </style>
  </head>
  <body>
    <div class="father">
      <span class="child"></span>
    </div>
  </body>
</html>
```





##### 消除“幽灵空白节点”的影响

- 1、让`vertical-align`失效：`vertical-align`属性对于块级元素是无感的，因此我们只需要为元素设置`dispaly`为`block`即可;
- 2、修改`vertical-align`属性值：修改其默认值`baseline`值为其他属性值，使其不再相对基线对齐;
- 3、修改`line-height`的值：上面我们说过`line-height`的定义是两基线之间的距离，因此在上面例子中，图片下面的空隙，实际上是“幽灵空白节点”计算后的行高值和基线的距离，因此，只要`line-height`足够小，便可以消除图片下面的空隙。（注意这里是要在`div`上设置`line-heght`，然后让`div`的`inline boxes`继承`line-height`属性）



#### IFC的生成条件

块级元素中仅包含内联级别元素时（需要注意的是当IFC中有块级元素插入时，会产生两个匿名块将父元素分割开来，产生两个IFC。）



#### IFC的渲染规则

- 不能设置宽高，**内联元素的高度是由行高决定的**
- 子元素水平方向横向排列，并且垂直方向起点为元素顶部。
- 子元素只会计算横向样式空间，【padding、border、margin】（padding-inline-start,padding-inline-end），垂直方向样式空间不会被计算，【padding、border、margin】。
- 在垂直方向上，子元素会以不同形式来对齐（vertical-align）
- 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和与其中的浮动来决定。
- IFC中的“line box”一般左右边贴紧其包含块，但float元素会优先排列。
- IFC中的“line box”高度由 CSS 行高计算规则来确定，同个IFC下的多个line box高度可能会不同。
- 当 inline-level boxes的总宽度少于包含它们的line box时，其水平渲染规则由 text-align 属性值来决定。
- 当一个“inline box”超过父元素的宽度时，它会被分割成多个boxes，这些 boxes 分布在多个“line box”中。如果子元素未设置强制换行的情况下，“inline box”将不可被分割，将会溢出父元素。

#### IFC的应用

- 水平居中：当一个块要在环境中水平居中时，设置其为inline-block则会在外层产生IFC，通过text-align则可以使其水平居中。
- 垂直居中：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。





#### 相关属性

##### line-height

###### **（1）line-height的概念**

- `line-height` 属性适用于包含文本内容的元素，<strong style="color: red">设置bfc/ffc/gfc盒子中文本内容的行高。</strong>

- 可继承的！！且有默认值（约为`1.2`，这取决于元素的 `font-family`），正是由于有默认值使字的盒子跟字不完全贴合。

- <strong style="color: red">行高(line-height)=内容区域高度(content area)+行间距(vertical spacing)，其中行间距分上下部分，间距对半分。行间距可以为负值。</strong>实际上是下一行基线到上一行基线距离

  ![image-20230710161047126](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-16-10-image-20230710161047126.png)

- 对于非[替代](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的 inline 元素，它用于计算行盒（line box）的高度。

- 把 line-height 值设置与内容高度 一样大小的值可以实现单行文字的垂直居中；

- 如果`line-height` 小于`font-size`，`inline box`会优先选择行高，以保证`inline box`的高度正好等于行高。例：`font-size: 16px; line-height: 12px; 此时inline box`高度为`12px`。所以`content area`会溢出，`inline box`的顶部和底部半行高会折叠起来。





###### **（2）line-height 的赋值方式**

使用有单位的值时，子元素会继承这个line-height的计算值。使用无单位的值时，子元素继承的是声明值，即在每个继承子元素上会重新算它的计算值。

```
normal取决于用户端。桌面浏览器（包括Firefox）使用默认值，约为`1.2`，这取决于元素的 `font-family`。
```

```
<数字>该属性的应用值是这个无单位数字乘以该元素的字体（font-size）大小。这是设置`line-height`的推荐方法，不会在继承时产生不确定的结果!!
```

```
<长度>以 **em** 为单位的值可能会产生不确定的结果。
```

```
<百分比>与元素自身的字体大小有关。计算值是给定的百分比值乘以元素计算出的字体大小。**百分比**值可能会带来不确定的结果：当前元素根据font-szie 计算行高后，会将这个值继承给下面的元素，可以理解为继承了具体的值。
```







##### 文本对齐text-align

<strong style="color: red">用在块父容器（行框（line box））上，行内内容（例如文字）如何相对它的块父元素对齐。</strong>

如果行内方向上还有额外空间（即父元素是块元素，因为只有块元素才会在行内方向上有额外空间），那么 [`text-align`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align) 可用于将各行内框（inline boxes）在行框（line box）内对齐。

    水平对齐主要说一下 justify：
    text-align:justify;     如果文本内容一行显示不下，该对齐方式可以是文本内容与父容器两端边界对齐；
                        使用：在中韩日文字文本可以处理段落层次不齐的问题
                    弊端：非中日韩文字，文字过长会到各种无法预料的呈现方式。
                 原因：在两端对齐文本中，文本行的左右两端都放在父元素的内边界上。然后，调整单词和字母间的间隔，使各行的长度恰好相等。



##### `vertical-align`

<strong style="color: red">设定在行内元素自身上。设在块级元素上无效。</strong>

行内框（Inline boxes）可使用[`vertical-align`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)属性，以不同的方式在块的方向上进行对齐。













### FFC的概念和应用

#### 1、FFC的概念

FFC的全称是Flex formatting contexts，弹性盒模型。

##### 2、FFC的生成条件

父级元素设置`display:flex`或者`display:inline-flex

#### 3、FFC的渲染规则

可以看[阮一峰的Flex 布局教程：语法篇](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F07%2Fflex-grammar.html)，讲的非常详细。

要注意一点。生成FFC后，其==子元素的float、clear和vertical-align属性将失效。==

#### 4、FFC的应用

##### 1、自动撑开页面高度，底栏总是出现在页面的底部

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Kqvukz.webp)

```css
<style>
.wrap{
    display:flex;
    padding:0;
    margin:0;
    min-height:100vh;
    flex-direction:column;
}
.main{
    flex-grow:1;
}
</style>
<body class="wrap">
    <header style="line-height:50px;background:red;color:#fff;text-align:center">头部</header>
    <main class="main">内容</main>
    <footer style="line-height:50px;background:#eeeeee;color:#333;text-align:center">底栏</footer>
</body>
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-qXOFNK.webp)

##### 2、经典的圣杯布局

```xml
<style>
.wrap {
    display: flex;
    padding: 0;
    margin: 0;
    min-height: 100vh;
    flex-direction: column;
}
header,
footer {
    flex: 0 0 50px;
}

.content {
    display: flex;
    flex: 1
}

.main {
    flex: 1;
}
.nav,
.ads{
    flex: 0 0 100px;
    background:green;
}
.nav{
    order:-1;
    background:yellow;
}
</style>
<body class="wrap">
    <header style="line-height:50px;background:red;color:#fff;text-align:center">头部</header>
    <div class="content">
        <main class="main">内容区</main>
        <nav class="nav">侧边导航</nav>
        <aside class="ads">侧边栏</aside>
    </div>
    <footer style="line-height:50px;background:#eeeeee;color:#333;text-align:center">底栏</footer>
</body>
```

![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-aM5FmI.webp)



## 浮动

#### 浮动的初衷

浮动元素会被移出正常文档流，并被拉到容器边缘。文档流会重新排列，但是它会包围浮动元素此刻所占据的空间。如果让多个元素向同侧浮动，它们就会挨着排列。

#### 浮动的特点

- ==脱离普通流的规则，盒子随内容宽度撑开==

- 浮动元素会受到上面元素边界的影响

- 浮动可以使块级元素一行显示多个，使行内元素可以设置宽高

- 浮动的元素不能通过`margin:0 auto`来使其自身水平居中，也不能通过给其父元素设置`text-align:center` 来使其水平居中。（其实我们使用浮动的初衷就是为了让元素靠到最左边或者最右边去，那你又要高水平居中不就自相矛盾了）

- 浮动的元素不会盖住行内元素和行内块元素和文本（本质就是float只能盖住上下的，不能盖住左右的，你个float的出生的作用之一就是为了左右布局）

- ==清除浮动其实就是清除浮动导致的高度塌陷问题==



#### 高度塌陷

​			子元素浮动后，完全脱离文档流，将无法撑起父元素的高度，导致父元素高度丢失。

​			父元素高度丢失后，其下的元素会上移，导致页面的布局混乱。

解决方法：

- 清除浮动带来的影响
- 创建父级 BFC
- 父级设置高度



#### 清除 浮动带来的影响

clear: both声明让该元素移动到浮动元素的下面，而不是侧面。clear的值还可以设置为left或者right，这样只会相应地清除向左或者向右浮动的元素。因为空div本身没有浮动，所以容器就会扩展，直到包含它，因此也会包含该div上面的浮动元素。`clear`属性只能在块级元素上起作用。

- 父级开启bfc

- ![image-20220824212555474](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220824212555474.png)

    这种方法的原理：`clear`属性只能在块级元素上起作用，这就是清除浮动样式中`display:block`的作用。

    另外`visibility: hidden;height: 0;`只要`content`的值为空。写不写都无所谓。

    

  

- ![image-20220824212533788](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220824212533788.png)

  

给：:before和：:after伪元素都加上`display: table`属性。当我们想避免该元素发生外边距塌陷时，这种清除浮动非常有用。 因为创建一个display: table元素也就在元素内隐式创建了一个表格行和一个单元格。因为外边距无法通过单元格元素折叠，所以也无法通过设置了display: table的伪元素折叠。





#### 利用浮动实现每行固定几个元素的布局

清除每行的第一个元素上面的浮动。比如每行有两个盒子，因此只需要清除每行的第奇数个元素上面那行的浮动即可。你可以用：nth-child()伪类选择器选中这些目标元素。

```css
.media{
	float: left;
}

.media:nth-child(odd){
	clear:left;
}
```

#### 利用浮动实现网格系统

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022190703495.png" alt="image-20221022190703495" style="zoom:50%;" />

`.row{}`的作用：解决 网格列和网格行外的内容出现轻微的错位 的问题。比如页面标题（“Running tips”）的左边缘本来应该跟第一列的媒体对象的边缘对齐，但是列的内边距让媒体对象所在的灰色盒子稍微往右移了一点。于是使用负外边距来拉伸行元素的宽度。给行元素添加一个−0.75em的左侧外边距，把行元素的左侧拉伸到容器外面。列元素的内边距会把里面的内容往右推0.75em，第一列就会跟页面标题左对齐。同理，还要给行元素添加负的右侧外边距，拉伸右侧。





## 定位



#### position属性

static：无特殊定位，对象遵循正常文档流。<font color="red">top，right，bottom，left属性不会对静态元素应用。position属性的初始值是static。</font>如果把它改成其他值，我们就说元素就被定位了。而如果元素使用了静态定位，那么就说它未被定位。

 relative：<font color="red">对象遵循正常文档流。</font>且其它元素仍然根据它原始的位置进行布局。<font color="red">跟固定或者绝对定位不一样，不能用top、right、bottom和left改变相对定位元素的大小。这些值只能让元素在上、下、左、右方向移动。可以用top或者bottom，但它们不能一起用（bottom会被忽略）。同理，可以用left或right，但它们也不能一起用（right会被忽略）。</font>而其==层叠通过z-index属性定义==。 可以用这些属性调整相对元素的位置，更常见的用法是使用position: relative给它里面的绝对定位元素创建一个包含块。

absolute：对象脱离正常文档流，使用top，right，bottom，left等属性进行绝对定位。而其层叠通过z-index属性定义。 如果父元素未被定位，那么浏览器会沿着DOM树往上找它的祖父、曾祖父，<strong style="color:red">直到找到一个定位元素，用它作为包含块。</strong>如果祖先元素都没有定位，那么绝对定位的元素会基于初始包含块（initial containing block）来定位。初始包含块跟视口一样大，固定在网页的顶部。

fixed：对象脱离正常文档流，使用top，right，bottom，left等属性以窗口为参考点进行定位，当出现滚动条时，对象不会随着滚动。设置这四个值还隐式地定义了元素的宽高。比如指定left: 2em; right: 2em表示元素的左边缘距离视口左边2em，右边缘距离视口右边2em。因此元素的宽度等于视口总宽度减去4em。而其层叠通过z-index属性定义

sticky：CSS3 新增的，设置了 sticky 值后，在屏幕范围（viewport）时该元素的位置并不受到定位影响（设置是top、left等属性无效），当该元素的位置将要移出偏移范围时，定位又会变成fixed，根据设置的left、top等属性成固定位置的效果。正常情况下，元素会随着页面滚动，当到达屏幕的特定位置时，如果用户继续滚动，它就会“锁定”在这个位置。最常见的用例是侧边栏导航。

sticky 属性值有以下几个特点：

- 该元素并<font color="red">不脱离文档流</font>，仍然保留元素原本在文档流中的位置。
- 当元素在容器中被滚动超过指定的偏移值时，元素在容器内固定在指定位置。亦即如果你设置了top: 50px，那么在sticky元素到达距离相对定位的元素顶部50px的位置时固定，不再向上移动。
- 元素固定的相对偏移是相对于离它最近的具有滚动框的祖先元素（这个祖先的overflow是scroll/hidden/auto），如果祖先元素都不可以滚动，那么是相对于viewport来计算元素的偏移量。<font color="red">注意：只有当相对的那个元素的高度大于粘性元素时才会让粘性元素固定。</font>







#### **`right`** 

定义了定位元素的右外边距边界与其包含块右边界之间的偏移，非定位元素设置此属性无效。

相对于包含块（transform的位移是相对于元素自身）

top、bottom、left 类似



#### 绝对定位和固定定位的特殊性

- 绝对定位和固定定位都会被移出正常文档流，需要盒子压着另一个盒子时（元素间层叠）那你就要想到用这俩定位了。

- 绝对定位和固定定位会压住下面标准流里所有内容。（而浮动元素只会压住下面标准流的盒子，但是不会压住下面标准流盒子里的文字、行内元素、行内块元素）
- 绝对和固定定位会生成一个inline-block框
- 浮动不起作用







### 绝对定位

#### 简介

是相对于父元素的内容区（即不算边框和边距）的左上角



#### 宽度

绝对定位元素默认宽度是自适应的，且默认最大宽度是父元素的宽度，设定`max-width`无效。

可以通过设置right 和 left突破这个最大宽度，但是这样就相当于写死了绝对定位元素的宽度（width=其右边界减左边界）。

**`right`** 定义了定位元素的右外边距边界与其包含块右边界之间的偏移，`left`属性定义了定位元素的左外边距边界与其包含块左边界之间的偏移。





#### 如果父元素设置了overflow

<strong style="color: red">如果父元素设置了overflow，那么如果子元素超出了父元素内容区则会被隐藏。</strong>



#### 居中方法

子绝父相水平居中方法

1. 先让子盒子往右移动父盒子的一半`left:50%`
2. 再让子盒子往左移动自己的一半`tranform:translateX(-50%)`

子绝父相水平垂直居中方法

1. `left:50%`
2. `top:50%`
3. `transform:translate(-50%,-50%)`



### 为什么有时候⽤**translate**来改变位置⽽不是定位

translate 是 transform 属性的⼀个值。改变transform或opacity不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。 

但translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。





### [设置position:fixed后元素脱离标准流的解决方法](https://www.cnblogs.com/echol/p/13663311.html)

如果我们不去解决position:fixed;引发的问题，那么下面的图片初始加载出来时就会位于任务栏的下方（如下图所示）

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CgGdTR.png)

 那么我们要如何解决这个问题呢？

##### 最佳方案：将下面的盒子设置padding空出fixed的这片区域。



##### 方法一：在设置了position:fixed;的盒子外面再套一个盒子，且高度与设置此属性的盒子一致

```
 <style>
        .zero {
            width: 800px;
            height: 100px;
            background-color: purple;
            border: 1px solid #ccc;
        }

        .one {
            position: fixed;
            width: 800px;
            height: 100px;
            border: 1px solid #ccc;
            background-color: pink;
        }

        .two {
            width: 1000px;
            height: 200px;
            background-color: blueviolet;
        }
    </style>
</head>

<body>
    <div class="zero">
        <div class="one"></div>
    </div>
    <div class="two"></div>
</body>
```

 

#####  方法二：在设置了该属性盒子同级下再添加一个盒子，并设置高度与此盒子的高度相同

```
<style>
        .one {
            position: fixed;
            width: 800px;
            height: 100px;
            border: 1px solid #ccc;
            background-color: pink;
        }

        .half {
            height: 100px;
            background-color: brown;
        }

        .two {
            width: 1000px;
            height: 200px;
            background-color: blueviolet;
        }
    </style>
</head>

<body>
    <div class="one"></div>
    <div class="half"></div>
    <div class="two"></div>
</body>
```

 

 

##### 方法三：给下面的盒子设置margin-top:mpx; 

 m为设置了position:fixed;盒子的高度。但是该方法可能会导致一个问题-外边距塌陷问题。因此对于某些情况而言，采用此方法是我们同时还要考虑外边距塌陷的问题。









## FlexBox

#### 介绍

弹性盒布局，CSS3 的新属性

之前提到的display值，比如inline、inline-block等，只会影响到应用了该样式的元素，而Flexbox则不一样。一个弹性容器能控制内部元素的布局。

Flex 布局的默认行为是将 flex 项放在一行中并尽量填充容器的宽度。如果容器内的 flex 项总宽度超过了容器的宽度，那么 flex 项的宽度会被压缩以适应容器。这可能会导致子元素宽度变小。



#### 属性

##### 容器

 `display：flex` 则该容器是一个块级元素。弹性子元素不一定填满其弹性容器的宽度，且如果flex子元素没有给定宽度，则根据内容去定宽度。里面的列都是等高的。

 `display: inline-flex` 则容器元素为行内元素。

1. flex-direction属性决定主轴的方向；水平弹性盒子的大部分概念同样适用于垂直的弹性盒子，但是有一点不同：在CSS中处理高度的方式与处理宽度的方式在本质上不一样。弹性容器会占据100%的可用宽度，而高度则由自身的内容来决定。即使改变主轴方向，也不会影响这一本质。

2. flex-wrap属性定义如何换行；启用换行后，==子元素不再根据flex-shrink值收缩==，任何超过弹性容器的子元素都会换行显示。如果弹性方向是column或column-reverse，那么flex-wrap会允许弹性子元素换到新的一列显示，不过这只在==限制了容器高度的情况下才会发生==，否则容器会扩展高度以包含全部弹性子元素。`flex-wrap:no-wrap` 默认值是`no-wrap`，那么容器会强制使所有flex子元素都塞到一行上（即==当塞不入时就会强制改变子元素的宽度（即你设置的宽度无效了））==

3. flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap；

4. justify-content属性定义了项目在主轴上的对齐方式。如果任意子元素的flex-grow的值不为0，或者任意子元素在主轴方向的外边距值为auto, justify-content就失效了。

5. align-items属性定义项目在交叉轴上如何对齐。

6. align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

   >  The `flex-wrap: nowrap` property prevents `align-content` from having an effect. Try setting `flex-wrap` to something other than `nowrap`.

   

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022195910416.png" alt="image-20221022195910416" style="zoom: 50%;" />

Justify-content

![WechatIMG542](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/WechatIMG542.jpeg)



##### 项目

- order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。正常情况下，弹性子元素按照在HTML源码中出现的顺序排列。它们沿着主轴方向，从主轴的起点开始排列。使用order属性能改变子元素排列的顺序。还可以将其指定为任意正负整数。如果多个弹性子元素有一样的值，它们就会按照源码顺序出现。
- flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。每个弹性子元素的flex-basis值计算出来后，它们（加上子元素之间的外边距）加起来会占据一定的宽度。加起来的宽度不一定正好填满弹性容器的宽度，可能会有留白。多出来的留白（即剩余宽度）会按照flex-grow（增长因子）的值分配给每个弹性子元素，flex-grow的值为非负整数。如果一个弹性子元素的flex-grow值为0，那么它的宽度不会超过flex-basis的值；==如果某个弹性子元素的增长因子非0，那么这些元素会增长到所有的剩余空间被分配完，也就意味着弹性子元素会填满容器的宽度（或高度）==。flex-grow的值越大，元素的“权重”越高，也就会占据更大的剩余宽度。一个flex-grow:2的子元素增长的宽度为flex-grow: 1的子元素的两倍。
- flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。计算出弹性子元素的初始主尺寸后，它们的累加值可能会超出弹性容器的可用宽度。如果不用flex-shrink，就会导致溢出。每个子元素的flex-shrink值代表了它是否应该收缩以防止溢出。如果某个子元素为flex-shrink: 0，则不会收缩；如果值大于0，则会收缩至不再溢出。按照flex-shrink值的比例，值越大的元素收缩得越多。
- flex-basis属性定义了元素初始的“主尺寸”。flex-basis属性可以设置为任意的width值，包括px、em、百分比。它的初始值是auto，此时浏览器会检查元素是否设置了width属性值。如果有，则使用width的值作为flex-basis的值；如果没有，则用元素内容自身的大小。如果flex-basis的值不是auto, width属性会被忽略。每个弹性子元素的初始主尺寸确定后，它们可能需要在主轴方向扩大或者缩小来适应（或者填充）弹性容器的大小。这时候就需要flex-grow和flex-shrink来决定缩放的规则。
- flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。主轴发生了旋转后，对于弹性子元素而言，flex-basis、flex-grow和flex-shrink现在作用于元素的高度而不是宽度。即如果设置了`flex: 1`则子元素的高度会扩展到填满容器。
- align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 *auto*，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。



![image-20221022200052991](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022200052991.png)

flex属性的几种实用方式：

![image-20221022194317847](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022194317847.png)





#### Flex 文字太多用省略号表示

```css
/* 溢出的时候显示省略号 */
.orders .goods .txt {
    flex: 1;
    /* 因为弹性盒子的尺寸可以被内容撑开, 不换行的文字可以撑开这个盒子的尺寸，所以要把宽度设为0 */
    width: 0;
  /*还有一种方法是去掉flex和width，直接写width:100px，即指定width的固定宽度*/
}
.orders .goods .txt h5 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
```



#### 整页布局时

假设有一个使用弹性盒子（flex-direction: row）实现的三列布局。如果其中两列的内容加载了，浏览器可能会在加载完第三列之前就渲染这两列。然后等到剩余内容加载完，浏览器会重新计算每个弹性子元素的大小，重新渲染网页。用户会短暂地看到两列布局，然后列的大小改变（可能改变特别大），并出现第三列。（只有一行多列的布局才会产生这个问题。如果主页面布局采用的是一列多行（flex-direction: column），就不会出现以上问题。）

建议是对整页布局的时候使用网格布局。



#### 子元素定义width和height不起效果

当指定view为flex布局后，给子元素定义width和height是不起效果的。原因：定义为flex布局元素的子元素，自动获得了flex-shrink的属性，这个属性就是告诉子元素当父元素宽度不够用时，自己调整自己所占的宽度比，这个flex-shrink设置为1时，表示所有子元素大家同时缩小来适应总宽度。当flex-shrink设置为0时，表示大家都不缩小适应。

所以，倘若给父元素设置了flex布局后，若要其子元素的width和height有效果，必须给子元素设置flex-shrink为0。

```css
.scrollLrc{
  display: flex;
  height: 120rpx;
  overflow: hidden;
  flex-direction: column;
  align-items: center;

/*子元素元素代码css代码*/
.lyricItem{
  height: 40rpx;
  flex-shrink: 0;
}
```







#### bugs

可能存在一些兼容性的bugs，[点开此链接查看](https://github.com/philipwalton/flexbugs)





## grid(网格布局)

参考[原文](https://juejin.cn/post/6854573220306255880)



#### 使用场景

##### 二维对齐

当设计要求元素在两个维度上都对齐时，使用网格。当只关心一维的元素排列时，使用Flexbox。在实践中，这通常（并非总是）意味着网格更适合用于整体的网页布局，而Flexbox更适合对网格区域内的特定元素布局。

![image-20221022205548056](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022205548056.png)



##### 照片墙

例如这种效果：<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022212438071.png" alt="image-20221022212438071" style="zoom: 25%;" />

在这个布局中，将设置列的网格轨道，但是网格行是隐式创建的。这样网页不必关心照片的数量，它能适应任意数量的网格元素。只要照片需要换行显示，就会隐式创建新的一行。





#### 网格的组成部分

![image-20221022203423725](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221022203423725.png)

❑ 网格线（grid line）——网格线构成了网格的框架。一条网格线可以水平或垂直，也可以位于一行或一列的任意一侧。如果指定了grid-gap的话，它就位于网格线上。

❑ 网格轨道（grid track）——一个网格轨道是两条相邻网格线之间的空间。网格有水平轨道（行）和垂直轨道（列）。

❑ 网格单元（grid cell）——网格上的单个空间，水平和垂直的网格轨道交叉重叠的部分。

❑ 网格区域（grid area）——网格上的矩形区域，由一个到多个网格单元组成。该区域位于两条垂直网格线和两条水平网格线之间。

构建网格布局时会涉及这些组成部分。比如声明grid-template-columns: 1fr 1fr 1fr就会定义三个等宽且垂直的网格轨道，同时还定义了四条垂直的网格线：一条在网格最左边，两条在每个网格轨道之间，还有一条在最右边。



#### 网格布局语法

当你构建一个网格时，选择一种舒适的语法即可。网格布局共设计了三种语法：编号的网格线、命名的网格线、命名的网格区域。



#### 容器属性

##### display 属性

 `display：grid` 则该容器是一个块级元素

 `display: inline-grid` 则容器元素为行内元素。




##### grid-template-columns 属性和 grid-template-rows 属性

`grid-template-columns` 属性设置列宽

`grid-template-rows` 属性设置行高

###### **固定的列宽和行高**

```css
.wrapper {
  display: grid;
  /*  声明了三列，宽度分别为 200px 100px 200px */
  grid-template-columns: 200px 100px 200px;
  /*  声明了两行，行高分别为 50px 50px  */
  grid-template-rows: 50px 50px;
}
```

###### **repeat() 函数**

可以简化重复的值。该函数接受两个参数，第一个参数是重复的次数，第二个参数是所要重复的值。

`  grid-template-rows: repeat(2, 50px);`



###### **auto-fill 关键字**

表示自动填充，让一行（或者一列）中尽可能的容纳更多的单元格

```css
.wrapper-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);/*表示列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素*/
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-2v5OiX.webp)





###### auto-fit 关键字

如果网格元素不够填满所有网格轨道，auto-fill就会导致一些空的网格轨道。如果不希望出现空的网格轨道，可以使用auto-fit关键字代替auto-fill。它会让非空的网格轨道扩展，填满可用空间。具体选择auto-fill还是auto-fit取决于你是想要确保网格轨道的大小，还是希望整个网格容器都被填满。



###### **fr 关键字**

`Grid` 布局还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。`fr` 单位代表网格容器中可用空间的一等份。

```css
.wrapper-3 {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;/*表示第一个列宽设置为 200px，后面剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3*/
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-MdQpe3.webp)



###### **minmax() 函数**

我们有时候想给网格元素一个最小和最大的尺寸，`minmax()` 函数产生一个长度范围，表示长度就在这个范围之中都可以应用到网格项目中。它接受两个参数，分别为最小值和最大值。

```css
.wrapper-4 {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(300px, 2fr);/*第三个列宽最少也是要 300px，但是最大不能大于第一第二列宽的两倍*/
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-4Fn0Y6.webp)



###### **auto 关键字**

由浏览器决定长度(比如span标签就会根据内容来定宽度)。通过 `auto` 关键字，我们可以轻易实现三列或者两列布局

```css
.wrapper-5 {
  display: grid;
  grid-template-columns: 100px auto 100px;/*表示第一第三列为 100px，中间由浏览器决定长度*/
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```



###### 命名网格线

声明网格轨道时，可以在中括号内写上网格线的名称：

```css
grid-template-columns: [left-start] 2fr [left-end right-start] 1fr [right-end]; #在同一个中括号内可以给同一个网格线提供多个名称
```

将网格线命名为left-start和left-end，就定义了一个叫作left的区域，这个区域覆盖两个网格线之间的区域。-start和-end后缀作为关键字，定义了两者之间的区域。如果给元素设置grid-column: left，它就会跨越从left-start到left-end的区域。

重复使用同一个名称也完全合法。比如每两个网格列为一组，在每组的两个网格轨道之前命名一条网格线（grid-template-columns: repeat(3, [col] 1fr 1fr)）。然后就可以借助命名的网格线将一个元素定位到第二组网格列上（grid-column: col 2 /span 2）。（span 表示一个单元格）



#####  gap 属性

`row-gap` 属性、`column-gap` 属性分别设置行间距和列间距

`gap` 属性是两者的简写形式。

`row-gap: 10px` 表示行间距是 10px，`column-gap: 20px` 表示列间距是 20px。`gap: 10px 20px` 实现的效果是一样的



##### grid-template-areas 属性和grid-area

`grid-template-areas` 属性用于定义区域，一个区域由一个或者多个单元格组成。grid-template-areas属性使用了一种ASCII art的语法，可以直接在CSS中画一个可视化的网格形象。该声明给出了一系列加引号字符串，每一个字符串代表网格的一行，字符串内用空格区分每一列。

这个属性跟网格元素的 `grid-area` 一起使用

 `grid-area` 属性指定项目放在哪一个区域

```css
.wrapper {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 120px  120px  120px;
  /*划分出 6 个单元格 */
  grid-template-areas:
    ". header  header"  /* `.` 符号代表空的单元格，也就是没有用到该单元格。*/
    "sidebar content content";/*有两列都叫content，也就是说放到content中的项目会直接占满这两列*/
  background-color: #fff;
  color: #444;
}
```

```css
.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.header {
  grid-area: header;
}
```

以上代码表示将类 `.sidebar` `.content`  `.header`所在的元素放在上面  `grid-template-areas` 中定义的 `sidebar`  `content` `header` 区域中

每个命名的网格区域必须组成一个矩形。不能创造更复杂的形状，比如L或者U型。



##### grid-auto-flow 属性

###### 介绍

`grid-auto-flow`  属性控制着自动布局算法怎样运作，精确指定在网格中被自动布局的元素怎样排列。默认的放置顺序是"先行后列"，即先填满第一行，再开始放入第二行，即下图英文数字的顺序 `one`,`two`,`three`...。这个顺序由 `grid-auto-flow` 属性决定，默认值是 `row`。

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-bEQt8m.webp)



###### `grid-auto-flow: row dense`

细心的同学可能发现了一个问题，就是第五个项目和第六个项目之间有个空白（如下图所示），这个是由于第六块的长度大于了空白处的长度，被挤到了下一行导致的。在实际应用中，我们可能想让下面长度合适的填满这个空白，这个时候可以设置  `grid-auto-flow: row dense`，表示尽可能填满表格。代码以及效果如下所示：

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-lAVx9a.webp)



```
.wrapper-2 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-auto-flow: row dense;
  grid-gap: 5px;
  grid-auto-rows: 50px;
}
```

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-CDNHX1.webp)



###### `grid-auto-flow: column`

可以设置 `grid-auto-flow: column`，表示先列后行，代码以及效果如下图所示：

```css
.wrapper-1 {
  display: grid;
  grid-auto-columns: 100px;
  grid-auto-flow: column;
  grid-gap: 5px;
  grid-template-rows:  50px 50px;
}
```

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-2p86op.webp)





##### grid-auto-columns 属性和 grid-auto-rows 属性

显式网格是指 你在 `grid-template-columns` 和 `grid-template-rows` 属性中定义的行和列。

隐式网格是指 如果你在网格定义之外又放了一些东西，或者因为内容的数量而需要的更多网格轨道的时候，网格将会在隐式网格中创建行和列，那么它的行高和列宽可以根据 `grid-auto-columns` 属性和 `grid-auto-rows` 属性设置。它们的写法和`grid-template-columns` 和 `grid-template-rows` 完全相同。如果不指定这两个属性，隐式网格轨道默认大小为auto，也就是它们会扩展到能容纳网格元素内容。在指定网格线的时候，隐式网格轨道不会改变负数的含义。负的网格线编号仍然是从显式网格的右下开始的。

```css
.wrapper {
  display: grid;
  grid-template-columns: 200px 100px;
/*  只设置了两行，但实际的数量会超出两行，超出的行高会以 grid-auto-rows 算 */
  grid-template-rows: 100px 100px;
  grid-gap: 10px 20px;
  grid-auto-rows: 50px;
}
```



![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-LwfKrT.webp)





##### justify-items 属性、align-items 属性以及 place-items 属性

`justify-items` 属性设置单元格内容的水平位置（左中右），`align-items` 属性设置单元格的垂直位置（上中下）

下面以 justify-items 属性为例进行讲解，align-items 属性同理，只是方向为垂直方向。它们都有如下属性：

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;
}
```

其代码实现以及效果如下：

```css
.wrapper, .wrapper-1, .wrapper-2, .wrapper-3 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-items: start;
}
.wrapper-1 {
  justify-items: end;
}
.wrapper-2 {
  justify-items: center;
}
.wrapper-3 {
  justify-items: stretch;
}
```

- start：对齐单元格的起始边缘

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-e0guMG.webp)



- end：对齐单元格的结束边缘

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-3DNa6a.webp)



- center：单元格内部居中

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-F9wed8.webp)



- stretch：拉伸，占满单元格的整个宽度（默认值）

![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-gfNRtx.webp)



##### justify-content 属性、align-content 属性以及 place-content 属性

指定了网格轨道在剩余空间内如何分布。

`justify-content` 属性是整个内容区域在容器里面的水平位置（左中右），`align-content` 属性是整个内容区域的垂直位置（上中下）。它们都有如下的属性值。

```css
.container {
  justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```

下面以 `justify-content` 属性为例进行讲解，`align-content` 属性同理，只是方向为垂直方向

- start - 对齐容器的起始边框
- end - 对齐容器的结束边框
- center - 容器内部居中

```css
.wrapper, .wrapper-1, .wrapper-2, .wrapper-3, .wrapper-4, .wrapper-5, .wrapper-6 {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-gap: 5px;
  grid-auto-rows: 50px;
  justify-content: start;
}
.wrapper-1 {
  justify-content: end;
}
.wrapper-2 {
  justify-content: center;
}
```



![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-TfEEeM.webp)



- space-around -
- space-between 
- space-evenly 
- stretch

```css
.wrapper-3 {
  justify-content: space-around;
}
.wrapper-4 {
  justify-content: space-between;
}
.wrapper-5 {
  justify-content: space-evenly;
}
.wrapper-6 {
  justify-content: stretch;
}
```



![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-xH0yHD.webp)







##### subgrid（子网格）

所有的网格元素必须是网格容器的直接子节点。因此，不能将深层嵌套的元素在网格上对齐。可以给网格元素加上display: grid，在外层网格里创建一个内部网格，但是内部网格的元素不一定会跟外层网格的轨道对齐。可以使用子网格（subgrid）来解决这个问题。通过给一个网格元素设置display:subgrid，将其变成自己的内部网格容器，网格轨道跟外部网格的轨道对齐。

subgrid 解决 grid 嵌套 grid 时，子网格的位置、轨迹线不能完全对齐到父网格的问题。只要在子网格样式做如下定义：

```css
.sub-grid {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```











#### 项目属性

##### grid-column和grid-row

可以指定网格项目所在的四个边框分别定位在哪根网格线，从而==指定项目的位置==。如果想要一个网格元素在垂直方向上跨越1号网格线到3号网格线，就需要给元素设置grid-column: 1 / 3。或者设置grid-row: 3 / 5让元素在水平方向上跨越3号网格线到5号网格线。这两个属性一起就能指定一个元素应该放置的网格区域。如果只用了span关键字（表示一个单元格），而没有明确地将任何一个网格元素放到某个网格轨道上，这样布局算法就会将网格元素放到它觉得合适的地方。

浏览器给网格里的每个网格线都赋予了编号，网格线编号从左上角为1开始递增，负数则指向从右下角开始的位置。

- grid-column-start 属性：左边框所在的垂直网格线
- grid-column-end 属性：右边框所在的垂直网格线
- grid-row-start 属性：上边框所在的水平网格线
- grid-row-end 属性：下边框所在的水平网格线

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column-start: 1;
  grid-column-end: 2;
  background: #19CAAD;
}
.two { 
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 2;
  /*   如果有重叠，就使用 z-index */
  z-index: 1;
  background: #8CC7B5;
}
.three {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 4;
  background: #D1BA74;
}
.four {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #BEE7E9;
}
.five {
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 5;
  background: #E6CEAC;
}
.six {
  grid-column: 3;
  grid-row: 4;
  background: #ECAD9E;
}
```

上面代码中，类 `.two` 所在的网格项目，垂直网格线是从 2 到 4，水平网格线是从 1 到 2。其中它跟 `.three` （垂直网格线是从3 到 4，水平网格线是从 1 到 4） 是有冲突的。可以设置 `z-index` 去决定它们的层级关系

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-WsKoXn.webp)





##### grid-area 属性

`grid-area` 属性指定项目放在哪一个区域，在上面介绍 `grid-template-areas` 的时候已讲



##### justify-self 属性、align-self 属性以及 place-self 属性

`justify-self` 属性设置单元格内容的水平位置（左中右），跟 `justify-items` 属性的用法完全一致，但只作用于单个项目

`align-self` 属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，但只作用于单个项目

两者很相像，这里只拿 `justify-self` 属性演示，`align-self` 属性同理，只是作用于垂直方向。

`place-self` 是设置 `align-self` 和 `justify-self` 的简写形式

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}

.item {
  justify-self: start;
}
.item-1 {
  justify-self: end;
}
.item-2 {
  justify-self: center;
}
.item-3 {
  justify-self: stretch;
}
```

- start：对齐单元格的起始边缘



![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-9Lsu9R.webp)



- end：对齐单元格的结束边缘



![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-SYl73T.webp)



- center：单元格内部居中

  ![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-3s9If2.webp)

  

- stretch：拉伸，占满单元格的整个宽度（默认值）

  ![image](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-9SDOEx.webp)



#### 各种示例

[点开此网站查看](https://gridbyexample.com/)





## 实践

### 多栏布局

#### 两栏布局的实现

- 利用calc

  ```css
  .left{
    	 float: left;
       width: 100px;
       height: 200px;
       background: blue;
  }
   .right{
       float: right;
   		 width:calc(100%-200px)
       height: 200px;
   		 background-color: red;
   }
  ```

  



- 利用浮动，左侧元素设置固定大小，并左浮动，右侧元素设置overflow: hidden; 这样右边就触发了BFC，BFC的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠。

  ```css
  .left{
       width: 100px;
       height: 200px;
       background: red;
       float: left;
   }
   .right{
       height: 200px;
       background: blue;
       overflow: hidden;
   }
  ```

- 利用flex布局，将左边元素设置为固定宽度200px，将右边的元素设置为flex:1。

  ```css
  .outer {
    display: flex;
    height: 100px;
  }
  .left {
    width: 200px;
    background: tomato;
  }
  .right {
    flex: 1;
    background: gold;
  }
  
  ```

- 利用绝对定位

  ```css
  .outer {
    position: relative;
    height: 100px;
  }
  .left {
    width: 200px;
    background: tomato;
  }
  .right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 200px;
    background: gold;
  }
  
  ```

  

#### 三栏布局的实现

- 利用浮动，左右两栏设置固定大小，并设置对应方向的浮动。中间一栏设置左右两个方向的margin值，**注意在html里中间一栏必须放到最后**，确保中间一栏最后渲染，不然会有问题

  ```html
    <style>
      .outer {}
  
      .left {
        float: left;
        width: 100px;
        height: 100px;
        background: tomato;
      }
  
      .right {
        float: right;
        width: 200px;
        height: 100px;
        background: gold;
      }
  
      .center {
        height: 100px;
        margin-left: 100px;
        margin-right: 200px;
        background: lightgreen;
      }
    </style>
  </head>
  <body>
    <div class="outer"> 
      <div class="left">this are apple banana lusa</div>
      <div class="right">this are apple banana lusa</div>
      <div class="center">this are apple banana lusa</div>
    </div>
  </body>
  ```

  

- 利用**绝对定位**，左右两栏设置为绝对定位，中间设置对应方向大小的margin的值。

  ```css
  .outer {
    position: relative;
  }
  
  .left {
    position: absolute;
    width: 100px;
    height: 100px;
    background: tomato;
  }
  
  .right {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 100px;
    background: gold;
  }
  
  .center {
    margin-left: 100px;
    margin-right: 200px;
    height: 100px;
    background: lightgreen;
  }
  ```

- 利用flex布局，左右两栏设置固定大小，中间一栏设置为flex:1

  ```css
  .outer {
    display: flex;
  }
  
  .left {
    width: 100px;
    background: tomato;
  }
  
  .right {
    width: 100px;
    background: gold;
  }
  
  .center {
    flex: 1;
    background: lightgreen;
  }
  ```








### 居中

#### 水平居中

如果它是一个行内元素，就对它的父元素应用 text-align: center；如果它是一个块级元素，就对它自身应用 margin: auto。

- 行内元素: `text-align: center` *是个容器属性，使其内部的行内元素和文本居中*
- 块级元素: `margin: 0 auto` （margin的auto属性的作用是用来分配剩余空间，所以对于有剩余空间的元素才有效哦（块及元素）。比如图片设置margin: 0 auto是无效的，因为图片是内联元素，不是占一整行，没有剩余空间）**注意width宽度一定要设置，没有宽度的块默认就是100%，就没有auto值了。**
- `absolute + transform`
- `flex + justify-content: center`

垂直居中

- `line-height: height`
- `absolute + transform`
- `flex + align-items: center`
- `table`

水平垂直居中

- `absolute + transform`
- `flex + justify-content + align-items`



#### 垂直居中

垂直居中指南

做出判断前，先逐个询问自己以下几个问题，直到找到合适的解决办法。

❑ 可以用一个自然高度的容器吗？给容器加上相等的上下内边距让内容居中。如果是固定高度的容器，则你上下内边距要设置的恰到好处才会使子元素垂直居中。

❑ 容器需要指定高度或者避免使用内边距吗？对容器使用display: table-cell和vertical-align: middle。（vertical-align声明只会影响行内元素或者table-cell元素。）

❑ 可以用Flexbox吗？ 如果不需要支持IE9，可以用Flexbox居中内容。

❑ 容器里面的内容只有一行文字吗？设置一个大的行高，让它等于理想的容器高度。这样会让容器高度扩展到能够容纳行高。如果内容不是行内元素，可以设置为inline-block。

❑ 容器和内容的高度都知道吗？将内容绝对定位。（只有当前面提到的方法都无效时才推荐这种方式。）

❑ 不知道内部元素的高度？用绝对定位结合变形（transform）。（还是只有当前面提到的方法都无效时才推荐该方法。）



#### 水平垂直居中的实现



- 利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过translate来调整元素的中心点到页面的中心。该方法需要**考虑浏览器兼容问题。**

  ```css
  .parent {    position: relative;}
  .child {    position: absolute;    
  						left: 50%;    
  						top: 50%;    
  						transform: translate(-50%,-50%);
    					/*如果该元素已知宽高则 可以用margin来调整元素的中心点到页面中心：例如已知child的width为200px，heigth为300px，则可以margin: -150px 0 0 -100px;*/
  }
  ```

- 利用绝对定位，设置四个方向的值都为0，并将margin设置为auto。该方法适用于**盒子有宽高**的情况：

  ```css
  .parent {
      position: relative;
  }
   
  .child {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto; /*设了绝对定位之后用auto就会水平垂直居中*/
  }
  ```

- 使用flex布局.   **考虑兼容的问题**

  ```css
  .parent {
      display: flex;
      justify-content:center;
      align-items:center;
  }
  ```

  

- 利用margin：auto和绝对定位

  div  {
                  background: #FF0000;
                  width: 200px;
                  height: 200px;
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  margin: auto;
              }

  margin: auto;  是关键，没有设置此项，也不会水平垂直居中。

  解释下原理:

  1.在普通内容流中，margin:auto的效果等同于margin-top:0;margin-bottom:0。

  2.position:absolute使绝对定位块跳出了内容流，内容流中的其余部分渲染时绝对定位部分不进行渲染。

  3.为块区域设置top: 0; left: 0; bottom: 0; right: 0;将给浏览器重新分配一个边界框，此时该块块将填充其父元素的所有可用空间，所以margin 垂直方向上有了可分配的空间。

  4.再设置margin 垂直方向上下为auto，即可实现垂直居中。（注意高度得设置）。











### 给列之间加上间隔

可以从宽度中减掉1.5em分给外边距。使用calc()从宽度中减去间距，这种方式能让代码意图更明显。

```css
div{
	width: calc(200px - 1.5em); #宽度减去1.5em分给外边距
	margin-left: 1.5em; 
}
```



### 满幅的背景和定宽的内容

```css
wrapper {
 padding: 1em calc(50% - 450px);
 background: #333;
}
```







# 响应式设计

## 布局方案

### 三大原则

1. 移动优先。这意味着在实现桌面布局之前先构建移动版的布局。

2. @media规则。使用这个样式规则，可以为不同大小的视口定制样式。有时候，甚至不需要媒体查询，自然地折行就能实现响应式的列。可以通过在Flexbox布局中使用flex-wrap: wrap并设置合适的flex-basis来实现。还可以在网格布局中使用auto-fit或者auto-fill的网格列，在折行之前就可以决定一行放几个元素。

   想让网页在一堆不同的设备上合理展示，只需要在最终产品上添加一点 CSS 媒体查询就可以了。这件事情之所以这么简单，关键在于我们的布局原本就是弹性可伸缩的。因此，优化网页在小屏幕上的表现，其实只意味着把一些外边距收拢到最小程度，然后把因为屏幕太窄而无法显示成双列的侧栏调整为单列布局而已。如果你发现自己需要一大堆媒体查询才能让设计适应大大小小的屏幕，那么不妨后退一步，重新审视你的代码结构。

3. 流式布局。这种方式允许容器根据视口宽度缩放尺寸



![image-20230504101045905](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-10-10-image-20230504101045905.png)



### 流式布局

流式布局，有时被称作液体布局（liquid layout），指的是使用的容器随视口宽度而变化。它跟固定布局相反，固定布局的列都是用px或者em单位定义。固定容器（比如，设定了width: 800px的元素）在小屏上会超出视口范围，导致需要水平滚动条，而流式容器会自动缩小以适应视口。

在流式布局中，主页面容器通常不会有明确宽度，也不会给百分比宽度，但可能会设置左右内边距，或者设置左右外边距为auto，让其与视口边缘之间产生留白。也就是说容器可能比视口略窄，但永远不会比视口宽。在主容器中，任何列都用百分比来定义宽度（比如，主列宽70%，侧边栏宽30%）。这样无论屏幕宽度是多少都能放得下主容器。用Flexbox布局也可以，设置弹性元素的flex-grow和flex-shrink（更重要），让元素能够始终填满屏幕。要习惯将容器宽度设置为百分比，而不是任何固定的值。

网页默认就是响应式的。没添加CSS的时候，块级元素不会比视口宽，行内元素会折行，从而避免出现水平滚动条。加上CSS样式后，就需要你来维护网页的响应式特性了。





### 实现REM响应式布局开发

##### 用插件

######     lib-flexible 设置REM和PX换算比例的 

   + 根据设备宽度的变化自动计算设置html.style.fontSize=设备的宽度/10+'px';

   + 比如750px的设备上设置1REM=75PX : 375px设备上 设置1REM=37.5PX

        

在项目入口`index.js`中，我们导入lib-flexible，确保在不同的设备上，可以等比例的对REM的换算比例进行缩放

```
import 'lib-flexible';
```



###### postcss-pxtorem 把PX单位，按照当时的换算比例，自动转换为REM

假设设计稿还是750px的，我们测出来多少px，我们写样式的时候，就写多少px，并且不需要手动转换为REM「我们在webpack中，针对postcss-pxtorem做配置，让插件帮我们自动转换」

 ```
      /*webpack.config.js*/ 
      const px2rem = require('postcss-pxtorem');
          const loaders = [
            {
              loader: require.resolve('postcss-loader'),
               options: {
                postcssOptions: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebook/create-react-app/issues/2677
                  ident: 'postcss',
                  config: false,
                  plugins: [
                        px2rem({
               rootValue: 75, // 基于lib-flexible,750px的设计稿就会设置为1REM=75PX；此时在webpack编译的时候，我们也需要让px2rem插件，按照1REM=75PX，把我们编写的PX样式，自动转换为REM；
               propList: ['*'] // 对所有文件中的样式都生效{包括AntdMobile组件库中的样式}
             })
                ]
                }
            }
            }
          ]
 ```


​           





######  手动设置设备宽度超过750PX后根fontSize不再变大

不直接用css的max-width是因为  lib-flexible插件会把max-width的750px转换成rem单位，所以又变成响应式的了。所以要在项目入口index.js中写入此函数：

```js
/* 处理最大宽度 */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    if (deviceW >= 750) {
      html.style.fontSize = '75px';
    }
  };
  handleMax();
})();
```









##### 自己写

步骤
       @1 找参照的比例（例如设计稿的比例 -> 一般都是750px），在这个比例下，给予html.fontSize一个初始值
        html {
          font-size: 100px;
          // 750PX的设计稿中，1REM=100PX
          // 未来我们需要把从设计稿中测量出来的尺寸（PX单位）转换为REM单位去设置样式
        }
       @2 我们需要根据当前设备的宽度，计算相对于设计稿750来讲，缩放的比例；从而让REM的转换比例，也跟着缩放「REM和PX的换算比例一改，则所有之前以REM为单位的样式也会跟着缩放」；
       @3 我们一般还会给页面设置最大宽度「750px」，超过这个宽度，不再让REM比例继续变大了；内容居中，左右两边空出来即可

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>REM练习</title>
    <!-- IMPORT CSS -->
    <link rel="stylesheet" href="src/assets/reset.min.css">
    <style>
        html {
            font-size: 100px;
        }

        html,
        body {
            height: 100%;
            background: #F4F4F4;
        }

        #root {
            margin: 0 auto;
            max-width: 750px;
            height: 100%;
            background: #FFF;
        }

        .box {
            width: 3.28rem;
            height: 1.64rem;
            line-height: 1.64rem;
            text-align: center;
            font-size: .4rem;
            background: lightblue;
        }
    </style>
    <script>
        /* 计算当前设备下，REM和PX的换算比例 */
        (function () {
            const computed = () => {
                let html = document.documentElement,
                    deviceW = html.clientWidth,
                    designW = 750;
                if (deviceW >= designW) {
                    html.style.fontSize = '100px';
                    return;
                }
                let ratio = deviceW * 100 / designW;
                html.style.fontSize = ratio + 'px';
            };
            computed();
            window.addEventListener('resize', computed);
        })();
    </script>
</head>

<body>
    <div id="root">
        <div class="box">
            珠峰培训
        </div>
    </div>
</body>

</html>
```



## viewport

![image-20230504105211576](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-10-52-image-20230504105211576.png)





## 移动端

#### 移动端布局方案

1. 百分比布局（流式布局）。 效果：宽度自适应，高度固定

2. flex。效果：宽度自适应，高度固定

3. REM + VW +媒体查询方案

   - 如果**只需要移动端页面**，可以采用所有单位为vw的方案。
   - 如果**需要在PC端访问**，则应该使用vw和rem混用的方案：字号、元素尺寸相对根字号大小变化，移动端时根字号大小随屏幕宽度等比例变化；PC端时根字号大小随屏幕高度等比例变化。

   `REM方案`的优势是可以手动控制`rem`的大小，防止屏幕太大时，页面元素也缩放很大，但是缺点就是需要使用`JS`。`VW方案`刚好相反，无需使用`JS`但是无法手动控制`vw`的大小。

   其实我们可以把两者结合。对于布局元素，我们仍然使用`rem`单位。但是对于根元素的字体大小，我们不需要使用JS来动态计算了

   ```css
   html {
     /* 750px 的设计图，1rem = 100px */
     font-size: calc(100 * 100vw / 750);
   }
   
   .box {
     /* 750px屏幕下，200px */
     width: 2rem;
   }
   ```

   用媒体查询来改变html字体的大小来影响rem。



#### 移动端图片处理

在移动端中，我们通常需要使用高清晰度的图片来适配高像素密度的设备。为了实现这个效果，我们通常会使用 2x 或者 3x 的图片来代替普通的 1x 图片。同时，我们还需要通过 CSS 来将这些高清晰度的图片缩小到正常大小。

```css
.my-element {
  background-image: url('path/to/my-image@2x.png');
  background-size 
  /*
  	可以使用CSS中的background-size属性来调整背景图片的大小。例如，将背景图片缩小50%可以使用以下代码：
		background-size: 50%;

		也可以指定具体的宽度和高度值来调整背景图片的大小。例如，将背景图片设置为宽度为200像素，高度为100像素可以使用代码：background-size: 200px 100px;

		还可以使用cover或contain关键字来自适应调整背景图片的大小。例如，使用cover关键字会保持背景图片的纵横比例并尽可能填满容器区域：background-size: cover;

		而使用contain关键字会保持背景图片的纵横比例并尽可能适应容器区域：background-size: contain;
  */
}
```






## clamp()

**`clamp()`** 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。它接收三个参数：最小值、首选值、最大值。

`clamp()` 函数接收三个用逗号分隔的表达式作为参数，按最小值、首选值、最大值的顺序排列。

当首选值比最小值要小时，则使用最小值。

当首选值介于最小值和最大值之间时，用首选值。

当首选值比最大值要大时，则使用最大值。

表达式中的每一个值都可以用不同的单位。





## 查询

### 媒体查询

##### 介绍

尽量减少断点，而且断点根据内容去选择而不是设备（因为设备是无穷的），一般就是流式布局搞不定了再去用媒体查询。

使用 @media 查询，可以针对不同的媒体类型定义不同的样式。@media 可以针对不同的屏幕尺寸设置不同的样式

媒体查询里面的规则仍然遵循常规的层叠顺序。它们可以覆盖媒体查询外部的样式规则。同理，也可能被其他样式覆盖。

在媒体查询断点中推荐<font color="red">使用em单位</font>。在各大主流浏览器中，当用户缩放页面或者改变默认的字号时，只有em单位表现一致。以px或者rem单位为断点在Safari浏览器里不太可靠。同时当用户默认字号改变的时候，em还能相应地缩放，因此它更适合当断点。在媒体查询里更适合用em, em是基于浏览器默认字号的（通常是16px）。



##### 用法

###### 放在`<link>`标签中

媒体查询还可以放在`<link>`标签中。在网页里加入`<link rel="stylesheet"media="(min-width: 45em)" href="large-screen.css" />`，只有当min-width媒体查询条件满足的时候才会将large-screen.css文件的样式应用到页面。然而不管视口宽度如何，样式表都会被下载。这种方式只是为了更好地组织代码，并不会节省网络流量。

```html
<!-- link元素中的CSS媒体查询 --> 
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" /> 
```







###### 移动优先的开发方式

移动优先的开发方式意味着最常用的媒体查询类型应该是min-width。在任何媒体查询之前，最先写的是移动端样式，然后设置越来越大的断点。整体结构如下：

```css
.title {
	...
}
@media (min-width: 35em) {
	.title {
		...
	}
}

@media (min-width: 50em) {
	.title {
		...
	}
}
```

有时候移动端的样式可能很复杂，在较大的断点里面需要花费较大篇幅去覆盖样式。此时需要将这些样式放在max-width媒体查询中，这样就只对较小的断点生效，但是用太多的max-width媒体查询也很有可能是没有遵循移动优先原则所致。max-width是用来排除某些规则的方式，而不是一个常规手段。



###### 确保每个媒体查询都位于它要覆盖的样式之后

总是确保每个媒体查询都位于它要覆盖的样式之后，这样媒体查询内的样式就会有更高的优先级。

```css
.page {
	...
}
@media (min-width: 35em) {
	.page {
		...
	}
}

.hero {
	...
}
@media (min-width: 35em) {
	.hero {
		...
	}
}

main {
	...
}
@media (min-width: 35em) {
	main {
		...
	}
}
```







###### 判断不同的像素密度选择不同的图片

```css
my-image { background: (low.png); }
@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image { background: (high.png); }
}
```

###### 只需要满足多个条件之一则用逗号分隔

```css
@media (max-width: 20em), (min-width: 35em) { ... }
```





##### 媒体类型

常见的两种媒体类型是screen和print。使用print媒体查询可以控制打印时的网页布局，这样就能在打印时去掉背景图（节省墨水），隐藏不必要的导航栏等。

大多数情况下，需要将基础打印样式放在@media print {...}媒体查询内。可以将整体的字体颜色设置成黑色，去掉文字后面的背景图片和背景色。

```css
@media print {
	* {
		color: black !important;
		background: none !important;
	}
}
```







### @container（容器查询）

@container 使元素可以响应某个特定容器大小。在 @container 出来之前，我们只能用 @media 响应设备整体的大小，而 @container 可以将相应局限在某个 DOM 容器内：

```css
// 将 .container 容器的 container-name 设置为 abc
.container {
  container-name: abc;
}
// 根据 abc 容器大小做出响应
@container abc (max-width: 200px) {
  .text {
    font-size: 14px;
  }
}
```

一个使用场景是：元素在不同的 `.container` 元素内的样式可以是不同的，取决于当前所在 `.container` 的样式。









## 响应式图片

不仅要让图片适应屏幕，还要考虑移动端用户的带宽限制。图片通常是网页上最大的资源。首先要保证图片充分压缩。在图片编辑器中选择“Save for Web”选项能够极大地减小图片体积，或者用别的图片压缩工具压缩图片，比如tinypng网站。还要避免不必要的高分辨率图片，而是否必要则取决于视口大小。也没有必要为小屏幕提供大图，因为大图最终会被缩小。

图片作为流式布局的一部分，请始终确保它不会超过容器的宽度。为了避免这种情况发生，一劳永逸的办法是在样式表加入规则img { max-width:100%; }。



##### 不同视口大小使用不同的图片

媒体查询能够解决用CSS加载不同图片的问题

```css
.hero{
	background-image: url(coffee-small.jpg);
}
@media (min-width: 35em) {
	.hero {
		background-image: url(coffee-medium.jpg);
	}
}
@media (min-width: 50em) {
	.hero {
		background-image: url(coffee.jpg); /*提供完整分辨率的图片*/
	}
}
```



##### 使用srcset提供对应的图片

srcset属性（“source set”的缩写）解决`<img>`标签加载不同图片的问题。它可以为一个`<img>`标签指定不同的图片URL，并指定相应的分辨率。浏览器会根据自身需要决定加载哪一个图片。现在大多数浏览器支持srcset。不支持的浏览器会根据src属性加载相应的URL。





## 一些小功能

### 使列数自动根据盒子宽度决定

- 当图片（或其他元素）以行列式进行布局时，让视口的宽度来决定列的数量。弹性盒布局（即 Flexbox）或者 display: inline-block

加上常规的文本折行行为，都可以实现这一点。 

- 使 用 多 列 文 本 时， 指 定 column-width（ 列 宽 ） 而 不 是 指 定column-count（列数），这样它就可以在较小的屏幕上自动显示为单列布局。













# 文本内容属性



### 字体

在页面中引入其他字体并使用可看《深入解析CSS》第十三章 13.2



#### FOUT和FOIT

##### 介绍

在处理字体前，需要先考虑一下性能，因为字体文件很大。浏览器中经常会遇到这种情况，页面的内容和布局就要开始渲染了，字体却还在下载中。开始时，大多数的浏览器供应商为了尽可能快地渲染页面，使用了可用的系统字体。然后，一小段时间过去了，Web字体加载完成，页面会使用Web字体重新渲染一次。比起系统字体，Web字体很可能会在屏幕上占据不一样的空间。第二次渲染时，页面布局变了，文字突然跳动了。

这就会导致以下两个问题其中之一：

FOUT，即无样式文本闪动（Flash of Unstyled Text）。

FOIT，即不可见文本闪动（Flash of Invisible Text）。浏览器把文本渲染成不可见的，因此文字依然会占据页面的空间。通过这种方式，页面的容器元素得以实现，用户就可以看到页面正在加载。背景颜色和边框都显示出来了，但是文字在第二次渲染的时候才显示，即Web字体加载之后。

一般来说，网速快时FOIT更容易接受一些，但网速慢时应该倾向于FOUT，根据实际情况来判断。



##### 解决办法

font-display属性

在@font-face规则内部使用，用来指定浏览器应该如何处理Web字体加载。

这个属性同时也支持以下几个值：

❑ auto——默认行为（在大多数浏览器中是FOIT）。

❑ swap——显示回退字体，在Web字体准备好之后进行交换（FOUT）。

❑ fallback——介于auto和swap之间。文本会保持较短时间（100ms）的隐藏状态，如果这时候Web字体还没有准备好，就显示回退字体。接下来一旦Web字体加载完成，就会显示Web字体。

❑ optional——类似于fallback，但是允许浏览器基于网速判断是否显示Web字体。这就意味着在较慢的连接条件下Web字体可能不会显示。

对于高网速，fallback表现最好，会出现短暂的FOIT，但如果Web字体加载超过了100ms就会产生FOUT。对于低网速，swap更好一些，可以立刻渲染回退字体。如果Web字体对于整体设计来讲并非必不可少的时候，就可以使用optional。



#### 引入字体

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:300|Sansita:800" rel="stylesheet">
```

引入的样式表其实就是写了很多@font-face，不信你打开上面写的那个链接看看



##### @font-face

![image-20221023210553867](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023210553867.png)

@font-face规则定义了浏览器字体，以便在页面的CSS中使用。这里的第一条规则实际上是说，“如果页面需要渲染font-family为Roboto的拉丁字符，这些字符使用了正常的字体样式（非斜体）并且字重为300，那么就使用这个字体文件”。第二条规则类似，定义了一个粗体版本（字重为800）的Sansita字体。font-family设置了引用字体的名称，可以在样式表的其他地方使用。src：提供了一个逗号分隔的浏览器可以搜索的地址列表，以local(Roboto Light)和local(Roboto-Light)开头的话，如果用户的操作系统中恰好安装了名为Roboto Light或者Roboto-Light的字体，就使用这些字体。否则就使用url()来下载指定的字体文件。



#### woff格式

WOFF是指Web开放字体格式，这是一种专为网络使用而设计的压缩字体格式。所有的现代浏览器都支持WOFF，但不是所有的都支持WOFF2（WOFF2格式有更好的压缩效果，因此文件更小）。优雅降级：

```css
@font-face {
	font-family: "Roboto";
	font-style: normal;
	font-weight: 300;
	src: local("Roboto Light"),local("Roboto-Light"),
				url(...) format('woff2'),
				url(...) format('woff');
}
```



#### COLRv1 Fonts

COLRv1 Fonts 是一种自定义颜色与样式的矢量字体方案，浏览器支持了这个功能，用法如下：

```
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);

@font-palette-values --colorized {
  font-family: "Bungee Spice";
  base-palette: 0;
  override-colors: 0 hotpink, 1 cyan, 2 white;
}

.spicy {
  font-family: "Bungee Spice";
  font-palette: --colorized;
}
```

上面的例子我们引入了矢量图字体文件，并通过 `@font-palette-values --colorized` 自定义了一个叫做 `colorized` 的调色板，这个调色板通过 `base-palette: 0` 定义了其继承第一个内置的调色板。

使用上除了 `font-family` 外，还需要定义 `font-palette` 指定使用哪个调色板，比如上面定义的 `--colorized`。



#### 字体原理

##### 一款字体首先会定义一个[em-square](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttp%3A%2F%2Fdesignwithfontforge.com%2Fzh-CN%2FThe_EM_Square.html)

它是用来盛放字符的金属容器。这个 `em-square` 一般被设定为宽高均为 `1000` 相对单位，不过也可以是 `1024、2048` 相对单位。你可以理解为字体的模板（字模），如下图所示：

![image-20230710165705190](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-16-57-image-20230710165705190.png)



##### 5条度量线

每个字体会定义5条度量线来控制字符的位置。

这些度量的刻度是基于`1000`这个相对单位（不同字体相对单位可能不一样）来设置的，如下图所示：

![image-20230710155501870](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-15-55-image-20230710155501870.png)

- **Baseline：** 就是我们常说的基线，所有字母放置的水平线。它是文本中一条稳定的轴线，是校准文本与图片，文本与文本的一条重要的参考线。其他度量线都是相对基线来计算的。
- **X-Height：** 是主要的小写字母高度（或者说是“x”字母的高度），除去上延和下延部分
- **Cap Height：** `Cap`是`capital`（大写字母）的简称，有时也用`capital height`全称，是指H或E等直线型大写字母从基线到字母顶部的高度（大写字母高度）。而H或E等顶部这条对齐线叫作都大写线（`cap line`）
- **Ascender：** 升部线，某些小写字母（例如`h、l`）会有一个升部（也叫上延），高度超出`x-height`，这是升部的对齐线
- **Descender：** 降部线，某些小写字母（例如`p、y`）会有一个降部（也叫下延），沿基线往下延长的部分，这是降部的对齐线

<strong style="color: red">`Ascender` 与 `Descender`之差决定了字体 content-area高度。</strong>

<strong style="color: red">在浏览器中，上面的 `1000` 相对单位会按照你需要的 `font-size` 缩放。</strong>



##### [FontForge](https://link.juejin.cn/?target=https%3A%2F%2Ffontforge.org%2Fen-US%2Fdownloads%2F)软件看字体度量信息

![image-20230710160422461](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-16-04-image-20230710160422461.png)

<strong style="color:red">`Units Per Em`（就是上文讲到的`em-square`）表示一个字的高度有`1000`个单位，`baseline`的坐标为`0`，其它线的坐标相对于`baseline`</strong>，如下图所示：

![image-20230710160519474](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-16-05-image-20230710160519474.png)

![image-20230710160807630](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-10-16-08-image-20230710160807630.png)







#### font-size

##### 简介

1. `fontsize` 的值不代表字体高度，也不代表的字体内容（`content-area`）高度
2. 字体内容（`content-area`）高度 与 `font-size` 和 `font-family` 相关

(这两条结论可观看上方字体原理)



如果设置父元素font-size：0，那么基线和中线就会重叠。详情看mdn vertical-align 属性





##### `font-size` 属性可以影响以下 CSS 属性的值

1. **line-height（行高）：** `line-height` 可以受到 `font-size` 的影响。如果没有显式指定 `line-height` 的值，浏览器会根据 `font-size` 的计算值自动设置默认的行高。通常情况下，`line-height` 的默认值是相对于 `font-size` 的倍数。
2. **padding（内边距）和 margin（外边距）：** 如果使用相对单位（如百分比）来定义 `padding` 或 `margin` 的值，并且该属性应用于包含 `font-size` 的父元素，则它们的计算值会相对于父元素的 `font-size`。
3. **border（边框）：** 在某些情况下，边框的大小（`border-width`）可能与 `font-size` 相关联。具体而言，某些 CSS 伪元素（如 `::before` 和 `::after`）的边框大小可能会受到 `font-size` 的影响。
4. **height（高度）和 width（宽度）：** 当使用相对单位（如百分比）来定义元素的 `height` 或 `width` 时，并且该属性受到包含元素的 `font-size` 影响时，它们的计算值将相对于包含元素的 `font-size`。





#### font-weight

安卓手机字体只有bold（700）和normal（400），500和600都会变成bold。

ios可以设置400 - 700







### 设置小于12px的字体

在谷歌下css设置字体大小为12px及以下时，显示都是一样大小，都是默认12px。

当然你可以通过开发者工具去设置显示1px字体。

![image-20230608155214675](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-06-08-15-52-image-20230608155214675.png)

**解决办法：**

- 使用css3的transform缩放属性-webkit-transform:scale(0.5); 注意-webkit-transform:scale(0.75);收缩的是整个元素的大小，这时候，如果是内联元素，<strong style="color: red">必须要将内联元素转换成块元素</strong>，可以使用display：block/inline-block/...；
- 使用图片：如果是内容固定不变情况下，使用将小于12px文字内容切出做图片，这样不影响兼容也不影响美观。





### 文字换行

####          强制换行

纯数字或者纯字母时，该字符被认为是一个字符，因此不会自动换行，如果父容器的宽度不够，便会超出父容器的限制。
           解决方案： 设置自动换行

                          a、 word-break   规定非中日韩文字的换行规则
                                
                            word-break: normal  只在允许的断字点换行（浏览器保持默认处理）。
                            word-break: break-all / break-word 允许在长字符内换行
                            word-break: keep-all 只能在半角空格或连字符处换行 


​    
​                            a、 word-wrap  属性规定自动换行的处理方法 
​                                              
​                        word-wrap: normal  只在允许的断字点换行（浏览器保持默认处理）。
​                         word-wrap : break-word   允许在长字符内换行



####  强制不换行

文本不是很长的字符串时，在到边界值时中日韩文字会自动换行，只需要一行显示时可以让其强制不换行。

 解决方案：设置 white-space：nowrap

#### 文本溢出

​          文本溢出处理属性为  text-overflow

          text-overflow：clip   只是在边界值截断文本隐藏
          text-overflow：ellipsis  超出边界的文本用“...”代替
    
            单行显示溢出部分用“...”代替，如果文本的容器是行级元素，如span 、i 等需要将其设置为块级元素，再设置容器宽度、强制文本不换行、容器隐藏属性            
    
     span{
           display: block;
           width: 100%;
           white-space: nowrap;  /* 强制不换行 */
           overflow: hidden;
           text-overflow: ellipsis;
         }
         
         如果需要两个span同时溢出时“...”，并且显示在同一行不妨设置 display：inline-block; width:49%;      


### letter-spacing



### text-transform





### 文本颜色

[`color`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)设置元素的文本或装饰的颜色。



### 文本缩进

```css
     p{
       text-indent: 2em; /*段落缩进两个字的大小*/
     }
```



### 单行、多行文本溢出隐藏

- 单行文本溢出

```css
overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;      // 溢出用省略号显示
white-space: nowrap;         // 规定段落中的文本不进行换行
```

- 多行文本溢出

  ```css
  overflow: hidden;            // 溢出隐藏
  text-overflow: ellipsis;     // 溢出用省略号显示
  display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
  -webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
  -webkit-line-clamp:3;        // 显示的行数
  /*由于上面的三个属性都是 CSS3 的属性,兼容性可能有问题，所以在前面加一个`-webkit-` 来兼容一部分浏览器。*/
  ```

```css
/*	兼容性好一点的方案；*/
div{
  width: 300px;
  position: relative;
  line-height: 1.4em;
  height: 4.2em;
  overflow: hidden;
}
div::after{
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
}

/*兼容性*/
p{position: relative; line-height: 20px; max-height: 40px;overflow: hidden;}
p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);
}

```

JS 实现方式：

- 使用split + 正则表达式将单词与单个文字切割出来存入words
- 加上 '...'
- 判断scrollHeight与clientHeight，超出的话就从words中pop一个出来



### 解决数字不等宽问题

对于数字来说，每个数字的宽度都不一定是相等的。比如说对于 1 和 2 来说，从 1 变成 2 的时候宽度一定会发生变化。如果此时周围有元素的话，就会造成元素位置的偏移。

我们以分页器为例，当页码发生变化的时候，不等宽的数字会造成左侧箭头的位置偏移，大家可以从下图中看到示例：

![图片](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-X5SQMU.gif)

当遇到这种情况时，我们可以通过 font-variant-numeric 属性来实现数字的等宽。

> `font-variant-numeric` CSS 属性控制数字，分数和序号标记的替代字形的使用。`tabular-nums` 启用表格数字显示。使数字等宽，易于像表格那样对齐。等同于 OpenType 特性 tnum。

除了这个属性之外，我们也可以通过 `font-feature-settings: "tnum"` 来实现相同的功能。这个属性的兼容性会更好点。





# 装饰属性

## 颜色

### 设置各种元素的颜色

#### accent-color

accent-color 主要对单选、多选、进度条这些原生输入组件生效，控制的是它们的主题色：

```
body {
  accent-color: red;
}
```

比如这样设置之后，单选与多选的背景色会随之变化，进度条表示进度的横向条与圆心颜色也会随之变化。



#### currentColor 

currentColor 本身就是很多 CSS 颜色属性的初始值，比如border-color 和 outline-color，以及 text-shadow 和 box-shadow 的颜

色值等等

举个例子，假设我们想让所有的水平分割线（所有` <hr>` 元素）自动与文本的颜色保持一致：

```
hr{
	height: .5em;
	background: currentColor;
}
```







### 颜色的取值

#### hwb

支持 hwb（hue, whiteness, blackness） 定义颜色：

```
.text {
  color: hwb(30deg 0% 20%);
}
```

三个参数分别表示：角度 [0-360]，混入白色比例、混入黑色比例。角度对应在色盘不同角度的位置，每个角度都有属于自己的颜色值，这个函数非常适合直观的从色盘某个位置取色。

#### lch, oklch, lab, oklab, display-p3 等

`lch(lightness, chroma, hue)`，即亮度、饱和度和色相，语法如：

```
.text {
  color: lch(50%, 100, 100deg);
}
```

chroma(饱和度) 指颜色的鲜艳程度，越高色彩越鲜艳，越低色彩越暗淡。hue(色相) 指色板对应角度的颜色值。

`oklch(lightness, chroma, hue, alpha)`，即亮度、饱和度、色相和透明度。

```
.text {
  color: oklch(59.69% 0.156 49.77 / 0.5);
}
```

更多的就不一一枚举说明了，总之就是颜色表达方式多种多样，他们之间也可以互相转换。

#### color-mix()

css 语法支持的 mix，类似 sass 的 `mix()` 函数功能：

```
.text {
  color: color-mix(in srgb, #34c9eb 10%, white);
}
```

第一个参数是颜色类型，比如 hwb、lch、lab、srgb 等，第二个参数就是要基准颜色与百分比，第三个参数是要混入的颜色。

#### color-contrast()

让浏览器自动在不同背景下调整可访问颜色。换句话说，就是背景过深时自动用白色文字，背景过浅时自动用黑色文字：

```
.text {
  color: color-contrast(black);
}
```

还支持更多参数，详情见 Manage Accessible Design System Themes With CSS Color-Contrast()。

#### 相对颜色语法

可以根据语法类型，基于某个语法将某个值进行一定程度的变化：

```
.text {
  color: hsl(from var(--color) h s calc(l - 20%));
}
```

如上面的例子，我们将 `--color` 这个变量在 hsl 颜色模式下，将其 l(lightness) 亮度降低 20%。





### 渐变

#### 介绍

- 线性渐变（linear-gradient和repeating-linear-gradient）和径向渐变（radial-gradient和repeating-radial-gradient）
- 渐变是一种由代码生成的图像，我们能像对待其他任何背景图像那样对待它。
- 如果某个色标的位置值比整个列表中在它之前的色标的位置值都要小，则该色标的位置值会被设置为它前面所有色标位置值的最大值。
- 例如`background: linear-gradient(#fb3 20%, #58a 80%);`容器顶部的 20% 区域被填充为 \#fb3 实色，而底部 20% 区域被填充为 #58a 实色。真正的渐变只出现在容器 60% 的高度区域。如果`background: linear-gradient(#fb3 50%, #58a 50%);`则没有任何渐变效果了，只有两块实色各占据了 background-image 一半的面积。“如果多个色标具有相同的位置，它们会产生一个无限小的过渡区域，过渡的起止色分别是第一个和最后一个指定值。从效果上看，颜色会在那个位置突然变化，而不是一个平滑的渐变过程。”——CSS 图像（第三版）（http://w3.org/TR/css3-images）。



#### 用途

 

CSS 渐变创建任何种类的几何图案几乎都是可能的，只不过有时这种方法不太实际。



## 背景

### 介绍

- 默认情况下，<strong style="color: red;">背景会延伸到边框所在的区域下层。</strong>可以通过 background-clip 属性来调整上述默认行为所带来的不

  便。这个属性的初始值是 border-box，意味着背景会被元素的 border box（边框的外沿框）裁切掉。如果不希望背景侵入边框所在的范围，我们要做的就是把它的值设为 padding-box，这样浏览器就会用内边距的外沿来把背景裁切掉。

- 大部分背景相关的属性可以接受多个值，以逗号分隔第一个值会应用到第一张背景图片上，第二个值会应用到第二张背景图片上。





### 属性

#### background

background属性是以下八个属性的简写。

❑ background-image——指定一个文件或者生成的颜色渐变作为背景图片。

❑ background-position——设置背景图片的初始位置。

❑ background-size——指定元素内背景图片的渲染尺寸。

❑ background-repeat——决定在需要填充整个元素时，是否平铺图片。

❑ background-origin——决定背景相对于元素的border box（边框的外沿框）、padding box（内边距的外沿框）（默认值，这样边

框才不会遮住背景图片。）和 content box（内容区的外沿框）来定位。

❑ background-clip——指定背景是否应该填充边框盒（初始值）、内边距框盒或内容盒子。

❑ background-attachment——指定背景图片是随着元素上下滚动（初始值），还是固定在视口区域。注意，使用fixed值会对页面性能产生负面影响。

❑ background-color——指定纯色背景，渲染到背景图片下方。

使用简写属性（background）可以设置指定的值，同时把其他属性重置为初始值。因此，在需要用到多个属性时，我往往使用单独的属性。



#### background-image

##### 简介

这个属性可以接受一个图片URL路径（background-image: url(coffee-beans.jpg)），而它也可以接受一个渐变函数。linear-gradient函数使用三个参数来定义行为：角度、起始颜色和终止颜色。`background-image:linear-gradient(to right, white, blue)`。background-image属性可以接受任意数量的值，相互之间以逗号分隔。使用多个背景图片时，列表中排在前面的图片会渲染到排序靠后的图片上面。如果一张背景图片有一些透明度，即使不使用混合模式，在它下方的其他背景也会通过透明区域显现出来。

##### linear-gradient()线性渐变

渐变就相当于是图片。

线性渐变是从元素的一端开始，沿着直线过渡到另一端。

###### 设置角度

上面例子的角度值是to right，意思是渐变从元素的左侧开始（这里是白色），平滑过渡到右侧（这里是蓝色）。甚至可以指定某个对角，比如to bottom right，这样的话，渐变会从元素的左上角开始，逐渐过渡到右下角。

我们可以使用更确切的单位（比如度），更精确地控制角度。值0deg代表垂直向上（相当于to top），更大的值会沿着顺时针变化，因此90deg代表向右渐变，180deg代表向下渐变，360deg又会代表向上渐变。度是最常用的单位，还有一些其他单位可以用来表示角度，如下所示。

❑ rad——弧度（radian）。一个完整的圆是2π，大概是6.2832弧度。

❑ turn——代表环绕圆周的圈数。一圈相当于360度（360deg）。可以使用小数来表示不足一圈，比如0.25turn相当于90deg。

❑ grad——百分度（gradian）。一个完整的圆是400百分度（400grad）,100grad相当于90deg。



###### 设置颜色

- 颜色表示法：可以使用其他的颜色表示法，比如hex（#0000ff）、RGB（rgb(0, 0, 255)）或者transparent关键字。

- 任意数量的颜色节点 ： 一个渐变可以接受任意数量的颜色节点，节点之间通过逗号分隔。渐变会自动均匀地平铺这些颜色节点。在本例中，最左侧（0%）从红色开始，过渡到中间（50%）的白色，到最右侧的蓝色（100%）。我们也可以在渐变函数中为每个颜色节点明确指定位置：`linear-gradient(90deg, red 0%, white 50%, blue 100%);`。除了使用百分比来定位以外，还可以使用像素、em或者其他长度单位。

- 同一个位置设置两个颜色节点：那么渐变会直接从一个颜色变换到另一个，而不是平滑过渡。`linear-gradient(90deg, red 40%, white 40%, white 60%, blue 60%);`。因为第一个颜色节点是红色，在40%的位置，所以渐变从左侧边缘一直到40%是纯红色；因为第二个颜色节点是白色，也是在40%的位置，所以渐变在这里直接变成了白色；接下来因为在60%的位置，还有一个白色的颜色节点，所以40%到60%之间的渐变是纯白色；最后一个颜色节点是蓝色，也是在60%的位置，这样就会直接变换成蓝色，然后一直到右侧边缘是蓝色。

- #### 渐变色 namespace

  现在渐变色也支持申明 namespace 了，比如：

  ```
  .text {
    background-image: linear-gradient(to right in hsl, black, white);
  }
  ```

  这是为了解决一种叫 灰色死区 的问题，即渐变色如果在色盘穿过了饱和度为 0 的区域，中间就会出现一段灰色，而指定命名空间比如 hsl 后就可以绕过灰色死区。

  因为 hsl 对应色盘，渐变的逻辑是在色盘上沿圆弧方向绕行，而非直接穿过圆心（圆心饱和度低，会呈现灰色）。





##### repeating-linear-gradient()重复渐变

更多用这个函数做出来的条纹效果[点开此链接查看](https://css-tricks.com/stripes-css/)

此函数和函数linear-gradient的效果基本相同，唯一的区别就是前者会重复。适合做条纹效果。这最终生成的条纹类似于理发店门口的旋转招牌，用在进度条上效果非常棒。对于重复渐变，最好使用特定的长度而不是百分比，因为设置的值决定了要重复的图片大小。`repeating-linear-gradient(-45deg, #57b, #57b 10px, #148 10px, #148 20px);`



##### radial-gradient()径向渐变repeating-radial-gradient()

从一个点开始，全方位向外扩展。

默认情况下，渐变在元素中是从中心开始，平滑过渡到边缘。渐变整体呈椭圆形，跟随元素大小进行变化（也就是说，较宽的元素，其径向渐变也较宽，反之亦然）。跟线性渐变一样，径向渐变同样支持颜色节点。你可以提供多个节点，使用百分比或者长度单位指定节点位置。你也可以把径向渐变设置为圆形而非椭圆，甚至可以指定渐变中心点的位置。

repeating-radial-gradient()函数可以重复生成图样，形成同心圆环。

![image-20221023194719428](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023194719428.png)







##### background-blend-mode混合模式

###### 实际应用

实际应用效果和代码见《深入解析CSS》第十一章的混合模式

❑ 使用某种颜色或者渐变为图片着色；

- background-blend-mode不仅仅合并多个背景图片，还会合并background-color。所有这些叠放的图层，最终都会被混合模式拼合在一起，因此我们可以把背景颜色设置为想要的色相，混合到图片中去

❑ 为图片添加纹理效果，比如划痕或者老胶片放映时的颗粒感等；

❑ 缓和、加深或者减小图片的对比度，使图片上的文字更具可读性；

❑ 在图片上覆盖了一条文字横幅，但是还想让图片完整显示。



###### 15种类型

![image-20221023203341393](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023203341393.png)















#### `background-color`

![image-20220326222319990](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/css%2F%E7%9F%A5%E8%AF%86%2Fmargin.png)

#### `background-size`

`background-size:contain`图片等比例缩放，当宽度或高度和盒子尺寸相等时图片就不再缩放（即可能导致元素的一些地方不会被背景图片覆盖）

`background-size:cover`图片等比例缩放，图片完全覆盖整个盒子，可能会导致图片的边缘被裁切掉一部分。  	

调整背景图片的大小。例如，将背景图片缩小50%可以使用以下代码：
		background-size: 50%;

也可以指定具体的宽度和高度值来调整背景图片的大小。例如，将背景图片设置为宽度为200像素，高度为100像素可以使用代码：background-size: 200px 100px;



### 实战

#### 实现条纹背景

##### 横向条纹

###### 原理

渐变的颜色色标处于同一位置时就相当于没有渐变了，而渐变是一种由代码生成的图像，我们能可以通过 background-size 来调整其尺寸。

```css
background: linear-gradient(#fb3 50%, #58a 50%);//此时的条纹是等宽的
background-size: 100% 30px;
```

![image-20230706204728772](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-20-47-image-20230706204728772.png)



###### 不等宽的条纹

我们还可以用相同的方法来创建不等宽的条纹，只需调整色标的位置值

```css
background: linear-gradient(#fb3 30%, #58a 30%);
background-size: 100% 30px;

该代码可以改为：
background: linear-gradient(#fb3 30%, #58a 0);
background-size: 100% 30px;
因为“如果某个色标的位置值比整个列表中在它之前的色标的位置值都要小，则该色标的位置值会被设置为它前面所有色标位置值的最大值。” ——CSS 图像（第三版）（http://w3.org/TR/css3-images）
```

![image-20230706204830920](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-20-48-image-20230706204830920.png)



###### 创建超过三种颜色的条纹

如果要创建超过三种颜色的条纹

```css
background: linear-gradient(#fb3 33.3%,
 #58a 0, #58a 66.6%, yellowgreen 0);
background-size: 100% 45px;
```





##### 垂直条纹

垂直条纹的代码跟水平条纹几乎是一样的，差别主要在于：我们需要在开头加上一个额外的参数来指定渐变的方向。在水平条纹的代码中，我们其实也可以加上这个参数，只不过它的默认值 to bottom 本来就跟我们的意图一致。还需要把 background-size 的值颠倒

一下。

```css
background: linear-gradient(to right, /* 或 90deg */
 #fb3 50%, #58a 0);
background-size: 30px 100%;
```

![image-20230706204850596](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-20-48-image-20230706204850596.png)



##### 斜向条纹

创建斜向条纹需要用到四个色标，因为斜着的两个色标是无法无缝重合的，需要四个色标才可以无缝重合。

两个色标的情况：![image-20230706210420304](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-21-04-image-20230706210420304.png)                  四个色标：![image-20230706210435939](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-21-04-image-20230706210435939.png)

利用repeating-linear-gradient()

```css
**background**: repeating-linear-gradient(45deg, \#fb3, #58a 30px);
它相当于下面这个简单的线性渐变：
**background**: linear-gradient(45deg,

 \#fb3, #58a 30px,

 \#fb3 30px, #58a 60px,

 \#fb3 60px, #58a 90px,

 \#fb3 90px, #58a 120px,

 \#fb3 120px, #58a 150px, ...); /*每次同个颜色的色标相加30px（因为一开始就想差30px，所以每次会以前一个为基准加30px）*/
```



60°斜向条纹只需这样写

```css
background: repeating-linear-gradient(60deg,#fb3, #fb3 15px, #58a 15px, #58a 30px);
/*第一个色值的色标为0，第二个色值和第三个色值的色标相同，第四个色值的色标与第三个色值的色标的差值跟第二个与第一个色值的色标的差值相同*/
```

![image-20230706210003097](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-06-21-00-image-20230706210003097.png)



##### 同色系渐变条纹

把最深的颜色指定为背景色，同时把半透明白色的条纹叠加在背景色之上来得到浅色条纹：

```css
background: #58a;
background-image: repeating-linear-gradient(30deg,
 hsla(0,0%,100%,.1),
 hsla(0,0%,100%,.1) 15px,
 transparent 0, transparent 30px);
```



我们还得到了一个额外的好处，对于那些不支持CSS 渐变的浏览器来说，这里的背景色还起到了回退的作用。





## 阴影

#### box-shadow

可以为元素盒子生成阴影

##### 用法

默认情况下，阴影与元素的大小和尺寸相同。如果元素设置了border-radius，那么阴影相应地也会有圆角。阴影的水平偏移量（x）、垂直偏移量（y）和颜色都不可或缺。还有两个值是可选的：模糊半径和扩展半径。完整的语法如图![image-20221023195209780](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023195209780.png)

模糊半径用来控制阴影边缘模糊区域的大小，可以为阴影生成一个更柔和、有点透明的边缘。扩展半径用来控制阴影的大小，设置为正值可以使阴影全方位变大，设为负值则会变小。



##### 用途

使用渐变和阴影形成立体感：![image-20221023195456084](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023195456084.png)按钮未被点击时：由上至下的渐变可以使按钮产生弧形的3D效果，阴影加强了这种效果。阴影做了一些模糊处理，看起来更自然了。按钮点击时，移除了阴影效果，取而代之的是在按钮的边框内出现了内阴影。这样按钮就有了一种被摁下的感觉，就仿佛用户真的在网页上按压按钮。

实现代码：<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023195749341.png" alt="image-20221023195749341" style="zoom:50%;" />

我们增加了一个<font color="red">inset关键字</font>，用来替换之前的盒阴影。这样就可以使阴影出现在元素边框的内部，而非之前的外部。同时我们定义了不止一个阴影，<font color="red">用逗号分隔。通过这种方式可以添加多个阴影。</font>





<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023200516781.png" alt="image-20221023200516781" style="zoom:50%;" />

实现代码：<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023200558736.png" alt="image-20221023200558736" style="zoom:50%;" />



#### text-shadow

可以为渲染后的文字生成阴影。









## 轮廓（outline）

元素轮廓是绘制于元素周围的一条线，位于[`border`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)的外围，使元素突出

- 在浏览器里，当鼠标点击或使用Tab键让一个链接或者一个radio获得焦点的时候，该元素将会被一个轮廓虚线框围绕。这个轮廓虚线框就是 outline 。

- outline 的效果将随元素的 focus 而自动出现，相应的由 blur 而自动消失。这些都是浏览器的默认行为，无需 JavaScript 配合 CSS 来控制。

- outline 是不占空间的，不会像 border 那样影响元素的尺寸或者位置，既不会增加额外的 width 或者 height（这样不会导致浏览器渲染时出现 reflow 或是 repaint ）





## object（针对可替换元素）

[更多内容可点开此链接查看](https://css-tricks.com/on-object-fit-and-object-position/)

#### **`object-fit`** 

指定[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的内容应该如何适应到其使用高度和宽度确定的框。

#### **`object-position`** 

规定了[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的内容在其内容框中的位置。可替换元素的内容框中未被对象所覆盖的部分，则会显示该元素的背景（[`background`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)）。









# 值和单位

## 值和单位

移动端是支持12px以下字体的，当然这其实只跟浏览器的设置有关，你电脑上也可以将chrome浏览器的字体设置到12px以下。

![image-20230608155214675](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-06-08-15-52-image-20230608155214675.png)

![image-20230429150120927](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-15-01-image-20230429150120927.png)



## CSS布局单位

### 总览

对大多数浏览器来说，默认的字号为16px。准确地说，medium关键字的值是16px。

通常浏览器可以让用户设置默认字号。但是它不会影响用px或者其他绝对单位设置的字号。由于默认的字号对视力受损的人非常重要，所以应该始终用相对单位或者百分比设置字号。

我一般会用rem设置字号，用px设置边框，用em设置其他大部分属性，尤其是内边距、外边距和圆角（不过我有时用百分比设置容器宽度）。---《深入解析css》

### 绝对单位

**（1）像素**（`px`） 相对于屏幕分辨率而言，不同的设备之间每个设备像素所代表的物理长度可能不一样。CSS像素并不严格等于显示器的像素。

不常用的绝对单位有mm（毫米）、cm（厘米）、in（英寸）、pt（点，印刷术语，1/72英寸）、pc（派卡，印刷术语，12点）。这些单位都可以通过公式互相换算：1in = 25.4mm = 2.54cm = 6pc = 72pt = 96px。

（2）ch 单位表示“0”字形的宽度。在等宽字体中，“0”字形的宽度和其他所有字形的宽度是一样的。



### 相对单位

**（1）百分比**（`%`）大部分相对于祖先元素的该属性，也有相对于自身的情况比如（border-radius、translate等)

**（2）em和rem**：

- **em：** 相对于当前的字体尺寸。如果当前font-size未被人为设置，则相对父元素的字体大小倍数，若父也无则相对于浏览器的默认字体尺寸(默认16px，即medium关键字的值是16px)。当font-size也用了em为单位时则font-size的值相对父元素的字体大小。
  - 注意：用em定义了字号（基于继承的字号），而且也用em定义了其他属性，比如padding和border-radius（基于当前元素的字号）。这时，浏览器必须先计算字号，然后使用这个计算值去算出其余的属性值。这两类属性可以拥有一样的声明值，但是计算值不一样。
  - em用在内边距、外边距以及元素大小上很好（比如让内边距和圆角随着字号大小改变而改变），但是用在字号上就不适合。

- **rem：**全称是 root em ， CSS3新增，相对于根元素（html元素）的font-size的倍数（默认16px）。可以利用html元素中字体的大小与屏幕间的比值来设置font-size的值，以此实现当屏幕分辨率变化时让元素也随之变化。

**（3）vw/vh**

使不用媒体查询也可以实现响应式布局。

>  视口——浏览器窗口里网页可见部分的边框区域。它不包括浏览器的地址栏、工具栏、状态栏。

- vw：相对于视窗的宽度，1% of viewport’s width
- vh：相对于视窗的高度，1% of viewport’s height
- vmin：vw和vh中的较小值；1% of viewport’s smaller dimension
- vmax：vw和vh中的较大值；1% of viewport’s larger dimension

可以结合cal()来定义字号实现缩放后字号仍合适当前尺寸的屏幕： 比如calc(0.5em+1vw)。0.5em保证了最小字号，1vw则确保了字体会随着视口缩放。



除了 `vh`、`vw` 等，还提供了 `dvh`、`lvh`、`svh`，主要是在移动设备下的区别：

- `dvh`: dynamic vh, 表示内容高度，会自动忽略浏览器导航栏高度。
- `lvh`: large vh, 最大高度，包含浏览器导航栏高度。
- `svh`: small vh, 最小高度，不包含浏览器导航栏高度。





## 无单位的数值和行高

有些属性允许无单位的值。支持这种值的属性包括line-height、z-index、font-weight（700等于bold,400等于normal，等等）。任何长度单位（如px、em、rem）都可以用无单位的0（因为这些情况下单位不影响计算值，即0px、0%、0em均相等）。警告一个无单位的0只能用于长度值和百分比，而不能用于角度值，比如度，或者时间相关的值，比如秒。

line-height既可以设置无单位的值也可以设置有单位的值。一个元素的值使用有单位的值时，子元素会继承它的计算值。使用无单位的数值时，继承的是声明值，即在每个继承子元素上会重新算它的计算值。











## 物理像素，逻辑像素和像素密度

[以下内容基本来源于此](https://juejin.cn/post/6844903839452102670#heading-6)

#### 物理像素

设备屏幕实际拥有的像素点

#### 逻辑像素

Device Independent Pixel（DIP），可以理解为反映在CSS/JS程序里面的像素点，**也就是说css像素是逻辑像素的一种**。

我们平时描述一张图片宽高时一般用 `200px * 100px`，这里的`px`也是逻辑像素。css像素存在的目的是为了保证阅读体验一致，所以对不同的物理设备，css使得浏览器中1css像素的大小在不同物理设备上看上去大小总是差不多。

#### 设备像素比

（Device Pixel Ratio，DPR）

一个设备的物理像素与逻辑像素之比。用更多物理像素来渲染1个逻辑像素。

举个例子，iPhone 6的物理像素上面已经说了，是750 * 1334，那它的逻辑像素呢？我们只需在iPhone 6的Safari里打印一下`screen.width`和`screen.height`就知道了，结果是 375 * 667，这就是它的逻辑像素，据此很容易计算出DRP为2。当然，我们还可以直接通过`window.devicePixelRatio`这个值来获取DRP，打印结果是2

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-10-32-image-20230504103224911.png" alt="image-20230504103224911" style="zoom:50%;" />



#### dpi与ppi



<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-10-24-image-20230504102422471.png" alt="image-20230504102422471" style="zoom:50%;" />





## 为什么在移动端开发时需要用到@3x, @2x这种图片

**原因**：

由于移动端视网膜屏（**Retina屏幕**）的物理像素是逻辑像素的两到三倍（相当于图片放上手机端后会放大2-3倍），如果用原图就会失真，所以我们采用@3x, @2x这种图片。  比如我们实际需要一张50 * 50的照片，但我们采取一张100*100（逻辑像素如px）图片，然后再手动把这图缩小为50  *  50 （逻辑像素如px）。所以说为了能在移动端图片不失真，我们准备的图片比我们实际需要的大小要大两倍，这就是2倍图

**解决方法**：

- **针对所有屏幕，都只提供最高清图片**。虽然低密度屏幕用不到那么多图片像素，而且会因为下载多余的像素造成带宽浪费和下载延迟，但从结果上说能保证图片在所有屏幕上都不会失真。

  

- 使用 CSS 媒体查询来判断不同的像素密度，从而选择不同的图片:

```css
my-image { background: (low.png); }
@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image { background: (high.png); }
}
```

- `<picture>`标签，`<source>`标签

同时适配不同像素密度、不同大小的屏幕，就要用到`<picture>`标签。它是一个容器标签，内部使用`<source>`和`<img>`，指定不同情况下加载的图像。

> ```html
> <picture>
> <source media="(max-width: 500px)" srcset="cat-vertical.jpg">
> <source media="(min-width: 501px)" srcset="cat-horizontal.jpg">
> <img src="cat.jpg" alt="cat">
> </picture>
> ```

`<source>`标签的`media`属性给出媒体查询表达式，`srcset`属性就是`<img>`标签的`srcset`属性，给出加载的图像文件。`sizes`属性其实这里也可以用，但由于有了`media`属性，就没有必要了。

浏览器按照`<source>`标签出现的顺序，依次判断当前设备是否满足`media`属性的媒体查询表达式，如果满足就加载`srcset`属性指定的图片文件，并且不再执行后面的`<source>`标签和`<img>`标签。

`<img>`标签是默认情况下加载的图像，用来满足上面所有`<source>`都不匹配的情况。

上面例子中，设备宽度如果不超过`500px`，就加载竖屏的图像，否则加载横屏的图像。

下面给出一个例子，同时考虑屏幕尺寸和像素密度的适配。

> ```html
> <picture>
> <source srcset="homepage-person@desktop.png,
>                homepage-person@desktop-2x.png 2x"       
>        media="(min-width: 990px)">
> <source srcset="homepage-person@tablet.png,
>                homepage-person@tablet-2x.png 2x" 
>        media="(min-width: 750px)">
> <img srcset="homepage-person@mobile.png,
>             homepage-person@mobile-2x.png 2x" 
>     alt="Shopify Merchant, Corrine Anestopoulos">
> </picture>
> ```

上面代码中，`<source>`标签的`media`属性给出屏幕尺寸的适配条件，每个条件都用`srcset`属性，再给出两种像素密度的图像 URL。











# 过渡&动画

## 不能用于过渡&动画的属性

请注意，这只是一个大致的列表，具体哪些属性不能用于过渡可能会根据不同的浏览器和 CSS 规范的版本有所不同。在实际使用中，你应该参考具体的 CSS 规范和浏览器文档，或者通过实验来确定一个属性是否可以用于过渡&动画：


非数字属性：如 display、content、visibility、cursor等，这些属性的值不是数字，因此不能进行插值计算，无法用于过渡。


颜色空间不一致的颜色属性：如果两个颜色的颜色空间不一致（例如，一个是 RGB，一个是 HSL），那么这个颜色属性就不能用于过渡。


部分复合属性：如 background、border、font等，这些属性是一些单一属性的简写形式，如果它们的子属性值的类型不一致，那么这个复合属性就不能用于过渡。


URL 类型的属性：如 background-image、list-style-image等，这些属性的值是 URL，不能用于过渡。


部分特殊属性：如 z-index、page-break-*等，这些属性由于各种原因不能用于过渡。





## transition过渡

### 哪些属性可用

如果你在MDN之类的参考指南上查阅属性，它们就会明确告诉你某个属性是否可以添加动画效果，什么类型的值（比如长度、颜色、百分比）可以用内插值（内插值是指为了达到流畅的动画效果，在两个值之间插入一系列介于两值之间的事先计算好的值，计算逻辑及插值速度取决于定时函数。）替换。

大部分的接受长度值、数值、颜色值或者calc()函数值的属性可以添加动画效果；大部分的使用关键字或者其他非连续性值的属性（比如url()）不可以使用动画。

注意一个值不能从长度（0）过渡到auto。

### 简介

动画会生硬地跳回开始状态，但过渡的行为则会反向播放，从而平滑地过渡回原始状态。

简写属性transition。该简写属性接受四个参数值，分别代表四个过渡属性transition-property、transition-duration、transition-timing-function和transition-delay。

第一个值设置了哪个属性需要过渡，初始值是关键字all，表示所有属性都生效。如果只有某个属性需要过渡，在这里指定属性即可。例如transition-property: color将只应用在元素的颜色上，其他属性会立刻发生变化。也可以设置多个值，比如transition-property:color, font-size。

第二个值是持续时间，是一个用秒（例如0.3s）或者毫秒（300ms）表示的时间值。你必须为时间值添加一个单位（0s或者0ms），否则声明将无效，并被浏览器忽略。

第三个值是定时函数，用来控制属性的中间值如何计算，实际上控制的是过渡过程中变化率如何加速或者减速。定时函数可以是一个关键字值，比如linear或者ease-in，也可以是自定义函数。

最后一个值是延迟时间，允许开发者在属性值改变之后过渡生效之前设置一个等待周期。如果你为按钮的悬停状态设置0.5s的过渡延迟，那么在鼠标指针进入元素0.5s之后才会开始发生变化。

如果需要为两个不同的属性分别设置不同的过渡，可以添加多个过渡规则，以逗号分隔。



### 持续时间

对于鼠标悬停、淡入淡出和轻微缩放特效，应该使用较快的过渡速度。一般要控制在300ms以下，有时候甚至可能要低到100ms。对于那些包含较大移动或者复杂定时函数的过渡，比如弹跳特效，要使用较长的300～500ms的持续时间。



### 定时函数

#### 阶跃

steps()函数。跟从一个值到另一个值的基于贝塞尔曲线的流畅过渡不同，这个函数是一系列非连续性的瞬时“阶跃”（steps）。阶跃函数需要两个参数：阶跃次数和一个用来表示每次变化发生在阶跃的开始还是结束的关键词（start或者end）。注意因为第二个参数的默认值是end。默认情况下，属性值在每一步结束的时候改变，因此过渡不会立即开始。添加start关键字steps(3, start)就可以改变这种行为，这样过渡就会发生在每步开始的时候，而不是结束。

更多实际用法可[打开此链接查看](https://css-tricks.com/clever-uses-step-easing/)



#### 利用开发者工具修改定时函数

打开开发者工具并检查小绿盒子元素。在样式面板（Chrome）或者规则面板（Firefox）中，你会发现定时函数旁边有一个小小的标志符号。点击标志符号会打开一个弹窗，可以在弹窗中修改定时函数的曲线。



#### 自定义定时函数cubic-bezier()

横坐标是时间，纵坐标是进度，可以在垂直方向上突破 0~1 区间，从而让过渡的属性达到低 于 0 或高于 100% 的程度。

cubic-bezier()函数和4个参数共同组成了自定义定时函数。其中的四个参数分别代表两个控制柄的控制点的x和y坐标。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023221530152.png" alt="image-20221023221530152" style="zoom:50%;" />



cubic-bezier(0.2， 0.9，0.3，1.3)函数产生了一个弹跳特效：标签向右移动时，超出了停止位置，然后再回到最终位置停下来。运动曲线如图所示：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221024140629913.png" alt="image-20221024140629913" style="zoom:50%;" />

你会发现曲线超出了盒子的顶端，这就意味着值超过了过渡的最终值。从translate(-1em)到translate(0)的过渡中，标签的变换会短暂地到达一个超出最终位置大概0.15em的值，然后再缓缓回到最终位置。同样，我们也可以在定时函数的开始添加弹跳效果，即把第一个控制柄移动到低于盒子底部。然而过渡曲线是不可能超出左右两侧边缘的，这不合逻辑。





#### 使用场景

每个网站或者应用程序都应该包含一条减速曲线（ease-out）、一条加速曲线（ease-in）和linear关键字。可以在下列场景中分别使用这三种函数：

❑ 线性——颜色变化和淡出、淡入效果。

❑ 减速——用户发起的变化。用户点击按钮或者划过元素的时候，使用ease-out或者类似曲线。这样用户就可以看到快速发生的反馈，及时响应输入，然后元素慢慢过渡到最终状态。

❑ 加速——系统发起的变化。当内容加载完成或者超时事件触发的时候，使用ease-in或者类似曲线。这样元素就可以慢慢引起用户注意，然后速度越来越快直到完成最终变化。





### js事件transitionend

可以使用JavaScript的transitionend事件在过渡完成之后做一些额外处理。







## 2D/3D变换

### transform

#### 属性

❑ 旋转（Rotate）——元素绕着一个轴心转动一定角度。

❑ 平移（Translate）——元素向上、下、左、右各个方向移动（有点类似于相对定位）。

❑ 缩放（Scale）——缩小或放大元素。

❑ 倾斜（Skew）——使元素变形，顶边滑向一个方向，底边滑向相反的方向。



##### matrix

###### 介绍

❑  matrix 让 CSS 具备处理 3 维场景的能力。矩阵的作用只是输入向量，输出新的向量。无论是旋转还是拉伸，本质上都是应用的`matrix()`方法实现的（修改matrix()方法固定几个值）

> 向量点乘，也称为内积或数量积，是一种在线性代数中常见的运算。它用于计算两个向量之间的乘积。对于两个二维向量或三维向量，向量点乘的计算方法如下：
>
> 设有两个向量 A 和 B，A = [A₁, A₂, A₃]，B = [B₁, B₂, B₃]。 向量点乘的计算公式为：A · B = A₁ * B₁ + A₂ * B₂ + A₃ * B₃。



###### 计算方式

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-30-20-11-image-20240130201124484.png" alt="image-20240130201124484" style="zoom:75%;" />

###### 偏移/缩放

matrix表现偏移就是只要关心后面两个参数就可以了，至于前面4个参数，是牛是马，是男是女都没有关系的，transform: matrix(0, 0, 0, 0, tx, ty);就等同于transform: translate(tx px, ty px);.

matrix(sx, 0, 0, sy, 0, 0);，等同于scale(sx, sy);



###### 旋转

方法以及参数使用如下（假设角度为θ）：

```javascript
matrix(cosθ,sinθ,-sinθ,cosθ,0,0)
```

结合矩阵公式，就有：

```javascript
x' = x*cosθ-y*sinθ+0 = x*cosθ-y*sinθ
y' = x*sinθ+y*cosθ+0 = x*sinθ+y*cosθ
```

就旋转而言，rotate(θdeg)这种书写形式要比matrix简单多了，首先记忆简单，其次，无需计算。例如，旋转30°，前者直接：

```javascript
transform:rotate(30deg);
```

而使用matrix表示则还要计算cos, sin值：

```javascript
transform: matrix(0.866025,0.500000,-0.500000,0.866025,0,0);
```



###### 拉伸(skew)

拉伸也用到了三角函数，是tanθ，而且，其只与b, c两个参数相关，书写如下（注意y轴倾斜角度在前）：

```javascript
matrix(1,tan(θy),tan(θx),1,0,0)
```

套用矩阵公式计算结果为：

```javascript
x' = x+y*tan(θx)+0 = x+y*tan(θx) 
y' = x*tan(θy)+y+0 = x*tan(θy)+y
```

对应于skew(θx + "deg"，θy+ "deg")这种写法。





###### 镜像对称效果

对于一般地交互应用，transform属性默认提供的些方法是足够了，但是，一些其他的效果，如果transform属性没有提供接口方法，那你又该怎么办呢？比方说，“**镜像对称效果**”！

在镜像对称的时候轴是看不见的。轴围绕的那个点就是CSS3中transform变换的中心点，自然，镜像对称也不例外。因为该轴永远经过原点，因此，任意对称轴都可以用y = k * x表示。则matrix表示就是：

```css
matrix((1-k*k) / (1+k*k), 2k / (1 + k*k), 2k / (1 + k*k), (k*k - 1) / (1+k*k), 0, 0)
```

这个如何得到的呢？如下图，已经y=kx，并且知道点(x, y)坐标，求其对称点(x’, y’)的坐标？

![在这里插入图片描述](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-w0kvOP.webp)

很简单，一是垂直，二是中心点在轴线上，因此有：

(y‘-y) / (x’ - x) = -1/ k → ky'-ky = x-x' ((y + y')/2)/((x + x') / 2) = k → y+y' = kx+kx'

再通过因数消除法，把x'和y'提出来，就有：

x' = ((1-k*k)*x + 2k*y)/(k*k+1); y' = (2k*x + ((k*k-1)*y))/(k*k+1);

再结合矩阵公式： x' = ax+cy+e; y' = bx+dy+f;

我们就可以得到： a = (1-k*k)/(k*k+1); b = 2k/(k*k+1); c = 2k/(k*k+1); d = (k*k-1)/(k*k+1);

也就是上面matrix方法中的参数值



##### matrix3d

从二维到三维，是从4到9；而在矩阵里是从 9到16了。

其实，本质上很多东西都与2D一致的，只是复杂度不一样而已。这里就举一个简单的3D缩放变换的例子。

对于3D缩放效果，其矩阵如下：

![在这里插入图片描述](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-uomFwu.webp)

代码表示就是：

```javascript
transform: matrix3d(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1)
```





#### 注意

- 虽然元素可能会被移动到页面上的新位置，但<font color="red">它不会脱离文档流，其初始位置不会被其他元素占用。</font> 变换元素不会导致其他元素移动，因此可能出现重叠。
- 变换不能作用在`<span>`或者`<a>`这样的行内元素上。若确实要变换此类元素，要么改变元素的display属性，替换掉inline（比如inline-block），要么把元素改为弹性子元素或者网格项目（为父元素应用display: flex或者display:grid）。





#### transform-origin

变换是围绕基点（point of origin）发生的。基点是旋转的轴心，也是缩放或者倾斜开始的地方。（但translate()是个例外，因为平移过程中元素整体移动）。默认情况下，基点就是元素的中心，但可以通过transform-origin属性改变基点位置。

transform-origin 只是一个语法糖而已。实际上你总是可以用translate() 来代替它。每 个 transform-origin 都 是 可 以 被 两 个

translate() 模拟出来的。比如，下面两段代码实际上是等效的：

```css
transform: rotate(30deg);
transform-origin: 200px 300px;


transform: translate(200px, 300px) rotate(30deg) translate(-200px, -300px);
transform-origin: 0 0;
```







#### 多重变换

多重变换可以对transform属性指定多个值，用空格隔开。变换的每个值<font color="red">从右向左</font>按顺序执行，比如我们设置`transform: rotate(15deg) translate(15px, 0)`，元素会先向右平移15px，然后顺时针旋转15度。元素好像是沿着一个倾斜的坐标轴在移动，而不是正常的方向。这是因为旋转发生在平移之后。

通常把translate()放在最后执行（在transform代码顺序中放在首位）









### 透视距离

#### 简介

为页面添加3D变换之前，我们需要先确定一件事情，即透视距离（perspective）。我们可以把透视距离想象成“摄像机”和场景之间的距离，前后移动镜头就会改变整个场景最终显示到图像上的方式。如果镜头比较近（即透视距离小），那么3D效果就会比较强。如果镜头比较远（即透视距离大），那么3D效果就会比较弱。比如：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221024162850117.png" alt="image-20221024162850117" style="zoom:50%;" />

左侧这个旋转后的元素，没有设置透视距离，看起来不太像是3D的。不设置透视距离的3D变换看上去像是平的，“向远处转”的那部分元素没有显得变小。



#### 用法

可以通过两种方式指定透视距离：使用perspective()变换或者使用perspective属性。perspective属性可以，通过为父容器（或其他祖先元素）设置统一的透视距离，父容器包含的所有应用了3D变换的子元素，都将共享相同的透视距离。而函数的话只能给盒子本身设置。





#### perspective-origin属性

默认情况下，透视距离的渲染是假设观察者（或者镜头）位于元素中心的正前方。perspective-origin属性可以上下、左右移动镜头的位置。

我们可以使用关键字top、left、bottom、right和center来指定位置，也可以使用百分比或者长度值，从元素的左上角开始计算（比如perspective-origin: 25%25%）。





### backface-visibility属性

如果你使用rotateX()或者rotateY()旋转元素超过90度，就会发现你会看到元素的背面。默认情况下背面是可见的，它看起来就像是之前元素的镜像图片。但我们可以为元素设置backface-visibility:hidden来改变它。添加这条声明之后，元素只有在正面朝向观察者的时候才可见，朝向别处的时候不可见。

针对这项技术，一个可能的应用场景是把两个元素背靠背放在一起，就像卡片的两面。卡片的正面展示出来，背面隐藏。然后我们可以旋转它们的容器元素，使这两个元素都翻转过来，这样正面隐藏背面显现。卡片翻转特效的演示，参见文章Intro to CSS 3D Transforms。





### transform-style（preserve-3d）属性

如果你要使用嵌套元素构建复杂的3D场景，transform-style属性就变得非常重要。如果对3D变换元素的父元素再做3D变换，可能需要用到preserve-3d属性。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221024165557820.png" alt="image-20221024165557820" style="zoom:50%;" />

左图展示了通过把六个面变换到相应位置创建一个3D立方体。中间的图片展示的是对整个立方体（即它们的父元素）使用变换会发生什么。为了改正这个问题，我们应该对父元素使用transform-style: preserve-3d（如右图所示）。如果想要了解更多内容和使用案例，可以查看Ana Tudor在DWB网站写的教程。





### 1px边框问题

#### 问题描述

移动端中画个1px的下边框，但屏幕硬是塞给你一条宽度为2—3个物理像素的下边框

原因很简单——CSS 中的 1px 并不能和移动设备上的 1px 划等号。它们之间的比例关系有一个专门的属性来描述：

```html
window.devicePixelRatio = 设备的物理像素 / CSS像素。
```

#### 解决

你不是给我两个物理像素点吗？加个`transform: scale(0.5)`

使用CSS的`-webkit-min-device-pixel-ratio`媒体查询可以针对不同的DPR做出处理 ，下面以Less代码为例：

```css
@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){
    .border-bt-1px(@color) {
        position: relative;
        &::after {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 1px;
            background-color: @color;
            transform: scaleY(0.5);
        }
    }
}
```

###  画一条0.5px的线

- **采用transform: scale()的方式**，该方法用来定义元素的2D 缩放转换：

```css
transform: scale(0.5,0.5);
复制代码
```

- **采用meta viewport的方式**

```css
<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"/>
复制代码
```

这样就能缩放到原来的0.5倍，如果是1px那么就会变成0.5px。**viewport只针对于移动端**，只在移动端上才能看到效果









## 动画

### 介绍

<mark>过渡是直接从一个地方变换到另一个地方，相比之下，我们可能希望某个元素的变化过程中间有好几个阶段，也可能需要元素在动画运动后再回到起始的地方。</mark>

一般动效和音效会分开交付，原因是： 

技术上：带有声音的视频如要播放, 则在ios上必须通过user action来触发。但是动效一般都是期望自动播放的。

职能上： 音效和动效(序列帧)由设计的两个职能交付。

归根结底，落到web上之后，目前无非 js+css、svg、canvas、webgl这几种方式。但是<mark>分那么多类有一个很重要的原因是动效的交付</mark>，他们用不同的方式制作的不同动画，导出来交付给我们，我们希望能通过工具直接在项目中使用，而不是看着他的效果重头用代码写。

### css写

#### 介绍

CSS提供了关键帧动画，动画会生硬地跳回开始状态，但过渡的行为则完全不同，过渡会反向播放，从而平滑地过渡回原始状态。

关键帧（keyframe）是指动画过程中某个特定时刻。我们定义一些关键帧，浏览器负责填充或者插入这些关键帧之间的帧图像。从原理上看，过渡其实和关键帧动画类似：我们定义第一帧（起始点）和最后一帧（结束点），浏览器计算所有中间值，使得元素可以在这些值之间平滑变换。但使用关键帧动画，我们就不再局限于只定义两个点，而是想加多少加多少。浏览器负责填充一个个点与点之间的值，直到最后一个关键帧，最终生成一系列无缝衔接的过渡。

<span style="color:red">动画中应用的声明有更高的优先级。</span>为某个属性添加动画的时候，会覆盖样式表中其他地方应用的样式。这就确保了关键帧中所有的声明可以互相配合完成动画，而不用关注动画之外对这个元素可能应用了哪些样式。





CSS3的动画三大属性：Transform 变形，Transition 过渡，和Animation 动画。

**优点：**兼容性好、占用内存少、文件小、可以动态内容。

**缺点：**动画拆分依赖动效严重，开发成本高。

tips

​	复杂一点的效果最好让设计师提供keyframes，以及transition-timing-function（动画的过渡效果），不然很可能做出来之后要花费比较多的时间与设计师联调动效。一般好的过渡效果都会用贝塞尔曲线实现。



AE使用inspector spacetime插件导出的文本描述动画一般长这样: 

```
Total Dur: 5767ms

≡ shou2x.png ≡
- 缩放 -
Delay: 0ms
Dur: 533ms
Val: 58% ›› 100%
(0.4, 0, 0.29, 1.02)

- 位置 -
Delay: 0ms
Dur: 533ms
Val: [406,1201]››[406,1175]
(0.4, 0, 0.29, 1)

- 旋转 -
Delay: 0ms
Dur: 533ms
Val: -95° ››› 10°
(0.33, 0, 0.67, 1)

- 旋转 -
Delay: 533ms
Dur: 300ms
Val: 10° ››› -2.5°
(0.33, 0, 0.67, 1)
```

可以转换为两种CSS:

- 普通CSS (关键帧CSS)

  - 普通CSS没有办法实现路径动画, 如需路径动画, 请使用序列帧CSS
  - **普通CSS比较适合单纯的动画内容, 如果图层动画较为复杂, 推荐使用序列帧CSS**

- 序列帧CSS  (逐帧CSS)

  



一般这类动效的场景是，动效设计师使用 AE 生产动效，但<mark>动效的资源是动态的</mark>，我们主要是提取动画的参数写 CSS 代码，例如：红包要做一个旋转效果，红包内容是动态的，但这个旋转动画的效果是确定的。<mark>(快手有lottie-css库可以将lottie转成css绘制)</mark>







#### 属性

CSS中的动画包括两部分：用来定义动画的@keyframes规则和为元素添加动画的animation属性。

❑ animation-name ——代表动画名称，就像@keyframes规则定义的那样。

❑ animation-duration ——动画指定需要多少秒或毫秒完成

❑ animation-timing-function ——代表定时函数，用来描述动画如何加速和/或减速。可以是贝塞尔曲线或者关键字值，就像过渡使用的定时函数一样（ease-in、ease-out，等等）。可以用cubic-bezier()

❑ animation-delay属性推迟动画开始的时间

❑ animation-iteration-count ——代表动画重复的次数。初始值默认是1。

❑ *animation-direction*：指定是否应该轮流反向播放动画。实现闪烁动画。

❑ animation-fill-mode 可以使元素在动画播放前或播放后应用动画样式

❑ animation-play-state*：指定动画是否正在运行或已暂停



#### js动画和css3动画的优缺点

由于 JavaScript 运行在浏览器的主线程中，主线程中还有其他的重要任务在运行，因而可能会受到干扰导致**线程阻塞**，从而**丢帧**。

 CSS3的动画（对 opacity | transform | fliter ｜all 应用了过渡和动画（transition/animation）时；transform）是运行在**合成线程**中的，不会阻塞主线程，并且由于提升了一层不会触发其他层的回流和重绘



#### 一些写好的动画代码

这个网站https://animista.net/play/basic





#### 三方库

对于变形的动画，推荐的比较优秀的三方库有以下几个：

| 库名                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [GSAP](https://gsap.com/)                                    | 全称是GreenSock Animation Platform，GSAP.js 速度快，轻量与模块化；（dyc感觉这个不适合设计师交付动效之后开发人员<font color='red'>迅速</font>在页面上实现该动效，更适合于开发者自嗨在页面上做动效） |
| [Snap.svg](https://link.juejin.cn?target=http%3A%2F%2Fsnapsvg.io%2F)、[SVG.js](https://svgjs.dev/docs/3.0/)、[Velocity.js](https://link.juejin.cn?target=http%3A%2F%2Fwww.velocityjs.org%2F) | 这三个库一直会被开发者拿来对比，基本上会用jQuery，就会使用这三个库，也就是说入手友好，Snap.svg 更偏向于支持现代浏览器，所以它的体量也会小一些。对比 Snap.svg 来看 SVG.js ，SVG.js 的写法更加的清晰，使用时会有更好的体验，且自称提供接近完整的 SVG 规范覆盖。Snap.svg 风格就更像一个侠客，写起来会很潇洒但是不好读，Velocity 也很强大，简单易用、高性能、功能丰富 |
| [anime.js](https://animejs.com/)                             | anime.js 虽然功能没有 GASP 强大，但是体积很乐观，gzip压缩完只有9kb左右。（使用场景同 gsap，就是简单的吧用css就行了，复杂的吧直接用设计师交付的祯动画肯定更快） |
| [D3](https://link.juejin.cn?target=https%3A%2F%2Fd3js.org%2F) | Data-Driven Documents 顾名思义，更加适合用于创建数据可视化图形场景去使用 |







### 图片序列帧动画

#### 介绍

​		帧动画即是众多png图片序列。由js脚本模拟编写或是使用css3新属性step() 来控制图片的background-position 这个属性制作而成。step()在移动端的兼容性是很好的。帧动画和GIF动画的差别在于，脚本可以控制帧动画的快慢和动作的暂停，而GIF动画无法在后期通过代码进行动画速率及透明度的修改。

***优点：\***可以自定义播放速度、次数、重复位置等等，可以做到与背景音乐等其它效果灵活配合。可以实现对动画图片的精确控制效果。

***缺点：\***同样效果要比gif图大；图片要根据不同屏幕分辨率进行适配。

#### tips

​	帧动画在移动端开发中兼容性好，缺点是资源大，对于需要用户触发、交互，一些爆炸，撒花类的场景可采用逐帧动画。还有播放lottie和播放视频会存在兼容性问题，可以选用逐帧动画作为兜底方案。







### Lottie/svga

#### lottie

##### 介绍

Lottie是由Airbnb开源的一个支持 Android、iOS 以及 ReactNative的动画库。它能够使用Adobe After Effects导出动画为json格式，并在原生应用或Web上播放这些动画。

官方文档：https://airbnb.io/lottie/#/web

官方资源免费动画：https://lottiefiles.com/featured

[Lottie](https://link.juejin.cn?target=http%3A%2F%2Fairbnb.io%2Flottie%2F%23%2F) 是一个复杂帧动画的解决方案，它提供了一套从设计师使用 AE（Adobe After Effects）到各端开发者实现动画的工具流。

1. 设计师使用 AE 制作动画。
2. 通过 Lottie 提供的 AE 插件 Bodymovin 把动画导出 JSON 数据文件。
3. 加载 Lottie 库结合 JSON 文件就可以实现一个 Lottie 动画。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-16-37-image-20231214163732074.png" alt="image-20231214163732074" style="zoom:33%;" />





**优点：**

​	1)、多端支持较好，开发应用较简单。lottie-web能实现的动画效果有，平移、放大、旋转、淡入淡出、svg的各种动画。

​	2）、不发版，动态更新。

**缺点：**

​	1）、功能比较受限，只能支持位移、缩放等基础动效，AE 中的很多动效无法支持，[这里可](https://www.yuque.com/lottie/document/supported-features)[以看到支持导出的 AE 属性](https://www.yuque.com/lottie/document/supported-features)。

​	2）、大的 lottie 动画效果一般，h5 渲染大的 lottie 动画有性能问题，相对于属性动画，在展示大动画时帧率较低。

tips

导出的时候有两种导出形式，一种是只有json文件，图片资源直接在文件中。一种是静态资源和json文件分开导出。分开导出的优势是可读性更强，并且不容易出错。同时可以外部对资源再进行压缩。

导出lottie文件过大的时候，一方面可以让动效检查一下导出的时候可不可以做优化。另一方面图片资源上传CDN。







##### 使用

```js
import lottie from 'lottie-web';
import animationJsonData from 'xxx-demo.json';  // json 文件

const lot = lottie.loadAnimation({
   container: document.getElementById('lottie'), 
   renderer: 'svg',
   loop: true,
   autoplay: false,
   animationData: animationJsonData,
 });

// 开始播放动画
lot.play();
```





##### lottie简易原理

###### 解读 JSON 文件数据格式

https://juejin.cn/post/6935677483672928287#heading-2



###### Lottie 动画播放流程可**暂时**小结为

1. 渲染图层，初始化所有图层的  `transform` 和 `opacity`
2. 根据帧率 30fps，计算每一帧（每隔 33.3ms ）对应的  `transform` 和 `opacity` 并修改 DOM

然而 Lottie 如何控制 30fps 的时间间隔呢？如果设计师设置 20fps or 40fps 怎么处理？

通过调用 [requestAnimationFrame](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame) 方法，不断的调用 `resume` 方法来控制动画。`requestAnimationFrame` 在正常情况下能达到 60 fps（每隔 16.7ms 左右）。那么 Lottie 如何保证动画按照 30 fps （每隔 33.3ms）流畅运行呢。这个时候我们要转化下思维，设计师希望按照每隔 33.3ms 去计算变化，那也可以通过 `requestAnimationFrame` 方法，每隔 16.7ms 去计算，也可以计算动画的变化。只不过计算的更细致而已，而且还会使得动画更流畅，这样无论是 20fps or 40fps  都可以处理了，来看下源码是如何处理的：

```js
function resume(nowTime) {
    // 两次 requestAnimationFrame 间隔时间
    var elapsedTime = nowTime - initTime;

    // 下一次计算帧数 = 上一次执行的帧数 + 本次间隔的帧数
    // frameModifier 为帧率( fr / 1000 = 0.03)
  	// 计算动画的当前帧数。注意这里的帧数只是相对 AE 设置的一个计算单位，可以有小数。
    var nextValue = this.currentRawFrame + value * this.frameModifier;
    
    this.setCurrentRawFrameValue(nextValue);
    
    initTime = nowTime;
    if(playingAnimationsNum && !_isFrozen) {
        window.requestAnimationFrame(resume);
    } else {
        _stopped = true;
    }
}

AnimationItem.prototype.setCurrentRawFrameValue = function(value){
    this.currentRawFrame = value;
    // 渲染当前帧
    this.renderFrame(); // 有三种渲染方式：canvas，svg，html+css+js
};
```



##### Lottie 的优缺点

优点：

1. 设计师通过 AE 制作动画，前端可以直接还原，不会出现买家秀卖家秀的情况。
2. SVG 是可伸缩的，任何分辨率下不会失真。
3. JSON 文件，可以多端复用（Web、Android、iOS、React Native）。
4. JSON 文件大小会比 GIF 以及 APNG 等文件小很多，性能也会更好。



缺点：

1. Lottie-web 文件本身仍然比较大，未压缩大小为 513k，轻量版压缩后也有 144k，经过 Gzip 后，大小为39k。所以，需要注意 Lottie-web 的加载。
2. 不必要的序列帧。Lottie 的主要动画思想是绘制某一个图层不断的改变 CSS 属性，如果设计师偷懒用了一些插件实现的动画效果，可能会造成每一帧都是一张图，如下图所示，那就会造成这个 JSON 文件非常大，注意和设计师提前进行沟通。

![不必要的序列帧](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-z85IZO.webp)

3. 部分AE特效不支持。有少量的 AE 动画效果，Lottie 无法实现，有些是因为性能问题，有些是没有做，注意和设计师提前沟通，[点我查看](https://link.juejin.cn?target=http%3A%2F%2Fairbnb.io%2Flottie%2F%23%2Fsupported-features)。



#### svga

svga是YY 公司开源动画库，类似 lottie，支持安卓、ios、web、flutter：https://github.com/svga。相比 lottie 从效果和性能上类似，但是lottie 的使用量级和社区活跃度远比 svga 要好。

使用 After Effects 或是 Animate(Flash) 进行动画设计，SVGA 可以支持其中的大部分效果，设计师使用导出工具即可生成动画文件

[SVGAPlayer-Web-Lite](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsvga%2FSVGAPlayer-Web-Lite)(下面简称SVGA)是一个优秀的动画库，他能解析svga格式的文件，并将其渲染到canvas上，性能比gif和mp4要好，体积也小。





#### pag

腾讯产的一种格式

https://github.com/Tencent/libpag/blob/main/README.zh_CN.md





### 透明视频

##### 介绍

​	一些特效类的效果，可以考虑做为背景视频实现，使用视频做动画的好处是效果炫酷，接入成本较低，如果一些动效通过技术手段不好实现，可以考虑做成视频接入，这类动效不能有交互操作，所以一般做为背景。

​	

##### tips

​	1）、透明视频存在播放丢帧问题；

​	2）、相比Lottie能实现更复杂的动画。







##### **如何实现透明视频？**

###### 方法一：**webm格式视频**

理想方式就是在动效渲染区域通过video标签标签播放一个带透明背景的视频，目前浏览器原生支持的带Alpha通道的视频格式是webm，但是兼容性差，很多浏览器上都不能完整支持，同时video标签播放视频在不同机型不同浏览器上也存在问题，需要做的兼容处理太多。



###### 方法二：**CSS 样式去掉背景**

利用css样式 mix-blend-mode 混合模式，也有兼容性问题。有一个属性 screen 就是黑色和其它元素进行混合的时候表现为透明。但这种方法有一种情况没法解决，就是如果视频中有元素是半透明的就无法成功了。



###### 方法三：**webgl渲染带透明通道视频(推荐)**

WebGL实现透明视频绘制的主要思路为：

- 解析 Video 视频播放过程的每一帧；
- 识别每一帧需要透明的区域，并设置为透明；
- 通过 WebGL 绘制处理后的每一帧；
- 以上过程重复至视频播放结束，快速绘制过程产生连续变化，即为带透明度的动画；



##### webGL透明视频

首先讲讲video，一段 AE 制作的动画，无损导出后的大小如下：

- APNG 大小 27M
- Video 仅有 400K

<mark>h264格式Video 没有 Alpha 通道</mark>，也就是如下效果所示，视频背景是黑乎乎的。<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-19-48-image-20231214194847258.png" alt="image-20231214194847258" style="zoom:25%;" />然而我们平时的动画场景基本都是需要透明度的。

已知“用户与页面交互之后才可以使用 Video 标签进行视频播放”限制的平台有：移动端微信浏览器，iPhone 省电模式，部分 Android 浏览器。视频的可配置性和可交互性太差。高清视频一般体积都比较大。移动端视频在不同app、不同机型、不同系统的播放显示都不太一样，容易踩不少坑。



业界通过 [WebGl](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWebGL_API) 来绘制透明视频：比如tencent：https://github.com/Tencent/vap/blob/master/Introduction.md。可以动态显示一些用户名用户头像之类。

WebGl 实现透明视频绘制的主要思路为：

- 解析 Video 视频播放过程的每一帧
- 识别每一帧需要透明的区域，并设置为透明
- 通过 WebGl 绘制处理后的每一帧
- 以上过程重复至视频播放结束，快速绘制过程产生连续变化，为新的带有透明度的动画



设计同学导出左右对称视频 [查看视频](https://link.juejin.cn/?target=http%3A%2F%2Ff1.iplay.126.net%2FLTg4MDA1%2Fc62f8e1f15e98ff9eb9a094d015db380.mp4) 如下：<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-20-36-image-20231214203658951.png" alt="image-20231214203658951" style="zoom: 25%;" />

这个视频中是左右对称的。左面是纯白色的动画，右面是有色彩的也是我们所需要的动画。那我们的绘制思路就可以为：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-20-44-image-20231214204436507.png" alt="image-20231214204436507" style="zoom:25%;" />

1. 真正绘制的动画宽为原视频的 50%，也就是一半，高和视频一致
2. 解析左侧像素点，白色就代表是动画，黑色就代表需要透明
3. 解析右侧像素点的 `rgb`
4. 绘制时色值变为 `rgba`，那么 `a` 的值就是左侧的白色 `1` （该像素颜色不变）或是黑色 `0`（该像素颜色变为透明）

```javascript
precision lowp float;
varying vec2 v_texCoord;
uniform sampler2D u_sampler;
void main(void) {
  	gl_FragColor = vec4( // vec4代表4维变量，因为rgba是4个值
        texture2D(u_sampler, v_texCoord).rgb, // 右侧的rgb
        texture2D(u_sampler, v_texCoord + vec2(-0.5, 0)).r // -0.5代表画布左侧，取值是rgb中的r值
   	);
}
```

上述 WebGl 代码就是透明度的核心代码，当然第一次接触 WebGl 的人肯定就懵了（我也是）。所以我们主要是理解思路即可，理解这个思路，完全可以用 canvas 实现同样的效果。





##### 社区方案

https://github.com/yylive/YYEVA 这个方案能支持 透明视频 里的某些元素是动态的（比如展示用户头像）。原理介绍：https://xie.infoq.cn/article/a4cad444d7b4b317b2b9254b9

VAP（Video Animation Player）是企鹅电竞开发









### canvas绘制

##### 介绍

​		Canvas 的动画通过不断重绘实现，每次重绘相当于创建动画的一帧，以小于 0.1s 的时间间隔重绘，就可以看到连续的动画效果。

***优点：\***动画性能优。

***缺点：\***实现成本较大，适用于页面动画元素较多时。

##### tips

​	1）、实现步骤主要是创建绘制函数 （drawFunction）、调用重绘方法**。**canvas绘制的图像不占dom,完全依赖脚本绘制。

​	2）、canvas绘制的图形不能像dom一样绑定一些点击事件，如果需要对绘制的图形进行交互操作比如点击，可以根据点击的坐标进行判断。

```
// 把需要点击的元素存在数组中
let clickElements = [a, b, c, d]

function onClick(clientX, clinetY) {
    clickElements.forEach((element) => {
        if (
            clinetY > element.top
            && clinetY < element.top + element.height
            && clientX > clientX.left
            && clientX < element.left + element.width
        ) {
            // 选中物体，进行一些操作
        }
    })
}
```





### 动图apng/gif/webp

​	H5页面承载动图的方式相对其他方法，是最省成本，最为简便的。只需要以背景图片/内容图片的形式在页面上进行引用即可。

​	它们自身在压缩性、适用场景、兼容性等方面有些许区别，这里单独做下分析。

#### GIF

​		比较常用的一种动画方式，是图片序列帧的一种呈现方式，制作方式一般是将很多个png序列帧放在ps中导出gif。

​	GIF图片擅长于制作细节的小动画，位图，优势在于 “体型”很小，可压缩，制作成本低，以图片的形态适用于各种操作系统，无兼容性的后顾之忧。

​	***优点：\***对于小动画使用方便。优秀的压缩算法使其在一定程度上保证图像质量的同时将体积变得很小。

​	***缺点：\***自定义播放，包括控制播放速度、播放次数、重复帧位置等需要引入[libgif](https://www.npmjs.com/package/libgif)库；复杂动画生成的gif图片较大，且耗内存比较严重；需要为各种屏幕尺寸、分辨率做适配。

#### Apng

​	Apng 其实就是png。APNG是Mozilla在2008年发布的图片格式，本质上是在PNG的基础上加上一个扩展。

​	***优点：\***在iOS上的WebView里面是除GIF外，唯一官方支持的动图格式，因此如果做移动端开发需要WebView页引入动图，APNG还是必不可少的。

​	***缺点：\***压缩算法差，存在兼容性问题。Android平台的WebView也没有原生支持**。**

​	这里看一个[apng与gif图的对比](https://apng.onevcat.com/demo/)**，****GIF的图片带上透明度以后，边缘会出现明显的锯齿**。原因是GIF的alpha通道只有1bit，一个像素要么完全透明，要么完全不透明，不像现在PNG的RGBA的8bit alpha通道，alpha值也可以和RGB一样都有255个透明值。这导致了所有所以需要展示带透明度的动图，GIF基本上可以不考虑**。**



##### 介绍

GIF 经常会有杂边。APNG（Animated Portable Network Graphics）是基于 PNG 格式扩展的一种动画格式，增加了对动画图像的支持，同时加入了 24 位图像和 8 位 Alpha 透明度的支持。看下 APNG 和 GIF 的对比效果：

![clock.gif](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-jF4Bkv.webp)![clock.png](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-gWQs55.png)

 APNG 和 GIF 的大小虽然相差不大，但是 APNG 要比 GIF 清晰的多，并且没有杂边。

对于不兼容的浏览器，APNG会显示为动画的第一帧。

###### 数据格式

png的数据格式：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-17-29-image-20231214172917571.png" alt="image-20231214172917571" style="zoom:33%;" />

主要分为 4 部分：

- PNG Signature 是文件标识，用于校验文件格式是否为 PNG。内容固定为：

  ```javascript
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
  ```

- IHDR 是文件头数据块，包含 PNG 图像的基本信息，例如图像的宽高等信息

- IDAT 是图像数据块，最核心，存储具体的图像数据

- IEND 是结束数据块，标示图像结束



APNG 的数据格式：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-17-39-image-20231214173905380.png" alt="image-20231214173905380" style="zoom:50%;" />

APNG 在 PNG 的基础上增加了 acTL、fcTL 和 fdAT 3 种模块

- acTL：必须在第一个 IDAT 块之前，用于告诉解析器这是一个动画格式的 PNG，包含动画帧总数和循环次数的信息，**意味着可以通过这个字段来判断是否为 APNG 的图像格式**。
- fcTL：帧控制块，每一帧都必须有的，属于 PNG 规范中的辅助块，包含了当前帧的序列号、图像的宽高。
- fdAT：帧数据块，和 IDAT 意义相同，都是图像数据。但是比 IDAT 多了帧的序列号，因为动画存在多帧。图中可以看到第一帧的图像数据依然叫做 IDAT，第 2 帧以后才叫 fdAT，这是因为第一帧和 PNG 数据的格式保持相同。在不支持 APNG 的浏览器上，可以降级为静态图片，只展示第一帧。



###### apng性能

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-17-43-image-20231214174306894.png" alt="image-20231214174306894" style="zoom:50%;" />

生成 APNG 前，APNG 会通过算法计算帧之间的差异，只存储帧之前的差异，而不是存储全帧。如下，第 2、3、4 帧都没有表盘部分了。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-17-43-image-20231214174324181.png" alt="image-20231214174324181" style="zoom:50%;" />

APNG 文件存储多帧数据会很大，所以建议使用比较小的动画场景上。如果场景合适，也可以放一张静态图在底部，待 APNG 加载完毕后替换，不过这种需要第一帧是可以对用户静态展示的。





##### 使用

###### Img(❌)

平时我们使用 APNG 方式如下，非常简单：

```html
<img src="xxx.png" />
```

但是直接使用 `img` 标签存在 2 个问题：

1. apng 在页面上只能播放一次，所以如果一个动画需要重复播放，需要每次给动画连接添加时间戳，让浏览器认为是一个新的连接，或者让设计师导出一张会循环的apng。
2. 一个非常大的坑，在 Safari for iOS（Safari for macOS正常）预览 APNG 的时候，动图的循环次数为对应原图的 `loop` + 1。比如 APNG 有 10帧，`loop` 为 2，那么会循环总计展示 30 帧。如果我们的动画只想播放一次的话，那就糟糕了。
3. apng 的动画时间无法控制，很难实现中途暂停，衔接等操作 如上所述，我们可以借助 `apng-canvas`，将其转成 canvas ，然后以使用 canvas 的方式使用它。得物团队在 apng-canvas 的基础上进行了魔改，增加了一些对 canvas 播放的控制能力，例如：控制 apng 的播放速度 和播放次数、监听播放完成的事件等等，使其更加便于使用。





######  apng-canvas✅

 [apng-canvas](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdavidmz%2Fapng-canvas) 。该库需要以下支持才能运行：

- [Canvas](https://link.juejin.cn?target=http%3A%2F%2Fcaniuse.com%2F%23feat%3Dcanvas)
- [Typed Arrays](https://link.juejin.cn?target=http%3A%2F%2Fcaniuse.com%2F%23feat%3Dtypedarrays)
- [Blob URLs](https://link.juejin.cn?target=http%3A%2F%2Fcaniuse.com%2F%23feat%3Dbloburls)
- [requestAnimationFrame](https://link.juejin.cn?target=http%3A%2F%2Fcaniuse.com%2F%23feat%3Drequestanimationframe)

接下来带大家看一下 `apng-canvas` 库是如何实现 APNG 正常播放的，主要分为 3 个步骤：

1. 解析 APNG 数据格式（按照 1.2 小节的 APNG 图片格式）。
2. 将解析好的 APNG 数据进行整理。
3. 按照每一帧的间隔时长，通过 [requestAnimationFrame](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame) 进行绘制每一帧。

[apng-canvas](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdavidmz%2Fapng-canvas) 解码比较耗时，如果动画是进页面就展示的，会增加页面阻塞时间。笔者尝试过放到Web Worker 中解析，可以节省耗时 100ms 左右。



kapng跟这个原理差不多，也是parser 之后 raf + canvas。





##### APNG 兼容性检测

在实际应用中如何检测浏览器是够支持 APNG，可以通过如下方法：

```javascript
(function() {
	"use strict";
	var apngTest = new Image(),
	ctx = document.createElement("canvas").getContext("2d");
	apngTest.onload = function () {
		ctx.drawImage(apngTest, 0, 0);
		self.APNG = ( ctx.getImageData(0, 0, 1, 1).data[3] === 0 );
	};
	apngTest.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJRU5ErkJggg==";
	// frame 1 (skipped on apng-supporting browsers): [0, 0, 0, 255]
	// frame 2: [0, 0, 0, 0]
}());
```

1. 加载一张 1x1 像素大小的 Base64 编码图片，图像有 2 帧数据，区分就是每一帧最后一个值不同。

   ```javascript
   javascript
   复制代码// frame 1 (skipped on apng-supporting browsers): [0, 0, 0, 255]
   // frame 2: [0, 0, 0, 0]
   ```

2. 将其绘制到画布中，通过 [getImageData()](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FCanvasRenderingContext2D%2FgetImageData) 方法去获取该图片的像素数据，主要是获取 `data[3]` 的 Alpha 透明通道（值的范围：0 - 255）。在不支持 APNG 的浏览器上会降级只显示第一帧，因此 `data[3]` 会等于 255。在支持 APNG 的浏览器上最终会显示第 2 帧，因此 `data[3]` 会等于 0，则表示支持 APNG。







##### `apng-canvas`库如何绘制每一帧

APNG 的绘制，主要是<mark>通过 `requestAnimationFrame` 不断的调用 `renderFrame` 方法绘制每一帧</mark>，每一帧的图像、宽高、位置我们都在上一节中获取到了。 `requestAnimationFrame` 在正常情况下能达到 60 fps（每隔 16.7ms 左右），在上一节中提过 `playTime` 这个字段，是每一帧的绘制时间。所以，并不是 `requestAnimationFrame` 每次都会去绘制，而是通过 `playTime` 计算 `nextRenderTime` （下次绘制时间），达到这个时间再绘制。避免无用的绘制，对性能造成影响。代码如下：

```javascript
const renderFrame = function (now) {
    if (nextRenderTime === 0) nextRenderTime = now;
    while (now > nextRenderTime + ani.playTime) nextRenderTime += ani.playTime;
    nextRenderTime += frame.delay;
};

const tick = function (now) {
    while (played && nextRenderTime <= now) renderFrame(now);
    if (played) requestAnimationFrame(tick);
};
```

<mark>具体的绘制是采用 Canvas 2D 的 API 实现。</mark>

```js
const renderFrame = function (now) {
    const f = fNum++ % ani.frames.length;
    const frame = ani.frames[f];
 
    if (prevF && prevF.disposeOp === 1) { // 清空上一帧区域的底图
        ctx.clearRect(prevF.left, prevF.top, prevF.width, prevF.height);
    } else if (prevF && prevF.disposeOp === 2) { // 恢复为上一帧绘制之前的底图
        ctx.putImageData(prevF.iData, prevF.left, prevF.top);
    } // 0 则直接绘制

    const {
        left, top, width, height,
        img, disposeOp, blendOp
    } = frame;
    prevF = frame;
    prevF.iData = null;
    if (disposeOp === 2) { // 存储当前的绘制底图，用于下一帧绘制前恢复该数据
        prevF.iData = ctx.getImageData(left, top, width, height);
    }
    if (blendOp === 0) { // 清空当前帧区域的底图
        ctx.clearRect(left, top, width, height);
    }

    ctx.drawImage(img, left, top); // 绘制当前帧图片

    // 下一帧的绘制时间
    if (nextRenderTime === 0) nextRenderTime = now;
    nextRenderTime += frame.delay; // delay为帧间隔时间
};
```

从上面的绘制代码中，我们可以看到 `blendOp` 和 `disposeOp` 2个字段决定了是否复用绘制过的帧数据。2 个字段对应的配置参数信息如下：

- ```
  disposeOp
  ```

   指定了下一帧绘制之前对缓冲区的操作

  - 0：不清空画布，直接把新的图像数据渲染到画布指定的区域
  - 1：在渲染下一帧前将当前帧的区域内的画布清空为默认背景色
  - 2：在渲染下一帧前将画布的当前帧区域内恢复为上一帧绘制后的结果

- ```
  blendOp
  ```

   指定了绘制当前帧之前对缓冲区的操作

  - 0：表示清除当前区域再绘制
  - 1：表示不清除直接绘制当前区域，图像叠加

对应时钟 4 帧绘制流程如下：

- 第一帧:
  - blendOp：0 绘制当前帧之前，清除当前区域再绘制
  - disposeOp：0 不清空画布，直接把新的图像数据渲染到画布指定的区域
- 第二帧:
  - blendOp：1 绘制当前帧之前，表示不清除直接绘制当前区域，图像叠加
  - disposeOp：0 不清空画布，直接把新的图像数据渲染到画布指定的区域
- 第三帧:
  - blendOp：1 绘制当前帧之前，表示不清除直接绘制当前区域，图像叠加
  - disposeOp：2 渲染下一帧前将画布的当前帧区域内恢复为上一帧绘制后的结果（因为第4张图覆盖的是第二张图的红色线条，所以第三张图动完要回到第2帧）
- 第四帧:
  - blendOp：1 绘制当前帧之前，表示不清除直接绘制当前区域，图像叠加
  - disposeOp：0 不清空画布，直接把新的图像数据渲染到画布指定的区域









#### webp

​	WebP是Google在2010年发布的图片格式，完全开源，在Chrome，Android上得到了原生的支持。

​	优点：WebP 图像通常比它们的对应图像更小，但质量相同，WebP 无损压缩比 PNG小 26% ，有损压缩比 JPEG小 25-34% 。这个优点可以让资源文件小、加载时间变快。 缺点：对比apng 和 webp的兼容性，看到ios机器兼容性apang优于webp,因此目前在实际开发中，只能在图片大小 和 兼容性方面做取舍选择apng。



### 上述方式总结

##### 适用场景总结

apng/透明视频/lottie 如何选型 ---  看内存占用和实现效果，有的效果是lottie无法实现的，有的效果是视频占用的内存比apng/lottie要小(比如卡合成动画)。（不同的资源格式占用的内存肯定不一样，至于哪种格式占用的内存大就得看实现的效果）

至于要不要用css去搞那就看投入产出比了，css写肯定是性能最高，但是开发效率最慢。



**1）、css实现动画总结：** 如果只是一些简单的动画效果（可以通过位移、变形实现的动画），直接用css实现是最方便的。

**2）、SVGA/lottie动画：**能够完美还原设计师在AE上制作的动画，大幅度节省开发，联调动效时间，常用于展示类型的动画，需要交互的元素酌情使用，大部分场景推荐使用。

**3）、帧动画总结：**帧动画实现的效果较为自然，各种效果也都能实现，但受到图片大小的限制，比较适用于小型物体帧数较少的动画，比如手势动作，点击后触发的一些动画效果等。因为如果帧数过多，图片较大，对手机的渲染有压力。

**4）、视频动画总结：**技术上不好实现的特效可以做成视频，但是视频的播放在移动端往往会遇到一些坑，也要考虑视频的大小，按需做预加载，并且在移动端通常需要点击才能播放视频。

**5）、动图实现动画总结：**这一类动画和帧动画一样，受到图片大小的限制，适用于小型物体的动画，比如裂变场景下挂件的动图，依赖配置，还有一些红包小icon的动图，区别就是动图实现的动画只能循环播放，帧动画可以控制。虽然webP压缩性更好，但是目前考虑到apng在ios的兼容性优于webp。所以在实际项目中apang的使用场景更多。

**6）、canvas:** canvas实现动画性能优秀，当页面动画元素较多可以考虑，但是实现成本大。



##### 其他维度总结

![image-20230705200125080](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-05-20-01-image-20230705200125080.png)

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-14-20-01-image-20231214200111523.png" alt="image-20231214200111523" style="zoom:50%;" />

![image-20230428120224415](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-28-12-02-image-20230428120224415.png)

1. 矢量动画(Lottie)：Lottie矢量动画压缩率很高，但其无法显示特殊效果（比如粒子特效）；
2. 动图方案(GIF、Apng、Webp)：GIF只支持8位颜色，颜色丢失严重，解码性能低，无法满足特效效果；Apng, Webp虽然能够满足特效效果，但文件较大，软解效率低，资源加载缓慢，容易引起体验问题；
3. 视频方案(mp4)：采用H264编码，相比动图方案，有很高的压缩率，硬件解码效率很高，缺点很明显。



#### **从动画类型出发讨论动画的实现方式：**

**（1）逐帧动画(序列帧动画)**

由于是一帧一帧的画，所以逐帧动画具有非常大的灵活性

- GIF实现
- CSS实现（animation）
- JS+DOM实现
- JS+canvas实现

**（2）补间动画(Tween动画\关键帧动画)**

- CSS实现（transition、animation等）使用一些缓动函数
- JS实现

**（3）SVG动画**

- 使用 XML 格式定义图形
- 可以用AI等SVG编辑工具生成SVG图片后，配合anime.js、GSAP等现有库进行动画制作

**（4）骨骼动画**

- 一般采用Spine、DragonBones等工具导出相应资源图片和JSON动画配置资源后使用。

**（5）3D动画**

- DOM操作用CSS 3D实现。（perspective属性、[css3d-engine](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fshrekshrek%2Fcss3d-engine)）
- 场景搭建用webGL(Three.js等)
- 3D模型动画用Blender或maya等制作完成后导出使用





### 骨骼动画spine

##### 介绍

首先 骨骼动画 是一种概念，一种用于在计算机图形和动画中模拟运动的技术。就是指动画的效果是像我们实际物体是有骨骼的那样运动。那么你用任何手段达成这个效果都是可以的，比如css、js、canvas....

其次 最方便的骨骼动画的交付流程是 通过spine，即动效设计师 利用专业软件搞完动效后导出成 glTF 格式，然后开发直接同spine-player进行操作。一般有 3D 和 2D 骨骼动画两种类型，3D 骨骼动画一般用 3ds Max 来制作，2D 骨骼动画一般用 Spine Editor 制作。

**骨骼动画**由 Maya、C4D 等专业 3D 美术软件制作，导出成 glTF 格式，其中包含了骨架与蒙皮信息。骨架由多个骨骼组成，通过 4x4 的矩阵来驱动每根骨骼的旋转等变换，骨架带动蒙皮，蒙皮通过不同的权重系数影响了顶点位置的变化，最后大家看到效果就是顶点位移后的效果。要注意在移动端骨骼数是有限制的，超出之后部分骨骼动画将无法播放。2D&3D都可。

业界比较好的骨骼动画方案：

- spine只支持2D: https://zh.esotericsoftware.com/spine-player 、 https://github.com/EsotericSoftware/spine-runtimes/tree/4.1/spine-ts，落到web应该要么canvas or webgl
- DragonBones



3D的可以用快手的crab引擎，感觉3D游戏才用的上吧，普通的小游戏和活动用2D就行了（dyc感觉是只能沿Z轴动的是2D，能沿xyz轴动的是3D）





##### 与lottie区别

- 骨骼动画适用于需要实现更加灵活、复杂的动画效果，比如角色动画、物体变形动画等。它可以对角色的骨架进行精细控制，实现更加真实、流畅的动画效果。但是，骨骼动画需要一定的制作技能和经验，制作周期较长，适用于需要更高质量、更复杂动画效果的项目。
- Lottie动画是一种轻量级的矢量动画技术，适用于实现简单、重复的动画效果，比如按钮点击动画、图标加载动画等。Lottie动画可以通过简单的代码或者工具的方式实现制作，适用于项目周期短、需要快速迭代的项目。





### 粒子动画

**粒子动画** 的实现重点在于把大量计算从 CPU 转移到 GPU 并行计算，CPU 通过每帧输入一个最简单的时间值给 GPU 来实现每个粒子的位置、旋转角度、透明度、贴图UV等数值的更新，它的算法很简单，就是中学物理中的匀变速运动。

可以用快手的crab引擎



通常用于表现<font color="red">大量单位</font>以一定规则变化的效果，比如雪、落叶和流星拖尾等等。**粒子动画是由在一定范围内随机生成的大量粒子产生运动而组成的动画，被广泛运用于模拟天气系统、烟雾光效等方面。在电商平台的微型游戏化场景中，粒子动画主要 用于呈现在能量收集、金币收集时的特效。**

### **图形类动画**

这类动画一般是实现一些无需图片素材，仅通过图形来实现的效果，例如：折线图增加一些动画、一些多边形效果等，一般我们会选择以下两种方式来开发：

- Css: https://chartscss.org/
- canvas：逐帧绘制一些基础的图形和动画
- svg：因为可以动态生成 svg 代码并展示，一般用来应对一些「动态化」、「模板化」绘制的场景

当然也可以参考一些开源的图标库，例如：

- echart：https://echarts.apache.org/zh/index.html
- d3：https://d3js.org/

但由于这类库的体积一般比较大，且冗余的功能比较多，最好别在C端项目中直接使用。







### 实践

#### 状态平滑切换的动画

利用**animation-play-state: paused**属性

如果是想一开始没有动画：先给元素加上动画并添加**animation-play-state: paused**属性让动画暂停。再在状态切换（比如hover）的时候让动画动起来。

如果是一开始有动画，状态切换（比如hover）的时候暂停动画，则给元素加上动画，然后状态切换时暂停。



#### 打字动画

核心思路就是让容器的宽度成为动画的主体：把所有文本包裹在这个容器中，然后让它的宽度从 0 开始以步进动画的方式、一个字一个字地扩张到它应有的宽度。（理论上来说，我们也可以让多行文本实现这种动画效果，但这样一来就需要给每一行文本包一层容器，同时还要维护合适的动画延时（也就是说，整件事情得不偿失）。）

```css
@keyframes typing {
	from { width: 0 }
}

@keyframes caret {
	50% { border-right-color: transparent; }
}

h1 {
	font: bold 200% Consolas, Monaco, monospace;
	width: 15ch; /*ch 单位表示“0”字形的宽度。在等宽字体中，“0”字形的宽度和其他所有字形的宽度是一样的。因 此，如果我们用 ch 单位来表达这个标题的宽度*/
	white-space: nowrap;
	overflow: hidden;
	border-right: .05em solid;
	animation: typing 8s steps(15),
	           caret 1s steps(1) infinite;
}
```

这个动画现在的表现相当完美，不过还不是很易于维护：需要根据每个标题的字数来给它们分别指定不同的宽度样式。显然，这种场景正是 JavaScript 的用武之地。



#### 沿环形路径平移的动画

解决方法一：

用两个元素分别做旋转

```css
@keyframes spin {
 to { transform: rotate(1turn); }
}
.avatar {
 animation: spin 3s infinite linear;
 transform-origin: 50% 150px; /* 150px = 路径的半径 */
}
.avatar > img {
 animation: inherit;
 animation-direction: reverse; }
```

效果：https://dabblet.com/gist/87d80a51a5294ec07aea



解决方法二：

原理：变形函数并不是只对这个元素进行变形，而且会把整个元素的坐标系统进行变形，从而影响所有后续的变形操作。这也说明了为什么变形函数的顺序是很重要的。

```css
@keyframes spin {
	from {
		transform: rotate(0turn)
		           translateY(-150px) translateY(50%)
		           rotate(1turn)
	}
	to {
		transform: rotate(1turn)
		           translateY(-150px) translateY(50%)
		           rotate(0turn);
	}
}


.avatar {
	animation: spin 3s infinite linear;
}
```

效果：https://dabblet.com/gist/6c647a5599dc11145f2c





## 让您的网站变得很炫酷

### **文档类**

https://learnopengl.com/Introduction

https://thebookofshaders.com/

https://sites.cs.ucsb.edu/~lingqi/teaching/#teaching

https://developer.nvidia.com/gpugems/gpugems/foreword

https://pbrt.org/

https://iquilezles.org/index.html

https://learnxinyminutes.com/

### **素材类**

https://www.vantajs.com/?effect=halo

https://tympanus.net/codrops/

http://www.shadedrelief.com/natural3/pages/textures.html

https://www.solarsystemscope.com/textures/

https://tb.rg-adguard.net/public.php

### **展示类**

https://hepengwei.cn/#/html/visualDesign

https://www.shadertoy.com/

https://codepen.io/Yakudoo/pen/YXxmYR

https://lab.miguelmota.com/threejs-earth/

### **工具类**

https://nl.hideproxy.me/go.php?u=2ljqM%2BZacOCnSm8g%2Fx%2BnLKTt6F5j1vKL9A%3D%3D&b=0&f=norefer

https://zh.lmgtfy.app/

http://browserhacks.com/

https://jex.im/regulex/#!flags=&re=%5E(a%7Cb)*%3F%24

https://css-doodle.com/ 有意思的用CSS画图工具

https://github.com/facebookincubator/FBX2glTF  

### **教程类**

https://csscoco.com/inspiration/#/ 一系列CSS实现灵感效果教程集合 作者[chokcoco](https://github.com/chokcoco/CSS-Inspiration/commits?author=chokcoco)

### **聚合**

https://www.kawabangga.com/collection

https://coolshell.cn/articles/4990.html





## 动效测试

### devtool调试

####  Layers

打开chrome控制台 -> More Tools -> Layers

![image-20230909163743013](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-16-37-image-20230909163743013.png)

当我们选中Layers里面的某一层时，就可以看到几个关键信息：产生合成层的原因/占据内存是多少、以及绘制次数。这里会涉及到几个点需要大家在写动画的时候注意：

- 层产生原因为overlap other compositing layers xxx ->  某个非合成层元素因为层级关系(z-index)覆盖在合成层元素导致的，这个需要看看是否能调整覆盖关系
- 动画元素只有一小部分，但形成的合成确是半个页面 -> 合理减少绘画区域
- 某个元素是静止的，Paint Count却一直在增加 -> 通常也是因为原因1导致
- Paint Count 每秒飞速的在自增 -> 如果是JS动画，要看是否有不合理的re-render





#### Rendering

打开chrome控制台 -> More Tools -> Layer/Rendering

![image-20230909163121444](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-16-31-image-20230909163121444.png)







####  Animations

打开chrome控制台 -> More Tools -> Layer/Animations

 Animations里面展示的动画都为CSS动画，通过JS + Raf调用去控制的JS动画是不会出现在Animations里面。

![image-20230909164054907](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-16-40-image-20230909164054907.png)



### 性能测试

性能测试主要关注几个指标：

- Frame Rate
- 资源体积
- 内存占用
- 手机发烫情况

#### **Frame Rate**

目前这个数据缺乏有效的线上数据收集手段，只能查看实验室数据，打开相关调试工具：打开chrome控制台 -> More Tools -> Rendering，

勾选<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-29-18-03-image-20240129180354224.png" alt="image-20240129180354224" style="zoom:33%;" />即可看到<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-29-18-04-image-20240129180418251.png" alt="image-20240129180418251" style="zoom:33%;" />。

一般推荐 FPS 保持在 60 为最佳











#### **资源体积**

资源体积可能对 FMP/FCP 等性能指标会产生影响，实验室数据可以看 devtools 里的 lighthouse 或者 performance数据。可以通过以下方式进行优化：

- 压缩资源

- - 例如使用 tinypng 压缩图片体积，使用 ffmpeg 压缩视频码率等等，尽量使用无损压缩
  - 使用合适的资源格式，例如 APNG 替代 PNGs

- 预加载

- - 例如使用离线包、非首屏内容 request idle 时预加载等方式

- 延迟加载

- - 例如非首屏资源懒加载

#### **内存占用**

一般动效（尤其是序列帧）所用的图片等资源较多，极有可能大量占用系统内存，引起 OOM 导致 APP 崩溃，所以内存占用情况也需要测试。

目前这部分也缺乏有效的线上数据，可以使用eva来收集实验室数据，参考：快手内网搜[如何使用Eva]，目前虽然不支持 iOS 的内存数据获取，但Android的数据可以做个参考。

当发现内存有明显问题时（例如：4G内存的手机，webview占用内存超过 1G，崩溃的情况可能就会很普遍），需要做一些优化。

优化的本质是减少页面使用资源的字节数，例如：

- 减少序列帧帧数
- 缩小图片尺寸
- 减少同时存在的动效数
- 尽量使用其他可选方案替代序列帧
- 减少 Layers 数量和尺寸
- 排查是否有 JS 内存泄露

#### **手机发烫情况**

keep里有手机温度的数据，但由于影响因素太多，推荐还是实验室场景靠人来感受。

一般有明显发烫的情况，主要是 CPU/GPU 运算量太大导致，可以选择：

- 优化算法复杂度

- 减少计算

- - 例如锁30FPS 降低计算频率
  - 通过预运算等手段减少一些运行时的实时计算
  - 非焦点内容减少计算或不做计算



## **动效降级**

由于不同设备性能不一，最好动效可以针对不同的设备类型做一些降级的方案。

一般以下的机型需要引起注意

- 高崩溃机型：从UA侧拿到的icfo字段下发

- 低端机：

- - UA中存在islp字段
  - 或者从UA中判断安装包为32位包

这类机型的特点是：

- 内存小
- CPU / GPU 性能不行

可以结合上面提到的内存和处理器的优化策略，适当砍掉一些动效，比如：只保留极少帧数的序列帧动画、砍掉所有 CPU/GPU 不友好的动画，适当保留一些简单的 CSS 动效等。



## **动效设计流程**

了解了大致的动效分类后，我们需要了解下大致的动效生产及交付流程，以便我们知道我们最终拿到的交付产物可能有哪些。

设计师有以下角色分工：

- 交互设计师：参与完成对产品与它的使用者之间的互动机制进行分析、预测、定义、规划、描述和探索的过程的设计师，产出交互稿
- UI 设计师：从事对软件的人机交互、操作逻辑、界面美观的整体设计工作的人，产出UI稿
- 视觉设计师：职责为创建视觉元素，以实现特定目标的目的。这些目标可以包括提高产品销售、增加品牌知名度、提高用户体验等。产出视觉稿，一般为：图片、序列帧、3D 模型、2D 骨骼动画的贴图
- 动效设计师：负责在视频和数字产品中，添加相关的动画以及运动效果设计。产出动效稿，一般为：2D & 3D 骨骼动画、Lottie、粒子

一般的设计师合作流程如下：

![image-20230909154002015](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-15-40-image-20230909154002015.png)





## 游戏

### 基础

H5 游戏开发的核心在于精灵图绘制、模拟真实世界的物理效果、碰撞检测、点选等，掌握了这些基本已经攻克了大部分难点。





### 痛点

在活动场景中：

游戏往往是作为一个完整的需求的一部分。在一个web页面中，除了游戏场景外还伴生着很多的传统页面元素的渲染和交互。且游戏场景中即时状态修改不会特别频繁（类似高频操作类），而基本都是线性的弱人机交互。

H5 采用 Canvas 做游戏方面的开发，主要原因在于性能和游戏引擎的支持，比如 Phaser、Pixi.js、CreateJS、Cocos2d-js 等。而当前端开发者沉浸于DSL开发时（比如我们团队就是以react为基础技术栈），PixiJS、Eva.js并没有提供一套与之对应的DSL开发模式。这就使得我们遭遇了几个重点难题：

**痛点1**、无法高效的去绘制一些界面内容，各种元素的绘制都需要append节点来做，非常低效，而为了解决这个问题。我们尝试将一个需求拆解为DOM层和游戏层这种分层设计，这样确实可以最大程度利用DOM的高效排版能力。可是这又带来了另外的问题：

**痛点2**、当react和这些渲染引擎的代码穿插出现在业务中的时候，往往带来的代码管理成本是非常高的。比如状态管理就无法在游戏侧和UI侧同时共享；

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-15-11-20-image-20231215112005637.png" alt="image-20231215112005637" style="zoom:25%;" />

以一个卡牌类桌游场景为例。于是就有了以下这种很棘手的开发流程

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-15-11-20-image-20231215112034565.png" alt="image-20231215112034565" style="zoom:25%;" />

**痛点3**、除此之外，代码里也需要有大量的订阅发布、面向对象开发、甚至有时需要单独维护一套状态机。在使用Eva.js的过程中，我们还需要遵循ECS的架构思路来安排自己的代码。这一切，都与DSL有所割裂。而完全在需求中摒弃DSL却又会导致开发效率的直线下滑。



### 素材资源

https://opengameart.org/

https://kenney.nl/assets

### 库

手子推币机用的物理引擎：https://github.com/liabru/matter-js







# 实战

### 最佳实践

由层叠概念引申出：

少用id选择器

不用!important

自己的样式在引用库样式的后面加载







### 查错

![image-20220429163658837](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//css/知识/查错.png)











### iconfont svg的使用注意事项

```css
/*要给svg加上这个类才可以使用font-size来调整svg的大小*/
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/*去掉svg标签里的fill属性才可以使用color来控制其颜色*/
```





### 实现表格单双行条纹样式

```css
tr:nth-child(2n) {
  background-color: red;
}

tr:nth-child(2n + 1) {
  background-color: blue;
}
```



### 如何使用 CSS 实现网站的暗黑模式 (Dark Mode)

[几行代码就能搞定](https://segmentfault.com/a/1190000023598551)





### 如何自定义滚动条的样式

滚动条相关样式都是伪元素，以 `scrollbar` 打头

- `::-webkit-scrollbar` — 整个滚动条.
- `::-webkit-scrollbar-button` — 滚动条上的按钮 (上下箭头).
- `::-webkit-scrollbar-thumb` — 滚动条上的滚动滑块.
- `::-webkit-scrollbar-track` — 滚动条轨道.
- `::-webkit-scrollbar-track-piece` — 滚动条没有滑块的轨道部分.
- `::-webkit-scrollbar-corner` — 当同时有垂直滚动条和水平滚动条时交汇的部分.
- `::-webkit-resizer` — 某些元素的 corner 部分的部分样式(例:textarea 的可拖动按钮).



但最常用的是以下几个伪元素：**滚动条、滑块、轨道**

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 1);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
```



### CSS 如何设置方格背景

```css
background: linear-gradient(90deg, rgba(200, 200, 200, 0.1) 3%, transparent 0),
  linear-gradient(rgba(200, 200, 200, 0.1) 3%, transparent 0);
background-size: 20px 20px;
```



### normalize.css 与 reset.css 

- [normalize.css](https://necolas.github.io/normalize.css/): 会保留有用的样式，比如 h1 的字体大小
- [reset.css](https://github.com/jgthms/minireset.css/blob/master/minireset.css): 把所有样式都重置，比如 h1、h2、h3 的字体大小都进行了重置，保持了无样式



### 用 *css* 或 *js* 实现多行文本溢出省略效果

CSS 实现方式

单行：

```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
复制代码
```

多行：

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; //行数
overflow: hidden;
复制代码
```

兼容：

```css
p{position: relative; line-height: 20px; max-height: 40px;overflow: hidden;}
p::after{content: "..."; position: absolute; bottom: 0; right: 0; padding-left: 40px;
background: -webkit-linear-gradient(left, transparent, #fff 55%);
background: -o-linear-gradient(right, transparent, #fff 55%);
background: -moz-linear-gradient(right, transparent, #fff 55%);
background: linear-gradient(to right, transparent, #fff 55%);
}
复制代码
```

JS 实现方式：

- 使用split + 正则表达式将单词与单个文字切割出来存入words
- 加上 '...'
- 判断scrollHeight与clientHeight，超出的话就从words中pop一个出来





## 工作时应用

#### 基于背景图进行定位时

如果要求元素一直位于背景图的中间，可以外层包一个跟背景图一样宽的盒子（这个盒子一直保持跟背景图的宽一样），然后使里面的盒子居中即可。



#### 动态背景图

Vue在style中动态插入背景图的链接貌似有问题，那就写几个不同背景图的类，然后在元素上动态插入相应的类。

```
    .check-in-title {
        background: url('./assets/check-in-title.png') no-repeat center / contain;
    }
    .stay-to-bet-title {
        background: url('./assets/stay-to-bet-title.png') no-repeat center / contain;
    }
```





#### 产生主色调的亮色和暗色变体

只要把半透明的黑色或白色叠加在主色调上，即可产生主色调的亮色和暗色变体。

```
background: #58a linear-gradient(hsla(0,0%,100%,.2), transparent);
box-shadow:0 .05em .25em rgba(0,0,0,.5);
text-shadow: 0 -.05em .05em rgba(0,0,0,.5);
```







## 场景应用面试题

### 下拉菜单过渡

两种做法：分别见《深入解析CSS》第十四章 14.3、14.4

### 隐藏按钮上的文字并更换成一个符号

限制它的宽度，加上较大的文字缩进，并且将overflow设置成hidden，从而隐藏了按钮本身的文字。然后给按钮的：:after伪元素加上一个Unicode字符（\2261）作为内容。这个字符是一个数学符号，由三条横线组成，即汉堡包菜单。

### 用css画各种图形

[点开此链接](https://css-tricks.com/the-shapes-of-css/)

### 实现一个三角形

CSS绘制三角形主要用到的是border属性，也就是边框。

> 总体的原则就是通过上下左右边框来控制三角形的朝向，用边框的宽度来控制三角形的角度

平时在给盒子设置边框时，往往都设置很窄，就可能误以为边框是由矩形组成的。实际上，border属性是由三角形组成的，下面看一个例子：

```css
div {
    width: 0;
    height: 0;
    border: 100px solid;
    border-color: orange blue red green;
}
```

显示出来是这样的：![上面css展示的效果图](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-fA9Laj.webp)



```css
div {
    width: 0;
    height: 0;
    border-bottom: 50px solid red;
  	border-top: 0px solid transparent;/*与要画的三角形方向的相反的这个方向是用来控制三角形的偏移位置的*/
    border-right: 50px solid transparent;/*控制三角形的度数*/
    border-left: 50px solid transparent;/*控制三角形的度数*/
}
```

上面css展示效果：![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-1XxluP.webp)



```css
div {
    width: 0;
    height: 0;
    border-top: 100px solid red;
    border-right: 100px solid transparent;
}
```

上面css展示效果：![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-KF2FYv.webp)



### 实现一个扇形

用CSS实现扇形的思路和三角形基本一致，就是多了一个圆角的样式，实现一个90°的扇形：

```css
div{
    border: 100px solid transparent;
    width: 0;
    heigt: 0;
    border-radius: 100px;
    border-top-color: red;
}
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-AtBX0u.webp)

### 实现一个宽高自适应的正方形

- 使用[aspect-ratio](https://developer.mozilla.org/zh-CN/docs/Web/CSS/aspect-ratio)属性

- 利用vw来实现：

```css
.square {
  width: 10vw;
  height: 10vw;
  background: tomato;
}
```

- 较好的方法：利用元素的margin/padding百分比是相对父元素width的性质来实现：

```css
.square {
  width: 20%; //是父元素宽度20%
  height: 0;
  padding-top: 20%; //是父元素宽度20%
  background: orange;
}
```

- 利用定位使得在正方形上还能加入内容

  ```js
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        .outer { //这画了一个正方形
          padding-top: 50%;
          height: 0;
          background: #ccc;
          width: 50%;
          position: relative;
        }
  
        .inner { // 正方形上再覆盖一个正方形，这个正方形上就可以写东西
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: blue;
        }
      </style>
    </head>
    <body>
      <div class="outer">
        <div class="inner">hello</div>
      </div>
    </body>
  </html>
  
  ```

  

  

- 利用子元素的margin-top的值来实现：

```css
.square {
  width: 30%;
  overflow: hidden; /*原本互相嵌套的块级元素，子元素的margin-top会作用到父元素上，导致父元素一起往下移动。所以搞个bfc*/
  background: yellow;
}
.square::after {
  content: '';
  display: block;
  margin-top: 100%; /*子元素的margin-top会把父元素撑开*/
}
```





### 左右两个盒子，左盒子由内容撑开，右盒子自适应

- 利用浮动，左侧元素左浮动不设置宽度，右侧元素设置overflow: hidden; 这样右边就触发了BFC，BFC的区域不会与浮动元素发生重叠。

  ```css
  .left{
       height: 200px;
       background: red;
       float: left;
   }
   .right{
       height: 200px;
       background: blue;
       overflow: hidden;
   }
  ```

- 利用flex布局，将左边元素不设置宽度，将右边的元素设置为flex:1。

  ```css
  .outer {
    display: flex;
    height: 100px;
  }
  .left {
    background: tomato;
  }
  .right {
    flex: 1;
    background: gold;
  }
  
  ```







### 实现一个表盘

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
        /*表盘相关的样式*/
        .clock{
            position:relative;
            width:200px;
            height:200px;
            border:1px solid green;
            border-radius: 50%;
        }


        /*指针相关的样式，如果只是单纯想让时分秒针动起来（不是准确的时间）那只需要来个animation就好了，都不用js；但是如果要显示准确的时间，则要js操作，删掉animation样式*/
        .second{
            width:2px;
            height: 80px;
            background-color: red;
            position: absolute;
            top: 20px;
            left: 100px;
            transform-origin:left bottom; /*设置旋转中心*/
            /*animation: moves 60s steps(60) infinite;*/
        }
        .minute{
            width: 4px;
            height: 60px;
            background-color: aqua;
            position: absolute;
            top: 40px;
            left: 98px;
            transform-origin:left bottom; /*设置旋转中心*/
            /*animation: moves 3600s steps(3600) infinite;*/
        }
        .hour{
            width: 6px;
            height: 50px;
            background-color: black;
            position: absolute;
            top: 50px;
            left: 96px;
            transform-origin:left bottom; /*设置旋转中心*/
            /*animation: moves 216000s steps(216000) infinite;*/
        }
        /* @keyframes moves {
            from {
                transform: rotateZ(0deg);
            }
            to {
                transform: rotateZ(360deg);
            }
        } */

        /*刻度线相关的样式*/
        .line-hour li,
        .line-minute li {
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: left center;
            background-color: black;
            list-style: none;
        }
        .line-hour li {
            width: 10px;
            height: 2px;
        }
        .line-minute li {
            width: 5px;
            height: 2px;
        }

        /*数字相关的样式*/
        .number {
            position: absolute;
            height: 120px;
            width: 120px;
            left: 50%;
            top: 32%;
            transform: translate(-50%, -50%);
            font-size: 15px;
            }
            
            .number li {
            position: absolute;
            list-style: none;
            transform: translate(-50%, -50%);
        }


    </style>
  </head>
  <body>
    <div class="clock">
        <ul class="line-minute"></ul>
        <ul class="line-hour"></ul>
        <ol class="number"></ol>
        <div class="second"></div> 
        <div class="minute"></div>
        <div class="hour"></div>
    </div>

    <script>
    (function mounted() {
        this.drawLines('line-minute', 60, 90);
        this.drawLines('line-hour', 12, 85);
        this.drawNumbers('number')
        this.move() //js控制指针走动
    })()

    /** 画刻度线
     * wrap：刻度线的父容器
     * total：刻度线的总个数
     * translateX：刻度线在X轴方向的偏移量
     */
    function drawLines(className, total, translateX) {
        const gap = 360 / total;
        let strHtml = '';
        for (let i = 0; i < total; i++) {
        strHtml += `<li style="transform:rotate(${i * gap}deg) translate(${translateX}px,-50%);"></li>`;
        }
        const wrap = document.getElementsByClassName(className)[0];
        wrap.innerHTML = strHtml;
    }


    /*
   * 绘制时钟数字
   * @param className 父容器的类名
   */
    function drawNumbers(className) {
        const wrap = document.getElementsByClassName(className)[0];
        const radius = wrap.clientWidth / 2;
        console.log(wrap.clientWidth)
        let strHtml = '';
        for (let i = 1; i <= 12; i++) {
            const myAngle = ((i - 3) / 6) * Math.PI;

            const myX = radius + radius * Math.cos(myAngle); // x=r+rcos(θ)
            const myY = radius + radius * Math.sin(myAngle); // y=r+rsin(θ)
            strHtml += `<li style="left:${myX}px; top:${myY}px">${i}</li>`;
        }
        wrap.innerHTML = strHtml;
    }

    /*
   * 钟表走动，转动秒针、分针、时针
   */
    function move() {
        const domHour = document.getElementsByClassName('hour')[0];
        const domMin = document.getElementsByClassName('minute')[0];
        const domSec = document.getElementsByClassName('second')[0];

        setInterval(function() {
            const now = new Date();
            const hour = now.getHours();
            const min = now.getMinutes();
            const sec = now.getSeconds();

            const secAngle = sec * 6; // s*6
            const minAngle = min * 6 + sec * 0.1; // m*6+s*0.1
            const hourAngle = hour * 30 + min * 0.5; // h*30+m*0.5

            domSec.setAttribute('style', `transform:rotate(${secAngle}deg)`);
            domMin.setAttribute('style', `transform:rotate(${minAngle}deg)`);
            domHour.setAttribute('style', `transform:rotate(${hourAngle}deg)`);

            document.title = `${hour}:${min}:${sec}`;
        }, 1000);
    }
    </script>
  </body>
</html>
```





# 工程化

## 样式方案的意义

如果我们不用任何 CSS 工程方案，又会出现哪些问题呢？

1. **开发体验**欠佳。比如原生 CSS 不支持选择器的嵌套:

```css
// 选择器只能平铺，不能嵌套
.container .header .nav .title .text {
  color: blue;
}

.container .header .nav .box {
  color: blue;
  border: 1px solid grey;
}
```

2. **样式污染**问题。如果出现同样的类名，很容易造成不同的样式互相覆盖和污染。

```ts
// a.css
.container {
  color: red;
}

// b.css
// 很有可能覆盖 a.css 的样式！
.container {
  color: blue;
}
```

3. **浏览器兼容**问题。为了兼容不同的浏览器，我们需要对一些属性(如`transition`)加上不同的浏览器前缀，比如 `-webkit-`、`-moz-`、`-ms-`、`-o-`，意味着开发者要针对同一个样式属性写很多的冗余代码。

4. 打包后的**代码体积**问题。如果不用任何的 CSS 工程化方案，所有的 CSS 代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大。

针对如上原生 CSS 的痛点，社区中诞生了不少解决方案，常见的有 5 类。

1. `CSS 预处理器`：主流的包括`Sass/Scss`、`Less`和`Stylus`。这些方案各自定义了一套语法，让 CSS 也能使用嵌套规则，甚至能像编程语言一样定义变量、写条件判断和循环语句，大大增强了样式语言的灵活性，解决原生 CSS 的**开发体验问题**。
2. `CSS Modules`：能将 CSS 类名处理成哈希值，这样就可以避免同名的情况下**样式污染**的问题。
3. CSS 后处理器`PostCSS`，用来解析和处理 CSS 代码，可以实现的功能非常丰富，比如将 `px` 转换为 `rem`、根据目标浏览器情况自动加上类似于`--moz--`、`-o-`的属性前缀等等。
4. `CSS in JS` 方案，主流的包括`emotion`、`styled-components`等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含`CSS 预处理器`和 `CSS Modules` 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题。
5. CSS 原子化框架，如`Tailwind CSS`、`Windi CSS`，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 CSS **开发体验**的问题。







## 样式污染的问题



CSS本身没有命名空间的能力，这意味着一旦CSS样式生效就会直接作用于全局，所以页面很容易出现样式冲突。当出现样式冲突时，一般的解决方法是通过增加选择器权重值，或者使用官方的！import属性进行样式覆盖。后续的开发人员如果想要在此基础上进行修改，就只能不停地提高权重值。 

第一个解决方案是BEM命名规范，即块（block）、元素（element）、修饰符（modifier）三部分的首字母缩写，三部分之间使用__与--连接。 <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-28-16-08-image-20231228160847097.png" alt="image-20231228160847097" style="zoom:50%;" />

该方案通过约束选择器的命名方式来保证选择器的唯一性，从而避免样式冲突。虽然BEM命名规范在一定程度上解决了样式冲突问题，但它只是一个标准，没有工程化手段进行约束，需要开发人员主动遵守规范。它还存在其他问题，例如，选择器的命名会变得特别长，导致代码极其臃肿。

第二个解决方案是命名空间，开发人员需要为每个模块都分配唯一命名的选择器，将它作为父级选择器，该模块下的每个选择器都是该选择器的后代。 该方案和BEM一样存在编写麻烦的问题，但是该问题可以借助打包工具解决。 

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-28-16-09-image-20231228160940165.png" alt="image-20231228160940165" style="zoom:50%;" />



第三个解决方案是CSS Modules，它需要依赖打包构建工具。项目在打包时，会将所有的选择器后面都拼接上唯一的随机字符串，保证命名唯一，从而实现样式隔离（比如vue3）。 



第四个解决方案是CSS in JavaSoript，将CSS样式以变量的形式编写在JavaScript里。 

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-28-16-12-image-20231228161209669.png" alt="image-20231228161209669" style="zoom:50%;" />

第五个解决方案是Shadow DOM，它是由浏览器提供的解决方案。Shadow DOM允许将隐藏的DOM树附加到常规的DOM树中。它以shadow root节点为根节点，在根节点下方可以插入任意标签，其表现行为和普通的DOM树一样。Shadow DOM内部的所有样式设置都不会对外部造成影响，外部的所有样式设置也无法对其内部造成影响。（每一个页面都是一个shadow Dom是吧，反正目前没看到这种方法。）







## 工程架构



### css模块化

#### 简介

![image-20230504112056835](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-20-image-20230504112056835.png)

#### CSS Module

1. 文件名后缀中加module.css (module是一种约定, 表示需要开启css模块化)
2. 他会将你的所有类名进行一定规则的替换（将footer 替换成 _footer_i22st_1）
3. 同时创建一个映射对象{ footer: "_footer_i22st_1" }
4. 将替换过后的内容塞进style标签里然后放入到head标签中 (能够读到index.html的文件内容)
5. 将componentA.module.css内容进行全部抹除, 替换成JS脚本
6. 将创建的映射对象在脚本中进行默认导出





#### 通过命名规范实行假模块化

##### CSS 设计模式之 OOCSS

OOCSS 的全称为 Object Oriented CSS （面向对象的 CSS），它让我们可以使用向对象编程思想进行编写 CSS。

面向对象有三大特征：**封装、继承、多态** ，在 OOCSS 中，主要应用到了面向对象的**封装**和**继承**的思想。我们以掘金的下图这个部分来进行说明：

![item.png](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-3bMusH.webp)

图中画红色的部分，可以看成是有四个容器组成的，每个容器里面的内容又不一样。那么每个容器都有相同的样式，那么我们就可以进行**封装**。

把每一个容器封装成一个叫 `item` 的 `class` ，因为它们都有一些共同的样式。

```json
.item {
    position: relative;
    margin-right: 20px;
    font-size: 13px;
    line-height: 20px;
    color: #4e5969;
    flex-shrink: 0;
}
```

然后如果我们需要对它们每一项进行拓展的话，那么我们只需要在原来的样式基础上进行新增一个 class，再针对这个 class 写不同的样式即可，这样达到**继承**原来基础部分的样式进行拓展自己独有的样式。

![li.png](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-JnLajO.webp)

通过上图可以得知我们相当于**继承**基础类型 item 后，然后分别拓展出 `浏览 view`、`点赞 like`、`评论 comment`、`更多 more  ` 的 CSS 内容。

```json
.item.view {
    // 浏览
}
.item.like {
    // 点赞
}
.item.comment {
    // 评论
}
.item.more {
    // 更多
}
复制代码
```

通过这种模式就大大增加了 CSS 代码的可维护性，可以在没有修改源代码的基础上进行修正和拓展。同时通过上面的例子，我们可以引出 OOCSS 的两大原则：

- 容器（container）与内容（content）分离
- 结构（structure）与皮肤（skin）分离

例如在 Element Plus 组件库中就有两个经典的布局组件 **Container 布局容器** 和 **Layout 布局**，这是 OOCSS 的典型应用：



实质上我们在写 Vue 组件的时候，就是在对 CSS 进行封装，这也是 OOCSS 的实践方式之一。

```html
<el-button class="self-button">默认按钮</el-button>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.self-button {
    color: white;
    margin-top: 10px;
    width: 100px;
}
</style>
```





##### 命名规范---BEM 

###### 简介

BEM 是 OOCSS 的一种实现模式。BEM 是由 Yandex 团队提出的一种 CSS 命名方法论，即 Block（块）、Element（元素）、和 Modifier（修改器）的简称，是 OOCSS 方法论的一种实现模式，底层仍然是面向对象的思想。

例如按钮组件基础样式都封装为 el-button，然后通过继承 el-button 的样式，可以拓展不同的类，例如：el-button--primary、el-button--success、el-button--info。





###### BEM 规范下 classname 的命名格式

```xml
<block-name>__<element-name>--<modifier-name>_<modifier_value>
```

- 所有实体的命名均使用小写字母，复合词使用连字符 “-” 连接。(不用驼峰)
- Block 与 Element 之间使用双下画线 “__” 连接。
- Mofifier 与 Block/Element 使用双连接符 “--” 连接。
- modifier-name 和 modifier_value 之间使用单下画线 “_” 连接。



###### 优缺点

- 优点
  - 解决scope问题，避免样式相互影响BEM 同时规定 CSS 需要遵循只使用一个 classname 作为选择器，选择器规则中既不能使用标签类型、通配符、ID 以及其他属性，classname 也不能嵌套。
  - 通过 BEM 可以更加语义化我们的选择器名称。 通过class名规范，能够反应元素之间的状态关系
- 缺点
  - 类名长度过长。

###### 通过 JS 生成 BEM 规范名称

在编写组件的时候如果通过手写 classname 的名称，那么需要经常写 `el` 、`-` 、 `__` 、 `--`，那么就会变得非常繁琐，通过上文我们可以知道 BEM 命名规范是具有一定规律性的，所以我们可以通过 JavaScript 按照 BEM 命名规范进行动态生成。 命名空间函数是一个 hooks 函数，类似这样的 hooks 函数在 Element Plus 中有非常多，所以我们可以在 packages 目录下创建一个 hooks 模块（具体创建项目过程可参考本专栏的第二篇《[2. 组件库工程化实战之 Monorepo 架构搭建](https://juejin.cn/post/7146183222425518093)》），进入到 hooks 目录底下初始化一个 package.json 文件，更改包名：`@cobyte-ui/hooks`。文件内容如下：

```javascript
{
  "name": "@cobyte-ui/hooks",
  "version": "1.0.0",
  "description": "Element Plus composables",
  "license": "MIT",
  "main": "index.ts",
  "module": "index.ts",
  "unpkg": "index.js",
  "jsdelivr": "index.js",
  "types": "index.d.ts",
  "peerDependencies": {
    "vue": "^3.2.0"
  },
  "gitHead": ""
}
复制代码
```

接着在 hooks 目录下再创建一个 use-namespace 目录用于创建 BEM 命名空间函数，再在 hooks 目录下创建一个 index.ts 文件用于模块入口文件。

index.ts 文件内容：

```javascript
export * from './use-namespace'
复制代码
```

本项目的 GitHub 地址：[github.com/amebyte/ele…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Famebyte%2Felement-plus-guide)

首先引入一个命名空间的概念，所谓命名空间就是加多一个命名前缀。

```javascript
import { computed, unref } from 'vue'
// 默认命名前缀
export const defaultNamespace = 'el'

export const useNamespace = (block: string) => {
    // 命名前缀也就是命名空间
    const namespace = computed(() => defaultNamespace)
    return {
        namespace,
    }
}
复制代码
```

通过加多一个命名前缀，再加上 BEM 的命名规范就可以大大降低我们组件的 classname 与项目中的其他 classname 发生名称冲突的可能性。

通过前文我们知道 BEM 的命名规范就是通过一定的规则去书写我们的 classname，在 JavaScript 中则表现为按照一定规则去拼接字符串。

BEM 命名字符拼接函数：

```javascript
// BEM 命名字符拼接函数
const _bem = (
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string
) => {
  // 默认是 Block
  let cls = `${namespace}-${block}`
  // 如果存在 Block 后缀，也就是 Block 里面还有 Block，例如：el-form 下面还有一个 el-form-item
  if (blockSuffix) {
    cls += `-${blockSuffix}`
  }
  // 如果存在元素
  if (element) {
    cls += `__${element}`
  }
  // 如果存在修改器
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}
复制代码
```

这里值得注意的是 Block 有可能有后缀，也就是 Block 里面还有 Block，例如：`el-form` 下面还有一个 `el-form-item`。

通过 BEM 命名字符拼接函数，我们就可以自由组合生成各种符合 BEM 规则的 classname 了。

```javascript
export const useNamespace = (block: string) => {
  // 命名前缀也就是命名空间
  const namespace = computed(() => defaultNamespace)
  // 创建块 例如：el-form
  const b = (blockSuffix = '') =>
    _bem(unref(namespace), block, blockSuffix, '', '')
  // 创建元素 例如：el-input__inner
  const e = (element?: string) =>
    element ? _bem(unref(namespace), block, '', element, '') : ''
  // 创建块修改器 例如：el-form--default
  const m = (modifier?: string) =>
    modifier ? _bem(unref(namespace), block, '', '', modifier) : ''
  // 创建后缀块元素 例如：el-form-item
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? _bem(unref(namespace), block, blockSuffix, element, '')
      : ''
  // 创建元素修改器 例如：el-scrollbar__wrap--hidden-default
  const em = (element?: string, modifier?: string) =>
    element && modifier
      ? _bem(unref(namespace), block, '', element, modifier)
      : ''
  // 创建块后缀修改器 例如：el-form-item--default
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? _bem(unref(namespace), block, blockSuffix, '', modifier)
      : ''
  // 创建块元素修改器 例如：el-form-item__content--xxx
  const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? _bem(unref(namespace), block, blockSuffix, element, modifier)
      : ''
  // 创建动作状态 例如：is-success is-required
  const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
  }
}
复制代码
```

最后我们就可以在组件中引入 BEM 命名空间函数进行创建各种符合 BEM 命名规范的 classname 了，例如：

- 创建块 el-form、
- 创建元素 el-input__inner、
- 创建块修改器 el-form--default、
- 创建块后缀元素 el-form-item、
- 创建元素修改器 el-scrollbar__wrap--hidden-default、
- 创建动作状态 例如：is-success is-required

具体创建代码使用代码如下：

```javascript
import {
  useNamespace,
} from '@cobyte-ui/hooks'
// 创建 classname 命名空间实例
const ns = useNamespace('button')
复制代码
```

然后就可以在 template 中进行使用了：

```html
<template>
  <button
    ref="_ref"
    :class="[
      ns.b()
    ]"
  >按钮</button>
<template>
复制代码
```

###### 通过 SCSS 生成 BEM 规范样式

我们在本专栏的第二篇《[2. 组件库工程化实战之 Monorepo 架构搭建](https://juejin.cn/post/7146183222425518093)》中已经创建一个样式主题的目录 `theme-chalk`。现在我们接着在这个目录下创建组件样式代码，我们在 `theme-chalk` 目录下创建一个 `src` 目录，在 `src` 目录下创建一个 `mixins` 目录。

Element Plus 的样式采用 SCSS 编写的，那么就可以通过 SCSS 的 @mixin 指令定义 BEM 规范样式。在 `mixins` 目录下新建三个文件：config.scss、function.scss、mixins.scss。 其中 config.scss 文件编写 BEM 的基础配置比如样式名前缀、元素、修饰符、状态前缀：

```javascript
$namespace: 'el' !default; // 所有的组件以el开头，如 el-input
$common-separator: '-' !default; // 公共的连接符
$element-separator: '__' !default; // 元素以__分割，如 el-input__inner
$modifier-separator: '--' !default; // 修饰符以--分割，如 el-input--mini
$state-prefix: 'is-' !default; // 状态以is-开头，如 is-disabled
复制代码
```

在 SCSS 中，我们使用 `$+ 变量名：变量` 来定义一个变量。在变量后加入 `!default` 表示默认值。给一个未通过 `!default` 声明赋值的变量赋值，此时，如果变量已经被赋值，不会再被重新赋值；但是如果变量还没有被赋值，则会被赋予新的值。

mixins.scss 文件编写 SCSS 的 @mixin 指令定义的 BEM 代码规范。

**定义 Block：**

```javascript
@mixin b($block) {
  $B: $namespace + '-' + $block !global;

  .#{$B} {
    @content;
  }
}
复制代码
```

`$B` 表示定义一个一个变量，$namespace 是来自 config.scss 文件中定义的变量， `!global` 表示其是一个全局变量，这样就可以在整个文件的任意地方使用。`#{}` 字符串插值，类似模板语法。通过 `@content` 可以将 `include{}` 中传递过来的内容导入到指定位置。

**定义 Element：**

```javascript
@mixin e($element) {
  $E: $element !global;
  $selector: &;
  $currentSelector: '';
  @each $unit in $element {
    $currentSelector: #{$currentSelector +
      '.' +
      $B +
      $element-separator +
      $unit +
      ','};
  }

  @if hitAllSpecialNestRule($selector) {
    @at-root {
      #{$selector} {
        #{$currentSelector} {
          @content;
        }
      }
    }
  } @else {
    @at-root {
      #{$currentSelector} {
        @content;
      }
    }
  }
}
复制代码
```

首先定义一个全局变量 `$E`，接着定义父选择器 `$selector`，再定义当前的选择器 `$currentSelector`，再通过循环得到当前的选择器。接着通过函数 hitAllSpecialNestRule（hitAllSpecialNestRule 函数在 mixins 目录的 function.scss 文件中） 判断父选择器是否含有 Modifier、表示状态的 `.is-` 和 伪类，如果有则表示需要嵌套。`@at-root` 的作用就是将处于其内部的代码提升至文档的根部，即不对其内部代码使用嵌套。

**定义修改器：**

```javascript
@mixin m($modifier) {
  $selector: &;
  $currentSelector: '';
  @each $unit in $modifier {
    $currentSelector: #{$currentSelector +
      $selector +
      $modifier-separator +
      $unit +
      ','};
  }

  @at-root {
    #{$currentSelector} {
      @content;
    }
  }
}
复制代码
```

这个非常好理解，就是定义了父选择器变量 `$selector` 和 当前选择器变量 `$currentSelector`，并且当前选择器变量初始值为空，再通过循环传递进来的参数 `$modifier`，获得当前选择器变量 `$currentSelector` 的值，再定义样式内容，而样式内容是通过 `@content` 将 `include{}` 中传递过来的内容。

**定义动作状态：**

```javascript
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}
复制代码
```

选择器就是 config.scss 文件中的变量 `$state-prefix` 加传进来的状态变量，而样式内容是通过 `@content` 将 `include{}` 中传递过来的内容。

接着我们再看下上面定义 Element 的时候说到的 hitAllSpecialNestRule 函数，这个函数是定义在 mixins 目录下的 function.scss 文件中。function.scss 文件内容如下：

```javascript
@use 'config';

// 该函数将选择器转化为字符串，并截取指定位置的字符
@function selectorToString($selector) {
  $selector: inspect(
    $selector
  ); // inspect(...) 表达式中的内容如果是正常会返回对应的内容，如果发生错误则会弹出一个错误提示。
  $selector: str-slice($selector, 2, -2); // str-slice 截取指定字符
  @return $selector;
}
// 判断父级选择器是否包含'--'
@function containsModifier($selector) {
  $selector: selectorToString($selector);

  @if str-index($selector, config.$modifier-separator) {
    // str-index 返回字符串的第一个索引
    @return true;
  } @else {
    @return false;
  }
}
// 判断父级选择器是否包含'.is-'
@function containWhenFlag($selector) {
  $selector: selectorToString($selector);

  @if str-index($selector, '.' + config.$state-prefix) {
    @return true;
  } @else {
    @return false;
  }
}
// 判断父级是否包含 ':' （用于判断伪类和伪元素）
@function containPseudoClass($selector) {
  $selector: selectorToString($selector);

  @if str-index($selector, ':') {
    @return true;
  } @else {
    @return false;
  }
}
// 判断父级选择器，是否包含`--` `.is-`  `：`这三种字符
@function hitAllSpecialNestRule($selector) {
  @return containsModifier($selector) or containWhenFlag($selector) or
    containPseudoClass($selector);
}

复制代码
```

通过上述代码我们就可以知道 hitAllSpecialNestRule 函数是如何判断父选择器是否含有 Modifier、表示状态的 `.is-` 和 伪类的了。







###### 测试实践 BEM 规范

接下来，我们要把上面实现的 BEM 规范应用到真实组件中，通过写一个简易的测试组件进行测试实践。首先我们的样式是基于 SCSS 所以我们需要安装 sass。

我们在根目录下执行：

```
pnpm install sass -D -w
复制代码
```

接着我们把上新建的 hooks 模块也安装到根项目上：

我们在根目录下执行：

```bash
pnpm install @cobyte-ui/hooks -D -w
复制代码
```

而 theme-chalk 模块，我们在本专栏的第二篇的《[2. 组件库工程化实战之 Monorepo 架构搭建](https://juejin.cn/post/7146183222425518093)》已经进行了安装，这里就不用再进行安装了。

我们在 packages 目录下的 components 目录创建一个 icon 目录，再创建以下目录结构：

```css
├── packages
│   ├── components
│   │   ├── icon
│   │   │   ├── src
│   │   │   │   └── icon.vue
│   │   │   └── index.ts
│   │   └── package.json
复制代码
```

index.ts 文件内容：

```javascript
import Icon from './src/icon.vue'
export default Icon
复制代码
```

icon.vue 文件内容：

```html
<template>
  <i :class="bem.b()">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { useNamespace } from '@cobyte-ui/hooks'
const bem = useNamespace('icon')
</script>
复制代码
```

我们通过导入上面使用 JS 生成 BEM 规范名称 hooks 函数，然后创建对应的命名实例 bem，然后生成对应的 Block 块的 classname。接下来，我们把这个测试组件渲染到页面上，看看具体生成的效果。

我们去到 play 目录下的 src 目录中的 App.vue 文件中把上面写的测试组件进行引入：

```html
<template>
  <div>
    <c-icon>Icon</c-icon>
  </div>
</template>
<script setup lang="ts">
import CIcon from '@cobyte-ui/components/icon'
import '@cobyte-ui/theme-chalk/src/index.scss'
</script>
<style scoped></style>
复制代码
```

我们也把 `theme-chalk` 目录中的样式也进行了导入。接着我们在 theme-chalk 目录下的 src 目录新建一个 icon.scss 文件，文件内容如下：

```javascript
@use 'mixins/mixins' as *;
@include b(icon) {
  background-color: red;
  color: #fff;
}
复制代码
```

这里我们可以看到 SCSS 的 `@mixin`、`@include` 的用法： `@mixin `用来定义代码块、`@include` 进行引入。

我们需要在 theme-chalk 目录下的 src 目录中的 index.scss 中导入 icon.scss 文件。

index.scss 文件内容：

```javascript
@use './icon.scss';
复制代码
```

这样我们就实现了所有文件的闭环，最后我们把 play 项目运行起来，看看效果，要运行 play 项目，我们专栏的前面的文章中已经说过了，就是在根目录下执行 `pnpm run dev`  即可。

![icon-play.png](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-uJaZBf.webp)

我们也看到已经成功实现了渲染并和如期一样，那么其他样式的测试，我们将在后续具体的组件实现上再进行测试。







##### 命名规范---**SMACSS**

###### 定义

说白了就是分类写样式--主要是针对复用，module就是针对组件的。

将项目样式分为以下五类：

1. Base（基础）
2. Layout（布局）
3. Module（模块）
4. State（状态）
5. Theme（主题）

 <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-29-15-53-image-20240129155306955.png" alt="image-20240129155306955" style="zoom:33%;" />



###### 状态类

状态类一般以is-或者has-开头。这样状态类的目的就会比较明显，它们表示模块当前状态下的一些特征或者即将发生的变化。再举一些状态类的示例，比如is-expanded、is-loading或者has-error等。



###### 工具类

有时候，我们需要用一个类来对元素做一件简单明确的事，比如让文字居中、让元素左浮动，或者清除浮动。这样的类被称为工具类（utility class）。从某种意义上讲，工具类有点像小号的模块。工具类应该专注于某种功能，一般只声明一次。我通常把这些工具类放在样式表的底部，模块代码的下面。

下列代码展示了四个工具类，它们分别实现了特定的功能：文字居中、左浮动、清除浮动（包裹浮动）、隐藏元素。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221023184231564.png" alt="image-20221023184231564" style="zoom: 25%;" />

工具类是唯一应该使用important注释的地方这样的话，不管在哪里用到工具类，都可以生效。我敢肯定，任何时候为元素添加text-center类，都是想让文本居中，不想让其他样式覆盖它。



###### 优缺点

优点： 

- 层级划分清晰，代码易读，方便管理
- 有利于样式复用

缺点：

- 过度组织，样式分类多，增加工作
- 需要一些明确的划分定义和规范
- 学习成本高





#### KSS开发CSS模式库

详情见《深入解析CSS》里的第十章KSS





#### css-in-js

![image-20230504112209613](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-22-image-20230504112209613.png)



优缺点

![image-20230504112623882](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-26-image-20230504112623882.png)





![image-20230504112325287](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-23-image-20230504112325287.png)





#### 原子样式

##### 简介

组件库通常都需要搭建一个 CSS 子工程，用于实现自己的类型系统。比如 Element 就是基于 Sass + Gulp 搭建的。不过随着原子样式的出现，有了一些替代方案，无需搭建样式系统也可以完成类似效果。

原子化css是一种css的架构方式。



##### 优缺点

![image-20230504113532140](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-35-image-20230504113532140.png)



##### TailwindCss

![image-20230504113452087](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-34-image-20230504113452087.png)





##### UnoCSS

原子样式也有很多选择，最著名的就是 Tailwind。 Tailwind 虽然好，但是性能上有一些不足。由于Tailwind 会生成大量样式定义。全量的 CSS 文件往往体积会多至数 MB。这个对于页面性能是完全不可接受的。如果在开发时进行动态的按需剪裁，又会影响编译性能，降低开发体验。为了解决性能问题，开源界一个叫做 Antfu 的大神设计了 UnoCSS。UnoCSS 是一个拥有高性能且具灵活性的即时原子化 CSS 引擎，可以兼顾产物体积和开发性能。

除此以外UnoCSS还可以有更强的可定制性和易用性。

- [完全可定制](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%23configurations) - 没有核心实用程序，所有功能都通过预设提供。
- 无需解析、无需 AST、无需扫描，它是**即时的**（比 Windi CSS 或 Tailwind JIT 快 200 倍）
- ~3.5kb min+gzip - 零依赖和浏览器友好。
- [快捷方式](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%23shortcuts) - 动态别名实用程序。
- [属性模式](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%2Ftree%2Fmain%2Fpackages%2Fpreset-attributify%2F) - 在属性中分组实用程序
- [纯 CSS 图标](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%2Ftree%2Fmain%2Fpackages%2Fpreset-icons%2F) - 使用任何图标作为单个类。
- [检查器](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%23inspector) - 以交互方式检查和调试。
- [CSS-in-JS 运行时版本](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%2Ftree%2Fmain%2Fpackages%2Fruntime)。
- [CSS Scoping](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantfu%2Funocss%23css-scoping)。
- CSS 代码拆分 - 为 MPA 提供最小的 CSS。
- 库友好 - 随你的组件库提供原子样式并安全地限定范围。

另外基于 Vite 良好的支持，也是选择UnoCSS的一个重要原因。





## CSS预处理器/后处理器是什么

### 预处理器

我们写的css代码  --> less --> 高级css语法进行降级 --> 前缀补全 --> 浏览器客户端 

**预处理器，** 如：`less`，`sass`，`stylus`，用来预编译`sass`或者`less`。CSS是一个非常纯粹的样式描述语言。它不具备编程语言所具备的变量、条件等语法能力。将 CSS 赋予了动态语言的特性，如变量，继承，运算， 函数

Sass 详情见《深入解析CSS》里的附录B

混合（mixin）是将一组属性从一个规则集包含到（或混入）另一个规则集的方法。（感觉跟utils的区别就是混入可能是混入各种东西，utils就是引入一个方法，hooks就是引入状态和方法。反正css肯定是用混入来描述更合适，但之前的vue也用混入的概念我就不理解了）

 

#### 原生特性实现预处理器中功能的好处

原生特性通常比预处理器提供的版本要强大得多，因为它们是动态的 。举个例子，预处理器完全不知道如何完成 100% - 50px 这样

的计算，因为在页面真正被渲染之前，百分比值是无法解析的。但是，原生CSS 的 calc() 在计算这样的表达式时没有任何压力。与此类似，下面这样的变量玩法在预处理器中是不可能做到的：

```css
**ul** { **--accent-color**: purple; }
**ol** { **--accent-color**: rebeccapurple; }
**li** { **background**: var(**--accent-color**); }
```

在有序列表中，列表项的背景色将是rebeccapurple；但在无序列表中，列表项的背景色将是 purple。

而且这样的原生 CSS 特性也可以通过脚本来操纵。比如说，你可以用 JS 来改变一个变量的值。



#### less和scss的区别

Sass 的功能比 Less 强大，基本可以说是一种真正的编程语言了，Less 则相对清晰明了，易于上手，对编译环境要求比较宽松。



### **后处理器**

#### 介绍

![image-20230504111029916](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-10-image-20230504111029916.png)





#### postcss机制浅析

PostCSS是一个用JavaScript实现的CSS转换、处理工具。它本质上是一个平台，只提供基础能力，对CSS的处理能力是通过插件的形式实现的。

![image-20230504111610565](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-16-image-20230504111610565.png)





如： `postCss`，通常是在完成的样式表中根据`css`规范处理`css`。目前最常做的是

1. 给`css`属性添加浏览器私有前缀，实现跨浏览器兼容性等问题。
2. 比较新的css属性的一些使用降级

使用postcss：

1. 安装依赖

```
yarn add postcss-cli postcss -D
```

2. 书写配置文件

   ```js
   //postcss-preset-env里面会包含很多的插件
   // 语法降级 --> postcss-low-level
   // 编译插件 --> postcss-compiler
   // ...
   const postcssPresetEnv = require("postcss-preset-env");
   module.exports = {
       plugins:[postcssPresetEnv({
               importFrom:path.resolve(_dirname,"./variable.css") //声明一些文件要全局记录下来。因为postcss是一个文件一个文件去解析的，也就是说上一个文件跟正在解析的这个文件是没有任何关联的，这里就是要声明一个文件跟其他所有文件都是有关的，在解析其他文件的时候也要考虑这个文件。（这个配置可能已经被废弃，详情看使用时给出的警告）
             })]
   }
   ```

   

postCss 详情见《深入解析CSS》里的附录B



## webpack对CSS的处理

- Webpack 中操作 CSS 需要使用的两个关键的 loader：css-loader 和 style-loader

- css-loader：导入 CSS 模块，对 CSS 代码进行编译处理；

  style-loader：创建style标签，把 CSS 内容写入标签。

**css-loader 的执行顺序一定要安排在 style-loader 的前面**。因为只有完成了编译过程，才可以对 css 代码进行插入；否则，它会无情报错。





参考

[CUGGZ](https://juejin.cn/post/6905539198107942919#heading-1)
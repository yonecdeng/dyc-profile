# 介绍JS

## 静态/动态类型语言

静态类型语言在编译时便已确定变量的类型，而动态类型语言的变量类型要到程序运行的时候，待变量被赋予某个值之后，才会具有某种类型。



### 静态类型语言

优点：

编译时就能发现类型不匹配的错误。

在程序中明确地规定了数据类型，编译器还可以针对这些信息对程序进行一些优化工作。



缺点：

成本更大，增加更多的代码





### 动态类型语言

优点是编写的代码数量更少(对比一下TS)，缺点是无法保证变量的类型。

在动态类型语言中，对象的多态性是与生俱来的。



利用鸭子类型的思想，我们不必借助超类型的帮助，就能轻松地在动态类型语言中实现一个原则：“面向接口编程，而不是面向实现编程”。例如，一个对象若有push和pop方法，并且这些方法提供了正确的实现，它就可以被当作栈来使用。一个对象如果有length属性，也可以依照下标来存取属性（最好还要拥有slice和splice等方法），这个对象就可以被当作数组来使用。



#### 鸭子类型

鸭子类型的通俗说法是：“如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。”鸭子类型指导我们只关注对象的行为，而不关注对象本身。

利用鸭子类型的思想，我们不必借助超类型的帮助，就能轻松地在动态类型语言中实现一个原则：“面向接口编程，而不是面向实现编程”。例如，一个对象若有push和pop方法，并且这些方法提供了正确的实现，它就可以被当作栈来使用。一个对象如果有length属性，也可以依照下标来存取属性（最好还要拥有slice和splice等方法），这个对象就可以被当作数组来使用。







##  JS分为语言标准部分和宿主环境部分

是基于原型的动态语言，主要独特特性有 this、原型和原型链。

JS 严格意义上来说分为：语言标准部分（ECMAScript）+ 宿主环境部分

### 语言标准部分

2015 年发布 ES6，引入诸多新特性使得能够编写大型项目变成可能，标准自 2015 之后以年号代号，每年一更

### 宿主环境部分

- 在浏览器宿主环境包括 DOM + BOM 等
- 在 Node，宿主环境包括一些文件、数据库、网络、与操作系统的交互等



## JS是怎么执行的

![image-20230504115943433](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-04-11-59-image-20230504115943433.png)



# 引入JS

## JS 的6种加载方式

### `<script>`

#### 1）正常模式

```xml
<script src="index.js"></script>
复制代码
```

这种情况下 JS 会阻塞 dom 渲染，浏览器必须等待 index.js 加载和执行完成后才能去做其它事情

#### 2）async 模式

```xml
<script async src="index.js"></script>
复制代码
```

async 模式下，它的加载是异步的，JS 不会阻塞 DOM 的渲染，async 加载是无顺序的，当它加载结束，JS 会立即执行

使用场景：若该 JS 资源与 DOM 元素没有依赖关系，也不会产生其他资源所需要的数据时，可以使用async 模式，比如埋点统计

#### 3）defer 模式

```xml
<script defer src="index.js"></script>
复制代码
```

defer 模式下，JS 的加载也是异步的，defer 资源会在 `DOMContentLoaded` 执行之前，并且 defer 是有顺序的加载

如果有多个设置了 defer 的 script 标签存在，则会按照引入的前后顺序执行，即便是后面的 script 资源先返回

所以 defer 可以用来控制 JS 文件的执行顺序，比如 element-ui.js 和 vue.js，因为 element-ui.js 依赖于 vue，所以必须先引入 vue.js，再引入 element-ui.js

```xml
<script defer src="vue.js"></script>
<script defer src="element-ui.js"></script>
```

defer 使用场景：一般情况下都可以使用 defer，特别是需要控制资源加载顺序时



#### 4）module 模式

```xml
<script type="module">import { a } from './a.js'</script>
```

在主流的现代浏览器中，script 标签的属性可以加上 `type="module"`，浏览器会对其内部的 import 引用发起 HTTP 请求，获取模块内容。这时 <strong style="color:red">script 的行为会像是 defer 一样</strong>，在后台下载，并且等待 DOM 解析





### `<link>`

#### 5） preload

```ini
<link rel="preload" as="script" href="index.js">
```

link 标签的 preload 属性：用于提前加载一些需要的依赖，这些资源会优先加载（如下图红框）

![preload.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c4b39cd07844848b3900bd944790af6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

vue2 项目打包生成的 index.html 文件，会自动给首页所需要的资源，全部添加 preload，实现关键资源的提前加载

preload 特点：

1）preload 加载的资源是在浏览器渲染机制之前进行处理的，并且不会阻塞 onload 事件；

2）preload 加载的 JS 脚本其加载和执行的过程是分离的，即 preload 会预加载相应的脚本代码，待到需要时自行调用；

#### 6）prefetch

```ini
<link rel="prefetch" as="script" href="index.js">
```

prefetch 是利用浏览器的空闲时间，加载页面将来可能用到的资源的一种机制；通常可以用于加载其他页面（非首页）所需要的资源，以便加快后续页面的打开速度

![prefetch.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ea8026dd2e42e1bd5c709178f0235f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

prefetch 特点：

1）pretch 加载的资源可以获取非当前页面所需要的资源，并且将其放入缓存至少5分钟（无论资源是否可以缓存）

2）当页面跳转时，未完成的 prefetch 请求不会被中断

### 加载方式总结

<font color="red">async、defer 是 script 标签的专属属性，对于网页中的其他资源，可以通过 link 的 preload、prefetch 属性来预加载</font>







# 数据类型

## 空元素

比如数组 new Array（10）创造出来的数组里面都是空元素，空元素既不是null也不是undefined，他就是空的。

空元素 用 `void 0` 表示



## 进制转换

```javascript
// 十进制转二进制
parseFloat(0.1).toString(2);
=> "0.0001100110011001100110011001100110011001100110011001101"

// 二进制转十进制
parseInt(1100100,2)
=> 100

// 以指定的精度返回该数值对象的字符串表示
(0.1 + 0.2).toPrecision(21)
=> "0.300000000000000044409"
(0.3).toPrecision(21)
=> "0.299999999999999988898"
```



## js数字存储结构

在 JavaScript 里，数字均为[基于 IEEE 754 标准的双精度 64 位的浮点数](https://link.juejin.cn/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%E9%9B%99%E7%B2%BE%E5%BA%A6%E6%B5%AE%E9%BB%9E%E6%95%B8)，它的结构长这样：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/7/16e436aa3a4ad2e1~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- sign bit（符号）: 用来表示正负号
- exponent（指数）: 用来表示次方数
- mantissa（尾数）: 用来表示精确度，所以一个数字的范围是-(2^53 -1) 至 2^53 -1 之间。

JS整数通过 Number 类型来表示，通过 64 位来表示一个数字，（1 + 11 + 52），最大安全数字是 Math.pow(2, 53) - 1。如果后台发送了超过这个值的数则会发生截断（即显示2的53次方的值）。



比如对于0.1，它的二进制为：

```javascript
0.00011001100110011001100110011001100110011001100110011001 10011...
```

转为科学计数法（科学计数法的结果就是浮点数）：

```javascript
1.1001100110011001100110011001100110011001100110011001*2^-4
```

可以看出0.1的符号位为0，指数位为-4，小数位为：

```javascript
1001100110011001100110011001100110011001100110011001
```

在 JS ==位运算==中，会先在后台把值转换为  32 位==整数==（最高位是符号位）再进行位运算操作，位运算计算完成后再将 32 位转为 64 位存储

## 0.1+0.2 ! == 0.3

### 原因

0.1和0.2转换为二进制后均为无限循环小数，所有超出52位的数据会采取进1舍0的方式截取，所以损失了精度，因为两次存储时的精度丢失，最终导致了 0.1 + 0.2 !== 0.3

### 如何实现得到0.3  

```javascript
(0.1 + 0.2).toFixed(2) //toFixed(num) 方法可把 Number 四舍五入为指定小数位数的数字
```

### 如何实现与0.3相等

法一：

```javascript
(0.1+0.2).toFixed(1)==='0.3'
```

法二：

对JavaScript来说，“机器精度”通常为2-52，在ES6中，提供了`Number.EPSILON`属性，而它的值就是2-52，只要判断`0.1+0.2-0.3`是否小于`Number.EPSILON`，如果小于，就可以判断为0.1+0.2 ===0.3

```javascript
function numberepsilon(arg1,arg2){                   
  return Math.abs(arg1 - arg2) < Number.EPSILON;        
}        

console.log(numberepsilon(0.1 + 0.2, 0.3)); // true
```







## 内置类型



### `symbol`

#### （1）symbol 基本使用

```typescript
const s = Symbol(); 
typeof s; // symbol
```

注意：Symbol 前面不能加 new关键字，直接调用即可创建一个独一无二的 symbol 类型的值。

可以在使用 Symbol 方法创建 symbol 类型值的时候传入一个参数，这个参数需要是一个字符串。如果传入的参数不是字符串，会先自动调用传入参数的 toString 方法转为字符串：

```typescript
const s1 = Symbol("TypeScript"); 
const s2 = Symbol("Typescript"); 
console.log(s1 === s2); // false
```

上面代码的第三行可能会报一个错误：This condition will always return 'false' since the types 'unique symbol' and 'unique symbol' have no overlap. 这是因为编译器检测到这里的 s1 === s2 始终是false，所以编译器提醒这代码写的多余，建议进行优化。

Symbol 方法传入的这个字符串，就是方便我们区分 symbol 值的。可以调用 symbol 值的 toString 方法将它转为字符串：

```typescript
const s1 = Symbol("Typescript"); 
console.log(s1.toString());  // 'Symbol(Typescript)'
console.log(Boolean(s));     // true 
console.log(!s);             // false
```

#### （2）symbol 作为属性名

symbol 可以作为属性名，因为symbol的值是独一无二的，所以当它作为属性名时，不会与其他任何属性名重复。

```typescript
let name = Symbol(); 
let obj = { 
  [name]: "TypeScript" 
};
console.log(obj); // { Symbol(): 'TypeScript' }

console.log(obj[name]); // 'TypeScript' 
console.log(obj.name);  // undefined
```

<font color="red">在使用obj.name访问时，实际上是字符串name，要想访问属性名为symbol类型的属性时，必须使用方括号。</font>方括号中的name才是我们定义的symbol类型的变量name。

#### （3）symbol 属性名遍历

##### 无法遍历symbol 属性名的方法

使用 Symbol 类型值作为属性名，这个属性是<font color="red">不会被 for…in遍历到的，也不会被 Object.keys() 、 Object.getOwnPropertyNames() 、 JSON.stringify() 等方法</font>获取到：

```typescript
const name = Symbol("name"); 
const obj = { 
  [name]: "TypeScript", 
  age: 18 
};
for (const key in obj) { 
  console.log(key); 
}  
// => 'age' 
console.log(Object.keys(obj));  // ['age'] 
console.log(Object.getOwnPropertyNames(obj));  // ['age'] 
console.log(JSON.stringify(obj)); // '{ "age": 18 }
```



##### 能遍历symbol 属性名的方法

可以使用 <font color="red">`Object.getOwnPropertySymbols` </font>方法获取对象的所有symbol类型的属性名：

```typescript
const name = Symbol("name"); 
const obj = { 
  [name]: "TypeScript", 
  age: 18 
};
const SymbolPropNames = Object.getOwnPropertySymbols(obj); 
console.log(SymbolPropNames); // [ Symbol(name) ] 
console.log(obj[SymbolPropNames[0]]); // 'TypeScript' 
```

除了这个方法，还可以使用ES6提供的 Reflect 对象的静态方法<font color="red"> Reflect.ownKeys</font> ，它可以返回所有类型的属性名，Symbol 类型的也会返回：

```typescript
const name = Symbol("name"); 
const obj = { 
  [name]: "TypeScript", 
  age: 18 
};
console.log(Reflect.ownKeys(obj)); // [ 'age', Symbol(name) ]
```

#### （4）symbol 静态方法

##### **1）Symbol.for()**

使用 Symbol.for 方法传入字符串，会先检查有没有使用该字符串调用 Symbol.for 方法创建的 symbol 值。如果有，返回该值；如果没有，则使用该字符串新创建一个。使用该方法创建 symbol 值后会在全局范围进行注册。

```typescript
const iframe = document.createElement("iframe"); 
iframe.src = String(window.location); 
document.body.appendChild(iframe); 

iframe.contentWindow.Symbol.for("TypeScript") === Symbol.for("TypeScript"); // true // 注意：如果你在JavaScript环境中这段代码是没有问题的，但是如果在TypeScript开发环境中，可能会报错：类型“Window”上不存在属性“Symbol”。 // 因为这里编译器推断出iframe.contentWindow是Window类型，但是TypeScript的声明文件中，对Window的定义缺少Symbol这个字段，所以会报错，
```

上面代码中，创建了一个iframe节点并把它放在body中，通过这个 iframe 对象的 contentWindow 拿到这个 iframe 的 window 对象，在 iframe.contentWindow上添加一个值就相当于在当前页面定义一个全局变量一样。可以看到，在 iframe 中定义的键为 TypeScript 的 symbol 值在和在当前页面定义的键为'TypeScript'的symbol 值相等，说明它们是同一个值。

##### **2）Symbol.keyFor()**

该方法传入一个 symbol 值，返回该值在全局注册的键名：

```typescript
const sym = Symbol.for("TypeScript"); 
console.log(Symbol.keyFor(sym)); // 'TypeScript'
```



#### `symbol` 有什么用处

可以用来表示一个独一无二的变量防止命名冲突。ES6前所有对象的属性名都是[字符串](https://so.csdn.net/so/search?q=字符串&spm=1001.2101.3001.7020)，如果你使用了别人的一个对象，又想为这个对象添加方法时，新方法的方法名就可能和原有方法的名字冲突。ES6中的Symbol值表示独一无二的值，如果属性名使用Symbol值就从根本上杜绝了这种冲突

还可以利用 `symbol` 不会被常规的方法（除了 `Object.getOwnPropertySymbols` 外）遍历到，所以可以用来模拟私有变量。

还可以用来提供遍历接口，布置了 `symbol.iterator` 的对象才可以使用 `for···of` 循环







#### NaN

##### NaN

NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

```javascript
typeof NaN; // "number"
```

NaN 是一个特殊值，它和自身不相等，NaN !== NaN 为 true。用Number.isNaN()这个来判断是否为NaN

##### isNaN()与Number.isNaN()

isNaN() 如果参数不能转换为数字则判断是NaN； Number.isNaN() 利用NaN！== NaN的特性判断这个参数是不是NaN



### 字符串

#### 模板字符串的优势

- 在模板字符串中，空格、缩进、换行都会被保留
- 模板字符串完全支持“运算”式的表达式，可以在${}里完成一些计算

基于第一点，可以在模板字符串里无障碍地直接写 html 代码：

```javascript
let list = `
	<ul>
		<li>列表项1</li>
		<li>列表项2</li>
	</ul>
`;
console.log(message); // 正确输出，不存在报错
```

基于第二点，可以把一些简单的计算和调用丢进 ${} 来做



#### UTF-16 的扩展字符

for..of 可以正确遍历这种扩展字符

但字符串自身的方法`str.split`和`slice`是不能使用处理这种字符的

我们可以基于 `Array.from` 创建代理感知（surrogate-aware）的`slice` 方法（译注：也就是能够处理 UTF-16 扩展字符的 `slice` 方法）：

```javascript
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');//数组方法可以识别这种字符，因为它是基于字符串的可迭代特性
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// 原生方法不支持识别代理对（译注：UTF-16 扩展字符）
alert( str.slice(1, 3) ); // 乱码（两个不同 UTF-16 扩展字符碎片拼接的结果）
```







### 八种内置类型

JS 中分为八种内置类型，八种内置类型又分为两大类型：基本类型和对象（Object）

JavaScript 语言中类型集合由[*原始值*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#原始值)和[*对象*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#对象)组成。

- 原始值

  （直接表示在语言底层的不可变数据）

  - [布尔类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#布尔类型)
  - [Null 类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#null_类型)   只有一个值：null 所以检测null和undefined的最好方法就是`===`
  - [Undefined 类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#undefined_类型)  只有一个值：undefined
  - [数字类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#数字类型)
  - [BigInt 类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#bigint_类型)
  - [字符串类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#字符串类型)
  - [符号类型Symbols](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#符号类型)

- [对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#对象)（一组属性的集合）

JavaScript 中字符串是不可变的（如，JavaScript 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变）。我们称这些类型的值为“*原始值*”。



### 基本类型和对象的区别

保存值类型的变量是按值访问的， 保存引用类型的变量是按引用访问的。

基本类型和对象的区别在于**存储位置的不同：**

- 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区：

- 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
- 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收。





### null和undefined区别

undefined 代表的含义是**未定义**，null 代表的含义是**空对象**，指示变量未指向任何对象，`null` 通常会在你希望<font color="red">使用对象的情况下</font>意外出现。变量<font color="red">声明了但还没有定义</font>的时候会返回 undefined，null主要用于赋值给一些可能会返回对象的变量作为初始化。

undefined 在 JavaScript 中不是一个保留字，这意味着可以使用 undefined 来作为一个变量名，但是这样的做法是非常危险的，它会影响对 undefined 值的判断。我们可以通过一些方法获得安全的 undefined 值，比如说 void 0。

```javascript
let a
a === undefined
let undefined = 1// 但是 undefined 不是保留字，能够在低版本浏览器被赋值，这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式 返回就是 undefined
a === void 0
```







## 数据类型检测

### 各种方法

#### **（1）typeof**

对于基本类型，除了 `null` 都可以显示正确的类型

 对于对象，除了函数都会显示 object



#### **（2）Object.prototype.toString.call()**

toString是Object的原型方法，而Array、function等**类型作为Object的实例，都重写了toString方法**。所以采用obj.toString()不能得到其对象类型；因此，在想要得到对象的具体类型时，应该调用Object原型上的toString方法。

如果 toString 方法没有重写的话，会返回 [Object type]，其中 type 为对象的类型

```javascript
Object.prototype.toString.call('ESStudio balabala……');
//"[object String]"
Object.prototype.toString.call('ESStudio balabala……').slice(8,-1);
//"String"
```



#### 跟构造函数相关

##### **（3）instanceof**

**只能正确判断引用数据类型**，而不能判断基本数据类型

判断某个实例是不是某个构造函数的实例



##### **（4） constructor**

返回创建实例对象的 [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 构造函数的==引用==。注意，此属性的值是对函数本身的引用，而不是一个包含函数名称的字符串。对原始类型来说，如`1`，`true`和`"test"`，该值只可读。

需要注意，如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了：

```js
function Fn(){};
 
Fn.prototype = new Array();
 
var f = new Fn();
 
console.log(f.constructor===Fn);    // false
console.log(f.constructor===Array); // true
```

value.constructor.name：

```js
const arr=[];
console.log(arr.constructor.name); // 'Array'
```



##### （5）Object.prototype.isPrototypeOf()







### 判断window对象

Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身

```javascript
function isWindow( obj ) {
    return obj && obj === obj.window;
}
```





### 判断是不是 DOM 元素

```javascript
isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};
```



### 自己不等于自己

#### 各种

```javascript
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

/*正则表达式*/
console.log(/a/ == /a/); // false
console.log(/a/ === /a/); // false

/*对象*/
console.log({} == {}); // false
console.log({} === {}); // false
```

#### NaN

##### NaN

NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

```javascript
typeof NaN; // "number"
```

NaN 是一个特殊值，它和自身不相等，NaN !== NaN 为 true。用Number.isNaN()这个来判断是否为NaN

##### isNaN()与Number.isNaN()

isNaN() 如果参数不能转换为数字则判断是NaN； Number.isNaN() 利用NaN！== NaN的特性判断这个参数是不是NaN



## 类型转化

### == 操作符的强制类型转换规则

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c451c19e23dd4726b3f36223b6c18a1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

所以 `a!=null`就能保证a既不等于null也不等于undefined。





### 其他值到字符串的转换规则？

- Null 和 Undefined 类型 ，null 转换为 "null"，undefined 转换为 "undefined"，
- Boolean 类型，true 转换为 "true"，false 转换为 "false"。
- Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式。
- Symbol 类型的值直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产生错误。
- 对普通对象来说，除非自行定义 toString() 方法，否则会调用 toString()（Object.prototype.toString()）来返回内部属性 [[Class]] 的值，如"[object Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其返回值。

###  其他值到数字值的转换规则？

- Undefined 类型的值转换为 NaN。
- Null 类型的值转换为 0。
- Boolean 类型的值，true 转换为 1，false 转换为 0。
- String 类型的值转换如同使用 Number() 函数进行转换，如果包含非数字值则转换为 NaN，空字符串为 0。
- Symbol 类型的值不能转换为数字，会报错。
- 对象（包括数组）会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字。为了将值转换为相应的基本类型值，抽象操作 ToPrimitive 会首先（通过内部操作 DefaultValue）检查该值是否有valueOf()方法。如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString() 的返回值（如果存在）来进行强制类型转换。如果 valueOf() 和 toString() 均不返回基本类型值，会产生 TypeError 错误。（你很少需要自己调用`valueOf`方法；当遇到要预期的原始值的对象时，JavaScript会自动调用它。默认情况下，`valueOf`方法由[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则`valueOf`将返回对象本身。JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的valueOf()方法的返回值和返回值类型均可能不同。）





### 手动转成数字的方法

#### Number

如果通过 Number 转换函数传入一个字符串，它会试图将其转换成一个整数或浮点数，而且会忽略所有前导的 0，如果有一个字符不是数字，结果都会返回 NaN

#### parseInt&parseFloat

parseInt 只解析整数，parseFloat 则可以解析整数和浮点数，如果字符串前缀是 "0x" 或者"0X"，parseInt 将其解释为十六进制数，parseInt 和 parseFloat 都会跳过任意数量的前导空格，尽可能解析更多数值字符，并忽略后面的内容。如果第一个非空格字符是非法的数字直接量，将最终返回 NaN：

```javascript
console.log(parseInt("3 abc")) // 3
console.log(parseFloat("3.14 abc")) // 3.14
console.log(parseInt("-12.34")) // -12
console.log(parseInt("0xFF")) // 255
console.log(parseFloat(".1")) // 0.1
console.log(parseInt("0.1")) // 0
```



#### 其他

```javascript
~~num; //按位非
-*/; //隐式转换
```





### 其他值到布尔类型的值的转换规则

假值： • undefined • null • false • +0、-0 和 NaN • ""



### 隐式类型转换

首先要介绍`Symbol.toPrimitive`方法，这是 JavaScript 中每个值隐含的自带的方法，用来将值 （无论是基本类型值还是对象）转换为基本类型值。如果值为基本类型，则直接返回值本身；如果值为对象，其看起来大概是这样：

```javascript
/**
* @obj 需要转换的对象
* @type 期望的结果类型
*/
[Symbol.toPrimitive ](obj,type)
```

`type`的值为`number`或者`string`。

**（1）当**`type`**为**`number`**时规则如下：**

- 调用`obj`的`valueOf`方法，如果为原始值，则返回，否则下一步；
- 调用`obj`的`toString`方法，后续同上；
- 抛出`TypeError` 异常。

**（2）当**`type`**为**`string`**时规则如下：**

- 调用`obj`的`toString`方法，如果为原始值，则返回，否则下一步；
- 调用`obj`的`valueOf`方法，后续同上；
- 抛出`TypeError` 异常。

可以看出两者的主要区别在于调用`toString`和`valueOf`的先后顺序。默认情况下：

- 如果对象为 Date 对象，则`type`默认为`string`；
- 其他情况下，`type`默认为`number`。



而 JavaScript 中的隐式类型转换主要发生在`+、-、*、/`以及`==、>、<`这些运算符之间。而这些运算符只能操作基本类型值，所以在进行这些运算前的第一步就是将两边的值用`ToPrimitive`转换成基本类型，再进行操作。

以下是基本类型的值在不同操作符的情况下隐式转换的规则 （对于对象，其会被`ToPrimitive`转换成基本类型，所以最终还是要应用基本类型转换规则）：

- `+`**操作符**

`+`操作符的两边有至少一个`string`类型变量时，两边的变量都会被隐式转换为字符串；其他情况下两边的变量都会被转换为数字。

```javascript
1 + '23' // '123'
 1 + false // 1 
 1 + Symbol() // Uncaught TypeError: Cannot convert a Symbol value to a number
 '1' + false // '1false'
 false + true // 1
```

- `-`、`*`、`\`**操作符**

除了加法，只要其中一方是数字，那么另一方就会被转为数字。

```javascript
1 * '23' // 23
 1 * false // 0
 1 / 'aa' // NaN（注意NaN的情况）
```

- **对于**`==`**操作符**

操作符两边的值都尽量转成`number`：

```javascript
3 == true // false, 3 转为number为3，true转为number为1
'0' == false //true, '0'转为number为0，false转为number为0
'0' == 0 // '0'转为number为0
```

- **对于**`<`**和**`>`**比较符**

如果两边都是字符串，则比较字母表顺序：

```javascript
'ca' < 'bd' // false
'a' < 'b' // true
```

其他情况下，转换为数字再比较：

```javascript
'12' < 13 // true
false > -1 // true
```

以上说的是基本类型的隐式转换，而对象会被`ToPrimitive`转换为基本类型再进行转换：

```javascript
var a = {}
a > 2 // false
```

其对比过程如下：

```javascript
a.valueOf() // {}, 上面提到过，ToPrimitive默认type为number，所以先valueOf，结果还是个对象，下一步
a.toString() // "[object Object]"，现在是一个字符串了
Number(a.toString()) // NaN，根据上面 < 和 > 操作符的规则，要转换成数字
NaN > 2 //false，得出比较结果
```

又比如：

```javascript
var a = {name:'Jack'}
var b = {age: 18}
a + b // "[object Object][object Object]"
```

运算过程如下：

```javascript
a.valueOf() // {}，上面提到过，ToPrimitive默认type为number，所以先valueOf，结果还是个对象，下一步
a.toString() // "[object Object]"
b.valueOf() // 同理
b.toString() // "[object Object]"
a + b // "[object Object][object Object]"
```



### JSON.stringify

基本数据类型：

> 与使用toString基本相同

- undefined 转换之后仍是 undefined(类型也是 undefined)
- boolean 值转换之后是字符串 "false"/"true"
- number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
- symbol 转换之后是 undefined
- null 转换之后是字符串 "null"
- string 转换之后仍是string
- NaN 和 Infinity 转换之后是字符串 "null"

对象类型：

- 如果是函数类型：转换之后是 undefined
- 如果是 RegExp 对象：返回 {} (类型是 string)；
- 如果是 Date 对象，返回 Date 的 toJSON 字符串值；
- 如果是一个数组：如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null" ；
- 如果是普通对象；
  - 如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
  - 如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略。
  - 所有以 symbol 为属性键的属性都会被完全忽略掉。

**无法序列化不可枚举属性**，**无法序列化对象的循环引用**



## JavaScript 中的包装类型

- 在 JavaScript 中，基本类型是没有属性和方法的，但是为了便于操作基本类型的值，在调用基本类型的属性或方法时 JavaScript 会在后台隐式地将基本类型的值转换为对象

- 也可以使用`Object`函数显式地将基本类型转换为包装类型：

  ```javascript
  var a = 'abc'
  Object(a) // String {"abc"}
  ```

- 也可以使用`valueOf`方法将包装类型倒转成基本类型

```javascript
var a = 'abc'
var b = Object(a)
var c = b.valueOf() // 'abc'
```

- 看看如下代码会打印出什么：

```javascript
var a = new Boolean( false );
if (!a) {
	console.log( "Oops" ); // never runs
}
```

答案是什么都不会打印，因为虽然包裹的基本类型是`false`，但是`false`被包裹成包装类型后就成了对象，所以其非值为`false`。

## Object.is() 与 `===`，`==`的区别？

- 使用双等号（==）进行相等判断时，如果两边的类型不一致，则会进行强制类型转化后再进行比较。

- 使用三等号（===）进行相等判断时，如果两边的类型不一致时，不会做强制类型准换，直接返回 false。

- 使用 Object.is 来进行相等判断时， Object.is 就比 === 多了两个判断，一个是 NaN，一个是 +0 和 -0（[`Number.NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN) 与[`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)视为不相等.）

  ```javascript
    Object.is = function(x, y) {
      // SameValue algorithm
      if (x === y) { 
        // 判断是不是-0和+0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // 判断是不是都是NaN
        return Number.isNaN(x) && Number.isNaN(y);
      }
    };
  ```

  











# 语句和声明

## 变量声明

### let、const、var的区别

**（1）块级作用域：** 块作用域由 `{ }`包括，let和const具有块级作用域，var是函数作用域，不存在块级作用域。块级作用域解决了ES5中的两个问题：

- 内层变量可能覆盖外层变量
- 用来计数的循环变量泄露为全局变量

**（2）变量提升：** var存在变量提升，let和const不存在变量提升，即在变量只能在声明之后使用，否在会报错。

函数在运行的时候，会首先创建执行上下文，然后将执行上下文入栈，然后当此执行上下文处于栈顶时，开始运行执行上下文。在创建执行上下文的过程中会做三件事：创建变量对象，创建作用域链，确定 this 指向，其中创建变量对象的过程中，首先会为 arguments 创建一个属性，值为 arguments，然后会扫码 function 函数声明，创建一个同名属性，值为函数的引用，接着会扫码 var 变量声明，创建一个同名属性，值为 undefined，这就是变量提升。



**（3）给全局添加属性：** 浏览器的全局对象是window，Node的全局对象是global。var声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是let和const不会。

**（4）重复声明：** var声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const和let不允许重复声明变量。

**（5）暂时性死区：** 在使用let、const命令声明变量之前，该变量都是不可用的。这在语法上，称为**暂时性死区**。使用var声明的变量不存在暂时性死区。这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

**（6）初始值设置：** 在变量声明时，var 和 let 可以不用设置初始值。而const声明变量必须设置初始值。



### const对象的属性可以修改吗

const保证的并不是变量的值不能改动，而是变量指向的那个内存地址不能改动。对于基本类型的数据（数值、字符串、布尔值），其值就保存在变量指向的那个内存地址，因此等同于常量。

但对于引用类型的数据（主要是对象和数组）来说，变量指向数据的内存地址，保存的只是一个指针，const只能保证这个指针是固定不变的，至于它指向的数据结构是不是可变的，就完全不能控制了。



### 面试题

#### 分析

接下来，看这道刷题必刷，面试必考的闭包题：

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

答案是都是 3，让我们分析一下原因：

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。



#### 解决方法一

所以让我们改成闭包看看：

```
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

跟没改之前一模一样。

当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。





#### 解决方法二

利用函数的arguments对象上的callee属性

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) //打印这个函数上的属性i
    }).i = i;//给data[i]这个函数加了一个属性i
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```





## 迭代

### `for ... in`

迭代的事实==属性名==

以任意顺序迭代一个==对象==的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性（包括实例属性和原型属性）。（默认情况下开发者定义的属性都是可枚举的）

### **`for...of`**

在[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)（包括 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)，[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)，[`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)，[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 对象等等）上创建一个迭代循环。

 `for..of` 所期望的`[Symbol.iterator]()`返回的对象：

- 它具有 `next()` 方法
- 它以 `{value: ..., done: true/false}` 的形式返回值

如果需要遍历的对象是类数组对象，用Array.from转成数组即可。

```javascript
var obj = {
    0:'one',
    1:'two',
    length: 2
};
obj = Array.from(obj);
for(var k of obj){
    console.log(k)
}
```

如果不是类数组对象，就给对象添加一个[Symbol.iterator]属性，并指向一个迭代器即可。

```javascript
//方法一：自定义迭代器
var obj = {
    a:1,
    b:2,
    c:3
};

obj[Symbol.iterator] = function(){
	var keys = Object.keys(this);
	var count = 0;
	return {
		next(){
			if(count<keys.length){
				return {value: obj[keys[count++]],done:false};
			}else{
				return {value:undefined,done:true};
			}
		}
	}
};

for(var k of obj){
	console.log(k);
}


// 方法二、利用生成器
var obj = {
    a:1,
    b:2,
    c:3
};
obj[Symbol.iterator] = function*(){
    var keys = Object.keys(obj);
    for(var k of keys){
        yield [k,obj[k]]
    }
};

for(var [k,v] of obj){
    console.log(k,v);
}
```



## 迭代器

### **迭代器（iterator）** 

—— 一个有 `next` 方法的对象

### **可迭代（Iterable）** 对象

可以应用 `for..of` 的对象被称为 **可迭代的**。

**可迭代（Iterable）** 对象是数组的泛化。这个概念是说任何对象都可以被定制为可在 `for..of` 循环中使用的对象。

- **Iterable** 是实现了 `Symbol.iterator` 方法的对象。
- **Array-like** 是有索引和 `length` 属性的对象，所以它们看起来很像数组。
- 这两个是完全互不相关的概念，比如==字符串即是可迭代的==（`for..of` 对它们有效），又是类数组的（它们有数值索引和 `length` 属性）。可迭代对象和类数组对象通常都 **不是数组**，它们没有 `push` 和 `pop` 等方法。

### `Symbol.iterator`

为了让 对象可迭代（也就让 `for..of` 可以运行）我们需要为对象添加一个名为 `Symbol.iterator` 的方法（一个专门用于使对象可迭代的内建 symbol）

- 当 `for..of` 循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法必须返回一个 **迭代器（iterator）对象** —— 一个有 `next` 方法的对象。
- 对于每次迭代，都会为下一个值调用 `next()` 方法。
- `next()` 方法应该以 `{done: true/false, value:<loop value>}` 的格式返回一个值，其中 `done:true` 表示循环结束

```javascript
//自定义迭代器
let obj = {a:1,b:2,c:[3,4,5]}
obj[Symbol.iterator] = function(){// 在 for..of 循环开始时被调用一次
	
  
   //接下来，for..of 仅与下面的迭代器对象一起工作，要求它提供下一个值
	return {
        index: 0,
        c:this.c,
    next(){// 每次迭代时都会被调用，来获取下一个值
      if(this.index===this.c.length) return {value:undefined,done:true}
      return {value:this.c[this.index++],done:false}
    }
  }
}

// 现在obj可以迭代了！
for (const  num of obj) {
  console.log(num); // 1, 然后是 2, 3, 4, 5
}
```

请注意可迭代对象的核心功能：关注点分离。

- `obj` 自身没有 `next()` 方法。
- 通过调用 `range[Symbol.iterator]()` 创建了另一个对象，即所谓的“迭代器”对象，并且它的 `next` 会为迭代生成值。

因此，迭代器对象和与其进行迭代的对象是分开的。

从技术上说，我们也可以将它们合并，并使用 `obj` 自身作为迭代器来简化代码。

```javascript
let obj = {
    a: 1,
    b: 2,
    c: [3, 4, 5],
    [Symbol.iterator]() {// 在 for..of 循环开始时被调用一次
        this.index = 0//给对象添加了一个index属性
        return this
    },
    next() {// 每次迭代时都会被调用，来获取下一个值
        if (this.index === this.c.length) {
            delete this.index;
            return { value: undefined, done: true }
        }
        return { value: this.c[this.index++], done: false }
    }
}
//缺点是，现在不可能同时在对象上运行两个 for..of 循环了：它们将共享迭代状态，因为只有一个迭代器，即对象本身。但是两个并行的 for..of 是很罕见的
```



### 显示调用迭代器

这段代码创建了一个字符串迭代器，并“手动”从中获取值。

```javascript
let str = "Hello";

// 和 for..of 做相同的事
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // 一个接一个地输出字符
}
```

很少需要我们这样做，但是比 `for..of` 给了我们更多的控制权。例如，我们可以拆分迭代过程：迭代一部分，然后停止，做一些其他处理，然后再恢复迭代。





## 生成器

### 简介

常规函数只会返回一个单一值（或者不返回任何值）。

而 Generator 可以按需一个接一个地返回（“yield”）多个值。它们可与 [iterable](https://zh.javascript.info/iterable) 完美配合使用，从而可以轻松地创建数据流。



### Generator函数

generator函数被调用时不会运行其代码。而是返回一个被称为 “generator object” 的特殊对象，（这个对象里含有next方法），来管理执行流程。

我们来看一个例子：

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3; //如果最后没有这个return则最后的value是undefined
}

// "generator function" 创建了一个 "generator object"
let generator = generateSequence();
alert(generator); // [object Generator]

//到目前为止，generateSequence的 函数体 代码还没有开始执行
```

 “generator object”  的主要方法就是 `next()`。当被调用时，函数体会恢复运行，执行直到最近的 `yield <value>` 语句（`value` 可以被省略，默认为 `undefined`）。然后函数执行暂停，并将产出的（yielded）值返回到外部代码。

`next()` 的结果始终是一个具有两个属性的对象：

- `value`: 产出的（yielded）的值。
- `done`: 如果 generator 函数已执行完成则为 `true`，否则为 `false`。



```javascript
//我们可以创建一个 “generator object” 并获取其第一个产出的（yielded）值：
let generator = generateSequence();
let one = generator.next();
alert(JSON.stringify(one)); // {value: 1, done: false}

//如果我们第三次调用 generator.next()，代码将会执行到 return 语句，此时就完成这个函数的执行：
let three = generator.next();
alert(JSON.stringify(three)); // {value: 3, done: true}
```





### [Generator 是可迭代的](https://zh.javascript.info/generators#generator-shi-ke-die-dai-de)

我们可以使用 `for..of` 循环遍历它所有的值：

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1，然后是 2
}
```

注意：上面这个例子不会显示 `3`！

这是因为当 `done: true` 时，`for..of` 循环会忽略最后一个 `value`。因此，如果我们想要通过 `for..of` 循环显示所有的结果，我们必须使用 `yield` 返回它们。

因为 generator 是可迭代的，我们可以使用 iterator 的所有相关功能，例如：spread 语法 `...`：

```javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let sequence = [0, ...generateSequence()];

alert(sequence); // 0, 1, 2, 
```



### 使用generator函数作为 `Symbol.iterator`

我们可以通过提供一个 generator 函数作为 `Symbol.iterator`，来使用 generator 进行迭代：

```javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的简写形式
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

alert( [...range] ); // 1,2,3,4,5
```



### Generator 组合

在常规函数中，要合并其他多个函数的结果，我们需要调用它们，存储它们的结果，最后再将它们合并到一起。

对于 generator 而言，我们可以使用 `yield*` 这个特殊的语法来将一个 generator “嵌入”（组合）到另一个 generator 中：

```javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCodes() {
  // 0..9
  yield* generateSequence(48, 57);

  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);
}

let str = '';
for(let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}
alert(str); // 0..9A..Za..z
```





### [“yield” 是一条双向路](https://zh.javascript.info/generators#yield-shi-yi-tiao-shuang-xiang-lu)

这是因为 `yield` 是一条双向路（two-way street）：它不仅可以==向外==返回结果，而且还可以将外部的值传递到 generator 内。调用 `generator.next(arg)`，我们就能将参数 `arg` 传递到 generator 内部。这个 `arg` 参数会变成 `yield` 的结果。

第一个 `.next()`应该是不带参数的（如果带参数，那么该参数会被忽略），它启动了 generator 的执行……执行到达第一个 `yield`。

```javascript
function* gen() {
  // 向外部代码传递一个问题并等待答案
  let result = yield "haha"; // (*)等号右边已经执行(yield后面的已经执行)，但是等号左边还没有执行，等号左边要等到外面再调用next()并在next的括号中传值进来，result才有值
  console.log(result);
}

let generator = gen();
console.log(generator.next().value) 
generator.next('charley'); // --> 将结果传递到 generator 中 

//最终按顺序输出：
//haha
//charley
```



### [generator.throw](https://zh.javascript.info/generators#generatorthrow)

要向 `yield` 传递一个 error，我们应该调用 `generator.throw(err)`。在这种情况下，`err` 将被抛到对应的 `yield` 所在的那一行。

```javascript
function* gen() {
  try {
    let result = yield "2"; // (1)
    alert("The execution does not reach here, because the exception is thrown above");
  } catch(e) {
    alert(e); // 显示这个 error
  }
}

let generator = gen();
generator.next().value;
generator.throw(new Error("The answer is not found in my database")); // (2)
```

在 `(2)` 行引入到 generator 的 error 导致了在 `(1)` 行中的 `yield` 出现了一个异常。在上面这个例子中，`try..catch` 捕获并显示了这个 error。

如果我们没有捕获它，那么就会像其他的异常一样，它将从 generator “掉出”到调用代码中。

调用代码的当前行是 `generator.throw` 所在的那一行，标记为 `(2)`。所以我们可以在这里捕获它，就像这样：

```javascript
try {
  generator.throw(new Error("The answer is not found in my database"));
} catch(e) {
  alert(e); // 显示这个 error
}
```

如果我们没有在那里捕获这个 error，那么，通常，它会掉入外部调用代码（如果有），如果在外部也没有被捕获，则会杀死脚本。





### [generator.return](https://zh.javascript.info/generators#generatorreturn)

`generator.return(value)` 完成 generator 的执行并返回给定的 `value`。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();        // { value: 1, done: false }
g.return('foo'); // { value: "foo", done: true }
g.next();        // { value: undefined, done: true }
```

如果我们在已完成的 generator 上再次使用 `generator.return()`，它将再次返回该值（[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)）。

通常我们不使用它，因为大多数时候我们想要获取所有的返回值，但是当我们想要在特定条件下停止 generator 时它会很有用。



## 异步迭代器和异步生成器

[再看这](https://zh.javascript.info/async-iterators-generators#shi-ji-de-li-zi-fen-ye-de-shu-ju)



# 运算符和操作符

## `label`语法 - 可越级跳出循环

```js
function test() {
  let baseCount = 5;
  baseWhile:while (baseCount--) {
    let count = 10;
    while (count--) {
      if (count === 5) {
        break baseWhile;
      }
    }
  }
  console.log("test", baseCount);
}

test();
// test 4
```

除了上述在while循环中使用，对于`continue`、`for`等语法也适用





## void 0

`void 0===undefined`，

`undefined`不是一个关键字，他是全局变量的一个属性，**在低版本浏览器中全局undefined可以被改写，在现代浏览器的局部作用域中同样可以被改写**。

```js
(function(){
    var undefined = 10
    console.log(undefined)
})() // 10
```







## 运算符优先级

[参考MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)



## 位运算

### js数字存储结构

在 JavaScript 里，数字均为[基于 IEEE 754 标准的双精度 64 位的浮点数](https://link.juejin.cn/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2F%E9%9B%99%E7%B2%BE%E5%BA%A6%E6%B5%AE%E9%BB%9E%E6%95%B8)，它的结构长这样：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/7/16e436aa3a4ad2e1~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- sign bit（符号）: 用来表示正负号
- exponent（指数）: 用来表示次方数
- mantissa（尾数）: 用来表示精确度，所以一个数字的范围是-(2^53 -1) 至 2^53 -1 之间。

JS整数通过 Number 类型来表示，通过 64 位来表示一个数字，（1 + 11 + 52），最大安全数字是 Math.pow(2, 53) - 1。如果后台发送了超过这个值的数则会发生截断（即显示2的53次方的值）。



比如对于0.1，它的二进制为：

```javascript
0.00011001100110011001100110011001100110011001100110011001 10011...
```

转为科学计数法（科学计数法的结果就是浮点数）：

```javascript
1.1001100110011001100110011001100110011001100110011001*2^-4
```

可以看出0.1的符号位为0，指数位为-4，小数位为：

```javascript
1001100110011001100110011001100110011001100110011001
```

在 JS ==位运算==中，会先在后台把值转换为  32 位==整数==（最高位是符号位）再进行位运算操作，位运算计算完成后再将 32 位转为 64 位存储

### 按位非 NOT（~）

#### 规律

按位非的最终结果始终是对原数值取反后并减一，即`~x=-x-1`



#### ～ 判断是否等于-1 

 因为 ～-1 = 0，0=false

#### ～～ 取整（完全忽略小数部分）

因为在 JS 位运算中，会先在后台把值转换为  32 位==整数==再进行位运算操作，位运算计算完成后再将 32 位转为 64 位存储，所以`~~x == -((-x) - 1) -1 == -(-x) + 1 -1 == x`



### 按位与 AND（&）

#### 使用按位与 & 判断奇偶数

```js
偶数 & 1 // 0
奇数 & 1 // 1
```

因为十进制数字 1 的二进制为 `0000 ... 0001`，只有最后一位为 1，其余位都是 0 ，所以任何数字和它对比除最后一位其余都是 0，那么当这个数字末位为 1 时，也就是奇数，那么结果就是 1，这个数字末位为 0 时，也就是偶数，那么结果就是 0

#### 使用按位与 & 判断数字是否为2的整数幂

判断数字是否为 2 的整数幂，使用 `n & (n - 1) `

```js
let a = 20;
let b = 32;

a & (a - 1) // 16 a不是2的整数幂
b & (b - 1) // 0 	b是2的整数幂
```

如上所示，套用这个小公式，当结果等于 0 时，数值就是 2 的整数幂

其实原理也很简单，首先我们来看数值 2 的幂对应的二进制

```js
0000 0001  -> 1  	// 2^0
0000 0010  -> 2		// 2^1
0000 0100  -> 4		// 2^2
0000 1000  -> 8		// 2^3
0001 0000  -> 16	// 2^4
```

如上，2 的幂在二进制中只有一个 1 后跟一些 0，那么我们在判断一个数字是不是 2 的幂时，用 `n & (n-1)`，如果 你是 2 的幂，n 减 1 之后的二进制就是原来的那一位 1 变成 0，后面的 0 全变成 1，这个时候再和自身做按位与对比时，每一位都不同，所以每一位都是 0，即最终结果为 0



### 按位或 OR（｜）

#### 使用按位或 ｜ 取整

取整的时候我们也可以使用按位或取整

```js
1.111 | 0 // 1
2.234 | 0 // 2
```

如上所示，只需要将小数同 0 进行按位或运算即可

原理也简单，位运算操作的是整数，相当于数值的整数部分和 0 进行按位或运算

0 的二进制全是 0 ，按位或对比时 1 和 0 就是 1 ，0 和 0 就是 0，得出的二进制就是我们要取整数值的整数部分



#### 使用按位或 | 代替Math.round()

我们上面知道按位或可以取整，其实四舍五入也一样，无非正数加 0.5，负数减 0.5之后再 进行按位或取整。

```js
let a1 = 1.1
let a2 = 1.6
a1 + 0.5 | 0 // 1
a2 + 0.5 | 0 // 2

let b1 = -1.1
let b2 = -1.6
b1 - 0.5 | 0 // -1
b2 - 0.5 | 0 // -2
```



### 按位异或 XOR（^）

两者不一样就返回 1 

首先针对异或运算，这里做一个知识点的总结：

任何数和自己做异或运算，结果为 000，即 `a⊕a=0。`
任何数和 000 做异或运算，结果还是自己，即 `a⊕0=a`。
异或运算中，满足交换律和结合律，也就是 `a⊕b⊕a=b⊕a⊕a=b⊕(a⊕a)=b⊕0=b`



#### 使用按位异或 ^ 判断整数部分是否相等

按位异或可以用来判断两个整数是否相等，如下

```js
let a = 1
let b = 1
a ^ b // 0

1 ^ 1 // 0
2 ^ 2 // 0
3 ^ 3 // 0
```

我们也可以用作判断两个小数的整数部分是否相等，因为位运算操作的是整数、是整数、是整数。如下

```js
2.1 ^ 2.5 // 0
2.2 ^ 2.6 // 0
2.1 ^ 3.1 // 1
```

#### 使用按位异或 ^ 来完成值交换

```js
let a = 1
let b = 2
a ^= b
b ^= a
a ^= b
console.log(a)   // 2
console.log(b)   // 1
```

道理也很简单，我们先要了解一个东西

```js
// 如果
a ^ b = c
// 那么
c ^ b = a
c ^ a = b
```

现在你再品一下值交换为什么可以交换，细品

不过这里使用 `^` 来做值交换不如用 ES6 的解构，因为 ES6 解构更方便易懂

#### 使用按位异或 ^ 切换 0 和 1

切换 0 和 1，即当变量等于 0 时，将它变成 1，当变量等于 1 时，将它变成 0

常用于 `toggle ` 开关状态切换，做开关状态更改

```js
let toggle = 0

toggle ^= 1
```

原理也简单， `toggle ^= 1` 等同于 `toggle = toggle ^ 1`，我们知道 `0 ^ 1` 等于 1，而 `1 ^ 1` 则为 0

#### 使用按位异或 ^ 判断两数符号是否相同

我们可以使用 `(a ^ b) >= 0` 来判断两个数字符号是否相同，也就是说同为正或同为负

```js
let a = 1
let b = 2
let c = -2

(a ^ b) >= 0 // true
(a ^ c) >= 0 // false
```

原理也简单，正数二进制左首位也就是符号位是 0，而负数则是 1

按位异或在对比时，只有一正一负时才为 1，两位都是 0 或者都是 1 时结果为 0

所以，两个数值符号一样时按位异或对比后的二进制结果符号位肯定是 0，最终数值也就是 `>=0`，反之则 `<0`



### 左移（<<）

将数值的二进制码按照指定的位数向左移动，符号位不变。空位补 0 

数字 x 左移 y 位我们其实可以得到一个公式，如下

```js
x << y 

// 等同于

x * 2^y
```



### 有符号右移（>>）

将数值的二进制码按照指定的位数向右移动，符号位不变。有符号右移时移动数位后会造成空位，空位位于数字的左侧，但位于符号位之后，`ECMAScript` 中用符号位的值填充这些空位

数字 x 有符号右移 y 位我们也可以得到一个公式，如下

```js
x >> y 

// 等同于

x / 2^y //除于2后向下取整
```



### 无符号右移（>>>）

将数值的所有 32 位字符都右移，空位补 0 ，所以右移完的数值一定是非负的。





### 使用位运算管理权限

以 Vue 这部分源码为例子来解释，下面我们可以看到，`PatchFlags` 中定义了 `TEXT、CLASS` 等共计 11种 类型，除了最后两种特殊类型外，其余每一种类型的值都是依次将 1 左移一位得到的。

```javascript
// Patch flags can be combined using the | bitwise operator and can be checked
// using the & operator, e.g.
//
//   const flag = TEXT | CLASS
//   if (flag & TEXT) { ... }
//
// Check the `patchElement` function in './renderer.ts' to see how the
// flags are handled during diff.
export const enum PatchFlags {
  TEXT = 1, // 1 << 0
  CLASS = 1 << 1,
  STYLE = 1 << 2,
  PROPS = 1 << 3,
  FULL_PROPS = 1 << 4,
  HYDRATE_EVENTS = 1 << 5,
  STABLE_FRAGMENT = 1 << 6,
  KEYED_FRAGMENT = 1 << 7,
  UNKEYED_FRAGMENT = 1 << 8,
  NEED_PATCH = 1 << 9,
  DYNAMIC_SLOTS = 1 << 10,

  // SPECIAL FLAGS -------------------------------------------------------------

  // Special flags are negative integers. They are never matched against using
  // bitwise operators (bitwise matching should only happen in branches where
  // patchFlag > 0), and are mutually exclusive. When checking for a special
  // flag, simply check patchFlag === FLAG.
  HOISTED = -1,
  BAIL = -2
}

```

#### 左移（<<）初始化权限

首先，使用 1 的左移来分配各个类型权限，上文左移运算我们说过，左移就是将数值的二进制码按照指定的位数向左移动，符号位不变，那么这里即如下面这样

```js
// 1 的二进制为 00000001

1 << 0  // 00000001
1 << 1  // 00000010
1 << 2  // 00000100
1 << 3  // 00001000
1 << 4  // 00010000
1 << 5  // 00100000

...
```

#### 按位与AND（&）校验权限

接着我们看类型权限校验，我们先初始化几个不同的用户权限角色

```js
let permission1 = 0 	// 无任何权限
let permission2 = TEXT 	// 1 >> 0 
let permission3 = CLASS // 1 >> 1
```

假如我们的条件是判断该用户角色有没有 `CLASS` 权限，即可以用 按位与 AND（&）判断

```js
if(permission1 & CLASS) // 00000000 & 00000010 = 00000000 = 0 = false
if(permission2 & CLASS) // 00000001 & 00000010 = 00000000 = 0 = false
if(permission3 & CLASS) // 00000010 & 00000010 = 00000010 = 2 = true
```

#### 按位或OR（｜）赋予权限

接下来看权限赋予以及组合类型权限，比如我们想要一个 `TEXT` 和 `CLASS` 的组合权限角色

```js
// 初始化一个新的用户角色 permission4 并初始化，初始化角色即无权限状态 0 
let permission4 = 0

// 赋予 TEXT（1 << 0） 权限
permission4 ｜= TEXT

// 赋予 CLASS（1 << 1） 权限
permission4 ｜= CLASS

// 新的组合类型的用户角色权限即 00000011 ，如下
permission4 = 0 ｜ TEXT ｜ CLASS

// 0           = 0000 0000
// TEXT        = 0000 0001
// CLASS       = 0000 0010
// -----------------------
// permission4 = 0000 0011


// 权限校验，& 对比二进制操作位
permission4 & TEXT  // 0000 0011 & 0000 0001 = 0000 0001 = 1 = true
permission4 & CLASS // 0000 0011 & 0000 0010 = 0000 0010 = 2 = true
permission4 & STYLE // 0000 0011 & 0000 0100 = 0000 0000 = 0 = false
```



#### 总结

使用二进制可以减少运行时间，二进制的运算级别是O(1)。

- 通过`unknownFlags & Placement`判断`unknownFlags`是否包含`Placement`
- 通过`unknownFlags |= Placement`将`Placement`合并进`unknownFlags`中
- 通过`unknownFlags &= ~Placement`将`Placement`从`unknownFlags`中删去

#### 举例

初始化：students能看为0000 0001， teachers能看为1<<1即0000 0010，admin能看为1<<2即0000 0100;

通过按位与来判断权限，如果这个路由的roles字段为0000 0100则admin能看，其他不能看，如果为0则所有都不能看，如果为0000 0111则都能看，如果为0000 0110 则除了students都能看



### 位运算的运用

#### 一、几个有趣的位操作

1. **利用或操作 `|` 和空格将英文字符转换为小写**

```java
('a' | ' ') = 'a'
('A' | ' ') = 'a'
```

1. **利用与操作 `&` 和下划线将英文字符转换为大写**

```java
('b' & '_') = 'B'
('B' & '_') = 'B'
```

1. **利用异或操作 `^` 和空格进行英文字符大小写互换**

```java
('d' ^ ' ') = 'D'
('D' ^ ' ') = 'd'
```

以上操作能够产生奇特效果的原因在于 ASCII 编码。ASCII 字符其实就是数字，恰巧空格和下划线对应的数字通过位运算就能改变大小写。有兴趣的读者可以查 ASCII 码表自己算算，本文就不展开讲了。

1. **不用临时变量交换两个数**

```java
int a = 1, b = 2;
a ^= b;
b ^= a;
a ^= b;
// 现在 a = 2, b = 1
```

1. **加一**

```java
int n = 1;
n = -~n;
// 现在 n = 2
```

1. **减一**

```java
int n = 2;
n = ~-n;
// 现在 n = 1
```

1. **判断两个数是否异号**

```java
int x = -1, y = 2;
boolean f = ((x ^ y) < 0); // true

int x = 3, y = 2;
boolean f = ((x ^ y) < 0); // false
```

如果说前 6 个技巧的用处不大，这第 7 个技巧还是比较实用的，利用的是**补码编码**的符号位。整数编码最高位是符号位，负数的符号位是 1，非负数的符号位是 0，再借助异或的特性，可以判断出两个数字是否异号。

当然，如果不用位运算来判断是否异号，需要使用 if else 分支，还挺麻烦的。你可能想利用乘积来判断两个数是否异号，但是这种处理方式容易造成整型溢出，从而出现错误。

#### [#](https://labuladong.github.io/algo/di-san-zha-24031/shu-xue-yu-659f1/chang-yong-13a76/#index-arr-length-1-的运用)`index & (arr.length - 1)` 的运用

我在 [单调栈解题套路](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-daeca/dan-diao-z-1bebe/) 中介绍过环形数组，其实就是利用求模（余数）的方式让数组看起来头尾相接形成一个环形，永远都走不完：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var arr = [1, 2, 3, 4];
var index = 0;
while (true) {
    // 在环形数组中转圈
    console.log(arr[index % arr.length]);
    index++;
}
// 输出：1,2,3,4,1,2,3,4,1,2,3,4...
```

但模运算 `%` 对计算机来说其实是一个比较昂贵的操作，所以我们可以用 `&` 运算来求余数：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var arr = [1,2,3,4];
var index = 0;
while (true) {
    // 在环形数组中转圈
    console.log(arr[index & (arr.length - 1)]);
    index++;
}
// 输出：1,2,3,4,1,2,3,4,1,2,3,4...
```

注

注意这个技巧只适用于数组长度是 2 的幂次方的情况，比如 2、4、8、16、32 以此类推。至于如何将数组长度扩展为 2 的幂次方，这也是有比较巧妙的位运算算法的，可以参考 [https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2open in new window](https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2)

简单说，`& (arr.length - 1)` 这个位运算能够替代 `% arr.length` 的模运算，性能会更好一些。

那问题来了，现在是不断地 `index++`，你做到了循环遍历。但如果不断地 `index--`，还能做到环形数组的效果吗？

答案是，如果你使用 `%` 求模的方式，那么当 `index` 小于 0 之后求模的结果也会出现负数，你需要特殊处理。但通过 `&` 与运算的方式，`index` 不会出现负数，依然可以正常工作：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var arr = [1,2,3,4];
var index = 0;
while (true) {
    console.log(arr[index & (arr.length - 1)]);
    index--;
}
// 输出：1,4,3,2,1,4,3,2,1,4,3,2,1...
```

我们自己写代码一般用不到这个技巧，但在学习一些其他代码库时可能会经常看到，这里留个印象，到时候就不会懵逼了。

#### [#](https://labuladong.github.io/algo/di-san-zha-24031/shu-xue-yu-659f1/chang-yong-13a76/#二、n-n-1-的运用)二、`n & (n-1)` 的运用

**`n & (n-1)` 这个操作在算法中比较常见，作用是消除数字 `n` 的二进制表示中的最后一个 1**。

看个图就很容易理解了：

![img](https://labuladong.github.io/algo/images/%E4%BD%8D%E6%93%8D%E4%BD%9C/1.png)

其核心逻辑就是，`n - 1` 一定可以消除最后一个 1，同时把其后的 0 都变成 1，这样再和 `n` 做一次 `&` 运算，就可以仅仅把最后一个 1 变成 0 了。

**1、计算汉明权重**（Hamming Weight）

这是力扣第 191 题「[位 1 的个数open in new window](https://leetcode.cn/problems/number-of-1-bits/)」：

<details class="hint-container details" open="" style="transition: background var(--vp-tt),color var(--vp-tt); display: block; margin: 1rem 0px; padding: 1.5rem; border-radius: 0.5rem; background: var(--detail-bg-color); color: rgb(44, 62, 80); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, STHeiti, &quot;Microsoft YaHei&quot;, SimSun, sans-serif; font-size: 17px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary style="position: relative; margin: -1.5rem -1.5rem 0.5em; padding-block: 1.5rem; padding-inline: 4rem 1.5rem; list-style: none; cursor: pointer;"><strong style="font-weight: 600;">191. 位1的个数</strong>&nbsp;|<span>&nbsp;</span><a target="_blank" href="https://leetcode.cn/problems/number-of-1-bits/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">力扣<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|<span>&nbsp;</span><a target="_blank" href="https://leetcode.com/problems/number-of-1-bits/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">LeetCode<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|</summary><div><p style="line-height: 1.6; overflow-wrap: break-word;">编写一个函数，输入是一个无符号整数（以二进制串的形式），返回其二进制表达式中数字位数为 '1' 的个数（也被称为<a href="https://baike.baidu.com/item/%E6%B1%89%E6%98%8E%E9%87%8D%E9%87%8F" target="_blank" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">汉明重量</a>）。</p><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">提示：</strong></p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"><li>请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。</li><li>在 Java 中，编译器使用<a href="https://baike.baidu.com/item/%E4%BA%8C%E8%BF%9B%E5%88%B6%E8%A1%A5%E7%A0%81/5295284" target="_blank" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">二进制补码</a>记法来表示有符号整数。因此，在&nbsp;<strong style="font-weight: 600;">示例 3</strong>&nbsp;中，输入表示有符号整数<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">-3</code>。</li></ul><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 1：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>n = 00000000000000000000000000001011
<strong style="font-weight: 600;">输出：</strong>3
<strong style="font-weight: 600;">解释：</strong>输入的二进制串 <code style="margin: 0px; padding: 0px; border-radius: 0px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: unset; font-family: var(--font-family-mono); transition: color var(--color-transition); color: var(--code-color); text-align: left; white-space: pre; word-spacing: normal; word-break: normal; hyphens: none; -webkit-font-smoothing: auto;"><strong style="font-weight: 600;">00000000000000000000000000001011</strong>&nbsp;中，共有三位为 '1'。</code>
</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 2：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>n = 00000000000000000000000010000000
<strong style="font-weight: 600;">输出：</strong>1
<strong style="font-weight: 600;">解释：</strong>输入的二进制串 <strong style="font-weight: 600;">00000000000000000000000010000000</strong>&nbsp;中，共有一位为 '1'。
</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 3：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>n = 11111111111111111111111111111101
<strong style="font-weight: 600;">输出：</strong>31
<strong style="font-weight: 600;">解释：</strong>输入的二进制串 <strong style="font-weight: 600;">11111111111111111111111111111101</strong> 中，共有 31 位为 '1'。</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">提示：</strong></p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"><li>输入必须是长度为<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">32</code><span>&nbsp;</span>的<span>&nbsp;</span><strong style="font-weight: 600;">二进制串</strong><span>&nbsp;</span>。</li></ul><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"></ul><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">进阶</strong>：</p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"><li>如果多次调用这个函数，你将如何优化你的算法？</li></ul></div></details>

就是让你返回 `n` 的二进制表示中有几个 1。因为 `n & (n - 1)` 可以消除最后一个 1，所以可以用一个循环不停地消除 1 同时计数，直到 `n` 变成 0 为止。

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var hammingWeight = function(n) {
    var res = 0;
    while (n != 0) {
        n = n & (n - 1);
        res++;
    }
    return res;
};
```

**2、判断一个数是不是 2 的指数**

力扣第 231 题「[2 的幂open in new window](https://leetcode.cn/problems/power-of-two/)」就是这个问题。

一个数如果是 2 的指数，那么它的二进制表示一定只含有一个 1：

```java
2^0 = 1 = 0b0001
2^1 = 2 = 0b0010
2^2 = 4 = 0b0100
```

如果使用 `n & (n-1)` 的技巧就很简单了（注意运算符优先级，括号不可以省略）：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var isPowerOfTwo = function(n) {
    if (n <= 0) return false;
    return (n & (n - 1)) === 0;
};
```

#### [#](https://labuladong.github.io/algo/di-san-zha-24031/shu-xue-yu-659f1/chang-yong-13a76/#三、a-a-0-的运用)三、`a ^ a = 0` 的运用d

异或运算的性质是需要我们牢记的：

一个数和它本身做异或运算结果为 0，即 `a ^ a = 0`；一个数和 0 做异或运算的结果为它本身，即 `a ^ 0 = a`。

**1、查找只出现一次的元素**

这是力扣第 136 题「[只出现一次的数字open in new window](https://leetcode.cn/problems/single-number/)」：

<details class="hint-container details" open="" style="transition: background var(--vp-tt),color var(--vp-tt); display: block; margin: 1rem 0px; padding: 1.5rem; border-radius: 0.5rem; background: var(--detail-bg-color); color: rgb(44, 62, 80); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, STHeiti, &quot;Microsoft YaHei&quot;, SimSun, sans-serif; font-size: 17px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary style="position: relative; margin: -1.5rem -1.5rem 0.5em; padding-block: 1.5rem; padding-inline: 4rem 1.5rem; list-style: none; cursor: pointer;"><strong style="font-weight: 600;">136. 只出现一次的数字</strong>&nbsp;|<span>&nbsp;</span><a target="_blank" href="https://leetcode.cn/problems/single-number/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">力扣<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|<span>&nbsp;</span><a target="_blank" href="https://leetcode.com/problems/single-number/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">LeetCode<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|</summary><div><p style="line-height: 1.6; overflow-wrap: break-word;">给你一个<span>&nbsp;</span><strong style="font-weight: 600;">非空</strong><span>&nbsp;</span>整数数组<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">nums</code><span>&nbsp;</span>，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。</p><p style="line-height: 1.6; overflow-wrap: break-word;">你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。</p><div class="original__bRMd"><div><p style="line-height: 1.6; overflow-wrap: break-word;"><strong class="example" style="font-weight: 600;">示例 1 ：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [2,2,1]
<strong style="font-weight: 600;">输出：</strong>1
</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong class="example" style="font-weight: 600;">示例 2 ：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [4,1,2,1,2]
<strong style="font-weight: 600;">输出：</strong>4
</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong class="example" style="font-weight: 600;">示例 3 ：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [1]
<strong style="font-weight: 600;">输出：</strong>1
</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">提示：</strong></p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></code></li><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">-3 * 10<sup>4</sup><span>&nbsp;</span>&lt;= nums[i] &lt;= 3 * 10<sup>4</sup></code></li><li>除了某个元素只出现一次以外，其余每个元素均出现两次。</li></ul></div></div></div></details>

对于这道题目，我们只要把所有数字进行异或，成对儿的数字就会变成 0，落单的数字和 0 做异或还是它本身，所以最后异或的结果就是只出现一次的元素：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var singleNumber = function(nums) {
    var res = 0;
    for (var i = 0; i < nums.length; i++) {
        res ^= nums[i];
    }
    return res;
};
```

**2、寻找缺失的元素**

这是力扣第 268 题「[丢失的数字open in new window](https://leetcode.cn/problems/missing-number/)」：

<details class="hint-container details" open="" style="transition: background var(--vp-tt),color var(--vp-tt); display: block; margin: 1rem 0px; padding: 1.5rem; border-radius: 0.5rem; background: var(--detail-bg-color); color: rgb(44, 62, 80); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, STHeiti, &quot;Microsoft YaHei&quot;, SimSun, sans-serif; font-size: 17px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary style="position: relative; margin: -1.5rem -1.5rem 0.5em; padding-block: 1.5rem; padding-inline: 4rem 1.5rem; list-style: none; cursor: pointer;"><strong style="font-weight: 600;">268. 丢失的数字</strong>&nbsp;|<span>&nbsp;</span><a target="_blank" href="https://leetcode.cn/problems/missing-number/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">力扣<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|<span>&nbsp;</span><a target="_blank" href="https://leetcode.com/problems/missing-number/" rel="noopener noreferrer" style="color: var(--vp-tc); font-weight: 500; text-decoration: none; overflow-wrap: break-word;">LeetCode<span>&nbsp;</span><span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px; user-select: none;">open in new window</span></span></a><span>&nbsp;</span>|</summary><div><p style="line-height: 1.6; overflow-wrap: break-word;">给定一个包含<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">[0, n]</code>&nbsp;中&nbsp;<code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">n</code>&nbsp;个数的数组<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">nums</code><span>&nbsp;</span>，找出<span>&nbsp;</span><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">[0, n]</code><span>&nbsp;</span>这个范围内没有出现在数组中的那个数。</p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"></ul><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 1：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [3,0,1]
<strong style="font-weight: 600;">输出：</strong>2
<b>解释：</b>n = 3，因为有 3 个数字，所以所有的数字都在范围 [0,3] 内。2 是丢失的数字，因为它没有出现在 nums 中。</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 2：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [0,1]
<strong style="font-weight: 600;">输出：</strong>2
<b>解释：</b>n = 2，因为有 2 个数字，所以所有的数字都在范围 [0,2] 内。2 是丢失的数字，因为它没有出现在 nums 中。</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 3：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [9,6,4,2,3,5,7,0,1]
<strong style="font-weight: 600;">输出：</strong>8
<b>解释：</b>n = 9，因为有 9 个数字，所以所有的数字都在范围 [0,9] 内。8 是丢失的数字，因为它没有出现在 nums 中。</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">示例 4：</strong></p><pre style="direction: ltr; overflow: auto; margin: 0.85rem 0px; padding: 1rem; border-radius: 6px; line-height: 1.375;"><strong style="font-weight: 600;">输入：</strong>nums = [0]
<strong style="font-weight: 600;">输出：</strong>1
<b>解释：</b>n = 1，因为有 1 个数字，所以所有的数字都在范围 [0,1] 内。1 是丢失的数字，因为它没有出现在 nums 中。</pre><p style="line-height: 1.6; overflow-wrap: break-word;"><strong style="font-weight: 600;">提示：</strong></p><ul style="line-height: 1.6; overflow-wrap: break-word; padding-inline-start: 1.2em;"><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">n == nums.length</code></li><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">1 &lt;= n &lt;= 10<sup>4</sup></code></li><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">0 &lt;= nums[i] &lt;= n</code></li><li><code style="margin: 0px; padding: 0.2rem 0.4rem; border-radius: 5px; background: var(--detail-code-bg-color); font-size: 0.85em; overflow-wrap: break-word; font-family: var(--font-family-mono); transition: background var(--color-transition),color var(--color-transition);">nums</code><span>&nbsp;</span>中的所有数字都<span>&nbsp;</span><strong style="font-weight: 600;">独一无二</strong></li></ul><p style="line-height: 1.6; overflow-wrap: break-word; margin-bottom: 0px; padding-bottom: 0px;"><strong style="font-weight: 600;">进阶：</strong>你能否实现线性时间复杂度、仅使用额外常数空间的算法解决此问题?</p></div></details>

给一个长度为 `n` 的数组，其索引应该在 `[0,n)`，但是现在你要装进去 `n + 1` 个元素 `[0,n]`，那么肯定有一个元素装不下嘛，请你找出这个缺失的元素。

这道题不难的，我们应该很容易想到，把这个数组排个序，然后遍历一遍，不就很容易找到缺失的那个元素了吗？

或者说，借助数据结构的特性，用一个 HashSet 把数组里出现的数字都储存下来，再遍历 `[0,n]` 之间的数字，去 HashSet 中查询，也可以很容易查出那个缺失的元素。

排序解法的时间复杂度是 O(NlogN)，HashSet 的解法时间复杂度是 O(N)，但是还需要 O(N) 的空间复杂度存储 HashSet。

这个问题其实还有一个特别简单的解法：等差数列求和公式。

题目的意思可以这样理解：现在有个等差数列 `0, 1, 2,..., n`，其中少了某一个数字，请你把它找出来。那这个数字不就是 `sum(0,1,..n) - sum(nums)` 嘛？

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var missingNumber = function(nums) {
    var n = nums.length;
    // 虽然题目给的数据范围不大，但严谨起见，用 long 类型防止整型溢出
    // 求和公式：(首项 + 末项) * 项数 / 2
    var expect = (0 + n) * (n + 1) / 2;
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += nums[i];
    }
    return (expect - sum);
};
```

不过，本文的主题是位运算，我们来讲讲如何利用位运算技巧来解决这道题。

再回顾一下异或运算的性质：一个数和它本身做异或运算结果为 0，一个数和 0 做异或运算还是它本身。

而且异或运算满足交换律和结合律，也就是说：

```java
2 ^ 3 ^ 2 = 3 ^ (2 ^ 2) = 3 ^ 0 = 3
```

而这道题索就可以通过这些性质巧妙算出缺失的那个元素，比如说 `nums = [0,3,1,4]`：

![img](https://labuladong.github.io/algo/images/%E7%BC%BA%E5%A4%B1%E5%85%83%E7%B4%A0/1.jpg)

为了容易理解，我们假设先把索引补一位，然后让每个元素和自己相等的索引相对应：

![img](https://labuladong.github.io/algo/images/%E7%BC%BA%E5%A4%B1%E5%85%83%E7%B4%A0/2.jpg)

这样做了之后，就可以发现除了缺失元素之外，所有的索引和元素都组成一对儿了，现在如果把这个落单的索引 2 找出来，也就找到了缺失的那个元素。

如何找这个落单的数字呢，**只要把所有的元素和索引做异或运算，成对儿的数字都会消为 0，只有这个落单的元素会剩下**，也就达到了我们的目的：

java 🟢cpp 🤖python 🤖go 🤖javascript 🤖

```javascript
// 注意：javascript 代码由 chatGPT🤖 根据我的 java 代码翻译，旨在帮助不同背景的读者理解算法逻辑。
// 本代码不保证正确性，仅供参考。如有疑惑，可以参照我写的 java 代码对比查看。

var missingNumber = function(nums) {
    const n = nums.length;
    let res = 0;
    // 先和新补的索引异或一下
    res ^= n;
    // 和其他的元素、索引做异或
    for (let i = 0; i < n; i++)
        res ^= i ^ nums[i];
    return res;
}
```

![img](https://labuladong.github.io/algo/images/%E7%BC%BA%E5%A4%B1%E5%85%83%E7%B4%A0/3.jpg)

由于异或运算满足交换律和结合律，所以总是能把成对儿的数字消去，留下缺失的那个元素。

到这里，常见的位运算差不多都讲完了。这些技巧就是会者不难难者不会，也不需要死记硬背，只要有个印象就完全够用了。





#### 各种位运算的技巧

看这个网站：https://graphics.stanford.edu/~seander/bithacks.html



## 逻辑

### ||

If `expr1` can be converted to `true`, returns `expr1`; else, returns `expr2`.





### &&

If `expr1` can be converted to `true`, returns `expr2`; else, returns `expr1`.



### **空值合并运算符**（**`??`**）

当左侧的操作数为 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) 或者 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 时，返回其右侧操作数，否则返回左侧操作数。





### 逻辑空赋值(??=)

逻辑空赋值运算符 (`x ??= y`) 仅在 `x` 是 [nullish](https://developer.mozilla.org/zh-CN/docs/Glossary/Nullish) (`null` 或 `undefined`) 时对其赋值

```javascript
const a = { duration: 50 };

a.duration ??= 10;
console.log(a.duration);
// expected output: 50

a.speed ??= 25;
console.log(a.speed);
// expected output: 25

```

```typescript
//逻辑空赋值，如果前面的值为undifined或null时才赋这个值
const routeName = storage.get(CacheEnum.REDIRECT_ROUTE_NAME)??'home'
```



### 可选链操作符（?.）

?.用来判断左侧的表达式是否是 null | undefined，该表达式短路返回值是 `undefined`。

比如我们写出`a?.b`时，编译器会自动生成如下代码

```typescript
a === null || a === void 0 ? void 0 : a.b;
```

这里涉及到一个小知识点:`undefined`这个值在非严格模式下会被重新赋值，使用`void 0`必定返回真正的 undefined。





## 跟对象相关

### in

==属性==在对象或其原型链中，则**`in` 运算符**返回`true`

```javascript
const car = { make: 'Honda', model: 'Accord', year: 1998 };

console.log('make' in car);
// expected output: true
```



### delete

 **`delete` 操作符**用于删除对象的某个属性

```javascript
delete expression
```

返回值对于所有情况都是`true`，除非属性是一个[`自身的`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) [`不可配置`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Cant_delete)的属性，在这种情况下，非严格模式返回 `false`。



### **`instanceof`** 

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```javascript
object instanceof constructor //左边可以是任意值，右边只能是函数
```

模拟实现

```javascript
function myinstanceof(instance, constructor) {
    if (typeof constructor !== 'function') {
        return new TypeError('s')
    }
    if (!instance || (typeof instance !== 'object' && typeof instance !== 'function')) return new TypeError('s')
    let proto = Object.getPrototypeOf(instance)
    while (true) {
        if (proto === constructor.prototype) return true
        if (!proto) return false
        proto=Object.getPrototypeOf(proto)
    }
}
```





### new

#### 细节

在实例化时，如果不想传参数，那么构造函数后面的括号可加可不加

```javascript
let person1 = new Person() 
let person2 = new Person
```



#### 实现步骤

*1.新建一个对象，该对象的_proto_为 函数的原型对象prototype*

*2.以这个对象为this值执行该函数*

*3.如果执行完函数后返回的值不是一个引用类型则返回新建的那个对象，如果是引用类型则返回该引用类型*

《红宝书》里的说法：（1）在内存中创建一个新对象。（2）这个新对象内部的[[Prototype]]特性被赋值为构造函数的prototype属性。（3）构造函数内部的this被赋值为这个新对象（即this指向新对象）。（4）执行构造函数内部的代码（给新对象添加属性）。（5）如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

#### 模拟实现

```javascript
function newOperator(constructor, ...args) {
  if (typeof constructor !== "function") {
    throw TypeError("type error")
  }
  const obj = Object.create(constructor.prototype)
  const result = constructor.call(obj, ...args)
  let isReferenceType =
    result && (typeof result === "object" || typeof result === "function")
  //'result&&'这里保证了result不是null，null也是object

  return isReferenceType ? result : obj
}
```





### 可选链操作符

通过连接的对象的引用或函数可能是 `undefined` 或 `null` 时，可选链操作符提供了一种方法来简化被连接对象的值访问。

比如，思考一个存在嵌套结构的对象 `obj`。不使用可选链的话，查找一个深度嵌套的子属性时，需要验证之间的引用，例如：

```
let nestedProp = obj.first && obj.first.second;
```

为了避免报错，在访问`obj.first.second`之前，要保证 `obj.first` 的值既不是 `null`，也不是 `undefined`。如果只是直接访问 `obj.first.second`，而不对 `obj.first` 进行校验，则有可能抛出错误。

有了可选链操作符（`?.`），在访问 `obj.first.second` 之前，不再需要明确地校验 `obj.first` 的状态，再并用短路计算获取最终结果：

```
let nestedProp = obj.first?.second;
```

通过使用 `?.` 操作符取代 `.` 操作符，JavaScript 会在尝试访问 `obj.first.second` 之前，先隐式地检查并确定 `obj.first` 既不是 `null` 也不是 `undefined`。如果`obj.first `是 `null` 或者 `undefined`，表达式将会短路计算直接返回 `undefined`。

这等价于以下表达式，但实际上没有创建临时变量：

```
let temp = obj.first;
let nestedProp = ((temp === null || temp === undefined) ? undefined : temp.second);
```



[可选链与函数调用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#可选链与函数调用)

当尝试调用一个可能不存在的方法时也可以使用可选链。这将是很有帮助的，比如，当使用一个API的方法可能不可用时，要么因为实现的版本问题要么因为当前用户的设备不支持该功能。

函数调用时如果被调用的方法不存在，使用可选链可以使表达式自动返回`undefined`而不是抛出一个异常。

```
let result = someInterface.customMethod?.();
```







##  扩展运算符

### 数组

扩展运算符就是打平了一层数组

- **复制数组**

```javascript
const arr1 = [1, 2];
const arr2 = [...arr1];
```

要记住：**扩展运算符(…)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中**，这里参数对象是个数组，数组里面的所有对象都是基础数据类型，将所有基础数据类型重新拷贝到新的数组中。

- **合并数组**

如果想在数组内合并数组，可以这样：

```javascript
const arr1 = ['two', 'three'];const arr2 = ['one', ...arr1, 'four', 'five'];// ["one", "two", "three", "four", "five"]
```

- **扩展运算符与解构赋值结合起来，用于生成数组**

```javascript
const [first, ...rest] = [1, 2, 3, 4, 5];first // 1rest  // [2, 3, 4, 5]
```

需要注意：**如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。**



- **将字符串转为真正的数组**

```javascript
[...'hello']    // [ "h", "e", "l", "l", "o" ]
```





### 对象

浅拷贝 (Shallow-cloning，不包含 prototype) 和对象合并，可以使用更简短的展开语法。而不必再使用 [`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方式。

```
var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };

var clonedObj = { ...obj1 };
// 克隆后的对象: { foo: "bar", x: 42 }

var mergedObj = { ...obj1, ...obj2 };
// 合并后的对象: { foo: "baz", x: 42, y: 13 }
```

Copy to Clipboard

**提示**: [`Object.assign()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 函数会触发 [setters](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)，而展开语法则不会。



## 对象和数组的解构

 **1）数组的解构** 在解构数组时，以元素的位置为匹配条件来提取想要的数据的：

```javascript
const [a, b, c] = [1, 2, 3]
```

还可以通过给左侧变量数组设置空占位的方式，实现对数组中某几个元素的精准提取：

```javascript
const [a,,c] = [1,2,3]//通过把中间位留空，可以顺利地把数组第一位和最后一位的值赋给 a、c 两个变量
```



**2）对象的解构** 在解构对象时，是以属性的名称为匹配条件，来提取想要的数据的。

还可以**提取高度嵌套的对象里的指定属性**

```javascript
//例如：
const school = {
   classes: {
      stu: {
         name: 'Bob',
         age: 24,
      }
   }
}

const { classes: { stu: { name } }} = school
console.log(name)  // 'Bob'
```



解构时重命名或赋默认值

```javascript
const obj = {
  a: 1,
  b: 2,
  c: 3
}

const { a: a1, b: b2, c: c3, d: d4 = "default" } = obj
```

通过上面对 `obj` 对象的结构，会得到 `a1`、`b2`、`c3` 和 `d4` 这 4 个变量，同时由于 `obj` 里面没有 `d` 属性，所以 `d4` 会被赋予默认值 `default`。







# 数组

## 稀疏数组不能使用数组的内置api。



## 如果想创建一个全是同一个对象但不同引用的数组

用`new array（9）.fill（｛x：0｝）`这样的话都是同一个对象引用，要`new array（9）.fill（（）=>｛x：0｝）`才能返回不同引用的对象。





## 类数组对象

### 简介

可以通过索引访问元素，并且拥有 length 属性；但是不能调用数组的方法。

常见的类数组对象有 arguments 和 DOM 方法的返回结果，类数组对象可以使用扩展运算符

- **Iterable** 是实现了 `Symbol.iterator` 方法的对象。
- **Array-like** 是有索引和 `length` 属性的对象，所以它们看起来很像数组。
- 这两个是完全互不相关的概念，比如字符串即是可迭代的（`for..of` 对它们有效），又是类数组的（它们有数值索引和 `length` 属性）。可迭代对象和类数组对象通常都 **不是数组**，它们没有 `push` 和 `pop` 等方法。



### 检测类数组

underscore的实现

```javascript
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
```

### 类数组转数组的方法

- ... 运算符
- Array.from
- Array.prototype.slice.apply(arguments)



## 数组原生方法

### 常用方法

| 方法    | 作用                           | 是否影响原数组 |
| :------ | :----------------------------- | :------------- |
| push    | 在数组后添加元素，返回长度     | ✅              |
| pop     | 删除数组最后一项，返回被删项   | ✅              |
| shift   | 删除数组第一项，返回被删项     | ✅              |
| unshift | 数组开头添加元素，返回长度     | ✅              |
| reserve | 反转数组，返回数组             | ✅              |
| sort    | 排序数组，返回数组             | ✅              |
| splice  | 截取数组，返回被截取部分       | ✅              |
| join    | 将数组变字符串，返回字符串     | ❌              |
| concat  | 连接数组                       | ❌              |
| map     | 相同规则处理数组项，返回新数组 | ❌              |
| forEach | 遍历数组                       | ❌              |
| filter  | 过滤数组项，返回符合条件的数组 | ❌              |
| every   | 每一项符合规则才返回true       | ❌              |
| some    | 只要有一项符合规则就返回true   | ❌              |
| reduce  | 接受上一个return和数组下一项   | ❌              |
| flat    | 数组扁平化                     | ❌              |
| slice   | 截取数组，返回被截取区间       | ❌              |

### 转换成数组[Array.from](https://zh.javascript.info/iterable#arrayfrom)

#### [Array.from](https://zh.javascript.info/iterable#arrayfrom)

接受一个可迭代或类数组的值，并从中获取一个“真正的”数组

如果接收的是一个可迭代对象，则执行里面的[Symbol.iterater]方法生成一个数组

如果接收的是一个类数组，那类数组不是有索引嘛，直接弄呗



#### 完整语法

```javascript
Array.from(obj[, mapFn, thisArg])
```

可选的第二个参数 `mapFn` 可以是一个函数，该函数会在对象中的元素被添加到数组前，被应用于每个元素，此外 `thisArg` 允许我们为该函数设置 `this`。

例如：

```javascript
// 假设 obj 来自上文例子中

// 求每个数的平方
let arr = Array.from(obj, num => num * num);
```







### 数组转换成字符串

toString()、join() 其中 join() 方法可以指定转换为字符串时的分隔符。

### 数组增删

数组尾部操作的方法 pop() 和 push()，push 方法可以传入多个参数。

数组首部操作的方法 shift() 和 unshift() 

数组插入方法 splice()，影响原数组

### 数组排序

 reverse() 和 sort() //直接修改原数组

sort() 方法可以传入一个函数来进行比较，传入前后两个值，如果返回值为正数，则交换两个参数的位置。



### 数组连接

数组连接的方法 concat() ，返回的是拼接好的数组，不影响原数组。



### 数组截取

`slice()` 方法返回一个新的数组对象，这一对象是一个原数组的**浅拷贝**（包括 `begin`，不包括`end`）。原始数组不会被改变。



### 数组查找

#### 查找索引

indexOf() 、 lastIndexOf()、`findIndex()`方法返回数组中满足提供的测试函数的第一个元素的**索引**。若没有找到对应元素则返回-1

#### 查找元素

`find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

### 数组迭代

 every()、some()、filter()、map() 和 forEach() 方法

#### `filter()` 

创建一个==新数组==，其包含通过所提供函数实现的测试的所有元素。

[参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#参数)

- `callback`

  用来测试数组的每个元素的函数。返回 `true` 表示该元素通过测试，保留该元素，`false` 则不保留。它接受以下三个参数：

  - `element`数组中当前正在处理的元素。
  - `index`可选正在处理的元素在数组中的索引。
  - `array`可选调用了 `filter` 的数组本身。

- `thisArg`可选

  执行 `callback` 时，用于 `this` 的值。

```javascript
//手写
Array.prototype.myFilter = function (cb,thisArg){
    if(!Array.isArray(this)) throw new Error('s')
    if(typeof cb !== 'function'){
        throw new Error('s')
    }
    const len = this.length,result=[]
    let k=0
    while(k<len){
        if(this.hasOwnProperty(k)){
            if(cb.call(thisArg,this[k],k,this)){
                result.push(this[k])
            }
        }
        k++
    }
    return result
}
```







#### `map()` 

创建一个==新数组==，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

[参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#parameters)

- `callback`

  生成新数组元素的函数，使用三个参数：

  - `currentValue `
  - index`可选`
  - array`可选`

- `thisArg`可选

  执行 `callback` 函数时值被用作`this`。

```javascript
//手写
Array.prototype.myMap = function (cb,thisArg){
    if(!Array.isArray(this)) throw new Error('s')
    if(typeof cb !== 'function'){
        throw new Error('s')
    }
    const len = this.length,result=[]
    for(let i=0;i<len;i++){
        if(this.hasOwnProperty(i)){
            result[i]=cb.call(thisArg,this[i],i,this)
        }
    }
    return result
}
```







### 数组归并

 reduce() 和 reduceRight() 方法

手写reduce()

```javascript
Array.prototype.myReduce = function (cb,initialValue){
    if(!Array.isArray(this)) throw new Error('s')
    if(typeof cb !== 'function'){
        throw new Error('s')
    }
    const len = this.length
    let accumulator,k=0
//初始化accumulator的初始值,如果参数initialValue为undefined则accumulator初始化为数组的第一个值
    if(initialValue){
        accumulator=initialValue
    }else{
        while(k<len&&!this.hasOwnProperty(k)){ //因为数组中可能有一些下标是空的
            k++
        }
        if(k===len) {
            throw new Error()
        }
        accumulator=this[k++] //赋完值之后往后一位
    }
    while(k<len){
        if(this.hasOwnProperty(k)){
            accumulator = cb(accumulator,this[k],k,this)
        }
        k++
    }
    return accumulator
}
```











### 数组打平

#### 原生

Array.prototype.flat()

`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回

#### toString

如果数组的元素都是数字，可以使用 toString 方法

```
[1, [2, [3, 4]]].toString() // "1,2,3,4"
```

#### 自己编写

```javascript
/*只打平一层*/
//法一：reduce + concat
Array.prototype.flatten = function () {
    return this.reduce((pre, cur) => {
        return pre.concat(cur) //两个数组合并到一起就相当于少了一层
    }, [])
}

//法二：concat
Array.prototype.flatten = function () {
    return [].concat(...this) //扩展运算符本来就会打平一层
}

/*控制打平多少层 */
//法一：reduce + cancat + 递归 + reduce会自动过滤空元素
Array.prototype.flatten = function (num=1) {
    return num > 0 ? this.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur)?cur.flatten(num-1):cur)
    },[]) : this.slice()
}


//法二：forEach + 递归 + forEach会自动过滤空元素
Array.prototype.flatten = function(num = 1) {
    const result = []
    function executor(arr, depth) { 
        arr.forEach(item => {
            if (Array.isArray(item)) {
                depth > 0 ? executor(item,depth - 1) : result.push(item)
            } else {
                result.push(item)
            }
        })
    }
    executor(this, num)
    return result
}

```









## 常用工具方法

### 数组去重

#### 影响你去重的结果

```javascript
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

console.log(/a/ == /a/); // false
console.log(/a/ === /a/); // false

console.log({} == {}); // false
console.log({} === {}); // false
```





#### filter + indexOf 

内容相同的对象不去重， NaN 会全都被过滤掉

```javascript
const arr = [1, 1, '1', '1', null, null, undefined, undefined, new String('1'), new String('1'), /a/, /a/, NaN, NaN];
function unique(arr) {
    return arr.filter((item,index,array) => array.indexOf(item)===index)
} 
	//[1, "1", null, undefined, String, String, /a/, /a/]
```



#### set

内容相同的对象不去重（因为地址不一样呀）， 它可以做到NaN 去重

```javascript
const arr = [1, 1, '1', '1', null, null, undefined, undefined, new String('1'), new String('1'), /a/, /a/, NaN, NaN];
const uniqueArr = [...new Set(arr)] //[1, "1", null, undefined, String, String, /a/, /a/, NaN]
```





#### Map + filter + JSON.stringify()

全部去重

```javascript
const arr = [1, 1, '1', '1', null, null, undefined, undefined, new String('1'), new String('1'), { value: 1 }, { value: 1 }, {value:2}, /a/, /a/,/b/, NaN, NaN];


function uniqueArr(arr) {
    const set = new Set()
    return arr.filter(item => {
        const i = typeof item === 'object' ? JSON.stringify(item) : item //为了处理对象的去重
        if (set.has(i)) return false
        set.add(i)
        return true
    })
}
Exp.prototype.toJSON = function () { //修改正则表达式的JSON.stringify行为，这样正则表达式也可以正确去重了（原本的行为是序列化它之后都是{}，如果按原本的行为的话去完重之后肯定就只剩一个正则表达式了）
    return this.toString()
}
```





### 数组乱序

真正的乱序就要用到经典的 Fisher–Yates 算法：遍历数组元素，然后将当前元素与==其前面（包括它自己）==随机位置的元素进行交换

````javascript
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);//这里不加分号就会报错`ReferenceError: Cannot access 'j' before initialization`
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

//测试
var times = 100000;
var res = {};

for (var i = 0; i < times; i++) {
    var arr = shuffle([1, 2, 3]);

    var key = JSON.stringify(arr);
    res[key] ? res[key]++ :  res[key] = 1;
}

// 为了方便展示，转换成百分比
for (var key in res) {
    res[key] = res[key] / times * 100 + '%'
}

console.log(res)
````











# 对象





## 原型

### 基于原型的JavaScript对象系统

JavaScript遵守原型编程的基本规则：

❏ 所有的数据都是对象。

❏ 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它。

❏ 对象会记住它的原型。

❏ 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型。

JavaScript中的根对象是Object.prototype对象。Object.prototype对象是一个空的对象。我们在JavaScript遇到的每个对象，实际上都是从Object.prototype对象克隆而来的，Object.prototype对象就是它们的原型。除了undefined之外，一切都应是对象，null是空对象。

除了根对象Object.prototype本身之外，任何对象都会有一个原型。而通过Object.create( null )可以创建出没有原型的对象。





### 通过原型和call/apply/bind，一个对象可以使用其它对象的方法

比如我们常常会让类数组对象去借用Array.prototype的方法：

```js
Array.prototype.push.call(arguments,'dyc');
```





### prototype原型

prototype是==函数==（箭头函数没有）才会有的属性。

每一个==JavaScript对象(null 和 Object.create(null)创建的对象除外)==在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，函数的 prototype 属性就指向了这个实例的原型

![](https://camo.githubusercontent.com/02789d6806b75d34b2017021f58efa3aa7a2ee6be8a0c05fb3293438884b9ec0/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065312e706e67)

### `__proto__`（[[Prototype]]）

脚本中没有访问这个[[Prototype]]特性的标准方式，但Firefox、Safari和Chrome会在每个对象上暴露`__proto__`属性，通过这个属性可以访问对象的原型。

这个属性已经被废除了，用这个方法 ==Object.getPrototypeOf(obj)==来代替它，用这个`isPrototypeOf()` 方法去测试一个对象是否存在于另一个对象的原型链上，语法：`prototypeObj.isPrototypeOf(object)`

![](https://camo.githubusercontent.com/3dde335faa15d03ffe3b907f6e5c2b5f4d2183caa4c47ac7486794bc407f663c/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065322e706e67)



### constructor

每个==原型==都有一个 constructor 属性指向关联的构造函数。所以其实constructor属性并不在实例对象上，只是实例对象调用该属性的时候从原型上找到了再调用。

![](https://camo.githubusercontent.com/0aaf005afda83d4e2fdd2bbe523df228b567a091317a2154181771b2706ea2ef/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065332e706e67)



### **`instanceof`** 

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。（就是Person指向person那个箭头）

```javascript
object instanceof constructor
```

```javascript
function myInstanceof(obj, fn) {
    while (true) {
        const proto = Object.getPrototypeOf(obj)
        if(proto === null) return false
        if (proto === fn.prototype) return true
        obj =  proto // 沿着原型链往下
    }
}

//测试
const o = new Object()
console.log(myInstanceof(o,Object))
```





### 原型链

当对象查找一个属性的时候，如果没有在自身找到，那么就会查找自身的原型，如果原型还没有找到，那么会继续查找原型的原型，直到找到 Object.prototype 的原型时，此时原型为 null，查找停止。 这种通过 通过原型链接的逐级向上的查找链被称为原型链.


原型也是一个对象，既然是对象，我们就可以用最原始的方式创建它，那就是：

```javascript
var obj = new Object();
```

其实原型对象就是通过 Object 构造函数生成的

![](https://camo.githubusercontent.com/9a69b0f03116884e80cf566f8542cf014a4dd043fce6ce030d615040461f4e5a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065352e706e67)蓝色的这条线就是原型链





### **原型继承**

一个对象可以使用另外一个对象的属性或者方法，就称之为继承。具体是通过将这个对象的原型设置为另外一个对象，这样根据原型链的规则，如果查找一个对象属性且在自身不存在时，就会查找另外一个对象，相当于一个对象可以使用另外一个对象的属性和方法了。







## 创建对象的方式及优缺点

### 工厂模式

  工厂模式是一种设计模式，用于抽象创建特定对象的过程。

```javascript
function createPerson(name) {
    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name);
    };
    return o;
}

var person1 = createPerson('kevin');
var person2 = createPerson('Devin');
```

优点：这种工厂模式虽然可以解决创建多个类似对象的问题

缺点：但没有解决对象标识问题，对象无法识别，因为所有的实例都指向一个原型（ Object.protetype ）。



### 构造函数模式

构造函数用于创建特定类型对象

```javascript
function Person(name) {
    this.name = name;
    this.getName = function () {
        console.log(this.name);
    };
}

var person1 = new Person('kevin');
```

优点：实例可以识别为一个特定的类型

缺点：每次创建实例时，每个方法都要被创建一次

#### 构造函数模式优化

解决其缺点的问题

```javascript
function Person(name) {
    this.name = name;
    this.getName = getName;
}

function getName() {
    console.log(this.name);
}

var person1 = new Person('kevin');
```

优点：解决了每个方法都要被重新创建的问题

缺点：全局作用域被搞乱了

### 原型模式

每个函数 声明之后都会创建一个prototype属性，这个属性是一个对象，包含由实例共享的属性和方法。而这个对象就是对象的原型。在自定义构造函数时，原型对象==默认只会获得constructor属性==，其他的所有方法都继承自Object。

```javascript
function Person(name) {}

Person.prototype.name = 'keivn';
Person.prototype.getName = function () {
    console.log(this.name);
};

//也可以换种写法
Person.prototype = {
    constructor: Person,
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
```

优点：方法不会重新创建

缺点：1. 所有的属性和方法都共享 2. 不能初始化参数



### 组合模式

构造函数模式与原型模式双剑合璧。一般就是用这种模式。

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype = {
    constructor: Person,
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
```

优点：该共享的共享，该私有的私有



### 动态原型模式

```javascript
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype.getName = function () {
            console.log(this.name);
        }
    }
}

var person1 = new Person();
```

注意：使用动态原型模式时，不能用对象字面量重写原型。解释：

```javascript
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }
      //return new Person(name); //如果加上这一行代码则不会报错了，即可以用字面量方式重写Person.prototype了。因为这样就返回了一个 原型是刚刚重写的那个Person.protetype 的对象
    }
}
var person1 = new Person('kevin');

// 报错 并没有该方法
person1.getName()
```

因为使用字面量方式直接覆盖 Person.prototype，并不会更改实例的原型的值，实例依然指向了以前的原型。而之前的原型是没有 getName 方法的，所以就报错了！





### 寄生构造函数模式

寄生在构造函数的一种方法。其实所谓的寄生构造函数模式就是比工厂模式在创建对象的时候多使用了一个new，实际上两者的结果是一样的。但是作者可能是希望能像使用普通 Array 一样使用 SpecialArray，虽然把 SpecialArray 当成函数也一样能用，但是这并不是作者的本意，也变得不优雅。

```javascript
function Person(name) {
    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name);
    };

    return o;

}

var person1 = new Person('kevin');
console.log(person1 instanceof Person) // false
console.log(person1 instanceof Object)  // true
```

这样方法可以在特殊情况下使用。比如我们想创建一个具有额外方法的特殊数组，但是又不想直接修改Array构造函数，我们可以这样写：

```javascript
function SpecialArray() {
    var values = new Array();

    values.push(...arguments);

    values.toPipedString = function () {
        return this.join("|");
    };
    return values;
}

var colors = new SpecialArray('red', 'blue', 'green');
var colors2 = SpecialArray('red2', 'blue2', 'green2');

console.log(colors);
console.log(colors.toPipedString()); // red|blue|green

console.log(colors2);
console.log(colors2.toPipedString()); // red2|blue2|green2
```

在可以使用其他模式的情况下，不要使用这种模式。





### 稳妥构造函数模式

```javascript
function person(name){
    var o = new Object();
    o.sayName = function(){
        console.log(name);
    };
    return o;
}

var person1 = person('kevin');

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy
```

所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。

与寄生构造函数模式有两点不同：

1. 新创建的实例方法不引用 this
2. 不使用 new 操作符调用构造函数

稳妥对象最适合在一些安全的环境中。

稳妥构造函数模式也跟工厂模式一样，无法识别对象所属类型。







## 继承的方式及优缺点

### 原型链继承（针对函数）

啥都会继承过来

==一句话总结：子类构造函数的原型是父类的实例==

```javascript
function Parent () {
    this.name = 'kevin';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {}
Child.prototype = new Parent();//Child.prototype上会有name属性（*原型链继承）
Child.prototype.constructor = Child;


//测试
var child1 = new Child();
console.log(child1.getName()) // kevin
```

缺点：

1.在创建 Child 的实例时，不能向Parent传参

2.由于实例并没有在自己身上创建自己的属性和方法，所以如果父亲的原型上有个属性是引用类型，则子实例上修改这个属性会导致全部都变了。举个例子：

```javascript
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

//测试
var child1 = new Child();
child1.names.push('yayu');
console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();
console.log(child2.names); // ["kevin", "daisy", "yayu"]

//注意上面那个例子中：如果变成修改`person1.name`的值，`person2.name`的值并未发生改变，并不是因为`person1`和`person2`有独立的 name 值，而是因为`person1.name = 'person1'`给`person1`添加了 name 值，并非修改了原型上的 name 值。
```





### 借用构造函数(经典继承)

啥都自己创建

==一句话总结：在子类构造函数中调用父类构造函数==

```javascript
function Parent () {
    this.names = ['kevin', 'daisy'];
}

function Child () {
    Parent.call(this);//借用构造函数，先在构造函数中弄了一份Parent上的东西（*借用构造函数继承）
}

//测试
var child1 = new Child();

child1.names.push('yayu');
console.log(child1.names); // ["kevin", "daisy", "yayu"]

var child2 = new Child();
console.log(child2.names); // ["kevin", "daisy"]
```

```javascript
function Parent (name) {
    this.name = name;
}

function Child (name) {
    Parent.call(this, name);
}

//测试
var child1 = new Child('kevin');
console.log(child1.name); // kevin

var child2 = new Child('daisy');
console.log(child2.name); // daisy
```

优点(就是解决了上一个模式的缺点)：

1.避免了父亲的原型上的属性被所有实例共享

2.可以在 Child 中向 Parent 传参

缺点：1. 每次创建实例都会创建一遍方法和属性，即不能调用父类上的方法和属性。 







### 组合继承

一句话总结：==使用原型链继承原型上的属性和方法（要被继承的属性和方法就写到prototype里），而通过盗用构造函数继承实例属性（每个实例都要创建的属性和方法写到构造函数里）。== ==这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。==

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) { //（*构造函数继承）
    Parent.call(this, name);
    this.age = age;
}


Child.prototype = new Parent();//（*原型链继承）
Child.prototype.constructor = Child;

//测试
var child1 = new Child('kevin', '18');
child1.colors.push('black');

console.log(child1.name); // kevin
console.log(child1.age); // 18
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('daisy', '20');

console.log(child2.name); // daisy
console.log(child2.age); // 20
console.log(child2.colors); // ["red", "blue", "green"]
```

优点：融合原型链继承和构造函数的优点。

缺点： Child.prototype 上有一份Parent构造函数创建的东西（寄生式组合继承解决的就是这个问题）

### 原型式继承（object.create()）

他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享

Crockford推荐的原型式继承适用于这种情况：你有一个对象，想在它的基础上再创建一个新对象。ECMAScript 5通过增加Object.create()方法将原型式继承的概念规范化了。这个方法接收两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选）。在只有一个参数时，Object.create()与这里的object()方法效果相同：

```javascript
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```

缺点：

由于所有属性方法都会被共享，如果在某一个实例上修改是引用类型的属性值则会相当于修改了原型上的该属性值，这点跟原型链继承一样。

```javascript
//使用
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.friends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]

//注意：修改`person1.name`的值，`person2.name`的值并未发生改变，并不是因为`person1`和`person2`有独立的 name 值，而是因为`person1.name = 'person1'`，给`person1`添加了 name 值，并非修改了原型上的 name 值。
```





### 寄生式继承（构造函数的升级版）

一句话总结：创建一个实现继承的函数，该函数先创建一个以父类为原型的对象，再给这个对象添加一些属性或方法，然后返回这个对象

```javascript
function createObj (o) {
    var clone = Object.create(o);//先创建一个对象（这一行代码就是原型式继承），不一定是这个create函数，任何返回新对象的函数都可以在这里使用
    clone.sayName = function () {//以某种方式增强这个对象，比如这里给他加个方法---这就叫寄生
        console.log('hi');
    }
    return clone;
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍属性和方法（我们希望方法是用原型上的即可，不用实例也创建一遍）。





### 寄生式组合继承（组合继承 + 寄生）--- babel转class用的是这个

一句话总结：就是用寄生式继承去优化了组合继承里的原型链继承。

```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.getName = function () { //方法定义在原型上，那就不会在实例上再创建一遍这个方法
    console.log(this.name)
}

function Child (name, age) { //（*构造函数继承）
    Parent.call(this, name);
    this.age = age;
}


/*Child.prototype = new Parent()*/
/*如果我们不使用 Child.prototype = new Parent() ，而是间接的让 Child.prototype 访问到 Parent.prototype 呢？，这样Child.prototype上就不会有Parent.prototype的属性和方法了*/
/*把上面一句改成下面一句就变成了寄生式组合继承*/
const child.prototype = createObj(parent.prototype);//（*优化后的原型链继承（就是利用寄生去继承原型链））：此时prototype的constructor指向parent
child.prototype.constructor = child;

var child1 = new Child('kevin', '18');

console.log(child1)
```

优点：避免了在 Child.prototype 上面创建不必要的属性。



### class和extends转成es5语法

Babel 将 `class` 关键字定义的类转换成了使用构造函数和原型链实现的代码，而 `extends` 关键字转换成了使用 `_inherits` 函数实现的继承。

例如，下面是一个使用 ES6 语法定义的类和继承的示例：

```
javascriptCopy code
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  bark() {
    console.log('Woof!');
  }
}
```

Babel 会将上述代码转换成如下 ES5 代码：

```
javascriptCopy code
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Animal = function Animal(name) {
  _classCallCheck(this, Animal);

  this.name = name;
};

Animal.prototype.speak = function () {
  console.log(this.name + ' makes a noise.');
};

var Dog = function (_Animal) {
  _inherits(Dog, _Animal);

  function Dog(name, breed) {
    _classCallCheck(this, Dog);

    var _this = _possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));

    _this.breed = breed;
    return _this;
  }

  Dog.prototype.bark = function () {
    console.log('Woof!');
  };

  return Dog;
}(Animal);
```







## 内置对象

### JSON

#### JSON字符串

##### 简介

JavaScript Object Notation (JSON) 是一种数据交换格式。用来序列化对象、数组、数值、字符串、布尔值和 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) ，<font color="red">用于在应用程序之间传输数据。</font>

JSON字符串属于string类型，<font color="red">是一种特殊格式的字符串</font>。普通字符串不具备 JSON 字符串的语法规则，因此无法像 JSON 字符串一样被解析成 JavaScript 对象。

在JavaScript中，我们可以直接使用JSON，因为JavaScript内置了JSON的解析。把任何JavaScript对象变成JSON，就是把这个对象序列化成一个JSON格式的字符串，这样才能够通过网络传递给其他计算机。在使用 JSON.parse() 方法时，传入的字符串必须是符合 JSON 格式的，否则会抛出异常。





#### jsonc

`.jsonc` 文件是一种带有注释的 JSON 文件。在 JavaScript 项目中，默认情况下是无法识别 `.jsonc` 后缀的文件的。

通过使用 `jsonc-parser` 或其他类似的工具，在 JavaScript 项目中正确解析并处理 `.jsonc` 文件，包括其中的注释。







#### JSON.stringify

实际就是若为基本数据类型则调用数据类型的toString方法，若为对象类型则调用对象类型的toJSON方法。

![image-20221011091836511](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221011091836511.png)

基本数据类型：

> 与使用toString基本相同

- undefined 转换之后仍是 undefined(类型也是 undefined)
- boolean 值转换之后是字符串 "false"/"true"
- number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
- symbol 转换之后是 undefined
- null 转换之后是字符串 "null"
- string 转换之后仍是string
- NaN 和 Infinity 转换之后是字符串 "null"

对象类型：

- <font color="red">如果是函数类型：转换之后是 undefined</font>
- 如果是 RegExp 对象：返回 {} (类型是 string)；
- 如果是 Date 对象，返回 Date 的 toJSON 字符串值；
- 如果是一个数组：如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串 "null" ；
- 如果是普通对象；
  - 如果有 toJSON() 方法，那么序列化 toJSON() 的返回值。
  - 如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略。
  - 所有以 symbol 为属性键的属性都会被完全忽略掉。

**无法序列化不可枚举属性**，**无法序列化对象的循环引用**





#### JSON.stringify() 和 qs.stringify()区别

```javascript
let  data = { name: 'edward', age: '25' }
JSON.stringfy(data)  //  ”{ 'name' : 'edward' , 'age' : '25' }”
qs.stringfy(data)  // 'name=edward&age=25'
```





### URLSearchParams

`URLSearchParams` 对象表示 URL 查询参数，并且不直接提供将其序列化为 JSON 的方法。但你可以将其转换为一个普通的对象，然后再将这个对象序列化为 JSON。

```js
const params = new URLSearchParams('key1=value1&key2=value2&key3=value3');
// new URLSearchParams返回的就是application/x-www-form-urlencoded这种类型

// 将 URLSearchParams 转换为对象
const paramsObject = {};
for (const [key, value] of params) {
  paramsObject[key] = value;
}

// 序列化对象为 JSON
const json = JSON.stringify(paramsObject);
```









### Date

```javascript
const date = new Date() //返回当前的时间
const date = +new Date() //返回当前的时间距离1970年1月1号经过的毫秒数
```



### proxy&reflect

```javascript
let obj = { a: 1 }
let handler = {
  get(target, key, receiver) {
    console.log('get',target, key, receiver)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver){ 
    console.log('set',target, key, value, receiver)
    return Reflect.set(target, key, value, receiver)
  }
}
let proxy = new Proxy(obj, handler)

proxy.a
proxy.a=2
```

[参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#参数)

- `target`

  要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

- `handler`

  一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。



#### 为什么有Reflect

Reflect是ES6为操作对象而提供的新API,而这个API设计的目的主要有：

- 将Object对象的一些属于语言内部的方法放到Reflect对象上，从Reflect上能拿到语言内部的方法。如：Object.defineProperty

- 修改某些object方法返回的结果。如：Object.defineProperty(obj, name, desc)在无法定义属性的时候会报错，而Reflect.defineProperty(obj, name, desc)则会返回false

- 让Object的操作都变成函数行为。如object的命令式：name in obj和delete obj[name] 则与 Reflect.has(obj, name)、Reflect.deleteProperty(obj, name)相等。又比如：有了Reflect对象，很多操作会更易读

  ```
  // 老写法
  Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1
  
  // 新写法
  Reflect.apply(Math.floor, undefined, [1.75]) // 1
  ```

- Reflect对象的方法与Proxy对象的方法一一对应，只要proxy对象上有的方法reflect也能找到。

-  Reflect.get 函数还能接收第三个参数，即指定接收者 receiver，你可以把它理解为函数调用过程中的 this

#### reflect相比于直接return target[ss]

比如一种情况 访问target里的一个函数，而这个函数里又会访问this.某个属性，如果是用return target[ss]返回这个函数，则此时函数里面的this指向的是原对象，这样的话这个this访问target里属性的访问操作就不会被拦截；而如果用reflect的话就会使那个this指向的是代理对象。





#### proxy使用

```ts
export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            // const res = Reflect.get(target, key)
            track(target,key) //收集依赖
            return  Reflect.get(target, key)
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value) //先把值设置好了再去触发依赖，不然依赖里的值还是上一个的值
            trigger(target,key) //触发依赖
            return res 
        }
    })
}
```

#### Proxy 支持的13 种拦截操作

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。



#### **Reflect 对象的静态方法**

`Reflect`对象一共有 13 个静态方法。

- **Reflect.get(target, name, receiver)**

  `Reflect.get`方法查找并返回`target`对象的`name`属性，如果没有该属性，则返回`undefined`。

- **Reflect.set(target, name, value, receiver)**

  `Reflect.set`方法设置`target`对象的`name`属性等于`value`。

- **Reflect.has(target, name)**

  `Reflect.has`方法对应`name in obj`里面的`in`运算符。

- **Reflect.deleteProperty(target, name)**

  `Reflect.deleteProperty`方法等同于`delete obj[name]`，用于删除对象的属性。

- **Reflect.construct(target, args)**

  `Reflect.construct`方法等同于`new target(...args)`，这提供了一种不使用`new`，来调用构造函数的方法。

- **Reflect.getPrototypeOf(target)**

  `Reflect.getPrototypeOf`方法用于读取对象的`__proto__`属性，对应`Object.getPrototypeOf(obj)`。

- **Reflect.setPrototypeOf(target, prototype)**

  `Reflect.setPrototypeOf`方法用于设置目标对象的原型（prototype），对应`Object.setPrototypeOf(obj, newProto)`方法。它返回一个布尔值，表示是否设置成功。

- **Reflect.apply(target, thisArg, args)**

  `Reflect.apply`方法等同于`Function.prototype.apply.call(func, thisArg, args)`，用于绑定`this`对象后执行给定函数。

- **Reflect.defineProperty(target, name, desc)**

  `Reflect.defineProperty`方法基本等同于`Object.defineProperty`，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用`Reflect.defineProperty`代替它。

- **Reflect.getOwnPropertyDescriptor(target, name)**

  `Reflect.getOwnPropertyDescriptor`基本等同于`Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象，将来会替代掉后者。

- **Reflect.isExtensible(target)**

  `Reflect.isExtensible`方法对应`Object.isExtensible`，返回一个布尔值，表示当前对象是否可扩展。

- **Reflect.preventExtensions(target)**

  `Reflect.preventExtensions`对应`Object.preventExtensions`方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。

- **Reflect.ownKeys(target)**

  `Reflect.ownKeys`方法用于返回对象的所有属性，基本等同于`Object.getOwnPropertyNames`与`Object.getOwnPropertySymbols`之和。







#### 有个bug

如果给这个对象添加一个属性，而他的原型链上恰好有这个属性，那么这个对象和其原型的set方法都会被触发

```javascript
let obj = {};
let proto = {a:1} //这个对象上本来就有a
let proxyProto = new Proxy(proto, {
    get(target,key,receiver) {
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log(proxyProto , receiver == myProxy); 
        return Reflect.set(target,key,value,receiver)
    }
})
Object.setPrototypeOf(obj,proxyProto);//（*）
let myProxy = new Proxy(obj,{ 
    get(target,key,receiver) {
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log(receiver === myProxy)
        return Reflect.set(target,key,value,receiver); 
     }
 })
 
 myProxy.a = 100; //添加个a属性 ，
 console.log(myProxy.a,proto)
```





### map 和 weakmap区别

WeakMap 对 key 是弱引用，不影响垃圾回收器 回收key，即没有别的地方用到这个key了，那这个key就会被回收且weakMap里也访问不到这个key了。而map的key如果是对象，那么只要map里还有这个key，那么这个key就不会被回收。

举例：

```js
01 const map = new Map();
02 const weakmap = new WeakMap();
03
04 (function(){
05     const foo = {foo: 1};
06     const bar = {bar: 2};
07
08     map.set(foo, 1);
09     weakmap.set(bar, 2);
10 })()
```

当该函数表达式执行完毕后，对于对象 foo 来说，它仍然作为 map 的 key 被引用着，因此垃圾回收器（grabage collector）不会把它从内存中移除，我们仍然可以通过map.keys 打印出对象 foo。然而对于对象 bar 来说，由于 WeakMap 的 key 是弱引用，它不影响垃圾回收器的工作，所以一旦表达式执行完毕，垃圾回收器就会把对象 bar 从内存中移除，并且我们无法获取 weakmap 的 key 值，也就无法通过weakmap 取得对象 bar。







## 内置方法

### 构造函数Object() 

**`Object` 构造函数将给定的值包装为一个新对象。**

- 如果给定的值是 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined), 它会创建并返回一个空对象。
- 否则，它将返回一个和给定的值相对应的类型的对象。
- 如果给定值是一个已经存在的对象，则会返回这个已经存在的值（相同地址）。



### 关于对象的访问规则设置

  + 冻结
    冻结对象：Object.freeze(obj)
    检测是否被冻结：Object.isFrozen(obj) =>true/false

    + 被冻结的对象：不能修改成员值、不能新增成员、不能删除现有成员、不能给成员做劫持「Object.defineProperty」

    + ```js
      /**原生Object身上带的freeze方法是浅冻结，这里我们写一个深度冻结。*/
      function freeze(obj) {
          if(!(obj instanceof Object)) return
          Object.seal(obj)
          const ownPro = Object.getOwnPropertyNames(obj)
          ownPro.forEach(item => {
              Object.defineProperty(obj, item, { writable: false })
              freeze(obj[item])
          })
      }
      ```

  + 密封
    密封对象：Object.seal(obj)
    检测是否被密封：Object.isSealed(obj)

    + 被密封的对象：可以修改成员的值，但也不能删、不能新增、不能劫持！！

  + 扩展
    把对象设置为不可扩展：Object.preventExtensions(obj)
    检测是否可扩展：Object.isExtensible(obj)

    + 被设置不可扩展的对象：除了不能新增成员、其余的操作都可以处理！！
      被冻结的对象，即是不可扩展的，也是密封的！！同理，被密封的对象，也是不可扩展的！！





### 迭代对象

```js
/* 
封装一个对象迭代的方法 
  + 基于传统的for/in循环，会存在一些弊端「性能较差(既可以迭代私有的，也可以迭代公有的)；只能迭代“可枚举、非Symbol类型的”属性...」
  + 解决思路：获取对象所有的私有属性「私有的、不论是否可枚举、不论类型」
    + Object.getOwnPropertyNames(arr) -> 获取对象非Symbol类型的私有属性「无关是否可枚举」
    + Object.getOwnPropertySymbols(arr) -> 获取Symbol类型的私有属性
    获取所有的私有属性：
      let keys = Object.getOwnPropertyNames(arr).concat(Object.getOwnPropertySymbols(arr));
    可以基于ES6中的Reflect.ownKeys代替上述操作「弊端：不兼容IE」
      let keys = Reflect.ownKeys(arr);
*/
const each = function each(obj, callback) {
    if (obj === null || typeof obj !== "object") throw new TypeError('obj is not a object');
    if (typeof callback !== "function") throw new TypeError('callback is not a function');
    let keys = Reflect.ownKeys(obj);
    keys.forEach(key => {
        let value = obj[key];
        // 每一次迭代，都把回调函数执行
        callback(value, key);
    });
};
```







### 拷贝

#### 浅拷贝

#####  内置函数

In JavaScript, standard built-in object-copy operations ([spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [`Array.prototype.concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat), [`Array.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice), [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from), [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), and [`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)) do not create deep copies (instead, they create shallow copies).

如果数组元素是基本类型，就会拷贝一份，互不影响，而如果元素是对象或者数组，就会只拷贝对象和数组的引用，这样在新旧数组进行了修改，两者都会发生变化。我们把这种复制引用的拷贝方法称之为浅拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。





##### 实现

遍历对象，然后把属性和属性值都放在一个新的对象

```javascript
function shallowCopy(objOrArr) {
    if (typeof objOrArr !== 'object') throw TypeError('type error')
    const result = objOrArr instanceof Array ? [] : {}
    for (const key in objOrArr) { //遍历的是属性名，数组则遍历的是下标
        if (objOrArr.hasOwnProperty(key)) result[key] = objOrArr[key]
    }
    return result
}
```





##### 写一个对像间的浅比较

```jsx
// 检测是否为对象
const isObject = function isObject(obj) {
    return obj !== null && /^(object|function)$/.test(typeof obj);
};
// 对象浅比较的方法
const shallowEqual = function shallowEqual(objA, objB) {
    if (!isObject(objA) || !isObject(objB)) return false;
    if (objA === objB) return true;
    // 先比较成员的数量
    let keysA = Reflect.ownKeys(objA),
        keysB = Reflect.ownKeys(objB);
    if (keysA.length !== keysB.length) return false;
    // 数量一致，再逐一比较内部的成员「只比较第一级：浅比较」
    for (let i = 0; i < keysA.length; i++) {
        let key = keysA[i];
        // 如果一个对象中有这个成员，一个对象中没有；或者，都有这个成员，但是成员值不一样；都应该被判定为不相同！！
        if (!objB.hasOwnProperty(key) || !Object.is(objA[key], objB[key])) {
            return false;
        }
    }
    // 以上都处理完，发现没有不相同的成员，则认为两个对象是相等的
    return true;
};
```







#### 深拷贝

##### JSON方法

One way to make a deep copy of a JavaScript object, if it can be [serialized](https://developer.mozilla.org/en-US/docs/Glossary/Serialization), is to use [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) to convert the object to a JSON string, and then [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) to convert the string back into a (completely new) JavaScript object

```javascript
JSON.parse( JSON.stringify(arr) ); //无法序列化的那些都拷贝不过去（譬如函数）
```

缺陷：

使用`JSON.parse(JSON.stringify(obj))`进行深拷贝，它可以将一个对象或数组序列化成一个JSON字符串，再解析成一个新的对象或数组，从而实现深拷贝。但是这种方法也存在一些缺陷和限制：

1. 无法拷贝函数和原型链。在JSON中，函数和原型链不是有效的JSON数据类型，所以无法被序列化和反序列化，从而无法实现深拷贝。因此，如果对象中包含了函数和原型链，使用`JSON.parse(JSON.stringify(obj))`进行深拷贝会失效。
2. 无法处理循环引用。如果对象中存在循环引用，即某个对象的属性指向了该对象本身或其祖先对象，使用`JSON.parse(JSON.stringify(obj))`进行深拷贝可能会陷入死循环，导致运行出错。
3. 对象的键值会被转化成字符串。使用`JSON.parse(JSON.stringify(obj))`进行深拷贝时，对象的键值会被转化成字符串，因此可能会导致一些问题，例如：Date类型的数据会被转化成字符串，再转化回来后变成字符串类型的数据。又如NaN、Infinity、-Infinity和null在被转化为JSON字符串时分别变成了null、null、null和null，再转化回来会导致数据变化。

综上所述，虽然`JSON.parse(JSON.stringify(obj))`是一种简单有效的方式进行深拷贝，但在实际使用中需要注意上述限制和缺陷，避免出现意外情况。如果对性能要求较高，建议使用其他深拷贝的方式，例如递归拷贝、`Object.assign()`、`lodash.cloneDeep()`等。



##### 递归简单版

```javascript
//与上面浅拷贝的区别就是进行了递归
function deepCopy(objOrArr) {
    if (typeof objOrArr !== 'object') throw TypeError('type error')
    const result = objOrArr instanceof Array ? [] : {}
    for (const key in objOrArr) {
        result[key] = typeof objOrArr[key] === 'object' ? deepCopy(objOrArr[key]) : objOrArr[key] 
    }
    return result
}
```



##### 递归完善版

在简单版的基础上，考虑了内置对象比如 Date、RegExp 等对象以及解决了循环引用的问题。

```javascript
const isObject = obj => obj!==null&&typeof obj === 'object' //封装一个判断是否为对象的函数
function deepCopy(target) {
    if(!isObject&&typeof target !== 'function') throw new TypeError('type error')
    const weakMap = new WeakMap()

    return (function main(obj){
        if (weakMap.has(obj)) {//若这个对象是已经出现过的那就直接返回了，不然就死循环了
            return obj
        }

        //处理Date、RegExp对象
        const constructor = obj.constructor
        if (/^(ReqExp|Date)$/i.test(constructor.name)) {
            return new constructor(obj)
        }

        //处理普通对象 且考虑循环引用
        if (isObject(obj)) {
            weakMap.set(obj,1) //记录下来这个对象是已经出现过的
            const newO = Array.isArray(obj) ? [] : {}
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newO[key] = main(obj[key]) //如果是对象就继续往下递归，如果是普通数值就直接赋值
                }
            }
            return newO
        } else {
            return obj //如果是函数或基本类型或其他对象
        }
    })(target)
}
```



### **`Object.create()`** 

#### 作用

**`Object.create()`** 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。

#### 模拟实现

```javascript
function create(prototype,propertyDesribe = undefined) {
    if (typeof prototype !== 'object' && typeof prototype !== 'function') {
        throw new TypeError('type error')
    }
    if (propertyDesribe === null) {
        throw new TypeError('e')
    }

    // const fn = Function()
    // fn.prototype = prototype
    // const obj = new fn()
    const obj ={}
    if (propertyDesribe) {
        Object.defineProperties(obj,propertyDesribe)
    }
    Object.setPrototypeOf(obj,prototype)

    // if (prototype === null) {
    //     Object.setPrototypeOf(obj,null)
    // }
    return obj
}


//测试
const o = create(Date.prototype, {
    'a': {
        value:1
    },
    'b': {
        value:2
    }
})
console.log(o)
console.log(Object.getPrototypeOf(o))

const x = new Object()
console.log(Object.getPrototypeOf(x))
```



`Object.assign()`

模拟实现

```javascript
function assign(target, ...source) {
    if (!target) {
        throw new TypeError('Cannot convert undefined or null to object')
    }
    const ret = Object(target) // 不是对象的就把它转成对象
    source.forEach(obj => {//Object.assign() 不会在 source 对象值为 null 或 undefined 时抛出错误。
        if (obj) {
            for (const key in obj) {
                if(obj.hasOwnProperty(key)) ret[key] = obj[key]
            }
        }
    })
    return ret
}

// 测试
const o = {
    a: {
        b:1
    }
}
const ret = Object(o)
o.a.b = 2
console.log(o === ret)

const b = assign({c:1,a:1}, o)
console.log(b)
```





### 跟属性相关

#### Object.assign()

```javascript
function assign(target,...args){
    if(!target) throw new Error('')
    const t=Object(target) //数字、字符串啥的会转成对象
    for(const obj of args){//参数里可能会有很多个对象
        const ownPro=Object.getOwnPropertyNames(obj) //把对象的自身属性都拿出来
        for(const property of ownPro){ //遍历自身属性
            t[property]=obj[property]
        }
    }
    return t
}
```







#### 遍历对象

##### `for ... in`

以任意顺序迭代一个==对象原型链==上的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性（包括实例属性和原型属性）。（默认情况下开发者定义的属性都是可枚举的）。在类中添加到原型上的属性不可枚举，在类外添加到原型上的属性可枚举；

```javascript
class D {
  constructor() {
    super();
    this.x = 10;
  }
  getX() {
    console.log('x');
  }
}
D.prototype.getY = function() {
  console.log('y');
}

const d = new D();

for (let key in d) {
  console.log(key);  //=>x getY   ——————1
}
```

##### Object.keys()

获得对象上所有可枚举的==自身实例属性==。返回包含该对象所有可枚举属性名称的==字符串数组==



##### Object.getOwnPropertyNames()

返回一个由指定对象的所有自身属性的属性名（包括==不可枚举属性==但不包括 Symbol 值作为名称的属性）组成的数组。

因为以符号为键的属性没有名称的概念。因此，==Object.getOwnProperty-Symbols()==方法就出现了，这个方法与Object.getOwnPropertyNames()类似，只是针对符号而已



##### Reflect.ownKeys()

遍历当前对象所有自身属性（包含可枚举和不可枚举属性）；



#### 属性枚举顺序

for-in循环、Object.keys()、Object.getOwnPropertyNames()、Object.getOwnProperty-Symbols()以及Object.assign()在属性枚举顺序方面有很大区别。for-in循环和Object.keys()的枚举顺序是不确定的，取决于JavaScript引擎，可能因浏览器而异。Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.assign()的枚举顺序是确定性的。先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。在对象字面量中定义的键以它们逗号分隔的顺序插入



#### 数据绑定

##### Object.defineProperty(obj, prop, descriptor)

###### 简介

该方法可以在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

###### **语法**

> Object.defineProperty(obj, prop, descriptor)

###### **参数**

```
obj: 要在其上定义属性的对象。

prop:  要定义或修改的属性的名称。

descriptor: 将被定义或修改的属性的描述符。该字段是必须的，如果不配置任何东西就写个{}
```



###### 数据描述符和存取描述符

函数的第三个参数 descriptor 所表示的属性描述符有两种形式：**数据描述符和存取描述符**。

==**属性描述符必须是数据描述符或者存取描述符两种形式之一，不能同时是两者**==

1.数据描述符同时具有以下==可选==键值

**value**

```
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
```

**writable**

```
当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。
```

**configurable**

```
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
```

**enumerable**

```
当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。
```






2.**存取描述符同时具有以下==可选==键值**：

**get**

```
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。
```

**set**

```
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。
```

**configurable**

```
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
```

**enumerable**

```
当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。
```




###### 监控属性变化

```javascript
function watch(obj, prop, fn,immediate = false) {
    let v = obj[prop]
    Object.defineProperty(obj, prop, {
        get: function () {
            console.log('get')
            return v
        },
        set: function (newV) {
            v = newV //不能用obj[prop] = newV，因为这样又会调用setter方法导致死循环了。
            console.log('set')
            fn(newV)
        }
    })
    if(immediate) obj[prop] = v //立马执行一次set
}


//使用
const fn = (a) => {
    console.log('fn',a)
}

const o = {
    a:1
}

watch(o, 'a', fn,true)
console.log(o.a)
o.a = 2
console.log(o.a)
```





##### proxy

###### 简介

使用 defineProperty 只能重定义属性的读取（get）和设置（set）行为，而 Proxy可以重定义更多的行为，比如 in、delete、函数调用等

```
var proxy = new Proxy(target, handler);
```

proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。



###### 监控对象变化

```javascript
function watch(obj, fn) {
    const proxyObj = new Proxy(obj, {
        get: function (obj, prop) { console.log('get'); return obj[prop] },
        set: function (obj, prop, newV) {
            console.log('set')
            obj[prop] = newV
            fn(newV)
        }
    })
    return proxyObj
}


//使用
const fn = (a) => {
    console.log('fn',a)
}

const o = {
    a:1
}

const proxyO = watch(o, fn,true) //使用代理对象才可以触发拦截，如果是用defineProperty才可以通过原来的对象就触发拦截
console.log(proxyO.a)
proxyO.a = 2
console.log(proxyO.a)
```







### 判断两个对象是否相等

#### 比较引用值

```javascript
Object.is(value1, value2);
```



#### 比较实际的值

##### 不考虑循环引用

```javascript
JSON.stringify(p) === JSON.stringify(q)
```



##### 考虑循环引用

[参考这里](https://github.com/mqyqingfeng/Blog/issues/41)





## 面向对象

### Class

虽然给了你类的写法，但是js背后的本质是通过原型机制来创建对象，基于原型来继承。



#### Static 关键字

类（class）通过 **static** 关键字定义静态方法。不能在类的实例上调用静态方法，而应该通过类本身调用。

为这个类的函数对象直接添加方法，而不是加在这个函数对象的原型对象上





#### super

##### 简介

**super** 关键字用于访问和调用一个对象的父对象上的函数。

`super.prop` 和 `super[expr]` 表达式在[类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)和[对象字面量](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer)任何[方法定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Method_definitions)中都是有效的。

##### [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super#语法)

```
super([arguments]);
// 调用 父对象/父类 的构造函数

super.functionOnParent([arguments]);
// 调用 父对象/父类 上的方法
```



##### 示例

###### [在类中使用`super`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super#在类中使用super)

```js
class Polygon {
  constructor(height, width) {
    this.name = 'Rectangle';
    this.height = height;
    this.width = width;
  }
  sayName() {
    console.log('Hi, I am a ', this.name + '.');
  }
  get area() {
    return this.height * this.width;
  }
  set area(value) {
    this._area = value;
  }
}

class Square extends Polygon {
  constructor(length) {
    this.height; // ReferenceError，super 需要先被调用！

    // 这里，它调用父类的构造函数的，
    // 作为 Polygon 的 height, width
    super(length, length); //（*）

    // 注意：在派生的类中，在你可以使用'this'之前，必须先调用 super()。
    // 忽略这，这将导致引用错误。
    this.name = 'Square';
  }
  
  logDescription() {
    return super.sayName(); // （*）
  }
}

```





###### [在对象字面量中使用 `super.prop`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super#在对象字面量中使用_super.prop)

`Super` 也可以在 [object initializer / literal](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer) 符号中使用。在下面的例子中，两个对象各定义了一个方法。在第二个对象中，我们使用 `super` 调用了第一个对象中的方法。 当然，这需要我们先利用 [`Object.setPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 设置 `obj2` 的原型为 `obj1`，然后才能够使用 `super` 调用 `obj1` 上的 `method1`。

```js
var obj1 = {
  method1() {
    console.log("method 1");
  }
}

var obj2 = {
  method2() {
   super.method1();
  }
}

Object.setPrototypeOf(obj2, obj1);
obj2.method2(); // logs "method 1"
```



#### 私有域

类属性在默认情况下是[`公有`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/Public_class_fields)的，但可以使用增加哈希前缀 `#` 的方法来定义私有类字段。在外面访问不到，而且不参与继承。

>  可以使用 [`in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/in) 运算符检查私有字段（或私有方法）是否存在。当私有字段或私有方法存在时，运算符返回 `true`，否则返回 `false`。



#### extends

**`extends`**关键字用于[类声明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/class)或者[类表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/class)中，以创建一个类，该类是另一个类的子类。

##### [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends#语法)

```
class ChildClass extends ParentClass { ... }
```

##### [描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends#描述)

`extends`关键字用来创建一个普通类或者内建对象的子类。

继承的`.prototype`必须是一个[`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object) 或者 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null)。







### 私有变量的实现

#### **基于编码规范约定实现方式**

下划线_开头的变量约定为私有成员

#### **基于闭包的实现方式**

另外一种比较普遍的方式是利用JavaScript的闭包特性。构造函数内定义局部变量和特权函数，其实例只能通过特权函数访问此变量，如下：

```javascript
function Person(name){
  var _name = name;
  this.getName = function(){
    return _name;
  }
}

var person = new Person('Joe');
```

这种方式的优点是实现了私有属性的隐藏，Person 的实例并不能直接访问_name属性，只能通过特权函数getName获取：

```javascript
alert(person._name); // undefined
alert(person.getName()); //'Joe'
```

使用闭包和特权函数实现私有属性的定义和访问是很多开发者采用的方式。但是这种方式存在一些缺陷：

- 私有变量和特权函数只能在构造函数中创建。通常来讲，构造函数的功能只负责创建新对象，方法应该共享于prototype上。特权函数本质上是存在于每个实例中的，而不是prototype上，增加了资源占用。





#### **基于WeakMap的实现方式**

```javascript
var Person = (function() {

    var privateData = new WeakMap();

    function Person(name) {
        privateData.set(this, { name: name });
    }

    Person.prototype.getName = function() {
        return privateData.get(this).name;
    };

    return Person;
}());
```



#### **基于Proxy约束**

Proxy 可以定义目标对象的 get、set、Object.keys 的逻辑，可以在这一层做一下判断，如果是下划线 _ 开头就不让访问，否则就可以访问。

比如还是这个 class:

```javascript
class Dong {
    constructor() {
        this._name = 'dong';
        this._age = 20;
        this.friend = 'guang';
    }
    hello() {
        return 'I\'m ' + this._name + ', '  + this._age + ' years old';
    }
}
const dong = new Dong();
```

我们不直接调用它的对象的属性方法了，而是先用一层 Proxy 来约束下 get、set、getKeys 的行为：

```javascript
const dong = new Dong();
const handler = {
    get(target, prop) {
        if (prop.startsWith('_')) {
            return;
        }
        return target[prop];
   },
   set(target, prop, value) {
    if (prop.startsWith('_')) {
        return;
     }
     target[prop] = value;
   },
   ownKeys(target, prop) {
      return Object.keys(target).filter(key => !key.startsWith('_'))
   },
 }
const proxy = new Proxy(dong, handler)
```

我们通过 new Proxy 来给 dong 定义了 get、set、ownKeys 的 handler：

- get: 如果以下划线 _ 开头就返回空，否则返回目标对象的属性值 target[prop]。
- set: 如果以下划线 _ 开头就直接返回，否则设置目标对象的属性值。
- ownKeys: 访问 keys 时，过滤掉目标对象中下划线开头的属性再返回。

这样就实现了下划线开头的属性的私有化：

我们测试下：

```javascript
const proxy = new Proxy(dong, handler)

for (const key of Object.keys(proxy)) {
    console.log(key, proxy[key])
}
```

确实，这里只打印了共有属性的方法，而下划线开头的那两个属性没有打印。我们基于 _prop 这种命名规范实现了真正的私有属性



#### **Symbol用于创建唯一的值**

 `symbol` 不会被常规的方法（除了 `Object.getOwnPropertySymbols` 外）遍历到

```javascript
const nameSymbol = Symbol('name');
const ageSymbol = Symbol('age');
class Dong {
    constructor() {
        this[nameSymbol] = 'dong';
        this[ageSymbol] = 20;
    }
    hello() {
        return 'I\'m ' + this[nameSymbol] + ', '  + this[ageSymbol] + ' years old';
    }
}
const dong = new Dong();
```



#### **es新草案 #prop**

现在有一个私有属性的 es 草案，可以通过 # 的方式来标识私有属性和方法。

比如这样：

```javascript
class Dong {
    constructor() {
        this.#name = 'dong';
        this.#age = 20;
        this.friend = 'guang';
    }
    hello() {
        return 'I\'m ' + this.#name + this.#age + 'years old';
    }
}
```

这里的 name 和 age 都是私有的，而 friend 是共有的。

这种新语法 JS 引擎没那么快支持，但是可以通过 babel 或者 ts 编译器来编译成低版本语法的方式来提前用。

比如 babel 有 @babel/proposal-private-property-in-object 的插件，它可以实现这种语法的编译。










# 内存机制

## JavaScript内存模型

![image-20220708201415582](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708201415582.png)

代码空间主要是存储可执行代码的

栈空间就是我们之前反复提及的调用栈，是用来存储执行上下文的

**原始类型的数据值都是直接保存在“栈”中的，引用类型的值和闭包是存放在“堆”中的**





## 垃圾回收

**JavaScript 引擎会通过向下移动 ESP （记录当前执行状态的指针）来销毁该函数保存在栈中的执行上下文**。例如当 showName 函数执行结束之后，ESP 向下移动到 foo 函数的执行上下文中，上面 showName 的执行上下文虽然保存在栈内存中，但是已经是无效内存了。比如当 foo 函数再次调用另外一个函数时，这块内容会被直接覆盖掉，用来存放另外一个函数的执行上下文。

**要回收堆中的垃圾数据，就需要用到 JavaScript 中的垃圾回收器了**。

在 V8 中会把堆分为**新生代**和**老生代**两个区域，**新生代中存放的是生存时间短的对象（容量比较小），老生代中存放的生存时间久的对象**。



- **主垃圾回收器，主要负责老生代的垃圾回收。**



### 垃圾回收器的工作流程

第一步是标记空间中活动对象和非活动对象。所谓活动对象就是还在使用的对象，非活动对象就是可以进行垃圾回收的对象。

第二步是回收非活动对象所占据的内存。其实就是在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象。

第三步是做内存整理。一般来说，频繁回收对象后，内存中就会存在大量不连续空间，我们把这些不连续的内存空间称为**内存碎片**。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以最后一步需要整理这些内存碎片，但这步其实是可选的，因为有的垃圾回收器不会产生内存碎片，比如副垃圾回收器。



### 副垃圾回收器--处理新生代

新生代中用**Scavenge 算法**来处理。所谓 Scavenge 算法，是把新生代空间对半划分为两个区域，一半是对象区域，一半是空闲区域。新加入的对象都会存放到对象区域，当对象区域快被写满时，就需要执行一次垃圾清理操作。

在垃圾回收过程中，首先要对对象区域中的垃圾做标记；标记完成之后，就进入垃圾清理阶段，副垃圾回收器会把存活的对象复制到空闲区域中，同时它还会把这些对象有序地排列起来，完成复制后，对象区域与空闲区域进行角色翻转，也就是原来的对象区域变成空闲区域，原来的空闲区域变成了对象区域。这样就完成了垃圾对象的回收操作。

复制操作需要时间成本，如果新生区空间设置得太大了，那么每次清理的时间就会过久，所以**为了执行效率，一般新生区的空间会被设置得比较小**。也正是因为新生区的空间不大，所以很容易被存活的对象装满整个区域。为了解决这个问题，JavaScript 引擎采用了**对象晋升策略**，也就是经过两次垃圾回收依然还存活的对象，会被移动到老生区中。

### 主垃圾回收器--处理老生代

除了新生区中晋升的对象，一些大的对象会直接被分配到老生区。因此老生区中的对象有两个特点，一个是对象占用空间大，另一个是对象存活时间长。

由于老生区的对象比较大，主垃圾回收器是采用**标记 - 清除（Mark-Sweep）**的算法进行垃圾回收。首先是标记过程阶段。标记阶段就是从一组根元素开始，递归遍历这组根元素，在这个遍历过程中，能到达的元素称为**活动对象**，没有到达的元素就可以判断为**垃圾数据**，放到空闲列表里。例如当 showName 函数执行结束之后，ESP 向下移动，指向了 foo 函数的执行上下文，这时候如果==遍历调用栈==，是不会找到引用 1003 地址的变量，也就意味着 1003 这块数据为垃圾数据，被标记为红色。由于 1050 这块数据被变量 b 引用了，所以这块数据会被标记为活动对象。接下来就是垃圾的清除过程，就是清除掉红色标记数据的过程。**标记 - 整理（Mark-Compact）**，这个标记过程仍然与标记 - 清除算法里的是一样的，但后续步骤不是直接对可回收对象进行清理，而是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。





### 增量标记算法

js引擎是单线程的，为了降低老生代的垃圾回收而造成的卡顿，V8 将标记过程分为一个个的子标记过程，同时让垃圾回收标记和 JavaScript 应用逻辑交替进行，直到标记阶段完成，我们把这个算法称为**增量标记（Incremental Marking）算法**。





## 编译器和解释器

**编译型语言在程序执行之前，需要经过编译器的编译过程，并且编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行该二进制文件，而不需要再次重新编译了**

**解释型语言编写的程序，在每次运行时都需要通过解释器对程序进行动态解释和执行**。

![image-20220708210325252](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708210325252.png)





## V8 是如何执行一段 JavaScript 代码的

V8 在执行过程中既有**解释器 Ignition**，又有**编译器 TurboFan**

![image-20220708210934502](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708210934502.png)



### 1. 生成抽象语法树（AST）和执行上下文

对于编译器或者解释器来说，它们可以理解的就是 AST 了。所以无论你使用的是解释型语言还是编译型语言，在编译过程中，它们都会生成一个 AST。生成 AST 需要经过两个阶段。

**第一阶段是分词（tokenize），又称为词法分析**，其作用是将一行行的源码拆解成一个个 token。所谓**token**，指的是语法上不可能再分的、最小的单个字符或字符串。通过`var myName = “极客时间”`简单地定义了一个变量，其中关键字“var”、标识符“myName” 、赋值运算符“=”、字符串“极客时间”四个都是 token，而且它们代表的属性还不一样。

**第二阶段是解析（parse），又称为语法分析**，其作用是将上一步生成的 token 数据，根据语法规则转为 AST。如果源码符合语法规则，这一步就会顺利完成。但如果源码存在语法错误，这一步就会终止，并抛出一个“语法错误”。

有了 AST 后，那接下来 V8 就会生成该段代码的执行上下文。



### 2. 生成字节码

有了 AST 和执行上下文后，那接下来的第二步，解释器 Ignition 就登场了，它会根据 AST 生成字节码，并解释执行字节码。

**字节码就是介于 AST 和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。**

参考下图：

![image-20220708211303045](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708211303045.png)







### 3. 执行代码

生成字节码之后，接下来就要进入执行阶段了。

通常，如果有一段第一次执行的字节码，解释器 Ignition 会逐条解释执行。在执行字节码的过程中，如果发现有热点代码（HotSpot），比如一段代码被重复执行多次，这种就称为**热点代码**，那么后台的编译器 TurboFan 就会把该段热点的字节码编译为高效的机器码，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样就大大提升了代码的执行效率。

V8 的解释器和编译器的取名也很有意思。解释器 Ignition 是点火器的意思，编译器 TurboFan 是涡轮增压的意思，寓意着代码启动时通过点火器慢慢发动，一旦启动，涡轮增压介入，其执行效率随着执行时间越来越高效率，因为热点代码都被编译器 TurboFan 转换了机器码，直接执行机器码就省去了字节码“翻译”为机器码的过程。

其实字节码配合解释器和编译器是最近一段时间很火的技术，我们把这种技术称为**即时编译（JIT）**。





## 内存泄漏

常见的内存泄漏原因包括未及时清除计时器、闭包引用的变量未被释放、DOM元素未被正确地移除等。防止内存泄漏的方法包括使用正确的变量作用域、手动移除事件监听器、尽早从闭包中释放不再需要的变量等。



### Console.log有可能导致内存泄漏

console.log 在 devtools 打开的时候是有内存泄漏的，因为控制台打印的是对象引用。但是不打开 devtools 是不会有内存泄漏的。

string 因为常量池的存在，同样的字符串只会创建一次。new String 的话才会在堆中创建一个对象，然后指向常量池中的字符串字面量。

此外，nodejs 打印的是序列化以后的对象，所以是没有内存泄漏的。

当你一打开 devtools 网页就崩了，不打开没事，这时候一般就是因为 console.log 导致的内存泄漏了。



先手动 GC，然后执行一些操作，再 GC，如果内存没有回到执行前，就说明这段代码有内存泄漏，可以再[用 Performance 定位到代码位置分析代码](https://juejin.cn/book/7070324244772716556/section/7071919963262418947#heading-0)。





# 执行上下文

## 为什么要设计成堆和栈

第一，从软件设计的角度看，栈代表了处理逻辑（当函数被调用的时候，栈顶为局部变量和一些 bookkeeping 数据预留块。当函数执行完毕，保留块（reserved block）会被释放）从栈中释放块（free block）只不过是指针的偏移而已。），而堆代表了数据。这样分开，使得处理逻辑更为清晰。这种隔离、模块化的思想在软件设计的方方面面都有体现。

第二，堆与栈的分离，使得堆中的内容可以被多个栈共享。一方面这种共享提供了一种有效的数据交互方式(如：共享内存)，另一方面，堆中的共享常量和缓存可以被所有栈访问，节省了空间。

第三，栈因为运行时的需要，比如保存系统运行的上下文，需要进行地址段的划分。由于栈只能向上增长，因此就会限制住栈存储内容的能力。而堆不同，堆中的对象是可以根据需要动态增长的，因此栈和堆的拆分，使得动态增长成为可能，相应栈中只需记录堆中的一个地址即可。





## 执行上下文和可执行代码

函数<span style="color:red">运行</span>的时候，会首先创建执行上下文并入栈，当此执行上下文处于栈顶时就运行它。可执行代码就是要被执行的，执行上下文就是会被放到栈里的。（<span style="color:red">堆栈是存放数据的地方，不是存放代码的地方。</span>）

![image-20220708165306684](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708165306684.png)

从上图可以看出，输入一段代码，经过编译（预扫描）后，会生成两部分内容：**执行上下文（Execution context）和可执行代码**。先一开始编译全局代码，再当执行到对应的可执行代码时编译可执行代码。


### 可执行代码

<span style="color:red">JavaScript 的可执行代码(executable code)的类型有三种：全局代码、函数代码、eval代码。当 执行一段可执行代码(executable code)时，才会创建对应的执行上下文(execution context)。</span>

全局执行上下文：代码开始执行时就会创建，将他压执行栈的栈底，每个生命周期内只有一份。

函数执行上下文：当执行一个函数时，这个函数内的代码会被编译，生成变量环境、词法环境和绑定this，当函数执行结束的时候该执行环境从栈顶弹出。

例如：

![image-20220708170846850](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708170846850.png)

当执行到 add 函数的时候，我们就有了两个执行上下文了——全局执行上下文和 add 函数的执行上下文。









### 执行上下文

创建执行上下文的过程中会做三件事：创建变量对象，创建作用域链，确定 this 指向。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-05-10-54-image-20230505105403416.png" alt="image-20230505105403416" style="zoom: 50%;" /><img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-05-10-58-image-20230505105809925.png" alt="image-20230505105809925" style="zoom:50%;" />

#### 变量环境 + 词法环境



每个上下文都有变量环境和词法环境，<strong style="color: red">var和function定义的数据放变量环境里且function声明的优先级比var大，let 和 const 放到词法环境里。</strong>

词法环境内部维护了一个小型栈结构，栈底是函数最外层的变量（这里所讲的变量是指通过 let 或者 const 声明的变量），进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出，这就是词法环境的结构。

通过let或者const声明的变量会在进入块级作用域时被创建，但是在该变量没有赋值之前，引用该变量JavaScript引擎会抛出错误---这就是<strong style="color: red">“暂时性死区”</strong>





#### 函数上下文的变量对象

创建变量对象的过程中，首先会为 arguments 创建一个属性，值为 arguments，然后会扫描function函数声明，创建一个同名属性，值为函数的引用。接着会扫描var 变量声明，创建一个同名属性，值为 undefined。

创建执行上下文时，会按顺序给活动对象添加形参、函数声明、变量声明等初始的属性值：

1. 函数的所有形参(arguments)
   - 函数上下文的变量对象初始化只包括 Arguments 对象
   - 没有实参，属性值设为 undefined
2. 函数声明(function)
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明(var,let,const)
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子：

```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;
}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```



#### 作用域链(Scope chain)

##### 简介

函数有一个内部属性 [[Scopes]]，可称其为词法作用域，里面存着函数的Closure和全局变量。“Local–>Closure(forth) -> Closure(third)->Closure(second)->Closure(first)–> Script ->  Global”就是一个完整的作用域链。

==全局作用域上定义的let 和 const 变量会存到 Script里，var定义的变量和function定义的函数会放到Global里。==

![image-20220708194244148](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220708194244148.png)

词法作用域就是指==作用域是由代码中函数声明的位置==来决定的，通过它就能够预测代码在执行过程中如何查找标识符。



##### 闭包

<mark>本质还是作用域链、执行上下文的导致的，静态编译的时候会存起作用域链，逐链寻找上下文环境。</mark>

产生闭包有两步：第一步是需要预扫描内部函数（跟预扫描全局代码是一个道理）；第二步是把内部函数引用的外部变量（即闭包）保存到堆中。

1. 当 JavaScript 引擎执行到 foo 函数时，首先会编译，并创建一个空执行上下文。
2. 在编译过程中，遇到内部函数 setName，JavaScript 引擎还要==对内部函数做一次快速的词法扫描，发现该内部函数引用了 foo 函数中的 myName 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建一个<span style="color:red">“closure(foo)”</span>的对象==（这是一个内部对象，JavaScript 是无法访问的），用来保存 myName 变量。
3. 接着继续扫描到 getName 方法时，发现该函数内部还引用变量 test1，于是 JavaScript 引擎又将 test1 添加到“closure(foo)”对象中。这时候堆中的“closure(foo)”对象中就包含了 myName 和 test1 两个变量了。
4. 由于 test2 并没有被内部函数引用，所以 test2 依然保存在调用栈中。

通过上面的分析，我们可以画出执行到 foo 函数中“return innerBar”语句时的调用栈状态，如下图所示：

![image-20220708201957894](/Users/mac/Library/Application Support/typora-user-images/image-20220708201957894.png)

==当执行到 foo 函数时，闭包就产生了==；当 foo 函数执行结束之后，其执行上下文从栈顶弹出，返回的 getName 和 setName 方法都引用“clourse(foo)”对象。所以在调用`bar.setName`或者`bar.getName`时，创建的执行上下文中就包含了“clourse(foo)”。



#### this

<span style="color:red">this 是在函数执行的时候才确定下来的</span>，一般有几种调用场景：
1、被对象调用时，指向该对象 obj.b(); // 指向obj
2、直接作为函数调用 , 指向全局对象
3、作为构造函数调用 var b = new Fun(); // this指向当前实例对象
4、作为call与apply调用 obj.b.apply(object, []); // this指向当前的object

5、<font color="red">箭头函数中this的指向在它在定义时已经确定，**call()、apply()、bind()等方法也不能改变箭头函数中this的指向**</font>

```js
const obj = {
  b: () => {
    console.log('b',this)
  }
}
obj.b()//this指向window
```



>  如果一个构造函数bind了一个对象，用这个构造函数创建出的实例会继承这个对象的属性吗？
>
> 不会继承，因为new 绑定的优先级高于 bind 显示绑定，通过 new 进行构造函数调用时，会创建一个新对象，这个新对象会代替 bind 的对象绑定作为此函数的 this，并且在此函数没有返回对象的情况下，返回这个新建的对象








## 标识符查找

当在特定上下文中为读取或写入而引用一个标识符时，必须通过搜索确定这个标识符表示什么。搜索开始于作用域链前端，沿作用域链搜索。（注意，作用域链中的对象也有一个原型链，因此搜索可能涉及每个对象的原型链。）这个过程一直持续到搜索至全局上下文的变量对象。如果仍然没有找到标识符，则说明其未声明。

有两种方式在作用域中查询变量：

- 第一种是 LES 查询。当查询的目的是对变量进行赋值时，比如 「var b = 2」。

​				非严格模式下，如果作用域中没有所查询变量，全局作用域中就会自动创建一个具有该名称的变量。变量在全局作用域中，所以会变为一个全局变量。而在严格模式下全局作用域中不会自动创建该变量， js 引擎在查询不到变量后就会抛出一个 ReferenceError 异常。



- 第二种查询是 RES 查询。当查询的目的是获取变量的值时，比如 「 if(a)」中的 a。









## 举个例子

我们分析第一段代码：

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

执行过程如下：

1.执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈

```
    ECStack = [
        globalContext
    ];
```

2.全局上下文初始化

```javascript
    globalContext = {
        VO: [global],  //数组  ---在浏览器中就是window，在node中就是那个啥
        Scope: [globalContext.VO],//数组
        this: globalContext.VO
    }
```

​	==全局上下文初始化初始化的同时==，checkscope 函数被创建，保存所有父变量对象到函数的内部属性[[scope]]

```javascript
    checkscope.[[scope]] = [ //数组
      globalContext.VO
    ];
```

3.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```
    ECStack = [
        checkscopeContext,
        globalContext
    ];
```

4.checkscope 函数执行上下文初始化：

1. 复制函数 [[scope]] 属性创建作用域链，
2. 用 arguments 创建活动对象，
3. 初始化活动对象，即加入形参、函数声明、变量声明，
4. 将活动对象压入 checkscope 作用域链顶端。

```javascript
    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope: undefined,
            f: reference to function f(){}
        },
        Scope: [AO, globalContext.VO],
        this: undefined
    }
```

​	同时 f 函数被创建，保存父级变量对象到 f 函数的内部属性[[scope]]

```
f.[[scope]]=[ checkscopeContext.AO, globalContext.vo ]
```



5.执行 f 函数，创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈

```
    ECStack = [
        fContext,
        checkscopeContext,
        globalContext
    ];
```

6.f 函数执行上下文初始化, 以下跟第 4 步相同：

1. 复制函数 [[scope]] 属性创建作用域链
2. 用 arguments 创建活动对象
3. 初始化活动对象，即加入形参、函数声明、变量声明
4. 将活动对象压入 f 作用域链顶端

```
    fContext = {
        AO: {
            arguments: {
                length: 0
            }
        },
        Scope: [AO, checkscopeContext.AO, globalContext.VO],
        this: undefined
    }
```

7.f 函数执行，沿着作用域链查找 scope 值，返回 scope 值

8.f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

```
    ECStack = [
        checkscopeContext,
        globalContext
    ];
```

9.checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

```
    ECStack = [
        globalContext
    ];
```



# 函数

JS中"函数是一等对象" 

1. 函数可以被赋值给变量：可以使用变量来引用函数，并通过变量来调用函数。

2. 函数可以作为参数传递给其他函数：可以将一个函数作为参数传递给另一个函数，并在被调用的函数中使用传递的函数。 

3. 函数可以作为其他函数的返回值：函数可以在另一个函数内部被定义，并作为这个函数的返回值返回给调用者。 

4. 函数可以作为对象的属性：函数可以作为对象的属性，通过对象来调用函数。 

   由于函数作为一等对象的特性，JavaScript 中可以实现很多有趣的功能，比如高阶函数（Higher-Order Functions）、函数式编程（Functional Programming）等。



## 参数传递

在 JavaScript 中，函数参数的传递有两种方式：按值传递和按引用传递。

按值传递指的是将函数参数的值复制一份，然后将这份副本传递给函数。这时候，函数内部对参数的修改不会影响到原始的值。在 JavaScript 中，只有基本数据类型（如数字、字符串、布尔值、null 和 undefined 等）是按值传递的。

按引用传递指的是将函数参数的引用（即内存地址）传递给函数，并不是对值本身的复制。当我们传递一个对象或数组时，实际上传递的是它在内存中的位置，即引用。这时候，函数内部对参数的修改会影响到原始的值。

需要注意的是，虽然传递对象或数组时是按引用传递的，但是如果在函数内部将参数重置为另外一个值，那么它就不再指向原始的值了。（把参数理解为函数作用域内的新变量，这个变量一开始接收的是对象的引用地址，如果你给这个变量赋值，那这个变量就不再指向原来的那个对象的引用地址了）。

```js
let num = 100
changeArg(num)
console.log('changeArg num', num) // 100

let obj = { name: '双越' }
changeArg(obj)
console.log('changeArg obj', obj) // { name: '双越' }

changeArgProp(obj)
console.log('changeArgProp obj', obj) //{name:'张三'}

function changeArg(x) { x = 200 }

function changeArgProp(x) {
    x.name = '张三'
}
```



## 内置属性&方法

### Arguments对象(已废除)

#### 简介

==类数组对象。==调用函数时，会为其创建一个Arguments对象，并自动初始化局部变量arguments，指代该Arguments对象。所有作为参数传入的值都会成为Arguments对象的数组元素。Arguments 对象包括了函数的参数和其他属性

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230209125414136.png" alt="image-20230209125414136" style="zoom:50%;" />



#### length属性

Arguments对象的length属性，表示==实参==的长度

==其实函数也有length属性，表示形参的个数==

```javascript
function foo(b, c, d){
    console.log("实参的长度为：" + arguments.length)
}

console.log("形参的长度为：" + foo.length)

foo(1)

// 形参的长度为：3
// 实参的长度为：1
```





#### callee属性

Arguments 对象的 callee 属性，通过它可以调用函数自身。

讲个闭包经典面试题使用 callee 的解决方法：

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) //打印这个函数上的属性i
    }).i = i;//给data[i]这个函数加了一个属性i
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

#### arguments 和对应参数的绑定

在非严格模式下，传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享

如果是在严格模式下，实参和 arguments 是不会共享的。



### call

> call() 方法在使用一个==指定的 this 值==和==若干个指定的参数值==的前提下==调用==某个函数或方法。

> 我一言以蔽之call的作用：将函数作为传进来的对象上的属性然后执行

#### 可用于借用构造函数继承

```js
function Parent (name) {
    this.name = name;
}

function Child (name) {
    Parent.call(this, name);
}

//测试
var child1 = new Child('kevin');
console.log(child1.name); // kevin
```





#### 手写

##### 改变this指向并调用

1. 将调用的函数设为传进来的这个对象的 属性
2. 执行该函数，并返回调用后的结果
3. 为传进来的这个对象 删除该函数
4. this 参数可以传 null，当为 null 的时候，视为指向 全局对象

```javascript
Function.prototype.call2 = function(obj) {
  const obj = obj || globalThis
    // 首先要获取调用call的函数，用this可以获取
    obj.fn = this;
    const result = obj.fn();//调用
    delete obj.fn;
  	return result
}
```

##### 若干个指定的参数值

##### 方法一：利用剩余参数

```javascript
Function.prototype.call2 = function(obj,...args) {
    // 首先要获取调用call的函数，用this可以获取
    obj.fn = this;
    obj.fn(...args);//调用
    delete obj.fn;
}
```

##### 方法二：es6之前的方法(权当了解)

我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：

```
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```

不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

```
// 将数组里的元素作为多个参数放进函数的形参里
context.fn(args.join(','))
// (O_o)??
// 这个方法肯定是不行的啦！！！
```

也许有人想到用 ES6 的方法，不过 call 是 ES3 的方法，我们为了模拟实现一个 ES3 的方法，要用到ES6的方法，好像……，嗯，也可以啦。但是我们这次用 eval 方法拼成一个函数，类似于这样：

```
eval('context.fn(' + args +')')
```

这里 args 会自动调用 Array.toString() 这个方法。

所以我们的第二版克服了两个大问题，代码如下：

```javascript
// 第二版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')');
    delete context.fn;
}
```



##### 返回值(最终版)

```javascript
//最终版本
Function.prototype.call2 = function(obj,...args) {
 if (typeof this !== "function") {
  throw new TypeError("type error");
}
  obj = obj||globalThis
  obj.fn = this;
  const result = obj.fn(...args);//调用并接收返回值
  delete obj.fn;
  return result
}
```





### apply

**`apply()`** 方法调用一个具有给定 `this` 值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。

**备注：**call() 方法和 apply() 方法区别就是 `call()` 方法接受的是**参数列表**，而 `apply()` 方法接受的是**一个参数数组**。

```javascript
//最终版本
Function.prototype.apply2 = function (obj, arr = []) {
  if (typeof this !== "function") {
  throw new TypeError("type error");
}
    obj = obj || globalThis
    obj.fn = this
    const result = obj.fn(...arr)
    delete obj.fn
    return result
}
```



### bind

> bind() 方法会==创建一个新函数==。当这个新函数被调用时，bind() 的==第一个参数将作为它运行时的 this==，之后的一序列==参数将会在传递的实参前传入作为它的参数==。



#### 应用场景

##### [创建绑定函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#创建绑定函数)

`bind()` 创建的一个函数，不论怎么调用，这个函数都有同样的 **`this`** 值。当将一个方法从对象中拿出来，然后再调用，如果不做特殊处理的话，一般会丢失原来的对象。如果我们把这个函数用bind绑定后再返回出去，那别人用的时候就不用在意this指向了。



##### [偏函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#偏函数)

`bind()` 的另一个最简单的用法是使一个函数拥有预设的初始参数。只要将这些参数（如果有的话）作为 `bind()` 的参数写在 `this` 后面。当绑定函数被调用时，这些参数会被插入到目标函数的参数列表的开始位置，传递给绑定函数的参数会跟在它们后面。





##### [配合 `setTimeout`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#配合_settimeout)

在默认情况下，使用 [`window.setTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 时，里面的回调函数的`this` 关键字会指向 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)（或 `global`）对象。你可以通过bind显式地把 `this` 绑定到回调函数上。





##### [快捷调用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#快捷调用)

在你想要为一个需要特定的 **`this`** 值的函数创建一个捷径（shortcut）的时候，`bind()` 也很好用。

你可以用 [`Array.prototype.slice`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 来将一个类似于数组的对象（array-like object）转换成一个真正的数组，就拿它来举例子吧。你可以简单地这样写：

```
var slice = Array.prototype.slice;

// ...

slice.apply(arguments);
```



用 `bind()`可以使这个过程变得简单。在下面这段代码里面，`slice` 是 [`Function.prototype` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype) 的 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法的绑定函数，并且将 `Array.prototype` 的 [`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 方法作为 **`this`** 的值。这意味着我们压根儿用不着上面那个 `apply()`调用了。

```
// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);

// ...

slice(arguments);
```





#### 手写

##### 返回一个函数并改变this指向

1. 利用call或apply去绑定this指向
2. 函数可能会有返回值

```javascript
Function.prototype.bind2 = function (obj) {
    const fn  = this
    return function () {
        return fn.call(obj)//函数可能会有返回值，所以这里加个return        
    }
}
```



##### 可以传参

先看看具体使用：

```javascript
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```



利用剩余参数来实现

```javascript
Function.prototype.bind2 = function (obj,...args) {
    const fn = this
    return function (...bindArgs) {
        return fn.call(obj,...args,...bindArgs)        
    }
}
```



##### 返回的函数可以用作构造函数（最终版）

 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效

1. 显式绑定的obj会失效，因为此时函数的this应该指向构造的实例对象
2. 实例可以继承原函数的原型中的值

```javascript
//最终实现
Function.prototype.bind2 = function (obj,...args) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
  	obj = obj || globalThis
    const fn = this //fn是原函数
    const bindFn = function (...bindArgs) {
        //如果是被new调用，那么此时的this指向的实例对象的原型链上一定有bindFn.prototype 即 this instanceof bindFn === true
        return fn.call(this instanceof bindFn ? this : obj,...args,...bindArgs)        
    }
    
    //为了让实例可以继承原函数的原型中的值
    //bindFn.prototype = fn.prototype //这样有个问题就是如果你执行bindFn.prototype.a = 1,那么fn.prototype上也会多一个属性a，因为两者共用同一个对象啊。所以我们采取下面这种做法，不是让bindFn.prototype直接等于fn.prototype,而是让bindFn.prototype.__proto__ = fn.prototype
   	bindFn.prototype = Object.create(fn.prototype)
    return bindFn
}
```









## 箭头函数

### 箭头函数与普通函数的区别

**（1）箭头函数比普通函数更加简洁**

- （有很多简洁的地方，这里就展开啦）比如说：如果函数体不需要返回值，且只有一句话，可以给这个语句前面加一个void关键字。最常见的就是调用一个函数：

```javascript
let fn = () => void doesNotReturn();
```

**（2）箭头函数没有自己的this**，所以箭头函数不能作为构造函数使用，**call()、apply()、bind()等方法也不能改变箭头函数中this的指向**

<font color="red">箭头函数中this的指向在它在定义时已经确定了，之后不会改变。</font>

```js
const obj = {
  a: function () {
    console.log('a',this)
  },
  b: () => {
    console.log('b',this)

  }
}
obj.a()//this指向obj
obj.b()//this指向window
```



**（3）箭头函数没有自己的arguments**

箭头函数没有自己的arguments对象。在箭头函数中访问arguments实际上获得的是它外层函数的arguments值。

**（4）箭头函数没有prototype**

**（5）箭头函数不能用作Generator函数，不能使用yeild关键字**



### 如果new一个箭头函数的会怎么样

箭头函数没有prototype，也没有自己的this指向，更不可以使用arguments参数，所以不能New一个箭头函数。

new操作符的实现步骤如下：

1. 创建一个对象
2. 将构造函数的作用域赋给新对象（也就是将对象的__proto__属性指向构造函数的prototype属性）
3. 指向构造函数中的代码，构造函数中的this指向该对象（也就是为这个对象添加属性和方法）
4. 返回新的对象

所以，上面的第二、三步，箭头函数都是没有办法执行的。











## 词法作用域

JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域，即函数的作用域在函数定义的时候就决定了。



## 闭包

### 定义

<mark>本质还是作用域链、执行上下文的导致的，静态编译的时候会存起作用域链，逐链寻找上下文环境。</mark>

MDN 对闭包的定义为：

> 闭包是指那些能够访问自由变量的函数。

那什么是自由变量呢？

> 自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。



闭包指的是：

1. 从理论角度：所有的函数都是闭包。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
2. 从实践角度：以下函数才算是闭包：
   1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
   2. 在代码中引用了自由变量



### 两个常用的用途

- 创建私有变量
- 使已经运行结束的函数上下文中的变量对象继续留在内存中



### 详细产生过程

产生闭包有两步：第一步是需要预扫描内部函数（跟预扫描全局代码是一个道理）；第二步是把内部函数引用的外部变量（即闭包）保存到堆中。

1. 当 JavaScript 引擎执行到 foo 函数时，首先会编译，并创建一个空执行上下文。
2. 在编译过程中，遇到内部函数 setName，JavaScript 引擎还要==对内部函数做一次快速的词法扫描，发现该内部函数引用了 foo 函数中的 myName 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个“closure(foo)”的对象==（这是一个内部对象，JavaScript 是无法访问的），用来保存 myName 变量。
3. 接着继续扫描到 getName 方法时，发现该函数内部还引用变量 test1，于是 JavaScript 引擎又将 test1 添加到“closure(foo)”对象中。这时候堆中的“closure(foo)”对象中就包含了 myName 和 test1 两个变量了。
4. 由于 test2 并没有被内部函数引用，所以 test2 依然保存在调用栈中。

通过上面的分析，我们可以画出执行到 foo 函数中“return innerBar”语句时的调用栈状态，如下图所示：

==当执行到 foo 函数时，闭包就产生了==；当 foo 函数执行结束之后，其执行上下文从栈顶弹出，返回的 getName 和 setName 方法都引用“clourse(foo)”对象。所以在调用`bar.setName`或者`bar.getName`时，创建的执行上下文中就包含了“clourse(foo)”。





### 举个面试题例子

#### 分析

接下来，看这道刷题必刷，面试必考的闭包题：

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

答案都是 3，让我们分析一下原因：

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。



#### 解决方法一

所以让我们改成闭包看看：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

跟没改之前一模一样。

当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。





#### 解决方法二

利用函数的arguments对象上的callee属性

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) //打印这个函数上的属性i
    }).i = i;//给data[i]这个函数加了一个属性i
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```





## 参数

### 参数按值传递

> ECMAScript中所有函数的参数都是按值传递的。也就是说，把函数外部的值==复制==给函数内部的参数，就和把值从一个变量复制到另一个变量一样。

参数如果是基本类型是按值传递，如果是引用类型按共享传递。

举个例子：

```javascript
var obj = {
    value: 1
};
function foo(o) {
    o.value = 2;
    console.log(o.value); //2
}
foo(obj);
console.log(obj.value) // 2
```

```javascript
var obj = {
    value: 1
};
function foo(o) {
    o = 2;
    console.log(o); //2
}
foo(obj);
console.log(obj.value) // 1
```

按共享传递，就是在传递对象的时候，传递  `对象的引用 的副本`。

所以修改 o.value，可以通过引用找到原值，但是直接修改 o，并不会修改原值。



### 剩余参数

如果函数的最后一个命名参数以`...`为前缀，则它将成为一个由剩余参数组成的==真数组==，其中从`0`（包括）到`theArgs.length`（排除）的元素由传递给函数的实际参数提供。



## 尾调用&尾递归

### 尾调用

尾调用指的是函数的最后一步调用另一个函数。代码执行是基于执行栈的，所以当在一个函数里调用另一个函数时，会保留当前的执行上下文，然后再新建另外一个执行上下文加入栈中。使用尾调用的话，因为已经是函数的最后一步，所以这时可以不必再保留当前的执行上下文，从而节省了内存，这就是尾调用优化。 "尾调用优化"（Tail call optimization），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。

（ES6的尾调用优化只在严格模式下开启，正常模式是无效的。

这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。

> - `arguments`：返回调用时函数的参数。
> - `func.caller`：返回调用当前函数的那个函数。

尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效。）



### 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。

> ```javascript
> function factorial(n) {
> if (n === 1) return 1;
> return n * factorial(n - 1);
> }
> 
> factorial(5) // 120
> ```

上面代码是一个阶乘函数，计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n) 。

如果改写成尾递归，只保留一个调用记录，复杂度 O(1) 。

> ```javascript
> function factorial(n, total) {
> if (n === 1) return total;
> return factorial(n - 1, n * total);
> }
> 
> factorial(5, 1) // 120
> ```







## 高阶函数

### 简介

高阶函数可以将函数作为输入或返回值，比如数组的sort方法，为事件注册回调函数也类似。



### 作用

#### 高阶函数实现AOP

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。在Java语言中，可以通过反射和动态代理机制来实现AOP技术。而在JavaScript这种动态语言中，AOP的实现更加简单，这是JavaScript与生俱来的能力。通常，在JavaScript中实现AOP，都是指把一个函数“动态织入”到另外一个函数之中，具体的实现技术有很多，本节我们通过扩展Function.prototype来做到这一点。代码如下：

![image-20230909214130747](/Users/yonecdeng/Library/Application Support/typora-user-images/image-20230909214130747.png)

我们把负责打印数字1和打印数字3的两个函数通过AOP的方式动态植入func函数。通过执行上面的代码，我们看到控制台顺利地返回了执行结果1、2、3。这种使用AOP的方式来给函数添加职责，也是JavaScript语言中一种非常特别和巧妙的装饰者模式实现。







#### 函数偏函数&柯里化

##### 偏函数

局部应用(偏函数)是指固定一个函数的x个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

可以理解成 Function.prototype.bind函数也是一个偏函数（x = 0）

```javascript
const _ = Symbol('_')
function partial(fn,...args) {
    function partialFn(...ar){
        let arIndex = 0
        for (let i = 0; i < args.length; i++){
            if(args[i]===_)args[i]=ar[arIndex++]
        }
        while (arIndex < ar.length) {
            args.push(ar[arIndex++])
        }
        return fn.apply(this,args)
    }
    return partialFn
}

//使用
const add = function (a, b, c,d,e) {
    console.log(a,b,c,d,e)
}
const curryAdd = partial(add,1,_,3,_,_)
curryAdd(2,4,5)
```





##### 柯里化

Curried functions are automatically partially applied

柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。

柯里化就是 用闭包把参数保存起来，<mark>当参数的数量足够了再执行函数</mark>

包含占位符的版本：[参考](https://github.com/mqyqingfeng/Blog/issues/42)

```javascript
//完全满足柯里化的定义，转化成只能有一个参数的函数
function curry(fn) {
  const args = [];
  function curryFn(arg) {
    args.push(arg);
    if (args.length === fn.length) {
      const res = fn.apply(this, args);
      args.length = 0;
      return res;
    }
    return (ar) => curryFn.call(this, ar);
  }
  return curryFn;
}


// 另一种写法：
// curry 函数借助 Function.length 读取函数元数
function curry(func, arity=func.length) {
  // 定义一个递归式 generateCurried
  function generateCurried(prevArgs) {
    // generateCurried 函数必定返回一层嵌套
    return function curried(nextArg) {
      // 统计目前“已记忆”+“未记忆”的参数
      const args = [...prevArgs, nextArg]  
      // 若 “已记忆”+“未记忆”的参数数量 >= 回调函数元数，则认为已经记忆了所有的参数
      if(args.length >= arity) {
        // 触碰递归边界，传入所有参数，调用回调函数
        return func(...args)
      } else {
        // 未触碰递归边界，则递归调用 generateCurried 自身，创造新一层的嵌套
        return generateCurried(args)
      }
    }
  }
  // 调用 generateCurried，起始传参为空数组，表示“目前还没有记住任何参数”
  return generateCurried([])
}



//柯里化与偏函数的综合，转化成的函数传几个参数进去都可以
function curry(fn) {
    function curryFn(...args) {
        if (args.length === fn.length) return fn.apply(this,args)
        return (...ar) => curryFn.call(this,...args,...ar)
    }
    return curryFn
}
```



#### 分片执行函数

让工作分批进行，比如把1秒钟创建1000个节点，改为每隔200毫秒创建8个节点。





### 防抖

#### 一言蔽之

如果你触发了事件后， n 秒内不再触发事件我才执行。但不一定是n秒内就一定会执行一次，是必须你n秒内没有触发我才执行。（这就是防抖节流的核心区别）

防抖用于无法预知的用户主动行为，如用户输入内容去服务端动态搜索结果。用户打字的速度等是无法预知的，具有非规律性。

```javascript
//就根据上面那句话，搞一段代码出来
funciton debounce(fn,time){
  	let timeout = 0 //timeout通过闭包成为了对于匿名函数来说的全局变量
  	return function(){
      	clearTimeout(timeout)
      	timeout = setTimeout(fn,time)
    }
}

//这样去使用：
container.onmousemove = debounce(getUserAction, 2000); //这里onmousemove绑定的函数其实是那个匿名函数
```



#### 修复为原函数的this指向和允许传参

```javascript
funciton debounce(fn,time){
  	let timeout = 0 //timeout通过闭包成为了对于匿名函数来说的全局变量
  	return function(...args){
        const self = this
        clearTimeout(timeout)
      	timeout = setTimeout(fn.bind(self,args),time)
    }.
}	
```





#### 立刻执行模式（感觉这样都变成节流了）

我一触发就立马执行事件，然后要停止触发n秒后（在这n秒内你怎么触发都不会执行），才能再次立马执行

```javascript
function useDebounce(fn,time,immediate = false){
  	let timeout = null

  	return function(...args){
        const self = this
        if(timeout) clearTimeout(timeout)
        if(immediate){ //如果immediate为true就执行这一段，为false就执行下面那一段，两种模式
            const isCallNow = !timeout//还没有计时器就说明可以执行
            timeout = setTimeout(function(){timeout = null},time)
            if(isCallNow) fn.apply(self,args)
        }else{
      	    timeout = setTimeout(fn.bind(self,args),time)
        }
    }
}
```





#### 返回值 且 可取消一次防抖

原函数是可能会有返回值的，但是无法获取setTimeout里的函数的返回值，所以只有immediate为true时才能返回原函数的返回值

调用cancel()函数可以取消一次定时器

```javascript
//最终版
function useDebounce(fn,time,immediate = false){
  	let timeout = null

  	const debounceFn = function(...args){
        if(timeout) clearTimeout(timeout) //把timeout清掉但没有把timeout这个变量变为null
        if(immediate){ //如果immediate为true就执行这一段，为false就执行下面那一段，两种模式
            const isCallNow = !timeout//还没有执行就可以执行
            timeout = setTimeout(function(){timeout = null},time)
            if(isCallNow) return fn.apply(this,args)
        }else{
      	    timeout = setTimeout(fn.bind(this,...args),time) //超过time之后这个timeout就执行了
        }
    }

    debounceFn.cancel = function(){
        clearTimeout(timeout)
        timeout = null
    }
    return debounceFn
}
```





### 节流

#### 一言蔽之

如果你持续触发事件，每隔固定的一段时间，只允许执行一次。换句话说是这段时间内必执行一次。（这就是防抖节流的核心区别）

节流可能用于一些非用户主动行为或者可预知的用户主动行为，如用户滑动商品橱窗时发送埋点请求、滑动固定的高度是已知的逻辑，具有规律性。





#### 使用时间戳（有头无尾）---立即执行

当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就立即执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

举例：当鼠标移入的时候，事件立刻执行，每过 1s 会执行一次，如果在 4.2s 停止触发，以后不会再执行事件。

```javascript
//修复为原函数的this指向和允许传参
function useThrottle(fn,time){
    let pre = 0
    return function(...args){
        const self = this
        const now = +new Date()//隐式类型转化，会调用Date.prototype.valueof()方法
        if(now-pre>time){
            fn.apply(self,args)
            pre = now
        }
    }
}
```



#### 使用定时器（无头有尾）---触发之后等几秒再执行

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

举例：当鼠标移入的时候，事件不会立刻执行，晃了 3s 后终于执行了一次，此后每 3s 执行一次，当数字显示为 3 的时候，立刻移出鼠标，相当于大约 9.2s 的时候停止触发，但是依然会在第 12s 的时候执行一次事件。

```javascript
//修复为原函数的this指向和允许传参
function useThrottle(fn,time){
    let timeout
    return function(...args){
        const self = this
        if(timeout) return 
        timeout = setTimeout(function(){
            timeout = null
            fn.apply(self,args)
        },time)
    }
}
```



#### 双剑合璧（有头有尾）

其实一直都在运行时间戳那一部分，只有最后一次才执行了定时器方法那一部分

```javascript
function useThrottle(fn,time){
    let timeout = null,pre=0 //timeout是用来管理定时器方法的，pre是用来管理时间戳方法的
    return function(...args){
        const self = this
        const now = +new Date()
        const remainTime = time -(now - pre)
        //时间戳方法---没有剩余的时间了那就立刻执行
        if(remainTime<=0 || remainTime > time){//没有剩余的时间了 或者 你电脑系统的时间改成了以前的时间导致你的now在pre之前
            if(timeout){
                clearTimeout(timeout) //清空计时器
                timeout=null
            }
            pre = now
            fn.apply(self,args)
        //定时器方法---保留你的最后一次立即执行的触发后的那一次触发，使其在reaminTime后执行
        }else if(!timeout){ //如果还有剩余的时间 且 没有定时器
            timeout = setTimeout(function(){ //产生计时器
                pre = +new Date() //因为pre是指上一次执行的时间
                timeout = null //每执行一次都要清空timeout，不然你触发了几次事件就还是会执行几次事件
                fn.apply(self,args)
            },remainTime)
        } 
    }
}
```







#### 配置可选有无头尾 & 取消

设置 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

leading：false 表示禁用第一次执行
trailing: false 表示禁用 停止触发时的回调

注意：不存在无头无尾（又不是立即执行，又不是定时器后执行，那你说怎么执行，就很矛盾，所以不存在的）

```javascript
//最终版本
function useThrottle(fn,time,options={leading : true,trailing:false}){
    let timeout = null,pre=0 //timeout是用来管理定时器方法的，pre是用来管理时间戳方法的（pre记录的是上一次执行的时间）
    const {leading,trailing} = options
    const throttleFn =  function(...args){
        const self = this
        const now = +new Date() //记录触发的时间
        if(!leading&&!pre) pre  = now //（*）这样就永远不会执行时间戳方法了（因为下面的remainTime就会永远等于time） ；因为你还要控制remainTime的值，所以不能直接在时间戳方法那通过判断leading的值来控制是否要有头；要控制remainTime的值是因为计时器方法要用这个值
        const remainTime = time -(now - pre)

        //时间戳方法---没有剩余的时间了那就立刻执行
        if(remainTime<=0 || remainTime > time){//没有剩余的时间了 或者 你电脑系统的时间改成了以前的时间导致你的now在pre之前
            if(timeout){
                clearTimeout(timeout) //清空计时器
                timeout=null
            }
            pre = now
            fn.apply(self,args)
        //定时器方法---保留你的最后一次立即执行的触发后的那一次触发，使其在reaminTime后执行
        }else if(!timeout && trailing){ //如果还有剩余的时间 且 没有定时器 且需要trailing； 因为如果是有头有尾的话那么整个函数就只有最后一次才会执行定时器方法那一部分，所以直接判断trailing的值去决定要不要执行即可
            timeout = setTimeout(function(){ //产生计时器
                pre = leading? +new Date():0  //因为pre是指上一次执行的时间； 如果不要头就让pre = 0是为了让（*）行代码能执行
                timeout = null //每执行一次都要清空timeout，不然你触发了几次事件就还是会执行几次事件
                fn.apply(self,args)
            },remainTime)
        } 
    }
    //取消一次
    throttleFn.cancel = function(){
        clearTimeout(timeout)
        timeout = null
        pre = 0 //在立即执行的模式下，使pre变成0之后，触发事件又会立即执行啦
    }
    return throttleFn
}
```





# 同步与异步

## 事件循环

### 这么多个线程的工作流程(事件循环的本质)

![image-20230429110302039](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-11-03-image-20230429110302039.png)





#### JS引擎与渲染引擎

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-11-00-image-20230429110036274.png" alt="image-20230429110036274" style="zoom: 50%;" />



![image-20230429133117889](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-31-image-20230429133117889.png)



### 宏任务与微任务

**js异步任务主要分为宏任务与微任务两种**。有两个异步任务的队列，不同的异步任务会放到不同的队列中。ES6 规范中，宏任务（Macrotask） 称为 Task， 微任务（Microtask） 称为 Jobs。在宏任务结束后会先执行微任务队列中的nextTickQueue部分，然后才会执行其他微任务。

**宏任务与微任务的几种创建方式** 👇

| 宏任务（Macrotask）                                          | 微任务（Microtask）                       |
| ------------------------------------------------------------ | ----------------------------------------- |
| setTimeout & setInterval                                     | MutationObserver（浏览器环境监听dom变化） |
| MessageChannel                                               | Promise.[ then/catch/finally ]            |
| I/O，事件队列。（事件的回调，但是resize和scroll的回调则会在微任务后执行） | process.nextTick（Node环境）              |
| setImmediate（Node环境）                                     | queueMicrotask                            |
| script（整体代码块）                                         |                                           |
| requestAnimationFrame （本质是跟据据屏幕刷新率来调用回调函数，你很难预知其执行时机，官方规定应该把rAF放在渲染之前,至少谷歌浏览器和火狐是实现了在渲染之前执行） |                                           |
| 垃圾回收 (Minor GC)是宏任务                                  |                                           |

（<font color="red">浏览器的渲染是异步的</font>），操作dom的api会同步执行，但是渲染是异步的)，毕竟是别的线程干的事(但其实这个异步是可以预测的，因为就是执行完js就去渲染嘛，js线程与渲染线程互斥)。

script（整体代码块）可以看作个宏任务。因为如果同时存在两个 script 代码块，会首先执行第一个 script 代码块中的同步代码，如果这个过程中创建了微任务并进入了微任务队列，第一个 script 同步代码执行完之后，会首先去清空微任务队列，再去开启第二个 script 代码块的执行。

chrome里的performance也能看出下面这个流程图。

![image-20230804000142916](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-04-00-01-image-20230804000142916.png)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2baaf009636748c491898aafeceddb32~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

如果setTimeout不设置延迟时间，感觉chrome不一定满足这个（要设个几ms才能满足），但是safari是完全满足这个。







## promise

### 介绍

Promise 是异步编程的一种解决方案，所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。



### 判断是否是promise（是否是异步返回的对象）

`await`的语法糖里判断Promise对象也是通过`promise.then==='funtion'`，这源于Promise A+最基本的定义：

`promise`是具有`then`方法的对象或函数

> 除了这方法，还有
>
> Promise.resolve(res) === res // 这方法现在是比较规范的判断方式，不过早些版本的Safari浏览器跑不了

遵循Promise规范的库包含了ES6默认Promise、bluebird Promise、Q Promise等。这样子的好处是，对于所有实现了Promise规范的异步库，这样的判断方式都是有效的。虽然这有产生误报的风险，但这是所有Promise库都必须遵循的规范。

### 构造函数

执行promise函数的时候使用者会传入一个执行器函数，这个执行器函数会立即执行。promise内部会给执行器函数传入两个函数，这两个函数是primise里面定义好的，用于更改promise的状态和结果

```javascript
//Promise有三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

/**只有报错才reject，reject就当报错 */
function MyPromise(executor){//执行promise函数的时候使用者会传入一个执行器函数，这个执行器函数会立即执行
    this.status = PENDING
    this.result = null
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    //用箭头函数是为了使这两个函数里的this永远指向新建的那个实例对象
    /*Promise 中使用 resolve 和 reject 两个函数来更改状态和结果*/
    /*用于更新成功后的状态及结果*/ 
    const resolve = (value) => { //接收一个参数，这个参数是使用者传进来的
        if (this.status !== PENDING) return //只有处于pending状态才能改变状态,这样就能实现状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
        this.status = FULFILLED
        this.result = value
        while (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.shift()(value)
        }
    } 

    /**用于更新失败后的状态及结果 */
    const reject = (reason) => { //接收一个参数，这个参数是使用者传进来的
        if (this.status !== PENDING) return //只有处于pending状态才能改变状态
        this.status = REJECTED
        this.result = reason
        while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(reason)
        }
    }

    try {
        executor(resolve,reject) //promise内部会给执行器函数传入两个函数，这两个函数是primise里面定义好的
    } catch (err) {
        reject(err)
    }
}

```



### then

1. then 方法内部做的事情就是获取上一个promise的状态然后根据不同状态办事情(即then是知道上一个promise的状态和结果的),如果状态是成功，调用成功回调函数,如果状态是失败，调用失败回调函数，如果判断是等待，则存起来。 --- 即then里的函数只有等promise resolve或者reject了才会执行
2. then的回调只要同步执行没出错或者回调函数返回的是promise且该promise不是rejected，则then返回的这个新的promise默认成功
3. 如果onFulfilled不是函数，则会在内部被替换为 (x) => x，即原样返回 上一个promise 的最终结果；如果onRejected不是函数，则会在内部被替换为一个 "Thrower" 函数；onFulfilled和onRejected会被异步执行

```javascript
/**只有then方法是知道这个promise对像的值和状态 */
    MyPromise.prototype.then=function(onFulfilled, onRejected) { //接收两个使用者传进来的函数,这两个函数可以接收一个参数，这个参数的实参是到时候resolve或reject传给他的result
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v //MDN:如果onFulfilled不是函数，则会在内部被替换为 (x) => x，即原样返回 上一个promise 的最终结果
        onRejected = typeof onRejected === 'function' ? onRejected : (err)=>{ throw err } //MDN: 如果onRejected不是函数，则会在内部被替换为一个 "Thrower" 函数
        const p = new MyPromise((reso, reje) => { //这里如果用函数声明的话this就会指向新创建的这个实例对象了
            switch (this.status) {
                case FULFILLED:
                    /*确实原生then方法里的onFulfilled和onRejected会被异步执行*/
                    queueMicrotask(() => {//如果不用微任务的话会报错‘ReferenceError: Cannot access 'p' before initialization’，所以把下面两行代码放到微任务里执行即可等待 p 完成初始化
                        try {
                            const result = onFulfilled(this.result) 
                            resolveResult(p, result, reso, reje) //只要是有结果就都resolve
                        } catch (err) {
                            reje(err)
                        }
                    })
                    break
                case REJECTED:
                    queueMicrotask(() => {//如果不用微任务的话会报错‘ReferenceError: Cannot access 'p' before initialization’，所以把下面两行代码放到微任务里执行即可等待 p 完成初始化
                        try {
                            const result = onRejected(this.result)
                            resolveResult(p,result,reso,reje) //用这个handle函数来处理上个函数处理的结果
                        } catch (err) {
                            reje(err)
                        }
                    })
                    break
                case PENDING:
                    this.onFulfilledCallbacks.push(() => {
                        queueMicrotask(() => {//如果不用微任务的话会报错‘ReferenceError: Cannot access 'p' before initialization’，所以把下面两行代码放到微任务里执行即可等待 p 完成初始化
                            try {
                                const result = onFulfilled(this.result) //用户传进来的这个onFulfilled如果是异步的话那我源码还要怎么改？？？
                                resolveResult(p,result,reso,reje) //用这个handle函数来处理上个函数处理的结果
                            } catch (err) {
                                reje(err)
                            }
                        })
                    }) //等待的话那就先把使用者传进来的这些函数存起来放到resolve或者reject里执行
                    this.onRejectedCallbacks.push(() => {
                        queueMicrotask(() => {//如果不用微任务的话会报错‘ReferenceError: Cannot access 'p' before initialization’，所以把下面两行代码放到微任务里执行即可等待 p 完成初始化
                            try {
                                const result = onRejected(this.result) //用户传进来的这个onFulfilled如果是异步的话那我源码还要怎么改？？？
                                resolveResult(p,result,reso,reje) //用这个handle函数来处理上个函数处理的结果
                            } catch (err) {
                                reje(err)
                            }
                        })
                    })
                    break
            }
        })
        return p
    }

    /**根据回调函数的返回值 result 决定 promise2 的最终状态 */
    function resolveResult(promise, result, resolve, reject) {
        if (promise === result) throw new TypeError('chaining cycle detected for promise #<Promise>')
        
        if (result instanceof MyPromise) { //如果回调函数的返回值是Promise对象则根据跟对象的状态来设置then新生成的这个promise的状态，那怎么知道返回值的状态呢，那就把它then一下呗
            result.then(resolve, reject) 
        } else { //如果回调函数返回值不是promise对象则返回成功状态
            resolve(result) 
        }
    }
```



### catch&finally

```javascript
    /**其实就是只执行了then的onRejected */
    MyPromise.prototype.catch=function(onRejected) {
        return this.then(undefined,onRejected)
    }

    /**finally会将上一个promise的结果和 error 传递 ，.finally()方法的回调函数不接受任何的参数，也就是说你在.finally()函数中是没法知道Promise最终的状态是resolved还是rejected的，所以用静态方法resolve一下去保障一下cb的结果---没错，静态方法resolve就是给你做保障的*/
    MyPromise.prototype.finally=function(cb) { 
        return this.then(v => { //finally后面还可以.then .then 所以finally本质上就是一个then
            return MyPromise.resolve(cb()).then(()=> v)//!！注意这个then里的函数没有参数，返回去的上调用finanlly的那个promise的结果
        }, reason => {
            return MyPromise.resolve(cb()).then(()=>{throw reason}) ////!！注意这个then里的函数没有参数，返回去的上调用finanlly的那个promise的结果
        })
    }

```



### reject&resolve

这玩意同步执行

```javascript
//【MDN】Promise.resolve() 静态方法将给定的值转换为一个 Promise。如果该值本身就是一个 Promise，那么该 Promise 将被返回；如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；否则，返回的 Promise 将会以该值兑现。    
MyPromise.resolve=function(param) {
        //如果传入的是promise对象 则直接返回
        if (param instanceof MyPromise) return param //如果参数本身就是一个 Promise 对象，则直接返回这个 Promise 对象，所以有可能返回的是rejected的。
        return new MyPromise(resolve => { //如果是其他类型则返回一个resolve的promise对象
            resolve(param)
        })
    }

    MyPromise.reject=function(param) {
        //不管你是啥直接包一层promise对象返回
        return new MyPromise((resolve, reject) => {
            reject(param)
        })
    }
```





### promise.all

有一个场景是很适合用这个: 一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。

```javascript
    /**空数组或者全部resolve才返回resolve，只要有一个reject就reject */
MyPromise.all = function (promiseArr) { //promiseArr里的promise都是已经触发的
    let count = 0, result = []
    return new MyPromise((resolve, reject) => {//返回一个promise对象
        if(!promiseArr||typeof promiseArr[Symbol.iterator]!=='function') return reject('TypeError:object is not iterator')//promiseArr是一个可迭代对象
        const arr = Array.from(promiseArr) //promiseArr是一个可迭代对象，不一定是个数组
        if(arr.length===0) return resolve([])
        arr.forEach((item, i) => {
            //先执行一下resolve保证返回一个promise
            MyPromise.resolve(item).then(v => {
                result[i] = v //结果的顺序跟promiseArr的顺序要对应上
                count++
                  if (count === arr.length) {
                    resolve(result)
                }
            }, reason => {
                reject(reason)
            })
        })
    })
}
```



### Promise.any

```javascript
    /**跟all相反，空数组或者所有 Promise 都是 rejected，则返回状态是 rejected 的新 Promsie，且值为 AggregateError 的错误；只要有一个是 fulfilled 状态的，则返回第一个是 fulfilled 的新实例； */
MyPromise.any = function (promiseArr) {
    let rejectedCount = 0
    return new MyPromise((resolve, reject) => {
        if(!promiseArr||typeof promiseArr[Symbol.iterator]!=='function') return reject('TypeError:object is not iterator')//promiseArr是一个可迭代对象
        const arr = Array.from(promiseArr) //promiseArr是一个可迭代对象，不一定是个数组
        if(arr.length===0) return reject(new AggregateError('All promises were rejected'))
        arr.forEach(item => {
            MyPromise.resolve(item).then(v => {
                resolve(v)
            }, reason => {
                rejectedCount++
                if(rejectedCount===arr.length) reject(new AggregateError('All promises were rejected'))
            })
        })
    })
}

```





### Promise.race

race使用场景，比如我们可以用race给某个异步请求设置超时时间，并且在超时后执行相应的操作

```javascript
    /**把最先resolve或者reject的实例包装成promise并返回 */
MyPromise.race=function(promiseArr) {
    return new MyPromise((resolve, reject) => {
        if(!promiseArr||typeof promiseArr[Symbol.iterator]!=='function') return reject('TypeError:object is not iterator')//promiseArr是一个可迭代对象
        const arr = Array.from(promiseArr) //promiseArr是一个可迭代对象，不一定是个数组
        if(arr.length===0) return resolve(undefined)
        for (let i = 0; i < arr.length; i++){ //把所有都遍历一遍，最先的那个执行了resolve或reject之后，别的再执行这两个函数都是没用的
            MyPromise.resolve(arr[i]).then(v=>{
                resolve(v)
            }, reason => {
                reject(reason)
            })
        }
    })
}
```





### Promise.allSettled

```javascript
    /**所有 Promise 的状态都变化了，那么新返回一个状态是 fulfilled 的 Promise，且它的值是一个数组，数组的每项由所有 Promise 的值和状态组成的对象； */
MyPromise.allSettled = function (promiseArr) {
    const result = [] //不用保障顺序
    return new MyPromise((resolve,reject) => { 
        if(!promiseArr||typeof promiseArr[Symbol.iterator]!=='function') return reject('TypeError:object is not iterator')//promiseArr是一个可迭代对象
        const arr = Array.from(promiseArr) //promiseArr是一个可迭代对象，不一定是个数组
        if(arr.length===0) return resolve([])
        arr.forEach(item => {
            MyPromise.resolve(item).then(v => {
                result.push({
                    status:'fulfilled',
                    value:v
                })
                if(result.length === arr.length) resolve(result)
            }, reason => {
                result.push({
                    status: 'rejected',
                    value:reason
                })
                if(result.length === arr.length) resolve(result)
            })
        })
    })
}
```









## async&await

### 为啥要引入async&await

then写多了也是麻烦

用同步的方式去写异步代码



### 介绍

<font color="red">紧跟着await后面的语句相当于放到了new Promise中立即执行。await 的左边 和 下一行及之后的语句相当于放在Promise.then中。</font>

如果await的是`rejected`的`promise` 或者 在async函数中抛出了错误，则抛出错误结果，不会继续向下执行。





### 手写async

```javascript
//搞一个promise异步函数
const getData = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('fuck')
        },1000)
    })
}

//async 和 await 的使用
// async function test(a) {
//     const data1 = await getData()
//     console.log(data1)
//     const data2 = await getData()
//     console.log(data2)
//     return a
// }
// test('success').then(v => {
//     console.log(v)
// })

/**手写async */
/*
第一步：
函数 转化成生成器函数
await 转化成yield

第二步：
async 返回一个函数，这个函数一经调用就会自动执行生成器函数并且返回一个promise
*/

/*第一步*/
function* test(a) {
    const data1 = yield getData()
    console.log(data1)
    const data2 = yield getData()
    console.log(data2)
    return a
}

//自己手动执行这个生成器
// const gen = test()
// const p1 = gen.next().value //next()返回的是一个对象{done:true, value:promise}
// p1.then(v => {
//     const p2 = gen.next(v).value
//     p2.then(v => {
//         const res = gen.next(v).value

//         console.log(res)
//     })
// })


/*第二步 */
function async(generatorFn, ...args) {
    return function () {        
        const gen = generatorFn.apply(this, args)
        return new Promise((resolve,reject) => {
            (function step(key,arg) { //key用于选择执行next还是throw, arg是传给下一步的参数
                let genCurResult //记录生成器目前的值
                try {
                    genCurResult = gen[key](arg)
                } catch (err) {
                    return reject(err) //出错了就得game over了
                }
                const { done, value } = genCurResult
                if (done) { //生成器执行完了
                    return resolve(value) //把生成器函数的返回值resolve回去,返回值不可能是异步的，但是每次yield返回是异步的promise对象 , return是为了尾递归提高性能
                } else { //没执行完就得继续next
                    return Promise.resolve(value).then(v => { // resolve一下以防你的value不是promise
                        //！注意：下一步是放在then里面的，也就是说‘执行下一步’是一个微任务
                        step('next',v) //前一个promise返回的成功那就继续next
                    }, reason => {
                        step('throw',reason) //前一个promise返回的失败那就把错误丢出来
                    })
                }
            })('next') //第一次执行next是立即执行且同步的
        })
    }
}

//使用
const asyncFn = async(test, 'success')
asyncFn().then(v => {
    console.log(v)
})
```







### async 错误捕获

因为reject就会抛出错误，所以要在await外层套一层try catch捕获错误。

尽管我们可以使用 try catch 捕获错误，但是当我们需要捕获多个错误并做不同的处理时，很快 try catch 就会导致代码杂乱，就比如：

```javascript
async function asyncTask(cb) {
    try {
       const user = await UserModel.findById(1);
       if(!user) return cb('No user found');
    } catch(e) {
        return cb('Unexpected error occurred');
    }

    try {
       const savedTask = await TaskModel({userId: user.id, name: 'Demo Task'});
    } catch(e) {
        return cb('Error occurred while saving task');
    }

    if(user.notificationsEnabled) {
        try {
            await NotificationService.sendNotification(user.id, 'Task Created');
        } catch(e) {
            return cb('Error while sending notification');
        }
    }

    if(savedTask.assignedUser.id !== user.id) {
        try {
            await NotificationService.sendNotification(savedTask.assignedUser.id, 'Task was created for you');
        } catch(e) {
            return cb('Error while sending notification');
        }
    }

    cb(null, savedTask);
}
```

为了简化这种错误的捕获，我们可以给 await 后的 promise 对象添加then 和 catch 函数，为此我们需要写一个promiseErrorHelper:

```javascript
// promiseErrorHelper.js
function promiseErrorHelper(promise) {
   return promise.then(data => [null, data]).catch(err => [err]);
}
```

整个错误捕获的代码就可以简化为：

```javascript
async function asyncTask() {
     let err, user, savedTask;

     [err, user] = await promiseErrorHelper(UserModel.findById(1));
     if(!user) throw new CustomerError('No user found');

     [err, savedTask] = await promiseErrorHelper(TaskModel({userId: user.id, name: 'Demo Task'}));
     if(err) throw new CustomError('Error occurred while saving task');

    if(user.notificationsEnabled) {
       const [err] = await promiseErrorHelper(NotificationService.sendNotification(user.id, 'Task Created'));
       if (err) console.error('Just log the error and continue flow');
    }
}
```







## 继发与并发

**问题：给定一个 URL 数组，如何实现接口的继发和并发？**

async 继发实现：

```javascript
// 继发一
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}
// 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

async 并发实现：

```javascript
// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}
// 并发二
async function loadData(urls) {
  // 并发读取 url
  const textPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });

  // 按次序输出
  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

## 错误处理

try/catch 只能捕获同步错误，==async/await 的出现使得 try/catch 就可以捕获同步和异步的错误。==

```javascript
function fetch() {
  try {
    fetchData()
      .then(result => {
        const data = JSON.parse(result)
      })
      .catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.log(err)
  }
}
```

在这段代码中，try/catch 能捕获 fetchData() 中的一些 Promise 构造错误，但是不能捕获 JSON.parse 抛出的异常，如果要处理 JSON.parse 抛出的异常，需要添加 catch 函数重复一遍异常处理的逻辑。

在实际项目中，错误处理逻辑可能会很复杂，这会导致冗余的代码。

```javascript
async function fetch() {
  try {
    const data = JSON.parse(await fetchData())
  } catch (err) {
    console.log(err)
  }
};
```









## 网络请求

### 对AJAX的理解，实现一个AJAX请求

AJAX是 Asynchronous JavaScript and XML 的缩写，指的是通过 JavaScript 的 异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。尽管X在Ajax中代表XML, 但由于[JSON](https://developer.mozilla.org/zh-CN/docs/Glossary/JSON)的许多优势，比如更加轻量以及作为Javascript的一部分，目前JSON的使用比XML更加普遍。JSON和XML都被用于在Ajax模型中打包信息。其本身不是一种新技术，而是用来描述一种使用现有技术集合的‘新’方法，包括: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) 或 [XHTML](https://developer.mozilla.org/en-US/docs/Glossary/XHTML),  [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model), [XML](https://developer.mozilla.org/en-US/docs/Web/XML), [XSLT](https://developer.mozilla.org/en-US/docs/Web/XSLT), 以及最重要的 [`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)。

```javascript
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", url, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);
```

```javascript
// promise 封装实现：
function getJSON(url) {
  // 创建一个 promise 对象
  let promise = new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    // 新建一个 http 请求
    xhr.open("GET", url, true);
    // 设置状态的监听函数
    xhr.onreadystatechange = function() {
      if (this.readyState !== 4) return;
      // 当请求成功或失败时，改变 promise 的状态
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    // 设置错误监听函数
    xhr.onerror = function() {
      reject(new Error(this.statusText));
    };
    // 设置响应的数据类型
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送 http 请求
    xhr.send(null);
  });
  return promise;
}
```





### fetch

#### 与XMLHttpRequest区别

`fetch()`的功能与 XMLHttpRequest 基本相同，但有三个主要的差异。

（1）`fetch()`使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。

（2）`fetch()`采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。

（3）`fetch()`通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来。

（4）不能设置超时时间。

（5）XMLHttpRequest（XHR）的设计混乱——输入、输出和使用事件来跟踪的状态混杂在一个对象里。





#### fetch参数

##### 介绍

只放第一个参数url时fetch默认用GET方法，还可以配置器第二个参数对象：

```scss
fetch(url, optionObj)
```

具体第二个参数对象内容见下，星号为默认设置：

```js
fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // * `Content-Type`的默认值是`'text/plain;charset=UTF-8'`。
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
```





##### 示例

###### **（1）POST 请求**

> ```javascript
> const response = await fetch(url, {
> method: 'POST',
> headers: {
>  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
> },
> body: 'foo=bar&lorem=ipsum',
> });
> 
> const json = await response.json();
> ```



###### **（2）提交 JSON 数据**

> ```javascript
> const user =  { name:  'John', surname:  'Smith'  };
> const response = await fetch('/article/fetch/post/user', {
> method: 'POST',
> headers: {
> 'Content-Type': 'application/json;charset=utf-8'
> }, 
> body: JSON.stringify(user) 
> });
> ```



###### **（3）提交表单**

> ```javascript
> const form = document.querySelector('form');
> 
> const response = await fetch('/users', {
> method: 'POST',
> body: new FormData(form)
> })
> ```

###### **（4）文件上传**

如果表单里面有文件选择器，可以用前一个例子的写法，上传的文件包含在整个表单里面，一起提交。

另一种方法是用脚本添加文件，构造出一个表单，进行上传，请看下面的例子。

> ```javascript
> const input = document.querySelector('input[type="file"]');
> 
> const data = new FormData();
> data.append('file', input.files[0]);
> data.append('user', 'foo');
> 
> fetch('/avatars', {
> method: 'POST',
> body: data
> });
> ```



###### **（5）直接上传二进制数据**

`fetch()`也可以直接上传二进制数据，将 Blob 或 arrayBuffer 数据放在`body`属性里面。 上传二进制文件时，不用修改标头的`Content-Type`，浏览器会自动设置。

> ```javascript
> let blob = await new Promise(resolve =>   
> canvasElem.toBlob(resolve,  'image/png')
> );
> 
> let response = await fetch('/article/fetch/post/image', {
> method:  'POST',
> body: blob
> });
> ```





##### `fetch()`请求配置对象的完整 API介绍

`fetch()`请求的底层用的是 [Request() 对象](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)的接口，参数完全一样，因此上面的 API 也是`Request()`的 API。

`headers`、`body`、`method`前面已经给过示例了，下面是其他属性的介绍。

###### **cache**

`cache`属性指定如何处理缓存。可能的取值如下：

> - `default`：默认值，先在缓存里面寻找匹配的请求。
> - `no-store`：直接请求远程服务器，并且不更新缓存。
> - `reload`：直接请求远程服务器，并且更新缓存。
> - `no-cache`：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存。
> - `force-cache`：缓存优先，只有不存在缓存的情况下，才请求远程服务器。
> - `only-if-cached`：只检查缓存，如果缓存里面不存在，将返回504错误。

###### **mode** 设定跨域模式

`mode`属性指定请求的模式。可能的取值如下：

> - `cors`：默认值，允许跨域请求，如果服务器允许这个域则能正常响应，如果不允许这个域则会响应失败（浏览器导致的拦截）。cors的目的是为了将跨域逻辑后移，让服务器决定谁能跨域。
> - `same-origin`：请求在发送时就被阻止了，服务器端并未收到该请求。
> - `no-cors`：请求是单向的，服务器能接收到但是服务器响应空数据。请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，类似于**表单提交**

###### **credentials**

`credentials`属性指定是否发送 Cookie。可能的取值如下：

> - `same-origin`：默认值，同源请求时发送 Cookie，跨域请求时不发送。
> - `include`：不管同源请求，还是跨域请求，一律发送 Cookie。
> - `omit`：一律不发送。

跨域请求发送 Cookie，需要将`credentials`属性设为`include`。

> ```javascript
> fetch('http://another.com', {
> credentials: "include"
> });
> ```

###### **signal**

`signal`属性指定一个 AbortSignal 实例，用于取消`fetch()`请求，详见下一节。

###### **keepalive**

`keepalive`属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据。

一个典型的场景就是，用户离开网页时，脚本向服务器提交一些用户行为的统计信息。这时，如果不用`keepalive`属性，数据可能无法发送，因为浏览器已经把页面卸载了。

> ```javascript
> window.onunload = function() {
> fetch('/analytics', {
>  method: 'POST',
>  body: "statistics",
>  keepalive: true
> });
> };
> ```

###### **redirect**

`redirect`属性指定 HTTP 跳转的处理方法。可能的取值如下：

> - `follow`：默认值，`fetch()`跟随 HTTP 跳转。
> - `error`：如果发生跳转，`fetch()`就报错。
> - `manual`：`fetch()`不跟随 HTTP 跳转，但是`response.url`属性会指向新的 URL，`response.redirected`属性会变为`true`，由开发者自己决定后续如何处理跳转。

###### **integrity**

`integrity`属性指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值。

比如，下载文件时，检查文件的 SHA-256 哈希值是否相符，确保没有被篡改。

> ```javascript
> fetch('http://site.com/file', {
> integrity: 'sha256-abcdef'
> });
> ```



###### **referrer**

`referrer`属性用于设定`fetch()`请求的`referer`标头。

这个属性可以为任意字符串，也可以设为空字符串（即不发送`referer`标头）。

> ```javascript
> fetch('/page', {
> referrer: ''
> });
> ```



###### **referrerPolicy**

`referrerPolicy`属性用于设定`Referer`标头的规则。可能的取值如下：

> - `no-referrer-when-downgrade`：默认值，总是发送`Referer`标头，除非从 HTTPS 页面请求 HTTP 资源时不发送。
> - `no-referrer`：不发送`Referer`标头。
> - `origin`：`Referer`标头只包含域名，不包含完整的路径。
> - `origin-when-cross-origin`：同源请求`Referer`标头包含完整的路径，跨域请求只包含域名。
> - `same-origin`：跨域请求不发送`Referer`，同源请求发送。
> - `strict-origin`：`Referer`标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送`Referer`标头。
> - `strict-origin-when-cross-origin`：同源请求时`Referer`标头包含完整路径，跨域请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头。
> - `unsafe-url`：不管什么情况，总是发送`Referer`标头。





#### Response 对象：处理 HTTP 回应

##### Response 对象的同步属性

`fetch()`请求成功以后，得到的是一个 [Response 对象](https://developer.mozilla.org/en-US/docs/Web/API/Response)。它对应服务器的 HTTP 回应。

> ```javascript
> const response = await fetch(url);
> ```

`fetch()`接收到的`response`是一个 [Stream 对象](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)，Response 包含的数据通过 Stream 接口异步读取，但是它还包含一些同步属性对应 HTTP 回应的标头信息（Headers），可以立即读取。

> ```javascript
> async function fetchText() {
>   let response = await fetch('/readme.txt');
>   console.log(response.status); 
>   console.log(response.statusText);
> }
> ```

标头信息属性有下面这些。

**Response.ok**

`Response.ok`属性返回一个布尔值，表示请求是否成功，`true`对应 HTTP 请求的状态码 200 到 299，`false`对应其他的状态码。

**Response.status**

`Response.status`属性返回一个数字，表示 HTTP 回应的状态码（例如200，表示成功请求）。

**Response.statusText**

`Response.statusText`属性返回一个字符串，表示 HTTP 回应的状态信息（例如请求成功以后，服务器返回"OK"）。

**Response.url**

`Response.url`属性返回请求的 URL。如果 URL 存在跳转，该属性返回的是最终 URL。

**Response.type**

`Response.type`属性返回请求的类型。可能的值如下：

> - `basic`：普通请求，即同源请求。
> - `cors`：跨域请求。
> - `error`：网络错误，主要用于 Service Worker。
> - `opaque`：如果`fetch()`请求的`type`属性设为`no-cors`，就会返回这个值，详见请求部分。表示发出的是简单的跨域请求，类似`<form>`表单的那种跨域请求。
> - `opaqueredirect`：如果`fetch()`请求的`redirect`属性设为`manual`，就会返回这个值，详见请求部分。

**Response.redirected**

`Response.redirected`属性返回一个布尔值，表示请求是否发生过跳转。





##### 判断请求是否成功

`fetch()`发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，`fetch()`才会报错，其他情况都不会报错，而是认为请求成功。即使服务器返回的状态码是 4xx 或 5xx，`fetch()`也不会报错（即 Promise 不会变为 `rejected`状态）。

只有通过`Response.status`属性，得到 HTTP 回应的真实状态码，才能判断请求是否成功。请看下面的例子。

> ```javascript
> async function fetchText() {
>   let response = await fetch('/readme.txt');
>   if (response.status >= 200 && response.status < 300) {
>     return await response.text();
>   } else {
>     throw new Error(response.statusText);
>   }
> }
> ```

上面示例中，`response.status`属性只有等于 2xx （200~299），才能认定请求成功。这里不用考虑网址跳转（状态码为 3xx），因为`fetch()`会将跳转的状态码自动转为 200。

另一种方法是判断`response.ok`是否为`true`。

> ```javascript
> if (response.ok) {
>   // 请求成功
> } else {
>   // 请求失败
> }
> ```

##### Response.headers 属性

Response 对象还有一个`Response.headers`属性，指向一个 [Headers 对象](https://developer.mozilla.org/en-US/docs/Web/API/Headers)，对应 HTTP 回应的所有标头。

Headers 对象可以使用`for...of`循环进行遍历。

> ```javascript
> const response = await fetch(url);
> 
> for (let [key, value] of response.headers) { 
>   console.log(`${key} : ${value}`);  
> }
> 
> // 或者
> for (let [key, value] of response.headers.entries()) { 
>   console.log(`${key} : ${value}`);  
> }
> ```

Headers 对象提供了以下方法，用来操作标头。

> - `Headers.get()`：根据指定的键名，返回键值。
> - `Headers.has()`： 返回一个布尔值，表示是否包含某个标头。
> - `Headers.set()`：将指定的键名设置为新的键值，如果该键名不存在则会添加。
> - `Headers.append()`：添加标头。
> - `Headers.delete()`：删除标头。
> - `Headers.keys()`：返回一个遍历器，可以依次遍历所有键名。
> - `Headers.values()`：返回一个遍历器，可以依次遍历所有键值。
> - `Headers.entries()`：返回一个遍历器，可以依次遍历所有键值对（`[key, value]`）。
> - `Headers.forEach()`：依次遍历标头，每个标头都会执行一次参数函数。

上面的有些方法可以修改标头，那是因为继承自 Headers 接口。对于 HTTP 回应来说，修改标头意义不大，很多标头是只读的，浏览器不允许修改。

这些方法中，最常用的是`response.headers.get()`，用于读取某个标头的值。

> ```javascript
> let response =  await  fetch(url);  
> response.headers.get('Content-Type')
> // application/json; charset=utf-8
> ```

`Headers.keys()`和`Headers.values()`方法用来分别遍历标头的键名和键值。

> ```javascript
> // 键名
> for(let key of myHeaders.keys()) {
>   console.log(key);
> }
> 
> // 键值
> for(let value of myHeaders.values()) {
>   console.log(value);
> }
> ```

`Headers.forEach()`方法也可以遍历所有的键值和键名。

> ```javascript
> let response = await fetch(url);
> response.headers.forEach(
>   (value, key) => console.log(key, ':', value)
> );
> ```

##### 读取内容的方法

`Response`对象根据服务器返回的不同类型的数据，提供了不同的读取方法。

> - `response.text()`：得到文本字符串。
> - `response.json()`：得到 JSON 对象。
> - `response.blob()`：得到二进制 Blob 对象。
> - `response.formData()`：得到 FormData 表单对象。
> - `response.arrayBuffer()`：得到二进制 ArrayBuffer 对象。

上面5个读取方法都是<font color="red">异步</font>的，返回的都是 Promise 对象。必须等到异步操作结束，才能得到服务器返回的完整数据。

**response.text()**

`response.text()`可以用于获取文本数据，比如 HTML 文件。

> ```javascript
> const response = await fetch('/users.html');
> const body = await response.text();
> document.body.innerHTML = body
> ```

**response.json()**

`response.json()`主要用于获取服务器返回的 JSON 数据，前面已经举过例子了。

**response.formData()**

`response.formData()`主要用在 Service Worker 里面，拦截用户提交的表单，修改某些数据以后，再提交给服务器。

**response.blob()**

`response.blob()`用于获取二进制文件。

> ```javascript
> const response = await fetch('flower.jpg');
> const myBlob = await response.blob();
> const objectURL = URL.createObjectURL(myBlob);
> 
> const myImage = document.querySelector('img');
> myImage.src = objectURL;
> ```

上面示例读取图片文件`flower.jpg`，显示在网页上。

**response.arrayBuffer()**

`response.arrayBuffer()`主要用于获取流媒体文件。

> ```javascript
> const audioCtx = new window.AudioContext();
> const source = audioCtx.createBufferSource();
> 
> const response = await fetch('song.ogg');
> const buffer = await response.arrayBuffer();
> 
> const decodeData = await audioCtx.decodeAudioData(buffer);
> source.buffer = buffer;
> source.connect(audioCtx.destination);
> source.loop = true;
> ```

上面示例是`response.arrayBuffer()`获取音频文件`song.ogg`，然后在线播放的例子。

**response.clone()**

Stream 对象只能读取一次，读取完就没了。这意味着，前一节的五个读取方法，只能使用一个，否则会报错。

> ```javascript
> let text =  await response.text();
> let json =  await response.json();  // 报错
> ```

上面示例先使用了`response.text()`，就把 Stream 读完了。后面再调用`response.json()`，就没有内容可读了，所以报错。

Response 对象提供`Response.clone()`方法，创建`Response`对象的副本，实现多次读取。

> ```javascript
> const response1 = await fetch('flowers.jpg');
> const response2 = response1.clone();
> 
> const myBlob1 = await response1.blob();
> const myBlob2 = await response2.blob();
> 
> image1.src = URL.createObjectURL(myBlob1);
> image2.src = URL.createObjectURL(myBlob2);
> ```

上面示例中，`response.clone()`复制了一份 Response 对象，然后将同一张图片读取了两次。



**Response.redirect()**

Response 对象还有一个`Response.redirect()`方法，用于将 Response 结果重定向到指定的 URL。该方法一般只用在 Service Worker 里面，这里就不介绍了。

##### Response.body 属性

`Response.body`属性是 Response 对象暴露出的底层接口，返回一个 ReadableStream 对象，供用户操作。

它可以用来分块读取内容，应用之一就是显示下载的进度。

> ```javascript
> const response = await fetch('flower.jpg');
> const reader = response.body.getReader();
> 
> while(true) {
>   const {done, value} = await reader.read();
> 
>   if (done) {
>     break;
>   }
> 
>   console.log(`Received ${value.length} bytes`)
> }
> ```

上面示例中，`response.body.getReader()`方法返回一个遍历器。这个遍历器的`read()`方法每次返回一个对象，表示本次读取的内容块。

这个对象的`done`属性是一个布尔值，用来判断有没有读完；`value`属性是一个 arrayBuffer 数组，表示内容块的内容，而`value.length`属性是当前块的大小。









#### 取消`fetch()`请求

`fetch()`请求发送以后，如果中途想要取消，需要使用`AbortController`对象。

> ```javascript
> let controller = new AbortController();
> let signal = controller.signal;
> 
> fetch(url, {
>   signal: controller.signal
> });
> 
> signal.addEventListener('abort',
>   () => console.log('abort!')
> );
> 
> controller.abort(); // 取消
> 
> console.log(signal.aborted); // true
> ```

上面示例中，首先新建 AbortController 实例，然后发送`fetch()`请求，配置对象的`signal`属性必须指定接收 AbortController 实例发送的信号`controller.signal`。

`controller.abort()`方法用于发出取消信号。这时会触发`abort`事件，这个事件可以监听，也可以通过`controller.signal.aborted`属性判断取消信号是否已经发出。

下面是一个1秒后自动取消请求的例子。

> ```javascript
> let controller = new AbortController();
> setTimeout(() => controller.abort(), 1000);
> 
> try {
>   let response = await fetch('/long-operation', {
>     signal: controller.signal
>   });
> } catch(err) {
>   if (err.name == 'AbortError') {
>     console.log('Aborted!');
>   } else {
>     throw err;
>   }
> }
> ```





#### 封装一个fetch请求库的例子

```js
/*对外使用方式：
 http([config])
   + url 请求地址
   + method 请求方式  *GET/DELETE/HEAD/OPTIONS/POST/PUT/PATCH
   + credentials 携带资源凭证  *include/same-origin/omit
   + headers:null 自定义的请求头信息「格式必须是纯粹对象」
   + body:null 请求主体信息「只针对于POST系列请求，根据当前服务器要求，如果用户传递的是一个纯粹对象，我们需要把其变为urlencoded格式字符串(设定请求头中的Content-Type)...」
   + params:null 设定问号传参信息「格式必须是纯粹对象，我们在内部把其拼接到url的末尾」
   + responseType 预设服务器返回结果的读取方式  *json/text/arrayBuffer/blob
   + signal 中断请求的信号
 -----
 快捷使用方法：
 http.get/head/delete/options([url],[config])  预先指定了配置项中的url/method
 http.post/put/patch([url],[body],[config])  预先指定了配置项中的url/method/body
 */

import _ from '../assets/utils';
import qs from 'qs';
import { message } from 'antd';

/* 核心方法 */
const http = function http(config) {
  // initial config & validate 「扩展：回去后，可以尝试对每一个配置项都做校验?」
  if (!_.isPlainObject(config)) config = {};
  config = Object.assign({
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: null,
    body: null,
    params: null,
    responseType: 'json',
    signal: null
  }, config);
  if (!config.url) throw new TypeError('url must be required');
  if (!_.isPlainObject(config.headers)) config.headers = {};
  if (config.params !== null && !_.isPlainObject(config.params)) config.params = null;

  let { url, method, credentials, headers, body, params, responseType, signal } = config;
  // 处理问号传参
  if (params) {
    url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`;
  }

  // 处理请求主体信息：按照我们后台要求，如果传递的是一个普通对象，我们要把其设置为urlencoded格式「设置请求头」？
  if (_.isPlainObject(body)) {
    body = qs.stringify(body);
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  // 类似于axios中的请求拦截器：每一个请求，递给服务器相同的内容可以在这里处理「例如：token」
  let token = localStorage.getItem('tk');
  if (token) headers['authorization'] = token;

  // 发送请求
  method = method.toUpperCase();
  config = {
    method,
    credentials,
    headers,
    cache: 'no-cache',
    signal
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;
  return fetch(url, config)
    .then(response => {
      let { status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        // 请求成功:根据预设的方式，获取需要的值
        let result;
        switch (responseType.toLowerCase()) {
          case 'text':
            result = response.text();
            break;
          case 'arraybuffer':
            result = response.arrayBuffer();
            break;
          case 'blob':
            result = response.blob();
            break;
          default:
            result = response.json();
        }
        return result;
      }
      // 请求失败：HTTP状态码失败
      return Promise.reject({
        code: -100,
        status,
        statusText
      });
    })
    .catch(reason => {
      // 失败的统一提示
      message.error('当前网络繁忙，请您稍后再试~');
      return Promise.reject(reason); //统一处理完提示后，在组件中获取到的依然还是失败
    });
};

/* 快捷方法 */
["GET", "HEAD", "DELETE", "OPTIONS"].forEach(item => {
  http[item.toLowerCase()] = function (url, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    return http(config);
  };
});
["POST", "PUT", "PATCH"].forEach(item => {
  http[item.toLowerCase()] = function (url, body, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    config['body'] = body;
    return http(config);
  };
});

export default http;
```







## 面试问题

### promise

#### 输出

```javascript
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })

/* 结果
"catch: " "error"
"then3: " undefined
*/
```



[参考](https://juejin.cn/post/6844904077537574919#heading-26)

```javascript
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })

/*
'1'
'finally2'
'finally'
'finally2后面的then函数' '2'
*/
```



[参考](https://juejin.cn/post/6844904077537574919#heading-29)

```javascript
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))

/*
// 1s后输出
1
3
// 2s后输出
2
Error: 2
// 4s后输出
4
*/
```



[参考](https://juejin.cn/post/6844904077537574919#heading-49)

```javascript
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)
  setTimeout(() => {
    console.log(p1)
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})

/*
'resolve1'
'finally' undefined
'timer1'
Promise{<resolved>: undefined}
*/
```





#### 使用Promise实现每隔1秒输出1,2,3

```javascript
const arr = [1, 2, 3]
arr.reduce((pre, cur) => {
    return pre.then(v => {
        //返回的这个promise的状态和值就会是上面这个then的状态和值
        return new Promise(resolve => { // 为了使输出了上一个值之后等1s再输出下一个值
            setTimeout(() => {
                console.log(cur)
                resolve() //只有resolve了才会继续往后then
            }, 1000)
        })
    })
},Promise.resolve())
```





#### 实现mergePromise函数

这道题有点类似于`Promise.all()`，不过`.all()`不需要管执行顺序，只需要并发执行就行了。但是这里需要等上一个执行完毕之后才能执行下一个。

```javascript
const time = (timer) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
const ajax1 = () => time(2000).then(() => {
  console.log(1);
  return 1
})
const ajax2 = () => time(1000).then(() => {
  console.log(2);
  return 2
})
const ajax3 = () => time(1000).then(() => {
  console.log(3);
  return 3
})

function mergePromise () {
  // 在这里写代码
}
//写了如下：
function mergePromise(promiseArr) {
    return new Promise(resolve => {
        const result = []
        promiseArr.reduce((pre, cur) => {
            return pre.then(v => cur()).then(v => {//// 第一次的then为了用来调用cur，第二次的then是为了获取cur的结果
                result.push(v)
                if(result.length===promiseArr.length) resolve(result)
            })
        },Promise.resolve())
    })
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});
```



#### 封装一个异步加载图片的方法

```javascript
function promiseLoadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            reject(new Error('Could not load image at' + url))
        }
        img.src=url
    })
}
```





### async&await

#### 输出

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log('start')

/*
'async1 start'
'async2'
'start'
'async1 end'
*/
```

```javascript
async function testSometing() {
  console.log("执行testSometing");
  return "testSometing";
}

async function testAsync() {
  console.log("执行testAsync");
  return Promise.resolve("hello async");
}

async function test() {
  console.log("test start...");
  const v1 = await testSometing();
  console.log(v1);
  const v2 = await testAsync();
  console.log(v2);
  console.log(v1, v2);
}

test();

var promise = new Promise(resolve => {
  console.log("promise start...");
  resolve("promise");
});
promise.then(val => console.log(val));

console.log("test end...");

/*
'test start...'
'执行testSometing'
'promise start...'
'test end...'
'testSometing'
'执行testAsync'
'promise'
'hello async'
'testSometing' 'hello async'
*/
```



[参考](https://juejin.cn/post/6844904077537574919#heading-48)

```javascript
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)

/*
'script start'
'async1'
'promise1'
'script end'
1
'timer2'
'timer1'
*/
```







### 红绿灯问题

红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promse 实现）

```javascript
//红绿灯
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}

function light(originalFn, wait) {
    return new Promise((resolve, reject) => {
        setTimeout(
            function () { 
                originalFn()
                resolve()
            },wait)
    })
}

(function main() {
    light(red, 3000).then(
        function () { 
            return light(yellow, 2000)
        }
    ).then(
        function () {
            light(green, 1000)
        }
    ).then(main)
})()
```





### 实现node里promisify

callback 语法传参比较明确，最后一个参数传入回调函数，回调函数的第一个参数是一个错误信息，如果没有错误，就是 null

```javascript
//node中的util.promisify() 该方法将基于回调的函数转换为基于 Promise 的函数
function promisify(originalFn) {
    if (typeof originalFn !== "function") {
        throw new TypeError("Argument to promisify must be a function");
    }
    return function (...args) {
        return new Promise((resolve,reject) => {
            originalFn.call(this, ...args, function (err, ...values) { 
                if (err) return reject(err)
                return resolve(...values)
            })
        })
    }
}

//测试
// 将 fs.readFile() 转换为一个接受相同参数但返回 Promise 的函数。
const fs = require('fs')
const path = require('path')
const readFile = promisify(fs.readFile)
const p = path.resolve(__dirname,'call.js')
readFile(p).then(buf => {
    const res = buf.toString('utf8')
console.log(res)
})
```



### 并发调度器

```javascript
/* 并发调度--并发数量限制 --async-pool这个库的实现方法 */
/*
* poolLimit（数字类型）：表示限制的并发数；
* array（数组类型）：表示任务数组；
* iteratorFn（函数类型）：把每个任务处理成一个会返回一个 Promise 对象或异步函数 的函数。
*/
async function asyncPool<T>(poolLimit: number, array: T[], promiseFn: (item: T, arr?: T[]) => Promise<unknown>) {
	const ret: Promise<unknown>[] = [] // 存储所有的异步任务
	const executing: Promise<unknown>[] = [] // 存储正在执行的异步任务
	for (const item of array) {
		const p: Promise<unknown> = Promise.resolve().then(() => promiseFn(item, array)) // 前面Promise.resolve().then()是为了把任务放到异步队列里（任务还没有被执行）
		ret.push(p) // 保存新的异步任务,p必须是个promise对象，因为下面要进行.then()操作

		
		if (poolLimit <= array.length) { // 当poolLimit值小于或等于总任务个数时，进行并发控制
			// 当任务成功完成后，从正在异步队列的任务数组中移除已完成的任务
			const e: Promise<unknown> = p.then(() => executing.splice(executing.indexOf(e), 1)) // then里面的函数会被放到异步队列排队等待执行
			executing.push(e) // 保存 正在异步任务队列 里的异步任务
			if (executing.length >= poolLimit) { // 正在任务队列 里的异步任务数量多于限制时 就等待 队列里的先完成
				await Promise.race(executing) // 等待较快的任务执行成完成 再往下循环（如果await的是`rejected`的`promise` 或者 在async函数中抛出了错误，则抛出错误结果，不会继续向下执行）
			}
		}
	}
	return Promise.all(ret) // 最后执行到这肯定只剩小于poolLimit个数的promise请求
}

/*调用*/
asyncPool(
	5,
	intersectingChartsArr, //（*）
	item =>
		new Promise((resolve, reject) => {
			try {
				resolve(item.value.initChart()) //（*）
			} catch (error) {
				reject(error)
			}
		}),
)
```

```javascript
class Scheduler {
    constructor(maxNum) {
        this.executing = []
        this.pending = []
        this.maxNum = maxNum
    }
    add(promiseCreator) {
        if (this.executing.length === this.maxNum) {
            return new Promise(resolve => {
                this.pending.push(() => { //执行中的数量已达上限就先把它存起来
                    this.execute(promiseCreator, resolve)
                })
            })
        } else {
            return new Promise(resolve => {
                this.execute(promiseCreator, resolve) //执行它
            })
        }
    }
    execute(promiseCreator, resolve) {
        this.executing.push(promiseCreator)
        promiseCreator().then(() => {
            resolve()
            this.executing = this.executing.filter((item) => item !== promiseCreator)
            if (this.pending.length) { //如果还有没执行的就让他执行
                this.pending.shift()()
            }
        })
    }
}
const timeout = (time) => new Promise(resolve => {
	setTimeout(resolve, time)
})

const scheduler = new Scheduler(2)

const addTask = (time, order) => {
	scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(400, 4) 
addTask(200, 2) 
addTask(300, 3) 
addTask(100, 1) 
```







# [模块加载](https://mp.weixin.qq.com/s/JSlJn_LzbkAOy6LNyY5_jQ)

## 无模块化标准阶段

#### 1. 文件划分

文件划分方式是最原始的模块化实现，简单来说就是将应用的状态和逻辑分散到不同的文件中，然后通过 HTML 中的 script 来一一引入。下面是一个通过`文件划分`实现模块化的具体例子:

```ts
// module-a.js
let data = "data";
// module-b.js
function method() {
  console.log("execute method");
}
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      console.log(data);
      method();
    </script>
  </body>
</html>
```

从中可以看到`module-a`和`module-b`为两个不同的模块，通过两个 script 标签分别引入到 HTML 中，这么做看似是分散了不同模块的状态和运行逻辑，但实际上也隐藏着一些风险因素:

1. 模块变量相当于在全局声明和定义，会有变量名冲突的问题。比如 `module-b` 可能也存在`data`变量，这就会与 `module-a` 中的变量冲突。
2. 由于变量都在全局定义，我们很难知道某个变量到底属于哪些模块，因此也给调试带来了困难。
3. 无法清晰地管理模块之间的依赖关系和加载顺序。假如`module-a`依赖`module-b`，那么上述 HTML 的 script 执行顺序需要手动调整，不然可能会产生运行时错误。

#### 2. 命名空间

`命名空间`是模块化的另一种实现手段，它可以解决上述文件划分方式中`全局变量定义`所带来的一系列问题。下面是一个简单的例子:

```ts
// module-a.js
window.moduleA = {
  data: "moduleA",
  method: function () {
    console.log("execute A's method");
  },
};
// module-b.js
window.moduleB = {
  data: "moduleB",
  method: function () {
    console.log("execute B's method");
  },
};
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```

这样一来，每个变量都有自己专属的命名空间，我们可以清楚地知道某个变量到底属于哪个`模块`，同时也避免全局变量命名的问题。

#### 3. IIFE(立即执行函数)

不过，相比于`命名空间`的模块化手段，`IIFE`实现的模块化安全性要更高，对于模块作用域的区分更加彻底。你可以参考如下`IIFE 实现模块化`的例子:

```ts
// module-a.js
(function () {
  let data = "moduleA";

  function method() {
    console.log(data + "execute");
  }

  window.moduleA = {
    method: method,
  };
})();
// module-b.js
(function () {
  let data = "moduleB";

  function method() {
    console.log(data + "execute");
  }

  window.moduleB = {
    method: method,
  };
})();
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```

我们知道，每个`IIFE` 即`立即执行函数`都会创建一个私有的作用域，在私有作用域中的变量外界是无法访问的，只有模块内部的方法才能访问。拿上述的`module-a`来说:

```ts
// module-a.js
(function () {
  let data = "moduleA";

  function method() {
    console.log(data + "execute");
  }

  window.moduleA = {
    method: method,
  };
})();
```

对于其中的 `data`变量，我们只能在模块内部的 `method` 函数中通过闭包访问，而在其它模块中无法直接访问。这就是模块`私有成员`功能，避免模块私有成员被其他模块非法篡改，相比于`命名空间`的实现方式更加安全。

但实际上，无论是`命名空间`还是`IIFE`，都是为了解决全局变量所带来的命名冲突及作用域不明确的问题，也就是在`文件划分方式`中所总结的`问题 1` 和`问题 2`，而并没有真正解决另外一个问题——**模块加载**。如果模块间存在依赖关系，那么 script 标签的加载顺序就需要受到严格的控制，一旦顺序不对，则很有可能产生运行时 Bug。



## CommonJS





### 不适合浏览器

CommonJS 是业界最早正式提出的 JavaScript 模块规范，主要用于服务端。

1. 模块加载器由 Node.js 提供，依赖了 Node.js 本身的功能实现，比如文件系统，如果 CommonJS 模块直接放到浏览器中是无法执行的。当然, 业界也产生了 [browserify](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbrowserify%2Fbrowserify) 这种打包工具来支持打包 CommonJS 模块，从而顺利在浏览器中执行，相当于社区实现了一个第三方的 loader。
2. CommonJS 本身约定以**同步**的方式进行模块加载，这种加载机制放在服务端是没问题的，一来模块都在本地，不需要进行网络 IO，二来只有服务启动时才会加载模块，而服务通常启动后会一直运行，所以对服务的性能并没有太大的影响。但如果这种加载机制放到浏览器端，会带来明显的性能问题。它会产生大量同步的模块请求，浏览器要等待响应返回后才能继续解析模块。也就是说，**模块请求会造成浏览器 JS 解析过程的阻塞**，导致页面加载速度缓慢。







### 原理

对 CommonJS 而言，一方面它定义了一套完整的模块化代码规范，另一方面 Node.js 为之实现了自动加载模块的`loader`

对于 CommonJS 模块规范本身，我举一个使用 CommonJS 的简单例子:

```ts
// module-a.js
var data = "hello world";
function getData() {
  return data;
}
module.exports = {
  getData,
};

// index.js
const { getData } = require("./module-a.js");
console.log(getData());
```

代码中使用 `require` 来导入一个模块，用`module.exports`来导出一个模块。实际上 Node.js 内部会有相应的 loader 转译模块代码，最后模块代码会被处理成下面这样:

```ts
(function (exports, require, module, __filename, __dirname) {
  // 执行模块代码
  // 返回 exports 对象
});
```



#### CommonJS

完全符合CommonJS规范的包目录应该包含如下这些文件。

 package.json：包描述文件。

 bin：用于存放可执行二进制文件的目录。

 lib：用于存放JavaScript代码的目录。

 doc：用于存放文档的目录。

 test：用于存放单元测试用例的代码







### exports 导出

exports和module.exports就理解成是一个对象，虽然两者指向同一块内存，但最后被导出的是module.exports，所以不能赋值给exports。

### require 导入

CommonJS 模块输出的是一个值的拷贝（就是把导出值复制一份，放到一块新的内存中）

CommonJS通过 ==模块缓存== 来解决循环引用和多次引入问题：每一个模块都先加入缓存再执行，每次遇到require都先检查缓存，发现已经有缓存，则直接读取该模块导出的东西，不会再去执行一次。

循环引用举例：

```javascript
//index.js
var a = require('./a')
console.log('入口模块引用a模块：',a)

// a.js
exports.a = '原始值-a模块内变量'
var b = require('./b')
console.log('a模块引用b模块：',b)
exports.a = '修改值-a模块内变量'

// b.js
exports.b ='原始值-b模块内变量'
var a = require('./a')
console.log('b模块引用a模块',a)
exports.b = '修改值-b模块内变量'
```

输出结果如下：

![](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTauZyNibViayh0lqUsQFhibMibwxHT8cmhOWsfIpiazGic1NfNYmntrVLtRiakAluMjdzpy6ibIAib09u28BXxUg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



多次引入举例：

```javascript
//index.js
var a = require('./a')
var b= require('./b')

// a.js
module.exports.a = '原始值-a模块内变量'
console.log('a模块执行')
var c = require('./c')

// b.js
module.exports.b = '原始值-b模块内变量'
console.log('b模块执行')
var c = require('./c')

// c.js
module.exports.c = '原始值-c模块内变量'
console.log('c模块执行')
```

执行结果如下：

![](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTauZyNibViayh0lqUsQFhibMibwxHAHmsHT2TaHIAXKezpp20XBAGPrTahtEZx8W0QdVc2piacARuMt5EY3g/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)









## AMD 规范

`AMD`全称为`Asynchronous Module Definition`，即异步模块定义规范。模块根据这个规范，在浏览器环境中会被异步加载，而不会像 CommonJS 规范进行同步加载，也就不会产生同步请求导致的浏览器解析过程阻塞的问题了。我们先来看看这个模块规范是如何来使用的:

```ts
// main.js
define(["./print"], function (printModule) {
  printModule.print("main");
});

// print.js
define(function () {
  return {
    print: function (msg) {
      console.log("print " + msg);
    },
  };
});
```

在 AMD 规范当中，我们可以通过 define 去定义或加载一个模块，比如上面的 `main` 模块和`print`模块，如果模块需要导出一些成员需要通过在定义模块的函数中 return 出去(参考 `print` 模块)，如果当前模块依赖了一些其它的模块则可以通过 define 的第一个参数来声明依赖(参考`main`模块)，这样模块的代码执行之前浏览器会先**加载依赖模块**。

当然，你也可以使用 require 关键字来加载一个模块，如:

```ts
// module-a.js
require(["./print.js"], function (printModule) {
  printModule.print("module-a");
});
```

不过 require 与 define 的区别在于前者只能加载模块，而`不能定义一个模块`。

由于没有得到浏览器的原生支持，AMD 规范需要由第三方的 loader 来实现，最经典的就是 [requireJS](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frequirejs%2Frequirejs) 库了，它完整实现了 AMD 规范，至今仍然有不少项目在使用。

不过 AMD 规范使用起来稍显复杂，代码阅读和书写都比较困难。因此，这个规范并不能成为前端模块化的终极解决方案，仅仅是社区中提出的一个妥协性的方案。

同期出现的规范当中也有 CMD 规范，这个规范是由淘宝出品的`SeaJS`实现的，解决的问题和 AMD 一样。不过随着社区的不断发展，SeaJS 已经被`requireJS`兼容了。





##  `UMD` (Universal Module Definition)规范

其实它并不算一个新的规范，只是兼容 AMD 和 CommonJS 的一个模块化方案，可以同时运行在浏览器和 Node.js 环境。







## ES Module

### ES6 Module规范

ES6 Module的设计思想是尽量实现静态化，以便在编译时就能确定模块的依赖关系、输入和输出的变量。而CommonJS、AMD和CMD模块，都只能在运行时确定这些内容。

ES 模块只能通过 `http://` 协议工作（在浏览器中打开本地文件使用的是file://协议）

`ES6 Module` 也被称作 `ES Module`(或 `ESM`)， 是由 ECMAScript 官方提出的模块化规范。在现代浏览器中，如果在 HTML 中加入含有`type="module"`属性的 script 标签，那么浏览器会按照 ES Module 规范来进行依赖加载和模块解析

 Node.js从 `12.20` 版本开始[正式支持](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fesm.html%23modules-ecmascript-modules)原生 ES Module。也就是说，如今 ES Module 能够同时在浏览器与 Node.js 环境中执行，拥有天然的跨平台能力。

如果在 Node.js 环境中，你可以在`package.json`中声明`type: "module"`属性:

```ts
// package.json
{
  "type": "module"
}
```

然后 Node.js 便会默认以 ES Module 规范去解析模块:

```ts
node main.js
// 打印 a
```

顺便说一句，在 Node.js 中，即使是在 CommonJS 模块里面，也可以通过 `import` 方法顺利加载 ES 模块，如下所示:

```ts
async function func() {
  // 加载一个 ES 模块
  // 文件名后缀需要是 mjs
  const { a } = await import("./module-a.mjs");
  console.log(a);
}

func();

module.exports = {
  func,
};
```







### 语法

#### 按需导入、导出

```javascript
// index.mjs
import {propA, propB,propC, propD} from './a.mjs'

// a.mjs
const propA = 'a';
let propB = () => {console.log('b')};
var propC = 'c';

export { propA, propB, propC };
export const propD = 'd'
```



#### 默认导入、导出

export default语法实现默认导出，可以是一个函数、一个对象，或者仅一个常量。使用import导入时可以使用任意名称，

```javascript
// 导入函数
import anyName from './a.mjs'
export default function () {
    console.log(123)
}

// 导入对象
import anyName from './a.mjs'
export default {
  name:'niannian';
  location:'guangdong'
}

// 导入常量
import anyName from './a.mjs'
export default 1
```



#### 混合导入、导出

```javascript
// index.mjs
import anyName, { propA, propB, propC, propD } from './a.mjs'
console.log(anyName,propA,propB,propC,propD)

// a.mjs
const propA = 'a';
let propB = () => {console.log('b')};
var propC = 'c';
// 普通导出
export { propA, propB, propC };
export const propD = 'd'
// 默认导出
export default function sayHello() {
    console.log('hello')
}
```

#### 全部导入

```javascript
// index.mjs
import * as resName from './a.mjs'
console.log(resName)

// a.mjs
const propA = 'a';
let propB = () => {console.log('b')};
var propC = 'c';
// 普通导出
export { propA, propB, propC };
export const propD = 'd'
// 默认导出
export default function sayHello() {
    console.log('hello')
}
```

结果如下

![图片](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTauZyNibViayh0lqUsQFhibMibwxHdI6sC9v1ZYzZcBz3UItgmwiaaNa0JCYRCm2lFybG4EicZf7OKHRULS0Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



#### 重命名导入

```javascript
// index.mjs
import {  propA  as renameA,   propB as renameB, propC as renameC , propD as renameD } from './a.mjs'
const propA = 'a';
let propB = () => {console.log('b')};
var propC = 'c';

// a.mjs
export { propA, propB, propC };
export const propD = 'd'
```

#### 重定向导出

```javascript
//b.js
export * from './a.mjs' // 第一种
export { propA, propB, propC } from './a.mjs' // 第二种
export { propA as renameA, propB as renameB, propC as renameC } from './a.mjs' //第三种
```

- 第一种方式：重定向导出所有导出属性， 但是不包括模块的默认导出。
- 第二种方式：以相同的属性名再次导出。
- 第三种方式：从模块中导入propA，再重命名为renameA导出

#### 只运行模块

```javascript
import './a.mjs' 
```



#### [动态 import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import#动态_import)

标准用法的 import 导入的模块是静态的，所有被导入的模块在加载时就被编译。静态框架能更好的初始化依赖，而且更有利于静态分析工具和 [tree shaking](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking) 发挥作用。

动态import将返回一个 `promise`：

```js
import('/modules/my-module.js')
  .then((module) => {
    // Do something with the module.
  });
```



这种使用方式也支持 `await` 关键字。

```js
let module = await import('/modules/my-module.js');
```



### export 导出

ES Module导出的是一份值的引用



### import 导入

#### 记住

import语句有提升的效果



#### 阶段（解决循环引用）

##### 代码执行前---预处理

这一步会根据import和export来构建==模块地图（Module Map）==，它类似于一颗树，树中的每一个“节点”就是一个==模块记录==，这个记录上会<font color="red">标注导出变量的内存地址和加载状态。</font>导入的变量和导出的变量指向同一块内存地址。不过此时这些内存都是空的，也就是uninitialized。



##### 进入模块执行代码

模块里面的代码只会在第一次被引用的时候执行一次，然后都是返回那一次执行后的结果。

<font color="red">如果模块没执行完毕，会将此模块的模块记录标记为“获取中（Fetching）”，其他模块再引用它的时候就不会再进来执行（即此时返回uninitialized）（解决循环引用）</font>。



#### 演示

```javascript
// index.mjs
import * as a from './a.mjs'
console.log('入口模块引用a模块：',a)

// a.mjs
let a = "原始值-a模块内变量"
export { a }
import * as b from "./b.mjs"  //import是会变量提升的
console.log("a模块引用b模块：", b)
a = "修改值-a模块内变量"

// b.mjs
let b = "原始值-b模块内变量"
export { b }
import * as a from "./a.mjs"  //import是会变量提升的，这里发现a文件正在执行中于是说这个模块uninitialized
console.log("b模块引用a模块：", a)
b = "修改值-b模块内变量"
```

运行代码后的结果如下：

![](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTauZyNibViayh0lqUsQFhibMibwxHwEK5Rn2gtzQ2hiajW3cWtsZ6YSdzddvHpB2p65eSzzKoqfybiaWHic0KA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)





## 引入模块时的路径解析规则

1. 对于核心模块，node将其已经编译成二进制代码，直接书写标识符fs、http就可以

2. 对于自己写的文件模块，需要用‘./’'../'开头，require会将这种相对路径转化为真实路径，找到模块

3. 对于第三方模块，也就是使用npm下载的包，就会用到`paths`这个变量，会依次查找当前路径下的node_modules文件夹，如果没有，则在父级目录查找node_modules，一直到根目录下，找到为止。在node_modules下找到对应包后，找到该包后会以package.json文件下的main字段为准来找到包的入口，如果没有main字段，则查找index.js/index.json/index.node。

   仔细观察module这个变量，可以看到还有一个属性`paths`

   ![](https://mmbiz.qpic.cn/mmbiz_png/cpWiaicnZTauZyNibViayh0lqUsQFhibMibwxHicBMic5Q57ZPxBMibxMCt9Dvicx8jta7vYMOt7jicCuHVOcZMlmtLTfwbIg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)



## ES Modules & CommonJS

### 选择使用 ES Modules 还是 CommonJS 与你的项目和引用的包都有关

1. 项目类型：
   - Node.js 项目：在 Node.js 环境中，默认支持 CommonJS 模块化。如果要使用 ES Modules，在 Node.js 14 及以上版本中，可以通过在文件的顶部添加 `"type": "module"` 来启用 ES Modules。
   - 浏览器项目：在现代的浏览器环境中，大部分现代浏览器已经支持 ES Modules。因此，在浏览器中，可以直接使用 `<script type="module">` 标签加载 ES Modules。
2. 引用的包：
   - 有些包仅提供了 CommonJS 格式的模块，这些包使用 `require` 和 `module.exports` 来导入和导出模块。
   - 一些包同时提供了 ES Modules 和 CommonJS 格式的模块，可以根据需求选择合适的模块化格式导入。



### 两者区别

1. CommonJS 模块输出的是一个值的拷贝（就是把导出值复制一份，放到一块新的内存中），ES6 模块输出的是值的引用。
2. CommonJS 规范加载模块是同步的。

3. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。 可以看到 ES Modules 预先解析了模块代码，而 CommonJS 是代码运行的时候解析的。根据 EMS 规范 import / export 必须位于模块顶级，不能位于作用域内；其次模块内的 import/export 会提升到模块顶部，这是在编译阶段完成的。

举一个简单的例子来直观的对比下二者的差别：

```text
// ES Modules

// a.js
console.log('Come from a.js.');
import { hello } from './b.js';
console.log(hello);

// b.js
console.log('Come from b.js.');
export const hello = 'Hello from b.js';
```

输出：

```text
Come from b.js.
Come from a.js.
Hello from b.js
```

同样的代码使用 CommonJS 机制：

```text
// CommonJS

// a.js
console.log('Come from a.js.');
const hello = require('./b.js');
console.log(hello);

// b.js
console.log('Come from b.js.');
module.exports = 'Hello from b.js';
```

输出：

```text
Come from a.js.
Come from b.js.
Hello from b.js
```



### 两种模块间的相互引用

CommonJS 和 ES Modules 都支持 Dynamic import()，它可以支持两种模块机制的导入。

#### 在 CommonJS 文件中导入 ES Modules 模块

由于 ES Modules 的加载、解析和执行都是异步的，而 require() 的过程是同步的、所以不能通过 require() 来引用一个 ES6 模块。

ES6 提议的 import() 函数将会返回一个 Promise，它在 ES Modules 加载后标记完成。借助于此，我们可以在 CommonJS 中使用异步的方式导入 ES Modules：

```text
// 使用 then() 来进行模块导入后的操作
import(“es6-modules.mjs”).then((module)=>{/*…*/}).catch((err)=>{/**…*/})
// 或者使用 async 函数
(async () => {
  await import('./es6-modules.mjs');
})();
```

#### 在 ES Modules 文件中导入 CommonJS 模块

在 ES6 模块里可以很方便地使用 import 来引用一个 CommonJS 模块，因为在 ES6 模块里异步加载并非是必须的：

```text
import { default as cjs } from 'cjs';

// The following import statement is "syntax sugar" (equivalent but sweeter)
// for `{ default as cjsSugar }` in the above import statement:
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
```





# Bom&Dom



## 区别

[这篇文章很详细](https://www.jianshu.com/p/86acc95f1eb8)



## Bom

window: BOM的核心对象，既是通过javascript访问浏览器窗口的一个接口，优势ECMAScript中规定的Global对象

loaction: 最有用的BOM对象之一，且比较特殊的是，locaton既是window对象的属性，也是document对象的属性，换句话说，window.location和document.location引用的是同一个对象

**navigator：**主要用于检测显示网页的浏览器类型。例如：客户端浏览器每次发送 HTTP 请求时，都会附带有一个 user-agent（用户代理）字符串，对于 Web 开发人员来说，可以使用用户代理字符串检测浏览器类型，BOM 在 navigator 对象中定义了 userAgent 属性，利用该属性可以捕获客户端 user-agent 字符串信息



### Console

![image-20230508160445832](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-16-04-image-20230508160445832.png)





### Date

`new Date()` 返回的时间取决于客户端设备的系统时间设置。所以不一定准确





## 事件

### 事件流

#### 三个阶段

![image-20230429133637057](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-13-36-image-20230429133637057.png)

1. 捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
2. 目标阶段（Target phase）—— 事件到达目标元素。
3. 冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。（mouseenter/mouseleave等事件是没有冒泡传播机制的）



#### 事件流的典型应用---事件代理

事件代理的原理用到的就是事件冒泡和目标元素，把事件处理器添加到父元素，等待子元素事件冒泡，并且父元素能够通过target（IE为srcElement）判断是哪个子元素，从而做相应处理。





### 事件对象event

事件对象代表事件的状态，比如键盘按键的状态、鼠标的位置、鼠标按钮的状态。当注册事件时，系统会自动创建event对象并传递给事件处理函数。

>  e.target返回的是触发事件的对象（元素），this和e.currentTarget返回的是绑定事件的对象





### 常用事件

#### click

如果连着点击两下：pc端会触发：两次click、一次dblclick。移动端不会触发click，只会触发dblclick。因为在移动端中单击事件的逻辑是这样：第一次点击后，监测300ms，看是否有第二次点击操作，如果没有就是单击，如果有就是双击。

```js
/* 使用FastClick解决移动端使用click事件的300ms延迟问题 */
import FastClick from 'fastclick';
FastClick.attach(document.body);
```



![image-20230303114058639](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114058639.png)



![image-20230303114111759](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114111759.png)

![image-20230303114136110](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114136110.png)









### DOMContentLoaded & Load

在 DOM树构建完成之后，DOMContentLoaded 事件触发。

当一个资源及其依赖资源已完成加载时，还加载完成了所有外部资源时将触发load事件。







## 元素大小和位置

### scroll

![image-20230303114515679](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114515679.png)

> 如果一个元素使用display: none隐藏起来，那它的scrollHeight属性等于0。遇到这种情况的时候，可以先把display属性设置为block（el.style.display ='block'），获取到scrollHeight，然后重置display的值（el.style.display ='none'）。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114524553.png" alt="image-20230303114524553" style="zoom: 50%;" />









### offset

![image-20230303114740466](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303114740466.png)

### client

![image-20230303115340204](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303115340204.png)





### 以上三者对比

![image-20230303115425319](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230303115425319.png)







### getBoundingClientRect()

无参数

返回值是一个 [`DOMRect`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMRect) 对象，是包含整个元素的最小矩形（包括 `padding` 和 `border-width`）。该对象使用 `left`、`top`、`right`、`bottom`、`x`、`y`、`width` 和 `height` 这几个以像素为单位的只读属性描述整个矩形的位置和大小。

![img](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect/element-box-diagram.png)









## APIs

### 二进制

![image-20230429141036328](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-10-image-20230429141036328.png)



### `IntersectionObserver`

它可以异步监听目标元素与其祖先或视窗的交叉状态，它不随着目标元素的滚动同步触发所以它并不会影响页面的滚动性能。



#### 用法

IntersectionObserver 构造函数接收两个参数，回调函数以及配置项（该参数可选）。构造函数的返回值是一个观察器实例。

```javascript
var io = new IntersectionObserver(callback, option?);
```

###### 1、配置项

- root：所监听对象的具体祖先元素，默认是 viewport ；
- rootMargin：rootMargin属性用于指定观察目标的根元素边缘。rootMargin属性是一个由四个值组成的字符串，表示根元素边缘的偏移量。例如，如果设置rootMargin为"10px 20px 30px 40px"，则表示在目标元素的上边缘之上增加10像素的空间，在右边缘之右增加20像素的空间，在下边缘之下增加30像素的空间，在左边缘之左增加40像素的空间。<strong style="color:red">必须设置了root属性才生效</strong>
- threshold：设置一系列的阈值，当交叉状态达到阈值时，会触发回调函数。默认为`[0]`。例：`threshold: [0, 0.25, 0.5, 0.75, 1]`

###### 2、回调函数

目标元素的可见性变化时，就会调用观察器的回调函数。`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。执行回调函数时，会传递一个包含 IntersectionObserverEntry 对象的数组（举例来说，如果同时有两个被观察的对象的可见性发生变化，`entries`数组就会有两个成员）。每个成员都是一个[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)对象，该对象一共有七大属性：

- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒

- `target`：被观察的目标元素，是一个 DOM 节点对象

- `rootBounds`：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null`

  - ```javascript
    rootBounds: ClientRect {
        bottom: 920,
        height: 1024,
        left: 0,
        right: 1024,
        top: 0,
        width: 920
      },
    ```

- `boundingClientRect`：目标元素的矩形区域的信息（同上）

- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息（同上）

- `intersectionRatio`：目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`

- isIntersecting：目标元素是否与祖先元素相交。

###### 3、实例方法

- observe：`observe`的参数是一个 DOM 节点对象。如果要观察多个节点，就要多次调用这个方法。
- unobserve：停止监听特定的元素；
- disconnect：使 IntersectionObserver 对象停止监听工作；
- takeRecords：为所有监听目标返回一个 IntersectionObserverEntry 对象数组并且停止监听这些目标。



#### 注意

IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发。

规格写明，`IntersectionObserver`的实现，应该采用`requestIdleCallback()`，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。

### setInterval&setTimeout

`setInterval` 有两个缺点

1. 使用 setInterval 时，某些间隔会被跳过；
2. 可能多个定时器会连续执行；

每个 `setTimeout` 产生的任务会直接 `push` 到任务队列中；而 `setInterval` 在每次把任务push到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中)。



### requestAnimationFrame(callback)

每秒60次执行回调——符合屏幕的刷新频率，遇到耗时长的操作，这个数字会降到30来保证稳定的帧数。

点击返回顶部 示例：

```js
const newScrollTop = this.getPosition(this.panes[index].$refs.content).top - this.distance

function scrollStep() {
    document.documentElement.scrollTop += 5
    if (document.documentElement.scrollTop < newScrollTop) {
        window.requestAnimationFrame(scrollStep)
    }
}

window.requestAnimationFrame(scrollStep)
```

与定时器很相似，只是鉴于其一次执行只调用一次回调，所以需要以递归的方式书写。

raf也会被主线程阻塞的，不一定在每一帧前都执行回调函数。

### getComputedStyle与dom.style的区别

```
docEl.style.fontSize 获取的是元素的内联样式，也就是直接在 HTML 元素的 style 属性中设置的样式。如果你没有直接在元素上设置 fontSize，那么 docEl.style.fontSize 将返回空字符串。
window.getComputedStyle(docEl).fontSize 获取的是元素的最终样式，包括内联样式、样式表以及浏览器默认样式。这个值是只读的，代表了元素最终的显示样式。
```



## worker

### 总览

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-17-image-20230429141717900.png" alt="image-20230429141717900" style="zoom:50%;" />

### WebWorker

为了让JS能应对CPU密集型计算任务,  在HTML5中加入了WebWorker.

> Web Worker 为内容在后台线程中运行脚本提供了一种简单的方法. 线程可以执行任务而不干扰用户界面. 此外也可以使用网络请求执行I/O. 一旦创建, 一个worker可以将消息发送到它的父线程, 反之亦然.

#### 介绍

- 同源策略的限制

  `Worker` 线程中运行的脚本文件必须与主线程的脚本文件同源

- 操作 DOM 的限制

  worker运行在==另一个全局上下文==中, 不同于主线程的window，`Worker` 线程中无法读取主线程所在视图的 `DOM` 对象，也无法使用 `window` 和 `document` 对象，但可以使用他们的子对象。不能执行`alert()`方法和`confirm()`方法。

- 本地文件的限制

  `Worker` 线程中无法读取本地文件，即不能打开本机的文件系统（`file://`），因此它所加载的脚本必须来自于网络，可以使用 XMLHttpRequest 对象发出 AJAX 请求。

- 消息通信

  `Worker` 线程和主线程不在同一个上下文环境，它们不能直接通信，需要==序列化==对象来与线程进行特定数据的交互。它们**相互之间的通信可以传递对象和数组**，它们之间通信是通过拷贝的形式来传递数据的，进行传递的对象需要经过序列化，接下来在另一端还需要反序列化。这就意味着：

  1. **我们不能传递不能被序列化的数据**，比如函数，会抛出错误的。
  2. 在一端改变数据，另外一端不会受影响，因为数据不存在引用，是拷贝过来的。

  

#### [使用](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-16-image-20230429141645718.png" alt="image-20230429141645718" style="zoom:50%;" />

##### 主线程环境

- 创建一个专用worker

  ```js
  const worker = new Worker('hash.worker.js', { name: 'hash_worker' })
  ```

- 消息的发送和接收

  ```js
  worker.postMessage()
  worker.addEventListener('message', ({ data }) => {
    // event.data <=> data
  })
  ```

- 终止主线程

  ```js
  worker.terminate()
  ```

  注：立即终止，并不会等待工作线程去完成它剩余的操作

##### 工作线程环境

- 消息的接收和发送

  ```js
  self.addEventListener('message', ({ data }) => {
    // event.data <=> data
  })
  self.postMessage()
  ```

- 关闭当前工作线程

  ```js
  self.close()
  ```

- 加载外部脚本或第三方库

  ```js
  self.importScripts(urlA, urlB)
  ```

  注：所引入的脚本与库都会绑定在子线程的全局对象上，即 self 或 this上

#### 判断浏览器对专用 `Worker` 的支持性

```js
if (window.hasOwnProperty('Worker')) {
  console.log('支持，请放心使用！')
} else {
  console.log('不支持，请优雅降级！')
}
```







### service worker

#### PWA & AMP

![image-20230429140703286](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-04-29-14-07-image-20230429140703286.png)









# 正则表达式

正则表达式的基本**组成元素**可以分为：**字符和元字符**。字符就是基础的计算机字符编码，通常正则表达式里面使用的就是数字、英文字母。而元字符，也被称为特殊字符，是一些用来表示特殊语义的字符。如^表示非,|表示或等。利用这些元字符，才能构造出强大的表达式模式(pattern)。



## 字符

### 单个字符

最简单的正则表达式可以由简单的数字和字母组成，没有特殊的语义，纯粹就是一一对应的关系。如想在'apple'这个单词里找到‘a'这个字符，就直接用`/a/`这个正则就可以了。

但是如果想要匹配特殊字符的话，就得请出我们第一个元字符**`\`**， 它是转义字符字符，顾名思义，就是让其后续的字符失去其本来的含义。

比如空格，制表符，回车，换行等, 而这些就需要我们使用转义字符来匹配。为了便于记忆，我整理了下面这个表格，并附上记忆方式：

| 特殊字符   | 正则表达式 | 记忆方式                                     |
| ---------- | ---------- | -------------------------------------------- |
| 换行符     | \n         | **n**ew line                                 |
| 换页符     | \f         | **f**orm feed                                |
| 回车符     | \r         | **r**eturn                                   |
| 空白符     | \s         | **s**pace                                    |
| 制表符     | \t         | **t**ab                                      |
| 垂直制表符 | \v         | **v**ertical tab                             |
| 回退符     | [\b]       | **b**ackspace,之所以使用[]符号是避免和\b重复 |





### 多个字符

在正则表达式里，集合的定义方式是使用中括号`[`和`]`。如`/[123]/`这个正则就能同时匹配1,2,3三个字符。那如果我想匹配所有的数字怎么办呢？从0写到9显然太过低效，所以元字符`-`就可以用来表示区间范围，利用`/[0-9]/`就能匹配所有的数字, `/[a-z]/`则可以匹配所有的英文小写字母。

即便有了集合和区间的定义方式，如果要同时匹配多个字符也还是要一一列举，这是低效的。所以在正则表达式里衍生了一批用来同时匹配多个字符的简便正则表达式:

| 匹配区间                                      | 正则表达式 | 记忆方式            |
| --------------------------------------------- | ---------- | ------------------- |
| 除了换行符之外的任何字符                      | .          | 句号,除了句子结束符 |
| 单个数字, [0-9]                               | \d         | **d**igit           |
| 除了[0-9]                                     | \D         | **not** **d**igit   |
| 包括下划线在内的单个字符，[A-Za-z0-9_]        | \w         | **w**ord            |
| 非单字字符                                    | \W         | **not** **w**ord    |
| 匹配空白字符,包括空格、制表符、换页符和换行符 | \s         | **s**pace           |
| 匹配非空白字符                                | \S         | **not** **s**pace   |



## 循环与重复

| 匹配规则    | 元字符              | 联想方式                                                    |
| ----------- | ------------------- | ----------------------------------------------------------- |
| 0次或1次    | ?                   | 且**问**,此事**有**还**无**                                 |
| 0次或无数次 | *                   | 宇宙洪荒,**辰宿**列张：宇宙伊始，从无到有，最后星宿布满星空 |
| 1次或无数次 | +                   | **一加**, +1                                                |
| 特定次数    | {x}, {`min`,` max`} | `min`和`max`分别表示了左闭右闭区间的左界和右界              |





## 位置边界

在长文本字符串查找过程中，我们常常需要限制查询的位置。比如我只想在单词的开头结尾查找。

### 单词边界

单词是构成句子和文章的基本单位，一个常见的使用场景是把文章或句子中的特定单词找出来。如：

```sql
The cat scattered his food all over the room.
```

我想找到`cat`这个单词，但是如果只是使用`/cat/`这个正则，就会同时匹配到`cat`和`scattered`这两处文本。这时候我们就需要使用边界正则表达式`\b`，其中b是boundary的首字母。在正则引擎里它其实匹配的是能构成单词的字符(\w)和不能构成单词的字符(\W)中间的那个位置。

上面的例子改写成`/\bcat\b/`这样就能匹配到`cat`这个单词了。

| 边界和标志 | 正则表达式 | 记忆方式             |
| ---------- | ---------- | -------------------- |
| 单词边界   | \b         | **b**oundary         |
| 非单词边界 | \B         | **not** **b**oundary |



### 字符串边界

匹配完单词，我们再来看一下一整个字符串的边界怎么匹配。元字符`^`用来匹配字符串的开头。而元字符`$`用来匹配字符串的末尾。注意的是在长文本里，如果要排除换行符的干扰，我们要使用多行模式。试着匹配`I am scq000`这个句子：

```css
I am scq000.
I am scq000.
I am scq000.
```

我们可以使用`/^I am scq000\.$/m`这样的正则表达式，其实m是multiple line的首字母。正则里面的模式除了m外比较常用的还有i和g。前者的意思是忽略大小写，后者的意思是找到所有符合的匹配。

| 边界和标志 | 正则表达式 | 记忆方式                              |
| ---------- | ---------- | ------------------------------------- |
| 字符串开头 | ^          | 小**头尖尖**那么大个                  |
| 字符串结尾 | $          | **终结**者，美国科幻电影，美元符$     |
| 多行模式   | m标志      | **m**ultiple of lines                 |
| 忽略大小写 | i标志      | **i**gnore case, case-**i**nsensitive |
| 全局模式   | g标志      | **g**lobal                            |



## 子表达式

字符匹配我们介绍的差不多了，更加高级的用法就得用到子表达式了。通过嵌套递归和自身引用可以让正则发挥更强大的功能。

从简单到复杂的正则表达式演变通常要采用**分组、回溯引用和逻辑处理**的思想。利用这三种规则，可以推演出无限复杂的正则表达式。

### 分组

其中分组体现在：所有以`(`和`)`元字符所包含的正则表达式被分为一组，每一个分组都是一个**子表达式**。如果只是使用简单的`(regex)`匹配语法本质上和不分组是一样的，如果要发挥它强大的作用，往往要结合回溯引用的方式。

### 回溯引用

所谓回溯引用（backreference）指的是模式的后面部分引用前面已经匹配到的子字符串。你可以把它想象成是变量，回溯引用的语法像`\1`,`\2`,....,其中`\1`表示引用的第一个子表达式，`\2`表示引用的第二个子表达式，以此类推。而`\0`则表示整个表达式。

假设现在要在下面这个文本里匹配两个连续相同的单词，你要怎么做呢？

```csharp
Hello what what is the first thing, and I am am scq000.
```

利用回溯引用，我们可以很容易地写出`\b(\w+)\s\1`这样的正则。

回溯引用在替换字符串中十分常用，语法上有些许区别，用`$1`,`$2`...来引用要被替换的字符串。下面以js代码作演示：

```javascript
var str = 'abc abc 123';
str.replace(/(ab)c/g,'$1g');
// 得到结果 'abg abg 123'
```

如果我们不想子表达式被引用，可以使用**非捕获**正则`(?:regex)`这样就可以避免浪费内存。

```javascript
var str = 'scq000'.
str.replace(/(scq00)(?:0)/, '$1,$2')
// 返回scq00,$2
// 由于使用了非捕获正则，所以第二个引用没有值，这里直接替换为$2
```

有时，我们需要限制回溯引用的适用范围。那么通过前向查找和后向查找就可以达到这个目的。

#### 前向查找

前向查找(lookahead)是用来限制后缀的。凡是以`(?=regex)`包含的子表达式在匹配过程中都会用来限制前面的表达式的匹配。例如`happy happily`这两个单词，我想获得以`happ`开头的副词，那么就可以使用`happ(?=ily)`来匹配。如果我想过滤所有以`happ`开头的副词，那么也可以采用**负前向查找**的正则`happ(?!ily)`，就会匹配到`happy`单词的`happ`前缀。

#### 后向查找

后向查找(lookbehind)是通过指定一个子表达式，然后从符合这个子表达式的位置出发开始查找符合规则的字串。举个简单的例子： `apple`和`people`都包含`ple`这个后缀，那么如果我只想找到`apple`的`ple`，该怎么做呢？我们可以通过限制`app`这个前缀，就能唯一确定`ple`这个单词了。

```ruby
/(?<=app)ple/
```

其中`(?<=regex)`的语法就是我们这里要介绍的后向查找。`regex`指代的子表达式会作为限制项进行匹配，匹配到这个子表达式后，就会继续向**后**查找。另外一种限制匹配是利用`(?<!regex)` 语法，这里称为**负后向查找**。与正前向查找不同的是，被指定的子表达式不能被匹配到。于是，在上面的例子中，如果想要查找`apple`的`ple`也可以这么写成`/(?<!peo)ple`。

需要注意的，不是每种正则实现都支持后向查找。在javascript中是不支持的（从es2018之后，chrome中的正则表达式也支持反向查找了），所以如果有用到后向查找的情况，有一个思路是将字符串进行翻转，然后再使用前向查找，作完处理后再翻转回来。看一个简单的例子：

```perl
// 比如我想替换apple的ple为ply
var str = 'apple people';
str.split('').reverse().join('').replace(/elp(?=pa)/, 'ylp').split('').reverse().join('');
复制代码
```

最后回顾一下这部分内容：

| 回溯查找   | 正则                   | 记忆方式                                                     |
| ---------- | ---------------------- | ------------------------------------------------------------ |
| 引用       | \0,\1,\2 和 $0, $1, $2 | 转义+数字                                                    |
| 非捕获组   | (?:)                   | 引用表达式(()), 本身不被消费(?),引用(:)                      |
| 前向查找   | (?=)                   | 引用子表达式(())，本身不被消费(?), 正向的查找(=)             |
| 前向负查找 | (?!)                   | 引用子表达式(())，本身不被消费(?), 负向的查找(!)             |
| 后向查找   | (?<=)                  | 引用子表达式(())，本身不被消费(?), 后向的(<，开口往后)，正的查找(=) |
| 后向负查找 | (?<!)                  | 引用子表达式(())，本身不被消费(?), 后向的(<，开口往后)，负的查找(!) |

### 逻辑处理

在正则里面，默认的正则规则都是**与**的关系所以这里不讨论。

**非**关系，分为两种情况：一种是字符匹配，另一种是子表达式匹配。在字符匹配的时候，需要使用`^`这个元字符。在这里要着重记忆一下：<font color="red">只有在`[`和`]`内部使用的`^`才表示非的关系</font>。子表达式匹配的非关系就要用到前面介绍的前向负查找子表达式`(?!regex)`或后向负查找子表达式`(?<!regex)`。

或关系，通常给子表达式进行归类使用。比如，我同时匹配a,b两种情况就可以使用`(a|b)`这样的子表达式。

| 逻辑关系 | 正则元字符  |
| -------- | ----------- |
| 与       | 无          |
| 非       | [^regex]和! |
| 或       | \|          |





## 方法

### exec

#### 介绍

返回一个结果数组或 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。在设置了 [`global`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global) 或 [`sticky`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky) 标志位的情况下（如 `/foo/g` or `/foo/y`），JavaScript [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) 对象是**有状态**的。他们会将上次成功匹配后的位置记录在正则表达式的 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 属性中，利用此特性，可以多次执行 `exec` 方法来查找同一个字符串中的成功匹配。当你这样做时，查找将从正则表达式的 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 属性指定的位置开始。注意，即使再次查找的字符串不是原查找字符串时，[`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 也不会被重置，它依旧会从记录的 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 开始。

#### [返回值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#description)

如果匹配成功，`exec()` 方法返回一个数组（包含额外的属性 `index` 和 `input` ，参见下方表格），并更新正则表达式对象的 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 属性。完全匹配成功的文本将作为返回数组的第一项，从第二项起，后续每项都对应正则表达式内捕获括号里匹配成功的文本。

如果匹配失败，`exec()` 方法返回 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)，并将 [`lastIndex`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) 重置为 0 。





## 工具

### [可视化正则表达式](https://regexper.com/#%2F%5Cd%5Cw%2B%2F)





# glob 模式

## 简介

比如很多工程化工具的路径匹配语法 、 vscode的文件过滤匹配语法都是用glob

在计算机编程中 glob 模式（shell使用的模式）表示带有通配符的路径名，例如在 bash 中查看文件列表：

```bash
$ls src/*.js
src/a.js src/b.js
```

```
* 匹配任何数量的任何字符，但不包括/。例如，*.js匹配所有js文件。
** 匹配任何数量的任何字符，包括/。例如，**/*.js匹配所有目录下的js文件。
? 匹配任何单个字符，但不包括/。例如，?.js匹配a.js，但不匹配ab.js。
{} 匹配大括号内的任何一个模式。例如，{*.js,*.ts}匹配所有js和ts文件。
[] 匹配方括号内的任何一个字符。例如，[abc].js匹配a.js，b.js和c.js。
! 排除匹配的文件。例如，!*.js排除所有js文件。

你可以在VS Code的搜索框中输入glob模式来过滤搜索结果。例如，你可以输入**/*.js来搜索所有js文件，或者输入!**/node_modules/**来排除node_modules目录。
```



## 元字符

glob 默认不匹配隐藏文件（以点`.`开头的文件或目录），下面是 glob 的语法：

| 通配符             | 描述                             | 示例       | 匹配                   | 不匹配              |
| ------------------ | -------------------------------- | ---------- | ---------------------- | ------------------- |
| `*`                | 匹配0个或多个字符，包含空串      | `Law*`     | `Law`, `Laws`和`Lawer` | `La`, `aw`          |
| `?`                | 匹配1个字符                      | `?at`      | `cat`, `bat`           | `at`                |
| `[abc]`            | 匹配括号内字符集合中的单个字符   | `[cb]at`   | `cat`, `bat`           | `at`, `bcat`        |
| `[a-z]`            | 匹配括号内字符范围中的单个字符   | `[a-z]at`  | `aat`, `bat`, `zat`    | `at`, `bcat`, `Bat` |
| `[^abc]`或`[!abc]` | 匹配非括号内字符集合中的单个字符 | `[!CB]at`  | `cat`, `bat`           | `Cat`, `Bat`        |
| `[^a-z]`或`[!a-z]` | 匹配非括号内字符范围中的单个字符 | `[!A-Z]at` | `aat`, `bat`, `zat`    | `Aat`, `Bat`, `Zat` |

> 在 bash 命令行中`[!abc]`需要转义成`[\!abc]`



| 通配符            | 描述                                              | 示例              | 匹配                               | 不匹配           |
| ----------------- | ------------------------------------------------- | ----------------- | ---------------------------------- | ---------------- |
| `{x, y, ...}`     | Brace Expansion，展开花括号内容，支持展开嵌套括号 | `a.{png,jp{,e}g}` | `a.png`, `a.jpg`, `a.jpeg`         |                  |
| `**`              | globstar，匹配所有文件和任意层目录                | `src/**`          | `src/a.js`, `src/b/a.js`, `src/b/` |                  |
| `?(pattern-list)` | 匹配0次或1次给定的模式                            | `a.?(txt|bin)`    | `a.`, `a.txt`, `a.bin`             | `a`              |
| `*(pattern-list)` | 匹配0次或多次给定的模式                           | `a.*(txt|bin)`    | `a.`, `a.txt`, `a.bin`, `a.txtbin` | `a`              |
| `+(pattern-list)` | 匹配1次或多次给定的模式                           | `a.+(txt|bin)`    | `a.txt`, `a.bin`, `a.txtbin`       | `a.`, `a`        |
| `@(pattern-list)` | 匹配给定的模式                                    | `a.@(txt|bin)`    | `a.txt`, `a.bin`                   | `a.`, `a.txtbin` |
| `!(pattern-list)` | 匹配非给定的模式                                  | `a.!(txt|bin)`    | `a.`, `a.txtbin`                   | `a.txt`, `a.bin` |



## JavaScript API

glob 模式匹配并非 JavaScript 中的标准 API，需要自行解析和匹配，这里介绍一个用 JavaScript 编写的 glob 的匹配库 [minimatch](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fisaacs%2Fminimatch)，它支持 glob 基础语法和扩展语法，可以实现 glob 的测试、匹配以及转换成正则表达式。下面是使用示例：

```js
const minimatch = require("minimatch")

// minimatch 作为函数使用，测试路径匹配
// 第一个参数是输入路径
// 第二个参数是 glob 模式
// 返回 boolean 值
minimatch("a.txt", "*.txt") // true
minimatch("a.txt", "*.bin") // false

// minimatch.makeRe 可将 glob 模式串转换成 JS 中的 RegExp 对象
// 然后使用生成的正则表达式，进行路径匹配测试
minimatch.makeRe("*.txt").test("a.txt") // true
minimatch.makeRe("*.bin").test("a.txt") // false

const fileList = [
  "src/index.js",
  "src/index.css",
  "src/pages/HomePage.jsx",
  "src/pages/AboutPage/index.jsx"
];

// minimatch.match 方法根据 glob 模式过滤路径列表
// 第一个参数是路径列表
// 第二个参数与是 glob 模式串
// 返回过滤后的路径列表
console.log(minimatch.match(fileList, "src/**/*.js{,x}"))
// ["src/index.js", "src/pages/HomePage.jsx", "src/pages/AboutPage/index.jsx"]
```

如果要通过 glob 模式遍历文件系统，可使用 [node-glob](https://www.npmjs.com/package/glob) ，它基于 minimatch 和 node 实现 glob 模式遍历文件的 API。











# 设计模式

设计模式中，我们强调将“**变与不变**”分离，而纯函数强调将**计算与副作用**分离。

## 设计原则

### 总览

1. 单一职责原则(SRP)：一个类或模块只负责一项任务。
2. 开放封闭原则：软件实体（类、模块、函数）应该对扩展开放，对修改关闭。
3. 里氏替换原则：子类可以替换父类并且不会破坏程序的正确性。
4. 接口隔离原则：使用多个专门的接口比使用单一的总接口要好。
5. 依赖倒置原则：高层模块不应该依赖底层模块，两者都应该依赖于抽象接口。
6. 迪米特法则(最少知识原则)（LKP）：一个软件实体（类、模块、函数）应当尽可能少地与其他实体发生相互作用。
7. 组合/聚合复用原则：优先使用组合或聚合关系而不是继承来实现代码复用。
8. 优先使用简单的设计。

DRY(Don't Repeat Yourself) 是一种软件设计原则



dyc扩充：

好莱坞原则：

我们允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件，高层组件对待底层组件的方式，跟演艺公司对待新人演员一样，都是“别调用我们，我们会调用你”。

好莱坞原则还常常应用于其他模式和场景，例如发布-订阅模式和回调函数。

❏ 发布—订阅模式在发布—订阅模式中，发布者会把消息推送给订阅者，这取代了原先不断去fetch消息的形式。例如假设我们乘坐出租车去一个不了解的地方，除了每过5秒钟就问司机“是否到达目的地”之外，还可以在车上美美地睡上一觉，然后跟司机说好，等目的地到了就叫醒你。这也相当于好莱坞原则中提到的“别调用我们，我们会调用你”。

❏ 回调函数在ajax异步请求中，由于不知道请求返回的具体时间，而通过轮询去判断是否返回数据，这显然是不理智的行为。所以我们通常会把接下来的操作放在回调函数中，传入发起ajax异步请求的函数。当数据返回之后，这个回调函数才被执行，这也是好莱坞原则的一种体现。把需要执行的操作封装在回调函数里，然后把主动权交给另外一个函数。至于回调函数什么时候被执行，则是另外一个函数控制的。





### 单一职责原则(SRP)



#### 并不是所有的职责都应该一一分离

一方面，如果两个职责总是同时变化，那就不必分离他们。比如在ajax请求的时候，创建xhr对象和发送xhr请求几乎总是在一起的，那么创建xhr对象的职责和发送xhr请求的职责就没有必要分开。

另一方面，职责的变化轴线仅当它们确定会发生变化时才具有意义，即使两个职责已经被耦合在一起，但它们还没有发生改变的征兆，那么也许没有必要主动分离它们，在代码需要重构的时候再进行分离也不迟。





#### 优缺点

优点是降低了单个类或者对象的复杂度，按照职责把对象分解成更小的粒度，这有助于代码的复用，也有利于进行单元测试。当一个职责需要变更的时候，不会影响到其他的职责。

缺点，最明显的是会增加编写代码的复杂度。当我们按照职责把对象分解成更小的粒度之后，实际上也增大了这些对象之间相互联系的难度。







### 开放-封闭原则(OCP)

#### 应用场景







## 面向对象编程(Object-Oriented Programming，OOP)

### 接口

接口是对象能响应的请求的集合。



### 三大特点

1. **封装（Encapsulation）**：
   - **定义**：封装是一种将数据和操作（方法或函数）封装在一个单一实体内部的机制。这个实体称为类（Class）。
   - **特点**：通过封装，类将数据（属性或成员变量）和方法（函数或成员函数）捆绑在一起，形成一个独立的单元。这个单元对外界隐藏了内部实现的细节，只公开了有限的接口，这种限制让数据和行为更加安全和可控。
   - **优势**：封装有助于防止数据被意外修改，提高代码的可维护性和可扩展性。同时，它允许代码的修改不会对其他部分产生负面影响，从而降低了耦合度。
2. **继承（Inheritance）**：
   - **定义**：继承是一种通过创建新类（子类或派生类）来重用现有类（父类或基类）的属性和方法的机制。
   - **特点**：子类继承了父类的特性，包括属性和方法。子类可以在不修改父类代码的情况下，添加新的属性和方法，或者覆盖（重写）父类的方法以改变其行为。
   - **优势**：继承提高了代码的可重用性，减少了代码重复。它还支持多态性，允许不同的子类对象可以以相同的方式进行操作，提高了代码的灵活性。
3. **多态（Polymorphism）**：
   - **定义**：多态是一种能够根据上下文自动选择适当行为的能力，通常用于不同类对象对相同方法的调用。
   - **特点**：多态允许不同类的对象对相同的方法名称进行调用，但具体的实现可以因对象类型而异。这意味着相同的方法可以根据对象的实际类型产生不同的行为。
   - **优势**：多态提高了代码的灵活性和可扩展性。它允许在不知道对象具体类型的情况下编写通用代码，使得代码更容易维护和扩展。

#### 多态

含义是：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。



<mark>多态背后的思想是将【“不变的事物”】与【“可能改变的事物”】分离开来（“面向接口编程”）</mark>。动物都会叫，这是不变的，但是不同类型的动物具体怎么叫是可变的。把不变的部分隔离出来，把可变的部分封装起来，这给予了我们扩展程序的能力。

这也是符合开放-封闭原则的，相对于修改代码来说，仅仅增加代码就能完成同样的功能，这显然优雅和安全得多。



多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。



比如js里每个类型都实现了toString()方法。



#### 封装

封装的目的是将信息隐藏。对象对它自己的行为负责。其他对象或者用户都不关心它的内部实现。对象之间只通过暴露的API接口来通信。我们可以随意地修改它的内部实现，只要对外的接口没有变化，就不会影响到程序的其他功能。



### SOLID 原则

接口是对象能响应的请求的集合。

面向对象编程的五个基本原则。SOLID 指代的五个基本原则分别是：

- 单一功能原则（Single Responsibility Principle）对象应该仅具有一种单一功能。
- 开放封闭原则（Opened Closed Principle）：【对拓展开放，对修改封闭】。说得更准确点，**软件实体（类、模块、函数）可以扩展，但是不可修改**。
- 里式替换原则（Liskov Substitution Principle）程序中的对象应该是可以在不改变程序正确性的前提下被它的子类所替换的。
- 接口隔离原则（Interface Segregation Principle）多个特定客户端接口要好于一个宽泛用途的接口。
- 依赖反转原则（Dependency Inversion Principle）依赖于抽象而不是一个实例，依赖注入是该原则的一种实现方式。





## 概述



Peter Norvig曾说，设计模式是对语言不足的补充，如果要使用设计模式，不如去找一门更好的语言。比如Object.create就是原型模式的天然实现。

在 JavaScript 设计模式中，主要用到的设计模式基本都围绕“单一功能”和“开放封闭”这两个原则来展开。

<mark>设计模式的核心操作是去观察你整个逻辑里面的**变与不变**，然后将变与不变分离，达到使变化的部分灵活、不变的地方稳定的目的。无论是创建型、结构型还是行为型，这些具体的设计模式都是在用自己的方式去封装不同类型的变化</mark> —— 创建型模式封装了创建对象过程中的变化；结构型模式封装的是对象之间组合方式的变化，目的在于灵活地表达对象间的配合与依赖关系；而行为型模式则将是对象千变万化的行为进行抽离，确保我们能够更安全、更方便地对行为进行更改。



<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/6/169f16406d230ffe~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp" style="zoom:50%;" />









## 创建型

### 原型模式

原型模式不单是一种设计模式，也被称为一种编程范型。

原型模式是用于创建对象的一种模式。通过克隆来创建一个一模一样的对象，通过参数来定不同的部分。比如Object.create()方法就是天然的原型模式。



### 单例模式

#### 定义

**单例模式**（Singleton）保证一个类仅有一个实例，意味着当你第二次使用同一个类创建信对象时，应得到和第一次创建对象完全相同。



#### 实现原理

就是用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

```js
const obj;

if(!obj){
	obj = create()
}
return obj
```





##### 静态方法版

```tsx
class SingleDog {
    show() {
        console.log('我是一个单例对象')
    }
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!SingleDog.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            SingleDog.instance = new SingleDog()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return SingleDog.instance
    }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()

// true
s1 === s2
```





##### 闭包版

在 JS 中实现单例模式的通常思路是：将已经生成的对象通过闭包进行维护，下次再次生成新对象时，就直接返回老对象。

```javascript
let SingleUser2 = (function () {
  let instance = null
  function User(name) {
      this.name = name
  }
  return function (name) {
    if(instance){
      return instance
    }
    return instance = new User(name)
  }
})()
```

对将一个构造函数单例化的逻辑可以进一步封装：

```javascript
let singleton = function (fn) {
  let instance = null
  return function (args) {
    if(instance){
      return instance
    }
    return instance = new fn(args)
  }
}
```

凡是使用唯一对象的场景，都适用于单例模式，例如登录框，弹窗，遮罩。另外ES6和CommonJS模块化语法中导出的对象也是单例

```javascript
export default new Vuex.Store({/**/})
```







#### 运用场景

##### 把任何函数都变成一个单例模式的函数（只会被执行一次）

```js
const getSingleFn = function(fn){
	let result;
	return function(){
		return result || (result = fn.apply(this,arguments))
	}
}
```

使用：

```js
const bindEvent = getSingleFn(()=>{
	console.log('执行')
  return true // 一定要有返回值，不然 result为undefined
})
bindEvent()
bindEvent()
bindEvent()
// 只会输出一次‘执行’
```







##### 实现一个 Storage

> 实现：静态方法版

```javascript
// 定义Storage
class Storage {
    static getInstance() {
        // 判断是否已经new过1个实例
        if (!Storage.instance) {
            // 若这个唯一的实例不存在，那么先创建它
            Storage.instance = new Storage()
        }
        // 如果这个唯一的实例已经存在，则直接返回
        return Storage.instance
    }
    getItem (key) {
        return localStorage.getItem(key)
    }
    setItem (key, value) {
        return localStorage.setItem(key, value)
    }
}

const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '李雷')
// 李雷
storage1.getItem('name')
// 也是李雷
storage2.getItem('name')

// 返回true
storage1 === storage2
```

> 实现： 闭包版

```javascript
// 先实现一个基础的StorageBase类，把getItem和setItem方法放在它的原型链上
function StorageBase () {}
StorageBase.prototype.getItem = function (key){
    return localStorage.getItem(key)
}
StorageBase.prototype.setItem = function (key, value) {
    return localStorage.setItem(key, value)
}

// 以闭包的形式创建一个引用自由变量的构造函数
const Storage = (function(){
    let instance = null
    return function(){
        // 判断自由变量是否为null
        if(!instance) {
            // 如果为null则new出唯一实例
            instance = new StorageBase()
        }
        return instance
    }
})()

// 这里其实不用 new Storage 的形式调用，直接 Storage() 也会有一样的效果 
const storage1 = new Storage()
const storage2 = new Storage()

storage1.setItem('name', '李雷')
// 李雷
storage1.getItem('name')
// 也是李雷
storage2.getItem('name')

// 返回true
storage1 === storage2
```

##### 实现一个全局的模态框

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>单例模式弹框</title>
</head>
<style>
    #modal {
        height: 200px;
        width: 200px;
        line-height: 200px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid black;
        text-align: center;
    }
</style>
<body>
	<button id='open'>打开弹框</button>
	<button id='close'>关闭弹框</button>
</body>
<script>
    // 核心逻辑，这里采用了闭包思路来实现单例模式
    const Modal = (function() {
    	let modal = null
    	return function() {
            if(!modal) {
            	modal = document.createElement('div')
            	modal.innerHTML = '我是一个全局唯一的Modal'
            	modal.id = 'modal'
            	modal.style.display = 'none'
            	document.body.appendChild(modal)
            }
            return modal
    	}
    })()
    
    // 点击打开按钮展示模态框
    document.getElementById('open').addEventListener('click', function() {
        // 未点击则不创建modal实例，避免不必要的内存占用;此处不用 new Modal 的形式调用也可以，和 Storage 同理
    	const modal = new Modal()
    	modal.style.display = 'block'
    })
    
    // 点击关闭按钮隐藏模态框
    document.getElementById('close').addEventListener('click', function() {
    	const modal = new Modal()
    	if(modal) {
    	    modal.style.display = 'none'
    	}
    })
</script>
</html>
```













### 构造器模式

```tsx
function User(name , age, career) {
    this.name = name
    this.age = age
    this.career = career 
}
```

像 User 这样当新建对象的内存被分配后，用来初始化该对象的特殊函数，就叫做构造器。在 JavaScript 中，我们使用构造函数去初始化对象，就是应用了**构造器模式**。

**在创建一个user过程中，谁变了，谁不变？**

很明显，变的是每个user的姓名、年龄、工种这些值，这是用户的**个性**，不变的是每个员工都具备姓名、年龄、工种这些属性，这是用户的**共性**。

**那么构造器做了什么？**

构造器是不是将 name、age、career 赋值给对象的过程封装，确保了每个对象都具备这些属性，确保了**共性**的不变，同时将 name、age、career 各自的取值操作开放，确保了**个性**的灵活。

在使用构造器模式的时候，我们本质上是去抽象了每个对象实例的变与不变。那么使用工厂模式时，我们要做的就是去抽象不同构造函数（类）之间的变与不变。构造器解决的是多个对象实例的问题，简单工厂解决的是多个类的问题。当复杂度从多个类共存上升到多个工厂共存时又该怎么处理





### 工厂模式

#### 简单工厂

**工厂模式**（Factory）是用来创建对象的一种最常用的设计模式。我们不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂。工厂模式的目的，就是为了实现**无脑传参**

```javascript
function createUser(role) {
  function User(options) {
    this.name = options.name
    this.viewPage = options.viewPage
  }
  switch(role){
    case 'superAdmin':
      return new User({name:'超级管理员',viewPage:['首页','通讯录','发现页','应用数据','权限管理']});
      break;
    case 'admin':
      return new User({name:'管理员',viewPage:['首页','通讯录','发现页','应用数据']});
      break;
    case 'user':
      return new User({name:'普通用户',viewPage:['首页','通讯录','发现页']});
      break;
    default:
      throw new Error('参数错误')
  }
}
createUser('admin')
```

上面的代码就是一种最常见的工厂模式。

如果要把多个构造函数生成实例的逻辑封装到某个工厂中，也可以将构造函数挂载到工厂函数的原型链上，或者工厂函数的静态方法中：

```javascript
function createUser(role) {
  return new this[role]
}
createUser.prototype.superAdmin = function () {
  this.name = '超级管理员'
  this.viewPage = ['首页','通讯录','发现页','应用数据','权限管理']
}
createUser.prototype.admin = function () {
  this.name = '管理员'
  this.viewPage = ['首页','通讯录','发现页','应用数据']
}
createUser.prototype.user = function () {
  this.name = '普通用户'
  this.viewPage = ['首页','通讯录','发现页']
}

let user = new createUser('admin')
```

以下几种情景下，开发者应该考虑使用工厂模式：

- 对象的构建十分复杂
- 需要依赖具体环境创建不同实例
- 处理大量具有相同属性的小对象





#### 抽象工厂

抽象类去降低扩展的成本，同时需要对类的性质作划分，于是有了这样的四个关键角色：

- **抽象工厂（抽象类，它不能被用于生成具体实例）：** 用于声明最终目标产品的共性。在一个系统里，抽象工厂可以有多个（大家可以想象我们的手机厂后来被一个更大的厂收购了，这个厂里除了手机抽象类，还有平板、游戏机抽象类等等），每一个抽象工厂对应的这一类的产品，被称为“产品族”。
- **具体工厂（用于生成产品族里的一个具体的产品）：** 继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。
- **抽象产品（抽象类，它不能被用于生成具体实例）：** 上面我们看到，具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。
- **具体产品（用于生成产品族里的一个具体的产品所依赖的更细粒度的产品）：** 比如我们上文中具体的一种操作系统、或具体的一种硬件等。

抽象工厂模式的定义，是**围绕一个超级工厂创建其他工厂**。

```tsx
class MobilePhoneFactory {
    // 提供操作系统的接口
    createOS(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
    // 提供硬件的接口
    createHardWare(){
        throw new Error("抽象工厂方法不允许直接调用，你需要将我重写！");
    }
}

// 具体工厂继承自抽象工厂
class FakeStarFactory extends MobilePhoneFactory {
    createOS() {
        // 提供安卓系统实例
        return new AndroidOS()
    }
    createHardWare() {
        // 提供高通硬件实例
        return new QualcommHardWare()
    }
}

// 定义操作系统这类产品的抽象产品类
class OS {
    controlHardWare() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
    controlHardWare() {
        console.log('我会用安卓的方式去操作硬件')
    }
}

class AppleOS extends OS {
    controlHardWare() {
        console.log('我会用🍎的方式去操作硬件')
    }
}


// 定义手机硬件这类产品的抽象产品类
class HardWare {
    // 手机硬件的共性方法，这里提取了“根据命令运转”这个共性
    operateByOrder() {
        throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
    operateByOrder() {
        console.log('我会用高通的方式去运转')
    }
}

class MiWare extends HardWare {
    operateByOrder() {
        console.log('我会用小米的方式去运转')
    }
}


/*好了，如此一来，当我们需要生产一台FakeStar手机时，我们只需要这样做：*/

// 这是我的手机
const myPhone = new FakeStarFactory()
// 让它拥有操作系统
const myOS = myPhone.createOS()
// 让它拥有硬件
const myHardWare = myPhone.createHardWare()
// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()


/*关键的时刻来了——假如有一天，FakeStar过气了，我们需要产出一款新机投入市场，这时候怎么办？我们是不是不需要对抽象工厂MobilePhoneFactory做任何修改，只需要拓展它的种类：*/

class newStarFactory extends MobilePhoneFactory {
    createOS() {
        // 操作系统实现代码
    }
    createHardWare() {
        // 硬件实现代码
    }
}
/*这么个操作，对原有的系统不会造成任何潜在影响 所谓的“对拓展开放，对修改封闭”就这么圆满实现了。前面我们之所以要实现抽象产品类，也是同样的道理。*/
```















## 结构型

### 适配器模式

**适配器模式**（Adapter）是将一个类（对象）的接口（方法或属性）转化成用户希望的另外一个接口（方法或属性），适配器模式使得原本由于接口不兼容而不能一起工作的那些类（对象）可以正常工作。（说白了就是在这个方法上多包装一层，使得别人能用）

1. 适配器模式主要解决两个接口之间不匹配的问题，不会改变原有的接口，而是由一个对象对另一个对象的包装。
2. 适配器模式符合开放封闭原则

```javascript
//因为我们不能轻易的改变第三方的内容。所以在BaiduMap的基础上封装一层。
class GooleMap {
    show() {
        console.log('渲染谷歌地图')
    }
}

class BaiduMap {
    display() {
        console.log('渲染百度地图')
    }
}


// 定义适配器类, 对BaiduMap类进行封装
class BaiduMapAdapter {
    show() {
        var baiduMap = new BaiduMap()
        return baiduMap.display() 
    }
}

function render(map) {
    if (map.show instanceof Function) {
        map.show()
    }
}

render(new GooleMap())         // 渲染谷歌地图
render(new BaiduMapAdapter())  // 渲染百度地图

/*or*/
// 用适配器适配旧的Ajax方法
async function Ajax(type, url, data, success, failed) {
    await AjaxAdapter(type, url, data, success, failed)
}
```

全部被 Adapter 封装进了自己复杂的底层逻辑里，暴露给用户的都是十分简单的统一的东西——统一的接口，统一的入参，统一的出参，统一的规则。



### 装饰器模式

[推荐看看core-decorators这个库](https://github.com/jayphelps/core-decorators)core-decorators 帮我们实现好了一些使用频率较高的装饰器，比如`@readonly`(使目标属性只读)、`@deprecate`(在控制台输出警告，提示用户某个指定的方法已被废除)等等等等。

**装饰器模式**（Decorator）是指允许向一个现有的对象添加新的功能，同时又不改变其结构。使得多个不同类或者对象之间共享或者扩展一些方法或者行为的时候，更加优雅。



装饰器模式在生活中也可以很容易找到相关的例子：例如手机壳，他并没有改变我们手机原有的功能，比如打电话，听音乐什么的。但却为手机提供了新的功能：防磨防摔等。

以下是装饰器模式在js中实现的简单实现：

```javascript
function Phone() {

}
Phone.prototype.makeCall = function () {
  console.log('拨通电话');
}

function decorate(target) {
  target.prototype.code = function () {
    console.log('写代码');
  }
  return target
}

Phone = decorate(Phone)

const phone = new Phone()
```

上例，通过`decorate`函数来装饰构造函数`Phone`，使得`Phone`的实例既可以打电话，也可以写代码。如此，我们将功能单独抽离出来，依次得到复用，例如再次使用decorate函数去装饰构造函数`Pad`等等

示例：

`ES7`的语言标准中提出了装饰器语法，但一直处于Stage-2状态，没有正式通过。目前Node环境与所有浏览器都尚未支持装饰器语法，如果想使用装饰器语法，可以通过babel来转译：

安装babel：

`npm install -D @babel/core babel-cli babel-preset-es2015 --registry https://registry.npm.taobao.org`

安装babel插件来识别装饰器语法：

`npm install -D babel-plugin-transform-decorators-legacy --registry https://registry.npm.taobao.org `

新建Babel配置文件`.babelrc`：

```javascript
{
  "presets":["es2015"],
  "plugins":["transform-decorators-legacy"]
}
```



使用装饰器语法改造上面的例子：

```javascript
function code (target) {
  target.prototype.code = function () {
    console.log('写代码');
  }
}

@code
class Phone {
  makeCall () {
    console.log('打电话');
  }
}

const phone = new Phone();
```

运行 `npm script: babel index.js -o bulid.js`

装饰器不光可以装饰类，还可以装饰方法

```javascript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  // 此时target是 Math.prototype , name是方法名，即'add' 
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  var oldValue = descriptor.value;
  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();
//现在调用add方法，则会触发log功能
math.add(2, 4);
```

npm包`core-decorators`将常用的装饰器工具进行了封装

安装：

`npm install core-decorators -D --registry https://registry.npm.taobao.org`

使用：

```javascript
import { readonly,autobind, deprecate} from 'core-decorators';

class Phone {
  @autobind
  makeCall () {
    console.log(this);
    console.log('打电话');
  }
}

const phone = new Phone();
window.phone = phone
```

> 以上代码使用了ES6模块化语法，若想在浏览器环境中运行，请使用webpack编译后引入
>
> `npm install webpack webpack-cli -D --registry https://registry.npm.taobao.org`
>
> npm script: `babel index3.js -o build.js && webpack build.js`

同样的，滥用装饰器也会使代码本身逻辑变得扑朔迷离，如果确定一段代码不会在其他地方用到，或者一个函数的核心逻辑就是这些代码，那么就没有必要将它取出来作为一个装饰器来存在。





### 代理模式

#### 定义

**代理模式**（Proxy）为对象提供另一个代理对象以控制对这个对象的访问。

本体对象和代理对象拥有相同的方法，在用户看来并不知道请求的本体对象还是代理对象。而且哪天不想用代理了也能无成本切换到本体。

在编写业务代码的时候，往往不需要去预先猜测是否需要使用代理模式。当真正发现不方便直接访问某个对象的时候，再编写代理也不迟。

#### 根据代理的用途进行分类(本质都是代理，分个毛类)

开发中最常见的四种代理类型：事件代理、虚拟代理、缓存代理和保护代理（比如proxy）。

- 虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。比如懒加载，合并请求和缓存等
- 保护代理用于控制不同权限的对象对目标对象的访问。
- 缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。比如vue 的 computed。比如 分页请求，同一页的数据理论上只需要去后台拉取一次，这些已经拉取到的数据在某个地方被缓存之后，下次再请求同一页的时候，便可以直接使用之前的数据。



#### 将任何函数都加层缓存代理

```js
/**************** 创建缓存代理的工厂 *****************/
var createProxyFactory = function (fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ', '); // 把函数的参数合成一个字符串用以作为缓存的标识
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = fn.apply(this, arguments)); // 没有缓存才执行函数
  };
};

// 使用
var proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus);
```







#### 虚拟代理举例

##### 图片懒加载

```js
class MyImage {
    constructor() {
        this.img = new Image()
        document.body.appendChild(this.img)
    }
    setSrc(src) {
        this.img.src = src
    }
}

class ProxyImage {
    constructor() {
        this.proxyImage = new Image()
    }

    setSrc(src) {
        let myImageObj = new MyImage()
        myImageObj.img.src = 'file://xxx.png'  //为本地图片url
        this.proxyImage.src = src
        this.proxyImage.onload = function() { // 元素onload了再请求图片
            myImageObj.img.src = src
        }
    }
}

var proxyImage = new ProxyImage() //对外访问的是proxy对象
proxyImage.setSrc('http://xxx.png') //服务器资源url
```



本例中，本体类中有自己的setSrc方法，如果有一天网络速度已经不需要预加载了，我们可以直接使用本体对象的setSrc方法,，并且不需要改动本体类的代码。

```js
// 依旧可以满足需求
var myImage = new MyImage()
myImage.setSrc('http://xxx.png')
```







##### 合并请求

收集一段时间之内的请求，最后一次性发送给服务器。比如我们等待2秒之后才把这2秒之内的所有请求发给服务器。

```js
var synchronousFile = function (id) {
  console.log('开始同步文件，id为： ' + id);
};

var proxySynchronousFile = (function () {
  var cache = [], // 保存一段时间内需要同步的ID
    timer; // 定时器

  return function (id) {
    cache.push(id);
    if (timer) {
      // 保证不会覆盖已经启动的定时器
      return;
    }

    timer = setTimeout(function () {
      synchronousFile(cache.join(', ')); // 2秒后向本体发送需要同步的ID集合
      clearTimeout(timer); // 清空定时器
      timer = null;
      cache.length = 0; // 清空ID集合
    }, 2000);
  };
})();

var checkbox = document.getElementsByTagName('input');

for (var i = 0, c; (c = checkbox[i++]); ) {
  c.onclick = function () {
    if (this.checked === true) {
      proxySynchronousFile(this.id);
    }
  };
}
```











#### 缓存代理举例

computed的缓存结果也一样，都是用参数做缓存的key，预请求插件的缓存也是用参数做可以。

计算乘积：

```js
var mult = function () {
  console.log('开始计算乘积');
  var a = 1;
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i];
  }
  return a;
};

mult(2, 3); // 输出：6
mult(2, 3, 4); // 输出：24`
var proxyMult = (function () {
  var cache = {};
  return function () {
    var args = Array.prototype.join.call(arguments, ', ');
    if (args in cache) {
      return cache[args];
    }
    return (cache[args] = mult.apply(this, arguments));
  };
})();

proxyMult(1, 2, 3, 4); // 输出：24
proxyMult(1, 2, 3, 4); // 输出：24
```









### 区分**适配器模式、**装饰器模式**、**代理模式**

适配器模式提供不同的**新接口**，通常用作接口转换的**兼容**处理

代理模式提供一模一样的**新接口**，对行为进行**拦截**

装饰器模式，直接访问**原接口**，直接对原接口进行功能上的**增强**





### 外观模式

#### 定义

**外观模式**（Facade），是指为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子系统接口的访问更容易。

外观模式的作用是对客户屏蔽一组子系统的复杂性。外观模式对客户提供一个简单易用的高层接口，高层接口会把客户的请求转发给子系统来完成具体的功能实现。大多数客户都可以通过请求外观接口来达到访问子系统的目的。但在一段使用了外观模式的程序中，请求外观并不是强制的。如果外观不能满足客户的个性化需求，那么客户也可以选择越过外观来直接访问子系统。

拿全自动洗衣机的一键洗衣按钮举例，这个一键洗衣按钮就是一个外观。如果是老式洗衣机，客户要手动选择浸泡、洗衣、漂洗、脱水这4个步骤。如果这种洗衣机被淘汰了，新式洗衣机的漂洗方式发生了改变，那我们还得学习新的漂洗方式。而全自动洗衣机的好处很明显，不管洗衣机内部如何进化，客户要操作的，始终只是一个一键洗衣的按钮。这个按钮就是为一组子系统所创建的外观。但如果一键洗衣程序设定的默认漂洗时间是20分钟，而客户希望这个漂洗时间是30分钟，那么客户自然可以选择越过一键洗衣程序，自己手动来控制这些“子系统”运转。



#### 与其它模式区分

外观模式的作用和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。

外观模式核心在于对其他接口的封装

注意区分**工厂模式**和**外观模式**：

工厂模式核心是对创建对象的逻辑进行封装。

外观模式核心是对不同的接口进行封装。





#### js中的外观模式

外观模式容易跟普通的封装实现混淆。这两者都封装了一些事物，但外观模式的关键是定义一个高层接口去封装一组“子系统”。子系统在C++或者Java中指的是一组类的集合，这些类相互协作可以组成系统中一个相对独立的部分。在JavaScript中我们通常不会过多地考虑“类”，如果将外观模式映射到JavaScript中，这个子系统至少应该指的是一组函数的集合。最简单的外观模式应该是类似下面的代码：

```js
        var A = function(){
            a1();
            a2();
        }

        var B = function(){
            b1();
            b2();
        }

        var facade = function(){
            A();
            B();
        }

        facade();
```









## 行为型



### 观察者模式

#### 定义

它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

观察者模式要解决的问题，就是在一个持续产生事件的系统中，如何分割功能，让不同模块只需要处理一部分逻辑，这种分而治之的思想是基本的系统设计概念，当然，“分”很容易，关键是如何“治”。观察者模式对“治”这个问题提的解决方法是这样，将逻辑分为发布者（Publisher）和观察者（Observer），其中发布者只管负责产生事件，它会通知所有注册挂上号的观察者，而不关心这些观察者如何处理这些事件，相对的，观察者可以被注册上某个发布者，只管接收到事件之后就处理，而不关心这些数据是如何产生的。



#### 推or拉模型

在编程的世界中，所谓“拉”（pull）或者“推”（push），都是从数据消费者角度的描述，比如，在网页应用中，如果是网页主动通过AJAX请求从服务器获取数据，这是“拉”，如果网页和服务器建立了websocket通道，然后，不需要网页主动请求，服务器都可以通过websocket通道推送数据到网页中，这是“推”。



在JavaScript中，无需纠结选择使用推模型还是拉模型。因为我们是使用回调函数的形式，通过参数直接传给要执行的函数，使用Function.prototype.apply方法把所有参数都推送给订阅者，所以我们一般都会选择推模型。

- 推模型是指在事件发生时，发布者一次性把所有更改的状态和数据都推送给订阅者。
- 拉模型是，发布者仅仅通知订阅者事件已经发生了，此外发布者提供一些公开的接口供订阅者来主动拉取数据。拉模型的好处是可以让订阅者“按需获取”，但同时有可能让发布者变成一个“门户大开”的对象，同时增加了代码量和复杂度。











#### 作用 & 优缺点

- 作用

1. 发布—订阅模式可以应用于异步编程中，这是一种替代传递回调函数的方案。比如，我们可以订阅ajax请求的error、succ等事件。或者如果想在动画的每一帧完成之后做一些事情，那我们可以订阅一个事件，然后在动画的每一帧完成之后发布这个事件。在异步编程中使用发布—订阅模式，我们就无需过多关注对象在异步运行期间的内部状态，而只需要订阅感兴趣的事件发生点。
2. 发布—订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。发布—订阅模式让两个对象松耦合地联系在一起，虽然不太清楚彼此的细节，但这不影响它们之间相互通信。当有新的订阅者出现时，发布者的代码不需要任何修改；同样发布者需要改变时，也不会影响到之前的订阅者。只要之前约定的事件名没有变化，就可以自由地改变它们。





- 优点：
  - 一为时间上的解耦，二为对象之间的解耦。
  - 既可以用在异步编程中，也可以帮助我们完成更松耦合的代码编写。
  - 还可以用来帮助实现一些别的设计模式，比如中介者模式。
  - 无论是MVC还是MVVM，都少不了发布—订阅模式的参与。
  - JavaScript本身也是一门基于事件驱动的语言。
- 缺点：
  - 创建订阅者本身要消耗一定的时间和内存，而且当你订阅一个消息后，也许此消息最后都未发生，但这个订阅者会始终存在于内存中。
  - 发布—订阅模式虽然可以弱化对象之间的联系，但如果过度使用的话，对象和对象之间的必要联系也将被深埋在背后，会导致程序难以跟踪维护和理解。（发布-订阅模式的缺点）







#### 两种模式怎么选

如果两个模块之间本身存在关联，且这种关联是稳定的、必要的，那么我们使用观察者模式就足够了。而在模块与模块之间独立性较强、且没有必要单纯为了数据通信而强行为两者制造依赖的情况下，我们往往会倾向于使用发布-订阅模式（说白了就是为了给两个模块解耦）。





#### 观察者模式

##### 定义

**发布者直接触及到订阅者**的操作，叫观察者模式。两者是有点耦合的，发布者里维护了订阅者列表，和订阅方法，触发订阅者列表方法。

观察者模式里两个核心的角色要素——**“发布者”**与**“订阅者”**。角色划分 --> 状态变化 --> 发布者通知到订阅者，这就是观察者模式的“套路”



##### 应用场景&实现

vue的响应式



###### 把一个对象改造成观察者模式里的发布者

```js
const event = {
    clientList: {},
    listen(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
    },
    trigger(key,params) {
        const fns = this.clientList[key];

        if (!fns || fns.length === 0) {
            // 如果没有绑定对应的消息
            return false;
        }

        for (var i = 0, fn; (fn = fns[i++]); ) {
            fn.apply(this, params); // (2) // arguments是trigger时带上的参数
        }
    },
    remove( key, fn ){
      var fns = this.clientList[ key ];

      if ( ! fns ){    // 如果key对应的消息没有被人订阅，则直接返回
        return false;
      }
      if ( ! fn ){    // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
        fns && ( fns.length = 0 );
      }else{
        for ( var l = fns.length -1; l >=0; l-- ){    // 反向遍历订阅的回调函数列表
            var _fn = fns[ l ];
            if ( _fn === fn ){
                fns.splice( l, 1 );    // 删除订阅者的回调函数
            }
        }
      }
  };
};

const installEvent = function (obj) {
    for (const i in event) {
        obj[i] = event[i];
    }
};
```





###### 各业务需要感知登录成功

登录模块就是上面的发布者。

对用户信息感兴趣的业务模块订阅登录成功的消息事件。当登录成功时，登录模块只需要发布登录成功的消息，而业务方接受到消息之后，就会开始进行各自的业务处理（比如管理购物车、订单、收货地址等），登录模块不需要了解业务方的内部细节。

```js
$.ajax( 'http://xxx.com? login', function(data){    // 登录成功
	login.trigger( 'loginSucc', data);    // 发布登录成功的消息
});

var header = (function(){        // header模块
    login.listen( 'loginSucc', function( data){ // 订阅登录成功信息
      header.setAvatar( data.avatar );
    });
    return {
      setAvatar: function( data ){
          console.log( ’设置header模块的头像’ );
      }
    }
})();

var nav = (function(){    // nav模块
    login.listen( 'loginSucc', function( data ){
      nav.setAvatar( data.avatar );
    });
    return {
      setAvatar: function( avatar ){
          console.log( ’设置nav模块的头像’ );
      }
    }
})();
```





##### 传统面向对象里的观察者模式

在Java中实现一个自己的发布—订阅模式，通常会把订阅者对象自身当成引用传入发布者对象中，同时订阅者对象还需提供一个名为诸如update的方法，供发布者对象在适合的时候调用。而在JavaScript中，我们用注册回调函数的形式来代替传统的发布—订阅模式，显得更加优雅和简单。

```javascript
/*JAVA里的观察者模式*/
class Publisher {
    constructor() {
        this.observers = [] //拉个群准备把订阅者们都拉进来
    }
    add(observer) { //把订阅者拉进群
        this.observers.push(observer)
    }
    remove(observer) { //把某个订阅者移出群聊
        this.observers = this.observers.filter(item => item !== observer)
    }
    notify() { //通知所有订阅者 某个业务更新了 
        this.observers.forEach(item => {
            item.update(this) //通知订阅者 某个业务更新了  --  这个就是连通发布者和订阅者的渠道
        })
    }
}


class Observer {
    constructor() {}
    update(publisher) {} //某个业务更新啦，得去干活啦
}

/*使用*/
// 定义一个具体的需求文档（prd）发布类
class PrdPublisher extends Publisher {
    constructor() {
        super()
        // 初始化需求文档
        this.prdState = null
        // 韩梅梅还没有拉群，开发群目前为空
        this.observers = []
        console.log('PrdPublisher created')
    }
    
    // 该方法用于获取当前的prdState
    getState() {
        console.log('PrdPublisher.getState invoked')
        return this.prdState
    }
    
    // 该方法用于改变prdState的值
    setState(state) {
        console.log('PrdPublisher.setState invoked')
        // prd的值发生改变
        this.prdState = state
        // 需求文档变更，立刻通知所有开发者
        this.notify()
    }
}

class DeveloperObserver extends Observer {
    constructor() {
        super()
        // 需求文档一开始还不存在，prd初始为空对象
        this.prdState = {}
        console.log('DeveloperObserver created')
    }
    
    // 重写一个具体的update方法
    update(publisher) {
        console.log('DeveloperObserver.update invoked')
        // 更新需求文档
        this.prdState = publisher.getState()
        // 调用工作函数
        this.work()
    }
    
    // work方法，一个专门搬砖的方法
    work() {
        // 获取需求文档
        const prd = this.prdState
        // 开始基于需求文档提供的信息搬砖。。。
        ...
        console.log('996 begins...')
    }
}

// 创建订阅者：前端开发李雷
const liLei = new DeveloperObserver()
// 创建订阅者：服务端开发小A（sorry。。。起名字真的太难了）
const A = new DeveloperObserver()
// 创建订阅者：测试同学小B
const B = new DeveloperObserver()
// 韩梅梅出现了
const hanMeiMei = new PrdPublisher()
// 需求文档出现了
const prd = {
    // 具体的需求内容
    ...
}
// 韩梅梅开始拉群
hanMeiMei.add(liLei)
hanMeiMei.add(A)
hanMeiMei.add(B)
// 韩梅梅发送了需求文档，并@了所有人
hanMeiMei.setState(prd)
```





#### 发布-订阅模式

##### 简介

**发布者不直接触及到订阅者、而是一切都由统一的第三方来完成实际的通信的操作，叫做发布-订阅模式**。

订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event作为一个类似“中介者”的角色，把订阅者和发布者联系起来。



留意一个问题，模块之间如果用了太多的全局发布—订阅模式来通信，那么模块与模块之间的联系就被隐藏了。我们最终会搞不清楚消息来自哪个模块，这又会给我们的维护带来一些麻烦。



##### 应用场景

**全局事件总线**---Event Bus（Vue、Flutter 等前端框架中有出镜）和 Event Emitter（Node中有出镜），就是一种发布-订阅模式；



##### 先发布再订阅

###### 应用场景

先将之前发布的操作保存下来（不执行），等到有对象来订阅它的时候，再执行发布操作。

比如：QQ的离线消息一样，离线消息被保存在服务器中，接收人下次登录上线之后，可以重新收到这条消息。

比如：商城网站中，获取到用户信息之后才能渲染用户导航模块。当ajax请求成功返回之后会发布一个事件，在此之前订阅了此事件的用户导航模块可以接收到这些用户信息。但是如果ajax返回得比较快，而此时用户导航模块的代码还没有加载好（还没有订阅相应事件），特别是在用了一些模块化惰性加载的技术后，这是很可能发生的事情。





###### 解决思路

建立一个存放离线事件的堆栈，当事件发布的时候，如果此时还没有订阅者来订阅这个事件，我们暂时把发布事件的动作包裹在一个函数里，这些包装函数将被存入堆栈中，等到有对象来订阅此事件的时候，我们将遍历堆栈并且依次执行这些包装函数，即重新发布里面的事件。当然离线事件的生命周期只有一次，就像QQ的未读消息只会被重新阅读一次，所以刚才的操作我们只能进行一次。

较完整版实现里包含了这部分。





##### 实现

###### 简单版

```js
/**发布订阅 - 简单版*/
export function addSubscribtion(subscribtions,callback) { 
  subscribtions.push(callback) //在全局维护subscribtions订阅列表。

  const removeSubscribtion = () => {
    const idx = subscribtions.indexOf(callback);
    if (idx > -1) {
      subscribtions.splice(idx,1)
    }
  }
  return removeSubscribtion
}
export function triggerSubscriptions(subscribtions, ...args) {
  subscribtions.slice().forEach(cb=>cb(...args))
}
```



###### 较完整版

```javascript
/**发布订阅 - 较完整版*/
class EventEmitter {
    constructor() {
        this.eventsEmitters = {}
+      	this.cacheParams={} //为了实现先发布再订阅所需要的缓存，你可以设计成只缓存最近一次发布的事件，也可以缓存所有发布过的事件
    }
    on(eventName,cb) { //注册事件
        if (!this.eventsEmitters[eventName]) this.eventsEmitters[eventName] = []
        this.eventsEmitters[eventName].push(cb)
      
      	/*实现先发布再订阅：如果订阅的时候已经有缓存该事件的参数了，说明该事件发布过，所以该函数要执行*/
+      	if(Array.isArray(this.cacheParams[eventName])){
+        	cb.apply(null,this.cachaParams[eventName])
+        }
      
    }
    emit(eventName, ...args) { //触发事件
        const emitters = this.eventsEmitters[eventName].slice() // 对这个eventName的回调函数数组进行一次浅拷贝，用这个浅拷贝出来的值去做循环是为了避免当执行用once安装的回调函数时会删掉这个函数导致的一些问题
        emitters.forEach(item => {
            item(...args)
        })
      
      	/*实现先发布再订阅：缓存下触发过的事件及其相应的最新一次的参数*/
+      	this.cacheParams[eventName] = args
    }
    off(eventName, cb) { //解除事件
        const index = this.eventsEmitters[eventName].indexOf(cb)
        if(index!==-1) this.eventsEmitters[eventName].splice(index,1)
    }
    once(eventName, cb) { //注册一次性事件
        if (!this.eventsEmitters[eventName]) this.eventsEmitters[eventName] = []
        const wrapper = (...args) => {//包装一层，使它执行完传入的回调函数之后就删掉它
            cb(...args)
            this.off(eventName,wrapper)
        }
        this.eventsEmitters[eventName].push(wrapper)
    }
}
```



















### 状态模式

#### 定义

状态模式中是把对象的每种状态都进行封装。避免大量if-else。

状态模式也许是解决某些需求场景的最好方法。虽然状态模式并不是一种简单到一目了然的模式（它往往还会带来代码量的增加），状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变。

#### 大量if-else存在的问题

1. 通过if-else覆盖所有情况，可能代码冗长。
2. 每次新增或减少某种情况都需要修改代码，违反开放—封闭原则。
3. 复用性差，比如别的地方只比这里少了两种情况，你就只能重写一份if-else。



#### 举例





##### 台灯的各种状态

假设有一个台灯，一开始是关闭状态，按下开关后会变成弱光状态，再次按下按钮会变成强光状态，再次按下按钮会变成关闭状态。如果不使用状态模式：

```javascript
class Lamp {
  constructor() {
    this.state = 'off'
  }

  pressButton() {
    if (this.state === 'off') {
      console.log('弱光');
      this.state = 'weakLight';
    } else if (this.state === 'weakLight') {
      console.log('强光');
      this.state = 'strongLight';
    } else if (this.state === 'strongLight') {
      console.log('关灯');
      this.state = 'off';
    }
  };
}
```

这样做存在有如下问题：

- 每次新增或者修改状态名，都需要改动`pressButton`方法中的代码。（不符合开放-封闭原则）
- 状态之间的切换关系，不只是往`pressButton`方法里堆砌if、else语句，增加或者修改一个状态可能需要改变若干个操作，这使`pressButton`更加难以阅读和维护

如果使用状态模式，将状态封装成类，在JS中可以这样实现：

```javascript
class Lamp {
  constructor() {
    this.offLightState = new OffLightState()
    this.weakLightState = new WeakLightState()
    this.strongLightState = new StrongLightState()
    this.state = this.offLightState
  }
  pressButton(){
    this.state.trigger.call(this)
  }
}
class OffLightState {
  trigger (){
    console.log( '弱光' );
    this.state = this.weakLightState
  };
}
class WeakLightState {
  trigger (){
    console.log( '强光' );
    this.state = this.strongLightState
  };
}
class StrongLightState {
  trigger (){
    console.log( '关灯' );
    this.state = this.offLightState;
  };
}
```

如果状态不需要封装成类，可以用普通对象代替：

```javascript
class Lamp {
  constructor() {
    this.state = FSM.offLightState
  }
  pressButton(){
    this.state.trigger.call(this)
  }
}
//有限状态机
//1. 状态总数是有限的
//2. 任一时刻，只处在一种状态之中
//3. 某种条件下，会从一种状态转变到另外一种状态
const FSM = {
  offLightState: {
    trigger() {
      console.log('弱光');
      this.state = FSM.weakLightState
    }
  },
  weakLightState: {
    trigger(){
      console.log('强光');
      this.state = FSM.strongLightState
    }
  },
  strongLightState:{
    trigger(){
      console.log('关灯');
      this.state = FSM.offLightState
    }
  }
};
```



#### 应用场景

以下这些情况中，我们应该考虑状态模式：

1. 一个对象的行为取决于它的状态，并且它必须在运行时刻根据状态改变它的行为。
2. 一个操作中含有大量的分支语句，而且这些分支语句依赖于该对象的状态。

示例：

业务代码：tab栏，货物物流状态，音乐播放器的循环模式，游戏中各种状态等





#### 策略模式与状态模式的区别

<mark>核心区别：策略模式和状态模式确实是相似的，它们都封装行为、都通过委托来实现行为分发。但策略模式中的行为函数是”潇洒“的行为函数，它们不依赖调用主体。而状态模式中的行为函数，首先是和状态主体之间存在着关联，由状态主体把它们串在一起。</mark>

1. 目的和用途：
   - 状态模式：状态模式主要用于管理对象在不同状态下的行为和状态转换。它允许一个对象在其内部状态发生变化时改变其行为，使得对象看起来好像在运行时改变了它的类。
   - 策略模式：策略模式主要用于定义一组算法，将每个算法封装成一个独立的策略对象，并使客户端能够在运行时选择使用哪个策略。它将算法的选择与算法的实现分离开来，以提供更大的灵活性。
2. UML类图表示：
   - 状态模式通常涉及一个上下文类（Context）和多个具体状态类（Concrete State），上下文类包含一个状态对象，根据状态对象的不同调用不同的方法。
   - 策略模式包含一个上下文类和多个具体策略类（Concrete Strategy），上下文类包含一个策略对象，通过委托给策略对象执行相应的操作。
3. 适用场景：
   - 状态模式适用于对象有多个状态，且在不同状态下会有不同行为的情况，例如订单的状态：待付款、已付款、已发货等。
   - 策略模式适用于需要在运行时选择不同算法或策略的情况，例如排序算法、支付方式选择、动画缓动函数等。





1. **行为的变化方式**：比如动物的叫声示例中，`makeSound` 函数并没有维护对象的状态，而是依赖于传入的不同策略对象（`Duck`、`Chicken`、`Dog`）来执行不同的行为。这种方式更符合策略模式的特点。
2. **状态模式的重点**：状态模式主要关注对象在不同状态下的行为和状态之间的转换。通常，状态模式会在上下文对象内部维护一个状态，并根据状态的改变来改变对象的行为。在状态模式中，通常会有一个状态接口和多个具体状态类，而状态切换是由上下文对象控制的。在动物的叫声示例的示例中，并没有明显的状态切换或状态维护。
3. **对象生命周期**：在状态模式中，对象的状态通常在其生命周期内发生多次变化，而在策略模式中，对象通常在其生命周期内只使用一个策略，但可以在运行时更改策略。在你的示例中，`makeSound` 函数的每次调用都可以选择不同的策略，而不是管理对象状态的生命周期内状态的变化。

虽然动物的叫声代码示例的名称可能会与状态相关（例如，`Duck`、`Chicken`、`Dog` 可以被视为不同的动物状态），但它们的用法更符合策略模式的特征。状态模式通常涉及更复杂的状态管理和状态切换逻辑。如果要将这个示例改成状态模式，通常会有更多的复杂性，例如需要在动物状态之间进行切换，并且上下文对象会根据状态自动执行不同的行为。







### 策略模式

#### 定义

策略模式是指定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换。



#### 在JS中的策略模式

在JavaScript这种将函数作为一等对象的语言里，策略模式已经融入到了语言本身当中，我们经常用高阶函数来封装不同的行为，并且把它传递到另一个函数中。当我们对这些函数发出“调用”的消息时，不同的函数会返回不同的执行结果。在JavaScript中，“函数对象的多态性”来得更加简单。





#### 介绍

策略模式利用组合、委托和多态等技术和思想，可以避免多重条件选择语句。

只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们。比如缓动函数(linear,ease-in-out,ease,ease-in.......)，当用animation的时候直接用这些就行，想用哪个缓动函数就用哪个（这就叫可以互相替换）。再比如将表单校验的各种方法提取出来，然后选了哪个校验方法就执行哪个。

有点像状态模式，但是状态模式是把状态提取成对象，策略模式是把策略提取成函数。



#### 大量if-else存在的问题

1. 通过if-else覆盖所有情况，可能代码冗长。
2. 每次新增或减少某种情况都需要修改代码，违反开放—封闭原则。
3. 复用性差，比如别的地方只比这里少了两种情况，你就只能重写一份if-else。

#### 举例

##### 例一

```javascript
//例一：
let obj = {
  "A": function(salary) {
    return salary * 4;
  },
  "B" : function(salary) {
    return salary * 3;
  },
  "C" : function(salary) {
    return salary * 2;
  }
};
let calculateBonus =function(level,salary) {
  return obj[level](salary);
};

// 使用
console.log(calculateBonus('A',10000)); // 40000
```



##### 例二

其实可以用高阶函数去替代

```js
//例二：
/*所有跟计算奖金有关的逻辑不再放在Context中，而是分布在各个策略对象中。Context把计算奖金这个能力委托给了某个策略对象。当我们对这些策略对象发出“计算奖金”的请求时，它们会返回各自不同的计算结果，这正是对象多态性的体现，也是“它们可以相互替换”的目的。替换Context中当前保存的策略对象，便能执行不同的算法来得到我们想要的结果。*/
// 对于vip客户
function vipPrice() {
    this.discount = 0.5;
}

vipPrice.prototype.getPrice = function (price) {
    return price * this.discount;
}
// 对于超级客户
function superVipPrice() {
    this.discount = 0.3;
}

superVipPrice.prototype.getPrice = function (price) {
    return price * this.discount;
}
// 对于普通客户
function Price() {
    this.discount = 1;
}

Price.prototype.getPrice = function (price) {
    return price;
}

// 上下文，对于客户端的使用
function Context() {
    this.name = '';
    this.strategy = null;
    this.price = 0;
}

Context.prototype.set = function (name, strategy, price) {
    this.name = name;
    this.strategy = strategy;
    this.price = price;
}
Context.prototype.getResult = function () {
    console.log(this.name + ' 的结账价为: ' + this.strategy.getPrice(this.price));
}


// 使用
var context = new Context();
var vip = new vipPrice();
context.set('vip客户', vip, 200);
context.getResult(); 

var old = new superVipPrice();
context.set('超级Vip客户', old, 200);
context.getResult(); 

var Price = new Price();
context.set('普通客户', Price, 200);
context.getResult(); 
```





##### 动物的叫声

没用模式前：

```js
        var makeSound = function( animal ){
            if ( animal instanceof Duck ){
              console.log( ’嘎嘎嘎’ );
            }else if ( animal instanceof Chicken ){
              console.log( ’咯咯咯’ );
            }
        };

        var Duck = function(){};
        var Chicken = function(){};

        makeSound( new Duck() );      // 输出：嘎嘎嘎
        makeSound( new Chicken() );   // 输出：咯咯咯
```

动物世界里增加一只狗之后，makeSound函数必须改成：

```js
        var makeSound = function( animal ){
            if ( animal instanceof Duck ){
              console.log( ’嘎嘎嘎’ );
            }else if ( animal instanceof Chicken ){
              console.log( ’咯咯咯’ );
            }else if ( animal instanceof Dog ){     // 增加跟狗叫声相关的代码
              console.log(’汪汪汪’ );
          }
        };

        var Dog = function(){};
        makeSound( new Dog() );    // 增加一只狗
```



利用模式改造：

其实可以用高阶函数去替代

把程序中不变的部分隔离出来（动物都会叫），然后把可变的部分封装起来（不同类型的动物发出不同的叫声），这样一来程序就具有了可扩展性。当我们想让一只狗发出叫声时，只需增加一段代码即可，而不用去改动原有的makeSound函数。

```js
        var makeSound = function( animal ){
            animal.sound();
        };

        var Duck = function(){};

        Duck.prototype.sound = function(){
            console.log( ’嘎嘎嘎’ );
        };

        var Chicken = function(){};

        Chicken.prototype.sound = function(){
            console.log( ’咯咯咯’ );
        };

        makeSound( new Duck() );     // 嘎嘎嘎
        makeSound( new Chicken() );  // 咯咯咯

        /********* 增加动物狗，不用改动原有的makeSound函数 ****************/

        var Dog = function(){};
        Dog.prototype.sound = function(){
            console.log( ’汪汪汪’ );
        };

        makeSound( new Dog() );     // 汪汪汪
```







#### 策略模式与状态模式的区别

<mark>核心区别：策略模式和状态模式确实是相似的，它们都封装行为、都通过委托来实现行为分发。但策略模式中的行为函数是”潇洒“的行为函数，它们不依赖调用主体。而状态模式中的行为函数，首先是和状态主体之间存在着关联，由状态主体把它们串在一起。</mark>

1. 目的和用途：
   - 状态模式：状态模式主要用于管理对象在不同状态下的行为和状态转换。它允许一个对象在其内部状态发生变化时改变其行为，使得对象看起来好像在运行时改变了它的类。
   - 策略模式：策略模式主要用于定义一组算法，将每个算法封装成一个独立的策略对象，并使客户端能够在运行时选择使用哪个策略。它将算法的选择与算法的实现分离开来，以提供更大的灵活性。
2. UML类图表示：
   - 状态模式通常涉及一个上下文类（Context）和多个具体状态类（Concrete State），上下文类包含一个状态对象，根据状态对象的不同调用不同的方法。
   - 策略模式包含一个上下文类和多个具体策略类（Concrete Strategy），上下文类包含一个策略对象，通过委托给策略对象执行相应的操作。
3. 适用场景：
   - 状态模式适用于对象有多个状态，且在不同状态下会有不同行为的情况，例如订单的状态：待付款、已付款、已发货等。
   - 策略模式适用于需要在运行时选择不同算法或策略的情况，例如排序算法、支付方式选择、动画缓动函数等。





1. **行为的变化方式**：比如动物的叫声示例中，`makeSound` 函数并没有维护对象的状态，而是依赖于传入的不同策略对象（`Duck`、`Chicken`、`Dog`）来执行不同的行为。这种方式更符合策略模式的特点。
2. **状态模式的重点**：状态模式主要关注对象在不同状态下的行为和状态之间的转换。通常，状态模式会在上下文对象内部维护一个状态，并根据状态的改变来改变对象的行为。在状态模式中，通常会有一个状态接口和多个具体状态类，而状态切换是由上下文对象控制的。在动物的叫声示例的示例中，并没有明显的状态切换或状态维护。
3. **对象生命周期**：在状态模式中，对象的状态通常在其生命周期内发生多次变化，而在策略模式中，对象通常在其生命周期内只使用一个策略，但可以在运行时更改策略。在你的示例中，`makeSound` 函数的每次调用都可以选择不同的策略，而不是管理对象状态的生命周期内状态的变化。

虽然动物的叫声代码示例的名称可能会与状态相关（例如，`Duck`、`Chicken`、`Dog` 可以被视为不同的动物状态），但它们的用法更符合策略模式的特征。状态模式通常涉及更复杂的状态管理和状态切换逻辑。如果要将这个示例改成状态模式，通常会有更多的复杂性，例如需要在动物状态之间进行切换，并且上下文对象会根据状态自动执行不同的行为。

















### 迭代器模式

#### 定义

**迭代器模式**（Iterator）是指提供一种方法顺序访问一个聚合对象中各个元素, 而又无须暴露该对象的内部结构。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。它就解决这一个问题——遍历。

这种设计模式的实现方式很多，但是不管对应的函数如何命名，通常都应该包含这样几个函数：

❑ getCurrent，获取当前被游标所指向的元素。

❑ moveToNext，将游标移动到下一个元素，调用这个函数之后，getCurrent获得的元素就会不同。

❑ isDone，判断是否已经遍历完所有的元素。



迭代器模式分为 **内部迭代器** 和 **外部迭代器**

#### 内部迭代器

内部迭代器就是在函数内部定义好迭代的规则，它完全接手整个迭代的过程，外部调用就行。

```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8]

let each = function(arr, callback){
  for(let i=0; i<arr.length; i++){
    callback.call(null, i, arr[i])    //把下标和元素当作参数传递给callback参数
  }
}

each(arr, function(i, value){
  console.log(i, value);
})
```

内部迭代器在调用时非常方便，但使用回调自由度有限，例如用户想在迭代途中暂停，或者同时迭代两个数组。



#### 内部迭代器应用场景--代替if/else去判断哪个东西能用

场景：ABC三个东西，如果有A就用A，没有就用B，如果B也没有就用C。

原：

```js
var getUploadObj = function () {
  try {
    return A;
  } catch (e) {
    if (B) {
      return B;
    } else {
      return C;
    }
  }
};
```

迭代器模式改造：

```js
var iteratorUploadObj = function(){
    for ( var i = 0, fn; fn = arguments[ i++ ]; ){
      var uploadObj = fn();
      if ( uploadObj ! == false ){ // 如果这个东西能用就返回这个东西
          return uploadObj;
      }
    }
};
var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj ); // 根据优先级传入。
```



如果以后有来个D、E，如果是第一种写法就要修改代码写多几个if/else或try/catch，但是迭代器就直接`var uploadObj = iteratorUploadObj( getActiveUploadObj, getFlashUploadObj, getFormUpladObj,D,E )`即可







#### 外部迭代器

外部迭代器是指调用者显式地请求迭代下一个元素，虽然这样做会增加调用的复杂度，但也会增强迭代的操作灵活性：

```javascript
var Iterator = function (obj) {
  var current = 0;

  var next = function () {
    current += 1;
  };

  var isDone = function () {
    return current >= obj.length;
  };

  var getCurrItem = function () {
    return obj[current];
  };

  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem,
    length: obj.length
  };
};


// 使用：判断2个数组里元素的值是否完全相等
var compare = function( iterator1, iterator2 ){
    if(iterator1.length ! == iterator2.length){
      alert('iterator1和iterator2不相等’);
    }
    while( ! iterator1.isDone() && ! iterator2.isDone() ){
      if ( iterator1.getCurrItem() ! == iterator2.getCurrItem() ){
            throw new Error ( 'iterator1和iterator2不相等’ );
      }
      iterator1.next();
      iterator2.next();
    }

    alert ( 'iterator1和iterator2相等’ );
}
```



#### JS中的迭代器

ES6语法中提出了迭代器的概念，以下对象默认实现了ES6规定的迭代器接口

- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象

提供了调用之后能返回迭代器的接口的对象被称为`可迭代对象`。ES6中可以用`for...of`，`扩展运算符(...)`，数组解构，`Array.from`等语法迭代。

ES6提出的`Generator函数`运行后的结果就是一个可迭代对象，结合例如`co`的自动执行器，可以达到用同步代码写异步逻辑的目的：

```javascript
const co = require('co')
const {readFile} = require('fs')
const { promisify } = require("util");
const path = require('path')
const file1 = path.join(__dirname, './text/1.txt')
const file2 = path.join(__dirname, './text/2.txt')
const readFileP = promisify(readFile)

function* f() {
  let data1 = yield readFileP(file1)
  console.log('耶，完成了1,数据是' + data1);
  let data2 = yield readFileP(file2)
  console.log('耶，完成了2,数据是' + data2);
}

co(f)
```

`npm install co -D --registry https://registry.npm.taobao.org`









### 命令模式 -- 高阶函数替代它

#### 定义

命令模式中的命令（command）指的是一个执行某些特定事情的指令。还支持撤销、排队等操作。dyc说这应该叫订单模式，把各个命令都放到这个订单里，且这个订单在各个模块中流转，每个模块看到订单就执行自己的命令，且订单中可以撤销和排队。

相对于过程化的请求调用，command对象拥有更长的生命周期。因为这个请求已经被封装在了command对象的方法中，成为了这个对象的行为。我们可以在程序运行的任意时刻去调用这个方法，就像厨师可以在客人预定1个小时之后才帮他炒菜，相当于程序在1个小时之后才开始执行command对象的方法。





#### 宏命令

宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。比如：只要按一个特别的按钮，它就会帮我们关上房间门，顺便打开电脑并登录QQ。







#### JS中的命令模式

JavaScript可以用高阶函数非常方便地实现命令模式。命令模式在JavaScript语言中是一种隐形的模式。





#### 应用场景

1. **实现撤销和重做功能：** 通过将操作封装为命令对象，你可以轻松地记录操作历史，以便实现撤销和重做功能。
2. **处理延迟执行：** 你可以将命令对象存储在队列中，以后再执行，从而实现延迟执行的需求，比如在定时器触发时执行某些操作。
3. **实现事务性操作：** 当需要确保一组相关操作要么都成功执行，要么都不执行时，命令模式很有用。
4. **减少发送者和接收者的耦合：** 发送者（调用者）无需知道接收者（执行者）的详细信息，只需与命令对象交互即可

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。







#### [#](http://iwenwiki.com/webdoc/09JavaScript设计模式/#代码实现-9)传统面向对象命令模式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>cmd-demo</title>
</head>
<body>
    <div>
        <button id="btn1">按钮1</button>
        <button id="btn2">按钮2</button>
    </div>
    <script>
        var btn1 = document.getElementById('btn1')
        var btn2 = document.getElementById('btn2')

        // 定义一个命令发布者(执行者)的类
        class Executor {
            setCommand(btn, command) {
                btn.onclick = function() {
                    command.execute()
                }
            }
        }

        // 定义一个命令接收者
        class Menu {
            refresh() {
                console.log('刷新菜单')
            }

            addSubMenu() {
                console.log('增加子菜单')
            }
        }

        // 定义一个刷新菜单的命令对象的类
        class RefreshMenu {
            constructor(receiver) {
                // 命令对象与接收者关联
                this.receiver = receiver
            }

            // 暴露出统一的接口给命令发布者Executor
            execute() {
                this.receiver.refresh()
            }
        }

        // 定义一个增加子菜单的命令对象的类
        class AddSubMenu {
            constructor(receiver) {
                // 命令对象与接收者关联
                this.receiver = receiver
            }
            // 暴露出统一的接口给命令发布者Executor
            execute() {
                this.receiver.addSubMenu()
            }
        }

        var menu = new Menu()
        var executor = new Executor()

        var refreshMenu = new RefreshMenu(menu)
        // 给按钮1添加刷新功能
        executor.setCommand(btn1, refreshMenu)

        var addSubMenu = new AddSubMenu(menu)
        // 给按钮2添加增加子菜单功能
        executor.setCommand(btn2, addSubMenu)
    </script>
</body>
</html>
```





### 模版方法模式 -- 高阶函数替代它

比如挂钩hooks



### 桥接模式

将抽象与实现分离

```javascript
let each = function (arr,callback) {
  for (let i = 0; i < arr.length; i++) {
    callback.call(null,i,arr[i])
  }
}

```

```javascript
let singleton = function (fn) {
  let instance = null
  return function (args) {
    if(instance){
      return instance
    }
    return instance = new fn(args)
  }
}
let singleUser = singleton(User)
```

### 组合模式

又称整体-部分模式。将所有对象组成树形结构，只要操作某一层，下面所有的对象都执行相同的操作。

验证表单下所有字段：

```javascript
let form = {
  fields:[]
}
form.validate = function () {
  let isFormLegal = true
  this.fields.forEach(field => {
    let isLegal = field.validate()
    if(!isLegal){
      isFormLegal = false
    }
  })
  return isFormLegal
}
```



### 享元模式

将对象的公共部分抽离并且缓存，如此一来在创建大量对象时可以节省内存开销。

```javascript
function Iphone(model, screen, memory, SN) {
  this.flyweight = flyweightFactory.get(model, screen, memory);
  this.SN = SN;
}
function IphoneFlyweight(model, screen, memory) {
  this.model = model;
  this.screen = screen;
  this.memory = memory;
}
let flyweightFactory = (function () {
  let iphones = {};
  return {
    get: function (model, screen, memory) {
      let key = model + screen + memory;
      if (!iphones[key]) {
        iphones[key] = new IphoneFlyweight(model, screen, memory);
      }
      return iphones[key];
    }
  };
})();

let phones = [];
for (let i = 0; i < 1000000; i++) {
  let memory = i % 2 == 0 ? 16 : 32;
  phones.push(new Iphone("iphone6s", 5.0, memory, i));
}
console.log(phones);
```

享元模式的应用：线上表格，可以将dom抽离出来，看上去是在滚动，实际只是改变当前单元格的内容。省去了大量创建dom的开销。



### 备忘录模式

撤销到上次的状态。把原先的数据保存下来，一旦需要撤销到上次状态就把上次状态的数据覆盖回来。

vuex时光旅行

### 中介者模式

使用一层中介者，来处理多对多的逻辑关系。

mvc模式中的controller

















































































































































































































































































































































































































































# V8垃圾回收

## 垃圾回收的概念

**垃圾回收**：JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。

**回收机制**：

- Javascript 具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放，原理就是找到不再使用的变量，然后释放掉其占用的内存。
- JavaScript中存在两种变量：局部变量和全局变量。全局变量的生命周期会持续要页面卸载；而局部变量声明在函数中，它的生命周期从函数执行开始，直到函数执行结束，在这个过程中，局部变量会在堆或栈中存储它们的值，当函数执行结束后，这些局部变量不再被使用，它们所占有的空间就会被释放。

## 垃圾回收的方式

### 栈的垃圾回收

通过ESP指针，空闲的执行上下文就会被释放。

### 堆的垃圾回收 --- 分代式垃圾回收

#### 介绍

因为在实际的应用中，对象的生存周期长短不一，不同的算法只能针对特定情况具有最好的效果。

V8的垃圾回收策略主要基于分代式垃圾回收机制。按对象的存活时间将内存的垃圾回收进行不同的分代，然后分别对不同分代的内存施以更高效的算法。V8中主要将内存分为新生代和老生代两代。新生代中的对象为存活时间较短的对象，老生代中的对象为存活时间较长或常驻内存的对象。



#### 大小

新生代内存的最大值在64位系统和32位系统上分别为32 MB和16 MB。老生代的设置在64位系统下为1400 MB，在32位系统下为700 MB。--max-old-space-size命令行参数可以用于设置老生代内存空间的最大值，--max-new-space-size命令行参数则用于设置新生代内存空间的大小的。

![image-20230811142953214](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-11-14-29-image-20230811142953214.png)



#### 源码解释内存大小

在下面的代码中，Page::kPageSize的值为1MB。

```c
// semispace_size_ should be a power of 2 and old_generation_size_ should be 
// a multiple of Page::kPageSize 
#if defined(V8_TARGET_ARCH_X64) 
#define LUMP_OF_MEMORY (2 * MB) 
 code_range_size_(512*MB), 
#else 
#define LUMP_OF_MEMORY MB 
 code_range_size_(0), 
#endif 
#if defined(ANDROID) 
 reserved_semispace_size_(4 * Max(LUMP_OF_MEMORY, Page::kPageSize)), 
 max_semispace_size_(4 * Max(LUMP_OF_MEMORY, Page::kPageSize)), 
 initial_semispace_size_(Page::kPageSize), 
 max_old_generation_size_(192*MB), 
 max_executable_size_(max_old_generation_size_), 
#else 
 reserved_semispace_size_(8 * Max(LUMP_OF_MEMORY, Page::kPageSize)), 
 max_semispace_size_(8 * Max(LUMP_OF_MEMORY, Page::kPageSize)), 
 initial_semispace_size_(Page::kPageSize), 
 max_old_generation_size_(700ul * LUMP_OF_MEMORY), 
 max_executable_size_(256l * LUMP_OF_MEMORY), 
#endif
//新生代内存，它由两个reserved_semispace_size_所构成，后面将描述其原因。按机器位数不同，reserved_semispace_size_在64位系统和32位系统上分别为16 MB和8 MB。
```



V8堆内存的最大保留空间可以从下面的代码中看出来，其公式为4 * reserved_semispace_ size_ + max_old_generation_size_：

```c
 // Returns the maximum amount of memory reserved for the heap. For 

 // the young generation, we reserve 4 times the amount needed for a 

 // semi space. The young generation consists of two semi spaces and 

 // we reserve twice the amount needed for those in order to ensure 

 // that new space can be aligned to its size 

 intptr_t MaxReserved() { 

 return 4 * reserved_semispace_size_ + max_old_generation_size_; 

 } 
```





#### 新生代用Scavenge算法

新生代中的对象主要通过Scavenge算法进行垃圾回收。在Scavenge的具体

实现中，主要采用了Cheney算法。Cheney算法是一种采用复制的方式实现的垃圾回收算法。它将堆内存一分为二，每一部分空

间称为semispace。在这两个semispace空间中，只有一个处于使用中，另一个处于闲置状态。处于使用状态的semispace空间称为From空间，处于闲置状态的空间称为To空间。当我们分配对象时，先是在From空间中进行分配。当开始进行垃圾回收时，会检查From空间中的存活对象，这些存活对象将被复制到To空间中，而非存活对象占用的空间将会被释放。完成复制后，From空间和To空间的角色发生对换。简而言之，在垃圾回收的过程中，就是通过将存活对象在两个semispace空间之间进行复制。Scavenge的缺点是只能使用堆内存中的一半，这是由划分空间和复制机制所决定的。但Scavenge由于只复制存活的对象，并且对于生命周期短的场景存活对象只占少部分，所以它在时间效率上有优异的表现。由于Scavenge是典型的牺牲空间换取时间的算法，所以无法大规模地应用到所有的垃圾回收中。但可以发现，Scavenge非常适合应用在新生代中，因为新生代中对象的生命周期较短，恰恰适合这个算法。

当一个对象经过多次复制依然存活时，它将会被认为是生命周期较长的对象。这种较长生命周期的对象随后会被移动到老生代中，采用新的算法进行管理。对象从新生代中移动到老生代中的过程称为晋升。在单纯的Scavenge过程中，From空间中的存活对象会被复制到To空间中去，然后对From空间和To空间进行角色对换（又称翻转）。但在分代式垃圾回收的前提下，From空间中的存活对象在复制到To空间之前需要进行检查。在一定条件下，需要将存活周期长的对象移动到老生代中，也就是完成对象晋升。对象晋升的条件主要有两个，一个是对象是否经历过Scavenge回收，一个是To空间的内存占用比超过限制。在默认情况下，V8的对象分配主要集中在From空间中。对象从From空间中复制到To空间时，会检查它的内存地址来判断这个对象是否已经经历过一次Scavenge回收。如果已经经历过了，会将该对象从From空间复制到老生代空间中，如果没有，则复制到To空间中。

另一个判断条件是To空间的内存占用比。当要从From空间复制一个对象到To空间时，如果To空间已经使用了超过25%，则这个对象直接晋升到老生代空间中。设置25%这个限制值的原因是当这次Scavenge回收完成后，这个To空间将变成From空间，接下来的内存分配将在这个空间中进行。如果占比过高，会影响后续的内存分配。对象晋升后，将会在老生代空间中作为存活周期较长的对象来对待，接受新的回收算法处理。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-11-14-31-image-20230811143114150.png" alt="image-20230811143114150" style="zoom:50%;" />               <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-11-14-31-image-20230811143147785.png" alt="image-20230811143147785" style="zoom: 50%;" />





#### 老生代

看《深入浅出node.js》内存控制那一章。





#### 通过增量标记(incremental marking)来进行回收

将原本要一口气停顿完成的动作改为增量标记（incremental marking），也就是拆分为许多小“步进”，每做完一“步进”就让JavaScript应用逻辑执行一小会儿，垃圾回收与应用逻辑交替执行直到标记阶段完成。



V8后续还引入了延迟清理（lazy sweeping）与增量式整理（incremental compaction），让清理与整理动作也变成增量式的。同时还计划引入并行标记与并行清理，进一步利用多核性能降低每次停顿的时间。





浏览器通常使用的垃圾回收方法有两种：标记清除，引用计数。

 **1）标记清除**

- 标记清除是浏览器常见的垃圾回收方式，当变量进入执行环境时，就标记这个变量“进入环境”，被标记为“进入环境”的变量是不能被回收的，因为他们正在被使用。当变量离开环境时，就会被标记为“离开环境”，被标记为“离开环境”的变量会被内存释放。
- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

**2）引用计数**

- 另外一种垃圾回收机制就是引用计数，这个用的相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变为0时，说明这个变量已经没有价值，因此，在在机回收期下次再运行时，这个变量所占有的内存空间就会被释放出来。
- 这种方法会引起**循环引用**的问题：例如：` obj1`和`obj2`通过属性进行相互引用，两个对象的引用次数都是2。当使用循环计数时，由于函数执行完后，两个对象都离开作用域，函数执行结束，`obj1`和`obj2`还将会继续存在，因此它们的引用次数永远不会是0，就会引起循环引用。

```javascript
function fun() {
    let obj1 = {};
    let obj2 = {};
    obj1.a = obj2; // obj1 引用 obj2
    obj2.a = obj1; // obj2 引用 obj1
}
```

这种情况下，就要手动释放变量占用的内存：

```javascript
obj1.a =  null
 obj2.a =  null
```







#### 查看垃圾回收日志

查看垃圾回收日志的方式主要是在启动时添加--trace_gc参数。在进行垃圾回收时，将会从标准输出中打印垃圾回收的日志信息。下面是一段示例，执行结束后，将会在gc.log文件中得到所有垃圾回收信息：

`node --trace_gc -e "var a = [];for (var i = 0; i < 1000000; i++) a.push(new Array(100));" > gc.log `



通过在Node启动时使用--prof参数，可以得到V8执行时的性能分析数据，其中包含了垃圾回收执行时占用的时间。

$ node --prof test01.js 

这将会在目录下得到一个v8.log日志文件。该日志文件基本不具备可读性，所幸，V8提供了linux-tick-processor工具用于统计日志信息。该工具可以从Node源码的deps/v8/tools目录下找到，Windows下的对应命令文件为windows-tick-processor.bat。将该目录添

加到环境变量PATH中，即可直接调用：

$ linux-tick-processor v8.log 









## 减少垃圾回收

虽然浏览器可以进行垃圾自动回收，但是当代码比较复杂时，垃圾回收所带来的代价比较大，所以应该尽量减少垃圾回收。

- **对数组进行优化：** 在清空一个数组时，最简单的方法就是给其赋值为[ ]，但是与此同时会创建一个新的空对象，可以将数组的长度设置为0，以此来达到清空数组的目的。
- **对**`object`**进行优化：** 对象尽量复用，对于不再使用的对象，就将其设置为null，尽快被回收。
- **对函数进行优化：** 在循环中的函数表达式，如果可以复用，尽量放在函数的外面。





# 常用工具

## 函数

### 基础

#### 获取指定的最大范围内的随机整数

```javascript
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

console.log(getRandomInt(3));
// expected output: 0, 1 or 2

console.log(getRandomInt(1));
// expected output: 0

console.log(Math.random());
// expected output: a number from 0 to <1
```



#### 获取url参数

```js
/**
 * 方法一 
 * 使用 URL 这个对象，URL 接口用于解析，构造，规范化和编码 URLs
 */
const url = new URL(window.location.href);
const paramValue = url.searchParams.get( paramName );
console.log(paramValue);

/**
 * 
 * 方法二
 * 
 */
// 获取url中全部参数的对象
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1] // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&") // 将字符串以 & 分割后存到数组中
  let paramsObj = {}
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("=") // 分割 key 和 value
      val = decodeURIComponent(val) // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val // 判断是否转为数字
      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val)
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true
    }
  })
  return paramsObj
}

```





#### 解析 URL 参数为对象

```javascript
function parseUrltoObj(url) {
    const str = /.+\?(.+)/.exec(url)[1]// 将 ? 后面的字符串取出来
    const keyAndValuePairArr = str.split('&') // 将字符串以 & 分割后存到数组中
    const resultObj = {}
    keyAndValuePairArr.forEach(item => {
        if (/=/.test(item)) { //处理有value的
            let [key, value] = item.split('=')
            value = /^\d+$/.test(value)? +value : value //如果value全是数字则将它转化为数字类型.url里面应该传不了浮点数吧
                
            
            if (resultObj[key]) { // 万一有重复的key
                resultObj[key] = [].concat(resultObj[key],value) //那就把这个key下原本的值跟新值都塞到一个数组里然后把这个数组赋值给resultObj[key]
            } else {
                resultObj[key]= value
            }
        } else { //没value的就把键塞进对象里即可,随便赋个值给他敷衍一下
            resultObj[item] = true
        }
    })
    return resultObj
}

//测试
console.log(parseUrltoObj('https://regexr.com/test?fuck=2&ddd=%22d'))
```



### 字符串

#### 去除字符串多余空格

```javascript
    function trimSurplusBlank(string){
        return string.replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s{2,}/g,' ')
      //第一个replace去除首空格，第二个replace去除尾空格，第三个replace去除字符串中间多余的空格
    }
```

#### 判断字符串是否为json数据

```js
function isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    }
```





### 异步

#### 睡眠函数

```javascript
const delay = time => {
	//time单位为ms
	typeof time !== 'number' ? (time = 0) : null
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, time)
	})
}
```





## 库

### 装饰模式库 ——core-decorators

[推荐看看core-decorators这个库](https://github.com/jayphelps/core-decorators)





## 封装一个常用工具库

```js
(function () {
    /* 检测数据类型 */
    const class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty;
    const toType = function toType(obj) {
        let reg = /^\[object ([\w\W]+)\]$/;
        if (obj == null) return obj + "";
        return typeof obj === "object" || typeof obj === "function" ?
            reg.exec(toString.call(obj))[1].toLowerCase() :
            typeof obj;
    };
    const isFunction = function isFunction(obj) {
        return typeof obj === "function" &&
            typeof obj.nodeType !== "number" &&
            typeof obj.item !== "function";
    };
    const isWindow = function isWindow(obj) {
        return obj != null && obj === obj.window;
    };
    const isArrayLike = function isArrayLike(obj) {
        let length = !!obj && "length" in obj && obj.length,
            type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) return false;
        return type === "array" || length === 0 ||
            (typeof length === "number" && length > 0 && (length - 1) in obj);
    };
    const isPlainObject = function isPlainObject(obj) {
        let proto, Ctor;
        if (!obj || toString.call(obj) !== "[object Object]") return false;
        proto = Object.getPrototypeOf(obj);
        if (!proto) return true;
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && Ctor === Object;
    };
    const isEmptyObject = function isEmptyObject(obj) {
        let keys = Object.getOwnPropertyNames(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        return keys.length === 0;
    };
    const isNumeric = function isNumeric(obj) {
        var type = toType(obj);
        return (type === "number" || type === "string") &&
            !isNaN(obj - parseFloat(obj));
    };

    /* 函数的防抖和节流 */
    const clearTimer = function clearTimer(timer) {
        if (timer) clearTimeout(timer);
        return null;
    };
    const debounce = function debounce(func, wait, immediate) {
        if (typeof func !== "function") throw new TypeError("func is not a function!");
        if (typeof wait === "boolean") {
            immediate = wait;
            wait = undefined;
        }
        wait = +wait;
        if (isNaN(wait)) wait = 300;
        if (typeof immediate !== "boolean") immediate = false;
        let timer = null;
        return function operate(...params) {
            let now = !timer && immediate;
            timer = clearTimer(timer);
            timer = setTimeout(() => {
                if (!immediate) func.call(this, ...params);
                timer = clearTimer(timer);
            }, wait);
            if (now) func.call(this, ...params);
        };
    };
    const throttle = function throttle(func, wait) {
        if (typeof func !== "function") throw new TypeError("func is not a function!");
        wait = +wait;
        if (isNaN(wait)) wait = 300;
        let timer = null,
            previous = 0;
        return function operate(...params) {
            let now = +new Date(),
                remaining = wait - (now - previous);
            if (remaining <= 0) {
                func.call(this, ...params);
                previous = +new Date();
                timer = clearTimer(timer);
            } else if (!timer) {
                timer = setTimeout(() => {
                    func.call(this, ...params);
                    previous = +new Date();
                    timer = clearTimer(timer);
                }, remaining);
            }
        };
    };

    /* 数组和对象的操作 */
    const mergeArray = function mergeArray(first, second) {
        if (typeof first === "string") first = Object(first);
        if (typeof second === "string") second = Object(second);
        if (!isArrayLike(first)) first = [];
        if (!isArrayLike(second)) second = [];
        let len = +second.length,
            j = 0,
            i = first.length;
        for (; j < len; j++) {
            first[i++] = second[j];
        }
        first.length = i;
        return first;
    };
    const each = function each(obj, callback) {
        let isArray = isArrayLike(obj),
            isObject = isPlainObject(obj);
        if (!isArray && !isObject) throw new TypeError('obj must be a array or likeArray or plainObject');
        if (!isFunction(callback)) throw new TypeError('callback is not a function');
        if (isArray) {
            for (let i = 0; i < obj.length; i++) {
                let item = obj[i],
                    index = i;
                if (callback.call(item, item, index) === false) break;
            }
            return obj;
        }
        let keys = Object.getOwnPropertyNames(obj);
        if (typeof Symbol !== "undefined") keys = keys.concat(Object.getOwnPropertySymbols(obj));
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i],
                value = obj[key];
            if (callback.call(value, value, key) === false) break;
        }
        return obj;
    };
    const merge = function merge(...params) {
        let options,
            target = params[0],
            i = 1,
            length = params.length,
            deep = false,
            treated = params[length - 1];
        toType(treated) === 'set' ? length-- : treated = new Set();
        if (typeof target === "boolean") {
            deep = target;
            target = params[i];
            i++;
        }
        if (target == null || (typeof target !== "object" && !isFunction(target))) target = {};
        for (; i < length; i++) {
            options = params[i];
            if (options == null) continue;
            if (treated.has(options)) return options;
            treated.add(options);
            each(options, (copy, name) => {
                let copyIsArray = Array.isArray(copy),
                    copyIsObject = isPlainObject(copy),
                    src = target[name];
                if (deep && copy && (copyIsArray || copyIsObject)) {
                    if (copyIsArray && !Array.isArray(src)) src = [];
                    if (copyIsObject && !isPlainObject(src)) src = {};
                    target[name] = merge(deep, src, copy, treated);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            });
        }
        return target;
    };
    const clone = function clone(...params) {
        let target = params[0],
            deep = false,
            length = params.length,
            i = 1,
            isArray,
            isObject,
            result,
            treated;
        if (typeof target === "boolean" && length > 1) {
            deep = target;
            target = params[1];
            i = 2;
        }
        treated = params[i];
        if (!treated) treated = new Set();
        if (treated.has(target)) return target;
        treated.add(target);
        isArray = Array.isArray(target);
        isObject = isPlainObject(target);
        if (target == null) return target;
        if (!isArray && !isObject && !isFunction(target) && typeof target === "object") {
            try {
                return new target.constructor(target);
            } catch (_) {
                return target;
            }
        }
        if (!isArray && !isObject) return target;
        result = new target.constructor();
        each(target, (copy, name) => {
            if (deep) {
                result[name] = clone(deep, copy, treated);
                return;
            }
            result[name] = copy;
        });
        return result;
    };

    /* 设定具备有效期的localStorage存储方案 */
    const storage = {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify({
                time: +new Date(),
                value
            }));
        },
        get(key, cycle = 2592000000) {
            cycle = +cycle;
            if (isNaN(cycle)) cycle = 2592000000;
            let data = localStorage.getItem(key);
            if (!data) return null;
            let { time, value } = JSON.parse(data);
            if ((+new Date() - time) > cycle) {
                storage.remove(key);
                return null;
            }
            return value;
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    const utils = {
        toType,
        isFunction,
        isWindow,
        isArrayLike,
        isPlainObject,
        isEmptyObject,
        isNumeric,
        debounce,
        throttle,
        mergeArray,
        each,
        merge,
        clone,
        storage
    };

    /* 处理冲突 */
    if (typeof window !== "undefined") {
        let $ = window._;
        utils.noConflict = function noConflict() {
            if (window._ === utils) {
                window._ = $;
            }
            return utils;
        };
    }

    /* 导出API */
    if (typeof window !== "undefined") window.utils = window._ = utils;
    if (typeof module === "object" && typeof module.exports === "object") module.exports = utils;
})();
```



# 异常

webkit下跨域的js在非同步上下文抛异常 只能拿到script error

https://bugs.webkit.org/show_bug.cgi?id=132945

非同步上下文就是events、promise等，如：<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-11-07-11-19-image-20231107111953190.png" alt="image-20231107111953190" style="zoom:50%;" />





# 注释

## 1、折叠代码

![image-20210928191231563](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20210928191231563.png)



# 面试题

## proxy&reflect

### 实现数组倒序访问

如：`var arr=[1, 2, 3, 4]; arr[-1] 返回 4，arr[-2] 返回 3`。

```js
var arr = [1, 2, 3, 4];
var proxy = new Proxy(arr, {
  get(target, propKey, receiver) {
    let nPropKey = parseInt(propKey);
    if (nPropKey < 0) {
      if (Math.abs(nPropKey) <= target.length) {
        return target[target.length + nPropKey];
      } else {
        return "访问越界";
      }
    }
    return Reflect.get(target, propKey, receiver);
  },
});
console.log(proxy[-1]); // 4
console.log(proxy[-2]); // 3
console.log(proxy[-100]); // 访问越界
console.log(proxy[0]); // 1
```



## 场景题

### 图片上有一个人脸，除了脸部以外加上蒙层

思路：

添加遮罩层，在图片上方添加一张只有这张图片里人脸的图片：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图片添加蒙层</title>
    <style type="text/css">
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
        }

        .overlay {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .5);
            z-index: 100;
        }
    </style>
</head>

<body>
    <div class="overlay">
        <img src="../images/mask.png" style="width:200px" />
    </div>
    <img src="../images/cat.png" />
</body>

</html>
```

最终实现效果：（没有用一模一样的图片，只是模拟了类似的效果）

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd506f46c966467f9ca42e4a0fc4c6ee~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

上述是在整个页面添加蒙层，若想只在图片部分添加蒙层：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图片添加蒙层</title>
    <style type="text/css">
        img {
            width: 300px;
        }

        .overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .5);
            z-index: 100;
        }
    </style>
</head>

<body>
    <div style="position: relative;width: 300px;">
        <div class="overlay">
            <img src="../images/kid.png" style="width:200px" />
        </div>
        <img src="../images/cat.png" />
    </div>
</body>

</html>
复制代码
```

效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9998e021460d411e952d37589f9c6856~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)





### 一个公告栏，每一天都展示，当用户点击关闭后今天不显示，明天（过了今天零点）还会显示

我给出的方案就是在localStorage中存储用户关闭公告栏的时间戳，等再次进入页面的时候判断是不是存在localStorage：

- 若不存在则证明从来没有关闭过公告栏，那就显示；
- 若存在，就判断时间戳和当前时间是否是同一天，不是同一天就显示



### 实现一个函数，入参是一个fn，延迟5s执行，并且拿到返回值

```js
function sleep(fn) {
    return new Promise(resolve => {
        setTimeout(() => {
            let res = fn()
            resolve(res)
        }, 5000)
    })
}

function f() {
    return 1
}

console.log(Date.now())
sleep(f).then(res => {
    console.log(res, Date.now())
})
```




# 大概念

## 虚拟dom



### 虚拟DOM的理解

从本质上来说，Virtual Dom是一个JavaScript对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能，而且无须手动操作DOM。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。



### 虚拟DOM的解析过程

vdom如何生成？在vue中我们常常会为组件编写模板 - template， 这个模板会被编译器 - compiler编译为渲染函数，在接下来的挂载（mount）过程中会调用render函数，返回的对象就是虚拟dom。但它们还不是真正的dom，所以会在后续的patch过程中进一步转化为dom。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007160852614.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007160852614.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007160852614.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007160852614.png" loading="lazy"/>
  </picture>

挂载过程结束后，vue程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新render，此时就会生成新的vdom，和上一次的渲染结果diff就能得到变化的地方，从而转换为最小量的dom操作，高效更新视图

- 首先对将要插入到文档中的 DOM 树结构进行分析，使用 js 对象将其表示出来，比如一个元素对象，包含 TagName、props 和 Children 这些属性。然后将这个 js 对象树给保存下来，最后再将 DOM 片段插入到文档中。
- 当页面的状态发生改变，需要对页面的 DOM 的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异。
- 最后将记录的有差异的地方应用到真正的 DOM 树中去，这样视图就更新了。

### 为什么要用虚拟DOM

**（1）保证性能下限**

看一下页面渲染的流程：**解析HTML -> 生成DOM** **->** **生成 CSSOM** **->** **Layout** **->** **Paint** **->** **Compiler**

下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗∶频繁的dom操作容易引起页面的重绘和回流，但是通过抽象 VNode 进行中间处理，可以有效减少直接操作dom的次数，从而减少页面重绘和回流

Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。

**（2）跨平台**

Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。

###  虚拟DOM真的比真实DOM性能好吗

- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
- 在真实DOM操作的时候进行针对性的优化时还是更快的。







## 如何保存页面的当前的状态

既然是要保持页面的状态（其实也就是组件的状态），那么会出现以下两种情况：

- 前组件会被卸载
- 前组件不会被卸载

那么可以按照这两种情况分别得到以下方法：



### **组件会被卸载：**

**（1）将状态存储在LocalStorage / SessionStorage**

只需要在组件即将被销毁的生命周期中在 LocalStorage / SessionStorage 中把当前组件的 state 通过 JSON.stringify() 储存下来就可以了。在这里面需要注意的是组件更新状态的时机。



比如从 B 组件跳转到 A 组件的时候，A 组件需要更新自身的状态。但是如果从别的组件跳转到 B 组件的时候，实际上是希望 B 组件重新渲染的，也就是不要从 Storage 中读取信息。所以需要在 Storage 中的状态加入一个 flag 属性，用来控制 A 组件是否读取 Storage 中的状态。



优点

- 兼容性好，不需要额外库或工具。
- 简单快捷，基本可以满足大部分需求。

缺点

- 状态通过 JSON 方法储存（相当于深拷贝），如果状态中有特殊情况（比如 Date 对象、Regexp 对象等）的时候会得到字符串而不是原来的值。（具体参考用 JSON 深拷贝的缺点）
- 如果 B 组件后退或者下一页跳转并不是前组件，那么 flag 判断会失效，导致从其他页面进入 A 组件页面时 A 组件会重新读取 Storage，会造成很奇怪的现象

**（2）路由传值**

通过 react-router 的 Link 组件的 prop —— to 可以实现路由间传递参数的效果。



在这里需要用到 state 参数，在 B 组件中通过 history.location.state 就可以拿到 state 值，保存它。返回 A 组件时再次携带 state 达到路由状态保持的效果。

优点

- 简单快捷，不会污染 LocalStorage / SessionStorage。
- 可以传递 Date、RegExp 等特殊对象（不用担心 JSON.stringify / parse 的不足）

缺点

- 如果 A 组件可以跳转至多个组件，那么在每一个跳转组件内都要写相同的逻辑。



### **组件不会被卸载：**

**（1）单页面渲染**

要切换的组件作为子组件全屏渲染，父组件中正常储存页面状态。

优点

- 代码量少
- 不需要考虑状态传递过程中的错误

缺点

- 增加 A 组件维护成本
- 需要传入额外的 prop 到 B 组件
- 无法利用路由定位页面



除此之外，在Vue中，还可以是用keep-alive来缓存页面，当组件在keep-alive内被切换时组件的**activated、deactivated**这两个生命周期钩子函数会被执行

被包裹在keep-alive中的组件的状态将会被保留



## 对Vue组件化的理解

1. 组件是独立和可复用的代码组织单元。组件系统是Vue核心特性之一，它使开发者使用小型、独立和通常可复用的组件构建大型应用；
2. 组件化开发能大幅提高应用开发效率、测试性、复用性等；
3. 组件使用按分类有：页面组件、业务组件、通用组件；
4. vue的组件是基于配置的，我们通常编写的组件是组件配置而非组件，框架后续会生成其构造函数，它们基于VueComponent，扩展于Vue；
5. vue中常见组件化技术有：属性prop，自定义事件，插槽等，它们主要用于组件通信、扩展等；6.合理的划分组件，有助于提升应用性能；
6. 组件应该是高内聚、低耦合的；
7. 遵循单向数据流的原则。

## 对vue设计原则的理解

1. **渐进式JavaScript框架**：与其它大型框架不同的是，Vue被设计为可以自底向上逐层应用。Vue的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue也完全能够为复杂的单页应用提供驱动。
2. **易用性**：vue提供数据响应式、声明式模板语法和基于配置的组件系统等核心特性。这些使我们只需要关注应用的核心业务即可，只要会写js、html和css就能轻松编写vue应用。
3. **灵活性**：渐进式框架的最大优点就是灵活性，如果应用足够小，我们可能仅需要vue核心特性即可完成功能；随着应用规模不断扩大，我们才可能逐渐引入路由、状态管理、vue-cli等库和工具，不管是应用体积还是学习难度都是一个逐渐增加的平和曲线。
4. **高效性：**超快的虚拟DOM和diﬀ算法使我们的应用拥有最佳的性能表现。追求高效的过程还在继续，vue3中引入Proxy对数据响应式改进以及编译器中对于静态内容编译的改进都会让vue更加高效。



### 常见的Vue性能优化方法

1. 路由懒加载

2. keep-alive缓存页面

3. 使用v-show复用DOM

4. v-for 遍历避免同时使用 v-if

5. 长列表性能优化，如果列表是纯粹的数据展示，不会有任何改变，就不需要做响应化

6. 事件的销毁

   Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。

   ```js
   created() {
   	this.timer = setInterval(this.refresh, 2000)
   },
   beforeDestroy() { 
   	clearInterval(this.timer)
   }
   ```





## 你知道哪些vue3新特性

1. api层面Vue3新特性主要包括：Composition API、SFC Composition API语法糖、Teleport传送门、Fragments 片段、Emits选项、自定义渲染器、SFC CSS变量、Suspense
2. 另外，Vue3.0在框架层面也有很多亮眼的改进：

- 更快
  - 虚拟DOM重写
  - 编译器优化：静态提升、patchFlags、block等
  - 基于Proxy的响应式系统
- 更小：更好的摇树优化
- 更容易维护：TypeScript + 模块化
- 更容易扩展
  - 独立的响应化模块
  - 自定义渲染器



## 你总结的vue最佳实践有哪些

1. 编码风格方面：
   - 命名组件时使用“多词”风格避免和HTML元素冲突
   - 使用“细节化”方式定义属性而不是只有一个属性名
   - 属性名声明时使用“驼峰命名”，模板或jsx中使用“肉串命名”
   - 使用v-for时务必加上key，且不要跟v-if写在一起
2. 性能方面：
   - 路由懒加载减少应用尺寸
   - 利用SSR减少首屏加载时间
   - 利用v-once渲染那些不需要更新的内容
   - 一些长列表可以利用虚拟滚动技术避免内存过度占用
   - 对于深层嵌套对象的大数组可以使用shallowRef或shallowReactive降低开销
   - 避免不必要的组件抽象

3. 安全：

- 不使用不可信模板，例如使用用户输入拼接模板：`template: <div> + userProvidedString + </div>`
- 小心使用v-html，:url，:style等，避免html、url、样式等注入




## Vue实例挂载的过程中发生了什么

挂载过程指的是app.mount()过程，这个过程中整体上做了两件事：**初始化**和**建立更新机制**

初始化会创建组件实例、初始化组件状态，创建各种响应式数据

建立更新机制这一步会立即执行一次组件更新函数，这会首次执行组件渲染函数并执行patch将前面获得vnode转换为dom；同时首次执行渲染函数会创建它内部响应式数据之间和组件更新函数之间的依赖关系，这使得以后数据变化时会执行对应的更新函数。






# Vue2 与 vue3区别

## 组合式 API对比选项式api的优点

- 在Vue2中采用的是OptionsAPI, 用户提供的data,props,methods,computed,watch等属性 (用户编写复杂业务逻辑会出现反复横跳问题)
- Vue2中所有的属性都是通过`this`访问，`this`存在指向明确问题
- Vue2中很多未使用方法或属性依旧会被打包，并且所有全局API都在Vue对象上公开。Composition API对 tree-shaking 更加友好，代码也更容易压缩。
- 组件逻辑共享问题， Vue2 采用mixins 实现组件之间的逻辑共享； 但是会有数据来源不明确，命名冲突等问题。 Vue3采用CompositionAPI 提取公共逻辑非常方便

### 更好的逻辑复用[#](https://cn.vuejs.org/guide/extras/composition-api-faq.html#better-logic-reuse)

组合式 API 最基本的优势是它使我们能够通过[组合函数](https://cn.vuejs.org/guide/reusability/composables.html)来实现更加简洁高效的逻辑复用。在选项式 API 中我们主要的逻辑复用机制是 mixins，而组合式 API 解决了 [mixins 的所有缺陷](https://cn.vuejs.org/guide/reusability/composables.html#vs-mixins)。

组合式 API 提供的逻辑复用能力孵化了一些非常棒的社区项目，比如 [VueUse](https://vueuse.org/)，一个不断成长的工具型组合式函数集合。组合式 API 还为其他第三方状态管理库与 Vue 的响应式系统之间的集成提供了一套简洁清晰的机制，例如 [RxJS](https://vueuse.org/rxjs/readme.html#vueuse-rxjs)。

### 更灵活的代码组织[#](https://cn.vuejs.org/guide/extras/composition-api-faq.html#more-flexible-code-organization)

在需要处理多个**逻辑关注点**的组件中时，option api 的弊端就很明显了，需要上下滚动了。

我们以 Vue CLI GUI 中的文件浏览器组件为例：这个组件承担了以下几个逻辑关注点：

- 追踪当前文件夹的状态，展示其内容
- 处理文件夹的相关操作 (打开、关闭和刷新)
- 支持创建新文件夹
- 可以切换到只展示收藏的文件夹
- 可以开启对隐藏文件夹的展示
- 处理当前工作目录中的变更

处理相同逻辑关注点的代码被强制拆分在了不同的选项中，位于文件的不同部分。在一个几百行的大组件中，要读懂代码中的一个逻辑关注点，需要在文件中反复上下滚动，这并不理想。

而如果[用组合式 API 重构](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e)这个组件，将会变成下面右边这样：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-cFMl5V.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-cFMl5V.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-cFMl5V.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-cFMl5V.png" loading="lazy"/>
  </picture>

现在与同一个逻辑关注点相关的代码被归为了一组：我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。此外，我们现在可以很轻松地将这一组代码移动到一个外部文件中，不再需要为了抽象而重新组织代码，大大降低了重构成本，这在长期维护的大型项目中非常关键。

### 更好的类型推导[#](https://cn.vuejs.org/guide/extras/composition-api-faq.html#better-type-inference)



### 更小的生产包体积[#](https://cn.vuejs.org/guide/extras/composition-api-faq.html#smaller-production-bundle-and-less-overhead)

搭配 `<script setup>` 使用组合式 API 比等价情况下的选项式 API 更高效，对代码压缩也更友好。这是由于 `<script setup>` 形式书写的组件模板被编译为了一个内联函数，和 `<script setup>` 中的代码位于同一作用域。不像选项式 API 需要依赖 `this` 上下文对象访问属性，被编译的模板可以直接访问 `<script setup>` 中定义的变量，无需一个代码实例从中代理。这对代码压缩更友好，因为本地变量的名字可以被压缩，但对象的属性名则不能。



## vue2.x的响应式

- 实现原理：

  - 对象类型：通过```Object.defineProperty()```对属性的读取、修改进行拦截（数据劫持）。

  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

    ```js
    Object.defineProperty(data, 'count', {
        get () {}, 
        set () {}
    })
    ```

- 存在问题：

  - 新增属性、删除属性, Object.defineProperty 不能拦截到这些操作。
  - 直接通过下标修改数组和数组长度发生变化, Object.defineProperty 不能拦截到这些操作。

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，而且支持 Map，Set，WeakMap 和 WeakSet。



## Teleport

- 什么是Teleport？—— `Teleport` 是一种能够将我们的<strong style="color:#DD5145">组件html结构</strong>移动到指定位置的技术。

  ```vue
  <teleport to="移动位置">
  	<div v-if="isShow" class="mask">
  		<div class="dialog">
  			<h3>我是一个弹窗</h3>
  			<button @click="isShow = false">关闭弹窗</button>
  		</div>
  	</div>
  </teleport>
  ```





## 全局API的转移

Vue 2.x 有许多全局 API 和配置。Vue3.0中对这些API做出了调整，将全局的API，即：```Vue.xxx```调整到应用实例（```app```）上

| 2.x 全局 API（```Vue```） | 3.x 实例 API (`app`)                        |
| ------------------------- | ------------------------------------------- |
| Vue.config.xxxx           | app.config.xxxx                             |
| Vue.config.productionTip  | <strong style="color:#DD5145">移除</strong> |
| Vue.component             | app.component                               |
| Vue.directive             | app.directive                               |
| Vue.mixin                 | app.mixin                                   |
| Vue.use                   | app.use                                     |
| Vue.prototype             | app.config.globalProperties                 |





## vue3提供异步组件

允许程序在等待异步组件加载完成前渲染兜底的内容，如 loading ，使用户的体验更平滑。使用它，需在模板中声明，并包括两个命名插槽：default 和 fallback。Suspense 确保加载完异步内容时显示默认插槽，并将 fallback 插槽用作加载状态。

```js
<tempalte>
  <suspense>
    <template #default>
      <List />
    </template>
    <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </suspense>
</template>
```

在 List 组件（有可能是异步组件，也有可能是组件内部处理逻辑或查找操作过多导致加载过慢等）未加载完成前，显示 Loading...（即 fallback 插槽内容），加载完成时显示自身（即 default 插槽内容）。

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验

- 使用步骤：

  - 异步引入组件

    ```js
    import {defineAsyncComponent} from 'vue'
    const Child = defineAsyncComponent(()=>import('./components/Child.vue'))
    ```

  - 使用```Suspense```包裹组件，并配置好```default``` 与 ```fallback```

    ```vue
    <template>
    	<div class="app">
    		<h3>我是App组件</h3>
    		<Suspense>
    			<template v-slot:default>
    				<Child/>
    			</template>
    			<template v-slot:fallback>
    				<h3>加载中.....</h3>
    			</template>
    		</Suspense>
    	</div>
    </template>
    ```







##  虚拟DOM

Vue3 相比于 Vue2，虚拟DOM上增加 patchFlag 字段。我们借助Vue3 Template Explorer来看。

```js
<div id="app">
  <h1>vue3虚拟DOM讲解</h1>
  <p>今天天气真不错</p>
  <div>{{name}}</div>
</div>
复制代码
```

渲染函数如下所示。

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from vue
 
const _withScopeId = n => (_pushScopeId(scope-id),n=n(),_popScopeId(),n)
const _hoisted_1 = { id: app }
const _hoisted_2 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(h1, null, vue3虚拟DOM讲解, -1 /* HOISTED */))
const _hoisted_3 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(p, null, 今天天气真不错, -1 /* HOISTED */))
 
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(div, _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createElementVNode(div, null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
复制代码
```

注意第3个_createElementVNode的第4个参数即 patchFlag 字段类型。

字段类型情况：1 代表节点为动态文本节点，那在 diff 过程中，只需比对文本对容，无需关注 class、style等。除此之外，发现所有的静态节点（HOISTED 为 -1），都保存为一个变量进行静态提升，可在重新渲染时直接引用，无需重新创建。

```js
// patchFlags 字段类型列举
export const enum PatchFlags { 
  TEXT = 1,   // 动态文本内容
  CLASS = 1 << 1,   // 动态类名
  STYLE = 1 << 2,   // 动态样式
  PROPS = 1 << 3,   // 动态属性，不包含类名和样式
  FULL_PROPS = 1 << 4,   // 具有动态 key 属性，当 key 改变，需要进行完整的 diff 比较
  HYDRATE_EVENTS = 1 << 5,   // 带有监听事件的节点
  STABLE_FRAGMENT = 1 << 6,   // 不会改变子节点顺序的 fragment
  KEYED_FRAGMENT = 1 << 7,   // 带有 key 属性的 fragment 或部分子节点
  UNKEYED_FRAGMENT = 1 << 8,   // 子节点没有 key 的fragment
  NEED_PATCH = 1 << 9,   // 只会进行非 props 的比较
  DYNAMIC_SLOTS = 1 << 10,   // 动态的插槽
  HOISTED = -1,   // 静态节点，diff阶段忽略其子节点
  BAIL = -2   // 代表 diff 应该结束
}
复制代码
```

## 8. 事件缓存

Vue3 的`cacheHandler`可在第一次渲染后缓存我们的事件。相比于 Vue2 无需每次渲染都传递一个新函数。加一个 click 事件。

```js
<div id="app">
  <h1>vue3事件缓存讲解</h1>
  <p>今天天气真不错</p>
  <div>{{name}}</div>
  <span onCLick=() => {}><span>
</div>
复制代码
```

渲染函数如下所示。

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from vue
 
const _withScopeId = n => (_pushScopeId(scope-id),n=n(),_popScopeId(),n)
const _hoisted_1 = { id: app }
const _hoisted_2 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(h1, null, vue3事件缓存讲解, -1 /* HOISTED */))
const _hoisted_3 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(p, null, 今天天气真不错, -1 /* HOISTED */))
const _hoisted_4 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(span, { onCLick: () => {} }, [
  /*#__PURE__*/_createElementVNode(span)
], -1 /* HOISTED */))
 
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(div, _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createElementVNode(div, null, _toDisplayString(_ctx.name), 1 /* TEXT */),
    _hoisted_4
  ]))
}
复制代码
```

观察以上渲染函数，你会发现 click 事件节点为静态节点（HOISTED 为 -1），即不需要每次重新渲染。

## 9. Diff算法优化

搬运 Vue3 patchChildren 源码。结合上文与源码，patchFlag 帮助 diff 时区分静态节点，以及不同类型的动态节点。一定程度地减少节点本身及其属性的比对。

```js
function patchChildren(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) {
  // 获取新老孩子节点
  const c1 = n1 && n1.children
  const c2 = n2.children
  const prevShapeFlag = n1 ? n1.shapeFlag : 0
  const { patchFlag, shapeFlag } = n2
  
  // 处理 patchFlag 大于 0 
  if(patchFlag > 0) {
    if(patchFlag && PatchFlags.KEYED_FRAGMENT) {
      // 存在 key
      patchKeyedChildren()
      return
    } els if(patchFlag && PatchFlags.UNKEYED_FRAGMENT) {
      // 不存在 key
      patchUnkeyedChildren()
      return
    }
  }
  
  // 匹配是文本节点（静态）：移除老节点，设置文本节点
  if(shapeFlag && ShapeFlags.TEXT_CHILDREN) {
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
    }
    if (c2 !== c1) {
      hostSetElementText(container, c2 as string)
    }
  } else {
    // 匹配新老 Vnode 是数组，则全量比较；否则移除当前所有的节点
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense,...)
      } else {
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
      }
    } else {
      
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
      } 
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(c2 as VNodeArrayChildren, container,anchor,parentComponent,...)
      }
    }
  }
}
复制代码
```

patchUnkeyedChildren 源码如下所示。

```js
function patchUnkeyedChildren(c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) {
  c1 = c1 || EMPTY_ARR
  c2 = c2 || EMPTY_ARR
  const oldLength = c1.length
  const newLength = c2.length
  const commonLength = Math.min(oldLength, newLength)
  let i
  for(i = 0; i < commonLength; i++) {
    // 如果新 Vnode 已经挂载，则直接 clone 一份，否则新建一个节点
    const nextChild = (c2[i] = optimized ? cloneIfMounted(c2[i] as Vnode)) : normalizeVnode(c2[i])
    patch()
  }
  if(oldLength > newLength) {
    // 移除多余的节点
    unmountedChildren()
  } else {
    // 创建新的节点
    mountChildren()
  }
 
}
复制代码
```

## 10. 打包优化

Tree-shaking：模块打包 webpack、rollup 等中的概念。移除 JavaScript 上下文中未引用的代码。主要依赖于 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。

以 nextTick 为例子，在 Vue2 中，全局API暴露在Vue实例上，即使未使用，也无法通过 tree-shaking 进行消除。

```js
import Vue from 'vue';
 
Vue.nextTick(() => {
  // 一些和DOM有关的东西
});
复制代码
```

Vue3 中针对全局和内部的API进行了重构，并考虑到 tree-shaking 的支持。因此，全局API现在只能作为ES模块构建的命名导出进行访问。

```js
import { nextTick } from 'vue';   // 显式导入
 
nextTick(() => {
  // 一些和DOM有关的东西
});
复制代码
```

通过这一更改，只要模块绑定器支持 tree-shaking，则Vue应用程序中未使用的 api 将从最终的捆绑包中消除，获得最佳文件大小。

受此更改影响的全局API如下所示。

- Vue.nextTick
- Vue.observable （用 Vue.reactive 替换）
- Vue.version
- Vue.compile （仅全构建）
- Vue.set （仅兼容构建）
- Vue.delete （仅兼容构建）

内部API也有诸如 transition、v-model 等标签或者指令被命名导出。只有在程序真正使用才会被捆绑打包。Vue3 将所有运行功能打包也只有约22.5kb，比 Vue2 轻量很多。







## Vue2组件为什么只能有一个根元素而vue3可以多根

因为`vdom`是一颗单根树形结构，`patch`方法在遍历的时候从根节点开始遍历，它要求只有一个根节点。组件也会转换为一个`vdom`，自然应该满足这个要求。

`vue3`中之所以可以写多个根节点，是因为引入了`Fragment`的概念，这是一个抽象的节点，如果发现组件是多根的，就创建一个Fragment节点，把多个根节点作为它的children。将来patch的时候，如果发现是一个Fragment节点，则直接遍历children创建或更新。



## 其他改变

- data选项应始终被声明为一个函数。

- 过渡类名的更改：

  - Vue2.x写法

    ```css
    .v-enter,
    .v-leave-to {
      opacity: 0;
    }
    .v-leave,
    .v-enter-to {
      opacity: 1;
    }
    ```

  - Vue3.x写法

    ```css
    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
    
    .v-leave-from,
    .v-enter-to {
      opacity: 1;
    }
    ```

- <strong style="color:#DD5145">移除</strong>keyCode作为 v-on 的修饰符，同时也不再支持```config.keyCodes```

- <strong style="color:#DD5145">移除</strong>```v-on.native```修饰符

  - 父组件中绑定事件

    ```vue
    <my-component
      v-on:close="handleComponentEvent"
      v-on:click="handleNativeClickEvent"
    />
    ```

  - 子组件中声明自定义事件

    ```vue
    <script>
      export default {
        emits: ['close']//这里没声明的就是当回原生事件。例如这里没声明click，所以click还是当回原生事件。
      }
    </script>
    ```

- <strong style="color:#DD5145">移除</strong>过滤器（filter）

  > 过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。



# vue2

## data为什么是一个函数而不是对象

Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将会影响所有组件实例；采用函数形式定义，在initData时会将其作为工厂函数返回全新data对象，有效规避多实例之间状态污染问题。而在Vue根实例创建过程中则不存在该限制，也是因为根实例只能有一个，不需要担心这种情况。

## mixin的缺陷

1. **不清晰的数据来源**：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 变得不清晰。这也是我们推荐在组合式函数中使用 ref + 解构模式的理由：让属性的来源在消费组件时一目了然。
2. **命名空间冲突**：多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
3. **隐式的跨 mixin 交流**：多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。

# Vue3.0工程

## vue3 npm包的输出产物

为了能在node环境中使用，输出cjs产物。为了让用户能够通过` <script> `标签直接引用并使用，我们需要输出 IIFE 格式的资源，即立即调用的函数表达式。为了让用户能够通过 `<script type="module">` 引用并使用，我们需要输出 ESM 格式的资源。这里需要注意的是，ESM 格式的资源有两种：用于浏览器的 esm-browser.js 和用于打包工具的 esm-bundler.js。它们的区别在于对预定义常量 __DEV__ 的处理，前者直接将 __DEV__ 常量替换为字面量 true 或 false，后者则将 __DEV__ 常量替换为 process.env.NODE_ENV !=='production' 语句。

```js
01 if (__DEV__) {
02   warn(`useCssModule() is not supported in the global build.`)
03 }
```

在带有 -bundler 字样的资源中会变成：

```js
01 if ((process.env.NODE_ENV !== 'production')) {
02   warn(`useCssModule() is not supported in the global build.`)
03 }
```

这样做的好处是，用户可以通过 webpack 配置自行决定构建资源的目标环境，但是最终效果其实一样，这段代码也只会出现在开发环境中。

## 创建

### 1.使用 vue-cli 创建

#### 使用

官方文档：https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create

```bash
## 查看@vue/cli版本，确保@vue/cli版本在4.5.0以上
vue --version
## 安装或者升级你的@vue/cli
npm install -g @vue/cli
## 创建
vue create vue_test
## 启动
cd vue_test
npm run serve
```

#### 配置webpack

Vue CLI 底层依赖于 Webpack 实现编译打包等工程化能力，开发者可通过 `configureWebpack` 与 `chainWebpack` 配置项修改 Webpack 配置信息。

以 `configureWebpack` 为例，使用时需要在 `vue.config.js` 文件中写入配置：

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
  }
}
```

`configureWebpack` 的配置规则与 Webpack 一致，同样支持 `plugins/module/resolve` 等配置项。实际上，Vue CLI 内部最终会调用 [webpack-merge](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsurvivejs%2Fwebpack-merge) 将 `configureWebpack` 值与其它上下文配置合并，生成最终的 Webpack 配置信息。

`chainWebpack` 的用法与 `configureWebpack` 一致，区别仅在于此处支持 [webpack-chain](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fneutrinojs%2Fwebpack-chain) 语法 —— 即以函数方式链式修改 Webpack 配置：

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .tap(options => {
          // modify the options...
          return options
        })
  }
}
```

> 提示：更多信息可参考 Vue CLI 官网 **[Working with Webpack](https://link.juejin.cn/?target=https%3A%2F%2Fcli.vuejs.org%2Fguide%2Fwebpack.html%23simple-configuration)** 一节。



#### 生成完整的webpack配置信息

使用 `inspect` 命令生成完整的 Webpack 配置信息：

```sh
$ vue inspect > output.js
```

此外，`inspect` 还提供许多根据不同条件生成配置的参数，例如针对编译环境生成配置：

```css
vue inspect --mode production > output.prod.js
```

更多用法，可查阅帮助文档：`vue inspect --help`。









### 2.使用 vite 创建

#### npm创建

```bash
## 创建工程
npm init vite-app <project-name>
## 进入工程目录
cd <project-name>
## 安装依赖
npm install
## 运行
npm run dev
```



#### yarn创建

```shell
yarn create vite project_name  //在项目目录下输入该命令
```

```
yarn //构建完项目后再运行该命令安装一下依赖包
```



### 推荐方式：create-vue

`pnpm create vue@3` # @latest 表示 tag，在使用包时应该明确指定 tag。如果你省略了 tag，npm 可能会解析为这个包的缓存的过时版本。在 npm 中，@latest 是默认的 tag，它表示你将使用最新的稳定版本。

可以安装各种版本的vue和选择各种常用插件并帮你配置好

其实他就是预制了各种模版，汇总你在命令行里的选择之后决定给你拉哪个模版下来

https://github.com/vuejs/create-vue



## 安装vscode插件

对于普通用户，需要做下列事情：

- 安装下列两个插件

- - Vue Language Features (Volar)
  - TypeScript Vue Plugin (Volar) --- 增强vscode的ts编译能力：在ts后缀文件中处理vue后缀文件

- 卸载或者禁用 Vetur 



其中 Vue Language Features 是给 .vue 文件提供智能提示的。(如果项目中报找不到@pet的组件，但是实际打开项目是没问题的，则将volar的版本改到1.8.1)

而 TypeScript Vue Plugin 是给 .ts 文件 import .vue 文件时候，给其标记上正确类型的。

Vetur 和 Volar 在处理 .vue 文件上有冲突，所以必须卸载或者禁用。



## 让控制台打印响应式数据更直观

在 Vue.js 3 的源码中，你可以搜索到名为 initCustomFormatter 的函数，该函数就是用来在开发环境下初始化自定义 formatter 的。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-19-39-image-20240108193901460.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-19-39-image-20240108193901460.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-19-39-image-20240108193901460.png" alt="image-20240108193901460" style="zoom:33%;" loading="lazy"/>
  </picture>

以 Chrome 为例，我们可以打开 DevTools 的设置，然后勾选“Console”→“Enable custom formatters”选项，如图 2-3 所示。会发现输出内容变得非常直观：`Ref<0>`





# 语法



## 写法

组件命名和导入导出的时候采用的是大驼峰
在模板中使用的时候直接是小写和横杠的方式 例如test-com



### 命令式

```js
import { ref, h } from 'vue'

const Comp = defineComponent(
  (props) => {
    // 就像在 <script setup> 中一样使用组合式 API
    const count = ref(0)

    return () => {
      // 渲染函数或 JSX
      return h('div', count.value)
    }
    /*
    return () => {
      // 渲染函数或 JSX
      return <div>{count.value}</div>
    }
    */
  },
  // 其他选项，例如声明 props 和 emits。
  {
    props: {
      /* ... */
    }
  }
)
```





### 声明式-模版语法

####  Vue 模板中不能访问浏览器api

在 Vue 模板中直接访问浏览器api，如 `window` 或 `document`，会导致错误。因为 Vue 模板是基于组件实例的数据上下文的，里面并没有浏览器api。因为打包后的组件是这样的：

```js
// 这个不是ssg打包的，就是正常vue打包出来的
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const a = computed(() => window.document);
    watch(
      a,
      () => {
        console.log("window.document", window.document);
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("h1", null, toDisplayString(_ctx.window.document), 1), // // 这里_ctx里是没有window的，所以直接报错！！！！！！
      ], 64);
    };
  }
});
```



在 Vue 模板中，你只能访问以下几种类型的数据：

- 组件的 props
- 组件的 data
- 组件的 computed properties
- 组件的 methods
- JavaScript 的全局对象，如 `Math` 和 `Date`
- Vue 的内置指令，如 `v-if` 和 `v-for`

如果你需要在模板中使用 `window` 或 `document`，你应该在组件的方法或计算属性中进行，并将结果暴露给模板。

例如：

``` javascript
export default {
  computed: {
    title() {
      return document.title;
    }
  }
}
```

然后在模板中这样使用：

``` html
<template>
  <h1>{{ title }}</h1>
</template>
```







## 指令

### 内置指令

#### 内容渲染指令

##### v-text

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theory/image-20220509194759768.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theory/image-20220509194759768.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theory/image-20220509194759768.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theory/image-20220509194759768.png" loading="lazy"/>
  </picture>

##### {{}}

插值表达式（Mustache）

##### v-html

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theoryimage-20220509195807417.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theoryimage-20220509195807417.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theoryimage-20220509195807417.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com//vue/theoryimage-20220509195807417.png" loading="lazy"/>
  </picture>

```html
<div v-html="html"></div>
```

##### v-cloak[#](https://cn.vuejs.org/api/built-in-directives.html#v-cloak)

用于隐藏尚未完成编译的 DOM 模板。

- **详细信息**

  **该指令只在没有构建步骤的环境下需要使用。**

  当使用直接在 DOM 中书写的模板时，可能会出现一种叫做“未编译模板闪现”的情况：用户可能先看到的是还没编译完成的双大括号标签，直到挂载的组件将它们替换为实际渲染的内容。

  `v-cloak` 会保留在所绑定的元素上，直到相关组件实例被挂载后才移除。配合像 `[v-cloak] { display: none }` 这样的 CSS 规则，它可以在组件编译完毕前隐藏原始模板。

- **示例：**

  css

  ```
  [v-cloak] {
    display: none;
  }
  ```

  template

  ```
  <div v-cloak>
    {{ message }}
  </div>
  ```

  直到编译完成前，`<div>` 将不可见。

- 有的时候会不起作用，可能的原因有二：

  1. v-cloak的display属性被层级更高的给覆盖掉了，所以要提高层级。加 !important;

  ```css
  [v-cloak] {
  	display: none !important;
  }
  ```

  

  2. 样式放在了@import引入的css文件中。

  v-cloak的这个样式放在@import 引入的css文件中不起作用，可以放在link引入的css文件里或者内联样式中






#####  v-once

只渲染元素和组件**一次**。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

编译器发现元素上面有v-once时，会将首次计算结果存入缓存对象，组件再次渲染时就会从缓存获取，从而避免再次计算。

```html
<!-- 单个元素 -->
<span v-once>This will never change: {{msg}}</span>
<!-- 有子元素 -->
<div v-once>
  <h1>comment</h1>
  <p>{{msg}}</p>
</div>
<!-- 组件 -->
<my-component v-once :comment="msg"></my-component>
<!-- `v-for` 指令 -->
<ul>
  <li v-for="i in list" v-once>{{i}}</li>
</ul>
```

自 3.2 开始，你还可以通过 [`v-memo`](https://v3.cn.vuejs.org/api/directives.html#v-memo) 来记住带有失效条件的部分模板。







##### [v-memo](https://v3.cn.vuejs.org/api/directives.html#v-memo)









#### 属性绑定指令

##### 简介

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510103306.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510103306.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510103306.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510103306.png" loading="lazy"/>
  </picture>

可以直接简写成一个冒号 :



##### 动态参数[](https://cn.vuejs.org/guide/essentials/template-syntax.html#dynamic-arguments)

在指令参数上可以使用一个 JavaScript 表达式，需要包含在一对方括号内：

```
<a v-bind:[attributeName]="url"> ... </a>

<a :[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会作为一个 JavaScript 表达式被动态执行，计算得到的值会被用作最终的参数。举例来说，如果你的组件实例有一个数据属性 `attributeName`，其值为 `"href"`，那么这个绑定就等价于 `v-bind:href`。

相似地，你还可以将一个函数绑定到动态的事件名称上：

```
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 简写 -->
<a @[eventName]="doSomething">
```

在此示例中，当 `eventName` 的值是 `"focus"` 时，`v-on:[eventName]` 就等价于 `v-on:focus`。







#### 事件绑定指令

##### 概念

`v-on:事件名称="事件处理函数的名称"`。

事件名称就是javascript里的原生事件 或者 自定义事件。

<mark>当多次调用addEventListener 函数为元素绑定同一类型的事件时，多个事件处理函数可以共存。</mark>





##### 简写

`v-on:`可以简写成`@`

事件处理函数也可以直接写到里面

```vue
<h3>{{count}}</h3>
<button @click="count+=1">+1</button>
```

##### 事件对象

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510105331.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510105331.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510105331.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510105331.png" loading="lazy"/>
  </picture>

组件的自定义事件传过来的参数也是这样去获取



##### 传参

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110017493.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110017493.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110017493.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110017493.png" loading="lazy"/>
  </picture>



###### $event

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110201354.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110201354.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110201354.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110201354.png" loading="lazy"/>
  </picture>



##### 事件修饰符

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110438296.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110438296.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110438296.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110438296.png" loading="lazy"/>
  </picture>

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110733514.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110733514.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110733514.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510110733514.png" loading="lazy"/>
  </picture>

#### 双向绑定指令



##### 作用一

作用于表单元素



##### 作用二

在自定义组件上使用v-model时

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145135856.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145135856.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145135856.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145135856.png" loading="lazy"/>
  </picture>



使用步骤

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145553179.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145553179.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145553179.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510145553179.png" loading="lazy"/>
  </picture>



默认情况下，组件上的 `v-model` 使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件。我们可以通过向 `v-model` 传递参数来修改这些名称：

```html
<my-component v-model:title="bookTitle"></my-component>
```

在本例中，子组件将需要一个 `title` prop 并发出 `update:title` 事件来进行同步：

```vue
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```





##### v-model指令的修饰符

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510113520612.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510113520612.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510113520612.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510113520612.png" loading="lazy"/>
  </picture>



##### v-model 原理

v-model 是v-bind和v-on的语法糖

v-model 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 value property 和 input 事件；
- checkbox 和 radio 使用 checked property 和 change 事件；
- select 字段将 value 作为 prop 并将 change 作为事件。

> 注意:对于需要使用输入法 (如中文、日文、韩文等) 的语言，你会发现 v-model 不会在输入法组合文字过程中得到更新。

在普通标签上

```javascript
    <input v-model="sth" />  //这一行等于下一行
    <input v-bind:value="sth" v-on:input="sth = $event.target.value" />
```

在组件上

```html
<currency-input v-model="price"></currentcy-input>
<!--上行代码是下行的语法糖
 <currency-input :value="price" @handleInput="price = arguments[0]"></currency-input>
-->

<!-- currency-input组件定义 -->
Vue.component('currency-input', {
 template: `
  <span>
   <input
    ref="input"
    :value="value"
    @input="$emit('handleInput', $event.target.value)"
   >
  </span>
 `,
 props: ['value'],
 emits: ['handleInput']
})
```





当组件被卸载时是如何停止监听组件内部所有的 watch 函数

#### 条件渲染指令

##### v-show、v-if

- **手段**：v-if是动态的向DOM树内添加或者删除DOM元素；v-show是通过设置DOM元素的display样式属性控制显隐；
- **编译过程**：v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换；
- **性能消耗**：v-if有更高的切换消耗；v-show有更高的初始渲染消耗；
- **使用场景**：v-if适合运营条件不大可能改变；v-show适合频繁切换。

v-else和v-else-if可配套v-if一起使用



当 `v-if` 指令的值从 `true` 变为 `false` 时，Vue 将停止渲染与该指令关联的元素及其所有子元素。如果这个元素是一个组件，那么这个组件将会被卸载。

卸载过程中，Vue 会执行一系列的清理操作，包括：

1. 触发组件的 `beforeUnmount` 和 `unmounted` 生命周期钩子函数。这在 packages/runtime-core/src/renderer.ts 中可以看到。
2. 停止监听组件内部所有的 `watch` 函数。这在 packages/runtime-core/__tests__/apiWatch.spec.ts 和 packages/runtime-core/__tests__/apiWatch.spec.ts 中有相关的测试用例。
3. 移除组件的 DOM 元素。

```js
// unmountComponent源码
 const unmountComponent = ()=>{
     // beforeUnmount hook
    if (bum) {
      invokeArrayFns(bum)
    }

		......
    // stop effects in component scope
    scope.stop()

    ......
    // unmounted hook
    if (um) {
      queuePostRenderEffect(um, parentSuspense)
    }
 }
```





(v-if 指令用于条件性地渲染组件或元素。当条件为 false 时，组件将从 DOM 中移除，但并不等同于组件的卸载。实际上，组件在被 v-if 指令隐藏后仍然存在于内存中，可以通过修改条件再次显示出来，而不需要重新创建组件实例。要完全卸载组件，可以使用 v-if 结合 key 属性，在每次切换时强制销毁和重新创建组件。--- 未验证)



#####  v-if、v-show、v-html 的原理

- v-if会调用addIfCondition方法，生成vnode的时候会忽略对应节点，render的时候就不会渲染；

  `v-if` 指令在编译过程中被转换为一个条件表达式。具体的转换过程在 transformIf 函数中进行。

  在编译过程中，`v-if`、`v-else-if` 和 `v-else` 被转换为一个 `IfNode`，它包含一个 `branches` 数组，每个分支对应一个 `IfBranchNode`。每个 `IfBranchNode` 包含一个条件表达式和一个子树。

  在生成代码阶段，`IfNode` 会被转换为一个条件表达式，具体的转换过程在 createCodegenNodeForBranch 函数中进行。这个函数会根据 `IfBranchNode` 的条件和子树生成一个 JavaScript 的三元表达式。

  在运行时，patch 函数会根据这个条件表达式来决定是否渲染对应的子树。如果条件为真，就会渲染对应的子树，否则就会跳过。当条件发生变化时，`patch` 函数会被再次调用，以更新 DOM。

  以下是一个简单的例子，编译后的代码大致如下：

  ```javascript
  _createVNode(
    _createBlock(
  		_Fragment,
      [
        (condition)
          ? _createVNode("div", null, "Hello")
          : null
      ],
      PatchFlags.IF
    )
  )
  ```

- v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改show属性值，也就是常说的display； 

- v-html会先移除节点下的所有节点，调用html方法，通过addProp添加innerHTML属性，归根结底还是设置innerHTML为v-html的值。





##### 避免 `v-if` 和 `v-for` 一起使用

vue2中，v-for优先级比v-if高，会先渲染后判断，浪费性能
vue3，v-if优先级比v-for高，v-if执行时，它调用的变量还不存在，就会导致异常，直接报错

要避免出现这种情况，可在外层嵌套template，在这一层进行v-if判断，然后在内部进行v-for循环。如果条件出现在循环内部，可通过计算属性提前过滤掉那些不需要显示的项。：

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```





##### 使用 v-if 结合 key 属性实现切换时强制销毁和重新创建组件



在模板中使用 v-if 和 key 指令，指定一个唯一的字符串作为 key 值。当条件变化时，会触发对应组件的销毁和重新创建。

注意：每个组件的 key 值必须是唯一的字符串，可以使用组件名称或一个与组件相关的唯一标识符作为 key 值。

```
<template>
  <div>
    <component-a v-if="showComponentA" :key="'component-a'"></component-a>
    <component-b v-else :key="'component-b'"></component-b>
  </div>
</template>
```







#### 列表渲染指令

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510114116530.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510114116530.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510114116530.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510114116530.png" loading="lazy"/>
  </picture>

v-for还支持一个可选的第二个参数，即当前项的索引。



##### Vue中key的作用

key只能是字符串或数字类型

vue 中 key 值的作用可以分为两种情况来考虑：

- 第一种情况是 v-if 中使用 key。由于 Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。因此当使用 v-if 来实现元素切换的时候，如果切换前后含有相同类型的元素，那么这个元素就会被复用。如果是相同的 input 元素，那么切换前后用户的输入不会被清除掉，这样是不符合需求的。因此可以通过使用 key 来唯一的标识一个元素，这个情况下，使用 key 的元素不会被复用。这个时候 key 的作用是用来标识一个独立的元素。
- 第二种情况是 v-for 中使用 key。用 v-for 更新已渲染过的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序发生了改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处的每个元素。因此通过为每个列表项提供一个 key 值，来以便 Vue 跟踪元素的身份，从而高效的实现复用。这个时候 key 的作用是为了高效的更新渲染虚拟 DOM。

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，diff 操作可以更准确、更快速

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。vue判断两个节点是否相同时主要判断两者的key和元素类型等，因此如果不设置key，则可能永远认为这是两个相同节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的。
- 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快



#####  [为什么不建议用index作为key](https://blog.csdn.net/weixin_42369612/article/details/120705876#:~:text=%E5%AE%98%E6%96%B9%E5%9B%9E%E7%AD%94%3A%20%E5%9C%A8react%E6%88%96%E8%80%85vue%E4%B8%AD%2C%E5%BE%AA%E7%8E%AF%E8%BF%94%E5%9B%9E%E9%93%BE%E8%A1%A8%E7%9A%84%E6%95%B0%E6%8D%AE%E7%9A%84%E6%97%B6%E5%80%99%2C%E5%A6%82%E6%9E%9C%E4%BD%BF%E7%94%A8%20index%E7%B4%A2%E5%BC%95%E5%80%BC,%E4%BD%9C%E4%B8%BA%20key%20%E4%BC%9A%E5%BC%95%E8%B5%B7%E4%B8%A5%E9%87%8D%E7%9A%84%E6%80%A7%E8%83%BD%E9%97%AE%E9%A2%98%2C%E4%B8%8D%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8)








##### v-for和 v-if不放一起

vue2中，v-for优先级比v-if高，会先渲染后判断，浪费性能
vue3，v-if优先级比v-for高，v-if执行时，它调用的变量还不存在，就会导致异常，直接报错

要避免出现这种情况，可在外层嵌套template，在这一层进行v-if判断，然后在内部进行v-for循环。如果条件出现在循环内部，可通过计算属性提前过滤掉那些不需要显示的项。：

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```





#### 插槽指令

`v-slot:`





#### 深度选择器

##### scoped

###### **1、scoped的作用**

当在style标签上加上scoped属性，则style标签下的样式只能在本组件中使用，可以使得组件之间的样式不互相污染。

如果每一个vue组件的style标签都加上了scoped，那就实现了样式的模块化。

###### **2、scoped的原理**

（1） 为组件实例⽣成⼀个唯⼀标识，给组件中的dom元素添加⼀个不会重复的data属性，data-v-xxxx

（2） 给每个选择器的最后⼀个选择器添加⼀个属性选择器来私有化样式

**例：原代码为：**

```vue
<template>
    <div class="parent"> 
       <div class="children">    scoped展示    </div>
    </div>
</template>
<style scoped>
    .parent .children{
        样式内容
    }
</style>
```

 **转译后代码为：**

```vue
<template>
    <div class="parent" data-v-xxxx> 
       <div class="children" data-v-xxxx>    scoped展示    </div>
    </div>
</template>
<style scoped>
    .parent .children[data-v-7ba5bd90]{
        样式内容
    }
</style>
```

##### **scoped穿透：:deep()**

在我们需要引入第三方库时，可能需要在组件中局部的去修改第三方组件的样式，而并且不想影响scoped中其他样式，此时就可以通过穿透scoped去实现。

###### **1.deep的使用**

.parent :deep(.childre) { 样式内容 }

###### **2.deep使用的注意点：**

（1）style标签上必须要有scoped

（2）使用deep样式节点必须要有一个父节点

（3）<font color="red">在scss、less中使用时如果有包裹关系时，使用deep的节点前只能写该节点的直接父元素</font>

错误事例： 此时deep无法生效

```js
.parent_parent :deep(.children) { 样式内容 }
```

正确事例： 此时deep才能生效

```js
.parent :deep(.children) { 样式内容 }
```

这里的主要原因是deep的使用会生成一个data-v-xxxx，这个data-v-xxxx只会加在使用deep的直接父元素上

（4）如果引用了外部组件，例如elementUI，此时如果要为该组件的最外层元素添加deep的话，目前来看是无法生效的，目前我找到的解决方式是使用 **:global()**



##### 原理

其实本质是基于html和css属性选择器，即分别时给html标签和css选择器添加 data-v-xxx;主要是是通过vue-loader 实现的，过程分为三步：

1.vue-loader会解析vue组件，提取数template,script,style对应的代码块。

2.构造组件实例，在组件实例的选项上面绑定scopedID

3.对style的css代码进行编译转化，应用scopedID生成选择器的属性







### 自定义指令

指令就是插件一样，在不同的生命周期上根据拿到的参数干一些事情。

参考自[这里](https://juejin.cn/post/7031332698425655303)

#### 什么时候需要自定义指令

- 需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。
- 需要将某些功能在指定DOM元素上使用
- 但对于需要操作大量DOM元素或者大变动时候，推荐使用组件，而不是指令。

- 复制粘贴 v-copy
- 长按 v-longpress
- 防抖 v-debounce
- 图片懒加载 v-lazy
- 按钮权限 v-premission
- 页面水印 v-waterMarker
- 拖拽指令 v-draggable

#### 自定义指令中的生命周期钩子函数

一个指令定义对象可以提供如下几个钩子函数（都是可选的，根据需要引入）

- created ：绑定元素属性或事件监听器被应用之前调用。该指令需要附加需要在普通的 v-on 事件监听器前调用的事件监听器时，这很有用。
- beforeMounted ：当指令第一次绑定到元素并且在挂载父组件之前执行。
- mounted ：绑定元素的父组件被挂载之后调用。
- beforeUpdate ：在更新包含组件的 VNode 之前调用。
- updated ：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。
- beforeUnmounted ：在卸载绑定元素的父组件之前调用
- unmounted ：当指令与元素解除绑定且父组件已卸载时，只调用一次。

我们发现用`v-if`时，创建元素的时候，会触发 created、beforeMount 和 mounted 三个钩子函数。

隐藏 input 元素的时候，会触发 beforeUnmount 和 unmounted 。

然而我们添加的 beforeUpdate 和 updated 函数并没有执行。

此时我们把 元素上的 v-if 修改成 v-show 就会执行上述两个方法了



#### 自定义指令钩子函数的参数

钩子函数被赋予了以下参数：

- el：指令所绑定的元素，可以直接操作DOM。
- binding：是一个对象，包含该指令的所有信息。

binding 包含的属性具体的分别为：

- **arg** 自定义指令的参数名。
- **value** 自定义指令绑定的值。
- **oldValue** 指令绑定的前一个值。
- **dir** 被执行的钩子函数
- **modifiers**：一个包含修饰符的对象。

```vue
<template>
 <div>
  <div v-fixed >定位</div>
 </div>
</template>

<script>
//自定义指令动态参数
const autoFocus = {
 fixed:{
  beforeMount(el,binding){
   console.log('el',el)
   console.log('binding',binding)
  }
 }
}
export default {
 directives:autoFocus,
 setup(){
 }
}
</script>
```

#### 自定义指令的参数

自定义指令也可以带参数

- 参数可以是动态的
- 参数可以根据组件实例数据进行实时更新。

```vue
<template>
 <div>
  <div v-fixed:pos="posData" style="width:100px;height:100px;background:grey">定位</div>
 </div>
</template>

<script>
//自定义指令动态参数
const autoFocus = {
 fixed:{
  beforeMount(el,binding){
   el.style.position = "fixed"
   el.style.left = binding.value.left+'px'
   el.style.top = binding.value.top + 'px'
  }
 }
}
export default {
 directives:autoFocus,
 setup(){
  const posData = {
   left:20,
   top:200
  }
  return {
   posData,
  }
 }
}
</script>
```



#### 注册一个局部的自定义指令

需要以小写v开头

```vue
全局注册的自定义指令将正常工作。本地的自定义指令在 <script setup> 中不需要显式注册，但他们必须遵循 vNameOfDirective 这样的命名规范：

<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>


如果指令是从别处导入的，可以通过重命名来使其符合命名规范：
<script setup>
import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```



#### 全局指令

```javascript
// 注册一个全局自定义指令 `v-focus`
app.directive('focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  mounted(el) {
    // 聚焦元素
    el.focus()
  }
})
```



### 模版语法

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510104402.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510104402.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510104402.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/20220510104402.png" loading="lazy"/>
  </picture>

#### JavaScript 表达式

这些表达式会在当前活动实例的数据作用域下作为 JavaScript 被解析。有个限制就是，==每个绑定都只能包含**单个表达式**==，所以下面的例子都**不会**生效。

```html
<!--  这是语句，不是表达式：-->
{{ var a = 1 }}

<!-- 流程控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

模板表达式都被放在沙盒中，只能访问一个[受限的全局变量列表](https://github.com/vuejs/vue-next/blob/master/packages/shared/src/globalsWhitelist.ts#L3)，如 `Math` 和 `Date`。你不应该在模板表达式中试图访问用户定义的全局变量。



#### 直接在一个 HTML 文件里撰写模板避免使用大写字符来命名键名

在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写：

```html
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```





### 动态参数

#### `v-bind:   v-on:      v-slot:` 都可以用动态参数

可以在指令参数中使用 JavaScript 表达式，方法是用方括号括起来：

```html
<!--
注意，参数表达式的写法存在一些约束，如之后的“对动态参数表达式的约束”章节所述。
-->
<a v-bind:[attributeName]="url"> ... </a>
```

这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。例如，如果你的组件实例有一个 data property `attributeName`，其值为 `"href"`，那么这个绑定将等价于 `v-bind:href`。

同样地，你可以使用动态参数为一个动态的事件名绑定处理函数：

```html
<a v-on:[eventName]="doSomething"> ... </a>
```

在这个示例中，当 `eventName` 的值为 `"focus"` 时，`v-on:[eventName]` 将等价于 `v-on:focus`



#### [动态参数值只能是字符串](https://v3.cn.vuejs.org/guide/template-syntax.html#对动态参数值约定)

动态参数预期会求出一个字符串，`null` 例外。这个特殊的 `null` 值可以用于显式地移除绑定。任何其它非字符串类型的值都将会触发一个警告。

#### [动态参数表达式的语法约束](https://v3.cn.vuejs.org/guide/template-syntax.html#对动态参数表达式约定)

动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。例如：

```html
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

变通的办法是使用没有空格或引号的表达式，或用[计算属性](https://v3.cn.vuejs.org/guide/computed.html)替代这种复杂表达式。

在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写：

```html
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```









## 修饰符

### **事件修饰符**

- .stop 阻止事件继续传播
- .prevent 阻止标签默认行为
- .capture 使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
- .self 只当在 event.target 是当前元素自身时触发处理函数
- .once 事件将只会触发一次
- .passive 告诉浏览器你不想阻止事件的默认行为

### **v-model 的修饰符**

- .lazy 通过这个修饰符，转变为在 change 事件再同步
- .number 自动将用户的输入值转化为数值类型
- .trim 自动过滤用户输入的首尾空格

### **键盘事件的修饰符**

- .enter
- .tab
- .delete (捕获“删除”和“退格”键)
- .esc
- .space
- .up
- .down
- .left
- .right

### **系统修饰键**

- .ctrl
- .alt
- .shift
- .meta

### **鼠标按钮修饰符**

- .left
- .right
- .middle





## props

### 介绍

在 Vue 3 组件实例创建过程中，`props` 的初始化先于 `data`。

Vue 3 中 `props` 的初始化时机是在组件实例创建之前，而 `data` 的初始化时机取决于组件使用的 API 格式：Options API 中在组件实例创建后、`created` 生命周期钩子前；Composition API 中则为 `setup` 函数执行时，组件实例尚未创建，因此您不能在 `setup` 函数中访问 `this`。在 `props` 和 `context`（提供类似于 `this` 的功能）作为 `setup` 函数的参数传入。在组件创建流程中，Vue 先解析并验证 `props`，然后再处理 `data`。因此，在 Vue 生命周期的钩子函数（如 `created` 或者 `setup`）中，你可以确保 `props` 已经被正确初始化。接下来才会对 `data` 进行初始化。



### 使用

```vue
<script setup>
const props = defineProps({
  foo: String
})

//ts
export interface PopupProps {
    show?: boolean;
}
const props = withDefaults(defineProps<PopupProps>(), {
    show: false,
});
</script>
```

当使用[基于类型的 props 的声明](https://v3.vuejs.org/api/sfc-script-setup#typescript-only-features)时，无法很方便地声明这些 prop 的默认值。为此我们提供了 `withDefaults()` 这个 API：example：

```ts
export interface BarrageProps<T> {
    /**
     * 每个item的高度，414下的px值
     */
    itemHeight?: number;
    /**
     * 元素高度运动时间，单位 s
     */
    duration?: number;
    /**
     * array 传入数据
     */
    list?: Array<T>;
    /**
     * 展示的弹幕数量
     */
    showNum?: number;
    /**
     * 播放
     */
    play?: boolean;
}

const props = withDefaults(defineProps<BarrageProps<any>>(), {
    itemHeight: 60,
    duration: 2,
    list: () => [], //空数组的话必须以函数的形式传入
    showNum: 2,
    play: true,
});
```





### 大小写命名

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510125940204.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510125940204.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510125940204.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510125940204.png" loading="lazy"/>
  </picture>



### props验证

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131608701.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131608701.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131608701.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131608701.png" loading="lazy"/>
  </picture>



#### 多个可能的类型

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131652296.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131652296.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131652296.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131652296.png" loading="lazy"/>
  </picture>

#### 必填属性

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131906720.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131906720.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131906720.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510131906720.png" loading="lazy"/>
  </picture>



#### 为属性提供默认值

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue%2Ftheory/image-20220510132107449.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue%2Ftheory/image-20220510132107449.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue%2Ftheory/image-20220510132107449.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue%2Ftheory/image-20220510132107449.png" loading="lazy"/>
  </picture>



#### 自定义验证函数

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510132234337.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510132234337.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510132234337.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510132234337.png" loading="lazy"/>
  </picture>









## emits(自定义事件)

### 简介

可以理解成是生命周期，外面向该组件传一个函数，该组件来决定什么时候触发这个函数且向这个函数传参。

$emit触发的是外面传进来的方法。

### 用处

子组件向父组件传输数据

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510143200066.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510143200066.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510143200066.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510143200066.png" loading="lazy"/>
  </picture>



### 封装组件时使用步骤

1. 子组件声明自定义事件，子组件只管事件什么时候触发并给父组件传递参数

   ```vue
   <!-- 子组件 child.vue -->
   <script setup>
   const emit = defineEmits(['custom-event'])
   /*ts
   const emitter = defineEmits<{
     (e: 'change'): void // 无参数
     (e: 'update', value: string): void //有参数
   }>()
   
   or
   
   export const loaderEmits = {
     'to-bottom': () => true
   };
   export type LoaderEmits = typeof loaderEmits;
   const emit = defineEmits(loaderEmits)
   */
   
   const callEvent = () => {
     const now = new Date()
     //什么时候触发事件是由子组件定的,并且触发后给父组件传递参数
     emit('custom-event', now) //now 会被传过去
   }
   </script>
   
   <template>
     <button @click="callEvent">点击</button>
   </template>
   
   ```

   

   

2. 父组件触发自定义事件，父组件可以决定事件触发后干什么

   ```vue
   <!-- 父组件 parent.vue -->
   <script setup>
   import child from './child.vue'
   
   const handleCustomEvent = (val) => {
     console.log(val)
   }
   </script>
   
   <template>
     <child @custom-event="handleCustomEvent"></child>
   </template>
   ```

   









## 生命周期

 可以通过多次调用 onMounted 函数来注册多个钩子函数

### 全览

- Vue3.0中可以继续使用Vue2.x中的生命周期钩子，但有有两个被更名：
  - ```beforeDestroy```改名为 ```beforeUnmount```
  - ```destroyed```改名为 ```unmounted```
  
- Vue3.0与Vue2.x中钩子对应关系如下：
  
  setup()在派发声明周期钩子之前就执行完了
  
  - `beforeCreate`===>`setup()`
  - `created`=======>`setup()`   （setup函数中就会初始化数据函数等等就相当于created的过程，在组件被创建之前，`props` 被解析之后执行）
  - `beforeMount` ===>`onBeforeMount`（api名字是有on的）
  - `mounted`=======>`onMounted`
  - `beforeUpdate`===>`onBeforeUpdate`
  - `updated` =======>`onUpdated`
  - `beforeUnmount` ==>`onBeforeUnmount`
  - `unmounted` =====>`onUnmounted`

- **beforeCreate（创建前）**: 数据观测和初始化事件还未开始，data、watcher、methods都还不存在，但是$route已存在，可以根据路由信息进行重定向等操作。通常用于插件开发中执行一些初始化任务。
- **created(创建后)**：在实例创建之后、模板渲染成html前被调用，该阶段可以访问data，使用watcher、events、methods，也就是说 响应式 已完成。但是此时dom还没有被挂载。<mark>该阶段允许执行http请求操作。</mark>组件初始化完毕，可以访问各种数据，获取接口数据等
- **beforeMount （挂载前）**：将HTML解析生成AST节点，再根据AST节点动态生成渲染函数。相关render函数首次被调用。在组件DOM实际渲染之前调用，此时根元素还不存在，想访问根元素的话就必须在根元素上使用ref。（如果在beforeMount注册宏任务，会被放入宏任务队列首位，本轮微任务完即render渲染后，开启下一轮，如果此时用户点击或其他事件，回调函数一定会在注册的宏任务后执行。如果是微任务的话，那肯定会被注册在render前，可以在render前执行。）
- **mounted (挂载后)**：在模板编译成html后调用，执行render函数生成虚拟dom，创建真实dom替换虚拟dom，并挂载到实例。dom已创建，可用于获取访问数据和dom元素、事件监听、访问子组件等
- **beforeUpdate**：vm.data更新之后，虚拟dom重新渲染之前被调用。此时`view`层还未更新，可用于获取更新前各种状态。beforeUpdate对于跟踪对组件的编辑次数，甚至跟踪创建撤销功能的操作很有用。
- **updated**：虚拟dom重新渲染后调用，若在这里再次修改$vm.data，会再次触发beforeUpdate、updated，进入死循环。
- **beforeUnmount**：实例被销毁前调用，也就是说在这个阶段还是可以调用实例的。可用于一些定时器或订阅的取消
- **unmounted**：实例被销毁后调用，所有的事件监听器已被移除，子实例被销毁



### 全览图 



<picture>
    <source type="image/avif" srcset="https://cn.vuejs.org/assets/lifecycle.16e4c08e.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://cn.vuejs.org/assets/lifecycle.16e4c08e.png?imageMogr2/format/webp">
    <img src="https://cn.vuejs.org/assets/lifecycle.16e4c08e.png" alt="https://cn.vuejs.org/assets/lifecycle.16e4c08e.png" loading="lazy"/>
  </picture>





### **ajax请求放在vue的哪个 生命周期 中？**

在 created、beforeMount、mounted（在mounted中发请求会进行二次渲染（渲染了一次没数据的，然后又渲染了一次有数据的））。

因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。但是最常用的是在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求**好处：**

第一点：请求回来的时候就走挂载组件阶段，相比于在mounted的时候再发请求，减少了mounted等待的时间。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220929222723395.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220929222723395.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220929222723395.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20220929222723395.png" loading="lazy"/>
  </picture>

第二点：放在 created 中有助于一致性，因为ssr 不支持 beforeMount 、mounted 钩子函数。



### 父组件与子组件的顺序

#### 初次渲染就会触发的生命周期

beforeCreate() , created()，beforeMount() , mounted()


组件的调用顺序都是先父后子,渲染完成的顺序是先子后父。 组件的销毁操作是先父后子，销毁完成的顺序是先子后父。

#### 加载渲染过程 

子组件在父组件的beforeMount和Mounted之间渲染

- 父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

  

#### 子组件更新过程

- 父beforeUpdate->子beforeUpdate->子updated->父updated



#### 父组件更新过程

- 影响到子组件： - 父beforeUpdate -> 子beforeUpdate->子updated -> 父updted
- 不影响子组件： - 父beforeUpdate -> 父updated

#### 销毁过程

- 父beforeDestroy->子beforeDestroy->子destroyed->父destroyed





### 其他钩子

当引入`keep-alive` 的时候，页面第一次进入，钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。当<font color="red">再次进入（前进或者后退）时，只触发activated。</font>**`keep-alive`钩子在服务器端渲染期间不被调用。**

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/image-20220705181457135.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/image-20220705181457135.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/image-20220705181457135.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/image-20220705181457135.png" loading="lazy"/>
  </picture>



#### 组件调试钩子[](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#component-debugging-hooks)

我们可以在一个组件渲染时使用 `onRenderTracked` 生命周期钩子来调试查看哪些依赖正在被使用，或是用 `onRenderTriggered` 来确定哪个依赖正在触发更新。这些钩子都会收到一个调试事件，其中包含了触发相关事件的依赖的信息。推荐在回调中放置一个 `debugger` 语句，使你可以在开发者工具中交互式地查看依赖：

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

TIP

组件调试钩子仅会在开发模式下工作

调试事件对象有如下的类型定义：

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```







#### 计算属性调试[](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#computed-debugging)

我们可以向 `computed()` 传入第二个参数，是一个包含了 `onTrack` 和 `onTrigger` 两个回调函数的对象：

- `onTrack` 将在响应属性或引用作为依赖项被跟踪时被调用。
- `onTrigger` 将在侦听器回调被依赖项的变更触发时被调用。

这两个回调都会作为组件调试的钩子，接受[相同格式](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#debugger-event)的调试事件：

```
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 当 count.value 被追踪为依赖时触发
    debugger
  },
  onTrigger(e) {
    // 当 count.value 被更改时触发
    debugger
  }
})

// 访问 plusOne，会触发 onTrack
console.log(plusOne.value)

// 更改 count.value，应该会触发 onTrigger
count.value++
```

TIP

计算属性的 `onTrack` 和 `onTrigger` 选项仅会在开发模式下工作。



#### 侦听器调试[](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#watcher-debugging)

和 `computed()` 类似，侦听器也支持 `onTrack` 和 `onTrigger` 选项：

```
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

TIP

侦听器的 `onTrack` 和 `onTrigger` 选项仅会在开发模式下工作。









## 数据共享

### 父-->子

props



### 子-->父

这种方式依然满足 单向数据流， 因为只是给父组件暴露一些数据，并没有修改父组件的数据。

#### emits

#### defineExpose 与 ref属性

获取子组件中的属性值或方法

子组件

```vue
<template></template>

<script lang="ts" setup>
let sex=ref('男')
let info=reactive({
    like:'喜欢李诗晴',
    age:27
})
// 将组件中的属性暴露出去，这样父组件可以获取
defineExpose({
    sex,
    info
})
</script>
```

父组件

```vue
<template>
  <div class="home">
    <test-com @myAdd="myAddHander" @myDel='myDelHander' ref="testcomRef"></test-com>
    <button @click="getSonHander">获取子组件中的数据</button>
  </div>
</template>
<script lang="ts" setup>
import TestCom from "../components/TestCom.vue"
const testcomRef = ref()
const getSonHander=()=>{
  console.log('获取子组件中的性别', testcomRef.value.sex );
  console.log('获取子组件中的其他信息', testcomRef.value.info );
}
</script>
```



#### 不用ref 自己模拟ref(只适合弹窗队列这种不能够用ref的时候)



```vue
// 正常模版引用ref
<script setup>
const child = ref(null) // 这个变量会拿到child的实例
</script>

<template>
  <Child ref="child" />
</template>
```



模版引用机制是vue 的渲染器实现的，在不能使用 模版引用ref 的时候（比如我的弹窗队列），我们可以模拟 ref 的这个机制用于 子组件给父组件传一些数据。

```vue
// parent.vue
<script setup>
const handler // 这个变量会拿到 child 在上面挂载的数据。跟模版引用一样的原理，只是vue渲染器在模版引用上挂了一个组件实例，而你是挂一些数据。
handler.closePopup()
</script>

<template>
  <Child :customRef="handler" />
</template>

//child.vue
<script setup>
const props = defineProps({
  customRef
})
props.customRef.closePopup = ()=>{...}
</script>
```











### 父<-->子

v-model



### 父-->后代

#### provide&inject

##### 使用

祖组件中：

```js
setup(){
	......
  import type { InjectionKey } from '@vue/composition-api';

export const TabItemProvider: string | InjectionKey<TabInfo> = 'tab-item-provider';
provide(TabItemProvider, state)

    ......
}
```

后代组件中：

注入会在组件自身的状态**之前**被解析，因此你可以在 `data()` 中访问到注入的属性。 注入不会保持响应性。

```js
setup(props,context){
	......
const tabs = inject(TabItemProvider);
	......
}
```

##### 使注入变成响应性

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511163123498.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511163123498.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511163123498.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511163123498.png" loading="lazy"/>
  </picture>



##### 应用层 Provide[#](https://cn.vuejs.org/guide/components/provide-inject.html#app-level-provide)

除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

js

```
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写[插件](https://cn.vuejs.org/guide/reusability/plugins.html)时会特别有用，因为插件一般都不会使用组件形式来提供值。

### 兄弟间

[所有组件实例属性见此](https://cn.vuejs.org/api/component-instance.html)

 `$parent`：当前组件可能存在的父组件实例，如果当前组件是顶层组件，则为 `null`。

 `$root` ：当前组件树的根组件实例。如果当前实例没有父实例，此实例将会是其自己。

 





## 插槽

### 简介

作用：让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于 <strong style="color:red">父组件 ===> 子组件</strong> 

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。（即写在哪个文件里就在哪里编译）



### 默认插槽

```vue
父组件中：
        <Category>
           <div>html结构1</div>
        </Category>
子组件中：
        <template>
               <!-- 定义插槽 -->
               <slot>插槽默认内容...</slot>
        </template>
```

### 具名插槽

```vue
父组件中：
        <Category>
            <template v-slot:center>
               <div>html结构</div>
            </template>
        </Category>
子组件中：
        <template>
               <!-- 定义插槽 --><!--一个不带 name 的 <slot> 出口会带有隐含的名字“default”-->
               <slot name="center">插槽默认内容...</slot>
        </template>
```

### 作用域插槽

1. 理解：<span style="color:red">子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。</span>也可以通过props传数据给这个子组件，子组件接收后再在slots中传回给父组件。

2. 具体编码：

   ```vue
   父组件中：
   		<Category>
   			<template v-slot:slotName="{games}"> <!--解构插槽的props-->
   				<!-- 生成的是h4标题 -->
   				<h4 v-for="g in scopeData.games" :key="g">{{g}}</h4>
   			</template>
   		</Category>
   
   子组件中：
           <template>
                   <slot name="slotName" :games="games"></slot> <!--传给父组件的值-->
           </template>
   		
           <script>
               export default {
                   name:'Category',
                   //数据在子组件自身
                   data() {
                       return {
                           games:['红色警戒','穿越火线','劲舞团','超级玛丽']
                       }
                   },
               }
           </script>
   ```



### 缩写

 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`





### 简写

当组件只有一个默认插槽，没有别的插槽时，组件的标签可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```html
<todo-list v-slot:default="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

这种写法还可以更简单：

```html
<todo-list v-slot="slotProps">
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```



### 显式暴露slots类型defineSlots()[](https://cn.vuejs.org/api/sfc-script-setup.html#defineslots)

这个宏可以用于为 IDE 提供插槽名称和 props 类型检查的类型提示。

`defineSlots()` 只接受类型参数，没有运行时参数。类型参数应该是一个类型字面量，其中属性键是插槽名称，值类型是插槽函数。函数的第一个参数是插槽期望接收的 props，其类型将用于模板中的插槽 props。返回类型目前被忽略，可以是 `any`，但我们将来可能会利用它来检查插槽内容。

它还返回 `slots` 对象，该对象等同于在 setup 上下文中暴露或由 `useSlots()` 返回的 `slots` 对象。

```
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { msg: string }): any
}>()
</script>
```

### 通过h()方法传入slots

- 传入slots

在 `h()` 函数的调用中，你可以将 slots 对象作为第三个参数传入。这个 slots 对象应该是一个包含了各个 slot 的函数的对象。每个函数返回的值将被用作对应 slot 的内容。

例如，以下是一个使用 `h()` 函数创建一个具有默认 slot 和名为 "header" 的 slot 的组件的示例：

``` javascript
import Child from './Child.vue';
h(MyComponent, null, { // 这里不传入 props，所以为null
  default: () => 'Default slot content',
  header: h(Child)
})
```

在这个例子中，`MyComponent` 是一个 Vue 组件，`default` 和 `header` 是 slots 的名字，它们的值是一个函数，这个函数返回的值将被用作 slot 的内容。



## 样式相关

### 动态样式

#### class

##### 绑定class

方式一：指定 class 为一个字符串值。

方式二：指定 class 为一个对象值。

方式三：class 是包含上述两种类型的数组。: 

```js
01 <p :class="arr"></p>
01 const arr = [
02   // 字符串
03   'foo bar',
04   // 对象
05   {
06     baz: true
07   }
08 ]
```



#### style

##### 绑定style

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510130510800.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510130510800.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510130510800.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220510130510800.png" loading="lazy"/>
  </picture>



##### `<style>`标签中使用 v-bind

```vue
<template>
  <span> 有开始循环了-开端 </span>  
</template>
<script setup>
  import { reactive } from 'vue'
  const state = reactive({
    color: 'red'
  })
</script>
<style scoped>
  span {
    /* 使用v-bind绑定state中的变量 */
    color: v-bind('state.color');
  }  
</style>
```







### 样式穿透 `:deep`

<mark>原理：        `  // .foo ::v-deep(.bar) -> .foo[xxxxxxx] .bar` --- 这是vue3源码里的注释。`:deep()`</mark>就是让这个选择器不带上属性选择器，这个属性以组件上为维度，即同个组件里的元素的属性是一样的。

```css
:deep(.el-carousel__container) {
  height: 100%;
}
```

写在`<style>`里面的样式的最后那个层级都会带上属性选择器。模版编译的时候写在`<template>`里的每个元素都会带上一个自定义属性，而v-html里不会带上自定义属性，所以写在style里的样式不会在v-html里生效。

解决方法：可以用`:deep(xxx)`使得xxx编译出来之后不带上属性选择器。然后它的上一级会带上属性选择器。

反正就是总会有“最后一级”带上属性选择器：

```less
/*编译前*/
.remind-popup{
  .sub-title{
    :deep(span){}
  }
}

/*编译后*/
.remind-popup[data-v-3c8945e3] {}
.remind-popup .sub-title[data-v-3c8945e3] {}
.remind-popup .sub-title[data-v-3c8945e3] span {}/*:deep(span)*/

/*如果没有:deep()*/ .remind-popup .sub-title span[data-v-3c8945e3] {}
```



## 渲染API

### 渲染函数

对于开发者而言：渲染函数并不是说vue暴露了一个render方法给开发者，而是编译完之后会产生一个【渲染函数】。

Vue.js 会根据组件的 render 函数的返回值拿到虚拟 DOM，然后就可以把组件的内容渲染出来了。



### h()&jsx

https://cn.vuejs.org/guide/extras/render-function.html

jsx和h()都是<mark>返回虚拟dom对象</mark>，即目的都是为了让用户更轻易写虚拟dom，如果你牛比的话也可以直接写虚拟dom对象。

vue中你没装jsx插件的话就只能写h()。



### tsx组件

在 Vue 3 中使用 JSX 开发组件需要安装 `@vue/babel-plugin-jsx` 插件。

https://cn.vuejs.org/api/general.html#definecomponent



```js
import { ref, h } from 'vue'

const Comp = defineComponent(
  (props) => {
    // 就像在 <script setup> 中一样使用组合式 API
    const count = ref(0)

    return () => {
      // 渲染函数或 JSX(一般如果这样写都是用jsx，谁会写h()啊，难写的一逼)
      return h('div', count.value)
    }
  },
  // 其他选项，例如声明 props 和 emits。
  {
    props: {
      /* ... */
    }
  }
)
```













## 组件的类型

### 组件间类型提示

直接在`<template>`里调用一个组件就会有props、emits、slots的类型提示。



也可以显式对外暴露出类型：

```ts
/*props*/
export interface PopupProps {
    show?: boolean;
}
const props = withDefaults(defineProps<PopupProps>(), {
    show: false,
});

/*emits 的方式看看dialog-queue怎么搞*/
export const loaderEmits = {
  'to-bottom': () => true
};
export type LoaderEmits = typeof loaderEmits;
defineEmits(LoaderEmits)

/*slots*/
export type LoaderSlots = {
  default?: () => VNode[] | undefined;
};
```



###  **编写泛型组件**

vue2.7的可以看marquee-slide组件天翔skyline是怎么写的。

如：这样插槽里面还是没有类型提示。

```ts
import type { VNode } from 'vue';
import OriginalSwiper from './swiper.vue';
const Swiper = OriginalSwiper as any as new <T>(props: {
    readonly list: T[];
}) => {
    $props: typeof props;
  	$emit: {
        (event:'item-click', data: T, index: number): void
    }
    $scopedSlots: {
        default?: (scope: { item: T; index: number }) => VNode[] | undefined;
        empty?: () => VNode[] | undefined;
    };
};
export default Swiper;
```



Vue3的可以看list-wrapper组件怎么写。





###  手动标注导出的组件的类型(不需要了)

注意：

- 不管这个组件是不是需要 $props,  $props 这个字段我们都必须写，否则 volar 认不出来这个是组件

- Vue 2 中 slots 统一用 $scopedSlots 进行标注，Vue 3 中 slots 统一用 $slots 进行标注。

```ts
import type { VNode } from 'vue';
import OriginalSwiper from './swiper.vue';
type Data = any;
const Swiper = OriginalSwiper as any as new (props: {
    readonly list: Data[];
}) => {
    $props: typeof props;
  	$emit: {
        (event:'item-click', data: any, index: number): void
    }
    $scopedSlots: {
        default?: (scope: { item: Data; index: number }) => VNode[] | undefined;
        empty?: () => VNode[] | undefined;
    };
};
export default Swiper;
```











## 服务端渲染

### 钩子

在服务器端渲染（SSR）中，只有 `beforeCreate` 和 `created` 生命周期钩子会被执行。这是因为服务器端渲染只负责渲染初始的应用状态，不会有用户交互，因此不需要执行如 `mounted`、`updated` 和 `unmounted` 等在客户端才会发生的生命周期钩子。

此外，Vue 3 引入了一个新的生命周期钩子 `serverPrefetch`，它专门用于服务器端渲染。你可以在这个钩子中获取数据，然后在服务器端渲染完成后，将数据附加到渲染结果中，从而避免在客户端再次获取数据。



### 只在浏览器or只在服务器

构建工具在为客户端打包资源的时候，会在资源中排除被 import.meta.env.SSR 包裹的代码。

有时你不得不使用浏览器特有的 API。这时你可以使用诸如 import.meta.env.SSR 这样的环境变量来做代码守卫：

```js
01 <script>
02 if (!import.meta.env.SSR) {
03   // 使用浏览器平台特有的 API
04   window.xxx
05 }
06
07 export default {
08   // ...
09 }
10 </script>
```



### `<ClientOnly> `

`<ClientOnly> `组件的实现：

```js
01 import { ref, onMounted, defineComponent } from 'vue'
02
03 export const ClientOnly = defineComponent({
04   setup(_, { slots }) {
05     // 标记变量，仅在客户端渲染时为 true
06     const show = ref(false)
07     // onMounted 钩子只会在客户端执行
08     onMounted(() => {
09       show.value = true
10     })
11     // 在服务端什么都不渲染，在客户端才会渲染 <ClientOnly> 组件的插槽内容
12     return () => (show.value && slots.default ? slots.default() : null)
13   }
14 })
```



原理是利用了 onMounted 钩子只会在客户端执行的特性。我们创建了一个标记变量 show，初始值为 false，并且仅在客户端渲染时将其设置为 true。这意味着，在服务端渲染的时候，`<ClientOnly>` 组件的插槽内容不会被渲染。而在客户端渲染时，只有等到 mounted 钩子触发后才会渲染`<ClientOnly>` 组件的插槽内容。`<ClientOnly>` 组件并不会导致客户端激活失败，因为在客户端激活的时候，mounted 钩子还没有触发，所以服务端与客户端渲染的内容一致，即什么都不渲染。等到激活完成，且 mounted 钩子触发执行之后，才会在客户端将`<ClientOnly>` 组件的插槽内容渲染出来。





# 路由

## 前端路由与后端路由

### 后端路由

输入url后，请求发送到服务器，服务器解析请求的路径然后拿取对应的页面返回回去。（缺点是服务器压力比较大）



### 前端路由

输入url后，js解析地址然后找到对应的组件，再把这个组件渲染到相应的位置。

前端路由可以帮助我们在仅有一个页面的情况下，“记住”用户当前走到了哪一步——为 SPA 中的各个视图匹配一个唯一标识。

- 拦截用户的刷新操作，避免服务端返回不符合预期的资源内容。把刷新这个动作完全放到前端逻辑里消化掉。
- 感知 URL 的变化。根据这些变化、用 JS 去给它生成不同的内容。



## `useRouter()`和`useRoute()`

### 简介

在vue中main.js全局注册了router后，每个组件（路由组件和非路由组件都会有）都会拥有`$route`和`$router`

- $route 是“路由信息对象”，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数
- $router 是“路由实例”对象包括了路由的跳转方法，钩子函数等

 

因为我们在 `setup` 里面没有访问 `this`，所以我们不能再直接访问 `this.$router` 或 `this.$route`。作为替代，我们使用 `useRouter` 函数。 <font color="red">（这两函数必须在 setup() 内部调用。）（在模板中我们仍然可以访问 `$router` 和 `$route`）</font>

```javascript
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      })
    }
  },
}
```

### 监听`route`对象

`route` 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该**避免监听整个 `route`** 对象：

```javascript
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const userData = ref()

    // 当参数更改时获取用户信息
    watch(
      () => route.params,
      async newParams => {
        userData.value = await fetchUser(newParams.id)
      }
    )
  },
}
```







## 基本使用

### router配置项

#### path

相对路径（不带‘/’）会拼接父级路由，绝对路径（带‘/’）是配置的完整路由



路由中不能使用异步组件

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import todosRoutes from './routes'
import createRouteGuard from './guard'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			redirect: '/todos/home',
		},
		{
			path: '/todos',
			name: 'todos',
			redirect: '/todos/home',
			component: () => import('@/layouts/todos.vue'),
			children: todosRoutes, 
		},
		{
			path: '/login',
			name: 'auth-login',
			component: () => import('@/views/auth/login/index.vue'),
			meta: {
				requiresAuth: false,
			},
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'notFound',
			component: () => import('@/views/not-found/index.vue'),
		},
	],
	scrollBehavior() {
		return { top: 0 }
	},
})

createRouteGuard(router)
export default router
```

### 路由跳转

可以通过name 或 path进行跳转

#### 声明式导航

##### 基本使用

务必要有to属性, active-class可配置高亮样式

```vue
<router-link active-class="active" to="/home/news">News</router-link>
```

##### ```<router-link>```的replace属性

1. 浏览器的历史记录有两种写入方式：分别为```push```和```replace```，```push```是追加历史记录，```replace```是替换当前记录。路由跳转时候默认为```push```
2. 如何开启```replace```模式：```<router-link replace .......>News</router-link>```



##### 缓存路由组件

```vue
<keep-alive :include="['News','Message']"> <!--include里面的是组件名！如果不写include属性那就是所有组件都保持挂载。-->
    <router-view></router-view>
</keep-alive>
```



#### 编程式导航

就是利用`$router`的API

```js
this.$router.push({
	name:'xiangqing',
		params:{
			id:xxx,
			title:xxx
		},
   query:{
    kk:xxx
  }
})

this.$router.replace({
	name:'xiangqing',
		params:{
			id:xxx,
			title:xxx
		},
  query:{
    kk:xxx
  }
})
this.$router.forward() //前进
this.$router.back() //后退
this.$router.go() //可前进也可后退
```



#### 路由参数

##### 路由的query参数

- 配置路由格式：`/router`，也就是普通配置
- 传递的方式：对象中使用query的key作为传递方式
- 传递后形成的路径：`/route?id=123`

###### 传递参数

```vue
// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<!-- 跳转并携带query参数，to的对象写法 -->
<router-link 
	:to="{
		path:'/home/message/detail',
		query:{
		   id:666,
            title:'你好'
		}
	}"
>跳转</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})

// 方法5：
<!-- 跳转并携带query参数，to的字符串写法 -->
<router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>
```

###### 接收参数

```js
$route.query.id
$route.query.title
```



##### 路由的params参数

- 配置路由格式：`/router/:id`
- 传递的方式：在path后面跟上对应的值
- 传递后形成的路径：`/router/123`

###### 配置路由，声明接收params参数

```js
{
	name:'xiangqing',
	path:'detail/:id/:title', //使用占位符声明接收params参数（如果不传后面的params就匹配不到该路由）
	component:Detail
}
```

###### 传递参数

`params` 不能与 `path` 一起使用，要么path就带上了所有参数，要么就name加params

```vue
// 声明式
<!-- 跳转并携带params参数，to的字符串写法 -->
<router-link :to="/home/message/detail/666/你好">跳转</router-link>
				
<!-- 跳转并携带params参数，to的对象写法 -->`params` 不能与 `path` 一起使用
<router-link 
	:to="{
		name:'xiangqing',
		params:{
		   id:666,
       title:'你好'
		},
    query:{
    	kk:xxx   
    }
	}"
>跳转</router-link>

// 编程式
this.$router.push({name:'users',params:{uname:wade}}) // 传入对象，`params` 不能与 `path` 一起使用
this.$router.push('/user/' + wade) // 传入字符串
```

###### 接收参数

```js
$route.params.id
```



##### params和query的区别

*本质是query和params都会被放到path上，前端路由就通过path通信*

用法上有区别，params需要在route配置时有占位符，且如果path上没有传params是匹配不到这个路由的。而query就类似一个附属品，不需要额外配置也不影响路由匹配。



##### [当两个页面如`/product/a`和`/product/b`都指向同一个组件时vue-router 会重用一个组件实例](https://segmentfault.com/a/1190000041371323)

问题描述：

当两个页面如`/product/a`和`/product/b`都指向同一个组件：`product.vue`时，组件内部拿到的`this.$router`是相同的。这造成例如获取this.$route.path不是预期的值，或者当在同一个页面多次使用同一个组件的时候，其created与 mounted只会在第一次加载时执行，导致只有一个实例（正确的应该是多次使用同一个组件就应该有多个这个组件的实例），继而导致一直在调用同一个实例。等问题



解决方法：

方法一：**监听路由**
在路由切换的时候，监听路由获取参数，并根据参数加载重新数据。

```javascript
watch: {
  '$route' (to, from) {
    let dataId = this.$route.params.dataId;
    this.initData(dataId);
  }
}
```

缺点：组件被重新渲染，组件上的内容随路由参数的变化而丢失。每次切页面的时候都会重新渲染



方法二：用 :key 来阻止“复用”。由于前后两个路由的$route.fullPath并不一样, 组件不会被强制复用。这也意味着组件的生命周期钩子会再次被调用。

```html
<router-view :key="$route.fullPath" />
```



#### 路由的props配置(少用)

https://router.vuejs.org/zh/guide/essentials/passing-props.html#%E5%B0%86-props-%E4%BC%A0%E9%80%92%E7%BB%99%E8%B7%AF%E7%94%B1%E7%BB%84%E4%BB%B6

​	作用：让路由组件更方便的收到参数

```js
{
	name:'xiangqing',
	path:'detail/:id',
	component:Detail,

	//第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
	// props:{a:900}

	//第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件(这种写法的缺点就是只能把params参数传给组件，query参数就传不了了)
	// props:true
	
	//第三种写法（最常用写法）：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
	props($route){
		return {
			id:$route.query.id,
			title:$route.query.title
		}
	}
}
```

#### 命名路由

1. 作用：可以简化路由的跳转。

2. 如何使用

   1. 给路由命名：

      ```js
      {
      	path:'/demo',
      	component:Demo,
      	children:[
      		{
      			path:'test',
      			component:Test,
      			children:[
      				{
                            name:'hello' //给路由命名
      					path:'welcome',
      					component:Hello,
      				}
      			]
      		}
      	]
      }
      ```

   2. 简化跳转：

      ```vue
      <!--简化前，需要写完整的路径 -->
      <router-link to="/demo/test/welcome">跳转</router-link>
      
      <!--简化写法：直接通过名字跳转，配合传递参数 -->
      <router-link 
      	:to="{
      		name:'hello',
      		query:{
      		   id:666,
                  title:'你好'
      		}
      	}"
      >跳转</router-link>
      ```

#### 匹配到不存在的路由

```typescript
const routes: RouteRecordRaw[] = [
	{
		path: '/:any(.*)', //定义404页面
    path: '/:pathMatch(.*)*',//或者这样写也行
		name: 'notFound',
		component: () => import('@/views/errors/404.vue'),
	},
]
```



#### Vue-router跳转和location.href有什么区别

- 使用 `location.href= /url `来跳转，刷新了页面(向服务器请求)；
- 使用 `history.pushState( /url )` ，无刷新页面(向服务器请求)；
- 使用 `router.push( /url )` 来跳转，使用了 `diff` 算法，减少了 dom 的消耗。其实使用 router 跳转和使用 `history.pushState()` 没什么差别的，因为vue-router就是用了 `history.pushState()` ，尤其是在history模式下。







### 指定展示位置

```vue
<router-view></router-view>
```







### 懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。利用路由懒加载我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样会更加高效，是一种优化手段。

一般来说，对所有的路由**都使用动态导入**是个好主意。

给`component`选项配置一个返回 Promise 组件的函数就可以定义懒加载路由。例如：

```
{ path: '/users/:id', component: () => import('./views/UserDetails') }
```

结合注释`() => import(/* webpackChunkName: "group-user" */ './UserDetails.vue')`可以做webpack代码分块

vite中结合[rollupOptions](https://link.juejin.cn?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fguide%2Fadvanced%2Flazy-loading.html%23%E4%BD%BF%E7%94%A8-vite)定义分块

路由中不能使用异步组件




（1）方案一(常用)：使用箭头函数+import动态加载

```js
const List = () => import('@/components/list.vue')
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```



（2）方案二：使用箭头函数+require动态加载

```js
const router = new Router({
  routes: [
   {
     path: '/list',
     component: resolve => require(['@/components/list'], resolve)
   }
  ]
})
```

（3）方案三：使用webpack的require.ensure技术，也可以实现按需加载。 这种情况下，多个路由指定相同的chunkName，会合并打包成一个js文件。

```js
// r就是resolve
const List = r => require.ensure([], () => r(require('@/components/list')), 'list');
// 路由也是正常的写法  这种是官方推荐的写的 按模块划分懒加载 
const router = new Router({
  routes: [
  {
    path: '/list',
    component: List,
    name: 'list'
  }
 ]
}))
```



### 获取页面的hash变化

**（1）监听$route的变化**

```javascript
// 监听,当路由发生变化的时候执行
watch: {
  $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
},
```

**（2）window.location.hash读取#值**

window.location.hash 的值可读可写，读取来判断状态是否改变，写入时可以在不重载网页的前提下，添加一条历史访问记录。



（3）每次路由跳转时都知道路由变化。

所以可以借此利用发布订阅模式去监听路由变化来实现某些组件的更新。



## 路由两种模式

Vue-Router有两种模式：**hash模式**和**history模式**。默认的路由模式是hash模式。

### [Hash 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#hash-模式)

#### 简介

 hash模式是开发中默认的模式，它的URL带着一个#。hash值会出现在URL里面，但是不会出现在HTTP请求中，对后端完全没有影响。所以哪怕刷新了页面，#号后的部分也不会发给服务器，所以这个模式不需要服务器做任何处理。改变hash值，不会重新加载页面。这种模式的浏览器支持度很好，低版本的IE浏览器也支持这种模式。hash路由被称为是前端路由。**它不利于 SEO**。

#### 用法

hash 模式是用 `createWebHashHistory()` 创建的：

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```







### [HTML5 （history）模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html#html5-模式)

#### 简介

URL 会看起来很 "正常"，例如 `https://example.com/user/id`。服务器会接收这个请求，并解析这个URL，然后做出相应的逻辑处理。history模式需要后台配置支持。如果后台没有正确配置，访问时会返回404。只需在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 `index.html` 相同的页面。具体服务器怎么配置[点击这里](https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B)



#### 用法

用 `createWebHistory()` 创建 HTML5 模式，推荐使用这个模式：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```



### 两种模式对比

hash路由：1.所有路径都带#（锚点）。 2. 服务端无法解析锚点里的内容。

history模式：1.无锚点。2.服务器可以完整的解析出路径。



以下内容待定是否删除？？

调用 history.pushState() 相比于直接修改 hash，存在以下优势:

- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。
- hash模式下，仅hash符号之前的url会被包含在请求中，后端如果没有做到对路由的全覆盖，也不会返回404错误；history模式下，前端的url必须和实际向后端发起请求的url一致，如果没有对用的路由处理，将返回404错误。





## 路由守卫（钩子函数）

### 守卫方法接收三个参数

#### **`to`**: 

即将要进入的目标 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)

#### **`from`**:

 当前导航正要离开的路由 [用一种标准化的方式](https://router.vuejs.org/zh/api/#routelocationnormalized)

#### Next：

`next()`: 放行，进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 \**confirmed\** (确认的)。**

`next(false)`: <font color="red">中断当前的导航</font>。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。

`next('/')` 或者 `next({ path: '/' })`: <font color="red">当前的导航被中断，跳转到一个不同的地址。</font>你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 [`router-link` 的 `to` prop](https://link.juejin.cn?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fapi%2F%23to) 或 [`router.push`](https://link.juejin.cn?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fapi%2F%23router-push) 中的选项。

**\**`next(error)`\**: (2.4.0+) 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 [`router.onError()`](https://link.juejin.cn?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fapi%2F%23router-onerror) 注册过的回调。**

```js
//错误用法： 下面的写法会死循环
     beforeRouteLeave (to, from, next) {
        console.log('离开路路由')
       next('/home')
}

// 正确写法：判断一下路由
beforeRouteLeave (to, from, next) {
       if(to.fullPath==='/home'){
         next();
       }else{
         next('/home')
       }
```



### 可以返回的值

- `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
- 一个[路由地址](https://router.vuejs.org/zh/api/#routelocationraw): 通过一个路由地址跳转到一个不同的地址，就像你调用 [`router.push()`](https://router.vuejs.org/zh/api/#push) 一样，你可以设置诸如 `replace: true` 或 `name: 'home'` 之类的配置。当前的导航被中断，然后进行一个新的导航，就和 `from` 一样。

如果遇到了意料之外的情况，可能会抛出一个 `Error`。这会取消导航并且调用 [`router.onError()`](https://router.vuejs.org/zh/api/#onerror) 注册过的回调。

如果什么都没有，`undefined` 或返回 `true`，**则导航是有效的**，并调用下一个导航守卫



### 全局守卫

beforeEach、beforeResolve、afterEach

```js
//全局前置守卫：每次路由切换前执行，
router.beforeEach((to,from,next)=>{
	if(to.meta.isAuth){ //判断当前路由是否需要进行权限控制
		if(localStorage.getItem('school') === 'atguigu'){ //权限控制的具体规则
			next() //放行
		}else{
			alert('暂无权限查看')
			// next({name:'guanyu'})
		}
	}else{
		next() //放行
	}
})


//全局解析守卫，在 beforeRouteEnter 调用之后调用，确保在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用。router.beforeResolve 是获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})



//全局后置守卫：每次路由切换后执行，这些钩子不会接受 next 函数也不会改变导航本身。（可用于跳转之后滚动条回到顶部）
router.afterEach((to,from)=>{
	console.log('afterEach',to,from)
	if(to.meta.title){ 
		document.title = to.meta.title //修改网页的title
	}else{
		document.title = 'vue_test'
	}
})
```

### 独享守卫

路由独享的守卫：beforeEnter



直接在路由配置上定义 `beforeEnter` 守卫：

```javascript
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

<font color="red">`beforeEnter` 守卫 **只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发</font>。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。它们只有在 **从一个不同的** 路由导航时，才会被触发。

你也可以将一个函数数组传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用：

```javascript
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

你也可以通过使用[路径 meta 字段](https://router.vuejs.org/zh/guide/advanced/meta.html)和[全局导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#global-before-guards)来实现类似的行为。

### 组件内守卫

组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

可以用在任何由` <router-view>` 渲染的组件中

```js
import { onBeforeRouteEnter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

export default {
  setup() {
    //在渲染该组件的对应路由被验证前调用,该守卫执行前组件实例还没有被创建，所以可以传一个回调给 next来访问
    onBeforeRouteEnter((to, from) => {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      // 取消导航并停留在同一页面上
      if (!answer) return false
    })

    const userData = ref()

    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    onBeforeRouteUpdate(async (to, from) => {
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id)
      }
    })
    
    // 在导航离开渲染该组件的对应路由时调用
    onBeforeRouteLeave（）
  },
}

```





### [完整的导航解析流程](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#完整的导航解析流程)(包含vue的钩子版)

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。可取消路由离开
3. 调用全局的 `beforeEach` 守卫。可用于登录验证、全局路由loading等
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。（标示解析阶段完成）
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. onDeactivated和unmounted或者beforeUnmount：离开缓存vue组件，或者触发vue组件的beforeUnmount和unmounted钩子。
12. onActivated或者beforeCreate&created、beforeMount&mounted。进入vue组件（如果有的话）
13. 触发 DOM 更新。
14. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。
15. 导航完成





### Vue权限管理

1. 权限管理一般需求是**页面权限**和**按钮权限**的管理

2. 具体实现的时候分后端和前端两种方案：

   前端方案会**把所有路由信息在前端配置**，通过路由守卫要求用户登录，用户**登录后根据角色过滤出路由表**。比如我会配置一个`asyncRoutes`数组，需要认证的页面在其路由的`meta`中添加一个`roles`字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。此过滤过程结束，剩下的路由就是该用户能访问的页面，**最后通过`router.addRoutes(accessRoutes)`方式动态添加路由**即可。

   后端方案会**把所有页面路由信息存在数据库**中，用户登录的时候根据其角色**查询得到其能访问的所有页面路由信息**返回给前端，前端**再通过`addRoutes`动态添加路由**信息

   按钮权限的控制通常会**实现一个指令**，例如`v-permission`，**将按钮要求角色通过值传给v-permission指令**，在指令的`moutned`钩子中可以**判断当前用户角色和按钮是否存在交集**，有则保留按钮，无则移除按钮。

3. 纯前端方案的优点是实现简单，不需要额外权限管理页面，但是维护起来问题比较大，有新的页面和角色需求就要修改前端代码重新打包部署；服务端方案就不存在这个问题，通过专门的角色和权限管理页面，配置页面和按钮权限信息到数据库，应用每次登陆时获取的都是最新的路由信息，可谓一劳永逸！









## 源码







### 工作核心

一个SPA应用的路由需要解决的问题是**页面跳转 内容改变但不刷新(即没有向后端请求)**，同时路由还需要以插件形式存在，所以：

1. 首先定义一个`createRouter`函数，返回路由器实例，实例内部做几件事：

   - 保存用户传入的配置项
   - 监听popstate事件，回调里根据path匹配对应路由
   - 暴露路由跳转的方法
2. 将router定义成一个Vue插件，即实现install方法，内部做两件事：

   - 实现两个全局组件：router-link和router-view，分别实现页面跳转和内容显示
   - Provide两个全局变量：$route和$router，组件内可以访问当前路由和路由器实例



### ssr相关

#### createMemoryHistory

相当于模拟了浏览器的历史记录队列。





#### router.isReady()

1. 当你使用 `router.push` 或 `router.replace` 方法导航到一个新的路由时，这个导航可能会触发一些异步操作，比如数据获取或者组件懒加载。在这些异步操作完成之前，路由器并没有真正完成导航。
2. `router.isReady` 方法返回的 Promise 就是用来等待这些异步操作完成的。当所有的异步操作都完成时，这个 Promise 就会resolve，表示路由器已经准备好了。



### 历史模式

#### 我的总结

两种模式都是：

*利用window的pushState或replaceState改变当前页面显示的url和历史记录，但不会刷新页面*。

*通过 监听popState事件来监听 浏览器点击 前进or后退 。 并及时更新historyState(当前state)和currentLocation(当前路径)*。

包装准备丢给浏览器历史记录的state。







#### 抛开router讲基本原理(当知识看就行了)

##### 1.**基于 hash 实现**

hash值变化，浏览器只会修改访问历史记录，不会向服务器发出请求。每次hash值变化都会触发hashchange事件。通过hashchange事件，开发人员可以获取hash值的变化情况，从而根据不同的hash值展示不同的页面UI。

1. 我们监听==**hashchange**事件==。一旦事件触发，就改变**routerView**的内容。
2. 页面第一次加载完不会触发 hashchange，因而用DOMContentLoaded事件来监听hash值，再将视图渲染成对应的内容。

```javascript
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <!-- 定义路由 -->
        <li><a href="#/home">home</a></li> //这样点击的时候就会改变hash值
        <li><a href="#/about">about</a></li>

        <!-- 渲染路由对应的 UI -->
        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
    let routerView = routeView
    window.addEventListener('hashchange', ()=>{
        let hash = location.hash;
        routerView.innerHTML = hash
    })
    window.addEventListener('DOMContentLoaded', ()=>{
        if(!location.hash){//如果不存在hash值，那么重定向到#/
            location.hash="/"
        }else{//如果存在hash值，那就渲染对应UI
            let hash = location.hash;
            routerView.innerHTML = hash
        }
    })
</script>
</html>
```

- 改变描点

可以通过`location.hash = "/hashpath"`的方式修改浏览器的hash值。

- 监听描点变化

可以通过监听hashchange事件监听hash值的变化。

```javascript
window.addEventListener('hashchange', () => {
   const hash = window.location.hash.substr(1)
   // 根据hash值渲染不同的dom
})
```

或者：

```javascript
window.onhashchange = function(event){
	console.log(event.oldURL, event.newURL);
	let hash = location.hash.slice(1);
}
```









##### **2.基于 history 实现**

######  history api介绍

 history api可以分为两大部分，切换历史状态和修改历史状态：

- **修改历史状态**：

  H5的history对象提供了pushState和replaceState两个方法，当调用这两个方法的时候，url会发生变化，浏览器访问历史也会发生变化，但是浏览器不会向后台发送请求。

  ```less
  // 第一个参数：data对象，在监听变化的事件中能够获取到
  // 第二个参数：title标题
  // 第三个参数：跳转地址
  history.pushState({}, "", '/a')
  ```

> 从某种程度来说，调用 `pushState()` 和 `window.location = "#foo"`基本上一样，他们都会在当前的 document 中创建和激活一个新的历史记录。但是 `pushState()` 有以下优势：
>
> - 新的 URL 可以是任何和当前 URL 同源的 URL。但是设置 [`window.location`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2Flocation) 只会在你只设置锚的时候才会使当前的 URL。
> - 非强制修改 URL。相反，设置 `window.location = "#foo";` 仅仅会在锚的值不是 #foo 情况下创建一条新的历史记录。
> - 可以在新的历史记录中关联任何数据。`window.location = "#foo"`形式的操作，你只可以将所需数据写入锚的字符串中。
>
> 注意： `pushState()` 不会造成 [`hashchange`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2Fhashchange_event) 事件调用，即使新的 URL 和之前的 URL 只是锚的数据不同。 ----MDN





- **切换历史状态：** 包括`forward()`、`back()`、`go()`三个方法，对应浏览器的前进，后退，跳转操作。





###### 实现原理

1. 我们监听==**popState**事件==。当用户在浏览器的地址栏输入新的URL地址（或者刷新页面），会触发 `popstate` 事件，vue-router在监听到 `popstate` 事件之后，会把当前的URL更新为最新的以及对应组件重新渲染页面。

>调用 `history.pushState()` 或者 `history.replaceState()` 不会触发 `popstate` 事件。`popstate` 事件只会在浏览器某些行为下触发，比如点击后退按钮（或者在 JavaScript 中调用 `history.back()` 方法）。即，在同一文档的两个历史记录条目之间导航会触发该事件。

   

2. history路由的实现，主要就是依靠于pushState与replaceState实现的，这里我们先总结下它们的一些特点

- window.history.pushState 可以将给定的数据压入到浏览器会话历史栈中
- window.history.replaceState 将当前的会话页面的url替换成指定的数据

- 都会改变当前页面显示的url，但都不会刷新页面
- pushState是压入浏览器的会话历史栈中，会使得history.length加1，而replaceState是替换当前的这条会话历史，因此不会增加history.length



3. 页面第一次加载完不会触发 popstate，因而用DOMContentLoaded事件来监听hash值，再将视图渲染成对应的内容。

```javascript
<!DOCTYPE html>
<html lang="en">
<body>
<ul>
    <ul>
        <li><a href='/home'>home</a></li>
        <li><a href='/about'>about</a></li>

        <div id="routeView"></div>
    </ul>
</ul>
</body>
<script>
    let routerView = routeView
    window.addEventListener('DOMContentLoaded', onLoad) //页面第一次加载完不会触发 popstate，所以要监听DOMContentLoaded事件
    window.addEventListener('popstate', ()=>{
        routerView.innerHTML = location.pathname
    })
    function onLoad () {
        routerView.innerHTML = location.pathname 
        var linkList = document.querySelectorAll('a[href]') 
        linkList.forEach(el => el.addEventListener('click', function (e) { //添加事件
            e.preventDefault() 
            history.pushState(null, '', el.getAttribute('href')) //给浏览器添加记录
            routerView.innerHTML = location.pathname //切换页面
        }))
    }

</script>
</html>
```





#### 对源码进行注释(可以不看)

##### createWebHistory

因为用户点击刷新按钮或者在url栏中直接输入url跳转是会向服务器发请求的，所以服务器需要配置不管path是啥都是返回首页。前端拿到首页后让vue-router去处理跳转。

html5模式 ： `createWebHistory`源码所处位置：`src/history/html5.ts`。

###### 对传入的`base`进行标准化

`createWebHistory`函数接受一个`base`字符串可选参数，该参数提供了一个基础路径。
在`createWebHistory`中首先会调用`normalizeBase`函数对传入的`base`进行标准化。

```typescript
base = normalizeBase(base)
```

来看下`base`标准化的过程：

```typescript
export function normalizeBase(base?: string): string {
  if (!base) {
    if (isBrowser) {// 浏览器环境下尝试获取base标签的href属性
      const baseEl = document.querySelector('base') //尝试获取`<base>`标签的`href`属性作为`base`
      base = (baseEl && baseEl.getAttribute('href')) || '/'  //如果没有`<base>`标签或`<base>`标签的`href`属性没有值，`base`取`/`
      base = base.replace(/^\w+:\/\/[^\/]+/, '') // 去除（htttp(s)://xxx/）部分，如https://example.com/folder/ --> /folder/
    } else { //非浏览器环境下
      base = '/'
    }
  }
  
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base// 确保base的前面有 /
  return removeTrailingSlash(base) //去除末尾的/ 
}
```

如果没有配置`base`的话，

在浏览器环境下会尝试获取`<base>`标签的`href`属性作为`base`，如果没有`<base>`标签或`<base>`标签的`href`属性没有值，`base`取`/`，然后又对`base`进行了`reaplce(/^\w+:\/\/[^\/]+/, '')`操作，该操作是去除`base`的`http(s)://xxx`部分（如果`base`是`https://example.com/floder/child`，`base`最终会变成`/floder/child`）；

非浏览器环境下，`base`直接取`/`。

最后会确保base前面有`/` 且 将`base`的末尾`/`去除，然后返回`base`，这样做的目的是后续我们可以通过`base + fullPath`的形式建立一个`href`。

###### 声明`historyNavigation`和`historyListeners`变量

`base`标准化后，会声明`historyNavigation`和`historyListeners`变量：

```typescript
const historyNavigation = useHistoryStateNavigation(base)
const historyListeners = useHistoryListeners(
  base,
  historyNavigation.state,
  historyNavigation.location,
  historyNavigation.replace
)
```

###### 先看`useHistoryStateNavigation`的实现

```typescript
function useHistoryStateNavigation(base: string) {
  // 获取window.history、window.location
  const { history, location } = window

  const currentLocation: ValueContainer<HistoryLocation> = {
    value: createCurrentLocation(base, location),
  }
  const historyState: ValueContainer<StateEntry> = { value:  }
  // 如果history.state是空的，构建一条新的历史记录
  if (!historyState.value) {
    changeLocation(
      currentLocation.value,
      {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history.length - 1,
        replaced: true,
        scroll: null,
      },
      true
    )
  }
  // 修改历史记录
  function changeLocation(
    to: HistoryLocation,
    state: StateEntry,
    replace: boolean
  ): void {
    const hashIndex = base.indexOf('#')
    // 获取url，作为history.replaceState/pushState的参数
    // 如果hashIndex > -1，url = `{location.host && document.querySelector('base') ? base : base字符串#及后面字符}${to}`
    // 否则 url = `${location.protocol}//${location.host}${base}${to}`
    const url =
      hashIndex > -1
        ? (location.host && document.querySelector('base')
            ? base
            : base.slice(hashIndex)) + to
        : createBaseLocation() + base + to
    try {
      // 利用history.replaceState/pushState修改历史记录
      history[replace ? 'replaceState' : 'pushState'](state, '', url)
      // historyState更新为最新的历史记录
      historyState.value = state
    } catch (err) { // 如果历史记录修改过程中报错，则使用location.reaplce/assign导航到对应url
      if (__DEV__) {
        warn('Error with push/replace State', err)
      } else {
        console.error(err)
      }
      location[replace ? 'replace' : 'assign'](url)
    }
  }

  function replace(to: HistoryLocation, data?: HistoryState) {
    const state: StateEntry = assign(
      {},
      history.state,
      buildState(
        historyState.value.back,
        to,
        historyState.value.forward,
        true
      ),
      data,
      // 因为是replace操作，所以position不变
      { position: historyState.value.position }
    )

    changeLocation(to, state, true)
    // 修改当前历史为to
    currentLocation.value = to
  }

  function push(to: HistoryLocation, data?: HistoryState) {
    const currentState = assign(
      {},      historyState.value,
      history.state as Partial<StateEntry> | null,
      {
        forward: to,
        scroll: computeScrollPosition(),
      }
    )

    if (__DEV__ && !history.state) {
      warn(
        `history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
          `history.replaceState(history.state, '', url)\n\n` +
          `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`
      )
    }

    // 第一次changeLocation，使用replace刷新当前历史，目的是记录当前页面的滚动位置
    changeLocation(currentState.current, currentState, true)

    const state: StateEntry = assign(
      {},
      buildState(currentLocation.value, to, null),
      // push操作，历史记录的position+1
      { position: currentState.position + 1 },
      data
    )

    // 第二次跳转，跳转到需要跳转的位置
    changeLocation(to, state, false)
    currentLocation.value = to
  }

  return {
    location: currentLocation,
    state: historyState,

    push,
    replace,
  }
}
```

上面这个函数接收一个`base`参数，返回一个对象。这个对象中有四个属性：

- `location`：一个包含`value`属性的对象，`value`值是`createCurrentLocation()`方法的返回值。

  那么这个`value`是什么呢？看下`createCurrentLocation`做了什么。

  `createCurrentLocation`其实就是获取`window.location`相对`base`的`location`。方法接收两个参数：经过标准化的`base`字符串和一个`window.location`对象。举几个例子（以下几个例子的`base`都经过标准化）：如果`window.location.pathname`为`/a/b/c`，`base`为`/a`，那么通过`createCurrentLocation`得到的`location`为`/b/c`；如果是有`hash`的情况，`window.location.hash`为`#/a/b/c`，`base`为`#/a`，那么通过`createCurrentLocation`得到的`location`为`/b/c`；`window.location.hash`为`#/a/b/c`，`base`为`#`，那么通过`createCurrentLocation`得到的`location`为`/a/b/c`。

  ```typescript
  function createCurrentLocation(
    base: string,
    location: Location
  ): HistoryLocation {
    const { pathname, search, hash } = location
    // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
    // 从base中获取#的索引
    const hashPos = base.indexOf('#')
    // 如果base中包含#
    if (hashPos > -1) {
      // 如果hash包含base中的#后面部分，slicePos为base中#及后面字符串的的长度，否则为1
      let slicePos = hash.includes(base.slice(hashPos))
        ? base.slice(hashPos).length
        : 1
      // 从location.hash中获取path，/#add, #add
      let pathFromHash = hash.slice(slicePos)
      // 在开头加上/，形成/#的格式
      if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash
      // stripBase(pathname, base)：将pathname去除base部分
      return stripBase(pathFromHash, '')
    }
    // 如果base中不包含#，把pathname中的base部分删除
    const path = stripBase(pathname, base)
    return path + search + hash
  }
  ```

  

- `state`：一个包含`value`属性的对象，`value`存储的是当前的`history.state`

- `push`：向历史记录中添加一条记录。在`push`过程中你会发现调用了两次`changeLocation`，在第一次调用`changeLocation`时，目的是为了记录当前页面在的滚动位置，如果使用`history.back()`或浏览器回退/前进按钮回到这个页面，页面会滚动到对应位置，为了不再历史栈中保存新的记录，第一次记录使用的`reaplceState`替换当前历史记录。第二次调用`changeLocation`是会跳转到需要跳转的位置。

- `reaplce`：替换当前历史记录。



###### 接下来看`useHistoryListeners`方法

`useHistoryListeners`方法接收四个参数：`base`（标准化的`base`）、`historyState`、`currentLocation`、`replace`（后三个参数来自`useHistoryStateNavigation`的返回值）。
在`useHistoryListeners`中，会监听html5的两个事件[popstate](https://link.segmentfault.com/?enc=oe%2Fbg5Z%2BVnhGDMyP7Igpeg%3D%3D.StByw7Sl8U%2F5oKU%2ByDXsUmJjlXEVwAlTAryIZaco32EuVNJ0mWsWEmRNv1szgZV3VNuhYr0q48XwQJidNjo5CTzz62%2BEG6tmUR9KoxPXTBk%3D)（通过url进入页面和刷新页面都会触发）、[beforeunload](https://link.segmentfault.com/?enc=MZQ8i6uVpFQ%2FJpmSLHNjCQ%3D%3D.nOsBByJF2MmxnYwU1y6ISnijknXZ23k79H6rcDDXs45pdVQgm7XkV%2FM5Xusp7taLSgbVIoMyx%2BhvhHT0EyJbaOrKpC9U8FXK2iVJHjitRT8%3D)（页面销毁之前）。

`useHistoryListeners`同样返回一个对象，该对象包含三个属性：

- `pauseListeners`：一个暂停监听的函数。
- `listen`：接收一个回调函数，并返回一个删除监听的函数。该回调函数会被加入`listeners`数组中，并向`teardowns`数组中添加卸载函数。
- `destroy`：销毁函数，清空`listeners`与`teardowns`，移除`popstate`、`beforeunload`监听。

```typescript
function useHistoryListeners(
  base: string,
  historyState: ValueContainer<StateEntry>,
  currentLocation: ValueContainer<HistoryLocation>,
  replace: RouterHistory['replace']
) {
  let listeners: NavigationCallback[] = []
  let teardowns: Array<() => void> = []
  let pauseState: HistoryLocation | null = null

  const popStateHandler: PopStateListener = ({
    state,
  }: {
    state: StateEntry | null
  }) => {
    const to = createCurrentLocation(base, location)
    const from: HistoryLocation = currentLocation.value
    const fromState: StateEntry = historyState.value
    let delta = 0

    if (state) {
      currentLocation.value = to
      historyState.value = state

      // 如果暂停监听了，则直接return，同时pauseState赋为null
      if (pauseState && pauseState === from) {
        pauseState = null
        return
      }
      // 计算移动步数
      delta = fromState ? state.position - fromState.position : 0
    } else {
      replace(to)
    }
    // 执行监听函数列表
    listeners.forEach(listener => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta
          ? delta > 0
            ? NavigationDirection.forward
            : NavigationDirection.back
          : NavigationDirection.unknown,
      })
    })
  }

  function pauseListeners() {
    pauseState = currentLocation.value
  }

  function listen(callback: NavigationCallback) {
    listeners.push(callback)

    const teardown = () => {
      const index = listeners.indexOf(callback)
      if (index > -1) listeners.splice(index, 1)
    }

    teardowns.push(teardown)
    return teardown
  }

  function beforeUnloadListener() {
    const { history } = window
    if (!history.state) return
    // 当页面关闭时记录页面滚动位置
    history.replaceState(
      assign({}, history.state, { scroll: computeScrollPosition() }),
      ''
    )
  }

  function destroy() {
    for (const teardown of teardowns) teardown()
    teardowns = []
    window.removeEventListener('popstate', popStateHandler)
    window.removeEventListener('beforeunload', beforeUnloadListener)
  }

  window.addEventListener('popstate', popStateHandler)
  window.addEventListener('beforeunload', beforeUnloadListener)

  return {
    pauseListeners,
    listen,
    destroy,
  }
}
```



###### 声明go函数

创建完`historyNavigation`、`historyListeners`之后，紧跟着声明一个go函数。该函数接收两个变量：`delta`历史记录移动的步数，triggerListeners是否触发监听。

```typescript
function go(delta: number, triggerListeners = true) {
  if (!triggerListeners) historyListeners.pauseListeners()
  history.go(delta)
}
```



###### 返回`routerHistory`对象

最后创建一个`routerHistory`对象，并将其返回。

```typescript
const routerHistory: RouterHistory = assign(
  {
    location: '',
    base,
    go,
    createHref: createHref.bind(null, base),
  },
  historyNavigation,
  historyListeners
)

// 拦截routerHistory.location，使routerHistory.location返回当前路由地址
Object.defineProperty(routerHistory, 'location', {
  enumerable: true,
  get: () => historyNavigation.location.value,
})

// 拦截routerHistory.state，使routerHistory.state返回当前的的history.state
Object.defineProperty(routerHistory, 'state', {
  enumerable: true,
  get: () => historyNavigation.state.value,
})

return routerHistory
```

##### createWebHashHistory

`createWebHashHistory`实现。

```typescript
export function createWebHashHistory(base?: string): RouterHistory {
  // 对于使用文件协议打开的页面location.host是空字符串，这时的base为''
  // 也就是说在使用文件协议打开页面时，设置了base是不生效的，因为base始终是''
  base = location.host ? base || location.pathname + location.search : ''
  // 允许中间的#: `/base/#/app`
  if (!base.includes('#')) base += '#'

  if (__DEV__ && !base.endsWith('#/') && !base.endsWith('#')) {
    warn(
      `A hash base must end with a "#":\n"${base}" should be "${base.replace(
        /#.*$/,
        '#'
      )}".`
    )
  }
  return createWebHistory(base)
}
```

##### createMemoryHistory

`createMemoryHistory`会创建一个基于内存历史记录，主要用来处理SSR。

```typescript
export function createMemoryHistory(base: string = ''): RouterHistory {
  // 用户存储监听函数的数组
  let listeners: NavigationCallback[] = []
  // 使用一个队列维护历史记录
  let queue: HistoryLocation[] = [START]
  // 当前历史记录在队列中的位置
  let position: number = 0
  // base标准化
  base = normalizeBase(base)

  // 设置记录
  function setLocation(location: HistoryLocation) {
    position++
    // 队列长度等于position时，直接push
    if (position === queue.length) {
      queue.push(location)
    } else {
      // 当历史记录在队列中的非末尾位置时，删除position及之后的记录，然后再push
      // 如果某一刻处在非结尾的历史记录时，这时要进行push或reqlace操作，此时position之后的记录就会失效
      queue.splice(position)
      queue.push(location)
    }
  }

  // 触发监听
  function triggerListeners(
    to: HistoryLocation,
    from: HistoryLocation,
    { direction, delta }: Pick<NavigationInformation, 'direction' | 'delta'>
  ): void {
    const info: NavigationInformation = {
      direction,
      delta,
      type: NavigationType.pop,
    }
    for (const callback of listeners) {
      callback(to, from, info)
    }
  }

  const routerHistory: RouterHistory = {
    location: START,
    state: {},
    base,
    createHref: createHref.bind(null, base),

    replace(to) {
      // 移除queue中索引为position的记录，并将position--
      queue.splice(position--, 1)
      // 在setLocation会对position重新++操作，所以position会恢复要之前的值
      setLocation(to)
    },

    push(to, data?: HistoryState) {
      setLocation(to)
    },

    listen(callback) {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) listeners.splice(index, 1)
      }
    },
    destroy() {
      listeners = []
      queue = [START]
      position = 0
    },

    go(delta, shouldTrigger = true) {
      const from = this.location
      // go的方向。delta < 0 为 back，相反为 forward
      const direction: NavigationDirection =
        delta < 0 ? NavigationDirection.back : NavigationDirection.forward
      // go之后所处的position：Math.min(position + delta, queue.length - 1)保证了position<=queue.length - 1, 如果position + delta超出了数组最大索引，就取最大索引
      // Math.max(0, Math.min(position + delta, queue.length - 1))进一步保证了position>=0，如果position + delta < 0, 则取0
      position = Math.max(0, Math.min(position + delta, queue.length - 1))
      // 根据shouldTrigger决定是否触发监听函数
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta,
        })
      }
    },
  }

  Object.defineProperty(routerHistory, 'location', {
    enumerable: true,
    get: () => queue[position],
  })

  if (__TEST__) {
    routerHistory.changeURL = function (url: string) {
      const from = this.location
      queue.splice(position++ + 1, queue.length, url)
      triggerListeners(this.location, from, {
        direction: NavigationDirection.unknown,
        delta: 0,
      })
    }
  }

  return routerHistory
}
```

和`createWebHistory`、`createWebHashHistory`一样，`createMemoryHistory`同样返回一个`RouterHistory`类型的对象。与前面两个方法不同的是，`createMemoryHistory`维护一个队列`queue`和一个`position`，来保证历史记录存储的正确性。







### matcher

**createRouterMatcher**主要闭包了一个matchers数组存放每一个matcher。

通过addRoute 递归拍平并格式化路由，每个路由都会有一个matcher，每个matcher就是存放了格式化后的本route的信息和本路由对应的父亲和儿子。

resolve根据name或path去找对应的matcher，先找到直接对应的那个matcher，然后沿着父亲这条线把这个matcher的祖宗全加进matched数组里，然后返回这个matched数组，告诉外界当前name或path匹配上了哪些matcher。当用户执行跳转时(比如调用router的push或replace或routerlink)就会调用这个resolve方法。(会把path解析成正则表达式，参考koa/router。如果同时写了/dyc/:id 和 /dyc/a 这两个路由，vue-router的处理是请求/dyc/a时会匹配到 /dyc/a)





还对外暴露了**removeRoute**, **getRoutes**, **getRecordMatcher**方法，无伤大雅不管了。





### router

**createRouter**，建立历史模式实例，建立matcher实例，创建一个currentRoute变量，当这个变量改变的时候就会触发响应式更新。建立全局的beforeEach,beforeResolve,afterEach数组。返回项`Router`则是创建出来的全局路由对象，包含了路由实例和常用的内置方法。



在跳转路由之前会先过一遍守卫，守卫方法会被全部变成promise然后链式调用

然后在执行跳转，执行跳转前会先更改历史记录，且如果是首次跳转还会给浏览器注册监听popstate事件。

跳转完再执行全局的afterEach

replace和push只是影响更改历史记录的方式，实际的画面更新都是因为currentRoute的变更触发响应式更新。

routerlink本质也是调用了router暴露出去的replace或push方法。







### RouterView

inject了currentRoute，而`<RouterView>`的渲染函数依赖了currentRoute，所以当currentRoute更新时RouterView就会更新。

由于每个routerview都会inject一个depth，然后还会provide depth+1，所以第一个routerviewinject的depth为0，所以就会渲染currentRoute里的matched里的第一个组件，然后routerview的子组件routerview再inject的时候depth为1，那就会渲染matched[1]，以此类推。



### 路由懒加载

vue-router里面的处理就是：在路由匹配到相应的组件后，先更改记录，vue-router会对import()函数再包一层promise，等这个promise resolved后就改变内容。如果这个promise 慢了就会白屏。







### router.install(可以不看)

执行`app.use`的过程中，会执行`router.install`，并==传入`app`实例==

`router.install`源码位于`createRouter`中，文件位置`src/router.ts`。

#### 注册`RouterLink`与`RouterView`两大组件

```typescript
app.component('RouterLink', RouterLink)
app.component('RouterView', RouterView)
```

#### 设置全局属性`$router`、`$route`

然后会将当前的`router`对象赋值给`app.config.globalProperties.$router`；

同时拦截了`app.config.globalProperties.$route`的`get`操作，使`app.config.globalProperties.$route`始终获取`unref(currentRoute)`，`unref(currentRoute)`就是当前路由的一些信息。

```typescript
app.config.globalProperties.$router = router
Object.defineProperty(app.config.globalProperties, '$route', {
  enumerable: true,
  get: () => unref(currentRoute),
})
```

#### 根据浏览器url地址进行第一次跳转（如果是浏览器环境）

```typescript
if (
  isBrowser &&
  // 用于初始导航客户端，避免在多个应用中使用路由器时多次push
  !started &&
  currentRoute.value === START_LOCATION_NORMALIZED
) {
  started = true
  push(routerHistory.location).catch(err => {
    if (__DEV__) warn('Unexpected error when starting the router:', err)
  })
}
```

#### 声明了一个`reactiveRoute`响应式对象

遍历`START_LOCATION_NORMALIZED`对象，依次将`START_LOCATION_NORMALIZED`（`START_LOCATION_NORMALIZED`是`vue-router`提供的初始路由位置）中的`key`复制到`reactiveRoute`中，同时将`reactiveRoute`中`key`对应的值变成一个计算属性。通过`START_LOCATION_NORMALIZED`构建一个响应式的路由`reactiveRoute`，方便对路由变化进行追踪。

#### 使用`provide`将`router`、`currentRoute`注入到`app`实例中

因为在`setup`中式无法访问`this`的，这时通过`inject`就可以方便获取`router`及`currentRoute`。

```typescript
const reactiveRoute = {} as {
  [k in keyof RouteLocationNormalizedLoaded]: ComputedRef<
    RouteLocationNormalizedLoaded[k]
  >
}
for (const key in START_LOCATION_NORMALIZED) {
  reactiveRoute[key] = computed(() => currentRoute.value[key])
}

app.provide(routerKey, router)
app.provide(routeLocationKey, reactive(reactiveRoute))
app.provide(routerViewLocationKey, currentRoute)
```



#### 将`app`放入一个哈希表中 并 重写`app.unmount`。

当`app`卸载时，首先从哈希表中删除`app`，然后判断哈希表的大小是否小于1，如果小于1代表已经没有实例使用`vue-router`了，那么这时就需要重置一些状态、移除一些监听。











# Pinia&Vuex&vue-apollo-model

## 如何在ssr中使用

感觉状态管理就是保证代码在node环境中能跑，然后到了浏览器环境之后从全局变量中拿到初始state即可。。。。

1. 状态的初始化：在服务器端渲染时，需要确保状态的初始化是在每个请求中独立进行的，而不是共享状态。这可以通过在每个请求中创建一个新的状态实例或重置现有状态来实现。
2. 服务器端注入：在服务器端渲染的过程中，需要将状态注入到响应的 HTML 中，以便客户端在初始加载时能够获取到正确的状态。可以通过将状态序列化为 JSON 格式，并在服务器端将其注入到 HTML 中的某个位置（例如，使用 `<script>` 标签）。
3. 客户端激活：在客户端接管渲染后，需要确保客户端能够正确地接收到服务器端注入的状态，并将其还原为可用的状态对象。

## 与vue-apollo-model的区别

Vuex/Redux等将状态完全抽离成全局状态管理。

在一个Web应用中，会同时存在**全局状态**与**局部状态**两种，前者生命周期贯穿于整个应用，而后者生命周期依赖于具体的某个业务组件。







## 面试题

### 用响应式 API 做简单状态管理[#](https://cn.vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api)

#### 返回全局状态

如果你有一部分状态需要在多个组件实例间共享，你可以使用 [`reactive()`](https://cn.vuejs.org/api/reactivity-core.html#reactive) 来创建一个响应式对象，并在不同组件中导入它：

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

现在每当 `store` 对象被更改时，`<ComponentA>` 与 `<ComponentB>` 都会自动更新它们的视图。现在我们有了单一的数据源。

为了确保改变状态的逻辑像状态本身一样集中，建议在 store 上定义方法，方法的名称应该要能表达出行动的意图：

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }

```

```html
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

#### 返回全局状态和局部状态

除了我们这里用到的单个响应式对象作为一个 store 之外，你还可以使用其他[响应式 API](https://cn.vuejs.org/api/reactivity-core.html) 例如 `ref()` 或是 `computed()`，或是甚至通过一个[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)来返回一个全局状态：

```js
import { ref } from 'vue'

// 全局状态，创建在模块作用域下
const globalCount = ref(1)

export function useCount() {
  // 局部状态，每个组件都会创建
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

###  Vuex 和 localStorage 的区别

**（1）最重要的区别**

- vuex存储在内存中
- localstorage 则以文件的方式存储在本地，只能存储字符串类型的数据，存储对象需要 JSON的stringify和parse方法进行处理。 读取内存比读取硬盘速度要快

**（2）应用场景**

- Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。vuex用于组件之间的传值。
- localstorage是本地存储，是将数据存储到浏览器的方法，一般是在跨页面传递数据时使用 。
- Vuex能做到数据的响应式，localstorage不能

**（3）永久性**

刷新页面时vuex存储的值会丢失，localstorage不会。

### 为什么要用状态管理库

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。
- 虽然我们的手动状态管理解决方案在简单的场景中已经足够了，但是在大规模的生产应用中还有很多其他事项需要考虑：
  - 更强的团队协作约定
  - 与 Vue DevTools 集成，包括时间轴、组件内部审查和时间旅行调试
  - 模块热更新 (HMR)
  - 服务端渲染支持


管理应用包含以下几个部分：

- **状态**，驱动应用的数据源；
- **视图**，以声明方式将**状态**映射到视图；
- **操作**，响应在**视图**上的用户输入导致的状态变化。

以下是一个表示“单向数据流”理念的简单示意：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-ogfZ4k.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-ogfZ4k.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-ogfZ4k.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-ogfZ4k.png" loading="lazy"/>
  </picture>

但是，当我们的应用遇到**多个组件共享状态**时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

1.Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

2.不能直接改变 store 中的状态。组件改变state的唯一方法是通过显式地提交mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。【若是异步事务或者是大批量的同步事务要改变state，第一步组件需要先去调用（dispatch）action，第二步action要去调用（commit）mutation，第三步利用mutation改变数据；若是同步事务，第一步组件调用（commit）mutation，第二步利用mutation改变数据；】



### pinia和vuex的区别

没有`mutations`。

不再有模块的嵌套结构(vuex是单store，所有状态都存到一个store里)。Pinia 提供扁平结构，支持store之间的交叉组合方式。您甚至可以拥有store的循环依赖关系。鉴于store的扁平架构，没有命名空间模块。

更好`typescript`支持。无需创建自定义的复杂包装器来支持 TypeScript。

无需动态添加stores，默认情况下它们都是动态的。请注意，您仍然可以随时手动使用store来注册它，但因为它是自动的，所以您无需担心。

很轻。1kb。





## Pinia

官网说的：你可能会认为可以通过一行简单的 `export const state = reactive({})` 来共享一个全局状态。对于单页应用来说<mark>确实可以</mark>，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 

### 特点

- 完整的 typescript 的支持；
- 足够轻量，压缩后的体积只有1.6kb;
- 去除 mutations，只有 state，getters，actions；
- actions 支持同步和异步；
- 没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；
- 无需手动添加 store，store 一旦创建便会自动添加；



### [基本使用](https://juejin.cn/post/7078281612013764616#heading-2)

#### 安装

新建 src/store 目录并在其下面创建 index.ts，导出 store

```javascript
 import { createPinia } from 'pinia'

 const store = createPinia()

 export default store
```

在 main.ts 中引入并使用

```javascript
 import { createApp } from 'vue'
 import App from './App.vue'
 import store from './store'
 
 // 创建vue实例
 const app = createApp(App)
 
 // 挂载pinia
 app.use(store)
 
 // 挂载实例
 app.mount('#app');
```

#### **定义State：**

在 src/store 下面创建一个 user.ts

```javascript
 import { defineStore } from 'pinia'

 export const useUserStore = defineStore({
   id: 'user', // id必填，且需要唯一
   state: () => {
     return {
       name: '张三'
     }
   },
   actions: {
     updateName(name) {
       this.name = name
     }
   }
 })
```

#### **获取State**

 在 src/components/usePinia.vue 中使用

```vue
 <template>
   <div>{{ userStore.name }}</div>
 </template>

 <script lang="ts" setup>
 import { useUserStore } from '@/store/user'

 const userStore = useUserStore()
 </script>
```

#### **修改State：**

```vue
 // 1. 直接修改 state （不建议）
 userStore.name = '李四'

 // 2. 通过 actions 去修改
 <script lang="ts" setup>
 import { useUserStore } from '@/store/user'

 const userStore = useUserStore()
 userStore.updateName('李四')
 </script>
```

> 更详细上手指南：[链接](https://juejin.cn/post/7049196967770980389) 官方文档：[链接](https://link.juejin.cn/?target=https%3A%2F%2Fpinia.vuejs.org%2Fintroduction.html)





#### 解构赋值保持响应式

```ts
let { hello: myHello, getListLength } = storeToRefs(store)
```



#### store间互相调用

因为*pinia只能在运行时使用*，所以在新的容器的actions中可以获取到其他容器实例

```ts
//如果在顶层直接写
const store = useUserStore()会报错，原因是pinia只能在运行时使用  ????? 看一下源码：为什么在顶层直接写不可以，只能在调用一个函数的里面写才行

actions: {
    toggleIsMobile(isMobile: boolean) {
      this.isMobile = isMobile;
      if (isMobile == true) {
        useAppConfigUserStore().setSideMenu(false) //**
      }
    },
```





#### 调用其他getters

通过 `this` 访问到**整个 store 实例**，然后你可以直接访问 store 实例上的 getter 了。

```tsx
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.count * 2
    },
    // 返回类型**必须**明确设置
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型标注 ✨
      return this.doubleCount + 1
    },
  },
})
```





### 持久化存储

本质还是存到storage里

利用插件 ；pinia-plugin-persistedstate

```tsx
import type { PersistedStateOptions } from 'pinia-plugin-persistedstate'

/**
 * @description pinia持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const setStatePersist = (key: string, paths?: string[]) => {
  const persist: PersistedStateOptions = {
    key,
    storage: window.localStorage,
    // storage: window.sessionStorage,
    paths
  }
  return persist
}

export default setStatePersist

```

在store中：

```
const useTabsStore = defineStore({
  id: 'TabsState',
  state: 
  getters: {},
  actions: {
  },
  persist: setStatePersist(EnumLocalStorageKey.TabsList)
})

```



### 大致原理

#### 库的入口文件`index.ts`

主要就是两个方法

```
export { createPinia } from "./createPinia"
export {defineStore} from './defineStore'
```

#### <span id="createPinia">createPinia</span>

主要就是为了返回一个带install方法的对象，然后install的时候向全局暴露出pinia这个对象（这个对象不管在vue3中还是vue2中还是在其他不是vue的组件中都能使用），这个对象里有一个存放了所有store的`_s`属性，有用来停止所有state的响应式的`_e`属性，还有一个存放所有state 的state属性，还有插件列表和提供给外界注册插件的函数。

```tsx
import {ref,effectScope} from 'vue'
import { piniaSymbol } from './piniaSymbol'
export let activePinia //通过这个全局变量来存放piniaStore，为了在不是vue组件中也能访问到piniaStore（比如router）。
export const setActivePinia = (piniaStore) => activePinia = piniaStore
export function createPinia() { //是一个插件方法，返回一个带install方法的对象。
  const scope = effectScope(true) // 创建一个依赖函数集，到时候方便一起暂停他们的响应式。
  const state = scope.run(()=>ref({})) //存放所有state。通过scope.run去包一层方便后续通过scope.stop()这个方法来全部暂停这些的响应式。
  const _plugins = [] //存放所有的插件（其实就是函数）
  const piniaStore = {
    use(plugin) { // 提供给外界用于注册插件
      _plugins.push(plugin)
      return this //返回this方便链式调用
    },
    _plugins,
    _stores: new Map(), //存放所有的store
    _e:scope, //用来停止所有state的响应式。（实际上pinia并没有提供停止所有 响应式的方法，但是我们可以在pinia中可以使用store1._p._e.stop()来终止所有effect，但当然pinia是不推荐这样做的（注：store1是指一个store实例））
    state,
    install(app) {
      setActivePinia(piniaStore) //将这个piniaStore暴露到全局上，为了在不是vue组件中也能访问到piniaStore（比如router）。
      app.provide(piniaSymbol, piniaStore) //这样就能让vue3的所有组件都可以通过app.inject(piniaSymbol)访问到piniaStore
      app.config.globalProperties.$pinia = piniaStore //这样就能让vue2的组件实例也可以共享piniaStore
    }
  }
  return piniaStore
}
```



#### defineStore

defineStore接受三种传参方式: （感觉传入options就是为了迎合vue2的写法）

 * 第一种是传入id + options。
 * 第二种是只传入options（id也包含在这里面）
 * 第三种是传入id + setup函数

所以进来这个函数第一件事就是处理第一个参数`idOrOptions`，把id和options分别提取出来。

然后返回一个useStore函数，这个函数里会获取整个pinia实例（即上面createPinia暴露出全局的对象），然后看里面有没有目前使用的store，没有就创建，然后把这个store返回给用户。（所以创建store是在use的时候完成的而不是define的时候）。

```js
import {piniaSymbol} from './piniaSymbol'
import {getCurrentInstance,inject,reactive,effectScope,isRef,isReactive} from 'vue'
import { activePinia, setActivePinia } from './createPinia'

/**
 * defineStore接受三种传参方式: （感觉传入options就是为了迎合vue2的写法）
 * 第一种是传入id + options。
 * 第二种是只传入options（id也包含在这里面）
 * 第三种是传入id + setup函数
 */
export function defineStore(idOrOptions, optionsOrSetup) {
  let id, options
  //处理第一个参数 idOrOptions
  if (typeof idOrOptions === 'string') { //是第一种传参方式
    id = idOrOptions
    options = optionsOrSetup
  } else { // 是第二种传参方式
    options = idOrOptions
    id = options.id
  }

  function useStore() {
    const instance = getCurrentInstance() // 获得当前组件实例
    let piniaStore = instance && inject(piniaSymbol) //如果当前组件实例存在就注入整个piniaStore(因为只有在vue组件里才能使用inject)
    if (piniaStore) {
      setActivePinia(piniaStore)
    }
    piniaStore = activePinia //这样就可以哪怕不是在vue组件中使用也能拿到整个piniaStore（比如在router中使用）
    if (!piniaStore._stores.has(id)) { //如果是还没有这个store（即第一次使用这个useStore），那就创建这个store。！！在use的时候才会创建这个store！！
      if (typeof optionsOrSetup === 'function') { //传进来一个setup函数 ，是第三种传参方式
        createSetupStore(id, optionsOrSetup,piniaStore)
      } else { //前两种传参方式都用这个来构建store
        createOptionsStore(id,options,piniaStore)
      }
    }
    return piniaStore._stores.get(id) //获得目前use的这个store
  }

  return useStore //用户使用这个函数就能获得这个store
}
```





#### createSetupStore和createOptionsStore

创建store有两种方式（一种是用户在defineStore里传入了options，一种是用户在defineStore里传入了setup），但其实最后都是靠createSetupStore来创建store，createOptionsStore只不过是把参数封装成setup的形式然后再传给createSetupStore。

- 如果是createSetupStore这种，则有定义一个store用于存放*不是用户定义的属性和方法以及内置的api*，定义一个scope到时候可以停止自己store的响应式。然后对store里的所有属性进行遍历，继而对actions即setup里的函数进行一层包装（比如将原函数的this绑定到store上，还有如果原函数是异步函数的处理），把每个state都也存放到全局的state里。最后将存放*内置的api*的store与用户define的store进行合并然后存放到全局pinia的`_s`属性里。
- 如果是createOptionsStore这种，则先将state, actions, getters从options中提取出来，然后写成setup函数的形式（state要放到pinia的state属性里，getters要把里面的函数变成计算属性，并将处理后的state、actions、getters合并再导出。）然后把这个setup函数传给上面的createSetupStore来构建store。然后再给这个store附上个`$reset`方法（这个方法只有options定义的store才有）。

```js
function isComputed(v) { // 计算属性是ref，同时也是一个effect
  return !!(isRef(v)&&v.effect)
}

/**defineStore传入了setup函数时调用这个函数
 * id 表示store的id
 * setup表示setup函数
 * piniaStore表示整个pinia的store
 * isOption表示用户是否用option语法define的store
*/
function createSetupStore(id, setup, piniaStore,isOption) {
  let scope
  function $patch(){}
  const partialStore = {//内置的api存放到这个store里
    $patch
  }
  const store = reactive(partialStore) //store就是一个响应式对象，这个是最后暴露出去的store，会存放内置的api和用户定义的store

  if (!piniaStore.state.value[id] && !isOption) { // 整个pinia的store里还没有存放过目前这个state 且 用户用options语法来define的store
    piniaStore.state.value[id] = {}
  }

  //这个函数就是为了到时候方便停止响应式。（核心的创建store可以不要这部分代码）
  const setupStore = piniaStore._e.run(() => { //这样包一层就可以到时候通过pinia.store.stop()来停止全部store的响应式
    scope = effectScope()
    return scope.run(()=>setup()) //这样包一层就可以到时候通过scope.stop()来停止这个store的响应式
  })

  //遍历这个store里的所有属性，做进一步处理
  for (let key in setupStore) {
    const prop = setupStore[key]

     //处理action
    if (typeof prop == 'function') {
      setupStore[key] = wrapAction(key, prop)
    }

    //处理state
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) { //如果他是ref或者是reactive则说明它是state（注意由于computed也是ref，所以要排除掉计算属性）
      if (!isOption) { //如果是setup语法，把里面的state也存到全局的state里
        piniaStore.state.value[id][key] = prop
      }
    }
  }

	/**对actions包一层，做一些处理。store里面存的actions实际都是经过了这个包装的actions。*/
  function wrapAction(name, action) {
    return function () {
      let ret = action.apply(store, arguments) //使this永远指向store

      //action执行后可能是一个promise，todo......

      return ret
    }
  }

  // 把不是用户定义的和是用户定义的都合并到store里，并给外面使用
  Object.assign(store,setupStore)
  piniaStore._stores.set(id, store)//将这个store存到piniaStore中
  return store
}


/**defineStore传入了options时调用这个函数 （感觉传入options就是为了迎合vue2的写法）*/
function createOptionsStore(id, options,piniaStore) {
  const { state, actions, getters } = options

  function setup() { //处理store里的state、actions、getters
    piniaStore.state.value[id] = state ? state() : {} //把这个store的state存到piniaStore里
    const localState = toRefs(piniaStore.state.value[id]) //把这个store的state转换成ref即变成响应式，因为options写法里的state并不是响应式的。
    return Object.assign( //这里返回的对象就是用户存放用户定义的属性和方法
      localState, //用户的state
      actions, // 用户的actions
      Object.keys(getters || {}).reduce((memo, name) => { //用户的getters，因为用户的getters这个对象里的属性都是函数，所以我要把这些函数都执行了变成计算属性
        memo[name] = computed(() => {
          let store = pinia._stores.get(id)
          return getters[name].call(store)
        })//call是为了保证this指向store
    },{}))
  }

  const store = createSetupStore(id, setup, piniaStore, true)

  store.$reset = function () {
    const rawState = state ? state() : {}
    store.$patch(state => {
      Object.assign(state,rawState)
    })
  }
}
```

#### store内置的api

这些api其实是在上面createSetupStore函数里编写的（除了`$reset`方法只有options定义的store才有，所以就写在上面createOptionsStore里了），这里抽离出来方便观看。

##### $patch

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...
  
  /**此函数用于批量修改state，有两种传参方式：一种是传入一个对象，这个对象里有部分或全部state；另一种是传入一个函数，这个函数的参数是state，函数体对state进行修改 */
  function $patch(partialStateOrMutator) {
    if (typeof partialStateOrMutator === 'object') {
      mergeReactiveObject(pinia.state.value[id],partialStateOrMutator) //递归合并两个对象
    } else { //partialStateOrMutator是一个function
      partialStateOrMutator(pinia.state.value[id])
    }
  }

	//...其他代码...
}

function mergeReactiveObject(target, state) { //递归合并两个对象
  for (let key in state) {
    let oldValue = target[key];
    let newValue = state[key];
    if (oldValue && newValue && oldValue.constructor === Object && newValue.constructor === Object) { // 两个都是对象
      target[key] = mergeReactiveObject(oldValue, newValue);
    } else {
      target[key] = newValue;
    }
  }
  return target;
}
```





##### $subscribe

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...
	
	/**此函数用于在state发生变化的时候执行个函数，原理就是利用vue提供的watch去监听state变化。（套娃）
   * callback: 在state变化时要执行的函数。这个callback的参数是store的id和state。
   * options： 就是vue里watch需要的options参数
  */
  function $subscribe(callback, options = {}) {
    scope.run(() => watch(piniaStore.state.value[id], state => { //scope.run包一层纯粹就是为了到时候便于停止响应式，没有其他任何实际作用。
      callback({storeId:id},state)
    },options))
  }
	//...其他代码...
}
```







##### $onAction

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...

	const actionSubscribtions = []//存放action执行之前的订阅函数
  /**此函数用于订阅一个函数在触发action之前或action执行之后或action发生错误的时候执行。参数是一个callback，这个callback里有after或onError的函数参数，整个callback会在action执行之前执行。 */
  function $onAction(callback) {
    addSubscribtion.bind(null,actionSubscribtions)(callback)
  }
  
// 为了能触发订阅的函数 对createSetupStore里的wrapAction进行补充：
  /**对actions包一层，做一些处理。store里面存的actions实际都是经过了这个包装的actions。*/
  function wrapAction(name, action) {
    return function () {

      // 存放action的之后和发生错误后的订阅函数
      const afterCallbackList = []
      const onErrorCallbackList = []
      function after(callback) {
        afterCallbackList.push(callback)
      }
      function onError(callback) {
        onErrorCallbackList.push(callback)
      }

      triggerSubscribtions(actionSubscribtions, { after, onError }) //触发action执行前的订阅函数
      let ret
      try {
        ret = action.apply(store, arguments) //使this永远指向store 并执行action！！！
      } catch(e) {
        triggerSubscribtions(onErrorCallbackList, e) //触发action执行错误后的订阅
      }

      if (ret instanceof Promise) { //如果action是promise
        return ret.then(value => {
          return triggerSubscribtions(afterCallbackList,value)
        }).catch(e => {
          triggerSubscribtions(onErrorCallbackList,e)
          return Promise.reject(e)
        })
      }
      triggerSubscribtions(afterCallbackList, ret) //触发action执行后的订阅

      return ret
    }
  }
  
	//...其他代码...
}
```



##### $dispose

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...


  /**此函数用于Stops the associated effect scope of the store and remove it from the store registry. */
    function $dispose() {
      scope.stop() //清除响应式
      actionSubscribtions = [] //取消订阅
      piniaStore._stores.delete(id) //清除这个store
    }
	//...其他代码...
}
```



##### $state属性

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...
  
  Object.defineProperties(store, '$state', { //给store添加一个属性$state。Setting it will replace the whole state.
      get: () => pinia.state.value[id],
      set:state=>$patch($state=>Object.assign($state,state))
    })
	//...其他代码...
}
```





#### 插件机制

所有插件都会存到总的pinia上，详情见[createPinia](#createPinia)

每次创建store都会调用插件方法。

```js
function createSetupStore(id, setup, piniaStore,isOption) {
	//...其他代码...	
	
	  pinia._plugins.forEach(plugin => {
      Object.assign(store,scope.run(()=>plugin({store}))) //Object.assign是为了让插件的返回值作为store的属性
    })
	
	//...其他代码...
}
```



#### storeToRefs

```js
import { toRaw, toRef, isRef ,isReactive} from "vue"
export function storeToRefs(store) { // 作用是跟toRefs一样的，只不过toRefs会处理函数的情况，于是pinia就写一个只处理响应式对象的。原理就是使用toRef。
  store = toRaw(store)
  const refs = {}
  for (let key in store) {
    const value = store[key]
    if (isRef(value)||isReactive(value)) {
      refs[key] = toRef(store,key)
    }
  }
  return refs
}
```







### 遇到的问题

####  getActivePinia was called with no active Pinia. Did you forget to install pinia?

[here](https://www.likecs.com/ask-7934490.html)



#### ts文件里用pinia的store

```ts
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from "@/stores"
import { storeToRefs } from 'pinia'
export default {
  path: '/courseTask',
  name: 'courseTask',
  beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { userInfo } = storeToRefs(useUserStore()) //如果在该文件的顶层直接写这一行就会报错。原因是pinia只能在运行时使用  ????? 看一下源码：为什么在顶层直接写不可以，只能在调用一个函数的里面写才行
  },
```







### 源码

#### createPinia

##### 我的总结

创建一个全局对象，里面会存储所有store，存储所有state。



##### 使用

通过`createPinia`创建一个`pinia`实例，供应用程序使用。

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia).mount('#app')
```

##### 实现

###### 大纲

`createPinia`不接受任何参数，它会返回一个`pinia`实例。

源码位置：`packages/pinia/src/createPinia.ts`

在`createPinia`中首先会创建一个`effect`作用域对象，使用`ref`创建一个响应式对象。紧接着声明了两个数组`_p`、`toBeInstalled`，其中`_p`用来存储扩展`store`的所有插件，`toBeInstalled`用来存储那些未`install`之前使用`pinia.use()`添加的的`plugin`。

```typescript
// 创建effect作用域
const scope = effectScope(true)
// 创建响应式对象
const state = scope.run<Ref<Record<string, StateTree>>>(() =>
  ref<Record<string, StateTree>>({})
)!

// 存储扩展store的plugin
let _p: Pinia['_p'] = []
// install之前，使用pinia.use()添加的plugin
let toBeInstalled: PiniaPlugin[] = []
```

然后声明一个`pinia`对象（这个`pinia`会使用`markRaw`进行包装，使其不会转为`proxy`），将其`return`。

```typescript
const pinia: Pinia = markRaw({
  install(app: App) {
    // ...
  },

  use(plugin) {
    // ...
  },

  // 扩展store的plugins
  _p,
  // app实例
  _a: null,
  // effecet作用域对象
  _e: scope,
  // 在这个pinia中注册的stores
  _s: new Map<string, StoreGeneric>(),
  state,
})

if (__DEV__ && IS_CLIENT && !__TEST__) {
  pinia.use(devtoolsPlugin)
}

return pinia
```

###### install

当使用`app.use(pinia)`时，触发`pinia.install`函数。在`install`中首先执行了`setActivePinia(pinia)`，它会将`pinia`赋给一个`activePinia`的全局变量。

然后会判断是不是`Vue2`环境。如果不是`Vue2`，将`app`实例赋给`pinia._a`，然后将`pinia`注入到`app`实例，并将`pinia`设置为全局属性`$pinia`。如果此时`toBeInstalled`中有`plugins`（在`install`之前添加的`plugins`），那么会把这些`plugins`添加到`pinia._p`中，添加完之后，置空`toBeInstalled`。

```typescript
install(app: App) {
  setActivePinia(pinia)
  if (!isVue2) {
    pinia._a = app
    app.provide(piniaSymbol, pinia)
    app.config.globalProperties.$pinia = pinia
    if (__DEV__ && IS_CLIENT) {
      registerPiniaDevtools(app, pinia)
    }
    toBeInstalled.forEach((plugin) => _p.push(plugin))
    toBeInstalled = []
  }
}
```

###### use

使用`use`方法可添加一个`plugin`以扩展每个`store`。它接收一个`plugin`参数，返回当前`pinia`。

如果`this._a`是空的，并且不是`Vue2`环境，会将`plugin`中暂存到`toBeInstalled`中，等待`install`时进行安装。否则，直接添加到`this._p`中。

```typescript
use(plugin) {
  if (!this._a && !isVue2) {
    toBeInstalled.push(plugin)
  } else {
    _p.push(plugin)
  }
  return this
}
```

#### defineStore

##### 我的总结

返回一个useStore方法，这个方法用户会在组件中执行。useStore会拿到全局的pinia对象，从pinia中取出你要的store，如果store还不存在，那就创建，单例模式该store只会被创建一次。创建完之后数据都会存到全局pinia上。

所以store确实是用到的时候才会创建，但是一旦创建就是全局都有了。

官网说的：你可能会认为可以通过一行简单的 `export const state = reactive({})` 来共享一个全局状态。对于单页应用来说<mark>确实可以</mark>，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 

所以你小子就是为了解决ssr是吧，普通spa我真用不上你，还多了学习成本。

##### 使用

通过`defineStore`定义一个`store`。

```ts
const useUserStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})

// or
const useUserStore = defineStore({
  id: 'counter',
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})

// or
const useUserStore = defineStore('counter', () => {
  const count = ref(0)
  
  function increment() {
    count.value++
  }
  return { count, increment }
})
```

##### 实现

###### `defineStore`的函数类型定义

`defineStore`函数可以接收三个参数：`idOrOptions`、`setup`、`setOptions`，后两个参数为可选参数。下面是三个`defineStore`的函数类型定义。

```ts
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  A /* extends ActionsTree */ = {}
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
): StoreDefinition<Id, S, G, A>

export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  A /* extends ActionsTree */ = {}
  >(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>

export function defineStore<Id extends string, SS>(
  id: Id,
  storeSetup: () => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
    >
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
  >
```



###### `defineStore`实现

在`defineStore`中声明了三个变量：`id`、`options`、`isSetupStore`，其中`id`为定义的`store`的唯一`id`，`options`为定义`store`时的`options`，`isSetupStore`代表传入的`setup`是不是个函数。根据传入的`idOrOptions`的类型，为`id`、`otions`赋值。紧接着声明了一个`useStore`函数，并将`id`赋给它，然后将其`return`。

```ts
export function defineStore(
  idOrOptions: any,
  setup?: any,
  setupOptions?: any
): StoreDefinition {
  let id: string
  let options:
    | DefineStoreOptions<
        string,
        StateTree,
        _GettersTree<StateTree>,
        _ActionsTree
      >
    | DefineSetupStoreOptions<
        string,
        StateTree,
        _GettersTree<StateTree>,
        _ActionsTree
      >

  const isSetupStore = typeof setup === 'function'
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric { // ... }

  useStore.$id = id

  return useStore
}
```





###### useStore

`useStore`接收两个可选参数：`pinia`、`hot`。`pinia`是个`Pinia`的实例，而`hot`只在开发环境下有用，它与模块的热更新有关。`defineStore`返回一个`useStore`函数，通过执行`useStore`可以获取对应的`store`。调用`useStore`时我们并没有传入`id`，为什么能准确获取`store`呢？这是因为`useStore`是个闭包，在执行`useStore`执行过程中会自动获取`id`。

在`useStore`中会首先获取当前组件实例，如果存在组件实例，使用`inject(piniaSymbol)`获取`pinia`（在`install`中会进行`provide`），并将其设置为`activePinia`，然后在`activePinia._s`中查找是否有被注册为`id`的`store`，如果没有则创建`store`，将其注册到`activePinia._s`中。最后返回`activePinia._s`中`id`对应的`store`。

```ts
function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
  // 获取当前实例
  const currentInstance = getCurrentInstance()
  // 测试环境下，忽略提供的参数，因为总是能使用getActivePinia()获取pinia实例
  // 非测试环境下，如果未传入pinia，则会从组件中使用inject获取pinia
  pinia =
    (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
    (currentInstance && inject(piniaSymbol))
  // 设置激活的pinia
  if (pinia) setActivePinia(pinia)

  // 如果没有activePinia，那么可能没有install pinia，开发环境下进行提示
  if (__DEV__ && !activePinia) {
    throw new Error(
      `[🍍]: getActivePinia was called with no active Pinia. Did you forget to install pinia?\n` +
        `\tconst pinia = createPinia()\n` +
        `\tapp.use(pinia)\n` +
        `This will fail in production.`
    )
  }

  // 设置pinia为激活的pinia
  pinia = activePinia!

  // 从pina._s中查找id否注册过，如果没有被注册，创建一个store并注册在pinia._s中
  if (!pinia._s.has(id)) {
    if (isSetupStore) {
      createSetupStore(id, setup, options, pinia)
    } else {
      createOptionsStore(id, options as any, pinia)
    }

    if (__DEV__) {
      useStore._pinia = pinia
    }
  }

  // 从pinia._s中获取id对应的store
  const store: StoreGeneric = pinia._s.get(id)!

  if (__DEV__ && hot) {
    const hotId = '__hot:' + id
    const newStore = isSetupStore
      ? createSetupStore(hotId, setup, options, pinia, true)
      : createOptionsStore(hotId, assign({}, options) as any, pinia, true)

    hot._hotUpdate(newStore)

    // cleanup the state properties and the store from the cache
    delete pinia.state.value[hotId]
    pinia._s.delete(hotId)
  }

  if (
    __DEV__ &&
    IS_CLIENT &&
    currentInstance &&
    currentInstance.proxy &&
    !hot
  ) {
    const vm = currentInstance.proxy
    const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
    cache[id] = store
  }

  // 返回store
  return store as any
}
```



现在我们知道`useStore`函数，最终会返回一个`store`。那么这个`store`是什么呢？它是如何创建的呢？在`useStore`中根据不同情况中有两中方式来创建`store`，分别是：`createSetupStore`、`createOptionsStore`。这两个方式的使用条件是：如果`defineStore`第二个参数是个`function`调用`createSetupStore`，相反调用`createOptionsStore`。

###### createSetupStore

`createSetupStore`可接收参数如下：

| 参数             | 说明                           |      |
| ---------------- | ------------------------------ | ---- |
| `$id`            | 定义`store`的`id`              |      |
| `setup`          | 一个可以返回`state`的函数      |      |
| `options`        | `defineStore`的`options`       |      |
| `pinia`          | `Pinia`实例                    |      |
| `hot`            | 是否启用热更新                 | 可选 |
| `isOptionsStore` | 是否使用`options`声明的`store` | 可选 |

因为`createSetupStore`是需要创建`store`，并将`store`注册到`pinia._s`中，所以`createSetupStore`中可能需要创建`store`，我们找到创建`store`的地方。

```
const partialStore = {
  _p: pinia,
  // _s: scope,
  $id,
  $onAction: addSubscription.bind(null, actionSubscriptions),
  $patch,
  $reset,
  $subscribe(callback, options = {}) {
    const removeSubscription = addSubscription(
      subscriptions,
      callback,
      options.detached,
      () => stopWatcher()
    )
    const stopWatcher = scope.run(() =>
      watch(
        () => pinia.state.value[$id] as UnwrapRef<S>,
        (state) => {
          if (options.flush === 'sync' ? isSyncListening : isListening) {
            callback(
              {
                storeId: $id,
                type: MutationType.direct,
                events: debuggerEvents as DebuggerEvent,
              },
              state
            )
          }
        },
        assign({}, $subscribeOptions, options)
      )
    )!

    return removeSubscription
  },
  $dispose,
} as _StoreWithState<Id, S, G, A>

if (isVue2) {
  partialStore._r = false
}

const store: Store<Id, S, G, A> = reactive(
  assign(
    __DEV__ && IS_CLIENT
      ? // devtools custom properties
        {
          _customProperties: markRaw(new Set<string>()),
          _hmrPayload,
        }
      : {},
    partialStore
  )
) as unknown as Store<Id, S, G, A>

pinia._s.set($id, store)
```

`store`是用`reactive`包装的一个响应式对象，`reactive`所包装的对象是由`partialStore`通过`Object.assign`进行复制的。`partialStore`中定义了很多方法，这些方法都是暴露给用户操作`store`的一些接口，如`$onAction`可设置`actions`的回调、`$patch`可更新`store`中的`state`、`$dispose`可销毁`store`。

在调用完`pinia._s.set($id, store)`之后，会执行`setup`，获取所有的数据。`setup`的执行会在创建`pinia`实例时创建的`effectScope`中运行，而且会再单独创建一个`effectScope`，用来单独执行`setup`.

```
const setupStore = pinia._e.run(() => {
  scope = effectScope()
  return scope.run(() => setup())
})!
```

然后遍历`setupStore`的属性：如果`prop`（`key`对应的值）为`ref`（不为`computed`）或`reactive`，则将`key`及`prop`同步到`pina.state.value[$id]`中；如果`prop`为`function`，则会使用`wrapAction`包装`prop`，并将包装后的方法赋值给`setupStore[key]`，以覆盖之前的值，同时将包装后的方法存入`optionsForPlugin.actions`中。

```
for (const key in setupStore) {
  const prop = setupStore[key]

  // 如果prop是ref（但不是computed）或reactive
  if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
    if (__DEV__ && hot) {
      set(hotState.value, key, toRef(setupStore as any, key))
    } else if (!isOptionsStore) {
      if (initialState && shouldHydrate(prop)) {
        if (isRef(prop)) {
          prop.value = initialState[key]
        } else {
          mergeReactiveObjects(prop, initialState[key])
        }
      }

      // 将对应属性同步至pinia.state中
      if (isVue2) {
        set(pinia.state.value[$id], key, prop)
      } else {
        pinia.state.value[$id][key] = prop
      }
    }

    if (__DEV__) {
      _hmrPayload.state.push(key)
    }
  } else if (typeof prop === 'function') { // 如果prop是function
    // 使用wrapAction包装prop，在wrapAction会处理afeterCallback、errorCallback
    const actionValue = __DEV__ && hot ? prop : wrapAction(key, prop)

    // 将actionsValue添加到setupStore中，覆盖原来的function
    if (isVue2) {
      set(setupStore, key, actionValue)
    } else {
      setupStore[key] = actionValue
    }

    if (__DEV__) {
      _hmrPayload.actions[key] = prop
    }

    // 将function类型的prop存入optionsForPlugin.actions中
    optionsForPlugin.actions[key] = prop
  } else if (__DEV__) {
    if (isComputed(prop)) {
      _hmrPayload.getters[key] = isOptionsStore
        ? // @ts-expect-error
        options.getters[key]
        : prop
      if (IS_CLIENT) {
        const getters: string[] =
          setupStore._getters || (setupStore._getters = markRaw([]))
        getters.push(key)
      }
    }
  }
}
```

接下来我们看下`wrapAction`是如何进行包装`function`类型上的`prop`。

```
function wrapAction(name: string, action: _Method) {
  return function (this: any) {
    setActivePinia(pinia)
    const args = Array.from(arguments)

    const afterCallbackList: Array<(resolvedReturn: any) => any> = []
    const onErrorCallbackList: Array<(error: unknown) => unknown> = []
    function after(callback: _ArrayType<typeof afterCallbackList>) {
      afterCallbackList.push(callback)
    }
    function onError(callback: _ArrayType<typeof onErrorCallbackList>) {
      onErrorCallbackList.push(callback)
    }

    triggerSubscriptions(actionSubscriptions, {
      args,
      name,
      store,
      after,
      onError,
    })

    let ret: any
    try {
      ret = action.apply(this && this.$id === $id ? this : store, args)
    } catch (error) {
      triggerSubscriptions(onErrorCallbackList, error)
      throw error
    }

    // 如果结果是promise，在promise中触发afterCallbackList及onErrorCallbackList
    if (ret instanceof Promise) {
      return ret
        .then((value) => {
          triggerSubscriptions(afterCallbackList, value)
          return value
        })
        .catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error)
          return Promise.reject(error)
        })
    }

    triggerSubscriptions(afterCallbackList, ret)
    return ret
  }
}
```

`wrapAction`首先返回一个函数，在这个函数中，首先将`pinia`设置为`activePinia`，触发`actionSubscriptions`中的函数，然后执行`action`函数，如果执行过程中出错，会执行`onErrorCallbackList`中的`errorCallback`，如果没有出错的话，执行`afterCallbackList`中的`afterCallback`，最后将`action`的返回结果`return`。

`wrapAction`中的`actionSubscriptions`是个什么呢？

其实`actionSubscriptions`中的`callback`就是是通过`store.$onAction`添加的回调函数；在执行`actionSubscriptions`中的`callback`过程中，会将对应`callback`添加到`afterCallbackList`或`onErrorCallbackList`中。例如：

```
store.$onAction(({ after, onError, name, store }) => {
  after((value) => {
    console.log(value)
  })
  
  onError((error) => {
    console.log(error)
  })
})
```

遍历完`setupStore`之后，会将`setupStore`合并至`store`和`store`的原始对对象中，以方便使用`storeToRefs()`检索响应式对象。

```
if (isVue2) {
  Object.keys(setupStore).forEach((key) => {
    set(
      store,
      key,
      setupStore[key]
    )
  })
} else {
  assign(store, setupStore)
  assign(toRaw(store), setupStore)
}
```

紧接着拦截`store.$state`的`get`、`set`方法：当调用`store.$state`时，能够从`pinia.state.value`找到对应的`state`；当使用`store.$state = xxx`去修改值时，则调用`$patch`方法修改值。

```
Object.defineProperty(store, '$state', {
  get: () => (__DEV__ && hot ? hotState.value : pinia.state.value[$id]),
  set: (state) => {
    /* istanbul ignore if */
    if (__DEV__ && hot) {
      throw new Error('cannot set hotState')
    }
    $patch(($state) => {
      assign($state, state)
    })
  },
})
```

截止到此，`store`就准备完毕。如果在`Vue2`环境下，会将`store._r`设置为true。

```
if (isVue2) {
  store._r = true
}
```

接下来就需要调用使用`use`方法注册的`plugins`：

```
pinia._p.forEach((extender) => {
  if (__DEV__ && IS_CLIENT) {
    const extensions = scope.run(() =>
      extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin,
      })
    )!
    Object.keys(extensions || {}).forEach((key) =>
      store._customProperties.add(key)
    )
    assign(store, extensions)
  } else {
    // 将plugin的结果合并到store中
    assign(
      store,
      scope.run(() =>
        extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin,
        })
      )!
    )
  }
})
```

最后返回`store`。

```
if (
  initialState &&
  isOptionsStore &&
  (options as DefineStoreOptions<Id, S, G, A>).hydrate
) {
  ;(options as DefineStoreOptions<Id, S, G, A>).hydrate!(
    store.$state,
    initialState
  )
}

isListening = true
isSyncListening = true
return store
```

接下来看下`store`中的几个方法：

###### $onAction

在每个`action`中添加回调函数。回调接收一个对象参数：该对象包含`name`（`action`的`key`值）、`store`（当前`store`）、`after`（添加`action`执行完之后的回调）、`onError`（添加`action`执行过程中的错误回调）、`args`（`action`的参数）属性。

示例：

```
// 统计add action的调用次数
let count = 0, successCount = 0, failCount = 0
store.$onAction(({ name, after, onError }) => {
  if (name === 'add') {
    count++
    after((resolveValue) => {
      successCount++
      console.log(resolveValue)
    })
  
    onError((error) => {
      failCount++
      console.log(error)
    })
  }
})
```

`$onAction`内部通过发布订阅模式实现。在`pinia`中有个专门的订阅模块`subscriptions.ts`，其中包含两个主要方法：`addSubscription`（添加订阅）、`triggerSubscriptions`（触发订阅）。

`addSubscription`可接收四个参数：`subscriptions`（订阅列表）、`callback`（添加的订阅函数）、`detached`（游离的订阅，如果为`false`在组件卸载后，自动移除订阅；如果为`true`，不会自动移除订阅）、`onCleanup`（订阅被移除时的回调）

`triggerSubscriptions`接收两个参数：`subscriptions`（订阅列表）、`args`（`action`的参数列表）

```
export function addSubscription<T extends _Method>(
  subscriptions: T[],
  callback: T,
  detached?: boolean,
  onCleanup: () => void = noop
) {
  subscriptions.push(callback)

  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
      onCleanup()
    }
  }

  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription)
  }

  return removeSubscription
}

export function triggerSubscriptions<T extends _Method>(
  subscriptions: T[],
  ...args: Parameters<T>
) {
  subscriptions.slice().forEach((callback) => {
    callback(...args)
  })
}
```

`$onAction`通过`addSubscription.bind(null, actionSubscriptions)`实现。

**如何触发订阅？**

首先在`store`的初始化过程中，会将`action`使用`wrapAction`函数进行包装，`wrapAction`返回一个函数，在这个函数中会先触发`actionSubscriptions`，这个触发过程中会将`afterCallback`、`onErrorCallback`添加到对应列表。然后调用`action`，如果调用过程中出错，则触发`onErrorCallbackList`，否则触发`afterCallbackList`。如果`action`的结果是`Promise`的话，则在`then`中触发`onErrorCallbackList`，在`catch`中触发`onErrorCallbackList`。然后会将包装后的`action`覆盖原始`action`，这样每次调用`action`时就是调用的包装后的`action`。

###### $patch

使用`$patch`可以更新`state`的值，可进行批量更新。`$patch`接收一个`partialStateOrMutator`参数，它可以是个对象也可以是个方法。

示例：

```
store.$patch((state) => {
  state.name = 'xxx'
  state.age = 14
})
// or
store.$patch({
  name: 'xxx',
  age: 14
})
```

`$patch`源码：

```
function $patch(
  partialStateOrMutator:
    | _DeepPartial<UnwrapRef<S>>
    | ((state: UnwrapRef<S>) => void)
): void {
  // 合并的相关信息
  let subscriptionMutation: SubscriptionCallbackMutation<S>
  // 是否触发状态修改后的回调，isListening代表异步触发，isSyncListening代表同步触发
  // 此处先关闭回调的触发，防止修改state的过程中频繁触发回调
  isListening = isSyncListening = false
  if (__DEV__) {
    debuggerEvents = []
  }
  // 如果partialStateOrMutator是个function，执行方法，传入当前的store
  if (typeof partialStateOrMutator === 'function') {
    partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
    subscriptionMutation = {
      type: MutationType.patchFunction,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  } else { // 如果不是function，则调用mergeReactiveObjects合并state
    mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator)
    subscriptionMutation = {
      type: MutationType.patchObject,
      payload: partialStateOrMutator,
      storeId: $id,
      events: debuggerEvents as DebuggerEvent[],
    }
  }
  // 当合并完之后，将isListening、isSyncListening设置为true，意味着可以触发状态改变后的回调函数了
  const myListenerId = (activeListener = Symbol())
  nextTick().then(() => {
    if (activeListener === myListenerId) {
      isListening = true
    }
  })
  isSyncListening = true
  // 因为在修改pinia.state.value[$id]的过程中关闭（isSyncListening与isListening）了监听，所以需要手动触发订阅列表
  triggerSubscriptions(
    subscriptions,
    subscriptionMutation,
    pinia.state.value[$id] as UnwrapRef<S>
  )
}
```

###### $reset

通过构建一个新的`state object`将`state`重置为初始状态。只在`options`配置下生效。如果是`setup`配置，开发环境下报错。

```
store.$reset = function $reset() {
  // 重新执行state，获取一个新的state
  const newState = state ? state() : {}
  // 通过$patch，使用assign将newState合并到$state中
  this.$patch(($state) => {
    assign($state, newState)
  })
}
```

###### $subscribe

设置`state`改变后的回调，返回一个移除回调的函数。可接受两个参数：`callback`（添加的回调函数）、`options:{detached, flush, ...watchOptions}`（`detached`同`addSubscription`中的`detached`；`flush`代表是否同步触发回调，可取值：`sync`）。

示例：

```
store.$subribe((mutation: {storeId, type, events}, state) => {
  console.log(storeId)
  console.log(type)
  console.log(state)
}, { detached: true, flush: 'sync' })
```

`$subscribe`源码：

```
function $subscribe(callback, options = {}) {
  // 将callback添加到subscriptions中，以便使用$patch更新状态时，触发回调
  // 当使用removeSubscription移除callback时，停止对pinia.state.value[$id]监听
  const removeSubscription = addSubscription(
    subscriptions,
    callback,
    options.detached,
    () => stopWatcher()
  )
  const stopWatcher = scope.run(() =>
    // 监听pinia.state.value[$id]，以触发callback，当使用$patch更新state时，不会进入触发这里的callback
    watch(
      () => pinia.state.value[$id] as UnwrapRef<S>,
      (state) => {
        if (options.flush === 'sync' ? isSyncListening : isListening) {
          callback(
            {
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents as DebuggerEvent,
            },
            state
          )
        }
      },
      assign({}, $subscribeOptions, options)
    )
  )!

  return removeSubscription
}
```

在`callback`中的第一个参数中有个`type`属性，表示是通过什么方式更新的`state`，它有三个值：

1. `MutationType.direct`：通过`state.name='xxx'`/`store.$state.name='xxx'`等方式修改
2. `MutationType.patchObject`：通过`store.$patch({ name: 'xxx' })`方式修改
3. `MutationType.patchFunction`：通过`store.$patch((state) => state.name='xxx')`方式修改

###### $dispose

销毁`store`。

```
function $dispose() {
  // 停止监听
  scope.stop()
  // 清空subscriptions及actionSubscriptions
  subscriptions = []
  actionSubscriptions = []
  // 从pinia._s中删除store
  pinia._s.delete($id)
}
```

###### createOptionsStore

`createOptionsStore`可接收参数如下：

| 参数      | 说明                     |      |
| --------- | ------------------------ | ---- |
| `id`      | 定义`store`的`id`        |      |
| `options` | `defineStore`的`options` |      |
| `pinia`   | `Pinia`实例              |      |
| `hot`     | 是否启用热更新           | 可选 |

```
function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  const { state, actions, getters } = options

  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: Store<Id, S, G, A>

  function setup() {
    // 如果pinia.state.value[id]不存在，进行初始化
    if (!initialState && (!__DEV__ || !hot)) {
      if (isVue2) {
        set(pinia.state.value, id, state ? state() : {})
      } else {
        pinia.state.value[id] = state ? state() : {}
      }
    }

    // 将pinia.state.value[id]各属性值转为响应式对象
    const localState =
      __DEV__ && hot
        ? // use ref() to unwrap refs inside state TODO: check if this is still necessary
          toRefs(ref(state ? state() : {}).value)
        : toRefs(pinia.state.value[id])

    // 处理getters，并将处理后的getters和actions合并到localState中
    return assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = markRaw(
          computed(() => {
            setActivePinia(pinia)
            const store = pinia._s.get(id)!
            
            if (isVue2 && !store._r) return

            return getters![name].call(store, store)
          })
        )
        return computedGetters
      }, {} as Record<string, ComputedRef>)
    )
  }

  // 利用createSetupStore创建store
  store = createSetupStore(id, setup, options, pinia, hot, true)

  // 重写store.$reset
  store.$reset = function $reset() {
    const newState = state ? state() : {}
    this.$patch(($state) => {
      assign($state, newState)
    })
  }

  return store as any
}
```

在`createOptionsStore`中会根据传入参数构造一个`setup`函数，然后通过`createSetupStore`创建一个`store`，并重写`store.$reset`方法，最后返回`store`。

这个`setup`函数中会将`state()`的返回值赋值给`pinia.state.value[id]`，然后将`pinia.state.value[id]`进行`toRefs`，得到`localState`，最后将处理后的`getters`和`actions`都合并到`localState`中，将其返回。对于`getters`的处理：将每个`getter`函数都转成一个计算属性。

###### 总结

`defineStore`返回一个`useStore`函数，通过执行`useStore`可以获取对应的`store`。调用`useStore`时我们并没有传入`id`，为什么能准确获取`store`呢？这是因为`useStore`是个闭包，在执行`useStore`执行过程中会自动获取`id`。

获取`store`的过程：

1. 首先获取组件实例
2. 使用`inject(piniaSymbol)`获取`pinia`实例
3. 判断`pinia._s`中是否有对应`id`的键，如果有直接取对应的值作为`store`，如果没有则创建`store`

`store`创建流程分两种：`setup`方式与`options`方式

`setup`方式：

1. 首先在`pinia.state.value`中添加键为`$id`的空对象，以便后续赋值
2. 使用`reactive`声明一个响应式对象`store`
3. 将`store`存至`pinia._s`中
4. 执行`setup`获取返回值`setupStore`
5. 遍历`setupStore`的键值，如果值是`ref`（不是`computed`）或`reactive`，将键值添加到`pinia.state.value[$id]`中；如果值时`function`，首先将值使用`wrapAction`包装，然后用包装后的`function`替换`setupStore`中对应的值
6. 将`setupStore`合并到`store`中
7. 拦截`store.$state`，使`get`操作可以正确获取`pinia.state.value[$id]`，`set`操作使用`this.$patch`更新
8. 调用`pinia._p`中的扩展函数，扩展`store`

`options`方式：

1. 从`options`中提取`state`、`getter`、`actions`
2. 构建`setup`函数，在`setup`函数中会将`getter`处理成计算属性
3. 使用`setup`方式创建`store`
4. 重写`store.$reset`



#### 其他api

##### **$reset**

只能在option写法的时候使用。

```typescript
const $reset = isOptionsStore
    ? function $reset(this: _StoreWithState<Id, S, G, A>) {
        const { state } = options as DefineStoreOptions<Id, S, G, A>
        const newState = state ? state() : {}
        // we use a patch to group all changes into one single subscription
        this.$patch(($state) => {
          assign($state, newState)
        })
      }
```









#### 插件机制

插件就是函数，pinia会给这个函数传参且会在特定的时候执行。





## Vue-apollon-model

### 特点

1. 状态管理尽可能声明式
2. 生命周期与组件生命周期一致，Model的生命周期取决于所绑定的到的组件
3. 适配Vue SSR模式，使开发者尽可能少的思考CSR与SSR模式下的状态管理区别

query和mutate的区别：顾名思义query用于查询，mutate用于修改。所以幂等的请求用query，非幂等的请求用mutate。



### 区别

#### **与 Pinia Store 的对比**

原理上：Pinia Store 是个全局状态，不能根据组件树状态自动创建销毁，而 Apollo Model 可以是局部状态，当没有组件或者其他 Model 消费一个 Model 时，会自动销毁。 且跟请求相结合，响应式触发请求。



#### **与 Hook 对比**

hook 会在每个组件初始化的时候创建对应的状态和方法；同一个 Model 全局只会创建一次，多次调用 useModel 不会重复创建(单例)。



### 关键api

#### createStore

store是用于全局存储Model实例的集合

1. 私有一个store，store里有一个modelMap存放model构造器与model实例的映射，store上暴露出增删改查的方法。
2. 私有一个rebornClient用来存放rest对象和gql对象。
3. 对外返回install方法和registerClient方法。
   1. install就是app.provide了store和rebornClient。
   2. registerClient就是往rebornClient里加入rest或gql对象。REST和GQL类型的请求实例各只能有一个，之前注册过一个，则第二个就注册不上了。



#### **createClient**

> @kwai-explore/reborn/packages/model/src/clients/index.ts

构建一个在所有Model中使用的请求实例 用于GraphQL 和 RESTful API的请求，并具有缓存支持和请求拦截器功能。

1. 合并用户传进来的配置和一些默认配置、创建好存放拦截器的数组。

2. 声明真正发请求的方法request。

   1. 通过promise链式调用所有请求拦截器
   2. 通过generateRequestInfo方法对请求做一下预处理，比如如果是get请求则把content-type搞为'application/x-www-form-urlencoded;charset=UTF-8'；如果是FormData则把用户配置的content-type去掉，由浏览器自动添加。还会通过**transformRequestBody**方法对body进行预处理。等等……
   3. 如果用户没有配置fetch方法，则在window下会默认用window.fetch，在node下默认会用globalThis.fetch。
   4. 开启一个定时器。并通过promise.race来将定时器跟正常请求的promise竞速。
   5. *浏览器断网情况下res有可能会是null*，此时不执行响应拦截器直接返回。
   6. 如果res中无‘status’字段则认为响应错误，链式调用响应拦截器后返回。
   7. 响应正常，如果是application/json类型的响应，则把数据格式化了，其他类型的响应就是原样抛出，然后链式调用响应拦截器后返回。

3. 创建缓存对象。就是闭包了一个对象，然后返回几个对这个对像crud的方法。对象里的key是 请求的url和variables进行hash后的值，value是请求回来的data。

4. 声明requestWithCache方法。

   1. 默认的缓存策略是'network-first'。新建一个 rxjs 的 new ReplaySubject对象（新订阅者首次订阅时发送旧值来“重播”旧值。）
   2. 如果是*处于Hydration阶段，一律先从缓存里面拿*data。
   3. 如果是‘cache-and-network’模式，则先用缓存里的数据，然后会发请求再用请求返回的数据。
   4. 如果是'cache-first'模式，则有缓存就用缓存，否则发请求。
   5. 如果是'network-first'，则直接发请求，不会用缓存的数据，然后会把请求回来的数据放到缓存里。
   6. 如果是cache-only'，则直接用缓存，没有缓存就报错。
   7. 如果是'network-only'，则直接发请求，不会用缓存的数据，也不会把请求回来的数据放到缓存里。
   8. 返回那个subject实例（新订阅者首次订阅时发送旧值来“重播”旧值。）。

5. 返回一个对像，里面包括

   ```js
       return {
           interceptors,
           query: requestWithCache,
           mutate: request,
           type
       };
   ```

   

#### **createModel**

1. 返回一个对象。包含两个属性分别是type表示这是什么类型和creator表示一个函数。

2. creator这个函数：

   1. 闭包了creatingModelCount和tempQueryList(这个应该是执行**useRestQuery**时会把参数都push进去)

   2. creatingModelCount++

   3. 获取createStore创建出的那个store。

   4. 把store上的**getModelInstance**方法当参数传进去运行用户传进来的函数继而生成一个model。

   5. ```js
                  const queryList = [...tempQueryList];
                  creatingModelCount--;
                  tempQueryList.length = 0;
               
                  return {
                      queryList,
                      model,
                  };
      ```

      





#### **useRestQuery**

> @kwai-explore/reborn/packages/model/src/model/fn-type.ts

第一步：获取实例，从当前实例中获取route对象，获取前面建立的store和rebornClient。

##### **核心在于第二步：createRestQuery**创建一个query对象。

1. 通过**generateQueryOptions**包装useRestQuery传进来的options。

   1. 初始化响应式info。info就是下面这个返回出来的data。

      ```typescript
          const data: InfoDataType<DataType> = {
              data: undefined,
              loading: true, // data和error为undefined说明请求还没响应
              error: undefined
          };
      
          // 手动绕过UnwrapRef的坑……
          return reactive(data) as typeof data;
      ```

   2. 初始化skip，通过computed里执行一遍option.skip()后获取依赖的数据，然后当数据变化后就会再执行computed里的函数，即重新计算option.skip的返回值。

   3. 初始化pollInterval，variables，url，原理同skip

   4. 创建一个名为 `variables$` 的Observable，通过watch当 `variables`，`url`或 `skip` 计算属性更改时，它会发出新值，使用 `map` 操作符将发出的值转换为 `RequestReason.setVariables` 值。这个watch是立即使用。

   5. 创建了一个名为 `pollInterval$` 的Observable，当 `pollInterval` 计算属性更改时，它会发出新值`RequestReason.poll`。使用 `watch` 函数来观察 `pollInterval` 值的更改，并在其更改时重新开始轮询过程。

   6. 将 `variables$` 和 `pollInterval$` Observables合并为一个名为 `fetchQuery$` 的Observable。当任一输入Observable发出新值时，此Observable会透传此新值。<mark>这用于在variables，URL，skip或pollInterval更改时触发新的查询操作，并暴露出是什么原因导致的新查询。</mark>

   7. ```js
          return {
              info,
              skip,
              pollInterval,
              variables,
              url,
              fetchQuery$,
              prefetch: option.prefetch || true, // 给ssr使用的。
          };
      ```

2. <mark>创建一个新的 `Subject` 实例 `requestStream$`，它将发出 observables。订阅 `requestStream$`，并根据 observables 发出的值更新 `info` 对象（所以核心就是这个`requestStream$`）。下面的fetch函数会控制`requestStream$`什么时候吐出数据。</mark>

3. 创建了一个 `stream$`，它合并 `requestStream$` 发出的所有 observables。 最终对外暴露这个stream$。

4. 定义了一个 `fetch` 函数。这个函数接收一个 `reason` 和 `variables` 作为参数，并返回一个 promise，当查询完成时，这个 promise 就会 resolve。此函数会记录开始时的info信息，还会附上唯一id。

   <mark>`requestStream$`吐出 `query$`，通过switchAll操作符，每次采用最新的observable，将最新的observable吐出的数据吐出。 看如下简化代码：</mark>

   ```typescript
   const requestStream$ = new Subject()
   requestStream$.pipe(switchAll()).subscribe(value => { // 订阅requestStream$ 以 修改 info数据
       info.loading = value.loading
       if(!value.loading) {
           info.error = value.error
           if (value.data) { // 有数据才修改数据，导致如果第一个接口有数据，第二个接口报错，则data还是上一次接口的data；如果业务侧没有包一层if(error)再消费数据，则会消费上一个接口的数据。（这样设计应该为了可以给用户自行根据场景选择：
   沿用上一次的数据：如果你的应用程序可以容忍数据的短暂过时，并且你希望在请求失败时为用户提供一个更平滑的体验，你可以选择沿用上一次的数据。这样，即使新的请求失败，用户仍然可以看到并使用旧的数据，而不是看到一个错误消息或一个空白的页面。
   
   显示错误消息：如果你的应用程序需要实时的数据，或者你希望用户知道数据加载失败，你可以选择显示错误消息。这样，用户可以知道数据可能不准确或过时，并且可以选择刷新页面或者进行其他操作来尝试重新加载数据。）
               info.data = value.data
           }
       }
   })
   requestStream$.next(query$) // 每次发起请求前都会执行这个，所以就保证了每次拿的都是最后发起请求的数据。（每次请求都会产生新的query$，query$会在请求回来后吐出数据）
   ```

   

   

   请求开始前会先让`query$`吐出这个：

   ```js
               query$.next({
                   id,
                   url: clientParams.url,
                   variables: clientParams.variables,
                   requestReason: reason,
                   status: getStatus({ ...prevInfo, loading: true }, reason),
                   data: undefined,
                   loading: true,
                   error: undefined,
               })
   ```

   <mark>然后就使用createClient创建的query函数进行请求，query函数返回的是一个subject实例(详情见上面createClient)，订阅subject实例的next、error和complete做相应处理，吐出真实请求回来的数据。</mark>

5. 定义一个 `init` 函数，它订阅 `fetchQuery$`，并在 `fetchQuery$` 发出值时调用上面4说的 `fetch`。

6. 定义一个 `destroy` 函数，它取消订阅 `fetchQuery$` 并完成 `requestStream$`。

7. 定义一个 `fetchMore` 函数，它以 `RequestReason.fetchMore` 为原因且用用户传入的variables调用 `fetch`。

8. ```js
       return {
           info,
           init,
           refetch: () => { // 就用用户一开始配置的variables去发请求。
               return fetch(RequestReason.refetch, variables.value);
           },
           prefetch: () => {
               if (!skip.value) {
                   return fetch(RequestReason.setVariables, variables.value);
               }
           },
           fetchMore, // 调用这方法时用户可以传variable，用这个variables去发请求。
           destroy,
           onNext,
           requestReason,
           stream$
       };
   ```



第三步：

闭包的tempQueryList里push刚创建好的这个query对象。通过计算属性获取实时状态。

返回：

```js
    return {
        info: query.info,
        status,
        loading,
        error,
        data: data as Ref<T | undefined>,
        refetch: query.refetch,
        fetchMore: query.fetchMore,
        onNext: query.onNext,
        requestReason: query.requestReason,
        stream$: query.stream$
    };
```







#### **useRestMutation**



#### useModel

1. 往全局的store上添加这个model，如果有这个model了则直接返回，如果还没则存进去。`modelMap.set(constructor, storeModelInstance);`

2. storeModelInstance的数据结构：

   ```js
           const storeModelInstance: ModelInfo<T> = {
               constructor,
               instance: null,
               count: 0,
               queryList: [],
               scope: null,
           };
   ```

   

3. 如果storeModelInstance.count为0 则 在**effectScope**里执行model的creater方法，创建这个model存到storeModelInstance.instance上。

4. 每次使用useModel方法都会storeModelInstance.count++。

5. 挂载**onBeforeUnmount**和**onServerPrefetch**钩子。onBeforeUnmount里会storeModelInstance.count--，如果为0了就全面清除这个model。





### Q&A

- [x] 看看源码useModel是不是会做跟组件生命周期绑定的事情。 --- 就tm做了一个计数的逻辑。

- [x] loading的值一开始应该设为true？--- 目前是 loading是在请求发起前设为true，而你是想在**generateQueryOptions**（useRestQuery里的**createRestQuery**会执行这个方法）时初始化参数的时候就设为true，感觉也可以，但感觉差不多，应该都是一进来就loading的效果，不差那几毫秒吧。

- [x] varible不支持响应式 --- mutation的varible不支持响应式 ，query的支持

- [x] 为什么首页用了这个model，首页的任务列表也用到这个model，但我打开任务列表的时候不会发请求了。 --- 因为useModel里有计数，只有第一次使用的时候才会执行createModel里的方法，才会发请求。后续要么全部清空之后再use一遍(这种情况出来重载页面之外不会出现吧)，要么refetch或者fetchMore，才会再发请求。

- [x] model里全局拦截器添加【请求合并】用于兜底触发多次同个请求的情况(按钮加锁可以避免这个问题，【失败重传】，【取消请求】。测试过了浏览器不会做请求合并。静态资源不会再次发请求是因为走了缓存。

  【取消请求】原生方法就能做到：可以通过包一层fetch就行了，给fetch传入new AbortController().signal就行

  【失败重传】得改源码的**requestWithCache**方法里面catch的时候搞个重传，或者业务套一层，axios不也得套一层。

  【请求合并】其实确实应该让应用层去控制(通过防抖啥的)，万一你确实有发多个同样请求的情况呢(虽然很奇怪)，比如你一秒查一次后端数据是否更新了，那么你每秒发出去的请求其实就是同一个。

  

- [ ] cny里写了个base.model-utils使得有类型提示，看完源码后可以看看这个model-utils，主要是为了结合swagger吧

- [x] 从error到有data，这中间过程可能会导致白屏，这个有待复现。白屏跟model有啥关系

- [x] 一开始返回的是一个空数据，等接口回来了响应式变化，所以有的场景需要这个数据有值了再去做一些操作的时候只能通过watch这个响应式数据来知道这个数据必定有数了，而不是await 接口的形式，接口已经不能await了。比如：从home接口里拿参数透传给share接口(这个等home接口有数据可以通过配置skip完成)，然后页面上要先弹出share接口里的弹窗再弹出home接口里的弹窗。这时就只能监听share接口等share有数据了就先show share返回的弹窗，然后再show home接口里的弹窗。

- [x] 通过响应式触发发请求会不会存在不受控的情况，不存在吧，响应式数据什么时候改变你应该是清楚的呀。

- [x] 为啥没有持久化处理---不是没有，是没必要，用uselocalstorage就行了。pinia那个插件跟uselocalstorage的原理差不多。

- [x] apollo应该利用rxjs解决了快速切换tab的问题 --- 看useRestQuery标黄部分，核心是利用switchAll操作符，每次采用最新的observable，将最新的observable吐出的数据吐出。

- [x] <mark>apollo-model如果返回error那么不会修改data，所以第一次接口成功，第二次接口错误，那么此时页面展示的是第一次接口的数据。</mark>







## vuex

### 核心流程

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007124916616.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007124916616.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007124916616.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007124916616.png" loading="lazy"/>
  </picture>

**（1）核心流程中的主要功能：**

- Vue Components 是 vue 组件，组件会触发（dispatch）一些事件或动作，也就是图中的 Actions;
- 在组件中发出的动作，肯定是想获取或者改变数据的，但是在 vuex 中，数据是集中管理的，不能直接去更改数据，所以会把这个动作提交（Commit）到 Mutations 中;
- 然后 Mutations 就去改变（Mutate）State 中的数据;
- 当 State 中的数据被改变之后，就会重新渲染（Render）到 Vue Components 中去，组件展示更新后的数据，完成一个流程。



**（2）各模块在核心流程中的主要功能：**

- `Vue Components`∶ Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- `dispatch`∶操作行为触发方法，是唯一能执行action的方法。
- `actions`∶ 操作行为处理模块。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。
- `commit`∶状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- `mutations`∶状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。
- `state`∶ 页面状态管理容器对象。集中存储Vuecomponents中data对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。
- `getters`∶ state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。



### Vuex  页面刷新数据丢失

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中





### Vuex中action和mutation的区别

mutation中的操作是一系列的同步函数，用于修改state中的变量的的状态。当使用vuex时需要通过commit来提交需要操作的内容。每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++      // 变更状态
    }
  }
})
```

当触发一个类型为 increment 的 mutation 时，需要调用此函数：

```javascript
store.commit('increment')
```

而Action类似于mutation，不同点在于：

- Action 可以包含任意异步操作。
- Action 提交的是 mutation，而不是直接变更状态。

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

所以，两者的不同点如下：

- Mutation专注于修改State，理论上是修改State的唯一途径；Action业务代码、异步请求。
- Mutation：必须同步执行；Action：可以异步，但不能直接操作State。
- 在视图更新时，先触发actions，actions再触发mutation
- mutation的参数是state，它包含store中的数据；store的参数是context，它是 state 的父级，包含 state、getters



### 4. Redux 和 Vuex 有什么区别，它们的共同思想

**（1）Redux 和 Vuex区别**

- Vuex改进了Redux中的Action和Reducer函数，以mutations变化函数取代Reducer，无需switch，只需在对应的mutation函数里改变state值即可
- Vuex由于Vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的State即可
- Vuex数据流的顺序是∶View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变（vue检测到数据变化自动渲染）



通俗点理解就是，vuex 弱化 dispatch，通过commit进行 store状态的一次更变;取消了action概念，不必传入特定的 action形式进行指定变更;弱化reducer，基于commit参数直接对数据进行转变，使得框架更加简易; 



**（2）共同思想**

- 单—的数据源 
- 变化可以预测



本质上：redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案;

形式上：vuex借鉴了redux，将store作为全局的数据中心，进行mode管理;



### 6. Vuex有哪几种属性？

有五种，分别是 State、 Getter、Mutation 、Action、 Module

- state => 基本数据(数据源存放地)
- getters => 从基本数据派生出来的数据
- mutations => 提交更改数据的方法，同步
- actions => 像一个装饰器，包裹mutations，使之可以异步。
- modules => 模块化Vuex



### 8. 为什么 Vuex 的 mutation 中不能做异步操作？

- Vuex中所有的状态更新的唯一途径都是mutation，异步操作通过 Action 来提交 mutation实现，这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。
- 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现 time-travel 了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

### 9. Vuex的严格模式是什么,有什么作用，如何开启？

在严格模式下，无论何时发生了状态变更且不是由mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。



在Vuex.Store 构造器选项中开启,如下

```plain
const store = new Vuex.Store({
    strict:true,
})
```

### 10. 如何在组件中批量使用Vuex的getter属性

使用mapGetters辅助函数, 利用对象展开运算符将getter混入computed 对象中

```javascript
import {mapGetters} from 'vuex'
export default{
    computed:{
        ...mapGetters(['total','discountTotal'])
    }
}
```

### 11. 如何在组件中重复使用Vuex的mutation

使用mapMutations辅助函数,在组件中这么使用

```javascript
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
```

然后调用`this.setNumber(10)`相当调用`this.$store.commit('SET_NUMBER',10)`







### vuex的module

单独一个store对象会过于庞大臃肿，通过模块方式可以拆分开来便于维护

可以按之前规则单独编写子模块代码，然后在主文件中通过`modules`选项组织起来：`createStore({modules:{...}})`

不过使用时要注意访问子模块状态时需要加上注册时模块名：`store.state.a.xxx`，但同时`getters`、`mutations`和`actions`又在全局空间中，使用方式和之前一样。如果要做到完全拆分，需要在子模块加上`namespace`选项，此时再访问它们就要加上命名空间前缀。

很显然，模块的方式可以拆分代码，但是缺点也很明显，就是使用起来比较繁琐复杂，容易出错。而且类型系统支持很差，不能给我们带来帮助




### 监听vuex数据的变化

我知道几种方法：

- 可以通过watch选项或者watch方法监听状态
- 可以使用vuex提供的API：store.subscribe()

watch选项方式，可以以字符串形式监听`$store.state.xx`；subscribe方式，可以调用store.subscribe(cb),回调函数接收mutation对象和state对象，这样可以进一步判断mutation.type是否是期待的那个，从而进一步做后续处理。

watch方式简单好用，且能获取变化前后值，首选；subscribe方法会被所有commit行为触发，因此还需要判断mutation.type，用起来略繁琐，一般用于vuex插件中。



watch方式

```js
const app = createApp({
    watch: {
      '$store.state.counter'() {
        console.log('counter change!');
      }
    }
  })

```

subscribe方式：

```javascript
  store.subscribe((mutation, state) => {
    if (mutation.type === 'add') {
      console.log('counter change in subscribe()!');
    }
  })
```

### vuex有什么缺点

vuex利用响应式，使用起来已经相当方便快捷了。但是在使用过程中感觉模块化这一块做的过于复杂，用的时候容易出错，还要经常查看文档

比如：访问state时要带上模块key，内嵌模块的话会很长，不得不配合mapState使用，加不加namespaced区别也很大，getters，mutations，actions这些默认是全局，加上之后必须用字符串类型的path来匹配，使用模式不统一，容易出错；对ts的支持也不友好，在使用模块时没有代码提示。

之前Vue2项目中用过[vuex-module-decorators](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fchampionswimmer%2Fvuex-module-decorators)的解决方案，虽然类型支持上有所改善，但又要学一套新东西，增加了学习成本。pinia出现之后使用体验好了很多，Vue3 + pinia会是更好的组合。





#  Composition API

## setup语法糖

> 组件的名字会自动以文件名为主



### `script setup`



<mark>`<script setup>` 组件默认是封闭的</mark>，也就是说` <script setup>` 作用域内的变量不会暴露给父组件，除非通过 defineExpose 明确地暴露出去。注意暴露出去的属性会被解包，即失去响应式。



### 报错：需要在setup里执行

为啥写在computed里面的函数就不是setup里面执行呢？深入点问 什么才叫在setup里面执行？所谓在setup里执行只是为了获得当前组件实例**getCurrentInstance**，所以获取不到组件实例的时候就说不在setup里执行，而<mark>源码里执行setup函数前会给currentInstance里赋值，执行完setup后getCurrentInstance就会变为null</mark>，所以computed的依赖执行的时候是没有当前实例的。

如果获取不到currentInstance，所以一般都是那些需要获取实例的函数都需要在setup中执行，比如inject。





### setup的两个注意点

- setup执行的时机
  - 在beforeCreate之前执行一次，this是undefined。
- setup的参数
  - props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性。
  - context：上下文对象
    - attrs: 值为对象，包含：组件外部传递过来，但没有在props配置中声明的属性, 相当于 ```this.$attrs```。
    - slots: 收到的插槽内容, 相当于 ```this.$slots```。
    - emit: 分发自定义事件的函数, 相当于 ```this.$emit```。







## Refs

###  ref函数

Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如 `Map`。

Ref 会使它的值具有深层响应性。

非原始值将通过 [`reactive()`](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive) 转换为响应式代理。

也可以通过 [shallow ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 来放弃深层响应性。对于浅层 ref，只有 `.value` 的访问会被追踪。

在模板渲染上下文中，只有顶级的 ref 属性才会被解包。在下面的例子中，`count` 和 `object` 是顶级属性，但 `object.id` 不是：

```js
const count = ref(0)
const object = { id: ref(0) } //即模版中{{object.id}}这样写不会自动解包
```





### `unref`

如果参数是一个 [`ref`](https://v3.cn.vuejs.org/api/refs-api.html#ref)，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 的语法糖函数。



### toRef

- 作用：创建一个 ref 对象，其value值指向你指定的对象中的某个属性。
- 语法：```const name = toRef(person,'name')```
- 应用:   要将响应式对象中的某个属性单独提供给外部使用时。


- 扩展：```toRefs``` 与```toRef```功能一致，但可以批量创建多个 ref 对象，语法：```toRefs(person)```，就是person这个对象里面有多少个属性全给你分别创建成ref对象出来。

  

### `toRefs`

`const stateAsRefs = toRefs(state)`

内部原理就是遍历这个引用类型，对引用类型里的每一个属性都调用toRef函数



### `isRef`

检查值是否为一个 ref 对象。



### customRef

- 作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 `track` 和 `trigger` 函数作为参数，并且应该返回一个带有 `get` 和 `set` 的对象。

- 比如实现防抖效果：

  ```vue
  <template>
  	<input type="text" v-model="keyword">
  	<h3>{{keyword}}</h3>
  </template>
  
  <script>
  	import {ref,customRef} from 'vue'
  	export default {
  		name:'Demo',
  		setup(){
  			// let keyword = ref('hello') //使用Vue准备好的内置ref
  			//自定义一个myRef
  			function myRef(value,delay){
  				let timer
  				//通过customRef去实现自定义
  				return customRef((track,trigger)=>{
  					return{
  						get(){
  							track() //告诉Vue这个value值是需要被“追踪”的
  							return value
  						},
  						set(newValue){
  							clearTimeout(timer)
  							timer = setTimeout(()=>{
  								value = newValue
  								trigger() //告诉Vue去更新界面
  							},delay)
  						}
  					}
  				})
  			}
  			let keyword = myRef('hello',500) //使用程序员自定义的ref
  			return {
  				keyword
  			}
  		}
  	}
  </script>
  ```

  

###  shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。

- 什么时候使用?
  -  如果有一个对象数据，结构比较深, 但变化时只是第一层属性变化 ===> shallowReactive。
  -  如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换它 ===> shallowRef。

### `triggerRef`

手动执行与 [`shallowRef`](https://v3.cn.vuejs.org/api/refs-api.html#shallowref) 关联的任何作用 (effect)。

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 记录 "Hello, universe"
triggerRef(shallow)
```

## 响应性基础API

### 响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理。*即使该对象先被reactive包裹了一层然后再被readonly包裹了一层也能被监测出是reactive。*
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建



### reactive函数

- 与将内部值包装在特殊对象中的 ref 不同，`reactive()` 将使对象本身具有响应性，跟踪属性访问。

- reactive定义的响应式数据是“深层次的”。响应式对象内的嵌套对象依然是代理。

  ```js
  const proxy = reactive({})
  const raw = {}
  proxy.nested = raw
  console.log(proxy.nested === raw) // false
  ```

- 对同一个原始对象调用 `reactive()` 会总是返回同样的代理对象，而对一个已存在的代理对象调用 `reactive()` 会返回其本身

- 解构后就不是响应式了（因为解构其实就是新声明了一个变量然后赋值给他）


解包:

当将 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 分配给 `reactive` property 时，`reactive` 将解包所有深层的 [refs](https://v3.cn.vuejs.org/api/refs-api.html#ref)，同时维持 ref 的响应性。

```ts
const count = ref(1)
const obj = reactive({ count })
// 如果是 const obj = reactive([ref(1),2,3])，数组形式的话就不会解包！

// ref 会被解包
console.log(obj.count === count.value) // true /*************/

// 它会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 它也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为[浅层响应式对象](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)的属性被访问时不会解包。

当 ref 作为响应式数组或原生集合类型(如 `Map`) <font color="red">中</font>的元素被访问时，它**不会**被解包：

```
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```





### `shallowReactive`

创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的性质是响应式的
state.foo++
// ...但是不转换嵌套对象
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```

与 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 不同，任何使用 [`ref`](https://v3.cn.vuejs.org/api/refs-api.html#ref) 的 property 都**不会**被代理自动解包。



### `readonly`

接受一个对象 (响应式或纯对象) 或 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 并返回原始对象的==只读代理==。只读代理是深层的：任何被访问的嵌套 property 也是只读的。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 用于响应性追踪
  console.log(copy.count)
})

// 变更 original 会触发依赖于副本的侦听器
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
```



与 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 一样，如果任何 property 使用了 `ref`，当它通过代理访问时，则被自动解包：

```js
const raw = {
  count: ref(123)
}

const copy = readonly(raw)

console.log(raw.count.value) // 123
console.log(copy.count) // 123
```



### `shallowReadonly`

创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的 property 将失败
state.foo++
// ...但适用于嵌套对象
isReadonly(state.nested) // false
state.nested.bar++ // 适用
```

与 [`readonly`](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly) 不同，任何使用 [`ref`](https://v3.cn.vuejs.org/api/refs-api.html#ref) 的 property 都**不会**被代理自动解包。

### toRaw 与 markRaw

- toRaw：

  - 作用：将一个由```reactive```或 [`readonly`](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly) 代理的<strong style="color:orange">响应式对象</strong>转为<strong style="color:orange">普通对象</strong>。
  - 使用场景：可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。**不**建议保留对原始对象的持久引用。

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)
  
  console.log(toRaw(reactiveFoo) === foo) // true
  ```

- markRaw：

  - 作用：标记一个对象，使其永远不会再成为响应式对象（浅的）。
  - 应用场景:
    1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
    2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false
  
  // 嵌套在其他响应式对象中时也可以使用
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

这可能会导致**同一性风险**——即执行一个依赖于对象本身的操作，但同时使用同一对象的原始版本和被代理后的版本：

```js
const foo = markRaw({
  nested: {}
})

const bar = reactive({
  // 虽然 `foo` 被标记为原始，但 foo.nested 不是。
  nested: foo.nested
})

console.log(foo.nested === bar.nested) // false
```







## 计算属性

### 概念

`computed()` 方法期望接收一个 getter 函数，返回值为一个**计算属性 ref**。

监听data中数据的变化，并return一个计算后的新值。计算属性会缓存计算的结果，只有计算属性的依赖项发生变化时，才会重新进行运算。

### 使用

接受一个 getter 函数，并根据 getter 的返回值返回一个不可变的响应式 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

或者，接受一个具有 `get` 和 `set` 函数的对象，用来创建可写的 ref 对象。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```



### 跟方法调用的区别

我们在表达式中像这样调用一个函数也会获得和计算属性相同的结果：

```template
<p>{{ calculateBooksMessage() }}</p>
```

```js
// 组件中
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

若我们将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，不同之处在于**计算属性值会基于其响应式依赖被缓存**。一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 `author.books` 不改变，无论多少次访问 `publishedBooksMessage` 都会立即返回先前的计算结果，而不用重复执行 getter 函数。

这也解释了为什么下面的计算属性永远不会更新，因为 `Date.now()` 并不是一个响应式依赖：

```
const now = computed(() => Date.now())
```

相比之下，方法调用**总是**会在重渲染发生时再次执行函数。



### **类型声明：**

```ts
// 只读的
function computed<T>(
  getter: () => T,
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```



### 最佳实践[](https://cn.vuejs.org/guide/essentials/computed.html#best-practices)

#### [Getter 不应有副作用](https://cn.vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free)

计算属性的 getter 应只做计算而没有任何其他的副作用。举例来说，**不要在 getter 中做异步请求或者更改 DOM**！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。

#### [避免直接修改计算属性值](https://cn.vuejs.org/guide/essentials/computed.html#avoid-mutating-computed-value)

从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。





## 监听器watch

### 简介

监视数据的变化从而针对数据的变化做特定的操作



### watch函数

```js
//情况一：监视ref定义的响应式数据
watch(sum,(newValue,oldValue)=>{
	console.log('sum变化了',newValue,oldValue)
},{immediate:true})

//情况二：监视多个ref定义的响应式数据
watch([sum,msg],(newValue,oldValue)=>{
	console.log('sum或msg变化了',newValue,oldValue)
}) 

/* 情况三：监视reactive定义的响应式数据
			若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！(凡是监视对象都获取不到oldValue)。除非source这样写：() => _.cloneDeep(state),
*/
watch(person,(newValue,oldValue)=>{ //这种写法的话一定是深度监控的
	console.log('person变化了',newValue,oldValue)
},{immediate:true,deep:false}) //此处的deep配置不再奏效

watch(()=>person,(newValue,oldValue)=>{ //写成函数就可以摆脱深度监控
	console.log('person变化了',newValue,oldValue)
},{immediate:true,deep:false}) //此处的deep配置会奏效


//情况四
watch(()=>person.job,(newValue,oldValue)=>{//监视reactive定义的响应式数据中的某个属性,监视对象的时候就要写成箭头函数的形式。
    console.log('person的job变化了',newValue,oldValue)
},{immediate:true,deep:true}) //此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效


//情况五：监视reactive定义的响应式数据中的某些属性
watch([()=>person.job,()=>person.name],(newValue,oldValue)=>{
	console.log('person的job变化了',newValue,oldValue)
},{immediate:true,deep:true})

```

### watchEffect函数

[六个示例讲解watchEffect函数](https://blog.csdn.net/gdutRex/article/details/121600893)

1. `watchEffect`立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。`watch`侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数。

2. `watchEffect(effect)`是一种特殊`watch`，传入的函数既是依赖收集的数据源，也是回调函数。如果我们不关心响应式数据变化前后的值，只是想拿这些数据做些事情，那么`watchEffect`就是我们需要的。watch更底层，可以接收多种数据源，包括用于依赖收集的getter函数，因此它完全可以实现watchEffect的功能，同时由于可以指定getter函数，依赖可以控制的更精确，还能获取数据变化前后的值，因此如果需要这些时我们会使用watch。

3. `watchEffect`在使用时，传入的函数会立刻执行一次。`watch`默认情况下并不会执行回调函数，除非我们手动设置`immediate`选项。

4. 从实现上来说，`watchEffect(fn)`相当于`watch(fn,fn,{immediate:true})`




- watch的套路是：既要指明监视的属性，也要指明监视的回调。

- watchEffect的套路是：立即执行传入的一个函数，不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性。

- `watch` 与 [`watchEffect`](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watcheffect)共享[停止侦听](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#停止侦听)，[清除副作用](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#清除副作用) (相应地 `onInvalidate` 会作为回调的第三个参数传入)、[副作用刷新时机](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#副作用刷新时机)（pre和post是微任务，sync是同步）和[侦听器调试](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#侦听器调试)行为。

- watchEffect有点像computed：

  - 但computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
  - 而watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值。

  ```js
  //watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
  watchEffect(()=>{
      const x1 = sum.value
      const x2 = person.age
      console.log('watchEffect配置的回调执行了')
  })
  ```



### watchPostEffect

`watchEffect` 的别名，带有 `flush: 'post'` 选项。



### watchSyncEffect

`watchEffect` 的别名，带有 `flush: 'sync'` 选项。





### Computed 和 Watch 的区别

**对于Computed：**

- 它支持缓存，只有依赖的数据真的发生了变化，才会重新计算
- 不支持异步，当Computed中有异步操作时，无法监听数据的变化

**对于Watch：**

- 它不支持缓存，数据变化时，它就会触发相应的操作
- 支持异步监听













## provide / inject

### provide()

提供一个值，可以被后代组件注入。

- **类型**

  ts

  ```
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **详细信息**

  `provide()` 接受两个参数：第一个参数是要注入的 key，可以是一个字符串或者一个 symbol，第二个参数是要注入的值。





### inject()[#](https://cn.vuejs.org/api/composition-api-dependency-injection.html#inject)

注入一个由祖先组件或整个应用 (通过 `app.provide()`) 提供的值。

- **类型**

  ts

  ```ts
  // 没有默认值
  function inject<T>(key: InjectionKey<T> | string): T | undefined
  
  // 带有默认值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
  
  // 使用工厂函数
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **详细信息**

  第一个参数是注入的 key。Vue 会遍历父组件链，通过匹配 key 来确定所提供的值。如果父组件链上多个组件对同一个 key 提供了值，那么离得更近的组件将会“覆盖”链上更远的组件所提供的值。如果没有能通过 key 匹配到值，`inject()` 将返回 `undefined`，除非提供了一个默认值。

  第二个参数是可选的，即在没有匹配到 key 时使用的默认值。它也可以是一个工厂函数，用来返回某些创建起来比较复杂的值。如果默认值本身就是一个函数，那么你必须将 `false` 作为第三个参数传入，表明这个函数就是默认值，而不是一个工厂函数。







# 通用API

## createApp()

### Create app with same appContext

使用createApp新创建的app继承原来的app的上下文。

解法:https://github.com/vuejs/core/issues/2097 里这位仁兄infinite-system的解答。

```js
 const childApp = createApp()
 Object.assign(childApp._context, app._context)
// or 
// Object.assign(childApp._context, componentInstance.appContext)
 childApp.mount('#app')
```



### 返回值的类型定义

`createApp` 方法返回的是一个 [`App`](packages/runtime-core/src/apiCreateApp.ts#L30-L79) 类型的对象。这个对象包含了一些方法，如 `use`、`mixin`、`component`、`directive`、`mount`、`unmount` 和 `provide`，以及一些属性，如 `version` 和 `config`。

这是 [`App`](packages/runtime-core/src/apiCreateApp.ts#L30-L79) 类型的定义：

``` typescript
export interface App<HostElement = any> {
  version: string
  config: AppConfig

  use<Options extends unknown[]>(
    plugin: Plugin<Options>,
    ...options: Options
  ): this
  use<Options>(plugin: Plugin<Options>, options: Options): this

  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined
  component(name: string, component: Component): this
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean,
    isSVG?: boolean
  ): ComponentPublicInstance
  unmount(): void
  provide<T>(key: InjectionKey<T> | string, value: T): this

  /**
   * Runs a function with the app as active instance. This allows using of `inject()` within the function to get access
   * to variables provided via `app.provide()`.
   *
   * @param fn - function to run with the app as active instance
   */
  runWithContext<T>(fn: () => T): T

  // internal, but we need to expose these for the server-renderer and devtools
  _uid: number
  _component: ConcreteComponent
  _props: Data | null
  _container: HostElement | null
  _context: AppContext
  _instance: ComponentInternalInstance | null

  /**
   * v2 compat only
   */
  filter?(name: string): Function | undefined
  filter?(name: string, filter: Function): this

  /**
   * @internal v3 compat only
   */
  _createRoot?(options: ComponentOptions): ComponentPublicInstance
}
```





## nextTick()[#](https://cn.vuejs.org/api/general.html#nexttick)

等待下一次 DOM 更新刷新的工具方法。

- **类型**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **详细信息**

  当你在 Vue 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 Vue 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

  `nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。

- 示例

  ```vue
  <script>
  import { nextTick } from 'vue'
  
  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++
  
        // DOM 还未更新
        console.log(document.getElementById('counter').textContent) // 0
  
        await nextTick()
        // DOM 此时已经更新
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>
  
  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  
  ```

在以下情况下，会用到nextTick：

- 在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的DOM结构的时候，这个操作就需要方法在`nextTick()`的回调函数中。
- 在vue生命周期中，如果在created()钩子进行DOM操作，也一定要放在`nextTick()`的回调函数中。因为在created()钩子函数中，页面的DOM还未渲染，这时候也没办法操作DOM，所以，此时如果想要操作DOM，必须将操作的代码放在`nextTick()`的回调函数中。



## extends[#](https://cn.vuejs.org/api/options-composition.html#extends)

要继承的“基类”组件。

- **类型**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **详细信息**

  使一个组件可以继承另一个组件的组件选项。

  从实现角度来看，`extends` 几乎和 `mixins` 相同。

  然而，`extends` 和 `mixins` 表达的是不同的目标。`mixins` 选项基本用于组合功能，而 `extends` 则一般更关注继承关系。

  合并策略：<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007072903742.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007072903742.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007072903742.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221007072903742.png" loading="lazy"/>
  </picture>

  

- **示例：**

  ```ts
  const CompA = { ... }
  
  const CompB = {
    extends: CompA,
    ...
  }
  ```







## defineAsyncComponent()

可用于配合import()实现懒加载组件：

```js
const AwardPopup = defineAsyncComponent(() => import('../components/popups-index/AwardPopup.vue'));
```







## 组件实例

### 获取组件实例

#### ref

我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 `ref` attribute(属性)。

关于 ref 注册时机的重要说明：因为 ref 本身是作为渲染函数的结果来创建的，必须等待组件挂载后才能对它进行访问。

```vue
<template>
	<div ref="testRef"></div>
</template>
<script setup>
const testRef = ref<HTMLElement>()
// 注意用的时候是：testRef.value。  注意⚠️只有mounted之后才有值
console.log(testRef.value) // 输出undefined
onMounted(()=>console.log(testRef.value)) // 输出ComponentPublicInstance类型的实例
import HelloWorld from './components/HelloWorld.vue';

const helloWorldRef = ref<null | InstanceType<typeof HelloWorld>>(null);
const divRef = ref<null | HTMLDivElement>(null);

// Vue 2 only, use in v-for element
const listRef = ref<Array<HTMLLIElement>>([]);
</script>
```



#### getCurrentInstance

##### 使用

可通过 getCurrentInstance 获取当前实例，`getCurrentInstance` 只能在 `setup` 函数或生命周期钩子函数中使用。在这些地方，Vue 会自动设置 `currentInstance`。在其他地方使用 `getCurrentInstance` 可能会返回 `null` 或错误的实例。

```js
import { onMounted, getCurrentInstance } from 'vue'
export default {
	data () {
		return {
			x: 1
		}
	},
	setup () {
		// 这里打印出来undefined，setup里面没有this
		console.log(this)
		onMounted (() => {
			// 这里就能打印出来1啦
			console.log(instance.data.x)
		})
		const instance = getCurrentInstance()
		// 这里打印出来是 undefined，因为 setup 声明周期是 beforeCreated 和 created 合并的，这时候 data 还没有初始化，所以我们要在 onMounted 里打印。
		console.log(instance.data.x)
	}
}
```



##### 返回的实例的属性定义

ComponentPublicInstance 是暴露给用户的公开实例，它是用户在模板或 JSX 中通过 `this` 访问的对象<mark>（ref获得的实例就是这个类型）。可以通过`$`属性获取对应的ComponentInternalInstance。</mark>

ComponentInternalInstance 是 Vue 内部使用的实例，它包含了更多的内部状态和方法。这个实例不会直接暴露给用户，但是用户可以<mark>通过 `getCurrentInstance` 函数在 `setup` 函数或生命周期钩子函数中获取到它。然后用户可以通过 `proxy` 属性来获取对应的 `ComponentPublicInstance`。</mark>

```ts
// 源码
/* We expose a subset of properties on the internal instance as they are useful for advanced external libraries and tools.*/
export interface ComponentInternalInstance {
  uid: number
  type: ConcreteComponent
  parent: ComponentInternalInstance | null
  root: ComponentInternalInstance
  appContext: AppContext // 应用实例的上下文
  /**
   * Vnode representing this component in its parent's vdom tree
   */
  vnode: VNode
  /**
   * The pending new vnode from parent updates
   * @internal
   */
  next: VNode | null
  /**
   * Root vnode of this component's own vdom tree
   */
  subTree: VNode
  /**
   * Render effect instance
   */
  effect: ReactiveEffect
  /**
   * Bound effect runner to be passed to schedulers
   */
  update: SchedulerJob
  /**
   * The render function that returns vdom tree.
   * @internal
   */
  render: InternalRenderFunction | null
  /**
   * SSR render function
   * @internal
   */
  ssrRender?: Function | null
  /**
   * Object containing values this component provides for its descendants
   * @internal
   */
  provides: Data
  /**
   * Tracking reactive effects (e.g. watchers) associated with this component
   * so that they can be automatically stopped on component unmount
   * @internal
   */
  scope: EffectScope
  /**
   * cache for proxy access type to avoid hasOwnProperty calls
   * @internal
   */
  accessCache: Data | null
  /**
   * cache for render function values that rely on _ctx but won't need updates
   * after initialized (e.g. inline handlers)
   * @internal
   */
  renderCache: (Function | VNode)[]

  /**
   * Resolved component registry, only for components with mixins or extends
   * @internal
   */
  components: Record<string, ConcreteComponent> | null
  /**
   * Resolved directive registry, only for components with mixins or extends
   * @internal
   */
  directives: Record<string, Directive> | null
  /**
   * Resolved filters registry, v2 compat only
   * @internal
   */
  filters?: Record<string, Function>
  /**
   * resolved props options
   * @internal
   */
  propsOptions: NormalizedPropsOptions
  /**
   * resolved emits options
   * @internal
   */
  emitsOptions: ObjectEmitsOptions | null
  /**
   * resolved inheritAttrs options
   * @internal
   */
  inheritAttrs?: boolean
  /**
   * is custom element?
   * @internal
   */
  isCE?: boolean
  /**
   * custom element specific HMR method
   * @internal
   */
  ceReload?: (newStyles?: string[]) => void

  // the rest are only for stateful components ---------------------------------

  // main proxy that serves as the public instance (`this`)
  proxy: ComponentPublicInstance | null

  // exposed properties via expose()
  exposed: Record<string, any> | null
  exposeProxy: Record<string, any> | null

  /**
   * alternative proxy used only for runtime-compiled render functions using
   * `with` block
   * @internal
   */
  withProxy: ComponentPublicInstance | null
  /**
   * This is the target for the public instance proxy. It also holds properties
   * injected by user options (computed, methods etc.) and user-attached
   * custom properties (via `this.x = ...`)
   * @internal
   */
  ctx: Data

  // state
  data: Data
  props: Data
  attrs: Data
  slots: InternalSlots
  refs: Data
  emit: EmitFn

  attrsProxy: Data | null
  slotsProxy: Slots | null

  /**
   * used for keeping track of .once event handlers on components
   * @internal
   */
  emitted: Record<string, boolean> | null
  /**
   * used for caching the value returned from props default factory functions to
   * avoid unnecessary watcher trigger
   * @internal
   */
  propsDefaults: Data
  /**
   * setup related
   * @internal
   */
  setupState: Data
  /**
   * devtools access to additional info
   * @internal
   */
  devtoolsRawSetupState?: any
  /**
   * @internal
   */
  setupContext: SetupContext | null

  /**
   * suspense related
   * @internal
   */
  suspense: SuspenseBoundary | null
  /**
   * suspense pending batch id
   * @internal
   */
  suspenseId: number
  /**
   * @internal
   */
  asyncDep: Promise<any> | null
  /**
   * @internal
   */
  asyncResolved: boolean

  // lifecycle
  isMounted: boolean
  isUnmounted: boolean
  isDeactivated: boolean
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.CREATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.MOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UPDATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.SERVER_PREFETCH]: LifecycleHook<() => Promise<unknown>>

  /**
   * For caching bound $forceUpdate on public proxy access
   * @internal
   */
  f?: () => void
  /**
   * For caching bound $nextTick on public proxy access
   * @internal
   */
  n?: () => Promise<void>
  /**
   * `updateTeleportCssVars`
   * For updating css vars on contained teleports
   * @internal
   */
  ut?: (vars?: Record<string, string>) => void
}
```

```ts
// 源码
// public properties exposed on the proxy, which is used as the render context
// in templates (as `this` in the render option)
export type ComponentPublicInstance<
  P = {}, // props type extracted from props option
  B = {}, // raw bindings returned from setup()
  D = {}, // return from data()
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  E extends EmitsOptions = {},
  PublicProps = P,
  Defaults = {},
  MakeDefaultsOptional extends boolean = false,
  Options = ComponentOptionsBase<any, any, any, any, any, any, any, any, any>,
  I extends ComponentInjectOptions = {},
  S extends SlotsType = {}
> = {
  $: ComponentInternalInstance
  $data: D
  $props: Prettify<
    MakeDefaultsOptional extends true
      ? Partial<Defaults> & Omit<P & PublicProps, keyof Defaults>
      : P & PublicProps
  >
  $attrs: Data
  $refs: Data
  $slots: UnwrapSlotsType<S>
  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $emit: EmitFn<E>
  $el: any
  $options: Options & MergedComponentOptionsOverride
  $forceUpdate: () => void
  $nextTick: typeof nextTick
  $watch<T extends string | ((...args: any) => any)>(
    source: T,
    cb: T extends (...args: any) => infer R
      ? (...args: [R, R]) => any
      : (...args: any) => any,
    options?: WatchOptions
  ): WatchStopHandle
} & P &
  ShallowUnwrapRef<B> &
  UnwrapNestedRefs<D> &
  ExtractComputedReturns<C> &
  M &
  ComponentCustomProperties &
  InjectToObject<I>
```







### 实例属性(vue2)

[所有组件实例属性见此](https://cn.vuejs.org/api/component-instance.html)

#### $attrs

我们可能会有一些属性和事件没有在props中定义，这类称为非属性特性，结合v-bind指令可以直接透传给内部的子组件。

这类“属性透传”常常用于包装高阶组件时往内部传递属性，常用于爷孙组件之间传参。比如我在扩展A组件时创建了组件B组件，然后在C组件中使用B，此时传递给C的属性中只有props里面声明的属性是给B使用的，其他的都是A需要的，此时就可以利用v-bind="$attrs"透传下去。

最常见用法是结合v-bind做展开；$attrs本身不是响应式的，除非访问的属性本身是响应式对象。

vue2中使用listeners获取事件，vue3中已移除，均合并到listeners获取事件。











#   内置组件

## Fragment

- 在Vue2中: 组件必须有一个根标签
- 在Vue3中: 组件可以没有根标签, 内部会将多个标签包含在一个Fragment虚拟元素中
- 好处: 减少标签层级, 减小内存占用





## 动态组件`<component>`



<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170642044.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170642044.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170642044.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170642044.png" loading="lazy"/>
  </picture>

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170835355.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170835355.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170835355.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170835355.png" loading="lazy"/>
  </picture>



<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170849842.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170849842.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170849842.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/vue/theory/image-20220511170849842.png" loading="lazy"/>
  </picture>





## `<KeepAlive>`[#](https://cn.vuejs.org/api/built-in-components.html#keepalive)

缓存包裹在其中的动态切换组件。

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * 如果指定，则只有与 `include` 名称
     * 匹配的组件才会被缓存。
     */
    include?: MatchPattern
    /**
     * 任何名称与 `exclude`
     * 匹配的组件都不会被缓存。
     */
    exclude?: MatchPattern
    /**
     * 最多可以缓存多少组件实例。 LRU（Least rencently used）缓存策略∶ 从内存中找出最久未使用的数据并置换新的数据。详细算法实现如下∶ 
          ● 新数据插入到链表头部
          ● 每当缓存命中（即缓存数据被访问），则将数据移到链表头部
          ● 链表满的时候，将链表尾部的数据丢弃。
     */
    max?: number | string
  }
  
  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **详细信息**

  `<KeepAlive>` 包裹动态组件时，会缓存不活跃的组件实例，而不是销毁它们。

  任何时候都只能有一个活跃组件实例作为 `<KeepAlive>` 的直接子节点。

  当一个组件在 `<KeepAlive>` 中被切换时，它的 `activated` 和 `deactivated` 生命周期钩子将被调用，用来替代 `mounted` 和 `unmounted`。这适用于 `<KeepAlive>` 的直接子节点及其所有子孙节点。



1. 结合属性include和exclude可以明确指定缓存哪些组件或排除缓存指定组件。vue3中结合vue-router时变化较大，之前是`keep-alive`包裹`router-view`，现在需要反过来用`router-view`包裹`keep-alive`：

   ```vue
   <router-view v-slot="{ Component }">
     <keep-alive>
       <component :is="Component"></component>
     </keep-alive>
   </router-view>
   ```

2. 缓存后如果要获取数据，解决方案可以有以下两种：

- beforeRouteEnter：在有vue-router的项目，每次进入路由的时候，都会执行`beforeRouteEnter`

  ```js
  beforeRouteEnter(to, from, next){
    next(vm=>{
      console.log(vm)
      // 每次进入路由执行
      vm.getData()  // 获取数据
    })
  },
  ```

- actived：在`keep-alive`缓存的组件被激活的时候，都会执行`actived`钩子

  ```js
  activated(){
  	  this.getData() // 获取数据
  },
  ```



3. keep-alive是一个通用组件，它内部定义了一个map，缓存创建过的组件实例，它返回的渲染函数内部会查找内嵌的component组件对应组件的vnode，如果该组件在map中存在就直接返回它。由于component的is属性是个响应式数据，因此只要它变化，keep-alive的render函数就会重新执行。







## Teleport

- 什么是Teleport？—— `Teleport` 是一种能够将我们的<strong style="color:#DD5145">组件html结构</strong>移动到指定位置的技术。

  ```vue
  <teleport to="移动位置">
  	<div v-if="isShow" class="mask">
  		<div class="dialog">
  			<h3>我是一个弹窗</h3>
  			<button @click="isShow = false">关闭弹窗</button>
  		</div>
  	</div>
  </teleport>
  ```

## Suspense

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验

- 使用步骤：

  - 异步引入组件

    ```js
    import {defineAsyncComponent} from 'vue'
    const Child = defineAsyncComponent(()=>import('./components/Child.vue'))
    ```

  - 使用```Suspense```包裹组件，并配置好```default``` 与 ```fallback```

    ```vue
    <template>
    	<div class="app">
    		<h3>我是App组件</h3>
    		<Suspense>
    			<template v-slot:default>
    				<Child/>
    			</template>
    			<template v-slot:fallback>
    				<h3>加载中.....</h3>
    			</template>
    		</Suspense>
    	</div>
    </template>
    ```





## 过渡与动画

1. 作用：在插入、更新或移除 DOM元素时，在合适的时候给元素添加样式类名。

2. 可以使用第三方库来用一些写好的动画。（详情操作视频见https://www.bilibili.com/video/BV1Zy4y1K7SH?p=94）

3. 图示：

   <picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20210927203309437.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20210927203309437.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20210927203309437.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20210927203309437.png" loading="lazy"/>
  </picture>

4. 写法：

   1. 准备好样式：

      - 元素进入的样式：
        1. v-enter：进入的起点
        2. v-enter-active：进入过程中
        3. v-enter-to：进入的终点
      - 元素离开的样式：
        1. v-leave：离开的起点
        2. v-leave-active：离开过程中
        3. v-leave-to：离开的终点

   2. 使用```<transition>```包裹要过度的元素，并配置name属性：[详情](https://v3.cn.vuejs.org/api/built-in-components.html#component)

      ```vue
      <transition name="hello" appear> //appear属性是让该动画在页面加载完首次展示的时候自动执行一次
      	<h1 v-show="isShow">你好啊！</h1>
      </transition>
      ```

   3. 备注：若有多个元素需要过度，则需要使用：```<transition-group>```，且每个元素都要指定```key```值。







# 实战




## 处理vue项目中的错误

### 回答范例

1. 应用中的错误类型分为"`接口异常`"和“`代码逻辑异常`”
2. 我们需要根据不同错误类型做相应处理：`接口异常`是我们请求后端接口过程中发生的异常，可能是请求失败，也可能是请求获得了服务器响应，但是返回的是错误状态。以Axios为例，这类异常我们可以通过封装Axios，在拦截器中统一处理整个应用中请求的错误。`代码逻辑异常`是我们编写的前端代码中存在逻辑上的错误造成的异常，vue应用中最常见的方式是使用全局错误处理函数`app.config.errorHandler`收集错误。
3. 收集到错误之后，需要统一处理这些异常：分析错误，获取需要错误信息和数据。这里应该有效区分错误类型，如果是请求错误，需要上报接口信息，参数，状态码等；对于前端逻辑异常，获取错误名称和详情即可。另外还可以收集应用名称、环境、版本、用户信息，所在页面等。这些信息可以通过vuex存储的全局状态和路由信息获取。

### 实践

axios拦截器中处理捕获异常：

```vbscript
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 存在response说明服务器有响应
    if (error.response) {
      let response = error.response;
      if (response.status >= 400) {
        handleError(response);
      }
    } else {
      handleError(null);
    }
    return Promise.reject(error);
  },
);
复制代码
```

vue中全局捕获异常：

```javascript
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // report error to tracking services
}
复制代码
```

处理接口请求错误：

```lua
function handleError(error, type) {
  if(type == 1) {
    // 接口错误，从config字段中获取请求信息
    let { url, method, params, data } = error.config
    let err_data = {
       url, method,
       params: { query: params, body: data },
       error: error.data?.message || JSON.stringify(error.data),
    })
  }
}
复制代码
```

处理前端逻辑错误：

```go
function handleError(error, type) {
  if(type == 2) {
    let errData = null
    // 逻辑错误
    if(error instanceof Error) {
      let { name, message } = error
      errData = {
        type: name,
        error: message
      }
    } else {
      errData = {
        type: 'other',
        error: JSON.strigify(error)
      }
    }
  }
}
```







## 递归组件

```vue
<!--TreeItem.vue-->
<template>
  <li>
    <div> {{ model.name }}</div>
    <ul v-show="isOpen" v-if="isFolder">
      <!-- 注意这里：组件递归渲染了它自己 -->
      <TreeItem
        class="item"
        v-for="model in model.children"
        :model="model">
      </TreeItem>
    </ul>
  </li>
<script>
export default {
  name: 'TreeItem',
  // ...
}
</script>
```

如果某个组件通过组件名称引用它自己，这种情况就是递归组件。

实际开发中类似Tree、Menu这类组件，它们的节点往往包含子节点，子节点结构和父节点往往是相同的。这类组件的数据往往也是树形结构，这种都是使用递归组件的典型场景。

使用递归组件时，由于我们并未也不能在组件内部导入它自己，所以设置组件`name`属性，用来查找组件定义，如果使用SFC，则可以通过SFC文件名推断。组件内部通常也要有递归结束条件，比如model.children这样的判断。

查看生成渲染函数可知，递归组件查找时会传递一个布尔值给`resolveComponent`，这样实际获取的组件就是当前组件本身。



## 优化

路由懒加载

v-for添加key

destory时销毁事件：比如addEventListener添加的事件、setTimeout、setInterval、bus.$on绑定的监听事件等

第三方插件按需引入



### 关闭兼容vue2来减少包体积

当 Vue.js 构建资源时，如果构建的资源是供打包工具使用的（即带有 -bundler 字样的资源），那么上面的代码在资源中会变成：

```js
//support for 2.x options
if(__VUE_OPTIONS_API__){ //注意这里
	...
}
```

`__VUE_OPTIONS_API__` 是一个特性开关，用户可以通过设置`__VUE_OPTIONS_API__` 预定义常量的值来控制是否要包含这段代码。通常用户可以使用 webpack.DefinePlugin 插件来实现：

```js
new webpack.DefinePlugin({
	__VUE_OPTIONS_API__:JSON.stringify(true) //开启特性
})
```

在 Vue.js 2 中，我们编写的组件叫作组件选项 API，但是在 Vue.js 3 中，推荐使用 Composition API 来编写代码，但是为了兼容 Vue.js 2，在 Vue.js 3 中仍然可以使用选项 API 的方式编写代码。但是如果明确知道自己不会使用选项 API，用户就可以使用`__VUE_OPTIONS_API__` 开关来关闭该特性，这样在打包的时候 Vue.js 的这部分代码就不会包含在最终的资源中，从而减小资源体积。



### 用vue渲染大量数据时应该怎么优化

可以采取分页的方式获取，避免渲染大量数据

[vue-virtual-scroller](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FAkryum%2Fvue-virtual-scroller)等虚拟滚动方案，只渲染视口范围内的数据

如果不需要更新，可以使用`v-once`方式只渲染一次

通过[v-memo](https://link.juejin.cn?target=https%3A%2F%2Fvuejs.org%2Fapi%2Fbuilt-in-directives.html%23v-memo)可以缓存结果，结合`v-for`使用，避免数据变化时不必要的VNode创建

可以采用懒加载方式，在用户需要的时候再加载数据，比如tree组件子树的懒加载





## vue在页面中如何监听回到上一步的操作

挂载完成后，判断浏览器是否支持popstate

```js
methods:{
  goBack(){
    this.$router.replace({path: '/'});
    //replace替换原路由，作用是避免回退死循环
  }
}

mounted(){
  if (window.history && window.history.pushState) {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', this.goBack, false);
  }
},
```

页面销毁时，取消监听。否则其他vue路由页面也会被监听

```js
destroyed(){
  window.removeEventListener('popstate', this.goBack, false);
},
```









# 源码

## Vue3源码的开发环境搭建

### 整体架构

 Vue3源码采用 monorepo 方式进行管理，将模块拆分到package目录中。

- 一个仓库可维护多个模块，不用到处找仓库
- 方便版本管理和依赖管理，模块之间的引用，调用都非常方便

#### [#](http://www.zhufengpeixun.com/jg-vue/guide/01.introduce.html#vue3项目结构)Vue3项目结构

[<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-jcRj3z.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-jcRj3z.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-jcRj3z.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-jcRj3z.png" loading="lazy"/>
  </picture>](http://www.zhufengpeixun.com/jg-vue/guide/introduce.png)



###  搭建Monorepo环境

Vue3中使用`pnpm` `workspace`来实现`monorepo` 

#### 全局安装pnpm

```bash
npm install pnpm -g # 全局安装pnpm
```

```bash
pnpm init -y # 初始化配置文件
```

#### 创建.npmrc文件

```ini
shamefully-hoist = true
```

> 这里您可以尝试一下安装`Vue3`, `pnpm install vue@next`默认情况下`vue3`中依赖的模块不会被提升到`node_modules`下，而是放在了`node_modules/.pnpm`下。 添加**羞耻的提升**可以将Vue3所依赖的模块提升到`node_modules`中

#### 配置workspace

新建 **pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
```

> 将packages下所有的目录都作为包进行管理。这样我们的Monorepo就搭建好了。

### 环境搭建

#### 安装打包所需要的依赖

| 依赖                        |                           |
| --------------------------- | ------------------------- |
| typescript                  | 在项目中支持Typescript    |
| rollup                      | 打包工具                  |
| rollup-plugin-typescript2   | rollup 和 ts的 桥梁       |
| @rollup/plugin-json         | 支持引入json              |
| @rollup/plugin-node-resolve | 解析node第三方模块        |
| @rollup/plugin-commonjs     | 将CommonJS转化为ES6Module |
| minimist                    | 命令行参数解析            |
| execa@4                     | 开启子进程                |

```bash
pnpm install typescript rollup rollup-plugin-typescript2 @rollup/plugin-json @rollup/plugin-node-resolve @rollup/plugin-commonjs minimist execa@4 esbuild   -D -w
```



#### 创建模块

> 我们现在`packages`目录下新建两个package，用于下一章手写响应式原理做准备

- reactivity 响应式模块
- shared 共享模块

**所有包的入口均为`src/index.ts` 这样可以实现统一打包**

- reactivity/package.json

  ```json
  {
    "name": "@vue/reactivity",
    "version": "1.0.0",
    "main": "index.js",
    "module":"dist/reactivity.esm-bundler.js",
    "unpkg": "dist/reactivity.global.js",
    "buildOptions": {
      "name": "VueReactivity",
      "formats": [
        "esm-bundler",
        "cjs",
        "global" //这个包可以单独拿出来用的时候就打包成global
      ]
    }
  }
  ```

  

- shared/package.json

  ```json
  {
      "name": "@vue/shared",
      "version": "1.0.0",
      "main": "index.js",
      "module": "dist/shared.esm-bundler.js",
      "buildOptions": {
          "formats": [
              "esm-bundler",
              "cjs"
          ]
      }
  }
  ```

> **formats**为自定义的打包格式：
>
> - `esm-bundler`在构建工具中使用的格式（可以让你开发时使用`<script src='xxx' type='module'>`），import
> - `esm-browser`在浏览器中使用的格式
> - `cjs`就是CommonJS，在node中使用的格式，module.exports
> - `global` 立即执行函数的格式?



#### 初始化TS

```bash
pnpm tsc --init
```

> 先添加些常用的`ts-config`配置，后续需要其他的在继续增加

```json
{
  "compilerOptions": {
    "outDir": "dist", // 输出的目录
    "sourceMap": true, // 采用sourcemap
    "target": "es2016", // 目标语法
    "module": "esnext", // 模块格式
    "moduleResolution": "node", // 模块解析方式
    "strict": false, // 严格模式
    "resolveJsonModule": true, // 解析json模块
    "esModuleInterop": true, // 允许通过es6语法引入commonjs模块
    "jsx": "preserve", // jsx 不转义
    "lib": ["esnext", "dom"], // 支持的类库 esnext及dom
  }
}
```

在`tsconfig.json`中配置`ts`引用关系 

```js
"baseUrl": ".",
"paths": {
    "@vue/*": ["packages/*/src"] //访问到以‘@vue/*’开头的文件时就去找 ‘packages/*/src’ 里的文件
}
```

这样各个package就可以互相引用了，例如在`packages/reactivity/src/index.ts`中

```javascript
import { isObject } from "@vue/shared"; //配置了上面之后就能找到 'packages/shared/src' 下的文件
```



#### 开发环境`esbuild`打包

**`package.json`中配置脚本命令**

```json
"scripts": {
    "dev": "node scripts/dev.js reactivity -f global"
}
```

根目录下新建`scripts`目录，目录下新建`dev.js`文件---开发环境打包

```js
/**开发环境只打包某一个 */
const { build } = require('esbuild')
const { resolve } = require('path')
const args = require('minimist')(process.argv.slice(2)); //前两个参数不是你传的，我们不要了。

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`)); //取这个包的配置

const outputFormat = format.startsWith('global')// 输出的格式
    ? 'iife' // 立即执行函数
    : format === 'cjs'
        ? 'cjs'
        : 'esm'

const outfile = resolve( // 输出的文件
    __dirname,
    `../packages/${target}/dist/${target}.${format}.js`
)

//天生支持ts
build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true, //把所有的包全部打包到一起
    sourcemap: true,
    format: outputFormat, //输出的格式
    globalName: pkg.buildOptions?.name, //全局名字
    platform: format === 'cjs' ? 'node' : 'browser', //平台
    watch: { // 监控文件变化，文件发生变化就重新打包
        onRebuild(error) {
            if (!error) console.log(`rebuilt~~~~`)
        }
    }
}).then(() => { //打包成功以后...
    console.log('watching~~~')
})
```



#### 生产环境`rollup`打包

##### [#](http://www.zhufengpeixun.com/jg-vue/guide/02.start.html#rollup-config-js)rollup.config.js

```js
import path from 'path';
// 获取packages目录
const packagesDir = path.resolve(__dirname, 'packages');
// 获取对应的模块
const packageDir = path.resolve(packagesDir, process.env.TARGET);
// 全部以打包目录来解析文件
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve('package.json'));
const name = path.basename(packageDir); // 获取包的名字

// 配置打包信息
const outputConfigs = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    cjs: {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    global: {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    }
}
// 获取formats
const packageFormats = process.env.FORMATS &&  process.env.FORMATS.split(',');
const packageConfigs =  packageFormats || pkg.buildOptions.formats;

import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve'
import tsPlugin from 'rollup-plugin-typescript2'

function createConfig(format,output){
    output.sourcemap = process.env.SOURCE_MAP;
    output.exports = 'named'; 
    let external = []
    if(format === 'global'){ 
        output.name = pkg.buildOptions.name
    }else{ // cjs/esm 不需要打包依赖文件
        external = [...Object.keys(pkg.dependencies || {})]
    }
    return {
        input:resolve('src/index.ts'),
        output,
        external,
        plugins:[
            json(),
            tsPlugin(),
            commonjs(),
            nodeResolve()
        ]
    }
}
// 开始打包把
export default packageConfigs.map(format=> createConfig(format,outputConfigs[format]));
```

##### [#](http://www.zhufengpeixun.com/jg-vue/guide/02.start.html#build-js)build.js

```javascript
const fs = require('fs');
const execa = require('execa')
const targets = fs.readdirSync('packages').filter(f => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    }
    return true;
});
async function runParallel(source, iteratorFn) {
    const ret = [];
    for (const item of source) {
        const p = Promise.resolve().then(() => iteratorFn(item))
        ret.push(p);
    }
    return Promise.all(ret)
}
async function build(target) {
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            `TARGET:${target}`
        ],
        { stdio: 'inherit' }
    )
}
runParallel(targets, build)
```







## Vue设计思想

框架设计讲究全局视角的把控，一个项目就算再大，也是存在一条核心思路的，并围绕核心展开。

- Vue3.0更注重模块上的拆分，在2.0中无法单独使用部分模块。需要引入完整的Vuejs(例如只想使用使用响应式部分，但是需要引入完整的Vuejs)， Vue3中的模块之间耦合度低，模块可以独立使用。 **拆分模块**

  

- Vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，要通过改写Vue源码改造渲染方式。 **扩展更方便**

### [#](http://www.zhufengpeixun.com/jg-vue/guide/00.think.html#声明式框架)声明式描述UI





#### 什么是声明式描述UI

前端页面都涉及哪些内容，具体如下：

● DOM 元素：例如是 div 标签还是 a 标签。

● 属性：如 a 标签的 href 属性，再如 id、class 等通用属性。

● 事件：如 click、keydown 等。

● 元素的层级结构：DOM 树的层级结构，既有子节点，又有父节点。

如何声明式地描述上述内容呢？拿 Vue.js 3 来说，相应的解决方案是：

● 使用与 HTML 标签一致的方式来描述 DOM 元素，例如描述一个 div 标签时可以使用 <div></div>；

● 使用与 HTML 标签一致的方式来描述属性，例如 <div id="app"></div>；

● 使用 : 或 v-bind 来描述动态绑定的属性，例如 <div :id="dynamicId"></div>；

● 使用 @ 或 v-on 来描述事件，例如点击事件 <div @click="handler"></div>；

● 使用与 HTML 标签一致的方式来描述层级结构，例如一个具有 span 子节点的div 标签` <div><span></span></div>`。在 Vue.js 中，哪怕是事件，都有与之对应的描述方式。用户不需要手写任何命令式代码，这就是所谓的声明式地描述 UI。除了上面这种使用模板来声明式地描述 UI 之外，我们还可以用 JavaScript 对象来描述，代码如下所示：

```js
01 const title = {
02   // 标签名称
03   tag: 'h1',
04   // 标签属性
05   props: {
06     onClick: handler
07   },
08   // 子节点
09   children: [
10     { tag: 'span' }
11   ]
12 }
```





#### **命令式和声明式区别**

- 早在JQ的时代编写的代码都是命令式的，命令式框架重要特点就是关注过程
- 声明式框架更加关注结果。代码可读性，可维护性更好。命令式的代码封装到了Vuejs中，过程靠vuejs来实现。

```js
// 假设现在我们要将 div 标签的文本内容修改为 hello vue3
div.textContent = 'hello vue3' // 命令式

// 声明式
01 <!-- 之前： -->
02 <div @click="() => alert('ok')">hello world</div>
03 <!-- 之后： -->
04 <div @click="() => alert('ok')">hello vue3</div>
// 对于框架来说，为了实现最优的更新性能，它需要找到前后的差异并只更新变化的地方，但是最终完成这次更新的代码仍然是：div.textContent = 'hello vue3'

所以：
如果我们把直接修改的性能消耗定义为 A，把找出差异的性能消耗定义为 B，那么有：

● 命令式代码的更新性能消耗 = A                       ● 声明式代码的更新性能消耗 = B + A

毕竟框架本身就是封装了命令式代码才实现了面向用户的声明式
```







### [#](http://www.zhufengpeixun.com/jg-vue/guide/00.think.html#采用虚拟dom)采用虚拟DOM

#### 本质

使用 JavaScript 对象来描述 UI 的方式，其实就是所谓的虚拟 DOM。(虚拟DOM就是一个用来描述真实DOM的JavaScript对象)

```js
// 举例一个虚拟dom
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 更多 vnode */
  ]
}
```







#### 作用

1. 声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗。如果我们能够最小化找出差异的性能消耗，就可以让声明式代码的性能无限接近命令式代码的性能。而虚拟 DOM，就是为了<mark>最小化找出差异</mark>这一步的性能消耗而出现的。有没有什么办法能够让我们不用付出太多的努力（写声明式代码），还能够保证应用程序的性能下限，让应用程序的性能不至于太差，甚至想办法逼近命令式代码的性能呢？这其实就是虚拟 DOM 要解决的问题。

2. 使用JavaScript 对象描述 UI 比用模版来描述 更加灵活。举个例子，假如我们要表示一个标题，根据标题级别的不同，会分别采用 h1~h6 这几个标签，如果用 JavaScript 对象来描述，我们只需要使用一个变量来代表 h 标签即可：

   ```js
   let level = 3 //h 标签的级别
   const title = {
   	tag: `h${level}` // h3 标签
   }
   ```

   但是如果使用模板来描述，就不得不穷举：

   ```html
   <h1 v-if="level === 1"></h1>
   <h2 v-else-if="level === 2"></h2>
   <h3 v-else-if="level === 3"></h3>
   <h4 v-else-if="level === 4"></h4>
   <h5 v-else-if="level === 5"></h5>
   <h6 v-else-if="level === 6"></h6>
   ```

   



#### 与innerHTML的对比

传统更新页面，拼接一个完整的字符串innerHTML全部重新渲染；添加虚拟DOM后，可以比较新旧虚拟节点，找到变化在进行更新。

- 创建页面时：虚拟 DOM 相比innerHTML 没有优势可言，甚至因为要先创建虚拟dom导致性能会更差。
- 更新页面时：虚拟 DOM 在更新页面时只会更新必要的元素，但 innerHTML 需要全量更新。对于虚拟 DOM 来说，无论页面多大，都只会更新变化的内容，而对于 innerHTML 来说，页面越大，就意味着更新时的性能消耗越大。<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230108153828201.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230108153828201.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230108153828201.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230108153828201.png" loading="lazy"/>
  </picture>



#### 原生dom&innerHTML&虚拟DOM

用原生 JavaScript 操作 DOM 的方法（如document.createElement）、虚拟 DOM 和 innerHTML 三者操作页面的性能，不可以简单地下定论，这与页面大小、变更部分的大小都有关系，除此之外，与创建页面还是更新页面也有关系，选择哪种更新策略，需要我们结合心智负担、可维护性等因素综合考虑。

三个维度：心智负担、可维护性和性能。

- 原生 DOM 操作：心智负担最大，因为你要手动创建、删除、修改大量的 DOM 元素。但它的性能是最高的。另外，以这种方式编写的代码，可维护性也极差。

- innerHTML ：由于我们编写页面的过程有一部分是通过拼接 HTML 字符串来实现的，这有点儿接近声明式的意思，但是拼接字符串总归也是有一定心智负担的，而且对于事件绑定之类的事情，我们还是要使用原生 JavaScript 来处理。如果 innerHTML 模板很大，则其更新页面的性能最差，尤其是在只有少量更新时。

- 虚拟 DOM：它是声明式的，因此心智负担小，可维护性强，性能虽然比不上极致优化的原生 JavaScript，但是在保证心智负担和可维护性的前提下相当不错。

采用虚拟 DOM 的更新技术的性能理论上不可能比原生 JavaScript 操作 DOM 更高。但是在大部分情况下，我们很难写出绝对优化的命令式代码，尤其是当应用程序的规模很大的时候，即使你写出了极致优化的代码，也一定耗费了巨大的精力，这时的投入产出比其实并不高。





#### vue虚拟dom的对象属性

```js
const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    children,
    component: null,
    el: null,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
} 
```

编译器和渲染器之间是存在信息交流的，它们互相配合使得性能进一步提升，而它们之间交流的媒介就是虚拟 DOM 对象。编译器能识别出哪些是静态属性，哪些是动态属性，在生成虚拟dom的时候完全可以附带这些信息。这样就可以让渲染器知道哪些是需要更新变化的，那些事不需要的，就不用渲染器再去找了。





### [#](http://www.zhufengpeixun.com/jg-vue/guide/00.think.html#区分编译时和运行时)区分编译时和运行时

Vue.js 3 仍然保持了运行时 + 编译时的架构。Vue.js 3 在保留运行时的情况下，其性能甚至可能不输纯编译时的框架。(感觉这里面的性能差异有可能在于上面讲的完全原生js去操作dom跟虚拟dom去操作dom，如果编译后的纯原生js对于dom频繁更新的写法足够高性能，那就很强了)

我理解为什么需要运行时，不就是因为纯原生js的api不足以满足一些事情，所以需要引入一些运行时去解。比如虚拟dom。

当设计一个框架的时候，我们有三种选择：纯运行时的、运行时 + 编译时的或纯编译时的。

- 纯运行时的框架：由于它没有编译的过程，因此我们没办法分析用户提供的内容。（都说了是纯运行时，就是框架把用户的代码拿来就用了）。直接用defineComponents()，且里面写树形结构的虚拟dom对象，那vue对于你来说就是纯运行时了(也不全是，虽然模版组件会被编译成defineComponents()，但还会加一些乱七八糟的东西，只能说你写的代码接近纯运行时)。

- 纯编译时的：由于不需要任何运行时，而是直接编译成可执行的 JavaScript 代码，因此理论上性能可能会更好。

  <picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-18-22-image-20240108182231236.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-18-22-image-20240108182231236.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-08-18-22-image-20240108182231236.png" alt="image-20240108182231236" style="zoom:33%;" loading="lazy"/>
  </picture>

- 运行时+编译时：

  ```js
  01 const html = `
  02 <div>
  03   <span>hello world</span>
  04 </div>
  05 `
  06 // 调用 Compiler 编译得到树型结构的数据对象 , 这一步就是编译时，一般放在构建时做
  07 const obj = Compiler(html)
  08 // 再调用 Render 进行渲染
  09 Render(obj, document.body) // 这一步就是运行时，Render就是vue提供的运行时方法。
  ```

  



### 错误处理

将错误处理程序封装为一个函数，假设叫它 callWithErrorHandling：

```js
01 // utils.js
02 export default {
03   foo(fn) {
04     callWithErrorHandling(fn)
05   },
06   bar(fn) {
07     callWithErrorHandling(fn)
08   },
09 }
10 function callWithErrorHandling(fn) { // vue中有这方法，但当然没那么简单
11   try {
12     fn && fn()
13   } catch (e) {
14     console.log(e)
15   }
16 }
```



这么做真正的好处是，我们能为用户提供统一的错误处理接口，如以下代码所示：

```js
01 // utils.js
02 let handleError = null
03 export default {
04   foo(fn) {
05     callWithErrorHandling(fn)
06   },
07   // 用户可以调用该函数注册统一的错误处理函数
08   registerErrorHandler(fn) {
09     handleError = fn
10   }
11 }
12 function callWithErrorHandling(fn) {
13   try {
14     fn && fn()
15   } catch (e) {
16     // 将捕获到的错误传递给用户的错误处理程序
17     handleError(e)
18   }
19 }
```

这时错误处理的能力完全由用户控制，用户既可以选择忽略错误，也可以调用上报程序将错误上报给监控系统

















## createApp()

### Vue3应用初始化用法

```js
// vue3 应用初始化
import { createApp } from 'vue'
import App from './app'
const app = createApp(App)
app.mount('#app')

// 组件渲染和未捕获错误配置的处理程序
app.config.errorHandler = (err, vm, info) => {}
// 添加全局属性
app.config.globalProperties.$http = () => {} // 这里相当于挂载到Vue2的 Vue.prototype
// 指定一种方法识别Vue之外定义的自定义元素
app.config.isCustomElement = tag => tag.startsWith('ion-')
// 注册组件
app.component('my-component', {})
// 检索组件
const MyComponent = app.component('my-component')
// 注册指令
app.directive('my-directive',{})
// 设置一个可以注入到应用程序内所有组件中的值。组件应使用inject来接收提供的值。
app.provide('user', 'administrator')
// 卸载应用程序
 app.unmount()
// 安装vue插件
import MyPlugin from './plugins/MyPlugin'
app.use(MyPlugin)
```



### createApp主要是干了两件事

1. 创建app实例，并返回该实例
2. 重写mount方法

### 详细过程

1.执行 `createApp` 首先会创建渲染器，有2种渲染器类型，并且它们都是通过延迟创建的，目的是当用户只引用reactive响应式框架的时候，方便进行tree-shaking优化。且两种渲染器都是基于 `baseCreateRender` 方法来实现。

2.`baseCreateRender` 函数执行后会返回 `render` 渲染函数和 `createApp` 方法，其中 `render` 函数是组件创建、更新和卸载的主要核心逻辑实现。createApp则用于创建应用实例，进行应用实例的初始化。

3.createAppAPI用于生成默认的应用上下文 `context`，这里定义了应用实例具备的属性和方法，并通过重写扩展 `context.app` 属性，让用户能够进行对上下文的自定义操作，比如自定义组件、指令、mixin、插件安装等一系列操作。并存在mount方法完成将根组件转为虚拟节点 `vNode`，并通过`render` 函数完成对 `vNode` 的渲染。












## 插件机制

Vue.use(plugin);

（1）参数

```javascript
{ Object | Function } plugin
```

（2）用法

如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。调用install方法时，会将Vue作为参数传入。install方法被同一个插件多次调用时，插件也只会被安装一次。

[**如何开发 Vue 插件？**](https://mp.weixin.qq.com/s?__biz=MzU5NDM5MDg1Mw==&mid=2247483874&idx=1&sn=ac6c9cf2629068dec3e5da8aa3e29364&chksm=fe00bbc8c97732dea7be43e903a794229876d8ab6c9381f2388ba22886fba7776b7b34b7af86&token=1885963052&lang=zh_CN&scene=21#wechat_redirect)



（3）实现

1、首先判断插件是不是已经别注册过，如果被注册过，则直接终止方法执行。

2、toArray方法将类数组转成真正的数组。将Vue添加到args列表的最前面。这样做的目的是保证install方法被执行时第一个参数是Vue，其余参数是注册插件时传入的参数。

3、由于plugin参数支持对象和函数类型，所以通过判断plugin.install和plugin哪个是函数，然后执行用户编写的插件并将args作为参数传入。

4、最后，将插件添加到installedPlugins中，保证相同的插件不会反复被注册。

```javascript
Vue.use = function(plugin){
 const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
 if(installedPlugins.indexOf(plugin)>-1){
  return this;
 }
 <!-- 其他参数 -->
 const args = toArray(arguments,1);
 args.unshift(this);
 if(typeof plugin.install === 'function'){
  plugin.install.apply(plugin,args);
 }else if(typeof plugin === 'function'){
  plugin.apply(null,plugin,args);
 }
 installedPlugins.push(plugin);
 return this;
}
```





## 响应式

vue3.2之后又改了一版响应式原理提升了性能：https://mp.weixin.qq.com/s/02-6xMskeTMuTwrJ1fkZow

### vue2.x的响应式

- 实现原理：

  - 对象类型：通过```Object.defineProperty()```对属性的读取、修改进行拦截（数据劫持）。

  - 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

    ```js
    Object.defineProperty(data, 'count', {
        get () {}, 
        set () {}
    })
    ```

- 存在问题：

  - 新增属性、删除属性, Object.defineProperty 不能拦截到这些操作。
  - 直接通过下标修改数组和数组长度发生变化, Object.defineProperty 不能拦截到这些操作。

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，而且支持 Map，Set，WeakMap 和 WeakSet。







### 响应式原理简洁版(面试说这个吧)

Vue 的响应式系统的追踪和触发都是在浏览器中运行时进行。

#### 如何变成响应式数据：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 和 [Proxies]

在 JavaScript 中有两种追踪**对象属性**的读写的方式：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 和 [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。reactive内部使用Proxy代理传入对象并拦截该对象各种操作（trap）。ref内部封装一个RefImpl类，并设置get value/set value，拦截用户对值的访问。(因为 getter / setter 只针对单一值进行拦截，而 Proxy 需要对整个对象进行拦截，这会导致性能损耗。)

下面的伪代码将会说明它们是如何工作的：

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```



#### 副作用函数也会被包一层

你写在dom里的和computed和watch里的函数都会被包到ReactiveEffect对象里。换句话说是被这里面的才是副作用函数即effect。



#### 如何将响应式数据和依赖间建立联系

##### 通过响应式数据查找相应的effects

副作用订阅将被存储在一个全局的 `WeakMap<target, Map<key, Set<effect>>>` 数据结构中。如果在第一次追踪时（访问属性时）没有找到对相应属性订阅的副作用集合Set，那就新建。



<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-15-16-image-20240110151620624.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-15-16-image-20240110151620624.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-15-16-image-20240110151620624.png" alt="image-20240110151620624" style="zoom:33%;" loading="lazy"/>
  </picture>

其中 WeakMap 的键是原始对象 target，WeakMap 的值是一个 Map 实例，而Map 的键是原始对象 target 的 key，Map 的值是一个由副作用函数组成的 Set。



##### 通过effect找到哪个集合里拥有自己

effect对象里有一个deps属性（是个数组），用于存放所有 拥有自己的 effectSet。

为什么有这个需求是 为了解决 [分支切换问题](#branch-toggle)

#### track

一般就是effect触发track

在 `track()` (访问属性的时候)内部，会检查当前是否有正在运行的副作用。如果有，则找到【存储该属性的 effect 】的Set（这个Set就在上面说的proxyMap里），然后将当前副作用添加到该 Set 中。且把该Set插入到当前effect的deps中。

```js
// 这会在一个副作用就要运行之前被设置
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effectsSet = getSubscribersForProperty(target, key)
    effectsSet.add(activeEffect)
    activeEffect.deps.push(effectsSet); // 让effect记住自己被放到哪些Set里，这样后续可以从这些Set里清理掉自己。
  }
}
```



 

#### `trigger` 

一般就是trigger导致一些effect被执行

在 `trigger()` (修改属性的时候)，我们会再找到该属性的所有订阅副作用并执行它们：

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```







### 响应式系统核心

响应式系统的核心就是 effect和track和trigger。什么watch、computed、渲染函数的响应式都是基于此的。



#### 响应式模块基本使用

```html
<div id="app"></div>
<script src="./reactivity.global.js"></script>
<script>
    const { reactive, effect, shallowReactive, shallowReadonly, readonly } = VueReactivity;
    // let state = reactive({ name: 'jw', age: 30 });
    // const state = shallowReactive({ name: 'jw', age: 30 })
    // const state = readonly({ name: 'jw', age: 30 })
    const state = reactive({ name: 'jw', age: 30})
    effect(() => { // 副作用函数 (effect执行渲染了页面)
        app.innerHTML = state.name + '今年' + state.age + '岁了'
    });
    setTimeout(() => {
        state.age++;
    }, 1000)
</script>
```

> `reactive`方法会将对象变成proxy对象， `effect`中使用`reactive`对象时会进行依赖收集，稍后属性变化时会重新执行`effect`函数~。







#### 编写reactive函数

注意reactive是懒深度响应，拦截getter里会对属性进行判断，如果该属性是个对象，则对这个对象再进行reactive。每次reactive只代理一层(因为proxy本身就是代理一层)。

关键部分：

```js
export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) { // 如果这个对象已经是仅读的，则直接返回
    return target
  }
  return createReactiveObject( // 创建响应式对象
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) { // 如果不是对象则直接返回,无法代理
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }

  if (
    target[ReactiveFlags.RAW] && //尝试去取该对象的ReactiveFlags.RAW值，如果取的到则说明这个target是某个值的代理值 target is already a Proxy, return it.
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE]) // 如果该对象是reactive对象且现在要对他外包一层readonly，则可以不直接返回，往下就行去给他包一层。 exception: calling readonly() on a reactive object 即 进行readonly(reactive(obj))； 
  ) {
    return target
  }
 
  const existingProxy = proxyMap.get(target)   // target already has corresponding Proxy   检测目标是不是已经被代理过了
  if (existingProxy) { // 如果已经代理过，则直接返回之前的代理对象
    return existingProxy
  }
  // only a whitelist of value types can be observed. // 只有在白名单中的类型能被观测
  const targetType = getTargetType(target) // 本质就是这个对象需要被观测 或者 这个对象能扩展
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy( // 进行代理
    target,                       
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers  // map和set的代理和普通的代理不一样
  )
  proxyMap.set(target, proxy) // 将原对象和代理对象缓存起来
  return proxy
}
```



#### 编写baseHandlers(拦截get, set...)

看源码即可，源码里干的几件事：

先定义好几个给get代理方法用的函数

*编写五个代理方法：get、set、deleteProperty（*拦截delete操作符，触发更新）、has（*拦截in操作符，依赖收集*）、ownKeys（*拦截for...in*）

*最后组合成各种Handles并导出*

```ts
import {
  reactive,
  readonly,
  toRaw,
  ReactiveFlags,
  Target,
  readonlyMap,
  reactiveMap,
  shallowReactiveMap,
  shallowReadonlyMap,
  isReadonly,
  isShallow
} from './reactive'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import {
  track,
  trigger,
  ITERATE_KEY,
  pauseTracking,
  resetTracking
} from './effect'
import {
  isObject,
  hasOwn,
  isSymbol,
  hasChanged,
  isArray,
  isIntegerKey,
  extend,
  makeMap
} from '@vue/shared'
import { isRef } from './ref'

/**下面是几个给get代理方法用的函数 */

const isNonTrackableKeys = /*#__PURE__*/ makeMap(`__proto__,__v_isRef,__isVue`)

const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map(key => (Symbol as any)[key])
    .filter(isSymbol)
)

const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations() //生成数组的get代理方法

function createArrayInstrumentations() {
  const instrumentations: Record<string, Function> = {}
  // instrument identity-sensitive Array methods to account for possible reactive
  // values
  ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
        const arr = toRaw(this) as any //将数组转换成原始对象
        for (let i = 0, l = this.length; i < l; i++) {// 将数组里的每个属性进行收集
            track(arr, TrackOpTypes.GET, i + '')
        }
        // we run the method using the original args first (which may be reactive)
        const res = arr[key](...args) // 调用数组原始的方法，获取返回值
        
        if (res === -1 || res === false) {  
            // if that didn't work, run it again using raw values.
            return arr[key](...args.map(toRaw)) // 如果原始方法不工作，再将参数转化为原始值处理
        } else {
            return res
        }
    }
  })
  // instrument length-altering mutation methods to avoid length being tracked
  // which leads to infinite loops in some cases (#2137)
  ;(['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => { //这些方法会导致收集length的依赖，不让它收集
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      pauseTracking() // 调用此方法停止依赖收集
      const res = (toRaw(this) as any)[key].apply(this, args) 
      resetTracking() // 恢复依赖收集
      return res
    }
  })
  return instrumentations
}

/**下面就是五个代理方法：get、set、deleteProperty、has、ownKeys */

/*生成各种get代理方法 */
const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) { // 这两个参数会成为get函数里面的闭包
    return function get(target: Target, key: string | symbol, receiver: object) {
    /*下面这些是针对reactive上的一些判断api做的*/
    if (key === ReactiveFlags.IS_REACTIVE) {  // 针对isReactive();判断是不是响应式对象 readonly还是reactive（readonly和reactive是互斥的）
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) { // 针对isReadonly() 看是不是readonly
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) { // 针对isShallow() 看是不是浅的
      return shallow
    } else if (
      key === ReactiveFlags.RAW && // 针对toRaw()，获取被代理对象对应的原始值
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
          ? shallowReactiveMap
          : reactiveMap
        ).get(target)
    ) {
      return target
    }
    
    /*如果不是调用上面那几个响应式api则执行下面：*/
    const targetIsArray = isArray(target)
    
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {// 如果是数组则对 'includes', 'indexOf', 'lastIndexOf' 方法进行处理
        return Reflect.get(arrayInstrumentations, key, receiver)
    }

    const res = Reflect.get(target, key, receiver)
    // 是内置symbol或者是访问的是__proto__,__v_isRef,__isVue属性直接返回res,不进行依赖收集
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }
    
    if (!isReadonly) {// 如果不是readonly 则进行属性的收集
      track(target, TrackOpTypes.GET, key)
    }

    if (shallow) { //如果是浅的就返回了（上一行已经做了依赖收集了）
      return res
    }

    if (isRef(res)) { 
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key) // 如果访问的是数组的索引不进行脱ref（脱ref就是去掉.value）
      return shouldUnwrap ? res.value : res
    }

    if (isObject(res)) { // 如果访问的这个属性是个对象则先进行深度代理再返回代理后的对象
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

/*生成各种set代理方法 */
const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)

function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    let oldValue = (target as any)[key] // 获取老值
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) { //如果是只读的 或者 旧值是ref而新值不是ref 则说明有问题
      return false  
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {  // 如果深度代理，在赋值的时候先转换成非proxy
        value = toRaw(value)
        oldValue = toRaw(oldValue)
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value // 老的是ref 新的不是ref 则会给老的ref赋值
        return true
      }
    } else { // 浅层代理无所谓咋设置
      // in shallow mode, objects are set as-is regardless of reactive or not
    }
    // 查看是否有过这个key
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
     if (target === toRaw(receiver)) { // 减少原型链的触发 ，这个判断是为了解决proxy和reflect语法本身存在的bug
      if (!hadKey) { // 说明是添加了一个属性
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) { // 如果前后置有变化触发修改逻辑
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
     }
    return result
  }
}

function deleteProperty(target: object, key: string | symbol): boolean { //拦截delete操作符，触发更新
  const hadKey = hasOwn(target, key)
  const oldValue = (target as any)[key]
  const result = Reflect.deleteProperty(target, key) 
  if (result && hadKey) { // 触发删除逻辑
    trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
  }
  return result
}

function has(target: object, key: string | symbol): boolean { //拦截in操作符，依赖收集
  const result = Reflect.has(target, key) // 看是否在目标中
  if (!isSymbol(key) || !builtInSymbols.has(key)) { // 内置symbol不进行收集
    track(target, TrackOpTypes.HAS, key)
  }
  return result
}

function ownKeys(target: object): (string | symbol)[] { //拦截for...in
  track(target, TrackOpTypes.ITERATE, isArray(target) ? 'length' : ITERATE_KEY)
  return Reflect.ownKeys(target)
}

/**下面就是组合成各种Handles并导出 */

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty, // 绑定删除逻辑
  has,
  ownKeys
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}

export const shallowReactiveHandlers = /*#__PURE__*/ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)

// Props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
export const shallowReadonlyHandlers = /*#__PURE__*/ extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)

```





#### [#](http://www.zhufengpeixun.com/jg-vue/guide/04.reactivity-2.html#编写effect函数)编写effect函数

`effect.ts`

##### ReactiveEffect

它的构造器可以接受三个参数：`fn`（副作用函数）、`scheduler`（调度器）、`scope`（一个`EffectScope`作用域对象），在构造器中调用了一个`recordEffectScope`方法，这个方法会将当前`ReactiveEffect`对象（`this`）放入对应的`EffectScope`作用域（`scope`）中。

```typescript
constructor(
  public fn: () => T,
  public scheduler: EffectScheduler | null = null,
  scope?: EffectScope
) {
  recordEffectScope(this, scope)
}
```

`ReactiveEffect`中有两个方法：`run`、`stop`。`run`函数的作用就是会调用`fn`，并返回其结果。

当调用`stop`函数后，会调用`cleanupEffect`将`ReactiveEffect`中所有的依赖删除，然后执行`onStop`钩子，最后将`this.active`置为`false`。



##### effect

<mark>effect的用户是渲染函数、computed、watch</mark>

> 每次运行effect前都会先清除一遍这个effect的依赖，清除完再去运行fn，运行fn的时候就会再收集依赖（这是为了解决[分支切换的问题](#branch-toggle)）

`effect`的作用就是将我们注册的副作用函数暂存。

`effect`可以接收两个参数，第一个参数是一个副作用函数`fn`，第二个参数是个对象（可选），该对象可以有如下属性：

- `lazy`：`boolean`，是否懒加载，如果是`true`，调用`effect`不会立即执行监听函数，需要用户手动执行
- `scheduler`：一个调度函数，如果存在调度函数，在触发依赖时，执行该调度函数
- `scope`：一个`EffectScope`作用域对象
- `allowRecurse`：`boolean`，允许递归
- `onStop`：执行`effect`里的stop()方法时就执行该方法

在`effect`中会首先检查`fn.effect`属性，如果存在`fn.effect`，那么说明`fn`已经被`effect`处理过了（即返回出去的runner），然后使用`fn.effect.fn`作为`fn`。然后`new`了一个`ReactiveEffect`对象。接着如果存在`option`对象的话，会将`options`，合并到`_effect`中。如果存在`options.scope`，会调用`recordEffectScope`将`_effect`放入`options.scope`。如果不存在`options`或`options.lazy === false`，那么会执行`_effect.run()`，进行依赖的收集。最后，会将`_effect.run`中的`this`指向它本身，这样做的目的是用户在主动执行`runner`时，`this`指针指向的是`_effect`对象，然后将`_effect`作为`runner`的`effect`属性，并将`runner`返回。

##### 源码

```js
export let activeEffect = undefined;// 当前正在执行的effect

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = [] //里面存的是有这个effect的 effectSet
  parent: ReactiveEffect | undefined = undefined // 为了解决effect嵌套的问题所以要记录自己的父亲。等自己执行完之后，将activeEffect恢复为父亲，不恢复的话那内层effect执行完之后再执行外层effect的时候发现activeEffect是内层effect，乱套了。所以嵌套场景的解决方法就是记录每一层的上下文，执行到哪一层就用哪一层的上下文(跟递归栈一样)

  /**
   * Can be attached after creation
   * @internal
   */
  computed?: ComputedRefImpl<T>
  /**
   * @internal
   */
  allowRecurse?: boolean //允许递归

  onStop?: () => void //执行`effect`里的stop()方法时就执行该方法
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    recordEffectScope(this, scope) // 记录effect，这个api就是自己写着玩的
  }

  run() {
    if (!this.active) { // 不是激活状态
      return this.fn()
    }
    let parent: ReactiveEffect | undefined = activeEffect // 此时的activeEffect还是本effect的daddy，下面给activeEffect赋值才把它变成是自己。
    let lastShouldTrack = shouldTrack
    while (parent) { // 遍历祖宗看有没有自己，如果自己在调用栈里，则本次不要执行了，避免循环调用导致堆栈溢出。
      if (parent === this) {
        return
      }
      parent = parent.parent
    }
    try {
      this.parent = activeEffect // 记录自己的父亲，如果是最外层的effect则其father为undefined，在下面一行代码之前activeEffect记录的都是上一个effect的值
      activeEffect = this // 设置成正在激活的是当前effect
      shouldTrack = true

      trackOpBit = 1 << ++effectTrackDepth

      /*每次运行effect前都会先清除一遍这个effect的依赖，清除完再去运行fn，运行fn的时候就会再收集依赖（这是为了解决分支切换的问题）*/
      if (effectTrackDepth <= maxMarkerBits) { // 对清理做的优化
        initDepMarkers(this)
      } else {
        cleanupEffect(this)
      }
      return this.fn()
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this)
      }

      trackOpBit = 1 << --effectTrackDepth

      activeEffect = this.parent // 在这一个effect执行完之后还原activeEffect为上一个effect
      shouldTrack = lastShouldTrack
      this.parent = undefined //反正前面每次进来都会重新记录一次其父亲，所以这里在这个effect执行完后设其父母为undefined以便节省内存
    }
  }

  stop() { //停止effect
    if (this.active) {
      cleanupEffect(this) //停止这个effect就是从关联了这个effect的属性的dep数组里删掉这个effect
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

/**作用是从关联了这个effect的属性的dep数组里删掉这个effect*/
function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect 
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect) //从属性的dep里删掉这个effect
    }
    deps.length = 0
  }
```



```js
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) { // 如果此函数是effect的返回的runner，则找到原函数
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn) // 创建响应式effect
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope) // 这个是3.2新增的effectScopeAPI
  }
  if (!options || !options.lazy) { // 如果是lazy的则不马上运行
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner // 返回runner
}

export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}
```









##### <span id='branch-toggle'>分支切换问题</span>

###### 问题描述

在 effectFn 函数内部存在一个三元表达式，根据字段 obj.ok 值的不同会执行不同的代码分支。这就是所谓的分支切换。

```js
01 const data = { ok: true, text: 'hello world' }
02 const obj = new Proxy(data, { /* ... */ })
03
04 effect(function effectFn() {
05   document.body.innerText = obj.ok ? obj.text : 'not'
06 })
```

分支切换可能会产生遗留的副作用函数。拿上面这段代码来说，字段 obj.ok 的初始值为 true，这时会读取字段 obj.text 的值，所以当 effectFn 函数执行时会触发字段 obj.ok 和字段 obj.text 这两个属性的读取操作，此时副作用函数 effectFn 与响应式数据之间建立的联系如下：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-16-59-image-20240110165932612.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-16-59-image-20240110165932612.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-16-59-image-20240110165932612.png" alt="image-20240110165932612" style="zoom:33%;" loading="lazy"/>
  </picture>

可以看到，副作用函数 effectFn 分别被字段 data.ok 和字段 data.text 所对应的依赖集合收集。当字段 obj.ok 的值修改为 false，并触发副作用函数重新执行后，由于此时字段 obj.text 不会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-00-image-20240110170000363.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-00-image-20240110170000363.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-00-image-20240110170000363.png" alt="image-20240110170000363" style="zoom:33%;" loading="lazy"/>
  </picture>



遗留的副作用函数会导致不必要的更新，拿下面这段代码来说：

```js
01 const data = { ok: true, text: 'hello world' }
02 const obj = new Proxy(data, { /* ... */ })
03
04 effect(function effectFn() {
05   document.body.innerText = obj.ok ? obj.text : 'not'
06 })
```

obj.ok 的初始值为 true，当我们将其修改为 false 后，这会触发更新，即副作用函数会重新执行。但由于此时 obj.ok 的值为 false，所以不再会读取字段 obj.text 的值。换句话说，无论字段 obj.text 的值如何改变，document.body.innerText 的值始终都是字符串 'not'。。但事实并非如此，如果我们再尝试修改 obj.text 的值，这仍然会导致副作用函数重新执行。





###### 解决方案

解决这个问题的思路很简单，每次副作用函数执行时，先把它从所有与之关联的依赖集合中删除：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-32-image-20240110173210689.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-32-image-20240110173210689.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-17-32-image-20240110173210689.png" alt="image-20240110173210689" style="zoom:33%;" loading="lazy"/>
  </picture>

清除完再去运行fn，运行fn的时候就会再重新收集依赖。



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/04.reactivity-2.html#依赖收集)依赖收集

`effect.ts`

> 执行`effect`时会触发响应式属性的get，则会进行依赖收集

```js
const targetMap = new WeakMap(); // 记录依赖关系
export function track(target, type, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target); // {对象：map}
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set())) // {对象：{ 属性 :[ dep, dep ]}}
        }
        let shouldTrack = !dep.has(activeEffect) //如果依赖列表里已经有这个effect就不用再加到依赖列表里了。
        if (shouldTrack) {
            dep.add(activeEffect); //在这个属性的依赖里加入这个effect
            activeEffect.deps.push(dep); // 让effect记住dep，这样后续可以用于清理
        }
    }
}
```



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/04.reactivity-2.html#触发更新)触发更新

`effect.ts`

> 触发响应式属性的set，则会触发依赖

```js
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target) 
  if (!depsMap) { // 从未收集过
    // never been tracked
    return
  }

  let deps: (Dep | undefined)[] = []
  if (type === TriggerOpTypes.CLEAR) { // 触发清理
    deps = [...depsMap.values()] // trigger all effects for target 执行所有的依赖（执行effect之前就会先把这个effect从依赖的属性的列表里删掉这个effect再去执行，所以这样执行所有依赖的同时也就删掉了所有依赖）
  } else if (key === 'length' && isArray(target))  { //如果修改的是长度
    depsMap.forEach((dep, key) => { // 如果修改的是长度，要让大于长度的依赖也放入执行
      if (key === 'length' || key >= (newValue as number)) {
        deps.push(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) { // 添加属性的时候，要触发ITERATE_KEY,用户可能写了for in
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length')) // 数组新增属性触发length更新
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY)) // delete的时候也要触发ITERATE_KEY
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const eventInfo = __DEV__
    ? { target, type, key, newValue, oldValue, oldTarget }
    : undefined

  if (deps.length === 1) {
    if (deps[0]) {
      if (__DEV__) {
        triggerEffects(deps[0], eventInfo)
      } else {
        triggerEffects(deps[0])
      }
    }
  } else {
    const effects: ReactiveEffect[] = []
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep)
      }
    }
    if (__DEV__) {
      triggerEffects(createDep(effects), eventInfo)
    } else {
      triggerEffects(createDep(effects))
    }
  }
}

export function triggerEffects( //执行dep下的所有effect
  dep: Dep | ReactiveEffect[],
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  
  for (const effect of isArray(dep) ? dep : [...dep]) {
    // if (effect !== activeEffect || effect.allowRecurse) {
      if (__DEV__ && effect.onTrigger) {
        effect.onTrigger(extend({ effect }, debuggerEventExtraInfo))
      }
      if (effect.scheduler) { //有scheduler就执行scheduler，scheduler让我们可以自己决定副作用函数执行的时机、次数、及执行方式。effect的用户是渲染函数、computed、watch，而这三位尊贵的用户就是需要调度,不用effect自身的run
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  // }
}
```





#### 停止依赖

[`scope.stop()`](packages/reactivity/src/effectScope.ts#L80-L106) 方法用于停止一个作用域内的所有响应式效果（包括计算属性和观察者）以及清理注册的清理函数。

当你调用 `scope.stop()` 时，它会执行以下操作：

1.  遍历作用域内的所有响应式效果，并调用每个效果的 `stop` 方法来停止它们。这将阻止这些效果在它们的依赖项改变时重新运行。这一步在代码中的实现可以在[这里](packages/reactivity/src/effectScope.ts#L83-L85)找到。

2.  遍历作用域内的所有清理函数，并调用它们。这些清理函数通常用于在作用域停止时执行一些清理工作，如取消定时器或移除事件监听器。这一步在代码中的实现可以在[这里](packages/reactivity/src/effectScope.ts#L86-L88)找到。

3.  如果作用域有子作用域，它会递归地停止所有子作用域。这一步在代码中的实现可以在[这里](packages/reactivity/src/effectScope.ts#L89-L93)找到。

4.  如果作用域不是分离的（即它有一个父作用域），并且它不是从父作用域停止的，那么它会从父作用域的子作用域数组中移除自己，以避免内存泄漏。这一步在代码中的实现可以在[这里](packages/reactivity/src/effectScope.ts#L95-L102)找到。

5.  最后，它会将作用域的 `active` 属性设置为 `false`，表示这个作用域已经停止。当一个响应式效果被停止时，它将不会再次被触发，即使它仍然在调度器队列(queueJobs)中。这是因为在调度器执行队列中的效果时，会检查每个效果的 `active`属性。如果一个效果的 `active` 属性为 `false`，那么这个效果将被跳过，不会被执行。这一逻辑在 [flushJobs 函数](#flushJobs)中实现。

```js
stop(fromParent?: boolean) {
    if (this._active) {
      let i, l
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop()
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]()
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true)
        }
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      this.parent = undefined
      this._active = false
    }
  }
```





#### <span id='scheduler'>Scheduler.ts(多次修改响应式数据但只会触发一次更新)</span>

##### 简介

当你更改 Vue 组件的响应式数据时，Vue 不会立即更新组件，而是将相关的更新任务(比如跟这个响应式数据相关的更新dom的任务，其实就是一个effect)添加到一个队列中。然后，Vue 会在当前同步任务完成后，异步地执行这个队列中的所有任务。watch的除了sync也会放到这个异步队列中，sync就会在响应式数据变化后同步执行。



##### 优点

如果你同步的多次更改同一个响应式数据，Vue 只会执行一次更新(一次DOM更新)。

这是因为当一个响应式数据发生变化时，Vue 会将相关的响应式效果（例如计算属性或观察者）添加到一个队列中，然后在事件循环的下一个微任务中执行这个队列。这个过程是通过 queueJob和 flushJobs 函数来实现的。

如果你在同一事件循环中多次更改同一个响应式数据，那么这个数据相关的响应式效果会被多次添加到队列中。但是，queueJob 函数在添加一个效果到队列中之前，会先检查队列中是否已经存在这个效果。如果存在，那么新的效果就不会被添加到队列中。这就确保了每个效果在每个事件循环中只会被执行一次，即使它的依赖项被多次更改。





##### queueJob

[`queueJob`](packages/runtime-core/src/scheduler.ts#L78-L99) 函数用于将一个任务（`job`）添加到调度器的队列中。当一个响应式依赖项发生变化时，依赖于它的响应式效果(effect)会被添加到调度器的队列中。

在 `queueJob` 函数中，首先会调用 `Array.prototype.includes` 方法检查队列中是否已经存在相同的任务。如果存在，那么新的任务就不会被添加到队列中。

如果任务有一个 `id` 属性，那么会根据id确定作业在队列中的位置。（这个 `id` 通常是组件实例的 `uid`，它可以确保组件的更新操作按照组件的创建顺序进行。所以先执行父组件再执行子组件，wath的pre回调会在本组件更新之前调用）

最后，如果这是队列中的第一个任务，或者当前没有正在进行的刷新操作，那么会调用 `queueFlush` 函数来安排一个刷新操作。在刷新操作中，队列中的所有任务都会被执行。

```js
export function queueJob(job: SchedulerJob) {
  // the dedupe search uses the startIndex argument of Array.includes()
  // by default the search index includes the current job that is being run
  // so it cannot recursively trigger itself again.
  // if the job is a watch() callback, the search will start with a +1 index to
  // allow it recursively trigger itself - it is the user's responsibility to
  // ensure it doesn't end up in an infinite loop.
  if (
    !queue.length ||
    !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )
  ) {
    if (job.id == null) {
      queue.push(job)
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job)
    }
    queueFlush()
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs) //Vue.js 使用了一个微任务队列来处理所有的异步任务
  }
}
// #2768
// Use binary-search to find a suitable position in the queue,
// so that the queue maintains the increasing order of job's id,
// which can prevent the job from being skipped and also can avoid repeated patching.
function findInsertionIndex(id: number) {
  // the start index should be `flushIndex + 1`
  let start = flushIndex + 1
  let end = queue.length

  while (start < end) {
    const middle = (start + end) >>> 1
    const middleJobId = getId(queue[middle])
    middleJobId < id ? (start = middle + 1) : (end = middle)
  }

  return start
}
```



##### <span id="flushJobs">flushJobs</span>

flushJobs 函数用于执行任务队列中的任务。在执行任务队列中的任务之前，那些 `pre` 属性为 `true` 的任务会被放到渲染的effect之前(queue.sort里干的)。这意味着，如果你将 `job.pre` 设置为 `true` 并将任务添加到任务队列中，那么这个任务就会在这个响应式数据导致的渲染effect之前执行。

```js
function flushJobs(seen?: CountMap) {
  isFlushPending = false
  isFlushing = true
  if (__DEV__) {
    seen = seen || new Map()
  }

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child so its render effect will have smaller
  //    priority number)
  // 2. If a component is unmounted during a parent component's update,
  //    its update can be skipped.
  queue.sort(comparator) // 在执行任务队列中的任务之前，queue.sort(comparator) 会根据 comparator 函数对任务队列进行排序。


  // conditional usage of checkRecursiveUpdate must be determined out of
  // try ... catch block since Rollup by default de-optimizes treeshaking
  // inside try-catch. This can leave all warning code unshaked. Although
  // they would get eventually shaken by a minifier like terser, some minifiers
  // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : NOOP

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) { // 在调度器执行队列中的效果时，会检查每个效果的 `active`属性。如果一个效果的 `active` 属性为 `false`，那么这个效果将被跳过，不会被执行。所以当一个响应式效果被停止时（执行了scope.stop），它将不会再次被触发，即使它仍然在调度器队列(queueJobs)中。
        if (__DEV__ && check(job)) {
          continue
        }
        // console.log(`running:`, job.id)
        callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
      }
    }
  } finally {
    flushIndex = 0
    queue.length = 0

    flushPostFlushCbs(seen) 

    isFlushing = false
    currentFlushPromise = null
    // some postFlushCb queued jobs!
    // keep flushing until it drains.
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}
const comparator = (a: SchedulerJob, b: SchedulerJob): number => {
  const diff = getId(a) - getId(b)
  if (diff === 0) {
    if (a.pre && !b.pre) return -1
    if (b.pre && !a.pre) return 1
  }
  return diff
}
```





##### invalidateJob 从队列中删除jobs

```js
// 从队列中删除该方法:
export function invalidateJob(job: SchedulerJob) {
  const i = queue.indexOf(job)
  if (i > flushIndex) {
    queue.splice(i, 1)
  }
}
```







#### 其他API

```ts
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW]) //所以即使该对象先被reactive包裹了一层然后再被readonly包裹了一层也能被监测出是reactive。
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

export function isShallow(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_SHALLOW])
}

export function isProxy(value: unknown): boolean {
  return isReactive(value) || isReadonly(value)
}

export function toRaw<T>(observed: T): T { //传进来一个proxy对象，访问这个对象的的ReactiveFlags.RAW属性，触发get之后判断知道是访问这个属性就从reactiveMap（在执行reactive的时候缓存target与proxy的对应关系）中拿到这个proxy对应的原对象。有可能proxy对应的还是一个proxy，那么就递归，如果不是proxy了就直接返回
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

export function markRaw<T extends object>(value: T): T { //通过Object.defineProperty给这个对象添加一个属性ReactiveFlags.SKIP（这个属性不可枚举），其值为true。
  def(value, ReactiveFlags.SKIP, true)
  return value
}

export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

export const toReadonly = <T extends unknown>(value: T): T =>
  isObject(value) ? readonly(value as Record<any, any>) : value
```





### Computed & Watch

#### Computed实现原理

`computed`本质也是个`ref`（`ComputedRefImpl`）。



如何实现缓存(能反映computed的原理)：

一句话总结：

用dirty这个变量去记录，computed会成为响应式数据的依赖，如果数据变了则会将dirty置为true。访问computed(computed本身也是一个ref)的时候会先判断dirty，若为true则执行computed里的方法获得最新值并缓存起来，为false则直接返回之前的值。dirty的初始值为true。



详细：

假设计算属性的计算与响应式对象的a、b两个属性有关，那么第一次访问计算属性时由于初始化_dirty为true所以会将`computed`中生成的`ReactiveEffect`实例，于是该effect就被收集到`targetMap[obj].a`、`targetMap[obj].b`中，<mark>一旦`a`或`b`属性变化了，会触发该依赖，而在依赖的触发过程中会执行调度函数，在调度函数中会将脏数据的标识`_dirty`设置为`true`，并触发计算属性的依赖。</mark>那么在下一次访问计算属性的时候，由于`_dirty`为`true`，便会调用计算属性中的`effect.run`方法重新计算值(此时不走调度器了)。调用`effect.run`后就会将`_dirty`置为false。下次访问值时发现为false，那就直接取值，不会再执行effect。

```js
/**
* 记住计算属性是一条线：依赖的属性发生变化 -> 计算属性发生变化 -> 视图变化
1. 从`getterOrOptions`中确定`getter`、`setter`（如果`getterOrOptions`是个`function`，说明`computed`是不可写的，所以会将`setter`设置为一个空函数），确定好之后，创建一个`ComputedRefImpl`实例，并将其返回。
2. 在构造器中声明了一个`ReactiveEffect`，并将`getter`和一个调度函数作为参数传入
*/

import { isFunction } from "@vue/shared";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
    public effect; //创建依赖属性的effect，get计算属性或者依赖属性发生变化时就会触发这个effect
    public _value; //用于保存getter函数的执行结果
    public dep = new Set; //存放依赖它自己的effect（可理解为视图层的effect）
    public _dirty = true; // 实现缓存的功能，如果新值跟旧值一样则_dirty为false（因为拦截的set方法里就有新值跟旧值比较的逻辑，所以新旧值一样的话就不会触发effect，触发了effect就会把_dirty设为true，然后在取计算属性的时就会重新计算）

    constructor(getter, public setter) {
        
        this.effect = new ReactiveEffect(getter,()=>{ //创建ReactiveEffect时，将用户的getter放到此effect中，且传入`scheduler`函数，稍后依赖的属性变化时就是调用此方法
            if(!this._dirty){
                this._dirty = true; //因为是这个effect依赖的属性发生变化时才会触发这个effect，而依赖的属性发生变化的话那这个计算属性也应该发生变化，所以将dirty设为true，等到要取计算属性的值时再执行一次effect来取计算属性最新的值
                triggerEffects(this.dep) //依赖的属性发生变化时触发这些effect（可理解为视图层的effect）
            }
        });
    }

    //类中的属性访问器，其底层就是Object.defineProperty()
    get value(){ // 取值的时候进行依赖收集，并更新自己的值返回一个新的值
    		const self = toRaw(this)// the computed ref may get wrapped by other proxies e.g. readonly() #3376
        trackEffects(self.dep); //收集此时的activeEffect（可理解为视图层的effect）
        if(self._dirty){ // 因为要取这个计算属性的值，所以先判断是不是脏了，如果是脏值, 则执行effect取新值
            self._dirty = false;
            self._value = self.effect.run(); //执行自己的effect返回一个新值
        }
        return self._value; 
    }
    set value(newValue){
        this.setter(newValue)
    }
}
export function computed(getterOrOptions) { // 传入的有可能是对象或函数
    const onlyGetter = isFunction(getterOrOptions); // 传入的是函数那么这个函数就是getter
    let getter;
    let setter;
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => { }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    
    return new ComputedRefImpl(getter, setter) // 创建计算属性，返回这么一个对象，需要通过.value去获取他的值
}
```







#### [#](http://www.zhufengpeixun.com/jg-vue/guide/05.reactivity-3.html#watchapi实现原理)WatchAPI实现原理

##### watch

把source组装成effect需要的getter函数，如果非immediate则执行一遍这个getter函数，且job作为scheduler，这样那个属性就会把job作为依赖收集进去了。如果immediate则直接执行job()（job里会执行这个getter和watch的cb）。

```ts
export function watch(  source,cb,options?){
	return doWatch(source as any, cb, options)
}
```

##### watchEffect

立即执行一遍effect就会被依赖收集了。

```ts
export function watchEffect( //带有 `flush: 'pre'` 选项。默认情况下你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。
  effect: WatchEffect,
options?: WatchOptionsBas
): WatchStopHandle {
  return doWatch(effect, null, options)
}

export function watchPostEffect( //`watchEffect` 的别名，带有 `flush: 'post'` 选项。设置 flush: 'post' 将会使侦听器延迟到组件渲染之后再执行。如果想在侦听器回调中能访问被 Vue 更新之后的DOM，你需要指明 flush: 'post' 选项
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'post' })
      : { flush: 'post' }) as WatchOptionsBase
  )
}

export function watchSyncEffect( //`watchEffect` 的别名，带有 `flush: 'sync'` 选项。在响应式依赖发生改变时立即触发侦听器。
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    (__DEV__
      ? Object.assign(options || {}, { flush: 'sync' })
      : { flush: 'sync' }) as WatchOptionsBase
  )
}
```



##### [doWatch (watch&watchEffect)](https://blog.csdn.net/qq_38987146/article/details/123211407)

###### 主流程讲解

doWatch的核心就是观测一个响应式数据，当数据变化时通知并执行回调 （那也就是说cb本身就是一个effect）

doWatch 函数主要分为以下几个部分：

1. 把 source组装成为effect需要的 getter 函数。

   传进来的source可能是个响应式对象或者是个函数或者是个响应式对象数组，如果是响应式对象，则将getter赋值成一个遍历该对象的函数（遍历的时候就能收集依赖），oldValue为该对象；如果是个函数就让getter赋值成这个函数，oldValue为这个函数的返回值。

   

2. 组装 job 函数，作为effect的scheduler。

   封装一个job函数，先判断侦听的值是否有变化，再执行onInvalidata的回调函数，再执行effect，newValue就是effect执行后返回的结果，再调用watch传进来的回调函数，最后把newValue赋值给oldValue。

   

3. 组装 scheduler 函数。

   scheduler 负责在合适的时机调用 job 函数（根据 options.flush，即副作用刷新的时机）,默认在组件更新前执行

4. 开启侦听。

   新建一个effect对象，传进去getter和scheduler。<mark>先运行一次effect.run()执行一下getter使属性把这个effect收集进去。watch就是相当于手动把一个函数作为一个响应式对象的副作用</mark>

5. 返回停止侦听函数

   清除依赖



###### 配置：flush

sync会在响应式数据变化后同步执行(immediate也是同步执行)，post和pre会放到异步队列中。详情看[scheduler](#scheduler)



###### 手写实现

```js
export function doWatch(source,cb){ //source可以是响应式对象或者是一个函数
    let getter;
    if(isReactive(source)){ // 如果是响应式对象
        getter = () => traverse(source)// 包装成effect对应的fn
    }else if(isFunction(source)){
        getter = source // 如果是函数则让函数作为effect的fn即可
    }
  
  /*下面这三个值作为闭包传入到job函数里面*/
    let oldValue; 
    let cleanup;
    let onCleanup = (fn) =>{
        cleanup = fn;
    }
    
    const job = () =>{//（job里会执行getter和watch的cb）
        const newValue = effect.run(); // 运行effect函数获取新值
      	if(cleanup) cleanup(); // 同一个watch的回调执行前先调用上次触发时注册的清空函数(用以处理多次调用的问题)
        cb(newValue,oldValue，onCleanup);// 传入onCleanup函数
        oldValue = newValue
    }
    const effect = new ReactiveEffect(getter,job) // 创建effect
    if(immediate){ // 需要立即执行，则同步执行任务，此时oldValue为undefined
        job();
    }else{
        oldValue = effect.run(); //先执行一遍让属性收集依赖（把这个effect收集进去）， 并且保存这次的值，这次的值相对于下一次来说就是个老值
    }
    return () => { //返回停止侦听函数（所谓停止就是把这个effect从属性的依赖列表中删去）
    	effect.stop()
  }
}

function traverse(value,seen = new Set()){
    if(!isObject(value)){
        return value
    }
    if(seen.has(value)){
        return value;
    }
    seen.add(value);
    for(const k in value){ // 递归 访问属性（访问属性就可以触发属性的get那就可以收集依赖）
        traverse(value[k],seen)
    }
    return value
}
export function isReactive(value){
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
```





###### [#](http://www.zhufengpeixun.com/jg-vue/guide/05.reactivity-3.html#watch中cleanup实现)watch中实现cleanup的原因

> 连续触发同一个watch的异步回调时需要处理之前的watch的异步回调（具体操作是清理或者啥交由开发者决定，反正onCleanup接收一个函数）

```js
/*举例：处理竞态问题：*/
const state = reactive({ flag: true, name: 'jw', age: 30 })
let i = 2000;
function getData(timer){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(timer)
        }, timer);
    })
}
watch(()=>state.age,async (newValue,oldValue,onCleanup)=>{
    let clear = false;
    onCleanup(()=>{
        clear = true;
    })
    i-=1000;
    let r =  await getData(i); // 第一次执行1s后渲染1000， 第二次执行0s后渲染0， 最终应该是0
    if(!clear){document.body.innerHTML = r;}
},{flush:'sync'});
state.age = 31;
state.age = 32;
```
















### Ref实现原理

#### Ref的概念

<mark>proxy代理的目标必须是非基本类型</mark>，所以reactive不支持原始值类型。所以我们需要将原始值类型进行包装。

基本类型就是包一层用get和set来拦截，且会自己维护一个deps = new Set() 列表用于记录 哪些effect用到了自己。当然这个Set也会被记录到每个effect，以便effect每次执行前都能让自己摆脱所有关系，重新收集依赖。

#### [#](http://www.zhufengpeixun.com/jg-vue/guide/06.ref.html#ref-shallowref)Ref & ShallowRef

```js
function createRef(rawValue, shallow) {
    return new RefImpl(rawValue,shallow); // 将值进行装包
}

export function ref(value) { // 将原始类型包装成对象, 同时也可以包装对象 进行深层代理
    return createRef(value, false);
}

export function shallowRef(value) { // 创建浅ref 不会进行深层代理
    return createRef(value, true);
}
```

#### ref的核心就是 RefImpl

ref接收到对象就丢给reactive

```js
function toReactive(value) { // 如果是对象就给他调用reactive
    return isObject(value) ? reactive(value) : value
}
class RefImpl {
    public _value;
    public dep;
    public __v_isRef = true;
    constructor(public rawValue, public _shallow) {
        this._value = _shallow ? rawValue : toReactive(rawValue); // 浅ref不需要再次代理
    }
    get value(){
        if(activeEffect){
            trackEffects(this.dep || (this.dep = new Set)); // 收集这个activeEffect
        }
        return this._value;
    }
    set value(newVal){
        if(newVal !== this.rawValue){ // 拦截的set这里就会判断只有新值跟旧值不同时才会触发更新
            this.rawValue = newVal;
            this._value = this._shallow ? newVal : toReactive(newVal);
            triggerEffects(this.dep); // 触发更新
        }
    }
}
```



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/06.ref.html#toref-torefs)toRef & toRefs

直接取响应式对象里的属性 或者 将响应式对象展开 会导致响应式丢失，所以使用toRef 和 toRefs

```js
class ObjectRefImpl {
    public __v_isRef = true
    constructor(public _object, public _key) { }//_object就是原对象，_key就是原属性
    get value() {
        return this._object[this._key]; //返回原对象上的值
    }
    set value(newVal) {
        this._object[this._key] = newVal; //在原对象上改值
    }
}
export function toRef(object, key) { // 将响应式对象中的某个属性再外包一层成为ref再返回这个ref对象
    return new ObjectRefImpl(object, key);
}
export function toRefs(object) { // 将所有的属性调用toRef，再返回一个新对象
    const ret = Array.isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
```







#### [#](http://www.zhufengpeixun.com/jg-vue/guide/06.ref.html#自动脱ref)自动脱ref

这样你在外面用的时候就不用再.value了

例如：

```js
let person = proxyRefs({...toRefs(state)}) //本来person里的属性都是ref对象，都要用.value去取值的，但是由于proxyRefs了一下，那就可以不用.value了
effect(()=>{
    document.body.innerHTML = person.name +'今年' + person.age +'岁了'
})
```

实现：

```js
export function proxyRefs(objectWithRefs){ // 传进来的参数是一个带有ref对象属性的对象
    return new Proxy(objectWithRefs,{// 如果是ref 则取ref.value，如果不是ref则直接返回这个值
        get(target,key,receiver){
            let v = Reflect.get(target,key,receiver);
            return v.__v_isRef? v.value:v; 
        },
        set(target,key,value,receiver){ // 设置的时候如果是ref,则给ref.value赋值
            const oldValue = target[key];
            if(oldValue.__v_isRef){
                oldValue.value = value;
                return true
            }else{
                return Reflect.set(target,key,value,receiver)
            }
        }
    })
}
```











##  Vue模版编译原理

### 流程

Vue.js 模板编译器的目标代码其实就是渲染函数。详细而言，Vue.js 模板编译器会首先对模板进行词法分析和语法分析，得到模板 AST。接着，将模板AST 转换（transform）成 JavaScript AST。最后，根据 JavaScript AST 生成JavaScript 代码，即渲染函数代码。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-17-35-image-20240112173507390.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-17-35-image-20240112173507390.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-17-35-image-20240112173507390.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-17-35-image-20240112173507390.png" loading="lazy"/>
  </picture>







### 本质

<mark>编译器的主要作用是将模板编译为渲染函数。（这个渲染函数就是一个抽象概念指传递给渲染器的东西，[看这](#render-pipline)）</mark>。模板编译又分三个阶段，解析parse，优化optimize，生成generate，最终生成可执行函数render。<mark>SFC模版写法编译完之后就是 defineComponent(...)。你也可以直接写defineComponent(一般如果这样写都是用defineComponent里加jsx，谁会写h()啊，难写的一逼)。</mark>

- **解析阶段**：使用大量的正则表达式对template字符串进行解析，将标签、指令、属性等转化为抽象语法树AST。
- **优化阶段**：遍历AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。
- **生成阶段**：将最终的AST转化为render函数字符串。

无论是使用模板还是直接手写渲染函数，对于一个组件来说，它要渲染的内容最终都是通过渲染函数产生的，然后渲染器再把渲染函数返回的虚拟 DOM 渲染为真实 DOM，这就是模板的工作原理，也是 Vue.js 渲染页面的流程。



编译器和渲染器之间是存在信息交流的，它们互相配合使得性能进一步提升，而<mark>它们之间交流的媒介就是虚拟 DOM 对象。</mark>Vue.js 的模板是可以看出 id="foo"是永远不会变化的，而 :class="cls" 是一个 v-bind 绑定，它是可能发生变化的。所以编译器能识别出哪些是静态属性，哪些是动态属性，在生成虚拟dom的时候完全可以附带这些信息。这样就可以让渲染器知道哪些是需要更新变化的，那些事不需要的，就不用渲染器再去找了。



编译完的结果（这是vite插件编译后的结果，应该直接用vue源码里的compiler来试）：

导出 _sfc_main 和 _sfc_render()方法

```js
import {defineComponent as _defineComponent} from "/node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.js?v=edb65515";
import DycComponent from "/src/views/Dyc.vue";
import {ref} from "/node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.js?v=edb65515";
const _sfc_main = /* @__PURE__ */_defineComponent({
    __name: "App",
    setup(__props, {expose: __expose}) {
        __expose();
        console.log("dyc try to script something");
        const a = ref(1);
        function handleClick() {
            console.log("click");
        }
        const __returned__ = { // 数据和方法和子组件都会返回出去
            a,
            handleClick,
            DycComponent
        };
        Object.defineProperty(__returned__, "__isScriptSetup", {
            enumerable: false,
            value: true
        });
        return __returned__;
    }
});
import {toDisplayString as _toDisplayString, createVNode as _createVNode, createTextVNode as _createTextVNode, openBlock as _openBlock, createElementBlock as _createElementBlock} from "/node_modules/.pnpm/vue@3.3.4/node_modules/vue/dist/vue.runtime.esm-bundler.js?v=edb65515";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return _openBlock(),
    _createElementBlock("div", {
        onClick: $setup.handleClick
    }, [_createTextVNode(" App this is a text " + _toDisplayString($setup.a) + " ", 1 /* TEXT */
    ), _createVNode($setup["DycComponent"])]);
}
import "/src/App.vue?vue&type=style&index=0&scoped=7a7a37b1&lang.css";
import _export_sfc from "/@id/__x00__plugin-vue:export-helper";
export default /* @__PURE__ */_export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7a7a37b1"], ["__file", "/Users/yonecdeng/storage/source/test/vite-vue-test/src/App.vue"]]); 
```







### 为什么 Vue 推荐使用模板

1. 模板更贴近实际的 HTML，可读性更好。
2. 由于其确定的语法，更容易对模板做静态分析。这使得 Vue 的模板编译器能够应用许多编译时优化来提升虚拟 DOM 的性能表现
3. 模版对于虚拟dom的性能提升：看官网https://cn.vuejs.org/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom





### 指令

#### 内置指令

#####  v-if、v-show、v-html 的原理

- `v-if` 指令在编译过程中被转换为一个条件表达式。具体的转换过程在 transformIf 函数中进行。

  在编译过程中，`v-if`、`v-else-if` 和 `v-else` 被转换为一个 `IfNode`，它包含一个 `branches` 数组，每个分支对应一个 `IfBranchNode`。每个 `IfBranchNode` 包含一个条件表达式和一个子树。

  在生成代码阶段，`IfNode` 会被转换为一个条件表达式，具体的转换过程在 createCodegenNodeForBranch 函数中进行。这个函数会根据 `IfBranchNode` 的条件和子树生成一个 JavaScript 的三元表达式。

  在运行时，patch 函数会根据这个条件表达式来决定是否渲染对应的子树。如果条件为真，就会渲染对应的子树，否则就会跳过。当条件发生变化时，`patch` 函数会被再次调用，以更新 DOM。

  以下是一个简单的例子，编译后的代码大致如下：

  ```javascript
  _createVNode(
    _createBlock(
  		_Fragment,
      [
        (condition)
          ? _createVNode("div", null, "Hello")
          : null
      ],
      PatchFlags.IF
    )
  )
  ```
  
- v-show会生成vnode，render的时候也会渲染成真实节点，只是在render过程中会在节点的属性中修改show属性值，也就是常说的display； 

- v-html会先移除节点下的所有节点，调用html方法，通过addProp添加innerHTML属性，归根结底还是设置innerHTML为v-html的值。





### `<style>`

写在`<style>`里面的样式的最后那个层级都会带上属性选择器。模版编译的时候写在`<template>`里的每个元素都会带上一个自定义属性，而v-html里不会带上自定义属性，所以写在style里的样式不会在v-html里生效。

解决方法：可以用`:deep(xxx)`使得xxx编译出来之后不带上属性选择器。然后它的上一级会带上属性选择器。

反正就是总会有“最后一级”带上属性选择器：

```less
/*编译前*/
.remind-popup{
  .sub-title{
    :deep(span){}
  }
}

/*编译后*/
.remind-popup[data-v-3c8945e3] {}
.remind-popup .sub-title[data-v-3c8945e3] {}
.remind-popup .sub-title[data-v-3c8945e3] span {}/*:deep(span)*/

/*如果没有:deep()*/ .remind-popup .sub-title span[data-v-3c8945e3] {}
```





## Vue3渲染原理

### <mark><span id='render-pipline'>渲染管线</span></mark>

从高层面的视角看，Vue 组件挂载时会发生如下几件事：

1. **编译**：Vue 模板被编译为**渲染函数**：即用来返回虚拟 DOM 树的函数。这一步骤可以通过构建步骤提前完成，也可以通过使用运行时编译器即时完成。
2. **挂载**：运行时渲染器调用渲染函数，遍历返回的虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为[响应式副作用](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)执行，因此它会追踪其中所用到的所有响应式依赖。
3. **更新**：当一个依赖发生变化后，副作用会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去。

！！下图巨重要：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-12-53-image-20240110125259081.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-12-53-image-20240110125259081.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-12-53-image-20240110125259081.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-10-12-53-image-20240110125259081.png" loading="lazy"/>
  </picture>











### 渲染器

#### 渲染器的作用

<mark>把虚拟 DOM 对象渲染为真实 DOM 元素。</mark>

递归地遍历虚拟 DOM 对象，并调用原生DOM API 来完成真实 DOM 的创建。渲染器的精髓在于后续的更新，它会通过Diff 算法找出变更点，并且只会更新需要更新的内容。

渲染器与渲染是不同的。渲染器是更加宽泛的概念，它包含渲染。渲染器不仅可以用来渲染，还可以用来激活已有的 DOM 元素，这个过程通常发生在同构渲染的情况下。



#### 渲染器 renderer的实现思路

##### 总体三步

● 创建元素：把 vnode.tag 作为标签名称来创建 DOM 元素。

● 为元素添加属性和事件：遍历 vnode.props 对象，如果 key 以 on 字符开头，说明它是一个事件，把字符 on 截取掉后再调用 toLowerCase 函数将事件名称小写化，最终得到合法的事件名称，例如 onClick 会变成 click，最后调用addEventListener 绑定事件处理函数。

● 处理 children：如果 children 是一个数组，就递归地调用 renderer 继续渲染，且此时我们要把刚刚创建的元素作为挂载点（父节点）；如果 children 是字符串，则使用 createTextNode 函数创建一个文本节点，并将其添加到新创建的元素内。



##### 渲染

最简单的一个渲染：

```js
01 function render(domString, container) {
02   container.innerHTML = domString
03 }
```



渲染执行挂载和打补丁操作，对于新的元素，渲染器会将它挂载到容器内；对于新旧 vnode 都存在的情况，渲染器则会执行打补丁操作，即对比新旧 vnode，只更新变化的内容。

● 在首次渲染时，渲染器会将 vnode1 渲染为真实 DOM。渲染完成后，vnode1会存储到容器元素的 container._vnode 属性中，它会在后续渲染中作为旧 vnode 使用。

● 在第二次渲染时，旧 vnode 存在，此时渲染器会把 vnode2 作为新 vnode，并将新旧 vnode 一同传递给 patch 函数进行打补丁。

● 在第三次渲染时，新 vnode 的值为 null，即什么都不渲染。但此时容器中渲染的是 vnode2 所描述的内容，所以渲染器需要清空容器。从上面的代码中可以看出，我们使用 container.innerHTML = '' 来清空容器。需要注意的是，这样清空容器是有问题的，不过这里我们暂时使用它来达到目的。

```js
 function createRenderer() {
   function render(vnode, container) {
     if (vnode) {
       // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数，进行打补丁
       patch(container._vnode, vnode, container)
     } else {
       if (container._vnode) {
         // 旧 vnode 存在，且新 vnode 不存在，说明是卸载（unmount）操作
         // 只需要将 container 内的 DOM 清空即可
         container.innerHTML = ''
       }
     }
     // 把 vnode 存储到 container._vnode 下，即后续渲染中的旧 vnode
     container._vnode = vnode
   }

   function hydrate(vnode, container) {
     // ...
   }

   return {
     render,
     hydrate
   }
 }
```







##### 挂载

渲染器把虚拟 DOM 节点渲染为真实 DOM 节点的过程叫作**挂载**，通常用英文mount 来表达。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230109001013207.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230109001013207.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230109001013207.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230109001013207.png" loading="lazy"/>
  </picture>







#### Vue3的自定义渲染器使用

渲染器的作用是把虚拟DOM渲染为==特定平台==上的真实元素。在浏览器中，渲染器调用浏览器的api，小程序就调用小程序的API。



vue是这么实现的：把用于操作 DOM 的 API 封装为一个对象，并把它传递给createRenderer 函数。这样，在 mountElement 等函数内就可以通过配置项来取得操作 DOM 的 API 了

```js
01 // 在创建 renderer 时传入配置项
02 const renderer = createRenderer({
03   // 用于创建元素
04   createElement(tag) {
05     return document.createElement(tag)
06   },
07   // 用于设置元素的文本节点
08   setElementText(el, text) {
09     el.textContent = text
10   },
11   // 用于在给定的 parent 下添加指定元素
12   insert(el, parent, anchor = null) {
13     parent.insertBefore(el, anchor)
14   }
15 })
```



```js
01 function createRenderer(options) {
02
03   // 通过 options 得到操作 DOM 的 API
04   const {
05     createElement,
06     insert,
07     setElementText
08   } = options
09
10   // 在这个作用域内定义的函数都可以访问那些 API
11   function mountElement(vnode, container) {
12     // ...
13   }
14
15   function patch(n1, n2, container) {
16     // ...
17   }
18
19   function render(vnode, container) {
20     // ...
21   }
22
23   return {
24     render
25   }
26 }
```





#### 原生事件

事件可以视作一种特殊的属性，约定在 vnode.props 对象中，凡是以字符串 on 开头的属性都视作事件。<mark>vue会屏蔽所有绑定时间晚于事件触发时间的 事件处理函数的执行。</mark>



在绑定事件时，我们可以绑定一个伪造的事件处理函数 invoker，然后把真正的事件处理函数设置为 invoker.value 属性的值。这样当更新事件的时候，我们将不再需要调用 removeEventListener 函数来移除上一次绑定的事件，只需要更新invoker.value 的值即可。（这是为了提高在同一个元素上频繁增删同一个事件时的性能，如果你只增加一次这个事件，以后再也不搞那直接removeEventListener）

```js
01 const vnode = {
02   type: 'p',
03   props: {
04     // 使用 onXxx 描述事件
05     onClick: () => {
06       alert('clicked')
07     }
08   },
09   children: 'text'
10 }
```





#### 子节点

vnode.children 属性只能有如下三种类型。

● 字符串类型：代表元素具有文本子节点。

● 数组类型：代表元素具有一组子节点。

● null：代表元素没有子节点。在更新时，新旧 vnode 的子节点都有可能是以上三种情况之一，所以在执行更新时一共要考虑九种可能。但落实到代码中，我们并不需要罗列所有情况。另外，当新旧 vnode 都具有一组子节点时，我们采用了比较笨的方式来完成更新，即卸载所有旧子节点，再挂载所有新子节点。更好的做法是，通过 Diff 算法比较新旧两组子节点，试图最大程度复用 DOM 元素。





#### 处理多根节点

为片段创建唯一标识，即 Fragment。对于 Fragment 类型的 vnode 的来说，它的children 存储的内容就是模板中所有根节点。

从本质上来说，渲染Fragment 与渲染普通元素的区别在于，Fragment 本身并不渲染任何内容，所以只需要处理它的子节点即可。

```js
01 const Fragment = Symbol()
02 const vnode = {
03   type: Fragment,
04   children: [
05     { type: 'li', children: 'text 1' },
06     { type: 'li', children: 'text 2' },
07     { type: 'li', children: 'text 3' }
08   ]
09 }
```



当卸载 Fragment 类型的虚拟节点时，由于 Fragment 本身并不会渲染任何真实DOM，所以只需要遍历它的 children 数组，并将其中的节点逐个卸载即可。

```js
01 function unmount(vnode) {
02   // 在卸载时，如果卸载的 vnode 类型为 Fragment，则需要卸载其 children
03   if (vnode.type === Fragment) {
04     vnode.children.forEach(c => unmount(c))
05     return
06   }
07   const parent = vnode.el.parentNode
08   if (parent) {
09     parent.removeChild(vnode.el)
10   }
11 }
```



文本节点和注释节点同理：利用 symbol 类型值的唯一性，为文本节点和注释节点分别创建唯一标识，并将其作为vnode.type 属性的值。







#### key

key 属性就像虚拟节点的“身份证”号，只要两个虚拟节点的 type 属性值和 key 属性值都相同，即可以<mark>进行 DOM 的复用。主要用于优化dom移动场景</mark>>(比如列表排序发生变化)：有 key 的话就能够明确知道新子节点和旧子节点中的对应关系，这样就可以进行相应的DOM 移动操作，而不是通过增删dom去完成新的排序。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-15-14-image-20240112151437654.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-15-14-image-20240112151437654.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-15-14-image-20240112151437654.png" alt="image-20240112151437654" style="zoom:33%;" loading="lazy"/>
  </picture>

DOM 可复用并不意味着不需要更新，如下面的两个虚拟节点所示：

```js
01 const oldVNode = { type: 'p', key: 1, children: 'text 1' }
02 const newVNode = { type: 'p', key: 1, children: 'text 2' }
```

所以仍需要对这两个虚拟节点进行打补丁操作，因为新的虚拟节点（newVNode）的文本子节点的内容已经改变了（由 'text 1' 变成 'text 2'）。因此，在移动 DOM 之前，需要先完成打补丁操作









### Runtime DOM

#### 创建runtime-dom包

runtime-dom 针对==浏览器==运行时，包括DOM API 、属性、事件处理等

**runtime-dom/package.json**

```json
{
    "name": "@vue/runtime-dom",
    "main": "index.js",
    "module": "dist/runtime-dom.esm-bundler.js",
    "unpkg": "dist/runtime-dom.global.js",
    "buildOptions": {
        "name": "VueRuntimeDOM",
        "formats": [
        "esm-bundler",
        "cjs",
        "global" //这个包可以单独拿出来用的时候就打包成global
        ]
    }
}
```

为了打包出这个包，项目最外层的package.json要改动：

```json
  "scripts": {
    "dev": "node scripts/dev.js runtime-dom -f global" // 让他打包runtime-dom
  },
```



#### 节点的常用操作

`runtime-dom/src/nodeOps` 这里存放常见DOM操作API。

> 不同运行时 提供的具体实现不一样，最终将操作方法传递到`runtime-core`中，所以`runtime-core`不需要关心平台相关代码~

```js
export const nodeOps = {
    insert: (child, parent, anchor=null) => { // 添加节点
        parent.insertBefore(child, anchor); //当anchor为null时 insertBefore等价于appendChild
    },
    remove: child => { // 节点删除
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    createElement: (tag) => document.createElement(tag),// 创建节点
    createText: text => document.createTextNode(text),// 创建文本
    setText: (node, text) => node.nodeValue = text, //  设置文本节点内容
    setElementText: (el, text) => el.textContent = text, // 设置文本元素中的内容
    parentNode: node => node.parentNode, // 父亲节点
    nextSibling: node => node.nextSibling, // 下一个节点
    querySelector: selector => document.querySelector(selector) // 搜索元素
}
```

#### 比对Dom属性的方法

`runtime-dom/src/patchProp` 这里存放比对Dom属性的方法

```js
import {patchAttr} from './modules/attr'
import {patchClass} from './modules/class'
import {patchEvent} from './modules/event'
import {patchStyle} from './modules/style'
export const patchProp = (el, key, prevValue, nextValue) => {
    if (key === 'class') {
        patchClass(el, nextValue) //类名直接用新类名覆盖即可
    } else if (key === 'style') {
        patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) { //事件
        patchEvent(el, key, nextValue)
    } else {
        patchAttr(el, key, nextValue) //跟class的逻辑一样
    }
}
```

`runtime-dom/src/modules`下建立以下四个文件 

##### 操作类名

```js
export function patchClass(el, value) { // 根据最新值设置类名
    if (value == null) {
        el.removeAttribute('class');
    } else {
        el.className = value;
    }
}
```



##### 操作样式

```js
export function patchStyle(el, prev, next) { // 更新style
    const style = el.style; //style是个对象
    for (const key in next) { // 用最新的直接覆盖掉旧的或者添加上去
        style[key] = next[key]
    }
    if (prev) {
        for (const key in prev) {// 老的有而新的没有，则删除掉老的
            if (next[key] == null) {
                style[key] = null
            }
        }
    }
}
```



##### 操作事件

```js
function createInvoker(callback) { //这样就可以当元素绑定的事件触发的函数发生改变时，不用在元素上移除改事件再重新绑定，而只是改掉属性value对应的值即可（例如之前就绑定了onClick事件执行函数a，现在我onClick事件改为执行函数b）
    const invoker = (e) => invoker.value(e); // 因为函数是一个引用类型，所以如果你改成const invoker = e=>callback(e)的话那么当你要修改函数时就变成exisitingInvoker=nextValue，那其实元素事件绑定的还是之前那个函数，因为el.addEventListener(name, invoker)里对应的还是之前那个引用地址。
    invoker.value = callback;
    return invoker;
}

export function patchEvent(el, eventName, nextValue) {  // 更新事件
    const invokers = el._vei || (el._vei = {}); //获取这个元素上已经绑定的事件及其函数（对象里key是事件名，value为其对应触发的函数）， vue给元素加了一个属性_vei(vue event invoker)记录这个元素上绑定了哪些事件
    const exisitingInvoker = invokers[eventName]; // 如果这个事件本来就存在则获取这个事件对应的函数，不存在就获取undefind

    if (nextValue && exisitingInvoker) { // 已经绑定过该事件了
        exisitingInvoker.value = nextValue; // createInvoker函数的作用就体现在此，不用解绑事件再重新绑定
    } else {
        const name = eventName.slice(2).toLowerCase(); // 转化事件名---将‘on’去掉并且转换成小写，o nClick -> click
        if (nextValue) {// 缓存函数
            const invoker = (invokers[eventName]) = createInvoker(nextValue); //绑定一个伪造的事件处理函数invoker，把真正的事件处理函数设置为invoker.value属性的值
            el.addEventListener(name, invoker); //invoker是一个函数（引用类型）
        } else if (exisitingInvoker) { //如果新值为空 且 有老值，则将老的绑定事件移除掉
            el.removeEventListener(name, exisitingInvoker);
            invokers[eventName] = undefined
        }
    }
}
```



##### 操作属性

```js
export function patchAttr(el, key, value) { // 更新属性
    if (value == null) {
        el.removeAttribute(key);
    } else {
        el.setAttribute(key, value);
    }
}
```



####  `runtime-dom/src/index.ts`创建渲染器

最终我们在 `runtime-dom/src/index.ts`中引入写好的方法，渲染选项就准备好了。 

```js
import { nodeOps } from "./nodeOps"
import { patchProp } from "./patchProp"
import { createRenderer } from "@vue/runtime-core";

const renderOptions = Object.assign({ patchProp }, nodeOps); //配置一些domAPI 和 属性API
const renderer = createRenderer(renderOptions)
export function render(vnode, container) { 
    renderer.render(vnode,container);
}
export * from "@vue/runtime-core" //runtime-dom会把runtime-core里的方法也导出
```





### Runtime Core

#### 创建runtime-core包

runtime-core 不关心运行平台。

**runtime-core/package.json**

```json
{
    "name": "@vue/runtime-core",
    "module": "dist/runtime-core.esm-bundler.js",
    "types": "dist/runtime-core.d.ts",
    "files": [
      "index.js",
      "dist"
    ],
    "buildOptions": {
      "name": "VueRuntimeCore",
      "formats": [
        "esm-bundler",
        "cjs"
      ]
    }
}
```



#### `runtime-core/src/index.ts` 

```ts
export { createRenderer } from './renderer'
export { h } from './h'
export * from './vnode'
```











#### 虚拟节点的实现

> *虚拟dom就是一个对象，用于diff算法；不用真实dom来执行diff算法是因为真实dom的属性太多了*
>
> 虚拟节点三要素： 元素类型 type 	元素包含哪些属性 props	   元素包含的子节点 children

##### 节点组合标识

通过组合 来 描述虚拟节点的类型

`shared/src/index.ts`

```js
export const enum ShapeFlags { //利用二进制位运算来实现组合标识： 同时标识出该元素自身是什么类型的节点 和 标识出该元素包含的是数组子节点还是只有一个子节点
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}
```



##### createVNode实现

`runtime-core/src/vnode.ts` 

```js
import { isString, ShapeFlags } from "@vue/shared";
export const Text = Symbol('Text') //用来处理文本节点：h(Text,'123) 或 h('h1',['223','123'])
export function isVNode(value: any){
    return !!(value?.__v_isVNode)
}
export const createVNode = (type,props,children = null)=>{
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT:0; //我这里手写只考虑节点是element的情况
    const vnode = { //虚拟dom就是一个对象，用于diff算法；不用真实dom来执行diff算法是因为真实dom的属性太多了
        __v_isVNode: true,
        type, //本身是什么类型
        props,
        key: props?.['key'], //元素里面的key属性
        el: null, //对应的真实节点
        children,
        shapeFlag //同时标识出该元素自身是什么类型的节点 和 标识出该元素包含的是数组子节点还是只有一个子节点
    }
    if(children){
        let type = 0;
        if(Array.isArray(children)){
            type = ShapeFlags.ARRAY_CHILDREN;
        }else{
            children = String(children);
            type = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlag |= type // 如果shapeFlag为9 说明元素中包含一个文本； 如果shapeFlag为17 说明元素中有多个子节点
    }
    return vnode;
}
```



##### h()

###### 介绍

`h()` 用于创建虚拟节点（VNode）。它是 `createVNode` 的一个更友好的版本。它主要用于手动编写渲染函数。编译器生成的代码使用 `createVNode`，因为它是单态的，避免了额外的调用开销，并且允许指定 patchFlags 以进行优化。

它接受三个参数：`type`，`propsOrChildren` 和 `children`。`type` 参数可以是一个字符串（表示 HTML 标签名）、一个组件对象或者一个特殊的类型（如 `Fragment`、`Teleport` 等）。`propsOrChildren` 参数可以是一个 props 对象，也可以是子节点。`children` 参数是子节点。

`h()` 首先检查参数的数量，然后根据参数的类型和数量来决定如何创建 VNode。

如果只有两个参数，并且第二个参数是一个对象（并且不是数组），那么它会被视为 props 对象。如果第二个参数是一个 VNode 或者一个数组，那么它会被视为子节点。

如果有三个参数，那么第二个参数会被视为 props 对象，第三个参数会被视为子节点。

###### 使用

- 传入slots

在 `h()` 函数的调用中，你可以将 slots 对象作为第三个参数传入。这个 slots 对象应该是一个包含了各个 slot 的函数的对象。每个函数返回的值将被用作对应 slot 的内容。

例如，以下是一个使用 `h()` 函数创建一个具有默认 slot 和名为 "header" 的 slot 的组件的示例：

``` javascript
import Child from './Child.vue';
h(MyComponent, null, { // 这里不传入 props，所以为null
  default: () => 'Default slot content',
  header: h(Child)
})
```

在这个例子中，`MyComponent` 是一个 Vue 组件，`default` 和 `header` 是 slots 的名字，它们的值是一个函数，这个函数返回的值将被用作 slot 的内容。





###### 实现

```js
/**h方法的作用：对内是根据各种用户可能写的方式整合参数再调用createVNode()方法； 对外是给用户用来创建虚拟节点，具备多样性 ，我手写的支持下列几种写法：
 * h('div')
 * h('div',{style:{"color":"red"}})
 * h('div',{style:{"coler":"red"}},'hello')
 * h('div',h('span'))
 * h('div','hello')
 * h('div',[h('span'),h('span')])
 * h('div',null,'hello','world')
 * h('div',null,h('span'))
 * h('div',null,[h('span')])
 * h('div',null,'jw')
*/
import { isObject } from "@vue/shared";
import { isVNode, createVNode } from "./vnode";


export function h(type, propsOrChildren?, children?) {// 注意子节点可能是：数组、文本、null
    const l = arguments.length;
    if (l === 2) { // 只有属性，或者一个元素儿子的时候
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) { //第二个参数是引用类型但不是数组时
            if (isVNode(propsOrChildren)) { // h('div',h('span'))
                return createVNode(type, null, [propsOrChildren])
            }
            return createVNode(type, propsOrChildren);  // h('div',{style:{color:'red'}});
        } else { // 传递儿子列表的情况 或 文本儿子
            return createVNode(type, null, propsOrChildren); // h('div',[h('span'),h('span')])， h('div','hello')
        }
    }else{
        if(l > 3){ // 超过3个参数的话，除了前两个，后面的都是儿子
            children = Array.prototype.slice.call(arguments,2); //h('div',null,'hello','world')
        } else if( l === 3 && isVNode(children)){  // h('div',null,h('span'))
            children = [children]; // 儿子是元素将其包装成 [h('span')]
        }
        return createVNode(type,propsOrChildren,children) // h('div',null,'jw')，h('div',{style:{color:'red'}},[h('span'),h('span')])，h('div')
    }
}
```





#### createRenderer实现

createRenderer根据传入的参数renderOptions来建立一个渲染器，而参数renderOptions里包含就是各种该平台下的domAPI 和 属性API。比如我传入runtime-dom里的方法，则建立了一个在浏览器端的渲染器；传入小程序里的操作dom方法则建立了一个小程序端的渲染器；传入我自己乱写的方法就建立了一个自定义渲染器。

render方法就是采用options中提供的方法将虚拟节点转化成对应平台的真实节点渲染到指定容器中。

`runtime-core/src/renderer.ts` 

```js
export function createRenderer(options){
    const {
        insert: hostInsert,
        remove: hostRemove,
        patchProp: hostPatchProp,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
      } = options
    
    /*卸载DOM*/
    const unmount = (vnode) =>{hostRemove(vnode.el)}

    /*创建真实DOM*/
    const normalize = child => {
        if (isString(child)) { //如果是字符串，则把他变成vnode对象
            return createVNode(Text,null,child) 
        }
        return child
    }

    const mountChildren = (children,container) =>{
        for (let i = 0; i < children.length; i++){
            children[i] = normalize(children[i]) //格式化子节点，把每个子节点变成vnode
            patch(null,children[i],container); //children[i]可能是个文本
        }
    }
    const mountElement = (vnode,container) =>{
        const {type,props,shapeFlag} = vnode
        let el = vnode.el = hostCreateElement(type); // 创建真实元素，挂载到虚拟节点上
        if(props){ // 处理属性
            for(const key in props){ // 更新元素属性
                hostPatchProp(el,key,null,props[key]); 
            }
        }
      	//处理子节点
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ // 文本
            hostSetElementText(el, vnode.children);
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ // 数组：多个儿子
            mountChildren(vnode.children,el);
        }
        hostInsert(el,container); // 插入到容器中
    }
    
    
    const patch = (n1, n2, container) => {  //n1是旧的，n2是新的
        // 初始化和diff算法都在这里喲
        if(n1 == n2){
            return 
        }
        
        const {type,shapeFlag} = n2
    
        if (n1 == null) { // 初始化的情况
            switch (type) {
                case Text: //文本节点单独处理 : h(Text,'123) 或 h('h1',['223','123'])
                    processText(n1,n2,container)
                    break
                default:
                    if (shapeFlag & ShapeFlags.ELEMENT) {
                        mountElement(n2,container); 
                    }
            }
            
        }else{
            // diff算法
        }
    }
      
    const render = (vnode,container) =>{ //render方法就是采用options中提供的方法将虚拟节点转化成对应平台的真实节点渲染到指定容器中。
        if(vnode == null){ //说明是要卸载
            if(container._vnode){ 
            		unmount(container._vnode); // 找到对应的真实节点将其卸载
            }
        }else{
            patch(container._vnode || null,vnode,container); // 初始化和更新，每次更新都会把这个容器下的所有节点都过一遍
        }
        container._vnode = vnode; //缓存该容器这次更新好的虚拟节点
    }
    return {
        render
    }
}


```



#### 文本节点渲染

因为不能通过document.createElement('文本')，所以纯文本的处理需要我们自己添加类型来标识使得可以渲染出纯文本节点：h(Text,'123) 或 h('h1',['223','123'])

先在`vonde.ts`中添加类型并导出

```ts
export const Text = Symbol('Text') 
```

这个类型是要给用户使用在h函数里的所以要导出去，在`index.ts`中添加

```ts
export * from './vnode'
```

最后在`renderer.ts`上加上处理文本的逻辑

```ts
    const normalize = child => {
        if (isString(child)) {
            return createVNode(Text,null,child)
        }
        return child
    }

    const mountChildren = (children,container) =>{
        for (let i = 0; i < children.length; i++){
            let child = normalize(children[i]) //格式化子节点，把每个子节点变成vnode
            patch(null,children[i],container); //children[i]可能是个文本
        }
    }
    const processText = (n1,n2,container) => { //处理文本
        if (n1 === null) { //初始化
            hostInsert((n2.el=hostCreateText(n2.children)),container)
        }
    }


    const patch = (n1, n2, container) => {  //n1是旧的，n2是新的
        // 初始化和diff算法都在这里喲
        if(n1 == n2){
            return 
        }
        
        const {type,shapeFlag} = n2
    
        if (n1 == null) { // 初始化的情况
            switch (type) {
                case Text: //文本节点单独处理 : h(Text,'123) 或 h('h1',['223','123'])
                    processText(n1,n2,container)
                    break
                default:
                    if (shapeFlag & ShapeFlags.ELEMENT) {
                        mountElement(n2,container); 
                    }
            }
            
        }else{
            // diff算法
        }
    }
```

#### Fragment渲染

> 为了让Vue3支持多根节点模板，Vue.js 提供Fragment来实现，核心就是一个无意义的标签包裹多个节点。

使用：

```js
renderer.render(h(Fragment,[h(Text,'hello'),h(Text,'jw')]),document.getElementById('app'))
```





实现：

`vnode.ts`

```ts
export const Fragment = Symbol('Fragment')
```

以下都是在 `renderer.ts`

```ts
    const patch = (n1,n2,container,anchor = null) => { //n1是旧的，n2是新的 ， container是n1和n2的父节点
        if(n1 == n2){return }
        if(n1 && !isSameVNodeType(n1,n2)){ // 有n1 且n1和n2不是同一个虚拟节点 则直接先删除老的节点，再添加上新的节点
            unmount(n1) //删除旧节点
            n1 = null //把n1置为null是为了可以走下面process里创建新节点的逻辑
        }
        const { type, shapeFlag } = n2
        switch (type) {
            case Text: //文本节点单独处理 : h(Text,'123) 或 h('h1',['223','123'])
                processText(n1,n2,container)
                break
+            case Fragment: //Fragment是个无用的标签，用于实现多根节点
+                processFragment(n1,n2,container)
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1,n2,container,anchor); 
                }
        }
    }
```



```js
const processFragment = (n1,n2,container)=>{
    if(n1 == null){ 
        mountChildren(n2.children,container);
    }else{
        patchChildren(n1,n2,container);
    }
}
```



**同时这里要处理下卸载的逻辑，如果是fragment则删除子元素**

```js
const unmount = (vnode) =>{
    if(vnode.type === Fragment){
        return unmountChildren(vnode.children)
    }
    hostRemove(vnode.el)
}
```











### Diff算法

#### 整体逻辑顺序

vue中diff执行的时刻是组件内响应式数据变更触发实例执行其更新函数时，更新函数会再次执行render函数获得最新的虚拟DOM，然后执行patch函数，并传入新旧两次虚拟DOM，通过比对两者找到变化的地方，最后将其转化为对应的DOM操作。

patch过程是一个递归过程，遵循深度优先、同层比较的策略；以vue3的patch为例：

- 首先判断两个节点是否为相同同类节点，不同则删除重新创建
- 如果双方都是文本则更新文本内容
- 如果双方都是元素节点则递归更新子元素，同时更新元素属性
- 更新子节点时又分了几种情况：
  - 新的子节点是文本，老的子节点是数组则清空，并设置文本；
  - 新的子节点是文本，老的子节点是文本则直接更新文本；
  - 新的子节点是数组，老的子节点是文本则清空文本，并创建新子节点数组中的子元素；
  - 新的子节点是数组，老的子节点也是数组，那么比较两组子节点，更新细节blabla



在diff中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n3)降低值O(n)，也就是说，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。



#### 前后元素不一致

> 两个不同的虚拟节点不需要进行比较，直接移除老节点，将新的虚拟节点渲染成真实DOM进行挂载即可

`vnode.ts`

```js
export const isSameVNodeType = (n1, n2) => { //虚拟节点的类型和key值都一样则视为同一个虚拟节点
    return n1.type === n2.type && n1.key === n2.key;
}
```



`renderer.ts`

```js
const patch = (n1,n2,container) => { //n1是旧的，n2是新的
    if(n1 == n2){return }
    if(n1 && !isSameVNodeType(n1,n2)){ // 有n1 且n1和n2不是同一个虚拟节点 则直接先删除老的节点，再添加上新的节点
        unmount(n1) //删除旧节点
        n1 = null //把n1置为null是为了可以走下面process里创建新节点的逻辑
    }
    const { type, shapeFlag } = n2
    switch (type) {
        case Text: //文本节点单独处理 : h(Text,'123) 或 h('h1',['223','123'])
            processText(n1,n2,container)
            break
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(n2,container); 
            }
    }
}
```



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#前后元素一致)前后元素一致

> 前后元素一致则比较两个元素的属性和孩子节点

```js
 const patchProps = (oldProps, newProps, el) => {
     for (const key in newProps) {//直接用新的里面的属性盖掉旧的
         hostPatchProp(el,key,oldProps[key],newProps[key])
     }
     for (const key in oldProps) {
         if (newProps[key] == null) { // 旧的属性里有而新的属性里没有的就直接删除掉
             hostPatchProp(el,key,oldProps[key],null)
         }
     }
 }

const patchElement = (n1, n2) => {
    let el = (n2.el = n1.el);
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el); // 比对新老属性
    patchChildren(n1, n2, el); // 比较元素的孩子节点
}
const processElement = (n1, n2, container) => {
    if (n1 == null) {
        mountElement(n2, container)
    } else {
        patchElement(n1, n2); // 比较两个元素
    }
}

const processText = (n1,n2,container) => { //处理文本
    if (n1 === null) { //要创建新节点
        hostInsert((n2.el=hostCreateText(n2.children)),container)
    } else { //更新
        const el = n2.el = n1.el //复用老节点
        if (n1.children !== n2.children) {
            hostSetText(el,n2.children) //更新文本
        }
    }
}
```



##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#子元素比较情况)子元素比较情况

children has 3 possibilities: text, array or no children.

| 新儿子 | 旧儿子     | 操作方式                     |
| :----- | :--------- | :--------------------------- |
| 文本   | 数组       | （删除老儿子，设置文本内容） |
| 文本   | 文本 或 空 | （更新文本即可）             |
| 数组   | 数组       | （diff算法）                 |
| 数组   | 文本       | （清空文本，进行挂载）       |
| 数组   | 空         | （直接进行挂载）             |
| 空     | 数组       | （删除所有儿子）             |
| 空     | 文本       | （清空文本）                 |
| 空     | 空         | （无需处理）                 |

```js
    const unmountChildren = (children) =>{
        for(let i = 0 ; i < children.length; i++){ //循环里面的每一项都给他删掉
            unmount(children[i]);
        }
    }
    const patchChildren = (n1,n2,el) => { //el是当前的节点（el = n1.el = n2.el）
        const c1 = n1 && n1.children
        const c2 = n2 && n2.children
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;

        /*处理这两种情况：
        * 新的  老的
        * 文本  数组
        * 文本  文本
        */
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){ //新节点的儿子是文本
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){ //旧节点的儿子是数组
                unmountChildren(c1); //删除所有旧节点
            }
            if(c1 !== c2){ //两个子节点不一样 （包含了c1和c2都是文本两者间的文本内容不一样的情况）
                hostSetElementText(el,c2);//将节点内的内容设为新的文本
            }
        } else {
            /* 处理这两种情况：
            *   新的    旧的
            *   数组    数组
            *   空      数组  
            */
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){ //旧节点的儿子是数组
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){ //新节点的儿子也是数组 (diff算法)
									  patchKeydChildren(c1,c2,el) //全量比对     // diff算法
                }else{ // 新节点的儿子为空 或 文本（为文本的情况上面已经处理了）
                    unmountChildren(c1);
                }

            /* 处理这两种情况：
            *   新的    旧的
            *   数组    空
            *   数组    文本 （先清空文本 再挂载新节点）
            *   空      文本
            */
            }else{
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){ //旧节点的儿子是文本
                    hostSetElementText(el,''); //清空文本 （数组 文本 和 空 文本）两种情况
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { //新节点的儿子是数组
                    mountChildren(c2, el); //挂载上去
                }
            }
        }
    }
```



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#核心diff算法)核心`Diff`算法步骤

##### 全过程

```ts
    const patchKeydChildren = (c1, c2, container) => { //针对 有 key 的 而且是全量比对
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        // 1. sync from start
        // (a b) c
        // (a b) d e
        //先从头比一遍，找到第一个不一样的节点就退出循环
        while (i <= e1 && i <= e2) { //任何一方到尽头了 就跳出循环
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSameVNodeType(n1, n2)) { //两个节点是一样的则要比它的属性和子节点
                patch(n1, n2, container)
            } else {
                break;
            }
            i++;
        }

        // 2. sync from end
        // a (b c)
        // d e (b c)
        //再从尾比一遍，找到第一个不一样的节点就退出循环
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container);
            } else {
                break;
            }
            e1--;
            e2--;
        }

        //此时得到的就是中间部分的那些节点，下面就是处理这些中间部分的节点

        // 3. common sequence + mount
        // (a b)
        // (a b) c
        // i = 2, e1 = 1, e2 = 2
        // (a b)
        // c (a b)
        // i = 0, e1 = -1, e2 = 0
        // 新增
        if (i > e1) { // 说明有新增 
            if (i <= e2) { // 表示有新增的部分
                const nextPos = e2 + 1; // 先根据e2 取他的下一个元素  然后下面跟数组长度进行比较
                const anchor = nextPos < c2.length ? c2[nextPos].el : null; //找到参照物看看是头插还是尾插
                while (i <= e2) {
                    patch(null, c2[i], container, anchor);
                    i++;
                }
            }
        }

        // 4. common sequence + unmount
        // (a b) c
        // (a b)
        // i = 2, e1 = 2, e2 = 1
        // a (b c)
        // (b c)
        // i = 0, e1 = 0, e2 = -1
        //卸载
        else if (i > e2) { //说明有要卸载的
            while (i <= e1) { //下面这些就是要卸载的
                unmount(c1[i])
                i++
            }
        }

        //此时就是中间那些节点进行比对了

        // 5. unknown sequence
        // a b [c d e] f g
        // a b [e c d h] f g
        // i = 2, e1 = 4, e2 = 5
        const s1 = i;//存下中间的前面那些部分的长度
        const s2 = i;
        const keyToNewIndexMap = new Map(); //用一个hash表去存新节点的key和index的映射关系
        for (let i = s2; i <= e2; i++) {
            const nextChild = c2[i];
            keyToNewIndexMap.set(nextChild.key, i);
        }

        
        const toBePatched = e2 - s2 + 1; // 新的总个数
        const newIndexToOldMapIndex = new Array(toBePatched).fill(0); //记录新的这个节点是否被比对过，有比对过则记录跟他比对的那个旧节点的坐标，没有则为初始值0，所以是0就说明这个新节点是新增的，没有旧节点与其对应

        //循环老的元素，看一下新的里面有没有，如果有说明要比较差异，没有则删除
        for (let i = s1; i <= e1; i++) {
            const prevChild = c1[i]; // 旧的孩子
            let newIndex = keyToNewIndexMap.get(prevChild.key); // 在新的节点列表里面去找旧的孩子
            if (newIndex == undefined) {
                unmount(prevChild); // 老的有 新的没有直接删除
            } else {
                newIndexToOldMapIndex[newIndex - s2] = i + 1; //i+1是因为记录的值得从1开始 
                patch(prevChild, c2[newIndex], container);
            }
        }

        //到这只是新老属性和儿子的比对，并没有移动该节点的位置

        for (let i = toBePatched - 1; i >= 0; i--) { //从后往前
            const nextIndex = s2 + i; //取得现在这个节点在c2中的位置
            const nextChild = c2[nextIndex]; //取得现在这个节点
            let anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null; // 找到当前元素的下一个元素作为锚点
            if (newIndexToOldMapIndex[i] == 0) { // 这是一个新元素 直接创建插入到 当前元素的下一个即可
                patch(null, nextChild, container, anchor)
            } else { // 不是0 说明是已经比对过属性和儿子的了 
                hostInsert(nextChild.el, container, anchor);// 操作真实Dom，根据参照物 将节点直接移动过去（ 所有节点都要移动 但是有些节点可以不动 -- 这就动用 最长递增子序列了）
            }
        }
    }
```





##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#sync-from-start)sync from start

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Udj0iy.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Udj0iy.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Udj0iy.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Udj0iy.png" loading="lazy"/>
  </picture>

```js
 h('div',[
     h('li', { key: 'a' }, 'a'),
     h('li', { key: 'b' }, 'b'),
     h('li', { key: 'c' }, 'c')
 ]) : 
 h('div',[
     h('li', { key: 'a' }, 'a'),
     h('li', { key: 'b' }, 'b'),
     h('li', { key: 'd' }, 'd'),
     h('li', { key: 'e' }, 'e')
 ])
```



```js
const patchKeydChildren = (c1, c2, container) => {
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        // 1. sync from start
        // (a b) c
        // (a b) d e
        //先从头比一遍，找到第一个不一样的节点就退出循环
        while (i <= e1 && i <= e2) { //任何一方到尽头了 就跳出循环
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSameVNodeType(n1, n2)) { //两个节点是一样的则要比它的属性和子节点
                patch(n1, n2, container)
            } else {
                break;
            }
            i++;
        }
}
```



##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#sync-from-end)sync from end

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vm3P3I.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vm3P3I.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vm3P3I.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-vm3P3I.png" loading="lazy"/>
  </picture>

```js
        // 2. sync from end
        // a (b c)
        // d e (b c)
        //再从尾比一遍，找到第一个不一样的节点就退出循环
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container);
            } else {
                break;
            }
            e1--;
            e2--;
        }
```



##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#common-sequence-mount)common sequence + mount

//此时得到的就是中间部分的那些节点，下面就是处理这些中间部分的节点

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-re1Eaj.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-re1Eaj.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-re1Eaj.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-re1Eaj.png" loading="lazy"/>
  </picture>

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-dNognp.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-dNognp.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-dNognp.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-dNognp.png" loading="lazy"/>
  </picture>

```js
        //此时得到的就是中间部分的那些节点，下面就是处理这些中间部分的节点

        // 3. common sequence + mount
        // (a b)
        // (a b) c
        // i = 2, e1 = 1, e2 = 2
        // (a b)
        // c (a b)
        // i = 0, e1 = -1, e2 = 0
        // 新增
        if (i > e1) { // 说明有新增 
            if (i <= e2) { // 表示有新增的部分
                const nextPos = e2 + 1; // 先根据e2 取他的下一个元素  然后下面跟数组长度进行比较
                const anchor = nextPos < c2.length ? c2[nextPos].el : null; //找到参照物看看是头插还是尾插
                while (i <= e2) {
                    patch(null, c2[i], container, anchor);
                    i++;
                }
            }
        }
```



##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#common-sequence-unmount)common sequence + unmount

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-1IOlQ6.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-1IOlQ6.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-1IOlQ6.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-1IOlQ6.png" loading="lazy"/>
  </picture>

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-YBUrVj.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-YBUrVj.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-YBUrVj.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-YBUrVj.png" loading="lazy"/>
  </picture>

```js
        // 4. common sequence + unmount
        // (a b) c
        // (a b)
        // i = 2, e1 = 2, e2 = 1
        // a (b c)
        // (b c)
        // i = 0, e1 = 0, e2 = -1
        //卸载
        else if (i > e2) { //说明有要卸载的
            while (i <= e1) { //下面这些就是要卸载的
                unmount(c1[i])
                i++
            }
        }
```



##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#unknown-sequence)unknown sequence

此时就是中间那些节点进行比对了





###### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#build-key-index-map-for-newchildren)`build key:index map for newChildren`

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-oh4Qk4.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-oh4Qk4.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-oh4Qk4.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-oh4Qk4.png" loading="lazy"/>
  </picture>

```js
        // 5. unknown sequence
        // a b [c d e] f g
        // a b [e c d h] f g
        // i = 2, e1 = 4, e2 = 5
        const s1 = i;//存下中间的前面那些部分的长度
        const s2 = i;
        const keyToNewIndexMap = new Map(); //用一个hash表去存新节点的key和index的映射关系
        for (let i = s2; i <= e2; i++) {
            const nextChild = c2[i];
            keyToNewIndexMap.set(nextChild.key, i);
        }
```



###### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#loop-through-old-children-left-to-be-patched-and-try-to-patch)`loop through old children left to be patched and try to patch`

```js
        const toBePatched = e2 - s2 + 1; // 新的总个数
        const newIndexToOldMapIndex = new Array(toBePatched).fill(0); //记录新的这个节点是否被比对过，有比对过则记录跟他比对的那个旧节点的坐标，没有则为初始值0，所以是0就说明这个新节点是新增的，没有旧节点与其对应

        //循环老的元素，看一下新的里面有没有，如果有说明要比较差异，没有则删除
        for (let i = s1; i <= e1; i++) {
            const prevChild = c1[i]; // 旧的孩子
            let newIndex = keyToNewIndexMap.get(prevChild.key); // 在新的节点列表里面去找旧的孩子
            if (newIndex == undefined) {
                unmount(prevChild); // 老的有 新的没有直接删除
            } else {
                newIndexToOldMapIndex[newIndex - s2] = i + 1; //i+1是因为记录的值得从1开始 
                patch(prevChild, c2[newIndex], container);
            }
        }
```



###### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#move-and-mount)move and mount

​        //到这只是新老属性和儿子的比对，下面就要移动该节点的位置 或者 新建节点了

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-lEVfsL.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-lEVfsL.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-lEVfsL.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-lEVfsL.png" loading="lazy"/>
  </picture>

```js
        for (let i = toBePatched - 1; i >= 0; i--) { //从后往前
            const nextIndex = s2 + i; //取得现在这个节点在c2中的位置
            const nextChild = c2[nextIndex]; //取得现在这个节点
            let anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null; // 找到当前元素的下一个元素作为锚点
            if (newIndexToOldMapIndex[i] == 0) { // 这是一个新元素 直接创建插入到 当前元素的下一个即可
                patch(null, nextChild, container, anchor)
            } else { // 不是0 说明是已经比对过属性和儿子的了 
                hostInsert(nextChild.el, container, anchor);// 操作真实Dom，根据参照物 将节点直接移动过去（ 所有节点都要移动 但是有些节点可以不动 -- 这就动用 最长递增子序列了）
            }
        }
```



#### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#最长递增子序列)最长递增子序列

> Vue3 采用最长递增子序列求解不需要移动的元素有哪些

##### 实现

算法：贪心 + 二分查找

思路：

1. 声明一个数组result实时保存 最长递增子序列的索引，然后遍历一遍整个数组
2. 如果当前这一项比result里的最后一项大则直接放到末尾
3. 如果当前这一项比result里的最后一项小，那就在result序列中通过二分查找找到比当前大的这一项，跟他替换
4. 在执行上两步的同时记录每个节点的前驱节点（前驱节点就是这个值根据前两步的做法出现在最长递增子序列中时他的前面那个值的索引）
5. 最后result里的最后一个值一定是对的（其他值都是错的，不用管了），再通过记录前驱节点的数组p来从result里的最后一个值开始往前追溯，找到最终结果

```js
function getSequence(arr) { // 最终的结果返回的是 最长递增子序列的 索引 
    const len = arr.length;
    const result = [0]; // 保存 最长递增子序列的索引，初始时先把第一个数的索引放进去
    const p = arr.slice(0); // 保存这个值在结果集中的前一个值的索引
    let start;
    let end;
    let middle;
    for (let i = 0; i < len; i++) { // O(n)
        const arrI = arr[i]; // 获取数组中的每一项
        if (arrI !== 0) { // Vue里0意味着这个节点要重新创建，跟我们这里没有关系，所以忽略掉
            let resultLastIndex = result[result.length - 1];// 取到result里最后的索引
            if (arr[resultLastIndex] < arrI) { //比较最后一项和当前项的值，如果比最后一项大则将当前索引放到结果集中
                p[i] = resultLastIndex; // 标记当前节点 的前一个对应的索引
                result.push(i); // 记录索引
                continue
            }

            /*下面是 二分查找 在结果集中找到比当前值大的，用当前值的索引将其替换掉*/
            start = 0;
            end = result.length - 1;
            while (start < end) { // 重合就说明找到了 对应的值
                middle = ((start + end) / 2) | 0; // 找到中间位置的前一个  （｜0 是取整）
                if (arr[result[middle]] < arrI) {
                    start = middle + 1
                } else {
                    end = middle
                } 
            }

            // start 或者 end 就是找到的位置
            if (arrI < arr[result[start]]) { // 如果找到的结果集里的值跟当前值 相同 或者 比当前的还大就不换了
                if (start > 0) { // 才需要替换
                    p[i] = result[start - 1]; // 要将他替换的那个值的前一个记住
                }
                result[start] = i; //替换
            }
        }
    }

    /*下面就是从最后一个节点开始向前追溯 */
    let i = result.length // 总长度
    let last = result[i - 1] // 找到了最后一项，最后一项肯定是正确的
    while (i-- > 0) { // 从最后一项开始 根据前驱节点一个个向前查找
        result[i] = last 
        last = p[last]
    }
    return result;
}
console.log(getSequence([2, 3, 1, 5, 6, 8, 7, 9, 4]))
```

##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#前驱节点追溯)前驱节点追溯图解

假设有：[2,3,1,5,6,8,7,9,4] 

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-IYEPiP.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-IYEPiP.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-IYEPiP.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-IYEPiP.png" loading="lazy"/>
  </picture>

##### [#](http://www.zhufengpeixun.com/jg-vue/guide/10.diff.html#优化diff算法)利用最长递增子序列优化`Diff`算法

```js
//到这只是新老属性和儿子的比对，下面就要开始移动该节点的位置了
++ let increasingNewIndexSequence = getSequence(newIndexToOldMapIndex); //获取最长递增子序列的索引。// [5,3,4,0] => [1,2]
++ let j = increasingNewIndexSequence.length - 1; // 因为下面是从后往前遍历所以先取出最长递增子序列里最后一个的索引
for (let i = toBePatched - 1; i >= 0; i--) {
    let currentIndex = i + s2; // 找到h的索引
    let child = c2[currentIndex]; // 找到h对应的节点
    let anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null; // 第一次插入h 后 h是一个虚拟节点，同时插入后 虚拟节点会
    if (newIndexToOldMapIndex[i] == 0) { // 如果自己是0说明没有被patch过
        patch(null, child, container, anchor)
    } else {
++        if (i != increasingNewIndexSequence[j]) {
++           hostInsert(child.el, container, anchor); // 操作真实Dom，根据参照物 将节点直接移动过去（ 所有节点都要移动 但是有些节点可以不动 -- 这就动用 最长递增子序列了）
++        } else { // 跳过不需要移动的元素
++            j--; //跳过一个了，就j--
++        }
    }
}
```







## 组件

### 组件实例

组件实例本质上就是一个状态集合（或一个对象），它维护着组件运行过程中的所有信息，例如注册到组件的生命周期函数、组件渲染的子树（subTree）、组件是否已经被挂载、组件自身的状态（data），等等。

我们为组件实例创建了一个代理对象，即渲染上下文对象。它的意义在于拦截数据状态的读取和设置操作，每当在渲染函数或生命周期钩子中通过 this 来读取数据时，都会优先从组件的自身状态中读取，如果组件本身并没有对应的数据，则再从 props 数据中读取。最后我们将渲染上下文作为渲染函数以及生命周期钩子的 this 值即可。



### 组件渲染

#### 本质

组件本质就是一组虚拟 DOM 元素的封装，它可以是一个返回虚拟 DOM 的函数，也可以是一个对象，但这个对象下必须要有一个函数用来产出组件要渲染的虚拟 DOM。





#### 大致原理

渲染器会使用虚拟节点的 type 属性来区分其类型。对于不同类型的节点，需要采用不同的处理方法来完成挂载和更新。

就像 `tag: 'div' `用来描述 `<div> `标签一样，`tag: MyComponent` 用来描述组件，只不过此时的 tag 属性不是标签名称，而是组件函数（当然组件也可以是一个对象，这个对象里有一个render函数，Vue.js 中的有状态组件就是使用对象结构来表达的。）

为了能够渲染组件，需要渲染器的支持(编译器和渲染器相辅相成)。修改前面提到的 renderer 函数，如果 vnode.tag 的类型是字符串，说明它描述的是普通标签元素，此时调用mountElement 函数完成渲染；如果 vnode.tag 的类型是函数，则说明它描述的是组件，此时调用 mountComponent 函数完成渲染。如下所示：

```js
function renderer(vnode,container){
	if(typeof vnode.tag==='string'){ // 说明 vnode 描述的是标签元素
		mountElement(vnode,container) //mountElement 函数与上文渲染器中 renderer 函数的内容一致
	} else if （typeof vnode.tag === 'function'){ // 说明vnode描述的是组件
		mountComponent(vnode,container)
	}
}

function mountComponent(vnode, container) {
	const subtree = vnode.tag() //首先调用 vnode.tag 函数，我们知道它其实就是组件函数本身，其返回值是虚拟 DOM
	renderer(subtree, container) // 递归地调用 renderer 渲染 subtree
}
```





#### 组件卸载

比如当 `v-if` 的条件从 `true` 变为 `false` 时，Vue.js 会执行以下步骤：

1.  [`patch`](packages/runtime-core/src/renderer.ts#L1443-L1501) 函数会被调用，用于比较新旧 VNode 并进行相应的更新。在这个过程中，如果旧的 VNode 是一个组件节点，并且新的 VNode 不存在或者类型不同，那么 [`unmount`](packages/runtime-core/src/renderer.ts#L2059-L2276) 函数就会被调用。

2.  [`unmount`](packages/runtime-core/src/renderer.ts#L2059-L2276) 函数会根据 VNode 的类型执行不同的卸载逻辑。如果 VNode 是一个组件节点，那么 [`unmountComponent`](packages/runtime-core/src/renderer.ts#L2223-L2281) 函数会被调用。

3.  [`unmountComponent`](packages/runtime-core/src/renderer.ts#L2223-L2281) 函数会执行组件的卸载逻辑，包括调用组件的 `beforeUnmount` 和 `unmounted` 生命周期钩子，停止组件作用域内的副作用，以及卸载组件的子树。

以下是相关的源码：

在 [`patch`](packages/runtime-core/src/renderer.ts#L1443-L1501) 函数中调用 [`unmount`](packages/runtime-core/src/renderer.ts#L2059-L2276) 函数：

``` typescript
if (n1 && !isSameVNodeType(n1, n2)) {
  unmount(n1, parentComponent, parentSuspense, true)
  n1 = null
}
```

在 [`unmount`](packages/runtime-core/src/renderer.ts#L2059-L2276) 函数中调用 [`unmountComponent`](packages/runtime-core/src/renderer.ts#L2223-L2281) 函数：

``` typescript
if (shapeFlag & ShapeFlags.COMPONENT) {
  unmountComponent(vnode.component!, parentSuspense, doRemove)
}
```

在 [`unmountComponent`](packages/runtime-core/src/renderer.ts#L2223-L2281) 函数中执行组件的卸载逻辑：

unmountComponent是被同步调用的，卸载unmountComponent过程中，Vue 会执行一系列的清理操作，包括：

1. 触发组件的 `beforeUnmount` 和 `unmounted` 生命周期钩子函数。这在 packages/runtime-core/src/renderer.ts 中可以看到。
2. 停止监听组件内部所有的 `watch` 函数。这在 packages/runtime-core/__tests__/apiWatch.spec.ts 和 packages/runtime-core/__tests__/apiWatch.spec.ts 中有相关的测试用例。
3. 移除组件的 DOM 元素。

``` typescript
const { bum, scope, update, subTree, um } = instance

// beforeUnmount hook
if (bum) {
  invokeArrayFns(bum)
}

// stop effects in component scope
scope.stop()

// update may be null if a component is unmounted before its async
// setup has resolved.
if (update) {
  // so that scheduler will no longer invoke it
  update.active = false
  unmount(subTree, instance, parentSuspense, doRemove)
}
// unmounted hook
if (um) {
  queuePostRenderEffect(um, parentSuspense)
}
```





### props

 在 Vue.js 3 中，没有定义在 props 中的数据将存储到 attrs 对象中。



### 自定义事件

`runtime-core/src/componentEmits.ts`

emit 函数是同步调用的。当你在组件内部调用 `emit`函数时，它会立即执行，同步调用所有注册的事件处理函数。`emit` 函数首先会检查该实例是否已经被卸载，如果已经被卸载则直接返回。

接下来，`emit` 函数会处理事件参数，特别是对于 `model` 事件，它会根据 `props` 中的修饰符（如 `number` 和 `trim`）来转换参数。

然后，`emit` 函数会查找事件处理器。首先，它会尝试查找名为 `on<Event>` 的 prop，如果找不到并且事件是一个 `model` 事件，它会尝试查找 `onUpdate:<Model>`。如果仍然找不到，它会尝试查找一次性的事件处理器 `on<Event>Once`。

最后，如果找到了事件处理器，`emit` 函数会使用 callWithAsyncErrorHandling 函数来调用它，以便在调用过程中捕获和处理同步和异步的错误。

```js
01 function mountComponent(vnode, container, anchor) {
02   // 省略部分代码
03
04   const instance = {
05     state,
06     props: shallowReactive(props),
07     isMounted: false,
08     subTree: null
09   }
10
11   // 定义 emit 函数，它接收两个参数
12   // event: 事件名称
13   // payload: 传递给事件处理函数的参数
14   function emit(event, ...payload) {
15     // 根据约定对事件名称进行处理，例如 change --> onChange
16     const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
17     // 根据处理后的事件名称去 props 中寻找对应的事件处理函数
18     const handler = instance.props[eventName]
19     if (handler) {
20       // 调用事件处理函数并传递参数
21       handler(...payload)
22     } else {
23       console.error('事件不存在')
24     }
25   }
```



### 插槽

`<slot> `标签则会被编译为插槽函数的调用，通过执行对应的插槽函数，得到外部向槽位填充的内容（即虚拟 DOM），最后将该内容渲染到槽位中。

带插槽的组件`<MyComponent>`：

```js
01 <template>
02   <header><slot name="header" /></header>
03   <div>
04     <slot name="body" />
05   </div>
06   <footer><slot name="footer" /></footer>
07 </template>


01 //组件模板的编译结果
02 function render() {
03   return [
04     {
05       type: 'header',
06       children: [this.$slots.header()]
07     },
08     {
09       type: 'body',
10       children: [this.$slots.body()]
11     },
12     {
13       type: 'footer',
14       children: [this.$slots.footer()]
15     }
16   ]
17 }
```



运用上述组件`<MyComponent>`：模板中的插槽内容会被编译为插槽函数，而插槽函数的返回值就是具体的插槽内容：

```js
01 <MyComponent>
02   <template #header>
03     <h1>我是标题</h1>
04   </template>
05   <template #body>
06     <section>我是内容</section>
07   </template>
08   <template #footer>
09     <p>我是注脚</p>
10   </template>
11 </MyComponent>

01 // 编译成如下：
02 function render() {
03   return {
04     type: MyComponent,
05     // 组件的 children 会被编译成一个对象
06     children: {
07       header() {
08         return { type: 'h1', children: '我是标题' }
09       },
10       body() {
11         return { type: 'section', children: '我是内容' }
12       },
13       footer() {
14         return { type: 'p', children: '我是注脚' }
15       }
16     }
17   }
18 }
```







### 生命周期

#### setup

为啥写在computed里面的函数就不是setup里面执行呢？深入点问 什么才叫在setup里面执行？所谓在setup里执行只是为了获得当前组件实例**getCurrentInstance**，所以获取不到组件实例的时候就说不在setup里执行，而<mark>源码里执行setup函数前会给currentInstance里赋值，执行完setup后getCurrentInstance就会变为null</mark>，所以computed的依赖执行的时候是没有当前实例的。

一般都是那些需要获取实例的函数都需要在setup中执行，比如inject。



##### 接收参数

setup 函数接收两个参数。第一个参数是 props 数据对象，第二个参数也是一个对象，通常称为 setupContext，如下面的代码所示：

```js
01 const Comp = {
02   props: {
03     foo: String
04   },
05   setup(props, setupContext) {
06     props.foo // 访问传入的 props 数据
07     // setupContext 中包含与组件接口相关的重要数据
08     const { slots, emit, attrs, expose } = setupContext
09     // ...
10   }
11 }
```

 setupContext 对象保存着与组件接口相关的数据和方法，如下所示。

● slots：组件接收到的插槽。

● emit：一个函数，用来发射自定义事件。

● attrs。当为组件传递 props 时，那些没有显式地声明为 props 的属性会存储到 attrs 对象中。

● expose：一个函数，用来显式地对外暴露组件数据。





##### 返回值

它的返回值可以有两种情况：

(1) 返回一个函数，该函数将作为组件的 render 函数：

```js
01 const Comp = {
02   setup() {
03     // setup 函数可以返回一个函数，该函数将作为组件的渲染函数
04     return () => {
05       return { type: 'div', children: 'hello' }
06     }
07   }
08 }
```

这种方式常用于组件不是以模板来表达其渲染内容的情况。如果组件以模板来表达其渲染的内容，那么 setup 函数不可以再返回函数，否则会与模板编译生成的渲染函数产生冲突。



(2) 返回一个对象，该对象中包含的数据将暴露给模板使用：

```js
01 const Comp = {
02   setup() {
03     const count = ref(0)
04     // 返回一个对象，对象中的数据会暴露到渲染函数中
05     return {
06       count
07     }
08   },
09   render() {
10     // 通过 this 可以访问 setup 暴露出来的响应式数据
11     return { type: 'div', children: `count is: ${this.count}` }
12   }
13 }
```







#### onMounted

每个组件实例上会有一个hooks映射表，hooks[type]能拿到对应生命周期的hooks，比如拿到mounted的一些回调。调用onMounted时就是回调函数存到这个hooks映射表的mounted数组里面。

比如：

```js
01 function mountComponent(vnode, container, anchor) {
02     // 省略部分代码
03
04     effect(() => {
05       const subTree = render.call(renderContext, renderContext)
06       if (!instance.isMounted) {
07         // 省略部分代码
08
09         // 遍历 instance.mounted 数组并逐个执行即可
10         instance.mounted && instance.mounted.forEach(hook => hook.call(renderContext))
11       } else {
12         // 省略部分代码
13       }
14       instance.subTree = subTree
15     }, {
16       scheduler: queueJob
17     })
18   }
```





那么什么时候执行呢：

渲染完之后会同步执行**queuePostRenderEffect**，**queuePostRenderEffect**正常情况下就是**queuePostFlushCb**，执行queuePostFlushCb会把hooks里的回调放到pendingPostFlushCbs数组里，然后当调用mount方法的时候会同步执行**flushPostFlushCbs**方法，**flushPostFlushCbs**方法会同步执行pendingPostFlushCbs里的回调。

```js
    const instance = createApp();
    instance.mount(instanceRoot);
```



```js
export function flushPostFlushCbs(seen?: CountMap) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)]
    pendingPostFlushCbs.length = 0

		// .......
    
    activePostFlushCbs = deduped
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b))

    for (
      postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      // .......
      activePostFlushCbs[postFlushIndex]()
    }
    activePostFlushCbs = null
    postFlushIndex = 0
  }
}
```





#### 简单实现组件周期

```js
01 function mountComponent(vnode, container, anchor) {
02   const componentOptions = vnode.type
03   // 从组件选项对象中取得组件的生命周期函数
04   const { render, data, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated } = componentOptions
05
06   // 在这里调用 beforeCreate 钩子
07   beforeCreate && beforeCreate()
08
09   const state = reactive(data())
10
11   const instance = {
12     state,
13     isMounted: false,
14     subTree: null
15   }
16   vnode.component = instance
17
18   // 在这里调用 created 钩子
19   created && created.call(state)
20
21   effect(() => {
22     const subTree = render.call(state, state)
23     if (!instance.isMounted) {
24       // 在这里调用 beforeMount 钩子
25       beforeMount && beforeMount.call(state)
26       patch(null, subTree, container, anchor)
27       instance.isMounted = true
28       // 在这里调用 mounted 钩子
29       mounted && mounted.call(state)
30     } else {
31       // 在这里调用 beforeUpdate 钩子
32       beforeUpdate && beforeUpdate.call(state)
33       patch(instance.subTree, subTree, container, anchor)
34       // 在这里调用 updated 钩子
35       updated && updated.call(state)
36     }
37     instance.subTree = subTree
38   }, { scheduler: queueJob })
39 }
```





### 异步组件

在异步加载组件时，我们还要考虑以下几个方面（任何异步相关的都应该考虑以下）。

● 如果组件加载失败或加载超时，是否要渲染 Error 组件？

● 组件在加载时，是否要展示占位的内容？例如渲染一个 Loading 组件。

● 组件加载的速度可能很快，也可能很慢，是否要设置一个延迟展示 Loading 组件的时间？如果组件在 200ms 内没有加载成功才展示 Loading 组件，这样可以避免由组件加载过快所导致的闪烁。

● 组件加载失败后，是否需要重试？



#### defineAsyncComponent

defineAsyncComponent 是一个高阶组件，它最基本的实现如下：

```js
01 // defineAsyncComponent 函数用于定义一个异步组件，接收一个异步组件加载器作为参数
02 function defineAsyncComponent(loader) {
03   // 一个变量，用来存储异步加载的组件
04   let InnerComp = null
05   // 返回一个包装组件
06   return {
07     name: 'AsyncComponentWrapper',
08     setup() {
09       // 异步组件是否加载成功
10       const loaded = ref(false)
11       // 执行加载器函数，返回一个 Promise 实例
12       // 加载成功后，将加载成功的组件赋值给 InnerComp，并将 loaded 标记为 true，代表加载成功
13       loader().then(c => {
14         InnerComp = c
15         loaded.value = true
16       })
17
18       return () => {
19         // 如果异步组件加载成功，则渲染该组件，否则渲染一个占位内容
20         return loaded.value ? { type: InnerComp } : { type: Text, children: '' }
21       }
22     }
23   }
24 }
```

这里有以下几个关键点。

● defineAsyncComponent 函数本质上是一个高阶组件，它的返回值是一个包装组件。

● 包装组件会根据加载器的状态来决定渲染什么内容。如果加载器成功地加载了组件，则渲染被加载的组件，否则会渲染一个占位内容。

● 通常占位内容是一个注释节点。组件没有被加载成功时，页面中会渲染一个注释节点来占位。但这里我们使用了一个空文本节点来占位。





### 函数式组件

Vue.js RFC 的原文所述：“在 Vue.js 3 中使用函数式组件，主要是因为它的简单性，而不是因为它的性能好。”在 Vue.js 3 中，函数式组件与有状态组件的性能差距不大。

对于函数式组件来说，它无须初始化 data 以及生命周期钩子。从这一点可以看出，函数式组件的初始化性能消耗小于有状态组件。

一个函数式组件就是一个返回虚拟 DOM 的函数，函数式组件没有自身状态，但它仍然可以接收由外部传入的 props。为了给函数式组件定义 props，我们需要在组件函数上添加静态的 props 属性，如下面的代码所示：

```js
01 function MyFuncComp(props) {
02   return { type: 'h1', children: props.title }
03 }
04 // 定义 props
05 MyFuncComp.props = {
06   title: String
07 }
```





### 内建组件





#### Transition过渡！

##### 设计用途

不是让你用来写animation的！

Vue的 Transition 组件使用了一套类名来控制<mark>过渡</mark>效果。这套类名包括 `v-enter-from`, `v-enter-active`, `v-enter-to`，以及对应的离开过渡类名。

- `v-enter-from`: 这个类名在元素刚刚插入并且过渡还未开始时被添加。这个类名用于定义过渡的初始状态。在下一帧，`v-enter-from` 类名会被移除，`v-enter-to` 类名会被添加。
- `v-enter-active`: 这个类名在整个进入过渡的阶段都会被添加。这个类名通常用于<mark>定义过渡的持续时间、延迟和缓动函数。</mark>
- `v-enter-to`: 这个类名在 `v-enter-from` 被移除后被添加，并在过渡/动画完成后被移除。这个类名用于定义过渡的结束状态。

这三个类名允许你精细地控制过渡的不同阶段，从而实现复杂的动画效果。例如，你可以使用 `v-enter-from` 来设置元素的初始透明度，使用 `v-enter-to` 来设置元素的最终透明度，然后使用 `v-enter-active` 来控制这个透明度变化的速度







##### 核心原理

● 当 DOM 元素被挂载时，将动效类附加到该 DOM 元素上；

● 当 DOM 元素被卸载时，不要立即卸载 DOM 元素，而是等到附加到该 DOM 元素上的动效执行完成后再卸载它。

● Transition 组件本身不会渲染任何额外的内容，它只是通过默认插槽读取过渡元素，并渲染需要过渡的元素；

● Transition 组件的作用，就是在过渡元素的虚拟节点上添加 transition 相关的钩子函数。经过 Transition 组件的包装后，内部需要过渡的虚拟节点对象会被添加一个 vnode.transition 对象。这个对象下存在一些与 DOM 元素过渡相关的钩子函数，例如 beforeEnter、enter、leave 等。渲染器在渲染需要过渡的虚拟节点时，会在合适的时机调用附加到该虚拟节点上的过渡相关的生命周期钩子函数，具体体现在 mountElement 函数以及 unmount 函数中





元素挂载前会同时插入enter的from和active类，然后下一帧会干掉from类，插入to类。（下一帧应该dom挂载上去了，反正to类肯定是dom挂载上去了才插入的）。

源码里有个方法叫`addTransitionClass`，通过在这个方法里打断点，你就可以抓住整个加类名的过程。











## 通用api

### nextTick

```typescript
export function nextTick<T = void, R = void>(
  this: T,
  fn?: (this: T) => R
): Promise<Awaited<R>> {
  const p = currentFlushPromise || resolvedPromise //currentFlushPromise 是当前的刷新队列。resolvedPromise = Promise.resolve()
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
// 说白了就是 把fn放到当前的刷新队列执行完所有jobs之后再执行。
```



```vue
const a = ref(2)
a.value = 3
nextTick(() => {
  a.value = 2
})

<template>
    {{ a }}
</template>
```

这样页面上是看不到3的，一直就展示2，即对于真正的页面来说从来就没有过3（所以如果你把3改成是删掉一个类，）；因为a数值变化后导致的dom更新是微任务A，nextTick是在dom更新之后的微任务B，然后a又更新，又往队列里塞进一个dom更新微任务C（这里的dom更新是指vue的运行时操作dom），<mark>A->B->C都是微任务直接一溜烟一起执行完，然后再执行真正的渲染线程(或者什么合成线程，现在都用gpu加速的呀，所以真有可能js变太快了让视图发现其实没有变。)更新视图。</mark>而如果在nextTick里面写个debbugger就能看到页面中出现为3的时候了，因为debbugger只能断住js主线程，不会影响渲染线程，可能如果是debugger停住js主线程，那么渲染线程还会继续执行（不遵循互斥逻辑了）。





## ssr相关

Vue.js 可以用于构建客户端应用程序，组件的代码在浏览器中运行，并输出 DOM 元素。同时，Vue.js 可以在 Node.js 环境中运行，它可以将同样的组件渲染为字符串并发送给浏览器。这实际上描述了 Vue.js 的两种渲染方式，即客户端渲染（client-side rendering，CSR），以及服务端渲染（server-side rendering，SSR）



### 一些细节

虚拟节点(vnode)中的 props 对象中，通常会包含仅用于组件运行时逻辑的相关属性。例如，key 属性仅用于虚拟 DOM 的 Diff 算法，ref 属性仅用于实现template ref 的功能等。在进行服务端渲染时，应该忽略这些属性。除此之外，服务端渲染也无须考虑事件绑定。因此，也应该忽略 props 对象中的事件处理函数。

我们调用了 escapeHtml 对其进行转义处理，这对于防御 XSS 攻击至关重要。HTML 转义指的是将特殊字符转换为对应的 HTML 实体。其转换规则很简单。●如果该字符串作为普通内容被拼接，则应该对以下字符进行转义。○将字符 & 转义为实体 &amp;。○将字符 < 转义为实体 &lt;。○将字符 > 转义为实体 &gt;。●如果该字符串作为属性值被拼接，那么除了上述三个字符应该被转义之外，还应该转义下面两个字符。○将字符 " 转义为实体 &quot;。○将字符 ' 转义为实体 &#39;。









### 组件流程

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-15-image-20240112181516079.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-15-image-20240112181516079.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-15-image-20240112181516079.png" alt="image-20240112181516079" style="zoom:25%;" loading="lazy"/>
  </picture>

在进行服务端渲染时，组件的初始化流程与客户端渲染时组件的初始化流程基本一致，但有两个重要的区别。

●服务端渲染的是应用的当前快照，它不存在数据变更后重新渲染的情况。因此，所有数据在服务端都无须是响应式的。利用这一点，我们可以减少服务端渲染过程中创建响应式数据对象的开销。

●服务端渲染只需要获取组件要渲染的 subTree 即可，无须调用渲染器完成真实DOM 的创建。因此，在服务端渲染时，可以忽略“设置 render effect 完成渲染”这一步。这意味着，组件的 beforeMount 以及 mounted 钩子不会被触发。而且，由于服务端渲染不存在数据变更后的重新渲染逻辑，所以beforeUpdate 和 updated 钩子也不会在服务端执行

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-14-image-20240112181431744.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-14-image-20240112181431744.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-12-18-14-image-20240112181431744.png" alt="image-20240112181431744" style="zoom:25%;" loading="lazy"/>
  </picture>





### 客户端激活

由于浏览器在渲染了由服务端发送过来的 HTML 字符串之后，页面中已经存在对应的 DOM 元素了，所以组件代码在客户端运行时，不需要再次创建相应的 DOM 元素。但是，组件代码在客户端运行时，仍然需要做两件重要的事：

●在页面中的 DOM 元素与虚拟节点对象之间建立联系，即 vnode.el = node；●为页面中的 DOM 元素添加事件绑定。

```js
纯客户端渲染时，renderer.render 函数来完成渲染
01 renderer.render(vnode, container)
对于同构应用，使用renderer.hydrate 函数来完成激活：
01 renderer.hydrate(vnode, container)
```

在hydration过程中，Vue主要做了以下几件事：

1. 创建一个新的Vue实例，并将其挂载到已存在的HTML元素上。这个过程在createHydrationRenderer函数中进行。
2. 对于每一个VNode，Vue会找到对应的DOM节点，并将其与VNode关联起来。这个过程在hydrate函数中进行。
3. 如果VNode有子节点，Vue会递归地对子节点进行hydration。这个过程在hydrateChildren函数中进行。
4. 如果VNode是一个组件，Vue会对组件进行hydration。这个过程在hydrateComponent函数中进行。
5. 如果在hydration过程中发现VNode与DOM节点不匹配，Vue会修复这个不匹配。这个过程在handleMismatch函数中进行。
6. 在hydration过程结束后，Vue会触发一系列的生命周期钩子和指令钩子。





#### 真实DOM与虚拟节点建立联系

真实 DOM 元素与虚拟 DOM 对象都是树型结构，并且节点之间存在一一对应的关系。而激活的原理就是递归地在真实 DOM 元素与虚拟 DOM 节点之间建立关系，即 vnode.el = node。当渲染副作用执行挂载操作时，我们优先检查虚拟节点的 vnode.el 属性是否已经存在，如果存在，则意味着无须进行全新的挂载，只需要进行激活操作即可，否则仍然按照之前的逻辑进行全新的挂载。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-13-20-06-image-20240113200625086.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-13-20-06-image-20240113200625086.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-13-20-06-image-20240113200625086.png" alt="image-20240113200625086" style="zoom:33%;" loading="lazy"/>
  </picture>



### renderToString

vue的**renderToString**，这个方法里面最终会调用ssrRender这个方法，而ssrRender会执行打包后的入口main.mjs里的defineComponent:

```js
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
  ......
    const a = computed(() => window.document);
    watch(
      a,
      () => {
        console.log("window.document", window.document); // 如果vite.config.ts里的ssg配置开启了mock的话，那这里是可以访问到window.document的
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      ......
      _push(`<h2>${ssrInterpolate(_ctx.window.ducument)}</h2>`); // 这里_ctx里是没有window的！！！！！！
    };
  }
});
```



### Hydration

当Vue在客户端挂载应用时，它会检查挂载点（在这个代码库中是`#app`）中是否已经存在了由服务器端渲染的HTML内容。如果存在，Vue会尝试复用这些DOM结构，而不是直接替换它们。这就是"混合"（Hydration）的过程。

在"混合"过程中，Vue会遍历服务器端渲染的DOM结构，并尝试将其与客户端的Vue组件实例关联起来。这意味着，每个DOM元素都会被关联到一个Vue组件实例，这个组件实例包含了该元素的行为和功能。这样，当用户与页面交互时，Vue就可以正确地处理事件并更新视图。









## 干小活的工具函数

### 调用函数的时候使能拦截错误

用户传进来的函数不要直接调用，而是封一层去调用使能处理同步和异步的错误：

```js
export function callWithAsyncErrorHandling( // 能处理同步和异步的错误，如果函数是同步的就丢给callWithErrorHandling处理
  fn: Function | Function[],
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args)
    if (res && isPromise(res)) { // 如果是异步的
      res.catch(err => {
        handleError(err, instance, type) // 统一根据一些信息去向用户暴露错误的信息
      })
    }
    return res
  }

  const values = []
  for (let i = 0; i < fn.length; i++) { // 如果用户传进来的是函数数组
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args))
  }
  return values
}

export function callWithErrorHandling( // 能处理同步的错误
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}
```









# 其他生态

## Create-vue

当你在命令行中执行`pnpm create vue@3`时，以下步骤将会发生：

1.  `pnpm create`命令会从npm仓库下载和安装`create-vue`包的最新版本。
2.  安装完成后，`create-vue`包的主入口脚本[`index.ts`](index.ts)将会被执行。
3.  脚本首先会解析命令行参数，然后提示用户输入一些项目配置信息。如果用户在命令行中已经提供了这些信息（例如，`pnpm create vue@3 --ts`），则会跳过相应的提示。
4.  根据用户的输入，脚本会在指定的目录下创建一个新的Vue项目。项目的结构和配置取决于用户的选择。例如，如果用户选择了TypeScript，那么项目中的源代码文件将会是`.ts`文件，而不是`.js`文件。创建项目的过程中，脚本会复制一些预定义的模板文件到项目目录，然后根据用户的选择修改这些文件。例如，如果用户选择了TypeScript，那么脚本会修改`package.json`文件，添加TypeScript相关的依赖和脚本。





### 源码

#### 核心命令行交互并生成模板的部分

https://juejin.cn/post/7290374844397928506?searchId=202311212343145EF04E72657294D273D5



#### 发布后会创建各种情况的模版

主要是为了测试。

此 repo 使用 [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) 来存储每次发布后创建模板的快照。因此，在克隆版本库时，请确保您也初始化了子模块。

要下载包括子模块在内的所有内容，请运行以下命令：

```sh
git clone --recursive https://github.com/vuejs/create-vue.git
```

如果你已经克隆了 repo，但没有添加 `--recursive` 标记，请运行 `git submodule update --init --recursive` 来初始化和更新子模块。

> scripts/snapshot.mjs

就是排列组合出所有情况之后循环运行outfile.cjs去创建出所有可能的模版



#### 测试模版部分

> scripts/test.mjs

这个脚本的主要目的是确保所有的项目模板都能正确地构建和测试。

这个脚本首先获取 playground目录下的所有项目，然后对每个项目执行以下操作：

1. 读取项目的 `package.json` 文件（L22）。
2. 执行项目的构建命令（L25）。
3. 如果项目的 `devDependencies` 中包含 `@playwright/test`，则安装 Playwright（L27-L29）。
4. 如果项目的 `scripts` 中包含 `test:e2e`，则执行端到端测试（L31-L34）。
5. 如果项目的 `scripts` 中包含 `test:unit`，则执行单元测试（L36-L39）。









#### 为什么要使用ejs

ejs ： 模版引擎，用来动态在文件里加上一些代码。貌似只是为了在生成vite.config.js文件时 能 更优雅地在文件内容里插入一些plugins。





#### 如何更新模版里的依赖

看着是用renovate，Renovate是一个自动化工具，用于更新项目中的依赖项。它可以自动检测过时的依赖项，并创建更新这些依赖项的pull请求。

在这个renovate.json文件中：

`extends`字段（在第3-8行）定义了一些预设的配置，包括基本配置、每周一次的更新计划、将所有非主要更新分组在一起，以及所有提交的语义类型都是"chore"。

`rangeStrategy`字段（在第9行）定义了版本范围的更新策略，这里设置为"bump"，表示如果新版本在现有版本范围内，那么就更新到新版本。

`labels`字段（在第10行）定义了应用到Renovate pull请求的标签。

`ignoreDeps`字段（在第11行）定义了需要忽略的依赖项，这里设置为"esbuild"和"node"。

`packageRules`字段（在第12-18行）定义了一些特定的包规则，这里设置了对于"typescript"这个依赖项的特殊处理。





如果有破坏性更新：

Renovate 会尝试更新那个依赖。但是，在 RenovateConfig 中，你可以设置一些规则来决定如何处理这种情况。

例如，你可以设置 `separateMajorMinor` 字段为 `true`，这样 Renovate 就会为主要更新和次要更新创建不同的 PR。这在处理可能包含破坏性更改的主要更新时非常有用。

如果你担心破坏性更新，你可能想要将`automerge` 字段设置为 `false` 或 `minor`，这样只有次要和补丁更新才会被自动合并。

这是一个例子，展示了如何在配置中设置这些选项。在这个例子中，所有的次要和补丁更新将被自动合并，但是主要更新将需要手动审查和合并。：

```json
{
  "extends": ["config:base"],
  "separateMajorMinor": true,
  "automerge": "minor",
  "packageRules": [
    {
      "updateTypes": ["major"],
      "automerge": false
    }
  ]
}
```









## vueuse

### 源码

#### core

##### useLocalStorage

###### 执行过程

useLocalStorage -> useStorage -> **pausableWatch** -> **watchWithFilter** -> watch 

本质就是用watch监听一个响应式对象(即useLocalStorage返回出去的那个对像)，该对象变化的时候执行写入storage。



###### 兼容ssr

通过兼容去处理ssr的情况，如果dom api为undefined则直接返回一个ref对象，不再进行下面的操作。

实际上vite-ssg会模拟dom环境，即ssr的时候应该会模拟dom环境，所以按理说ssr时会有dom，但是还是应该兜个底，比如包一层如果没有该dom api则直接返回个啥，不往下执行了。

比如vueuse的useLocalStorage:

```ts
  const data = (shallow ? shallowRef : ref)(defaults) as RemovableRef<T>

  if (!storage) {
    try {
      storage = getSSRHandler('getDefaultStorage', () => defaultWindow?.localStorage)() // 这里返回undefined
    }
    catch (e) {
      onError(e)
    }
  }

  if (!storage)
    return data // 如果没有dom api 反正前面一溜烟下来，就返回 这个data， 这个data就是把传入的数据变成响应式后的ref对象。
......
```



#### watch

##### 给vue的watch封装一层使得可以暂停watch

```tsx
export function watchPausable<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchPausableReturn {
  const {
    eventFilter: filter,
    ...watchOptions
  } = options

  const { eventFilter, pause, resume, isActive } = pausableFilter(filter) // pausableFilter是使传进去的函数可以被停止执行或恢复执行
  const stop = watchWithFilter(
    source,
    cb,
    {
      ...watchOptions,
      eventFilter,
    },
  )

  return { stop, pause, resume, isActive }
}
```



##### 给vue的watch封装一层使得可以再控制一下回调函数的执行

eventFilter：顾名思义就是事件过滤器，即控制一下这个事件的执行。

```js
// 使用：
watchWithFilter(
  source,
  () => { console.log('changed!') }, // callback will be called in 500ms debounced manner
  {
    eventFilter: debounceFilter(500), // throttledFilter, pausabledFilter or custom filters //返回一个接收一个函数为参数的函数。
  },
)

// 原码：
export function watchWithFilter<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {},
): WatchStopHandle {
  const {
    eventFilter = bypassFilter, // bypassFilter就是直接执行原函数
    ...watchOptions
  } = options

  return watch(
    source,
    createFilterWrapper( // 返回一个函数
      eventFilter, // 控制cb的执行
      cb,
    ),
    watchOptions,
  )
}

export type EventFilter<Args extends any[] = any[], This = any, Invoke extends AnyFn = AnyFn> = (
  invoke: Invoke, // 原函数
  options: FunctionWrapperOptions<Args, This>
) => ReturnType<Invoke> | Promisify<ReturnType<Invoke>>
  
export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T) {
  return function wrapper(this: any, ...args: ArgumentsType<T>) { //  `this`参数是个假的参数，它出现在参数列表的最前面，只用于标识出在这个函数里this的类型，然后就不会报这个错'this' implicitly has type 'any' because it does not have a type annotation.
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }
}
export const bypassFilter: EventFilter = (invoke) => {
  return invoke()
}
```





#### utils

##### 使用户的函数可以被停止执行或恢复执行

```ts
/**
 * EventFilter that gives extra controls to pause and resume the filter
 *
 * @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
 *
 */
export function pausableFilter(extendFilter: EventFilter = bypassFilter): Pausable & { eventFilter: EventFilter } {
  const isActive = ref(true)

  function pause() {
    isActive.value = false
  }
  function resume() {
    isActive.value = true
  }

  const eventFilter: EventFilter = (...args) => {
    if (isActive.value)
      extendFilter(...args)
  }

  return { isActive: readonly(isActive), pause, resume, eventFilter }
}
```





## 组件库

### element plus

#### 遇到的问题

用了自动引入插件后就不要再手动引入，否则会有出现组件样式失效的问题。










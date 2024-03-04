# 创建

## 脚手架

### 安装

```sh
$ sudo npm i create-react-app -g
```

### 创建项目

```sh
$ create-react-app 项目名称
```

### 脚手架默认

#### 项目目录

src：打包的时候一般只对这个目录下的代码进行处理。

public：放页面模版。



#### 脚手架默认会安装

```json
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0", //React框架的核心。
    "react-dom": "^18.2.0", //React视图渲染的核心-用于基于React构建WebApp（HTML页面）。区别于react-native（构建和渲染App）
    "react-scripts": "5.0.1",//就是脚手架对打包命令的一种封装。脚手架为了让项目目录看起来干净，把webpack打包的规则和相关的plugins/loader等都隐藏到了node_modules目录下。调用react-scripts时其实还是调用了node_modules里的webpack去打包。
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",//在本地启动web服务器，预览打包内容
    "build": "react-scripts build",//打包
    "test": "react-scripts test",//单元测试
    "eject": "react-scripts eject"//暴露webpack配置规则
  },
```

### 暴露出webpack配置

暴露前先需要有git仓库且提交了一次代码。

```sh
$ yarn eject
```



### 暴露出配置后做一些常规修改

#### 把sass改为less

```sh
$ yarn add less less-loader@8 #这里用8版本的loader，据说是因为新版本的不太行？
$ yarn remove sass-loader
```

还要在webpack.config.js修改配置

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310102329936.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310102329936.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310102329936.png" alt="image-20230310102329936" style="zoom:50%;" loading="lazy"/>
  </picture>





#### 添加@别名

```json
alias:{
	'@': paths.appSrc,
}
```



#### 更改开发服务器的端口号和ip地址

##### 方法一

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310104410693.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310104410693.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310104410693.png" alt="image-20230310104410693" style="zoom:50%;" loading="lazy"/>
  </picture>



##### 方法二

```
$ yarn add cross-env
```

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105233872.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105233872.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105233872.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105233872.png" loading="lazy"/>
  </picture>



#### 修改兼容性

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105725618.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105725618.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105725618.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230310105725618.png" loading="lazy"/>
  </picture>

我们可以`yarn add @babel/polyfill` 然后在入口文件中 `import '@babel/polyfill'`,

但由于脚手架已经给我们安装了react-app-polyfill【对@babel/polyfill的重写】，所以我们可以在入口文件中：

```
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```



#### 处理Proxy跨域

http-proxy-middleware 【webpack-dev-server的跨域代理是基于它实现的】

在src目录中新建setupProxy.js文件。

```js
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) { 
  app.use(
    createProxyMiddleware("/jian", {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite:{
        "^/jian": ""
      }
    })
  )
  app.use(
    createProxyMiddleware("/zhi", {
      target: "http://localhost:8080",
      changeOrigin: true,
      ws: true,
      pathRewrite: {"^/zhi": ""}
    })
  )
}
```





## 用vite

```sh
$ pnpm create vite@latest 
```





# 视图

## 基础

在`ReactDOM.createRoot`的时候，不能直接把HTML/BODY作为根容器，需要指定一个额外的盒子【例如；#root】

每一个构建的视图只能有一个根节点。

- 出现多个根节点则报错：Adjacent JSX elements must be wrapped in an enclosing tag。
- React给我们提供了一个特殊的标签：`<></> `。使得可以在这个标签里写多个根节点。类似于vue3的`<template>`



视图更新的步骤：
   第一步：基于babel-preset-react-app把JSX编译为createElement格式
   第二步：把createElement执行，创建出virtualDOM
   第三步：基于root.render方法把virtualDOM变为真实DOM对象「DOM-DIFF」
    		 useLayoutEffect：阻塞第四步操作，先去执行Effect链表中的方法「同步操作」
     		useEffect：第四步操作和Effect链表中的方法执行，是同时进行的「异步操作」
   第四步：浏览器渲染和绘制真实DOM对象





## jsx

在HTML中嵌入“JS表达式”，需要用“{}“语法。 

在jsx中写注释：`{/**/}`

### ”JS表达式“： 

1. 变量 ：`{text}`
2. 数学运算 : `{x+y}`
3. 三元运算符：`{1===1？‘OK’：‘NO’}`
4. 循环：借助数组的迭代方法：map……



### {}胡子语法

{}胡子语法中嵌入不同的值所呈现出来的特点。

- number/string：值是啥，就渲染出啥。
- boolean/null/undefined/Symbol/BigInt：渲染的内容为空。
- 数组：把数组的每一项分别拿出来渲染【并不是变为字符串渲染，中间没有逗号】
- 函数：不支持在胡子语法中渲染，但是可以作为函数组件，用`<Component/>`方式渲染。
- 其余对象不支持在{}中渲染。除了：
  - JSX虚拟DOM对象。
  - 给元素设置style行内样式，要求必须写成一个对象格式。



## 给元素设置样式

行内样式：写成对象的形式。样式属性要基于小驼峰命名法处理。

```
<h2 style={{color:'red',fontSize:'18px'}}>
```

设置样式类名：用className

```
<h2 className="box">
```



# 组件

## 简介

组件的名字采用PascalCase「大驼峰命名法」这种方式命名。

组件都是编译为virtualDOM后再传递信息。

## 组件分类

- 函数组件
  - 不具备“状态、ref、周期函数”等内容，第一次渲染完毕后，无法基于组件内部的操作来控制其更新，因此称之为静态组件
  - 但是具备属性及插槽，父组件可以控制其重新渲染
  - 渲染流程简单，渲染速度较快
  - 基于FP（函数式编程）思想设计，提供更细粒度的逻辑组织和复用！
- 类组件
  - 具备“状态、ref、周期函数、属性、插槽”等内容，可以灵活的控制组件更新，基于钩子函数也可灵活掌控不同阶段处理不同的事情
  - 渲染流程繁琐，渲染速度相对较慢
  - 基于OOP（面向对象编程）思想设计，更方便实现继承等

React Hooks 组件，就是基于 React 中新提供的 Hook 函数，可以`让函数组件动态化`!



## 函数组件

### 简介

  函数组件「或者Hooks组件」不是类组件，所以没有实例的概念「调用组件不再是创建类的实例，而是把函数执行，产生一个私有上下文而已」，再所以，在函数组件中不涉及this的处理！！

创建一个函数返回jsx元素。

```javascript
// views/FunctionComponent.jsx
const FunctionComponent = function FunctionComponent() {
    return <div>
       我是函数组件
    </div>;
};
export default FunctionComponent;

// index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import FunctionComponent from '@/views/FunctionComponent';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <FunctionComponent/>
  </>
);
```



### 属性

#### 使用

 调用组件的时候，我们可以给调用的组件设置(传递)各种各样的属性, 如果设置的属性值不是字符串格式，需要基于“{}胡子语法”进行嵌套。

```tsx   
<DemoOne title="我是标题" x={10} data={[100, 200]} className="box" style={{ fontSize: '20px' }} />
```



#### 属性props是只读的

调用组件，传递进来的属性是“只读”的「原理：props对象被冻结了」
Object.isFrozen(props) -> true
获取：props.xxx
修改：props.xxx=xxx  =>报错



#### 校验props

+ 设置默认值
  ```jsx
  函数组件.defaultProps = {
    x: 0,
    ......
  };
  ```
+ 设置其它规则，例如：数据值格式、是否必传... 「依赖于官方的一个插件：prop-types」https://github.com/facebook/prop-types。传递进来的属性首先会经历规则的校验，不管校验成功还是失败，最后都会把属性给形参props，只不过如果不符合设定的规则，控制台会抛出警告错误{不影响属性值的获取}
  ```jsx
  import PropTypes from 'prop-types';
  函数组件.propTypes = {
    // 类型是字符串、必传
    title: PropTypes.string.isRequired,
    // 类型是数字
    x: PropTypes.number,
    // 多种校验规则中的一个
    y: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool,
    ])
  };
  ```



### 插槽

#### 简介

属性里的children就是插槽内容。 

#### 默认插槽

```jsx
const DemoOne = function DemoOne(props) {
    let { title, x, children } = props;
    // 要对children的类型做处理
    // 可以基于 React.Children 对象中提供的方法，对props.children做处理：count\forEach\map\toArray...
    children = React.Children.toArray(children);
  	return <div>
  		{children[0]}
    	<span>1</span>
    	{children[1]}
 		 </div>
}
```



#### 具名插槽

```javascript
// index.jsx
root.render(
  <>
    <FunctionComponent>
      <div slot="head">
        我是插槽信息1
      </div>
      <div slot="foot">
        我是插槽信息2
      </div>
    </FunctionComponent>
  </>
);

// views/FunctionComponent.jsx
import React from "react";
const FunctionComponent = function FunctionComponent(props) {
    children = React.Children.toArray(children);
    let headerSlot = [],
        footerSlot = [],
        defaultSlot = [];
    children.forEach(child => {
        let { slot } = child.props;
        if (slot === 'header') {
            headerSlot.push(child);
        } else if (slot === 'footer') {
            footerSlot.push(child);
        } else {
            defaultSlot.push(child);
        }
    });

    return <div className="demo-box">
        {headerSlot}
        <span>{x}</span>
        {footerSlot}
    </div>;
};
export default FunctionComponent;
```

### 函数组件是`静态组件`

- 不具备状态、生命周期函数、ref等内容
- 第一次渲染完毕，除非父组件控制其重新渲染，否则内容不会再更新
- 优势：渲染速度快
- 弊端：静态组件，无法实现组件动态更新


   第一次渲染组件时把函数执行

     + 产生一个私有的上下文：EC(V)
     + 把解析出来的props「含children」传递进来「但是被冻结了」
     + 对函数返回的JSX元素「virtualDOM」进行渲染
      当我们点击按钮的时候，会把绑定的小函数执行：
     + 修改上级上下文EC(V)中的变量
     + 私有变量值发生了改变
     + 但是“视图不会更新”
      =>也就是，函数组件第一次渲染完毕后，组件中的内容，不会根据组件内的某些操作，再进行更新，所以称它为静态组件
      =>除非在父组件中，重新调用这个函数组件「比如可以传递不同的属性信息」

### React.memo(function)

React.memo 函数，对新老传递的属性做浅比较，如果不一致，才会把函数组件执行，如果一致，则不让组件更新。【跟类组件的React.PureComponent一样】



### 举例封装一个函数组件

```jsx
import PropTypes from 'prop-types';
import React from 'react';

const Dialog = function Dialog(props) {
    // 获取传递的属性和插槽信息
    let { title, content, children } = props;
    children = React.Children.toArray(children);

    return <div className="dialog-box" style={{ width: 300 }}>
        <div className="header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h2 className="title">{title}</h2>
            <span>X</span>
        </div>
        <div className="main">
            {content}
        </div>
        {children.length > 0 ?
            <div className="footer">
                {children}
            </div> :
            null
        }
    </div>;
};

/* 属性规则校验 */
Dialog.defaultProps = {
    title: '温馨提示'
};
Dialog.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string.isRequired
};

export default Dialog;
```





## Hook

### 介绍

在 React 中，称之为 "Hooks" 是因为它们允许我们 "钩入" React 的功能。Hooks 通过调用内置的一些特殊函数，让我们有能力在函数组件中使用状态和生命周期方法等原本只能在类组件中使用的功能。

### Hook函数

#### 概览

Hook 是 React 16.8 的新增特性！并且<font color="red">只能运用到函数组件中</font>！https://zh-hans.reactjs.org/docs/hooks-reference.html

- 基础 Hook
  - `useState` 使用状态管理
  - `useEffect` 使用周期函数
  - `useContext` 使用上下文信息
- 额外的 Hook
  - `useReducer` useState的替代方案，借鉴redux处理思想，管理更复杂的状态和逻辑
  - `useCallback` 构建缓存优化方案
  - `useMemo` 构建缓存优化方案
  - `useRef` 使用ref获取DOM
  - `useImperativeHandle` 配合forwardRef（ref转发）一起使用
  - `useLayoutEffect` 与useEffect相同，但会在所有的DOM变更之后同步调用effect
  - …
- 自定义Hook



只能在函数最外层调用 Hook，不要在循环、条件判断或者子函数中调用。

```javascript
import React, { useState, useEffect } from "react";
export default function Demo() {
    let [num, setNum] = useState(10);
    if (num >= 10) {
        // Error：React Hook "useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render  react-hooks/rules-of-hooks
        useEffect(() => {
            console.log('@1', num);
        });
    }
    return <div>
        <span>{num}</span>
        <button onClick={() => { setNum(num + 1); }}>处理</button>
    </div>;
};
```



#### useState

###### 作用

在函数组件中使用状态，修改状态值可让函数组件更新，类似于类组件中的setState

###### 语法

const [state, setState] = useState(initialState);
返回一个 state，以及更新 state 的函数且会通知视图更新。

##### 函数组织的更新

###### 简介

函数组件的每一次渲染(或者是更新)，都是把函数(重新)执行，产生一个全新的“私有上下文”!
   + 内部的代码也需要重新执行
   + 涉及的函数需要重新的构建这些函数的作用域(函数执行的上级上下文)，是每一次执行函数产生的闭包
   + 每一次执行函数，也会把useState重新执行，但是：
     + 执行useState，只有第一次，设置的初始值会生效，其余以后再执行，获取的状态都是最新的状态值「而不是初始值」
     + 返回的修改状态的方法，每一次都是返回一个新的

函数组件的更新是让函数重新执行，也就是useState会被重新执行；那么它是如何确保每一次获取的是最新状态值，而不是传递的初始值呢？

```javascript
// 函数组件每一次渲染/更新，都具备独立的闭包
export default function Demo(props) {
    let [num, setNum] = useState(10);
    const handler = () => {
        setNum(100);
        setTimeout(() => {
            console.log(num); //10
        }, 1000);
    };
    return <div>
        <button onClick={handler}>新增</button>
    </div>;
};
```

###### 实现原理

```javascript
var _state;
function useState(initialState) {
  _state = _state | initialState;
  function setState(state) {
    _state = state;
    //...重新渲染组件
  }
  return [_state, setState];
}
```







##### **更新多状态**

###### 方案一[不推荐]

类似于类组件中一样，让状态值是一个对象（包含需要的全部状态），每一次只修改其中的一个状态值！
问题：不能像类组件的setState函数一样支持部分状态更新。

```javascript
export default function Demo(props) {
    let [state, setState] = useState({
        x: 10,
        y: 20
    });
    const handler = () => {
        // setState({ x: 100 }); //state={x:100}
        setState({
            ...state,
            x: 100
        });
    };
    return <div>
        <button onClick={handler}>处理</button>
    </div>;
};
```

###### 方案二「官方推荐」

执行多次useState，把不同状态分开进行管理.官方建议是：需要多个状态，就把useState执行多次即可

```javascript
export default function Demo(props) {
    let [x, setX] = useState(10),
        [y, setY] = useState(20);
    const handler = () => {
        setX(100);
    };
    return <div>
        <button onClick={handler}>处理</button>
    </div>;
};
```



##### **更新队列机制**

和类组件中的setState一样，每次更新状态值，也不是立即更新，而是加入到更新队列中！

- React 18 全部采用批更新
- React 16 部分批更新，放在其它的异步操作中，依然是同步操作！
- 可以基于flushSync刷新渲染队列

```jsx
import React, { useState } from "react";
import { flushSync } from 'react-dom';

export default function Demo(props) {
    console.log('OK');
    let [x, setX] = useState(10);
    let [y, setY] = useState(20);

    const handler = () => {
        /* setX(100);
        setY(200); */

        /* setTimeout(() => {
            setX(100);
            setY(200);
        }, 1000); */

        /* flushSync(() => {
            setX(100);
        });
        setY(200); */
    };

    return <div>
        <span>{x}</span>
        <span>{y}</span>
        <button onClick={handler}>处理</button>
    </div>;
};
```



##### **函数式更新**

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState；该函数将接收先前的 state，并返回一个更新后的值！

```javascript
import React, { useState } from "react";

export default function Demo() {

    let [num, setNum] = useState(10);

    const handler = () => {

        for (let i = 0; i < 10; i++) {

            // 函数式更新

            setNum(num => {

                return num + 1;

            });

        }

    };

    return <div>

        <span>{num}</span>

        <button onClick={handler}>处理</button>

    </div>;

};
```

##### **惰性初始state**

如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用！

```javascript
import React, { useState } from "react";

export default function Demo(props) {

    let [num, setNum] = useState(() => {

        let { x, y } = props;

        return x + y;

    });

    return <div>

        <span>{num}</span>

    </div>;

};
```

##### 传入当前state时

调用 State Hook 的更新函数，并传入当前的 state 时，React 将跳过组件的渲染（原因：React 使用 Object.is 比较算法，来比较新老 state；注意不是因为DOM-DIFF；）！

```javascript
import React, { useState } from "react";

export default function Demo() {

    console.log('render');

    let [num, setNum] = useState(10);

    return <div>

        <span>{num}</span>

        <button onClick={() => {

            setNum(num);

        }}>处理</button>

    </div>;

};
```



#### useReducer

是对useState的升级处理。如果一个组件的逻辑很复杂，需要大量的状态/大量修改状态的逻辑，此时使用useReducer管理这些状态会更好一些

​     @1 不需要再基于useState一个个的去创建状态了

​     @2 所有状态修改的逻辑，全部统一化处理了

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```



#### useEffect && useLayoutEffect

###### 作用

在函数组件中使用生命周期函数

###### 语法

useEffect([callback],[dependencies])

```javascript
export default function Demo() {
    let [num, setNum] = useState(10),
        [x, setX] = useState(100);
    /* 
    useEffect(callback)：没设置依赖
     + 第一次渲染完毕后，执行callback，等价于 componentDidMount
     + 在组件每一次更新完毕后，也会执行callback，等价于 componentDidUpdate
    */
    useEffect(() => {
        console.log('@1', num, x);
    });

    /* 
   useEffect(callback,[])：设置了，但是无依赖
     + 只有第一次渲染完毕后，才会执行callback，每一次视图更新完毕后，callback不再执行
     + 类似于 componentDidMount
    */
    useEffect(() => {
        console.log('@2', num, x);
    }, []);

    /* 
   useEffect(callback,[依赖的状态(多个状态)])：
     + 第一次渲染完毕会执行callback
     + 当依赖的状态值(或者多个依赖状态中的一个)发生改变，也会触发callback执行
     + 但是依赖的状态如果没有变化，在组件更新的时候，callback是不会执行的
    */
    useEffect(() => {
        console.log('@3', num);
    }, [num]);

    /* 
   useEffect(()=>{
      return ()=>{
        // 返回的小函数，会在组件释放的时候执行，如果组件更新，会把上一次返回的小函数执行「可以“理解为”上一次渲染的组件释放了」（useEffect如果设置返回值，则返回值必须是一个函数）
      };
   });
     返回的函数将在 组件卸载后 被调用
     等同于 componentWillUnmount
     */
    useEffect(() => {
        return () => {
            console.log('@4');
        };
    }, []);

    return <div>
    </div>;
};
```

##### **异步获取数据**

不能直接对[callback]设置async，因为它只能返回一个函数（或者不设置返回值）。所以要在里面在包一层，详情看示例：

```javascript
    /* // Warning: useEffect must not return anything besides a function, which is used for clean-up.
    useEffect(async () => {
        let result = await queryData();
        setData(result);
        console.log(result);
    }, []); */

    useEffect(() => {
        const next = async () => {
            let result = await queryData();
            setData(result);
            console.log(result);
        };
        next();
    }, []);

};
```



##### **useEffect的原理**

函数组件在渲染（或更新）期间，遇到useEffect操作，会基于MountEffect方法把callback（和依赖项）加入到`effect链表`中！

在视图渲染完毕后，基于UpdateEffect方法，通知链表中的方法执行！
1、按照顺序执行期间，首先会检测依赖项的值是否有更新「有容器专门记录上一次依赖项的值」；有更新则把对应的callback执行，没有则继续处理下一项！！
2、遇到依赖项是空数组的，则只在第一次渲染完毕时，执行相应的callback
3、遇到没有设置依赖项的，则每一次渲染完毕时都执行相应的callback





##### useLayoutEffect

其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。useLayoutEffect会阻塞浏览器渲染真实DOM，优先执行Effect链表中的callback；useEffect不会阻塞浏览器渲染真实DOM，在渲染真实DOM的同时，去执行Effect链表中的callback；

       + useLayoutEffect设置的callback要优先于useEffect去执行！！
       + 在两者设置的callback中，依然可以获取DOM元素「原因：真实DOM对象已经创建了，区别只是浏览器是否渲染」
       + 如果在callback函数中又修改了状态值「视图又要更新」
         + useEffect:浏览器肯定是把第一次的真实已经绘制了，再去渲染第二次真实DOM
         + useLayoutEffect:浏览器是把两次真实DOM的渲染，合并在一起渲染的

视图更新的步骤：

   第一步：基于babel-preset-react-app把JSX编译为createElement格式
   第二步：把createElement执行，创建出virtualDOM
   第三步：基于root.render方法把virtualDOM变为真实DOM对象「DOM-DIFF」
    		 useLayoutEffect：阻塞第四步操作，先去执行Effect链表中的方法「同步操作」
     		useEffect：第四步操作和Effect链表中的方法执行，是同时进行的「异步操作」
   第四步：浏览器渲染和绘制真实DOM对象



#### useRef 获取元素

在类组件中，创建REF对象，我们基于 React.createRef 处理；但是在函数组件中，为了保证性能，我们应该使用专属的 useRef 处理。因为useRef再每一次组件更新的时候（函数重新执行），再次执行useRef方法的时候，不会创建新的REF对象了，获取到的还是第一次创建的那个REF对象（即返回相同的引用）；而createRef在每一次组件更新的时候，都会创建一个全新的REF对象出来，比较浪费性能。

​    函数组件中，还可以基于 useRef Hook函数，创建一个ref对象 

```tsx
    let box = useRef(null);
​    useEffect(() => {
​       console.log(box.current);
​    }, []);
    return <div className="demo">
        <span className="num" ref={box}>{num}</span>
    </div>;
```



​      React.createRef 也是创建ref对象，即可在类组件中使用，也可以在函数组件中使用

```jsx
    let box = React.createRef();
    useEffect(() => {
        console.log(box.current);
    }, []);
        return <div className="demo">
        <span className="num" ref={box}>{num}</span>
    </div>;
```

```jsx
/!*  也可以基于“ref={函数}”的方式，可以把创建的DOM元素(或者子组件的实例)赋值给box变量「不推荐」 *!/
    let box;
    useEffect(() => {
        console.log(box);
    }, []);

    return <div className="demo">
        <span className="num" ref={x => box = x}>{num}</span>
    </div>;
```



#### useImperativeHandle 与 forwardRef 一起获取函数组暴露出来的属性和方法

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值，应当与 forwardRef 一起使用，实现ref转发

```jsx
const Child = React.forwardRef(function Child(props, ref) {
    let [text, setText] = useState('你好世界');
    const submit = () => { };

    useImperativeHandle(ref, () => {
        // 在这里返回的内容，都可以被父组件的REF对象获取到
        return {
            text,
            submit
        };
    });

    return <div className="child-box">
        <span>哈哈哈</span>
    </div>;
});
```

```jsx
//直接把 ref 赋值给函数组件，是不被允许的！如下：
const Child = function () {
    return <div>
        ...
    </div>;
};
export default function Demo() {
    const box = useRef(null);
    useEffect(() => {
        console.log(box.current); //null
        // Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
    }, []);
    return <div>
        <Child ref={box} />
    </div>;
};

//此时我们可以基于 forwardRef 和 useImperativeHandle , 就可以实现父组件调用子组件中的方法！如下：
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
const Child = forwardRef(function (props, ref) {
    useImperativeHandle(ref, () => {
        return {
            submit: () => {
                console.log('调用了子组件的submit方法！');
            }
        };
    });
    return <div>
        ...
    </div>;
});
export default function Demo() {
    const box = useRef(null);
    useEffect(() => {
        console.log(box.current);
        box.current.submit();
    }, []);
    return <div>
        <Child ref={box} />
    </div>;
};
```



#### useMemo

let xxx = useMemo(callback,[dependencies])
       + 第一次渲染组件的时候，callback会执行
       + 后期只有依赖的状态值发生改变，callback才会再执行
       + 每一次会把callback执行的返回结果赋值给xxx
   + useMemo具备“计算缓存”，在依赖的状态值没有发生改变，callback没有触发执行的时候，xxx获取的是上一次计算出来的结果。和vuee中的计算属性非常的类似！！



```jsx
   let ratio = useMemo(() => {
        let total = supNum + oppNum,
ratio = '--';
        if (total > 0) ratio = (supNum / total * 100).toFixed(2) + '%';
        return ratio;
    }, [supNum, oppNum]);
```

 

#### useCallback

###### 语法

const xxx = useCallback(callback,[dependencies])

​       \+ 组件第一次渲染，useCallback执行，创建一个函数“callback”，赋值给xxx

​       \+ 组件后续每一次更新，判断依赖的状态值是否改变，如果改变，则重新创建新的函数堆，赋值给xxx；但是如果，依赖的状态没有更新「或者没有设置依赖“[]”」则xxx获取的一直是第一次创建的函数堆，不会创建新的函数出来！！所以基于useCallback，可以始终获取第一次创建函数的堆内存地址(或者说函数的引用)





###### 常用场景

父组件嵌套子组件，父组件把一个函数传递给子组件，当父组件更新的时候，因为传递给子组件的属性仅仅是一个函数，所以不想再让子组件也跟着更新。

解决方案：

第一步：传递给子组件的属性（函数），每一次需要是相同的堆内存地址(是一致的) . 基于useCallback处理！！

第二步：在子组件内部也要做一个处理，验证父组件传递的属性是否发生改变，如果没有变化，则让子组件不能更新，有变化才需要更新。如果是子组件是类组件则继承React.PureComponent即可「在shouldComponentUpdate中对新老属性做了浅比较」。如果子组件是函数组件则基于 React.memo 函数，对新老传递的属性做比较，如果不一致，才会把函数组件执行，如果一致，则不让子组件更新。

```jsx
/* 子组件 */
/* class Child extends React.PureComponent {
    render() {
        console.log('Child Render');
        return <div>
            我是子组件
        </div>;
    }
} */

const Child = React.memo(function Child(props) {
    console.log('Child Render');
    return <div>
        我是子组件
    </div>;
});


/* 父组件 */
const Demo = function Demo() {
    // const handle = () => { };  //第一次:0x001  第二次:0x101  第三次:0x201 ...
    const handle = useCallback(() => { }, []); //第一次:0x001  第二次:0x001  第三次:0x001 ...
    return <div className="vote-box">
        <Child handle={handle} />
    </div>;
};
```

#### 其他较不常用的hooks



#### 自定义Hook 

  作用：提取封装一些公共的处理逻辑

  玩法：创建一个函数，名字需要是 useXxx ，后期就可以在组件中调用这个方法！

## 类组件

### 简介

类组件是`动态组件`

- 具备属性及规则校验
- 具备状态，修改状态可以控制视图更新
  - setState
  - forceUpdate
- 具备周期函数
  - 严格模式下，一些不安全的周期函数是禁止使用的

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315204628963.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315204628963.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315204628963.png" alt="image-20230315204628963" style="zoom:50%;" loading="lazy"/>
  </picture>

### 创建类组件

创建一个构造函数(类)，要求必须继承React.Component/PureComponent这个类，且必须给当前类设置一个render的方法「放在其原型上」，在render方法中，返回需要渲染的视图。

render函数在渲染的时候，如果type是：

   + 字符串：创建一个标签
   + 普通函数：把函数执行，并且把props传递给函数
   + 构造函数：把构造函数基于new执行「也就是创建类的一个实例」，也会把解析出来的props传递过去
     + <font color="red">每调用一次类组件都会创建一个单独的实例</font>
     + 把在类组件中编写的render函数执行，把返回的jsx「virtualDOM」当做组件视图进行渲染！！

```jsx
import React from "react";
class ClassComponent extends React.Component {
    render() {
        return <div>
            我是类组件
        </div>;
    }
};
export default ClassComponent;
```





### 调用类组件「new Vote({...})」时类组件内部发生的事情

#### 初始化属性 && 规则校验

先规则校验，校验完毕后，再处理属性的其他操作。初始化属性有两种方式；
方案一： 
constructor(props) {
  super(props); //会把传递进来的属性挂载到this实例上
}
方案二：即便我们自己不再constructor中处理「或者constructor都没写」，在constructor处理完毕后，React内部也会把传递的props挂载到实例上；所以在其他的函数中，只要保证this是实例，就可以基于this.props获取传递的属性

同样this.props获取的属性对象也是被冻结的{只读的}  Object.isFrozen(this.props)->true



#### 初始化状态（修改状态）

需要手动初始化，如果我们没有去做相关的处理，则默认会往实例上挂载一个state，初始值是null => this.state=null
手动处理：
state = {
  ...
};

修改状态，控制视图更新
this.state.xxx=xxx ：这种操作仅仅是修改了状态值，但是无法让视图更新
想让视图更新，我们需要基于React.Component.prototype提供的方法操作：
  @1 this.setState({
      xxx:xxx
    });既可以修改状态，也可以让视图更新 
    
  @2 this.forceUpdate() 强制更新



#### 触发 componentWillMount 周期函数(钩子函数)：组件第一次渲染之前

钩子函数：在程序运行到某个阶段，我们可以基于提供一个处理函数，让开发者在这个阶段做一些自定义的事情

+ 此周期函数，<font color="red">目前是不安全的</font>「虽然可以用，但是未来可能要被移除了，所以不建议使用」控制会抛出黄色警告「为了不抛出警告，我们可以暂时用 UNSAFE_componentWillMount」
+ 如果开启了React.StrictMode「React的严格模式」，则我们使用 UNSAFE_componentWillMount 这样的周期函数，控制台会直接抛出红色警告错误！！



#### 触发 render 周期函数：渲染



#### 触发 componentDidMount 周期函数：第一次渲染完毕

+ 已经把virtualDOM变为真实DOM了「所以我们可以获取真实DOM了」



###   组件更新的逻辑

#### 「第一种：组件内部的状态被修改，组件会更新」

##### 触发 shouldComponentUpdate 周期函数：是否允许更新

```jsx
shouldComponentUpdate(nextProps, nextState) {
  // nextState:存储要修改的最新状态
  // this.state:存储的还是修改前的状态「此时状态还没有改变」

 // 此周期函数需要返回true/false
 //   返回true：允许更新，会继续执行下一个操作
 //   返回false：不允许更新，接下来啥都不处理
 return true;
}
```

##### 触发 componentWillUpdate 周期函数：更新之前

+ <font color="red">此周期函数也是不安全的</font>
+ 在这个阶段，状态/属性还没有被修改



##### 修改状态值/属性值「让this.state.xxx改为最新的值」

##### 触发 render 周期函数：组件更新

+ 按照最新的状态/属性，把返回的JSX编译为virtualDOM
+ 和上一次渲染出来的virtualDOM进行对比「DOM-DIFF」
+ 把差异的部分进行渲染「渲染为真实的DOM」

##### 触发 componentDidUpdate 周期函数：组件更新完毕

特殊说明：如果我们是基于 this.forceUpdate() 强制更新视图，会跳过 shouldComponentUpdate 周期函数的校验，直接从 WillUpdate 开始进行更新「也就是：视图一定会触发更新」



####   「第二种：父组件更新，触发的子组件更新」

    1. 触发 componentWillReceiveProps 周期函数：接收最新属性之前
      + <font color="red">此周期函数是不安全的</font>
      
        ```jsx
        UNSAFE_componentWillReceiveProps(nextProps) {
        // this.props:存储之前的属性
        // nextProps:传递进来的最新属性值
        console.log('componentWillReceiveProps:', this.props, nextProps);
        }
        ```
    2. 触发 shouldComponentUpdate 周期函数



### 组件卸载的逻辑

1. 触发 componentWillUnmount 周期函数：组件销毁之前
2. 销毁



### 父子组件嵌套时的处理顺序

处理机制上遵循深度优先原则：父组件在操作中，遇到子组件，一定是把子组件处理完，父组件才能继续处理

    + 父组件第一次渲染
      父 willMount -> 父 render「子 willMount -> 子 render -> 子didMount」 -> 父didMount 
    + 父组件更新：
      父 shouldUpdate -> 父willUpdate -> 父 render 「子willReceiveProps -> 子 shouldUpdate -> 子willUpdate -> 子 render -> 子 didUpdate」-> 父 didUpdate
    + 父组件销毁：
      父 willUnmount -> 处理中「子willUnmount -> 子销毁」-> 父销毁



###  修改状态：this.setState([partialState],[callback])

#### 参数

[;]:;

支持部分状态更改 。可以接受一个对象或者是一个函数。

```jsx
/*接受一个对象*/
this.setState({
   x:100 //不论总共有多少状态，我们只修改了x，其余的状态不动
});

/*接受一个函数*/
 this.setState((prevState)=>{
    // prevState:存储之前的状态值
    // return的对象，就是我们想要修改的新状态值「支持修改部分状态」
    return {
        xxx:xxx
    };
 })
```

两者在更新机制上有一些不同：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315212707800.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315212707800.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230315212707800.png" alt="image-20230315212707800" style="zoom:50%;" loading="lazy"/>
  </picture>

##### callback

在状态更改/视图更新完毕后触发执行「也可以说只要执行了setState，callback一定会执行」。通常，我们建议使用 `componentDidUpdate()` 来代替此方式。

        + 发生在componentDidUpdate周期函数之后「DidUpdate会在任何状态更改后都触发执行；而回调函数方式，可以在指定状态更新后处理一些事情；」
        + 特殊：即便我们基于shouldComponentUpdate阻止了状态/视图的更新，DidUpdate周期函数肯定不会执行了，但是我们设置的这个callback回调函数依然会被触发执行！！
        + 类似于Vue框架中的$nextTick！！











####  在React18中，setState操作都是异步的

##### 介绍

 在React18中，setState操作都是异步的「不论是在哪执行，例如：合成事件、周期函数、定时器...」。目的：实现状态的批处理「统一处理」

   + 有效减少更新次数，降低性能消耗
   + 有效管理代码执行的逻辑顺序
   + ...







##### 原理：利用了更新队列「updater」机制来处理的

   + 在当前相同的时间段内「浏览器此时可以处理的事情中」，遇到setState会立即放入到更新队列中
   + 此时状态/视图还未更新
     + 当所有的代码操作结束，会“刷新队列”「通知更新队列中的任务执行」：把所有放入的setState合并在一起执行，只触发一次视图更新「批处理操作」



##### 与v16关于setState是同步还是异步的区别

​    React18中：不论在什么地方执行setState，它都是异步的「都是基于updater更新队列机制，实现的批处理」

​    React16中：如果在合成事件「jsx元素中基于onXxx绑定的事件」、周期函数中，setState的操作是异步的！！但是如果setState出现在其他异步操作中「例如：定时器、手动获取DOM元素做的事件绑定等」，它将变为同步的操作「立即更新状态和让视图渲染」

```jsx
   handle = () => {
        let { x, y, z } = this.state;
        this.setState({ x: x + 1 }); //异步
        this.setState({ y: y + 1 }); //异步
        console.log(this.state); //{x:10,y:5,z:0} -> 渲染

        setTimeout(() => {
            this.setState({ z: z + 1 }); //异步 //如果是v16则这里会变成同步的
            console.log(this.state); //{x:11,y:6,z:0} -> 渲染  // 如果是v16则这里变成输出{x:11,y:6,z:1},因为上面那行代码执行了导致了渲染。即先渲染->{x:11,y:6,z:1}
        }, 1000);
    }; 
```

##### flushSync可以让修改状态的任务立即批处理一次

举例：

```jsx
import { flushSync } from 'react-dom';
// flushSync:可以刷新“updater更新队列”，也就是让修改状态的任务立即批处理一次
    state = {
        x: 10,
        y: 5,
        z: 0
    };

    handle = () => {
        let { x, y } = this.state;
        this.setState({ x: x + 1 });
        console.log(this.state); //10/5/0
        flushSync(() => {
            this.setState({ y: y + 1 }); //异步
            console.log(this.state); //10/5/0
        });
        console.log(this.state); //11/6/0
        // 在修改z之前，要保证x/y都已经更改和让视图更新了
        this.setState({ z: this.state.x + this.state.y });
    };
```



### 举例封装一个类组件

```jsx
import React from "react";
import PropTypes from 'prop-types';

class Vote extends React.Component {
  /* 属性规则校验 */
  static defaultProps = {
    num: 0
  };
  static propTypes = {
    title: PropTypes.string.isRequired,
    num: PropTypes.number
  };

  /* 初始化状态 */
  state = {
    supNum: 20,
    oppNum: 10
  };

  render() {
    let { title } = this.props,
      { supNum, oppNum } = this.state;

    return <div className="vote-box">
      <div className="footer">
        <button onClick={() => {
          this.setState({
            supNum: supNum + 1
          });
        }}>支持</button>

        <button onClick={() => {
          this.state.oppNum++;
          this.forceUpdate();
        }}>反对</button>
      </div>
    </div>;
  }

  UNSAFE_componentWillMount() {
    console.log('componentWillMount：第一次渲染之前');
  }

  componentDidMount() {
    console.log('componentDidMount：第一次渲染完毕');
  }


  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate:', this.props, nextProps);
    return true;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate:', this.props, nextProps);
  }

  componentDidUpdate() {
    console.log('componentDidUpdate:组件更新完毕');
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:', this.props, nextProps);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount:组件销毁之前');
  }
}
export default Vote;

```



###  PureComponent和Component的区别

 PureComponent会给类组件默认加一个shouldComponentUpdate周期函数。在此周期函数中，它对新老的属性/状态 会做一个浅比较，如果经过浅比较，发现属性和状态并没有改变，则返回false「也就是不继续更新组建」；有变化才会去更新。

```jsx
class Demo extends React.PureComponent {
    state = {
        arr: [10, 20, 30] //0x001
    };

    render() {
        let { arr } = this.state; //arr->0x001
        return <div>
            <button onClick={() => {
                arr.push(40); //给0x001堆中新增一个40
                /* 
                // 无法更新的
                console.log(this.state.arr); //[10,20,30,40]
                this.setState({ arr }); //最新修改的转态地址，还是0x001「状态地址没有改」 
                */

                // this.forceUpdate(); //跳过默认加的shouldComponentUpdate，直接更新
                this.setState({
                    arr: [...arr] //我们是让arr状态值改为一个新的数组「堆地址」
                })
            }}>新增SPAN</button>
        </div >;
    }

    /*相当于在组件中加入了以下代码： 
    shouldComponentUpdate(nextProps, nextState) {
        let { props, state } = this;
        // props/state：修改之前的属性状态
        // nextProps/nextState：将要修改的属性状态
        return !shallowEqual(props, nextProps) || !shallowEqual(state, nextState);
    } */
}
```



- 



## Ref

### 简介

 受控组件：基于修改数据/状态，让视图更新，来实现需求
 非受控组件：基于ref获取DOM元素，我们操作DOM元素，来实现需求

###  基于ref获取DOM元素的语法

    1. 给需要获取的元素设置ref='xxx'，后期基于this.refs.xxx去获取相应的DOM元素「不推荐使用：在React.StrictMode模式下会报错」
       ```
       <h2 ref="titleBox">...</h2>
       获取：this.refs.titleBox
       ```
       
    2. 把ref属性值设置为一个函数
       ref={x=>this.xxx=x}
       
         + x是函数的形参：存储的就是当前DOM元素
         + 然后我们获取的DOM元素“x”直接挂在到实例的某个属性上
       获取：this.xxx
       
    3. 基于React.createRef()方法创建一个REF对象
       this.xxx=React.createRef();  //=> this.xxx={current:null}
       ref={REF对象(this.xxx)}
       获取：this.xxx.current

### 原理

在render渲染的时候，会获取virtualDOM的ref属性

      + 如果属性值是一个字符串，则会给this.refs增加这样的一个成员，成员值就是当前的DOM元素
      + 如果属性值是一个函数，则会把函数执行，把当前DOM元素传递给这个函数「x->DOM元素」,而在函数执行的内部，我们一般都会把DOM元素直接挂在到实例的某个属性上
      + 如果属性值是一个REF对象，则会把DOM元素赋值给对象的current属性



### 作用

 给元素标签设置ref，目的：获取对应的DOM元素 

 给类组件设置ref，目的：获取当前调用组件创建的实例「后续可以根据实例获取子组件中的相关信息」

 <font color="red">给函数组件设置ref，直接报错：Function components cannot be given refs. Attempts to access this ref will fail.</font>

 <font color="red"> 但是我们让其配合 React.forwardRef 实现ref的转发进而获取函数子组件内部的某个元素。</font>

```jsx
const Child2 = React.forwardRef(function Child2(props, ref) {
    return <div>
        子组件2
        <button ref={ref}>按钮</button>
    </div>;
});

class Demo extends React.Component {
    render() {
        return <div>
            <Child2 ref={x => this.child2 = x} />
        </div>;
    }
    componentDidMount() {
        // console.log(this.child2); //存储的是:子组件内部的button按钮
    }
}
```





## 合成事件(Synthetic Event)

### 简介

合成事件是围绕浏览器原生事件，充当跨浏览器包装器的对象；他们将不同浏览器的行为合并为一个api，这样做是为了确保事件在不同浏览器中显示一致的属性。

### 使用

在JSX元素上直接基于onXxx={函数}进行事件绑定。



### 类组件中的this指向

如果我们给合成事件绑定一个“普通函数”，当绑定的函数执行时方法中的this会是undefined。

解决方法：

  + 我们可以基于JS中的bind方法：预先处理函数中的this和实参
       + 相比于箭头函数的优势：可以给函数传递指定的实参「bind会把事件对象以最后一个实参传递给函数」
  + 把绑定的函数设置为“箭头函数”，让其使用上下文中的this「即实例」，箭头函数只能有一个实参（合成事件对象）

```jsx
import React from "react";
class Demo extends React.Component {
    handle1() { //Demo.prototype => Demo.prototype.handle=function handle(){}
        console.log(this); //undefined
    }
    handle2(x, y, ev) {
        // 只要方法经过bind处理了，那么最后一个实参，就是传递的合成事件对象！！
        console.log(this, x, y, ev); //实例 10 20 合成事件对象
    }
    handle3 = (ev) => {  //实例.handle3=()=>{....}
        console.log(this); //实例
        console.log(ev); //SyntheticBaseEvent 合成事件对象「React内部经过特殊处理，把各个浏览器的事件对象统一化后，构建的一个事件对象」
    };
    handle4 = (x, ev) => {
        console.log(x, ev); //10 合成事件对象
    };

    render() {
        return <div>
            <button onClick={this.handle1}>按钮1</button>
            <button onClick={this.handle2.bind(this, 10, 20)}>按钮2</button>
            <button onClick={this.handle3}>按钮3</button>
            <button onClick={this.handle4.bind(null, 10)}>按钮4</button>
        </div>;
    }
}
export default Demo;
```





### 合成事件对象

我们在React合成事件触发的时候，也可以获取到事件对象，只不过此对象是合成事件对象。合成事件对象中，也包含了浏览器内置事件对象中的一些属性和方法「常用的基本都有」

  + clientX/clientY
  + pageX/pageY
  + target
  + type
  + preventDefault
  + stopPropagation
  + ...
  + nativeEvent：基于这个属性，可以获取浏览器内置『原生』的事件对象
  + ...





### react里的事件委托

#### 一些api

ev.stopPropagation(); //合成事件对象中的“阻止事件传播”:阻止原生的事件传播「包含捕获和冒泡」 & 阻止合成事件中的事件传播

 ev.stopImmediatePropagation：也是阻止事件传播，只不过它可以把当前元素绑定的其他方法「同级的」，如果还未执行，也不会让其再执行了

 ev.nativeEvent.stopPropagation(); //原生事件对象中的“阻止事件传播”:只能阻止原生事件的传播

 ev.nativeEvent.stopImmediatePropagation(); //原生事件对象的阻止事件传播，只不过可以阻止#root上其它绑定的方法执行。





#### React中合成事件的处理原理

##### 介绍

<font color="red">React中的合成事件都是基于“事件委托”处理的</font>

​     \+ 在React17及以后版本，合成事件都是委托给#root这个容器「捕获和冒泡都做了委托」；

​     \+ 在17版本以前，合成事件都是委托给document容器的「而且只做了冒泡阶段的委托」；。即如果在元素上做了事件委托，不管是冒泡还是捕获阶段的，都统一在document的冒泡阶段再执行。而且react16有一个“事件对象池”机制。即在本次事件触发时，从事件对象池中获取存储的合成事件对象，把信息赋值给相关的成员。等本次操作结束后就把合成事件对象中的成员信息都清空，再放入到事件对象池中。

​	+ **Vue中的事件处理机制**是给创建的DOM元素，单独基于`addEventListener`实现事件绑定。

​     \+ 对于没有实现事件传播机制的事件，才是单独做的事件绑定「例如：onMouseEnter/onMouseLeave...」



react17及以后整个事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png" alt="image-20230316135339121" style="zoom: 33%;" loading="lazy"/>
  </picture> 



react16事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png" alt="image-20230316190929886" style="zoom: 67%;" loading="lazy"/>
  </picture>

##### 处理onXxx/onXxxCapture 

在组件渲染的时候，如果发现JSX元素属性中有 onXxx/onXxxCapture 这样的属性，不会给当前元素直接做事件绑定，只是把绑定的方法赋值给元素的相关属性，经过视图渲染解析，元素上都有onXxx/onXxxCapture这样的属性。然后对#root这个容器做了事件绑定「包括捕获和冒泡」。

原因：因为组件中所渲染的内容，最后都会插入到#root容器中，这样点击页面中任何一个元素，最后都会把#root的点击行为触发。而在给#root绑定的方法中，把之前给元素设置的onXxx/onXxxCapture属性，在相应的阶段执行。



## 复合组件中的通信

### 基于props属性，实现父子(或兄弟)组件间的通信

### 基于context上下文，实现祖先/后代(或平行)组件间的通信(基本不用)

```jsx
// 创建上下文对象
import { createContext } from 'react';
const ThemeContext = createContext();
export default ThemeContext;
```



## 高阶组件HOC

「HOC：higher-order-components」：再包一层的意思。

一个函数返回一个组件

```jsx
import React from "react";
const Demo = function Demo(props) {
​    console.log('Demo中的属性:', props);
​    return <div className="demo">
​        我是DEMO
​    </div>;
};


// 执行ProxyTest方法，传递一个组件进来「Component」
const ProxyTest = function ProxyTest(Component) { //这个函数就叫高阶组件
​    return function HOC(props) {
​        let isUse = false;
​        // console.log(props); //=>{x:10,y:20,enable:true}
​        // 真实要渲染的是Demo组件：把获取的props要传递给Demo
​        /* let { x, y, enable } = props;
​        return <Component x={x} y={y} enable={enable} />; */
​        return <Component {...props} isUse={isUse} />
​    };
};
export default ProxyTest(Demo);
// 把函数执行的返回结果「应该是一个组件」，基于ES6Module规范导出，供App导入使用！！
```





# 样式

## 私有样式的处理

### CSS Modules

#### 使用

CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效；产生局部作用域的唯一方法，就是使用一个独一无二的class名字；这就是 CSS Modules 的做法！

```jsx
第一步：创建 xxx.module.css
.personal {
    width: 300px;
    height: 200px;
}
.personal span {
    color: green;
}
.title {
    color: red;
    font-size: 16px;
}

.subTitle {
    color: red;
    font-size: 14px;
}

第二步：导入样式文件 & 调用
import React from 'react';
import sty from './demo.module.css';
const Demo = function Demo() {
    return <div className={sty.personal}>
        <h1 className={sty.title}>珠峰培训</h1>
        <h2 className={sty.subTitle}>珠峰培训</h2>
        <span>珠峰培训</span>
    </div>;
};

export default Demo;

编译后的效果
// 结构

<div class="demo_personal__dlx2V">

    <h1 class="demo_title__tN+WF">珠峰培训</h1>

    <h2 class="demo_subTitle__rR4WF">珠峰培训</h2>

    <span>珠峰培训</span>

</div>



// 样式

.demo_personal__dlx2V {

    height: 200px;

    width: 300px

}

.demo_personal__dlx2V span {

    color: green

}

.demo_title__tN\+WF {

    color: red;

    font-size: 16px

}

.demo_subTitle__rR4WF {

    color: red;

    font-size: 14px

}
```

#### react 脚手架中对 CSS Modules 的配置

```javascript
// react-dev-utils/getCSSModuleLocalIdent.js

const loaderUtils = require('loader-utils');

const path = require('path');

module.exports = function getLocalIdent(

  context,

  localIdentName,

  localName,

  options

) {

  // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style

  const fileNameOrFolder = context.resourcePath.match(

    /index\.module\.(css|scss|sass)$/

  )

    ? '[folder]'

    : '[name]';

  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.

  const hash = loaderUtils.getHashDigest(

    path.posix.relative(context.rootContext, context.resourcePath) + localName,

    'md5',

    'base64',

    5

  );

  // Use loaderUtils to find the file or folder name

  const className = loaderUtils.interpolateName(

    context,

    fileNameOrFolder + '_' + localName + '__' + hash,

    options

  );

  // Remove the .module that appears in every classname when based on the file and replace all "." with "_".

  return className.replace('.module_', '_').replace(/\./g, '_');

};
```

#### `全局作用域`

CSS Modules 允许使用 :global(.className) 的语法，声明一个全局规则。凡是这样声明的class，都不会被编译成哈希字符串。

```javascript
// xxx.module.css

:global(.personal) {

    width: 300px;

    height: 200px;

}



// xxx.jsx

const Demo = function Demo() {

    return <div className='personal'>

        ...

    </div>;

};
```

#### `class继承/组合`

在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为”组合”

```
// xxx.module.css

.title {

    color: red;

    font-size: 16px;

}

.subTitle {

    composes: title;

    font-size: 14px;

}



// 组件还是正常的调用，但是编译后的结果

<h1 class="demo_title__tN+WF">珠峰培训</h1>

<h2 class="demo_subTitle__rR4WF demo_title__tN+WF">珠峰培训</h2>
```

### React-JSS

#### 使用

JSS是一个CSS创作工具，它允许我们使用JavaScript以生命式、无冲突和可重用的方式来描述样式。 React-JSS 是一个框架集成，可以在 React 应用程序中使用 JSS。不需要安装 JSS 核心，只需要 React-JSS 包即可。相对于CSSModules的好处：因为样式是写在JS中的，我们就可以基于一些逻辑操作，实现样式的动态化管理。

```javascript
import React from 'react';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({ //基于createUseStyles方法，构建组件需要的样式；返回结果是一个自定义Hook函数

    personal: {

        width: '300px',

        height: '200px',

        // 基于 & 实现样式嵌套

        '& span': {

            color: 'green'

        }

    },

    title: {

        // 使用动态值

        color: props => props.color,

        fontSize: '16px'

    },

    // 使用动态值

    subTitle: props => {

        return {

            color: props.color,

            fontSize: '14px'

        };

    }

});

const Demo = function Demo(props) {

    const { personal, title, subTitle } = useStyles(props);

    return <div className={personal}>

        <h1 className={title}>珠峰培训</h1>

        <h2 className={subTitle}>珠峰培训</h2>

        <span>珠峰培训</span>

    </div>;

};

export default Demo;
```

编译后的效果

```
// html结构 

<div class="personal-0-2-16">

    <h1 class="title-0-2-17 title-d0-0-2-19">珠峰培训</h1>

    <h2 class="subTitle-0-2-18 subTitle-d1-0-2-20">珠峰培训</h2>

    <span>珠峰培训</span>

</div>



// css样式

.personal-0-2-16{

    width: 300px;

    height: 200px;

}

.title-d0-0-2-19{

    color: red;

}

.title-0-2-17{

    font-size: 16px;

}

.personal-0-2-16 span{

    color: green;

}
```

#### 如果想在类组件中使用

从 react-jss 第10版本之后，不支持在类组件中使用，只能用于函数组件中。如果想在类组件中使用：

```javascript
import React from 'react';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({

    ...

});

// 高阶组件
const withStyles = function withStyles(Component) {
    return function (props) {
        const styles = useStyles(props);
        return <Component {...styles} />;
    };
};

class Demo extends React.Component {
    render() {
        const { personal, title, subTitle } = this.props;
        return <div className={personal}>
            ...
        </div>;
    }
}

export default withStyles(Demo);
```



### styled-components

#### 使用

目前在React中，还流行 CSS-IN-JS 的模式：也就是把CSS像JS一样进行编写；其中比较常用的插件就是 `styled-components`！

> $ yarn add styled-components
> https://styled-components.com/docs/basics#getting-started

**创建一个样式的js文件，例如：style.js**
想要有语法提示，可以安装vscode插件：vscode-styled-components

```javascript
import styled from "styled-components";

// 创建公共的样式变量

const colorBlue = "#1677ff",

    colorRed = "#ff4d4f";



// 基础用法

export const VoteBox = styled.div`

    box-sizing: border-box;

    margin: 0 auto;

    width: 300px;



    .header{

        display: flex;

        justify-content: space-between;

        align-items: center;

        border-bottom: 1px solid #DDD;



        .title {

            font-size: 18px;

            line-height: 50px;

        }



        .num {

            font-size: 18px;

            color: ${colorRed};

        }

    }



    .ant-btn {

        margin-right: 15px;

    }

`;



// 使用传递的属性，动态设置样式  &&  给属性设置默认值！！

export const VoteMain = styled.div.attrs(props => {

    return {

        color: props.color || colorBlue

    }

})`

    padding: 15px 0;



    p {

        line-height: 35px;

        color:${props => props.color};

        font-size: ${props => props.size}px;

    }

`;
```

**组件中使用**

```javascript
import { VoteBox, VoteMain } from './style';



const Demo = function Demo() {

    return <VoteBox>

        <div className="header">

            <h2 className="title">React是很棒的前端框架</h2>

            <span className="num">0</span>

        </div>

        <VoteMain size={16}>

            <p>支持人数：0人</p>

            <p>反对人数：0人</p>

            <p>支持比率：--</p>

        </VoteMain>

        <div className="footer">

            <Button type="primary">支持</Button>

            <Button type="primary" danger>反对</Button>

        </div>

    </VoteBox>

};



export default Demo;
```





# 路由

## react-router-dom

### 使用

#### 旧的使用-组件写法

所有的路由匹配规则都放在`<Routes>`中；
每一条规则的匹配，还是基于`<Route>`；
路由匹配成功，不再基于 component/render 控制渲染的组件，而是基于 element，语法格式是`<Component/>`
不再需要 Switch，默认就是一个匹配成功，就不在匹配下面的了
不再需要 exact，默认每一项匹配都是精准匹配原有的`<Redirect>`操作，被` <Navigate to="/" />` 代替！！
遇到` <Navigate/>` 组件，路由就会跳转，跳转到 to 指定的路由地址
设置 replace 属性，则不会新增立即记录，而是替换现有记录

```tsx
<Navigate to={{...}}/>// to 的值可以是一个对象：pathname 需要跳转的地址、search 问号传参信息
```





```jsx
const App = function App() {
    return <HashRouter>
        <div className="content">
            <Routes>
                <Route path="/" element={<Navigate to="/a" />} />
                <Route path="/a" element={<A />}>
                    {/* v6版本中，要求所有的路由(二级或者多级路由)，不再分散到各个组件中编写，而是统一都写在一起进行处理！！ */}
                    <Route index path="/a" element={<Navigate to="/a/a1" />} />{/*index属性设置其为主页面*/}
                    <Route path="/a/a1" element={<A1 />} />
                    <Route path="/a/a2" element={<A2 />} />
                    <Route path="/a/a3" element={<A3 />} />
                </Route>
                <Route path="/b" element={<B />} />
                <Route path="/c/:id?/:name?" element={<C />} />
                {/* 如果以上都不匹配，我们可以渲染404组件，也可以重定向到A组件「传递不同的问号参数信息」 */}
                <Route path="*" element={<Navigate to={{
                    pathname: '/a',
                    search: '?from=404'
                }} />} />
            </Routes>
        </div>
    </HashRouter>;
};

export default App;
```

```jsx
const A = function A() {
    return <DemoBox>
        <div className="menu">
            <Link to="/a/a1">A1</Link>
            <Link to="/a/a2">A2</Link>
            <Link to="/a/a3">A3</Link>
        </div>
        <div className="view">
            {/* Outlet：路由容器，用来渲染二级(多级)路由匹配的内容 */}
            <Outlet />
        </div>
    </DemoBox>;
};
```



#### 新的使用-路由表写法

`router/index.tsx`

```tsx
import React, { lazy } from 'react';
import Home from '@/views/home';
const About = lazy(() => import('@/views/about')); //懒加载
import { Navigate, useRoutes } from 'react-router-dom';
const routes = [
  {
    path: '/',
    element: <Navigate to="/home" replace={true} />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/about',
    element: <React.Suspense fallback={<div>Loading...</div>}><About/></React.Suspense> //懒加载
  }
];

const Router = () => {
  const router = useRoutes(routes);
  return router;
};
export default Router;

```



`App.tsx`

```tsx
import { BrowserRouter, Link } from 'react-router-dom';
import RouterView from './router';
function App() {
  return (
    <>
      <BrowserRouter>
        <Link to="/home">home</Link> {/*这些路由的东西必须包在BrowserRouter下*/}
        <Link to="/about">about</Link>
        <RouterView />
      </BrowserRouter>
    </>
  );
}

export default App;
```









### 常用的路由Hook

+ useNavigate  -> 代替5中的 useHistory   ：实现编程式导航
+ useLocation 「5中也有」：获取location对象信息  pathname/search/state….
+ useSearchParams「新增的」：获取问号传参信息，取到的结果是一个URLSearchParams对象
+ useParams「5中也有」：获取路径参数匹配的信息
———————
+ useMatch(pathname) -> 代替5中的 useRouteMatch「5中的这个Hook有用，可以基于params获取路径参数匹配的信息；但是在6中，这个Hook需要我们自己传递地址，而且params中也没有获取匹配的信息，用的就比较少了

### 实现路由跳转的方式

```js
<Link/NavLink to="/a" > 点击跳转路由
<Navigate to="/a" /> 遇到这个组件就会跳转


编程式导航：取消了history对象，基于navigate函数实现路由跳转
     import { useNavigate } from 'react-router-dom';
     const navigate = useNavigate();
     navigate('/c');
     navigate('/c', { replace: true });
     navigate({
        pathname: '/c'
     });
     navigate({
        pathname: '/c',
        search: '?id=100&name=zhufeng'
     });
     ...
     
             // 问号传参
        navigate({
            pathname: '/c',
            search: qs.stringify({
                id: 100,
                name: 'zhufeng'
            })
        }); 
        */

        /* // 路径参数
        navigate(`/c/100/zhufeng`); */

        // 隐式传参
        navigate('/c', {
            //历史记录池替换现有地址
            replace: true,
            //隐式传参信息
            state: {
                id: 100,
                name: 'zhufeng'
            }
        });
```

### 获取路由信息

在react-router-dom v6中 ，想获取相关的信息，我们只能基于Hook函数处理。首先要确保，需要使用“路由Hook”的组件，是在Router「HashRouter或BrowserRouter」内部包着的，否则使用这些Hook会报错。





### 封装**路由表及懒加载**

#### 手把手撸码的做法

`router/index.tsx`

```tsx
import { useRoutes, RouteObject } from 'react-router-dom'
import layoutItems from './layout'
import Layout from '../views/layout'
import Login from '../views/login'
const router_item: Array<RouteObject> = [
    {
      path: '/',
      element: <Layout />,
      label: '/',
      key:'/',
      children: layoutItems
  },
  {
    path: '/login',
    element: <Login></Login>,
    label: 'login',
    key: 'login',
  }
]
const GetRouter = () => {
  const routes: RouteObject[] = useRoutes(router_item)
  return routes
}
export default GetRouter

```





`App.tsx`

```tsx
import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import GetRouter from './router'
function App() {

  return (
    <HashRouter>
      <GetRouter/>
    </HashRouter>
  )
}

export default App
```







#### 珠峰的做法

router/index.js

```javascript
import React, { Suspense } from "react";

import { Route, Routes, useNavigate, useParams, useSearchParams, useLocation, useMatch } from 'react-router-dom';

import routes from "./routes";



// 渲染内容的特殊处理

const Element = function Element(props) {

    let { component: Component, path } = props,

        options = {

            navigate: useNavigate(),

            params: useParams(),

            query: useSearchParams()[0],

            location: useLocation(),

            match: useMatch(path)

        };

    return <Component {...options} />;

};



// 递归创建路由规则

const createRoute = function createRoute(routes) {

    return <>

        {routes.map((item, index) => {

            return <Route key={index} path={item.path} element={<Element {...item} />}>

                {item.children ? createRoute(item.children) : null}

            </Route>;

        })}

    </>;

};



// 路由表管控

const RouterView = function RouterView() {

    return <Suspense fallback={<>正在加载中...</>}>

        <Routes>

            {createRoute(routes)}

        </Routes>

    </Suspense>;

};

/* 创建withRouter-为了在组件中可以通过属性获得路由信息---其实是完全没必要的！ */
export const withRouter = function withRouter(Component) {
    // Component:真实要渲染的组件
    return function HOC(props) {
        // 提前获取路由信息，作为属性传递给Component
        const navigate = useNavigate(),
            location = useLocation(),
            params = useParams(),
            [usp] = useSearchParams();
        return <Component {...props} navigate={navigate} location={location} params={params} usp={usp} />;
    };
};

export default RouterView;
```

router/routes.js

```javascript
import { lazy } from 'react'; 

import { Navigate } from 'react-router-dom';

import A from '../views/A';

import aRoutes from './aRoutes';



const routes = [{

    path: '/',

    component: () => <Navigate to="/a" />

}, {

    path: '/a',

    name: 'a',

    component: A,

    meta: {},

    children: aRoutes

}, {

    path: '/b',

    name: 'b',

    component: lazy(() => import('../views/B')), //lazy()用于做懒加载

    meta: {}

}, {

    path: '/c',

    name: 'c',

    component: lazy(() => import('../views/C')),

    meta: {}

}, {

    path: '*',

    component: () => <Navigate to="/a" />

}];

export default routes;
```

router/aRoutes.js

```javascript
import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const aRoutes = [{

    path: '/a',

    component: () => <Navigate to="/a/a1" />

}, {

    path: '/a/a1',

    name: 'a-a1',

    component: lazy(() => import('../views/a/A1')),

    meta: {}

}, {

    path: '/a/a2',

    name: 'a-a2',

    component: lazy(() => import('../views/a/A2')),

    meta: {}

}, {

    path: '/a/a3',

    name: 'a-a3',

    component: lazy(() => import('../views/a/A3')),

    meta: {}

}];
export default aRoutes;
```

App.jsx

```javascript
import React from "react";
import { HashRouter } from 'react-router-dom';
import HomeHead from './components/HomeHead';
import RouterView from "./router";

const App = function App() {
    return <HashRouter>
        <HomeHead />
        <div className="content">
            <RouterView />
        </div>
    </HashRouter>;
};
export default App;
```





# React公共状态管理方案

## 什么是状态管理

跨层级组件之间的数据通信和状态共享。



## 概览

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-19-59-image-20230508195901131.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-19-59-image-20230508195901131.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-19-59-image-20230508195901131.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-19-59-image-20230508195901131.png" loading="lazy"/>
  </picture>

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-20-02-image-20230508200203569.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-20-02-image-20230508200203569.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-20-02-image-20230508200203569.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-05-08-20-02-image-20230508200203569.png" loading="lazy"/>
  </picture>



## redux

### **Redux 库和工具**

Redux 是一个小型的独立 JS 库， 但是它通常与其他几个包一起使用：
`React-Redux`：React-Redux是官方库，它让 React 组件与 Redux 有了交互，可以从 store 读取一些 state，可以通过 dispatch actions 来更新 store。
`Redux Toolkit`：Redux Toolkit 是我们推荐的编写 Redux 逻辑的方法。 它包含我们认为对于构建 Redux 应用程序必不可少的包和函数。 Redux Toolkit 构建在我们建议的最佳实践中，简化了大多数 Redux 任务，防止了常见错误，并使编写 Redux 应用程序变得更加容易。
`Redux DevTools 拓展`：Redux DevTools Extension 可以显示 Redux 存储中状态随时间变化的历史记录，这允许您有效地调试应用程序。



### 使用

#### 把store放到全局上

```jsx
/*store/index.js */
/* 管理员：修改STORE容器中的公共状态 */
let initial = {
    supNum: 10,
    oppNum: 5
};
const reducer = function reducer(state = initial, action) {
    // state:存储STORE容器中的公共状态「最开始没有的时候，赋值初始状态值initial」
    // action:每一次基于dispatch派发的时候，传递进来的行为对象「要求必须具备type属性，存储派发的行为标识」
    // 为了接下来的操作中，我们操作state，不会直接修改容器中的状态「要等到最后return的时候」，我们需要先克隆
    state = { ...state };
    // 接下来我们需要基于派发的行为标识，修改STORE容器中的公共状态信息
    switch (action.type) {
        case 'VOTE_SUP':
            state.supNum++;
            break;
        case 'VOTE_OPP':
            state.oppNum++;
            break;
        default:
    }
    // return的内容，会整体替换STORE容器中的状态信息
    return state;
};
/* 创建STORE公共容器 */
const store = createStore(reducer);
export default store;



/*ThemeContext.js*/
import { createContext } from 'react';
const ThemeContext = createContext();
export default ThemeContext;



/*index.js*/
...
import ThemeContext from './ThemeContext';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeContext.Provider
    value={{
      store
    }}>
    <Vote />
  </ThemeContext.Provider>
);
```



#### 组件中使用

##### subscribe

添加一个变化监听器。每当 dispatch action 的时候就会执行，state 树中的一部分可能已经变化。你可以在回调函数里调用 getState() 来拿到当前 state。

```jsx
import React, { useContext, useState, useEffect } from "react";
import './Vote.less';
import VoteMain from './VoteMain';
import VoteFooter from './VoteFooter';
import ThemeContext from "../ThemeContext";

const Vote = function Vote() {
    const { store } = useContext(ThemeContext);
    // 获取容器中的公共状态
    let { supNum, oppNum } = store.getState();

    let [num, setNum] = useState(0);
    const update = () => {
        setNum(num + 1);
    };
    useEffect(() => {
        //   + 组件第一次渲染完毕后,把让组件更新的方法放在STORE的事件池中
        //   + 执行返回的unsubscribe方法可以把刚才放入事件池中的方法移除掉
        let unsubscribe = store.subscribe(update);
        return () => {
            unsubscribe();
        };
    }, [num]); 

    return <div className="vote-box">
    </div>;
};
export default Vote;
```

##### dispatch

dispatch action。这是触发 state 变化的惟一途径。

将使用当前 [`getState()`](https://cn.redux.js.org/api/store#getstate) 的结果和传入的 `action` 以同步方式的调用 store 的 reducer 函数。它的返回值会被作为下一个 state。从现在开始，这就成为了 [`getState()`](https://cn.redux.js.org/api/store#getstate) 的返回值，同时变化监听器(change listener)会被触发。

```jsx
import React, { useContext } from "react";
import { Button } from 'antd';
import ThemeContext from "../ThemeContext";

const VoteFooter = function VoteFooter() {
    const { store } = useContext(ThemeContext);
    return <div className="footer">
        <Button type="primary"
            onClick={() => {
                store.dispatch({
                    type: 'VOTE_SUP'
                });
            }}>
            支持
        </Button>

        <Button type="primary" danger
            onClick={() => {
                store.dispatch({
                    type: 'VOTE_OPP'
                });
            }}>
            反对
        </Button>
    </div>;
};
export default VoteFooter;
```



### redux工程化

redux工程化其实就是“按模块划分”

。<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230319123011986.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230319123011986.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230319123011986.png" alt="image-20230319123011986" style="zoom:50%;" loading="lazy"/>
  </picture>

#### 举例说明

##### action-types.js

```jsx
export const VOTE_SUP = 'VOTE_SUP';
export const VOTE_OPP = 'VOTE_OPP';
```

##### reducers

###### voteReducer.js

```js
import { VOTE_SUP, VOTE_OPP } from '../action-types';
import _ from '@/assets/utils';
let initialState = {
    supNum: 10,
    oppNum: 5
};

export default function voteReducer(state = initialState, action) {

    state = _.clone(true, state);

    let { type, payload = 1 } = action;

    switch (type) {

        case VOTE_SUP:

            state.supNum += payload;

            break;

        case VOTE_OPP:

            state.oppNum += payload;

            break;

        default:

    }

    return state;

};
```

###### index.js

```jsx
import { combineReducers } from 'redux';

import voteReducer from './voteReducer';

/*

 state公共状态

   vote

     supNum: 10,
    
     oppNum: 5

 */

const reducer = combineReducers({

    vote: voteReducer

});

export default reducer;
```





##### actions

###### voteAction.js

```jsx
import { VOTE_SUP, VOTE_OPP } from '../action-types';
const voteAction = {
    support(payload) {
        return {
            type: VOTE_SUP,
            payload
        };
    },
    oppose() {
        return {
            type: VOTE_OPP
        };
    }
};
export default voteAction;
```







###### index.js

```jsx
import voteAction from "./voteAction";

const actions = {

    vote: voteAction

};

export default actions;
```



##### index.js

```js
import { createStore } from 'redux';

import reducer from './reducers';



/* 创建STORE */

const store = createStore(reducer);

export default store;
```







##### 在组件中需要修改的地方

```javascript
// 获取指定模块的状态

let { supNum, oppNum } = store.getState().vote;



// 派发任务的时候

import actions from '@/store/actions';

...

store.dispatch(actions.vote.support(10));

store.dispatch(actions.vote.oppose());
```



## react-redux

让redux在react项目中可以更简单的调用！React-Redux 将所有组件分成两大类：UI 组件（presentational component）和容器组件（container component）。

### Provider：把store注册到上下文中

不像redux那样啦，不再需要useContext啦。

```

import store from './store';

import { Provider } from 'react-redux';



root.render(

  <Provider store={store}>

    <Vote />

  </Provider>

);
```



### connect()

React-Redux 提供`connect`方法，用于从 UI 组件生成容器组件。`connect`的意思，就是将这两种组件连起来。

> ```javascript
> import { connect } from 'react-redux'
> const VisibleTodoList = connect()(TodoList);
> ```

上面代码中，`TodoList`是 UI 组件，`VisibleTodoList`就是由 React-Redux 通过`connect`方法自动生成的容器组件。

但是，因为没有定义业务逻辑，上面这个容器组件毫无意义，只是 UI 组件的一个单纯的包装层。为了定义业务逻辑，需要给出下面两方面的信息。

> （1）输入逻辑：外部的数据（即`state`对象）如何转换为 UI 组件的参数
>
> （2）输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

因此，`connect`方法的完整 API 如下。

> ```javascript
> import { connect } from 'react-redux'
> 
> const VisibleTodoList = connect(
>   mapStateToProps,
>   mapDispatchToProps
> )(TodoList)
> ```

上面代码中，`connect`方法接受两个参数：`mapStateToProps`和`mapDispatchToProps`。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将`state`映射到 UI 组件的参数（`props`），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。

#### mapStateToProps()

`mapStateToProps`是一个函数。它的作用就是像它的名字那样，建立一个从（外部的）`state`对象到（UI 组件的）`props`对象的映射关系。

作为函数，`mapStateToProps`执行后应该返回一个对象，里面的每一个键值对就是一个映射。请看下面的例子。

> ```javascript
> const mapStateToProps = (state) => {
>   return {
>     todos: getVisibleTodos(state.todos, state.visibilityFilter)
>   }
> }
> ```

上面代码中，`mapStateToProps`是一个函数，它接受`state`作为参数，返回一个对象。这个对象有一个`todos`属性，代表 UI 组件的同名参数，后面的`getVisibleTodos`也是一个函数，可以从`state`算出 `todos` 的值。

下面就是`getVisibleTodos`的一个例子，用来算出`todos`。

> ```javascript
> const getVisibleTodos = (todos, filter) => {
>   switch (filter) {
>     case 'SHOW_ALL':
>       return todos
>     case 'SHOW_COMPLETED':
>       return todos.filter(t => t.completed)
>     case 'SHOW_ACTIVE':
>       return todos.filter(t => !t.completed)
>     default:
>       throw new Error('Unknown filter: ' + filter)
>   }
> }
> ```

`mapStateToProps`会订阅 Store，每当`state`更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

`mapStateToProps`的第一个参数总是`state`对象，还可以使用第二个参数，代表容器组件的`props`对象。

> ```javascript
> // 容器组件的代码
> //    <FilterLink filter="SHOW_ALL">
> //      All
> //    </FilterLink>
> 
> const mapStateToProps = (state, ownProps) => {
>   return {
>     active: ownProps.filter === state.visibilityFilter
>   }
> }
> ```

使用`ownProps`作为参数后，如果容器组件的参数发生变化，也会引发 UI 组件重新渲染。

`connect`方法可以省略`mapStateToProps`参数，那样的话，UI 组件就不会订阅Store，就是说 Store 的更新不会引起 UI 组件的更新。

#### mapDispatchToProps()

`mapDispatchToProps`是`connect`函数的第二个参数，用来建立 UI 组件的参数到`store.dispatch`方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

如果`mapDispatchToProps`是一个函数，会得到`dispatch`和`ownProps`（容器组件的`props`对象）两个参数。

> ```javascript
> const mapDispatchToProps = (
>   dispatch,
>   ownProps
> ) => {
>   return {
>     onClick: () => {
>       dispatch({
>         type: 'SET_VISIBILITY_FILTER',
>         filter: ownProps.filter
>       });
>     }
>   };
> }
> ```

从上面代码可以看到，`mapDispatchToProps`作为函数，应该返回一个对象，该对象的每个键值对都是一个映射，定义了 UI 组件的参数怎样发出 Action。

如果`mapDispatchToProps`是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出。举例来说，上面的`mapDispatchToProps`写成对象就是下面这样。

> ```javascript
> const mapDispatchToProps = {
>   onClick: (filter) => {
>     type: 'SET_VISIBILITY_FILTER',
>     filter: filter
>   };
> }
> ```





## redux-toolkit

### 入口

store/index.js

```jsx
import { configureStore } from '@reduxjs/toolkit';
// import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import taskSliceReducer from './features/taskSlice';

const store = configureStore({
    // 指定reducer
    reducer: {
        // 按模块管理各个切片导出的reducer
        task: taskSliceReducer
    },
    // 使用中间件「如果我们不指定任何中间件，则默认集成了reduxThunk；但是一但设置，会整体替换默认值，需要手动指定thunk中间件！」
    middleware: [reduxThunk]
});
export default store;
```

### 每个store

举例：

features/taskStore.js

```jsx
/* TASK版块的切片，包含：REDUCER & ACTION-CREATOR */
import { createSlice } from '@reduxjs/toolkit';
import { getTaskList } from '../../api';

const taskSlice = createSlice({
    // 设置切片的名字
    name: 'task',
    // 设置此切片对应reducer中的初始状态
    initialState: {
        taskList: null
    },
    // 编写不同业务逻辑下，对公共状态的更改
    reducers: {
        getAllTaskList(state, action) {
            // state:redux中的公共状态信息「基于immer库管理，无需自己再克隆了」
            // action:派发的行为对象，我们无需考虑行为标识的问题了；传递的其他信息，都是以action.payload传递进来的值！！
            state.taskList = action.payload;
        },
        removeTask(state, { payload }) {
            let taskList = state.taskList;
            if (!Array.isArray(taskList)) return;
            state.taskList = taskList.filter(item => {
                // payload:接收传递进来的，要删除那一项的ID
                return +item.id !== +payload;
            });
        },
        updateTask(state, { payload }) {
            let taskList = state.taskList;
            if (!Array.isArray(taskList)) return;
            state.taskList = taskList.map(item => {
                if (+item.id === +payload) {
                    item.state = 2;
                    item.complete = new Date().toLocaleString('zh-CN');
                }
                return item;
            });
        }
    }
});

// 从切换中获取actionCreator：此处解构的方法和上面reducers中的方法，仅仅是函数名相同；方法执行，返回需要派发的行为对象；后期我们可以基于dispatch进行任务派发即可！！
export let { getAllTaskList, removeTask, updateTask } = taskSlice.actions;
// console.log(getAllTaskList([])); //=>{type: 'task/getAllTaskList', payload: []}
export const removeTaskAction = removeTask;
export const updateTaskAction = updateTask;

// 实现异步派发「redux-thunk」
export const getAllTaskListAsync = () => {
    return async dispatch => {
        let list = [];
        try {
            let result = await getTaskList(0);
            if (+result.code === 0) {
                list = result.list;
            }
        } catch (_) { }
        dispatch(getAllTaskList(list));
    };
};

// 从切片中获取reducer
export default taskSlice.reducer;
```

### 组件中使用

```js
import { useSelector, useDispatch } from 'react-redux';
import { getAllTaskListAsync, removeTaskAction, updateTaskAction } from '../store/features/taskSlice';
/* 获取公共状态和派发的方法 */
let { taskList } = useSelector(state => state.task),dispatch = useDispatch();
    const submit = async () => {
        try {
                await dispatch(
                    getAllTaskListAsync()
                );
        } catch (_) { }
    };
```





# 实践

## 类似vue的`<components/>`效果

在 React 18 中，没有与 Vue 3 的 `<component />` 组件完全类似的概念。但是，React 动态渲染组件的能力类似于 Vue 3 中的 `<component />` 功能。

例如，假设您有两个组件：`ComponentA` 和 `ComponentB`，您可以根据某个条件动态渲染其中一个。

```jsx
import React, { useState } from "react";
import ComponentA from "./ComponentA";
import ComponentB from "./ComponentB";

function ParentComponent() {
  const [activeComponent, setActiveComponent] = useState("A");

  const components = {
    A: ComponentA,
    B: ComponentB,
  };

  const ActiveComponent = components[activeComponent];

  return (
    <div>
      <ActiveComponent />
      <button onClick={() => setActiveComponent("A")}>显示 A 组件</button>
      <button onClick={() => setActiveComponent("B")}>显示 B 组件</button>
    </div>
  );
}

export default ParentComponent;
```







# 原理

## JSX底层渲染机制(创建virsualDom)

### 整体步骤

####   第一步：把JSX语法，编译为虚拟DOM对象「virtualDOM」

虚拟DOM对象：框架自己内部构建的一套对象体系（对象的相关成员都是React内部规定的）。基于这些属性描述出我们所构建视图中的DOM节点的相关特征。

1. 基于 babel-preset-react-app 把JSX编译为 React.createElement(...) 这种格式。
    React.createElement(ele,props,...children) 
           + ele：元素标签名「或组件」
           + props：元素的属性集合(对象)「如果没有设置过任何的属性，则此值是null」
           + children：第三个及以后的参数，都是当前元素的子节点
2. <font color="red">createElement 方法执行，创建出virtualDOM虚拟DOM对象</font>「也有称之为：JSX元素、JSX对象、ReactChild对象」

```js
virtualDOM = {
    $$typeof: Symbol(react.element),
    ref: null,
    key: null,
    type: 标签名「或组件」,
    // 存储了元素的相关属性 && 子节点信息
    props: {
        元素的相关属性,
        children:子节点信息「没有子节点则没有这个属性、属性值可能是一个值、也可能是一个数组」
    }
  }
```

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230314131802049.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230314131802049.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230314131802049.png" alt="image-20230314131802049" style="zoom:50%;" loading="lazy"/>
  </picture>

####   第二步：把构建的virtualDOM渲染为真实DOM

利用render方法：第一次渲染页面是直接从virtualDOM->真实DOM；

render函数在渲染的时候，如果type是：
   + 字符串：创建一个标签

   + 普通函数：把函数执行，并且把props传递给函数

        + 构造函数：把构造函数基于new执行「也就是创建类的一个实例」，也会把解析出来的props传递过去
      + <font color="red">每调用一次类组件都会创建一个单独的实例</font>
      
      + 把在类组件中编写的render函数执行，把返回的jsx「virtualDOM」当做组件视图进行渲染！！
        
        
        

但是后期视图更新的时候，需要经过一个DOM-DIFF的对比，计算出补丁包PATCH（两次视图差异的部分），把PATCH补丁包进行渲染。





###   函数组件渲染机制

举例：

```tsx
 <DemoOne title="我是标题" x={10} data={[100, 200]} className="box" style={{ fontSize: '20px' }} />
```





1.  基于babel-preset-react-app把调用的组件转换为createElement格式

   ```jsx
      React.createElement(DemoOne, {
               title: "\u6211\u662F\u6807\u9898",
               x: 10,
               data: [100, 200],
               className: "box",
               style: {
                   fontSize: '20px'
               }
           })
   ```

   

2.  把createElement方法执行，创建出一个virtualDOM对象。

   ```jsx
          {
               $$typeof: Symbol(react.element),
               key: null,
               props: {title: '我是标题', x: 10, data: 数组, className: 'box', style: {fontSize: '20px'}}, //如果有子节点「双闭合调用」，则也包含children！！
               ref: null,
               type: DemoOne
           }
   ```

   

3. 基于root.render把virtualDOM变为真实的DOM
           type值此时是一个函数，此时：

      + 把函数执行 -> DemoOne()
      + 把virtualDOM中的props，作为实参传递给函数 -> DemoOne(props)
      + 接收函数执行的返回结果「也就是当前组件的virtualDOM对象」
      + 最后基于render把组件返回的虚拟DOM变为真实DOM，插入到#root容器中

   

## 前端路由的原理

### **1. 哈希（hash）路由**

原理：每一次路由跳转，都是改变页面的hash值；并且监听hashchange事件，渲染不同的内容！！

```xml
<nav class="nav-box">

    <a href="#/">首页</a>

    <a href="#/product">产品中心</a>

    <a href="#/personal">个人中心</a>

</nav>

<div class="view-box"></div>



<!-- IMPORT JS -->

<script>

    // 路由容器

    const viewBox = document.querySelector('.view-box');

    // 路由表

    const routes = [{

        path: '/',

        component: '首页内容'

    }, {

        path: '/product',

        component: '产品中心内容'

    }, {

        path: '/personal',

        component: '个人中心内容'

    }];



    // 页面一加载，我们设置默认的hash值

    location.hash = '/';



    // 路由匹配的方法

    const routerMatch = function routerMatch() {

        let hash = location.hash.substring(1),

            text = "";

        routes.forEach(route => {

            if (route.path === hash) {

                text = route.component;

            }

        });

        viewBox.innerHTML = text;

    };

    routerMatch();

    window.addEventListener('hashchange', routerMatch);

</script>
```

### **2. 浏览器（history）路由**

原理：利用H5的HistoryAPI完成路由的切换和组件的渲染！
https://developer.mozilla.org/zh-CN/docs/Web/API/History_API

```xml
<nav class="nav-box">

    <a href="/">首页</a>

    <a href="/product">产品中心</a>

    <a href="/personal">个人中心</a>

</nav>

<div class="view-box"></div>



<!-- IMPORT JS -->

<script>

    const viewBox = document.querySelector('.view-box'),

        navBox = document.querySelector('.nav-box');

    const routes = [{

        path: '/',

        component: '首页内容'

    }, {

        path: '/product',

        component: '产品中心内容'

    }, {

        path: '/personal',

        component: '个人中心内容'

    }];



    // 路由匹配

    const routerMatch = function routerMatch() {

        let path = location.pathname,

            text = "";

        routes.forEach(route => {

            if (route.path === path) {

                text = route.component;

            }

        });

        viewBox.innerHTML = text;

    };



    history.pushState({}, "", "/");

    routerMatch();



    // 控制路由切换

    navBox.addEventListener('click', function (ev) {

        let target = ev.target;

        if (target.tagName === 'A') {

            // 阻止默认行为

            ev.preventDefault();

            // 实现路由的跳转

            history.pushState({}, "", target.href);

            routerMatch();

        }

    });



    /* 

     popstate事件触发时机：

     1）点击浏览器的前进、后退按钮

     2）调用history.go/forward/back等方法

     注意：history.pushState/replaceState不会触发此事件

     */

    window.addEventListener('popstate', routerMatch);

</script>
```



# v16与v18的区别

## index.js文件里

​    v16版本里的index.js是这样的：

```js
      ReactDOM.render(
        <>...</>,
        document.getElementById('root')
      );
```

v18版本里的index.js是这样的：
```js
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <>...</>
  );
```



## 与v16关于setState是同步还是异步的区别

​    React18中：不论在什么地方执行setState，它都是异步的「都是基于updater更新队列机制，实现的批处理」

​    React16中：如果在合成事件「jsx元素中基于onXxx绑定的事件」、周期函数中，setState的操作是异步的！！但是如果setState出现在其他异步操作中「例如：定时器、手动获取DOM元素做的事件绑定等」，它将变为同步的操作「立即更新状态和让视图渲染」

```jsx
   handle = () => {
        let { x, y, z } = this.state;
        this.setState({ x: x + 1 }); //异步
        this.setState({ y: y + 1 }); //异步
        console.log(this.state); //{x:10,y:5,z:0} -> 渲染

        setTimeout(() => {
            this.setState({ z: z + 1 }); //异步 //如果是v16则这里会变成同步的
            console.log(this.state); //{x:11,y:6,z:0} -> 渲染  // 如果是v16则这里变成输出{x:11,y:6,z:1},因为上面那行代码执行了导致了渲染。即先渲染->{x:11,y:6,z:1}
        }, 1000);
    }; 
```

## 事件委托的区别

<font color="red">React中的合成事件都是基于“事件委托”处理的</font>

​     \+ 在React17及以后版本，合成事件都是委托给#root这个容器「捕获和冒泡都做了委托」；

​     \+ 在17版本以前，合成事件都是委托给document容器的「而且只做了冒泡阶段的委托」；。即如果在元素上做了事件委托，不管是冒泡还是捕获阶段的，都统一在document的冒泡阶段再执行。而且react16有一个“事件对象池”机制。即在本次事件触发时，从事件对象池中获取存储的合成事件对象，把信息赋值给相关的成员。等本次操作结束后就把合成事件对象中的成员信息都清空，再放入到事件对象池中。

​	+ **Vue中的事件处理机制**是给创建的DOM元素，单独基于`addEventListener`实现事件绑定。

​     \+ 对于没有实现事件传播机制的事件，才是单独做的事件绑定「例如：onMouseEnter/onMouseLeave...」



react17及以后整个事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png" alt="image-20230316135339121" style="zoom: 33%;" loading="lazy"/>
  </picture> 



react16事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png" alt="image-20230316190929886" style="zoom: 67%;" loading="lazy"/>
  </picture>



# vue与react的区别

## MVVM、MVC的区别

MVC 和 MVVM 是2种常见的软件架构设计模式，主要通过分离关注点的方式来组织代码结构，优化开发效率。

**（1）MVC**

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230313212708681.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230313212708681.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230313212708681.png" alt="image-20230313212708681" style="zoom:50%;" loading="lazy"/>
  </picture>

React采用的是MVC。“单向驱动”。如果要实现双向驱动得自己写代码。

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IYTbAl.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IYTbAl.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IYTbAl.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-IYTbAl.png" loading="lazy"/>
  </picture>

（2）MVVM

Vue采用的是MVVM。“双向驱动”。

MVVM 分为 Model、View、ViewModel：

- Model代表数据模型，数据和业务逻辑都在Model层中定义；
- View代表UI视图，负责数据的展示；
- ViewModel负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定(就是v-model)的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了 Model和View的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作DOM。

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-kEHaIY.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-kEHaIY.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-kEHaIY.png" alt="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-kEHaIY.png" loading="lazy"/>
  </picture>







### **MVVM**的优缺点

优点: 

- 分离视图（View）和模型（Model），降低代码耦合，提⾼视图或者逻辑的重⽤性: ⽐如视图（View）可以独⽴于Model变化和修改，⼀个ViewModel可以绑定不同的"View"上，当View变化的时候Model不可以不变，当Model变化的时候View也可以不变。你可以把⼀些视图逻辑放在⼀个ViewModel⾥⾯，让很多view重⽤这段视图逻辑 
- 提⾼可测试性: ViewModel的存在可以帮助开发者更好地编写测试代码 
- ⾃动更新dom: 利⽤双向绑定,数据更新后视图⾃动更新,让开发者从繁琐的⼿动dom中解放 



缺点: 

- Bug很难被调试: 因为使⽤双向绑定的模式，当你看到界⾯异常了，有可能是你View的代码有Bug，也可能是Model的代码有问题。数据绑定使得⼀个位置的Bug被快速传递到别的位置，要定位原始出问题的地⽅就变得不那么容易了。另外，数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的 
- ⼀个⼤的模块中model也会很⼤，虽然使⽤⽅便了也很容易保证了数据的⼀致性，当时⻓期持有，不释放内存就造成了花费更多的内存 
- 对于⼤型的图形应⽤程序，视图状态较多，ViewModel的构建和维护的成本都会⽐较⾼。



## 事件委托的区别

<font color="red">React中的合成事件都是基于“事件委托”处理的</font>

​     \+ 在React17及以后版本，合成事件都是委托给#root这个容器「捕获和冒泡都做了委托」；

​     \+ 在17版本以前，合成事件都是委托给document容器的「而且只做了冒泡阶段的委托」；。即如果在元素上做了事件委托，不管是冒泡还是捕获阶段的，都统一在document的冒泡阶段再执行。而且react16有一个“事件对象池”机制。即在本次事件触发时，从事件对象池中获取存储的合成事件对象，把信息赋值给相关的成员。等本次操作结束后就把合成事件对象中的成员信息都清空，再放入到事件对象池中。

​	+ **Vue中的事件处理机制**是给创建的DOM元素，单独基于`addEventListener`实现事件绑定。

​     \+ 对于没有实现事件传播机制的事件，才是单独做的事件绑定「例如：onMouseEnter/onMouseLeave...」



react17及以后整个事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316135339121.png" alt="image-20230316135339121" style="zoom: 33%;" loading="lazy"/>
  </picture> 

react16事件流过程：

<picture>
    <source type="image/avif" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/avif">
    <source type="image/webp" srcset="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png?imageMogr2/format/webp">
    <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20230316190929886.png" alt="image-20230316190929886" style="zoom: 67%;" loading="lazy"/>
  </picture>





## 我说的

### css隔离方案

react本身没有处理这个，而vue是给每个组件生成一个hash属性，组件里的样式会带上这个属性选择器。



### 不可变数据

据说react是向往不可变数据的，这个等用react的时候再研究。

Vue.js 的响应式系统是基于可变数据的。这意味着，当你更改一个对象或数组的属性时，Vue.js 能够检测到这些更改，并自动更新依赖于这些数据的任何部分。例如，如果你在模板中引用了一个数据属性，并且你在组件的方法中更改了该属性的值，那么 Vue.js 将自动更新模板以反映新的值。

vue中不可变的数据主要有以下两种，但实际上跟我们讲的不可变不太一样，这里的不可变是真的不能变，不让你改。我们说的不可变是你改了之后会生成一个新的引用。

1. **Props 的不变性**：在 Vue.js 中，父组件传递给子组件的 props 应该被视为不可变的。子组件不应该修改 props 的值，而是应该基于 props 的值定义自己的本地数据或计算属性。这样可以确保数据的单向流动，使得应用的状态更易于理解和管理。参考：Props。
2. **使用计算属性返回新的数据**：在 Vue.js 中，我们通常使用计算属性来根据现有的响应式数据生成新的数据。这些计算属性应该是纯函数，即它们不应该修改其依赖的数据，而是应该返回新的数据。这样可以确保数据的不变性，并使得应用的状态更易于理解和管理。

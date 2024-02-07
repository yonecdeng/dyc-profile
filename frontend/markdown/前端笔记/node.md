# node

## 安装

在Node的安装过程中，实际上还会安装上NPM工具。











## 简介

### 架构

<font color="red">Node基于事件驱动和非阻塞设计</font>

对比chrome浏览器，浏览器中除了V8作为JavaScript引擎外，还有一个WebKit布局引擎。除了HTML、WebKit和显卡这些UI相关技术没有支持外，Node的结构与Chrome十分相似。它们都是基于事件驱动的异步架构，浏览器通过事件驱动来服务界面上的交互，Node通过事件驱动来服务I/O。

V8就是c代码，所以依赖一些c的标准库比如glibc。如果发现高版本的node用不了，有可能是当前系统不具备其依赖的底层c库版本，比如node18依赖的glibc版本比较高，如果系统不具备这么高版本的glibc，那么就用不了node18。

![image-20230805144710621](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-14-47-image-20230805144710621.png)



Node起初只可以在Linux平台上运行，兼容Windows和*nix平台主要得益于Node在架构层面的改动，它在操作系统与Node上层模块系统之间构建了一层平台层架构，即libuv。目前，libuv已经成为许多系统实现跨平台的基础组件。

![image-20230805145923059](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-14-59-image-20230805145923059.png)



### 单线程

这里的单线程是指  JavaScript将会运行在单个进程的单个线程上。

#### 好处

没有多线程的情况下没有锁、线程同步问题，操作系统在调度时也因为较少上下文的切换，可以很好地提高CPU的使用率。避免了不必要的内存开销和上下文切换开销。

影响事件驱动服务模型性能的点在于CPU的计算能力，它的上限决定这类服务模型的性能上限，但它不受多进程或多线程模式中资源上限的影响，可伸缩性远比前两者高。如果解决掉多核CPU的利用问题，带来的性能上提升是可观的。---理想状态下每个进程各自利用一个CPU，以此实现多核CPU的利用。

#### 坏处

1. 如今CPU基本均是多核的，真正的服务器（非VPS）往往还有多个CPU。一个Node进程只能利用一个核，如何充分利用多核CPU服务器？
2. 一旦单线程上抛出的异常没有被捕获，将会引起整个进程的崩溃。这给Node的实际应用抛出了第二个问题：如何保证进程的健壮性和稳定性？



### 异步I/O --- 事件循环

#### 阻塞与非阻塞

##### 简介

从计算机内核I/O而言，同步/异步和阻塞/非阻塞实际上是两回事。是通过阻塞/非阻塞来实现同步/异步IO。

操作系统内核对于I/O只有两种方式：阻塞与非阻塞。在调用阻塞I/O时，应用程序需要等待I/O完成才返回结果。阻塞I/O造成CPU等待I/O，浪费等待时间，CPU的处理能力不能得到充分利用。

阻塞I/O完成整个获取数据的过程，而非阻塞I/O则不带数据直接返回，要获取数据，还需要通过文件描述符再次读取。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-16-55-image-20230805165525887.png" alt="image-20230805165525887" style="zoom:50%;" />                                      <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-16-55-image-20230805165546171.png" alt="image-20230805165546171" style="zoom:50%;" />  

非阻塞I/O返回之后，CPU的时间片可以用来处理其他事务，此时的性能提升是明显的。



##### 非阻塞

###### 存在的问题

阻塞I/O造成CPU等待浪费，非阻塞带来的麻烦却是需要轮询去确认是否完全完成数据获取，它会让CPU处理状态判断，是对CPU资源的浪费。

非阻塞I/O也存在一些问题。由于完整的I/O并没有完成，立即返回的并不是业务层期望的数据，而仅仅是当前调用的状态。为了获取完整的数据，应用程序需要重复调用I/O操作来确认是否完成。这种重复调用判断操作是否完成的技术叫做轮询。轮询技术满足了非阻塞I/O确保获取完整数据的需求，但是对于应用程序而言，它仍然只能算是一种同步，因为应用程序仍然需要等待I/O完全返回，依旧花费了很多时间来等待。等待期间，CPU要么用于遍历文件描述符的状态，要么用于休眠等待事件发生。

###### 解决方案--轮询

epoll。该方案是Linux下效率最高的I/O事件通知机制，在进入轮询的时候如果没有检查到I/O事件，将会进行休眠，直到事件发生将它唤醒。它是真实利用了事件通知、执行回调的方式，而不是遍历查询，所以不会浪费CPU，执行效率较高。

![image-20230805192759370](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-19-27-image-20230805192759370.png)







#### node如何实现异步I/O --- 事件循环

##### 综述

我们时常提到Node是单线程的，这里的单线程仅仅只是JavaScript执行在单线程中罢了。在Node中，无论是*nix还是Windows平台，内部完成I/O任务的另有线程池。

事件循环、观察者、请求对象、I/O线程池（后两个看深入浅出node.js去）这四者共同构成了Node异步I/O模型的基本要素。

利用事件循环的方式，JavaScript线程像一个分配任务和处理结果的大管家，I/O线程池里的各个I/O线程都是小二，负责兢兢业业地完成分配来的任务，小二与管家之间互不依赖，所以可以保持整体的高效率。

Windows下主要通过IOCP来向系统内核发送I/O调用和从内核获取已完成的I/O操作，配以事件循环，以此完成异步I/O的过程。在Linux下通过epoll实现这个过程，FreeBSD下通过kqueue实现，Solaris下通过Event ports实现。不同的是线程池在Windows下由内核（IOCP）直接提供，*nix系列下由libuv自行实现。

![image-20230805164931276](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-16-49-image-20230805164931276.png)





##### 事件循环

进程启动时，Node便会创建一个类似于while(true)的循环，每执行一次循环体的过程我们称为Tick。每个Tick的过程就是查看是否有事件待处理，如果有，就取出事件及其相关的回调函数。如果存在关联的回调函数，就执行它们。

![image-20230805163341935](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-16-33-image-20230805163341935.png)





##### 观察者

###### 简介

事件循环是一个典型的生产者/消费者模型。异步I/O、网络请求等则是事件的生产者，源源不断为Node提供不同类型的事件，这些事件被传递到对应的观察者那里，事件循环则从观察者那里取出事件并处理。在Windows下，这个循环基于IOCP创建，而在*nix下则基于多线程创建。

###### 优先级

事件循环对观察者的检查是有先后顺序的，process.nextTick()属于idle观察者，setImmediate()属于check观察者。在每一个轮循环检查中，<font color="red">idle观察者先于I/O观察者，I/O观察者先于check观察者。</font>



###### 不同系统实现

在Windows下，这个循环基于IOCP创建，而在*nix下则基于多线程创建。



#### web服务器

##### 经典的服务器模型

下面为几种经典的服务器模型，这里对比下它们的优缺点。

 同步式。对于同步式的服务，一次只能处理一个请求，并且其余请求都处于等待状态。

 每进程/每请求。为每个请求启动一个进程，这样可以处理多个请求，但是它不具备扩展

性，因为系统资源只有那么多。

 每线程/每请求。为每个请求启动一个线程来处理。尽管线程比进程要轻量，但是由于每

个线程都占用一定内存，当大并发请求到来时，内存将会很快用光，导致服务器缓慢。



##### node做web服务器

###### 网络套接字

异步I/O不仅仅应用在文件操作中。对于网络套接字的处理，Node也应用到了异步I/O，网络套接字上侦听到的请求都会形成事件交给I/O观察者。事件循环会不停地处理这些网络I/O事件。如果JavaScript有传入回调函数，这些事件将会最终传递到业务逻辑层进行处理。

![image-20230805195757220](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-19-57-image-20230805195757220.png)





###### 性能高的原因

Node通过事件驱动的方式处理请求，无须为每一个请求创建额外的对应线程，可以省掉创建线程和销毁线程的开销，同时操作系统在调度任务时因为线程较少，上下文切换的代价很低。



###### 跟nginx对比

知名服务器Nginx采用了和Node相同的事件驱动，不同之处在于Nginx采用纯C写成，性能较高，但是它仅适合于做Web服务器，用于反向代理或负载均衡等服务，在处理具体业务方面较为欠缺。Node则是一套高性能的平台，可以利用它构建与Nginx相同的功能，也可以处理各种具体业务，而且与背后的网络保持异步畅通。两者相比，Node没有Nginx在Web服务器方面那么专业，但场景更大，自身性能也不错。





#### 好处

- 用户体验更好：采用异步请求，在下载资源期间，JavaScript和UI的执行都不会处于等待状态，可以继续响应用户的交互行为。同步和异步两间总消耗，前者为*M*+*N*，后者为max（*M*, *N*）。

- 资源分配：node利用单线程，远离多线程死锁、状态同步、从操作系统调度多线程的上下文切换开销等问题；利用异步I/O，让单线程远离阻塞，以更好地使用CPU，在单线程上将资源分配得更高效。为了弥补单线程无法利用多核CPU的缺点，Node提供了类似前端浏览器中Web Workers的子进程，该子进程可以通过工作进程高效地利用CPU和I/O。

- 分布式和云。并行使得各个单点之间能够更有效地组织起来，这也是Node在云计算厂商中广受青睐的原因。

  ![image-20230809182936088](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-09-18-29-image-20230809182936088.png)

如果采用传统的同步I/O模型，分布式计算中性能的折扣将会是明显的

![image-20230809183001090](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-09-18-30-image-20230809183001090.png)



#### 非 I/O 的异步 API 



##### setTimeout()和setInterval()

它们的实现原理与异步I/O比较类似，只是不需要I/O线程池的参与。调用setTimeout()或者setInterval()创建的定时器会被插入到定时器观察者内部的一个红黑树中。每次Tick执行时，会从该红黑树中迭代取出定时器对象，检查是否超过定时时间，如果超过，就形成一个事件，它的回调函数将立即执行



##### process.nextTick()

每次调用process.nextTick()方法，只会将回调函数放入队列中，在下一轮Tick时取出执行。定时器中采用红黑树的操作时间复杂度为O(lg(n))，nextTick()的时间复杂度为O(1)。



##### setImmediate()

process.nextTick()的回调函数保存在一个数组中，setImmediate()的结果则是保存在链表中。在行为上，process.nextTick()在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数。

建议对CPU的耗用不要超过10 ms，或者将大量的计算分解为诸多的小量计算，通过setImmediate()进行调度。





#### 控制并发

##### 虽然是异步但也要控制并发

在Node中，我们可以十分方便地利用异步发起并行调用。使用下面的代码，我们可以轻松发起100次异步调用：

for (var i = 0, i < 100; i++) { 

 async(); 

} 

但是如果并发量过大，我们的下层服务器将会吃不消。如果是对文件系统进行大量并发调用，操作系统的文件描述符数量将会被瞬间用光，抛出如下错误：

Error: EMFILE, too many open files 

可以看出，异步I/O与同步I/O的显著差距：同步I/O因为每个I/O都是彼此阻塞的，在循环体中，总是一个接着一个调用，不会出现耗用文件描述符太多的情况，同时性能也是低下的；对于异步I/O，虽然并发容易实现，但是由于太容易实现，依然需要控制。换言之，尽管是要压榨底层系统的性能，但还是需要给予一定的过载保护，以防止过犹不及。





##### 方案一bagpipe的解决方案

 通过一个队列来控制并发量。

 如果当前活跃（指调用发起但未执行回调）的异步调用量小于限定值，从队列中取出执行。

 如果活跃调用达到限定值，调用暂时存放在队列中。

 每个异步调用结束时，从队列中取出新的异步调用执行。

bagpipe的API主要暴露了一个push()方法和full事件，示例代码如下：

```js
var Bagpipe = require('bagpipe'); 

// 设定最大并发数为10

var bagpipe = new Bagpipe(10); 

for (var i = 0; i < 100; i++) { 

 bagpipe.push(async, function () { 

 // 异步回调执行

 }); 

} 

bagpipe.on('full', function (length) { 

 console.warn('底层系统处理不能及时完成，队列拥堵，目前队列长度为:' + length); 

}); 
```



这里的实现细节类似于前文的smooth()。push()方法依然是通过函数变换的方式实现，假设

第一个参数是方法，最后一个参数是回调函数，其余为其他参数，其核心实现如下：

/** 

 \* 推入方法，参数。最后一个参数为回调函数

 \* @param {Function} method 异步方法

 \* @param {Mix} args 参数列表，最后一个参数为回调函数

 */ 

Bagpipe.prototype.push = function (method) { 

 var args = [].slice.call(arguments, 1); 

 var callback = args[args.length - 1]; 

 if (typeof callback !== 'function') { 

 args.push(function () {}); 

 } 

 if (this.options.disabled || this.limit < 1) { 

 method.apply(null, args); 

 return this; 

 } 

 // 队列长度也超过限制值时

 if (this.queue.length < this.queueLength || !this.options.refuse) { 

 this.queue.push({ 

 method: method, 

 args: args 

 }); 

 } else { 

 var err = new Error('Too much async call in queue'); 

 err.name = 'TooMuchAsyncCallError'; 

 callback(err); 

 } 

 if (this.queue.length > 1) { 

 this.emit('full', this.queue.length); 

 } 

 this.next(); 

 return this; 

}; 

将调用推入队列后，调用一次next()方法尝试触发。next()方法的定义如下：

/*! 

 \* 继续执行队列中的后续动作

 */ 

Bagpipe.prototype.next = function () { 

 var that = this; 

 if (that.active < that.limit && that.queue.length) { 

 var req = that.queue.shift(); 

 that.run(req.method, req.args); 

 } 

}; 

next()方法主要判断活跃调用的数量，如果正常，将调用内部方法run()来执行真正的调用。

这里为了判断回调函数是否执行，采用了一个注入代码的技巧，具体代码如下：

/*! 

 \* 执行队列中的方法

 */ 

Bagpipe.prototype.run = function (method, args) { 

 var that = this; 

 that.active++; 

 var callback = args[args.length - 1]; 

 var timer = null; 

 var called = false; 

 // inject logic 

 args[args.length - 1] = function (err) { 

 // anyway, clear the timer 

 if (timer) { 

 clearTimeout(timer); 

 timer = null; 

 } 

 // if timeout, don't execute 

 if (!called) { 

 that._next(); 

 callback.apply(null, arguments); 

 } else { 

 // pass the outdated error 

 if (err) { 

 that.emit('outdated', err); 

 } 

 } 

 }; 

 var timeout = that.options.timeout; 

 if (timeout) { 

 timer = setTimeout(function () { 

 // set called as true

 called = true; 

 that._next(); 

 // pass the exception 

 var err = new Error(timeout + 'ms timeout'); 

 err.name = 'BagpipeTimeoutError'; 

 err.data = { 

 name: method.name, 

 method: method.toString(), 

 args: args.slice(0, -1) 

 }; 

 callback(err); 

 }, timeout); 

 } 

 method.apply(null, args); 

}; 

用户传入的回调函数被真正执行前，被封装替换过。这个封装的回调函数内部的逻辑将活跃

值的计数器减1后，主动调用next()执行后续等待的异步调用。

bagpipe类似于打开了一道窗口，允许异步调用并行进行，但是严格限定上限。仅仅在调用

push()时分开传递，并不对原有API有任何侵入。

 拒绝模式

事实上，bagpipe还有一些深度的使用方式。对于大量的异步调用，也需要分场景进行区分，

因为涉及并发控制，必然会造成部分调用需要进行等待。如果调用有实时方面的需求，那么需要

快速返回，因为等到方法被真正执行时，可能已经超过了等待时间，即使返回了数据，也没有意

义了。这种场景下需要快速失败，让调用方尽早返回，而不用浪费不必要的等待时间。bagpipe

为此支持了拒绝模式。

拒绝模式的使用只要设置下参数即可，相关代码如下：

// 设定最大并发数为10

var bagpipe = new Bagpipe(10, { 

 refuse: true 

}); 

在拒绝模式下，如果等待的调用队列也满了之后，新来的调用就直接返给它一个队列太忙的

拒绝异常。

 超时控制

造成队列拥塞的主要原因是异步调用耗时太久，调用产生的速度远远高于执行的速度。为了防

止某些异步调用使用了太多的时间，我们需要设置一个时间基线，将那些执行时间太久的异步调用

清理出活跃队列，让排队中的异步调用尽快执行。否则在拒绝模式下，会有太多的调用因为某个执

行得慢，导致得到拒绝异常。相对而言，这种场景下得到拒绝异常显得比较无辜。为了公平地对待

在实时需求场景下的每个调用，必须要控制每个调用的执行时间，将那些害群之马踢出队伍。

为此，bagpipe也提供了超时控制。超时控制是为异步调用设置一个时间阈值，如果异步调用

没有在规定时间内完成，我们先执行用户传入的回调函数，让用户得到一个超时异常，以尽早返

回。然后让下一个等待队列中的调用执行。

超时的设置如下：

// 设定最大并发数为10 

var bagpipe = new Bagpipe(10, { 

 timeout: 3000 

}); 



##### 方案二async的解决方案





async也提供了一个方法用于处理异步调用的限制：parallelLimit()。如下是async

的示例代码：

```js
async.parallelLimit([ 

 function (callback) { 

 fs.readFile('file1.txt', 'utf-8', callback); 

 }, 

 function (callback) { 

 fs.readFile('file2.txt', 'utf-8', callback); 

 } 

], 1, function (err, results) { 

 // TODO 

}); 
```





parallelLimit()与parallel()类似，但多了一个用于限制并发数量的参数，使得任务只能同

时并发一定数量，而不是无限制并发。

parallelLimit()方法的缺陷在于无法动态地增加并行任务。为此，async提供了queue()方法

来满足该需求，这对于遍历文件目录等操作十分有效。以下是queue()的示例代码：

```js
var q = async.queue(function (file, callback) { 

 fs.readFile(file, 'utf-8', callback); 

}, 2); 

q.drain = function () { 

 // 完成了队列中的所有任务

}; 

fs.readdirSync('.').forEach(function (file) { 

 q.push(file, function (err, data) { 

 // TODO

 }); 

}); 
```



尽管queue()实现了动态添加并行任务，但是相比parallelLimit()，由于queue()接收的参数

是固定的，它丢失了parallelLimit()的多样性，我私心地认为bagpipe更灵活，可以添加任意类

型的异步任务，也可以动态添加异步任务，同时还能够在实时处理场景中加入拒绝模式和超时控

制。

### 应用场景

- 适合I/O密集型。Node面向网络且**擅长并行I/O**，能够有效地组织起更多的硬件资源。**因为**Node利用事件循环的处理能力，而不是启动每一个线程为每一个请求服务，资源占用极少。

- CPU密集型应用给Node带来的挑战主要是：由于JavaScript单线程的原因，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起。即CPU 密集型应用可能会让 nodejs 的单线程模型成为性能瓶颈。但是可以适当调整和分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞I/O调用的发起。

- 分布式和云。基于事件驱动可以实现与大量的客户端进行连接，非阻塞设计则让它可以更好地提升网络的响应吞吐。。

  ![image-20230809182936088](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-09-18-29-image-20230809182936088.png)

如果采用传统的同步I/O模型，分布式计算中性能的折扣将会是明显的

![image-20230809183001090](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-09-18-30-image-20230809183001090.png)



### 内存

#### 综述

基于无阻塞、事件驱动建立的Node服务，具有<font color="red">内存消耗低的优点</font>(相比于其它语言)，非常适合处理海量的网络请求。内存控制是在海量请求和长时间运行的前提下进行探讨的。在服务器端，资源向来就寸土寸金。

在异步I/O中，介绍了Node是如何利用CPU和I/O这两个服务器资源，而本章将介绍在Node中如何合理高效地使用内存。Node的内存构成主要由通过V8进行分配的部分和Node自行分配的部分。





#### V8 的垃圾回收机制与内存限制

##### 前提

在浏览器中进行开发时，很少能遇到垃圾回收对应用程序构成性能影响的情况。如果页面里的内存占用过多，基本等不到进行代码回收，用户已经不耐烦地刷新了当前页面。当主流应用场景从客户端延伸到服务器端之后，对于性能敏感的服务器端程序，内存管理的好坏、垃圾回收状况是否优良，都会对服务构成影响。这一切都与Node的JavaScript执行引擎V8息息相关。



##### V8内存限制

###### 介绍

在Node中<font color="red">通过JavaScript使用内存时</font>就会发现只能使用部分内存（默认情况下，V8堆内存的最大值在64位系统上为1464 MB，32位系统上则为732 MB）。导致Node无法直接操作大内存对象，比如无法将一个2 GB的文件读入内存中进行字符串分析处理，即使物理内存有32 GB。这样在单个Node进程的情况下，计算机的内存资源无法得到充足的使用。

造成这个问题的主要原因在于Node基于V8构建，所以在Node中使用的JavaScript对象基本上都是通过V8自己的方式来进行分配和管理的。V8的这套内存管理机制在浏览器的应用场景下使用起来绰绰有余。但在Node中，这却限制了开发者随心所欲使用大内存的想法。



###### 为何要内存限制

本质是因为垃圾回收引起JavaScript线程暂停执行。以1.5 GB的垃圾回收堆内存为例，V8做一次小的垃圾回收需要50毫秒以上，做一

次非增量式的垃圾回收甚至要1秒以上。



###### 解开限制

Node在启动时可以传递--max-old-space-size或--max-new-space-size来调整内存限制的大小，示例如下：

```sh
node --max-old-space-size=1700 test.js // 单位为MB
// 或者
node --max-new-space-size=1024 test.js // 单位为KB
```

上述参数在V8初始化时生效，一旦生效就不能再动态改变。这意味着V8使用的内存没有办法根据使用情况自动扩充，当内存分配过程中超过极限值时，就会引起进程出错。









##### V8垃圾回收机制

见javascript笔记里的垃圾回收



#### 查看内存使用情况

##### 查看进程的内存占用

process.memoryUsage()可以查看内存使用情况。

```sh
$ node 
> process.memoryUsage();  # V8中内存使用量的查看方式
{ rss: 14958592, 
 heapTotal: 7195904, 
 heapUsed: 2821496 }
```

rss是resident set size的缩写，即进程的常驻内存部分。进程的内存总共有几部分，一部分是rss，其余部分在交换区（swap）或者文件系统（filesystem）中。除了rss外，heapTotal和heapUsed对应的是V8的堆内存信息。heapTotal是堆中总共申请的内存量，heapUsed表示目前堆中使用中的内存量。这3个值的单位都是字节。





##### 查看系统的内存占用

Node的os模块中的totalmem()和freemem()方法也可以查看内存使用情况。os模块中的totalmem()和freemem()这两个方法用于查看操作系统的内存使用情况，它们分别返回系统的总内存和闲置内存，以字节为单位。示例代码如下：

$ node 

\> os.totalmem() 

8589934592 

\> os.freemem() 

4527833088 

\> 

从输出信息可以看到我的电脑的总内存为8 GB，当前闲置内存大致为4.2 GB。



#### 堆外（V8外）内存

通过process.momoryUsage()的结果可以看到，堆中的内存用量总是小于进程的常驻内存用量，这意味着Node中的内存使用并非都是通过V8进行分配的。我们将那些不是通过V8分配的内存称为堆外内存。

<font color="red">Buffer对象不同于其他对象，它不经过V8的内存分配机制，所以也不会有堆内存的大小限制。</font>

这意味着利用堆外内存可以突破内存限制的问题。

为何Buffer对象并非通过V8分配？在浏览器中，JavaScript直接处理字符串即可满足绝大多数的业务需求，而Node则需要处理网络流和文件I/O流，操作字符串远远不能满足传输的性能需求。



#### 内存泄露

##### 综述

在Node中，由于V8的堆内存大小的限制，它对内存泄漏非常敏感。当在线服务的请求量变大时，哪怕是一个字节的泄漏都会导致内存占用过高。尽管内存泄漏的情况不尽相同，但其实质只有一个，那就是应当回收的对象出现意外而没有被回收，变成了常驻在老生代中的对象。

通常，造成内存泄漏的原因有如下几个。

 缓存。

 队列消费不及时。

 作用域未释放。



##### 慎将内存当做缓存

见《深入浅出node.js》内存泄露



##### 关注队列状态

在JavaScript中可以通过队列（数组对象）来完成许多特殊的需求，比如Bagpipe（并发调度的一种方案）。队

列在消费者生产者模型中经常充当中间产物。这是一个容易忽略的情况，因为在大多数应用场

景下，消费的速度远远大于生产的速度，内存泄漏不易产生。但是一旦消费速度低于生产速度，

将会形成堆积。

举个实际的例子，有的应用会收集日志。如果欠缺考虑，也许会采用数据库来记录日志。日

志通常会是海量的，数据库构建在文件系统之上，写入效率远远低于文件直接写入，于是会形成

数据库写入操作的堆积，而JavaScript中相关的作用域也不会得到释放，内存占用不会回落，从而

出现内存泄漏。

遇到这种场景，表层的解决方案是换用消费速度更高的技术。在日志收集的案例中，换用文

件写入日志的方式会更高效。需要注意的是，如果生产速度因为某些原因突然激增，或者消费速

度因为突然的系统故障降低，内存泄漏还是可能出现的。

深度的解决方案应该是监控队列的长度，一旦堆积，应当通过监控系统产生报警并通知相关

人员。另一个解决方案是任意异步调用都应该包含超时机制，一旦在限定的时间内未完成响应，

通过回调函数传递超时异常，使得任意异步调用的回调都具备可控的响应时间，给消费速度一个

下限值。

对于Bagpipe而言，它提供了超时模式和拒绝模式。启用超时模式时，调用加入到队列中就

开始计时，超时就直接响应一个超时错误。启用拒绝模式时，当队列拥塞时，新到来的调用会直

接响应拥塞错误。这两种模式都能够有效地防止队列拥塞导致的内存泄漏问题。



##### 作用域

在正常的JavaScript执行中，无法立即回收的内存有闭包和全局变量引用这两种情况。由于V8的内存限制，要十分小心此类变量是否无限制地增加，因为它会导致老生代中的对象增多。

以下四种情况会造成内存的泄漏：

- **全局变量：** 创建了一个全局变量，使这个变量一直留在内存中无法被回收。

- **被遗忘的计时器或回调函数：** 设置了 setInterval 定时器，而忘记取消它，如果定时器里的回调函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。

- **脱离 DOM 的引用：** 元素从 dom 移除了，但是还有一个变量引用着他，这样的游离的 dom 元素也不会被回收。每执行一次代码，就会多出游离的 dom 元素的内存

- **闭包：** 不合理的使用闭包，从而导致某些变量一直被留在内存当中。

- console.log ：控制台打印的对象，你是不是有可能展开看？那如果这个对象在内存中没有了，是不是就看不到了？所以有这个引用在，浏览器不会把你打印的对象的内存释放掉。

  
  
  

#### 内存泄漏排查

见《深入浅出node.js》内存泄露排查





#### 大内存应用

在Node中，不可避免地还是会存在操作大文件的场景。

stream模块是Node的原生模块，直接引用即可。stream继承自EventEmitter，具备基本的自定义事件功能，同时抽象出标准的事件和方法。它分可读和可写两种。Node中的大多数模块都有stream的应用，比如fs的createReadStream()和createWriteStream()方法可以分别用于创建文件的可读流和可写流，process模块中的stdin和stdout则分别是可读流和可写流的示例。

由于V8的内存限制，我们无法通过fs.readFile()和fs.writeFile()直接进行大文件的操作，而改用fs.createReadStream()和fs.createWriteStream()方法通过流的方式实现对大文件的操作。下面的代码展示了如何读取一个文件，然后将数据写入到另一个文件的过程：

```js
var reader = fs.createReadStream('in.txt'); 
var writer = fs.createWriteStream('out.txt'); 
reader.pipe(writer); 
```

可读流提供了管道方法pipe()，封装了data事件和写入操作。<font color="red">通过流的方式不会受到V8内存限制的影响</font>，有效地提高了程序的健壮性。
<font color="red">如果不需要进行字符串层面的操作，则不需要借助V8来处理，可以尝试进行纯粹的Buffer操作，这不会受到V8堆内存的限制。</font>





### 使命令行进入node模式

```sh
$ node 
> process.memoryUsage();  # V8中内存使用量的查看方式
{ rss: 14958592, 
 heapTotal: 7195904, 
 heapUsed: 2821496 }
```



## Buffer

### 文本格式（如JSON）和二进制格式的区别

文本格式（如JSON）和二进制格式是两种不同的数据序列化方式，它们的主要区别如下：

1. 数据大小：二进制格式相对于文本格式可以更紧凑，能够在某些情况下减小数据传输的大小。这是由于二进制格式的数据通常不需要包含像文本格式中的标记符号、空白符等冗余信息。
2. 解析效率：二进制格式的数据解析效率通常比文本格式更高，因为解析器不需要像解析文本格式那样逐个字符进行解析，而是可以直接根据数据结构进行解析。
3. 兼容性：文本格式可以被广泛的应用和支持，因为它们可以被任何拥有文本读取功能的设备或程序所识别。二进制格式则可能需要特定的解析器或工具来识别。

总的来说，文本格式适用于需要兼容性和可读性较高的应用，而二进制格式适用于需要更小的数据传输大小和更快的解析效率的场景。在实际使用中，需要根据具体的场景和需求选择合适的数据序列化方案。

### 简介

在网络传输中，数据可以以不同的形式进行传输：

1. **字符串传输**： 字符串是由字符组成的文本序列，通常使用 Unicode 编码来表示各种语言的字符。在网络传输中，您可以将数据编码为字符串并传输，这样可以使数据在传输过程中更易读、易理解。

   优势：

   - 人类可读性：字符串的编码方式使其在传输过程中能够被人类识别和理解，方便调试和查看传输的内容。
   - 方便解析：在某些情况下，字符串的解析和处理相对较简单，特别是在文本协议中。

   注意：

   - 字符串的编码可能导致数据的字节数不固定，可能会影响网络传输的效率。
   - 对于包含二进制数据的情况，字符串传输可能会导致编码和解码的开销。

2. **字节缓冲区传输**： 字节缓冲区（buffer）是一个连续的内存区域，可以存储原始的二进制数据。在网络传输中，您可以将数据存储在字节缓冲区中并传输，这通常更适用于二进制数据或非文本数据。

   优势：

   - 数据保真性：字节缓冲区可以精确地表示二进制数据，不会因为字符编码而导致数据损失。
   - 固定字节数：字节缓冲区的大小固定，使得数据在传输过程中更稳定，没有字符串编码导致的变长问题。
   - 适用于二进制数据：对于图像、音频、视频等二进制数据，字节缓冲区更适合传输。

   注意：

   - 字节缓冲区在传输过程中可能不那么易读，需要特定的解析和处理。

综上所述，您可以选择字符串或字节缓冲区作为网络传输的数据格式，具体取决于数据的类型、需求和处理方式。对于纯文本数据，字符串可能更合适；对于二进制数据或需要固定字节数的情况，字节缓冲区更合适

在Node中，应用需要处理网络协议、操作数据库、处理图片、接收上传文件等，在网络流和文件的操作中，还要处理大量二进制数据，Buffer是二进制数据，字符串与Buffer之间存在编码关系。<font color="red">JavaScript自有的字符串远远不能满足这些需求，于是Buffer对象应运而生。(还是跟操作字符串相关)</font>

Buffer是一个像Array的对象，但它主要用于操作字节。Buffer是一个典型的JavaScript与C++结合的模块，它将性能相关部分用C++实现，将非性能相关的部分用JavaScript实现。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-11-15-56-image-20230811155633162.png" alt="image-20230811155633162" style="zoom:50%;" />

由于Buffer太过常见，Node在进程启动时就已经加载了它，并将其放在全局对象（global）上。所以在使用Buffer时，无须通过require()即可直接使用。





### Buffer对象

Buffer对象

Buffer对象类似于数组，它的元素为16进制的两位数，即0到255的数值。示例代码如下所示：

```js
var str = "深入浅出node.js"; 

var buf = new Buffer(str, 'utf-8'); 

console.log(buf); // => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73> 
```

不同编码的字符串占用的元素个数各不相同，<font color="red">中文字在UTF-8编码下占用3个元素，字母和半角标点符号占用1个元素。</font>

Buffer受Array类型的影响很大，可以访问length属性得到长度，也可以通过下标访问元素，

在构造对象时也十分相似，代码如下：

var buf = new Buffer(100); 

console.log(buf.length); // => 100 

上述代码分配了一个长100字节的Buffer对象。可以通过下标访问刚初始化的Buffer的元素，

代码如下：

console.log(buf[10]); 

这里会得到一个比较奇怪的结果，它的元素值是一个0到255的随机值。

同样，我们也可以通过下标对它进行赋值：

buf[10] = 100; 

console.log(buf[10]); // => 100 

值得注意的是，如果给元素赋值不是0到255的整数而是小数时会怎样呢？给元素的赋值如果小于0，就将该值逐次加256，直到得到一个0到255之间的整数。如果得到的数值大于255，就逐次减256，直到得到0~255区间内的数值。如果是小数，舍弃小数部分，只保留整数部分。示例代码如下所示：

```js
buf[20] = -100; 

console.log(buf[20]); // 156 

buf[21] = 300; 

console.log(buf[21]); // 44 

buf[22] = 3.1415; 

console.log(buf[22]); // 3 
```



### Buffer的内存分配

Buffer对象的内存分配不是在V8的堆内存中，而是在Node的C++层面实现内存的申请的。真正的内存是在Node的C++层面提供的，JavaScript层面只是使用它。当进行小而频繁的Buffer操作时，采用slab的机制进行预先申请和事后分配，使得JavaScript到操作系统之间不必有过多的内存申请方面的系统调用。对于大块的Buffer而言，则直接使用C++层面提供的内存，而无需细腻的分配操作。

详细看《深入浅出node.js》





### Buffer转换

Buffer对象可以与字符串之间相互转换。目前支持的字符串编码类型有如下这几种。

 ASCII

 UTF-8

 UTF-16LE/UCS-2

 Base64

 Binary

 Hex

#### 字符串转Buffer 

字符串转Buffer对象主要是通过构造函数完成的：

new Buffer(str, [encoding]); 

通过构造函数转换的Buffer对象，存储的只能是一种编码类型。encoding参数不传递时，默

认按UTF-8编码进行转码和存储。

一个Buffer对象可以存储不同编码类型的字符串转码的值，调用write()方法可以实现该目

的，代码如下：

buf.write(string, [offset], [length], [encoding]) 



#### Buffer转字符串

实现Buffer向字符串的转换也十分简单，Buffer对象的toString()可以将Buffer对象转换为字

符串，代码如下：

buf.toString([encoding], [start], [end]) 

比较精巧的是，可以设置encoding（默认为UTF-8）、start、end这3个参数实现整体或局部

的转换。如果Buffer对象由多种编码写入，就需要在局部指定不同的编码，才能转换回正常的编

码。



#### Buffer不支持的编码类型

Node的Buffer对象支持的编码类型有限，Buffer提供了一个isEncoding()函数来判断编码是否支持转换：Buffer.isEncoding(encoding) 

在中国常用的GBK、GB2312和BIG-5编码都不在支持的行列中。

对于不支持的编码类型，可以借助Node生态圈中的模块完成转换。iconv和iconv-lite两个

模块可以支持更多的编码类型转换，包括Windows 125系列、ISO-8859系列、IBM/DOS代码页系列、Macintosh系列、KOI8系列，以及Latin1、US-ASCII，也支持宽字节编码GBK和GB2312。

iconv-lite采用纯JavaScript实现，iconv则通过C++调用libiconv库完成。前者比后者更轻量，无须编译和处理环境依赖直接使用。在性能方面，由于转码都是耗用CPU，在V8的高性能下，少了C++到JavaScript的层次转换，纯JavaScript的性能比C++实现得更好。

以下为iconv-lite的示例代码：

var iconv = require('iconv-lite'); 

// Buffer转字符串

var str = iconv.decode(buf, 'win1251'); 

// 字符串转Buffer

var buf = iconv.encode("Sample input string", 'win1251'); 

另外，iconv和iconv-lite对无法转换的内容进行降级处理时的方案不尽相同。iconv-lite无

法转换的内容如果是多字节，会输出 ；如果是单字节，则输出?。iconv则有三级降级策略，会

尝试翻译无法转换的内容，或者忽略这些内容。如果不设置忽略，iconv对于无法转换的内容将

会得到EILSEQ异常。如下是iconv的示例代码兼选项设置方式：

var iconv = new Iconv('UTF-8', 'ASCII'); 

iconv.convert('ça va'); // throws EILSEQ 

var iconv = new Iconv('UTF-8', 'ASCII//IGNORE'); 

iconv.convert('ça va'); // returns "a va" 

var iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT'); 

iconv.convert('ça va'); // "ca va" 

var iconv = new Iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE'); 

iconv.convert('ça va が'); // "ca va " 



### Buffer 的拼接

#### 全英文的拼接方式--如果拼接中文有可能造成乱码�

Buffer在使用场景中，通常是以一段一段的方式传输。以下是常见的从输入流中读取内容的

```js
var fs = require('fs'); 
var rs = fs.createReadStream('test.md'); // 这里的rs是buffer对象
var data = ''; 
rs.on("data", function (chunk){ 
 data += chunk; 
}); 

rs.on("end", function () { 
 console.log(data); 
}); 
```

上面这段代码常见于国外，data事件中获取的chunk对象即是Buffer对象。

对于初学者而言，容易将Buffer当做字符串来理解，所以在接受上面的示例时不会觉得有任何异常。一旦输入流中有宽字节编码时，问题就会暴露出来。如果你在通过Node开发的网站上看到乱码符号�，那么该问题的起源多半来自于这里。

这里潜藏的问题在于如下这句代码：

<font color="red">data += chunk; 这句代码里隐藏了toString()操作，它等价于如下的代码：data = data.toString() + chunk.toString(); </font>

值得注意的是，外国人的语境通常是指英文环境，在他们的场景下，这个toString()不会造成任何问题。但对于宽字节的中文，却会形成问题。为了重现这个问题，下面我们模拟近似的场

景，将文件可读流的每次读取的Buffer长度限制为11，代码如下：

var rs = fs.createReadStream('test.md', {highWaterMark: 11}); 

搭配该代码的测试数据为李白的《静夜思》。执行该程序，将会得到以下输出：

床前明���光，疑���地上霜；举头���明月，���头思故乡。

上面的诗歌中，“月”、“是”、“望”、“低”4个字没有被正常输出，取而代之的是3个 。产

生这个输出结果的原因在于文件可读流在读取时会逐个读取Buffer。这首诗的原始Buffer应存

储为：

`<Buffer e5 ba 8a e5 89 8d e6 98 8e e6 9c 88 e5 85 89 ef bc 8c e7 96 91 e6 98 af e5 9c b0 e4 b8 8a e9 9c 9c ef bc 9b e4 b8 be e5 a4 b4 e6 9c 9b e6 98 8e e6 9c 88 ...> `

由于我们限定了Buffer对象的长度为11，因此只读流需要读取7次才能完成完整的读取，结果

是以下几个Buffer对象依次输出：

```sh
<Buffer e5 ba 8a e5 89 8d e6 98 8e e6 9c> 

<Buffer 88 e5 85 89 ef bc 8c e7 96 91 e6> 

... 
```



上文提到的buf.toString()方法默认以UTF-8为编码，中文字在UTF-8下占3个字节。所以第一个Buffer对象在输出时，只能显示3个字符，Buffer中剩下的2个字节（e6 9c）将会以乱码的形式显示。第二个Buffer对象的第一个字节也不能形成文字，只能显示乱码。于是形成一些文字无法正常显示的问题。在这个示例中我们构造了11这个限制，但是对于任意长度的Buffer而言，宽字节字符串都有可能存在被截断的情况，只不过Buffer的长度越大出现的概率越低而已，但该问题依然不可忽视。







#### 拼接中文的正确方式

将多个小Buffer对象拼接为一个Buffer对象，然后通过iconv-lite一类的模块来转码这种方式。+=的方式显然不行，那么正确的Buffer拼接方法应该如下面展示的形式：正确的拼接方式是用一个数组来存储接收到的所有Buffer片段并记录下所有片段的总长度，然后调用Buffer.concat()方法生成一个合并的Buffer对象。

```js
var chunks = []; 

var size = 0; 

res.on('data', function (chunk) { 

 chunks.push(chunk); 

 size += chunk.length; 

}); 

res.on('end', function () { 
   var buf = Buffer.concat(chunks, size); 
	 var str = iconv.decode(buf, 'utf8'); 
	 console.log(str); 
});
```

Buffer.concat()方法封装了从小Buffer对象向大Buffer对象的复制过程，实现十分细腻，值得围观学习：

```js
Buffer.concat = function(list, length) { 

 if (!Array.isArray(list)) { 

 throw new Error('Usage: Buffer.concat(list, [length])'); 

 } 

 if (list.length === 0) { 

 return new Buffer(0); 

 } else if (list.length === 1) { 

 return list[0]; 

 } 

 if (typeof length !== 'number') { 

 length = 0; 

 for (var i = 0; i < list.length; i++) { 

 var buf = list[i]; 

 length += buf.length; 

 } 

 } 

 var buffer = new Buffer(length); 

 var pos = 0; 

 for (var i = 0; i < list.length; i++) { 

 var buf = list[i]; 

 buf.copy(buffer, pos); 

 pos += buf.length; 

 } 

 return buffer; 

}; 
```





### Buffer的性能

Buffer在文件I/O和网络I/O中运用广泛，网络中传输，都需要转换为Buffer，以进行二进制数据传输。在Web应用中，字符串转换到Buffer是时时刻刻发生的，提高字符串到Buffer的转换效率，可以很大程度地提高网络吞吐率。

在Node构建的Web应用中，可以选择将页面中的动态内容和静态内容分离，静态内容部分可以通过预先转换为Buffer的方式，使性能得到提升。由于文件自身是二进制数据，所以在不需要改变内容的场景下，尽量只读取Buffer，然后直接传输，不做额外的转换，避免损耗。

#### 文件读取

Buffer的使用除了与字符串的转换有性能损耗外，在文件的读取时，有一个highWaterMark设置对性能的影响至关重要。highWaterMark值的大小与读取速度的关系：该值越大，读取速度越快。（具体细节看《深入浅出node.js》）在fs.createReadStream(path, opts)时，我们可以传入一些参数，代码如下： 

```js
{ 
 flags: 'r', 
 encoding: null, 
 fd: null, 
 mode: 0666, 
 start: 90, 
 end: 99,
 highWaterMark: 64 * 1024 
}
```













## 改成使用ESM规范

Node.js 从 `12.20` 版本开始[正式支持](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fapi%2Fesm.html%23modules-ecmascript-modules)原生 ES Module。在 Node.js 环境中，你可以在`package.json`中声明`type: "module"`属性，然后 Node.js 便会默认以 ES Module 规范去解析模块。

```ts
// package.json
{
  "type": "module"
}
```

在 Node.js 中，即使是在 CommonJS 模块里面，也可以通过 `import` 方法顺利加载 ES 模块，如下所示:

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

### #src

`#src` 是 Node.js 中的 ESM（ECMAScript Modules）的语法，用于导入模块。这种语法允许你使用相对或绝对路径导入模块。例如：

```
luaCopy code
my-project/
|-- src/
|   |-- main.js
|   |-- some-module.js
|-- package.json
```

在这个示例中，你可以在 `main.js` 中使用 `#src` 导入 `some-module.js`：

```
javascriptCopy code
import someModule from '#src/some-module.js';
```

这样，Node.js 会自动从项目的根目录开始查找 `some-module.js`。这是 Node.js ESM 的一种方便的导入语法，它允许你在不使用相对或绝对路径的情况下导入模块，而是从项目根目录开始导入。这有助于减少导入路径的复杂性。

需要注意的是，Node.js 的 ESM 支持程度因版本而异，可能需要配置 `package.json` 或使用 Node.js 的一些特定选项来启用此功能。确保你的 Node.js 版本支持 ESM 并了解如何在你的项目中配置它。





## 一些模块

### 进程process

#### process.env

```json
// package.json
"scripts": {
    "mock": "NODE_ENV=dyc vite --host", // 通过process.env.NODE_ENV就可以获得这个NODE_ENV的值
}
```



#### process.stdout.write

console.log 和 process.stdout.write 都可以在 Node.js 中用来向标准输出（通常是控制台）写入数据，但它们之间存在一些差异：


格式化输出：console.log 支持类似于 C 语言 printf 的格式化输出。例如，你可以使用 %s 来插入一个字符串，使用 %d 来插入一个数字。而 process.stdout.write 不支持这种格式化输出，它只是简单地将所有的参数转换为字符串，然后写入标准输出。


新行字符：console.log 在每次调用后都会自动添加一个新行字符（\n），所以每次调用 console.log 都会在新的一行开始输出。而 process.stdout.write 不会添加新行字符，除非你自己显式地添加。


异步与同步：console.log 是异步的，当你调用 console.log 时，Node.js 不会等待数据被写入标准输出，而是立即返回。这意味着如果你在 console.log 之后立即退出程序，你可能看不到任何输出。而 process.stdout.write 是同步的，当你调用 process.stdout.write 时，Node.js 会等待数据被写入标准输出，然后再返回。


错误处理：console.log 在写入数据时遇到错误会抛出异常，而 process.stdout.write 在写入数据时遇到错误会返回 false，并在稍后触发 'drain' 事件。





### 网络

Node具有事件驱动、无阻塞、单线程等特性，具备良好的可伸缩性，使得它十分轻量，适合在分布式网络中扮演各种各样的角色。对于Node而言，只需要几行代码即可构建服务器，无需额外的容器。Node提供了net、dgram、http、https这4个模块，分别用于处理TCP、UDP、HTTP、HTTPS，适用于服务器端和客户端。

#### TCP & UDP

如果要构造高效的网络应用，就应该从传输层进行着手。

TCP在创建会话的过程中，服务器端和客户端分别提供一个套接字，这两个套接字共同形成一个连接。服务器端与客户端则通过套接字实现两者之间连接的操作。

see 《深入浅出node.js》





#### HTTP

##### 服务端

###### 启动一个http服务

Node提供了基本的http和https模块用于HTTP和HTTPS的封装，对于其他应用层协议的封装，也能从社区中轻松找到其实现。

```js
var http = require('http'); 
http.createServer(function (req, res) { 
 res.writeHead(200, {'Content-Type': 'text/plain'}); 
 res.end('Hello World\n'); 
}).listen(1337, '127.0.0.1'); 
```

HTTP请求对象和HTTP响应对象是相对较底层的封装，现行的Web框架如Connect和Express都是在这两个对象的基础上进行高层封装。



###### HTTP请求

报文头部将会通过http_parser进行解析。例如报文头第一行GET / HTTP/1.1被解析之后分解为如下属性。

 req.method属性：值为GET，是为请求方法，常见的请求方法有GET、POST、DELETE、PUT、CONNECT等几种。

 req.url属性：值为/。 

 req.httpVersion属性：值为1.1。

其余报头是很规律的Key: Value格式，被解析后放置在req.headers属性上传递给业务逻辑以供调用。

报文体则抽象为一个只读流对象，如果业务逻辑需要读取报文体中的数据，则要在这个数据流结束后才能进行操作，如下所示：

```js
function (req, res) { 

 // console.log(req.headers); 

 var buffers = []; 

 req.on('data', function (trunk) { 

 buffers.push(trunk); 

 }).on('end', function () { 

 var buffer = Buffer.concat(buffers); 

 // TODO

 res.end('Hello world'); 

 }); 

} 
```



###### HTTP响应

HTTP响应封装了对底层连接的写操作，可以将其看成一个可写的流对象。它影响响应报文头部信息的API为res.setHeader()和res. writeHead()。我们可以调用setHeader进行多次设置，但只有调用writeHead后，报头才会写入到连接中。

http模块会自动帮你设置一些头信息，如下所示：

![image-20230819135146639](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-13-51-image-20230819135146639.png)

报文体部分则是调用res.write()和res.end()方法实现，后者与前者的差别在于res.end()会先调用write()发送数据，然后发送信号告知服务器这次响应结束。报头是在报文体发送前发送的，一旦开始了数据的发送，writeHead()和setHeader()将不再生效。务必在结束时调用res.end()结束请求，否则客户端将一直处于等待的状态。当然，也可以通过延迟res.end()的方式实现客户端与服务器端之间的长连接，但结束时务必关闭连接。



###### HTTP服务的事件

看文档吧



##### 客户端

###### 发起请求

http模块提供了一个底层API:http.request(options, connect)，用于构造HTTP客户端。



###### 响应对象

HTTP客户端的响应对象是ClientRequest对象。ClientRequest在解析响应报文时，一解析完响应头就触发response事件，同时传递一个响应对象以供操作ClientResponse。后续响应报文体以只读流的方式提供，如下所示：

![image-20230819140623940](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-06-image-20230819140623940.png)

###### 限制请求数

http提供的ClientRequest对象也是基于TCP层实现的，在keepalive的情况下，一个底层会话连接可以多次用于请求。为了重用TCP连接，http模块包含一个默认的客户端代理对象http.globalAgent。它对每个服务器端（host + port）创建的连接进行了管理，默认情况下，通过ClientRequest对象对同一个服务器端发起的HTTP请求最多可以创建5个连接。调用HTTP客户端同时对一个服务器发起10次HTTP请求时，其实质只有5个请求处于并发状态，后续的请求需要等待某个请求完成服务后才真正发出。它的实质是一个连接池，示意图如下所示：

![image-20230819140812102](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-08-image-20230819140812102.png)

如需要改变，可以在options中传递agent选项。默认情况下，请求会采用全局的代理对象，默认连接数限制的为5。我们既可以自行构造代理对象，代码如下：![image-20230819140912640](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-09-image-20230819140912640.png)

也可以设置agent选项为false值，以脱离连接池的管理，使得请求不受并发的限制。Agent对象的sockets和requests属性分别表示当前连接池中使用中的连接数和处于等待状态的请求数，在业务中监视这两个值有助于发现业务状态的繁忙程度。



###### HTTP客户端事件

看文档吧





##### 构建像koa那样的http服务器

###### 明确思路

最后的最后将一个如下函数传递给createServer()方法作为request事件的侦听器就可以了。所有东西都会挂载到req或res对象上。

![image-20230819150255986](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-15-02-image-20230819150255986.png)

比如Connect或Express的示例中有如下这样的代码：![image-20230819150330248](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-15-03-image-20230819150330248.png)





###### 处理报文头

HTTP_Parser在解析请求报文的时候，将报文头抽取出来，设置为req.method。

HTTP_Parser将路径解析为req.url（包括path和search）。如果查询字符串中的键出现多次，那么它的值会是一个数组（所以业务的判断一定要检查值是数组还是字符串，否则可能出现TypeError异常的情况。）如下所示：

![image-20230819151810192](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-15-18-image-20230819151810192.png)

HTTP_Parser会将所有的报文字段解析到req.headers上，那么Cookie就是req.headers. cookie

还有关于缓存和用户认证的。。。



###### 处理报文体

Node的http模块只对HTTP报文的头部进行了解析，然后触发request事件。如果请求中还带有内容部分（如POST请求，它具有报头和内容），内容部分需要用户自行接收和解析。通过报头头中有无Transfer-Encoding或Content-Length即可判断请求中是否带有内容。

![image-20230820170745706](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-20-17-07-image-20230820170745706.png)

各种数据形式的解析看《深入浅出Node.js》或者koa源码

还要考虑限制上传数据的大小和安全。







#### WebSocket

《深入浅出node.js》





#### 网络安全

##### 总述

Node在网络安全上提供了3个模块，分别为crypto、tls、https。

crypto主要用于加密解密，SHA1、MD5等加密算法都在其中有体现。

用于网络的是另外两个模块：

tls模块提供了与net模块类似的功能，区别在于它建立在TLS/SSL加密的TCP连接上。

https完全与http模块接口一致，区别也仅在于它建立于安全的连接之上。



##### TLS/SSL

###### 生成公秘钥

Node在底层采用的是openssl实现TLS/SSL的，为此要生成公钥和私钥可以通过openssl完成。我们分别为服务器端和客户端生成私钥，如下所示：![image-20230819142737096](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-27-image-20230819142737096.png)

上述命令生成了两个1024位长的RSA私钥文件，我们可以通过它继续生成公钥，如下所示：![image-20230819142746581](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-27-image-20230819142746581.png)





###### 自签名证书

对于中小型企业而言多半是采用自签名证书来构建安全网络的。就是自己扮演CA机构，给自己的服务器端颁发签名证书。以下为生成私钥、生成CSR文件、通过私钥自签名生成证书的过程：

![image-20230819143840712](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-38-image-20230819143840712.png)

上述步骤完成了扮演CA角色需要的文件。接下来回到服务器端，服务器端需要向CA机构申请签名证书。在申请签名证书之前依然是要创建自己的CSR文件。值得注意的是，这个过程中的Common Name要匹配服务器域名，否则在后续的认证过程中会出错。如下是生成CSR文件所用的命令：![image-20230819144159383](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-41-image-20230819144159383.png)。得到CSR文件后，向我们自己的CA机构申请签名吧。签名过程需要CA的证书和私钥参与，最终颁发一个带有CA签名的证书，如下所示：![image-20230819144230942](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-19-14-42-image-20230819144230942.png)

客户端在发起安全连接前会去获取服务器端的证书，并通过CA的证书验证服务器端证书的真伪。除了验证真伪外，通常还含有对服务器名称、IP地址等进行验证的过程。



###### 创建tls服务端

《深入浅出node.js》

###### 创建tls客户端

《深入浅出node.js》





##### https

《深入浅出node.js》



#### 社区提供

`mime`

为了方便获知文件的MIME值，社区有专有的mime模块可以用判段文件类型。





### fs

#### 常用

`fs.createReadStream(path[, options])`

`fs.createWriteStream(path[, options])`

`fs.unlink(path, callback)` //删除文件

`fs.rmdirSync(path[, options])` //删除目录

`fs.readFileSync(path[, options])`//读取文件

`fs.readdirSync(path[, options])`//读取目录

`fs.statSync(path[, options])`//返回有关给定文件路径的信息的对象





#### 读取文件返回的格式

```js
    const content = await fs.readFile(__dirname + '/data/group/group.json'); //返回的是buffer类型
    console.log('raw', content);
    console.log('toJSON', content.toJSON());
    console.log('toString', content.toString());

/*打印出：
raw <Buffer 5b 0a 20 20 20 20 7b 0a 20 20 20 20 20 20 20 20 22 74 68 65 6d 65 4e 61 6d 65 22 3a 20 22 22 2c 0a 20 20 20 20 20 20 20 20 22 74 68 65 6d 65 44 65 73 ... 313 more bytes>
toJSON {
  type: 'Buffer',
  data: [
     91,  10, 32, 32, 32,  32, 123,  10,  32,  32,  32,  32,
     32,  32, 32, 32, 34, 116, 104, 101, 109, 101,  78,  97,
    109, 101, 34, 58, 32,  34,  34,  44,  10,  32,  32,  32,
     32,  32, 32, 32, 32,  34, 116, 104, 101, 109, 101,  68,
    101, 115, 99, 34, 58,  32,  34,  34,  44,  10,  32,  32,
     32,  32, 32, 32, 32,  32,  34, 115,  99, 111, 114, 101,
     49,  34, 58, 32, 34,  34,  44,  10,  32,  32,  32,  32,
     32,  32, 32, 32, 34, 115,  99, 111, 114, 101,  50,  34,
     58,  32, 34, 34,
    ... 263 more items
  ]
}
toString [
    {
        "themeName": "",
        "themeDesc": "",
        "score1": "",
        "score2": "",
        "score3": "",
        "gameList": [1, 6],
        "status": true
    },
    {
        "themeName": "",
        "themeDesc": "",
        "score1": "",
        "score2": "",
        "score3": "",
        "gameList": [2, 7],
        "status": true
    }
]
*/
```



#### 可读流

##### **setEncoding()**与**string_decoder()**

可以解决UTF-8、Base64和UCS-2/UTF-16LE这3种编码的乱码问题。

在看过上述的示例后，也许我们忘记了可读流还有一个设置编码的方法setEncoding()，示例如下：

readable.setEncoding(encoding) 

该方法的作用是让data事件中传递的不再是一个Buffer对象，而是编码后的字符串。为此，我们继续改进前面诗歌的程序，添加setEncoding()的步骤如下：

var rs = fs.createReadStream('test.md', { highWaterMark: 11}); 

rs.setEncoding('utf8'); 

重新执行程序，得到输出：床前明月光，疑是地上霜；举头望明月，低头思故乡。这是令人开心的输出结果，说明输出不再受Buffer大小的影响了。那Node是如何实现这个输出结果的呢？

无论如何设置编码，触发data事件的次数依旧相同，这意味着设置编码并未改变按段读取的基本方式。

事实上，在调用setEncoding()时，可读流对象在内部设置了一个decoder对象。每次data事件都通过该decoder对象进行Buffer到字符串的解码，然后传递给调用者。是故设置编码后，data不再收到原始的Buffer对象。但是这依旧无法解释为何设置编码后乱码问题被解决掉了，因为在前述分析中，无论如何转码，总是存在宽字节字符串被截断的问题。最终乱码问题得以解决，还是在于decoder的神奇之处。decoder对象来自于string_decoder。模块StringDecoder的实例对象。它神奇的原理是什么，下面我们以代码来说明：

```js
var StringDecoder = require('string_decoder').StringDecoder; 

var decoder = new StringDecoder('utf8'); 

var buf1 = new Buffer([0xE5, 0xBA, 0x8A, 0xE5, 0x89, 0x8D, 0xE6, 0x98, 0x8E, 0xE6, 0x9C]); 

console.log(decoder.write(buf1)); 

// => 床前明

var buf2 = new Buffer([0x88, 0xE5, 0x85, 0x89, 0xEF, 0xBC, 0x8C, 0xE7, 0x96, 0x91, 0xE6]); 

console.log(decoder.write(buf2)); 

// => 月光，疑
```

我将前文提到的前两个Buffer对象写入decoder中。奇怪的地方在于“月”的转码并没有如平

常一样在两个部分分开输出。StringDecoder在得到编码后，知道宽字节字符串在UTF-8编码下是

以3个字节的方式存储的，所以第一次write()时，只输出前9个字节转码形成的字符，“月”字的

前两个字节被保留在StringDecoder实例内部。第二次write()时，会将这2个剩余字节和后续11

个字节组合在一起，再次用3的整数倍字节进行转码。于是乱码问题通过这种中间形式被解决了。

虽然string_decoder模块很奇妙，但是它也并非万能药，它目前只能处理UTF-8、Base64和UCS-2/UTF-16LE这3种编码。所以，通过setEncoding()的方式不可否认能解决大部分的乱码问题，但并不能从根本上解决该问题。





### 进程&线程



#### 简介

我们将介绍创建子进程、进程间通信的IPC通道实现、句柄在进程间的发送和还原、端口共用等细节。通过这些基础技术，用child_process模块在单机上搭建Node集群是件相对容易的事情。因此在多核CPU的环境下，让Node进程能够充分利用资源不再是难题。

![image-20230830011313772](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-30-01-13-image-20230830011313772.png)

图9-1就是著名的Master-Worker模式，又称主从模式。图9-1中的进程分为两种：主进程和工作进程。主进程不负责具体的业务处理，而是负责调度或管理工作进程。通过fork()复制的进程都是一个独立的进程，这个进程中有着独立而全新的V8实例。它需要至少30毫秒的启动时间和至少10 MB的内存。尽管Node提供了fork()供我们复制进程使每个CPU内核都使用上，但是依然要切记fork()进程是昂贵的。



#### 创建子进程

##### 介绍

提供了4个方法用于创建子进程。

❑ spawn()：启动一个子进程来执行命令。适合子进程有大量数据输出的情况，因为spawn的数据是通过流的方式返回的。

❑ exec()：启动一个子进程来执行命令，与spawn()不同的是其接口不同，它有一个回调函数获知子进程的状况。

❑ execFile()：启动一个子进程来执行可执行文件。

❑ fork()：与spawn()类似，不同点在于它创建Node的子进程只需指定要执行的JavaScript文件模块即可。fork会在父进程与子进程之间建立一个通信管道，用于进程之间的通信。适合主子进程频繁通信的场景。

spawn()与exec()、execFile()不同的是，后两者创建时可以指定timeout属性设置超时时间，一旦创建的进程运行超过设定的时间将会被杀死。exec()与execFile()不同的是，exec()适合执行已有的命令，execFile()适合执行文件。

以上4个方法在创建子进程之后均会返回子进程对象。它们的差别可以看表：

![image-20230830011559342](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-30-01-15-image-20230830011559342.png)

<font color="red">这里的可执行文件是指可以直接执行的文件，如果是JavaScript文件通过execFile()运行，它的首行内容必须添加如下代码：`#! /usr/bin/env node`</font>

尽管4种创建子进程的方式有些差别，但事实上后面3种方法都是spawn()的延伸应用。





##### 操作

假设现在有一个主进程，要用子进程来执行一个命令。

###### child_process.spawn方式

```js
// spawn.js
const child_process = require('child_process');

for(var i=0; i<3; i++) {
  var workerProcess = child_process.spawn('node',
    ['command.js', i]);

  workerProcess.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  workerProcess.on('close', function (code) {
    console.log('子进程已退出, 退出码 '+code);
  });
}
```



###### child_process.exec方式的实现代码如下

```js
// exec.js
const child_process = require('child_process');

for(var i=0; i<3; i++) {
  var workerProcess = child_process.exec('node command.js
    '+i, function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: '+error.code);
      console.log('Signal received: '+error.signal);
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  });

  workerProcess.on('exit', function (code) {
    console.log('子进程已退出, 退出码 '+code);
  });
}
```



###### child_process.fork

```js
// fork.js
const child_process = require('child_process');

for(var i=0; i<3; i++) {
  var worker_process = child_process.fork("command.js", [i]);

  worker_process.on('close', function (code) {
    console.log('子进程已退出, 退出码 ' + code);
  });
}
```







#### Node进程间通信

##### 介绍

IPC就是通过共享内存的方式实现进程通信的，使得多个进程可以访问同一个内存空间。

Node中实现IPC通道的是管道（pipe）技术。在Node中管道是个抽象层面的称呼，具体细节实现由libuv提供，在Windows下由命名管道（named pipe）实现，*nix系统则采用Unix Domain Socket实现。表现在应用层上的进程间通信只有简单的message事件和send()方法。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-02-04-image-20230909020434869.png" alt="image-20230909020434869" style="zoom:50%;" />



父进程在实际创建子进程之前，会创建IPC通道并监听它，然后才真正创建出子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的IPC通道，从而完成父子进程之间的连接。

由于IPC通道是用命名管道或Domain Socket创建的，它们与网络socket的行为比较类似，属于双向通信。

在Node中，IPC通道被抽象为Stream对象，在调用send()时发送数据（类似于write()），接收到的消息会通过message事件（类似于data）触发给应用层。



注意 只有启动的子进程是Node进程时，子进程才会根据环境变量去连接IPC通道，对于其他类型的子进程则无法实现进程间通信，除非其他进程也按约定去连接这个已经创建好的IPC通道。



##### 操作

###### 方式一：IPC

通过Node原生的IPC（Inter-Process Communication，进程间通信）来实现。IPC就是通过共享内存的方式实现进程通信的，使得多个进程可以访问同一个内存空间。

这种方式比较普遍且通用，一般企业里的项目也是通过这种方式进行进程间通信的。下面通过一个实例进行介绍。

主进程代码如下：

```js
// master.js
const cp = require('child_process');
const n = cp.fork(`child.js`);

n.on('message', (msg) => {
  console.log('主进程收到子进程的消息: ', msg);
});

// 主进程发送给子进程的消息
n.send('hello child process！');
```

子进程的代码如下:

```js
process.on('message', (msg) => {
  console.log('子进程收到主进程的消息：', msg);
});

// 给主进程发消息
process.send('hello master process!');
```



###### 方式二：Socket

多个进程可以通过Socket进行通信，具体实例代码如下：

```js
// master.js
const { spawn } = require('child_process');
const child = spawn('node', ['child'], {
  // 子进程的标准输入输出配置
  stdio: [null, null, null, 'pipe'],
});
child.stdio[1].on('data', data => {
  console.log(`来自子进程消息 ${data.toString()}`);
});
```

```js
// child.js
const net = require('net');
const pipe = net.Socket({ fd: 1 });
pipe.write('hello master process！'); // 输出
```

执行master.js运行结果如图：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-13-19-41-image-20231213194158601.png" alt="image-20231213194158601" style="zoom:33%;" />





#### 句柄传递

看《深入浅出Node.js》



#### 创建线程

webWorker API





#### 集群

看《深入浅出Node.js》





### 单元测试

看《深入浅出Node.js》

#### 断言 assert

断言用于检查程序在运行时是否满足期望













## 模版引擎

### MVC模式模版引擎

#### 介绍

模板引擎干的实际上就是拼接字符串这样很底层的活，我们要的就是模板加数据，通过模板引擎的执行就能得到最终的HTML字符串这样结果。

模版安全：主要是xss

为了提高安全性，大多数模板都提供了转义的功能。转义就是将能形成HTML标签的字符转换成安全的字符，这些字符主要有&、<、>、"、'。

模板技术的出现，将业务开发与HTML输出的工作分离开来，它的设计原理就是单一职责原理。

实现一个模版引擎看《深入浅出Node.js》或者开源库源码



#### 存在的问题

问题在于最终的HTML要在所有的数据获取完成后才输出到浏览器端。Node通过异步已经将多个数据源的获取并行起来了，最终的页面输出速度取决于两个数据请求中响应时间慢的那个。在数据响应之前，用户看到的是空白页面，这是十分不友好的用户体验。



### Bigpipe

具体实现看《深入浅出Node.js》或者开源库源码

Bigpipe将网页布局和数据渲染分离，使得用户在视觉上觉得网页提前渲染好了，其随着数据输出的过程逐步渲染页面。这远比一开始给出空白页面体验好。

Bigpipe的解决思路则是将页面分割成多个部分（pagelet），先向用户输出没有数据的布局（框架），将每个部分逐步输出到前端，再最终渲染填充框架，完成整个网页的渲染。这个过程中需要前端JavaScript的参与，它负责将后续输出的数据渲染到页面上。Bigpipe是一个需要前后端配合实现的优化技术，这个技术有几个重要的点。

❑ 页面布局框架（无数据的）。

❑ 后端持续性的数据输出。

❑ 前端渲染。Bigpipe的渲染流程示意图

![image-20230820210550303](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-20-21-05-image-20230820210550303.png)





Node在这个过程中，其异步特性使得数据的输出能够并行，越早调用完的数据可以越早渲染到页面中，这个特性使得Bigpipe更趋完美。

要完成Bigpipe这样逐步渲染页面的过程，其实通过Ajax也能完成，但是Ajax的背后是HTTP调用，要耗费更多的网络连接，Bigpipe获取数据则与当前页面共用相同的网络连接，开销十分小。完成Bigpipe所要涉及的细节较多，比MVC中的直接渲染要复杂许多，建议在网站重要的且数据请求时间较长的页面中使用。





## 应用

都要注意哪些问题 看《深入浅出Node.js》

### 总览

Node.js的核心作用包含优化页面渲染和提供API服务两种，API服务又可以细分为静态API模拟、API中间层和RPC服务。

以koa为例：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-04-10-55-image-20240104105514645.png" alt="image-20240104105514645" style="zoom:50%;" />

### node服务





### 部署

#### 动静分离

在普通的Web应用中，Node尽管也能通过中间件实现静态文件服务，但是Node处理静态文件的能力并不算突出。将图片、脚本、样式表和多媒体等静态文件都引导到专业的静态文件服务器上，让Node只处理动态请求即可。这个过程可以用Nginx或者专业的CDN来处理

![image-20230909135521566](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-09-09-13-55-image-20230909135521566.png)







## 路径

1. 如果是相对路径（即以`..`或`.`开头），则会根据 process.cwd()（获取当前node的运行目录）进行拼接
2. commonjs 规范里注入了几个变量如 `__dirname`（返回当前文件所处目录）、`__filename`(返回当前文件路径)
3. path模块(本质就是处理字符串 )能帮你处理一些兼容性问题比如在mac系统下路径是/，而window系统下路径是\





## node生态

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-08-05-11-09-image-20230805110955071.png" alt="image-20230805110955071"  />



# connect

介绍

Connect模块本质上只是对http模块的封装，提供了更统一的中间件形式，这对解耦抽象是非常重要的。Connect的最终返回结果就是 http.createServer()需要的参数。



原生做一个服务器

```js
const http = require('http')
http.createServer(function(req,res){
	console.log(req)
	if(req.url=='/'){
		res.end('/')
	}else if(req.url=='/2'){
		res.end('/2')
	}else{
		res.end('else')
	}
}).listen(8888)
```





使用connect

```js
var connect = require('connect');
var http = require('http');
 
var app = connect();
 
//create node.js http server and listen on port
http.createServer(app).listen(3000);
```



跟原生对比

- 如果URL有成百上千个，甚至更多，用if/else写起来是不是太低效了？这种情况下肯定要进行封装，让代码更简单。（koa-router就是维护一个路由表，老套路了把if/else转成map映射）
- 它们都是基于http.createServer的。
- Connect中提供了一个独立的app层。 Connect支持中间件写法，可以通过app.use函数挂载中间件。





# Express

## server

```js
const express = require('express'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	sparkMD5 = require('spark-md5') //根据文件的buffer格式生成md5

/**CREATE SERVER */
const app = express(),
	PORT = 8888,
	HOST = 'http://127.0.0.1',
	ADDRESS = HOST + ':' + PORT
app.listen(PORT, () => {
	console.log(`Server running at ${ADDRESS}`)
})

/**中间件 --- 理解成一个拦截器，去执行这些一个个函数*/
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', '*')
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	if (req.method == 'OPTIONS') { //处理预检请求
		return res.sendStatus(204) //204表示无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档
	}
	next()
	return
})
app.use(bodyParser.json()) //返回一个仅仅用来解析json格式的中间件。这个中间件能接受任何body中任何Unicode编码的字符。支持自动的解析gzip和 zlib。
app.use(bodyParser.urlencoded({ extended: false, limit: '1024mb' })) //这个中间件用来解析body中的urlencoded字符， 只支持utf-8的编码的字符。同样也支持自动的解析gzip和 zlib。

const fdRouter = require('./back-end/router/form-data')
app.use('/', fdRouter)

const base64Router = require('./back-end/router/base64')
app.use('/', base64Router)

const bigFileRouter = require('./back-end/router/big-file')
app.use('/', bigFileRouter)

```

## router

```js
const express = require('express')
const router = express.Router()

router.post('/upload_base64', async (req, res) => {
	
})
module.exports = router
```

## 中间件

全部代码都是 **同步** 代码的时候，connect可以实现洋葱模型的效果，但如果有个环节是 **异步** ，则先执行完中间件里的同步函数再执行异步。 跟koa-compose一样都是通过递归的方式执行next之前的部分，next就是调用下一个中间件函数。next返回之后则再执行next后面的部分。跟koa-compose的区别就在于，koa的[await next()函数之后的部分]会放入异步中，且等next()函数resolve了才会执行，而next函数resolve取决于下一个函数已执行完。，而connect是没有对异步的情况额外处理，直接把异步丢到队列里之后next就返回了，返回之后就继续执行next下面的代码了。

参考connect的中间件模式：

这是connect的源码：

```js
function handle(req, res, out) {
  // 中间件下标
  var index = 0;
	......
  // 中间件集合
  var stack = this.stack;

  // 中间件全部结束后调用的收尾函数
  // 如果上层应用有传下来的收尾函数，则使用其函数（比如说上一层 connect 传下来的 next）
  // 反之使用 finalhandler 生成的收尾函数
  var done =
    out ||
    finalhandler(req, res, {
      env: env,
      onerror: logerror,
    });

	.....
  // 启动 next
  next();
  
  // 定义 next 函数
  function next(err) {
    ......
    // 获取当前中间件
    var layer = stack[index++];

    // 如果没有中间件了，异步调用收尾函数，结束。
    if (!layer) {
      defer(done, err);
      return;
    }

    .......

    // 调用中间件
    call(layer.handle, route, err, req, res, next);
  }
}

var defer =
  typeof setImmediate === "function"
    ? setImmediate
    : function (fn) {
        process.nextTick(fn.bind.apply(fn, arguments));
      };

// handle: 当前中间件的处理函数
// route: 当前所属路由，默认为 '/'，反之应该是当前中间件所匹配的路由
// err：可能存在的错误信息
// req：request
// res：response
// next：执行下一个中间件
function call(handle, route, err, req, res, next) {
  // 中间件的入参数量
  var arity = handle.length;
	......

  try {
    if (hasError && arity === 4) {
      // 如果有错误抛出，并且当前中间件是处理错误的中间件，则调用，结束。
      handle(err, req, res, next);
      return;
    } else if (!hasError && arity < 4) {
      // 如果没有错误，并且当前中间件为非处理错误用的中间件，则调用，结束。
      handle(req, res, next);
      return;
    }
  } catch (e) {
    // 捕获错误并覆盖上一个可能存在的错误
    error = e;
  }

  // 出现错误 || （有错误 && 当前中间件不是处理错误的中间件函数），执行下一个中间件
  next(error);
}
```







## 与koa的区别

二者的主要区别：

- Express的哲学是为HTTP服务器提供小的、健壮的工具，使之成为开箱即用的Web框架。而Koa只提供中间件内核，不绑定任何中间件，所以Express和Koa并不在一个重量级别上。其实，Koa和Connect非常像，都是只有中间件机制的内核模块（所以Koa严格来说不算框架，只是将原生http服务器封装成中间件机制）。Koa、Express、Connect特性对比如图所示。

  <img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-01-04-11-48-image-20240104114813760.png" alt="image-20240104114813760" style="zoom:50%;" />

- 在异步执行中间件时，koa的话哪怕中间件中有异步函数也还是会严格按照洋葱模型的顺序去等异步函数执行完再去走下一个中间件，而express的话就是先执行完中间件里的同步函数再执行异步。原因看上面的中间件。 

  

**Express 和 KOA 之间关于洋葱模型的执行方式的区别介绍**：

**（1）express**

```js
import express from 'express';
const app = express(3000);
app.listen(3000);

/**
 * 中间件 1
 */
app.use(async (req, res, next) => {
  console.log('first');
  await next();
  console.log('first end');
});
/**
 * 中间件 2
 */
app.use(async (req, res, next) => {
  console.log('second');
  await next();
  console.log('second end');
});
/**
 * 异步中间件
 */
app.use(async (req, res, next) => {
  console.log('async');
  await next();
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log(`wait 1000 ms end`);
      resolve();
    }, 1000)
  );
  console.log('async end');
});
/**
 * 中间件 3
 */
app.use(async (req, res, next) => {
  console.log('third');
  await next();
  console.log('third end');
});
```

输出结果为：

```sh
first
second
async
third
third end
second end
first end
wait 1000 ms end
async end
```



**（2）Koa** **保持上面的代码顺序，只将对应的express语法改成koa语法：**

```js
const Koa = require('koa');
const app = new Koa();
/**
 * 中间件 1
 */
app.use(async (ctx, next) => {
    console.log('first');
    await next();
    console.log('first end');
});
/**
 * 中间件 2
 */
app.use(async (ctx, next) => {
    console.log('second');
    await next();
    console.log('second end');
});
/**
 * 异步中间件
 */
app.use(async (ctx, next) => {
    console.log('async');
    await next();
    await new Promise(
        (resolve) => 
            setTimeout(
                () => {
                    console.log(`wait 1000 ms end`);
                    resolve()
                }, 
            1000
        )
    );
    console.log('async end');
});

/**
 * 中间件 3
 */
app.use(async (ctx, next) => {
    console.log('third');
    await next();
    console.log('third end');
});
```

输出结果为：

```sh
first
second
async
third
third end
wait 1000 ms end
async end
second end
first end
```











# koa

## Koa 中实现 RESTful API

### 目录结构

```lua
|-- rest_node_api
    |-- .gitignore
    |-- README.md
    |-- package-lock.json
    |-- package.json      # 项目依赖
    |-- app
        |-- config.js     # 数据库（mongodb）配置信息
        |-- index.js      # 入口
        |-- controllers   # 控制器：用于解析用户输入，处理后返回相应的结果
        |-- models        # 模型（schema）： 用于定义数据模型
        |-- public        # 静态资源
        |-- routes        # 路由
```

项目的目录呈现了清晰的分层、分模块结构，也便于后期的维护和扩展。下面我们会对项目中需要注意的几点一一说明。

### Controller（控制器）

#### `什么是控制器？`

- 拿到路由分配的任务并执行
- 在 koa 中是一个中间件

#### `为什么要用控制器`

- `获取 HTTP 请求参数`
  - Query String，如?q=keyword
  - Router Params，如/users/:id
  - Body，如{name: 'jack'}
  - Header，如 Accept、Cookie
- `处理业务逻辑`
- `发送 HTTP 响应`
  - 发送 Status，如 200/400
  - 发送 Body，如{name: 'jack'}
  - 发送 Header，如 Allow、Content-Type

#### `编写控制器的最佳实践`

- 每个资源的控制器放在不同的文件里
- 尽量使用类+类方法的形式编写控制器
- 严谨的错误处理

#### `示例`

```js
app/controllers/users.js
const User = require("../models/users");
class UserController {
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {
      ctx.throw(409, "用户名已存在");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
}

module.exports = new UserController();
```

### 错误处理机制

#### `koa自带错误处理`

> 要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个 “error” 事件侦听器：

```lua
app.on('error', err => {
  log.error('server error', err)
});
```

#### `中间件`

本项目中采用`koa-json-error`来处理错误，关于该中间件的详细介绍会在下文展开。







## 使用

### 初始化项目

```bash
mkdir rest_node_api  # 创建文件目录
cd rest_node_api  # 定位到当前文件目录
npm init  # 初始化，得到`package.json`文件
npm i koa -S  # 安装koa
npm i koa-router -S  # 安装koa-router
```



> app/index.js

```js
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

router.get("/", async function (ctx) {
    ctx.body = {message: "Hello World!"}
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
```

### 相关中间件和插件依赖

#### 生成koa项目的脚手架

koa-generator



#### 跨域`@koa/cors`

这是官方插件，装载@koa/cors中间件一定要在koa-router之前，如果在请求过程中还没有进行cors设置，跨域问题会依然存在。



#### 路由

##### 相关库

`koa-router` 、`@koa/router`基于正则匹配

`koa-trie-router`  基于 字典树



##### 方式一：逻辑分割

路由分割路由分割就是把所有路由按照类别进行划分，并分别维护在不同的文件里。

举例：

1. 货物的路由文件代码如下: 

```js
// routers/goods.js
const Router = require('koa-router')
const router = new Router()
// 设置路由前缀
router.prefix('/goods')
router.get('/getInfo', (ctx, next)=>{
  ctx.body = "this is koa book."
})
module.exports = router
```



2. 用户的路由文件代码如下:

````js
// routers/user.js
const Router = require('koa-router')
const router = new Router()
router.prefix('/user')
router.get('/getInfo', (ctx, next)=>{
  ctx.body = "my name is liujianghong."
})
module.exports = router
````



3. 使用koa-compose 合并 所有路由（因为koa-router里面的routers方法和allowedMethods方法和我们平时用的中间件回调方法是一样的）：

```js
// routers/index.js
const compose = require('koa-compose')
const glob = require('glob')
const { resolve } = require('path')

registerRouter = () => {
  let routers = [];
  // 递归式获取当前文件夹下所有的.js文件
  glob.sync(resolve(__dirname, './', '**/*.js'))
    // 排除index.js文件, 因为这个文件不是具体的路由文件
    .filter(value => (value.indexOf('index.js') === -1))
    .forEach(router => {
      routers.push(require(router).routes())
      routers.push(require(router).allowedMethods())
    })
  return compose(routers)
}

module.exports = registerRouter
```



4. 最后把整合后的路由引进来，代码如下：

```js
// app.js
const Koa = require('koa')
const registerRouter  = require('./routers')
const app = new Koa()
app.use(registerRouter())
app.listen(4000, () => {
  console.log('server is running, port is 4000')
})
```



##### 方式二：约定式分割

###### 定义

根据文件路径来匹配路由。

比如现在有这样一个项目，组织结构如下。actions目录下的内容就是匹配路由的，比如前端有一个GET请求http://127.0.0.1:4000/goods/getInfo，那么会匹配到actions目录下的goods/getInfo.js文件，最终会执行getInfo.js里面的逻辑。

```sh
.
├── actions
│   ├── goods
│   │   └── getInfo.js
│   └── user
│       └── getInfo.js
└── app.js
```



###### 2个优势

- 依据项目的文件目录就能了解项目包含哪些路由，不用查看路由文件。
- 用文件路径来组织路由，便于开发。



###### 实现步骤

1. actions/goods/getInfo.js文件的定义代码如下。

   ```js
   // actions/goods/getInfo.js
   module.exports = {
     method: 'GET',
     handler: (ctx) => {
       ctx.body = "this is koa book."
     }
   }
   ```

2. actions/user/getInfo.js文件的定义代码如下:

   ```js
   // actions/user/getInfo.js
   module.exports = {
     method: 'GET',
     handler: (ctx) => {
       ctx.body = "my name is liujianghong."
     }
   }
   ```

   两个文件都定义了两个属性，一个是method，另一个是handler。method的配置主要是为了比如请求路径都是/goods/getInfo，那么方法类型是GET或是POST，两个请求是不一样的。handler方法就是一个回调函数，用来处理相应的业务逻辑。

3. 请求路径映射到对应的文件路径

   ```js
   const glob = require('glob')
   const path = require('path')
   const Koa = require('koa')
   const app = new Koa()
   
   // actions的绝对路径
   const basePath = path.resolve(__dirname, './actions')
   // 获取actions目录下所有的.js文件, 并返回其绝对路径
   const filesList = glob.sync(path.resolve(__dirname, './actions', '**/*.js'))
   
   // 文件路由映射表
   let routerMap = {}
   filesList.forEach(item => {
     // 解构的方式获取当前文件导出对象中的method属性和handler属性
     const { method, handler } = require(item)
     // 获取和actions目录的相对路径, 例如：goods/getInfo.js
     const relative = path.relative(basePath, item)
     // 获取文件后缀.js
     const extname = path.extname(item)
     // 剔除后缀.js, 并在前面加一个"/", 例如：/goods/getInfo
     const fileRouter = '/' + relative.split(extname)[0]
     // 连接method, 形成一个唯一请求, 例如: _GET_/goods/getInfo
     const key = '_' + method + '_' + fileRouter
     // 保存在路由表里
     routerMap[key] = handler
   })
   
   app.use(async (ctx, next) => {
     const { path, method } = ctx
     // 构建和文件路由匹配的形式为_GET_路由
     const key = '_' + method + '_' + path
     // 如果匹配到, 就执行对应到handler方法
     if (routerMap[key]) {
       routerMap[key](ctx)
     } else {
       ctx.body = 'no this router'
     }
   })
   
   app.listen(4000, () => {
     console.log('server is running, port is 4000')
   })
   ```

   









#### `koa-bodyparser`

处理post请求体



#### 处理异常`koa-error`



#### 鉴权koa-jwt

koa-jwt这个包是一个用来进行JWT鉴权的中间件，其主要功能是生产JWT。

```js
// app.js
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new koa();
const Router = require('koa-router');
const router = new Router();
const static = require('koa-static');
const path = require('path');

const { sign } = require('jsonwebtoken');
const secret = 'my_secret';
const jwt = require('koa-jwt')({ secret });

app.use(bodyParser())
app.use(static(path.join(__dirname, '/static')))

/*******************以下是核心代码*****************************************/
router.post('/login', async (ctx, next) => {
  const { userName } = ctx.request.body;
  if (userName) {
    const token = sign({ userName }, secret, {expiresIn:'1h'});
    ctx.body = {
      mssage: 'get token success!',
      code: 1,
      token
    }
  } else {
    ctx.body = {
      message: 'param error',
      code: -1
    }
  }
})
.get('/welcome', jwt, async (ctx, next) => { //进行/welcome接口调用时，会带上localStorage中的token进行鉴权，鉴权通过后直接返回接口数据
  ctx.body = { message: 'welcome!!!' }
})
/*******************以上是核心代码*****************************************/


app
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(4000, () => {
  console.log('server is running, port is 4000')
})
```







#### 文件上传`koa-body`

依赖安装

`npm i koa-body -S`

> app/index.js

```js
const koaBody = require('koa-body');
const app = new koa();
app.use(koaBody({
  multipart:true, // 支持文件上传
  encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'public/uploads'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    onFileBegin:(name,file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  }
}));
```

参数配置:

- `基本参数`

  | 参数名     | 描述                                             | 类型             | 默认值         |
  | ---------- | ------------------------------------------------ | ---------------- | -------------- |
  | patchNode  | 将请求体打到原生 node.js 的`ctx.req`中           | Boolean          | `false`        |
  | patchKoa   | 将请求体打到 koa 的 `ctx.request` 中             | Boolean          | `true`         |
  | jsonLimit  | JSON 数据体的大小限制                            | String / Integer | `1mb`          |
  | formLimit  | 限制表单请求体的大小                             | String / Integer | `24kb`         |
  | textLimit  | 限制 text body 的大小                            | String / Integer | `23kb`         |
  | encoding   | 表单的默认编码                                   | String           | `utf-8`        |
  | multipart  | 是否支持 `multipart-formdate` 的表单             | Boolean          | `false`        |
  | urlencoded | 是否支持 `urlencoded` 的表单                     | Boolean          | `true`         |
  | formidable | 配置更多的关于 `multipart` 的选项                | Object           | `{}`           |
  | onError    | 错误处理                                         | Function         | `function(){}` |
  | stict      | 严格模式,启用后不会解析 `GET, HEAD, DELETE` 请求 | Boolean          | `true`         |

- `formidable 的相关配置参数`

  | 参数名         | 描述                                         | 类型     | 默认值                  |
  | -------------- | -------------------------------------------- | -------- | ----------------------- |
  | maxFields      | 限制字段的数量                               | Integer  | `500`                   |
  | maxFieldsSize  | 限制字段的最大大小                           | Integer  | `1 * 1024 * 1024`       |
  | uploadDir      | 文件上传的文件夹                             | String   | `os.tmpDir()`           |
  | keepExtensions | 保留原来的文件后缀                           | Boolean  | `false`                 |
  | hash           | 如果要计算文件的 hash，则可以选择 `md5/sha1` | String   | `false`                 |
  | multipart      | 是否支持多文件上传                           | Boolean  | `true`                  |
  | onFileBegin    | 文件上传前的一些设置操作                     | Function | `function(name,file){}` |





#### 文件下载`koa-send`









#### `koa-json-error`

在写接口时，返回`json`格式且易读的错误提示是有必要的，`koa-json-error`中间件帮我们做到了这一点。

依赖安装

`npm i koa-json-error -S`

```css
app/index.js
const error = require("koa-json-error");
const app = new Koa();
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest }
  })
);
```

错误会默认抛出堆栈信息`stack`，在生产环境中，没必要返回给用户，在开发环境显示即可。

#### `koa-parameter`

采用`koa-parameter`用于参数校验，它是基于参数验证框架`parameter`, 给 koa 框架做的适配。

依赖安装

```css
npm i koa-parameter -S
```

使用

```php
// app/index.js
const parameter = require("koa-parameter");
app.use(parameter(app));

// app/controllers/users.js
 async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    ...
  }
```

因为`koa-parameter`是基于`parameter的`，只是做了一层封装而已，底层逻辑还是按照 parameter 来的，自定义规则完全可以参照 parameter 官方说明和示例来编写。

```yaml
let TYPE_MAP = Parameter.TYPE_MAP = {
  number: checkNumber,
  int: checkInt,
  integer: checkInt,
  string: checkString,
  id: checkId,
  date: checkDate,
  dateTime: checkDateTime,
  datetime: checkDateTime,
  boolean: checkBoolean,
  bool: checkBoolean,
  array: checkArray,
  object: checkObject,
  enum: checkEnum,
  email: checkEmail,
  password: checkPassword,
  url: checkUrl,
};
```

#### `koa-static`部署静态资源

koa-static里核心依赖了koa-send。

##### koa-static和koa-mount一起用

koa-mount能将中间件挂载到指定路径。koa-mount和koa-static结合，就可以实现和Express一样的静态服务器带有请求前缀的功能

```js
const koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const app = new koa()
app.use(mount('/static',serve('.')))
app.listen(3000)
```

此时，访问`http://127.0.0.1:3000/static/........`





##### 用法 

如果网站提供静态资源（图片、字体、样式、脚本......），为它们一个个写路由就很麻烦，也没必要。`koa-static`模块封装了这部分的请求。

> app/index.js

```js
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import Koa from 'koa'
import stat from 'koa-static'
const app = new Koa()
app.use(stat(path.join(__dirname, 'dist')))
app.listen(8048, '127.0.0.1')
```



##### 自己写一个

```js
import Koa from 'koa';
import path from 'path';
import fs from 'fs';
const app = new Koa();
const dirPath = path.join(__dirname, './statci');
const fileToType = {
  html: 'text/html',
  css: 'text/css',
  jpg: 'image/jpeg'
};
const parserFileType = (filePath) => {
  const extname = path.extname(filePath).slice(1);
  return fileToType[extname] ?? null;
};

app.use(async (ctx) => {
  const content = fs.readFileSync(path.join(dirPath, ctx.url), 'binary');
  const mimeType = parserFileType(ctx.url);
  if (mimeType) {
    ctx.type = mimeType;
    if (mimeType.indexOf('image/') > -1) {
      //图片传输二进制数据
      ctx.res.writeHead(200);
      ctx.res.write(content, 'binary');
      ctx.res.end();
    } else {
      ctx.body = content;
    }
  }
});
app.listen(3000, () => {
  console.log('app listen 3000');
});
```





#### 模版引擎`koa-views`

其支持很多模版引擎。koa-views支持的模板引擎详情见https://github.com/tj/consolidate.js#supported-template-engines。



#### url重写`koa-rewrite`

使访问旧接口也能够访问到新接口数据的。





### 连接数据库

数据库我们采用的是`mongodb`，连接数据库前，我们要先来看一下`mongoose`。

`mongoose`是`nodeJS`提供连接 `mongodb`的一个库，类似于`jquery`和`js`的关系，对`mongodb`一些原生方法进行了封装以及优化。简单的说，`Mongoose`就是对`node`环境中`MongoDB`数据库操作的封装，一个对象模型(`ODM`)工具，将数据库中的数据转换为`JavaScript`对象以供我们在应用中使用。

安装 mongoose

```sh
npm install mongoose -S
```

连接及配置

```javascript
const mongoose = require("mongoose");
mongoose.connect(
  connectionStr,  // 数据库地址
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("mongodb 连接成功了！")
);
mongoose.connection.on("error", console.error);
```





## 源码

koa的源码里实现功能的就这四个文件

### application.js

#### app类

`const app = new Koa();`这里其实就是new Application()

Application就是继承NodeJS.EventEmitter。EventEmitter类有静态方法listenerCount()，所以如果我们自己定义app.on('error', (error) => {})，listenerCount会自动加1。

EventEmitter类，用于处理事件与事件监听器的绑定和触发。它是一个基于发布/订阅模式的实现。

#### 创建一个服务

app.listen()本质是用http.createServer()

```js
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```





#### callback

先处理middleware暴露出递归调用middleware的方法。

然后判断一下app上属性listener-Count('error')是否存在，如果存在则执行我们自己定义的error监听逻辑，否则执行Koa默认的error监听逻辑。因为Application类继承Node的Emitter类，所以Application是具有事件监听能力的。





callback()返回的是一个函数，其实这个函数就是HTTP模块中createServer()方法的回调函数参数了。

这个回调函数参数主要就是利用handleRequest()，handleRequest默认的返回状态码是404，该方法最后返回一个fnMiddleware的链式调用，这是执行所有中间件后利用response()函数处理response返回逻辑，如果执行过程中有任何异常，会执行ctx.onerror方法。response函数实现的主要是不同情况下的返回处理。



#### 中间件 -- koa中最关键的洋葱模型实现

本质就是流水线，函数式编程里pipeline。

Application类的构造函数中声明了一个名为middleware的数组，当执行use()方法时，会一直往middleware中的push()方法传入函数。

洋葱模型的核心在于koa-compose。就是利用了递归的堆栈实现先进后出。

`koa-compose的核心代码`：

koa-compose核心就是对middleware数组进行处理，然后返回一个开始执行中间件的函数，该函数会通过递归去执行中间件里的所有函数。在执行的时候按照middleware的顺序执行 [await next()函数之前的逻辑] (深度遍历，调用了next才进入下一个)，[await next()函数之后的部分]会放入异步中，且等next()函数resolve了才会执行，而next函数resolve取决于下一个函数已执行完。另外context对象从始至终都贯穿所有的中间件，并且该对象的引用一直没变.

```js
module.exports = compose
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
      let index = -1// last called middleware #
      return dispatch(0) //开始遍历
      function dispatch (i) { 
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) fn = next // 如果当前执行下标等于中间件的长度说明已经执行完所有中间件了
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1))) //递归。 dispatch就是next函数。Promise.resolve()是同步执行的且如果本身就是promise对象则直接返回该promise对象 。 ！！！先执行fn，等fn执行完了才返回promise出去。
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
}
```

使用中间件:

```js
const Koa = require('koa')
const app = new Koa()
app.use(async (ctx, next) => {  // 第一个中间件
  console.log('---1--->')
  await next()
  console.log('===6===>')
})
app.use(async (ctx, next) => {  // 第二个中间件
  console.log('---2--->')
  await next()
  console.log('===5===>')
})
app.use(async (ctx, next) => {  // 第三个中间件
  console.log('---3--->')
  await next()
  console.log('===4===>')
})
app.listen(4000, () => {
  console.log('server is running, port is 4000')
})
```





#### 封装ctx

中间件中的ctx对象经过createContext()方法进行了封装，其实ctx是通过Object.create()方法继承了this.context，而this.context又继承了lib/context.js中导出的对象。最终将http.IncomingMessage类和http.ServerResponse类都挂载到了context.req和context.res属性上，这样是为了方便用户从ctx对象上获取需要的信息。

那么为什么app、req、res、ctx也存放在request和response对象中呢？是为了使它们同时共享app、req、res、ctx，方便处理职责进行转移。当用户访问时，只需要ctx就可以获取Koa提供的所有数据和方法，而Koa会继续将这些职责进行划分，比如request是进一步封装req的，response是进一步封装res的，这样职责得到了分散，降低了耦合度，同时共享所有资源使上下文具有高内聚性，内部元素互相能访问到。



满足单一上下文原则：只有一个context对象并共享给所有的全局中间件使用。每个请求中的context对象都是唯一的，并且所有关于请求和响应的信息都放在context对象里面。单一上下文原则有以下优点：

降低复杂度：在中间件中，只有一个ctx，所有信息都在ctx上，使用起来很方便。

便于维护：上下文中的一些必要信息都在ctx上，便于维护。

降低风险：context对象是唯一的，信息是高内聚的，因此改动的风险也会降低很多。





#### 错误处理

Koa处理异常的逻辑就是简单地打印到控制台。

比如在中间件中有一些异步操作，如果异步操作中有异常，Koa是获取不到错误信息的。

这个时候就需要我们自己做一些兜底处理了，比较通用的方法是加一个uncaught-Exception类型事件的监听，这样就能捕获上述异常了:

```js
process.on('uncaughtException',error=>{
	console.log(error)
})
```







### context.js

#### 把ctx.request和ctx.response的属性代理到ctx上

利用`delegate`库把ctx.request和ctx.response的属性代理到ctx上了，就是为了将ctx.request.path写成ctx.path。少写一个单词，就是一种提效的表现。







#### Cookie的操作

Koa的服务一般都是BFF服务，涉及前端服务时通常会遇到用户登录的场景。Cookie是用来记录用户登录状态的，Koa本身也提供了修改Cookie的功能。我们还是从一个实例入手，看Koa如何操作Cookie：处理Cookie可直接用ctx对象中cookies属性的set()和get()方法。



通过set()和get()方法来对Cookie进行操作，实际操作是通过`Cookies`这个包。





### request.js

request.js的实现就是通过set()和get()方法对一些属性进行封装，方便开发者调用一些常用属性。

比如：

获取请求中的path：

```js
get path() {
  return parse(this.req).pathname;
},
```



获取请求中的query对象:

使用了querystring模块`const qs = require('querystring')`

```js
get query() {
  const str = this.querystring;
  const c = this._querycache = this._querycache || {};
  return c[str] || (c[str] = qs.parse(str));
},
```





获取完整URL对象属性:

```js
get URL() {
  if (!this.memoizedURL) {
    const originalUrl = this.originalUrl || ''; // 避免在
      模板中出现undefined的情况
    try {
      this.memoizedURL = new URL(`${this.origin}$
        {originalUrl}`);
    } catch (err) {
      this.memoizedURL = Object.create(null);
    }
  }
  return this.memoizedURL;
},
```

ctx.request.URL输出结果如下:

```
{
  href: 'http://127.0.0.1:4000/home?page=10',
  origin: 'http://127.0.0.1:4000',
  protocol: 'http:',
  username: '',
  password: '',
  host: '127.0.0.1:4000',
  hostname: '127.0.0.1',
  port: '4000',
  pathname: '/home',
  search: '?page=10',
  searchParams: URLSearchParams { 'page' => '10' },
  hash: ''
}
```





### response.js

response.js的整体实现思路和request.js大体一致，也是通过set()和get()方法封装了一些常用属性。



## 相关库源码

### @koa/router

#### 介绍

这个中间件是挂在`Koa`官方名下的，他跟另一个中间件[koa-router](https://github.com/ZijianHe/koa-router)名字很像。其实`@koa/router`是`fork`的`koa-router`，因为`koa-router`的作者很多年没维护了，所以`Koa`官方将它`fork`到了自己名下进行维护。





#### 使用

```javascript
const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get("/", (ctx) => {
  ctx.body = "Hello World";
});

router.get("/api/users", (ctx) => {
  const resData = [
    {
      id: 1,
      name: "小明",
      age: 18,
    },
    {
      id: 2,
      name: "小红",
      age: 19,
    },
  ];

  ctx.body = resData;
});

router.post("/api/users", async (ctx) => {
  // 使用了koa-bodyparser才能从ctx.request拿到body
  const postData = ctx.request.body;

  // 使用fs.promises模块下的方法，返回值是promises
  await fs.promises.appendFile(
    path.join(__dirname, "db.txt"),
    JSON.stringify(postData)
  );

  ctx.body = postData;
});

app.use(router.routes());

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}/`);
});
```





#### 总体架构

分为**注册路由**和**匹配路由**两部分

1. **注册路由**主要是构建路由的数据结构，具体来说就是创建很多`layer`，每个`layer`上保存具体的`path`，`methods`，和对应的回调函数。
2. **匹配路由**就是去遍历所有的`layer`，找出匹配的`layer`，将回调方法拿来执行。一个路由可能匹配多个`layer`和回调函数，执行时使用`koa-compose`将这些匹配的回调函数串起来，一个执行完再下一个。



#### router.js

##### 构造函数

```javascript
module.exports = Router;

/*这个构造函数的主要作用就是初始化了一个属性`stack`，这个属性就是用来存放`layer`的。*/
function Router() {
  // 为了支持无new直接调用。我们知道要实例化一个类，一般要使用`new`关键字，比如`new Router()`。但是如果`Router`构造函数加了这行代码，就可以支持无`new`调用了，直接`Router()`可以达到同样的效果。这是因为如果你直接`Router()`调用，`this instanceof Router`返回为`false`，会走到这个`if`里面去，构造函数会帮你调用一下`new Router()`。
  if (!(this instanceof Router)) return new Router();

  this.stack = []; 
}
```



##### `router.register()`注册路由

`router.register()`是真正注册路由的方法，注册路由就是构建`layer`的数据结构，`router.register()`的主要作用就是构建这个数据结构：

```javascript
Router.prototype.register = function (path, methods, middleware) { // 我可以直接调用这个方法来注册路由，且一次性传入多个methods，比如‘/dyc’这个路径既支持post也支持get
  const stack = this.stack;

  const route = new Layer(path, methods, middleware); //用`path`，`method`和`middleware`来创建一个`layer`实例，然后把它塞到`stack`数组里面去。

  stack.push(route);

  return route;
};
```



##### 请求动词函数

注册路由主要是在请求动词函数里面进行的，比如`router.get`和`router.post`这种函数。`HTTP`动词有很多，有一个库专门维护了这些动词：[methods](https://github.com/jshttp/methods)。`@koa/router`也是用的这个库，我们这里就简化下，直接一个将`get`和`post`放到一个数组里面吧。

```javascript
// HTTP动词函数
const methods = ["get", "post"];
for (let i = 0; i < methods.length; i++) {
  const method = methods[i];

  Router.prototype[method] = function (path, middleware) { // 这里的`middleware`其实就是我们路由的回调函数
    // 将middleware转化为一个数组，支持传入多个回调函数
    middleware = Array.prototype.slice.call(arguments, 1);

    this.register(path, [method], middleware);

    return this;
  };
}
```

这里的`middleware`其实就是我们路由的回调函数，因为代码是取的`arguments`第二个开始到最后所有的参数，所以其实他是支持同时传多个回调函数的。（另外官方源码其实是三个参数，还有可选参数`name`，我这里直接去掉了。）

这个实例方法最后返回了`this`，这种操作的目的是让用户可以连续点点点，比如这样：

```javascript
router.get().post();
```

这些实例方法最后其实都是调`this.register()`去注册路由的。



##### router.match()路由匹配

通过传入的`path`和`method`去`router.stack`上找到所有匹配的`layer`：

```javascript
Router.prototype.match = function (path, method) {
  const layers = this.stack; // 取出所有layer

  let layer;
  // 构建一个结构来保存匹配结果，最后返回的也是这个matched
  const matched = {
    path: [], // 保存所有`path`匹配，但是`method`并不一定匹配的`layer`
    pathAndMethod: [], // pathAndMethod保存path和method都匹配的layer
    route: false, // 只要有一个path和method都匹配的layer，就说明这个路由是匹配上的，这个变量置为true
  };

  // 循环layers来进行匹配
  for (let i = 0; i < layers.length; i++) {
    layer = layers[i];
    // 匹配的时候调用的是layer的实例方法match
    if (layer.match(path)) {
      matched.path.push(layer); // 只要path匹配就先放到matched.path上去

      // 如果method也有匹配的，将layer放到pathAndMethod里面去
      if (~layer.methods.indexOf(method)) {
        matched.pathAndMethod.push(layer);
        if (layer.methods.length) matched.route = true;
      }
    }
  }

  return matched;
};
```

上面代码只是循环了所有的`layer`，然后将匹配的`layer`放到一个对象`matched`里面并返回给外面调用。



扩展：这段代码还有个有意思的点是检测`layer.methods`里面是否包含`method`的时候，源码是这样写的：

```javascript
~layer.methods.indexOf(method)
```

而一般我们可能是这样写:

```javascript
layer.methods.indexOf(method) > -1
```

这个源码里面的`~`是按位取反的意思，达到的效果与我们后面这种写法其实是一样的，因为:

```javascript
~ -1;      // 返回0，也就是false
~ 0;       // 返回-1, 注意-1转换为bool是true
~ 1;       // 返回-2，转换为bool也是true
```





##### router.routes() 

`router.routes()`主要返回一个`Koa`中间件以便`Koa`调用，这个中间件的主要工作是遍历`router`上的`layer`，找到path和method都匹配的所有layer，并拿出这些layer里面的回调函数一个执行完再接着一个执行。

```javascript
Router.prototype.routes = function () {
  const router = this;

  // 这个dispatch就是我们要返回给Koa调用的中间件
  let dispatch = function dispatch(ctx, next) {
    const path = ctx.path;
    const matched = router.match(path, ctx.method); // 获取所有匹配的

    ctx.router = router; // 把router挂到ctx上，给其他Koa中间件使用

    if (!matched.route) return next(); // 如果一个layer都没匹配上，直接返回，并执行下一个Koa中间件

    const matchedLayers = matched.pathAndMethod; // 获取所有path和method都匹配的layer
    // 下面这段代码的作用是将所有layer上的stack，即所有layer的回调函数都合并到一个数组layerChain里面去（matchedLayers是个数组，layer.stack也是个数组）
    const layerChain = matchedLayers.reduce(function (memo, layer) {
      return memo.concat(layer.stack);
    }, []);

    // 这里的compose也是koa-compose这个库
    // 使用compose将layerChain数组合并成一个可执行的方法，并拿来执行，传入参数是Koa中间件参数ctx, next
    return compose(layerChain)(ctx, next);
  };

  // 将中间件返回
  return dispatch;
};
```

上述代码返回的是一个`Koa`中间件，这个中间件里面先是通过`router.match`方法将所有匹配的`layer`拿出来，然后将这些`layer`对应的回调函数通过`reduce`放到一个数组里面，也就是`layerChain`。



扩展：然后用`koa-compose`将这个数组合并成一个可执行方法，在`@koa/router`这里`fn`对应的是`layerChain`里面的一项，执行`fn`的时候是这样的:

```javascript
fn(context, dispatch.bind(null, i + 1))
```

上面的`fn`就是我们传的回调函数，传的参数就是ctx和next

```javascript
router.get("/", (ctx, next) => {
  ctx.body = "Hello World";
  next(); 
});
```



执行`next()`其实就是把`koa-compose`里面的`dispatch.bind(null, i + 1)`拿出来执行，也就是`dispatch(i + 1)`，对应的就是执行`layerChain`里面的下一个函数。有朋友觉得`@koa/router`回调函数里面的`next`没什么用，如果你一个路由只有一个匹配的回调函数，那确实没什么用，但是如果你一个路径可能匹配多个回调函数，记得调用`next`。如果`/`这个路径匹配了多个回调函数，比如这样：

```javascript
router.get("/", (ctx, next) => {
  console.log("123");
  next(); 
});

router.get("/", (ctx, next) => {
  ctx.body = "Hello World";
});
```











#### layer.js

##### 构造函数

每个`layer`上保存具体的`path`，`methods`，和对应的回调函数。可以理解成这就是一个个路由

```javascript
const { pathToRegexp } = require("path-to-regexp"); // 这个库在很多处理路由的库里面都见到过，比如`React-Router`，`Express`，

module.exports = Layer;

function Layer(path, methods, middleware) {
  // 初始化methods和stack属性
  this.methods = [];
  // 这里的stack存放的是我们传入的回调函数
  this.stack = Array.isArray(middleware) ? middleware : [middleware];

  // 将参数methods大写化后一个一个塞进this.methods里面去
  for (let i = 0; i < methods.length; i++) {
    this.methods.push(methods[i].toUpperCase());    // ctx.method是大写，注意这里转换为大写
    if (this.methods[l - 1] === 'GET') this.methods.unshift('HEAD');
  }

  // 保存path属性
  this.path = path;
  // 使用path-to-regexp库将path转化为正则
  this.regexp = pathToRegexp(path);
}
```



##### layer.match()

用以找到path匹配的layer。

在创建`layer`实例的时候，其实已经将`path`转换为了一个正则，直接拿来用就行：

```javascript
Layer.prototype.match = function (path) {
  return this.regexp.test(path);
};
```





### Koa-compose

洋葱模型的核心在于koa-compose。就是利用了递归的堆栈实现先进后出。

`koa-compose的核心代码`：

koa-compose核心就是对middleware数组进行处理，然后返回一个开始执行中间件的函数，该函数会通过递归去执行中间件里的所有函数。在执行的时候按照middleware的顺序执行 [await next()函数之前的逻辑] (深度遍历，调用了next才进入下一个)，[await next()函数之后的部分]会放入异步中，且等next()函数resolve了才会执行，而next函数resolve取决于下一个函数已执行完。另外context对象从始至终都贯穿所有的中间件，并且该对象的引用一直没变.



```js
function compose(middleware) {
  // 参数检查，middleware必须是一个数组
  if (!Array.isArray(middleware))
    throw new TypeError("Middleware stack must be an array!");
  // 数组里面的每一项都必须是一个方法
  for (const fn of middleware) {
    if (typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  // 返回一个方法，这个方法就是compose的结果
  // 外部可以通过调用这个方法来开启中间件数组的遍历
  // 参数形式和普通中间件一样，都是context和next
  return function (context, next) {
    return dispatch(0); // 开始中间件执行，从数组第一个开始

    // 执行中间件的方法
    function dispatch(i) {
      let fn = middleware[i]; // 取出需要执行的中间件

      // 如果当前执行下标等于中间件的长度说明已经执行完所有中间件了
      if (i === middleware.length) {
        fn = next; // 这里让fn等于外部传进来的next，其实是进行收尾工作，比如返回404
      }

      // 如果外部没有传收尾的next，直接就resolve
      if (!fn) {
        return Promise.resolve();
      }

      // 执行中间件，注意传给中间件接收的参数应该是context和next
      // 传给中间件的next是dispatch.bind(null, i + 1)，所以中间件里面调用next的时候其实调用的是dispatch(i + 1)，也就是执行下一个中间件
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // Promise.resolve()是同步执行的且如果本身就是promise对象则直接返回该promise对象。！！！先执行fn，等fn执行完了才返回promise出去。
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```



### [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)

将path（如 `/user/:name`）转化为正则表达式。如果同时写了/dyc/:id 和 /dyc/a 这两个路由，vue-router的处理是请求/dyc/a时会匹配到 /dyc/a

比如`/dyc/:id`会被转成：`/^\/dyc(?:\/([^\/#\?]+?))[\/#\?]?$/i`，这正则的意思是：

下面是它的分解：

1. `^`：表示匹配字符串的开始。
2. `\/dyc`：匹配确切的字符序列 "/dyc"。
3. `(?:...)`：这是一个非捕获分组，用于将括号内的部分分组在一起，但不捕获匹配结果。在这里，它是一个包含路径的非捕获分组。
4. `\/`：匹配斜杠字符 "/"
5. `([^\/#\?]+?)`：这是一个捕获分组，它匹配一个或多个非斜杠、非井号和非问号的字符，这些字符在括号内被捕获。
6. `[\/#\?]?`：这部分匹配可选的斜杠 "/"、井号 "#" 或问号 "?"，并且该部分是可选的。
7. `$`：表示匹配字符串的结束。
8. `i`：表示正则表达式执行时不区分大小写。

这个正则表达式主要用于匹配类似 "/dyc/path" 或 "/dyc/path#section" 或 "/dyc/path?query" 的URL路径。捕获分组 `(\/([^\/#\?]+?))` 将提取路径部分，而 `/dyc` 作为前缀要确切匹配。



比如`/dyc/a`会被转成：`/^\/dyc\/a[\/#\?]?$/i`

让我们逐步解释：

- `^`: 表示匹配字符串的开始。
- `\/dyc\/a`: 匹配 `/dyc/a`，`\/` 是转义字符，确保斜杠被视为正则表达式的一部分。
- `[\/#\?]`: 是一个字符集合，匹配一个斜杠、井号（#）或问号（?）中的任意一个。
- `?`: 表示在 `[\/#\?]` 之前的字符可选，可以出现 0 或 1 次。
- `$`: 表示匹配字符串的结束。
- `i`: 表示不区分大小写。


会匹配类似以下形式的URL：

- `/dyc/a`
- `/dyc/a/`
- `/dyc/a#something`
- `/dyc/a?query=value`



## 示例

在这里主要是以登录模块的`crud`为例来展示下如何在 koa 中践行`RESTful API最佳实践`。

#### `app/index.js`(koa 入口)

入口文件主要用于创建 koa 服务、装载 middleware(中间件)、路由注册(交由 routes 模块处理)、连接数据库等。

```js
const Koa = require("koa");
const path = require("path");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const parameter = require("koa-parameter");
const error = require("koa-json-error");
const mongoose = require("mongoose");
const routing = require("./routes");
const app = new Koa();
const { connectionStr } = require("./config");
mongoose.connect(  // 连接mongodb
  connectionStr,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("mongodb 连接成功了！")
);
mongoose.connection.on("error", console.error);

app.use(koaStatic(path.join(__dirname, "public")));  // 静态资源
app.use(  // 错误处理
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest }
  })
);
app.use(  // 处理post请求和图片上传
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true
    }
  })
);
app.use(parameter(app));  // 参数校验
routing(app);  // 路由处理

app.listen(3000, () => console.log("程序启动在3000端口了"));
```

#### `app/routes/index.js`

由于项目模块较多，对应的路由也很多。如果一个个的去注册，有点太麻烦了。这里用 node 的 fs 模块去遍历读取 routes 下的所有路由文件，统一注册。

```js
const fs = require("fs");

module.exports = app => {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === "index.js") {
      return;
    }
    const route = require(`./${file}`);
    app.use(route.routes()).use(route.allowedMethods());
  });
};
```

#### `app/routes/users.js`

用户模块路由，里面主要涉及到了用户的登录以及增删改查。

```javascript
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("koa-jwt");
const { secret } = require("../config");
const Router = require("koa-router");
const router = new Router({ prefix: "/users" });  // 路由前缀
const {
  find,
  findById,
  create,
  checkOwner,
  update,
  delete: del,
  login,
} = require("../controllers/users");  // 控制器方法

const auth = jwt({ secret });  // jwt鉴权

router.get("/", find);  // 获取用户列表

router.post("/", auth, create);  // 创建用户（需要jwt认证）

router.get("/:id", findById);  // 获取特定用户

router.patch("/:id", auth, checkOwner, update);  // 更新用户信息（需要jwt认证和验证操作用户身份）

router.delete("/:id", auth, checkOwner, del);  // 删除用户（需要jwt认证和验证操作用户身份）

router.post("/login", login);  // 用户登录

module.exports = router;
```

#### `app/models/users.js`

用户数据模型（schema）

```rust
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    __v: { type: Number, select: false },
    name: { type: String, required: true },  // 用户名
    password: { type: String, required: true, select: false },  // 密码
    avatar_url: { type: String },  // 头像
    gender: {  //   性别
      type: String,
      enum: ["male", "female"],
      default: "male",
      required: true
    },
    headline: { type: String },  // 座右铭
    locations: {  // 居住地
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      select: false
    },
    business: { type: Schema.Types.ObjectId, ref: "Topic", select: false },  // 职业
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);

复制代码
```

#### `app/controllers/users.js`

用户模块控制器，用于处理业务逻辑

```php
const User = require("../models/users");
const jsonwebtoken = require("jsonwebtoken");
const { secret } = require("../config");
class UserController {
  async find(ctx) {  // 查询用户列表(分页)
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
  }
  async findById(ctx) {  // 根据id查询特定用户
    const { fields } = ctx.query;
    const selectFields =  // 查询条件
      fields &&
      fields
        .split(";")
        .filter(f => f)
        .map(f => " +" + f)
        .join("");
    const populateStr =  // 展示字段
      fields &&
      fields
        .split(";")
        .filter(f => f)
        .map(f => {
          if (f === "employments") {
            return "employments.company employments.job";
          }
          if (f === "educations") {
            return "educations.school educations.major";
          }
          return f;
        })
        .join(" ");
    const user = await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async create(ctx) {  // 创建用户
    ctx.verifyParams({  // 入参格式校验
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) {  // 校验用户名是否已存在
      ctx.throw(409, "用户名已存在");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async checkOwner(ctx, next) {  // 判断用户身份合法性
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }
  async update(ctx) {  // 更新用户信息
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.body = user;
  }
  async delete(ctx) {  // 删除用户
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.status = 204;
  }
  async login(ctx) {  // 登录
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或密码不正确");
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: "1d" });  // 登录成功返回jwt加密后的token信息
    ctx.body = { token };
  }
  async checkUserExist(ctx, next) {  // 查询用户是否存在
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    await next();
  }

}

module.exports = new UserController();
```





# egg

### egg 支持 Typescript 吗？

虽然 egg 本身是用 JavaScript 写的，但是 egg 应用可以采用 Typescript 来写，使用下面的命令创建项目即可（参考[链接](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F35334932)）：

```sh
$ npx egg-init --type=ts showcase
```



### 用 JavaScript 写 egg 会有智能提示吗？

会的，只要在 package.json 中添加下面的声明之后，会在项目根目录下动态生成 typings 目录，里面包含各种模型的类型声明（参考[链接](https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Fegg%2Fnodejs%2Fgkk3r9)）：

```json
"egg": {
  "declarations": true
}
```





# 中间件---洋葱模型

### 介绍

中间件用来简化和隔离基础设施与业务逻辑之间的细节，让开发者能够关注在业务的开发上。每一层中间件，用来处理特定的功能，比如错误处理、`Session` 处理等等。

主要用于修改请求或响应的，所以它的上下文也就是请求对象和响应对象：req和res。

由于Node异步的原因，我们需要提供一种机制，在当前中间件处理完成后，通知下一个中间件执行。中间件被 `next()` 方法分成了两部分。`next()` 方法上面部分会先执行，下面部分会在后续中间件执行全部结束之后再执行（即出来的时候再执行）。

**每一个中间件都有两次处理时机**。

![](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-hiO5ub.webp)





### 中间件的性能

为了让业务逻辑提早执行，尽早响应给终端用户，中间件的编写和使用是需要一番考究的。下面是两个主要的能提升的点。



#### 编写高效的中间件

编写高效的中间件其实就是提升单个处理单元的处理速度，以尽早调用next()执行后续逻辑。需要知道的事情是，一旦中间件被匹配，那么每个请求都会使该中间件执行一次，哪怕它只浪费1毫秒的执行时间，都会让我们的QPS显著下降。常见的优化方法有几种。

❑ 缓存需要重复计算的结果（需要控制缓存用量，避免内存占用过多）。

❑ 避免不必要的计算。比如HTTP报文体的解析，对于GET方法完全不需要。



#### 避免不必要的中间件执行

全局都要用的才注册到全局上，单个用到的就只注册到单个上。







# nestjs

## 与请求处理库的区别

Express 只是一个处理请求的库，并没有提供组织代码的架构能力，代码可能写成各种样子。

Nest 提供了 IOC、AOP 等架构特性，规定了代码组织的形式，而且对 websocket、graphql、orm 等各种方案都提供了开箱即用的支持。

 Nest 就是 node 生态里的 Spring。



## 通用规范对象名

后端系统中，会有很多对象：

- Controller 对象：接收 http 请求，调用 Service，返回响应
- Service 对象：实现业务逻辑
- Repository 对象：实现对数据库的增删改查
- 数据库链接对象 DataSource，配置对象 Config 等等。



dto 是 data transfer object，用于参数的接收。

vo 是 view object，用于返回给视图的数据的封装。

而 entity 是和数据库表对应的实体类。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-06-19-49-image-20240206194932589.png" alt="image-20240206194932589" style="zoom:50%;" />





## 开发知识

### IOC

#### 介绍

nest 实现了IOC，它有一个放对象的容器，程序初始化的时候会扫描 class 上声明的依赖关系，分析 Module 之间的引用关系，然后把这些 class 都给 new 一个实例放到容器里。创建对象的时候，还会把它们依赖的对象注入进去。这样就完成了自动的对象创建和组装。





#### providers

##### 注入class: useClass

AppService 是被 @Injectable 修饰的 class：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-P0gILt.webp)

在 Module 的 providers 里声明完整的写法是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-swll2s.webp)

通过 provide 指定 token，通过 useClass 指定对象的类，Nest 会自动对它做实例化后用来注入。

在 AppController 的构造器里参数里声明了 AppService 的依赖，就会自动注入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-pZw0fR.webp)

如果不想用构造器注入，也可以属性注入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-QqDNuC.webp)



这个 token 也可以是字符串：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-VJo8ue.webp)



如果 token 是字符串的话，注入的时候就要用 @Inject 手动指定注入对象的 token 了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-7vvNc8.webp)





##### 注入值

###### 注入静态值 useValue

除了指定 class 外，还可以直接指定一个值，让 IoC 容器来注入。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-ARyjXi.webp)



使用 provide 指定 token，使用 useValue 指定值。

然后在对象里注入它：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-e0PFAo.webp)





###### 注入动态值 useFactory

provider 的值可能是动态产生的，Nest 也同样支持：

```javascript
{
    provide: 'person2',
    useFactory() {
        return {
            name: 'bbb',
            desc: 'cccc'
        }
    }
}
```

我们可以使用 useFactory 来动态创建一个对象。

在对象里注入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-GfhMxv.webp)





这个 useFactory 支持通过参数注入别的 provider：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-8XQlUP.webp)



通过 inject 声明了两个 token，一个是字符串 token 的 person，一个是 class token 的 AppService。

也就是注入这两个 provider：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Qs3TF6.webp)



<mark>useFactory 支持异步</mark>：

```javascript
{
  provide: 'person5',
  async useFactory() {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    return {
      name: 'bbb',
      desc: 'cccc'
    }
  },
},
```

Nest 会等拿到异步方法的结果之后再注入。



##### useExisting 指定别名

此外，provider 还可以通过 useExisting 来指定别名：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-nh75dE.webp)

这里就是给 person2 的 token 的 provider 起个新的 token 叫做 person4。



##### 避免providers之间循环依赖

这时候 nest start --watch 会报错：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-37-Vfl6gg.webp)

说是没法解析 DddService 的依赖，也是因为循环依赖导致的。

这时候也是通过 forwardRef 解决：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Kc3ujL.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-iutquf.webp)

这时候就不能用默认的注入方式了，通过 @Inject 手动指定注入的 token，这里是 forwardRef 的方式注入。





#### 原理

##### 简述

nest 的核心实现原理：**通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。**

Nest 的装饰器的实现原理就是 Reflect.getMetadata、Reflect.defineMetadata 这些 api。通过在 class、method 上添加 metadata，然后扫描到它的时候取出 metadata 来做相应的处理来完成各种功能。

Nest 的 Controller、Module、Service 等等所有的装饰器都是通过 Reflect.meatdata 给类或对象添加元数据的，然后初始化的时候取出来做依赖的扫描，实例化后放到 IOC 容器里。

实例化对象还需要构造器参数的类型，这个开启 ts 的 emitDecoratorMetadata 的编译选项之后， ts 就会自动添加一些元数据，也就是 design:type、design:paramtypes、design:returntype 这三个，分别代表被装饰的目标的类型、参数的类型、返回值的类型。

当然，reflect metadata 的 api 还在草案阶段，需要引入 reflect metadata 的包做 polyfill。



##### reflect metadata

###### 介绍

只是通过装饰器声明了一下，然后启动 Nest 应用，这时候对象就给创建好了，依赖也给注入了。那它是怎么实现的呢？用的是Reflect 的 metadata 的 api。这个api 还没有进入Web标准，还在草案阶段，也就是 [metadata 的 api](https://link.juejin.cn/?target=https%3A%2F%2Frbuckton.github.io%2Freflect-metadata%2F)：

```typescript
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);
```

Reflect.defineMetadata 和 Reflect.getMetadata 分别用于设置和获取某个类的元数据，如果最后传入了属性名，还可以单独为某个属性设置元数据。

那元数据存在哪呢？

存在类或者对象上呀，如果给类或者类的静态属性添加元数据，那就保存在类上，如果给实例属性添加元数据，那就保存在对象上，用类似 [[metadata]] 的 key 来存的。



看下 nest 的源码：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Hik6yB.webp)

上面就是 @Module 装饰器的实现，里面就调用了 Reflect.defineMetadata 来给这个类添加了一些元数据。

所以我们这样用的时候：

```python
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

其实就是给 CatsModule 添加了 controllers 的元数据和 providers 的元数据。

后面创建 IOC 容器的时候就会取出这些元数据来处理：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-PDwSNl.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-XW8v7r.webp)

而且 @Controller 和 @Injectable 的装饰器也是这样实现的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-a7x65X.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-w5lgoZ.webp)

Nest 的实现原理就是通过装饰器给 class 或者对象添加元数据，然后初始化的时候取出这些元数据，进行依赖的分析，然后创建对应的实例对象就可以了。

所以说，nest 实现的核心就是 Reflect metadata 的 api。

当然，现在 metadata 的 api 还在草案阶段，需要使用 reflect-metadata 这个 polyfill 包才行。



###### 创建的对象需要知道构造器的参数，但现在并没有添加这部分 metadata 数据为什么也行？



比如这个 CatsController 依赖了 CatsService，但是并没有添加 metadata 呀：

```typescript
typescript
复制代码import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

这就不得不提到 TypeScript 的优势了，TypeScript 支持编译时自动添加一些 metadata 数据：

比如这段代码：

```typescript
typescript
复制代码import "reflect-metadata";
 
class Guang {
  @Reflect.metadata("名字", "光光")
  public say(a: number): string {
    return '加油鸭';
  }
}
```

按理说我们只添加了一个元数据，生成的代码也确实是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Sqzps6.webp)

但是呢，ts 有一个编译选项叫做 emitDecoratorMetadata，开启它就会自动添加一些元数据。

开启之后再试一下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Tvfqwv.webp)

你会看到多了三个元数据：

design:type 是 Function，很明显，这个是描述装饰目标的元数据，这里装饰的是函数

design:paramtypes 是 [Number]，很容易理解，就是参数的类型

design:returntype 是 String，也很容易理解，就是返回值的类型

所以说，只要开启了这个编译选项，ts 生成的代码会自动添加一些元数据。

然后创建对象的时候就可以通过 design:paramtypes 来拿到构造器参数的类型了。

nest 源码里你会看到这样的代码：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-rBTjM1.webp)

就是获取构造器的参数类型的。这个常量就是我们上面说的那个：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-UXtR0Z.webp)

这也是为什么 nest 会用 ts 来写，因为它很依赖这个 emitDecoratorMetadata 的编译选项。

你用 cli 生成的代码模版里也都默认开启了这个编译选项：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-FupccI.webp)

### 模块机制

#### 创建模块

可以把不同业务的 controller、service 等放到不同模块里。

```sh
nest g module other # 用 nest cli 的 generate 命令生成一个模块。
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-DeyPvt.webp)

会生成如下代码：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-0PlK8F.webp)

会在 AppModule 里自动 imports 这个模块：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-M77MjM.webp)



#### Imports&exports

<mark>当 import 别的模块后，那个模块 exports 的 provider 就可以在当前模块注入了。</mark>

比如我们再生成 OtherService：

```sh
nest g service other
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-PcJyW2.webp)

会生成 Service 的代码：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-iMMdFR.webp)

并自动添加到 OtherModule 的 providers 中：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-wIWWz6.webp)

我们改下 OtherService，添加一个方法：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-aTGWa7.webp)

然后在 OtherModule 里 exports：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-wtrANq.webp)

那当 AppModule 引用了 OtherModule 之后，就可以注入它 exports 的 OtherService 了。

我们在 AppService 里注入下：

```javascript
import { OtherService } from './other/other.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  @Inject(OtherService) 
  private otherService:OtherService;

  getHello(): string {
    return 'Hello World!' + this.otherService.xxx();
  }
}
```







#### 全局模块

`@Global()`

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-NRx52U.webp)

在 AaaModule 上加一个 @Global 的装饰器，这样不用imports也能直接使用了。不过全局模块还是尽量少用，不然注入的很多 provider 都不知道来源，会降低代码的可维护性。



#### 避免循环依赖

报这样的错误：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-SybGOj.webp)

意思是在解析 BbbModule 的时候，它的第一个 imports 是 undefined。

这有两个原因，一个是这个值本来就是 undefined，第二个就是形成了循环依赖。

因为 Nest 创建 Module 的时候会递归创建它的依赖，而它的依赖又依赖了这个 Module，所以没法创建成功，拿到的就是 undefined。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-z5S7qU.webp)

那怎么办呢？

其实我们可以先单独创建这两个 Module，然后再让两者关联起来。

也就是用 forwardRef 的方式：单独创建两个 Module，之后再把 Module 的引用转发过去

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Nw1Oav.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-l7W3hA.webp)







#### 动态模块

##### 方法一

###### 介绍

希望 import 的时候给这个模块传一些参数，动态生成模块的内容，怎么办呢？

这时候就需要 Dynamic Module 了：

```javascript
import { DynamicModule, Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';

@Module({})
export class BbbModule {

  static register(options: Record<string, any>): DynamicModule {
    return {
      module: BbbModule,
      controllers: [BbbController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        BbbService,
      ],
      exports: []
    };
  }
}
```

我们给 BbbModule 加一个 register 的静态方法，返回模块定义的对象。

而且我们还可以把参数传入的 options 对象作为一个新的 provider。

import 的时候就得这样用了，通过 register 方法传入参数，返回值就是模块定义：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-UWBGLf.webp)

这时候我们把传入的 options 通过 useValue 创建了个 provider，这样模块内部就可以注入它了。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-3Suse9.webp)

改一下 register 的参数：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-jlZHWM.webp)

浏览器再访问下，可以看到控制台打印了 config 对象：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-zjMRaQ.webp)



这里的 register 方法其实叫啥都行，但 nest 约定了 3 种方法名：

- register
- forRoot
- forFeature

我们约定它们分别用来做不同的事情：

- register：用一次模块传一次配置，比如这次调用是 BbbModule.register({aaa:1})，下一次就是 BbbModule.register({aaa:2}) 了
- forRoot：配置一次模块用多次，比如 XxxModule.forRoot({}) 一次，之后就一直用这个 Module，一般在 AppModule 里 import
- forFeature：用了 forRoot 固定了整体模块，用于局部的时候，可能需要再传一些配置，比如用 forRoot 指定了数据库链接信息，再用 forFeature 指定某个模块访问哪个数据库和表。

并且这些方法都可以写 xxxAsync 版本，也就是传入 useFactory 等 option，内部注册异步 provider。



###### 比如 @nestjs/typeorm 的动态模块：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Zt1uTr.webp)

forRoot 传入配置，动态产生 provider 和 exports，返回模块定义。

而且还有 forRootAsync：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-oskBY0.webp)

区别就是可以用 async 的 useFactory 动态产生 provider，比如异步请求别的服务拿到配置返回，作为 options。

forFeature 则是传入局部的一些配置，来动态产生局部用的模块：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-8Zxs5v.webp)

typeorm 的模块用起来是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-DOKJgA.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-2k3NQc.webp)

在 AppModule 里 import 通过 forRoot 动态产生的模块，在具体的业务 Module 里，通过 forFeature 传入具体实体类的配置。

其实 forRoot、forFeature、register 有区别么？

本质上没区别，只是我们约定了它们使用上的一些区别。



##### 方法二(不常用)

此外，Nest 还提供了另一种方式来创建动态模块：

我们再生成一个新模块：

```arduino
arduino
复制代码nest g module ccc
```

然后生成个 controller：

```css
css
复制代码nest g controller ccc --no-spec
```

这次我们不手动写 register、registerAsync 等方法了，用 builder 来生成。

新建一个 ccc.module-definition.ts 文件：

```javascript
javascript
复制代码import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CccModuleOptions {
    aaa: number;
    bbb: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CccModuleOptions>().build();
```

用 ConfigurableModuleBuilder 生成一个 class，这个 class 里就带了 register、registerAsync 方法。

返回的 ConfigurableModuleClass、MODULE_OPTIONS_TOKEN 分别是生成的 class 、options 对象的 token。

然后 Module 继承它：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-2TwSOp.webp)

这样这个 CccModule 就已经有了 register 和 registerAsync 方法了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-LvROWE.webp)

不用自己定义了，省事了不少。

传入 options：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-4L4hiP.webp)

那现在如何在 Module 内注入这个 options 呢？

记得 build class 的时候返回了一个 token 么？

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-ZR11nJ.webp)

就用这个注入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Qm17lO.webp)

```javascript
javascript
复制代码import { Controller, Get, Inject } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN, CccModuleOptions } from './ccc.module-definition';

@Controller('ccc')
export class CccController {

    @Inject(MODULE_OPTIONS_TOKEN)
    private options: CccModuleOptions;

    @Get('')
    hello() {
        return this.options;
    }
}
```

浏览器访问下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-WktfYX.webp)

可以看到拿到了 options 对象。

当然，options 对象不是这么用的，一般是用来做配置，内部的 provider 基于它来做一些设置，这里只是演示。

你还可以用 registerAsync 方法，用 useFactory 动态创建 options 对象：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-hD8vZZ.webp)

前面我们不是说还可以用 forRoot、forFeature 这样的方法么？

那用 builder 的方式如何生成这样的 class 呢？

调用 setClassMethodName 设置下就好了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Ffue9g.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Lqu6DT.webp)

如果我还想根据传入的参数决定是否设置为全局模块呢？

那就要这样写了：

```javascript
javascript
复制代码import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface CccModuleOptions {
    aaa: number;
    bbb: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CccModuleOptions>().setClassMethodName('register').setExtras({
    isGlobal: true
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  })).build();
```

setExtras 第一个参数是给 options 扩展啥 extras 属性，第二个参数是收到 extras 属性之后如何修改模块定义。

我们定义了 isGlobal 的 option，收到它之后给模块定义加上个 global。

这时候你就会发现 register 的 options 多了 isGlobal：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-T54iys.webp)

这样创建的就是全局的模块。

不过这样还有个问题：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-7bqfM4.webp)

options 那里多了 isGlobal 属性，但是类型定义这里还没有呀。

因为我们用的是这个类型：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-50xmMl.webp)

最好是用 builder 返回的类型：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-vk5ZVW.webp)

这样就有了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-gvn1RS.webp)

而这个 ASYNC_OPTIONS_TYPE 是 async 方式创建模块的 otpion 类型：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-5dXiW5.webp)

回过头来看一下这个 ConfigurableModuleBuilder，它只是对我们定义 register、registerAsync 的过程做了封装，传参数就可以生成对应的 class，简便了不少。





### 生命周期

#### 启动时

Nest 在启动的时候，会递归解析 Module 依赖，扫描其中的 provider、controller，注入它的依赖。全部解析完后，会监听网络端口，开始处理请求。

这个过程中，Nest 暴露了一些生命周期方法：

首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。

全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法

然后监听网络端口。之后 Nest 应用就正常运行了。





#### 结束时

先调用每个模块的 controller、provider 的 onModuleDestroy 方法，然后调用 Module 的 onModuleDestroy 方法。

之后再调用每个模块的 controller、provider 的 beforeApplicationShutdown 方法，然后调用 Module 的 beforeApplicationShutdown 方法。

然后停止监听网络端口。

之后调用每个模块的 controller、provider 的 onApplicationShutdown 方法，然后调用 Module 的 onApplicationShutdown 方法。

之后停止进程。



### 面向切面编程(AOP)的方式

Nest 实现 AOP 的方式一共有五种，包括 Middleware、Guard、Pipe、Interceptor、ExceptionFilter。

#### 中间件 Middleware

Nest 并不是直接依赖于 Express，可以切换到别的 http 请求处理库，那 Nest 的特性肯定也不直接是 Express 里的。



##### 使用

如果不需要注入依赖，那可以写函数形式的 middleware，这时候和 Express 的 middleware 就没啥区别了。

如果需要注入依赖，那就写 class 形式的 middleware，可以用 Nest 的依赖注入能力。



```css
nest g middleware aaa --no-spec --flat
```

创建个 middleware：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Dd9nWI.webp)

因为这时候并不知道你用的 express 还是 fastify，所以 request、response 是 any，手动标注下类型就好了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-kKbWff.webp)

这里是 express 的 request、response。

加一下前后的的逻辑：

```javascript
javascript
复制代码import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AaaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('brefore');
    next();
    console.log('after');
  }
}
```

然后在 Module 里这样使用：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Nx1qsd.webp)

实现 NestModule 接口的 configure 方法，在里面应用 AaaMiddleware 到所有路由。

然后跑起来试一下：

```sql
sql
复制代码nest start --watch
```

浏览器访问 [http://localhost:3000](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-Dk0qsb.webp)

可以看到中间件的逻辑都执行了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-65U8Fp.webp)

这里也可以指定更精确的路由。

我们添加几个 handler：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-L024Iy.webp)

然后重新指定 Middleware 应用的路由：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-e6Uv5y.webp)

可以看到，hello、hello2、world2 的路由都调用了这个中间件，而 world1 没有：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-BQXrSC.webp)

这就是 Nest 里 middleware 的用法。

如果只是这样，那和 Express 的 middleware 差别并不大，无非是变成了 class 的方式。

Nest 为什么要把 Middleware 做成 class 呢？

当然是为了依赖注入了！

我们通过 @Inject 注入 AppService 到 middleware 里：

```javascript
javascript
复制代码import { AppService } from './app.service';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AaaMiddleware implements NestMiddleware {
  @Inject(AppService)
  private readonly appService: AppService;

  use(req: Request, res: Response, next: () => void) {
    console.log('brefore');
    console.log('-------' + this.appService.getHello());
    next();
    console.log('after');
  }
}
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-4nxPHz.webp)

当然，这里也可以用构造器注入，这样更简洁一点：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-975b4U.webp)

这时在访问这个路由的时候，就可以看到中间件成功调用了 AppService：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-4cH4AY.webp)

这就是 Nest 注入的依赖。







##### 全局中间件

全局中间件就是这样，在 main.ts 里通过 app.use 使用：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-s2EIjW.webp)



##### 路由中间件

用 nest cli 创建一个路由中间件：



![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-13yCfZ.webp)

--no-spec 是不生成测试文件，--flat 是平铺，不生成目录。

生成的代码是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-B7tnhr.webp)



然后在 AppModule 里启用：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-7JppXl.webp)







#### Guard



Guard 是路由守卫的意思，可以用于在调用某个 Controller 之前判断权限，返回 true 或者 false 来决定是否放行：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-02-20-23-image-20240202202354816.png" alt="image-20240202202354816" style="zoom:33%;" />

我们创建个 Guard：

```css
nest g guard login --no-spec --flat
```



生成的 Guard 代码是这样的：

```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('login check') //我们加个打印语句，然后返回 false
    return false;
  }
}
```



Guard 要实现 CanActivate 接口，实现 canActivate 方法，可以从 context 拿到请求的信息，然后做一些权限验证等处理之后返回 true 或者 false。



##### 部分Guard

在 AppController 里启用：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-SfiJjM.webp)



aaa 没有权限，返回了 403。

Controller 本身不需要做啥修改，却透明的加上了权限判断的逻辑，这就是 AOP 架构的好处。



##### 全局Guard

###### 写法一

这种方式是手动 new 的 Guard 实例，不在 IoC 容器里

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-bMbN89.webp)



这样每个路由都会应用这个 Guard：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-RKul5V.webp)



###### 写法二

用 provider 的方式声明的 Guard 是在 IoC 容器里的，可以注入别的 provider，需要注入别的 provider 的时候，就要用第二种全局 Guard 的声明方式。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-zshzbH.webp)



我们注入下 AppService 试试：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-dfnLrk.webp)





#### Interceptor

Interceptor 可以在目标 Controller 方法前后加入一些逻辑：

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-02-20-30-image-20240202203046095.png" alt="image-20240202203046095" style="zoom:33%;" />

创建个 interceptor：

```css
nest g interceptor time --no-spec --flat
```



生成的 interceptor 是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-38-3F7Y1I.webp)

Interceptor 要实现 NestInterceptor 接口，实现 intercept 方法，调用 next.handle() 就会调用目标 Controller，可以在之前和之后加入一些处理逻辑。

Controller 之前之后的处理逻辑可能是异步的。Nest 里通过 rxjs 来组织它们，所以可以使用 rxjs 的各种 operator。

```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log('time: ', Date.now() - startTime)
      })
    );
  }
}
```



启用这个 interceptor：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-lgEust.webp)



 Interceptor 和 Middleware 主要在于参数的不同。

interceptor 可以拿到调用的 controller 和 handler：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-QA0DHQ.webp)



Interceptor 支持每个路由单独启用，只作用于某个 handler：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-LJOTio.webp)

也可以在 controller 级别启动，作用于下面的全部 handler：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-s1O8Xy.webp)

也同样支持全局启用，作用于全部 controller：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-I3qOlS.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-lZzXF9.webp)

两种全局启用方式的区别和 guard 的一样。



#### Pipe

##### 介绍

Pipe 用来对参数做一些检验和转换，在参数传给 handler 之前对参数做一些验证和转换的 class。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-9FKsR7.webp)



##### 原理

对应的源码如下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-K1ApD2.webp)

对每个参数都会应用 pipe：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-wiWyhu.webp)



##### 使用

用 nest cli 创建个 pipe：

```css
nest g pipe validate --no-spec --flat
```



生成的代码是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-3mHnU6.webp)

Pipe 要实现 PipeTransform 接口，实现 transform 方法，里面可以对传入的参数值 value 做参数验证，比如格式、类型是否正确，不正确就抛出异常。也可以做转换，返回转换后的值。

我们实现下：

```javascript
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if(Number.isNaN(parseInt(value))) {
      throw new BadRequestException(`参数${metadata.data}错误`)
    }

    return typeof value === 'number' ? value * 10 : parseInt(value) * 10;
  }
}
```

这里的 value 就是传入的参数，如果不能转成数字，就返回参数错误，否则乘 10 再传入 handler：

在 AppController 添加一个 handler，然后应用这个 pipe：



```javascript
@Get('ccc')
ccc(@Query('num', ValidatePipe) num: number) {
    return num + 1;
}
```



同样，Pipe 可以只对某个参数生效，或者整个 Controller 都生效：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-MSLNwj.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-AdNjCO.webp)

或者全局生效：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-OsFdKZ.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-tDc3UH.webp)





##### 内置的一些 Pipe

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe
- ParseEnumPipe
- ParseFloatPipe
- ParseFilePipe

ParseIntPipe 的源码是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-ahBVhb.webp)



##### 自定义pipe

自己写一个 pipe 也很简单，就是实现 PipeTransform 接口的 transform 方法，它的返回值就是传给 handler 的值。

在 pipe 里可以拿到装饰器和 handler 参数的各种信息，基于这些来实现校验和转换就是很简单的事情了。





#### ExceptionFilter

不管是 Pipe、Guard、Interceptor 还是最终调用的 Controller，过程中都可以抛出一些异常，如何对某种异常做出某种响应呢？

这种异常到响应的映射也是一种通用逻辑，Nest 提供了 ExceptionFilter 来支持：

ExceptionFilter 可以对抛出的异常做处理，返回对应的响应：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-IzDyWV.webp)

其实我们刚刚在 pipe 里抛的这个错误，能够返回 400 的响应，就是 Exception Filter 做的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-kHQKKo.webp)



创建一个 filter：

```css
nest g filter test --no-spec --flat
```



改一下生成的代码：

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class TestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {

    const response: Response = host.switchToHttp().getResponse();

    response.status(400).json({
      statusCode: 400,
      message: 'test: ' + exception.message
    })
  }
}
```

实现 ExceptionFilter 接口，实现 catch 方法，就可以拦截异常了。

拦截什么异常用 @Catch 装饰器来声明，然后在 catch 方法返回对应的响应，给用户更友好的提示。

用一下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-JfmAhq.webp)

再次访问，异常返回的响应就变了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-KIjaEK.webp) Nest 内置了很多 http 相关的异常，都是 HttpException 的子类：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

当然，也可以自己扩展：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-bBgSxH.webp)

**Nest 通过这样的方式实现了异常到响应的对应关系，代码里只要抛出不同的异常，就会返回对应的响应，很方便。**

同样，ExceptionFilter 也可以选择全局生效或者某个路由生效：

某个 handler： ![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-nMCA5G.webp)

某个 controller：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-n7zoTd.webp)

全局： ![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-DyqTUe.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-zsEn6m.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-QGkYrD.webp) 







#### 几种 AOP 机制的顺序

![image-20240202204215919](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-02-20-42-image-20240202204215919.png)

对应的源码是这样的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-Lpop9V.webp)

很明显，进入这个路由的时候，会先调用 Guard，判断是否有权限等，如果没有权限，这里就抛异常了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-nsBkb6.webp)

抛出的 ForbiddenException 会被 ExceptionFilter 处理，返回 403 状态码。

如果有权限，就会调用到拦截器，拦截器组织了一个链条，一个个的调用，最后会调用的 controller 的方法：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-YIzpsV.webp)

调用 controller 方法之前，会使用 pipe 对参数做处理：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-UEQipj.webp)

会对每个参数做转换：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-voTiOQ.webp)

ExceptionFilter 的调用时机很容易想到，就是在响应之前对异常做一次处理。

而 Middleware 是 express 中的概念，Nest 只是继承了下，那个是在最外层被调用。





#### 几种AOP机制的区别

middleware 和 interceptor 功能类似，但也有不同，interceptor 可以拿到目标 class、handler 等，也可以调用 rxjs 的 operator 来处理响应，更适合处理具体的业务逻辑。

middleware 更适合处理通用的逻辑。





#### `@SetMetadata`:与Guard和Interceptor通信

Nest 还提供了 @SetMetadata 的装饰器，可以在 controller 的 class 和 method 上添加 metadata，然后在 interceptor 和 guard 里通过 reflector 的 api 取出来。

handler 和 class 可以通过 @SetMetadata 指定 metadata：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-kcFwOd.webp)

然后在 guard 或者 interceptor 里取出来：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-DctODp.webp)



#### 切换上下文

##### 介绍

Nest 支持创建 HTTP 服务、WebSocket 服务，还有基于 TCP 通信的微服务。

这些不同类型的服务都需要 Guard、Interceptor、Exception Filter 功能。

那么问题来了：

不同类型的服务它能拿到的参数是不同的，比如 http 服务可以拿到 request、response 对象，而 ws 服务就没有，如何让 Guard、Interceptor、Exception Filter 跨多种上下文复用呢？

Nest 的解决方法是 ArgumentHost 和 ExecutionContext 类（**ArgumentHost 是用于切换 http、ws、rpc 等上下文类型的，可以根据上下文类型取到对应的 argument**）。





为了让 Filter、Guard、Exception Filter 支持 http、ws、rpc 等场景下复用，Nest 设计了 ArgumentHost 和 ExecutionContext 类。

ArgumentHost 可以通过 getArgs 或者 getArgByIndex 拿到上下文参数，比如 request、response、next 等。

更推荐的方式是根据 getType 的结果分别 switchToHttp、switchToWs、swtichToRpc，然后再取对应的 argument。

而 ExecutionContext 还提供 getClass、getHandler 方法，可以结合 reflector 来取出其中的 metadata。

在写 Filter、Guard、Exception Filter 的时候，是需要用到这些 api 的。



##### filter

比如这样：

```javascript
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AaaException } from './AaaException';

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    if(host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response
        .status(500)
        .json({
          aaa: exception.aaa,
          bbb: exception.bbb
        });
    } else if(host.getType() === 'ws') {

    } else if(host.getType() === 'rpc') {

    }
  }
}
```



##### guard 和 interceptor

可以看到它传入的是 ExecutionContext：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-m0ahh3.webp)

ExecutionContext 是 ArgumentHost 的子类，扩展了 getClass、getHandler 方法。



这俩分别是要调用的 controller 的 class 以及要调用的方法。

为什么 ExecutionContext 里需要多出这俩方法呢？

因为 Guard、Interceptor 的逻辑可能要根据目标 class、handler 有没有某些装饰而决定怎么处理。

比如权限验证的时候，我们会先定义几个角色：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-UWRNPT.webp)

然后定义这样一个装饰器：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-F7ALDE.webp)

它的作用是往修饰的目标上添加 roles 的 metadata。

然后在 handler 上添加这个装饰器，参数为 admin，也就是给这个 handler 添加了一个 roles 为 admin 的metadata。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-cFwBUp.webp)

这样在 Guard 里就可以根据这个 metadata 决定是否放行了：

```javascript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role';

@Injectable()
export class AaaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user && user.roles?.includes(role));
  }
}
```



这里我需要 Nest 注入 reflector，但并不需要在模块的 provider 声明。

guard、interceptor、middleware、pipe、filter 都是 Nest 的特殊 class，当你通过 @UseXxx 使用它们的时候，Nest 就会扫描到它们，创建对象它们的对象加到容器里，就已经可以注入依赖了。















### 其它装饰器



`@Optional`：注入的依赖如果没有的话，创建对象时会报错。但如果它是可选的，你可以用 `@Optional` 声明一下，这样没有对应的 provider 也能正常创建这个对象。



#### 创建一个装饰器

```sh
nest g decorator aaa --flat
```



#### 自定义装饰器

方法的装饰器就是传入参数，调用下别的装饰器就好了，比如对 @SetMetadata 的封装。

如果组合多个方法装饰器，可以使用 applyDecorators api。

class 装饰器和方法装饰器一样。

还可以通过 createParamDecorator 来创建参数装饰器，它能拿到 ExecutionContext，进而拿到 reqeust、response，可以实现很多内置装饰器的功能，比如 @Query、@Headers 等装饰器。



#### http相关

##### 请求信息

###### `@Headers `

通过 @Headers 装饰器取某个请求头 或者全部请求头：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-SeOMUN.webp)



###### `@Ip`

通过 @Ip 拿到请求的 ip：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-PxZyoi.webp)





###### `@HostParam`

host 里的参数就可以通过 @HostParam 取出来：

```javascript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello(@HostParam('host') host) {
        return host;
    }
}
```





###### `@req`&`@request`

直接注入 request 对象：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-P46TQ7.webp)

通过 @Req 或者 @Request 装饰器，这俩是同一个东西：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-jHsYBk.webp)



##### 请求方法

除了 @Get、@Post 外，还可以用 @Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求：



##### 操作

###### `@Session`

通过 @Session 拿到 session 对象：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-mzDLMG.webp)

但要使用 session 需要安装一个 express 中间件：

```sh
npm install express-session
```

在 main.ts 里引入并启用：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-U1oWdB.webp)

指定加密的密钥和 cookie 的存活时间。



然后刷新页面：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-soxeXD.webp)

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-Yo4gck.webp)

这样就可以在 session 对象里存储信息了。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-73PFJF.webp)









##### 响应

###### `@Res`&`@Response`

也可以 @Res 或者 @Response 注入 response 对象，只不过 response 对象有点特殊：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-kTQLwc.webp)

当你注入 response 对象之后，服务器会一直没有响应：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-Y1kRxC.webp)

因为这时候 Nest 就不会再把 handler 返回值作为响应内容了。

你可以自己返回响应：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-8GNxsz.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-0XvcWO.webp)

Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。

如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-OF42Pm.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-sNUWyS.webp)





###### `@Next`

除了注入 @Res 不会返回响应外，注入 @Next 也不会：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-LuX19I.webp)

当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-ASdeQT.webp)

Nest 不会处理注入 @Next 的 handler 的返回值。





###### `@HttpCode`

handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-8QESnR.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-91uTxN.webp)



###### `@Header`

当然，你也可以修改 response header，通过 @Header 装饰器：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-OUny5Y.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-Of2OY9.webp)





###### `@Redirect`

通过 @Redirect 装饰器来指定路由重定向的 url：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-LNEroj.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-T2CNlv.webp)

或者在返回值的地方设置 url：

```javascript
@Get('xxx')
@Redirect()
async jump() {
    return {
      url: 'https://www.baidu.com',
      statusCode: 302
    }  
}
```



###### 指定渲染引擎

响应内容指定渲染引擎，不过这需要先这样设置：

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**核心这段代码：分别指定静态资源的路径和模版的路径，并指定模版引擎为 handlerbars。*/
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```



需要安装模版引擎的包 hbs：

```sh
npm install --save hbs
```

然后准备图片和模版文件：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-KVDFVC.webp)

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-g1qzeL.webp)

在 handler 里指定模版和数据：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-kv0eZW.webp)

就可以看到渲染出的 html 了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-16sYVt.webp)





### 切换请求库

#### 介绍

Nest 也没有和 Express 强耦合，它做了一层抽象：

定义了 [HttpServer 的 interface](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnestjs%2Fnest%2Fblob%2Fd352e6f138bc70ff33cccf830053946d17272b82%2Fpackages%2Fcommon%2Finterfaces%2Fhttp%2Fhttp-server.interface.ts%23L21C1-L85)。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-04-15-46-image-20240204154631810.png" alt="image-20240204154631810" style="zoom:50%;" />

这俩适配器分别在 @nestjs/platform-express 和 @nestjs/platform-fastify 的包里：



#### 操作

切换到 fastify 试试看：

安装 fastify 和 @nestjs/platform-fastify：

```bash
npm install fastify @nestjs/platform-fastify
```

然后修改下 Nest 创建的方式：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-9Ronuz.webp)

改成这样：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-YrKbDg.webp)





还可以再传一个类型参数：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-uOJpbg.webp)

这样返回的 app 就会提示 fastify 平台特有的方法了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-AM6wER.webp)

这也是为什么之前我们要传入 NestExpressApplication 才有 useStaticAssets 方法：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-B8dx4o.webp)

然后在 controller 里可以注入 fastify 的 reqeust 和 reply 对象：

```javascript
javascript
复制代码import { Controller, Get, Request, Response } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() request: FastifyRequest, @Response() reply: FastifyReply) {
    reply.header('url', request.url)
    reply.send('hello')
  }
}
```

我们注入了 fastify 的 request 和 reply 对象，然后用它来设置 header 发送响应：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-uQWG1f.webp)



### 定时任务

学习了定时任务，用到 @nestjs/scheduler 这个包。

主要有 cron、timeout、interval 这 3 种任务。

其中 cron 是依赖 cron 包实现的，而后两种则是对原生 api 的封装。

我们学习了 cron 表达式，还是挺复杂的，当然，你也可以直接用 CronExpression 的一些常量。

此外，你还可以注入 SchedulerRegistery 来对定时任务做增删改查。

定时任务里可以注入 service，来定时执行一些逻辑，在特定业务场景下是很有用的。





### repl模式

能不能像 node 的 repl 那样，直接在控制台测试呢？

repl 是 read-eval-paint-loop

https://juejin.cn/book/7226988578700525605/section/7236158090448470077



### 代码复用Library

https://juejin.cn/book/7226988578700525605/section/7236158043338047546



### 微服务架构

#### 创建微服务

https://juejin.cn/book/7226988578700525605/section/7236156501499330618



#### etcd做注册和配置中心

https://juejin.cn/book/7226988578700525605/section/7279427084621987875





## 接入工程

### 日志

接入 winstom： https://juejin.cn/book/7226988578700525605/section/7283507588007165952



### 生成项目文档

compodoc

https://juejin.cn/book/7226988578700525605/section/7284441423842443316



### 发邮件

https://juejin.cn/book/7226988578700525605/section/7247327089496424505



### 动态读取不同环境的配置

提供了现成的封装：@nestjs/config

我们创建个 nest 项目来试下：

```arduino
nest new nest-config-test -p npm
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-cyZaIh.webp)

安装 @nestjs/config 包：

```css
css
复制代码npm install --save @nestjs/config
```

这个包同样是动态模块的方式，他有 forRoot 和 forFeature 两个方法。

我们在根目录加一个配置文件 .env：

```ini
ini
复制代码aaa=1
bbb=2
```

然后在 AppModule 里面引入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-39-sW64o5.webp)

然后在 AppController 里注入 ConfigService 来读取配置：

```javascript
javascript
复制代码import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get()
  getHello() {
    return {
      aaa: this.configService.get('aaa'),
      bbb: this.configService.get('bbb')
    }
  }
}
```

把 Nest 服务跑起来：

```arduino
arduino
复制代码npm run start:dev
```

浏览器访问下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-uuCsn7.webp)

可以看到，nest 读取到了 .env 里的配置。

如果有多个配置文件，比如还有个 .aaa.env：

```ini
ini
复制代码aaa=3
```

在 AppModule 里面这样指定：

```javascript
javascript
复制代码import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.join(process.cwd(), '.aaa.env'), path.join(process.cwd(), '.env')]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

前面的配置会覆盖后面的配置。

重新跑一下：

```arduino
arduino
复制代码npm run start:dev
```

浏览器访问下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-sApnJO.webp)

可以看到 aaa 是 .aaa.env 里的，bbb 是 .env 里的。

那如果我嫌 .env 里配置不够灵活，想在 ts 文件里配置呢？

@nestjs/config 也是支持的。

我们写一个 config.ts：

```javascript
javascript
复制代码export default async () => {
    const dbPort = await 3306;

    return {
        port: parseInt(process.env.PORT, 10) || 3000,
        db: {
          host: 'localhost',
          port: dbPort
        }
    }
}
```

这里可以写异步逻辑。

然后引入下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-Kelonh.webp)

在 Controller 里取出来：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-IVaCRG.webp)

浏览器访问下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-2RB6dt.webp)

这样，你可以动态加载配置。

后面将讲微服务的时候，会讲到配置中心，比如 nacos、etcd 这种中间件，到时候配置就是动态获取的。

而且这个配置文件里，你完全可以自己实现 yaml 文件的加载。

```
复制代码npm install js-yaml
```

添加一个配置文件 aaa.yaml

```yaml
yaml
复制代码application:
  host: 'localhost'
  port: 8080

aaa:
   bbb:
    ccc: 'ccc'
    port: 3306
```

然后在 config2.ts 里加载下：

```javascript
javascript
复制代码import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { join } from 'path';


export default async () => {
    const configFilePath = join(process.cwd(), 'aaa.yaml');

    const config = await readFile(configFilePath, {
        encoding: 'utf-8'
    });

    return yaml.load(config);
};
```

在 AppModule 引入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-g01yXg.webp)

同样，前面覆盖后面的。

改下 Controller：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-9ZZlBL.webp)

浏览器访问下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-JBf3A8.webp)

这样就正确读取了 yaml 配置。

同理，其他格式的配置也可以这样来自己解析。

此外，@nestjs/config 还提供了 forFeature 方法来返回动态模块。

如果别的模块也需要用到 config 咋办呢？

我们新建一个模块：

```css
css
复制代码nest g resource bbb --no-spec
```

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-gSjgGe.webp)

在 BbbModule 里注入下：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-lFlkez.webp)

跑起来你会发现报错了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-qL4CAj.webp)

这个模块找不到 ConfigModule。

这时候把 ConfigModule.forRoot 注册为全局模块就好了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-rMUDZU.webp)

这样就可以在 BbbModule 读取到配置了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-rCxJ1k.webp)

此外，你还可以通过 ConfigModule.forFeautrue 来注册局部配置：

```javascript
javascript
复制代码import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(() => {
      return {
        ddd: 222
      }
    })
  ],
  controllers: [BbbController],
  providers: [BbbService]
})
export class BbbModule {}
```

BbbController 里读取下：

```javascript
javascript
复制代码@Get()
findAll() {
    return {
      ccc: this.configService.get('aaa.bbb.ccc'),
      ddd: this.configService.get('ddd')
    }
}
```

可以看到，Nest 读取到了这个局部注册的配置。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-qzJcpt.webp)

这里是再次验证了**动态模块的 forRoot 用于在 AppModule 里注册，一般指定为全局模块，forFeature 用于局部配置，在不同模块里 imports，而 register 用于一次性的配置。**

比如 JwtModule.register、TypeOrmModule.ForRoot、TypeOrmModule.forFeature。

对动态模块不太理解的同学建议回过头去看看第 15 节。

最后我们简单看一下 @nestjs/config 的源码：

先是 forFeature：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-6mZ6nC.webp)

动态返回模块定义，也就是 providers、exports 这些。

用 useFactory 动态创建了 provider，merge 了局部配置和全局配置。

然后是 forRoot：

它就是根据 options 读取 env 配置，然后用 useFactory 创建 ConfigService 的 provider：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-hvU1pC.webp)

之后动态返回模块定义：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-63Vocv.webp)





### 部署

假设我们 nest 服务开发完了，想部署，那就要写这样的 dockerfile：

```docker
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
```



在根目录添加这个 Dockerfile，然后 docker build 一下：

```erlang
docker build -t eee .
```



在 docker desktop 里可以看到这个镜像：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-yJO8D7.webp)

那假设在服务器上，要怎么部署这个 nest 应用呢？

#### 如果没用桥接网络

在根目录添加一个 docker-compose.yml

```yaml
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
  mysql-container:
    image: mysql
    ports:
      - '3306:3306'
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
  redis-container:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - /Users/guang/aaa:/data
```

每个 services 都是一个 docker 容器，名字随便指定。

这里指定了 nest-app、mysql-container、reids-container 3 个service：

然后 nest-app 配置了 depends_on 其他两个 service。

这样 docker-compose 就会先启动另外两个，再启动这个，这样就能解决顺序问题。

然后 mysql-container、redis-container 的 service 指定了 image 和 ports、volumes 的映射，这些都很容易看懂。

nest-app 指定了 context 下的 dockerfile 路径，端口映射。

version 是指定 docker-compose.yml 的版本，因为不同版本配置不同。

然后我们通过 docker-compose 把它跑起来：

```shell
docker-compose up
```

docker-compose 和 docker 命令是一起的，docker 能用，docker-compose 就能用。

它会把所有容器的日志合并输出：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-5CNorX.webp)

可以看到是先跑的 mysql、redis，再跑的 nest。

只不过 mysql 服务启动有点慢，会连接失败几次。最后是会成功的：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-MI1AX3.webp)





我们只需要定义 docker-compose.yaml 来声明容器的顺序和启动方式，之后执行 docker-compose up 一条命令就能按照顺序启动所有的容器。

这时候如果你去 docker desktop 里看下，会发现它有专门的显示方式：多个容器可以一起管理。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-05-21-34-5ed7de84c738426caf96b938b8a8018e~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)



#### 如果用了桥接网络

把docker-compose.yml改成这样：

```yml
version: '3.8'
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
    networks:
      - common-network
  mysql-container:
    image: mysql
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
    networks:
      - common-network
  redis-container:
    image: redis
    volumes:
      - /Users/guang/aaa:/data
    networks:
      - common-network
networks:
  common-network:
    driver: bridge
```

把 mysql-container、redis-container 的 ports 映射去掉，指定桥接网络为 common-network。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-05-21-47-c3e7e3da3d4448759bbf5a3e2978bc37~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

然后下面通过 networks 指定创建的 common-network 桥接网络，网络驱动程序指定为 bridge。

其实我们一直用的网络驱动程序都是 bridge，它的含义是容器的网络和宿主机网络是隔离开的，但是可以做端口映射。比如 -p 3000:3000、-p 3306:3306 这样。



![image-20240202175447166](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-02-17-54-image-20240202175447166.png)

首先有一个 AppService 声明了 @Injectable，代表这个 class 可注入，那么 nest 就会把它的对象放到 IOC 容器里。

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-MkbDuX.webp)

AppController 声明了 @Controller，代表这个 class 可以被注入，nest 也会把它放到 IoC 容器里。

AppController 的构造器参数依赖了 AppService。

或者这样通过属性的方式声明依赖：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-Entqpb.webp)

<mark>前者是构造器注入，后者是属性注入，两种都可以。</mark>



然后在 AppModule 里引入：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-bjRcOj.webp)

通过 @Module 声明模块，其中 controllers 是控制器，只能接收别人。

providers 里是提供者也是接收者，比如这里的 AppService。

然后在入口模块里跑起来：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-6rfTP4.webp)

那么 nest 就会从 AppModule 开始解析 class 上通过装饰器声明的依赖信息，自动创建和组装对象。

所以 AppController 只是声明了对 AppService 的依赖，就可以调用它的方法了：

![img](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2024-02-07-17-40-hlttm9.webp)

nest 在背后自动做了对象创建和依赖注入的工作。







# node开发服务端(主要以koa为例)



## 举例完成一个BFF框架(刘江虹配套源码在properties)

《狼书2》也有koa的实战

### 实现多套配置

config目录下存放了各种环境的配置，命名方式为“config+环境变量”。config.base.ts文件会设置一些通用配置，其他的配置文件都会设置一些和环境有关的配置。

```
.
├── config
│   ├── config.base.js
│ 	├── config.development.js
│ 	├── config.production.js
│   └── config.test.js
```

每个配置文件需要导出一个函数，并返回整个配置对象。

```js
export default app => {
  return {
    // 环境配置

  }
}
```





先获取对应环境的配置，然后合并基础配置，得到的结果为当前环境的所有配置。逻辑实现代码如下：

```js
// lib/core/index.ts
import Koa from 'koa';
import path from 'path';
import { deepMerge } from './utils'
import { App } from './types';

type Params = {
  appPath: string;
}

export default async function Diudiu(params: Params) {
  const app: App = (new Koa()) as App;
  const { appPath } = params;
  app.appPath = appPath;

  // 获取所有的config
  const env = process.env.NODE_ENV;
  const extName = app.extName = env === 'development' ?'.ts' : '.js'; // 开发环境是ts文件，打包后的环境都是js。
  const baseConfig = await import(path.join(appPath,
    `config/config.base${extName}`))
  const curConfig = await import(path.join(appPath,
    `config/config.${env}${extName}`));
  app.config = deepMerge(baseConfig.default(app),curConfig.default(app)); // 把config挂到app下。
};
```

### 放置各种独立模块

在core文件夹下创建一个hooks目录，该目录主要存放框架中各类独立模块的实现。在框架的入口文件中，需要同步读取hooks目录下的所有模块，依次执行对应的逻辑，即可一次性加载所有功能。入口文件的实现逻辑代码如下：

```js
// lib/core/index.ts
import Koa from 'koa';
import { getHooks } from './utils'
import { Hook, App } from './types';
const hooks = [ 'lift' ]; // 对应hooks目录下的文件名

export default async function Diudiu(params: Params) {
  const app: App = (new Koa()) as App;
	.......


  // 获取所有hooks逻辑
  const allHooks: Hook[] = await getHooks(hooks); 
  for ( const hook of allHooks ) {
    try {
      await hook.default(app);
    } catch (error) {
      // TODO: 后续章节会进行处理
    }
  }

  // 错误捕获
  app.on("error", error => {
  });
};

// lib/core/utils/get-hooks.ts
import path from 'path';
export const getHooks = async (hooks: string[]) => {
  const len = hooks.length;
  const result: any[] = [];
  for (let i = 0;i < len;i++) {
    const hook = await import(path.join(__dirname, "../hooks", hooks[i]));
    result.push(hook);
  }
  return result;
}
```



### 实现各种模块

#### 【启动服务】

```js
export default async (app) => {
  const port = app.config.devServer.port;
  app.listen(port, () => {
    prointLogo()
    log(`Server port ${c.cyan}${port}${c.end}`)
    log(`Server lifted in ${c.cyan}${app.appPath}${c.end}`)
    app.redisConMsg && log(app.redisConMsg)
    app.mysqlConMsg && log(app.mysqlConMsg)
    app.esConMsg && log(app.esConMsg)
    log('To shut down, press <CTRL> + C at any time.\n')
  })
}

const log = message => process.stdout.write(message + '\n')
const c = { cyan: '\x1b[36m', red: '\x1b[31m', end: '\x1b[39m' }
const prointLogo = () => log(`${c.cyan}
   _ _ _ _     _ _ _ _      _       _
  | |   | |   |__   __|    | |     | |
  | |   | |      | |       | |     | |
  | |  | |     __| |__     | |_ _ _| |
  | | / /     |_ _ _ _|    |_ _ _ _ _|
${c.end}`)
```



#### 【文件路由】

```js
// lib/core/index.ts
const hooks = [ 'router', 'lift' ];
```

```js
// example/config/config.development.ts 
export default app => {
  return {
    // 开发环境配置
    devServer: {
      port: 8888
    },

    // 可通过配置选择使用哪种路由类型 file | koa-router
    router: 'koa-router'
  }
}
```



通过读取example/controller文件夹下的文件路径，对请求路径和方法进行配对，如果配对成功，则执行对应的逻辑。核心逻辑代码如下:

```js
// lib/core/hooks/router.ts
import glob from 'glob';
import path from 'path';
import compose from 'koa-compose';

export default async (app) => {
  const { router } = app.config;
  const filesList = glob.sync(path.resolve(app.appPath, './
    controller', `**/*${app.extName}`))

  // 如果是文件路由类型
  if (router === 'file') {
    // 文件路由映射表
    let routerMap = {}
    for (let item of filesList) {
      // 获取解构方式, 导出对象中的method属性和handler属性
      const controller = await import(item);
      const { method, handler } = controller.default;

      // 获取和actions目录的相对路径, 例如：goods/getInfo.js
      const relative = path.relative(`${app.appPath}/
        controller/`, item)

      // 获取文件后缀.js
      const extname = path.extname(item)
      // 剔除文件后缀.js,并在前面加一个"/",例如：/goods/
         getInfo
      const fileRouter = '/' + relative.split(extname)[0]
      // 连接method, 形成唯一请求, 例如: _GET_/goods/
         getInfo
      const key = '_' + method + '_' + fileRouter
      // 保存在路由表里
      routerMap[key] = handler
    }else if (router === 'koa-router') { // koa-router类型
      const routerFiles = glob.sync(path.resolve(app.appPath,
        './routers', `**/*${app.extName}`));
      const registerRouter = async () => {
        let routers: any[] = [];
        for (let file of routerFiles) {
          const router = await import(file);
          routers.push(router.default.routes());
        }
        return compose(routers)
      }
      app.use(await registerRouter())
    }

    app.use(async (ctx, next) => {
      const { path, method } = ctx
      // 构建和文件路由匹配的形式：_GET_路由
      const key = '_' + method + '_' + path

      // 如果匹配到, 就执行对应到handler
      if (routerMap[key]) {
        await routerMap[key](ctx)
      } else {
        ctx.body = 'no this router'
      }
      return next()
    })
  }

}
```



#### 【静态服务器】

```js
// lib/core/hooks/static.ts
import koaStatic from 'koa-static';
import path from 'path';

export default async (app) => {
  const staticConfig = app.config.static;
  app.use(koaStatic(path.join(app.appPath, './static'),
    staticConfig))
}
```



#### 【cors】

cors相关配置在请求跨域时，会有一次客户端和服务端的协商处理，第一次跨域请求返回的状态码是204。在协商过程中，可以对一些头（header）属性进行校验。

- Origin：首部字段表明预检请求或实际请求的源站。
- Access-Control-Request-Method：首部字段用于预检请求，其作用是将实际请求所使用的HTTP方法告诉服务器。
- Access-Control-Request-Headers：首部字段用于预检请求，其作用是将实际请求所携带的首部字段告诉服务器。
- Access-Control-Allow-Origin：对于不需要携带身份凭证的请求，服务器可以指定哪些域可以请求。例如，Access-Control-Allow-Origin: https://koajs.com/表示只允许来自https://koajs.com/的请求。如果服务端指定了具体的域名而非“*”，那么响应首部中的Vary字段的值必须包含Origin，这将告诉客户端，服务器对不同的源站返回不同的内容。
- Access-Control-Expose-Headers：在跨源访问时，XMLHttp-Request对象的getResponseHeader()方法只能得到一些最基本的响应头，如Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果要访问其他头，则需要服务器设置本响应头，例如Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header，这样浏览器就能够通过getResponseHeader访问X-My-Custom-Header和X-Another-Custom-Header响应头了。
- Access-Control-Max-Age：指定了preflight请求的结果能够被缓存多久。
- Access-Control-Allow-Credentials：指定了当浏览器的credentials设置为true时，是否允许浏览器读取response的内容。这个参数表示在预请求（preflight）中，是否可以使用credentials字段。请注意，简单GET请求不会被预检，如果对此类请求的响应中不包含该字段，这个响应将被忽略，并且浏览器也不会将相应内容返回给网页。
- Access-Control-Allow-Methods：首部字段用于预检请求的响应，指明了实际请求所允许使用的HTTP方法。
- Access-Control-Allow-Headers：首部字段用于预检请求的响应，指明了实际请求中允许携带的首部字段。



以上提到的所有响应头的设置，BFF框架都应该支持：

```js
// lib/core/hooks/cors.ts
import vary from 'vary';
export default async (app) => {
  const corsConfig = app.config.cors;
  // 如果没有配置, 默认不可以跨域
  if(!corsConfig) return;
  const cors = (options) => {
    const defaults = {
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };

    options = {
      ...defaults,
      ...options,
    };

    if (Array.isArray(options.exposeHeaders)) {
      options.exposeHeaders = options.exposeHeaders.join(',');
    }

    if (Array.isArray(options.allowMethods)) {
      options.allowMethods = options.allowMethods.join(',');
    }

    if (Array.isArray(options.allowHeaders)) {
      options.allowHeaders = options.allowHeaders.join(',');
    }

    if (options.maxAge) {
      options.maxAge = String(options.maxAge);
    }

    options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

    return async function cors(ctx, next) {

      const requestOrigin = ctx.get('Origin');
      ctx.vary('Origin');

      if (!requestOrigin) return await next();

      let origin;
      if (typeof options.origin === 'function') {
        origin = options.origin(ctx);
        if (origin instanceof Promise) origin = await origin;
        if (!origin) return await next();
      } else {
        origin = options.origin || requestOrigin;
      }

      let credentials;
      if (typeof options.credentials === 'function') {
        credentials = options.credentials(ctx);
        if (credentials instanceof Promise) credentials =
          await credentials;
      } else {
        credentials = !!options.credentials;
      }

      const headersSet = {};

      function set(key, value) {
        ctx.set(key, value);
        headersSet[key] = value;
      }

      if (ctx.method !== 'OPTIONS') {
        set('Access-Control-Allow-Origin', origin);

        if (credentials === true) {
          set('Access-Control-Allow-Credentials', 'true');
        }

        if (options.exposeHeaders) {
          set('Access-Control-Expose-Headers', options.
            exposeHeaders);
        }

        if (!options.keepHeadersOnError) {
          return await next();
        }
        try {
          return await next();
        } catch (err) {
          const errHeadersSet = err.headers || {};
          const varyWithOrigin = vary.append(errHeadersSet.
            vary || errHeadersSet.Vary || '', 'Origin');
          delete errHeadersSet.Vary;

          err.headers = {
            ...errHeadersSet,
            ...headersSet,
            ...{ vary: varyWithOrigin },
          };
          throw err;
        }
      } else {

        if (!ctx.get('Access-Control-Request-Method')) {
          return await next();
        }

        ctx.set('Access-Control-Allow-Origin', origin);

        if (credentials === true) {
          ctx.set('Access-Control-Allow-Credentials', 'true');
        }

        if (options.maxAge) {
          ctx.set('Access-Control-Max-Age', options.maxAge);
        }

        if (options.allowMethods) {
          ctx.set('Access-Control-Allow-Methods',
            options.allowMethods);
        }

        let allowHeaders = options.allowHeaders;
        if (!allowHeaders) {
          allowHeaders = ctx.get('Access-Control-Request-
            Headers');
        }
        if (allowHeaders) {
          ctx.set('Access-Control-Allow-Headers',
            allowHeaders);
        }

        ctx.status = 204;
      }
    };
  };
  app.use(cors(corsConfig))
}
```



#### 【自定义中间件】

```js
// example/config/config.development.ts
export default app => {
  return {

    // 自定义中间件
    middlewares: ['two', 'one'] // 得跟 middleware目录 下的文件同名。
  }
}
```

我们规定自定义中间件必须要放在example/middleware目录下，那么只需要按照配置读取该目录下的自定义中间件即可，实现代码如下:

```js
// lib/core/hooks/custom-middlewares.ts
import path from 'path';

export default async (app) => {
  const { middlewares } = app.config;

  // 按照middleWares数组的顺序加载中间件
  for (let m of middlewares) {
    const curMiddleWarePath = path.resolve(app.appPath,'./middleware', `${m}${app.extName}`)
    const curMiddleware = await import(curMiddleWarePath);
    app.use(curMiddleware.default(app)) // 读出中间件之后丢给 koa
  }
}
```



示例中间件，如middleware/one.js:

```js
export default (app) => {
	return (ctx,next) => {
		console.log('one')
		return next()
	}
}
```







#### 【登录】

```js
// example/config/config.development.ts
export default app => {
  return {
    // 省略部分代码
    // 登录配置
    login: {
      needLogin: true,      // 接口是否需要鉴权
      secret: 'my_secret',  // JWT的secret
      cookieOption: {
        path: '/user/getinfo',
        domain: 'http://127.0.0.1'
      }
    }
  }
}
```



```js
// lib/core/hooks/login.ts
import { sign, decode } from 'jsonwebtoken';
export default async (app) => {
  const loginConfig = app.config.login;
  const { secret } = loginConfig;
  const { cookieOption } = loginConfig;

  if (loginConfig?.needLogin) {
    // 检测是否已经登录
    const checkLogin = (ctx, next) => {

      // 这里默认检测, 用户名存在, 则通过检测
      const token = ctx.cookies.get('diudiu_token');
      if (!token) {
        // 如果没有token, 则需要进行登录操作
        const jwt = login();
        ctx.cookies.set('diudiu_token', jwt, cookieOption);
        ctx.status = 302;
        ctx.redirect(ctx.url);
      } else {
        const user = decode(token);
        if (user) {
          ctx.user = user;
        }
      }
      return next()
    }

    // 这里对接公司内部SSO的login策略, 此处用JWT方式替换
    const login = () => {
      const jwt = sign({ username: 'liujianghong' },
        secret, { expiresIn: '1h' })
      return jwt;
    }
    app.use(checkLogin)
  }
}
```





#### 【制定模版】

制定模板在一些业务场景中，需要定制通用模板，比如找不到路由时，可以展示一个404模板；Server端出现异常时，可以展示一个500模板。目前市场上的模板引擎很多，比较常见的是ejs、pug等。

```js
// lib/core/hooks/view.ts
import views from 'koa-views'; // 加载模板的功能可以通过npm包koa-views实现。koa-views使用注意事项：在使用koa-views时，除了需要安装koa-views依赖，还需要安装模板引擎，比如要使用ejs，就必须安装ejs依赖
import path from 'path';
const defaultViewConfig = {
  extension: 'ejs'
}
export default async (app) => {
  const viewConfig = app.config.view;
  app.use(views(path.join(app.appPath, './view'), Object.
    assign(defaultViewConfig, viewConfig)))
}
```

```js
// example/config/config.development.ts
export default app => {
  return {
    // 省略部分代码

    // koa-view模板配置
    view: {
      extension: 'ejs'
    }
  }
}
```



剩下的模块看书《koa开发：入门。。。》

# 基础

## git理论模型

### 对象

每个对象 (object(对象)) 包括三个部分：类型、大小和内容。大小就是指内容的大小，内容取决于对象的类型。

有四种类型的对象：`"blob"`、`"tree"`、`"commit"` 和 `"tag"`。

几乎所有的 Git 功能都是使用这四个简单的对象类型来完成的。它就像是在你本机的文件系统之上构建一个小的文件系统。

#### commit -> tree -> blob

一个 `commit` 指向了一棵由 `tree` 和 `blob` 构成的 Git 对象树。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-11-19-17-24-image-20231119172430907.png" alt="image-20231119172430907" style="zoom:50%;" />

#### blob (文件) 对象

`blob` 用来存储文件数据，通常是一个文件。





#### tree (目录) 对象

```
tree` 像一个目录，管理 `tree（子目录）` 或 `blob（文件）
```



#### commit(犯) (提交) 对象

一个 `commit` 只指向一个 `tree`，它用来标记项目某一个特定时间点的状态。`commit` 保存了树根的 `对象名`。

它包括一些关于时间点的元数据，如 `时间戳`、`最近一次提交的作者`、`指向上次提交（commits）的指针` 等等。

```sh
$ git cat-file -p 830f4857e9f579818c5e69104d3e2cc30f1f0d0d
tree f25061fa4f8b3bffbf8ebcc3ab2351efdad2f605
parent 06e13701ac86eb09c2035329a5e1c18f95898cf2
author liuyanjie <x@gmail.com> 1526828841 +0800
committer liuyanjie <x@gmail.com> 1526828841 +0800

commit message
```

#### tag (标签) 对象

一个 `tag` 是来标记某一个 `commit` 的方法。

实际上 `tag` 本身是文件名，内容是 `commit` 的对象名。`tag` 是 `commit` 的别名，类似于域名和 ip 地址的关系。

```sh
$ cat .git/refs/tags/v0.0.0
830f4857e9f579818c5e69104d3e2cc30f1f0d0d
```

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-11-19-17-25-image-20231119172503233.png" alt="image-20231119172503233" style="zoom:50%;" />



#### git-obj-model

![image-20231119172131886](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-11-19-17-21-image-20231119172131886.png)





## ssh-keygen

`ssh-keygen -t rsa -C "***@***.com"`

如果不指定的话生成公钥时`ssh-keygen` 默认会用`用户名@主机名`。

这个东西和密码学无关，只是个区别公钥用的注释。你可以生成后再随便改，或者删掉都没有关系。



## 配置本地的 Git 环境

1. 下载 Git [下载地址](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fdownloads) ，选择自己系统对应的版本下载即可。

2. 在你的电脑上生成 ssh 秘钥，打开终端，执行 `ssh-keygen -t rsa -C "你公司内部邮箱地址"`，如果执行成功，切换到 `~/.ssh` 目录下，此时目录应该如下所示。复制 `id_rsa.pub` 的内容。

   ![image-20210519163921819.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0deb58d91310414f80eff364c694af9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

3. 这里以 Github 为例，如下图所示，进入 `settings -> SSH and GPG keys` 通过 `cat` 命令查看文件 `id_rsa.pub` 的内容，然后复制过来，点击 `add ssh key`，这一步等于说把你的公钥放到了 Github 上进行托管。

   ![image-20210519164643069.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ff633573cc946bab9a13f014a099d7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

4. 全局配置 Git 的用户名和邮箱

```bash
git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"
```

完成以上四步，你就可以愉快 pull 代码开发了。和 https 拉取方式不同的是，https 方式需要每次提交前都手动输入用户名和密码，ssh 的方式配置完毕后 Git 都会使用你本地的私钥和远程仓库的公钥进行验证是否是一对秘钥，从而简化了操作流程。



## 删除本地Git仓库

```sh
rm -fr .git
```



## [取得项目的 Git 仓库](https://gitee.com/progit/2-Git-基础.html#2.1-取得项目的-Git-仓库)

### 创建版本库

通过`git init`命令把这个目录变成Git可以管理的仓库。初始化后，在当前目录下会出现一个名为 .git 的目录，所有 Git 需要的数据和资源都存放在这个目录中。不过目前还没有开始跟踪管理项目中的任何一个文件。如果你没有看到`.git`目录，那是因为这个目录默认是隐藏的，用`ls -ah`命令就可以看见。





### 从现有仓库克隆git clone

#### 简介

Git 收取的是项目历史的所有数据（每一个文件的每一个版本），服务器上有的数据克隆之后本地也都有了。实际上，即便服务器的磁盘发生故障，用任何一个克隆出来的客户端都可以重建服务器上的仓库，回到当初克隆时的状态。

Git 支持许多数据传输协议。之前的例子使用的是 `git://` 协议，不过你也可以用 `http(s)://` 或者 `user@server:/path.git` 表示的 SSH 传输协议。



默认情况下 `git clone` 命令本质上就是自动创建了本地的 master 分支用于跟踪远程仓库中的 master 分支（假设远程仓库确实有 master 分支）。

#### 使用

##### 默认项目名

克隆仓库的命令格式为 `git clone [url]`。比如：

```shell
$ git clone git://github.com/schacon/grit.git
```

这会在当前目录下创建一个名为`grit`的目录，其中包含一个 `.git` 的目录，用于保存下载下来的所有版本记录，然后从中取出最新版本的文件拷贝。



##### 自定义新建的项目名

自定义新建的项目目录名称，可以在上面的命令末尾指定新的名字：

```shell
$ git clone git://github.com/schacon/grit.git mygrit
```





##### 只克隆单个commit和单个分支

这样快很多

```sh
git clone --depth=1 --single-branch https://github.com/nestjs/nest
```







## 自动补全

如果你用的是 Bash shell，可以试试看 Git 提供的自动补全脚本。下载 Git 的源代码，进入 `contrib/completion` 目录，会看到一个 `git-completion.bash` 文件。将此文件复制到你自己的用户主目录中（译注：按照下面的示例，还应改名加上点：`cp git-completion.bash ~/.git-completion.bash`），并把下面一行内容添加到你的 `.bashrc` 文件中：

```
source ~/.git-completion.bash
```

也可以为系统上所有用户都设置默认使用此脚本。Mac 上将此脚本复制到 `/opt/local/etc/bash_completion.d` 目录中，Linux 上则复制到 `/etc/bash_completion.d/` 目录中。这两处目录中的脚本，都会在 Bash 启动时自动加载。

如果在 Windows 上安装了 msysGit，默认使用的 Git Bash 就已经配好了这个自动补全脚本，可以直接使用。

在输入 Git 命令的时候可以敲两次跳格键（Tab），就会看到列出所有匹配的可用命令建议：

```
$ git co<tab><tab>
    commit config
```

此例中，键入 git co 然后连按两次 Tab 键，会看到两个相关的建议（命令） commit 和 config。继而输入 `m<tab>` 会自动完成 `git commit` 命令的输入。

命令的选项也可以用这种方式自动完成，其实这种情况更实用些。比如运行 `git log` 的时候忘了相关选项的名字，可以输入开头的几个字母，然后敲 Tab 键看看有哪些匹配的：

```
$ git log --s<tab>
    --shortstat --since= --src-prefix= --stat --summary
```





## Git配置  git config

### 常用

> git 提交的时候注意，默认 git 修改的时候是忽略大小写的。需要修改一下 git 配置才可以提交。

```
# 禁止忽略大小写
git config core.ignorecase false
```





### 项目中的git config文件

在这`cd .git`，配置文件就在这



### 概述

专门用来配置或读取相应的工作环境变量。这些变量可以存放在以下三个不同的地方：

- `/etc/gitconfig` 文件：系统中对所有用户都普遍适用的配置。若使用 `git config` 时用 `--system` 选项，读写的就是这个文件。
- `~/.gitconfig` 文件：用户目录下的配置文件只适用于该用户。若使用 `git config` 时用 `--global` 选项，读写的就是这个文件。
- 当前项目的 git 目录中的配置文件（也就是工作目录中的 `.git/config` 文件）：这里的配置仅仅针对当前项目有效。不加参数就是修改这个文件里的变量。每一个级别的配置都会覆盖上层的相同配置。

在 Windows 系统上，Git 会找寻用户主目录下的 `.gitconfig` 文件。主目录即 `$HOME` 变量指定的目录，一般都是 `C:\Documents and Settings\$USER`。此外，Git 还会尝试找寻 `/etc/gitconfig` 文件，只不过看当初 Git 装在什么目录，就以此作为根目录来定位。

### 用户信息

配置你的个人的用户名称和电子邮件地址。每次 Git 提交时都会引用这两条信息，说明是谁提交了更新。

```shell
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

如果用了 `--global` 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。如果要在某个特定的项目中使用其他名字或者电邮，只要去掉 `--global` 选项重新配置即可，新的设定保存在当前项目的 `.git/config` 文件里。





### 文本编辑器

Git 需要你输入一些额外消息的时候，会自动调用一个外部文本编辑器给你用。默认会使用操作系统指定的默认编辑器，一般可能会是 Vi 或者 Vim。如果你有其他偏好，比如 Emacs 的话，可以重新设置：

```shell
$ git config --global core.editor emacs
```

### 差异分析工具

在解决合并冲突时使用哪种差异分析工具。比如要改用 vimdiff 的话：

```shell
$ git config --global merge.tool vimdiff
```

Git 可以理解 kdiff3，tkdiff，meld，xxdiff，emerge，vimdiff，gvimdiff，ecmerge，和 opendiff 等合并工具的输出信息。当然，你也可以指定使用自己开发的工具。



### Git 命令别名

#### 设置别名

可以用 `git config` 为命令设置别名。来看看下面的例子：

```sh
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status
```

现在，如果要输入 `git commit` 只需键入 `git ci` 即可。



#### 创造出新的命令

比方说取消暂存文件时的输入比较繁琐，可以自己设置一下：

```sh
$ git config --global alias.unstage 'reset HEAD --'

#这样一来，下面的两条命令完全等同：
$ git unstage fileA
$ git reset HEAD fileA
```

我们还经常设置 `last` 命令：

```
$ git config --global alias.last 'log -1 HEAD'
```

然后要看最后一次的提交信息，就变得简单多了：

```sh
$ git last
    commit 66938dae3329c7aebe598c2246a8e6af90d04646
    Author: Josh Goebel <dreamer3@example.com>
    Date: Tue Aug 26 19:48:51 2008 +0800

    test for current head

    Signed-off-by: Scott Chacon <schacon@example.com>
```

#### 运行某个 非 Git 的子命令 的命令

运行某个 非 Git 的子命令 的命令，只需要在命令前加上 `!` 就行。如果你自己写了些处理 Git 仓库信息的脚本的话，就可以用这种技术包装起来。作为演示，我们可以设置用 `git visual` 启动 `gitk`：

```
$ git config --global alias.visual '!gitk'
```





### commit.template

如果把此项指定为你系统上的一个文件，当你提交的时候， Git 会默认使用该文件定义的内容。 例如：你创建了一个模板文件`$HOME/.gitmessage.txt`，它看起来像这样：

```
subject line

    what happened

    [ticket: X]
```

设置`commit.template`，当运行`git commit`时， Git 会在你的编辑器中显示以上的内容， 设置`commit.template`如下：

```
$ git config --global commit.template $HOME/.gitmessage.txt
    $ git commit
```

然后当你提交时，在编辑器中显示的提交信息如下：

```
subject line

    what happened

    [ticket: X]
    # Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: lib/test.rb
    #
    ~
    ~
    ".git/COMMIT_EDITMSG" 14L, 297C
```

如果你有特定的策略要运用在提交信息上，在系统上创建一个模板文件，设置 Git 默认使用它，这样当提交时，你的策略每次都会被运用。

### 指定分页器core.pager

core.pager指定 Git 运行诸如`log`、`diff`等所使用的分页器，你能设置成用`more`或者任何你喜欢的分页器（默认用的是`less`）， 当然你也可以什么都不用，设置空字符串：

```
$ git config --global core.pager ''
```

这样不管命令的输出量多少，都会在一页显示所有内容。

### user.signingkey

如果你要创建经签署的含附注的标签，那么把你的GPG签署密钥设置为配置项会更好，设置密钥ID如下：

```
$ git config --global user.signingkey <gpg-key-id>
```

现在你能够签署标签，从而不必每次运行`git tag`命令时定义密钥：

```
$ git tag -s <tag-name>
```

### 用项目库之外的文件来定义那些需被忽略的文件

正如第二章所述，你能在项目库的`.gitignore`文件里头用模式来定义那些无需纳入 Git 管理的文件，这样它们不会出现在未跟踪列表， 也不会在你运行`git add`后被暂存。然而，如果你想用项目库之外的文件来定义那些需被忽略的文件的话，用`core.excludesfile` 通知 Git 该文件所处的位置，文件内容和`.gitignore`类似。

### help.autocorrect

该配置项只在 Git 1.6.1及以上版本有效，假如你在Git 1.6中错打了一条命令，会显示：

```
$ git com
    git: 'com' is not a git-command. See 'git --help'.

    Did you mean this?
    commit
```

如果你把`help.autocorrect`设置成1（译注：启动自动修正），那么在只有一个命令被模糊匹配到的情况下，Git 会自动运行该命令。

### Git中的着色

Git能够为输出到你终端的内容着色，以便你可以凭直观进行快速、简单地分析，有许多选项能供你使用以符合你的偏好。

#### color.ui

Git会按照你需要自动为大部分的输出加上颜色，你能明确地规定哪些需要着色以及怎样着色，设置`color.ui`为true来打开所有的默认终端着色。

```
$ git config --global color.ui true
```

设置好以后，当输出到终端时，Git 会为之加上颜色。其他的参数还有false和always，false意味着不为输出着色，而always则表明在任何情况下都要着色，即使 Git 命令被重定向到文件或管道。Git 1.5.5版本引进了此项配置。

你会很少用到`color.ui = always`，在大多数情况下，如果你想在被重定向的输出中插入颜色码，你能传递`--color`标志给 Git 命令来迫使它这么做，`color.ui = true`应该是你的首选。

#### `color.*`

想要具体到哪些命令输出需要被着色以及怎样着色或者 Git 的版本很老，你就要用到和具体命令有关的颜色配置选项，它们都能被置为`true`、`false`或`always`：

```
color.branch
color.diff
color.interactive
color.status
```

除此之外，以上每个选项都有子选项，可以被用来覆盖其父设置，以达到为输出的各个部分着色的目的。例如，让diff输出的改变信息以粗体、蓝色前景和黑色背景的形式显示：

```
$ git config --global color.diff.meta “blue black bold”
```

你能设置的颜色值如：normal、black、red、green、yellow、blue、magenta、cyan、white，正如以上例子设置的粗体属性，想要设置字体属性的话，可以选择如：bold、dim、ul、blink、reverse。

如果你想配置子选项的话，可以参考`git config`帮助页。





### 格式化与空白

格式化与空白是许多开发人员在协作时，特别是在跨平台情况下，遇到的令人头疼的细小问题。由于编辑器的不同或者Windows程序员在跨平台项目中的文件行尾加入了回车换行符，一些细微的空格变化会不经意地进入大家合作的工作或提交的补丁中。不用怕，Git 的一些配置选项会帮助你解决这些问题。

#### core.autocrlf

假如你正在Windows上写程序，又或者你正在和其他人合作，他们在Windows上编程，而你却在其他系统上，在这些情况下，你可能会遇到行尾结束符问题。这是因为Windows使用回车和换行两个字符来结束一行，而Mac和Linux只使用换行一个字符。虽然这是小问题，但它会极大地扰乱跨平台协作。

Git可以在你提交时自动地把行结束符CRLF转换成LF，而在签出代码时把LF转换成CRLF。用`core.autocrlf`来打开此项功能，如果是在Windows系统上，把它设置成`true`，这样当签出代码时，LF会被转换成CRLF：

```
$ git config --global core.autocrlf true
```

Linux或Mac系统使用LF作为行结束符，因此你不想 Git 在签出文件时进行自动的转换；当一个以CRLF为行结束符的文件不小心被引入时你肯定想进行修正，把`core.autocrlf`设置成input来告诉 Git 在提交时把CRLF转换成LF，签出时不转换：

```
$ git config --global core.autocrlf input
```

这样会在Windows系统上的签出文件中保留CRLF，会在Mac和Linux系统上，包括仓库中保留LF。

如果你是Windows程序员，且正在开发仅运行在Windows上的项目，可以设置`false`取消此功能，把回车符记录在库中：

```
$ git config --global core.autocrlf false
```

#### core.whitespace

Git预先设置了一些选项来探测和修正空白问题，其4种主要选项中的2个默认被打开，另2个被关闭，你可以自由地打开或关闭它们。

默认被打开的2个选项是`trailing-space`和`space-before-tab`，`trailing-space`会查找每行结尾的空格，`space-before-tab`会查找每行开头的制表符前的空格。

默认被关闭的2个选项是`indent-with-non-tab`和`cr-at-eol`，`indent-with-non-tab`会查找8个以上空格（非制表符）开头的行，`cr-at-eol`让 Git 知道行尾回车符是合法的。

设置`core.whitespace`，按照你的意图来打开或关闭选项，选项以逗号分割。通过逗号分割的链中去掉选项或在选项前加`-`来关闭，例如，如果你想要打开除了`cr-at-eol`之外的所有选项：

```
$ git config --global core.whitespace \
    trailing-space,space-before-tab,indent-with-non-tab
```

当你运行`git diff`命令且为输出着色时，Git 探测到这些问题，因此你也许在提交前能修复它们，当你用`git apply`打补丁时同样也会从中受益。如果正准备运用的补丁有特别的空白问题，你可以让 Git 发警告：

```
$ git apply --whitespace=warn <patch>
```

或者让 Git 在打上补丁前自动修正此问题：

```
$ git apply --whitespace=fix <patch>
```

这些选项也能运用于衍合。如果提交了有空白问题的文件但还没推送到上流，你可以运行带有`--whitespace=fix`选项的`rebase`来让Git在重写补丁时自动修正它们。







### 查看配置信息

要检查已有的配置信息，可以使用 `git config --list` 命令：

```shell
$ git config --list
    user.name=Scott Chacon
    user.email=schacon@gmail.com
    color.status=auto
    color.branch=auto
    color.interactive=auto
    color.diff=auto
    ...
```

有时候会看到重复的变量名，那就说明它们来自不同的配置文件（比如 `/etc/gitconfig` 和 `~/.gitconfig`），不过最终 Git 实际采用的是最后一个。

也可以直接查阅某个环境变量的设定，只要把特定的名字跟在后面即可，像这样：

```shell
$ git config user.name
```







## [git help](https://gitee.com/progit/1-起步.html#1.6-获取帮助)

想了解 Git 的各式工具该怎么用，可以阅读它们的使用帮助，方法有三：

```shell
$ git help <verb>
$ git <verb> --help
$ man git-<verb>
```

比如，要学习 config 命令可以怎么用，运行：

```shell
$ git help config
```

我们随时都可以浏览这些帮助信息而无需连网。



##  git 存储的逻辑分区

- workspace（工作目录）：本地直接编辑的结果
- stage/index（索引区）： workspace 内的内容可暂存到stage中
- repository（仓库）：将当前stage打包起来，作为一次归档，提交到repository中

workspace(实际工作区即你能看到的目录) ---> stage(暂存区) ---> repository(.git下的版本库)。

## .git文件目录

Git 分布式的一个重要体现是 git 在本地是有一个完整的 git 仓库也就是 .git 文件目录。

```
.git
├── COMMIT_EDITMSG    # 文本文件，最后一次commit注释
├── FETCH_HEAD   # 文本文件，每个分支最后一次和服务器通信的最后 commit SHA1 值
├── HEAD  #当前指向的引用或者oid，例如： ref: refs/heads/master
├── ORIG_HEAD  #文本文件，同步当前分支和远程分支最后一个commit SHA1值
├── config         #git相关配置，存储库的配置，可以覆盖全局配置
├── description
├── hooks #钩子，在不通生命周期git暴露出了相关的钩子
├── index  #暂存区，索引文件，可以用 git ls-files查看
├── info    #存储库信息
├── logs  #提交日志，各个分支都有，这也是git离线之后可以log的原因
├── objects  #松散对象和包文件
├── packed-refs #打包引用，通常运行 git packrefs 后产生的
└── refs #引用，包括头引用，标签引用和远程引用
```







## [Git hooks](https://gitee.com/progit/7-自定义-Git.html#7.3-Git挂钩)

### 常用的一些钩子

![image-20231228163146953](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-12-28-16-31-image-20231228163146953.png)





### 安装一个挂钩

挂钩都被存储在 Git 目录下的`hooks`子目录中，即大部分项目中的`.git/hooks`。 Git 默认会放置一些脚本样本在这个目录中，除了可以作为挂钩使用，这些样本本身是可以独立使用的。所有的样本都是shell脚本，其中一些还包含了Perl的脚本，不过，任何正确命名的可执行脚本都可以正常使用 — 可以用Ruby或Python，或其他。在Git 1.6版本之后，这些样本名都是以.sample结尾，因此，你必须重新命名。在Git 1.6版本之前，这些样本名都是正确的，但这些样本不是可执行文件。

把一个正确命名且可执行的文件放入 Git 目录下的`hooks`子目录中，可以激活该挂钩脚本，因此，之后他一直会被 Git 调用。随后会讲解主要的挂钩脚本。

### 客户端挂钩

有许多客户端挂钩，以下把他们分为：提交工作流挂钩、电子邮件工作流挂钩及其他客户端挂钩。

#### 提交工作流挂钩

有 4个挂钩被用来处理提交的过程。`pre-commit`挂钩在键入提交信息前运行，被用来检查即将提交的快照，例如，检查是否有东西被遗漏，确认测试是否运行，以及检查代码。当从该挂钩返回非零值时，Git 放弃此次提交，但可以用`git commit --no-verify`来忽略。该挂钩可以被用来检查代码错误（运行类似lint的程序），检查尾部空白（默认挂钩是这么做的），检查新方法（译注：程序的函数）的说明。

`prepare-commit-msg`挂钩在提交信息编辑器显示之前，默认信息被创建之后运行。因此，可以有机会在提交作者看到默认信息前进行编辑。该挂钩接收一些选项：拥有提交信息的文件路径，提交类型，如果是一次修订的话，提交的SHA-1校验和。该挂钩对通常的提交来说不是很有用，只在自动产生的默认提交信息的情况下有作用，如提交信息模板、合并、压缩和修订提交等。可以和提交模板配合使用，以编程的方式插入信息。

`commit-msg`挂钩接收一个参数，此参数是包含最近提交信息的临时文件的路径。如果该挂钩脚本以非零退出，Git 放弃提交，因此，可以用来在提交通过前验证项目状态或提交信息。本章上一小节已经展示了使用该挂钩核对提交信息是否符合特定的模式。

`post-commit`挂钩在整个提交过程完成后运行，他不会接收任何参数，但可以运行`git log -1 HEAD`来获得最后的提交信息。总之，该挂钩是作为通知之类使用的。

提交工作流的客户端挂钩脚本可以在任何工作流中使用，他们经常被用来实施某些策略，但值得注意的是，这些脚本在clone期间不会被传送。可以在服务器端实施策略来拒绝不符合某些策略的推送，但这完全取决于开发者在客户端使用这些脚本的情况。所以，这些脚本对开发者是有用的，由他们自己设置和维护，而且在任何时候都可以覆盖或修改这些脚本。

#### E-mail工作流挂钩

有3个可用的客户端挂钩用于e-mail工作流。当运行`git am`命令时，会调用他们，因此，如果你没有在工作流中用到此命令，可以跳过本节。如果你通过e-mail接收由`git format-patch`产生的补丁，这些挂钩也许对你有用。

首先运行的是`applypatch-msg`挂钩，他接收一个参数：包含被建议提交信息的临时文件名。如果该脚本非零退出，Git 放弃此补丁。可以使用这个脚本确认提交信息是否被正确格式化，或让脚本编辑信息以达到标准化。

下一个在`git am`运行期间调用是`pre-applypatch`挂钩。该挂钩不接收参数，在补丁被运用之后运行，因此，可以被用来在提交前检查快照。你能用此脚本运行测试，检查工作树。如果有些什么遗漏，或测试没通过，脚本会以非零退出，放弃此次`git am`的运行，补丁不会被提交。

最后在`git am`运行期间调用的是`post-applypatch`挂钩。你可以用他来通知一个小组或获取的补丁的作者，但无法阻止打补丁的过程。

#### 其他客户端挂钩

`pre-rebase`挂钩在衍合前运行，脚本以非零退出可以中止衍合的过程。你可以使用这个挂钩来禁止衍合已经推送的提交对象，Git `pre-rebase`挂钩样本就是这么做的。该样本假定next是你定义的分支名，因此，你可能要修改样本，把next改成你定义过且稳定的分支名。

在`git checkout`成功运行后，`post-checkout`挂钩会被调用。他可以用来为你的项目环境设置合适的工作目录。例如：放入大的二进制文件、自动产生的文档或其他一切你不想纳入版本控制的文件。

最后，在`merge`命令成功执行后，`post-merge`挂钩会被调用。他可以用来在 Git 无法跟踪的工作树中恢复数据，诸如权限数据。该挂钩同样能够验证在 Git 控制之外的文件是否存在，因此，当工作树改变时，你想这些文件可以被复制。



## 分支模式

### 简介

快手内网搜：[什么是Ship / Show / Ask？以及十九种分支管理模式]

分支管理模型只是一种通用的约定,并不是强制要按照这个模型的管理办法实施,只是针对各种分支管理的情况总结出来的通用的管理办法,每个项目可能根据自身项目的周期和实际情况来指定分支管理模型.

### 特性分支模式

#### git flow

##### 适用场景

<strong style="color: red">适用于周期性发版，多人参与开发的项目；不适合web快速交付的场景；</strong>

[原文地址](https://zhuanlan.zhihu.com/p/198066289)

![原文地址https://zhuanlan.zhihu.com/p/198066289](https://pic4.zhimg.com/80/v2-be9b084200241f007d9b466f6acf26a3_1440w.jpg)

##### 各分支介绍

- **生产分支（master）**‌

Master分支是仓库的主分支，这个分支包含最近发布到生产环境的代码，最近发布的Release， 这个分支只能从其他分支合并，不能在这个分支直接修改‌

- **补丁分支（hotfix）**‌

当我们在生产环境发现新的Bug时候，我们需要基于master分支创建一个Hotfix分支，然后在Hotfix分支上修复bug，完成Hotfix后，我们要把hotfix分支合并回Master和Develop分支‌

- **发布分支（release)**‌

当你需要发布一个新功能的时候，要基于Develop分支创建一个Release分支，在Release分支测试并修复bug，完成release后，把release合并到master和develop分支‌

- **开发分支（develop）**‌

这个分支是我们的主开发分支，包含所有要发布到下一个Release的代码，用于合并其他分支，比如Feature分支‌

- **功能分支（feature）**‌

feature分支主要是用来开发一个新的功能，一旦开发完成，我们合并回Develop分支进入下一个Release‌



##### 流程

1. 有新的工作项(新增/修改功能,修复缺陷)时,基于develop分支(最初的develop分支是基于master分支的)拉取代码,创建新分支feature/newFeature
2. 新的功能开发完毕后,将feature/newFeature合并入develop分支,**而不是master分支**
3. 当发布周期到来时,基于develop分支创建一个release分支用于发布,此时的release分支应该不再有新的feature分支合并,只能用于缺陷修复
4. 发布时,将release分支合并入master分支并基于master分支打标签,标志一次发布.
5. 当master分支发布后,线上突然出现紧急问题时,基于master分支新增hotfix分支,修复缺陷后,将hotfix分支合并入master分支和develop分支,并且基于master分支打标签,标记一次发布



##### 具体使用细节

我们要基于master分支创建一个develop分支，develop分支用于保存开发好的相对稳定的功能，master分支和develop分支是仓库的常驻分支，一直会保留在仓库中

![img](https://pic4.zhimg.com/80/v2-05ef2299bedaeaab8ec5cc51d281a047_1440w.jpg)

我们不要在develop分支上写代码，要保证develop分支的相对稳定，所以这时就要基于develop 分支创建一个临时的开发分支，然后在开发分支上编写代码，等功能开发完之后我们再把开发分支合并到develop上

![img](https://pic3.zhimg.com/80/v2-315c3a551d9b73d7284f432749cdfaf6_1440w.jpg)



新功能合并到develop分支之后，我们想把新功能发布到生产环境，首先基于develop分支创建release分支，然后在release分支测试完成之后，把release分别合并到master分支和develop分支

![img](https://pic4.zhimg.com/80/v2-c62e4af681a350eec046248f2d279f8b_1440w.jpg)



release分支合并到master分支之后，在master分支上==打标签==用于发布：

![img](https://pic3.zhimg.com/80/v2-67d6b3b9d659af09d9bf378ec1d8c3e2_1440w.jpg)



我们把代码发布到了生产环境，用户在使用的时候给我们反馈了一个bug，这时我们需要基于master分支创建一个hotfix 分支，用于修复bug，bug修好之后，把hotfix 分支分别合并到master分支和develop分支

![img](https://pic4.zhimg.com/80/v2-ef02163c6714a437ccb7b7b2f2cfcadb_1440w.jpg)



##### Git flow工具

如果你理解了上面的流程，你完全可以不使用Git flow工具，但是如果你想更标准化的执行git flow，可以尝试使用git flow工具‌

**安装**‌

- Mac OS X

```text
$ brew install git-flow
```

- Linux

```text
$ apt-get install git-flow
```

- Windows

```text
$ wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | bash
```

**使用**‌

- **初始化:** git flow init
- **开始新Feature:** git flow feature start MYFEATURE
- **Publish一个Feature(也就是push到远程):** git flow feature publish MYFEATURE
- **获取Publish的Feature:** git flow feature pull origin MYFEATURE
- **完成一个Feature:** git flow feature finish MYFEATURE
- **开始一个Release:** git flow release start RELEASE [BASE]
- **Publish一个Release:** git flow release publish RELEASE
- **发布Release:** git flow release finish RELEASE 别忘了git push --tags
- **开始一个Hotfix:** git flow hotfix start VERSION [BASENAME]
- **发布一个Hotfix:** git flow hotfix finish VERSION



#### **GitHub-Flow 模型**

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-11-19-19-image-20230711191949429.png" alt="image-20230711191949429" style="zoom:50%;" />



流程：

​	feature分支即是所有的分支类型，每个任务都在master分支切feature分支，持续开发，测试通过后，解决feature分支和master分支冲突后，执行merge master，master分支用于发布。



适用场景：

快速交付，但是质量难以保障（通过自动化测试，快速发现问题，快速修复来保证质量---比如谷歌浏览器就是使用这种分支模式）







#### **GitLab-Flow 模型**

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-11-19-23-image-20230711192334623.png" alt="image-20230711192334623" style="zoom:50%;" />

流程：

增加Pre-Production、Production分支，对应PRT和PROD环境，基于master新建feature开发分支，开发完成后merge到master分支，测试过程可在feature分支或master分支进行，从master合并到pre-production 分支上的代码合并到 production 分支上进行生产环境的部署。



### **主干开发模型 Trunk Based Development**（TBD）

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-11-19-24-image-20230711192402559.png" alt="image-20230711192402559" style="zoom:50%;" />

流程：

​	feature分支快速集成到master分支，当主干分支达到发布条件后，就从主干分支上拉出发布分支（release）进行版本发布。开发或测试过程中发现的代码缺陷也会直接在主干上进行修复，再根据实际需求 cherry pick 到特定的发布分支或是进行新版本发布。特点是快。



### **方案对比**

|              | 优势                                         | 劣势                                                         |
| ------------ | -------------------------------------------- | ------------------------------------------------------------ |
| 特性分支模型 | 分支规则明确开发周期宽松测试友好             | 分支管理复杂合并冲突多需要多个测试环境和资源                 |
| 主干分支模型 | 分支简洁，管理成本低上手容易冲突少迭代速度快 | 要求高的协作能力、解决问题能力、回滚方案、CR机制需要自动化测试 |





### 阿里的AoneFlow模型

AoneFlow模型是基于上述两种模型演变出来的一种新模型,核心内容如下:

1. master分支: 1个 主干分支
2. feature分支: 多个 特性分支
3. release分支: 多个 发布分支

工作流程:

1. 有新功能/缺陷时,基于master分支新建feature分支进行开发,
2. 发布时,**基于master分支新建release分支**,并将本次需要发布的feature分支合并入release分支,并基于此release分支发布
3. 将此release分支合并入master分支,并打tag标签 此操作发布前后进行都可
4. 线上突然出现bug时,基于master分支新建release分支,基于此release分支新建feature分支,修复后再合并入release分支,重复2.3步操作.
5. 删除release分支,删除release分支关联的feature分支.

可以总结:

AoneFlow是**通过release分支来关联feature分支**来做分支管理的.

目前AoneFlow是最贴合我们公司工作流程的.



## review形式

Ship/Show/Ask到底是什么：

1. 一种平衡技巧，合理使用的话让我们不必每次都去等MR的反馈，只要在反馈来临时关注即可
2. 从另一个角度去看分支管理策略。团队所采取的方法应该是在“Always Ship”和“Always Ask”这个区间内浮动的。

### Ship

Ship：merge into mainline without review

![image-20230713164108311](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-13-16-41-image-20230713164108311.png)

ship是不需要review的，直接合进Mainline，它其实是Continuous Integration的一种实践，

适用场景：

- 根据现有的逻辑增加了新特性（比如增加了一个枚举值）
- 修复了不值一提的bug（typo，checkStyle之类的）
- 更新了文档说明（修改了注释里的内容之类的）
- 基于之前的反馈修改的代码



### Show

Show：open a pull request for review, but merge into mainline immediately

![image-20230713164050866](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-13-16-40-image-20230713164050866.png)



Show会发起一个pull request，它会等提pr之后随之而来的一些自动化检查，比如是否有typo之类的，但它不会等任何人的反馈，自动化检查通过后直接合进Mainline。

这么做的原因在于，虽然我在合的时候不会让大家去做code review，但通过提pr，在我合完之后还是可以进行code review的环境，并且提pr的时候，团队对于你的动作是有感知的，他们可能当时不会看，但有空的时候依旧可以去看你这次pr记录。

适用场景：

- 提PR者希望大家对于他的代码给出一些反馈，比如还可以如何去提升效率
- 大家来欣赏下我新用的这种方法或是模式（炫技）
- 我重构了XX，重构后是这样的
- 这个bug有点意思，但还是被我拿下了，大家可以来看下我修复bug的方法



### Ask

Ask：open a pull request for discussion before merging

![image-20230713164023649](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-13-16-40-image-20230713164023649.png)

相比前两者Ask采取的就是较为严谨的方式，我们先提PR，然后等待团队的反馈，我们根据反馈再修改代码直至大家满意后再进行合并。

适用场景：

- 我不确定我改的这些代码对不对
- 大家对我使用的这种方法表示认同吗
- 我觉得有些地方还能进行优化，但我需要大家的帮助
- 今天的工作就到此为止了，我先暂停一下，明天再合代码

（大家做的应该都是Ask吧）











## [Git属性](https://gitee.com/progit/7-自定义-Git.html#7.2-Git属性)

一些设置项也能被运用于特定的路径中，这样，Git 以对一个特定的子目录或子文件集运用那些设置项。这些设置项被称为 Git 属性，可以在你目录中的`.gitattributes`文件内进行设置（通常是你项目的根目录），也可以当你不想让这些属性文件和项目文件一同提交时，在`.git/info/attributes`进行设置。

使用属性，你可以对个别文件或目录定义不同的合并策略，让 Git 知道怎样比较非文本文件，在你提交或签出前让 Git 过滤内容。你将在这部分了解到能在自己的项目中使用的属性，以及一些实例。

### 二进制文件

你可以用 Git 属性让其知道哪些是二进制文件（以防 Git 没有识别出来），以及指示怎样处理这些文件，这点很酷。例如，一些文本文件是由机器产生的，而且无法比较，而一些二进制文件可以比较 — 你将会了解到怎样让 Git 识别这些文件。

#### 识别二进制文件

一些文件看起来像是文本文件，但其实是作为二进制数据被对待。例如，在Mac上的Xcode项目含有一个以`.pbxproj`结尾的文件，它是由记录设置项的IDE写到磁盘的JSON数据集（纯文本javascript数据类型）。虽然技术上看它是由ASCII字符组成的文本文件，但你并不认为如此，因为它确实是一个轻量级数据库 — 如果有2人改变了它，你通常无法合并和比较内容，只有机器才能进行识别和操作，于是，你想把它当成二进制文件。

让 Git 把所有`pbxproj`文件当成二进制文件，在`.gitattributes`文件中设置如下：

```
*.pbxproj -crlf -diff
```

现在，Git 会尝试转换和修正CRLF（回车换行）问题，也不会当你在项目中运行git show或git diff时，比较不同的内容。在Git 1.6及之后的版本中，可以用一个宏代替`-crlf -diff`：

```
*.pbxproj binary
```

#### 比较二进制文件

在Git 1.6及以上版本中，你能利用 Git 属性来有效地比较二进制文件。可以设置 Git 把二进制数据转换成文本格式，用通常的diff来比较。

这个特性很酷，而且鲜为人知，因此我会结合实例来讲解。首先，要解决的是最令人头疼的问题：对Word文档进行版本控制。很多人对Word文档又恨又爱，如果想对其进行版本控制，你可以把文件加入到 Git 库中，每次修改后提交即可。但这样做没有一点实际意义，因为运行`git diff`命令后，你只能得到如下的结果：

```
$ git diff
    diff --git a/chapter1.doc b/chapter1.doc
    index 88839c4..4afcb7c 100644
    Binary files a/chapter1.doc and b/chapter1.doc differ
```

你不能直接比较两个不同版本的Word文件，除非进行手动扫描，不是吗？ Git 属性能很好地解决此问题，把下面的行加到`.gitattributes`文件：

```
*.doc diff=word
```

当你要看比较结果时，如果文件扩展名是"doc"，Git 调用"word"过滤器。什么是"word"过滤器呢？其实就是 Git 使用`strings` 程序，把Word文档转换成可读的文本文件，之后再进行比较：

```
$ git config diff.word.textconv strings
```

现在如果在两个快照之间比较以`.doc`结尾的文件，Git 对这些文件运用"word"过滤器，在比较前把Word文件转换成文本文件。

下面展示了一个实例，我把此书的第一章纳入 Git 管理，在一个段落中加入了一些文本后保存，之后运行`git diff`命令，得到结果如下：

```
$ git diff
    diff --git a/chapter1.doc b/chapter1.doc
    index c1c8a0a..b93c9e4 100644
    --- a/chapter1.doc
    +++ b/chapter1.doc
    @@ -8,7 +8,8 @@ re going to cover Version Control Systems (VCS) and Git basics
    re going to cover how to get it and set it up for the first time if you don
    t already have it on your system.
    In Chapter Two we will go over basic Git usage - how to use Git for the 80%
    -s going on, modify stuff and contribute changes. If the book spontaneously
    +s going on, modify stuff and contribute changes. If the book spontaneously
    +Let's see if this works.
```

Git 成功且简洁地显示出我增加的文本"Let’s see if this works"。虽然有些瑕疵，在末尾显示了一些随机的内容，但确实可以比较了。如果你能找到或自己写个Word到纯文本的转换器的话，效果可能会更好。 `strings`可以在大部分Mac和Linux系统上运行，所以它是处理二进制格式的第一选择。

你还能用这个方法比较图像文件。当比较时，对JPEG文件运用一个过滤器，它能提炼出EXIF信息 — 大部分图像格式使用的元数据。如果你下载并安装了`exiftool`程序，可以用它参照元数据把图像转换成文本。比较的不同结果将会用文本向你展示：

```
$ echo '*.png diff=exif' >> .gitattributes
    $ git config diff.exif.textconv exiftool
```

如果在项目中替换了一个图像文件，运行`git diff`命令的结果如下：

```
diff --git a/image.png b/image.png
    index 88839c4..4afcb7c 100644
    --- a/image.png
    +++ b/image.png
    @@ -1,12 +1,12 @@
    ExifTool Version Number : 7.74
    -File Size : 70 kB
    -File Modification Date/Time : 2009:04:21 07:02:45-07:00
    +File Size : 94 kB
    +File Modification Date/Time : 2009:04:21 07:02:43-07:00
    File Type : PNG
    MIME Type : image/png
    -Image Width : 1058
    -Image Height : 889
    +Image Width : 1056
    +Image Height : 827
    Bit Depth : 8
    Color Type : RGB with Alpha
```

你会发现文件的尺寸大小发生了改变。

### 关键字扩展

使用SVN或CVS的开发人员经常要求关键字扩展。在 Git 中，你无法在一个文件被提交后修改它，因为 Git 会先对该文件计算校验和。然而，你可以在签出时注入文本，在提交前删除它。 Git 属性提供了2种方式这么做。

首先，你能够把blob的SHA-1校验和自动注入文件的`$Id$`字段。如果在一个或多个文件上设置了此字段，当下次你签出分支的时候，Git 用blob的SHA-1值替换那个字段。注意，这不是提交对象的SHA校验和，而是blob本身的校验和：

```
$ echo '*.txt ident' >> .gitattributes
    $ echo '$Id$' > test.txt
```

下次签出文件时，Git 入了blob的SHA值：

```
$ rm text.txt
    $ git checkout -- text.txt
    $ cat test.txt
    $Id: 42812b7653c7b88933f8a9d6cad0ca16714b9bb3 $
```

然而，这样的显示结果没有多大的实际意义。这个SHA的值相当地随机，无法区分日期的前后，所以，如果你在CVS或Subversion中用过关键字替换，一定会包含一个日期值。

因此，你能写自己的过滤器，在提交文件到暂存区或签出文件时替换关键字。有2种过滤器，"clean"和"smudge"。在 `.gitattributes`文件中，你能对特定的路径设置一个过滤器，然后设置处理文件的脚本，这些脚本会在文件签出前（"smudge"，见图 7-2）和提交到暂存区前（"clean"，见图7-3）被调用。这些过滤器能够做各种有趣的事。



![img](https://gitee.com/progit/figures/18333fig0702-tn.png)


图7-2. 签出时，“smudge”过滤器被触发。





![img](https://gitee.com/progit/figures/18333fig0703-tn.png)


图7-3. 提交到暂存区时，“clean”过滤器被触发。



这里举一个简单的例子：在暂存前，用`indent`（缩进）程序过滤所有C源代码。在`.gitattributes`文件中设置"indent"过滤器过滤`*.c`文件：

```
*.c filter=indent
```

然后，通过以下配置，让 Git 知道"indent"过滤器在遇到"smudge"和"clean"时分别该做什么：

```
$ git config --global filter.indent.clean indent
    $ git config --global filter.indent.smudge cat
```

于是，当你暂存`*.c`文件时，`indent`程序会被触发，在把它们签出之前，`cat`程序会被触发。但`cat`程序在这里没什么实际作用。这样的组合，使C源代码在暂存前被`indent`程序过滤，非常有效。

另一个例子是类似RCS的`$Date$`关键字扩展。为了演示，需要一个小脚本，接受文件名参数，得到项目的最新提交日期，最后把日期写入该文件。下面用Ruby脚本来实现：

```
#! /usr/bin/env ruby
    data = STDIN.read
    last_date = `git log --pretty=format:"%ad" -1`
    puts data.gsub('$Date$', '$Date: ' + last_date.to_s + '$')
```

该脚本从`git log`命令中得到最新提交日期，找到文件中的所有`$Date$`字符串，最后把该日期填充到`$Date$`字符串中 — 此脚本很简单，你可以选择你喜欢的编程语言来实现。把该脚本命名为`expand_date`，放到正确的路径中，之后需要在 Git 中设置一个过滤器（`dater`），让它在签出文件时调用`expand_date`，在暂存文件时用Perl清除之：

```
$ git config filter.dater.smudge expand_date
    $ git config filter.dater.clean 'perl -pe "s/\\\$Date[^\\\$]*\\\$/\\\$Date\\\$/"'
```

这个Perl小程序会删除`$Date$`字符串里多余的字符，恢复`$Date$`原貌。到目前为止，你的过滤器已经设置完毕，可以开始测试了。打开一个文件，在文件中输入`$Date$`关键字，然后设置 Git 属性：

```
$ echo '# $Date$' > date_test.txt
    $ echo 'date*.txt filter=dater' >> .gitattributes
```

如果暂存该文件，之后再签出，你会发现关键字被替换了：

```
$ git add date_test.txt .gitattributes
    $ git commit -m "Testing date expansion in Git"
    $ rm date_test.txt
    $ git checkout date_test.txt
    $ cat date_test.txt
    # $Date: Tue Apr 21 07:26:52 2009 -0700$
```

虽说这项技术对自定义应用来说很有用，但还是要小心，因为`.gitattributes`文件会随着项目一起提交，而过滤器（例如：`dater`）不会，所以，过滤器不会在所有地方都生效。当你在设计这些过滤器时要注意，即使它们无法正常工作，也要让整个项目运作下去。

### 导出仓库

Git属性在导出项目归档时也能发挥作用。

#### export-ignore

当产生一个归档时，可以设置 Git 不导出某些文件和目录。如果你不想在归档中包含一个子目录或文件，但想他们纳入项目的版本管理中，你能对应地设置`export-ignore`属性。

例如，在`test/`子目录中有一些测试文件，在项目的压缩包中包含他们是没有意义的。因此，可以增加下面这行到 Git 属性文件中：

```
test/ export-ignore
```

现在，当运行git archive来创建项目的压缩包时，那个目录不会在归档中出现。

#### export-subst

还能对归档做一些简单的关键字替换。在第2章中已经可以看到，可以以`--pretty=format`形式的简码在任何文件中放入`$Format:$` 字符串。例如，如果想在项目中包含一个叫作`LAST_COMMIT`的文件，当运行`git archive`时，最后提交日期自动地注入进该文件，可以这样设置：

```
$ echo 'Last commit date: $Format:%cd$' > LAST_COMMIT
    $ echo "LAST_COMMIT export-subst" >> .gitattributes
    $ git add LAST_COMMIT .gitattributes
    $ git commit -am 'adding LAST_COMMIT file for archives'
```

运行`git archive`后，打开该文件，会发现其内容如下：

```
$ cat LAST_COMMIT
    Last commit date: $Format:Tue Apr 21 08:38:48 2009 -0700$
```

### 合并策略

通过 Git 属性，还能对项目中的特定文件使用不同的合并策略。一个非常有用的选项就是，当一些特定文件发生冲突，Git 会尝试合并他们，而使用你这边的合并。

如果项目的一个分支有歧义或比较特别，但你想从该分支合并，而且需要忽略其中某些文件，这样的合并策略是有用的。例如，你有一个数据库设置文件database.xml，在2个分支中他们是不同的，你想合并一个分支到另一个，而不弄乱该数据库文件，可以设置属性如下：

```
database.xml merge=ours
```

如果合并到另一个分支，database.xml文件不会有合并冲突，显示如下：

```
$ git merge topic
    Auto-merging database.xml
    Merge made by recursive.
```

这样，database.xml会保持原样。



## github贡献代码流程

1. **选择一个项目**：

   首先，选择你有兴趣或者你认为有价值的开源项目。你可以在 GitHub 上的探索页面、开源社区的网站、或者通过朋友或同事的推荐来找到项目。选择一个与你熟悉或感兴趣的项目会更容易入手。

2. **分支项目**：

   在 GitHub 上，你不会直接修改主项目（通常是 `master` 或 `main` 分支）的代码。你需要创建一个属于你的分支（branch），在该分支上进行修改。分支可以保持你的工作独立，以便后续的审查和合并。

   - 转到项目的 GitHub 页面。
   - 点击 "Fork" 按钮，这将会复制项目到你的 GitHub 账户中。

3. **克隆你的分支**：

   使用 Git 将你的分支克隆（clone）到本地计算机。这将创建一个本地的副本，让你在本地进行修改。

   ```
   bashCopy code
   git clone https://github.com/你的用户名/项目名.git
   ```

4. **创建一个新分支**：

   在你克隆的项目中，创建一个新分支来进行你的工作。

   ```
   bashCopy code
   git checkout -b 你的分支名
   ```

5. **进行修改**：

   在本地分支上进行你的代码修改。根据项目的规定，你可以修复错误、添加新功能或者进行文档改进等。

6. **提交你的修改**：

   使用以下命令将你的修改提交到你的分支：

   ```
   bashCopy code
   git add .
   git commit -m "描述你的修改"
   ```

7. **推送你的修改**：

   将你的分支和修改推送到你的 GitHub 副本：

   ```
   bashCopy code
   git push origin 你的分支名
   ```

8. **创建 Pull Request**：

   转到项目的 GitHub 页面，点击 "New Pull Request" 按钮。这将打开一个页面，让你选择你的分支和目标分支（通常是主项目的 `master` 或 `main` 分支），然后描述你的修改。点击 "Create Pull Request" 完成请求的创建。

9. **等待审查**：

   项目维护者或其他贡献者会检查你的 Pull Request，提供反馈或建议修改。你可能需要根据他们的建议进行修改。

10. **合并你的 Pull Request**：

    一旦你的 Pull Request 被审核并通过，项目维护者会将你的修改合并到主项目中。





# 更改

## [储藏(git stash)](https://gitee.com/progit/6-Git-工具.html#6.3-储藏（Stashing）)

### 储藏变更

现在你想切换分支，但是你还不想提交你正在进行中的工作；所以你储藏这些变更。为了往堆栈推送一个新的储藏，只要运行 `git stash`：

```
$ git stash
    Saved working directory and index state \
    "WIP on master: 049d078 added the index file"
    HEAD is now at 049d078 added the index file
    (To restore them type "git stash apply")
```

你的工作目录就干净了：

```
$ git status
    # On branch master
    nothing to commit (working directory clean)
```

### 查看现有的储藏 `git stash list`

```
$ git stash list
    stash@{0}: WIP on master: 049d078 added the index file
    stash@{1}: WIP on master: c264051... Revert "added file_size"
    stash@{2}: WIP on master: 21d80a5... added number to log
```

### 应用储藏`git stash apply`

在上面的案例中，之前已经进行了两次储藏，所以你可以访问到三个不同的储藏。你可以重新应用你刚刚实施的储藏，所采用的命令就是之前在原始的 stash 命令的帮助输出里提示的：`git stash apply`。如果你想应用更早的储藏，你可以通过名字指定它，像这样：`git stash apply stash@{2}`。如果你不指明，Git 默认使用最近的储藏并尝试应用它。

> 你可以在其中一个分支上保留一份储藏，随后切换到另外一个分支，再重新应用这些变更。在工作目录里包含已修改和未提交的文件时，你也可以应用储藏——Git 会给出归并冲突如果有任何变更无法干净地被应用。



apply 选项只尝试应用储藏的工作——储藏的内容仍然在栈上。要移除它，你可以运行 `git stash drop`，加上你希望移除的储藏的名字：

```
$ git stash list
    stash@{0}: WIP on master: 049d078 added the index file
    stash@{1}: WIP on master: c264051... Revert "added file_size"
    stash@{2}: WIP on master: 21d80a5... added number to log
    $ git stash drop stash@{0}
    Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)
```

你也可以运行 `git stash pop` 来重新应用储藏，同时立刻将其从堆栈中移走。





### 取消储藏

在某些情况下，你可能想应用储藏的修改，在进行了一些其他的修改后，又要取消之前所应用储藏的修改。可以通过取消该储藏的补丁达到这样的效果

```
$ git stash show -p stash@{0} | git apply -R
```

同样的，如果你沒有指定具体的某个储藏，Git 会选择最近的储藏：

```
$ git stash show -p | git apply -R
```

你可能会想要新建一个別名，在你的 Git 里增加一个 `stash-unapply` 命令，这样更有效率。例如：

```
$ git config --global alias.stash-unapply '!git stash show -p | git apply -R'
```

### 从储藏中创建分支

如果你储藏了一些工作，暂时不去理会，然后继续在你储藏工作的分支上工作，你在重新应用工作时可能会碰到一些问题。如果尝试应用的变更是针对一个你那之后修改过的文件，你会碰到一个归并冲突并且必须去化解它。如果你想用更方便的方法来重新检验你储藏的变更，你可以运行 `git stash branch`，这会创建一个新的分支，检出你储藏工作时的所处的提交，重新应用你的工作，如果成功，将会丢弃储藏。

```sh
$ git stash branch testchanges
    Switched to a new branch "testchanges"
    # On branch testchanges
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: index.html
    #
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    #
    # modified: lib/simplegit.rb
    #
    Dropped refs/stash@{0} (f0dfc4d5dc332d1cee34a634182e168c4efc3359)
```

这是一个很棒的捷径来恢复储藏的工作然后在新的分支上继续当时的工作。









## [记录每次更新到仓库(commit)](https://gitee.com/progit/2-Git-基础.html#2.2-记录每次更新到仓库)

### git如何记录变更

这是 git 应对变化的艺术，也是持久化数据结构的核心思想：**Git 快照保存文件索引，而不会保存文件本身。变化的文件将拥有新的存储空间+新的索引，不变的文件将永远呆在原地。**



在创建 commit 时，git 会对整个项目的所有文件做一个“快照”。

但“快照”究竟是什么？“快照”记录的并不是文件的内容，而是文件的索引。

当 commit 发生时， git 会保存当前版本所有文件的索引。

对于那些没有发生变化的文件，git 保存他们原有的索引；对于那些已经发生变化的文件，git 会保存变化后的文件的索引。

假设一个项目中有 A、B 两个文件，其中 A 文件被修改了，而 B 文件保持不变。

我们将修改后的新的 A 文件的索引记为 A'。在变化发生后，A 和 A' 是共存的，变化前的那一次快照指向 A，变化后的这一次快照指向 A'。而未被修改到的 B 文件，将会原封不动地呆在原地，被新版本的快照所复用。

也就是说，git 记录“变更”的粒度是文件级别的。它会同时保有新老两份文件，不同的 version，指向不同的文件。







### 概述

工作目录下面的所有文件都不外乎这两种状态：已跟踪或未跟踪。

已跟踪的文件是指本来就被纳入版本控制管理的文件，在上次快照中有它们的记录，工作一段时间后，它们的状态可能是未更新，已修改或者已放入暂存区。而所有其他文件都属于未跟踪文件。它们既没有上次更新时的快照，也不在当前的暂存区域。初次克隆某个仓库时，工作目录中的所有文件都属于已跟踪文件，且状态为未修改。

在编辑过某些文件之后，Git 将这些文件标为已修改。我们逐步把这些修改过的文件放到暂存区域，直到最后一次性提交所有这些暂存起来的文件，如此重复。所以使用 Git 时的文件状态变化周期如图。

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221029191612627.png" alt="image-20221029191612627" style="zoom:50%;" />



### 检查当前文件状态

要确定哪些文件当前处于什么状态，可以用 `git status` 命令。如果在克隆仓库之后立即执行此命令，会看到类似这样的输出：

```shell
$ git status
    # On branch master
    nothing to commit (working directory clean)
```

这说明你现在的工作目录相当干净。换句话说，所有已跟踪文件在上次提交后都未被更改过。此外，上面的信息还表明，当前目录下没有出现任何处于未跟踪的新文件，否则 Git 会在这里列出来。最后，该命令还显示了当前所在的分支是 `master`

现在让我们用 vim 创建一个新文件 README，保存退出后运行 `git status` 会看到该文件出现在未跟踪文件列表中：

```shell
$ vim README
    $ git status
    # On branch master
    # Untracked files:
    # (use "git add <file>..." to include in what will be committed)
    #
    # README
    nothing added to commit but untracked files present (use "git add" to track)
```



### 跟踪新文件

使用命令 `git add` 开始跟踪一个新文件。

```shell
$ git add README
```

此时再运行 `git status` 命令，会看到 README 文件已被跟踪，并处于暂存状态：

```shell
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    #
```

只要在 “Changes to be committed” 这行下面的，就说明是已暂存状态。如果此时提交，那么该文件此时此刻的版本将被留存在历史记录中。在 `git add` 后面可以指明要跟踪的文件或目录路径。如果是目录的话，就说明要递归跟踪该目录下的所有文件。



### 暂存已修改文件

现在我们修改下之前已跟踪过的文件 `benchmarks.rb`，然后再次运行 `status` 命令，会看到这样的状态报告：

```shell
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    #
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    #
    # modified: benchmarks.rb
    #
```

文件 `benchmarks.rb` 出现在 “Changes not staged for commit” 这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。要暂存这次更新，需要运行<font color="red"> `git add` 命令（这是个多功能命令，根据目标文件的状态不同，此命令的效果也不同：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等）</font>。

现在让我们运行 `git add` 将 benchmarks.rb 放到暂存区，然后再看看 `git status` 的输出：

```shell
$ git add benchmarks.rb
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    # modified: benchmarks.rb
    #
```

现在两个文件都已暂存，下次提交时就会一并记录到仓库。假设此时，你想要在 `benchmarks.rb` 里再加条注释，重新编辑存盘后，再运行 `git status` 看看：

```shell
$ vim benchmarks.rb
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    # modified: benchmarks.rb
    #
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    #
    # modified: benchmarks.rb
    #
```

怎么回事？ `benchmarks.rb` 文件出现了两次！一次算未暂存，一次算已暂存。好吧，实际上 Git 只不过暂存了你运行 `git add` 命令时的版本，如果现在提交，那么提交的是添加注释前的版本，而非当前工作目录中的版本。所以，运行了 `git add` 之后又作了修订的文件，需要重新运行 `git add` 把最新版本重新暂存起来：

```shell
$ git add benchmarks.rb
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    # modified: benchmarks.rb
    #
```

### 暂存文件的某些部分而忽略其他

只让Git暂存文件的某些部分而忽略其他也是有可能的。例如，你对simplegit.rb文件作了两处修改但是只想暂存其中一个而忽略另一个。可以在命令行下通过`git add -p`或者`git add --patch`。

详情可见这里的暂存补丁部分[交互式暂存](https://gitee.com/progit/6-Git-工具.html#6.2-交互式暂存)





### 忽略某些文件

一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。我们可以创建一个名为 `.gitignore` 的文件，列出要忽略的文件模式。来看一个实际的例子：

```shell
$ cat .gitignore
    *.[oa]
    *~
```

第一行告诉 Git 忽略所有以 `.o` 或 `.a` 结尾的文件。第二行告诉 Git 忽略所有以波浪符（`~`）结尾的文件。此外，你可能还需要忽略 `log`，`tmp` 或者 `pid` 目录，以及自动生成的文档等等。要养成一开始就设置好 `.gitignore` 文件的习惯，以免将来误提交这类无用的文件。

文件 `.gitignore` 的格式规范如下：

- 所有空行或者以注释符号 `＃` 开头的行都会被 Git 忽略。
- 可以使用标准的 glob 模式匹配。
- 匹配模式最后跟反斜杠（`/`）说明要忽略的是目录。

我们再看一个 `.gitignore` 文件的例子：

```shell
# 此为注释 – 将被 Git 忽略
# 忽略所有 .a 结尾的文件
*.a
# 但 lib.a 除外
!lib.a
# 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
/TODO
# 忽略 build/ 目录下的所有文件
build/
# 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
doc/*.txt
```



### 查看已暂存和未暂存的更新

不加参数直接输入 `git diff`：此命令比较的是工作目录中当前文件和暂存区域快照之间的差异，也就是修改之后还没有暂存起来的变化内容。

 `git diff --cached` ：看已经暂存起来的文件和上次提交时的快照之间的差异。（Git 1.6.1 及更高版本还允许使用 `git diff --staged`，效果是相同的。）



### <span id='commit'>提交更新</span>

#### 介绍

commit（名词）是 Git 中最基本的单位。包括了一次提交的所有信息，如 commit id, 父结点，diff，commit message，author 等一堆信息（一旦生成，绝不修改）。commit 包含 diff, 有可能两个 commit 的 Diff 完全一样，但是却是两个完全不同的 commit。

commit (动词) 是把当前寄存的修改生成一个新的 commit 结点，并把 HEAD及所在 Branch 指向这个结点。

<font color="red">git 的每一次提交都是存放的代码在该次提交之后发生的变化，而不是整个项目的最新代码。每次提交都是基于之前提交的快照（snapshot）进行的，因此每个提交只包含了相应的变化。以后可以回到这个状态，或者进行比较。</font>

#### `git commit`

每次准备提交前，先用 `git status` 看下，是不是都已暂存起来了，然后再运行提交命令 `git commit`。

这种方式会启动文本编辑器以便输入本次提交的说明。

编辑器会显示类似下面的文本信息（本例选用 Vim 的屏显方式展示）：

```
# Please enter the commit message for your changes. Lines starting
    # with '#' will be ignored, and an empty message aborts the commit.
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # new file: README
    # modified: benchmarks.rb
    ~
    ~
    ~
    ".git/COMMIT_EDITMSG" 10L, 283C
```

可以看到，默认的提交消息包含最后一次运行 `git status` 的输出，放在注释行里，另外开头还有一空行，供你输入提交说明。（如果觉得这还不够，可以用 `-v` 选项将修改差异的每一行都包含到注释中来。）退出编辑器时，Git 会丢掉注释行，将说明内容和本次更新提交到仓库。



#### `git commit -m`

也可以用 -m 参数后跟提交说明的方式，在一行命令中提交更新：

```
$ git commit -m "Story 182: Fix benchmarks for speed"
```

提交后它会告诉你，当前是在哪个分支（master）提交的，本次提交的完整 SHA-1 校验和是什么（`463dc4f`），以及在本次提交中，有多少文件修订过，多少行添改和删改过。



#### `git commit -am`

```sh
# 等同于 git add . && git commit -m
git commit -am
```







### git commit 规范格式

比较大众化的 commit 格式无非有两种：

```sql
$ <commit-type>[(commit-scope)]: <commit-message>
$ <commit-icon>: <commit-message>
```

`<commit-type>`常见为：

- chore：构建配置相关。
- docs：文档相关。
- feat：添加新功能。
- fix：修复 bug。
- pref：性能相关。
- refactor：代码重构，一般如果不是其他类型的 commit，都可以归为重构。
- revert：分支回溯。
- style：样式相关。
- test：测试相关。

`[(commit-scope)]` 可选，表示范围，例如：`refactor(cli)`，表示关于 cli 部分的代码重构。

`<commit-message>` 提交记录的信息，有些规范可能会要求首字母大写。

`<commit-icon>` 用图标来替代 `<commit-type>` 所表示的功能。

所以，你可能经常可以在 GitHub 上看到类似下面的 commit 格式信息：

```makefile
feat: add a new feature xxx
fix: fix issue xxx
refactor: rewrite the code of xxx
fix(testing): correct testing code of xxx

# 有些 commit 信息首字母会大写
feat: Add a new feature xxx
fix: Fix issue xxx
refactor: Rewrite the code of xxx
fix(testing): Correct testing code of xxx

# 有些使用 icon 来替代 commit 类型
:sparkles: Add a new feature
:bug: Fix issue xxx
:recycle: Rewrite the code of xxx
```



#### angular规范

commit message包括三个部分：Header、Body、Footer三个部分

<img src="https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/upic/2023-07-11-20-13-image-20230711201351874.png" alt="image-20230711201351874" style="zoom:50%;" />





















### 跳过使用暂存区域

Git 提供了一个跳过使用暂存区域的方式，只要在提交的时候，给 `git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤：

```shell
$ git status
    # On branch master
    #
    # Changes not staged for commit:
    #
    # modified: benchmarks.rb
    #
$ git commit -a -m 'added new benchmarks'
    [master 83e38c7] added new benchmarks
    1 files changed, 5 insertions(+), 0 deletions(-)
```



### 移除文件

#### 情况1: 从工作目录和git 中删掉某个文件

要从 Git 中移除某个文件，就必须要从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提交。

只从工作目录中手工删除文件，运行 `git status` 时就会在 “Changes not staged for commit” 部分（也就是*未暂存*清单）看到：

```shell
$ rm grit.gemspec
    $ git status
    # On branch master
    #
    # Changes not staged for commit:
    # (use "git add/rm <file>..." to update what will be committed)
    #
    # deleted: grit.gemspec
    #
```

然后再运行 `git rm` 记录此次移除文件的操作：

```shell
$ git rm grit.gemspec
    rm 'grit.gemspec'
    $ git status
    # On branch master
    #
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # deleted: grit.gemspec
    #
```

最后提交的时候，该文件就不再纳入版本管理了。如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 `-f`。

#### 情况2: 仅从跟踪清单中删除。

用 `--cached` 选项即可：

```shell
$ git rm --cached readme.txt
```

后面可以列出文件或者目录的名字，也可以使用 glob 模式。比方说：

```shell
$ git rm log/\*.log
```

注意到星号 `*` 之前的反斜杠 `\`，因为 Git 有它自己的文件模式扩展匹配方式，所以我们不用 shell 来帮忙展开（译注：实际上不加反斜杠也可以运行，只不过按照 shell 扩展的话，仅仅删除指定目录下的文件而不会递归匹配。上面的例子本来就指定了目录，所以效果等同，但下面的例子就会用递归方式匹配，所以必须加反斜杠。）。此命令删除所有 `log/` 目录下扩展名为 `.log` 的文件。类似的比如：

```shell
$ git rm \*~  #会递归删除当前目录及其子目录中所有 `~` 结尾的文件。
```



### 移动文件

Git 并不跟踪文件移动操作。如果在 Git 中重命名了某个文件，仓库中存储的元数据并不会体现出这是一次改名操作。

要在 Git 中对文件改名，可以这么做：

```shell
$ git mv file_from file_to
```

此时查看状态信息，也会看到关于重命名操作的说明：

```shell
$ git mv README.txt README
    $ git status
    # On branch master
    # Your branch is ahead of 'origin/master' by 1 commit.
    #
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # renamed: README.txt -> README
    #
```

其实，运行 `git mv` 就相当于运行了下面三条命令：

```shell
$ mv README.txt README
$ git rm README.txt
$ git add README
```

如此分开操作，Git 也会意识到这是一次改名。当然，直接用 `git mv` 轻便得多，不过有时候用其他工具批处理改名的话，要记得在提交前删除老的文件名，再添加新的文件名。





## [查看提交历史](https://gitee.com/progit/2-Git-基础.html#2.3-查看提交历史) `git log` 

在提交了若干更新之后，又或者克隆了某个项目，想回顾下提交历史，可以使用 `git log` 命令查看。

默认不用任何参数的话，`git log` 会按提交时间列出所有的更新，最近的更新排在最上面。每次更新都有一个 SHA-1 校验和、作者的名字和电子邮件地址、提交时间，最后缩进一个段落显示提交说明。

### `git log` 定制输出格式的选项

`git log` 有许多选项可以帮助你搜寻感兴趣的提交，接下来我们介绍些最常用的。

#### `-p`

 `-p` 选项展开显示每次提交的内容差异，用 `-2` 则仅显示最近的两次更新：

```shell
$ git log -p -2
    commit ca82a6dff817ec66f44342007202690a93763949
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Mon Mar 17 21:52:11 2008 -0700

    changed the version number

    diff --git a/Rakefile b/Rakefile
    index a874b73..8f94139 100644
    --- a/Rakefile
    +++ b/Rakefile
    @@ -5,7 +5,7 @@ require 'rake/gempackagetask'
    spec = Gem::Specification.new do |s|
    - s.version = "0.1.0"
    + s.version = "0.1.1"
    s.author = "Scott Chacon"

    commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test code

    diff --git a/lib/simplegit.rb b/lib/simplegit.rb
    index a0a60ae..47c6340 100644
    --- a/lib/simplegit.rb
    +++ b/lib/simplegit.rb
    @@ -18,8 +18,3 @@ class SimpleGit
    end

    end
    -
    -if $0 == __FILE__
    - git = SimpleGit.new
    - puts git.show
    -end
    \ No newline at end of file
```

####  `--stat`

仅显示简要的增改行数统计。每个提交都列出了修改过的文件，以及其中添加和移除的行数，并在最后列出所有增减行数小计

```shell
$ git log --stat
    commit ca82a6dff817ec66f44342007202690a93763949
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Mon Mar 17 21:52:11 2008 -0700

    changed the version number

    Rakefile | 2 +-
    1 files changed, 1 insertions(+), 1 deletions(-)

    commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test code

    lib/simplegit.rb | 5 -----
    1 files changed, 0 insertions(+), 5 deletions(-)

    commit a11bef06a3f659402fe7563abf99ad00de2209e6
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sat Mar 15 10:31:28 2008 -0700

    first commit

    README | 6 ++++++
    Rakefile | 23 +++++++++++++++++++++++
    lib/simplegit.rb | 25 +++++++++++++++++++++++++
    3 files changed, 54 insertions(+), 0 deletions(-)
```

####  `--pretty` 

可以指定使用完全不同于默认格式的方式展示提交历史。比如用 `oneline` 将每个提交放在一行显示，这在提交数很大时非常有用。另外还有 `short`，`full` 和 `fuller` 可以用，展示的信息或多或少有些不同

```
$ git log --pretty=oneline
    ca82a6dff817ec66f44342007202690a93763949 changed the version number
    085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test code
    a11bef06a3f659402fe7563abf99ad00de2209e6 first commit
```

但最有意思的是 `format`，可以定制要显示的记录格式，这样的输出便于后期编程提取分析，像这样：

```
$ git log --pretty=format:"%h - %an, %ar : %s"
    ca82a6d - Scott Chacon, 11 months ago : changed the version number
    085bb3b - Scott Chacon, 11 months ago : removed unnecessary test code
    a11bef0 - Scott Chacon, 11 months ago : first commit
```

表 2-1 列出了常用的格式占位符写法及其代表的意义。

```
选项 说明
    %H 提交对象（commit）的完整哈希字串
    %h 提交对象的简短哈希字串
    %T 树对象（tree）的完整哈希字串
    %t 树对象的简短哈希字串
    %P 父对象（parent）的完整哈希字串
    %p 父对象的简短哈希字串
    %an 作者（author）的名字
    %ae 作者的电子邮件地址
    %ad 作者修订日期（可以用 -date= 选项定制格式）
    %ar 作者修订日期，按多久以前的方式显示
    %cn 提交者(committer)的名字
    %ce 提交者的电子邮件地址
    %cd 提交日期
    %cr 提交日期，按多久以前的方式显示
    %s 提交说明
```

作者指的是实际作出修改的人，提交者指的是最后将此工作成果提交到仓库的人。

用 oneline 或 format 时结合 `--graph` 选项，可以看到开头多出一些 ASCII 字符串表示的简单图形，形象地展示了每个提交所在的分支及其分化衍合情况。在我们之前提到的 Grit 项目仓库中可以看到：

```shell
$ git log --pretty=format:"%h %s" --graph
    * 2d3acf9 ignore errors from SIGCHLD on trap
    * 5e3ee11 Merge branch 'master' of git://github.com/dustin/grit
    |\
    | * 420eac9 Added a method for getting the current branch.
    * | 30e367c timeout code and tests
    * | 5a09431 add timeout protection to grit
    * | e1193f8 support for heads with slashes in them
    |/
    * d6016bc require time for xmlschema
    * 11d191e Merge branch 'defunkt' into local
```



#### 其他选项

其他常用的选项及其释义。

```shell
选项 说明
    -p 按补丁格式显示每个更新之间的差异。
    --stat 显示每次更新的文件修改统计信息。
    --shortstat 只显示 --stat 中最后的行数修改添加移除统计。
    --name-only 仅在提交信息后显示已修改的文件清单。
    --name-status 显示新增、修改、删除的文件清单。
    --abbrev-commit 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符。
    --relative-date 使用较短的相对时间显示（比如，“2 weeks ago”）。
    --graph 显示 ASCII 图形表示的分支合并历史。
    --pretty 使用其他格式显示历史提交信息。可用的选项包括 oneline，short，full，fuller 和 format（后跟指定格式）。
```





### `git log`限制输出长度的选项

`git log` 还有许多非常实用的限制输出长度的选项，也就是只输出部分提交信息。之前我们已经看到过 `-2` 了，它只显示最近的两条提交，实际上，这是 `-<n>` 选项的写法，其中的 `n` 可以是任何自然数，表示仅显示最近的若干条提交。

### `git log`按照时间作限制的选项

比如 `--since` 和 `--until`。下面的命令列出所有最近两周内的提交：

```shell
$ git log --since=2.weeks
```

你可以给出各种时间格式，比如说具体的某一天（“2008-01-15”），或者是多久以前（“2 years 1 day 3 minutes ago”）。

### 搜索条件选项

用 `--author` 选项显示指定作者的提交，用 `--grep` 选项搜索提交说明中的关键字。（请注意，如果要得到同时满足这两个选项搜索条件的提交，就必须用 `--all-match` 选项。否则，满足任意一个条件的提交都会被匹配出来）

### 路径(path)选项

如果只关心某些文件或者目录的历史提交，可以在 `git log` 选项的最后指定它们的路径。因为是放在最后位置上的选项，所以用两个短划线（`--`）隔开之前的选项和后面限定的路径名。



### 其他选项

其他常用的类似选项。

```
选项 说明
    -(n) 仅显示最近的 n 条提交
    --since, --after 仅显示指定时间之后的提交。
    --until, --before 仅显示指定时间之前的提交。
    --author 仅显示指定作者相关的提交。
    --committer 仅显示指定提交者相关的提交。
```

### 来看一个实际的例子

如果要查看 Git 仓库中，2008 年 10 月期间，Junio Hamano 提交的但未合并的测试脚本（位于项目的 t/ 目录下的文件），可以用下面的查询命令：

```shell
$ git log --pretty="%h - %s" --author=gitster --since="2008-10-01" \
    --before="2008-11-01" --no-merges -- t/
    5610e3b - Fix testcase failure when extended attribute
    acd3b9e - Enhance hold_lock_file_for_{update,append}()
    f563754 - demonstrate breakage of detached checkout wi
    d1a43f2 - reset --hard/read-tree --reset -u: remove un
    51a94af - Fix "checkout --track -b newbranch" on detac
    b0ad11e - pull: allow "git pull origin $something:$cur
```





### 使用图形化工具查阅提交历史

有时候图形化工具更容易展示历史提交的变化，随 Git 一同发布的 gitk 就是这样一种工具。它是用 Tcl/Tk 写成的，基本上相当于 `git log` 命令的可视化版本，凡是 `git log` 可以用的选项也都能用在 gitk 上。在项目工作目录中输入 gitk 命令后，就会启动图 2-2 所示的界面。

![img](https://gitee.com/progit/figures/18333fig0202-tn.png)


图 2-2. gitk 的图形界面

上半个窗口显示的是历次提交的分支祖先图谱，下半个窗口显示当前点选的提交对应的具体差异。











## [撤消操作](https://gitee.com/progit/2-Git-基础.html#2.4-撤消操作)(只要是push了的都只能在本地改完后用push --force来修改了)

任何已经提交到 Git 的都可以被恢复。所以，你可能失去的数据，仅限于没有提交过的，对 Git 来说它们就像从未存在过一样。

### <span id="撤销最后一次提交">修改最后一次提交</span>

#### 刚commit还没有push

##### 修改上次提交的信息或者内容

图示：

```
C0 -- C1
	\-- C1' (HEAD)
```

C1 是原来的提交，ammend 之后，生成了 C1'，但是 C1 还在。甚至 C1 和 C1' 的 diff 都完全一样 (比如只修改 commit message)。



修改刚才的提交操作，可以使用 `--amend` 选项重新提交：

```shell
$ git commit --amend
```

此命令将使用当前的暂存区域快照提交。会进入vim编辑器看到上次提交时的说明，点击i编辑它，修改commit信息后，确认没问题后保存退出，点击esc，输入ZZ退出。就会使用新的提交说明覆盖刚才失误的提交。

如果刚才提交时忘了暂存某些修改，可以<font color="red">先</font>补上暂存操作，然后再运行 `--amend` 提交：

```shell
$ git add forgotten_file
$ git commit --amend
```



##### 场景--撤销上次提交

1. `git reset --soft HEAD^`。 详情看reset

![git6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/843c54ebbc5643fba64ee5142f6be420~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)



##### 场景--撤销上次提交的部分修改

1. 使用 `git reset --soft HEAD^` 命令将当前分支的指针移动到上一个提交，并保留上一个提交所做的更改。
2. 使用 `git add` 命令添加需要保留的更改，不需要保留的更改可以忽略。
3. 使用 `git commit -c ORIG_HEAD` 命令创建新的提交，并包含原始提交的消息和元数据。









#### 刚push，修改最近一次commit

##### 改commit信息

git commit --amend

会进入vim编辑器，点击i，修改commit信息后，点击esc，输入ZZ退出。

再强推：git push origin HEAD:master --force



##### 撤销远程的最后一次commit

要将远程仓库回退到倒数第二次的提交，你可以按照以下步骤进行操作：

1. 首先，使用以下命令查看提交历史记录，找到你需要回退的提交的哈希值：

   ```
   git log
   ```

2. 复制倒数第二次提交的哈希值。

3. 使用以下命令将远程仓库回退到该提交：

   ```
   git reset --hard <commit-hash>
   ```

   将`<commit-hash>`替换为你复制的倒数第二次提交的哈希值。

4. 最后，使用以下命令将更改推送到远程仓库：

   ```
   git push origin master --force
   ```

   这将强制推送更改到远程仓库。

请注意，这将会修改远程仓库的历史记录，如果其他人也在使用该仓库，可能会对其产生影响。确保在进行此操作之前，与团队成员进行沟通，并确保大家都知道并同意这个修改。



### 修改历史commit

git rebase -i HEAD~3 表示要修改当前版本的倒数第三次状态.

`-i`是指交互式。(点击esc，输入ZZ退出) (通过这个界面你就可以看到有啥操作了)

这时通过git log你可以发现，git的最后一次提交会变成你选了`edit`的那个了



比如：想修改倒数第5次commit，可以用git rebase -i 将倒数四次的commit都squash到倒数第五次上，然后在git reset 就可以直接改原来的倒数第5次commit了。（实际上这个commit现在是倒数第一个commit）



### 取消已经暂存的文件

其实查看文件状态的时候就提示了该如何撤消。来看下面的例子，有两个修改过的文件，我们想要分开提交，但不小心用 `git add .` 全加到了暂存区域。该如何撤消其中的一个暂存文件呢？其实，`git status` 的命令输出已经告诉了我们该怎么做：

```shell
$ git add .
    $ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: README.txt
    # modified: benchmarks.rb
```

就在 “Changes to be committed” 下面，括号中有提示，可以使用 `git reset HEAD <file>...` 的方式取消暂存。

```shell
$ git reset HEAD benchmarks.rb
    benchmarks.rb: locally modified
    $ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: README.txt
    #
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    # (use "git checkout -- <file>..." to discard changes in working directory)
    #
    # modified: benchmarks.rb
    #
```

这条命令看起来有些古怪，先别管，能用就行。现在 benchmarks.rb 文件又回到了之前已修改未暂存的状态。

### 取消对文件的修改

如果觉得刚才对 benchmarks.rb 的修改完全没有必要，该如何取消修改，回到之前的状态（也就是修改之前的版本）呢？`git status` 同样提示了具体的撤消方法，接着上面的例子，现在未暂存区域看起来像这样：

```shell
# Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    # (use "git checkout -- <file>..." to discard changes in working directory)
    #
    # modified: benchmarks.rb
```

在第二个括号中，我们看到了抛弃文件修改的命令（在 Git 1.6.1 以及更高版本中会这样提示），让我们试试看：

```shell
$ git checkout -- benchmarks.rb
    $ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: README.txt
```

可以看到，该文件已经恢复到修改前的版本。你可能已经意识到了，这条命令有些危险，所有对文件的修改都没有了，因为我们刚刚把之前版本的文件复制过来重写了此文件。如果只是想回退版本，同时保留刚才的修改以便将来继续工作，可以用下章介绍的 stashing 和分支来处理。



## [重写历史](https://gitee.com/progit/6-Git-工具.html#6.4-重写历史)

很多时候，在 Git 上工作的时候，你也许会由于某种原因想要修订你的提交历史。你可以在你即将提交暂存区时决定什么文件归入哪一次提交，你可以使用 stash 命令来决定你暂时搁置的工作，你可以重写已经发生的提交以使它们看起来是另外一种样子。这个包括改变提交的次序、改变说明或者修改提交中包含的文件，将提交归并、拆分或者完全删除——这一切在你尚未开始将你的工作和别人共享前都是可以的。



### 修改多个提交说明

可以通过给`git rebase`增加`-i`选项来以交互方式地运行rebase。你必须通过告诉命令衍合到哪次提交，来指明你需要重写的提交的回溯深度。

例如，你想修改最近三次的提交说明，或者其中任意一次，你必须给`git rebase -i`提供一个参数，指明你想要修改的提交的父提交

```
$ git rebase -i HEAD~3
```

再次提醒这是一个衍合命令——`HEAD~3..HEAD`范围内的每一次提交都会被重写，无论你是否修改说明。

运行这个命令会为你的文本编辑器提供一个提交列表，看起来像下面这样

```
		pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file

    # Rebase 710f0f8..a5f4a0d onto 710f0f8
    #
    # Commands:
    # p, pick = use commit
    # e, edit = use commit, but stop for amending
    # s, squash = use commit, but meld into previous commit
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    # However, if you remove everything, the rebase will be aborted.
    #
```

这些提交的顺序与你通常通过`log`命令看到的是相反的。如果你运行`log`，你会看到下面这样的结果：

```
$ git log --pretty=format:"%h %s" HEAD~3..HEAD
    a5f4a0d added cat-file
    310154e updated README formatting and added blame
    f7f3f6d changed my name a bit
```

请注意这里的倒序。交互式的rebase给了你一个即将运行的脚本。它会从你在命令行上指明的提交开始(`HEAD~3`)然后自上至下重播每次提交里引入的变更。它将最早的列在顶上。

你需要修改这个脚本来让它停留在你想修改的变更上。要做到这一点，你只要将你想修改的每一次提交前面的pick改为edit。例如，只想修改第三次提交说明的话，你就像下面这样修改文件：

```
		edit f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file
```

当你保存并退出编辑器，Git会倒回至列表中的最后一次提交，然后把你送到命令行中，同时显示以下信息：

```
$ git rebase -i HEAD~3
    Stopped at 7482e0d... updated the gemspec to hopefully work better
    You can amend the commit now, with

    git commit --amend

    Once you’re satisfied with your changes, run

    git rebase --continue
```

这些指示很明确地告诉了你该干什么。输入

```
$ git commit --amend
```

修改提交说明，退出编辑器。然后，运行

```
$ git rebase --continue
```

这个命令会自动应用其他两次提交，你就完成任务了。如果你将更多行的 pick 改为 edit ，你就能对你想修改的提交重复这些步骤。Git每次都会停下，让你修正提交，完成后继续运行。

### 重排提交

你也可以使用交互式的衍合来彻底重排或删除提交。如果你想删除"added cat-file"这个提交并且修改其他两次提交引入的顺序，你将rebase脚本从这个

```
pick f7f3f6d changed my name a bit
    pick 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file
```

改为这个：

```
pick 310154e updated README formatting and added blame
    pick f7f3f6d changed my name a bit
```

当你保存并退出编辑器，Git 将分支倒回至这些提交的父提交，应用`310154e`，然后`f7f3f6d`，接着停止。你有效地修改了这些提交的顺序并且彻底删除了"added cat-file"这次提交。

### 压缩(Squashing)提交

#### 政采云做法

在开发中，常会遇到在一个分支上产生了很多的无效的提交，这种情况下使用 rebase 的交互式模式可以把已经发生的多次提交压缩成一次提交，得到了一个干净的提交历史，例如某个分支的提交历史情况如下：

![image-20210518211345258.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee27b108f03443a58c19600cac7ddf70~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

进入交互式模式的方式是执行：

```shell
git rebase -i <base-commit>
复制代码
```

参数 `base-commit` 就是指明操作的基点提交对象，基于这个基点进行 rebase 的操作，对于上述提交历史的例子，我们要把最后的一个提交对象（ ac18084 ）之前的提交压缩成一次提交，我们需要执行的命令格式是：

```shell
git rebase -i ac18084
复制代码
```

此时会进入一个 vim 的交互式页面，编辑器列出的信息像下列这样。

![image-20210518212036198.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fd2ea54dbbe4c88a51fc652c6b1e86f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

想要合并这一堆更改，我们要使用 Squash 策略进行合并，即把当前的 commit 和它的上一个 commit 内容进行合并， 大概可以表示为下面这样，在交互模式的 rebase 下，至少保留一个 pick，否则命令会执行失败。

```bash
pick  ... ...
s     ... ... 
s     ... ... 
s     ... ... 
复制代码
```

修改文件后 按下 `:` 然后 `wq` 保存退出，此时又会弹出一个编辑页面，这个页面是用来编辑提交的信息，修改为 `feat: 更正`，最后保存一下，接着使用 `git branch` 查看提交的 commit 信息，rebase 后的提交记录如下图所示，是不是清爽了很多？rebase 操作可以让我们的提交历史变得更加清晰。

![image-20210518212812000.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2586ec49060f4dfc9006c8f3fc532260~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

> 特别注意，只能在自己使用的 feature 分支上进行 rebase 操作，不允许在集成分支上进行 rebase，因为这种操作会修改集成分支的历史记录。



#### 《pro git》 做法

交互式的衍合工具还可以将一系列提交压制为单一提交。脚本在 rebase 的信息里放了一些有用的指示：

```
#
    # Commands:
    # p, pick = use commit
    # e, edit = use commit, but stop for amending
    # s, squash = use commit, but meld into previous commit
    #
    # If you remove a line here THAT COMMIT WILL BE LOST.
    # However, if you remove everything, the rebase will be aborted.
    #
```

如果不用"pick"或者"edit"，而是指定"squash"，Git 会同时应用那个变更和它之前的变更并将提交说明归并。因此，如果你想将这三个提交合并为单一提交，你可以将脚本修改成这样：

```
pick f7f3f6d changed my name a bit
    squash 310154e updated README formatting and added blame
    squash a5f4a0d added cat-file
```

当你保存并退出编辑器，Git 会应用全部三次变更然后将你送回编辑器来归并三次提交说明。

```
# This is a combination of 3 commits.
    # The first commit's message is:
    changed my name a bit

    # This is the 2nd commit message:

    updated README formatting and added blame

    # This is the 3rd commit message:

    added cat-file
```

当你保存之后，你就拥有了一个包含前三次提交的全部变更的单一提交。

### 拆分提交

拆分提交就是撤销一次提交，然后多次部分地暂存或提交直到结束。例如，假设你想将三次提交中的中间一次拆分。将"updated README formatting and added blame"拆分成两次提交：第一次为"updated README formatting"，第二次为"added blame"。你可以在`rebase -i`脚本中修改你想拆分的提交前的指令为"edit"：

```
pick f7f3f6d changed my name a bit
    edit 310154e updated README formatting and added blame
    pick a5f4a0d added cat-file
```

然后，这个脚本就将你带入命令行，你重置那次提交，提取被重置的变更，从中创建多次提交。当你保存并退出编辑器，Git 倒回到列表中第一次提交的父提交，应用第一次提交（`f7f3f6d`），应用第二次提交（`310154e`），然后将你带到控制台。那里你可以用`git reset HEAD^`对那次提交进行一次混合的重置，这将撤销那次提交并且将修改的文件撤回。此时你可以暂存并提交文件，直到你拥有多次提交，结束后，运行`git rebase --continue`。

```
$ git reset HEAD^
    $ git add README
    $ git commit -m 'updated README formatting'
    $ git add lib/simplegit.rb
    $ git commit -m 'added blame'
    $ git rebase --continue
```

Git在脚本中应用了最后一次提交（`a5f4a0d`），你的历史看起来就像这样了：

```
$ git log -4 --pretty=format:"%h %s"
    1c002dd added cat-file
    9b29157 added blame
    35cfb2b updated README formatting
    f3cc40e changed my name a bit
```

再次提醒，这会修改你列表中的提交的 SHA 值，所以请确保这个列表里不包含你已经推送到共享仓库的提交。

### 核弹级选项: filter-branch

如果你想用脚本的方式修改大量的提交，还有一个重写历史的选项可以用——例如，全局性地修改电子邮件地址或者将一个文件从所有提交中删除。这个命令是`filter-branch`，这个会大面积地修改你的历史，所以你很有可能不该去用它，除非你的项目尚未公开，没有其他人在你准备修改的提交的基础上工作。尽管如此，这个可以非常有用。你会学习一些常见用法，借此对它的能力有所认识。

#### 从所有提交中删除一个文件

这个经常发生。有些人不经思考使用`git add .`，意外地提交了一个巨大的二进制文件，你想将它从所有地方删除。也许你不小心提交了一个包含密码的文件，而你想让你的项目开源。`filter-branch`大概会是你用来清理整个历史的工具。要从整个历史中删除一个名叫password.txt的文件，你可以在`filter-branch`上使用`--tree-filter`选项：

```
$ git filter-branch --tree-filter 'rm -f passwords.txt' HEAD
    Rewrite 6b9b3cf04e7c5686a9cb838c3f36a8cb6a0fc2bd (21/21)
    Ref 'refs/heads/master' was rewritten
```

`--tree-filter`选项会在每次检出项目时先执行指定的命令然后重新提交结果。在这个例子中，你会在所有快照中删除一个名叫 password.txt 的文件，无论它是否存在。如果你想删除所有不小心提交上去的编辑器备份文件，你可以运行类似`git filter-branch --tree-filter 'rm -f *~' HEAD`的命令。

你可以观察到 Git 重写目录树并且提交，然后将分支指针移到末尾。一个比较好的办法是在一个测试分支上做这些然后在你确定产物真的是你所要的之后，再 hard-reset 你的主分支。要在你所有的分支上运行`filter-branch`的话，你可以传递一个`--all`给命令。

#### 将一个子目录设置为新的根目录

假设你完成了从另外一个代码控制系统的导入工作，得到了一些没有意义的子目录（trunk, tags等等）。如果你想让`trunk`子目录成为每一次提交的新的项目根目录，`filter-branch`也可以帮你做到：

```
$ git filter-branch --subdirectory-filter trunk HEAD
    Rewrite 856f0bf61e41a27326cdae8f09fe708d679f596f (12/12)
    Ref 'refs/heads/master' was rewritten
```

现在你的项目根目录就是`trunk`子目录了。Git 会自动地删除不对这个子目录产生影响的提交。

#### 全局性地更换电子邮件地址

另一个常见的案例是你在开始时忘了运行`git config`来设置你的姓名和电子邮件地址，也许你想开源一个项目，把你所有的工作电子邮件地址修改为个人地址。无论哪种情况你都可以用`filter-branch`来更换多次提交里的电子邮件地址。你必须小心一些，只改变属于你的电子邮件地址，所以你使用`--commit-filter`：

```
$ git filter-branch --commit-filter '
    if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
    then
    GIT_AUTHOR_NAME="Scott Chacon";
    GIT_AUTHOR_EMAIL="schacon@example.com";
    git commit-tree "$@";
    else
    git commit-tree "$@";
    fi' HEAD
```

这个会遍历并重写所有提交使之拥有你的新地址。因为提交里包含了它们的父提交的SHA-1值，这个命令会修改你的历史中的所有提交，而不仅仅是包含了匹配的电子邮件地址的那些。









## [远程仓库的使用](https://gitee.com/progit/2-Git-基础.html#2.5-远程仓库的使用)

### 查看当前的远程库

要查看当前配置有哪些远程仓库，可以用 `git remote` 命令，它会列出每个远程库的简短名字。在克隆完某个项目后，至少可以看到一个名为 origin 的远程库，Git 默认使用这个名字来标识你所克隆的原始仓库：

```shell
$ git clone git://github.com/schacon/ticgit.git
    Initialized empty Git repository in /private/tmp/ticgit/.git/
    remote: Counting objects: 595, done.
    remote: Compressing objects: 100% (269/269), done.
    remote: Total 595 (delta 255), reused 589 (delta 253)
    Receiving objects: 100% (595/595), 73.31 KiB | 1 KiB/s, done.
    Resolving deltas: 100% (255/255), done.
$ cd ticgit
$ git remote
    origin
```

也可以加上 `-v` 选项（译注：此为 `--verbose` 的简写，取首字母），显示对应的克隆地址：

```shell
$ git remote -v
    origin git://github.com/schacon/ticgit.git
```

如果有多个远程仓库，此命令将全部列出。比如在我的 Grit 项目中，可以看到：

```shell
$ cd grit
$ git remote -v
    bakkdoor git://github.com/bakkdoor/grit.git
    cho45 git://github.com/cho45/grit.git
    defunkt git://github.com/defunkt/grit.git
    koke git://github.com/koke/grit.git
    origin git@github.com:mojombo/grit.git
```



### 添加远程仓库

要添加一个新的远程仓库，可以指定一个简单的名字，以便将来引用，运行 `git remote add [shortname] [url]`：

```shell
$ git remote
    origin
$ git remote add pb git://github.com/paulboone/ticgit.git
$ git remote -v
    origin git://github.com/schacon/ticgit.git
    pb git://github.com/paulboone/ticgit.git
```



### 从远程仓库抓取数据

#### `git fetch`

可以用下面的命令从远程仓库抓取数据到本地：

```shell
$ git fetch [remote-name]
```

此命令会到远程仓库中拉取所有你本地仓库中还没有的数据。运行完成后，你就可以在本地访问该远程仓库中的所有分支，将其中某个分支合并到本地。

如果是克隆了一个仓库，此命令会自动将远程仓库归于 origin 名下。所以，`git fetch origin` 会抓取从你上次克隆以来别人上传到此远程仓库中的所有更新（或是上次 fetch 以来别人提交的更新）。有一点很重要，需要记住，fetch 命令只是将远端的数据拉到本地仓库，<font color="red">并不自动合并到当前工作分支</font>。

##### 额外建立本地分支

```java
//获取最新代码到本地临时分支
$ git fetch origin master:master1  [示例1：在本地建立master1分支，并下载远端的origin/master分支到master1分支中]
```

##### 不额外建立本地分支

```java
//获取最新代码到本地(本地当前分支为[branch]，获取的远端的分支为[origin/branch])
$ git fetch origin master  [示例1：获取远端的origin/master分支]

//查看版本差异
$ git log -p master..origin/master [示例1：查看本地master与远端origin/master的版本差异]
```

##### 获取远程仓库所有分支的更新

`git fetch --all`

####  `git pull` 

如果设置了某个分支用于跟踪某个远端仓库的分支，可以使用 `git pull` 命令自动抓取数据下来，然后将远端分支自动合并到本地仓库中当前分支。默认情况下 `git clone` 命令本质上就是自动创建了本地的 master 分支用于跟踪远程仓库中的 master 分支（假设远程仓库确实有 master 分支）。`$ git pull --rebase`，如果加-rebase参数，就是使用git rebase代替git merge 

```shell
#直接拉取并合并最新代码
$ git pull origin master #[示例1：拉取远端origin/master分支合并到本地当前分支]
```





### 推送数据到远程仓库

命令格式如下：

```
git push <远程主机名> <本地分支名>:<远程分支名>
```

如果本地分支名与远程分支名相同，则可以省略冒号：

```
git push <远程主机名> <本地分支名>
```

如果本地版本与远程版本有差异，但又要强制推送可以使用 `--force`或`--force-with-lease` 使用该命令在强制覆盖前会进行一次检查如果其他人在该分支上有提交会有一个警告

```
git push --force-with-lease origin master
```



只有在所克隆的服务器上有写权限，或者同一时刻没有其他人在推数据，这条命令才会如期完成任务。如果在你推数据前，已经有其他人推送了若干更新，那你的推送操作就会被驳回。你必须先把他们的更新抓取到本地，合并到自己的项目中，然后才可以再次推送。

### 查看远程仓库信息

我们可以通过命令 `git remote show [remote-name]` 查看某个远程仓库的详细信息，比如要看所克隆的 `origin` 仓库，可以运行：

```sh
$ git remote show origin
    * remote origin
    URL: git://github.com/schacon/ticgit.git #对应的克隆地址
    
    Remote branch merged with 'git pull' while on branch master #它告诉你如果是在 master 分支，就可以用 `git pull` 命令抓取数据合并到本地。
    master
    
    Tracked remote branches #所有处于跟踪状态中的远端分支
    master
    ticgit
```

上面的例子非常简单，而随着使用 Git 的深入，`git remote show` 给出的信息可能会像这样：

```sh
$ git remote show origin
    * remote origin
    URL: git@github.com:defunkt/github.git
    
    Remote branch merged with 'git pull' while on branch issues #运行 `git pull` 时将自动合并哪些分支
    issues
    
    Remote branch merged with 'git pull' while on branch master #运行 `git pull` 时将自动合并哪些分支
    master
    
    New remote branches (next fetch will store in remotes/origin) #有哪些远端分支还没有同步到本地
    caching
    
    Stale tracking branches (use 'git remote prune') #哪些已同步到本地的远端分支在远端服务器上已被删除
    libwalker
    walker2
    
    Tracked remote branches
    acl
    apiv2
    dashboard2
    issues
    master
    postgres
    
    Local branch pushed with 'git push' #运行 `git push` 时缺省推送的分支是什么
    master:master
```



### 远程仓库的删除和重命名

在新版 Git 中可以用 `git remote rename` 命令修改某个远程仓库在本地的简称，比如想把 `pb` 改成 `paul`，可以这么运行：

```sh
$ git remote rename pb paul
$ git remote
    origin
    paul
```

注意，对远程仓库的重命名，也会使对应的分支名称发生变化，原来的 `pb/master` 分支现在成了 `paul/master`。

碰到远端仓库服务器迁移，或者原来的克隆镜像不再使用，又或者某个参与者不再贡献代码，那么需要移除对应的远端仓库，可以运行 `git remote rm` 命令：

```shell
$ git remote rm paul
$ git remote
    origin
```





## [打标签](https://gitee.com/progit/2-Git-基础.html#2.6-打标签)`git tag`

Git 可以对某一时间点上的版本打上标签。人们在发布某个软件版本（比如 v1.0 等等）的时候，经常这么做。

>  进行任何可能要处理冲突的 git 操作之前，建议都先打 tag。--- 赵缙翔

### 列显已有的标签

列出现有标签 `git tag` ,显示的标签按字母顺序排列。

```sh
$ git tag
    v0.1
    v1.3
```

我们可以用特定的搜索模式列出符合条件的标签。

```sh
$ git tag -l 'v1.4.2.*'
    v1.4.2.1
    v1.4.2.2
    v1.4.2.3
    v1.4.2.4
```



使用 `git show` 命令查看相应标签的版本信息，并连同显示打标签时的提交对象。

```sh
$ git show v1.4
    tag v1.4
    Tagger: Scott Chacon <schacon@gee-mail.com>
    Date: Mon Feb 9 14:45:11 2009 -0800

    my version 1.4
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sun Feb 8 19:02:46 2009 -0800

    Merge branch 'experiment'
```

我们可以看到在提交对象信息上面，列出了此标签的提交者和提交时间，以及相应的标签说明。



### 新建标签

Git 使用的标签有两种类型：轻量级的（lightweight）和含附注的（annotated）。轻量级标签就像是个不会变化的分支，实际上它就是个指向特定提交对象的引用。而含附注标签，实际上是存储在仓库中的一个独立对象，它有自身的校验和信息，包含着标签的名字，电子邮件地址和日期，以及标签说明，标签本身也允许使用 GNU Privacy Guard (GPG) 来签署或验证。一般我们都建议使用含附注型的标签，以便保留相关信息；当然，如果只是临时性加注标签，或者不需要旁注额外信息，用轻量级标签也没问题。

#### 含附注的标签

创建一个含附注类型的标签非常简单，用 `-a` （译注：取 `annotated` 的首字母）指定标签名字即可：

```sh
$ git tag -a v1.4 -m 'my version 1.4'
    $ git tag
    v0.1
    v1.3
    v1.4
```

 `-m` 选项则指定了对应的标签说明，Git 会将此说明一同保存在标签对象中。如果没有给出该选项，Git 会启动文本编辑软件供你输入标签说明。



#### 签署标签

##### 介绍

如果你有自己的私钥，还可以用 GPG 来签署标签，只需要把之前的 `-a` 改为 `-s` （译注： 取 `signed` 的首字母）即可：

```
$ git tag -s v1.5 -m 'my signed 1.5 tag'
    You need a passphrase to unlock the secret key for
    user: "Scott Chacon <schacon@gee-mail.com>"
    1024-bit DSA key, ID F721C45A, created 2009-02-09
```

现在再运行 `git show` 会看到对应的 GPG 签名也附在其内：

```
$ git show v1.5
    tag v1.5
    Tagger: Scott Chacon <schacon@gee-mail.com>
    Date: Mon Feb 9 15:22:20 2009 -0800

    my signed 1.5 tag
    -----BEGIN PGP SIGNATURE-----
    Version: GnuPG v1.4.8 (Darwin)

    iEYEABECAAYFAkmQurIACgkQON3DxfchxFr5cACeIMN+ZxLKggJQf0QYiQBwgySN
    Ki0An2JeAVUCAiJ7Ox6ZEtK+NvZAj82/
    =WryJ
    -----END PGP SIGNATURE-----
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sun Feb 8 19:02:46 2009 -0800

    Merge branch 'experiment'
```





##### 验证标签

可以使用 `git tag -v [tag-name]` （译注：取 `verify` 的首字母）的方式验证已经签署的标签。此命令会调用 GPG 来验证签名，所以你需要有签署者的公钥，存放在 keyring 中，才能验证：

```
$ git tag -v v1.4.2.1
    object 883653babd8ee7ea23e6a5c392bb739348b1eb61
    type commit
    tag v1.4.2.1
    tagger Junio C Hamano <junkio@cox.net> 1158138501 -0700

    GIT 1.4.2.1

    Minor fixes since 1.4.2, including git-mv and git-http with alternates.
    gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
    gpg: Good signature from "Junio C Hamano <junkio@cox.net>"
    gpg: aka "[jpeg image of size 1513]"
    Primary key fingerprint: 3565 2A26 2040 E066 C9A7 4A7D C0C6 D9A4 F311 9B9A
```

若是没有签署者的公钥，会报告类似下面这样的错误：

```
gpg: Signature made Wed Sep 13 02:08:25 2006 PDT using DSA key ID F3119B9A
    gpg: Can't check signature: public key not found
    error: could not verify the tag 'v1.4.2.1'
```





#### 轻量级标签

轻量级标签实际上就是一个保存着对应提交对象的校验和信息的文件。要创建这样的标签，一个 `-a`，`-s` 或 `-m` 选项都不用，直接给出标签名字即可：

```
$ git tag v1.4-lw
    $ git tag
    v0.1
    v1.3
    v1.4
    v1.4-lw
    v1.5
```

现在运行 `git show` 查看此标签信息，就只有相应的提交对象摘要：

```
$ git show v1.4-lw
    commit 15027957951b64cf874c3557a0f3547bd83b3ff6
    Merge: 4a447f7... a6b4c97...
    Author: Scott Chacon <schacon@gee-mail.com>
    Date: Sun Feb 8 19:02:46 2009 -0800

    Merge branch 'experiment'
```

### 后期加注标签

你甚至可以在后期对早先的某次提交加注标签。比如在下面展示的提交历史中：

```
$ git log --pretty=oneline
    15027957951b64cf874c3557a0f3547bd83b3ff6 Merge branch 'experiment'
    a6b4c97498bd301d84096da251c98a07c7723e65 beginning write support
    0d52aaab4479697da7686c15f77a3d64d9165190 one more thing
    6d52a271eda8725415634dd79daabbc4d9b6008e Merge branch 'experiment'
    0b7434d86859cc7b8c3d5e1dddfed66ff742fcbc added a commit function
    4682c3261057305bdd616e23b64b0857d832627b added a todo file
    166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
    9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
    964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
    8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
```

我们忘了在提交 “updated rakefile” 后为此项目打上版本号 v1.2，没关系，现在也能做。只要在打标签的时候跟上对应提交对象的校验和（或前几位字符）即可：

```
$ git tag -a v1.2 9fceb02
```



### 上传标签

默认情况下，`git push` 并不会把标签传送到远端服务器上，只有通过显式命令才能分享标签到远端仓库。其命令格式如同推送分支，运行 `git push origin [tagname]` 即可：

```
$ git push origin v1.5
    Counting objects: 50, done.
    Compressing objects: 100% (38/38), done.
    Writing objects: 100% (44/44), 4.56 KiB, done.
    Total 44 (delta 18), reused 8 (delta 1)
    To git@github.com:schacon/simplegit.git
    * [new tag] v1.5 -> v1.5
```

如果要一次推送所有本地新增的标签上去，可以使用 `--tags` 选项：

```
$ git push origin --tags
    Counting objects: 50, done.
    Compressing objects: 100% (38/38), done.
    Writing objects: 100% (44/44), 4.56 KiB, done.
    Total 44 (delta 18), reused 8 (delta 1)
    To git@github.com:schacon/simplegit.git
    * [new tag] v0.1 -> v0.1
    * [new tag] v1.2 -> v1.2
    * [new tag] v1.4 -> v1.4
    * [new tag] v1.4-lw -> v1.4-lw
    * [new tag] v1.5 -> v1.5
```

现在，其他人克隆共享仓库或拉取数据同步后，也会看到这些标签。













# 分支

## [何谓分支](https://gitee.com/progit/3-Git-分支.html#3.1-何谓分支)

### Git的保存原理

Git 保存的是一系列文件快照。

在 Git 中提交时，会保存一个提交（commit）对象，该对象 包含一个指向 暂存内容快照 的指针，包含本次提交的作者等相关附属信息，包含零个或多个指向 该提交对象的父对象指针(首次提交是没有直接祖先的，普通提交有一个祖先，由两个或多个分支合并产生的提交则有多个祖先)。

#### 暂存时

比如我们在工作目录中有三个文件。暂存操作会对每一个文件计算校验和，然后把当前版本的文件快照保存到 Git 仓库中（Git 使用 blob 类型的对象存储这些快照），并将校验和加入暂存区域：

```sh
$ git add README test.rb LICENSE
$ git commit -m 'initial commit of my project'
```

#### 提交时

当使用 `git commit` 新建一个提交对象前，Git 会先计算每一个子目录的校验和，然后在 Git 仓库中将这些目录保存为树（tree）对象。之后 Git 创建的提交对象，除了包含相关提交信息以外，还包含着指向这个树对象的指针。



#### 单个提交对象在仓库中的数据结构

结合上述的例子之后，Git 仓库中有五个对象：三个表示文件快照内容的 blob 对象（在暂存阶段生成）；一个记录着目录树内容及其中各个文件对应 blob 对象索引的 tree 对象；以及一个包含指向 tree 对象（根目录）的索引和其他提交信息元数据的 commit 对象。（tree 和 commit 对象在提交阶段生成）。仓库中的各个对象保存的数据和相互关系看起来如图 3-1 所示：



![img](https://gitee.com/progit/figures/18333fig0301-tn.png)


图 3-1. 单个提交对象在仓库中的数据结构



#### 多个提交对象之间的链接关系

作些修改后再次提交，那么这次的提交对象会包含一个指向上次提交对象的指针（即下图中的 parent 对象）。两次提交后，仓库历史会变成图 3-2 的样子：



![img](https://gitee.com/progit/figures/18333fig0302-tn.png)


图 3-2. 多个提交对象之间的链接关系





### 分支

#### 何谓分支

<span id='branch'>Git 中的分支，本质上就是个指向 commit 对象的可变指针。</span>Git 会使用 master 作为分支的默认名字。在若干次提交后，你其实已经有了一个指向最后一次提交对象的 master 分支，它在每次提交的时候都会自动向前移动。由于 Git 中的分支实际上仅是一个包含所指对象校验和（40 个字符长度 SHA-1 字串）的文件，所以创建和销毁一个分支就变得非常廉价。说白了，新建一个分支就是向一个文件写入 41 个字节（外加一个换行符）那么简单，当然也就很快了。Git 的实现与项目复杂度无关，它永远可以在几毫秒的时间内完成分支的创建和切换。同时，因为每次提交时都记录了祖先信息（译注：即 `parent` 对象），将来要合并分支时，寻找恰当的合并基础（译注：即共同祖先）的工作其实已经自然而然地摆在那里了，所以实现起来非常容易。



![img](https://gitee.com/progit/figures/18333fig0303-tn.png)


图 3-3. 分支其实就是从某个提交对象往回看的历史



#### 新建分支

新建一个 testing 分支，可以使用 `git branch` 命令：

```
$ git branch testing
```

这会在当前 commit 对象上新建一个分支指针（见图 3-4）。



![img](https://gitee.com/progit/figures/18333fig0304-tn.png)


图 3-4. 多个分支指向提交数据的历史



####  HEAD 指向当前所在的分支

那么，Git 是如何知道你当前在哪个分支上工作的呢？它保存着一个名为 HEAD 的特别指针。它是一个指向你正在工作中的本地分支的指针（译注：将 HEAD 想象为当前分支的别名。）。运行 `git branch` 命令，仅仅是建立了一个新的分支，但不会自动切换到这个分支中去，所以在这个例子中，我们依然还在 master 分支里工作（参考图 3-5）。



![img](https://gitee.com/progit/figures/18333fig0305-tn.png)


图 3-5. HEAD 指向当前所在的分支



#### 从某次提交切出分支

```
git checkout -b <branch-name> <commit-hash>
```

将 `<branch-name>` 替换为您想要为新分支命名的名称，将 `<commit-hash>` 替换为您复制的提交哈希值。





#### 切换分支

git switch --- git checkout 太强大了，用switch来完成简单的切换和创建分支操作。

要切换到其他分支，可以执行 `git checkout` 命令。新建并切换到该分支，运行 `git checkout` 并加上 `-b` 参数。切换分支的时候最好保持一个清洁的工作区域。

git checkout 有两个特性：

- 切换分支：不带具体的文件路径时，用于修改head当前指向的分支
- 检出文件：带具体的文件路径时，从指定的respository 或者 stage 中恢复文件

![廖雪峰对于git checkout -- readme.txt 的解释。若图片崩了可以看这个链接（https://www.jianshu.com/p/285302d1eb73）](https://upload-images.jianshu.io/upload_images/13608921-c1365c0edf801717.png?imageMogr2/auto-orient/strip|imageView2/2/w/1060/format/webp)



我们现在转换到新建的 testing 分支：

```
$ git checkout testing
```

这样 HEAD 就指向了 testing 分支（见图3-6）。



![img](https://gitee.com/progit/figures/18333fig0306-tn.png)


图 3-6. HEAD 在你转换分支时指向新的分支



#### 每次提交后 HEAD 随着分支一起向前移动

再提交一次：

```
$ vim test.rb
$ git commit -a -m 'made a change'
```

图 3-7 展示了提交后的结果。



![img](https://gitee.com/progit/figures/18333fig0307-tn.png)


图 3-7. 每次提交后 HEAD 随着分支一起向前移动



现在 testing 分支向前移动了一格，而 master 分支仍然指向原先 `git checkout` 时所在的 commit 对象。



#### 不同流向的分支

我们回到 master 分支看看：

```
$ git checkout master
```

图 3-8 显示了结果。



![img](https://gitee.com/progit/figures/18333fig0308-tn.png)


图 3-8. HEAD 在一次 checkout 之后移动到了另一个分支

这条命令做了两件事。它把 HEAD 指针移回到 master 分支，并把工作目录中的文件换成了 master 分支所指向的快照内容。也就是说，现在开始所做的改动，将始于本项目中一个较老的版本。它的主要作用是将 testing 分支里作出的修改暂时取消，这样你就可以向另一个方向进行开发。

我们作些修改后再次提交：

```
$ vim test.rb
$ git commit -a -m 'made other changes'
```

现在我们的项目提交历史产生了分叉（如图 3-9 所示），因为刚才我们创建了一个分支，转换到其中进行了一些工作，然后又回到原来的主分支进行了另外一些工作。这些改变分别孤立在不同的分支里：我们可以在不同分支里反复切换，并在时机成熟时把它们合并到一起。而所有这些工作，仅仅需要 `branch` 和 `checkout` 这两条命令就可以完成。



![img](https://gitee.com/progit/figures/18333fig0309-tn.png)


图 3-9. 不同流向的分支历史



#### 删除分支

使用 `git branch` 的 `-d` 选项执行删除操作，如果一个分支还没有被推送或者合并，那么可以使用-D强制删除它。：

```sh
$ git branch -d hotfix
    Deleted branch hotfix (3a0874c).
```



#### 查看分支

##### 查看某个分支是从哪个分支拉出来的

> git的分支其实没有父子关系

```
git reflog show 分支名
```



##### 查看本地分支

```
$ git branch
    iss53
    * master
    testing
```

注意看 `master` 分支前的 `*` 字符：它表示当前所在的分支。也就是说，如果现在提交更新，`master` 分支将随着开发进度前移。



##### 查看远程分支

` git branch -r `



##### 查看本地和远程分支

`git branch -a`



##### 查看各个分支最后一个提交对象的信息

运行 `git branch -v`：

```
$ git branch -v
    iss53 93b412c fix javascript issue
    * master 7a98805 Merge branch 'iss53'
    testing 782fd34 add scott to the author list in the readmes
```



##### 筛选出你已经（或尚未）与当前分支合并的分支

可以用 `--merge` 和 `--no-merged` 选项（Git 1.5.6 以上版本）。比如用 `git branch --merge` 查看哪些分支已被并入当前分支（译注：也就是说哪些分支是当前分支的直接上游。）：

```
$ git branch --merged
    iss53
    * master
```

之前我们已经合并了 `iss53`，所以在这里会看到它。一般来说，列表中没有 `*` 的分支通常都可以用 `git branch -d` 来删掉。原因很简单，既然已经把它们所包含的工作整合到了其他分支，删掉也不会损失什么。

另外可以用 `git branch --no-merged` 查看尚未合并的工作：

```
$ git branch --no-merged
    testing
```

它会显示还未合并进来的分支。由于这些分支中还包含着尚未合并进来的工作成果，所以简单地用 `git branch -d` 删除该分支会提示错误，因为那样做会丢失数据：

```
$ git branch -d testing
    error: The branch 'testing' is not an ancestor of your current HEAD.
    If you are sure you want to delete it, run 'git branch -D testing'.
```

不过，如果你确实想要删除该分支上的改动，可以用大写的删除选项 `-D` 强制执行，就像上面提示信息中给出的那样。





##### 重新命名分支

`git branch -m <old-branch-name> <new-branch-name>`





## [hotfix 分支](https://gitee.com/progit/3-Git-分支.html#3.2-分支的新建与合并)

### 本内容下的情景

现在让我们来看一个简单的分支与合并的例子，实际工作中大体也会用到这样的工作流程：

1. 开发某个网站。
2. 为实现某个新的需求，创建一个分支。
3. 在这个分支上开展工作。

假设此时，你突然接到一个电话说有个很严重的问题需要紧急修补，那么可以按照下面的方式处理：

1. 返回到原先已经发布到生产服务器上的分支。
2. 为这次紧急修补建立一个新分支，并在其中修复问题。
3. 通过测试后，回到生产服务器所在的分支，将修补分支合并进来，然后再推送到生产服务器上。
4. 切换到之前实现新需求的分支，继续工作

### 新建与切换hotfix分支

首先，我们看一个简短的提交历史。

![img](https://gitee.com/progit/figures/18333fig0310-tn.png)




现在，你决定要修补 #53 问题。

```
$ git checkout -b iss53
    Switched to a new branch "iss53"
```

![img](https://gitee.com/progit/figures/18333fig0311-tn.png)


图 3-11. 创建了一个新分支的指针



接着你开始尝试修复问题，在提交了若干次更新后，`iss53` 分支的指针也会随着向前推进，因为它就是当前分支（换句话说，当前的 `HEAD` 指针正指向 `iss53`，见图 3-12）：

```
$ vim index.html
    $ git commit -a -m 'added a new footer [issue 53]'
```



![img](https://gitee.com/progit/figures/18333fig0312-tn.png)


图 3-12. iss53 分支随工作进展向前推进



现在你就接到了那个网站问题的紧急电话，需要马上修补。有了 Git ，我们就不需要同时发布这个补丁和 `iss53` 里作出的修改，也不需要在创建和发布该补丁到服务器之前花费大力气来复原这些修改。唯一需要的仅仅是切换回 `master` 分支。

不过在此之前，留心你的暂存区或者工作目录里，那些还没有提交的修改，它会和你即将检出的分支产生冲突从而阻止 Git 为你切换分支。切换分支的时候最好保持一个清洁的工作区域。

```
$ git checkout master
    Switched to branch "master"
```

此时工作目录中的内容和你在解决问题 #53 之前一模一样。这一点值得牢记：Git 会把工作目录的内容恢复为检出某分支时它所指向的那个提交对象的快照。它会自动添加、删除和修改文件以确保目录的内容和你当时提交时完全一样。

接下来，我们创建一个紧急修补分支 `hotfix` 来开展工作。（见图 3-13）：

```
$ git checkout -b 'hotfix'
    Switched to a new branch "hotfix"
    $ vim index.html
    $ git commit -a -m 'fixed the broken email address'
    [hotfix]: created 3a0874c: "fixed the broken email address"
    1 files changed, 0 insertions(+), 1 deletions(-)
```



![img](https://gitee.com/progit/figures/18333fig0313-tn.png)


图 3-13. hotfix 分支是从 master 分支所在点分化出来的



### 分支的合并

#### 合并的两个分支是祖先关系

回到 `master` 分支并把它合并进来，然后发布到生产服务器。用 `git merge` 命令来进行合并：

```
$ git checkout master
$ git merge hotfix
    Updating f42c576..3a0874c
    Fast forward
    README | 1 -
    1 files changed, 0 insertions(+), 1 deletions(-)
```

合并时出现了“Fast forward”的提示。由于当前 `master` 分支所在的提交对象是要并入的 `hotfix` 分支的直接上游，Git 只需把 `master` 分支指针直接右移。换句话说，如果顺着一个分支走下去可以到达另一个分支的话，那么 Git 在合并两者时，只会简单地把指针右移，因为这种单线的历史分支不存在任何需要解决的分歧，所以这种合并过程可以称为快进（Fast forward）。

![img](https://gitee.com/progit/figures/18333fig0314-tn.png)


图 3-14. 合并之后，master 分支和 hotfix 分支指向同一位置。





#### 合并的两个分支不是祖先关系

在问题 #53 相关的工作完成之后，可以合并回 `master` 分支。实际操作同前面合并 `hotfix` 分支差不多，只需回到 `master` 分支，运行 `git merge` 命令指定要合并进来的分支：

```
$ git checkout master
    $ git merge iss53
    Merge made by recursive.
    README | 1 +
    1 files changed, 1 insertions(+), 0 deletions(-)
```

请注意，这次合并操作的底层实现，并不同于之前 `hotfix` 的并入方式。因为这次你的开发历史是从更早的地方开始分叉的。由于当前 `master` 分支所指向的提交对象（C4）并不是 `iss53` 分支的直接祖先，Git 不得不进行一些额外处理。就此例而言，Git 会用两个分支的末端（C4 和 C5）以及它们的共同祖先（C2）进行一次简单的三方合并计算。图 3-16 用红框标出了 Git 用于合并的三个提交对象：



![img](https://gitee.com/progit/figures/18333fig0316-tn.png)


图 3-16. Git 为分支合并自动识别出最佳的同源合并点。



这次，Git 没有简单地把分支指针右移，而是对三方合并后的结果重新做一个新的快照，并自动创建一个指向它的提交对象（C6）（见图 3-17）。这个提交对象比较特殊，它有两个祖先（C4 和 C5）。

值得一提的是 Git 可以自己裁决哪个共同祖先才是最佳合并基础。



![img](https://gitee.com/progit/figures/18333fig0317-tn.png)


图 3-17. Git 自动创建了一个包含了合并结果的提交对象。



#### 合并某一个分支的单笔提交

`git cherry-pick` 可以理解为”挑拣”提交，和 merge 合并一个分支的所有提交不同的是，它会获取某一个分支的单笔提交，并作为一个新的提交引入到你当前分支上。当我们需要在本地合入其他分支的提交时，如果我们不想对整个分支进行合并，而是只想将某一次提交合入到本地当前分支上，那么就要使用 `git cherry-pick` 了。

如下场景，以下有三条分支，feature/cherry-pick1 和 feature/cherry-pick2 都是基于 master 检出的两条功能性分支，对应的分支 log 记录如下

![image-20210518221001432.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66e205eb421841bfa476167e6fd7c581~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

![image-20210518221010458.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5743a18a0c24b3aa085db3d7a620742~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

master 分支的提交如下 ![image-20210518221051734.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64fe055a5e764ff58e85923314096f9e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

现在 master 只需要 feature/cherry-pick1 和 feature/cherry-pick2 有关 change 的修改，并不关心有关 fix 内容的修改。此时就可以用 cherry-pick 指令了。

语法： `git cherry-pick [commit-hash]`

commit-hash 表示的是某次 commit 的 hash 值。现在，依次执行以下两条指令 `git cherry-pick e0bb7f3`、`git cherry-pick c9a3101`，过程中，如果出现冲突，解决冲突后 进行 `git add `，接着执行 `git cherry-pick --continue`，最后，master 上的提交如下

![image-20210518235707190.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38f9c71679824941abdf98b769b9a062~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

此时，master 分支上应用了需要的提交，就达到了我们想要的效果。如果需要多个 cherry-pick 需要同步到目标分支，可以简写为  `git cherry-pick <first-commit-id>...<last-commit-id>`，这是一个左开右闭的区间，也就时说 `first-commit-id` 提交带来的代码的改动不会被合并过去，如果需要合并过去，可以使用 `git cherry-pick <first-commit-id>^...<last-commit-id>`，它表示包含 `first-commit-id` 到 `last-commit-id` 在内的提交都会被合并过去。





#### 看一个实际的例子

请看图 3-20，由下往上，起先我们在 `master` 工作到 C1，然后开始一个新分支 `iss91` 尝试修复 91 号缺陷，提交到 C6 的时候，又冒出一个解决该问题的新办法，于是从之前 C4 的地方又分出一个分支 `iss91v2`，干到 C8 的时候，又回到主干 `master` 中提交了 C9 和 C10，再回到 `iss91v2` 继续工作，提交 C11，接着，又冒出个不太确定的想法，从 `master` 的最新提交 C10 处开了个新的分支 `dumbidea` 做些试验。



![img](https://gitee.com/progit/figures/18333fig0320-tn.png)


图 3-20. 拥有多个特性分支的提交历史。



现在，假定两件事情：我们最终决定使用 `iss91v2` 中的办法；另外，我们把 `dumbidea` 分支拿给同事们看了以后，发现它竟然是个天才之作。所以接下来，我们准备抛弃原来的 `iss91` 分支（实际上会丢弃 C5 和 C6），直接在主干中并入另外两个分支。最终的提交历史将变成图 3-21 这样：



![img](https://gitee.com/progit/figures/18333fig0321-tn.png)



图 3-21. 合并了 dumbidea 和 iss91v2 后的分支历史。





### 遇到冲突时的分支合并

#### 命令行解决

merge操作遇到冲突时候，当前merge不能继续下去。手动修改冲突内容后，add 修改，commit 就可以了。
而rebase操作的话，会中断rebase，同时会提示去解决冲突。解决冲突后，使用依次 `git add `、`git rebase --continue `的方式来处理冲突，完成 rebase 的过程，如果不想要某次 rebase 的结果，那么需要使用 `git rebase --skip `来跳过这次 rebase 操作。

有时候合并操作并不会如此顺利。如果在不同的分支中都修改了同一个文件的同一部分，Git 就需要人为介入去合并。如果你在解决问题 #53 的过程中修改了 `hotfix` 中修改的部分，将得到类似下面的结果：

```sh
$ git merge iss53
    Auto-merging index.html
    CONFLICT (content): Merge conflict in index.html
    Automatic merge failed; fix conflicts and then commit the result.
```

Git 作了合并，但没有提交，它会停下来等你解决冲突。要看看哪些文件在合并时发生冲突，可以用 `git status` 查阅：

```sh
[master*]$ git status
    index.html: needs merge
    # On branch master
    # Changes not staged for commit:
    # (use "git add <file>..." to update what will be committed)
    # (use "git checkout -- <file>..." to discard changes in working directory)
    #
    # unmerged: index.html
    #
```

任何包含未解决冲突的文件都会以未合并（unmerged）的状态列出。Git 会在有冲突的文件里加入标准的冲突解决标记，可以通过它们来手工定位并解决这些冲突。可以看到此文件包含类似下面这样的部分：

```
<<<<<<< HEAD:index.html
    <div id="footer">contact : email.support@github.com</div>
    =======
    <div id="footer">
    please contact us at support@github.com
    </div>
    >>>>>>> iss53:index.html
```

可以看到 `=======` 隔开的上半部分，是 `HEAD`（即 `master` 分支，在运行 `merge` 命令时所切换到的分支）中的内容，下半部分是在 `iss53` 分支中的内容。解决冲突的办法无非是二者选其一或者由你亲自整合到一起。比如你可以通过把这段内容替换为下面这样来解决：

```
<div id="footer">
    please contact us at email.support@github.com
</div>
```

这个解决方案各采纳了两个分支中的一部分内容，而且我还删除了 `<<<<<<<`，`=======` 和 `>>>>>>>` 这些行。在解决了所有文件里的所有冲突后，运行 `git add` 将把它们标记为已解决状态（译注：实际上就是来一次快照保存到暂存区域。）。因为一旦暂存，就表示冲突已经解决。



#### 用一个有图形界面的工具来解决

如果你想用一个有图形界面的工具来解决这些问题，不妨运行 `git mergetool`，它会调用一个可视化的合并工具并引导你解决所有冲突：

```
$ git mergetool
    merge tool candidates: kdiff3 tkdiff xxdiff meld gvimdiff opendiff emerge vimdiff
    Merging the files: index.html

    Normal merge conflict for 'index.html':
    {local}: modified
    {remote}: modified
    Hit return to start merge resolution tool (opendiff):
```

如果不想用默认的合并工具（Git 为我默认选择了 `opendiff`，因为我在 Mac 上运行了该命令），你可以在上方"merge tool candidates"里找到可用的合并工具列表，输入你想用的工具名。我们将在第七章讨论怎样改变环境中的默认值。

退出合并工具以后，Git 会询问你合并是否成功。如果回答是，它会为你把相关文件暂存起来，以表明状态为已解决。

再运行一次 `git status` 来确认所有冲突都已解决：

```
$ git status
    # On branch master
    # Changes to be committed:
    # (use "git reset HEAD <file>..." to unstage)
    #
    # modified: index.html
    #
```

如果觉得满意了，并且确认所有冲突都已解决，也就是进入了暂存区，就可以用 `git commit` 来完成这次合并提交。提交的记录差不多是这样：

```
Merge branch 'iss53'

    Conflicts:
    index.html
    #
    # It looks like you may be committing a MERGE.
    # If this is not correct, please remove the file
    # .git/MERGE_HEAD
    # and try again.
    #
```

如果想给将来看这次合并的人一些方便，可以修改该信息，提供更多合并细节。比如你都作了哪些改动，以及这么做的原因。有时候裁决冲突的理由并不直接或明显，有必要略加注解。



## [利用分支进行开发的工作流程](https://gitee.com/progit/3-Git-分支.html#3.4-利用分支进行开发的工作流程)

你可以根据项目的实际情况选择一种用用看

### 长期分支

许多使用 Git 的开发者都喜欢用这种方式来开展工作，比如仅在 `master` 分支中保留完全稳定的代码，即已经发布或即将发布的代码。与此同时，他们还有一个名为 `develop` 或 `next` 的平行分支，专门用于后续的开发，或仅用于稳定性测试 — 当然并不是说一定要绝对稳定，不过一旦进入某种稳定状态，便可以把它合并到 `master` 里。这样，在确保这些已完成的特性分支（短期分支，比如之前的 `iss53` 分支）能够通过所有测试，并且不会引入更多错误之后，就可以并到主干分支中，等待下一次的发布。

本质上我们刚才谈论的，是随着提交对象不断右移的指针。稳定分支的指针总是在提交历史中落后一大截，而前沿分支总是比较靠前（见图 3-18）。



![img](https://gitee.com/progit/figures/18333fig0318-tn.png)


图 3-18. 稳定分支总是比较老旧。



或者把它们想象成工作流水线，或许更好理解一些，经过测试的提交对象集合被遴选到更稳定的流水线（见图 3-19）。



![img](https://gitee.com/progit/figures/18333fig0319-tn.png)


图 3-19. 想象成流水线可能会容易点。



你可以用这招维护不同层次的稳定性。某些大项目还会有个 `proposed`（建议）或 `pu`（proposed updates，建议更新）分支，它包含着那些可能还没有成熟到进入 `next` 或 `master` 的内容。这么做的目的是拥有不同层次的稳定性：当这些分支进入到更稳定的水平时，再把它们合并到更高层分支中去。再次说明下，使用多个长期分支的做法并非必需，不过一般来说，对于特大型项目或特复杂的项目，这么做确实更容易管理。

### 特性分支

在任何规模的项目中都可以使用特性（Topic）分支。一个特性分支是指一个短期的，用来实现单一特性或与其相关工作的分支。

我们在上节的例子里已经见过这种用法了。我们创建了 `iss53` 和 `hotfix` 这两个特性分支，在提交了若干更新后，把它们合并到主干分支，然后删除。该技术允许你迅速且完全的进行语境切换 — 因为你的工作分散在不同的流水线里，每个分支里的改变都和它的目标特性相关，浏览代码之类的事情因而变得更简单了。你可以把作出的改变保持在特性分支中几分钟，几天甚至几个月，等它们成熟以后再合并，而不用在乎它们建立的顺序或者进度。









## rebase

图解git： https://www.runoob.com/w3cnote/git-graphical.html

把一个分支中的修改整合到另一个分支的办法有两种：`merge` 和 `rebase`（译注：`rebase` 的翻译暂定为“衍合”）。

### <span id="rebase">基本的衍合操作</span>

有了 `rebase` 命令，就可以把在一个分支里提交的改变移到另一个分支里重放一遍。(也可以 `git rebase [主分支] [特性分支]`，就不用切换分支)。

```
C0 -- M1 -- M2 -- M3(origin/master）
	\-- C1(master)
```

经过 rebase，我们得到的结果是

```
C0 -- M1 -- M2 -- M3(origin/master)
\-- C1      				\-- C1'(master)
```

如果没有冲突的话，C1' 和 C1 基本上内容一致。

注意现在的 C1 因为已经没有引用了，所以除非你知道其 commit id，否则就不太好直接定位了。JVM 会直接 GC，但是 git 不会随便扔，但是也不太好找。所以如果你希望定位的话，最好加一个 branch/tag 引用指向它。

它的原理是回到两个分支最近的共同祖先，根据当前分支后续的历次提交对象（这里只有一个 C3），生成一系列文件补丁。

一般我们使用衍合的目的， 比如某些项目你不是维护者，但想帮点忙的话，最好用衍合：先在自己的一个分支里进行开发，当准备向主项目提交补丁的时候，根据最新的 `origin/master` 进行一次衍合操作然后再提交，这样维护者就不需要做任何整合工作（译注：实际上是让提交补丁的人来解决分支同最新主干代码之间冲突）。

### 从一个特性分支里再分出一个特性分支再衍合

衍合也可以放到其他分支进行，并不一定非得根据分化之前的分支。以图 3-31 的历史为例，我们为了给服务器端代码添加一些功能而创建了特性分支 `server`，然后提交 C3 和 C4。然后又从 C3 的地方再增加一个 `client` 分支来对客户端代码进行一些相应修改，所以提交了 C8 和 C9。最后，又回到 `server` 分支提交了 C10。

![img](https://gitee.com/progit/figures/18333fig0331-tn.png)图 3-31



假设在接下来的一次软件发布中，我们决定先把客户端的修改并到主线中，而暂缓并入服务端软件的修改。这个时候，我们就可以把基于 `server` 分支而非 `master` 分支的改变（即 C8 和 C9），跳过 `server` 直接放到 `master` 分支中重演一遍，但这需要用 `git rebase` 的 `--onto` 选项指定新的基底分支 `master`：

```sh
$ git rebase --onto master server client
```

这好比在说：“取出 `client` 分支，找出 `client` 分支和 `server` 分支的共同祖先之后的变化，然后把它们在 `master` 上重演一遍”。它的结果如图 3-32 所示，非常酷（译注：虽然 `client` 里的 C8, C9 在 C3 之后，但这仅表明时间上的先后，而非在 C3 修改的基础上进一步改动，因为 `server` 和 `client` 这两个分支对应的代码应该是两套文件，虽然这么说不是很严格，但应理解为在 C3 时间点之后，对另外的文件所做的 C8，C9 修改，放到主干重演。）

![img](https://gitee.com/progit/figures/18333fig0332-tn.png)图 3-32

现在可以快进 `master` 分支了（见图 3-33）：

```sh
$ git checkout master
$ git merge client
```

![img](https://gitee.com/progit/figures/18333fig0333-tn.png)


图 3-33. 快进 master 分支，使之包含 client 分支的变化。





### 衍合的风险

要用衍合得遵守一条准则：**一旦分支中的提交对象发布到公共仓库，就千万不要对该分支进行衍合操作。**如果把衍合当成一种在推送之前清理提交历史的手段，而且仅仅衍合那些尚未公开的提交对象，就没问题。如果衍合那些已经公开的提交对象，并且已经有人基于这些提交对象开展了后续开发工作的话，就会出现叫人沮丧的麻烦。

在进行衍合的时候，实际上抛弃了一些现存的提交对象而创造了一些类似但不同的新的提交对象。如果你把原来分支中的提交对象发布出去，并且其他人更新下载后在其基础上开展工作，而稍后你又用 `git rebase` 抛弃这些提交对象，把新的重演后的提交对象发布出去的话，你的合作者就不得不重新合并他们的工作，这样当你再次从他们那里获取内容时，提交历史就会变得一团糟。

下面我们用一个实际例子来说明为什么公开的衍合会带来问题。假设你从一个中央服务器克隆然后在它的基础上搞了一些开发，提交历史类似图所示：

![img](https://gitee.com/progit/figures/18333fig0336-tn.png)





现在，某人在 C1 的基础上做了些改变，并合并他自己的分支得到结果 C6，推送到中央服务器。当你抓取并合并这些数据到你本地的开发分支中后，会得到合并结果 C7，历史提交会变成图 这样：

![img](https://gitee.com/progit/figures/18333fig0337-tn.png)



接下来，那个推送 C6 上来的人决定用衍合取代之前的合并操作；继而又用 `git push --force` 覆盖了服务器上的历史，得到 C4'。而之后当你再从服务器上下载最新提交后，会得到：

![img](https://gitee.com/progit/figures/18333fig0338-tn.png)


图 3-38. 有人推送了衍合后得到的 C4'，丢弃了你作为开发基础的 C4 和 C6。

下载更新后需要合并，但此时衍合产生的提交对象 C4' 的 SHA-1 校验值和之前 C4 完全不同，所以 Git 会把它们当作新的提交对象处理，而实际上此刻你的提交历史 C7 中早已经包含了 C4 的修改内容，于是合并操作会把 C7 和 C4' 合并为 C8（见图 3-39）:

![img](https://gitee.com/progit/figures/18333fig0339-tn.png)


图 3-39. 你把相同的内容又合并了一遍，生成一个新的提交 C8。



在 C8 之后，你的提交历史里就会同时包含 C4 和 C4'，两者有着不同的 SHA-1 校验值，如果用 `git log` 查看历史，会看到两个提交拥有相同的作者日期与说明，令人费解。而更糟的是，当你把这样的历史推送到服务器后，会再次把这些衍合后的提交引入到中央服务器，进一步困扰其他人（译注：这个例子中，出问题的责任方是那个发布了 C6 后又用衍合发布 C4' 的人，其他人会因此反馈双重历史到共享主干，从而混淆大家的视听。）





## <span id="merge">merge</span>

```
C0 -- M1 -- M2 -- M3(origin/master）
	\-- C1(master)
```

对于上面的情况，还有一种方式是 merge

```
C0 -- M1 -- M2 -- M3(origin/master)
\         					\
	\-- C1-------------\C2
```

其中 C2 在没有冲突的情况下，基本上就是一个空结点，如果有解冲突的话，就是有内容的。
其存在的意义就是，我们可以把 C0 到 C1 这个修改的历史保留下来。而 rebase 完以后，就丢失了这部分信息。

## fast-forward操作

在 Git 中，fast-forward 是一种合并两个分支的方式，如果一个分支是从当前分支派生出来，并且在当前分支没有新的提交时，那么这个分支就可以通过 fast-forward 合并到当前分支。在这种情况下，Git 只需将当前分支指针向前移动到分支尖端，这样就实现了分支的合并，同时保留了原始分支的提交历史记录。

换句话说就是这个push命令假设你的本地分支和远端分支的唯一区别是你本地有几个新的commit，而远端没有，比如下图这种情况：

1<–2<–3  (远端)
              \
              4<–5  (本地)













## git merge 和 git rebase 的区别

明确以下几点

- 远端 (origin) 的分支一般是不允许修改的，所以 rebase 只能发生在本地
- 我们完全不关心你本地的开发过程，我们只关心最终提交上来的代码
- 我们只 review 最终的 diff。这个 diff 说明了你做了哪些改动

如果你多提交一个无用结点上来，commit history 还会比较复杂, review 起来也会很麻烦。所以在我们的工作流中，由本地向 origin/master 提交的时候，**严禁使用 merge**。有时候还是有临时远端分支的需求，如果 feature 开发完成之后

- 如果分支比较小，没几个文件，那就 rebase，squash 成一个 commit，打包提到 origin/master 上。这时候 feature 分支就可以废弃了。
- 如果分支比较大，而且关心历史状态，那就使用 merge，但是要慎重。

不同于 `git rebase` 的是，`git merge` 在不是 fast-forward（快速合并）的情况下，会产生一条额外的合并记录，类似 `Merge branch 'xxx' into 'xxx'` 的一条提交信息。另外，在解决冲突的时候，用 merge 只需要解决一次冲突即可，简单粗暴，而用 rebase 的时候 ，需要依次解决每次的冲突，才可以提交。

![image-20221030230709348](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221030230709348.png)

![image-20221030231204448](https://picbed-1306720359.cos.ap-guangzhou.myqcloud.com/else/image-20221030231204448.png)







## <span id="cherry-pick">`cherry-pick`将指定的提交（commit）应用于其他分支</span>

### 应用场景

对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。

这时分两种情况。一种情况是，你需要另一个分支的所有代码变动，那么就采用合并（`git merge`）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用 Cherry pick。



### 基本使用

> ```bash
> $ git cherry-pick <commitHash>
> ```

上面命令就会将指定的提交`commitHash`，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

举例来说，代码仓库有`master`和`feature`两个分支。

> ```bash
>     a - b - c - d   Master
>          \
>            e - f - g Feature
> ```

现在将提交`f`应用到`master`分支。

> ```bash
> # 切换到 master 分支
> $ git checkout master
> 
> # Cherry pick 操作
> $ git cherry-pick f
> ```

上面的操作完成以后，代码库就变成了下面的样子。

> ```bash
>     a - b - c - d - f   Master
>          \
>            e - f - g Feature
> ```

从上面可以看到，`master`分支的末尾增加了一个提交`f`。

`git cherry-pick`命令的参数，不一定是提交的哈希值，分支名也是可以的，表示转移该分支的最新提交。

> ```bash
> $ git cherry-pick feature
> ```

上面代码表示将`feature`分支的最近一次提交，转移到当前分支。





### 转移多个提交

Cherry pick 支持一次转移多个提交。

> ```bash
> $ git cherry-pick <HashA> <HashB>
> ```

上面的命令将 A 和 B 两个提交应用到当前分支。这会在当前分支生成两个对应的新提交。

如果想要转移一系列的连续提交，可以使用下面的简便语法。

> ```bash
> $ git cherry-pick A..B 
> ```

上面的命令可以转移从 A 到 B 的所有提交。它们必须按照正确的顺序放置：提交 A 必须早于提交 B，否则命令将失败，但不会报错。

注意，使用上面的命令，提交 A 将不会包含在 Cherry pick 中。如果要包含提交 A，可以使用下面的语法。

> ```bash
> $ git cherry-pick A^..B 
> ```



注意：<font color="red">git 的每一次提交都是存放的代码在该次提交之后发生的变化，而不是整个项目的最新代码。每次提交都是基于之前提交的快照（snapshot）进行的，因此每个提交只包含了相应的变化。</font>



### 配置项

`git cherry-pick`命令的常用配置项如下。

**（1）`-e`，`--edit`**

打开外部编辑器，编辑提交信息。

**（2）`-n`，`--no-commit`**

只更新工作区和暂存区，不产生新的提交。

**（3）`-x`**

在提交信息的末尾追加一行`(cherry picked from commit ...)`，方便以后查到这个提交是如何产生的。

**（4）`-s`，`--signoff`**

在提交信息的末尾追加一行操作者的签名，表示是谁进行了这个操作。

**（5）`-m parent-number`，`--mainline parent-number`**

如果原始提交是一个合并节点，来自于两个分支的合并，那么 Cherry pick 默认将失败，因为它不知道应该采用哪个分支的代码变动。

`-m`配置项告诉 Git，应该采用哪个分支的变动。它的参数`parent-number`是一个从`1`开始的整数，代表原始提交的父分支编号。

> ```bash
> $ git cherry-pick -m 1 <commitHash>
> ```

上面命令表示，Cherry pick 采用提交`commitHash`来自编号1的父分支的变动。

一般来说，1号父分支是接受变动的分支（the branch being merged into），2号父分支是作为变动来源的分支（the branch being merged from）。

### 代码冲突

如果操作过程中发生代码冲突，Cherry pick 会停下来，让用户决定如何继续操作。

**（1）`--continue`**

用户解决代码冲突后，第一步将修改的文件重新加入暂存区（`git add .`），第二步使用下面的命令，让 Cherry pick 过程继续执行。

> ```bash
> $ git cherry-pick --continue
> ```

**（2）`--abort`**

发生代码冲突后，放弃合并，回到操作前的样子。

**（3）`--quit`**

发生代码冲突后，退出 Cherry pick，但是不回到操作前的样子。

### 转移到另一个代码库

Cherry pick 也支持转移另一个代码库的提交，方法是先将该库加为远程仓库。

> ```bash
> $ git remote add target git://gitUrl
> ```

上面命令添加了一个远程仓库`target`。

然后，将远程代码抓取到本地。

> ```bash
> $ git fetch target
> ```

上面命令将远程代码仓库抓取到本地。

接着，检查一下要从远程仓库转移的提交，获取它的哈希值。

> ```bash
> $ git log target/master
> ```

最后，使用`git cherry-pick`命令转移提交。

> ```bash
> $ git cherry-pick <commitHash>
> ```





# 回退

## 不同的工作区域撤销更改

开发中，我们经常需要回退代码的操作，在不同的工作区域中，回退代码的方式也是不相同的。如下图所示，假设现在要在 feature/revoke 分支上进行开发,

首先通过 `git status` 查看下现在的状态。

![image-20210520115802579.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4ede8763be443868de951dc08721c1a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

目前我们的工作区是很干净的，没有任何修改的操作，此时，修改一下代码再次查看状态，可以看到，1.js 这个文件被修改了。

![image-20210520115934693.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/371084f06fca40778b2f95900ebf19b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

现在我们想把 1.js 这个文件恢复到修改前的状态，即撤回工作区的修改，就可以使用  `git checkout -- <filename>` 的命令，如果要撤回多个文件的修改，文件之间使用空格隔开，如下图所示，我们撤回了 1.js 文件的修改，工作区也恢复干净了。

![image-20210520120242475.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02da2adecc3b43bd917294c203596d1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

如果说现在我们对文件进行了修改，并且已经提交到暂存区了，这部分文件我们不想要的话，那么就可以通过 `git reset <filename>` 的命令来对特定的文件进行撤销，`git reset` 会撤回所有存在暂存区的文件，如下图所示，查看前后的状态可知，文件最后成功撤回到工作区了。

![image-20210520141538130.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0d6b5e17ec341afb86e1e9732f2ded9~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)





## git reset 与  git revert区别

[原文链接](https://blog.csdn.net/yxlshk/article/details/79944535)

git reset 使用场景：恢复到之前某个提交的版本，且那个版本之后提交的版本我们都不要了。

git revert **适用场景：** 撤销之前的某一版本，但是又想保留该目标版本后面的版本，记录下这整个版本变动流程。

注意：使用 `git revert` 撤销提交时，会创建一个新的提交，因此它适用于公共代码库和已被其他人使用的项目。如果您正在处理私有存储库或本地更改，请考虑使用 `git reset` 和 `git commit` 命令来覆盖之前的提交

## git reset

### 介绍

```shell
git reset [--soft | --mixed | --hard] [HEAD]
```

git reset 实际上就是在修改head指向的commit。根据修改head后，是否级联修改stage、workspace，可进一步的细分成三种模式hard、sort、mixed（默认）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/048b2733d7054c99a18fc402b9bfba40~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)



### 参数

#### --soft

##### 修改范围

会重置repository(.git下的版本库)，但保留stage(暂存区)、workspace(实际工作区即你能看到的目录)中的改动

##### 场景--取消上次提交

1. `git reset --soft HEAD^`
1. 再重新提交

![git6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/843c54ebbc5643fba64ee5142f6be420~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

##### 场景--撤销上次提交的部分修改

1. 使用 `git reset --soft HEAD^` 命令将当前分支的指针移动到上一个提交，并保留上一个提交所做的更改。
2. 使用 `git add` 命令添加需要保留的更改，不需要保留的更改可以忽略。
3. 使用 `git commit -c ORIG_HEAD` 命令创建新的提交，并包含原始提交的消息和元数据。



#### **--mixed** 

是默认值，可以不用带该参数，会重置repository、stage，只保留workspace中的改动

实例：

```shell
$ git reset HEAD^            # 回退所有内容到上一个版本  
$ git reset HEAD^ hello.php  # 回退 hello.php 文件的版本到上一个版本  
$ git  reset  052e           # 回退到指定版本
```

#### **--hard** (撤销远程的最后一次commit)

##### 修改范围

会同时重置repository、stage、workspace

##### 场景--想放弃当前所有修改

1. 写了一段时间并且add & commit了
2. 刚写的不大行，想放弃整个修改
3. 这时候就可以用hard模式将repository、stage、workspace重置到修改之前

##### 场景--撤销远程的最后一次修改

要将远程仓库回退到倒数第二次的提交，你可以按照以下步骤进行操作：

1. 首先，使用以下命令查看提交历史记录，找到你需要回退的提交的哈希值：
   ```
   git log
   ```

2. 复制倒数第二次提交的哈希值。

3. 使用以下命令将远程仓库回退到该提交：
   ```
   git reset --hard <commit-hash>
   ```

   将`<commit-hash>`替换为你复制的倒数第二次提交的哈希值。

4. 最后，使用以下命令将更改推送到远程仓库：
   ```
   git push origin master --force
   ```

   这将强制推送更改到远程仓库。

请注意，这将会修改远程仓库的历史记录，如果其他人也在使用该仓库，可能会对其产生影响。确保在进行此操作之前，与团队成员进行沟通，并确保大家都知道并同意这个修改。



##### 实例

```shell
$ git reset –-hard HEAD~3  # 回退上上上一个版本  
$ git reset –-hard bae128  # 回退到某个版本回退点之前的所有信息。 
$ git reset --hard origin/master    # 将本地的状态回退到和远程的一样 
```







## git revert

[原文链接](https://blog.csdn.net/yxlshk/article/details/79944535)

### 原理

git revert用于撤销该版本的修改。这会创建一个新的提交，该提交会撤销上一个提交所做的更改。如果你只想要撤销上一个提交的部分更改，则可以提供要撤销的提交的哈希值。比如，我们commit了三个版本（版本一、版本二、 版本三），想要撤销版本二，但又不想影响撤销版本三的提交，就可以用 git revert 命令来反做版本二，生成新的版本四，这个版本四里会保留版本三的东西，但撤销了版本二的东西。如下图所示：

![](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwNDE0MjA1ODE2MTg4)





### 具体操作

举个例子，现在库里面有三个文件：READ.md、text.txt、text2.txt。

![](https://img-blog.csdnimg.cn/20190726111023401.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)

#### 1.查看版本号

可以通过命令行查看（输入git log）：
如图，最近的两个版本分别叫：“add text.txt”（即新增了文件text.txt）、“add text2.txt”（新增了文件text2.txt）。这个时候我们不需要text.txt这个文件了，那就是说不想要“add text.txt”那个版本的操作，那可以通过反做“add text.txt”这个版本来实现。

![](https://img-blog.csdnimg.cn/20190726105234748.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)

也可以通过github网站图形化界面查看版本号：

![](https://img-blog.csdnimg.cn/20190726105637358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)

#### 2.使用“git revert -n 版本号”反做，并使用“git commit -m 版本名”提交：

（1）反做，使用“git revert -n 版本号”命令。如下命令，我们反做版本号为8b89621的版本：

```
git revert -n 8b89621019c9adc6fc4d242cd41daeb13aeb9861
```


注意： 这里可能会出现冲突，那么需要手动修改冲突的文件。解决完冲突后要git add 文件名。

（2）提交，使用“git commit -m 版本名”，如：

```
git commit -m "revert add text.txt" 
```


此时可以用“git log”查看本地的版本信息，可见多生成了一个新的版本，该版本反做了“add text.txt”版本，但是保留了“add text2.txt”版本：

![](https://img-blog.csdnimg.cn/20190726110223433.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)

#### 3.使用“git push”推上远程库

查看github上显示的远程库版本信息：

![](https://img-blog.csdnimg.cn/20190726110646667.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)

此时查看仓库的文件，剩下两个：READ.md、text2.txt

![](https://img-blog.csdnimg.cn/201907261108187.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3l4bHNoaw==,size_16,color_FFFFFF,t_70)





### 使用 git revert 回滚某次的提交

想象这么一个场景，你的项目最近有2个版本要上线，这两个版本还伴随着之前遗留的 bug 的修复，一开始的时候，你将 bug 修复在了第一个版本的 release 分支上，突然在发版前一天，测试那边反馈，需要把第一个版本修复 bug 的内容改在第二个版本上，这个时候，第一个版本的集成分支的提交应该包括了第一个版本的功能内容，遗留 bug 修复的提交和其他同事提交的内容，想要通过 reset 的方式粗暴摘除之前的关于 bug 修复的 commit 肯定是不行的，同时，这种做法比较危险，此时，我们既不想破坏之前的提交记录，又想撤回我们遗留 bug 的 commit 记录应该怎么做呢？git revert 就派上了用场。

> `git revert` 撤销某次操作，此操作不会修改原本的提交记录，而是会新增一条提交记录来抵消某次操作。

语法： `git revert <commit-id>` 针对普通 commit

`git revert <commit-id> -m` 针对 merge 的 commit

下面就用一个案例来理解一下这个命令，如下图所示，假设被红框框起来的地方是会引起 bug 的一次提交，在他的提交之后，又进行了2次提交，其中包含了其它同事的提交。

![image-20210519142702752.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f36331158e084072a033802bf4fa0478~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

此时想把引起提交的 bug 的干掉，执行 `git revert 1121932`，执行操作后，再打开查看日志，如下图所示，可以看到是新增了一条 commit 记录，这个 commit 的产生的 msg 是自动生成的，Revert 开头，后面跟撤回的 commit-msg 信息 之前的 commit 记录并没有消失，此时也达到了代码回退的效果

![image-20210519142824836.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9729e537218e4609b54df3e899fd332f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

此外 git revert 也可以回滚多次的提交

语法：`git revert [commit-id1] [commit-id2] ...`  注意这是一个前开后闭区间，即不包括 commit1 ，但包括 commit2 。

回滚我们的提交有二种方式，一种是上文提到的`git revert`命令外，还可以使用 `git reset` 命令，那么它们两者有什么区别呢？

`git revert` 会新建一条 commit 信息，来撤回之前的修改。

`git reset` 会直接将提交记录退回到指定的 commit 上。

对于个人的 feature 分支而言，可以使用 `git reset` 来回退历史记录，之后使用 `git push --force` 进行推送到远程，但是如果是在多人协作的集成分支上，不推荐直接使用 `git reset` 命令，而是使用更加安全的 `git revert` 命令进行撤回提交。这样，提交的历史记录不会被抹去，可以安全的进行撤回。



### 撤销某一个提交的部分修改

具体步骤如下：

1. 使用 `git log` 命令查看提交历史，找到要撤销的提交的 SHA-1 值。
2. 使用 `git revert -n <commit-SHA-1值>` 命令创建一个新的提交，该提交将撤销指定提交所做的更改，并暂时将更改保存在工作区中。 `-n` 选项表示只创建一个新的提交，而不自动提交。
3. 使用 `git add` 命令添加需要保留的更改，不需要保留的更改可以忽略。
4. 使用 `git commit` 命令创建新的提交，并包含对原始提交进行撤销的说 明。
5. 可以使用 `git log` 确认新的提交是否正确。





## git reflog + git reset

[git reflog参考介绍](https://www.jianshu.com/p/7e4cef3863e7)

如果合并之后已经做了一些操作或者想做一些更细致的回退操作使用git reflog来查找你需要的“复活点”，事实上git会标记并记录你大部分的操作，相当于随时给你做了相当多的游戏存档，在你需要时可以选择任意存档来重新开始，但是可能会丢失掉一些修改，不了解reset操作的童鞋请先补习慎重使用。

```
git reset --hard HEAD@{8}
```


![](https://img-blog.csdn.net/20160202192935902)


从图中可以看到，大部分的HEAD@{*}记录了你重要的提交/切换/合并等操作的点，找到你需要回退的点，执行reset操作即可实现回退。

## reflog

[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fdocs%2Fgit-reflog)

### 描述

它记录了所有的 commit 操作记录，便于错误操作后找回记录。

### 应用场景

应用场景：某天你眼花，发现自己在其他人分支提交了代码还推到远程分支，这时因为分支只有你的最新提交，就想着使用 `reset --hard`，结果紧张不小心记错了 commitHash，reset 过头，把同事的 commit 搞没了。没办法，`reset --hard` 是强制回退的，找不到 commitHash 了，只能让同事从本地分支再推一次（同事瞬间拳头就硬了，怎么又是你）。于是，你的技术形象又一落千丈。

### 命令使用

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9855c6fcc8e84545952f3f93d2a0445a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

分支记录如上，想要 reset 到 b。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c9e3cc1281f436fa3f0d5e10cb10462~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

误操作 reset 过头，b 没了，最新的只剩下 a。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36cc5814ef784a8180676058d4636f8e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

这时用 `git reflog` 查看历史记录，把错误提交的那次 commitHash 记下。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee749d2bd3564213b7a4ee565c458f6d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

再次 reset 回去，就会发现 b 回来了。





# Github

##  PullRequest

### 介绍

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8b347d7246f48b0a5fd46de28c1c54a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

假设你要给然叔的组件库提交代码，在 GitHub 中的 PullRequest 步骤如下：

1. 从然叔组件库 fork 代码仓库到你的仓库；
2. 从自己仓库 clone 到本地；
3. 修改代码或添加新代码，或提交 commit 你的更改；
4. Push 到你的的代码仓库；
5. 给然叔的组件库提交一个 PullRequest (拉取请求)，说明你的修改内容，请求然叔提交。然叔认为属于有价值提交的话，就会点击接受。则 Github 会将这次修改拉取到然叔的项目，这样的话就相当于给然叔组件库提交了一次代码贡献。

简单地说，整个代码贡献过程可以认为是复制 -> 修改 -> 提交拉取请求 -> 接受请求。



### 演示

#### 创建一个 PullRequest

首先，我们创建一个 PullRequest。 目前然叔的个人账号是： su37josephxia。 组件库项目放在一个叫做 smarty-team 的组织上面。虽然也是然叔创建的，但是在 Github 上面可以认为是不同的账号，现在就以 su37josephxia 账号向 smarty-team 提交一个 PullRequest。

**Fork 代码**

Fork 实际上就是复制的意思。在 Github 中相当于将 samrty-team 账号中的 smarty-admin 项目复制了一份到 su37josephxia 账号中。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ec9d0b7d2d84b0c908796d0757bfdbd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6fe717f6fe944c5a54ad728ba994969~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击 【Create fork】就可以了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/534ee08b08f1441cb9fc266f4020ceab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

新创建的代码在 su37josephxia 账号下，这个代码和自己常见的几乎没有差别，只是在界面上多了一点内容：

- 来源： 表示项目复制得哪个地址；
- 提交贡献： 这个按钮是 PullRequest 用的；
- 同步： Sync fork，这是一个新功能，用于将源地址的最新提交拉取回本地址。

**Clone 代码到本地**

```Bash
git clone git@github.com:su37josephxia/smarty-admin.git
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38e226d02c364c16b4546f732e885a70~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e412fb9bc8d448f9f0645b9e4f6f455~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

```Bash
git commit -am 'fix: del Button.tsx useless comments'
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d734542d4784467da54b6b3ec49fa864~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

```Bash
git push
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fdde31852ae4602935172207dd17a08~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

提交代码后，回到 su37josephxia/smarty-admin 的 Github 页面。这个时候就可以看到这个提交。这是一个新的功能，可以更方便你提交 PullRequest。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd945f7a115c4853ad4e0b3a2d24c5e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击 【Contribute】中的 【Open pull request】按钮，就可以创建一个新的 PullRequest 了。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab7216fe70994c18b1d1e73a77b17bfb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

在 pull request 界面中可以看到提交的方向。这里面表明是从 su37josephxia 向 smarty-team 提交代码。当然这里面方向和分支都可以选择，多分支通常用于你同时要处理很多个 PullRequest 的情况，目前只处理一个分支就没有这么麻烦。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e379d4456c4a1fb86fd219b33e443a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

另外，你也可以从后面的比对中清楚地看到你修改的内容。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f0f4755f47042b9b12207f47eaa9ebc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

点击 【Create pull request】后，这个pullrequest 就创建成功了。这时然叔就收到了你的 pullrequest。

#### 审核代码修改

当有人给然叔的组件库提交了代码贡献，然叔就可以很容易地在 【PullRequest】中看到。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca764601103e4236aefcfc5cc8c22e9e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

打开后可以查阅代码变更，也可以清楚地看到这个代码 CI 运行的结果。通过这个结果就可以判断代码是否正确，也可以提出一定的改进意见，让你继续进行修改。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49727e60836642ed91128262b6b8da2a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46341df93d7b48c98e9beba2f0b8c213~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

假设认为你的修改是有价值的，就可以批准你的修改。点击 Merge pull request 就可以接受这次代码合并。这时，你的代码也就合并到了 smarty-team/ smarty-admin 仓库中了，这次代码贡献宣告胜利结束。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5820525266734daabd722b0d81c65699~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fd12526652f4ba2be0153702a0c4f50~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)





## 敏捷开发

### 问题管理 - Issue

#### 介绍

问题管理是四大管理模式之一，你可以将项目开发过程当做一个挖掘问题、表达问题、归结问题、处理问题的过程。

在项目中的问题大概可以归纳为以下几类：

- 任务 - 待完成任务；
- Bug 缺陷；
- Feather 新特性；
- 问题：
  - 功能建议；
  - 项目中不能计划或不期望发生的问题和困难。



这个工单系统需要能够管理提供以下功能：

- 项目管理
  - 优先级
  - 关联项目、基线、里程碑
  - 分配人员
  - 制定日程
  - 监控进度提供统计
- 项目合作 - TeamWork
  - 讨论
  - 邮件通知
- 代码管理
  - 将 Issue 关联代码
  - 将 Issue 关联代码提交与合并

Issue 就是在 Github 中内置的工单系统或者叫问题管理系统。

#### 演示

下面我们来实践一下。在 Github 中打开 【Issue】选项卡。我们看一下如何提交 Issue。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a681b121342490c842d7db4195d85f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

- 描述： 这个是聊天室模式所有人都可以评论；
- 指派者： 实在不知道这个怎么翻译，其实意思就是目前的负责人。如果有一个 Bug 的话，发现的人可以指派给项目负责人。负责人也可以根据分工指派给具体开发，大家也可以自己认领；
- 分类： 这个是一个标签体系。具体重要程度、优先级、分类，大家可以靠这个实现；
- 项目和里程碑： 这个和下文介绍的项目 Project 有关。简单的说，就是表示这个问题和哪个项目相关。一般所有属于这个项目的问题都解决或被移出这个项目，才能算是项目完结；
- 相关代码： 这个功能可以链接某一个代码的提交，也就是相关的代码在哪。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/648a84e2f92a435e8b39251bc0b7e687~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以在 ISSUE 中不断讨论问题、链接代码、指派给相关人，直到最终将问题解决，然后 Close 问题 。 这就是问题管理系统。

### 项目 - Project

在 Github 中会使用敏捷的方式管理项目。在问题管理的基础上，一次项目，譬如说完成某一个版本，可以看做是是解决一部分特定的 Issue。

在 Github 中使用 Project 功能来实现这个功能。这个功能主要的理论根源来自于敏捷开发的看板模式。

使用看板管理项目需要三步：

- 创建项目: 确定目标；
- 将相关 ISSUE 纳入项目中： 拆分任务、划分任务边界；
- 分配任务到个人；
- 看板跟踪项目进度。

1. 创建项目

Github 项目的面板在最新版中调整到了组织或个人目录中（[github.com/orgs/smarty…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Forgs%2Fsmarty-team%2Fprojects%EF%BC%89%EF%BC%8C%E8%BF%99%E6%A0%B7%E6%9B%B4%E5%AE%B9%E6%98%93%E5%9C%A8%E5%A4%9A%E4%B8%AA%E4%BB%A3%E7%A0%81%E4%BB%93%E5%BA%93%E4%B9%8B%E4%B8%AD%E7%AE%A1%E7%90%86%E3%80%82)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6986aaa5350044d98e7d6788c4cabff8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

首先，开启一个项目 【Smarty UI Vite Alpha.1】 开发。接下来可以选择一下项目的种类。

视图方式可以选择 Table 和 Board，Board 就是看板模式。这个模式其实就和大多数敏捷团队中使用的实体看板是一样的。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c23b7c6faa85472486c81f2612597173~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

然后回到 smarty-admin 中将 Project 挂载到此仓库。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec8281f90758411a8c312fcc439a8a47~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

1. 将 ISSUE 纳入项目

接着根据项目目标划定具体的功能。实际上这一步相当于把目标分解和确定开发边界。

比如本次开发的是 Alpha.1 版本。目标就是完善工程化闭环 + 添加典型组件。那么就需要将相关的功能 ISSUE 和 Bug ISSUE 添加到项目之中。如果还缺少一些功能，可以添加 ISSUE。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98ab94d8416d48eca4e6974aa051de69~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e231de99f5141cb9a99fbb5426ba76f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

1. 分配项目

接着就是评估 ISSUE 的重要度和复杂度，来确定开发的有限顺序。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bade5701b141457aac1d2357d978f9ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

跟着就需要分配任务到开发者，或者开发者自觉认领。其实开源团队这个过程一般都是认领的比较多。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf153fba4d1f4ab69c7163f6d6f1b09c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

接下来就是使用，看板功能跟踪项目过程。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/183b0bf5bf9f44779e3a5f536f8c941f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

要强调的是，开发完成不是完成任务。代码的 review 和关闭项目需要第三者确认才有意义。就比如说你开发的新组件，一定是需要然叔检查了你的代码、跑了你写的测试用例、确认才算完成这个 ISSUE







# 工作中常用

图解git：https://www.runoob.com/w3cnote/git-graphical.html

## 相关概念

###  `git pull` 

会做两件事：

- 更新当前本地工作分支（当前签出分支）
- 更新所有其他分支的远程跟踪分支

### Diff / Patch

diff 是一个通用概念，指一堆代码改动集合，一般是可以直接保存到一个文本文件里面的。

### [commit](#commit)

### [撤销最后一次提交](#撤销最后一次提交)

### [branch](#branch)

### [rebase](#rebase)

### [merge](#merge)

### 压缩提交squash

squash 操作可以将多个提交合并成一个提交，并将这个提交的信息合并为一个，同时保留之前每个提交的更改。在 Git 中，可以使用 git rebase 命令来进行 squash 操作。假设当前分支是 feature-branch，它包含了多个提交，需要将这些提交压缩成一个提交，可以使用以下命令：

```
git rebase -i HEAD~n
```

其中 n 是需要压缩的提交数，使用 -i 参数表示进行交互式的 rebase 操作。执行该命令后会打开一个交互式的编辑器，在其中可以选择需要 squash 的提交，以及将它们压缩成一个新的提交的信息。

例如，以下是一个交互式编辑器的示例：

```
cssCopy code
pick 01d1124 Adding feature A
squash 6340bfd Adding feature B
squash efa2e2c Adding feature C
```

其中，pick 表示需要保留的提交，而 squash 则表示需要进行 squash 的提交。在这个例子中，将 6340bfd 和 efa2e2c 这两个提交压缩成一个提交，并将这个提交的信息设置为“Adding feature B and C”。

squash 操作会修改提交历史，因此只应该在本地开发分支上使用，不应该在已经发布的分支或者协作开发的分支上使用。另外，squash 操作也应该在进行代码审查之前完成，以便审查人员能够看到整洁的提交历史。





## 解决冲突

### 打tag

 进行任何可能要处理冲突的 git 操作之前，建议都先打 tag。--- 赵缙翔



### 当前更改与传入的更改的意思

当前更改（local changes）指的是您在本地分支上所做的更改，而传入的更改（incoming changes）指的是从远程仓库获取的更改。





### 情景一

#### 情景介绍

我从master切出的分支feature-test上进行开发。等到了我要将远程的分支feature-test合并到远程的master的时候，由于有其他分支合并进了远程的master或者其他的操作导致远程的master比我本地的master多了几次提交，但由于我目前的分支是从这几次提交前切出来的，所以如果此时我目前分支的远程分支合并到远程的分支就会有冲突。

#### 有两种处理方式

##### 如果冲突比较少的话则可以利用rebase

通过rebase来解决分支合并中的冲突，并保留您的修改和其他人的代码更改。请按照以下步骤操作：

1. 保证本地的目标分支feature是最新的：`git pull`

2. 切换到您的分支：`git checkout feature-test`，并保证您的分支是最新的：`git pull`

3. <font color = "red">在您的分支下使用rebase命令将目标分支合并到您的分支：`git rebase feature`</font>

4. 如果出现冲突，请用编辑器打开有冲突的文件并处理冲突

5. 对于每个冲突，使用以下命令标记为已解决：`git add <file>` (在此之前请确保您已经保存了对文件的更改)

6. 当您处理完所有冲突并标记为已解决时，请使用以下命令将rebase完成：`git rebase --continue`

7. 最后，将更改推送到您的分支的远程分支: `git push origin feature-test --force-with-lease`。然后再把远程的你的分支合并到远程的目标分支。

   1. 解释为啥需要用 `--force-with-lease`:

      举例当前git仓库如下图所示：

      A<--B<--C<-------F<--G  (master)
                      \
                       D<--E  (feature)

      如果你在本地的feature分支上执行了 git rebase msater 命令，于是你现在本地的分支结构变成了下图所示的样子：

      A<–B<–C<–F<–G (master)
                                  \
                                   D’<–E’(feature)

      此时已经在本地完成了rebase操作，但是远端仓库还是初始状态，执行 git push origin feature 会报错。这是因为git的push操作默认是假设远端的分支和你本地的分支可以进行fast-forward操作，换句话说就是这个push命令假设你的本地分支和远端分支的唯一区别是你本地有几个新的commit，而远端没有，比如下图这种情况：

      1<–2<–3  (远端)
                    \
                    4<–5  (本地)

      但是由于进行了rebase操作，现在远端和本地的feature分支的状况是这样的：

      A<–B<–C<—D<–E  (远端feature分支)
                      \
                       F<–G<–D’<–E’  (本地feature分支)

      这种情况下是不能进行fast-forwad模式的合并操作的，所以当执行 git push origin feature 命令时会报一个错误。解决办法：git push --force-with-lease origin feature  使用该命令在强制覆盖前会进行一次检查如果其他人在该分支上有提交会有一个警告，此时可以避免福改代码的风险。



##### 如果冲突比较多的话则可以利用cherry-pick

请按照以下步骤操作：

1. 删除本地的master分支，从新拉取远程的master分支，这样就能保证本地的master跟远程的master同步了。（因为我们是不会在master上开发的，所以直接删也不会对你本地有什么影响。）
2. <font color="red">在本地重新从master中切出一个分支feature-new，然后利用cherry-pick将feature-test里的提交应用到feature-new里。</font>（[cherry-pick的操作点击跳转](#cherry-pick)）
3. 把feature-new推送到远程，然后再将远程的feature-new与远程的master合并就没有冲突了。





### 情景二

#### 情景介绍

我现在在一个分支上开发，但是有一个新的分支合并到了master分支，我如何在我的分支上应用最新的代码呢？

#### 解决方法

我的笨方法：将当前分支的内容进行储藏 --> 到master分支拉下新代码 --> 切新的分支 --> 在新的分支上应用刚刚的储藏。





## commit 相关

### **如何修改 commit 内容？**

修改当前（最近一个） commit 可以用 git commit --amend 

修改 HEAD 之前的 commit 用 git rebase -i：

1. 假设我们要修改的 commit 是 HEAD~3（倒数第 4 个 commit），那么我们运行

```
git rebase -i HEAD~4
```

此时 git 会列出 4 个 commit 信息和操作：

```
pick 65a0ee191 feat: kwai -> vue 2.7
pick 196610069 fix: context.root
pick 04f6b880d fix: vue-demi
pick c1ddf73fc fix: vars starting with _

# Rebase 18785215a..c1ddf73fc onto 18785215a (4 commands)
```



我们要修改的提交是上面列出的第一个提交，把它的操作从 pick 换成 edit：

```
edit 65a0ee191 feat: kwai -> vue 2.7
pick 196610069 fix: context.root
pick 04f6b880d fix: vue-demi
pick c1ddf73fc fix: vars starting with _

# Rebase 18785215a..c1ddf73fc onto 18785215a (4 commands)
```



保存并退出编辑界面，让 git 开始 rebase，git 会停在第一个 commit 之后的状态：

```
Stopped at 65a0ee191...  feat: kwai -> vue 2.7
You can amend the commit now, with

  git commit --amend 

Once you are satisfied with your changes, run

  git rebase --continue
```

如 git 所提示的，此时可以修改 65a0ee191 这个 commit，完成后让 git 继续自动 rebase 流程



rebase 过程中可以随时退出，恢复到执行 rebase 之前的状态：

```
git rebase --abort
```







### **如何调整 commit 顺序？**

上述 git rebase -i 功能中，对于列出的提交可以随意调换顺序，Git 会按照指定的顺序重新排列涉及的 commits

### **如何合并 commits？**

#### 方法一

git squash

#### 方法二

git rebase -i 

举例：

1. `git rebase -i HEAD~6`
2. 将你想合并的分支  `pick`替换为 “squash”（或 “s”）。
3. 完成此操作后，保存文件并关闭它。 Git 将打开另一个编辑器，您可以在其中看到它为您生成的新提交消息，你可以保持原样。如果添加新的提交消息，请保存文件并关闭它。
4. 通过运行 git log --oneline 再次检查您的 Git 日志，您应该看到提交已合并











### **如何修改 commit message？**

git commit --amend -m 'new message'

或者

git rebase -i 并使用 reword 指令

### **如何分割 commit？**

类似前面的"修改 commit"流程，但是在 edit 阶段 reset commit，然后分批提交改动；具体步骤参考 https://git-scm.com/docs/git-rebase#_splitting_commits

分批提交改动可以借助 IDE 的 Git 工具


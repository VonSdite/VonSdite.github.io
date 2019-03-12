---
title: makefile 介绍与编写(二) 概述
toc: true
comments: true
categories:
  - C/C++
  - Makefile
tags:
  - C/C++
  - Makefile
abbrlink: '41973083'
date: 2019-01-02 20:36:42
---

# 前言
**摘录于 《跟我一起写makefile》**

本文主要开始介绍**makefile**的详细细节。

# Makefile组成部分

## 显式规则
显式规则说明了, 如何生成一个或多的的目标文件。
这是由 Makefile 的书写者明显指出, 要生成的文件, 文件的依赖文件, 生成的命令

<!-- more -->

## 隐晦规则
由于 make 有自动推导的功能, 所以隐晦的规则可以让我们比较粗糙地简略地书写 Makefile, 这是由 make 所支持的。

## 变量定义
在 Makefile 中我们要定义一系列的变量, 变量一般都是字符串, 当 Makefile 被执行时, 其中的变量都会被扩展到相应的引用位置上

## 文件指示
其包括了三个部分, 
1. 一个是在一个 Makefile 中引用另一个 Makefile, 就像 C 语言中的include 一样;
2. 另一个是指根据某些情况指定 Makefile 中的有效部分, 就像 C 语言中的预编译#if 一样;
3. 还有就是定义一个多行的命令

## 注释
Makefile 中只有行注释, 和 UNIX 的 Shell 脚本一样, 其注释是用"#"字符。如果你要在你的 Makefile 中使用"#"字符, 可以用**转义字符**<strong>\\</strong>框起来

# makefile的文件名
默认的情况下, make 命令会在当前目录下按顺序找寻文件名为"GNUmakefile"、"makefile"、"Makefile"的文件, 找到了解释这个文件。
在这三个文件名中, 最好使用"Makefile"这个文件名, 因为, 这个文件名第一个字符为大写, 这样有一种显目的感觉。
最好不要用"GNUmakefile", 这个文件是 GNU 的 make 识别的。
有另外一些 make 只对全小写的"makefile"文件名敏感, 但是基本上来说, 大多数的 make 都支持"makefile"和"Makefile"这两种默认文件名。

当然, 你可以使用别的文件名来命名Makefile, 比如: "Make.Linux" , "Make.Solaris", "Make.AIX"等, 如果要指定特定的 Makefile, 你可以使用 make 的`"-f"`或`"--file"`参数, 如: make -f Make.Linux 或 make --file Make.AIX。

# include其他makefile

在 Makefile 使用 include 关键字可以把别的 Makefile 包含进来, 被包含的文件会**原模原样的放在当前文件的包含位置**。
include 的语法是: 
```makefile
include <filename>
```
filename 可以是当前操作系统 Shell 的文件模式(可以**保含路径和通配符**) 

在include前面可以有一些空字符, 但是**绝不能是[Tab]键开始**。

include 和<filename>可以用一个或多个空格隔开。

## 举个例子
举个例子, 你有这样几个 Makefile: a.mk、b.mk、c.mk, 还有一个文件叫foo.make。
有一个变量$(bar), 其包含了 e.mk 和 f.mk, 那么, 下面的语句: 
```makefile
include foo.make *.mk $(bar)
```
等价于: 
```makefile
include foo.make a.mk b.mk c.mk e.mk f.mkmake 
```
命令开始时, 会找寻 include 所指出的其它 Makefile, 并把其内容安置在当前的位。

如果**文件都没有指定绝对路径或是相对路径**的话, make 会在**当前目录下首先寻找**, 如果当前目录下没有找到, 那么, make 还会在下面的几个目录下找: 
1. 如果 make 执行时, 有`"-I"`或`"--include-dir"`参数, 那么 make 就会在这个参数所指定的目录下去寻找。
2. 如果目录<prefix>/include(一般是/usr/local/include)存在的话, make 也会去找。

如果有文件没有找到的话, make 会生成一条**警告信息**, 但不会马上出现致命错误。它会继续载入其它的文件, 一旦完成 makefile 的读取, make 会再重试这些没有找到, 或是不能读取的文件, 如果还是不行, make 才会出现一条致命信息。

如果你想让 make不理那些无法读取的文件, 而继续执行, 你可以在 include 前加一个减号`"-"`。
如 
```makefile
-include <filename>
```
其表示, 无论 include 过程中出现什么错误, **都不要报错继续执行**。

和其它版本 make 兼容的相关命令是 `sinclude`, 其作用和 include是一样的。


# 不推荐使用的MAKEFILES环境变量
如果你的当前环境中定义了环境变量 MAKEFILES, 那么, make 会把这个变量中的值做一个类似于 include 的动作。这个变量中的值是其它的 Makefile, 用空格分隔。只是, 它和 include不同的是, 从这个环境变中**引入的 Makefile 的"目标"不会起作用**, 如果环境变量中定义的文件发现错误, make 也会不理。

但是在这里还是建议**不要使用这个环境变量**, 因为只要这个变量一被定义, 那么当你使用 make 时, 所有的 Makefile 都会受到它的影响, 这绝不是你想看到的。

在这里提这个事, 只是为了告诉大家, 也许有时候你的 Makefile 出现了怪事, 那么你可以看看当前环境中有没有定义这个变量

# ![](/images/recommend.png)(推荐)make的工作方式
GNU 的 make 工作时的执行步骤入下:
1. 读入所有的 Makefile。
2. 读入被 include 的其它 Makefile。
3. 初始化文件中的变量。
4. 推导隐晦规则, 并分析所有规则。
5. 为所有的目标文件创建依赖关系链。
6. 根据依赖关系, 决定哪些目标要重新生成。
7. 执行生成命令。

1-5 步为第一个阶段, 6-7 为第二个阶段。

第一个阶段中, 如果定义的变量被使用了, 那么, make 会把其展开在使用的位置。
但 make 并不会完全马上展开, make 使用的是拖延战术, 如果变量出现在依赖关系的规则中, 那么仅当这条依赖被决定要使用了, 变量才会在其内部展开。


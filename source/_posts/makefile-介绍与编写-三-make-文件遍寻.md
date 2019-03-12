---
title: makefile 介绍与编写(三) make 文件遍寻
toc: true
comments: true
abbrlink: 1faeaacd
date: 2019-01-02 21:37:12
categories:
  - C/C++
  - Makefile
tags:
  - C/C++
  - Makefile
---
# 前言
**摘录于 《跟我一起写makefile》**

本文主要开始介绍**makefile**的文件遍寻。

<!-- more -->

# 文件遍寻

在一些大的工程中, 有大量的源文件, 我们通常的做法是把这许多的源文件分类, 并存放在不同的目录中。所以, 当 make 需要去找寻文件的依赖关系时, 你可以在文件前加上路径, 但最好的方法是把一个路径告诉 make, 让 make 在自动去找。

## VPATH
Makefile 文件中的特殊变量"VPATH"可以指定源文件的目录所在。
如果没有指明这个变量, make 只会在**当前的目录中去找寻依赖文件和目标文件**。
如果定义了这个变量, 那么, make就会在当 当前目录找不到的情况下, 到所**指定的目录中**去找寻文件了。
```makefile
VPATH = src:../headers
```
上面的的定义指定两个目录, "src"和"../headers", 
make 会按照这个顺序进行搜索。目录由"冒号"分隔。(当然, 当前目录永远是最高优先搜索的地方)

## vpath
另一个设置文件搜索路径的方法是使用 make 的"vpath"**关键字**(注意, 它是**全小写**的), 这**不是变量**, 这是一个 make 的关键字, 这和上面提到的那个 VPATH 变量很类似, 但是它更为灵活。

它可以指定**不同的文件在不同的搜索目录**中。

### 使用方法
使用方法有三种:
1. `vpath <pattern> <directories>`
    为符合模式<pattern>的文件指定搜索目录<directories>

2. `vpath <pattern>`
    **清除**符合模式<pattern>的文件的搜索目录。
3. `vpath`
    **清除所有**已被设置好了的文件搜索目录。

vapth 使用方法中的<pattern>需要包含`"%"`字符。`"%"`的意思是**匹配零或若干字符**。

例如, "%.h"表示所有以".h"结尾的文件。

<pattern>指定了要搜索的文件集, 而<directories>则指定了<pattern>的文件集的搜索的目录。

例如:
```makefile
vpath %.h ../headers
```

该语句表示, 要求 make 在"../headers"目录下搜索所有以".h"结尾的文件。(如果某文件在当前目录没有找到的话)

我们可以连续地使用 vpath 语句, 以指定不同搜索策略。
如果连续的 vpath 语句中出现了相同的<pattern>, 或是被重复了的<pattern>, 那么, make 会按照 vpath 语句的**先后顺序**来执行搜索。如:
```makefile
vpath %.c foo
vpath % blish
vpath %.c bar
```
其表示".c"结尾的文件, 先在"foo"目录, 然后是"blish", 最后是"bar"目录。

```makefile
vpath %.c foo:bar
vpath % blish
```
而上面的语句则表示".c"结尾的文件, 先在"foo"目录, 然后是"bar"目录, 最后才是"blish"目录
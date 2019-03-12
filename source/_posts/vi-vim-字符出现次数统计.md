---
title: vi/vim 字符出现次数统计
toc: true
comments: true
categories:
  - Linux
  - Vim
tags:
  - Linux
  - Vim
abbrlink: 205709c1
date: 2019-01-03 19:22:45
---

# Vi/Vim统计字符出现次数

将被统计的文本内容如下
```text
 network. 1network net work Networked NETWORK
 network 1network net work Networked NETWORK
networked
network network,hello worldk
```
<!-- more -->


## 全词匹配
只统计"network"这个单词出现的次数

vi进入ex模式, 键入如下的命令
```vim
:%s/\<network\>//gn
```
![](/images/2019-01-03-19-36-59.png)

由图可知, 共**匹配到4次**, 而且我们知道单词**network后面跟 "." ","**, 它依旧是 network单词, 均被匹配到了

**解释**
> - **%** 指明操作区间, **%**表示全文本; 可以使用1,$或者行区间代替
> - **n** 统计字符的个数, 替换操作不会被执行
> - **g** 所有满足匹配的字符
> - **"\\>"** 是一个特殊的记号, 表示只匹配单词**末尾**。类似地, **"\<"** 只匹配单词的**开头**。


## 字符串匹配
统计"network"这个字符串出现的次数
vi进入ex模式, 键入如下的命令
```vim
:%s/network//gn
```
![](/images/2019-01-03-19-41-36.png)
由图可知, 共**匹配到7次**。
字符串匹配, 只要有"network"这个字符串出现, 则就算一次匹配了。

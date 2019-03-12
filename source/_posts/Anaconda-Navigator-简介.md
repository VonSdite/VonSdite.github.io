---
title: Anaconda Navigator 简介
toc: true
comments: true
categories:
  - Python
  - Anaconda
tags:
  - Python
  - Anaconda
abbrlink: 13d55c5e
date: 2019-01-08 20:14:24
---

# 简介

## Anaconda Navigator
**Anaconda Navigator**: 是Anaconda Prompt的图形界面, 提供图形化显示和鼠标操作, 可以管理、安装更新第三方包等
![](/images/2019-01-08-20-17-24.png)

<!-- more -->

## Anaconda Prompt
**Anaconda Prompt**: 是一个Anaconda的终端, 类似cmd命令可以便捷操作conda环境, 可以建立不同的python版本环境如Python2和Python3
![](/images/2019-01-08-20-18-27.png)

## IPython
**IPython**: 是一个 python 的交互式 shell, 比默认的python shell 好用得多, 支持**变量自动补全**(tab), 自动缩进, 支持 `bash shell` 命令, 内置了许多很有用的功能和函数。

![](/images/2019-01-08-20-25-37.png)

- 自动补全功能, 使用tab键, 如输入im后按tab键, 可自动补全import。
- 进入IPython, CMD中输入ipython
- 退出IPython, CMD中输入quit()

### 使用魔法指令%

> - `%run test.py` 直接运行python脚本
> - `%pwd`: 显示当前工作目录。
> - `%cd`: 切换工作目录。
> - `%bookmark`: 工作目录书签

### 使用快捷键
> - `ctrl+u` 删除整行(光标在最后)
> - `ctrl+k` 删除整行(光标在最前)
> - `ctrl+l` 清空屏幕
> - `ctrl+c` 中止运行程序
> - `ctrl+e` 跳转到最后
> - `ctrl+a` 跳转到第一行(与Windows热键冲突, 是全选)
> - `ctrl+r` 反向搜索历史

## Jupyter Notebook
**Jupyter Notebook**: 这得从`IPython3.x`版本开始说起, 这是最后的大一统版本, 包括notebook、qtconsole等等, 从IPython 4.0版本开始IPython只集中精力做交互式shell, 变得轻量化; 而剩下的notebook格式, qtconsole, 和notebook web应用等都分离出来统一命名为**Jupyter**,至此IPython和Jupyter分家。**jupyter用网页浏览器打开, 以cell为单元运行, 可用cmd命令直接打开**。

### Jupyter的各种快捷键
> - 执行当前cell, 并自动跳到下一个cell: `Shift Enter`
> - 执行当前cell, 执行后不自动调转到下一个cell: `Ctrl Enter`
> - 是当前的cell进入编辑模式:`Enter`
> - 退出当前cell的编辑模式: `Esc`
> - 删除当前的cell: `双D`
> - 为当前的cell加入line number: `单L`
> - 将当前的cell转化为具有一级标题的maskdown: `单1`
> - 将当前的cell转化为具有二级标题的maskdown: `单2`
> - 将当前的cell转化为具有三级标题的maskdown: `单3`
> - 为一行或者多行添加/取消注释: `Crtl /`
> - 撤销对某个cell的删除: `z`
> - 浏览器的各个Tab之间切换: `Crtl PgUp`和`Crtl PgDn`
> - 快速跳转到首个cell: `Crtl Home`
> - 快速跳转到最后一个cell: `Crtl End`

## Jupyter Qtconsole
**Jupyter Qtconsole**: 调用交互式命令台。从IPython4.0版本开始, 很多IPython子命令现在变成了Jupyter子命令, 如ipython notebook现在是jupyter noteboook。

## Spyder
Spyder: 是一个使用Python语言的开放源代码跨平台科学运算IDE。Spyder可以跨平台, 也可以使用附加组件扩充, 自带交互式工具以处理数据。可以直接查看对象, 如果是多列还是彩色的, 相对来说便于分辨行列。


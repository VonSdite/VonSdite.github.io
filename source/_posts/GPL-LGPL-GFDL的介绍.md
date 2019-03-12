---
title: GNU的三个协议条款GPL LGPL GFDL的介绍
toc: true
comments: true
categories:
    - License
tags:
    - License
abbrlink: a094f759
date: 2018-12-27 16:16:44
---

# 前言

GNU 包含3个协议条款: 
> - GPL  ：GNU通用公共许可证(GNU General Public License)
> - LGPL：GNU较宽松公共许可证 (GNU Lesser General Public License ) 
> - GFDL：GNU自由文档许可证(GNU Free Documentation License )。

<!-- more -->

# GPL 

GNU通用公共许可证(GNU General Public License),**允许软件商业化销售, 但不允许封闭源代码**。

意思就是使用了**GPL License**就必须开源, 而且对遵循GPL的软件进行**任何改动和/或再次开发并予以发布**, 则必须也继承`GPL协议`, **不允许封闭源代码**。

## 例子
**比如**, 只要软件A 引用/修改/衍生了 使用GPL协议的产品B, 软件A也必须使用GPL协议。 比如代码中引用了GPL协议的产品B代码中的一个类库, 这个软件A也必须使用GPL协议

## 应用场景
> - 不适合商业软件
> - 对代码有保密要求的部门

# LGPL 

GNU较宽松公共许可证(GNU Lesser General Public License), **允许软件商业化销售, 但不允许封闭源代码**。

意思就是使用了**LGPL License**就必须开源, 而且对遵循`LGPL`的软件进行**任何改动和/或再次开发并予以发布**, 则您的产品必须继承`LGPL协议`, **不允许封闭源代码**。但是如果您的程序对遵循`LGPL`的软件进行任何连接、调用而不是包含, 则允许封闭源代码。

## 例子
允许商业软件通过**类库引用方式**来使用`LGPL类库`的产品, 且不需要开源商业软件的代码(引用`LGPL类库`, 商业软件不需要使用`LGPL协议`, 所以可以封闭源代码)。

但是如果修改`LGPL协议`的代码或者衍生, 则所有修改的代码、涉及修改部分的额外代码和二次开发的代码都必须采用`LGPL协议`, 意思就是要开源。

## 应用场景
> - `LGPL类库`适合作为第三方类库被商业软件引用
> - 不适合希望以`LGPL协议`代码为基础, 通过修改和衍生的方式做二次开发的软件采用。

# GFDL 

GNU自由文档许可证(GNU Free Documentation License ), **自由软件的通用版权认证协议**。

`GFDL`主要用于**文字作品**。

一旦一个文字作品采用了GFDL许可证, 那么他人就可以自由使用这个作品, 包括用于商业用途, 唯一的条件是**所有衍生作品也必须采用GFDL许可证**。

## 应用场景
目前, 世界上最著名、最成功的使用GFDL的项目, 是**维基百科wikipedia**。
这意味着, 如果你利用wikipedia的材料写成一本书, 那么你的这本书, 他人也可以自由使用。















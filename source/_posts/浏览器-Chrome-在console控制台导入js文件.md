---
title: 浏览器/Chrome 在console控制台导入js文件
toc: true
comments: true
abbrlink: f979bc0f
date: 2018-11-28 00:05:51
categories:
    - Javascript
    - Console
tags:
    - Javascript
---

# 前言

有时候需要在浏览器的`console`上**运行代码**, 当需要**引入别的js文件**时, 就可以如下操作:

<!-- more -->

例子, 比如导入 `jquery-1.4.min.js`
```javascript
var importJs=document.createElement('script');
importJs.setAttribute("type","text/javascript");
importJs.setAttribute("src", 'http://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js');
document.getElementsByTagName("head")[0].appendChild(importJs);
```

---
title: Hexo 添加背景图片并自适应
toc: true
comments: true
abbrlink: c08e78b
date: 2018-11-19 09:40:06
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

1. 在站点配置文件夹`source/images/`放入你的**背景图片**

2. 然后修改主题文件夹`themes/source/css/_custom/custom.styl`
**PS:** 这个文件是存放用户自定义css样式的
在`custom.styl`开头加入如下的代码

<!-- more -->

```styl
body {
    background:url(/images/background.jpg);
    background-repeat: no-repeat;
    background-attachment:fixed;
    background-position:50% 50%;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    -moz-background-size: cover;
    -ms-background-size: cover;

    /*这是设置底部文字, 看个人需要修改*/
     #footer > div > div {
        color:#eee;
    }
}
```


---
title: Hexo Next主题的TOC设置成不是逐级展开
toc: true
comments: true
abbrlink: 6c0dbfd2
date: 2018-12-05 15:44:11
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

# 前言
使用`Hexo` + `Next` 主题编写文章时, `Next`主题会自动给文章生成`TOC`目录, 如图
![](/images/2018-12-05-15-57-19.png) 

<!-- more -->

![](/images/2018-12-05-15-57-37.png)

只有当你下拉浏览到相应的**目录级**时, `TOC`目录才会展开, 这**不方便**别人**一次性**看到所有的目录

<br>

如果想最开始打开文章一次性就把`TOC`目录全部展开, 可进行如下的修改
打开站点目录下的`themes/next/source/css/_common/components/sidebar/sidebar-toc.styl`

找到如下的代码
```styl
.post-toc .nav .nav-child { display: none; }
```
修改为
```styl
.post-toc .nav .nav-child { display: block; }
```

这样既可完成想要的功能


---
title: Hexo Next自定义是否显示TOC的自动编号
toc: true
comments: true
abbrlink: c6c725f5
date: 2018-11-25 10:15:27
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

# 前言

有时候写文章, 我们会习惯性地加上编号, 有时候又不想加上编号, 这个时候就需要自定义是否显示编号了。

效果如图:
![](/images/2018-11-25-10-19-00.png)

<!-- more -->

# 设置
进入站点文件夹下`themes/next/layout/_macro/sidebar.swig`, 找到如下的代码
```swig
{% if page.toc_number === undefined %}
    {% set toc = toc(page.content, { "class": "nav", list_number: theme.toc.number }) %}
{% else %}
    {% set toc = toc(page.content, { "class": "nav", list_number: page.toc_number }) %}
{% endif %}
```

发现代码的逻辑是：
1. 先判断文章的`front-matter`是否定义了`toc_number`
2. 无则会使用主题配置文件中的`toc_number`

而`toc_number`是一个**布尔值**, 表明是否要给文章的toc列表编号
所以只要在**不需要加编号**的文章的`front-matter`加上 `toc_number: false`即可
![](/images/2018-11-25-10-22-28.png)


---
title: Hexo 增加字数统计和阅读时长
toc: true
comments: true
abbrlink: bff1f160
date: 2018-11-18 00:01:53
categories:
  - Hexo 
  - Next
tags:
  - Hexo
  - Next
---

# 添加字数统计和阅读时长

效果如图
![](/images/2018-11-18-00-06-16.png)
![](/images/2018-11-18-00-06-31.png)

<!-- more -->

#### 安装插件

```
npm install hexo-symbols-count-time --save
```

#### 修改配置文件
在博客根目录下的**站点配置文件**`_config.yml`配置文件**最后**加入如下代码

```yml
symbols_count_time:
 #文章内是否显示
  symbols: true
  time: true
 # 网页底部是否显示
  total_symbols: true
  total_time: true
```

修改**主题配置文件**`_config.yml`配置文件中的`symbols_count_time`的值(用`ctrl` + `F`来找到这个键)
```yml
# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
symbols_count_time:
  separated_meta: true
  #文章中的显示是否显示文字（本文字数|阅读时长） 
  item_text_post: true
  #网页底部的显示是否显示文字（站点总字数|站点阅读时长） 
  item_text_total: false
  # Average Word Length (chars count in word)
  awl: 4
  # Words Per Minute
  wpm: 275

```

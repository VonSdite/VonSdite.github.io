---
title: Hexo Next访客统计不蒜子
toc: true
comments: true
abbrlink: a2e026ef
date: 2018-11-18 16:05:43
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

# Hexo增加访客统计

效果如图
![](/images/2018-11-18-16-06-16.png)

`Next` 主题在版本6.0以上已经内置了**不蒜子访客统计**的代码, 
只要修改**主题配置文件**`_config.yml`即可

<!-- more -->

```yml
# Show Views/Visitors of the website/page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi
busuanzi_count:
  enable: true
  total_visitors: true
  total_visitors_icon: user
  total_views: true
  total_views_icon: eye
  # 文章的阅读次数不用不蒜子
  # 因为在首页看不到阅读数，要进入文章才能看到
  post_views: false
  post_views_icon: eye
```

[文章阅读次数设置](https://vonsdite.github.io/posts/74d5335f.html)

---
title: Hexo Next 修改超链接的样式
toc: true
comments: true
abbrlink: 13afd8d4
date: 2018-11-17 15:03:54
categories:
  - Hexo 
  - Next
tags:
  - Hexo
  - Next
---

## Hexo Next 默认超链接样式

默认的**Next主题**的超链接的样式是 **单纯的黑色** + **下划线**

显得有点单调且**不显眼**

<!-- more -->

## 修改超链接样式

- 打开博客目录下`./themes/source/css/_custom/custom.styl`
- 在`cutom.styl` 最开始处加入如下的代码

```styl
if hexo-config("custom_css.post_body_a.enable")
  .post-body 
    a:not(.btn){
      color: convert(hexo-config("custom_css.post_body_a.normal_color"));
      border-bottom: none;
      &:hover {
        color: convert(hexo-config("custom_css.post_body_a.hover_color"));
        text-decoration: underline;
      }
    }
```

**PS:** 其中的 `a:not(.btn)` 是为了不影响**阅读全文按钮**

- 然后在**主题配置文件**`./themes/_config.yml`中加入`custom_css`的配置

```yml
custom_css:
  # the style of post body link
  post_body_a:
    enable: true
    normal_color: "#0593d3"
    hover_color: "#0477ab"
```

后续修改**超链接**样式时，只需修改**配置文件**里面的**颜色值**即可

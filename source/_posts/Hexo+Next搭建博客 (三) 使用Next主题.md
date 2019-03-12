---
title: 'Hexo+Next搭建博客 (三) 使用Next主题 '
toc: true
comments: true
categories:
  - Hexo
  - Next
tags:
  - Hexo
  - Next
abbrlink: bcc7a049
date: 2018-11-17 11:19:08
---

# 安装 NexT

`Hexo`安装主题的方式非常简单，只需要将**主题文件**拷贝至**站点目录**的 `themes` 目录下， 然后**修改配置文件**即可。

> 在 Hexo 中有两份主要的配置文件，其名称都是 `_config.yml`。 其中，一份位于**站点根目录**下，主要包含 Hexo 本身的配置；另一份位于**主题目录**下，这份配置由主题作者提供，主要用于配置主题相关的选项。
> 为了描述方便，在以下说明中，将前者称为 **站点配置文件**， 后者称为 **主题配置文件**。

<!-- more -->

## 下载主题
在终端窗口`cmd`下，定位到 `Hexo` 站点目录下。

```
cd your-hexo-site
git clone git@github.com:theme-next/hexo-theme-next.git themes/next
```

![](/images/2018-11-17-14-20-12.png)

## 启用主题
与所有 `Hexo` 主题启用的模式一样。 当 **主题下载完成** 后，打开 **站点配置文件**， 找到 `theme` 字段，并将其值更改为 `next`。

```
theme: next
```
![](/images/2018-11-17-13-43-34.png)

到此，NexT 主题安装完成。

**PS:** 在切换主题之后、验证之前， 我们最好使用 `hexo clean` 来清除 `Hexo` 的缓存。

![](/images/2018-11-17-14-21-41.png)

## 后续
接下来可以根据配置来配置自己的博客了！！
- [Hexo 站点配置文件_config详解](https://vonsdite.github.io/posts/e990fc02.html)
- [Hexo Next主题配置](https://vonsdite.github.io/posts/4259465c.html)
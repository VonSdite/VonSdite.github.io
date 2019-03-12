---
title: Hexo 站点配置文件_config详解
toc: true
comments: true
abbrlink: e990fc02
date: 2018-11-17 16:09:44
categories:
    - Hexo
tags:
    - Hexo
---

# 概述

<i class="fa fa-smile-o" aria-hidden="true"></i> 看懂**配置文件**， 自己想怎么弄就怎么弄！！

- `Hexo` 站点配置文件参数介绍来自[官网](https://hexo.io/zh-cn/docs/configuration)

- **本文除了搬运官网中文外**， 还会翻译 **英文官网**内容， 同时加上自己的**见解**

<!-- more -->

# 常用配置项

配置项名 | 描述 
---------|----------
 [Site](#Site) | 站点信息配置， **最开始需要修改**
 [Url](#Url) | 主要修改里面的站点网址 
 [deploy](#deploy) | 部署的配置
 

## Site

参数 | 描述
---|---
title | 网站标题
subtitle | 网站副标题
description | 网站描述
author | 您的名字
language | 网站使用的语言，`Next`主题中文为`zh-CN`
timezone | 网站时区。`Hexo` 默认使用您电脑的时区。[查看时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)。比如说：**Asia/Shanghai**、**UTC**

其中，
- `description`主要用于**SEO**，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词
- `author`参数用于主题**显示文章的作者**

## Url

参数 | 描述 | 默认值
---|----|----
url | 网址 | 
root | 网站根目录 | 
permalink | 文章的 永久链接 格式 | :year/:month/:day/:title/
permalink_defaults | 永久链接中各部分的默认值 | 

> 如果您的网站存放在子目录中,
> 例如 http://yoursite.com/blog ,
> 则请将您的 `url` 设为 http://yoursite.com/blog 并把 `root` 设为 `/blog/`


**PS：** 永久链接默认格式的 **层级太深**，**修改永久链接的方法** -> <i class="fa fa-clone" aria-hidden="true"></i> [Hexo 修改永久链接的默认格式](https://vonsdite.github.io/posts/96723aac.html)

## Directory

参数 | 描述 | 默认值
---|----|----
source_dir | 资源文件夹，这个文件夹用来存放内容。 | source
public_dir | 公共文件夹，这个文件夹用于存放生成的站点文件。 | public
tag_dir | 标签文件夹 | tags
archive_dir | 归档文件夹 | archives
category_dir | 分类文件夹 | categories
code_dir | Include code 文件夹 | downloads/code
i18n_dir | 国际化（i18n）文件夹 | :lang
skip_render | 跳过指定文件的渲染，您可使用 [glob 表达式](https://github.com/isaacs/minimatch)来匹配路径。比如说想跳过`MyPage`目录下所有文件的渲染，可使用`skip_render: mypage/**/*`, 这样会原样输出`source/mypage/`，而不修改它 | 

## Writing
参数 | 描述 | 默认值
---|----|----
new_post_name | 新文章的文件名称 | :title.md
default_layout | 预设布局 | post
auto_spacing | 在中文和英文之间加入空格 | false
titlecase | 把标题转换为 title case | false
external_link | 在新标签中打开链接 | true
filename_case | 把文件名称转换为 (1) 小写或 (2) 大写 | 0
render_drafts | 显示草稿 | false
post_asset_folder | 启动 [Asset 文件夹](https://hexo.io/zh-cn/docs/asset-folders) | false
relative_link | 把链接改为与根目录的相对位址 | false
future | 显示未来的文章 | true
highlight | 代码块的设置 | 

## Home page setting

这里的参数是设置**首页**的，一般不动它

参数 | 描述 | 默认值
---------|----------|---------
 index_generator | 网站首页生成器， 有`path`, `per_page`, `order_by`参数 |  
 path | 博客首页所在的路径 | ''
 per_page | 一页显示的文章数，默认为10，即一页显示10篇文章。设置为0时表示禁止分页 | 10 
 order_by | 文章的排序方式，默认按时间降序 | -date 

## Category & Tag 

参数 | 描述 | 默认值
---|----|----
default_category | 默认分类 | uncategorized
category_map | 分类别名 | 
tag_map | 标签别名 | 


## Date / Time format

`Hexo` 使用 [Moment.js](http://momentjs.com/) 来解析和显示时间。

参数 | 描述 | 默认值
---|----|----
date_format | 日期格式 | YYYY-MM-DD
time_format | 时间格式 | H:mm:ss

## Pagination
参数 | 描述 | 默认值
---|----|----
per_page | 每页显示的文章量 (0 = 关闭分页功能) | 10
pagination_dir | 分页目录 | page

## Extensions
参数 | 描述
---|---
theme | 当前主题名称。值为false时禁用主题
deploy |部署的设置，可以部署git、leancloud等，见[deploy例子](#deploy)

#### deploy

```yml
# 设置多个的话，用-type来设置
deploy:
- type: git
  repo: git@github.com:UserName/UserName.github.io.git
  branch: master

- type: leancloud_counter_security_sync
```

## Include/Exclude Files/Folders

在配置文件中，设置`include` / `exclude`以使`hexo`显式处理或忽略某些文件/文件夹。

参数 | 描述
--------|------------
include | Hexo默认忽略的隐藏文件和文件夹，可设置此字段将使Hexo处理它们
exclude | 设置 Hexo 忽略的文件列表

#### Sample
```yml
# Include/Exclude Files/Folders
include:
  - .nojekyll
exclude:
  - .DS_Store
```

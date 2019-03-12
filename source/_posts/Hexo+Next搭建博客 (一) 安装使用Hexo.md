---
title: Hexo+Next搭建博客 (一) 安装使用Hexo
toc: true
comments: true
categories:
  - Hexo 
  - Next
tags:
  - Hexo
  - Next
abbrlink: 2276cdd3
date: 2018-11-14 15:34:00
---

# 概述
本文为**搭建博客**的第一部分，本文内容主要如下:

- 介绍`hexo`
- 安装`hexo`
- 使用`hexo`生成**初步的博客**(`Next`为`hexo`的主题，后续才会说明到)

(文章内容都是以**Windows**为例，其他操作系统相似)

<!-- more -->

## 什么是Hexo

Hexo 是一个快速、简洁且高效的**博客框架**。Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

**PS:** `Hexo`的具体介绍、文档均可在官网中查找 [Hexo官网](https://hexo.io/)

## 安装Hexo

#### 安装`Hexo`**前**需要安装
- Git -> [<i class="fa fa-download" aria-hidden="true">点我下载</i>](https://git-scm.com/downloads)
- Node.js -> [<i class="fa fa-download" aria-hidden="true">点我下载</i>](https://nodejs.org/en/)

#### 完成上一步后
- 打开命令提示符
- 键入命令即可完成`Hexo`的安装

> 解释： 安装Node.js过程中，已经将Node.js的安装目录加到环境变量中，所以可以使用npm命令。

```
npm install -g hexo-cli
```

## 建站

- 安装 `Hexo`完成后，使用 `cmd` 执行下列命令， `Hexo`将会在指定文件夹中新建所需要的文件。

```
hexo init <folder>
cd <folder>
npm install
```

![](/images/2018-11-16-14-48-59.png)

- 新建完成后，指定**文件夹的目录**如下：

```
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themesauto
```

- 此时已经**建站完成了**, 只要执行命令即可运行博客网站

```
hexo s
```

![](/images/2018-11-16-14-54-10.png)

![](/images/2018-11-16-14-54-50.png)

### 文件介绍
**_config.yml**

网站的 [配置](https://hexo.io/zh-cn/docs/configuration) 信息，您可以在此配置大部分的参数。

**package.json**
应用程序的信息。`EJS`, `Stylus` 和 `Markdown renderer` 已默认安装，您可以自由移除。

```
package.json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": ""
  },
  "dependencies": {
    "hexo": "^3.0.0",
    "hexo-generator-archive": "^0.1.0",
    "hexo-generator-category": "^0.1.0",
    "hexo-generator-index": "^0.1.0",
    "hexo-generator-tag": "^0.1.0",
    "hexo-renderer-ejs": "^0.1.0",
    "hexo-renderer-stylus": "^0.2.0",
    "hexo-renderer-marked": "^0.2.4",
    "hexo-server": "^0.1.2"
  }
}
```

**scaffolds**
[模版](https://hexo.io/zh-cn/docs/writing) 文件夹。当您新建文章时，`Hexo` 会根据 `scaffold` 来建立文件。

`Hexo`的模板是指在新建的`markdown`文件中默认填充的内容。例如，如果您修改`scaffold/post.md`中的`Front-matter`内容，那么每次新建一篇文章时都会包含这个修改。

**source**
资源文件夹是存放用户资源的地方。除 _posts 文件夹之外，开头命名为 **\_ (下划线)** 的文件 / 文件夹和隐藏的文件将会被**忽略** 。`Markdown` 和 `HTML` 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去。

**themes**

[主题 ](https://hexo.io/zh-cn/docs/themes)文件夹。`Hexo `会根据主题来生成**静态页面**。

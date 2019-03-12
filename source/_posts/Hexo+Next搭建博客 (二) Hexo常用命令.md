---
title: Hexo+Next搭建博客 (二) Hexo命令
toc: true
comments: true
categories:
  - Hexo 
  - Next
tags:
  - Hexo
  - Next
abbrlink: 25b4113e
date: 2018-11-16 15:17:58
---

# Hexo 常用命令 

- 一般只用到如下表的命令
- 其他命令可以查看本文下方[Hexo 命令](#Hexo-命令) 或者查看 https://hexo.io/docs/commands.html

常用命令     | 描述 
------------|----------
 [init](/posts/25b4113e.html#init) | 新建一个网站(`hexo init <FolderName>`) 
 [new](/posts/25b4113e.html#new) | 新建一篇文章(`hexo new post <PostName>`)、新建一篇草稿(`hexo new draft <DraftName>` )、新建一个页面(`hexo new page <PageName>`) 
 [clean](/posts/25b4113e.html#clean) | 清除缓存文件 (db.json) 和已生成的静态文件 (public) (使用`hexo clean`)
 [generate](/posts/25b4113e.html#generate) | 生成静态文件(`hexo g`)  
 [deploy](/posts/25b4113e.html#deploy) | 部署网站(`hexo d`), 常与generate命令一起用(`hexo g -d` 或者 `hexo d -g`) 
 [server](/posts/25b4113e.html#server) | 启动服务器(`hexo s` or `hexo server`) 
 [help](/posts/25b4113e.html#help) | 帮助命令(`hexo help` or `hexo help [command name]`)  

<!-- more -->

# TOC
* [Hexo 命令](#Hexo-命令)
	* [init](#init)
	* [new](#new)
	* [generate](#generate)
	* [publish](#publish)
	* [server](#server)
	* [deploy](#deploy)
	* [render](#render)
	* [migrate](#migrate)
	* [clean](#clean)
	* [help](#help)
	* [list](#list)
	* [version](#version)
	* [选项](#选项)
		* [安全模式](#安全模式)
		* [调试模式](#调试模式)
		* [简洁模式](#简洁模式)
		* [自定义配置文件的路径](#自定义配置文件的路径)
		* [显示草稿](#显示草稿)
		* [自定义 CWD](#自定义-cwd)

<!-- /code_chunk_output -->



# Hexo 命令
## init
```
hexo init [folder]
```

**新建一个网站**。
- 如果没有设置 `folder`, `Hexo` 默认在目前的文件夹建立网站(当前文件夹必须**为空**)。

## new
```
hexo new [layout] <title>

```
**新建一篇文章**。
- 如果没有设置 `layout` 的话，默认使用 `_config.yml `中的 `default_layout` 参数代替。如果标题包含**空格**的话，请使用**引号括起来**。

> `layout`是根目录下的`scaffolds`的模板，默认是`post.md`模板。 `layout`关键字都可以用`scaffolds`下的**模板名**来代替

## generate
```
hexo generate

```
**生成静态文件**

选项 | 描述
---|---
-d, --deploy | 文件生成后立即部署网站
-w, --watch | 监视文件变动

该命令可以**简写**为
```
hexo g
```

## publish
_用得少_
```
hexo publish [layout] <filename>

```
**发表草稿**

## server
```
hexo server

```
**启动服务器**

- 默认情况下，访问网址为： http://localhost:4000/

选项 | 描述
---|---
-p, --port | 重设端口
-s, --static | 只使用静态文件
-l, --log | 启动日记记录，使用覆盖记录格式


## deploy
```
hexo deploy
```
**部署网站**

参数 | 描述
---|---
-g, --generate | 部署之前预先生成静态文件

该命令可以简写为：
```
hexo d
```

## render
_用得少_
```
hexo render <file1> [file2] ...
```
**渲染文件**

参数 | 描述
---|---
-o, --output | 设置输出路径

## migrate
_用得少_
```
hexo migrate <type>
```
**从其他博客系统 迁移内容**

## clean
```
hexo clean
```
**清除缓存文件 (db.json) 和已生成的静态文件 (public)**

- 在**某些情况**（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。

## help

```
# 查看hexo所有命令及功能
hexo help 

# 查看命令的使用方法 
hexo help [command]
```
**Hexo帮助命令**
- 可以查看`Hexo`的命令及其用法
- 也可以查看`Hexo`命令的具体使用和命令搭配的选项

![](/images/2018-11-17-08-44-41.png)

## list
_用得少_
```
hexo list <type>
```
**列出网站资料**

## version
_用得少_
```
hexo version
```
**显示 Hexo 版本**

## 选项
### 安全模式
```
hexo --safe
```
- 在安全模式下，不会载入插件和脚本。当您在安装新插件遭遇问题时，可以尝试以安全模式重新执行。

### 调试模式
```
hexo --debug
```
- 在终端中显示调试信息并记录到` debug.log`。当您碰到问题时，可以尝试用调试模式重新执行一次，并 提交调试信息到 `GitHub`。

### 简洁模式
```
hexo --silent
```
- 隐藏终端信息。

### 自定义配置文件的路径
```
hexo --config custom.yml
```
- 自定义配置文件的路径，执行后将不再使用 `_config.yml`。

### 显示草稿
```
hexo --draft
```
- 显示 `source/_drafts` 文件夹中的草稿文章。

### 自定义 CWD
```
hexo --cwd /path/to/cwd
```
- 自定义当前工作目录（Current working directory）的路径。

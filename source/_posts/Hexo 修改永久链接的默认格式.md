---
title: Hexo 修改永久链接的默认格式
toc: true
comments: true
abbrlink: 96723aac
date: 2018-11-17 14:50:52
categories:
  - Hexo 
  - Next
tags:
  - Hexo
  - Next
---

# Hexo 永久链接

- `Hexo`的永久链接的默认格式是 `:year/:month/:day/:title/`

![](/images/2018-11-17-14-51-53.png)

- 永久链接的意思，即访问站点下某一篇文章时，其路径是 `2018/11/17/xxxx/`，而且它保存在本地站点的`public`目录也是`2018/11/17/xxxx/`

<!-- more -->

**坏处：**

如果我们的文章标题是中文的，那么该路径就会出现中文字符

- 在路径中出现了中文字符很容易引发各种问题
- 不利于**seo**，因为路径包含了**年月日三个层级**，层级太深不利于**百度蜘蛛抓取**

# 使用 hexo-abbrlink

**解决办法**
利用其它的插件来生成唯一的路径，这样就算我们的文件标题随意修改，也不会导致原本的链接失效而造成站点下存在大量的死链。

### 安装插件

```
npm install hexo-abbrlink --save
```

### 修改站点配置文件

打开根目录下的`_config.yml`文件，修改`permalink`, 如下:
```
# permalink: :year/:month/:day/:title/
# permalink_defaults:
permalink: posts/:abbrlink.html
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex

```

### 完成
- 完成上述步骤后
- 运行如下操作

```
hexo clean   # 删除缓存
hexo g	     # 生成静态文件
hexo s       # 启动服务器
```

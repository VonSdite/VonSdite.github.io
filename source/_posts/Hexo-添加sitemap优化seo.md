---
title: Hexo 添加sitemap优化seo
toc: true
toc_number: false
comments: true
abbrlink: f6d1cfff
date: 2018-11-25 00:21:58
categories:
    - Hexo
tags:
    - Hexo
---

# 添加sitemap
#### 1. 使用命令行`cmd`进入**站点文件夹**

#### 2. 输入以下两条命令

```npm
npm install hexo-generator-sitemap --save
npm install hexo-generator-baidu-sitemap --save
```

#### 3. 在**站点配置文件**`_config.yml`加入如下的配置
`sitemap`是给google的站点地图, `baidusitemap`是给百度的站点地图

<!-- more -->

```yml
# sitemap
sitemap:
  path: sitemap.xml
baidusitemap:
  path: baidusitemap.xml
```

修改后, 输入命令
```bash
hexo g
hexo s
```
即可查看到站点地图的信息或者在`public`中看到**sitemap.xml**和**baidusitemap.xml**

![](/images/2018-11-25-00-30-35.png)
![](/images/2018-11-25-00-30-54.png)

#### 4. 将sitemap提交
在`google search console`提交你的`sitemap.xml`
![](/images/2018-11-25-00-33-04.png)

在`百度搜索资源平台`-`数据引入`-`链接提交`-页面底部`自动提交`-`sitemap`提交sitemap地址
![](/images/2018-11-25-00-42-29.png)

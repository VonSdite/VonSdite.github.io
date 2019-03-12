---
title: Hexo Next 使用Valine作评论系统
toc: true
comments: true
abbrlink: c7d98860
date: 2018-12-07 15:29:23
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
    - Valine
---

# 前言
之前博客使用的是**gitalk**作为评论系统, 但是对于**强迫症**, 看到Github的`Recent activity`满满的一列`Issue`, 内心着实有点小难受。

如果想使用**gitalk**作为评论系统的可以看**[Hexo Next 加入评论功能gitalk](/posts/dd07da63.html)**
而想使用**Valine**作为评论系统, 则可以参考此文

<!-- more -->

# Valine
> Valine 诞生于2017年8月7日, 是一款基于`Leancloud`的快速、简洁且高效的**无后端**评论系统。
> 理论上支持但不限于静态博客, 目前已有`Hexo`、`Jekyll`、`Typecho`、`Hugo` 等博客程序在使用Valine。

## 特性
- 快速
- 安全
- Emoji 😉
- 无后端实现
- MarkDown 全语法支持
- 轻量易用(~15kb gzipped)
- 文章阅读量统计 v1.2.0+

# 使用Valine
可以上Valine的官网的[快速开始](https://valine.js.org/quickstart.html)查看如何配置

以下专门介绍`Hexo`如何配置, **Next**主题是**`6.0`版本**以上的

因为Valine是基于**LeanCloud**的, 所以我们[先注册Leancloud并创建应用](/posts/c7d98860.html#注册Leancloud并创建应用) 

## 注册Leancloud并创建应用 

1. 首先, 前往Leancloud官网[leancloud.cn](https://leancloud.cn/dashboard/login.html#/signup)进行注册, 并登陆。

2. 点击**创建应用**
![](/images/2018-11-19-10-45-53.png)

3. 输入应用的名称(随便起都行), 选择**开发版**, 点击**创建**
![](/images/2018-11-19-10-46-38.png)

4. 创建成功后点击右上角的设置**小齿轮**
![](/images/2018-11-19-10-48-23.png)

5. 创建后点击**设置**-点击**应用Key**-获取**App ID**和**App Key**
![](/images/2018-11-19-10-55-18.png)

7. 将获取到的**App ID**和**App Key**设置到`Next`主题配置文件`_config.yml`, 并设置`enable: true`
_配置文件已存在这个配置, 只要把 id 和 key 加上去就好了_
```yml
valine:
  # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version.
  enable: true 
  appid: <<your app id>>                    # your leancloud application appid
  appkey: <<your app key>>                  # your leancloud application appkey
  notify: false                             # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false                             # Verification code
  placeholder: ヾﾉ≧∀≦)o来啊, 快活啊!        # comment box placeholder
  avatar: mm                                # gravatar style
  guest_info: nick,mail,link                # custom comment header
  pageSize: 10                              # pagination size
  visitor: false                            # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
```

8. 点击**安全中心**, 填写自己博客对应的域名（注意协议、域名和端口号需严格一致）
![](/images/2018-11-19-10-57-01.png)

至此完成配置, `hexo s`就可以看到文章评论区了

## 开启评论回复邮箱提醒
参考[评论系统中的邮件提醒设置](https://github.com/xCss/Valine/wiki/Valine-%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F%E4%B8%AD%E7%9A%84%E9%82%AE%E4%BB%B6%E6%8F%90%E9%86%92%E8%AE%BE%E7%BD%AE)

Valine的配置要设置 `notify: true` 和 `verify: true`
```yml
valine:
  # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version.
  enable: true 
  appid: <<your app id>>                    # your leancloud application appid
  appkey: <<your app key>>                  # your leancloud application appkey
  notify: true                              # mail notifier , https://github.com/xCss/Valine/wiki
  verify: true                              # Verification code
  placeholder: ヾﾉ≧∀≦)o来啊, 快活啊!        # comment box placeholder
  avatar: mm                                # gravatar style
  guest_info: nick,mail,link                # custom comment header
  pageSize: 10                              # pagination size
  visitor: false                            # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
```

## 评论数据管理
由于Valine 是**无后端**评论系统, 所以也就没有开发评论数据管理功能。请**自行登录Leancloud应用管理**。

具体步骤：`登录>选择你创建的应用>存储>选择Class Comment`, 然后就可以尽情的发挥你的权利啦(～￣▽￣)～

> 当然, 你也可以配合 [@panjunwen](https://github.com/panjunwen) 开发的 [Valine-Admin](https://github.com/panjunwen/Valine-Admin) 进行评论数据管理

# 注意
如果你某一篇文章不想有评论功能, 你可以在文章的`font-matter`中加入 `comments: false`

![](/images/2018-12-05-21-19-05.png)

因为加入了评论功能, 在`标签`、`分类`页面都会有个评论区, 所以应到相应页面的`index.md`的`font-matter`中加入 `comments: false`

**并修改站点目录下`scaffolds`的`page.md`模板**,  因为创建`page`都会**使用到该模板**, 而页面不需要有评论区
```yml
---
title: {{ title }}
date: {{ date }}
type: 
comments: false
---
```

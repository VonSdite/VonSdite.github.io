---
title: Hexo Next主题配置
toc: true
comments: true
abbrlink: 4259465c
date: 2018-11-18 00:13:21
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

# 概述

<i class="fa fa-smile-o" aria-hidden="true"></i> 看懂**配置文件**， 自己想怎么弄就怎么弄！！

- `Next` 版本号6.0.0以上
- 主要根据`Next` 主题配置文件进行部分介绍

<!-- more -->

## 设置菜单
使用`Next`主题， 需手动创建 `tags`页面和`categories`页面 (**创建页面都是如下的操作**)

1. 命令行`cmd`进入站点文件夹

```
cd ./TestBlog
hexo new page "tags"
hexo new page "categories"
```
![](/images/2018-11-18-12-38-38.png)

2. 进入站点文件夹下的`source`文件夹, 可以看到 `Hexo`给我们创建了两个文件夹，`categories`和`tags`

**PS:** `Hexo`创建一个新的页面就会在站点文件夹下的`source`文件夹新建该页面的文件夹

3. 修改 `categories`文件夹下的`index.md`为如下

```
---
title: 分类
date: 2018-11-08 20:41:49
type: "categories"
---
```

4. 修改`tags`文件夹下的`index.md`为如下
```
---
title: 标签
date: 2018-11-08 20:41:30
type: "tags"
---
```

5. 修改主题配置文件`_config.yml`
修改了主题配置文件中`menu`的话，就会将分类`categories`和标签`tags`页面的超链接显示到**菜单栏**上

```
menu:
  home: / || home
  categories: /categories/ || th
  tags: /tags/ || tags
  # about: /about/ || user
  archives: /archives/ || archive
  # schedule: /schedule/ || calendar
  # sitemap: /sitemap.xml || sitemap
  # commonweal: /404/ || heartbeat
```

**PS:** `menu`配置的解释
- 比如`categories: /path/ || th`表示菜单栏显示的名字为categories, 资源放在站点文件夹的 `source/path/`下, th表示[FrontAwesome](http://www.fontawesome.com.cn/faicons/)的th图标
- 关于菜单栏显示 categories为中文, 是因为站点配置文件设置了语言为中文, 然后`hexo`会去找**英文转中文的配置**, 该配置在`themes/next/languages/zh-CN.yml`

## 修改Next主题的样式
`Next`主题有**4种**样式可以切换

```yml
# Schemes
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
```

1. Muse
![](/images/2018-11-18-15-00-34.png)

2. Mist
![](/images/2018-11-18-15-01-16.png)

3. Pisces
![](/images/2018-11-18-15-01-38.png)

4. Gemini
![](/images/2018-11-18-15-02-06.png)

## 在侧边栏上加入Github CSDN等信息
修改`social`字段即可, 网址后面的是图标, 到[FrontAwesome](http://www.fontawesome.com.cn/faicons/)找到自己喜欢的图标即可使用

```yml
social:
  GitHub: https://github.com/vonsdite || github
  CSDN: https://blog.csdn.net/vonsdite || bug
  E-Mail: mailto:vonsdite@gmail.com || envelope
  #Weibo: https://weibo.com/yourname || weibo
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype

social_icons:
  enable: true
  icons_only: false
  transition: false
```

## 网站右上角加Github标识
在网站的右上角加入Github Follow的标识

![](/images/2018-11-18-15-08-26.png)

```yml
# Follow me on GitHub banner in right-top corner.
# Usage: `permalink || title`
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the title and aria-label name.
github_banner: https://github.com/vonsdite || Follow me on GitHub
```

## 修改Next的用户头像
1. 在站点文件夹`source/images/`放入你的头像图片

2. 修改配置文件如图

```yml
# Sidebar Avatar
avatar:
  # in theme directory(source/images): /images/avatar.gif
  # in site  directory(source/uploads): /uploads/avatar.gif
  # You can also use other linking images.
  url: /images/avatar.png
  # If true, the avatar would be dispalyed in circle.
  # 圆形框
  rounded: true
  # The value of opacity should be choose from 0 to 1 to set the opacity of the avatar.
  # 透明度 0 - 1 间设置
  opacity: 1
  # If true, the avatar would be rotated with the cursor.
  # 设置为真, 表示头像会转
  rotated: false
```

## 设置查看文章时有无TOC
如果想关闭TOC前的数字, 就将`number`设置为`false`即可

```yml
# Table Of Contents in the Sidebar
toc:
  enable: true

  # Automatically add list number to toc.
  number: true

  # If true, all words will placed on next lines if header width longer then sidebar width.
  wrap: false
```

## 设置Sidebar
以下的配置信息是设置`Sidebar`的位置, 和`Sidebar`的显示, 不同的`Next`主题有不同的设置, 具体见配置信息

```yml
sidebar:
  # Sidebar Position, available value: left | right (only for Pisces | Gemini).
  position: left
  #position: right

  # Manual define the sidebar width.
  # If commented, will be default for:
  # Muse | Mist: 320
  # Pisces | Gemini: 240
  #width: 300

  # Sidebar Display, available value (only for Muse | Mist):
  #  - post    expand on posts automatically. Default.
  #  - always  expand for all pages automatically
  #  - hide    expand only when click on the sidebar toggle icon.
  #  - remove  Totally remove sidebar including sidebar toggle.
  display: post
  #display: always
  #display: hide
  #display: remove

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  offset: 12

  # Back to top in sidebar (only for Pisces | Gemini).
  b2t: false

  # Scroll percent label in b2t button.
  scrollpercent: true

  # Enable sidebar on narrow view (only for Muse | Mist).
  onmobile: false
```

## 文章设置

### 设置点击**阅读全文**时文章是否跳到**阅读全文**位置
```yml
# Automatically scroll page to section which is under <!-- more --> mark.
scroll_to_more: false
```

### 保存上次阅读的位置在cookies中
```yml
# Automatically saving scroll position on each post/page in cookies.
save_scroll: false
```

### 设置**阅读全文**按钮
建议不要自动生成**阅读全文**, 建议使用在你的文章中使用` <!-- more -->`来生成**阅读全文**按钮

```yml
# Automatically Excerpt. Not recommend.
# Please use <!-- more --> in the post to control excerpt accurately.
auto_excerpt:
  enable: false
  length: 150

# Read more button
# If true, the read more button would be displayed in excerpt section
read_more_btn: true
```

</br>

## 在文章加入打赏
在站点文件夹`source/images/`放入支付宝和微信收款码二维码, 修改配置即可
```yml
reward:
  enable: true
  #comment: Donate comment here
  wechatpay: /images/wechatpay.jpg
  alipay: /images/alipay.jpg
  #bitcoin: /images/bitcoin.png
```

## 设置文章字体

```yml
# To avoid space between header and sidebar in Pisces / Gemini themes 
# recommended to use Web Safe fonts for `global` (and `logo`):
# Arial | Tahoma | Helvetica | Times New Roman | Courier New | Verdana | Georgia 
# | Palatino | Garamond | Comic Sans MS | Trebuchet MS
  posts:
    external: true
    family: Comic Sans MS
```

## 修改网站的图标
效果如图 
![](/images/2018-11-18-12-08-40.png)

1. 准备一张图片，然后到图片网站制作`16*16`, `32*32`大小的图标

2. 将制作好的图标放入到站点文件夹`source/images`中

3. 修改`Next`主题配置文件

修改配置文件中`favicon`的值, 路径为你保存好的图标路径名

```yml
favicon:
  small: /images/favicon-16x16-next.ico
  medium: /images/favicon-32x32-next.ico
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```

## 设置网站底部信息

1. 修改网站部署的起始年份 `since`
2. 修改网站底部的图标 `icon`为爱心, 并设置图标颜色, 并让图标动起来（**有心跳的感觉**）
```yml
footer:
  # Specify the date when the site was setup.
  # If not defined, current year will be used.
  since: 2018

  # Icon between year and copyright info.
  icon:
    # Icon name in fontawesome, see: https://fontawesome.com/v4.7.0/icons
    # `heart` is recommended with animation in red (#ff0000).
    name: heart
    # If you want to animate the icon, set it to true.
    animated: true
    # Change the color of icon, using Hex Code.
    color: "#ff0000"
```

3. 关闭网站底部 `Hexo`驱动和`Next`主题版本

```yml
# 该值属于 footer键的一部分
  powered:
    # Hexo link (Powered by Hexo).
    enable: false
    # Version info of Hexo after Hexo link (vX.X.X).
    version: false

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    enable: false
    # Version info of NexT after scheme info (vX.X.X).
    version: false
```

## 使用Hexo data files 配置主题
_不一定采用，看个人需要_

为了使**主题与配置分离**, **方便**升级主题，采用 `Hexo data files` 进行配置

1. 创建文件
在站点文件夹创建`source/_data/next.yml`文件

2. 复制配置文件
将所有配置内容，包括**站点**和**主题**配置文件移入 `source/_data/next.yml` 文件。**后面的所有配置更改都将在此文件内进行。**

3. `next.yml` 文件中启用 `override`
```
override: true
```

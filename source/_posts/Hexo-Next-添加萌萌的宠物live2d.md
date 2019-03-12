---
title: Hexo Next 添加萌萌的宠物live2d
toc: true
comments: true
abbrlink: fbd1f97f
date: 2018-11-19 09:16:53
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

# 概述
添加萌宠来装饰`Hexo`站点, 使用到的插件[hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d)

# 添加萌宠
1. 安装插件
命令行`cmd`进入站点文件夹
```
cd .\TestBlog\
npm install hexo-helper-live2d --save
```
下载完插件后, 使用`hexo s`启动服务器发现左下角已经有`live2d`模型了
<!-- more -->

![](/images/2018-11-19-09-27-19.png)

2. 在站点配置文件`_config.yml`中添加配置

配置信息可以设置`live2d`的**位置、大小、透明度**等
更多配置信息可看Github [hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d)上的介绍
```yml
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  model:
    # 这是白猫的模型
    use: live2d-widget-model-tororo
  display:
    # 设置模型的位置
    position: right
    width: 120
    height: 240
  mobile:
    show: false
  react:
    opacityDefault: 1
    opacityOnHover: 1
```

3. 下载你喜欢的模型
命令行`cmd`进入站点文件夹, 使用`npm install {your model's package name}`下载你喜欢的模型
<details><summary>模型列表</summary>
```
live2d-widget-model-chitose
live2d-widget-model-epsilon2_1
live2d-widget-model-gf
live2d-widget-model-haru/01 (use npm install --save live2d-widget-model-haru)
live2d-widget-model-haru/02 (use npm install --save live2d-widget-model-haru)
live2d-widget-model-haruto
live2d-widget-model-hibiki
live2d-widget-model-hijiki
live2d-widget-model-izumi
live2d-widget-model-koharu
live2d-widget-model-miku
live2d-widget-model-ni-j
live2d-widget-model-nico
live2d-widget-model-nietzsche
live2d-widget-model-nipsilon
live2d-widget-model-nito
live2d-widget-model-shizuku
live2d-widget-model-tororo
live2d-widget-model-tsumiki
live2d-widget-model-unitychan
live2d-widget-model-wanko
live2d-widget-model-z16
```
</details>
[模型预览](https://huaji8.top/post/live2d-plugin-2.0/)


# 效果如图

比如下载tororo `npm install live2d-widget-model-tororo`

完成上述的配置

![](/images/1.gif)


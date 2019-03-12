---
title: CUDA 10.0和cuDNN 7.4安装配置
toc: true
comments: true
abbrlink: c6b151e6
date: 2019-03-11 14:53:20
categories:
    - CUDA、cuDNN
tags:
    - CUDA
    - cuDNN
---

# 前言
深度学习经常需要用到GPU, 所以就需要下载安装配置**CUDA**和**cuDNN**

<!-- more -->

# 安装CUDA 10.0
访问网址https://developer.nvidia.com/cuda-toolkit-archive, 然后点击**CUDA Toolkit 10.0**
![](/images/2019-03-11-14-35-22.png)

接下来根据自己的电脑系统来选择下载, `exe(network)`、`exe(local)`均可, `exe(network)`应该会快一点吧
![](/images/2019-03-11-14-36-08.png)

下载完成后, 打开安装程序:
安装路径可以默认也可以自定义。之后点击ok就行。
![](/images/2019-03-11-14-40-59.png)
![](/images/2019-03-11-14-41-06.png)
![](/images/2019-03-11-14-41-11.png)
![](/images/2019-03-11-14-41-18.png)

全部安装
![](/images/2019-03-11-14-42-39.png)
![](/images/2019-03-11-14-42-43.png)
可以选择默认路径或者自定义安装路径, 记下安装的路径。

最终"下一步", 然后"完成"就行。
配置系统环境变量, 选择path(安装程序可能帮你加了这个环境变量了, 加在了**path**的第一个位置):
![](/images/2019-03-11-14-43-25.png)

检查是否有下图中的两个环境变量, 这两个变量可能出现在**用户变量**中, 没有的话手动添加即可
![](/images/2019-03-11-14-44-12.png)

验证安装: `nvcc -V`
![](/images/2019-03-11-14-45-48.png)

# 安装cuDNN 7.4
访问网址 https://developer.nvidia.com/rdp/cudnn-archive, 点击`Download cuDNN v7.4.2 (Dec 14, 2018), for CUDA 10.0`
![](/images/2019-03-11-14-47-59.png)
![](/images/2019-03-11-14-48-26.png)

然后需要登录你的**nvidia**账号, 没有的话, 就注册一个

## 下载后
下载后, 将下载文件解压, 然后 copy------》paste, **是无冲突合并**
按照自己的情况来, 图中是我的解压和安装路径: (注意是路径中的文件)
![](/images/2019-03-11-14-50-00.png)

## 添加环境变量
`C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.0\lib\x64`, 注意路径 
![](/images/2019-03-11-14-51-06.png)

至此, **cuDNN**和**CUDA**均安装完成

---
title: darknet编译 windows+vs2015+cuda10.0+cudnn7.4 GPU版本
toc: true
comments: true
categories:
  - darknet
tags:
  - darknet
  - 编译
abbrlink: 25f3339
date: 2019-03-11 18:00:22
---

# 前言
在windows下想使用`yolov3`, 需要先**编译darknet**
本文的编译过程主要参考**AlexeyAB**大神的编译过程, 对应的是`legacy way`
https://github.com/AlexeyAB/darknet#how-to-compile-on-windows-legacy-way


# 关于`using vcpkg`方法
<!-- more -->


至于`using vcpkg`这个方法没成功, 原因有两点
1. vs2017 疯狂报错, 报各种`intptr_t`等错误(尝试过改为 平台工具集改为v140、编译设置为c++, 均失败告终)
2. 没太理解图中这两点, 一是要修改`CMakeLists.txt`的内容, 查看内容后, 可能只是为了有`tensor core`显卡做准备的吧, 而是`bulid.ps1`报了好多错误...emmmm, 枉费我编译了2.7个小时的opencv(vcpkg下载opencv之后, **竟然疯狂build**...)
![](/images/2019-03-11-14-23-03.png)
![](/images/2019-03-11-14-25-36.png)

# `legacy way`编译
首先, 我们看看**GPU版本**需要下载什么
![](/images/2019-03-11-14-29-11.png)

需要安装的有
> 1. vs2015, 本文介绍使用vs2015编译**darknet**
> 2. CUDA 10.0: https://developer.nvidia.com/cuda-toolkit-archive
> 3. OpenCV < 4.0 https://opencv.org/releases.html, 环境变量暂时不设置, 稍后介绍
> 4. cuDNN >= 7.0 for CUDA 10.0 https://developer.nvidia.com/rdp/cudnn-archive, 环境变量暂时不设置, 稍后介绍

**别的就不需要安装了**

## 安装CUDA 10.0和cuDNN7.4
**安装和配置过程参考文章** https://vonsdite.cn/posts/c6b151e6.html

另外, 新建一个系统变量`CUDNN`, 变量值为cudnn的安装路径: `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.0`
![](/images/2019-03-11-14-59-03.png)

## OpenCV安装
**openCV安装和配置过程参考文章** https://vonsdite.cn/posts/f13d7151.html

## 编译darknet

### clone项目
首先clone **AlexeyAB**的仓库
```bash
git clone https://github.com/AlexeyAB/darknet.git
```

### 编译
用vs2015打开 `你clone的目录\darknet\build\darknet\darknet.sln`

设置
> - **解决方案配置**为: `Release`
> - **解决方案平台**为: `x64`
![](/images/2019-03-11-18-27-44.png)

修改项目属性: 
![](/images/2019-03-11-18-28-12.png)

1. 属性=>常规, 目标平台版本为**8.1**, 平台工具集为**v140**
![](/images/2019-03-11-18-28-39.png)

2. C\C++=>常规=>附加包含目录, 将项目自带的opencv包含目录改成自己安装的opencv包含目录`C:\opencv\build\include`
![](/images/2019-03-11-18-32-01.png)

3. 属性=>链接器=>常规=>附加库目录, 将项目自带的opencv库目录改为自己安装的opencv库目录`C:\opencv\build\x64\vc14\lib`
![](/images/2019-03-11-18-32-28.png)

保存更改的属性, 生成=>生成darknet。编译成功, 在`你clone的目录\darknet\build\darknet\x64`下会生成darknet.exe

> - 将`C:\opencv\build\x64\vc14\bin`下的 `opencv_world345.dll` 和 `opencv_ffmpeg345_64.dll` 复制到darknet.exe所在文件夹下 
> - 将`C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.0\bin`下的`cudnn64_7.dll`也复制到darknet.exe所在文件夹下, 就可以在Windows系统下用darknet框架训练YOLO啦！


# 可能出现的错误及解决
## The CUDA Toolkit v10.0 directory '' does not exist

```
 error : The CUDA Toolkit v10.0 directory '' does not exist.  Please verify the CUDA Toolkit is installed properly or define the CudaToolkitDir property to resolve this error.
```
![](/images/2019-03-11-18-48-27.png)

出现这个问题的时候, 只要修改项目属性, 配置上正确的CUDA目录即可
![](/images/2019-03-11-18-51-50.png)

然后**重新生成darknet**即可

## 各种语法错误
![](/images/2019-03-11-18-57-10.png)
![](/images/2019-03-11-18-57-58.png)
```
 error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(18): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(18): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(19): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(18): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(19): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(19): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(20): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(19): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(20): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(20): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(21): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(20): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(21): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(21): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\writing.c)
1>D:\vs2015\VC\include\cstdint(23): error C2054: 在“using”之后应输入“(” (编译源文件 ..\..\src\voxel.c)
1>D:\vs2015\VC\include\cstdint(21): error C2061: 语法错误: 标识符“using” (编译源文件 ..\..\src\writing.c)
```

解决办法, 打开**项目属性页**=>**C/C++**=>**高级**=>修改编译为 为**编译为C++代码(/TP)**即可解决

![](/images/2019-03-11-18-58-33.png)

---
title: Centos6 安装高版本gcc 5.2
toc: true
comments: true
abbrlink: 421ebfd
date: 2019-02-15 12:21:18
categories:
    - Linux
    - C/C++
tags:
    - Linux
    - Centos
    - C/C++
---

# 前言
Centos的yum源安装的gcc最高版本为 **4.4**, 但很多软件编译都要求在**4.8以上**, 如nodejs、aria2

以下介绍安装**5.2版本的gcc**
<!-- more -->

# 安装
键入以下命令即可

```bash
wget https://copr.fedoraproject.org/coprs/hhorak/devtoolset-4-rebuild-bootstrap/repo/epel-6/hhorak-devtoolset-4-rebuild-bootstrap-epel-6.repo -O /etc/yum.repos.d/devtools-4.repo
yum install devtoolset-4-gcc devtoolset-4-binutils devtoolset-4-gcc-c++ -y
scl enable devtoolset-4 bash
gcc -v
```

![](/images/2019-02-15-12-24-10.png)


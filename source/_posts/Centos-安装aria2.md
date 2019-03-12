---
title: Centos 安装aria2
toc: true
comments: true
abbrlink: 35a3d1bf
date: 2019-02-15 12:49:15
categories:
    - Linux
    - aria2
tags:
    - Linux
    - Centos
    - aria2
---

# 下载安装包
到 https://pkgs.org/download/aria2 找到你想要下载的版本(注意系统32位或64位)

<!-- more -->

1. 以64位为例, 我下载的是 aria2-1.16.4-1.el6.rf.x86_64.rpm版本
```bash
wget http://ftp.tu-chemnitz.de/pub/linux/dag/redhat/el6/en/x86_64/rpmforge/RPMS/aria2-1.16.4-1.el6.rf.x86_64.rpm
```

2. 然后执行安装
```bash
rpm -ivh aria2-1.16.4-1.el6.rf.x86_64.rpm
```
发现报了如下的错误:
![](/images/2019-02-15-13-18-28.png)
**缺少了依赖libgnutls.so和libnettle.so**

3. 可以在下载页面找到需要的依赖, 浏览器 `ctrl+f`搜索即可
![](/images/2019-02-15-13-20-13.png)
![](/images/2019-02-15-13-21-46.png)

只要下载一个libgnutls.so和libnettle.so就可以了

4. 下载并安装错误所需的依赖
```bash
wget http://mirror.centos.org/centos/6/os/x86_64/Packages/gnutls-2.12.23-22.el6.x86_64.rpm
rpm -ivh gnutls-2.12.23-22.el6.x86_64.rpm
wget http://ftp.tu-chemnitz.de/pub/linux/dag/redhat/el6/en/x86_64/rpmforge/RPMS/nettle-2.2-1.el6.rf.x86_64.rpm
rpm -ivh nettle-2.2-1.el6.rf.x86_64.rpm
```

5. 安装aria2
```bash
rpm -ivh aria2-1.16.4-1.el6.rf.x86_64.rpm
```

6. 验证
```bash
aria2c --version
```
![](/images/2019-02-15-13-27-43.png)



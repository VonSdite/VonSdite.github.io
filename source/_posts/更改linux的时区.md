---
title: 更改linux的时区
toc: true
comments: true
categories:
  - Linux
  - Centos
tags:
  - Linux
  - Centos
abbrlink: 5e64a472
date: 2019-02-15 14:19:22
---

1. 修改`/etc/sysconfig/clock`为如下
```
ZONE="Asia/Shanghai"
```

2. 执行命令
```
rm /etc/localtime -f
```

3. 链接到上海时区文件       
```
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

---
title: 设置windows 右键打开cmd
toc: true
comments: true
abbrlink: ca153ae0
date: 2018-11-21 09:14:01
categories:
    - Windows
    - Cmd
tags:
    - Cmd
    - Windows
---

windows在文件目录按`shift`+`右键`可以打开`cmd`, 以下通过**注册表**实现**右键打开cmd**

1. 新建一个普通的文本文档
2. 复制如下代码
3. 将文档名的后缀改为 `.reg`
4. 双击运行, 允许写入注册表即可

<!-- more -->

效果如图
![](/images/2018-11-21-09-18-45.png)


```bash
Windows Registry Editor Version 5.00
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\background\shell\cmd_here]

@="在此处打开命令行"
"Icon"="cmd.exe"
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\background\shell\cmd_here\command]

@="\"C:\\Windows\\System32\\cmd.exe\""

[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\cmd_here]

@="在此处打开命令行"
"Icon"="cmd.exe"
[HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Directory\shell\cmd_here\command]

@="\"C:\\Windows\\System32\\cmd.exe\""

```
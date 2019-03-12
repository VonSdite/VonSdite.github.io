---
title: '[Chrome 71版本]彻底解决Chrome请停用以开发者模式运行的扩展程序'
toc: true
comments: true
categories:
  - 逆向
  - Chrome
tags:
  - 逆向
  - Chrome
abbrlink: d0e30452
date: 2019-01-15 15:02:10
---
# 前言
想使用Chrome商店以外的插件时, 总会遇到以下的问题。
每次重启Chrome插件, 都会弹出**请停用以开发者模式运行的扩展程序**, 以下通过反汇编修改**dll**的方式
![](/images/2019-01-15-15-11-47.png)

参考: https://stackoverflow.com/questions/30287907/how-to-get-rid-of-disable-developer-mode-extensions-pop-up/30361260#30361260

<!-- more -->

# 题外话
解决该问题的办法三种, 
- 一种是**组策略白名单法(早就失效)**
- 一种是**批处理法(Chrome 60版本左右已失效)**,
- 最后一种就是**修改dll**方法, 唯一能成功的办法了, 也是接下来要介绍的办法(实际上批处理法只是将该办法封装成代码了而已)

# 解决办法

## 安装x64dbg
> - 到**x64dbg官网**下载x64dbg, https://x64dbg.com/#start

## 修改chrome.dll
1. 找到Chrome的主目录, 一般在`C:\Program Files (x86)`中, 然后找到如图的目录路径下的**chrome.dll**
![](/images/2019-01-15-15-18-56.png)

2. 使用刚下载好的x64dbg打开chrome.dll

双击**x96dbg.exe**, 然后选择x64dbg(如果打不开, 换x32dbg打开)
![](/images/2019-01-15-15-20-49.png)

![](/images/2019-01-15-15-23-26.png)

![](/images/2019-01-15-15-26-06.png)

然后在主面板**右键**, 依次选择`搜索`-> `当前模块` -> `字符串`
![](/images/2019-01-15-15-26-55.png)

接着会进入一个搜索界面, 等待进度条加载完毕, 搜索`ExtensionDeveloperModeWarning`, 然后**双击第一行结果**
![](/images/2019-01-15-15-29-11.png)

接着会跳转到反汇编界面, 往上翻一点, 找到`cmp eax, 2`(也有可能是`cmp eax, 3`)
![](/images/2019-01-15-15-30-40.png)

双击打开编辑页面, 修改成`cmp eax,9`, 然后点击确定, 注意只需要点击一次确定即可, 点击确定后它还是会继续弹出其它行的编辑界面, 此时直接关闭对话框即可。
![](/images/2019-01-15-15-31-30.png)

修改完之后`Ctrl+P`导出修改过的dll文件(点击**修补文件**按钮就是导出dll文件)
![](/images/2019-01-15-15-32-07.png)

你可以把dll文件导出到其它某个位置, 然后把**原始chrome.dll文件备份**, 再把这个修改过的替换, 然后重启Chrome, 可以发现提示已经没有了。

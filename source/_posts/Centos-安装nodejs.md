---
title: Centos 安装nodejs
toc: true
comments: true
categories:
  - Linux
  - Nodejs
tags:
  - Linux
  - Centos
  - Nodejs
abbrlink: aec2847c
date: 2019-02-15 11:29:15
---

# 使用wget下载Linux版本
1. 到nodejs官网找到nodejs的版本 `https://nodejs.org/dist/`, 这里以`v8.0.0`为例
![](/images/2019-02-15-12-01-55.png)
下载对象32位或者64位的版本
2. 我的系统是64位的, 所以选择`node-v8.0.0-linux-x64.tar.xz`下载 
```bash
wget https://nodejs.org/dist/v8.0.0/node-v8.0.0-linux-x64.tar.xz
```

<!-- more -->

# 解压
```bash
tar -xf node-v8.0.0-linux-x64.tar.xz
rm node-v8.0.0-linux-x64.tar.xz -f
mv node-v8.0.0-linux-x64/ /usr/local/node       # 移动到/usr/local/node中
```

![](/images/2019-02-15-12-05-28.png)

# 配置环境变量
打开配置文件, 
```bash
vim /etc/profile
```
在配置文件最后加入如下: 
```
export NODE_HOME=/usr/local/node
export PATH=$PATH:$NODE_HOME/bin  
export NODE_PATH=$NODE_HOME/lib/node_modules
```

再使用命令使配置文件生效
```bash
source /etc/profile    
```

# 完成
```bash
node -v
```
使用命令查看nodejs版本号, 成功看到则表明配置成功

![](/images/2019-02-15-12-11-21.png)

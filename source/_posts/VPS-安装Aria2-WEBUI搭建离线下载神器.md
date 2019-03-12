---
title: VPS 安装Aria2+WEBUI搭建离线下载神器
toc: true
comments: true
abbrlink: dd16f5a8
date: 2019-03-02 10:45:53
categories:
    - aria2
    - VPS
tags:
    - aria2
    - VPS
    - WEBUI
---

# 前言
本文介绍在**VPS**上搭建自己的离线下载工具, 搭建成功后即可远程离线下载自己的电影了

成功搭建后, 访问自己**VPS**的ip 如图所示, 
![](/images/2019-03-02-10-52-43.png)

<!-- more -->

# 搭建流程
## 安装Aria2
这里介绍**Centos 6 64位**安装Aria2的过程, 见文章 https://vonsdite.cn/posts/35a3d1bf.html

## 配置Aria2

### 创建.aria2文件夹
在自己**VPS** root目录或者home目录 创建`.aria2`文件夹, 该文件夹**用于保存aria2的配置文件**
```bash
cd ~
mkdir .aria2
```
![](/images/2019-03-02-10-59-19.png)

### 创建aria2.conf aria2.log aria2.session

```bash
touch aria2.conf 
touch aria2.log 
touch aria2.session
```
.
![](/images/2019-03-02-11-01-55.png)

### 修改aria2.conf内容
到文件https://vonsdite.cn/posts/987f219f.html 复制aria2的配置到`aria2.conf`
注意修改一下几点:
![](/images/2019-03-02-11-05-57.png)
![](/images/2019-03-02-11-09-11.png)

**有BT/磁力链下载需求的, 请设置下面**
![](/images/2019-03-02-11-10-01.png)
**bt-tracker**的每日更新, 见 https://github.com/VonSdite/UpdateBtTracker, 需要python3环境、requests模块, 注意修改conf的位置, 同时使用**linux**的 `crontab -e`来设置其每日定时运行

## 启动aria2
配置完Aria2, 就可以在**VPS**上启动aria2了
```bash
aria2c --conf-path=/root/.aria2/aria2.conf -D
```

### 设置为开机自启动
1. centos
到`/etc/rc.d/rc.local`文件下面加入下面这一行
```
aria2c --conf-path=/root/aria2.conf -D &
```

2. ubuntu
到`/etc/rc.local`文件内, 在`exit 0`前面加入下面一行
```
aria2c --conf-path=/root/aria2.conf -D &
```

## 安装WEBUI
### 安装http服务
首先要安装http服务, 注意, 如果有iptables, 要先开放80端口, 
**开放80端口如下** 参考文章 https://vonsdite.cn/posts/fb664bd6.html
```
/sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT  
/etc/init.d/iptables save                              
service iptables restart                                
```

**安装http服务**
1. centos
```
yum  -y  install  httpd
chkconfig --levels 235 httpd on
service httpd start
```
2. ubuntu
```
apt-get -y install apache2
```

### 下载WebUI
1. git clone https://github.com/ziahamza/webui-aria2 

2. 保留clone下来的webui-aria2的**docs**目录, 并改名为`webui`, 并放到`/var/www/html/`目录下。
同时设置权限:
```
chmod 755 /var/www/html/webui
```

3. 然后http://IP地址/webui 就可访问成功, 如**文章最开始的示例图**一样

## 关于百度云rpc远程下载
文章在设置**aria2.conf**时, 打开了**rpc服务**, 主要是为了与方便导出百度云下载
![](/images/2019-03-02-11-43-37.png)

最终效果如图
![](/images/2019-03-02-12-32-51.png)

### 安装chrome插件
为了导出百度云, 并使用**rpc服务**, 需要安装**网盘助手**来导出
插件下载链接 https://github.com/acgotaku/BaiduExporter, 安装方法**README.md**已有介绍

### 设置网盘助手

> Set --rpc-secret=<secret> if you are using aria2 1.18.4(or higher) with 'JSON-RPC PATH' like http://token:secret@hostname:port/jsonrpc
> Set --rpc-user=<username> --rpc-passwd=<passwd> if you are using aria2 1.15.2(or higher) with 'JSON-RPC PATH' like http://username:passwd@hostname:port/jsonrpc
![](/images/2019-03-02-12-45-44.png)

完成上述设置, 就可以很方便的使用了, Enjoy

配合h5ai, 就可以实现下载视频后在线播放：https://vonsdite.cn/posts/d28cf173.html

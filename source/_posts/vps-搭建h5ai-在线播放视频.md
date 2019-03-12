---
title: vps 搭建h5ai 在线播放视频
toc: true
comments: true
abbrlink: d28cf173
date: 2019-03-02 12:47:47
categories:
    - aria2
    - VPS
tags:
    - aria2
    - VPS
    - h5ai
---

# 前言
使用h5ai, 可以实现**VPS**在线查看文件、播放视频、查看图片等功能

最终效果图:
![](/images/2019-03-02-13-05-33.png)
![](/images/2019-03-02-13-05-25.png)

配合VPS上的aria2下载电影 https://vonsdite.cn/posts/dd16f5a8.html, 就很舒服

<!-- more -->

# 安装h5ai
## 安装php
根据https://vonsdite.cn/posts/dd16f5a8.html教程, 我们已经安装好http环境了, 现在只需要安装php, 方法如下

1. centos 7
```
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm --force --nodeps
yum install php70w
service httpd restart
```

2. ubuntu
```
apt-get install php
apt-get install libapache2-mod-php
/etc/init.d/apache2 restart
```

## 下载h5ai
到 https://larsjung.de/h5ai/ 下载h5ai
将解压后的文件夹整个上传到`/var/www/html`, 跟`webui`同目录, 如下图
![](/images/2019-03-02-13-08-25.png)

## 修改apache配置文件
1. Centos
修改`/etc/httpd/conf/httpd.conf`文件, 在**最后面增加以下内容**, 注意替换相关信息

```
ServerName 你的vpsIP:80
NameVirtualHost 你的vpsIP
<VirtualHost 你的vpsIP>
ServerAdmin admin@138vps.com
DocumentRoot /var/www/html/
ServerName 你的vpsIP
DirectoryIndex index index.html index.php /_h5ai/public/index.php
</VirtualHost>
```

2. ubuntu
修改`/etc/apache2/mods-available/dir.conf`文件, 找到类似 
`DirectoryIndex index.html index.cgi index.pl index.php index.xhtml index.htm`, 
改成: `DirectoryIndex index index.html index.php /_h5ai/public/index.php`


## 重启http服务
1. centos
```
service httpd restart
```

2. ubuntu
```
/etc/init.d/apache2 restart
```

完成即可使用了, Enjoy

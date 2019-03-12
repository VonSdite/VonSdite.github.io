---
title: Centos6 iptables防火墙设置 开放关闭端口
toc: true
comments: true
categories:
  - Linux
  - iptables
tags:
  - Linux
  - Centos
  - iptables
abbrlink: fb664bd6
date: 2019-02-14 12:46:06
---

# 开启端口
**方法1**
```
/sbin/iptables -I INPUT -p tcp --dport 端口号 -j ACCEPT  # 写入修改

/etc/init.d/iptables save                               # 保存修改

service iptables restart                                # 重启防火墙, 修改生效
```

<!-- more -->

**方法2**
`vim /etc/sysconfig/iptables` 打开配置文件加入如下语句:
```
-A INPUT -p tcp -m state --state NEW -m tcp --dport 端口号 -j ACCEPT   # 重启防火墙, 修改完成
```

# 关闭端口
**方法1**
```
/sbin/iptables -I INPUT -p tcp --dport 端口号 -j DROP  # 写入修改

/etc/init.d/iptables save                              # 保存修改

service iptables restart                               # 重启防火墙, 修改生效
```

**方法2**
`vim /etc/sysconfig/iptables`  打开配置文件加入如下语句:
```
-A INPUT -p tcp -m state --state NEW -m tcp --dport 端口号 -j DROP   # 重启防火墙, 修改完成
```

# 查看端口状态
```
/etc/init.d/iptables status
```

# 防火墙启动、重启、关闭
```
service iptables start

service iptables restart

service iptables stop
```

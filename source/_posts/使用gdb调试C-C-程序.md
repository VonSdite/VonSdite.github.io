---
title: 使用gdb调试C/C++程序
toc: true
comments: true
abbrlink: 898073bb
date: 2018-12-31 22:10:00
categories:
    - C/C++
    - gdb
tags:
    - C/C++
    - gdb
---

# 前言
调试, 是编写程序过程中确保程序正确性的重要环节, 现在使用的IDE大多都集成了调试器, 但linux最著名的调试器是命令行形式的**C/C++调试器GDB**。以下将介绍**GDB**的基本使用方法。
![](/images/2018-12-31-22-21-52.png)

<!-- more -->

# 安装GDB
大多数的发行版Linux系统中都有GDB

## Debian 或 Ubuntu
`$ sudo apt-get install gdb`

## Arch Linux
`$ sudo pacman -S gdb`

## Fedora, CentOS 或 RHEL
`$ sudo yum install gdb`

也可以从[官网中下载](https://www.gnu.org/software/gdb/)。

# 示例代码
学习任何一项技能, 动手试验才是关键。以下是本文演示GDB的代码, 多文件调试, 它可以很好的体现GDB的特性。将它拷贝下来并且进行实验——这是最好的方法。
<details><summary>**a.c**</summary>```c
#include <stdio.h>
#include "b.h"
#include "c.h"
int main(int argc,char**argv){
	long d,result=1,i=0,dresult,sum;
	printf("please input your student number:\n");
	scanf("%ld",&d);dresult=d%100;
	while(d>0) { result+=(d%100)&1; d=d/100; }
	while(i++<150){
		sum=sqrt(dresult);
		dresult=sum+1;
	}
	
	mytool1_print(":");
	mytool2_print(":");
	printf("your numbers are %ld,%ld\n",cresult,sum);
}
```
</details>

<details><summary>**b.h**</summary>```c 
#ifndef _MYTOOL_1_H
#define _MYTOOL_1_H
void mytool1_print(char*print_str);
#endif
```
</details>

<details><summary>**b.c**</summary>```c
#include<stdio.h>
#include "b.h"
#include "c.h"
void mytool1_print(char*print_str)
{
	printf("1 %s\n",print_str);
	mytool2_print("2");
} 
```
</details>

<details><summary>**c.h**</summary>
```c
#ifndef _MYTOOL_2_H
#define _MYTOOL_2_H
void mytool2_print(char* print_str);
long sqrt(long d);
extern long cresult;
#endif
```
</details>

<details><summary>**c.c**</summary>```c 
#include "c.h"
#include <stdio.h>
long cresult=0;
long d1result=0;
long sqrt(long re)
{
	if(cresult==0)cresult=re%100/10+(re%10)*(re%10);
	if(d1result>=140)return cresult*cresult+1;
	if(++d1result>=128)return cresult+10;
	return re*re*re%1000;
}
void mytool2_print(char* print_str)
{
	printf("2: %s\n",print_str);
}
```
</details>

# GDB的使用
## 编译Debug程序
首先最重要的, 你需要使用编译器的`"-g"`选项来编译程序, 这样可执行程序才能通过GDB来运行。
```shell
$ gcc a.c b.c c.c -g -o mydebug 
```

# 开始调试
```shell
$ gdb -tui [可执行程序名]
```
使用`'-tui'`选项可以将代码显示在一个漂亮的交互式窗口内(所以被称为**文本用户界面TUI**), 在这个窗口内可以滚动鼠标滑轮, 同时在下面的**GDB shell中输入命令**。
![](/images/2018-12-31-22-42-07.png)

## 查看代码 list
我们可以使用`list`命令来显示代码, 使用方法有
```
list [file:]start[,end]
list [file:]function
```

### 1. 查看c.c的第1行
```
list c.c:1
```
**or 简写**

```
l c.c:1
```
![](/images/2019-01-01-10-12-32.png)

### 2. 查看b.c的3到8行
```
list b.c:3,8
```
**or 简写**

```
l b.c:3,8
```
![](/images/2019-01-01-10-14-48.png)

### 3. 查看c.c的mytool2_print函数
```
list c.c:mytool2_print
```
**or 简写**

```
l c.c:mytool2_print
```
![](/images/2019-01-01-10-16-32.png)

## 运行程序 run 
gdb 输入run即可运行程序
```
run
```
![](/images/2019-01-01-10-51-42.png)


## 设置断点 break
```c
break  [file:]行号        
break  [file:]行号  if  条件  
break  [file:]函数        
break  *address      
```

### 1. 在a.c第10行设置断点
```
list a.c:1
break 10
```
**or**
```
break a.c:10
```
从图可见, 文本用户界面TUI下, 设置**断点会标志在文本的左侧**
![](/images/2019-01-01-10-26-57.png)

### 2. 在a.c main函数开始处设置断点
```
list a.c:1
break main
```
**or**
```
break a.c:main
```
![](/images/2019-01-01-10-30-20.png)

### 3. 在a.c的第10行设置条件断点
条件断点的意思是, 当条件满足时, 断点会被执行; 条件不满足, 断点不会被执行
```
break a.c:10 if i == 150
```
设置了当i等于150时, 执行断点, 方便在调试循环的时候, 想调试第几次循环的结果
![](/images/2019-01-01-10-35-18.png)

## 设置观察点 watch
设置一个'观察断点', 当这个被观察的变量发生变化时, 程序会被停止。
```c
watch 变量  (发生变化时暂停运行)            
rwatch 变量 (被访问时暂停运行)       
awatch 变量 (发生被访问或改变时暂停运行)
```

### 1. 给a.c中的sum变量设置观察点
```
list a.c:1
break main
run
watch sum
```
观察点要在程序运行的时候才能设置
![](/images/2019-01-01-10-48-37.png)

## 继续运行continue
遇到断点时, 要继续向下运行到下一个断点或者运行到结束程序, 使用continue命令
![](/images/2019-01-01-10-54-32.png)

## 跳出循环until
在执行完循环体内的最后一条语句之后执行 until, 就会执行完循环体到后面的一个语句停下。
**PS:** 就是循环体要执行一遍, 回到循环判断条件, 再执行until命令就会跳出循环

## 查看变量值 print
**print**用来查看变量的值
```
print 变量
p 变量
```

**ptype**用来查看变量的类型
```
ptype 变量
```

## 修改变量的值 set
这样会覆盖变量的值。不过需要注意, 你不能创建一个新的变量或改变变量的类型。
```
set var [变量] = [新的值]
```

## 单步调试
**step** 运行到下一条语句, 有可能进入到一个函数里面
```
step
```

**next** 直接运行下一条语句, 而不进入子函数内部
```
next
```

## 删除断点
```
delete 断点号
clear 断点所在行
```

## 退出程序 quit
```
quit
```

## 查看gdb内部命令 help
```
help 命令名
```
![](/images/2019-01-01-11-29-13.png)
![](/images/2019-01-01-11-29-27.png)

## complete 列出命令
列出所有以字符串str开头的命令 
```
complete str
```

![](/images/2019-01-01-11-30-53.png)


## 其他命令
```
info breakpoints        (显示断点信息)
info watchpoints	    (显示观察点信息)

// 捕捉点
catch event    (event发生时, 程序暂停运行)
tcatch event            (设置只停一次的catchpoint, 第一次生效后, 该捕捉点被自动删除)
event可以如下:
    exec: exec被调用
    fork: fork被调用
    load: 加载动态库
    load libname: 加载名为libname的动态库
    unload: 卸载动态库
    unload libname: 卸载名为libname的动态库
    syscall [args]: 调用系统调用, args可以指定系统调用号, 或者系统名称

// 关于断点的
disable(dis <-命令简写) n   使断点n暂时失效
enable(en <-命令简写)  n     恢复断点n功能

// 函数调用
call  func
return  [expr] 函数后续语句不再执行直接返回, expr可设置返回值
finish 函数后续语句执行完返回

// 搜索当前文件, 模式搜索
forward-search  regexp    (行首开始)   
search  regexp  	        (当前行开始)
reverse-search  regexp    (行尾开始)

// 查看运行数据
print命令   
    print  [/fmt]  exp
当被调试的程序停止时, 可以用print命令（简写为p）或同义命令inspect来查看当前程序中运行的数据。 

gdb所支持的表达式中的运算符
    用&运算符取出变量在内存中的地址。print  &array[i] 
    { type }adrexp 表示一个数据类型为type、存放地址为adrexp的数据。{}
    @  它是一个与数组有关的双目运算符 print a[2]@3 
    file::var  或者  function::var  表示文件file（或函数function）中变量var的值。
    如'f1.c'::p

whatis命令显示出变量的数据类型 

x命令可以查看内存地址中数据的值。其使用格式是: 
    x  [/nfu]  address

display命令可以预先设置一些要显示的表达式, 当程序停住时, 或是在你单步跟踪时, 变量会自动显示, 其一般格式为: 
    display  [/fmt]  exp 
取消对先前设置的某些表达式的自动显示功能, 可使用以下命令: 
    undisplay  [disnum]
    delete display [disnum]

// 堆栈跟踪
backtrace (bt)
    打印当前的函数调用栈的所有信息

frame(f) n
    切换当前堆栈, n是一个从0开始的整数, 是栈中的层编号。比如：frame 0, 表示栈顶, frame 1, 表示栈的第二层。

info  frame(f)
    显示出当前栈帧的所有信息, 如函数地址, 调用函数的地址, 被调用函数的地址, 目前函数的程序语言、函数参数地址及值、局部变量的地址等。

```

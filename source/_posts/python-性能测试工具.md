---
title: python 性能测试工具
toc: true
comments: true
categories:
  - Python
  - 性能测试
tags:
  - Python
  - 性能测试
abbrlink: e1d29b4a
date: 2018-12-06 11:33:39
---

# timeit
```python
import timeit
print(timeit.timeit(stmt="[i for i in range(1000)]", number=100000))         # 传入的是字符串表达式
# 输出: 
# 3.0182870961591375     
```

`timeit`只输出被测试代码的总运行时间, 单位为秒, 没有详细的统计.
[timeit的详细介绍点这里](/posts/6218c1b6.html)

<!-- more -->

# profile / cProfile
`profile`: **纯Python**实现的性能测试模块, 接口和`cProfile`一样
`cProfile`: **c语言**实现的性能测试模块, 接口和`profile`一样

```python
>>> import profile
>>> def fun():
...     for i in range(100000):
...             a = i * i
...
>>> profile.run('fun()')
         5 function calls in 0.016 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.016    0.016 :0(exec)
        1    0.000    0.000    0.000    0.000 :0(setprofile)
        1    0.016    0.016    0.016    0.016 <stdin>:1(fun)
        1    0.000    0.000    0.016    0.016 <string>:1(<module>)
        1    0.000    0.000    0.016    0.016 profile:0(fun())
        0    0.000             0.000          profile:0(profiler)
```

```python
>>> import cProfile
>>> def fun():
...     for i in range(100000):
...             a = i * i
...
>>> cProfile.run('fun()')
         4 function calls in 0.005 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.005    0.005    0.005    0.005 <stdin>:1(fun)
        1    0.000    0.000    0.005    0.005 <string>:1(<module>)
        1    0.000    0.000    0.005    0.005 {built-in method builtins.exec}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
```

## 解释
```python
>>> import cProfile
>>> import re
>>> cProfile.run('re.compile("foo|bar")')
         199 function calls (194 primitive calls) in 0.000 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.000    0.000 <string>:1(<module>)
        4    0.000    0.000    0.000    0.000 enum.py:265(__call__)
        4    0.000    0.000    0.000    0.000 enum.py:515(__new__)
        2    0.000    0.000    0.000    0.000 enum.py:801(__and__)
        1    0.000    0.000    0.000    0.000 re.py:231(compile)
        1    0.000    0.000    0.000    0.000 re.py:286(_compile)
        1    0.000    0.000    0.000    0.000 sre_compile.py:223(_compile_charset)
        1    0.000    0.000    0.000    0.000 sre_compile.py:250(_optimize_charset)
        1    0.000    0.000    0.000    0.000 sre_compile.py:414(_get_literal_prefix)
        1    0.000    0.000    0.000    0.000 sre_compile.py:441(_get_charset_prefix)
        1    0.000    0.000    0.000    0.000 sre_compile.py:482(_compile_info)
        2    0.000    0.000    0.000    0.000 sre_compile.py:539(isstring)
        1    0.000    0.000    0.000    0.000 sre_compile.py:542(_code)
        1    0.000    0.000    0.000    0.000 sre_compile.py:557(compile)
      3/1    0.000    0.000    0.000    0.000 sre_compile.py:64(_compile)
        3    0.000    0.000    0.000    0.000 sre_parse.py:111(__init__)
····# 此处省略
```

1. 上述运行表明有199个函数被调用, 其中有194个原生调用(即不涉及递归调用)
2. 总共运行时间 0.000 seconds 
3. 结果按**标准名称**进行**排序**
4. 列表中
    - `ncalls`表示函数调用的次数(有两个数值表示有递归调用, **总调用次数/原生调用次数**)
    - `tottime`是函数内部调用时间(不包括他自己调用的其他函数的时间)
    - 第一个`percall` = `tottime`/`ncalls`
    - `cumtime`累积调用时间, 它包含了自己内部调用函数的时间
    - 第二个`percall` = `cumtime`/`ncalls`
    - 最后一列: **文件名, 行号, 函数名**

# line_profiler
`line_profiler`可以统计**每行代码**的**执行次数**和**执行时间**等, 时间单位为**微秒**。

## 安装
```bash
pip install line_profiler 
```
安装之后, python 下会多一个`kernprof.py`

## 使用
1. 在需要测试的函数加上`@profile`装饰, 这里我们测试代码`test.py`

2. 运行命令行: `kernprof -l -v test.py`

![](/images/2018-12-06-12-03-36.png)

- `Total Time`: 测试代码的总运行时间 
- `File`: 测试的代码名
- `Function`: 测试的函数所在的行
- `Line #`: 表示代码的行号
- `Hits`: 表示每行代码运行的次数  
- `Time`: 每行代码运行的总时间, 时间单位为**微秒** 
- `Per Hits`: 每行代码运行一次的时间, 时间单位为**微秒**
- `% Time`: 每行代码运行时间的百分比

**test.py**
```python
import time

@profile
def fun():
    a = 0
    b = 0
    for i in range(100000):
        a = a + i * i
    for i in range(3):
        b += 1
        time.sleep(0.1)
    return a + b
    
fun()
```

# memory_profiler
`memory_profiler`工具可以统计每行代码占用的**内存大小**。  

## 安装
```bash
pip install memory_profiler  
pip install psutil  
```

## 使用
1. 在需要测试的函数加上`@profile`装饰
  
2. 执行命令:  `python -m memory_profiler test.py `

![](/images/2018-12-06-13-29-48.png)

# Pycharm图形化性能测试工具
PyCharm提供了性能分析工具`Run-> Profile`, 如下图所示。利用Profile工具可以对代码进行性能分析, 找出瓶颈所在
![](/images/2018-12-06-13-57-16.png)

## 使用
测试代码见下文, 一共有5个函数, 每个函数都调用了`time.sleep`进行延时
点击`Run-> Profile`开始测试, 代码运行结束后会生成一栏测试结果, 
测试结果由两部分构成, **Statistics(性能统计)**和**Call Graph(调用关系图)**

### Statistics(性能统计)
![](/images/2018-12-06-13-57-37.png)

性能统计界面由`Name`、`Call Count`、`Time(ms)`、`Own Time(ms)` 4列组成一个表格。

1. `Name`显示被调用的**模块或者函数**
2. `Call Count`显示被调用的次数; 
3. `Time(ms)`显示运行时间和时间百分比, 时间单位为毫秒(ms), **包含**自己内部调用函数的时间
4. `Own Time(ms)`显示运行时间和时间百分比, 时间单位为毫秒(ms), **不包含**自己内部调用函数的时间

#### 小技巧
1. 点击表头上的**小三角**可以**升序或降序**排列表格。
2. 在`Name`这一个列中**双击**某一行可以跳转到对应的代码。


### Call Graph(调用关系图)
![](/images/2018-12-06-13-57-50.png)

`Call Graph`(调用(系图), 包含了自己内部调用函数的时间界面**直观展示了各函数直接的调用关系**、运行时间和时间百分比。

#### 解释

1. 箭头表示**调用关系**, 由调用者指向被调用者; 

2. 矩形的**左上角**显示模块或者函数的名称, **右上角**显示被调用的次数; 

3. 矩形**中间**显示运行时间和时间百分比; 

4. 矩形的**颜色**表示运行时间或者时间百分比大小的趋势: **红色 > 黄绿色 > 绿色**, 比如由图可以看出fun3的矩形为黄绿色, fun1为绿色, 所有fun3运行时间比fun1长。

5. 从图中可以看出`test.py`直接调用了fun3、fun1、fun2和fun5函数; fun5函数直接调用了fun4函数; fun1、fun2、fun3、fun4和fun5都直接调用了print以及sleep函数; 整个测试代码运行的总时间为6001ms, 其中fun3的运行时间为1999ms, 所占的时间百分比为33.3%, 也就是 1999ms /  6006ms = 33.3%。


**test.py**
```python
# -*- coding: utf-8 -*-
# __Author__: Sdite
# __Email__ : a122691411@gmail.com

import time

def fun1(a, b):
    print('fun1')
    print(a, b)
    time.sleep(1)

def fun2():
    print('fun2')
    time.sleep(1)

def fun3():
    print('fun3')
    time.sleep(2)

def fun4():
    print('fun4')
    time.sleep(1)

def fun5():
    print('fun5')
    time.sleep(1)
    fun4()

fun1('foo', 'bar')
fun2()
fun3()
fun5()
```

# objgraph
`objgraph`是一个实用模块, 可以列出当前内存中存在的对象, 可用于定位**内存泄露**

推荐文章: http://python.jobbole.com/88827/
**详情还是谷歌或百度一下, 日后看了再补充**


---
title: python 代码运行计时函数比较
toc: true
toc_number: false
comments: true
abbrlink: 605d5daa
date: 2018-12-04 18:23:44
categories:
    - Python
tags:
    - Python
---

# 计时函数
计算python某个程序或者代码块的**运行时间**, 可以使用如下方法

方法 | 说明
---|---
[datetime.datetime.now()](/posts/605d5daa.html#1-datetime-datetime-now) | 该方法包含了其他程序使用CPU的时间, **不推荐**
[time.time()](/posts/605d5daa.html#2-time-time) | `Unix`系统下, 建议使用
[time.clock()](/posts/605d5daa.html#3-time-clock) | `Windows`系统下, 建议使用
[timeit.default_timer()](/posts/605d5daa.html#4-timeit-default-timer) | 跨平台使用, **最推荐**![](/images/recommend.png)

<!-- more -->

![](/images/2018-12-05-01-08-07.png)

> `time.clock()`返回的是处理器时间, 而因为**Unix**中**jiffy**的缘故, 所以精度不会太高
> 究竟是使用`time.clock()`, 还是使用`time.time()`, 由平台来决定
> 总概来讲, 在**Unix系统**中, 建议使用`time.time()`, 
> 在**Windows系统**中, 建议使用`time.clock()`. 
> 要实现跨平台的精度性, 使用`timeit`来代替`time`.


## 1.datetime.datetime.now
该方法包含了其他程序使用CPU的时间
**不推荐**

```python
def test_datetime():
    start = datetime.datetime.now()
    time.sleep(100)
    end = datetime.datetime.now()
    print("test datetime():", "%fms" % (float((end - start).microseconds) / 1000))
```

## 2.time.time
该方法包含了其他程序使用CPU的时间, 返回值是浮点数
**Unix系统下推荐**

```python
def test_time():
    start = time.time()
    time.sleep(100)
    end = time.time()
    print("test time():", "%fms" % ((end - start) * 1000))
```

## 3.time.clock
只计算程序运行CPU的时间
**Windows系统下推荐**

```python
def test_clock():
    start = time.clock()
    time.sleep(100)
    end = time.clock()
    print("test clock():", "%fms" % ((end - start) * 1000))
```

## 4.timeit.default_timer
**实现跨平台**的精度性

```python
def test_timeit():
    start = timeit.default_timer()
    time.sleep(100)
    end = timeit.default_timer()
    print("test timeit():", "%fms" % ((end - start) * 1000))
```

## 测试代码
结果如图:
![](/images/2018-12-04-21-09-26.png)

```python
import time
import timeit
import datetime

SLEEP_TIME = 0.001

def test_datetime():
    start = datetime.datetime.now()
    time.sleep(SLEEP_TIME)
    end = datetime.datetime.now()
    print("test datetime():", "%fms" % (float((end - start).microseconds) / 1000))

def test_time():
    start = time.time()
    time.sleep(SLEEP_TIME)
    end = time.time()
    print("test time():", "%fms" % ((end - start) * 1000))

def test_clock():
    start = time.clock()
    time.sleep(SLEEP_TIME)
    end = time.clock()
    print("test clock():", "%fms" % ((end - start) * 1000))

def test_timeit():
    start = timeit.default_timer()
    time.sleep(SLEEP_TIME)
    end = timeit.default_timer()
    print("test timeit():", "%fms" % ((end - start) * 1000))
    
if __name__ == "__main__":
    test_datetime()
    test_time()
    test_clock()
    test_timeit()
```

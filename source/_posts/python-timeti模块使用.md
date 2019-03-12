---
title: python timeti模块使用
toc: true
comments: true
categories:
    - Python
    - 性能测试
tags:
    - Python
    - timeit
abbrlink: 6218c1b6
date: 2018-12-05 23:50:42
---

# 前言
python可以使用`timeit`模块来测试小段代码的运行时间.
`timeit`主要的函数有`timeit`和`repeat` (还有`default_timer`, 用法可见[文章](/posts/605d5daa.html#4-timeit-default-timer))

# `timeit`和`repeat`的实现
```python
def timeit(stmt="pass", setup="pass", timer=default_timer,
               number=default_number, globals=None):
    """Convenience function to create Timer object and call timeit method."""
    return Timer(stmt, setup, timer, globals).timeit(number)

def repeat(stmt="pass", setup="pass", timer=default_timer,
               repeat=default_repeat, number=default_number, globals=None):
    """Convenience function to create Timer object and call repeat method."""
    return Timer(stmt, setup, timer, globals).repeat(repeat, number)
```

<!-- more -->

在上面的代码中可见, 无论是`timeit`还是`repeat`都是先 生成`Timer`对象, 然后调用了`Timer`对象的`timeit`或`repeat`函数。


## 参数
1. **`stmt`**: 用于传入要测试时间的代码, 可以直接接受**字符串的表达式**, 也可以接受**单个变量**, 也可以接受**函数**。
    **PS:** **传入函数**时要使用参数`setup`导入函数 ![](/images/ExclamationMark.png)

2. **`setup`**: 传入stmt的**运行环境**, 比如stmt中使用到的**参数、变量, 要导入的模块**等。可以写一行语句, 也可以写多行语句, 写多行语句时要用**分号;**隔开语句。

3. **`number`**: 要测试的代码的**运行次数**, 默认**100000次**, 对于耗时的代码, 运行太多次会比较慢, 此时建议自己修改一下运行次数
4. **`repeat`**: 指**测试要重复几次**, 每次的结果构成列表返回, **默认3次**。

## 用法
在使用timeit模块时, 有两种方式
1. 直接使用`timeit.timeit()`、`tiemit.repeat()`
2. 先用`timeit.Timer()`来生成一个**Timer对象**, 然后再用Timer对象用`timeit()`和`repeat()`函数, 相对灵活一些。

## repeat的优点
可以多次重复测试, 并可以对测试所得的执行时间取**最小值**, **平均值**, **最大值**, 更方便分析。

# 例子

## 例子1
测试一个**列表推导式** 比正常写**for循环**快多少
```python
import timeit

foo = """
sum = []
for i in range(1000):
    sum.append(i)
"""

print(timeit.timeit(stmt="[i for i in range(1000)]", number=100000))         # 传入的是字符串表达式
print(timeit.timeit(stmt=foo, number=100000))                            # 传入的是变量
# 输出：
# 3.0182870961591375     
# 8.967388768466217

```

## 例子2
使用`timeit`来比较**递归斐波那契**和**迭代斐波那契**的时间效率差异

### 注意
代码中分别定义了**两个函数**, 
要测试这两个函数, 需导入这两个函数, 
即设置`setup = from __main__ import recursive_fibonacci`, 
表明从**当前运行的代码**下导入这两个函数。
如果是其他模块的, 则要`import`别的模块进来

```python
import timeit

def recursive_fibonacci(nth_item):
    if nth_item == 1 or nth_item == 2:
          return 1
    elif nth_item <= 0:
          return 0

    return recursive_fibonacci(nth_item - 1) + recursive_fibonacci(nth_item - 2)

def loop_fibonacci(nth_item):
    if nth_item == 1 or nth_item == 2:
          return 1
    elif nth_item <= 0:
          return 0

    first_item, second_item = 1, 1

    for x in range(nth_item-2):
          first_item, second_item = second_item, first_item + second_item

    return second_item


if __name__ == "__main__":
    print(
          timeit.timeit(
              stmt="recursive_fibonacci(20)",
              setup="from __main__ import recursive_fibonacci", number=10000
          )
    )
    print(
          timeit.timeit(
              stmt="loop_fibonacci(20)",
              setup="from __main__ import loop_fibonacci",
              number=10000
          )
    )
```

## 例子3

`setup`参数的灵活使用, 设置`stmt`的**运行环境**的详细例子
涉及
- 导入模块
- 变量定义
- 函数调用
- 多行写`setup`要加**分号**![](/images/ExclamationMark.png)的方式

```python
import timeit

x = """
say_hi.ParseFromString(p)
"""

y = """
simplejson.loads(x)
"""

print(
    timeit.timeit(
        stmt=x, 
        setup="import say_hi_pb2;"
            "say_hi = say_hi_pb2.SayHi();"
            "say_hi.id = 13423;"
            "say_hi.something = 'axiba';"
            "say_hi.extra_info = 'xiba';"
            "p =say_hi.SerializeToString()", 
            number=1000000
    )
)

print(
    timeit.timeit(
        stmt=y, 
        setup="import simplejson; "
            "json={"
            "'id': 13423,"
            "'something': 'axiba',"
            "'extra_info': 'xiba',"
            "};"
            "x = simplejson.dumps(json)", 
        number=1000000
    )
)
```

# 命令行调用timeit
```bash
python -m timeit [-n N] [-r N] [-s S] [-t] [-c] [-h] [statement...]

-n N 执行指定语句的次数
-r N 重复测量的次数(默认3次)
-s S 指定初始化代码构建环境的导入语句(默认pass)
python 3.3新增
-t 使用time.time() (不推荐)
-c 使用time.clock() (不推荐)
-v 打印原始计时结果
-h 帮助
```

```bash
$ python -m timeit '"-".join(str(n) for n in range(100))'
loops, best of 3: 40.3 usec per loop
$ python -m timeit '"-".join([str(n) for n in range(100)])'
loops, best of 3: 33.4 usec per loop
$ python -m timeit '"-".join(map(str, range(100)))'
loops, best of 3: 25.2 usec per loop
```


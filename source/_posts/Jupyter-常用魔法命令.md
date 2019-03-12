---
title: Jupyter 常用魔法命令
toc: true
comments: true
abbrlink: e422ea85
date: 2019-01-09 16:31:20
categories:
    - Python
    - Jupyter
tags:
    - Python
    - Jupyter
---

# 前言
Jupyter NoteBook 是功能强大的Python交互IDE, 自带的一些常用Magic Command 可以让它变得更加得心应手。

magic函数主要包含两大类，一类是**行魔法（Line magic）**前缀为`%`，一类是**单元魔法(Cell magic)**前缀为`%%`;

<!-- more -->

# %lsmagic
打印当前可以用的魔法命令
![](/images/2019-01-09-16-39-15.png)

# %matplotlib inline
使用matplotlib画图时，图片嵌入在jupyter notebook里面，不以单独窗口显示
![](/images/2019-01-09-16-43-22.png)

# %timeit %%timeit 
为代码执行计时
%timeit 是 **行魔法命令**
%%timeit 是 **块魔法命令**
![](/images/2019-01-09-16-45-04.png)

# %%writefile 
后面紧接着一个file_name.py, 表示在jupyter notebook里面创建一个py文件，后面cell里面的内容为py文件内容

比如
```python 
%%writefile test_peace.py
import numpy as np
print(np.random.randint(1,5))
```
在当前路径下会生成一个test_peace.py的文件，内容就是cell里面的内容

# %run 
后面紧接着一个相对地址的file_name.py，表示运行一个py文件

比如
```python 
%run test_peace.py
```

# %pwd 
查找当前目录
![](/images/2019-01-09-16-46-57.png)

# %cd
更改当前目录
![](/images/2019-01-09-16-47-39.png)

# %cp 
复制文件
```python
%cp test_peace.py test_load.py
```

# %whos 
查看当前变量,类型，信息

```python
Variable   Type       Data/Info
-------------------------------
np         module     <module 'numpy' from '/us<...>kages/numpy/__init__.py'>
plt        module     <module 'matplotlib.pyplo<...>es/matplotlib/pyplot.py'>
x          float64    -0.3048106211022167
y          list       n=3
```

# %reset 
清除变量

# %del 
清除某一个变量

# %load 
加载一个文件里面的内容
```python
%load test_peace.py
```

# 魔法命令+?
加`?`可以获取魔法命令的用法
![](/images/2019-01-09-16-41-04.png)
![](/images/2019-01-09-16-40-47.png)

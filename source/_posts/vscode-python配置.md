---
title: vscode python环境配置
toc: true
comments: true
abbrlink: 8caab64
date: 2018-11-24 16:04:38
categories:
    - Vscode
    - Python配置
tags:
    - Vscode
    - Vscode Python配置
---

# 前言
Vscode Python **Windows**环境配置

1. 安装**Vscode**

2. 安装Vscode插件**Python**
![](/images/2018-11-24-16-09-13.png)

3. 安装[Python3](https://www.python.org/)

<!-- more -->

# 配置
启动Python项目的**工作区**, 例如
```bash
mkdir hello
cd hello
code .
```

## 选择Python解析器
按下`ctrl`+`shift`+`p` 调出命令面板, 键入`python: select interpreter`, 选择该Python项目的Python解析器

与在`settings.json`的工作区中设置`python.pythonPath`相同
```python
"python.pythonPath": "E:\\python\\python.exe",
```

## 运行Python程序
![](/images/2018-11-24-16-17-14.png)

![](/images/2018-11-24-16-17-28.png)

## 配置Python调试器
1. 先设置断点
![](/images/2018-11-24-16-20-10.png)

2. 点击左侧的**调试**
![](/images/2018-11-24-16-20-46.png) 

3. 点击小齿轮设置`launch.json`(会自动生成`launch.json`模板, 下拉框选第一个`Python: Current File (Integrated Terminal)`就好了)

![](/images/2018-11-24-16-21-12.png)

![](/images/2018-11-24-16-21-32.png)

如果想在调试的时候, 让程序停在程序运行前, 可以再`launch.json`中加入`stopOnEntry: true`

```python
{
    "name": "Python: Current File (Integrated Terminal)",
    "type": "python",
    "request": "launch",
    "program": "${file}",
    "console": "integratedTerminal",
    "stopOnEntry": true
},
```

4. 然后按`f5`即可进行**调试**(可以单步调试等等, 更多细节可以看 [python调试](https://code.visualstudio.com/docs/python/debugging))

![](/images/2018-11-24-16-25-18.png)

## 安装linting
Linting突出了Python源代码中的语法和风格错误

1. 先使用命令行, 键入如下命令
```bash
pip install pylint
```

2. 然后在工作区的`settings.json`加入如下
```python
"python.linting.pylintEnabled": true,
"python.linting.enabled": true,
```

3. 效果图
![](/images/2018-11-24-16-29-40.png)


更多细节查看[Linting Python in Visual Studio Code](https://code.visualstudio.com/docs/python/linting)

## 单元测试
可以使用python内建的`unittest`, 或者`pytest`或者`nose`(自行安装即可)

**例子:**
比如使用`unittest`, 则在工作区的`settings.json`加入如下:
```python
"python.unitTest.unittestEnabled": true,
"python.unitTest.pyTestEnabled": false,
"python.unitTest.nosetestsEnabled": false,
```

1. 创建`inc_dec.py`
```python
def increment(x):
    return x + 1

def decrement(x):
    return x - 1
```

2. 创建`test1.py`
```python
import unittest
import inc_dec

class Test_TestIncrementDecrement(unittest.TestCase):
    def test_increment(self):
        self.assertEquals(inc_dec.increment(3), 4)

    def test_decrement(self):
        self.assertEquals(inc_dec.decrement(3), 4)

if __name__ == '__main__':
    unittest.main()
```

3. 当使用`unittest`时, vscode看起来会是这样的(emmm, 单级工作区才能这样看到, 太多文件夹貌似不行...)

![](/images/2018-11-24-16-34-14.png)

更多单元测试细节可查看[Python unit tests in Visual Studio Code](https://code.visualstudio.com/docs/python/unit-testing)

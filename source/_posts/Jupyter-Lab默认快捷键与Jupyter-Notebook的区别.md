---
title: Jupyter Lab默认快捷键与Jupyter Notebook的区别
toc: true
comments: true
categories:
    - Python
    - Jupyter
tags:
    - Python
    - Jupyter
abbrlink: c0a62ed9
date: 2019-01-09 14:57:52
---

# 前言
Jupyter Notebook和Jupyter Lab还是挺像的, 但Jupyter Lab更像IDE多一点

虽说Jupyter Lab包含 Jupyter Notebook, 但是Jupyter Notebook的一些快捷键在 Jupyter Lab中用不了


**以下均是Jupyter Notebook的快捷键, 会说明哪些在Jupyter Lab中失效了**

<!-- more -->

# 命令行模式(按 **Esc** 生效)

按键 | 功能
---|---
F | 查找并且替换 ![](/images/ExclamationMark.png)Lab中失效了
Ctrl-Shift-F | 打开命令配置 ![](/images/ExclamationMark.png)Lab中失效了, 变成了隐藏侧边栏
Ctrl-Shift-P | 打开命令配置 ![](/images/ExclamationMark.png)Lab中失效了, 打印服务...
Enter | 进入编辑模式
P | 打开命令配置            ![](/images/ExclamationMark.png)Lab中失效了
Alt-Enter | 运行代码块并且插入下面
Y | 把代码块变成代码
M | 把代码块变成标签
R | 清除代码块格式
1 | 把代码块变成heading 1
2 | 把代码块变成heading 2
3 | 把代码块变成heading 3
4 | 把代码块变成heading 4
5 | 把代码块变成heading 5
6 | 把代码块变成heading 6
K | 选择上面的代码块
方向键上 | 选择上面的代码块
方向键下 | 选择下面的代码块
J | 选择下面的代码块
Shift-K | 扩展上面选择的代码块
Shift-方向键上 | 扩展上面选择的代码块
Shift-方向键下 | 扩展下面选择的代码块
Shift-J | 扩展下面选择的代码块
A | 在上面插入代码块
B | 在下面插入代码块
X | 剪切选择的代码块
C | 复制选择的代码块
Shift-V | 粘贴到上面
V | 粘贴到下面
Z | 撤销
D,D | 删除选中单元格
Shift-M | 合并选中单元格, 如果只有一个单元格被选中
Ctrl-S | 保存并检查
S | 保存并检查	                    ![](/images/ExclamationMark.png)Lab中失效了
L | 切换行号
O | 折叠单元格的输出	             ![](/images/ExclamationMark.png)Lab中失效了
Shift-O | 切换选定单元的输出滚动      ![](/images/ExclamationMark.png)不知道有什么用, 也失效了
H | 显示快捷键                      ![](/images/ExclamationMark.png)Lab中失效了
I,I | 中断服务
0,0 | 重启服务(带窗口)
Shift-L | 在所有单元格中切换行号, 并保持设置
Shift-空格 | 向上滚动
空格 | 向下滚动


# 编辑模式(按 **Enter** 生效)
按键 | 功能
---|---
Tab | 代码完成或缩进
Shift-Tab | 工具提示    ![](/images/ExclamationMark.png)不知道有什么用
Ctrl-] | 缩进
Ctrl-[ | 取消缩进
Ctrl-A | 全选
Ctrl-Z | 撤销
Ctrl-/ | 注释
Ctrl-D | 删除整行
Ctrl-U | 撤销
Insert | 切换 重写标志
Ctrl-Home | 跳到单元格起始处
Ctrl-上 | 跳到单元格起始处
Ctrl-End | 跳到单元格最后
Ctrl-下 | 跳到单元格最后
Ctrl-左 | 跳到单词左边
Ctrl-右 | 跳到单词右边
Ctrl-backspace | 删除前面的单词
Ctrl-Delete | 删除后面的单词
Ctrl-Y | 重做
Ctrl-M | 进入命令行模式
Ctrl-Shift-F | 打开命令配置 ![](/images/ExclamationMark.png)Lab中失效了, 变成了隐藏侧边栏
Ctrl-Shift-P | 打开命令配置 ![](/images/ExclamationMark.png)Lab中失效了, 打印服务...
Esc | 进入命令行模式
Alt-Enter | 运行代码块并且插入下面
Ctrl-S | 保存并检查
方向键下 | 光标下移
方向键上 | 光标上移

---
title: conda 管理python包和环境
toc: true
comments: true
abbrlink: '99747462'
date: 2019-01-08 20:44:37
categories:
    - Python
    - Anaconda
tags:
    - Python
    - Anaconda
---

# 前言
Conda 是一个开源的软件包管理系统和环境管理系统, 用于安装多个版本的软件包及其依赖关系, 并可在它们之间轻松切换。
Conda 是为 Python 程序创建的, 适用于 Linux, OS X 和Windows, 是目前最流行的 Python 环境管理工具

<!-- more -->

# 管理包
## conda 安装包

在终端中键入 `conda install [-n env_name] package_name`
可以通过`[-n env_name]`指定要安装包的环境

例如, 要安装 numpy, 请键入 `conda install numpy`。

你还可以同时安装多个包。类似 `conda install numpy scipy pandas` 的命令会同时安装所有这些包。还可以通过添加版本号(例如 `conda install numpy=1.10`)来指定所需的包版本。

Conda 还会自动为你安装依赖项。例如, scipy 依赖于 numpy, 因为它使用并需要 numpy。如果你只安装 scipy (`conda install scipy`), 则 conda 还会安装 numpy(如果尚未安装的话)。

### 添加国内源
详情见: [清华镜像 https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)
```
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
```

## conda 删除包
在终端中键入 `conda remove [-n env_name] package_name`
可以通过`[-n env_name]`指定要删除包的环境

## conda 更新包
在终端中键入 `conda update package_name`

如果想更新环境中的所有包, 请使用 `conda update --all`

## conda 列出包
在终端中键入 `conda list`
![](/images/2019-01-08-21-02-39.png)

## conda 搜索包
在终端中键入 `conda search search_iterm`

# 管理环境 

## conda 创建环境
你可以使用 conda 创建环境以隔离项目。

要创建环境, 请在终端中使用 `conda create -n env_name [list of packages] [python=version]`。

创建具有特定 Python 版本的环境, 
请键入类似于 `conda create -n py3 python=3` 或 `conda create -n py2 python=2` 的命令, 
这些命令将**分别安装** Python 3 和 Python 2 的最新版本。
要安装特定版本(例如 Python 3.3), 请使用 `conda create -n py python=3.3`。

在这里, 
> - `-n env_name` 设置环境的名称(**-n 是指名称**), 
> - `list of packages` 是要安装在环境中的包的列表, 可不设置
> - `python=version` version是指python版本, 一般都指定
> - 只执行`conda create -n env_name`只会创建一个**空的环境**, 连python都没有, 运行的python是环境变量的python。需要装一个库后, 才会有python

例如, 要创建名为 my_env 的环境并在其中安装 numpy, 请键入 `conda create -n my_env numpy python=3.7`。
![](/images/2019-01-08-21-25-55.png)

## conda 进入环境
创建了环境后, 
在 OSX/Linux 上使用 `source activate my_env` 进入环境
在 Windows 上, 请使用 `activate my_env`

![](/images/2019-01-08-21-38-35.png)

## conda 退出环境
要离开环境, 
在 OSX/Linux 上使用 `source deactivate` 
在 Windows 上, 请使用 `deactivate`
![](/images/2019-01-08-21-39-14.png)

## conda 查看环境
终端键入 `conda info -e` 或 `conda info --env`
![](/images/2019-01-08-21-41-28.png)

## conda 删除环境
终端键入 `conda remove -n env_name --all`
![](/images/2019-01-08-21-42-39.png)

# 环境导出和导入
## 环境导出
使用 `conda env export > environment.yaml` 将**包信息**保存为 YAML。
命令的第一部分 `conda env export` 用于输出环境中的所有包的名称(包括 Python 版本)。

## 环境导入 
要通过环境文件导入环境, 
使用 `conda env create -f environment.yaml`
这会创建一个新环境, 而且它具有同样的在 `environment.yaml` 中列出的库。

# 其他
`conda update conda # 检查更新当前conda`
`python -version # 检查当前环境python版本`
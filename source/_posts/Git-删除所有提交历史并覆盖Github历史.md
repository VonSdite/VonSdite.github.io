---
title: Git 删除所有提交历史并覆盖Github历史
toc: true
comments: true
categories:
  - Git
tags:
  - Git
abbrlink: d69e1361
date: 2018-11-20 20:29:06
---

# 概述
何时需要删除Git提交的历史记录
1. 当历史记录中出现过**密码**等敏感信息在历史记录中, 需要删除历史记录时
2. 当项目因历史记录过多, 导致历史记录占用了**大量内存**时, 比如**Github仓库个人总容量时1GB不够用时**
3. 当你想要一个全新的项目的时候, 并且想保持项目代码不变

<!-- more -->

# Git命令
```bash
# 1. 创建全新的孤立分支 latest_branch
git checkout --orphan latest_branch

# 2. 暂存所有文件
git add -A

# 3. 提交所有文件的修改到latest_branch
git commit -am "del all history"

# 4. 删除原来的master分支
git branch -D master

# 5. 修改latest_branch分支名为master
git branch -m master

# 6. 强制更新远程服务器的master分支, 至此清空git所有历史
git push -f origin master
```

**不带注释, 方便复制版**
```bash
git checkout --orphan latest_branch
git add -A
git commit -am "del all history"
git branch -D master
git branch -m master
git push -f origin master
```

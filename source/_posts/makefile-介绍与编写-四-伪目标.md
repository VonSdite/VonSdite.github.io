---
title: makefile 介绍与编写(四) 伪目标
toc: true
comments: true
abbrlink: a08b2a98
date: 2019-01-02 22:00:20
categories:
  - C/C++
  - Makefile
tags:
  - C/C++
  - Makefile
---
# 前言
**摘录于 《跟我一起写makefile》**

本文主要开始介绍**makefile**的伪目标。

<!-- more -->

# 伪目标
最早先的一个例子中, 我们提到过一个"clean"的目标, 这是一个"伪目标", 
```makefile
clean:
    rm *.o temp
```

正像我们前面例子中的"clean"一样, 即然我们生成了许多文件编译文件, 我们也应该提供一个清除它们的"目标"以备完整地重编译而用。 (以"make clean"来使用该目标)
因为, 我们并不生成"clean"这个文件。"伪目标"并不是一个文件, 只是一个标签。由于"伪目标"不是文件, 所以 make 无法生成它的依赖关系和决定它是否要执行。我们只有通过显示地指明这个"目标"才能让其生效。当然, "伪目标"的取名不能和文件名重名, 不然其就失去了"伪目标"的意义了。

当然, 为了避免和文件重名的这种情况, 我们可以使用一个特殊的标记`".PHONY"`来显示地指明一个目标是"伪目标", 向 make 说明, 不管是否有这个文件, 这个目标就是"伪目标"。
```makefile
.PHONY : clean
```
**只要有这个声明**, 不管是否有"clean"文件, 要运行"clean"这个目标, **只有"make clean"这样**。于是整个过程可以这样写:

```makefile
.PHONY: clean
clean:
rm *.o temp
```

伪目标一般没有依赖的文件, 但是, 我们也可以**为伪目标指定所依赖的文件**。
伪目标同样可以作为"默认目标", 只要将其放在第一个。

## 作为默认目标示例
一个示例就是, 如果你的 Makefile 需要一口气生成若干个可执行文件, 但你只想简单地敲一个 make 完事, 并且, 所有的目标文件
都写在一个 Makefile 中, 那么你可以使用"伪目标"这个特性:
```makefile
all : prog1 prog2 prog3
.PHONY : all
prog1 : prog1.o utils.o
cc -o prog1 prog1.o utils.o
prog2 : prog2.o
cc -o prog2 prog2.o
prog3 : prog3.o sort.o utils.o
cc -o prog3 prog3.o sort.o utils.o
```

我们知道, Makefile 中的第一个目标会被作为其**默认目标**。我们声明了一个`"all"`的伪目标, 其依赖于其它三个目标。
由于伪目标的特性是, **总是被执行的**, 所以, 其它三个目标的规则总是会被运行, 也就达到了我们一口气生成多个目标的目的。

".PHONY : all"声明了"all"这个目标为"伪目标"。

## 作为依赖 示例
 从上面的例子我们可以看出, 目标也可以成为依赖。所以, 伪目标同样也可成为依赖。看下面的例子:

```makefile
.PHONY: cleanall cleanobj cleandiff
cleanall : cleanobj cleandiff
rm program
cleanobj :
rm *.o
cleandiff :
rm *.diff
```
"cleanobj"和"cleandiff"这两个**伪目标有点像"子程序"**的意思。

我们可以输入`"make cleanall"`、`"make cleanobj"`、`"make cleandiff"`命令来达到清除不同种类文件的目的。

---
title: makefile 介绍与编写(一) 介绍及使用
toc: true
comments: true
categories:
  - C/C++
  - Makefile
tags:
  - C/C++
  - Makefile
abbrlink: c6ce89df
date: 2019-01-02 19:04:42
---

# 前言
**摘录于 《跟我一起写makefile》**

一个工程中的源文件一般不计其数, 其按类型、功能、模块分别放在若干个目录中, **makefile** 定义了一系列的规则来指定, **哪些文件需要先编译, 哪些文件需要后编译**, 哪些文件需要重新编译, 甚至于进行更复杂的功能操作。因为makefile 就像一个 Shell 脚本一样, 其中也可以执行操作系统的命令。 makefile 带来的好处就是——"自动化编译", 一旦写好, 只需要一个 make 命令, **整个工程完全自动编译**, 极大的提高了软件开发的效率。

**make 是一个命令工具**, 是一个解释 makefile 中指令的命令工具, 一般来说, 大多数的 IDE 都有这个命令, 比如：Delphi 的 make, Visual C++的 nmake, Linux 下 GNU 的 make。可见, makefile 都成为了一种在工程方面的编译方法

<!-- more -->


# 关于程序的编译与链接
一般来说, 无论是 C、C++、还是 pas, 首先要把源文件编译成**中间代码文件**, 在 Windows 下也就是 .obj 文件, UNIX 下是 .o 文件, 即 Object File, 这个动作叫做编译(compile)。然后再把大量的 Object File 合成执行文件, 这个动作叫作链接(link)。 编译时, 编译器需要的是语法的正确, 函数与变量的声明的正确。对于函数与变量的声明, 通常是你需要告诉编译器头文件的所在位置(头文件中应该只是声明, 而定义应该放在 C/C++文件中), 只要所有的语法正确, 编译器就可以编译出中间目标文件。一般来说, 每个源文件都应该对应于一个中间目标文件(O 文件或是 OBJ 文件)。链接时, 主要是**链接函数和全局变量**, 所以, 我们可以使用这些中间目标文件(O 文件或是 OBJ文件)来链接我们的应用程序。链接器并不管函数所在的源文件, 只管函数的中间目标文件(Object File), .在大多数时候, 由于源文件太多, 编译生成的中间目标文件太多, 而在链接时需要明显地指出中间目标文件名, 这对于编译很不方便, 所以, 我们要给中间目标文件打个包, 在 Windows 下这种包叫"库文件"(Library FileMakefile), 也就是 .lib 文件, 在 UNIX下, 是 Archive File, 也就是 .a 文件。

**总结一下**, 源文件首先会生成中间目标文件, 再由中间目标文件生成执行文件。
在编译时, 编译器只检测程序语法, 和函数、变量是否被声明。如果函数未被声明, 编译器会给出一个警告, 但可以生成 Object File。而在链接程序时, 链接器会在所有的 Object File 中找寻函数的实现, 如果找不到, 那到就会报链接错误码(Linker Error), 在 VC 下, 这种错误一般是：Link 2001 错误, 意思说是说, 链接器未能找到函数的实现。你需要指定函数的Object File.

# makefile的规则
```makefile
target: prerequisites
    command
```

**或者**

```makefile
target: prerequisites: command
```
command与target、prerequisites如果不在同一行, 一定要以**[Tab]**键开头

> - target是一个目标文件, 可以是 Object File, 可以是 可执行文件, 也可以是一个标签(即伪目标)。 
> - prerequisites时候target目标文件所依赖的文件, 比如说一段代码**a.c、a.h**, 它生成的可执行程序为**a.out**, 那么target就为 a.out, 它所依赖的文件prerequisites为 a.c a.h。
> - command 即make所需要执行的命令(任意的shell命令)

这是一个文件的依赖关系, 也就是说, target 这一个或多个的目标文件依赖于 prerequisites 中的文件, 其生成规则定义在 command 中。说白一点就是说, prerequisites中如果有一个以上的文件比 target 文件要新的话(意思就是说只要依赖文件中有一个文件的最近修改时间比target的最近修改时间更加新), command 所定义的命令就会被执行。这就是 Makefile 的规则, 也是 Makefile 中最核心的内容。


# 示例
假设我们的工程有 8 个 C 文件, 和 3 个头文件, 我们要写一个 Makefile 来告诉 make 命令如何编译和链接这几个文件。
我们的规则是：
1. 如果这个工程没有编译过, 那么我们的所有 C 文件都要编译并被链接。
2. 如果这个工程的某几个 C 文件被修改, 那么我们只编译被修改的 C 文件, 并链接目标程序。
3. 如果这个工程的头文件被改变了, 那么我们需要编译引用了这几个头文件的 C 文件, 并链接目标程序

现在我们简单地makefile版本如下:
```makefile
edit : main.o kbd.o command.o display.o \
insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \
    insert.o search.o files.o utils.o

main.o : main.c defs.h
        cc -c main.c
kbd.o : kbd.c defs.h command.h
        cc -c kbd.c
command.o : command.c defs.h command.h
        cc -c command.c
display.o : display.c defs.h buffer.h
        cc -c display.c
insert.o : insert.c defs.h buffer.h
        cc -c insert.c
search.o : search.c defs.h buffer.h
        cc -c search.c
files.o : files.c defs.h buffer.h command.h
        cc -c files.c
utils.o : utils.c defs.h
        cc -c utils.c
clean :
        rm edit main.o kbd.o command.o display.o \
           insert.o search.o files.o utils.o
```

**反斜杠(\\)是换行符的意思**。这样比较便于 Makefile 的**易读**。

我们可以把这个内容保存在文件为"Makefile"或"makefile"的文件中, 
然后在该目录下直接输入命令"make"就可以生成执行文件 edit。
如果要删除执行文件和所有的中间目标文件, 那么, 只要简单地执行一下"make clean"就可以了

在这个 makefile 中, 目标文件(target)包含：执行文件 edit 和中间目标文件(*.o); 依赖文件(prerequisites)就是冒号后面的那些 .c 文件和 .h 文件。每一个 .o 文件都有一组依赖文件, 而这些 .o 文件又是执行文件 edit 的依赖文件。

依赖关系的实质上就是说明了目标文件是由哪些文件生成的, 换言之, 目标文件是哪些文件更新的。在定义好依赖关系后, 后续的那一行定义了如何生成目标文件的操作系统命令, 一定要以一个 Tab 键作为开头。记住, make 并不管命令是怎么工作的, 它只管执行所定义的命令。make 会比较 targets 文件和 prerequisites 文件的修改日期, 如果 prerequisites 文件的日期要比 targets 文件的日期要新, 或者 target 不存在的话, 那么, make 就会执行后续定义的命令。

这里要说明一点的是, clean 不是一个文件, 它只不过是一个动作名字, 有点像 C 语言中的 lable 一样, 其冒号后什么也没有, 那么, make 就不会自动去找文件的依赖性, 也就不会自动执行其后所定义的命令。要执行其后的命令, 就要在 make 命令后明显得指出这个lable 的名字。这样的方法非常有用, 我**们可以在一个 makefile 中定义不用的编译或是和编译无关的命令, 比如程序的打包, 程序的备份**, 等等

# ![](/images/recommend.png)(推荐)make命令工作原理
在默认的方式下, 也就是我们只输入 make 命令。那么, 
1. make 会在当前目录下找名字叫"Makefile"或"makefile"的文件。
2. 如果找到, 它会找文件中的**第一个目标文件(target)**, 在上面的例子中, 他会找到"edit"这个文件, 并把这个文件**作为最终的目标文件**。
3. 如果 **edit 文件不存在,** 或是 edit 所依赖的后面的 .o 文件的文件修改时间要比 edit这个文件**新**, 那么, 他就会执行后面所定义的命令**来生成 edit 这个文件**。
4. 如果 edit **所依赖的.o 文件不存在**, 那么 make 会在当前文件中找目标为.o 文件的依赖性, 如果找到则再**根据那一个规则生成.o 文件**。
5. 只要**.c文件和 .h文件是存在的**,  make 就会生成 .o 文件,  然后再用 .o 文件生成 make 的终极任务, 也就是执行文件 edit 了。

以上就是make的依赖性, make会**一层一层**去找依赖关系, 直到最终编译出第一个目标文件。
在找寻的过程中, 如果**出现错误**, 比如最后被依赖的文件找不到, 那么**make就会直接退出**, **并报错**, 而对于所定义的命令的错误, 或是编译不成功, make 根本不理, make 只管文件的依赖性, 即, 如果在我找了依赖关系之后, 冒号后面的文件还是不在, 那么对不起, 我就不工作啦。

通过上述分析, 我们知道, 像 clean 这种伪目标, 没有被第一个目标文件直接或间接关联, 那么它后面所定义的命令将不会被自动执行, 不过, 我们可以显示要 make 执行。即命令——"make clean", 以此来清除所有的目标文件, 以便重编译。

## 举个例子
于是在我们编程中, 如果这个工程**已被编译过**了, 
1. 当我们**修改了其中一个源文件**, 比如file.c, 那么根据我们的依赖性, 我们的目标 file.o 会被重编译(也就是在这个依性关系后面所定义的命令), 于是 file.o 的文件也是最新的啦, 于是 file.o 的文件修改时间要比edit要新, 所以 edit 也会被重新链接了。

2. 如果我们**改变了"command.h"**, 那么, kdb.o、command.o 和 files.o 都会被重编译, 并且, edit 会被重链接。

# ![](/images/recommend.png)(推荐)makefile使用变量

我们来看看 edit的生成规则
```makefile
edit : main.o kbd.o command.o display.o \
insert.o search.o files.o utils.o
    cc -o edit main.o kbd.o command.o display.o \
    insert.o search.o files.o utils.o
```

可以看到`.o`文件的字符串被重复写了两次, 当我们后续修改**依赖文件**的时候, 就要修改2次(加上clean, 就3次了); 虽说只要修改2次, 但多个地方要修改时, 就十分不方便, 不够灵活, 容易出错。

所以, 为了 makefile 的易维护, 在 makefile 中我们可以使用变量。

比如, 我们声明一个变量, 叫 objects, OBJECTS, objs, OBJS, obj, 或是 OBJ, 只要能够表示 obj 文件就行了。
我们在 makefile 一开始就这样定义:
```makefile
objects = main.o kbd.o command.o display.o \
            insert.o search.o files.o utils.o
```

于是, 我们就可以很方便地在我们的 makefile 中以"$(objects)"的方式来使用这个变量了, 于是我们的改良版 makefile 就变成下面这个样子:
```makefile
objects = main.o kbd.o command.o display.o \
            insert.o search.o files.o utils.o

edit : $(objects)
    cc -o edit $(objects)
main.o : main.c defs.h
    cc -c main.c
kbd.o : kbd.c defs.h command.h
    cc -c kbd.c
command.o : command.c defs.h command.h
    cc -c command.c
display.o : display.c defs.h buffer.h
    cc -c display.c
insert.o : insert.c defs.h buffer.h
    cc -c insert.c
search.o : search.c defs.h buffer.h
    cc -c search.c
files.o : files.c defs.h buffer.h command.h
    cc -c files.c
utils.o : utils.c defs.h
    cc -c utils.c
clean :
    rm edit $(objects)
```

之后只要有新的`.o`文件, 或者修改、删除某个`.o`文件, 就只需要修改`objects`这个变量就行了。

# ![](/images/recommend.png)(推荐)make 自动推导
对于`.o`文件, make可以把它对应的.c文件放到依赖文件prerequisites中, 并自动推导出`cc -c example.c`这条命令。
于是, 更简单的makefile版本如下:

```makefile
objects = main.o kbd.o command.o display.o \
            insert.o search.o files.o utils.o

edit : $(objects)
    cc -o edit $(objects)
main.o : defs.h
kbd.o : defs.h command.h
command.o : defs.h command.h
display.o : defs.h buffer.h
insert.o : defs.h buffer.h
search.o : defs.h buffer.h
files.o : defs.h buffer.h command.h
utils.o : defs.h

.PHONY : clean
clean :
    rm edit $(objects)
```

这种方法, 也就是 make 的**隐晦规则**。
上面文件内容中, **".PHONY"表示, clean是个伪目标文件**。

# 关于命令出错

每当命令运行完后, make会**检测每个命令的返回码**, 
- 如果命令返回成功, 那么make会执行下一条命令, 当前规则中所有的命令成功返回后, 这个规则就算是成功完成了
- 如果一个规则中的某个命令出错了(命令退出码非零), 那么make就会**终止执行当前规则**, 这将有可能**终止所有规则**的执行。 

**但是**
有些时候, 命令的出错并不表示就是错误的。
例如mkdir命令, 我们一定需要建立一个目录, 如果目录不存在, 那么mkdir就成功执行, 万事大吉;
如果目录存在, 那么就出错了。
我们之所以使用mkdir的意思就是一定要有这样的一个目录, 于是我们就不希望mkdir出错而终止规则的运行。 

## 忽略命令的错误
### 局部方法
为了做到这一点, 忽略命令的出错, 我们可以在Makefile的命令行前加一个**减号"-"(在Tab键之后)**, 标记为不管命令出不出错都认为是成功的。如： 
```makefile
clean:
    -rm -f *.o
```

### 全局方法
一个全局的办法是, 给`make`加上**`-i`或是`--ignore-errors`参数**, 那么, Makefile中所有命令都会忽略错误。

而如果一个规则是以`".IGNORE"`**作为目标**的, 那么这个规则中的所有命令将会忽略错误。这些是不同级别的防止命令出错的方法, 你可以根据你的不同喜欢设置。 

还有一个要提一下的make的参数的是`"-k"`或是`"--keep-going"`, 参数的意思是, 如果某规则中的命令出错了, 那么就终止该规则的执行, **但继续执行其它规则**。

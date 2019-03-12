---
title: vscode C/C++编译运行环境搭建
toc: true
comments: true
categories:
  - Vscode
  - C/C++配置
tags:
  - Vscode
  - C/C++配置
abbrlink: 7552b9cf
date: 2018-11-24 11:46:38
---

# 前言
本文将介绍**Vscode**`C/C++`编译运行环境的在`Windows`下的搭建, 共介绍**2种方案**
推荐使用前两种, 即可完成编译运行调试功能

1. 使用**Vscode**的`Tasks`功能来编译运行, 并使用`GDB`调试
2. 使用`CodeRunner`

# 环境配置

<!-- more -->

1. 安装**Vscode**

2. 安装`MinGW-w64`和`Clang`

[LLVM Download Page](http://releases.llvm.org/download.html) 在此页面下载Clang:
选**Pre-Built Binaries**中的**Clang for Windows (64-bit)**, 不需要下.sig文件

[MinGW-w64 - for 32 and 64 bit Windows](https://sourceforge.net/projects/mingw-w64/) 在此页面下载MinGW-w64

`LLVM`下载好了以后安装, 添加环境变量时：选**Add LLVM to the system PATH for all users**

`MinGW` 安装时, **Architecture**选**x86_64**, 装好以后把东西全部复制到Clang的文件夹里去, 它们会**无冲突合并**。

**PS:**
为什么既要装Clang又要装MinGW, 是因为Clang没有头文件。
如果你安装了其他IDE需要注意把其他的MinGW从环境变量中去掉; 也可以自己把它们的编译器设为Clang

3. 安装Vscode插件
通过Vscode的**扩展**搜索并下载以下两个插件
- **C/C++** (第一个方案需要)
- **Code Runner** (第二个方案需要)

4. 在`settings.json`中添加如下的配置:
```python
    "editor.formatOnType": true,
    "editor.snippetSuggestions": "top",
    "C_Cpp.clang_format_sortIncludes": true,
    "C_Cpp.errorSquiggles": "Disabled",
    "C_Cpp.autocomplete": "Disabled",
    "clang.cflags": [
        "--target=x86_64-w64-mingw",
        "-std=c11",
        "-Wall"
    ],
    "clang.cxxflags": [
        "--target=x86_64-w64-mingw",
        "-std=c++17",
        "-Wall"
    ],
```

# 方案一

## 使用 Vscode 优秀的 Tasks 功能启用编译运行命令

1. 打开C或者C/C++的工作区,  使用快捷键`ctrl`+`shift`+`p`, 键入`c/cpp: edit configurations`, 按`Enter`打开`c_cpp_properties.json`
将以下的内容**覆盖**到`c_cpp_properties.json`中

```python
{
    "configurations": [
        {
            "name": "MinGW",
            "includePath": [
                "${workspaceFolder}"
            ],
            "browse": {
                "path": [
                    "${workspaceFolder}"
                ],
                "limitSymbolsToIncludedHeaders": true,
                "databaseFilename": ""
            },
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE"
            ],
            "compilerPath": "E:/LLVM/bin/gcc.exe",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "clang-x64"
        }
    ],
    "version": 4
}
```

2. 使用快捷键`ctrl`+`shift`+`p`, 键入`tasks: configure task`, 按`Enter`打开`task.json`

将以下的内容**覆盖**到`task.json`中
```python
// https://code.visualstudio.com/docs/editor/tasks
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build", // 任务名称, 与launch.json的preLaunchTask相对应
            // 如果使用Clang编写C语言, 把command的值改成clang。
            // "command": "clang",      // 编译c语言
            // 如果使用MinGW, 编译C用gcc, 编译c++用g++, 并把-target和-fcolor那两条删去
            "command": "clang++", // 要使用的编译器
            "args": [
                "${file}",
                "-o", // 指定输出文件名, 不加该参数则默认输出a.exe, Linux下默认a.out
                "${fileDirname}/${fileBasenameNoExtension}.exe",
                "-g", // 生成和调试有关的信息
                "-Wall", // 开启额外警告
                "-static-libgcc", // 静态链接
                "-fcolor-diagnostics", // 彩色的错误信息？但貌似clang默认开启而gcc不接受此参数
                "--target=x86_64-w64-mingw", // clang的默认target为msvc, 不加这一条就会找不到头文件；Linux下去掉这一条
                "-std=c++17" // C语言最新标准为c11, 或根据自己的需要进行修改
            ], // 编译命令参数
            "windows": {
                "args": [
                    "${file}",
                    "-o", // 指定输出文件名, 不加该参数则默认输出a.exe, Linux下默认a.out
                    "${fileDirname}/${fileBasenameNoExtension}.exe",
                    "-g", // 生成和调试有关的信息
                    "-Wall", // 开启额外警告
                    "-static-libgcc", // 静态链接
                    "-fcolor-diagnostics", // 彩色的错误信息？但貌似clang默认开启而gcc不接受此参数
                    "--target=x86_64-w64-mingw", // clang的默认target为msvc, 不加这一条就会找不到头文件；Linux下去掉这一条
                    "-std=c++17" // C语言最新标准为c11, 或根据自己的需要进行修改
                ]
            },
            "presentation": {
                "echo": false,
                "reveal": "always", // 在“终端”中显示编译信息的策略, 可以为always, silent, never。具体参见VSC的文档
                "focus": true,     // 设为true后可以使执行task时焦点聚集在终端, 但对编译c和c++来说, 设为true没有意义
                "panel": "shared" // 不同的文件的编译信息共享一个终端面板
            },
            "problemMatcher": {
                "owner": "cpp",
                "fileLocation": "absolute",
                "pattern": {
                    "regexp": "^(.*):(\\d+):(\\d+):\\s+(error):\\s+(.*)$",
                    "file": 1,
                    "line": 2,
                    "column": 3,
                    "severity": 4,
                    "message": 5
                }
            }
        },
        {
            "label": "Run",
            "type": "shell",
            "dependsOn": "Build",
            "command": "${fileDirname}/${fileBasenameNoExtension}.o",
            "windows": {
                "command": "${fileDirname}/${fileBasenameNoExtension}.exe"
            },
            "args": [],
            "presentation": {
                "reveal": "always",
                "focus": true
            },
            "problemMatcher": [],
            "group": {
                "kind": "test",
                "isDefault": true
            }
        }
    ]
}
```
这个json里写了两个配置, 一个`Build`, 一个`Run`。

- `Build` 配置：
    - `"command"` 选编译器用的。写 C++ 就填 `clang++` , 写 C 就填 `clang` 
    - `"args"` 编译参数。像是`${fileDirname}`和 `${fileBasenameNoExtension}`之类的是VS Code的**预定义变量**, 详见 [Variables Reference](https://code.visualstudio.com/docs/editor/variables-reference)。
    - `"presentation"`详见[ Tasks - Output behavior](https://code.visualstudio.com/docs/editor/tasks#_output-behavior) 。
    - `"reveal"` 控制内置终端面板是否跳出到前端。
    - `"focus"` 焦点是否跳到面板。
    - `"echo"`控制执行的命令是否输出。
    - `"problemMatcher"`就 C 语言来说, 功能是将编译器输出的错误捕捉到VS Code的** Problem Panel** 上, 这个面板上的错误并不会及时更新, 每编译一次就更新一次。详见 [Tasks - problem-matchers](https://code.visualstudio.com/docs/editor/tasks#_processing-task-output-with-problem-matchers)。

- `Run` 配置：
    - `"dependsOn"`先运行哪个任务, 这里就是先运行 `Build` 任务（先编译后运行）。
    - `"group"`设置组, 这里设置为默认的test组。详见 [Tasks - custom-tasks](https://code.visualstudio.com/docs/editor/tasks#_custom-tasks)。

键位绑定
到窗口左下角点齿轮再点 「键盘快捷方式」
![](/images/2018-11-24-15-19-11.png)

设置成`alt`+`f2`, 后续就可以使用这个快捷键来运行`c/c++`代码了
![](/images/2018-11-24-15-19-38.png)

## 配置GDB进行调试

因为安装了`c/c++`插件, 所以按`f5`即可进行调试

需配置`launch.json`
使用快捷键`ctrl`+`shift`+`p`, 键入`debug: open launch.json`, 按`Enter`打开`launch.json`

将以下的内容**覆盖**到`launch.json`中
```python
// https://github.com/Microsoft/vscode-cpptools/blob/master/launch.md
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) Launch", // 配置名称，将会在启动配置的下拉菜单中显示
            "type": "cppdbg",       // 配置类型，这里只能为cppdbg
            "request": "launch",    // 请求配置类型，可以为launch（启动）或attach（附加）
            "program": "${fileDirname}/${fileBasenameNoExtension}.o",   // 将要进行调试的程序的路径
            // "program": "${fileDirname}/${fileBasenameNoExtension}.exe", 
            "args": [],             // 程序调试时传递给程序的命令行参数，一般设为空即可
            "stopAtEntry": true,   // 设为true时程序将暂停在程序入口处，我一般设置为true
            "cwd": "${workspaceFolder}", // 调试程序时的工作目录
            "environment": [],     
            //"externalConsole": true,    // 调试时是否显示控制台窗口，一般设置为true显示控制台
            "internalConsoleOptions": "neverOpen", // 如果不设为neverOpen，调试时会跳到“调试控制台”选项卡，你应该不需要对gdb手动输命令吧？
            "MIMode": "gdb",        // 指定连接的调试器，可以为gdb或lldb。但目前lldb在windows下没有预编译好的版本。
            "windows": {
                "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
                "miDebuggerPath": "E:/LLVM/bin/gdb.exe" // 调试器路径，Windows下后缀不能省略
            },
            "setupCommands": [      
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "Build" // 调试会话开始前执行的任务，一般为编译程序。与tasks.json的label相对应
        }
    ]
}
```

- 配置简要说明：
    - 注意`"windows"`:下的 `"miDebuggerPath"`。要将其中的路径改为**本机的GDB路径**, 放在了前文**合并后的clang**的**bin目录**下。
    - `"preLaunchTask"` 运行调试前先运行某个任务，这个`Build`任务就是前面`tasks.josn`里的那个。


# 方案二

使用**code runner**(**不推荐**)

**缺陷:**
1. 不能进行调试
2. 终端输入会溢出到程序外

**使用:**
安装完**Code Runner**插件后, 在`settings.json`添加如下的配置: 
```python
"code-runner.runInTerminal": true,
"code-runner.executorMap": {
    "javascript": "node",
    "java": "cd $dir && javac \"$fileName\" && java \"$fileNameWithoutExt\"",
    "c": "cd $dir && clang \"$fileName\" -o \"$fileNameWithoutExt.exe\" -Wall -g -Og -static-libgcc -fcolor-diagnostics --target=x86_64-w64-mingw -std=c11 && &\"$dir$fileNameWithoutExt\"",
    "cpp": "cd $dir && clang++ \"$fileName\" -o \"$fileNameWithoutExt.exe\" -Wall -g -Og -static-libgcc -fcolor-diagnostics --target=x86_64-w64-mingw -std=c++17 && &\"$dir$fileNameWithoutExt\"",
    "objective-c": "cd $dir && gcc -framework Cocoa \"$fileName\" -o $fileNameWithoutExt && &\"$dir$fileNameWithoutExt\"",
    "php": "php",
    "python": "python -u",
    "perl": "perl",
    "perl6": "perl6",
    "ruby": "ruby",
    "go": "go run",
    "lua": "lua",
    "groovy": "groovy",
    "powershell": "powershell -ExecutionPolicy ByPass -File",
    "bat": "cmd /c",
    "shellscript": "bash",
    "fsharp": "fsi",
    "csharp": "scriptcs",
    "vbscript": "cscript //Nologo",
    "typescript": "ts-node",
    "coffeescript": "coffee",
    "scala": "scala",
    "swift": "swift",
    "julia": "julia",
    "crystal": "crystal",
    "ocaml": "ocaml",
    "r": "Rscript",
    "applescript": "osascript",
    "clojure": "lein exec",
    "haxe": "haxe --cwd $dirWithoutTrailingSlash --run $fileNameWithoutExt",
    "rust": "cd $dir && rustc \"$fileName\" && &\"$dir$fileNameWithoutExt\"",
    "racket": "racket",
    "ahk": "autohotkey",
    "autoit": "autoit3",
    "dart": "dart",
    "pascal": "cd $dir && fpc \"$fileName\" && &\"$dir$fileNameWithoutExt\"",
    "d": "cd $dir && dmd \"$fileName\" && &\"$dir$fileNameWithoutExt\"",
    "haskell": "runhaskell",
    "nim": "nim compile --verbosity:0 --hints:off --run"
},
"code-runner.saveFileBeforeRun": true,
"code-runner.preserveFocus": true,
"code-runner.ignoreSelection": true
```

然后使用`ctrl`+`alt`+`n`即可运行代码

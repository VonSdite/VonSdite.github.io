---
title: Python 提升python速度
toc: true
comments: true
categories:
  - Python
  - Cython
tags:
  - Python
  - Cython
abbrlink: 2a5aa04e
date: 2018-12-08 20:25:14
---

# 前言
可以使用 **Cython**, **PyPy**提升 python的速度

<!-- more -->

# Cython
**Cython**是让Python脚本**支持C语言扩展**的编译器, Cython能够将Python+C混合编码的.pyx脚本转换为C代码, 主要用于优化Python脚本性能或Python调用C函数库。由于Python固有的性能差的问题, 用C扩展Python成为提高Python性能常用方法, Cython算是较为常见的一种扩展方式。

推荐文章: 
https://www.jianshu.com/p/fc5025094912
https://www.cnblogs.com/yafengabc/p/6130849.html
https://baijiahao.baidu.com/s?id=1606135207446878267&wfr=spider&for=pc
https://baijiahao.baidu.com/s?id=1606135207446878267&wfr=spider&for=pc

# CPython 与 PyPy
CPython: 是用**C语言实现Python**, 是目前应用最广泛的解释器。最新的语言特性都是在这个上面先实现的, 基本包含了所有第三方库支持, 但是CPython有几个缺陷, 一是全局锁使Python在多线程效能上表现不佳, 二是CPython无法支持JIT（即时编译）, 导致其执行速度不及Java和Javascipt等语言。于是出现了Pypy。

Pypy: 是用**Python自身实现的解释器**。针对CPython的缺点进行了各方面的改良, 性能得到很大的提升。最重要的一点就是Pypy集成了JIT。但是, Pypy无法支持官方的C/Python API, 导致无法使用例如Numpy, Scipy等重要的第三方库。这也是现在Pypy没有被广泛使用的原因吧。

## PyPy与CPython的不同
- CPython是使用解释执行的方式, 这样的实现方式在性能上是很凄惨的。
- 而PyPy使用了JIT(即时编译)技术, 在性能上得到了提升。

## Python的解释器:

1. 由于Python是动态编译的语言, 和C/C++、Java或者Kotlin等静态语言不同, 它是在运行时一句一句代码地边编译边执行的, 而Java是提前将高级语言编译成了JVM字节码, 运行时直接通过JVM和机器打交道, 所以进行密集计算时运行速度远高于动态编译语言。 

2. PyPy, 它使用了JIT（即时编译）技术, 混合了动态编译和静态编译的特性, **仍然是一句一句编译源代码**, 但是会将翻译过的代码缓存起来以降低性能损耗。相对于静态编译代码, 即时编译的代码可以处理延迟绑定并增强安全性。绝大部分 Python代码都可以在PyPy下运行, 但是PyPy和CPython有一些是不同的。


# 一个速度比较例子

使用**C++**和**Python**分别实现目录大小计算的算法。
其中的要求是:
- 计算**单个**目录大小, 返回一个**数值**
- 计算**目录及目录下所有子目录**大小, 返回一个**map表**

## 结果比较

### Python的运行结果
![](/images/2018-12-09-11-59-04.png)
![](/images/2018-12-09-12-01-01.png)
单纯看Python的结果, 可以看出来**线程池**的优化大大提高了递归计算的速度, 将近提升了**10倍**的效率

### C++的运行结果
![](/images/2018-12-09-12-13-14.png)
通过比较**单个目录大小**计算, C++比Python快了近**5.6倍**
而**计算所有目录大小**, C++比Python快了近**5.6倍**

### 说明
**线程池**的池子大小设为**5**。
计算的目录都是`E:\1Code\Repositories`, **5.8G的大小**
为了避免**全局线程池**影响到其他函数的运行效率, 线程池实现的方法 **单独运行**
两者的实现算法都是**一致**的

#### Python实现了**4种**方法
- 第一种是使用`os.walk`的生成器来遍历计算单个目录大小, 名为`get_dir_size`
- 第二种是**递归计算**单个目录大小, 名为`get_dir_size_recursive`
- 第三种是**递归计算**目录及目录下所有子目录大小, 名为`get_all_dir_size`
- 第四种是**线程池**+**递归计算**目录及目录下所有子目录大小, 名为`get_all_dir_size_thread`

#### C++实现了**2种**方法
- 第一种是**递归计算**单个目录大小, 名为`SimpleGetDirectorySizeRecursive`
- 第二种是**递归计算**目录及目录下所有子目录大小, 名为`SimpleGetDirectorySize`


## Python的实现
```python
import os
import timeit
import threading
import threadpool
from os.path import join, getsize, isdir, isfile

# os.walk加列表推导式求单个目录的大小
def get_dir_size(dir):
    size = 0
    for root, dirs, files in os.walk(dir):
        size += sum([getsize(join(root, name)) for name in files])
    return size

# 递归求单个目录的大小
def get_dir_size_recursive(dir):
    size = 0
    for f in os.listdir(dir):
        ff = join(dir, f)
        if isdir(ff):
            size += get_dir_size_recursive(ff)
        elif isfile(ff):
            size += getsize(ff)
    return size

# 去掉目录中的 `:` `\` `/`
def clear_path_format(dir):
    return dir.replace(':', '').replace('\\', '').replace('/', '')

# 递归求目录及所有子目录的大小
dir_dict = dict()
def get_all_dir_size(parent_dirs, dir):
    dir_dict[clear_path_format(dir)] = 0
    size = 0
    parent_dirs.append(clear_path_format(dir))

    for f in os.listdir(dir):
        ff = join(dir, f)
        if isdir(ff):
            get_all_dir_size(parent_dirs, ff)
        elif isfile(ff):
            size += getsize(ff)
    
    if size > 0:
        for path in parent_dirs:
            dir_dict[path] += size

dir_dict_thread = dict()
pool = threadpool.ThreadPool(5)
mutex = threading.Lock()
def get_all_dir_size_thread(parent_dirs, dir):
    size = 0
    parent_dirs.append(clear_path_format(dir))
    for f in os.listdir(dir):
        ff = join(dir, f)
        if isdir(ff):
            mutex.acquire()
            pool.putRequest(
                        threadpool.makeRequests(
                            get_all_dir_size_thread,
                            [
                                (
                                    (parent_dirs.copy(), ff),
                                    None
                                )
                            ]
                        )[0]
                    )
            mutex.release()
        elif isfile(ff):
            size += getsize(ff)

    if size > 0:
        mutex.acquire()
        for path in parent_dirs:
            dir_dict_thread.setdefault(path, 0)
            dir_dict_thread[path] += size
        mutex.release()



if __name__ == "__main__":
    dir = r'E:\1Code\Repositories'
    print('Test "%s" size   ////// just python' %  dir)

    start = timeit.default_timer()
    size = get_dir_size(dir)
    end = timeit.default_timer()
    print('get_dir_size:            %fGB-> use time: %fs' % (size / (1 << 30), end-start))

    start = timeit.default_timer()
    size = get_dir_size_recursive(dir)
    end = timeit.default_timer()
    print('get_dir_size_recursive:  %fGB -> use time: %fs' % (size / (1 << 30), end - start))

    start = timeit.default_timer()
    get_all_dir_size([], dir)
    end = timeit.default_timer()
    print('get_all_dir_size:        %fGB -> use time: %fs' % (dir_dict[clear_path_format(dir)] / (1 << 30), end - start))

    start = timeit.default_timer()
    get_all_dir_size_thread([], dir)
    pool.wait()
    end = timeit.default_timer()
    print('get_all_dir_size_thread: %fGB -> use time: %fs' % (dir_dict_thread[clear_path_format(dir)] / (1 << 30), end - start))
```

## C++的实现
```C++
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <set>
#include <unordered_map>
#include <windows.h>
#include <time.h>

using namespace std;

#ifdef UNICODE
typedef wstring tstring;

#else
typedef string tstring;

#endif

#define POOL_SIZE 5

unordered_map<tstring, ULONGLONG> mapDirSize_simple;	// 递归的map表

// 根据文件的高32位和低32位求出文件的大小
ULONGLONG GetFileSize(ULONGLONG high, ULONGLONG low)
{
	return ((high << 32) | low);
}

// 去掉中所有的 "/"  "\" ":" 
tstring ClearPathFormat(tstring path)
{
	size_t pos = 0;
	tstring clear1 = TEXT("/");
	tstring clear2 = TEXT("\\");
	tstring clear3 = TEXT(":");

	while ((pos = path.find(clear1)) != tstring::npos)
	{
		path.replace(pos, clear1.length(), "");
	}

	while ((pos = path.find(clear2)) != tstring::npos)
	{
		path.replace(pos, clear2.length(), "");
	}

	while ((pos = path.find(clear3)) != tstring::npos)
	{
		path.replace(pos, clear3.length(), "");
	}

	return path;
}

// 简单递归得目录大小
ULONGLONG SimpleGetDirectorySize(vector<tstring> vecParentPath, tstring lpDirName)
{
	ULONGLONG nDirSize = 0;			// 文件夹大小
	tstring strDirName = lpDirName;
	strDirName += TEXT("/*.*");			// 目录名字

	HANDLE hFile;
	WIN32_FIND_DATA pNextInfo;
	hFile = FindFirstFile(strDirName.c_str(), &pNextInfo);
	if (INVALID_HANDLE_VALUE == hFile)
		return 0;
	
	vecParentPath.push_back(ClearPathFormat(lpDirName));
	while (FindNextFile(hFile, &pNextInfo))
	{
		// 跳过 "." ".." 两个目录
		if (!strcmp(pNextInfo.cFileName, ".") || !strcmp(pNextInfo.cFileName, ".."))
			continue;

		if (pNextInfo.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
		{	// 目录, 递归下去加
			tstring strTmp = lpDirName;
			strTmp += TEXT("/");
			strTmp += pNextInfo.cFileName;
			SimpleGetDirectorySize(vecParentPath, strTmp.c_str());
		}
		else
		{	// 文件
			nDirSize += GetFileSize(pNextInfo.nFileSizeHigh, pNextInfo.nFileSizeLow);
		}
	}

	if (nDirSize)
	{
		for (auto parent : vecParentPath)
		{
			mapDirSize_simple[parent] += nDirSize;
		}
	}
	return mapDirSize_simple[ClearPathFormat(lpDirName)];
}

// 递归得单个目录大小
ULONGLONG SimpleGetDirectorySizeRecursive(LPCSTR lpDirName)
{
	ULONGLONG nDirSize = 0;				// 文件夹大小
	TCHAR strDirName[1000];
	memset(strDirName, 0, sizeof(strDirName));
	memcpy(strDirName, lpDirName, strlen(lpDirName));
	strcat(strDirName, TEXT("/*.*"));

	HANDLE hFile;
	WIN32_FIND_DATA pNextInfo;
	hFile = FindFirstFile(strDirName, &pNextInfo);
	if (INVALID_HANDLE_VALUE == hFile)
		return 0;

	while (FindNextFile(hFile, &pNextInfo))
	{
		// 跳过 "." ".." 两个目录
		if (!strcmp(pNextInfo.cFileName, ".") || !strcmp(pNextInfo.cFileName, ".."))
			continue;

		if (pNextInfo.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
		{	// 目录, 递归下去加
			TCHAR strTmp[1000];
			memset(strTmp, 0, sizeof(strTmp));
			memcpy(strTmp, lpDirName, strlen(lpDirName));
			strcat(strTmp, TEXT("/"));
			strcat(strTmp, pNextInfo.cFileName);
			nDirSize += SimpleGetDirectorySizeRecursive(strTmp);
		}
		else
		{	// 文件
			nDirSize += GetFileSize(pNextInfo.nFileSizeHigh, pNextInfo.nFileSizeLow);
		}
	}

	return nDirSize;
}


int main()
{
	tstring strDirName = TEXT("E:\\1Code\\Repositories");

	LARGE_INTEGER t1, t2, tc;

	// 递归计算单个目录大小
	QueryPerformanceFrequency(&tc);
	QueryPerformanceCounter(&t1);
	cout << strDirName << " size: " << (double)SimpleGetDirectorySizeRecursive(strDirName.c_str()) / (1 << 30) << "GB" << endl;
	QueryPerformanceCounter(&t2);
	printf("Use Time:%fs\n", (t2.QuadPart - t1.QuadPart)*1.0 / tc.QuadPart);

	// 递归计算目录大小
	QueryPerformanceFrequency(&tc);
	QueryPerformanceCounter(&t1);
	vector<tstring> vecEmpty;
	cout << strDirName << " size: "<< (double)SimpleGetDirectorySize(vecEmpty, strDirName.c_str()) / (1 << 30) << "GB" << endl;
	QueryPerformanceCounter(&t2);
	printf("Use Time:%fs\n", (t2.QuadPart - t1.QuadPart)*1.0 / tc.QuadPart);
	
	return 0;
}
```

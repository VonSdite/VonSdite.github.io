---
title: C/C++ 各种计时函数比较
toc: true
comments: true
abbrlink: 18ab89cc
date: 2018-12-03 15:10:28
categories:
    - C/C++
tags:
    - C/C++
---

# 前言
目前有各种计时函数, 
1. 一般的处理都是先调用计时函数, 记下当前时间`start`
2. 然后运行自己的代码
3. 再调用计时函数, 记下处理后的时间`end`
4. 再`end`和`start`做差, 就可以得到程序的执行时间

但是各种计时函数的**精度不一样**.

序号 | 函数 | 类型 | 精度级别 | 时间
---|----|----|------|---
1 | [time](/posts/18ab89cc.html#time) | C系统调用 | 低 | <1s
2 | [clcok](/posts/18ab89cc.html#clock) ![](/images/recommend.png)_windows, linux均可用, 推荐_ | C系统调用 | 低 | <10ms
3 | [timeGetTime](/posts/18ab89cc.html#timeGetTime) | Windows API | 中 | <1ms
4 | [QueryPerformanceCounter](/posts/18ab89cc.html#QueryPerformanceCounter) ![](/images/recommend.png)_windows下最好的方法_ | Windows API | 高 | <0.1ms
5 | [GetTickCount](/posts/18ab89cc.html#GetTickCount) | Windows API | 中 | <1ms
6 | [RDTSC](/posts/18ab89cc.html#RDTSC) (实际不可用) | 指令 | 高 | <0.1ms
7 | [gettimeofday](/posts/18ab89cc.html#gettimeofday) ![](/images/recommend.png)_linux下最好的方法_ | linux环境下C系统调用 | 高 | <0.1ms

<!-- more -->

# time
`time()`获取当前的系统时间, 返回的结果是一个`time_t`类型, 其值表示从"`CUT(Coordinated Universal Time)`时间1970年1月1日00:00:00(称为UNIX系统的Epoch时间)"到"当前时刻的**秒数**". 

**精度**: 低, <1s

调用Sleep(50), 让程序暂停50ms, 测得运行时间为 0ms, 表明精度的低
![](/images/2018-12-04-11-41-53.png)

```c++
#include <time.h>
#define SLEEP_TIME 50

// test time()
void TestTime()
{
	time_t start, end;
	start = time(NULL);
	Sleep(50);
	end = time(NULL);
    cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << "Test time(): " << (end - start) * 1000 << "ms" << endl;
}
```

# clock
`clock()`函数返回从"开启这个程序进程"到"程序中调用`clock()`函数"时之间的**CPU时钟计时单元(clock tick)数**, 在MSDN中称之为**挂钟时间(wal-clock)**
常量`CLOCKS_PER_SEC`, 它用来表示一秒钟会有多少个时钟计时单元

**精度**: 低, <10ms
![](/images/2018-12-04-11-47-52.png)
```c++
#include <time.h>
#define SLEEP_TIME 50

// test clock()
void TestClock()
{
	clock_t start, end;
	start = clock();
	Sleep(50);
	end = clock();
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed  << setprecision(17) << "Test clock(): " << ((double)end - start) / CLOCKS_PER_SEC * 1000 << "ms" << endl;
}
```

# timeGetTime
`timeGetTime()`函数以**毫秒级**的系统时间. 该时间为从系统开启算起所经过的时间, 是`windows api`

**精度**: 中, <1ms
![](/images/2018-12-04-11-53-59.png)
```C++
#include <windows.h>
#define SLEEP_TIME 50
#pragma comment( lib,"winmm.lib" )

// test timeGetTime()
void TestTimeGetTime()
{
	DWORD start, end;
	start = timeGetTime();
	Sleep(50);
	end = timeGetTime();
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed << setprecision(17) << "Test timeGetTime(): " << ((double)end - start) / 1000 * 1000 << "ms" << endl;
}
```

# QueryPerformanceCounter
`QueryPerformanceCounter()`这个函数返回高精确度性能计数器的值, 它可以以**微秒**为单位计时. 但是`QueryPerformanceCounter()`确切的精确计时的最小单位是与系统有关的, 所以, 必须要查询系统以得到`QueryPerformanceCounter()`返回的嘀哒声的频率. `QueryPerformanceFrequency()`提供了这个频率值, 返回每秒嘀哒声的个数.

**精度:** 高, <0.1ms
![](/images/2018-12-04-14-07-14.png)
```C++
#include <windows.h>
#define SLEEP_TIME 50

// test QueryPerformanceCounter()
void TestQueryPerformanceCounter()
{
	LARGE_INTEGER start, end, tc;
	QueryPerformanceFrequency(&tc);
	QueryPerformanceCounter(&start);
	Sleep(50);
	QueryPerformanceCounter(&end);
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed << setprecision(17) << "Test QueryPerformanceCounter(): " << ((double)end.QuadPart - start.QuadPart) / tc.QuadPart * 1000 << "ms" << endl;
}
```

# GetTickCount
`GetTickCount()`返回(retrieve)从操作系统启动到现在所经过(elapsed)的**毫秒数**, 它的返回值是DWORD

**精度:** 中, <1ms
![](/images/2018-12-04-14-11-43.png)
```c++
#include <windows.h>
#define SLEEP_TIME 50

// test GetTickCount()
void TestGetTickCount()
{
	DWORD start, end;
	start = GetTickCount();
	Sleep(50);
	end = GetTickCount();
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed << setprecision(17) << "Test GetTickCount(): " << ((double)end - start) / 1000 * 1000 << "ms" << endl;
}
```

# RDTSC
`RDTSC`指令, 在**Intel Pentium**以上级别的CPU中, 有一个称为"时间戳(Time Stamp)"的部件, 它以64位无符号整型数的格式, 记录了自CPU上电以来所经过的时钟周期数。由于目前的**CPU主频都非常高**, 因此这个部件可以达到**纳秒级**的计时精度。这个精确性是上述几种方法所无法比拟的. 在Pentium以上的CPU中, 提供了一条机器指令RDTSC(Read Time Stamp Counter)来读取这个时间戳的数字, 并将其保存在EDX:EAX寄存器对中. 由于EDX:EAX寄存器对恰好是Win32平台下C++语言保存函数返回值的寄存器, 所以我们可以把这条指令看成是一个普通的函数调用, 因为RDTSC不被C++的内嵌汇编器直接支持, 所以我们要用_emit伪指令直接嵌入该指令的机器码形式0X0F、0X31

## 然而真相
多核时代**不宜再用** x86 的 RDTSC 指令测试指令周期和时间
1. **不能保证**同一块主板上每个核的 TSC 是同步的；
2. CPU 的**时钟频率可能变化**, 例如笔记本电脑的节能功能；
3. **乱序执行**导致 RDTSC 测得的周期数不准, 这个问题从 Pentium Pro 时代就存在。

```C++
#define SLEEP_TIME 50
// test RDTSC
// 多核时代不宜再用 x86 的 RDTSC 指令测试指令周期和时间
// 1. 不能保证同一块主板上每个核的 TSC 是同步的；
// 2. CPU 的时钟频率可能变化, 例如笔记本电脑的节能功能；
// 3. 乱序执行导致 RDTSC 测得的周期数不准, 这个问题从 Pentium Pro 时代就存在。

inline unsigned __int64 GetCycleCount()
{
	__asm
	{
		_emit 0x3F;
		_emit 0x31;
	}
}

// 我的CPU频率
#define FREQUENCY (2.6*(1<<30))  
void TestRDTSC()
{
	unsigned __int64 start, end;
	start = GetCycleCount();
	Sleep(50);
	end = GetCycleCount();
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed << setprecision(17) << "Test RDTSC(): " << ((double)end - start) / FREQUENCY * 1000 << "ms" << endl;
}
```

# gettimeofday
`gettimeofday()` linux环境下的计时函数, `int gettimeofday(struct timeval* tv , struct timezone* tz)`, `gettimeofday()`会把目前的时间有`tv`所指的结构返回, 当地时区的信息则放到`tz`所指的结构中.

**精度:** 高, <0.1ms

```C++
#define SLEEP_TIME 50

// test gettimeofday()

// timeval结构定义为:
struct timeval {
	long tv_sec;  // 秒
	long tv_usec; // 微秒
};

//timezone 结构定义为:
struct timezone {
	int tz_minuteswest; // 和Greenwich 时间差了多少分钟
	int tz_dsttime;		// 日光节约时间的状态
};

void TestGetTimeOfDay()
{
	timeval start, end;
	double timeuse;
	gettimeofday(&start, NULL);
    Sleep(50);
	gettimefoday(&end, NULL);
	timeuse = end.tv_sec - start.tv_sec + (end.tv_usec - start.tv_usec) / 50000.0;
	cout << "Sleep(" << SLEEP_TIME << ") :" << endl;
	cout << fixed << setprecision(17) << "Test gettimeofday(): " << timeuse * 1000 << "ms" << endl;
}
```


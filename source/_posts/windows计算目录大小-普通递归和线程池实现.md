---
title: windows计算目录大小 递归和线程池两种实现
toc: true
comments: true
categories:
  - C/C++
abbrlink: 62aadf3b
date: 2018-12-03 14:36:08
tags:
  - C/C++
---

# 前言
windows下文件夹目录大小没有直接获取的方法，一般直接使用**递归**的方式来计算，或者使用**多线程**提高并发度计算。

以下举的例子是**计算目标目录大小以及目标目录下所有子目录大小**的例子, 不是计算**单一目录**大小的例子

`ThreadPool.h`的实现来源于: https://github.com/log4cplus/Threadpool

<!-- more -->

# 效果比较
**PS:** 输出的上部分是递归方式, 下部分是线程池方式

线程池的池大小为1时, 耗时略多于普通递归(因为线程的一些额外开销)
![](/images/2018-12-03-14-58-18.png)

池的大小适当增大, 可以有效的提高效率(但池过于大, 也会造成效率降低)
![](/images/2018-12-03-14-58-27.png)![](/images/2018-12-03-15-01-24.png)![](/images/2018-12-03-15-01-30.png)![](/images/2018-12-03-15-01-36.png)![](/images/2018-12-03-15-01-42.png)

# 实现的代码

`ThreadPool.h`
<details><summary>展开代码</summary>```c++
// -*- C++ -*-
// Copyright (c) 2012-2015 Jakob Progsch
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
//    1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
//
//    2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
//
//    3. This notice may not be removed or altered from any source
//    distribution.
//
// Modified for log4cplus, copyright (c) 2014-2015 Václav Zeman.

#ifndef THREAD_POOL_H_7ea1ee6b_4f17_4c09_b76b_3d44e102400c
#define THREAD_POOL_H_7ea1ee6b_4f17_4c09_b76b_3d44e102400c

#include <vector>
#include <queue>
#include <memory>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <future>
#include <atomic>
#include <functional>
#include <stdexcept>
#include <algorithm>
#include <cassert>

class ThreadPool {
public:
	explicit ThreadPool(std::size_t threads
		= (std::max)(2u, std::thread::hardware_concurrency()));
	template<class F, class... Args>
	auto enqueue(F&& f, Args&&... args)
		->std::future<typename std::result_of<F(Args...)>::type>;
	void wait_until_empty();
	void wait_until_nothing_in_flight();
	void set_queue_size_limit(std::size_t limit);
	void set_pool_size(std::size_t limit);
	~ThreadPool();

private:
	void emplace_back_worker(std::size_t worker_number);

	// need to keep track of threads so we can join them
	std::vector< std::thread > workers;
	// target pool size
	std::size_t pool_size;
	// the task queue
	std::queue< std::function<void()> > tasks;
	// queue length limit
	std::size_t max_queue_size = 100000;
	// stop signal
	bool stop = false;

	// synchronization
	std::mutex queue_mutex;
	std::condition_variable condition_producers;
	std::condition_variable condition_consumers;

	std::mutex in_flight_mutex;
	std::condition_variable in_flight_condition;
	std::atomic<std::size_t> in_flight;

	struct handle_in_flight_decrement
	{
		ThreadPool & tp;

		handle_in_flight_decrement(ThreadPool & tp_)
			: tp(tp_)
		{ }

		~handle_in_flight_decrement()
		{
			std::size_t prev
				= std::atomic_fetch_sub_explicit(&tp.in_flight,
					std::size_t(1),
					std::memory_order_acq_rel);
			if (prev == 1)
			{
				std::unique_lock<std::mutex> guard(tp.in_flight_mutex);
				tp.in_flight_condition.notify_all();
			}
		}
	};
};

// the constructor just launches some amount of workers
inline ThreadPool::ThreadPool(std::size_t threads)
	: pool_size(threads)
	, in_flight(0)
{
	for (std::size_t i = 0; i != threads; ++i)
		emplace_back_worker(i);
}

// add new work item to the pool
template<class F, class... Args>
auto ThreadPool::enqueue(F&& f, Args&&... args)
	-> std::future<typename std::result_of<F(Args...)>::type>
{
	using return_type = typename std::result_of<F(Args...)>::type;

	auto task = std::make_shared< std::packaged_task<return_type()> >(
		std::bind(std::forward<F>(f), std::forward<Args>(args)...)
		);

	std::future<return_type> res = task->get_future();

	std::unique_lock<std::mutex> lock(queue_mutex);
	if (tasks.size() >= max_queue_size)
		// wait for the queue to empty or be stopped
		condition_producers.wait(lock,
			[this]
	{
		return tasks.size() < max_queue_size
			|| stop;
	});

	// don't allow enqueueing after stopping the pool
	if (stop)
		throw std::runtime_error("enqueue on stopped ThreadPool");

	tasks.emplace([task]() { (*task)(); });
	std::atomic_fetch_add_explicit(&in_flight,
		std::size_t(1),
		std::memory_order_relaxed);
	condition_consumers.notify_one();

	return res;
}


// the destructor joins all threads
inline ThreadPool::~ThreadPool()
{
	std::unique_lock<std::mutex> lock(queue_mutex);
	stop = true;
	condition_consumers.notify_all();
	condition_producers.notify_all();
	pool_size = 0;
	condition_consumers.wait(lock, [this] { return this->workers.empty(); });
	assert(in_flight == 0);
}

inline void ThreadPool::wait_until_empty()
{
	std::unique_lock<std::mutex> lock(this->queue_mutex);
	this->condition_producers.wait(lock,
		[this] { return this->tasks.empty(); });
}

inline void ThreadPool::wait_until_nothing_in_flight()
{
	std::unique_lock<std::mutex> lock(this->in_flight_mutex);
	this->in_flight_condition.wait(lock,
		[this] { return this->in_flight == 0; });
}

inline void ThreadPool::set_queue_size_limit(std::size_t limit)
{
	std::unique_lock<std::mutex> lock(this->queue_mutex);

	if (stop)
		return;

	std::size_t const old_limit = max_queue_size;
	max_queue_size = (std::max)(limit, std::size_t(1));
	if (old_limit < max_queue_size)
		condition_producers.notify_all();
}

inline void ThreadPool::set_pool_size(std::size_t limit)
{
	if (limit < 1)
		limit = 1;

	std::unique_lock<std::mutex> lock(this->queue_mutex);

	if (stop)
		return;

	pool_size = limit;
	std::size_t const old_size = this->workers.size();
	if (pool_size > old_size)
	{
		// create new worker threads
		for (std::size_t i = old_size; i != pool_size; ++i)
			emplace_back_worker(i);
	}
	else if (pool_size < old_size)
		// notify all worker threads to start downsizing
		this->condition_consumers.notify_all();
}

inline void ThreadPool::emplace_back_worker(std::size_t worker_number)
{
	workers.emplace_back(
		[this, worker_number]
	{
		for (;;)
		{
			std::function<void()> task;
			bool notify;

			{
				std::unique_lock<std::mutex> lock(this->queue_mutex);
				this->condition_consumers.wait(lock,
					[this, worker_number] {
					return this->stop || !this->tasks.empty()
						|| pool_size < worker_number + 1; });

				// deal with downsizing of thread pool or shutdown
				if ((this->stop && this->tasks.empty())
					|| (!this->stop && pool_size < worker_number + 1))
				{
					std::thread & last_thread = this->workers.back();
					std::thread::id this_id = std::this_thread::get_id();
					if (this_id == last_thread.get_id())
					{
						// highest number thread exits, resizes the workers
						// vector, and notifies others
						last_thread.detach();
						this->workers.pop_back();
						this->condition_consumers.notify_all();
						return;
					}
					else
						continue;
				}
				else if (!this->tasks.empty())
				{
					task = std::move(this->tasks.front());
					this->tasks.pop();
					notify = this->tasks.size() + 1 == max_queue_size
						|| this->tasks.empty();
				}
				else
					continue;
			}

			handle_in_flight_decrement guard(*this);

			if (notify)
			{
				std::unique_lock<std::mutex> lock(this->queue_mutex);
				condition_producers.notify_all();
			}

			task();
		}
	}
	);
}

#endif // THREAD_POOL_H_7ea1ee6b_4f17_4c09_b76b_3d44e102400c
```
</details>

`GetDirectorySize.cpp`
<details><summary>展开代码</summary>```C++
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <set>
#include <unordered_map>
#include <mutex>
#include <windows.h>
#include <time.h>
#include "ThreadPool.h"

using namespace std;

#ifdef UNICODE
typedef wstring tstring;

#else
typedef string tstring;

#endif

#define POOL_SIZE 1000

unordered_map<tstring, ULONGLONG> mapDirSize_simple;	// 递归的map表
unordered_map<tstring, ULONGLONG> mapDirSize;			// 线程池的map表
std::mutex mtx;
ThreadPool pool(POOL_SIZE);

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
	
	vector<tstring> copyVecParent = vecParentPath;
	copyVecParent.push_back(ClearPathFormat(lpDirName));
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
			SimpleGetDirectorySize(copyVecParent, strTmp.c_str());
		}
		else
		{	// 文件
			nDirSize += GetFileSize(pNextInfo.nFileSizeHigh, pNextInfo.nFileSizeLow);
		}
	}

	if (nDirSize)
	{
		mapDirSize_simple[ClearPathFormat(lpDirName)] += nDirSize;
		for (auto parent : vecParentPath)
		{
			mapDirSize_simple[parent] += nDirSize;
		}
	}
	return mapDirSize_simple[ClearPathFormat(lpDirName)];
}

// 计算目录大小
void CalcDirectoySize(vector<tstring> vecParentPath, tstring strOwnPath)
{
	ULONGLONG nCurrentSize = 0;
	tstring strDirName = strOwnPath;
	strDirName += TEXT("/*.*");			// 目录名字

	HANDLE hFile;
	WIN32_FIND_DATA pNextInfo;
	hFile = FindFirstFile(strDirName.c_str(), &pNextInfo);
	if (INVALID_HANDLE_VALUE == hFile)
		return ;

	vector<tstring> copyVecParent = vecParentPath;
	copyVecParent.push_back(ClearPathFormat(strOwnPath));
	while (FindNextFile(hFile, &pNextInfo))
	{
		// 跳过 "." ".." 两个目录
		if (!strcmp(pNextInfo.cFileName, ".") || !strcmp(pNextInfo.cFileName, ".."))
			continue;

		if (pNextInfo.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
		{	// 目录
			tstring strTmp = strOwnPath;
			strTmp += TEXT("/");
			strTmp += pNextInfo.cFileName;
			mtx.lock();
			pool.enqueue(CalcDirectoySize, copyVecParent, strTmp);
			mtx.unlock();
		}
		else
		{	// 文件
			nCurrentSize += GetFileSize(pNextInfo.nFileSizeHigh, pNextInfo.nFileSizeLow);
		}
	}

	if (nCurrentSize)
	{
		mtx.lock();
		mapDirSize[ClearPathFormat(strOwnPath)] += nCurrentSize;
		for (auto parent : vecParentPath)
		{
			mapDirSize[parent] += nCurrentSize;
		}
		mtx.unlock();
	}
}

void GetDirectorySize(tstring strDirName)
{
	vector<tstring> vecEmpty;
	mtx.lock();
	pool.enqueue(CalcDirectoySize, vecEmpty, strDirName);
	mtx.unlock();
}

int main()
{
	tstring strDirName = TEXT("c:\\Windows");

	LARGE_INTEGER t1, t2, tc;

	// 递归计算目录大小
	QueryPerformanceFrequency(&tc);
	QueryPerformanceCounter(&t1);
	vector<tstring> vecEmpty;
	cout << strDirName << " size: "<< (double)SimpleGetDirectorySize(vecEmpty, strDirName.c_str()) / (1 << 30) << "GB" << endl;
	QueryPerformanceCounter(&t2);
	printf("Use Time:%fs\n", (t2.QuadPart - t1.QuadPart)*1.0 / tc.QuadPart);
	
	// 使用线程池计算目录大小
	QueryPerformanceFrequency(&tc);
	QueryPerformanceCounter(&t1);
	GetDirectorySize(strDirName);
	pool.wait_until_nothing_in_flight();
	cout << strDirName << " size: " << (double)mapDirSize[ClearPathFormat(strDirName)] / (1 << 30) << "GB" << "\t-> with pool size: " << POOL_SIZE << endl;
	QueryPerformanceCounter(&t2);
	printf("Use Time:%fs\n", (t2.QuadPart - t1.QuadPart)*1.0 / tc.QuadPart);
	
	return 0;
}
```
</details>
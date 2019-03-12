---
title: '解决python wordcloud中文乱码, 中文词频问题'
toc: true
comments: true
abbrlink: b82d5d51
date: 2018-12-31 11:48:12
categories:
    - Python
    - Wordcloud
tags:
    - Python
    - Wordcloud
---

# 前言
python的`wordcloud`可以很方便的生成词云图, 然而美中不足的是, 该库对中文支持并不是那么友好, 存在以下两个问题
1. 中文字符会**乱码**
2. 中文**分词有问题**

以下介绍如何解决
<!-- more -->

# 解决中文乱码
`wordcloud` 不支持显示中文, 可以通过如下修改来支持中文:
1. 进入`python`根目录, 然后进入`Lib\site-packages\wordcloud`
2. 进入`C:\Windows\Fonts`目录下, 拷贝一个中文字库, 如**华文新魏**, 将其复制粘贴到`Lib\site-packages\wordcloud`目录下
![](/images/2018-12-31-10-29-48.png)
![](/images/2018-12-31-10-49-51.png)
3. 打开`Lib\site-packages\wordcloud`目录下`wordcloud.py`, 找到如下这行代码
![](/images/2018-12-31-10-28-31.png)
将代码改为对应拷入进来的字库名字, 如**华文新魏**的字库名字为**STXINWEI.TTF**
![](/images/2018-12-31-10-32-07.png)
4. 至此解决中文乱码问题

# 解决中文分词问题
`wordcloud`的`WordCloud`类中的`generate`方法是先对传进去的文字进行分词, 但是对**中文的分词效果**不太好, 建议先自己计算词频, 存放到字典中, 然后使用`generate_from_frequencies`来生成词云
```python {cmd=True}
from wordcloud import WordCloud
import matplotlib as mpl
import matplotlib.pyplot as plt
mpl.rcParams['font.sans-serif'] = ['SimHei']    # 指定默认字体 SimHei为黑体
mpl.rcParams['axes.unicode_minus'] = False      # 用来正常显示负号

text = '清华大学清华大学北京大学北京大学暨南大学'
textDic = {
    '清华大学': 2,
    '北京大学': 2,
    '暨南大学': 1
}
wc1 = WordCloud().generate(text)                        # generate对中文分词效果不好
wc2 = WordCloud().generate_from_frequencies(textDic)    # 自己来计算词频, 改善效果

plt.title('generate生成的词云')
plt.imshow(wc1, interpolation="bilinear")
plt.axis("off")

plt.figure()
plt.title('自己计算词频')
plt.imshow(wc2, interpolation="bilinear")
plt.axis("off")
plt.show()
```

![](/images/2018-12-31-10-48-00.png)


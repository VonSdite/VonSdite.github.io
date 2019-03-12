---
title: Hexo 博客添加版权
toc: true
comments: true
abbrlink: 54c43f8b
date: 2018-11-19 10:00:27
categories:
    - Hexo
    - Next
tags:
    - Hexo
    - Next
---

效果如图: 
![](/images/2018-11-19-10-13-50.png)

<!-- more -->

# 实现

1. 打开主题文件`themes/next/layout/_macro/post.swig`

2. 找到`<footer class="post-footer">` 标签, 在其代码替换成如下的代码

**要被替换的代码**
```swig
<footer class="post-footer">
    {% if post.tags and post.tags.length and not is_index %}
    <div class="post-tags">
        {% for tag in post.tags %}
        <a href="{{ url_for(tag.path) }}" rel="tag"># {{ tag.name }}</a>
        {% endfor %}
    </div>
    {% endif %}
```

**替换后的代码**
```swig
<footer class="post-footer">
{% if post.tags and post.tags.length and not is_index %}
        {# 版权声明节点 #}
         <div>    
          {% if not is_index %}
          <ul class="post-copyright">
             <li class="post-copyright-link">
              <strong>本文作者：</strong>
              <a href="/" title="欢迎访问 {{ theme.author }} 的个人博客">{{ theme.author }}</a>
            </li>

            <li class="post-copyright-link">
              <strong>本文标题：</strong>
              <a href="{{ url_for(post.permalink) }}" title="{{ post.title }}">{{ post.title }}</a>
            </li>

            <li class="post-copyright-link">
              <strong>本文链接：</strong>
              <a href="{{ url_for(post.permalink) }}" title="{{ post.title }}">{{ post.permalink }}</a>
            </li>

            <li class="post-copyright-date">
                <strong>发布时间： </strong>{{ post.date.format("YYYY年M月D日 - HH时MM分") }}
            </li>  

            <li class="post-copyright-license">
              <strong>版权声明： </strong>
              本文由 {{theme.author}} 原创。
            </li>
          </ul>
        {% endif %}
      </div>
      {# 这里是将标签的井字符号替换成图标 #}
        <div class="post-tags">
          {% for tag in post.tags %}
            <a href="{{ url_for(tag.path) }}" rel="tag"><i class="fa fa-tag"></i> {{ tag.name }}</a>
          {% endfor %}
        </div>
      {% endif %}
```

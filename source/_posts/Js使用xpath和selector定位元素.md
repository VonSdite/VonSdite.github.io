---
title: Js使用xpath和selector定位元素
toc: true
comments: true
categories:
  - Javascript
tags:
  - Javascript
abbrlink: cb216d2c
date: 2018-11-28 00:21:27
---

# Js根据xpath定位元素

```Javascript
function find_element_by_xpath(STR_XPATH) {
    var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
    var xnodes = [];
    var xres;
    while (xres = xresult.iterateNext()) {
        xnodes.push(xres);
    }

    return xnodes;
}
```

<!-- more -->

# 使用selector定位元素

`querySelector`和`querySelectorAll`方法是**W3C Selectors API**规范中定义的。
他们的作用是根据**CSS 选择器**规范，便捷定位文档中指定元素。
目前几乎主流浏览器均支持了他们。包括 IE8(含) 以上版本、 Firefox、 Chrome、Safari、Opera。

`querySelector` 和 `querySelectorAll` 在规范中定义了如下接口：
```Javascript
module dom {
    [Supplemental, NoInterfaceObject] interface NodeSelector { 
        Element querySelector( in DOMString selectors);
        NodeList querySelectorAll( in DOMString selectors); 
    };
    Document implements NodeSelector;
    DocumentFragment implements NodeSelector;
    Element implements NodeSelector; 
};
```

从接口定义可以看到`Document`、`DocumentFragment`、`Element`都实现了`NodeSelector`接口。
即这三种类型的元素都拥有者两个方法。
`querySelector`和`querySelectorAll`的参数须是符合**css selector**的字符串。
不同的是`querySelector`返回的是一个对象，`querySelectorAll`返回的一个集合(`NodeList`)

## 例子
获取页面属性为test的元素：
```Javascript
document.getElementById("test");
//or
document.querySelector("#test");
//or
document.querySelectorAll("#test")[0];
```

获取页面class属性为'red'的元素:
```Javascript
document.getElementsByClassName('red')
//or
document.querySelector('.red')
//or
document.querySelectorAll('.red')
```
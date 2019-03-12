---
title: 解决hexo leancloud Too many requests 错误
toc: true
comments: true
categories:
  - Hexo
  - Next
tags:
  - Hexo
  - Next
  - Leancloud
abbrlink: 416930d1
date: 2019-01-08 18:19:40
---

# 前言
LeanCloud可以统计Hexo文章的阅读次数, 但是有它的缺陷。
当你的文章数目逐渐变多的时候, 使用`hexo d`时, 经常会出现 Too many requests的错误。
原因是, 使用**免费开发版**Leancloud无法短时间内接受太多的请求, 所以会导致429错误。 
![](/images/2019-01-08-18-37-36.png)

<!-- more -->

# 官方解释
> 信息 - Too many requests. 
> 含义 - 超过应用的流控限制, 即超过每个应用同一时刻最多可使用的工作线程数, 或者说同一时刻最多可以同时处理的数据请求。通过 控制台 > 存储 > API 统计 > API 性能 > 总览 可以查看应用产生的请求统计数据, 如平均工作线程、平均响应时间等。使用 LeanCloud 商用版或企业版 的用户, 如有需要, 可以联系我们来调整工作线程数。

# 原因
查看源代码, `node_modules\hexo-leancloud-counter-security\index.js`, 发现每次进行`hexo d`的时候, 他对每个博文的title和url, 向leancloud发送一次查询请求, 如果发现leancloud那边儿没有该条记录的话, 那么再发送一条插入请求。 
原逻辑如下:
```js
_.forEach(urls, function (x) {
    var query = new AV.Query('Counter');
    query.equalTo('url', x.url);
    query.count().then(function (count) {
        if (count === 0) {
            var counter = new Counter();
            counter.set('url', x.url);
            counter.set('title', x.title);
            counter.set('time', 0);
            counter.save().then(function (obj) {
                log.info(x.title + ' is saved as: ' + obj.id);
            }, function (error) {
                log.error(error);
            });
        }
    }, function (error) {
        log.error(error);
    });
});
```
就是说, 每一次`hexo d`的时候最少的查询次数等于你的博文个数。如果你的leancloud的应用的处理能力不够强大的时候, 对于这种高强度的请求, 当然会出现Too Many Requests的错误代码。

我们要做的就是较少不必要的请求咯。 
本地记录一个title和url的json数组, 每次查询这个数组, 看看哪些是真正的需要查询的, 然后再去查询leancloud。其实可以这样理解, 这个本地的数组存储就是leancloud的远程数据库表。 
因为筛除了一些记录, 所以每次hexo d时的请求数量仅仅是相比上一次hexo d时候的增量。

# 修改代码
修改`node_modules\hexo-leancloud-counter-security\index.js`这个文件, 修改处代码均有注释, 往下翻就可以看到了

<details><summary>展开代码</summary>```js
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var sync = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var log, config, APP_ID, APP_KEY, publicDir, UrlsFile, urls, currentUser, userName, passWord, Counter;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        log = this.log;
                        config = this.config;

                        if (!config.leancloud_counter_security.enable_sync) {
                            _context.next = 19;
                            break;
                        }

                        APP_ID = config.leancloud_counter_security.app_id;
                        APP_KEY = config.leancloud_counter_security.app_key;
                        publicDir = this.public_dir;
                        UrlsFile = pathFn.join(publicDir, 'leancloud_counter_security_urls.json');
                        urls = JSON.parse(fs.readFileSync(UrlsFile, 'utf8'));


                        AV.init({
                            appId: APP_ID,
                            appKey: APP_KEY
                        });

                        currentUser = AV.User.current();

                        if (currentUser) {
                            _context.next = 16;
                            break;
                        }

                        userName = config.leancloud_counter_security.username;
                        passWord = config.leancloud_counter_security.password;

                        if (!userName) {
                            userName = readlineSync.question('Enter your username: ');
                            passWord = readlineSync.question('Enter your password: ', { hideEchoBack: true });
                        } else if (!passWord) {
                            passWord = readlineSync.question('Enter your password: ', { hideEchoBack: true });
                        }
                        _context.next = 16;
                        return AV.User.logIn(userName, passWord).then(function (loginedUser) {
                            log.info('Logined as: ' + loginedUser.getUsername());
                        }, function (error) {
                            log.error(error);
                        });

                    case 16:

                        log.info('Now syncing your posts list to leancloud counter...');
                        Counter = AV.Object.extend('Counter');

                        //----add----
                        urls.sort(cmp);

                        var memoFile = pathFn.join(publicDir, "leancloud_memo.json");
                        if(!fs.existsSync(memoFile)){
                            fs.writeFileSync(memoFile, "[\n]");
                        }
                        var memoData = fs.readFileSync(memoFile, "utf-8").split("\n");
                        var memoIdx = 1;

                        var newData = [];
                        var cnt = 0;
                        var limit = 0;
                        var env = this;
                        //----end----


                        _.forEach(urls, function (x) {
                            //----add----
                            var y = {};
                            y.title = "";
                            y.url = "";

                            var flag = false;
                            while(true){
                                if(memoData[memoIdx] == ']') break;
                                y = JSON.parse(memoData[memoIdx].substring(0, memoData[memoIdx].length-1));
                                if(y.url > x.url) break;
                                if(y.url == x.url && y.title == x.title){
                                    flag = true;
                                    break;
                                }
                                memoIdx++;
                            }
                            if(!flag) {
                                log.info("Dealing with record of " + x.title);
                                limit++;
                                //----end----
                                var query = new AV.Query('Counter');
                                query.equalTo('url', x.url);
                                query.count().then(function (count) {
                                    if (count === 0) {
                                        var counter = new Counter();
                                        counter.set('url', x.url);
                                        counter.set('title', x.title);
                                        counter.set('time', 0);
                                        counter.save().then(function (obj) {
                                            log.info(x.title + ' is saved as: ' + obj.id);
                                            //----add----
                                            newData.push(x);
                                            cnt++;
                                            postOperation(env, cnt, limit, newData, memoData);
                                            //----end----

                                        }, function (error) {
                                            log.error(error);
                                            //----add----
                                            cnt++;
                                            postOperation(env, cnt, limit, newData, memoData);
                                            //----end----
                                        });
                                    }
                                    //----add----
                                    else{
                                        newData.push(x);
                                        cnt++;
                                        postOperation(env, cnt, limit, newData, memoData);
                                    }
                                    //----end----

                                }, function (error) {
                                    log.error(error);
                                    //----add----
                                    cnt++;
                                    postOperation(env, cnt, limit, newData, memoData);
                                    //----end----
                                });
                            //----add----
                            }
                            //----end----
                        });

                    case 19:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function sync() {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AV = require('leancloud-storage');
var _ = require('lodash');
var readlineSync = require('readline-sync');
var packageInfo = require('./package.json');
var pathFn = require('path');
var fs = require('fs');

function generate_post_list(locals) {
    var config = this.config;
    if (config.leancloud_counter_security.enable_sync) {
        var urlsPath = 'leancloud_counter_security_urls.json';
        var urls = [].concat(locals.posts.toArray()).filter(function (x) {
            return x.published;
        }).map(function (x) {
            return {
                title: x.title,
                url: config.root + x.path
            };
        });
        return {
            path: urlsPath,
            data: (0, _stringify2.default)(urls)
        };
    }
}

hexo.extend.generator.register('leancloud_counter_security_generator', generate_post_list);

hexo.extend.deployer.register('leancloud_counter_security_sync', sync);

var commandOptions = {
    desc: packageInfo.description,
    usage: ' <argument>',
    'arguments': [{
        'name': 'register | r <username> <password>',
        'desc': 'Register a new user.'
    }]
};

function commandFunc(args) {
    var log = this.log;
    var config = this.config;

    if (args._.length !== 3) {
        log.error('Too Few or Many Arguments.');
    } else if (args._[0] === 'register' || args._[0] === 'r') {
        var APP_ID = config.leancloud_counter_security.app_id;
        var APP_KEY = config.leancloud_counter_security.app_key;
        AV.init({
            appId: APP_ID,
            appKey: APP_KEY
        });

        var user = new AV.User();
        user.setUsername(String(args._[1]));
        user.setPassword(String(args._[2]));
        user.signUp().then(function (loginedUser) {
            log.info(loginedUser.getUsername() + ' is successfully signed up');
        }, function (error) {
            log.error(error);
        });
    } else {
        log.error('Unknown Command.');
    }
}

hexo.extend.console.register('lc-counter', 'hexo-leancloud-counter-security', commandOptions, commandFunc);
//----add----
function cmp(x, y){
    if(x.url < y.url)
        return -1;
    else if(x.url == y.url)
        return 0;
    else return 1;
}

var postOperation = function (env, cnt, limit, newData, memoData){
    if(cnt == limit){
        var log = env.log;
        newData.sort(cmp);
        var sourceDir = env.source_dir;
        var publicDir = env.public_dir;
        var memoFile = pathFn.join(sourceDir, "leancloud_memo.json");
        fs.writeFileSync(memoFile, "[\n");

        var memoIdx = 1;
        for(var i = 0; newData[i]; i++){
            while(true){
                if(memoData[memoIdx] == ']') break;
                var y = JSON.parse(memoData[memoIdx].substring(0, memoData[memoIdx].length-1));
                if(y.url > newData[i].url) break;

                fs.writeFileSync(memoFile, memoData[memoIdx] + "\n", {'flag':'a'});
                memoIdx++;
            }
            fs.writeFileSync(memoFile, "{\"title\":\"" + newData[i].title + "\",\"url\":\"" + newData[i].url + "\"},\n", {'flag':'a'});
        }
        while(memoData[memoIdx] != ']'){
            fs.writeFileSync(memoFile, memoData[memoIdx] + "\n", {'flag':'a'});
            memoIdx++;
        }
        fs.writeFileSync(memoFile, memoData[memoIdx], {'flag':'a'});

        var srcFile = pathFn.join(sourceDir, "leancloud_memo.json");
        var destFile = pathFn.join(publicDir, "leancloud_memo.json");
        var readStream = fs.createReadStream(srcFile);
        var writeStream = fs.createWriteStream(destFile);
        readStream.pipe(writeStream);
        console.log("leancloud_memo.json successfully updated.");
    }
}
```
</details>

修改完后, 还需要打开博客配置文件`_config.yml`找到`skip_render:`这一项，然后加上`leancloud_memo.json`。

```yml
skip_render: 
  - leancloud_memo.json
```

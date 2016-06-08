/**
 * amWiki
 * https://github.com/TevinLi/amWiki
 * by Tevin
 *
 * Released under the MIT license.
 */

//引入-运行环境
var environment = require('atom'),
    CompositeDisposable = environment.CompositeDisposable;
//引入-手动刷新工具
var updateNav = require('./updateNav');
//引入-自动刷新工具
var autoNav = require('./autoNav');
//引入-wiki创建器
var creator = require('./creator');
//引入-页内目录创建器
var contents = require('./contents');
//引入-截图粘帖模块
var pasterImg = require('./pasterImg');
//引入-本地服务器模块
var webServer = require('./webServer');

module.exports = {
    //保存
    subscriptions: null,
    //缓存atom存储的状态变量
    state: null,
    //当atom启动时
    activate: function (state) {
        var that = this;
        this.state = state;
        this.state.libraryList = this.state.libraryList || [];  //文库列表记录
        this.subscriptions = new CompositeDisposable();
        //命令，手动更新导航
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:updateNav': function () {
                updateNav.update(that.state);
            }
        }));
        //命令，暂停所有文件夹监听
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:pauseNav': function () {
                autoNav.pause(that.state);
            }
        }));
        //命令，基于当前config.json创建wiki
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:create': function () {
                creator.create(that.state);
            }
        }));
        //命令，在当前文档上抓取h2、h3为页内目录
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:contents': function () {
                contents.make();
            }
        }));
        //命令，粘帖截图
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:pasteImg': function () {
                pasterImg.paster();
            }
        }));
        //命令，启动node静态服务器
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:runServer': function () {
                webServer.run(that.state.libraryList);
            }
        }));
        //命令，浏览打开当前页面
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amWiki:browser': function () {
                webServer.browser(that.state.libraryList);
            }
        }));
        //自动更新导航文件
        autoNav.watchLibrary(this.state);
    },
    //当atom即将关闭，终止所有监听
    deactivate: function () {
        autoNav.destroy();
        this.subscriptions.dispose();
    },
    //当atom关闭，保存临时数据
    serialize: function () {
        return {
            libraryList: this.state.libraryList
        };
    }
};
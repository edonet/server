'use strict';


/*
 *****************************
 * 引入依赖模块
 *****************************
 */

const
    http = require('http'),
    utils = require('./utils'),
    request = require('./request'),
    response = require('./response');

/*
 *****************************
 * 定义【AppServer】类
 *****************************
 */

class AppServer {
    constructor(router) {
        this.router = router;
        this.server = http.createServer((req, res) => {
            router.resolve(request(req), response(res));
        });
    }

    config(handler) {

        // 执行配置方法
        if (utils.isFunction(handler)) {
            handler.call(this, this.erver);
        }

        return this;
    }

    listen(port, callback) {

        // 创建路由解析器
        this.router.createResolver();

        // 监听端口
        this.server.listen(port, callback);
        return this;
    }
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = AppServer;

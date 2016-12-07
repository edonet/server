'use strict';


/*
 *****************************
 * 引入依赖模块
 *****************************
 */

const
    path = require('path'),
    utils = require('./utils'),
    appendRouter = createRouteAppend();

/*
 *****************************
 * 定义【Router】类
 *****************************
 */

class Router {
    constructor(dir) {
        this.dir = path.resolve(dir);
        this.rootdir = this.dir;
        this.middleware = [];
        this.resolveHandler = notFound;
    }

    use(handler) {

        // 处理直接指定中间件文件
        if (utils.isString(handler)) {
            this.middleware.push({
                context: path.join(this.rootdir, handler),
                handler: require(handler);
            });
        } else if (utils.isFunction(handler)) {
            this.middleware.push({
                context: this.rootdir, handler
            });
        }

        return this;
    }

    append(...args) {

        // 添加路由
        return appendRouter(this, ...args);
    }

    // 设置静态资源地址
    assets(dir) {
        this.dir = path.resolve(dir);
    }

    // 解析路由
    resolve() {
        return resolveRouter(this);
    }

    // 执行路由
    invoke(request, response) {

        // 监听请求是否准备好
        request.ready(() => {

            // 开始执行路由
            this.resolveHandler(request, response);
        });

        return this;
    }
}


/*
 *****************************
 * 定义工具函数
 *****************************
 */

function createRouteAppend() {

    // 获取重载方法
    let appendRouter = utils.override('appendRouter');

    // 只有一个参数时
    utils.override('appendRouter', (router, options) => {

    });

    return appendRouter;
}

function resolveRouter(router) {
    return router;
}

// 设置找不到文件时【404】错误
function notFound(req, res) {
    return res.setState(404);
}

/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = dir => new Router(dir);

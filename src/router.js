'use strict';


/*
 *****************************
 * 引入依赖模块
 *****************************
 */

const
    path = require('path'),
    utils = require('./utils');

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
                dir: path.join(this.rootdir, handler),
                handler: require(handler);
            });
        } else if (utils.isFunction(handler)) {
            this.middleware.push({
                dir: this.rootdir, handler
            });
        }

        return this;
    }

    append(...args) {

        switch (args.length) {
            case 0:
                return this;
            case 1:
                return resolveRouteOptions(this, args[0]);
            default: break;
        }

        return this;
    }

    // 设置静态资源地址
    assets(dir) {
        this.dir = path.resolve(dir);
    }

    // 创建解析器
    createResolver() {

    }

    // 解析请求
    resolve(request, response) {

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
    return utils.override()
}
function resolveRouteOptions(router, options) {
    let dir = router.rootdir;

    // 如果参数为字符串，则作为文件载入
    if (utils.isString(options)) {
        dir = path.join(dir, options);
        options = require(options);
    } else if (utils.isArray(options)) {
        options.map(v => resolveRouteOptions(router, v));
    } else if (utils.isObject(options)) {
        let {
                type = 'all', url, path, handler
            } = options;

        if (handler) {
            return {
                dir,
                type,
            };
        }
        return {
            context,
            type: router.type,
            url: router.url,
            path: router.path,
            handler: router.handler
        };
    } else if (utils.isFunction(options)) {
        router._['all'].push({
            handler: options
        });
    }
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

module.exports = Router;

'use strict';

/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    path = require('path'),
    server = require('./server'),
    router = require('./router');


/*
 *****************************
 * 定义【App】类
 *****************************
 */

class App {
    constructor(dir) {
        this.dir = dir || process.cwd();
        this.router = router(this.dir);
        this.server = server((req, res) => {
            this.router.invoke(req, res);
        });
    }

    /* 获取【url】路径 */
    url(name) {

        // 处理相对于根目录的路径
        if (name[0] === '/') {
            return path.resolve(this.dir, '.' + name);
        }

        return path.resolve(this.dir, name);
    }

    /* 添加中间件 */
    use(handler) {
        if (typeof handler === 'function') {
            this.router.use(handler);
        }
        return this;
    }

    /* 重定义请求 */
    redirect(src, dist) {

        // 添加重定向中间件
        this.router.use(req => {
            src === req.path && (req.path = dist);
        });

        return this;
    }

    /* 添加默认路由 */
    route(type, url, callback) {

        // 支持传入数组
        if (Array.isArray(type)) {
            type.forEach(v => this.route(v));
            return this;
        }

        // 支持传入对象
        if (typeof type === 'object') {

            // 支持传入路由路径
            if (typeof type.callback === 'string') {
                type.callback = require(this.url(type.callback));
            }
            return this.router.add(type);
        }

        // 支持只传入两个参数
        if (callback === undefined) {
            [type, url, callback] = ['all', type, url];
        }

        // 支持传入路由路径
        if (typeof callback === 'string') {
            callback = require(this.url(callback));
        }

        // 添加路由
        this.router.add({ type, path: url, callback });

        return this;
    }

    /* 添加【GET】路由 */
    get(url, callback) {
        return this.route('get', url, callback);
    }

    /* 添加【POST】路由 */
    post(url, callback) {
        return this.route('post', url, callback);
    }

    /* 定义静态资源路径 */
    assets(dir, options) {
        this.router.assets(dir, options);
        return this;
    }

    /* 设置允许的请求来源 */
    allowOrigin(origin, method) {
        return this.use((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Methods', method || 'POST, GET');
        });
    }

    /* 监听端口 */
    listen(port, callback) {
        this.router.ready();
        this.server.listen(port, callback);
        return this;
    }
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (dir, router) => new App(dir).route(router);



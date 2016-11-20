'use strict';


/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    assets = require('./assets'),
    queue = require('./queue');


/*
 *****************************
 * 定义路由处理方法
 *****************************
 */

function handler(v) {
    return (req, ...args) => {
        return v.path === req.path ? v.callback(req, ...args) : true;
    };
}


/*
 *****************************
 * 定义路由类
 *****************************
 */

class Router {
    constructor(dir) {
        this.router = {};
        this.middleware = [];
        this.dir = dir || process.cwd();
    }

    /* 添加路由 */
    add(options) {
        let { type = 'all', path, callback } = options;

        // 参数类型错误时退出
        if (typeof path !== 'string') {
            return this;
        }

        // 加载【callback】模块
        if (typeof callback === 'string') {
            callback = require(callback);
        }

        // 回调类型非函数时退出
        if (typeof callback !== 'function') {
            return this;
        }

        // 添加路由
        if (this.router.hasOwnProperty(type)) {
            this.router[type].push({ path, callback });
        } else {
            this.router[type] = [{ path, callback }];
        }

        return this;
    }

    /* 添加中间件 */
    use(handler) {
        this.middleware.push(handler);
        return this;
    }

    /* 添加静态资源 */
    assets(dir) {
        this.dir = dir;
        return this;
    }

    /* 准备路由 */
    ready() {
        let callback = assets(this.dir) || ((req, res) => {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('Error: 404!');
            }),
            queues = {};


        // 生成默认路由回调
        if (this.router.all) {
            callback = queue(this.router.all.map(handler), callback);
        }

        // 生成路由方法
        for (let key in this.router) {
            if (key !== 'all' && this.router.hasOwnProperty(key)) {
                queues[key] = queue(this.router[key].map(handler), callback);
            }
        }

        // 生成处理函数
        this.handler = queue(this.middleware, (req, res) => {

            // 执行路由队列
            return req.type in queues ?
                queues[req.type](req, res) : callback(req, res);

        });

        return this;
    }

    /* 执行路由 */
    invoke(req, res) {
        this.handler(req, res);
        return this;
    }
}

/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = dir => new Router(dir);

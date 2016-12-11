'use strict';


/*
 *****************************
 * 引入依赖模块
 *****************************
 */

const
    path = require('path'),
    utils = require('./utils'),
    assets = require('./assets');

/*
 *****************************
 * 定义【Router】类
 *****************************
 */

class Router {
    constructor(dir) {
        this._ = {};
        this.dir = path.resolve(dir);
        this.rootdir = this.dir;
        this.middleware = [];
        this.resolveHandler = notFound;
    }

    path(dir, target) {

        if (!utils.isString(target)) {
            target = this.rootdir;
        }

        if (!utils.isString(dir)) {
            return target;
        }

        return dir[0] === '/' ?
            path.join(this.rootdir, '.' + dir) :
            path.join(target, dir);
    }

    use(handler) {

        // 当指定中间件文件时
        if (utils.isString(handler)) {
            let filename = this.path(handler),
                dirname = path.dirname(filename);

            this.middleware.push({
                context: dirname, handler: require(filename);
            });

            return this;
        }

        // 当指定中间件函数时
        if (utils.isFunction(handler)) {
            this.middleware.push({
                context: this.rootdir, handler
            });

            return this;
        }

        return this;
    }

    add(...args) {

        // 添加路由
        return addRoute(this, args, this.rootdir);
    }

    // 设置静态资源地址
    assets(dir) {
        this.dir = path.resolve(dir);
        return this;
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
 * 添加路由
 *****************************
 */

function addRoute(router, args, context) {
    switch (args.length) {
        case 0:
            return router;
        case 1:
            return addRouteOptions(router, args[0], context);
        case 2:
            return addRouteHandler(router, args[0], args[1], context);
        default:
            return addRouteOptions(router, {
                type: args[0], url: args[1], handler: args[2]
            }, context);
    }

    return router;
}

function addRouteOptions(router, options, context) {

    // 设置路由上下文
    if (!utils.isString(context)) {
        context = router.rootdir;
    }

    // 当配置为指定为一个文件时
    if (utils.isObject(options)) {
        let type = options.type || options.mothed || 'all',
            url = options.url || options.path,
            handler = options.handler || options.callback;

        if (utils.isString(handler)) {
            handler = require(router.path(handler, context));
        }

        if (utils.type(type, url, handler) === 'string, string, function') {

            // 执行添加路由
            return addRouterRoute(router, type, url, { context, handler });
        }

        return router;
    }

    // 当配置为指定数组时
    if (utils.isArray(options)) {

        // 设置数组中各项
        options.forEach(v => {
            addRouteOptions(router, v, context);
        });

        return router;
    }

    // 当配置为指定文件时
    if (utils.isString(options)) {
        let filename = router.path(options, context),
            dirname = path.dirname(filename);

        return addRoute(router, require(filename), dirname);
    }

    // 当配置为函数时
    if (utils.isFunction(options)) {

        // 添加中间件
        router.middleware.push({
            context, handler: options
        });

        return router;
    }

    return router;
}

function addRouteHandler(router, url, handler, context) {

    // 效验路由路径是否为字符串
    if (!utils.isString(url)) {
        return router;
    }

    // 当指定的路由为函数时
    if (utils.isFunction(handler)) {
        return addRouterRoute(router, 'all', url, { context, handler });
    }

    // 当指定的路由为数组时
    if (utils.isArray(handler)) {

        // 遍历添加路由
        handler.forEach(v => {
            addRouteHandler(router, url, v, context);
        });

        return router;
    }

    // 当指定的路由为对象时
    if (utils.isObject(handler)) {

        // 拼接路由路径
        handler.url = 'url' in handler ?
            handler.url = url + handler.url : url;

        // 添加路由
        return addRouteOptions(router, handler, context);
    }

    // 当指定的路由为字符串时
    if (utils.isString(handler)) {
        let filename = router.path(handler, context),
            dirname = path.dirname(filename);

        return addRouteHandler(router, url, require(filename), dirname);
    }

    return router;
}

function addRouterRoute(router, type, url, options) {

    // 格式化路由类型及路径
    url = url.toLowerCase();
    type = type.toLowerCase();

    // 创建路由路径
    let route = router._[url] || {};

    // 添加路由
    utils.isset(route, type) ?
        route[type].push(options) : (route[type] = [options]);

    // 返回路由
    router._[url] = route;
    return router;
}

/*
 *****************************
 * 解析路由
 *****************************
 */

function resolveRouter(router) {

    let proxy = {}, cb;


    // 设置静态资源路径
    cb = queue(assets(router.dir, { onError: notFound }), notFound);

    // 生成路由函数
    utils.each(router._, (url, val) => {
        let copy = {},
            callback = 'all' in val ? queue(val['all'], cb) : cb;


        utils.each(val, (type, list) => {
            if (type !== 'all') {
                copy[type] = queue(list, callback);
            }
        });

        proxy[url] = (req, res) => {
            req.path in copy ? copy[req.path](req, res) : callback(req, res);
        };
    });

    // 生成路由执行函数
    router.resolveHandler = queue(router.middleware, (req, res) => {
        req.path in proxy ? proxy[req.path](req, res) : cb(req, res);
    });

    return router;
}


/*
 *****************************
 * 工具函数
 *****************************
 */

// 生成队列函数
function queue(arr, callback) {

    // 返回队列函数
    return (req, res) => {

        // 处理回调方法
        let cb = callback ? callback : notFound;

        // 执行队列
        arr && arr.length ? arr.reduceRight((next, curr) => err => {
            if (err) {
                return err;
            }

            if (!utils.isObject(curr) || !('handler' in curr)) {
                return next();
            }

            let handler = curr.handler,
                len = handler.length;

            if ('context' in curr) {
                req.context = curr.context;
            }

            return len > 2 ? handler(req, res, next) :
                next(handler(req, res) === false ? new Error('队列已经停止') : null);
        }, cb)() : cb(req, res);
    };
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

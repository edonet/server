'use strict';

/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    server = require('./server'),
    router = require('./router');


/*
 *****************************
 * 定义【App】类
 *****************************
 */

class App {
    constructor(dir) {
        this.router = router(dir);
        this.server = server((req, res) => {
            this.router.invoke(req, res);
        });
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
    route(path, callback) {

        // 添加路由
        Array.isArray(path) ?
            path.forEach(v => this.router.add(v)) :
            this.router.add({path, callback});

        return this;
    }

    /* 添加【GET】路由 */
    get(path, callback) {
        this.router.add({ type: 'get', path, callback });
        return this;
    }

    /* 添加【POST】路由 */
    post(path, callback) {
        this.router.add({ type: 'post', path, callback });
        return this;
    }

    /* 定义静态资源路径 */
    assets(dir, options) {
        this.router.assets(dir, options);
        return this;
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

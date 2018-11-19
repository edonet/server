/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-20 09:21:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const Router = require('koa-router');


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = install;


/**
 *****************************************
 * 加载路由
 *****************************************
 */
function install(app, routes, root) {
    if (routes) {
        let router = new Router();

        // 生成路由
        adopt(router, routes);

        // 挂载路由
        if (root) {
            app.use(root, router.routes(), router.allowedMethods());
        } else {
            app.use(router.routes());
            app.use(router.allowedMethods());
        }
    }
}


/**
 *****************************************
 * 生成路由映射
 *****************************************
 */
function adopt(router, routes) {
    let type = typeof routes;

    // 挂载中间件
    if (type === 'function') {
        return routes(router);
    }

    // 处理对象
    if (type === 'object') {

        // 处理数组
        if (Array.isArray(routes)) {
            return routes.forEach(route => adopt(router, route));
        }

        // 安装中间件
        if (typeof routes.install === 'function') {
            return routes.install(router);
        }

        // 安装路由
        if (routes.url || routes.path) {
            let url = routes.url || routes.path,
                method = (routes.method || routes.type || 'all').toLowerCase(),
                callback = routes.callback || routes.handler,
                children = routes.routes || routes.children;

            // 添加路由
            if (url) {

                // 添加路由回调
                if (callback && router[method]) {
                    router[method](url, callback);
                }

                // 添加子路由
                if (children) {
                    install(router, children, url);
                }
            }
        }
    }
}

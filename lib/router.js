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
 * 加载路由
 *****************************************
 */
module.exports = function install(app, routes) {
    if (routes) {
        let router = new Router();

        // 生成路由
        adopt(router, routes);

        // 挂载路由
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
};


/**
 *****************************************
 * 生成路由映射
 *****************************************
 */
function adopt(router, routes) {
    let type = typeof routes;

    // 挂载中间件
    if (type === 'function') {
        return router.use(routes);
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
                callback = routes.callback || routes.handler;

            // 添加路由
            if (router[method] && url && callback) {
                return router[method](url, callback);
            }
        }
    }
}

/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-19 16:23:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */



/**
 *****************************************
 * 加载【api】接口
 *****************************************
 */
module.exports = function api(dir) {
    let router = {};

    // 格式化目录
    dir.startsWith('/') || (dir = '/' + dir);
    dir.endsWith('/') && (dir = dir.slice(0, -1));

    // 返回函数
    return async (ctx, next) => {
        let { method, path } = ctx;

        // 处理路由
        if (path === dir || path.startsWith(dir + '/')) {
            let route, callback;

            // 查找路由
            if (!(path in router)) {
                try {
                    let fullpath = ctx.dir(path.slice(1)),
                        route = ctx.fs.resolve(fullpath, fullpath + '/index.js'),
                        type = typeof route;

                    // 格式化路由
                    route = type === 'function' ? { get: route } : type === 'object' ? route : null;

                    // 执行安装回调
                    route && route.install && route.install(ctx.app, ctx);

                    // 缓存路由
                    router[path] = route;
                } catch (err) {
                    router[path] = null;
                }
            }

            // 获取回调函数
            route = router[path];
            callback = route && route[method.toLowerCase()];

            // 处理请求
            if (callback) {
                return await callback.call(route, ctx, next);
            }
        }

        // 进入下一步处理
        await next();
    };
};

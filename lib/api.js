/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-19 16:23:23
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 定义路由映射
 *****************************************
 */
const router = {};


/**
 *****************************************
 * 加载【api】接口
 *****************************************
 */
module.exports = function api(dir) {

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
                    let route = resolveFile(ctx.dir(path.slice(1))),
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


/**
 *****************************************
 * 解析文件
 *****************************************
 */
function resolveFile(dir) {
    try {
        return require(dir);
    } catch (err) {
        // do noting;
    }

    try {
        return require(dir + '/index.js');
    } catch (err) {
        // do noting;
    }

    return null;
}

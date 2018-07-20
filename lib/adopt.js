/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-20 09:04:16
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 装载中间件
 *****************************************
 */
module.exports = function adopt(app, middleware) {
    if (middleware) {
        let type = typeof middleware;

        // 挂载中间件
        if (type === 'function') {
            return app.use(middleware);
        }

        // 处理对象
        if (type === 'object') {

            // 处理数组
            if (Array.isArray(middleware)) {
                return middleware.forEach(fn => adopt(app, fn));
            }

            // 安装中间件
            if (typeof middleware.install === 'function') {
                middleware.install(app);
            }
        }
    }
};

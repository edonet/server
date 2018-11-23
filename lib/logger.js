/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-23 17:59:54
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 打印日志
 *****************************************
 */
module.exports = function logger() {

    // 发送信息
    if (process.send) {
        console.log = (...args) => {
            process.send({ type: 'process:message', data: { message: args } });
        };
    }

    // 返回日志函数
    return async (ctx, next) => {
        let start = + new Date();

        // 处理请求
        await next();

        // 发送信息
        console.log(`${ctx.method}[${ctx.response.status}]: ${ctx.path} ${new Date() - start}ms`);
    };
};

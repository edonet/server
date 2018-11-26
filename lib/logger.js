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
        console.log = send('log');
        console.warn = send('warn');
        console.error = send('error');
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


/**
 *****************************************
 * 发送信息
 *****************************************
 */
function send(method) {
    let handler = console[method];

    // 返回拦截函数
    return (...message) => {

        // 执行原有方法
        handler.apply(console, message);

        // 发送信息
        process.send({ type: 'process:message', data: { method, message }});
    };
}

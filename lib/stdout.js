/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-19 18:19:21
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 发送消息
 *****************************************
 */
function send(data) {

    // 发送信息给主线程
    if (process.send) {
        return process.send({ type: 'process:server', data });
    }

    // 打印信息
    switch (data.method) {
        case 'error':
            data.message.forEach(info => console.error(info));
            break;
        case 'warn':
            data.message.forEach(info => console.warn(info));
            break;
        case 'block':
            console.log('-'.repeat(80));
            data.message.forEach(info => console.log(info));
            console.log('-'.repeat(80));
            break;
        default:
            data.message.forEach(info => console.log(info));
            break;
    }
}


/**
 *****************************************
 * 输出信息
 *****************************************
 */
function log(message, ...args) {
    return send({
        type: 'stdout',
        method: 'info',
        message: [`> ${ message }`, ...args]
    });
}


/**
 *****************************************
 * 输出信息
 *****************************************
 */
function warn(message, ...args) {
    return send({
        type: 'stdout',
        method: 'warn',
        message: [`> ${ message }`, ...args]
    });
}


/**
 *****************************************
 * 输出信息
 *****************************************
 */
function error(message, ...args) {
    return send({
        type: 'stdout',
        method: 'warn',
        message: [`> ${ message }`, ...args]
    });
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { send, log, warn, error };

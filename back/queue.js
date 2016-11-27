'use strict';


/*
 *****************************
 * 定义空回调函数
 *****************************
 */

function noop() {}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (arr, callback) => {

    // 返回队列函数
    return (...args) => {

        // 处理回调方法
        let cb = callback ? (err => !err && callback(...args)) : noop;

        // 执行队列
        arr && arr.length ? arr.reduceRight((next, fn) => err => {
            if (err) {
                return err;
            }

            if (typeof fn !== 'function') {
                return next();
            }

            return fn.length > args.length ? fn(...args, next) :
                next(fn(...args) === false ? new Error('队列已经停止') : null);

        }, cb)() : cb();
    };
};

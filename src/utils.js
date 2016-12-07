'use strict';


/*
 *****************************
 * 定义工具方法
 *****************************
 */

// 判断是是否为字符串
function isString(object) {
    return typeof object === 'string';
}

// 判断是否为数字
function isNumber(object) {
    return typeof object === 'number';
}

// 判断是是否为函数
function isFunction(object) {
    return typeof object === 'function';
}

// 判断是是否为数组
function isArray(object) {
    return Array.isArray(object);
}

// 判断是否为对象
function isObject(object) {
    return object && !isArray(object) && typeof object === 'object';
}


/*
 *****************************
 * 函数重载
 *****************************
 */
const overrideCache = {};

// 设置、获取重载函数
function override(...args) {
    return args.length < 2 ?
        getOverrideHandler(...args) : setOverrideHandler(...args);
}

// 设置重载函数
function setOverrideHandler(name, handler) {
    if (!isString(name) || !isFunction(handler)) {
        return false;
    }

    if (!(name in overrideCache)) {
        overrideCache[name] = [];
    }

    let cache = overrideCache[name],
        len = handler.length,
        l = cache.length;

    while (l --) {
        if (len >= cache[l].length) {
            return cache.splice(l + 1, 0, {
                length: len, handler: handler
            });
        }
    }

    return cache.unshift({
        length: len, handler: handler
    });
}

// 获取重载函数
function getOverrideHandler(name) {
    return isString(name) && ((...args) => {
        let cache = overrideCache[name] || [],
            len = args.length,
            l = cache.length;

        if (l) {

            // 匹配最佳的方法
            while (l --) {
                let caller = cache[l];

                if (len >= caller.length) {
                    return caller.handler(...args);
                }
            }

            return cache[0].handler(...args);
        }
    });
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = {
    isString,
    isNumber,
    isFunction,
    isArray,
    isObject,
    override
};

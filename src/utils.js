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


// 重载函数
function override(...handler) {
    let overrideCache = {};

    handler.forEach(v => {
        if (isFunction(v)){
            overrideCache[v.length] = v;
        }
    });

    return (...args) => {
        let len = args.length;

        if (len in overrideCache) {
            return overrideCache[len].apply(this, args);
        }
    };
}

/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = {
    isString, isFunction, isArray, isObject, override
};

'use strict';

const
    oStr = Object.prototype.toString;

/*
 *****************************
 * 定义工具方法
 *****************************
 */

// 获取变量数据类型
function type(...args) {
    return args.map(v => {
        return oStr.call(v).slice(8, -1).toLowerCase();
    }).join(', ');
}

// 判断是否有些属性
function isset(object, name) {
    return name in object;
}

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
 * 遍历对象
 *****************************
 */

function each(object, handler, start) {

    // 效验参数为函数
    if (!isFunction(handler)) {
        return false;
    }

    // 遍历数组
    if (isArray(object)) {
        let len = object.length,
            i = 0;

        if (start < 0) {
            start = len + start;
        }

        i = start > 0 && start < len ? start : 0;

        for (; i < len; i ++) {
            if (handler.call(object, i, object[i]) === false) {
                return false;
            }
        }

        return true;
    }

    // 遍历对象
    if (isObject(object)) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (handler.call(object, i, object[i]) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    return false;
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = {
    type,
    isset,
    isString,
    isNumber,
    isFunction,
    isArray,
    isObject,
    each,
    override
};

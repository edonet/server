'use strict';

function noop() {}

module.exports = (...arr) => (...args) => {
    if (arr.length) {
        arr.reduceRight((next, fn) => err => {
            if (err) {
                return console.log(err);
            }

            if (typeof fn !== 'function') {
                return next();
            }

            return fn.length > args.length ? fn(...args, next) :
                next(fn(...args) === false ? new Error('发生未知的错误') : null);

        }, noop)();
    }
};

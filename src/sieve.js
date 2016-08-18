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

            if (fn.length > args.length) {
                return fn(...args, next);
            } else {
                fn(...args), next();
            }
        }, noop)();
    }
};

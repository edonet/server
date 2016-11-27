'use strict';

/*
 *****************************
 * 加载【App】类
 *****************************
 */

const
    App = require('./app');


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (dir, router) => {
    return new App(dir).route(router);
};

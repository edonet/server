'use strict';


/*
 *****************************
 * 引入依赖模块
 *****************************
 */

const
    http = require('http'),
    request = require('./request'),
    response = require('./response');


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = router => {
    return http.createServer((req, res) => {
        router.invoke(request(req), response(res));
    });
};

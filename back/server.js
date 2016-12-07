'use strict';

/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    response = require('./response');


/*
 *****************************
 * 载入依赖模块
 *****************************
 */

let next = cb => (req, res) => {
    let type = req.method.toLowerCase(),
        data = url.parse(req.url),
        query = {
            type,
            path: data.pathname,
            headers: req.headers,
            param: {}
        },
        body = '';


    // 处理【response】参数
    res = response(res);

    // 处理【GET】请求
    if (type === 'get') {
        query.param = qs.parse(data.query);
        return cb(query, res);
    }

    // 处理【POST】请求
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        query.param = qs.parse(body);
        return cb(query, res);
    });
};


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = handler => {
    return http.createServer(next(handler));
};
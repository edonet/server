/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-19 18:27:03
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 创建服务
 *****************************************
 */
module.exports = function server(app, ssl) {
    let server;

    // 创建服务器
    if (ssl) {
        server = require('https').createServer(ssl, app.callback());
    } else {
        server = require('http').createServer(app.callback());
    }

    // 返回监听函数
    return {
        listen: (port, host) => (
            new Promise((resolve, reject) => {
                server.listen(port, host, err => err ? reject(err) : resolve());
            }
        ))
    };
};

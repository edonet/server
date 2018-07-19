/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-19 17:01:48
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    Koa = require('koa'),
    stdout = require('@arted/utils/stdout'),
    server = require('./server');


/**
 *****************************************
 * 创建服务器
 *****************************************
 */
module.exports = async function createServer(options) {
    let app = new Koa(),
        { https, host, port } = options,
        ssl;

    // 配置【https】
    if (https) {

        // 监听【HTTPS】请求
        app.use(require('koa-sslify')());

        // 获取证书
        ssl = await require('../ssl')();
    }

    // 返回内容
    app.use(async ctx => {
        ctx.body = 'Hello World';
    });

    // 启动服务
    await server(app, ssl).listen(port, host);

    // 打印信息
    stdout.block(
        `Project is running at http${ https ? 's' : '' }://${ host }:${ port }/`,
        `Content for webpack is served from ${ options.root }`
    );

    // 返回应用
    return app;
};

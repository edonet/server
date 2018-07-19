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
    logger = require('koa-logger'),
    staticServe = require('koa-static'),
    parseBody = require('koa-body'),
    fs = require('@arted/utils/fs'),
    path = require('@arted/utils/path'),
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
        dir = path.usedir(options.root),
        staticDir = dir(options.static),
        middlewareDir = dir(options.middleware),
        ssl;


    // 设定目录函数
    app.context.dir = dir;

    // 配置【https】
    if (https) {

        // 监听【HTTPS】请求
        app.use(require('koa-sslify')());

        // 获取证书
        ssl = await require('../ssl')();
    }

    // 监听日志
    app.use(logger());

    // 解析请求体
    app.use(parseBody());

    // 监听静态文件
    await fs.stat(staticDir) && app.use(staticServe(staticDir));

    // 加载自定义中间件
    await fs.stat(middlewareDir) && app.use(require(middlewareDir));

    // 启动服务
    await server(app, ssl).listen(port, host);

    // 打印信息
    stdout.block(
        `Project is running at http${ https ? 's' : '' }://${ host }:${ port }/`,
        `Content is served from ${ options.root }`
    );

    // 返回应用
    return app;
};

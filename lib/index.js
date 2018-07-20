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
    adopt = require('./adopt'),
    router = require('./router'),
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
        publicDir = dir(options.public),
        middlewareDir = dir(options.middleware),
        routerDir = dir(options.router),
        ssl;

    console.log(options);

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

    // 发送请求信息
    app.use(async (ctx, next) => {
        let start = + new Date();

        // 处理请求
        await next();

        // 发送信息
        process.send({
            type: 'process:server',
            data: {
                type: 'stdout',
                method: 'info',
                message: [
                    `> ${ctx.method}[${ctx.response.status}]: ${ctx.path} ${new Date() - start}ms`
                ]
            }
        });
    });

    // 解析请求体
    app.use(parseBody());

    // 监听静态文件
    await fs.stat(staticDir) && app.use(staticServe(staticDir));
    await fs.stat(publicDir) && app.use(staticServe(publicDir));

    // 加载自定义中间件
    adopt(app, fs.resolve(middlewareDir));

    // 加载路由
    router(app, fs.resolve(routerDir));

    // 启动服务
    await server(app, ssl).listen(port, host);

    // 显示信息
    process.send({
        type: 'process:server',
        data: {
            type: 'stdout',
            start: true,
            method: 'block',
            message: [
                `Project is running at http${https ? 's' : ''}://${host}:${port}/`,
                `Content is served from ${dir()}`
            ]
        }
    });

    // 返回应用
    return app;
};

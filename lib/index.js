/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-23 15:44:08
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const Koa = require('koa');
const staticServe = require('koa-static');
const parseBody = require('koa-body');
const ajax = require('request');
const fs = require('ztil/fs');
const path = require('ztil/path');
const config = require('./configure');
const logger = require('./logger');
const api = require('./api');
const server = require('./server');


/**
 *****************************************
 * 创建服务
 *****************************************
 */
module.exports = async function createServer() {
    let app = new Koa(),
        root = path.cwd(config.root),
        dir = path.usedir(root);

    // 更新配置
    config.root = root;
    config.dir = dir;

    // 配置上下文
    app.context.root = root;
    app.context.dir = dir;
    app.context.fs = fs;
    app.context.ajax = ajax;

    // 监听【https】
    config.https && app.use(require('koa-sslify')());

    // 发送请求信息
    app.use(logger());

    // 解析请求体
    app.use(parseBody());

    // 设置静态文件目录
    if (config.static && config.static.length) {
        for (let name of config.static) {
            name = dir(name);
            await fs.stat(name) && app.use(staticServe(name));
        }
    }

    // 设置【api】接口目录
    if (config.api && config.api.length) {
        for (let name of config.api) {
            name = dir(name);
            await fs.stat(name) && app.use(api(path.relative(root, name)));
        }
    }

    // 执行安装回调
    if (typeof config.install === 'function') {
        config.install(app);
    }

    // 启动服务
    await server(app, config);
};

#!/usr/bin/env node


/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-19 17:03:21
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const pm2 = require('pm2');
const path = require('ztil/path');
const config = require('../lib/configure');


/**
 *****************************************
 * 启动线程
 *****************************************
 */
pm2.connect(async function (err) {
    let dir = path.usedir(config.root),
        watch = config.api;

    // 处理错误
    if (err) {
        return console.error(err);
    }

    // 获取监听文件
    if (config.watch) {
        watch = [...watch, ...config.watch];
    }

    // 启动脚本
    await start({
        name: config.name,
        script: path.resolve(__dirname, './app.js'),
        cwd: process.cwd(),
        args: process.argv.slice(2),
        watch: [
            path.resolve(__dirname, '../lib'),
            ...watch.map(argv => dir(argv))
        ]
    });

    // 判断链接
    pm2.disconnect();
});


/**
 *****************************************
 * 启动脚本
 *****************************************
 */
function start(options) {
    return new Promise((resolve, reject) => {
        pm2.start(options, err => err ? reject(err) : resolve());
    });
}

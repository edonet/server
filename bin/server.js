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
pm2.connect(function (err) {
    let rootdir = path.usedir(path.cwd(config.root)),
        cmddir = path.usedir(__dirname),
        watch = config.api,
        options;

    // 处理错误
    if (err) {
        return console.error(err);
    }

    // 获取监听文件
    if (config.watch) {
        watch = [...watch, ...config.watch];
    }

    // 生成配置
    options = {
        name: config.name,
        script: cmddir('./app.js'),
        cwd: process.cwd(),
        args: process.argv.slice(2),
        watch: [cmddir('../lib'), ...watch.map(argv => rootdir(argv))]
    };

    // 启动消息传送
    pm2.launchBus(function(err, bus) {

        // 处理错误
        if (err) {
            return console.error(err);
        }

        // 监听消息
        bus.on('process:message', ({ data }) => console[data.method](...data.message));
    });

    // 启动脚本
    pm2.start(options, err => {

        // 处理错误
        if (err) {
            return console.error(err);
        }

        // 判断链接
        config.alive || pm2.disconnect();
    });
});


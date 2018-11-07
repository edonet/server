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
const
    pm2 = require('pm2'),
    yargs = require('yargs'),
    fs = require('@arted/utils/fs'),
    path = require('@arted/utils/path'),
    stdout = require('@arted/utils/stdout');


/**
 *****************************************
 * 初始化参数
 *****************************************
 */
yargs
    .default('root', process.cwd())
    .default('name', 'PM2_SERVER_' + Math.random().toString(16).slice(2, 10))
    .default('middleware', 'middleware')
    .default('router', 'router');


/**
 *****************************************
 * 启动线程
 *****************************************
 */
pm2.connect(async function (err) {
    let argv = yargs.argv,
        dir = path.usedir(argv.root),
        appName = argv.name,
        watch;


    // 处理错误
    if (err) {
        return stdout.error(err);
    }

    // 启动接收信息
    pm2.launchBus((err, bus) => {
        let restart = 0;

        // 处理错误
        if (err) {
            return stdout.error(err);
        }

        // 监听信息
        bus.on('process:server', ({ data }) => {

            // 打印信息
            if (data.type === 'stdout') {

                // 打印信息
                if (!data.start || !restart) {
                    stdout[data.method](...data.message);
                }

                // 统计重启次数
                data.start && restart ++;
            }
        });
    });

    // 退出进程
    process.on('SIGINT', () => {
        pm2.delete(appName, err => {
            err && stdout.error(err);
            process.exit(1);
        });
    });


    // 获取监听文件
    watch = await stat(
        dir(argv.middleware),
        dir(argv.router)
    );

    // 启动脚本
    start({
        name: appName,
        script: path.resolve(__dirname, './app.js'),
        cwd: process.cwd(),
        args: process.argv.slice(2),
        watch: [
            path.resolve(__dirname, '../lib'),
            ...watch
        ]
    });
});


/**
 *****************************************
 * 启动脚本
 *****************************************
 */
function start(options) {
    pm2.start(options, err => {

        // 处理错误
        if (err) {
            return stdout.error(err);
        }
    });
}


/**
 *****************************************
 * 获取存在的文件
 *****************************************
 */
async function stat(...args) {
    let res = await Promise.all(
            args.map(async file => await fs.stat(file) && file)
        );

    // 过滤结果
    return res.filter(file => file);
}

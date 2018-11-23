/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-23 15:44:58
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const fs = require('ztil/fs');
const ip = require('ztil/ip');
const path = require('ztil/path');
const yargs = require('yargs');


/**
 *****************************************
 * 初始化参数
 *****************************************
 */
yargs
    .alias('r', 'router')
    .alias('h', 'host')
    .alias('p', 'port');


/**
 *****************************************
 * 获取配置
 *****************************************
 */
module.exports = {
    name: 'PM2_SERVER_' + Math.random().toString(16).slice(2, 10),
    host: ip(),
    port: 80,
    root: './',
    static: ['public'],
    api: ['api'],
    ...fs.resolve(
        path.cwd('server.conf.json'),
        path.cwd('server.conf.js'),
        path.cwd('server.config.json'),
        path.cwd('server.config.js')
    ),
    ...yargs.argv
};

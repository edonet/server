/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-20 13:50:19
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    ip = require('@arted/utils/ip'),
    yargs = require('yargs'),
    server = require('../lib');


/**
 *****************************************
 * 初始化参数
 *****************************************
 */
yargs
    .default('root', process.cwd())
    .default('static', 'static')
    .default('public', 'public')
    .default('middleware', 'middleware')
    .default('router', 'router')
    .default('host', ip())
    .default('port', 10030)
    .boolean('https');


/**
 *****************************************
 * 创建服务器
 *****************************************
 */
module.exports = server(yargs.argv);


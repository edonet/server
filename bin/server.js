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
    .default('middleware', 'middleware')
    .default('host', ip())
    .default('port', 10030)
    .boolean('https');


/**
 *****************************************
 * 创建服务器
 *****************************************
 */
module.exports = server(yargs.argv);

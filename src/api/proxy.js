/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-19 18:39:54
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 代理请求
 *****************************************
 */
module.exports = {
    async get(ctx) {
        ctx.type = 'html';
        ctx.body = ctx.ajax('https://www.baidu.com/');
    },
    install(app) {
        console.log(app);
    }
};

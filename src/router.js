/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-20 10:11:43
 *****************************************
 */
'use strict';



/**
 *****************************************
 * 添加路由
 *****************************************
 */
module.exports = [
    {
        method: 'get',
        url: '/:page',
        callback: async (ctx) => {
            ctx.body = ctx.params.method + ': ' + ctx.params.page;
        }
    }
];

/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-20 11:14:54
 *****************************************
 */
'use strict';



/**
 *****************************************
 * 中间件
 *****************************************
 */
module.exports = async (ctx, next) => {
    ctx.params = { method: ctx.method || 'all' };
    await next();
};
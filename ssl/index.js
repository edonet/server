/**
 *****************************************
 * Created by lifx
 * Created on 2018-07-19 18:44:33
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('@arted/utils/fs'),
    path = require('@arted/utils/path');


/**
 *****************************************
 * 获取证书内容
 *****************************************
 */
module.exports = async function ssl() {
    let [key, cert] = await Promise.all([
            fs.readFile(path.resolve(__dirname, './server.key')),
            fs.readFile(path.resolve(__dirname, './server.pem'))
        ]);

    // 返回证书
    return { key, cert };
};

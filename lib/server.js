/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2018-11-23 19:02:50
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const fs = require('ztil/fs');


/**
 *****************************************
 * 启动服务
 *****************************************
 */
module.exports = async function server(app, { root, dir, port, host, https }) {

    // 打印信息
    console.log('-'.repeat(80));

    // 启动【https】服务
    if (https) {

        // 兼容配置
        if (https === true) {
            https = { port: 443 };
        } else if (typeof https === 'number') {
            https = { port: https };
        }

        try {
            let port = https.port || 443,
                [key, cert] = await Promise.all([
                    fs.readFile(dir(https.key || './ssl/server.key')),
                    fs.readFile(dir(https.cert || './ssl/server.pem'))
                ]);

            // 启动服务
            require('https').createServer({ key, cert }, app.callback()).listen(port, host);

            // 打印信息
            console.log(`Project is running at https://${ host }:${ port }/`);
        } catch (err) {
            console.error(err);
        }
    }

    // 启动【http】服务
    require('http').createServer(app.callback()).listen(port, host);

    // 打印信息
    console.log(`Project is running at http://${ host }:${ port }/`);
    console.log(`Content is served from ${ root }`);
    console.log('-'.repeat(80));
};

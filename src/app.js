'use strict';


/*
 *****************************
 * 定义【App】类
 *****************************
 */

const
    Router = require('./router'),
    Server = require('./server');

/*
 *****************************
 * 定义【App】类
 *****************************
 */

 class App {
    constructor(dir) {
        this.rootdir = dir;
        this.router = new Router(dir);
        this.server = new Server(this.router);
    }

    /* 监听端口 */
    listen(port, callback) {

        // 开始监听端口
        this.port = port;
        this.server.listen(port, callback || err => {

            console.log('');
            console.log('*************************************************');
            console.log('Listening at localhost: ' + port);
            console.log('Opening your system browser...');
            console.log('*************************************************');
            console.log('');

        });

        return this;
    }
 }


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = App;

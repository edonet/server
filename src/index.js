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
        this.router = router(dir);
        this.server = server(this.router);
    }

    /* 添加路由 */
    route(...args) {
        this.router.append(...args);
        return this;
    }

    /* 监听端口 */
    listen(port, callback) {

        // 创建路由解析器
        this.router.resolve();

        // 开始监听端口
        this.port = port;
        this.server.listen(port, callback || (err => {

            if (err) {
                return console.log(err);
            }

            console.log('');
            console.log('*************************************************');
            console.log('Listening at localhost: ' + port);
            console.log('Opening your system browser...');
            console.log('*************************************************');
            console.log('');

        }));

        return this;
    }
 }


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (dir, router) => {
    return new App(dir || process.cwd()).route(router);
};

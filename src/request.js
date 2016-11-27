'use strict';


/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    url = require('url'),
    qs = require('querystring');


/*
 *****************************
 * 定义【AppRequest】类
 *****************************
 */

class AppRequest {
    constructor(clientRequest) {
        this.request = clientRequest;
        this.url = url.parse(clientRequest.url);
        this.type = clientRequest.method.toLowerCase();
        this.path = this.url.pathname;
        this.headers = clientRequest.headers;

        if (this.type === 'get') {

            /* 获取【GET】参数 */
            this.param = qs.parse(this.url.query);

        } else {

            /* 获取【POST】参数 */
            this.param = '';

            /* 监听数据传输事件 */
            this.request.on('data', chunk => {
                this.param += chunk;
            });

            /* 监听数据传输完成事件 */
            this.request.on('end', () => {
                this.param = qs.parse(this.param);
            });
        }
    }

    getHeader(name) {
        return this.header[name] || '';
    }

    ready(handler) {
        this.request.on('end', handler);
        return this;
    }
}

/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = req => new AppRequest(req);

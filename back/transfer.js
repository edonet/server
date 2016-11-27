'use strict';


/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    stream = require('stream');


/*
 *****************************
 * 定义转换流【Transfer】类
 *****************************
 */

class Transfer extends stream.Transform {
    constructor(handler) {
        super();

        if (typeof handler === 'function') {
            this.handler = handler;
        }

        this._readableState.objectMode = false;
        this._writableState.objectMode = true;
    }

    // 重写【_transform】方法
    _transform(chunk, encoding, cb) {
        if (!this.handler) {
            this.push(chunk);
            return cb();
        }

        if (this.handler.length < 2) {
            let data = this.handler(chunk.toString());

            data && this.push(data);
            return cb();
        }

        this.handler(chunk.toString(), (err, data) => {
            if (err) {
                return console.log(err);
            }

            data && this.push(data);
            cb();
        });
    }
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = handler => new Transfer(handler);

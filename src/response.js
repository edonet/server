'use strict';


/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    fs = require('fs'),
    path = require('path'),
    mime = require('./mime'),
    transfer = require('./transfer');

let responseState = {
        200: res => {
            return res.writeHead(200, 'Ok');
        },
        304: res => {
            res.writeHead(304, 'Not Modified', {'Content-Type': 'text/html'});
            return res.end();
        },
        404: res => {
            res.writeHead(404, 'Not Found', {'Content-Type': 'text/html'});
            return res.end('Error: 404!');
        }
    };

/*
 *****************************
 * 定义工具方法
 *****************************
 */

class ServerRes {
    constructor(res) {
        this.response = res;
    }

    // 设置返回头信息
    setHeader(name, value) {
        if (typeof name === 'object') {
            for (let key in name) {
                if (name.hasOwnProperty(key)) {
                    this.setHeader(key, key[name]);
                }
            }
        } else if (typeof name === 'string') {
            this.response.setHeader(name, value);
        }

        return this;
    }

    // 获取返回头信息
    getHeader(name) {
        return this.response.getHeader(name);
    }

    // 移除返回头信息
    removeHeader(name) {
        this.response.removeHeader(name);
        return this;
    }

    // 写入返回头信息
    writeHead(code, message, headers) {
        this.response.writeHead(code, message, headers);
        return this;
    }

    // 设置状态信息
    setState(code, handler) {

        if (handler === undefined) {
            responseState[code](this.response);
        } else if (typeof handler === 'string') {
            responseState[code] = require(handler);
        } else if (typeof handler === 'function') {
            responseState[code] = handler;
        }

        return this;
    }

    // 设置超时时间
    setTimeout(ms, callback) {
        this.response.setTimeout(ms, callback);
        return this;
    }

    // 添加追踪信息
    addTrailers(headers) {
        this.response.addTrailers(headers);
        return this;
    }

    // 写入返回数据
    write(data, encoding, callback) {
        this.response.write(data, encoding, callback);
        return this;
    }

    // 结束返回数据
    end(data, encoding, callback) {
        this.response.end(data, encoding, callback);
        return this;
    }

    // 返回对象
    sendData(data, encoding, callback) {

        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        this.response.writeHead(200, 'Ok', {'Content-Type': 'application/json'});
        this.response.end(data, encoding, callback);
        return this;
    }

    // 返回文件流
    sendFile(file, handler, callback) {
        fs.stat(file, err => {

            if (err) {
                return typeof callback === 'function' ? callback(err) : this.setState(404);
            }

            let ext = path.extname(file).slice(1).toLowerCase(),
                rs = fs.createReadStream(file);


            // 设置Content Type
            this.response.setHeader('Content-Type', mime[ext] || 'text/plain');
            this.sendStream(rs, handler, callback);
        });
        return this;
    }

    // 返回数据流
    sendStream(stream, handler, callback) {

        this.response.writeHead(200, 'Ok');
        typeof handler === 'function' ?
            stream.pipe(transfer(handler)).pipe(this.response) :
            stream.pipe(this.response);

        if (typeof callback === 'function') {
            stream.on('error', callback);
            stream.on('end', callback);
        }
        return this;
    }
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = res => new ServerRes(res);

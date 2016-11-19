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


/*
 *****************************
 * 定义返回状态
 *****************************
 */
let appResponse = {
        '304': respondNotModified,
        '404': respondNotFound,
        'data': respondData,
        'file': respondFile
    };


/*
 *****************************
 * 定义工具方法
 *****************************
 */

// 返回【304】未作修改
function respondNotModified(req, res) {

    // 设置【304】返回
    res.writeHead(304, 'Not Modified');
    res.end();

    return false;
}

// 返回【404】找不到文件
function respondNotFound(req, res) {

    // 设置【404】返回
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('Error: 404!');

    return false;
}

// 返回数据
function respondData(data) {
    return (req, res) => {

        // 输出数据
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();

        return false;
    };
}

// 返回文件
function respondFile(dir, handler) {
    return (req, res) => {

        // 获取文件状态
        fs.state(dir, err => {

            // 文件不存在
            if (err) {
                return appResponse[404]();
            }

            // 获取文件类型
            let ext = path.extname(dir).slice(1),
                rs = fs.createReadStream(dir);

            // 设置返回状态
            res.setHeader('Content-Type', mime[ext] || 'text/plain');
            res.writeHead(200, 'Ok');

            // 返回数据
            return typeof handler === 'function' ?
                rs.pipe(transfer(handler)).pipe(res) : rs.pipe(res);
        });

        return false;
    };
}

/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (state, ...args) => {

    let handler = args[0];

    if (typeof handler === 'function') {
        return appResponse[state] = handler;
    }

    return state in appResponse && appResponse[state](...args);
};

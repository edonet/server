'use strict';

/*
 *****************************
 * 载入依赖模块
 *****************************
 */

const
    fs = require('fs'),
    path = require('path'),
    zlib = require('zlib'),
    mime = require('./mime');


/*
 *****************************
 * 定义工具方法
 *****************************
 */

// 解析请求
function parseRequest(dir, onError) {

    // 返回请求处理方法
    return (req, res, next) => {
        let url = req.path.slice(1) || 'index.html',
            ext = path.extname(url).slice(1).toLowerCase();


        // 获取文件路径
        url = path.normalize(url.replace(/\.\./g, ''));
        url = path.resolve(dir, url);

        // 获取文件状态
        fs.stat(url, (err, stats) => {

            // 查找文件失败
            if (err) {
                return onError(req, res);
            }

            let lastModified = stats.mtime.toUTCString(),
                ifModifiedSince = req.headers['if-modified-since'];

            // 设置最后修改时间
            res.setHeader('Last-Modified', lastModified);

            // 设置Content Type
            res.setHeader('Content-Type', mime[ext] || 'text/plain');

            // 判断是否已经修改过并返回
            if (ifModifiedSince && lastModified === ifModifiedSince) {
                res.writeHead(304, 'Not Modified');
                return res.end();
            }

            // 保存文件属性
            req.filepath = url;
            req.extension = ext;

            next();
        });
    };
}

// 设置请求超时时间
function setRequestExpires(cacheType, maxAge) {

    // 返回请求处理方法
    return (req, res) => {
        if (cacheType.test(req.extension)) {
            let expires = new Date();

            // 设置缓存时间
            expires.setTime(expires.getTime() + maxAge);
            res.setHeader('Expires', expires.toUTCString());
            res.setHeader('Cache-Control', 'max-age=' + maxAge);
        }
    };
}

// 压缩返回内容
function zlibResponse(zlibType) {

    // 返回请求处理方法
    return (req, res) => {
        let raw = fs.createReadStream(req.filepath),
            matched = zlibType.test(req.extension);

        if (matched) {
            let acceptEncoding = req.headers['accept-encoding'] || '';

            if (acceptEncoding.match(/\bgzip\b/)) {

                // 启用【gzip】压缩
                res.writeHead(200, 'Ok', {'Content-Encoding': 'gzip'});
                return raw.pipe(zlib.createGzip()).pipe(res.response);
            }

            if (acceptEncoding.match(/\bdeflate\b/)) {

                // 启用【deflate】压缩
                res.writeHead(200, 'Ok', {'Content-Encoding': 'deflate'});
                raw.pipe(zlib.createDeflate()).pipe(res.response);
            }
        }

        // 直接输出
        res.writeHead(200, 'Ok');
        raw.pipe(res.response);
    };
}


/*
 *****************************
 * 抛出接口
 *****************************
 */

module.exports = (dir, options = {}) => {
    let {
            maxAge = 31536000000,
            zlibType = /^(css|js|html)$/g,
            cacheType = /^(gif|png|jpg|js|css|svg)$/g,
            onError = (req, res) => {
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('Error: 404!');
            }
        } = options;

    return [
        {
            context: dir,
            handler: parseRequest(dir, onError),
        },
        {
            context: dir,
            handler: setRequestExpires(cacheType, maxAge),
        },
        {
            context: dir,
            handler: zlibResponse(zlibType)
        },
    ];
};

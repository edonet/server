'use strict';

const
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    mime = require('./mime');

module.exports = dir => (req, res, next) => {
    let pathname = url.parse(req.url).pathname.slice(1) || 'index.html',
        ext = path.extname(pathname).slice(1).toLowerCase(),
        data = {};

    // 序列化文件路径
    pathname = path.normalize(pathname.replace(/\.\./g, ''));

    // 缓存数据
    data.extension = ext;
    data.mime = mime[ext] || 'text/plain';
    data.path = path.resolve(dir, pathname);

    // 设置Content Type
    res.setHeader('Content-Type', data.mime);

    // 获取文件状态
    fs.stat(data.path, (err, stats) => {

        // 查找文件失败
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end('Error: 404!');
        }

        var lastModified = stats.mtime.toUTCString(),
            ifModifiedSince = req.headers['if-modified-since'];

        // 设置最后修改时间
        res.setHeader('Last-Modified', lastModified);

        // 判断是否已经修改过并返回
        if (ifModifiedSince && lastModified === ifModifiedSince) {
            res.writeHead(304, 'Not Modified');
            return res.end();
        }

        data.stats = stats;
        req.data = data;
        next();
    });
};

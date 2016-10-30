'use strict';

const
    fs = require('fs'),
    zlib = require('zlib');


module.exports = zlibType => (req, res) => {
    let data = req.data,
        raw = fs.createReadStream(data.path),
        acceptEncoding = req.headers['accept-encoding'] || '',
        matched = zlibType.test(data.extension);

    if (matched && acceptEncoding.match(/\bgzip\b/)) {

        // 启用【gzip】压缩
        res.writeHead(200, 'Ok', {'Content-Encoding': 'gzip'});
        raw.pipe(zlib.createGzip()).pipe(res);
    } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

        // 启用【deflate】压缩
        res.writeHead(200, 'Ok', {'Content-Encoding': 'deflate'});
        raw.pipe(zlib.createDeflate()).pipe(res);
    } else {

        // 直接输出
        res.writeHead(200, 'Ok');
        raw.pipe(res);
    }
};

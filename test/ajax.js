'use strict';

const
    http = require('http');

module.exports = options => {
    let { port, path, method } = options,
        callback = res => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                options.callback(data);
            });
        },
        req = http.request({ port, path, method }, callback);

    method === 'POST' && req.write('Test');
    req.end();
};

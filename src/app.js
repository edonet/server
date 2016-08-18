'use strict';

const
    http = require('http'),
    sieve = require('./sieve'),
    parse = require('./parse'),
    expires = require('./expires'),
    response = require('./response');


let zlibType = /^(css|js|html)$/g,
    cacheType = /^(gif|png|jpg|js|css|svg)$/g;


module.exports = dir => http.createServer(sieve(
    parse(dir),
    expires(cacheType),
    response(zlibType)
));

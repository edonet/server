#!/usr/bin/env node

'use strict';

const
    path = require('path'),
    args = require('./args'),
    server = require('../src'),
    cwd = process.cwd();


let
    dist = args.d || args.dist,
    port = args.p || args.port;


if (dist && dist !== true) {
    dist = path.resolve(cwd, dist);
} else {
    dist = args._[0] ?
        path.resolve(cwd, args._[0]) : cwd;
}

server(dist).listen(port);

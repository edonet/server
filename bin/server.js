#!/usr/bin/env node

'use strict';

const
    path = require('path'),
    args = require('./args'),
    server = require('../src'),
    cwd = process.cwd();


let
    dist = args.d || args.dist,
    port = args.p || args.port || 8088;


if (dist && dist !== true) {
    dist = path.resolve(cwd, dist);
} else {
    dist = args._[0] ?
        path.resolve(cwd, args._[0]) : cwd;
}

server(dist).listen(port, err => {

    if (err) {
        return console.log(err);
    }

    console.log('');
    console.log('*************************************************');
    console.log('Listening at localhost: ' + port);
    console.log('Opening your system browser...');
    console.log('*************************************************');
    console.log('');
});

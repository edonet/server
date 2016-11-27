'use strict';

// const
//     http = require('http');

// http.createServer((req, res) => {
//     var data = '';

//     req.on('data', chunk => data += chunk);
//     req.on('end', err => {
//         console.log(err);
//         console.log(data);
//         res.writeHeader(404, 'Not Found!');
//         res.end('Error!');
//         console.log(Object.keys(res));
//     });
// }).listen(10088);


var fun = (...args) => console.log(args.length);

fun(undefined);

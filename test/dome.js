'use strict';

const
    utils = require('../src/utils')


utils.override('add', (a) => a + 10);
utils.override('add', (a, b) => a + b);
utils.override('add', (a, b, c) => a + b - c);
utils.override('add', (a, b, c, d) => a + b - c - d);


let fun = utils.override('add');

console.log(fun(1));
console.log(fun(1, 2));
console.log(fun(1, 2, 3));
console.log(fun(1, 2, 3, 4));
console.log(fun(1, 2, 3, 4, 5));

console.log(utils.type(1, 'a', null, undefined, /^a/));


/*
let arr = [1, 2, 2];

console.log(fun(4, ...arr));

// app.route(url, path);
app.route('/index', './index');

// app.route(url, handler);
app.route('/index', (req, res) => res.sendFile('./index.html'));

// app.route(url, options);
app.route('/index', {
    type: 'post',
    handler: (req, res) => res.sendFile('./index.html')
});

// app.route(path);
app.route('./index');

// app.route(options);
app.route({
    url: '/index',
    type: 'post',
    handler: (req, res) => res.sendFile('./index.html')
});

// app.route(routeList);
app.route([
    {
        url: '/index',
        type: 'post',
        handler: (req, res) => res.sendFile('./index.html')
    }
]);

// app.route(type, url, handler);
app.route('post', '/index', (req, res) => res.sendFile('./index.html'));
*/

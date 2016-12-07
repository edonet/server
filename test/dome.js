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


let arr = [1, 2, 2];

console.log(fun(4, ...arr));


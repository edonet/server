'use strict';

let argv = process.argv.slice(2),
    len = argv.length,
    regexp = /^--?([\w\-]+)(?:=([\w\-]+))?$/,
    data = { _: [] };


len -- && argv.reduce((prev, curr, i) => {
    let patt = curr.match(regexp);

    if (patt) {
        if (prev) {
            data[prev] = true;
        }

        if (patt[2]) {
            data[patt[1]] = patt[2];
            return null;
        } else if(len === i) {
            data[patt[1]] = true;
            return null;
        } else {
            return patt[1];
        }
    }

    if (prev) {
        data[prev] = curr;
    } else {
        data._.push(curr);
    }

    return null;
}, null);

module.exports = data;

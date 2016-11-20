'use strict';

const
    path = require('path');

module.exports = (req, res) => {
    let url = path.join(__dirname, './post.js');

    res.sendFile(url);
    return false;
};

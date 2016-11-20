'use strict';

module.exports = (res, req) => {
    req.sendData({ type: 'post', data: 'This is a post router!' });
    return false;
};

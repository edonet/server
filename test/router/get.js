'use strict';

module.exports = (res, req) => {
    req.sendData({ type: 'get', data: 'This is a get router!' });
    return false;
};

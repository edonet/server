'use strict';

module.exports = (cacheType, maxAge = 31536000000) => (req, res) => {
    let data = req.data;

    if (cacheType.test(data.extension)) {
        let expires = new Date();

        expires.setTime(expires.getTime() + maxAge);
        res.setHeader('Expires', expires.toUTCString());
        res.setHeader('Cache-Control', 'max-age=' + maxAge);
    }
};

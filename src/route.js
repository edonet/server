'use strict';

class Route {
    constructor(...args) {

    }

    resolve(req, res) {
        if (req.path !== this.path) {
            let cacheContext = res.context;

            res.context = this.context;
        }
    }
}

module.exports = Route;

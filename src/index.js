'use strict';


const
    server = require('./server'),
    assets = require('./assets');


class Server {
    constructor() {
        this.handler = [];
        this.server = server((req, res) => {
            res.end(JSON.stringify(req));
        });
    }

    route(type, path, callback) {
        if (typeof callback !== 'function') {
            return this;
        }

        this.handler.push((req, res, next) => {
            if (req.type === type && req.path === path) {
                return callback(req, res, next);
            }
        });

        return this;
    }

    get(path, callback) {
        return this.route('get', path, callback);
    }

    post(path, callback) {
        return this.route('post', path, callback);
    }

    assets(path) {
        this.feedback = assets(path);
        return this;
    }

    listen(port, callback) {
        this.server.listen(port, callback);
    }
}



module.exports = options => new Server(options);

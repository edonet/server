'use strict';

const
    app = require('./app');


class StaticServer {
    constructor(dir) {
        this.server = app(dir);
    }
    listen(port = 8088) {
        this.server.listen(port, () => {
            console.log('');
            console.log('> -------------------------------------------------');
            console.log('> server listening on: http://localhost: %s', port);
            console.log('> open your brower and enjoy it.');
            console.log('> -------------------------------------------------');
            console.log('');
        });
    }
}


module.exports = dir => new StaticServer(dir);

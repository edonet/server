'use strict';

const
    ajax = require('./ajax'),
    server = require('../src'),
    app = server(__dirname),
    port = 10086;

app
    .get('/get', './router/get')
    .post('/post', './router/post')
    .route('/file', './router/file')
    .route('/route', (res, req) => {
        req.sendData({ type: 'route', data: 'This is a default router!' });
        return false;
    })
    .listen(port, () => {

        console.log('Listen port 10086 start!');

        // 测试【GET】请求
        ajax({
            port,
            path: '/get',
            method: 'GET',
            callback: data => console.log('Test: ', data)
        });

        // 测试【POST】请求
        ajax({
            port,
            path: '/post',
            method: 'POST',
            callback: data => console.log('Test: ', data)
        });

        // 测试【route】请求
        ajax({
            port,
            path: '/route',
            method: 'DELETE',
            callback: data => console.log('Test: ', data)
        });

        // 测试【file】请求
        ajax({
            port,
            path: '/file',
            method: 'GET',
            callback: data => console.log(data)
        });
    });



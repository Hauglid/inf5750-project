var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var app = express();
var open = require("open");

var compiler = webpack(webpackConfig);


app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false,
    },
    historyApiFallback: true,
}));

app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
}));

app.use(express.static(__dirname + '/www'));

var port = 8081;
var host = "localhost";

var server = app.listen(port, host, function () {
    var serverHost = server.address().address;
    var serverPort = server.address().port;
    console.log('Example app listening at http://%s:%s', serverHost, serverPort);
    open("http://" + host + ":" + serverPort);

});


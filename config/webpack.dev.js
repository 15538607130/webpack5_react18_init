/**
 * webpack 开发环境 配置
 * 
 * **/
const path = require('path')

/* 合并 webpack 配置*/
const { merge } = require('webpack-merge')
/* 生产换进和开发环境的 公共 配置*/
const common = require('./webpack.common')
/* 结合react-refresh 实现react组件保留状态热更新 且浏览器无刷新的效果*/
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
    mode: 'development', // webpack 环境设置
    devtool: 'eval-cheap-source-map', // 开发环境 配置source map 
    /* 本地调试服务配置 */
    devServer: {
        port: 80, //端口   
        host: 'localhost', //局域网访问可填写'0.0.0.0'
        hot: true, //启动热更新 webpack5 内置热更新
        open: true, // 启动服务时 开启浏览器
        compress: false,//gzip压缩，开发环境下不用开启，提升热更新的速度
        historyApiFallback: true, //解决history路由一刷新变404的问题
        static: {
            /* 托管静态资源public文件夹 */
            directory: path.resolve(__dirname, '../public')
        },
    },
    plugins: [
        /* 热更新插件 且只能在development 环境下开启 需要在babel-loader配置 */
        new ReactRefreshWebpackPlugin(),
    ]
})
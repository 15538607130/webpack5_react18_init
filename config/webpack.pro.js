
const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')
/** 复制文件插件 **/
const CopyPlugin = require('copy-webpack-plugin');
/** 压缩css 插件 **/
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
/**  清理无用css **/
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
/**  压缩文件 生成 .gz文件 **/
const CompressionPlugin = require('compression-webpack-plugin')
/** 打包时 抽离css插件 **/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const globAll = require('glob-all')

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        // 复制文件插件
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'), // 复制public下文件
                    to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
                    filter: source => {
                        return !source.includes('index.html') // 忽略index.html
                    }
                },
            ],
        }),
        // 抽离css插件
        new MiniCssExtractPlugin({
            filename: 'css/[contenthash:8].css' // 抽离css的输出目录和名称
        }),
        // 清理无用css
        new PurgeCSSPlugin({
            // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
            // 只打包这些文件中用到的样式
            paths: globAll.sync([
                `${path.join(__dirname, '../src')}/**/*.tsx`,
                path.join(__dirname, '../public/index.html')
            ]),
        }),
        new CompressionPlugin({
            test: /.(js|css)$/, // 只生成css,js压缩文件
            filename: '[path][base].gz', // 文件命名
            algorithm: 'gzip', // 压缩格式,默认是gzip
            threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
            minRatio: 0.8 // 压缩率,默认值是 0.8
        })
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // 压缩css
            /** 默认是压缩js文件的  **/
            /** 访问默认值 **/
            '...'
        ],
        /** 分隔代码 **/
        splitChunks: {
            cacheGroups: {
                vendors: { // 提取node_modules代码
                    test: /[\\/]node_modules[\\/]/, // 只匹配node_modules里面的模块
                    name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
                    minChunks: 1, // 只要使用一次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                    priority: 1, // 提取优先级为1
                },
                components: { // 提取页面公共代码
                    name: 'components', // 提取文件命名为components
                    minChunks: 2, // 只要使用两次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                }
            }
        }
    },
})

// webpack 将根据以下条件自动拆分 chunks：
// 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
// 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
// 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
// 当加载初始化页面时，并发请求的最大数量小于或等于 30
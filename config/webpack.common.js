const path = require('path')
const webpack = require('webpack')
/** 生成HTML模版 **/
const HtmlWebpackPlugin = require('html-webpack-plugin')
/** 生产环境 打包 抽离css插件 **/
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


const isDEV = process.env.NODE_ENV === 'development' // 是否是开发模式

module.exports = {
    /* 入口文件 */
    entry: path.resolve(__dirname, '../src/index.tsx'),
    /* 输出目录 */
    output: {
        /* 指点输出文件的名字格式 */
        filename: 'js/[name].[chunkhash:8].js',
        /* 指点输出文件的路径 */
        path: path.resolve(__dirname, '../dist'),
        /* webpack 内置了 用来删除之前的dist文件，4之前的需要 clean-webpack-plugin */
        clean: true,
    },
    cache: {
        // webpack5通过缓存生成的webpack模块和chunk
        // 开启持久化存储缓存 改善了下一次打包的构建速度  第一次会时间长
        type: 'filesystem', // 使用文件缓存
    },
    module: {
        rules: [
            // 对于图片文件,webpack5采用自带的asset-module来处理
            {
                test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
                type: "asset", // type选择asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 小于10kb转base64位
                    }
                },
                generator: {
                    filename: 'images/[contenthash:8][ext]', // 文件输出目录和命名
                },
            },
            // 处理字体
            {
                test: /\.(woff2?|ttf|eot)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: 10 * 1024
                },
                generator: {
                    filename: 'font/[contenthash:8][ext]'
                }
            },
            // 处理 音频 视频 文件
            {
                test: /\.(mp4|mp3|webm|wav|flac|aac|ogg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: 10 * 1024
                },
                generator: {
                    filename: 'media/[name][ext]'
                }
            },
            // loader执行顺序是从右往左,从下往上的,匹配到css文件后先用css-loader解析css, 最后借助style-loader把css插入到头部style标签中。
            {
                test: /\.css$/, //匹配 css和less 文件
                use: [
                    isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/, //匹配 css和less 文件
                use: [
                    isDEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('autoprefixer')]
                            }
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                                        "targets": {
                                            "chrome": 35,
                                            "ie": 9
                                        },
                                        // "skipEnvCheck:": true,
                                        "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                                        "corejs": 3, // 配置使用core-js低版本
                                    }
                                ],
                                "@babel/preset-react",
                                "@babel/preset-typescript"],
                            /** 配置react-refresh 插件在dev环境使用  **/
                            plugins: isDEV ? [require.resolve('react-refresh/babel')] : []
                        },
                    }
                ]
            }
        ]
    },
    resolve: {
        // 配置js tsx ts 文件 引入的时候不用带后缀名
        extensions: ['.js', '.tsx', '.ts'],
        //配置没有配置准确路径的 直接查找 node_modules     查找第三方模块只在本项目的node_modules中查找
        modules: [path.resolve(__dirname, '../node_modules')],
        /** 配置别名 **/
        alias: {
            '@': path.join(__dirname, '../src')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            /* 需要在HTML模版的title中  <%= htmlWebpackPlugin.options.title %> */
            title: 'dev-webpack',
            template: path.resolve(__dirname, '../public/index.html'),
            inject: true//自动注入静态资源
        }),
        // 在 文件中注入 环境变量
        new webpack.DefinePlugin({
            // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        })
    ]
}
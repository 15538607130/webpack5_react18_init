# webpack 配置说明






打包文件名 明明规则

- hash：跟整个项目的构建有关，只要项目里面有文件修改，那么整个项目构建的hash都会改变
- chunkhash: 文件本身修改或者依赖的文件修改，chunkhash值会改变
- contenthash: 每个文件有一个单独的hash值，文件的改动只会影响自身的hash

css、媒体、图片资源:一般都是单独存在的,可以采用contenthash,只有文件本身变化后会生成新hash值
js:我们在生产环境里会把一些公共库和程序入口文件区分开,单独打包构建。
采用chunkhash的方式生成哈希值,那么只要我们不改动公共库的代码,就可以保证其哈希值不会受影响,可以继续使用浏览器缓存,所以js适合使用chunkhash。
这样做的目的：缓存文件

用到的 开发和打包的 插件
```json
    "babel-loader": "^9.1.2",
    "@babel/core": "^7.21.3",   // 用于 babel-loader
    "@babel/preset-env": "^7.20.2", // 用于 babel-loader 将代码降级编译到目标环境 如兼容ie 或者 es6-->es5
    "@babel/preset-react": "^7.18.6",// 用于 babel-loader 解析 react jsx
    "@babel/preset-typescript": "^7.21.0", // 用于 babel-loader 解析typescript
    "@babel/plugin-transform-runtime": "^7.21.0", // 用于 babel-loader

    // react typescript类型
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",

    //  热更新 浏览器无刷新 组件状态不变
    "react-refresh": "^0.14.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.10",

    // 命令 向环境中注入环境便令
    "cross-env": "^7.0.3",

    // webpack 解析css less 的loader
    "css-loader": "^6.7.3",
    "less": "^4.1.3",
    "less-loader": "^11.1.0",
    "style-loader": "^3.3.2",
    "postcss-loader": "^7.1.0",
    //  postcss-loader 向css文件中注入前缀
    "autoprefixer": "^10.4.14",

    // 压缩文件 生成 .gz文件
    "compression-webpack-plugin": "^10.0.0",
    "copy-webpack-plugin": "^11.0.0",
    // css压缩插件 webpack 默认之压缩js文件
    "css-minimizer-webpack-plugin": "^4.2.2",
    "glob-all": "^3.3.1",
    // 生成HTML模版
    "html-webpack-plugin": "^5.5.0",
    // 压缩css 插件
    "mini-css-extract-plugin": "^2.7.5",
    // 清理无用的css类名
    "purgecss-webpack-plugin": "^5.0.0",

    // webpack 工具
    "webpack": "^5.76.2",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.12.0",
    "webpack-merge": "^5.8.0"

```
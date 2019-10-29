const path = require('path')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = webpackMerge(baseWebpackConfig,{
    mode: "development",
    plugins:[
        new HtmlWebpackPlugin({
            filename: path.join(__dirname,'../dist/index.html'),
            template: "index.html"
        })
    ],
    // 开发环境本地启动的服务配置
    devServer:{
        historyApiFallback:true, // 当找不到路径的时候，默认加载index.html文件
        hot:true,
        contentBase:false, // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
        compress:true,
        port:'3000', // 指定端口
        publicPath:'/', // 访问资源加前缀
        proxy:{
            // 接口请求代理
        }
    }
}) 

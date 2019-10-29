const path = require('path')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = webpackMerge(baseWebpackConfig,{
    mode:'development',
    plugins:[
        new HtmlWebpackPlugin ({
            filename:path.join(__dirname,'../dist/index.html'),
            template:'index.html',
            minify:{
                removeComments:true,  // 去除注释
                collapseWhitespace:true, // 压缩空格
                removeAttributeQuotes:true // 去除属性引用
            }
        }),
        new CleanWebpackPlugin()
    ]
}) 

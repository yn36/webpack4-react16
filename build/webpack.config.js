const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: "development",
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/index.js',
        publicPath: '/'
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename:path.join(__dirname,'../dist/index.html'),
            template:'index.html'
        })
    ]
}
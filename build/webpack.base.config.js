const path = require('path')
module.exports = {
    mode: "development",
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/index.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {test:/\.jsx?$/, use: 'babel-loader', exclude: /node_modules/},
            {test: /\.s?css$/, use: ['style-loader','css-loader','sass-loader']},
            {
                test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit:10000,
                    name:'static/images/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            '@': path.join(__dirname, '..', 'src')
        }
    }
}
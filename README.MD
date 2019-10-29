# **webpack4 + react16配置**

# 一、初始化项目
###  首先执行 ``npm init -y`` ，根目录会出现 `package.json`文件，如下图：
<img src="https://raw.githubusercontent.com/yn36/webpack4-react16/master/mdimages/package.jpg">


## 1、 安装webpack基本包
```
npm install --D webpack webpack-dev-server webpack-cli
```
⚠️⚠️ ``webpack4.x`` 必须安装``webapck-cli``，这是一个注意事项

新建``src/index.js``，添加代码如下
```
console.log("hello world")
```
在 `package.json` 的 `scripts` 执行脚本添加 `"build":"webpack"`

在终端执行 `npm run build` ，可以看到在根目录生成了 `dist/main.js` 的打包文件，这是 `webpack4.x` 打包默认找 `src/index.js` 打包入口，如下图：

<img src="https://raw.githubusercontent.com/yn36/webpack4-react16/master/mdimages/runbuild.jpg">

<img src="https://raw.githubusercontent.com/yn36/webpack4-react16/master/mdimages/1572333725542.jpg">

## 2、**开始正式配置webpack**

### ①、项目根目录创建build目录，创建 `webpack.config.js`

```
const path = require('path')

module.exports = {
    // 指定构建环境 
    mode: "development",

    // 入口
    entry: path.join(__dirname, '../src/index.js'),

    // 出口
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/index.js',
        publicPath: '/'
    }
}
```
### ②、编写，配置html模板，实现html模板的打包，安装插件
```
npm install -D html-webpack-plugin
```
### 在根目录创建index.html模板，代码很简单
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>mydemo</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

### ③、在webpack.config.js的plugins添加
```
new HtmlWebpackPlugin({
   filename:path.join(__dirname,'../dist/index.html'),
   template:'index.html'
})
```
⚠️⚠️⚠️ 先引用 `html-webpack-plugin`
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
```
### ④、修改 `package.json` 的build命令为指定配置文件构建打包 ` "build": "webpack --config build/webpack.config.js" `，然后再次执行 `npm run build`，这时候已经可以把html模板和打包后的资源插入到html模板，最后打包进dist目录

## 3、**抽取webpack配置文件**

### 为了区分开发环境和生产环境，下面我们一步一步抽取wenpack公共配置分别创建  ，`webpack.base.config.js` ， `webpack.dev.config.js` ， `webpack.prod.config.js`

### 在抽取webpack配置过程中，需要使用webpack-merge插件，安装方式
```
npm install -D webpack-merge
```
### 这个插件是用来合并webpack配置的，可以对不同文件的webpack配置合并成一个完整的webpack配置。具体用法请看下面 👇

### `webpack.base.config.js` 是webpack在不同环境的公共配置 
```
const path = require('path')
module.exports = {
    mode: "development",
    entry: path.join(__dirname, '../src/index.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'js/index.js',
        publicPath: '/'
    },
}
```

### `webpack.dev.config.js` 是项目开发环境的配置
```
const path = require('path')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = webpackMerge(baseWebpackConfig,{
    mode:'development',
    plugins:[
        new HtmlWebpackPlugin ({
            filename:path.join(__dirname,'../dist/index.html'),
            template:'index.html'
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
```

### `webpack.prod.config.js` 是项目生产环境环境的配置
⚠️⚠️⚠️ 我们重新打包想把之前打包过的文件先删除在重新打包那就需要用到 `clean-webpack-plugin` 我们先安装
```
npm install -D clean-webpack-plugin
```
### `webpack.prod.config.js` 文件:
```
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
```
### 再修改package.json的build命令:
```
"build": "webpack --config build/webpack.prod.config.js"
```
### 然后再次执行npm run build，一切正常！

### **配置开发环境webpack.dev.config.js**
### 开发环境需要我们使用`webpack-dev-server`插件，上边已经安装过
### ①、添加package.json命令，用webpack-dev-server启动服务
```
"start": "webpack-dev-server --inline --open --progress --config build/webpack.dev.config.js"
```
### 执行npm start，你会看到配置的资源和html模板已经被webpack构建
### 这时候浏览器打开http://localhost:3000，看到src/index.js的内容执行了
<img src="https://raw.githubusercontent.com/yn36/webpack4-react16/master/mdimages/1572338108607.jpg">

# 

# 二、引入react框架
### 安装react
```
npm install -S react react-dom
```

### 修改src/index.js文件，使用`react，react-dom`把`react`的页面插入到html模板id为app的盒子当中;
```
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<h1>hello world</h1>,document.getElementById('app'))
```

### 重新运行项目npm start，不出意外你惊讶的发现报错了⚠️。这是此时webpack**还不能** 🙅‍编译构建react的代码，那么接下来我们进行支持react的打包构建

### **支持react的打包构建（配置webpack）**
### 我们都知道，要想把react的代码使用webpack编译构建成浏览器可以运行的代码，需要使用babel等工具进行"翻译一下"

### ①、安装，配置babel（babel7.x）
```
npm install -D @babel/core @babel/preset-env @babel/preset-react 
```
```
npm install -D @babel/plugin-transform-runtime @babel/runtime @babel/runtime-corejs2
```
* `@babel/core babelbabel`的核心库
* `@babel/preset-env` 把es6,es7语法转换成es5
* `@babel/preset-react` 把react语法转换为es5
* `@babel/plugin-transform-runtime` 支持一些es6，es7的新语法

### 安装完，我们需要添加babel的配置了，在项目目录创建`.babelrc`，配置内容如下

```
{
    "presets": [
      ["@babel/preset-env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "@babel/preset-react"
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime",{
        "corejs": 2,
        "useBuildIns":"usage"
      }]
    ]
}
```

### ②、webpack4.x配置编译打包规则

### 安装loaders
* babel-loader使用babel进行编译项目
    ```
    npm install -D babel-loader
    ```
* style-loader，css-loader编译css文件
    ```
    npm install -D style-loader css-loader
    ```
* url-loader file-loader引入文件路径（图片，字体）
    ```
    npm install -D url-loader file-loader
    ```
* sass-loader识别scss文件
    ```
    npm install -D sass-loader node-sass
    ```
### 安装完这些包之后，我们需要在webpacl.base.config.js添加打包编译构建规则在module下添加rules属性
```
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
```

### 这些配置相比vue框架的配置少了对vue文件的编译构建配置。你会发现在vue项目`vue-loader`，`vue-style-loader`，`vue-template-compiler`这三个插件是必不可少的，这是用来处理vue文件的包

### 继续在`webpack.base.config.js`添加

```
resolve: {
    extensions: [".js", ".jsx"],
    alias: {
        '@':path.join(__dirname,'..','src')
    }
}
```
### 编写页面，运行项目，测试打包

### 执行`npm start`，打包成功
### 执行打包后的文件需要前端服务这时我们安装 `live-server`
```
npm install live-server -g
```

# 
# 

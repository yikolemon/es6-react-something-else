const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js', // 指定入口文件
    output: {
        filename: 'bundle.js', // 输出的文件名
        path: path.resolve(__dirname, 'dist'), // 输出的目录
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // 配置开发服务器的根目录
        hot: true, // 启用HMR
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 添加HMR插件
    ],
};

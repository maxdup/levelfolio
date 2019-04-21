const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash].bundle.js'
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [{loader: 'style-loader'},
             {loader: 'css-loader'},
             {loader: 'less-loader'}]
    },{
      test: /\.html$/,
      loader: 'html-loader'
    },{
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader']
    },{
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }]
  },
  plugins: [
    new FaviconsWebpackPlugin('./src/images/icons/favicon.png'),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      inject: true,
      chunks: ['app'],
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      $: 'jquery'
    })
  ]
}

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    publicPath: '/',
    filename: '[name].[contenthash].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    inline: true,
    port: 8080,
    stats: 'errors-only',
    historyApiFallback: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node-modules/,
      loader: 'babel-loader',
    },{
      test: /\.less$/,
      use: [{loader: 'style-loader'},
             {loader: 'css-loader'},
             {loader: 'less-loader'}]
    },{
      test: /\.(html)$/,
      loader: 'html-loader'
    },{
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader']
    },{
      test: /\.(png|jpg|gif|obj|mtl)$/,
      use: [{
        loader: 'file-loader',
        options: { outputPath: 'files'}
      }]
    },{
      test: /\.font\.js/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'webfonts-loader']
    },{
      test: /\.svg$/,
      loader: 'svg-inline-loader'
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.bundle.[contenthash].css'
    }),
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

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, 'deploy'),
    publicPath: '/',
    filename: '[name].[contenthash].bundle.js'
  },
  devServer: {
    port: 8000,
    watchFiles: ['src/**/*']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node-modules/,
      loader: 'babel-loader',
    },{
      test: /\.scss$/,
      use: [MiniCssExtractPlugin.loader,
            { loader: 'css-loader' },
            { loader: 'sass-loader' }]
    },{
      test: /\.(html)$/,
      loader: 'html-loader'
    },{
      test: /\.font\.js/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            url: false
          }
        },
        'webfonts-loader']
    },{
      test: /\.svg$/,
      loader: 'svg-inline-loader'
    },{
      test: /\.(woff|woff2|eot|ttf|otf|svg|jpg|jpeg|png|gif|webp|mtl|obj)$/i,
      type: 'asset/resource',
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app.bundle.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      chunks: ['app'],
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{from: 'static', to: 'static'},
                 {from: 'meta'}],
    }),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      $: 'jquery'
    })
  ]
}

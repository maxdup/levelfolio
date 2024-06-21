const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

buildConfig = {
  optimization: {
    minimize: false
  },
  output: {
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new FaviconsWebpackPlugin('./images/icons/favicon.png'),
  ]
}
module.exports = merge(common, buildConfig)

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

buildConfig = {
  output: {
    publicPath: '/',
  },
  plugins: [
    new FaviconsWebpackPlugin('./src/images/icons/favicon.png'),
  ]
}
module.exports = merge(common, buildConfig)

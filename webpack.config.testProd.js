import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'fs';

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;


const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.BASE_API': JSON.stringify('https://test-api.dook.sa/api/'),
  'process.env.BASE_STREAMS': JSON.stringify('https://test-api.dook.sa/api/'),
  'process.env.__VERSION__': JSON.stringify(version),
  'process.env.publicPath': 'https://test.dook.sa/',
  __DEV__: false
};

export default {
  debug: true,
  devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: false, // set to false to see a list of every file being bundled.
  entry: ['whatwg-fetch','babel-polyfill','./src/index'],
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.[hash].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Delivery System',
      template: './src/index.html',
      inject: true
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'file-loader?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=application/octet-stream'},      
      {test: /\.(jpe?g|png|svg|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      {
        test: /(\.css|\.scss)$/,
        include: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract('css?sourceMap!sass?sourceMap')
      },
      {test: /\.json$/, loader: 'json-loader'}
    ]
  }
};

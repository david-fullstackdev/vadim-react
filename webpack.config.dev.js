import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'fs';
import autoprefixer from 'autoprefixer';

const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  'process.env.BASE_API': JSON.stringify('https://dev-api.dook.sa/api/'),
  'process.env.BASE_STREAMS': JSON.stringify('https://dev-api.dook.sa/api/'),
  'process.env.__VERSION__': JSON.stringify(version),
  'process.env.publicPath': 'http://localhost:3000/',
  __DEV__: true
};

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // set to false to see a list of every file being bundled.
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'whatwg-fetch',
    'babel-polyfill',
    './src/index'
  ],
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: `${__dirname}/dist`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: 'http://localhost:3000/', // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
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
      {test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap']},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  },
  postcss: function() {
    return [autoprefixer({browsers: ['last 4 versions']})];
  }
};

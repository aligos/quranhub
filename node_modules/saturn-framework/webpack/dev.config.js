/* eslint-disable */
const path = require('path');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const _ = require('lodash');
const config = _.cloneDeep(require('./prod.config.js'));

// XXX: where should these come from
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

// We are just going to modify config here. It's fine because we'd never
// load both configs in the one process
config.devtool = 'inline-source-map';
config.entry.main = [
  'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr&reload=true',
  // Client entry point is injected here by webpack-dev.js
];

config.output.filename = '[name]-[hash].js';
config.output.publicPath = 'http://' + host + ':' + port + '/dist/';

// Possibly there could be more re-use for these with prod, but for now
config.module.loaders = [
  {
    test: /\.jsx?$/,
    exclude: require('../babel/babel-exclude'),
    loader: 'babel',
    query: {
      presets: [
        require.resolve('../babel/preset'),
        require.resolve('babel-preset-react-hmre')
      ]
    }
  },
  { test: /\.json$/, loader: 'json-loader' },
  { test: /\.less$/, loader: 'style!css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap' },
  { test: /\.scss$/, loader: 'style!css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' },
  { test: /\.css$/, loader: 'style!css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version' },
  { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
  { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
  { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
  { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
];

// As above
config.plugins = [
  // hot reload
  new webpack.HotModuleReplacementPlugin(),
  new webpack.IgnorePlugin(/webpack-stats\.json$/),
  new webpack.DefinePlugin({
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  }),
  webpackIsomorphicToolsPlugin.development()
];

module.exports = config;

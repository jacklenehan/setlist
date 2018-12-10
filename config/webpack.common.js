/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const WebpackBar = require('webpackbar')

const extractGlobal = new ExtractTextPlugin({
  filename: 'global.css',
  allChunks: true,
})
const extractModules = new ExtractTextPlugin({
  filename: 'modules.css',
  allChunks: true,
})

module.exports = {
  context: path.resolve(__dirname, '../src'),
  entry: './client/index.jsx',
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: ['src', 'libs', 'node_modules'],
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      Client: path.resolve(__dirname, '../src/client/'),
      Server: path.resolve(__dirname, '../src/server/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /^((?!\.module).)*scss/,
        use: ['css-hot-loader'].concat(
          extractGlobal.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: ['src', 'node_modules'],
                },
              },
              'postcss-loader',
            ],
          }),
        ),
      },
      {
        test: /\.module.scss$/,
        use: ['css-hot-loader'].concat(
          extractModules.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 2,
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: ['src', 'node_modules', 'bower_components'],
                },
              },
              'postcss-loader',
            ],
          }),
        ),
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './client/assets/index.html',
      filename: 'index.html',
      // favicon: './assets/favicon.ico',
      inject: false,
    }),
    extractGlobal,
    extractModules,
    new LodashModuleReplacementPlugin({
      paths: true,
      shorthands: true,
    }),
    new WebpackBar(),
  ],
}

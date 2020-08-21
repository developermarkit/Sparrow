const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rootDir = path.join(__dirname, '..');
const webpackEnv = process.env.NODE_ENV || 'development';

module.exports = {
  mode: webpackEnv,
  entry: {
    app: path.join(rootDir, './index.web.ts'),
  },
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'app-[hash].bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /npm\.js$/,
        loader: 'string-replace-loader',
        include: path.resolve('node_modules/firebaseui/dist'),
        options: {
          search: 'require(\'firebase/app\');',
          replace: 'require(\'firebase/app\').default;',
        },
      },
      {
        test: /\.(js|jsx)?$/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        use: {
          loader: 'ts-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        exclude: path.resolve(__dirname, 'node_modules', 'font-awesome'),
        use: ['babel-loader', 'react-svg-loader'],
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'node_modules', 'font-awesome'),
        use: [
          {
            loader: 'file-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      // {
      //   test: /\.(css|less)?$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //     },
      //     {
      //       loader:
      //         'css-loader?modules&localIdentName=[local]--[hash:base64:5]',
      //     },
      //     {
      //       loader: 'less-loader',
      //     },
      //   ],
      // },
      // {
      //   test: /\.json$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'json-loader',
      //   },
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
    ], // read files in fillowing order
    alias: Object.assign({
      'react-native$': 'react-native-web',
    }),
  },
};
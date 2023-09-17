const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './index.html',
          title: 'Webpack Plugin'
        }),
        new MiniCssExtractPlugin(),
        new InjectManifest({
          swSrc: '/src-sw.js',
          swDest: 'service-worker.js',
        }),
        new WebpackPwaManifest({
          name: 'Scratch',
          short_name: 'Scratch',
          description: 'A text editor progressive web application',
          background_color: '#000000',
          theme_color: '#ffffff',
          start_url: '/',
          icons: [
            {
              src: path.resolve('src/icon.png'),
              sizes: [96, 128, 192, 256, 384, 512],
            },
          ],
        }),
      ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
        //   type: 'asset/resource',
        //   use: ['url-loader', 'file-loader']
        // },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};

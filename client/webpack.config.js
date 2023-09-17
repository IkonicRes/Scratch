const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');
const ASSET_PATH = process.env.ASSET_PATH || "/"
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
      assetModuleFilename: 'images/[hash][ext][query]',
      publicPath: ASSET_PATH,  
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './index.html',
          title: 'Webpack Plugin',
          manifest: './manifest.0af4fa0c920d844004154050a48b575e.json'
        }),
        new MiniCssExtractPlugin(),
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: "/src-sw.js",
          swDest: "service-worker.js"
        }),
        // new FaviconsWebpackPlugin('./src/images/logo.png'),
        new WebpackPwaManifest({
          name: 'Scratch',
          short_name: 'Scratch',
          description: 'A text editor progressive web application',
          background_color: '#000000',
          theme_color: '#ffffff',
          start_url: '/',
          icons: [
            {
              src: path.resolve('src/images/logo.png'),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join('assets', 'icons')
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
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset',
        },
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

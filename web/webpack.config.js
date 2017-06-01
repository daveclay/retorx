const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/main/js/main/app.jsx' ],
    admin: ['babel-polyfill', './src/main/js/admin/app.jsx' ],
  },
  output: {
    path: path.resolve(__dirname, 'src/main/webapp'),
    filename: "js/[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
        })
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader?name=images/[name].[ext]'
          }
        ]
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css')
  ]
};

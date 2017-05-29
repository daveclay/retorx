const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/main/js/main/app.jsx' ],
    admin: ['babel-polyfill', './src/main/js/admin/app.jsx' ],
  },
  output: {
    path: "./src/main/webapp",
    filename: "js/[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      lib: path.join(process.cwd(), 'app', 'lib'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
    ]
  }
};

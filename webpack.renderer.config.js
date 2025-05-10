// webpack.renderer.config.js
const rules = require('./webpack.rules');
const path = require('path');

// 1) Add CSS support
rules.push({
  test: /\.css$/i,
  use: [
    'style-loader', // Injects styles into <head>
    'css-loader'    // Resolves @import, url(), etc.
  ],
});

// 2) Add JSX support (if not already in webpack.rules)
rules.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react'
      ]
    }
  }
});

module.exports = {
  entry: './src/renderer.jsx',
  module: {
    rules,       // <-- use the combined array
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],  
    fallback: {
      path:       require.resolve('path-browserify'),
      fs:         false,
      stream:     require.resolve('stream-browserify'),
    },
  },
  output: {
    path:     path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};

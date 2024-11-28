const rules = require('./webpack.rules');
const path = require('path');


rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  entry: './src/renderer.jsx', // Update to point to renderer.jsx
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Match both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Add React preset here
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add .jsx to resolved file extensions
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
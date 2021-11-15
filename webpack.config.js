//webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "atrys-sdk.js",
    library: 'MIT',
    libraryTarget: "umd",
    libraryExport: "default"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: [
          path.resolve(__dirname, 'jest.config.ts')
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
    }),
  ]
};
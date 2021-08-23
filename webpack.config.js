//webpack.config.js
const path = require('path');

module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: {
    main: "./index.ts",
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
        loader: "ts-loader"
      }
    ]
  }
};
const webpack = require('webpack')

const exportedConfig = {
  entry: __dirname + '/index.ts',
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
  mode: 'production',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    libraryTarget: 'umd',
    library: 'ApiMountClient',
  },
  resolveLoader: {
    modules: [__dirname + '/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: __dirname + '/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
}

module.exports = exportedConfig

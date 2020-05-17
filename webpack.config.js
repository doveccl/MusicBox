const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './web/index.js',
  output: {
    filename: "[name].[hash:8].js",
    path: path.resolve(__dirname, 'static')
  },
  resolve: {
    extensions: [ '.vue', '.js' ]
  },
  externals: {
    webmidi: 'null'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:8].[ext]',
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'web/index.html'
    })
  ]
}

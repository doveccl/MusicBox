const path = require('path')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (env, argv) => {
  const dev = argv.mode === 'development'
  const prod = argv.mode === 'production'
  const element = prod ? 'index' : 'element-ui.common'
  const mode = prod ? 'prod' : 'dev'
  const min = prod ? '.min' : ''

  const config = {
    entry: {
      app: './web/index.js'
    },
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
          test: /\.(woff|ttf)$/,
          loader: 'file-loader?name=[hash:8].[ext]'
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
        title: 'Music Box',
        favicon: 'web/icon.svg',
        meta: {
          'viewport': 'width=device-width,initial-scale=1',
          'apple-mobile-web-app-capable': 'yes'
        }
      }),
      new WebpackCdnPlugin({
				modules: [
          { name: 'axios', path: `dist/axios${min}.js` },
          { name: 'vue', var: 'Vue', path: `dist/vue.runtime${min}.js` },
          { name: 'vue-router', var: 'VueRouter', path: `dist/vue-router${min}.js`},
					{ name: 'element-ui', var: 'Element', path: `lib/index.js`, style: `lib/theme-chalk/index.css` }
				],
				prod, publicPath: '/node_modules'
			}),
			new MiniCssExtractPlugin({
				filename: '[name].[hash:8].css'
			})
    ],
    devtool: dev ? 'inline-source-map' : undefined,
    devServer: {
      historyApiFallback: true,
      proxy: [{
        context: ['/user', '/song'],
        target: 'http://localhost:12356',
      }]
    }
  }
  return config
}

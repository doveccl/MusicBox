const path = require('path')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = (_env, argv) => {
  const dev = argv.mode === 'development'
  const min = dev ? '' : '.min'

  return {
    entry: './web',
    output: {
      filename: "[name].[contenthash:4].js",
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
          loader: 'file-loader',
          options: {
            name: '[hash:8].[ext]'
          }
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: false
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: 'Music Box',
        favicon: 'web/icon.svg',
        minify: false,
        meta: {
          'viewport': 'width=device-width,initial-scale=1,maximum-scale=1',
          'apple-mobile-web-app-capable': 'yes'
        }
      }),
      new WebpackCdnPlugin({
        publicPath: '/node_modules',
        prod: argv.mode === 'production',
        modules: [
          { name: 'axios', path: `dist/axios${min}.js` },
          { name: 'tone', var: 'Tone', path: 'build/Tone.js' },
          { name: 'vue', var: 'Vue', path: `dist/vue.runtime${min}.js` },
          { name: 'vue-router', var: 'VueRouter', path: `dist/vue-router${min}.js`},
          { name: 'element-ui', var: 'ELEMENT', path: `lib/index.js`, style: `lib/theme-chalk/index.css` }
        ]
      })
    ],
    devtool: dev ? 'inline-source-map' : undefined,
    devServer: {
      historyApiFallback: true,
      proxy: [{
        changeOrigin: true,
        context: ['/user', '/song'],
        target: 'http://localhost:12356'
      }, {
        changeOrigin: true,
        context: ['/audio'],
        target: 'https://tambien.github.io/Piano'
      }]
    }
  }
}

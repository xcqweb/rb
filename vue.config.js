const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const system = require('./src/config/system')
const modifyVars = require('./src/config/theme')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin') 
const uuid = require('uuid')
const { DefinePlugin } = require('webpack')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const isDev = process.env.NODE_ENV === 'development'

const APIList = {
  newManageDev: 'http://kong.poros-platform.10.74.158.69.nip.io/', // 最新平台管理开发环境
  oldTechDev: 'http://kong.poros-platform.10.74.166.10.nip.io/' // 旧中台开发环境
}
const proxyAPI = APIList.newManageDev

module.exports = {
  productionSourceMap: false,
  publicPath: isDev ? '/' : system.baseUrl,
  configureWebpack: {
    plugins: [
      new HardSourceWebpackPlugin(),
      new DefinePlugin({
        "BUILD_TIME": JSON.stringify(new Date().toLocaleString()),
        "VERSION": JSON.stringify(uuid.v4())
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      })
    ]
  },
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].baseUrl = isDev ? '' : system.baseUrl
      args[0].isDev = isDev
      return args
    })
    config.plugins.delete('prefetch')
    // ie兼容
    config.entry('main').add('babel-polyfill')
    // 处理svg图片
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    if (!isDev) {
      // 开启gzip
      config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test:/\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
        .end()
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars,
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/assets/less/theme.less'), 
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: proxyAPI,
        changeOrigin: true
      },
      '/tree': {
        target: 'http://10.8.7.24:8030/api',
        pathRewrite: {"^/tree": ""},
        changeOrigin: true
      },
      '/ch': {
        target: 'http://10.8.7.76:8030/api',
        pathRewrite: {"^/ch": ""},
        changeOrigin: true
      },
      // 图片
      '/minio/poros': {
        target: proxyAPI
      }
    }
  }
}
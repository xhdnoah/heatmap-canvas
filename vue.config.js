const webpack = require('webpack')

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  // 静态资源的文件夹
  assetsDir: 'static',
  // index.html的路径
  // indexPath: 'wx/index.html',

  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      console.log(config.plugin)
      // config.optimization.minimizer
      //   .tap(([options]) => {
      //     // 去除 console.log
      //     return [Object.assign(options, {
      //       uglifyOptions: { compress: {
      //           drop_console: true,
      //           pure_funcs: ['console.log']
      //         }}
      //     })]
      //   })
    }

    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@$', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('static', resolve('static'))

    config
      .entry('lodash')
      .add('lodash')
    config
      .entry('moment')
      .add('moment')
    config
      .entry('axios')
      .add('axios')
    config
      .entry('iview')
      .add('iview/dist/iview.js')
      .add('iview/dist/styles/iview.css')
    config
      .entry('fabric')
      .add('fabric')



    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        'moment': 'moment',
        '_': 'lodash',
        'Fabric': 'fabric'
      }])


    config
      .plugin('ignore')
      .use(webpack.IgnorePlugin,
        [/^\.\/locale$/, /moment$/])
    config
      .plugin('contextReplace')
      .use(webpack.ContextReplacementPlugin,
        // eslint-disable-next-line
        [/moment[\/\\]locale$/, /zh-cn/])


    config.optimization.providedExports = true

    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 5,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    })


  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/sass/main.scss";
        `
      }
    }
  }
}

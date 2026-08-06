const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // publicPath: process.env.NODE_ENV === 'production' ? '/pic_shop/' : '/',  // 👈 ПОЛНОСТЬЮ УДАЛИТЕ ЭТУ СТРОКУ
  // publicPath: '',  // 👈 ТОЖЕ УДАЛИТЕ
  // assetsDir: 'static',  // 👈 УДАЛИТЕ ЭТУ СТРОКУ

  outputDir: 'dist',
  lintOnSave: false,
  transpileDependencies: true,

  devServer: {
    hot: true,
    liveReload: true,
    port: 8080,
    open: true,
    client: {
      overlay: false
    },
    historyApiFallback: true
  },

  configureWebpack: {
    devtool: 'eval-source-map',
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    },
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },

  css: {
    sourceMap: true,
    extract: true,
    loaderOptions: {
      css: {}
    }
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('@', config.resolve.alias.get('@'))
  }
})

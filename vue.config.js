const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
 publicPath: '',  // 👈 ПУСТАЯ СТРОКА! (или './')
  // 👇 ОСНОВНОЕ: публичный путь для GitHub Pages
  // publicPath: process.env.NODE_ENV === 'production' ? '/pic_shop/' : '/',
  
  // 👇 Где лежат собранные файлы (по умолчанию dist)
  outputDir: 'dist',
  
  // 👇 Папка со статикой (не обрабатывается Webpack)
  assetsDir: 'static',
  
  // 👇 Отключает лишние предупреждения
  lintOnSave: false,
  
  // 👇 Транспиляция зависимостей
  transpileDependencies: true,
  
  // 👇 НАСТРОЙКИ ЛОКАЛЬНОГО СЕРВЕРА
  devServer: {
    hot: true,
    liveReload: true,
    port: 8080,
    open: true,
    client: {
      overlay: false
    },
    // Добавляем поддержку истории (если используете Vue Router)
    historyApiFallback: true
  },
  
  // 👇 НАСТРОЙКИ WEBPACK
  configureWebpack: {
    devtool: 'eval-source-map',
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    },
    performance: {
      hints: false
    },
    // Оптимизация сборки
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  
  // 👇 НАСТРОЙКИ CSS
  css: {
    sourceMap: true,
    extract: true,  // Извлекает CSS в отдельный файл
    loaderOptions: {
      css: {
        // Настройки CSS-загрузчика
      }
    }
  },
  
  // 👇 ПЛАГИНЫ (если нужны)
  pluginOptions: {
    // Сюда можно добавить настройки плагинов
  },
  
  // 👇 АЛЬТЕРНАТИВНЫЙ СПОСОБ НАСТРОЙКИ WEBPACK (через цепочку)
  chainWebpack: (config) => {
    // Например, добавить алиасы
    config.resolve.alias
      .set('@', config.resolve.alias.get('@'))
  }
})

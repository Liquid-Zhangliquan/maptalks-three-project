module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/Api': {
        target: 'http://typhoon.zjwater.gov.cn/Api',
        changeOrigin: true,
        pathRewrite: {
          '^/Api': ''
        }
      }
    }
  },
  lintOnSave: false,
  productionSourceMap: true,
  chainWebpack: config => {
    config.performance.set('hints', false);
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.glsl$/i,
          use: 'raw-loader',
        },
      ],
    },
  },
}

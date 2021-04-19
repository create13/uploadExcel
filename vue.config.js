module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://192.168.211.125:3000',
          ws: true,
          changeOrigin: true,
          pathRewrite:{
            '^/api':''
        }
        }
      }
    }
  }
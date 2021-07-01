module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://192.168.210.238:3000',
          ws: true,
          changeOrigin: true,
          pathRewrite:{
            '^/api':''
        }
        }
      }
    }
  }
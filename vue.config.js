const path = require('path')
const resolve = dir => path.join(__dirname,dir)

module.exports = {
    devServer: {
        port: 8081,
    },
    chainWebpack: config =>{
        config.resolve.alias
            .set('@',resolve('src'))
    }
}
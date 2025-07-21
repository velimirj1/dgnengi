import path from 'path'
import { fileURLToPath } from 'url'
import merge from 'webpack-merge'
import common from './webpack.common.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default merge(common, {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, './public'),
        publicPath: '/js/',
        compress: true,
        port: 8080,
        host: '0.0.0.0',
        disableHostCheck: true
    }
})

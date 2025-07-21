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
        publicPath: 'http://localhost:8080/js/',
        compress: true,
        port: 8080
    }
})

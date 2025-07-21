import merge from 'webpack-merge'
import common from './webpack.common.js'
import TerserPlugin from 'terser-webpack-plugin'

export default merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin()],
    },
})

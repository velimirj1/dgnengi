import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const version = '0.0.1'

export default {
	entry: './client/clientMain.js',
	output: {
        path: path.resolve(__dirname, './public/js'),
		filename: 'app-v' + version + '.js'

	}
}

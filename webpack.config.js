const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/entry_points/main.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: "ts-loader" }
		]
	},
	resolve: {
		modules: [
			"node_modules"
		],
		extensions: [".ts", ".js"]
	}
};
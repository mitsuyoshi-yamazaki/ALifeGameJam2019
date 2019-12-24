const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/entry_points/main.ts',
		gravitational_field: './src/entry_points/gravitational_field.ts',
		orbital_motion: './src/entry_points/orbital_motion.ts',
		generative_art_002: './src/entry_points/generative_art_002.ts',
	},
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
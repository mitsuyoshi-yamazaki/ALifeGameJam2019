const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/entry_points/main.ts',
		gravitational_field: './src/entry_points/gravitational_field.ts',
		orbital_motion: './src/entry_points/orbital_motion.ts',
		no_friction: './src/entry_points/no_friction.ts',
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
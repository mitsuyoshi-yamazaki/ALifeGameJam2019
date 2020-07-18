const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    lsystem: './src/entry_points/lsystem.ts',
    evo_devo: './src/entry_points/evo_devo.ts',
    bracketed_ol_system: './src/entry_points/bracketed_ol_system.ts',
    tree1: './src/entry_points/tree1.ts'
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
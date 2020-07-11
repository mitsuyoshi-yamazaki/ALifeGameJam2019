const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/entry_points/main.ts',
    gravitational_field: './src/entry_points/gravitational_field.ts',
    orbital_motion: './src/entry_points/orbital_motion.ts',
    cellular_atmosphere: './src/entry_points/cellular_atmosphere.ts',
    generative_art_002: './src/entry_points/generative_art_002.ts',
    machine: './src/entry_points/machine.ts',
    matryoshka_2: './src/entry_points/matryoshka_2.ts',
    lsystem: './src/entry_points/lsystem.ts',
    evo_devo: './src/entry_points/evo_devo.ts',
    bracketed_ol_system: './src/entry_points/bracketed_ol_system.ts',
    react_example: './src/entry_points/react_example.tsx',
    react_main: './src/entry_points/react_main.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" }
    ]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [".ts", ".js", ".tsx"]
  }
};

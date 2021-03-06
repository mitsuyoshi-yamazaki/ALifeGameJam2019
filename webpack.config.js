const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/entry_points/index.tsx',
    main: './src/entry_points/main.tsx',
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
    react_main: './src/entry_points/react_main.tsx',
    gallery_demo: './src/entry_points/gallery_demo.tsx',
    blind_painter_classic: './src/entry_points/blind_painter_classic.tsx',
    notebook_demo: './src/entry_points/notebooks/notebook_demo.tsx'
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

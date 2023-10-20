module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@views': './src/views',
          '@ui': './src/ui',
          '@utils': './src/utils',
          src: './src',
        },
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};

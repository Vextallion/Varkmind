module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ios.tsx',
            '.android.tsx',
            '.js',
            '.ts',
            '.tsx',
            '.json',
          ],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@screens': './src/screens',
            '@widgets': './src/widgets',
            '@features': './src/features',
            '@entities': './src/entities',
            '@shared': './src/shared',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};

module.exports = {
    presets: [
      'babel-preset-expo'           // ← usa el preset de Expo
    ],
    plugins: [
      // ...otros plugins que necesites,
      'react-native-reanimated/plugin'  // debe ir ÚLTIMO
    ],
  };  
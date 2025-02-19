const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Integrate with NativeWind
module.exports = withNativeWind(defaultConfig, {
  input: './global.css', // Ensure this path matches your CSS file location
});
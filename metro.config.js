// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable experimental features for expo-router
  resolver: {
    unstable_enablePackageExports: true,
    extraNodeModules: {
      'expo-linking': path.resolve(__dirname, 'node_modules/expo-linking'),
      '@': path.resolve(__dirname),
    },
  },
});

// Add additional configuration for expo-router
config.resolver.sourceExts.push('mjs');

// Add support for all files in the app directory
config.watchFolders = [...(config.watchFolders || []), './app'];

module.exports = config;

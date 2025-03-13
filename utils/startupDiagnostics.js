import * as Sentry from '@sentry/react-native';
import { Platform, Dimensions, PixelRatio } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import { version } from '../package.json';

/**
 * Utility to run startup diagnostics and report device/app information to Sentry
 */

// Track startup time
const startupStartTime = Date.now();

/**
 * Run startup diagnostics and report to Sentry
 */
export const runStartupDiagnostics = async () => {
  try {
    console.log('Running startup diagnostics...');

    // Calculate startup time
    const startupTime = Date.now() - startupStartTime;

    // Get device information
    //const deviceInfo = await getDeviceInfo();

    // Get network information
    const networkInfo = await getNetworkInfo();

    // Get storage information
    const storageInfo = await getStorageInfo();

    // Combine all diagnostics
    const diagnostics = {
      startupTime,
      ...deviceInfo,
      ...networkInfo,
      ...storageInfo,
    };

    // Log diagnostics
    console.log('Startup diagnostics:', diagnostics);

    // Set Sentry context with diagnostics
    Sentry.setContext('device', deviceInfo);
    Sentry.setContext('network', networkInfo);
    Sentry.setContext('storage', storageInfo);
    Sentry.setContext('performance', { startupTime });

    // Add breadcrumb for startup diagnostics
    Sentry.addBreadcrumb({
      category: 'startup',
      message: `App startup completed in ${startupTime}ms`,
      level: 'info',
      data: {
        startupTime,
      },
    });

    // Report slow startup (over 5 seconds)
    if (startupTime > 5000) {
      Sentry.captureMessage(`Slow app startup: ${startupTime}ms`, 'warning');
    }

    return diagnostics;
  } catch (error) {
    console.error('Error running startup diagnostics:', error);
    Sentry.captureException(error, {
      tags: {
        component: 'startupDiagnostics',
      },
    });
    return null;
  }
};

/**
 * Get device information
 */
const getDeviceInfo = async () => {
  try {
    const { width, height } = Dimensions.get('window');
    const deviceType = await Device.getDeviceTypeAsync();

    return {
      os: Platform.OS,
      osVersion: Platform.Version,
      deviceType: Device.DeviceType[deviceType],
      deviceName,
      brand: Device.brand,
      modelName: Device.modelName,
      screenWidth: width,
      screenHeight: height,
      pixelRatio: PixelRatio.get(),
      appVersion: version,
      buildNumber: Platform.OS === 'ios'
        ? Constants.expoConfig?.ios?.buildNumber
        : Constants.expoConfig?.android?.versionCode,
      appName: Application.applicationName,
      installationTime: await Application.getInstallationTimeAsync(),
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {
      os: Platform.OS,
      osVersion: Platform.Version,
      appVersion: version,
    };
  }
};

/**
 * Get network information
 */
const getNetworkInfo = async () => {
  try {
    const netInfo = await NetInfo.fetch();

    return {
      isConnected: netInfo.isConnected,
      type: netInfo.type,
      isWifi: netInfo.type === 'wifi',
      isCellular: netInfo.type === 'cellular',
      details: netInfo.details,
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      isConnected: false,
      type: 'unknown',
    };
  }
};

/**
 * Get storage information
 */
const getStorageInfo = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);

    return {
      freeSpace: fileInfo.freeSpace,
      totalSpace: fileInfo.totalSpace,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      freeSpace: 'unknown',
      totalSpace: 'unknown',
    };
  }
};

export default {
  runStartupDiagnostics,
};
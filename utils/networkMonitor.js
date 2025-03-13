import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';

/**
 * Network monitoring utility to track connectivity status and report issues
 */

// Track network state globally
let isConnected = true;
let networkType = 'unknown';
let networkDetails = {};

/**
 * Initialize network monitoring
 */
export const initNetworkMonitoring = () => {
  // Subscribe to network info updates
  const unsubscribe = NetInfo.addEventListener(state => {
    const wasConnected = isConnected;
    isConnected = state.isConnected;
    networkType = state.type;
    networkDetails = state;

    // Log network state changes
    console.log('Network state changed:', state);

    // Add breadcrumb for network state change
    Sentry.addBreadcrumb({
      category: 'network',
      message: `Network ${isConnected ? 'connected' : 'disconnected'} (${networkType})`,
      level: 'info',
      data: {
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
        details: state.details,
      },
    });

    // Capture connectivity loss events
    if (wasConnected && !isConnected) {
      Sentry.captureMessage('Network connectivity lost', 'warning');
    }

    // Capture connectivity restored events
    if (!wasConnected && isConnected) {
      Sentry.captureMessage('Network connectivity restored', 'info');
    }
  });

  // Return the unsubscribe function
  return unsubscribe;
};

/**
 * Get current network state
 */
export const getNetworkState = () => {
  return {
    isConnected,
    networkType,
    ...networkDetails,
  };
};

/**
 * Hook to use network state in components
 */
export const useNetworkState = () => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    networkType: 'unknown',
  });

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then(state => {
      setNetworkState({
        isConnected: state.isConnected,
        networkType: state.type,
        details: state,
      });
    });

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected,
        networkType: state.type,
        details: state,
      });
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return networkState;
};

/**
 * Utility to check if the device is online before making API requests
 */
export const checkOnlineStatus = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error('Error checking online status:', error);
    return false;
  }
};

export default {
  initNetworkMonitoring,
  getNetworkState,
  useNetworkState,
  checkOnlineStatus,
};
import * as Sentry from '@sentry/react-native';
import { Alert, Platform } from 'react-native';

/**
 * Set up global error handlers to catch unhandled errors and promise rejections
 */
export const setupGlobalErrorHandlers = () => {
  // Keep track of whether we've already shown an error alert to avoid multiple alerts
  let errorAlertShown = false;

  // Handler for uncaught JS errors
  const errorHandler = (error, isFatal) => {
    // Log the error to console
    console.error('Unhandled error:', error, 'Fatal:', isFatal);

    // Capture the error in Sentry
    Sentry.captureException(error, {
      tags: {
        fatal: isFatal ? 'yes' : 'no',
        handler: 'global',
      },
    });

    // Show an alert for fatal errors, but only once
    if (isFatal && !errorAlertShown) {
      errorAlertShown = true;
      Alert.alert(
        'Unexpected Error',
        'The application encountered an unexpected error. Please restart the app.',
        [{ text: 'OK' }]
      );
    }

    // Return true to prevent the default error handling
    return true;
  };

  // Handler for unhandled promise rejections
  const promiseRejectionHandler = (id, rejection) => {
    console.error('Unhandled promise rejection:', rejection);

    Sentry.captureException(rejection, {
      tags: {
        handler: 'promise_rejection',
      },
      extra: {
        promise_id: id,
      },
    });
  };

  // Set up the global error handler
  if (global.ErrorUtils) {
    const originalHandler = global.ErrorUtils.getGlobalHandler();

    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      errorHandler(error, isFatal);
      originalHandler(error, isFatal);
    });
  }

  // Set up the promise rejection handler for different platforms
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // React Native
    const originalRejectCallback = Promise.prototype.catch;

    Promise.prototype.catch = function(onReject) {
      return originalRejectCallback.call(
        this,
        error => {
          promiseRejectionHandler('unknown', error);
          return onReject(error);
        }
      );
    };
  } else {
    // Web
    window.addEventListener('unhandledrejection', event => {
      promiseRejectionHandler(event.promise, event.reason);
    });
  }

  console.log('Global error handlers set up successfully');
};

export default setupGlobalErrorHandlers;
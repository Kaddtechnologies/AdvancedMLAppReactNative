import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { version } from '../package.json';

// Define types for Sentry that might be missing
type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

interface BreadcrumbType {
  category?: string;
  message: string;
  data?: Record<string, any>;
  level?: SeverityLevel;
}

/**
 * Simplified Sentry service for basic error tracking
 */
class SentryService {
  private static isInitialized = false;

  /**
   * Initialize Sentry with basic configuration
   */
  static initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      Sentry.init({
        dsn: 'https://c7c0fb7a16b451909e2907c1c2ef07f3@o4508898742435840.ingest.us.sentry.io/4508952144642048',
        enableAutoSessionTracking: true,
        beforeSend: (event) => {
          // Only send error and fatal events
          if (event.level && ['error', 'fatal'].includes(event.level)) {
            return event;
          }
          return null;
        },
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Capture an exception
   */
  static captureException(error: Error | any) {
    try {
      if (!this.isInitialized) return;

      const errorObj = error instanceof Error ? error : new Error(String(error));
      Sentry.captureException(errorObj);
    } catch (e) {
      console.error('Error capturing exception:', e);
    }
  }

  /**
   * Wrap a component with basic error boundary
   */
  static wrap(component: React.ComponentType<any>) {
    if (!this.isInitialized) {
      return component;
    }

    try {
      return Sentry.wrap(component);
    } catch (error) {
      return component;
    }
  }
}

export default SentryService;
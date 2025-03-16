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
  static captureMessage(message: string, context: Record<string, any>, level: string) {
    throw new Error('Method not implemented.');
  }
  static addBreadcrumb(breadcrumb: { category?: string; message: string; data?: Record<string, any>; level?: "info" | "warning" | "error"; }) {
    throw new Error('Method not implemented.');
  }
  static setUser(user: { [key: string]: any; id?: string; email?: string; username?: string; }) {
    throw new Error('Method not implemented.');
  }
  static clearUser() {
    throw new Error('Method not implemented.');
  }
  static startTransaction(name: string, op: string): any {
    throw new Error('Method not implemented.');
  }
  private static isInitialized = false;

  /**
   * Initialize Sentry with basic configuration
   */
  static initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Check if Sentry is available
      if (!Sentry || typeof Sentry.init !== 'function') {
        console.log('Sentry not available, skipping initialization');
        return;
      }

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
        enabled: process.env.NODE_ENV === 'production', // Only enable in production
      });

      this.isInitialized = true;
    } catch (error) {
      // Silently handle Sentry initialization errors
      console.log('Sentry initialization skipped:', error);
    }
  }

  /**
   * Capture an exception
   */
  static captureException(error: Error | any, context: Record<string, any>) {
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
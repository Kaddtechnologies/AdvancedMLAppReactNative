import { useCallback } from 'react';
import SentryService from '../services/SentryService';

/**
 * Custom hook for error tracking with Sentry
 * @returns {Object} - Object containing error tracking functions
 */
export const useSentry = () => {
  /**
   * Capture an exception with additional context
   */
  const captureException = useCallback((error: Error, context: Record<string, any> = {}) => {
    SentryService.captureException(error, context);
  }, []);

  /**
   * Capture a message with additional context
   */
  const captureMessage = useCallback((message: string, context: Record<string, any> = {}, level: 'info' | 'warning' | 'error' = 'info') => {
    SentryService.captureMessage(message, context, level);
  }, []);

  /**
   * Add breadcrumb for better context in error reports
   */
  const addBreadcrumb = useCallback((breadcrumb: {
    category?: string;
    message: string;
    data?: Record<string, any>;
    level?: 'info' | 'warning' | 'error';
  }) => {
    SentryService.addBreadcrumb(breadcrumb);
  }, []);

  /**
   * Set user information for better error tracking
   */
  const setUser = useCallback((user: { id?: string; email?: string; username?: string; [key: string]: any } | null) => {
    SentryService.setUser(user);
  }, []);

  /**
   * Clear user information
   */
  const clearUser = useCallback(() => {
    SentryService.clearUser();
  }, []);

  /**
   * Start a new transaction for performance monitoring
   */
  const startTransaction = useCallback((name: string, op: string) => {
    return SentryService.startTransaction(name, op);
  }, []);

  /**
   * Create a wrapped function that captures any errors that occur during execution
   */
  const withErrorCapture = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    context: Record<string, any> = {}
  ): ((...args: Parameters<T>) => ReturnType<T>) => {
    return (...args: Parameters<T>): ReturnType<T> => {
      try {
        return fn(...args);
      } catch (error) {
        captureException(error as Error, {
          ...context,
          args: JSON.stringify(args),
        });
        throw error;
      }
    };
  }, [captureException]);

  /**
   * Create a wrapped async function that captures any errors that occur during execution
   */
  const withAsyncErrorCapture = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context: Record<string, any> = {}
  ): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) => {
    return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      try {
        return await fn(...args);
      } catch (error) {
        captureException(error as Error, {
          ...context,
          args: JSON.stringify(args),
        });
        throw error;
      }
    };
  }, [captureException]);

  return {
    captureException,
    captureMessage,
    addBreadcrumb,
    setUser,
    clearUser,
    startTransaction,
    withErrorCapture,
    withAsyncErrorCapture,
  };
};

export default useSentry;
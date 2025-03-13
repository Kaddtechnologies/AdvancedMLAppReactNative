import * as Sentry from '@sentry/react-native';

/**
 * Utility functions for Sentry error tracking and monitoring
 */

/**
 * Capture an exception with additional context
 * @param {Error} error - The error object to capture
 * @param {Object} context - Additional context to add to the error
 */
export const captureException = (error, context = {}) => {
  Sentry.withScope((scope) => {
    // Add any additional context
    Object.keys(context).forEach(key => {
      scope.setExtra(key, context[key]);
    });

    Sentry.captureException(error);
  });
};

/**
 * Capture a message with additional context
 * @param {string} message - The message to capture
 * @param {Object} context - Additional context to add to the message
 * @param {string} level - The level of the message (info, warning, error)
 */
export const captureMessage = (message, context = {}, level = 'info') => {
  Sentry.withScope((scope) => {
    // Add any additional context
    Object.keys(context).forEach(key => {
      scope.setExtra(key, context[key]);
    });

    Sentry.captureMessage(message, level);
  });
};

/**
 * Set user information for better error tracking
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  Sentry.setUser(user);
};

/**
 * Clear user information
 */
export const clearUser = () => {
  Sentry.setUser(null);
};

/**
 * Start a new transaction for performance monitoring
 * @param {string} name - The name of the transaction
 * @param {string} op - The operation being performed
 * @returns {Transaction} - The transaction object
 */
export const startTransaction = (name, op) => {
  return Sentry.startTransaction({
    name,
    op,
  });
};

/**
 * Add breadcrumb for better context in error reports
 * @param {Object} breadcrumb - The breadcrumb to add
 */
export const addBreadcrumb = (breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

/**
 * Wrap a component with Sentry's error boundary
 * @param {Component} component - The component to wrap
 * @returns {Component} - The wrapped component
 */
export const withErrorBoundary = (component) => {
  return Sentry.withErrorBoundary(component);
};

export default {
  captureException,
  captureMessage,
  setUser,
  clearUser,
  startTransaction,
  addBreadcrumb,
  withErrorBoundary,
};
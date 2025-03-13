import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Clipboard } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Save errorInfo to state for copying to clipboard later
    this.setState({ errorInfo });

    // Capture the error with Sentry
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  handleResetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleCopyDetails = async () => {
    try {
      // Gather detailed information about the error and device
      const errorDetails = {
        error: {
          message: this.state.error?.message,
          stack: this.state.error?.stack,
          name: this.state.error?.name,
        },
        componentStack: this.state.errorInfo?.componentStack,
        device: {
          brand: Device.brand,
          modelName: Device.modelName,
          osName: Device.osName,
          osVersion: Device.osVersion,
          deviceYearClass: await Device.getDeviceYearClassAsync(),
        },
        app: {
          expoVersion: Constants.expoVersion,
          appVersion: Constants.manifest?.version,
          nativeAppVersion: Constants.nativeAppVersion,
          nativeBuildVersion: Constants.nativeBuildVersion,
        },
        timestamp: new Date().toISOString(),
      };

      // Convert to formatted JSON string
      const detailsString = JSON.stringify(errorDetails, null, 2);

      // Copy to clipboard
      await Clipboard.setString(detailsString);

      // Notify user
      Alert.alert(
        "Details Copied",
        "Error details have been copied to clipboard. Please paste them when reporting this issue.",
        [{ text: "OK" }]
      );
    } catch (clipboardError) {
      console.error("Failed to copy error details:", clipboardError);
      Alert.alert(
        "Copy Failed",
        "Could not copy error details. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <View style={styles.container}>
          <FontAwesome name="exclamation-triangle" size={50} color="#FF6B6B" />
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleResetError}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.copyButton]} onPress={this.handleCopyDetails}>
              <FontAwesome name="clipboard" size={16} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Copy Details</Text>
            </TouchableOpacity>
          </View>
          {this.props.renderCustomFallback ? (
            this.props.renderCustomFallback(this.state.error, this.handleResetError)
          ) : null}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Match the app's dark theme
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#CCCCCC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4C6EF5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  copyButton: {
    backgroundColor: '#6200EE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ErrorBoundary;
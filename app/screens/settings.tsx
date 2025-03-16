import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Clipboard
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import GradientButton from '../../components/ui/GradientButton';
import { Spacing } from '../../constants/Theme';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppContext } from '../../contexts/AppContext';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

// Settings sections
const SECTIONS = {
  APP: 'app',
  TESTING: 'testing',
  DATA: 'data',
  ABOUT: 'about'
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const {
    refreshTestSessions,
    refreshMetricsHistory,
    refreshSharedInfo,
    testSessions,
    metricsHistory
  } = useAppContext();

  const [showMetadataInChat, setShowMetadataInChat] = useState(true);
  const [autoCalculateMetrics, setAutoCalculateMetrics] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Toggle a setting
  const toggleSetting = async (setting: string, value: boolean) => {
    try {
      await SecureStore.setItemAsync(setting, value.toString());

      if (setting === 'show_metadata_in_chat') {
        setShowMetadataInChat(value);
      } else if (setting === 'auto_calculate_metrics') {
        setAutoCalculateMetrics(value);
      }
    } catch (error) {
      console.error(`Error toggling setting ${setting}:`, error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  // Export data
  const exportData = async () => {
    try {
      setIsExporting(true);

      // Prepare data for export
      const exportData = {
        testSessions,
        metricsHistory,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.5'
      };

      // Convert to JSON
      const jsonData = JSON.stringify(exportData, null, 2);

      // Copy to clipboard
      Clipboard.setString(jsonData);

      // Show success message
      Alert.alert(
        'Data Exported',
        'The data has been copied to your clipboard. You can now paste it into a text editor or other app.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  // Clear all data
  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all test sessions and metrics data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);

              // Clear all data from secure storage
              await SecureStore.deleteItemAsync('test_sessions');
              await SecureStore.deleteItemAsync('metrics_history');
              await SecureStore.deleteItemAsync('shared_info');

              // Refresh the app state
              await refreshTestSessions();
              await refreshMetricsHistory();
              await refreshSharedInfo();

              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            } finally {
              setIsClearing(false);
            }
          }
        }
      ]
    );
  };

  // Render a setting item with a switch
  const renderSwitchSetting = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <StyledText variant="body" weight="medium">
          {title}
        </StyledText>
        <StyledText variant="bodySmall" style={styles.settingDescription}>
          {description}
        </StyledText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.accent }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  // Render a button setting
  const renderButtonSetting = (
    title: string,
    description: string,
    buttonText: string,
    onPress: () => void,
    isLoading: boolean = false,
    destructive: boolean = false
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <StyledText variant="body" weight="medium">
          {title}
        </StyledText>
        <StyledText variant="bodySmall" style={styles.settingDescription}>
          {description}
        </StyledText>
      </View>
      <GradientButton
        title={buttonText}
        onPress={onPress}
        size="small"
        variant={destructive ? 'secondary' : 'primary'}
        loading={isLoading}
      />
    </View>
  );

  // Render an info item
  const renderInfoItem = (title: string, value: string) => (
    <View style={styles.infoItem}>
      <StyledText variant="body" weight="medium">
        {title}
      </StyledText>
      <StyledText variant="body">
        {value}
      </StyledText>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <StyledText variant="largeHeader" weight="semibold">
            Settings
          </StyledText>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="cog" size={16} color={colors.accent} style={styles.sectionIcon} />
            <StyledText variant="sectionHeader" weight="medium">
              App Settings
            </StyledText>
          </View>

          <GradientCard>
            {renderSwitchSetting(
              'Show Metadata in Chat',
              'Display test metadata in chat messages',
              showMetadataInChat,
              (value) => toggleSetting('show_metadata_in_chat', value)
            )}

            {renderSwitchSetting(
              'Auto-Calculate Metrics',
              'Automatically calculate metrics after test sessions',
              autoCalculateMetrics,
              (value) => toggleSetting('auto_calculate_metrics', value)
            )}
          </GradientCard>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="database" size={16} color={colors.accent} style={styles.sectionIcon} />
            <StyledText variant="sectionHeader" weight="medium">
              Data Management
            </StyledText>
          </View>

          <GradientCard>
            {renderButtonSetting(
              'Export Data',
              'Export all test sessions and metrics data',
              'Export',
              exportData,
              isExporting
            )}

            {renderButtonSetting(
              'Clear All Data',
              'Delete all test sessions and metrics data',
              'Clear Data',
              clearAllData,
              isClearing,
              true
            )}
          </GradientCard>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="info-circle" size={16} color={colors.accent} style={styles.sectionIcon} />
            <StyledText variant="sectionHeader" weight="medium">
              About
            </StyledText>
          </View>

          <GradientCard>
            {renderInfoItem('App Version', '1.0.5')}
            {renderInfoItem('API Endpoint', 'https://deaconapidev.myworkatcornerstone.com')}
            {renderInfoItem('User ID', 'a6d3028d-a025-493f-a75a-8ee5e88ff52b')}
            {renderInfoItem('User', 'David Jones')}
          </GradientCard>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.l,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionIcon: {
    marginRight: Spacing.s,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.m,
  },
  settingDescription: {
    opacity: 0.7,
    marginTop: Spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
});
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import StyledText from '../ui/StyledText';
import { Colors } from '../../constants/Colors';
import AIMonitoringDashboard from './AIMonitoringDashboard';
import ContinuousLearningView from './ContinuousLearningView';
import PersonalizationView from './PersonalizationView';
import TrainingDataView from './TrainingDataView';
import styles from './styles/EnhancedAIDashboardStyles';

const colors = Colors.dark;

type TabType = 'monitoring' | 'learning' | 'personalization' | 'training';

const EnhancedAIDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('monitoring');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'monitoring':
        return <AIMonitoringDashboard />;
      case 'learning':
        return <ContinuousLearningView />;
      case 'personalization':
        return <PersonalizationView />;
      case 'training':
        return <TrainingDataView />;
      default:
        return <AIMonitoringDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TabButton
          title="Monitoring"
          isActive={activeTab === 'monitoring'}
          onPress={() => setActiveTab('monitoring')}
        />
        <TabButton
          title="Learning"
          isActive={activeTab === 'learning'}
          onPress={() => setActiveTab('learning')}
        />
        <TabButton
          title="Personalization"
          isActive={activeTab === 'personalization'}
          onPress={() => setActiveTab('personalization')}
        />
        <TabButton
          title="Training Data"
          isActive={activeTab === 'training'}
          onPress={() => setActiveTab('training')}
        />
      </View>

      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      isActive ? styles.activeTabButton : null
    ]}
    onPress={onPress}
  >
    <StyledText
      variant="body"
      weight={isActive ? 'medium' : 'regular'}
      style={[
        styles.tabButtonText,
        isActive ? styles.activeTabButtonText : null
      ]}
    >
      {title}
    </StyledText>
  </TouchableOpacity>
);

export default EnhancedAIDashboard;
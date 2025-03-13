import React from 'react';
import { View, Text } from 'react-native';
import { LearningMilestone } from '../../services/AIAnalyticsService';
import styles from './styles/LearningProgressCardStyles';

interface LearningProgressCardProps {
  milestone: LearningMilestone;
}

const LearningProgressCard: React.FC<LearningProgressCardProps> = ({ milestone }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.date}>{milestone.date}</Text>
          <Text style={styles.improvement}>+{milestone.improvement}% improvement</Text>
        </View>
        <Text style={styles.title}>{milestone.title}</Text>
        <Text style={styles.description}>{milestone.description}</Text>
      </View>
    </View>
  );
};

export default LearningProgressCard;
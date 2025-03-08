import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StyledText from './StyledText';
import { BorderRadius, Spacing, Shadows } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  style?: ViewStyle;
  metadata?: {
    testCategory?: string;
    responseTime?: number;
    accuracy?: number;
  };
  showMetadata?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
  style,
  metadata,
  showMetadata = false,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine bubble style based on sender
  const bubbleStyle = isUser ? styles.userBubble : styles.aiBubble;
  const bubbleAlignment = isUser ? styles.userContainer : styles.aiContainer;

  // Determine gradient colors
  const gradientColors = isUser
    ? colors.buttonGradient.colors
    : colors.cardBackgroundGradient.colors;

  return (
    <View style={[styles.container, bubbleAlignment, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, bubbleStyle, isUser ? Shadows.small : null]}
      >
        <StyledText variant="body" style={styles.message}>
          {message}
        </StyledText>

        {timestamp && (
          <StyledText variant="secondary" style={styles.timestamp}>
            {timestamp}
          </StyledText>
        )}

        {showMetadata && metadata && (
          <View style={styles.metadataContainer}>
            {metadata.testCategory && (
              <View style={styles.metadataItem}>
                <StyledText variant="secondary" style={styles.metadataLabel}>
                  Test:
                </StyledText>
                <StyledText variant="secondary" style={styles.metadataValue}>
                  {metadata.testCategory}
                </StyledText>
              </View>
            )}

            {metadata.responseTime !== undefined && (
              <View style={styles.metadataItem}>
                <StyledText variant="secondary" style={styles.metadataLabel}>
                  Response:
                </StyledText>
                <StyledText variant="secondary" style={styles.metadataValue}>
                  {metadata.responseTime}ms
                </StyledText>
              </View>
            )}

            {metadata.accuracy !== undefined && (
              <View style={styles.metadataItem}>
                <StyledText variant="secondary" style={styles.metadataLabel}>
                  Accuracy:
                </StyledText>
                <StyledText variant="secondary" style={styles.metadataValue}>
                  {metadata.accuracy}%
                </StyledText>
              </View>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.s,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: Spacing.m,
    borderRadius: BorderRadius.large,
  },
  userBubble: {
    borderBottomRightRadius: BorderRadius.small,
  },
  aiBubble: {
    borderBottomLeftRadius: BorderRadius.small,
  },
  message: {
    color: Colors.light.text,
  },
  timestamp: {
    marginTop: Spacing.xs,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  metadataContainer: {
    marginTop: Spacing.s,
    padding: Spacing.s,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: BorderRadius.small,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  metadataLabel: {
    marginRight: Spacing.xs,
    opacity: 0.7,
  },
  metadataValue: {
    opacity: 0.9,
  },
});

export default ChatBubble;
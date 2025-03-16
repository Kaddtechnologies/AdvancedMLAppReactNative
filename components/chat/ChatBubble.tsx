import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { BorderRadius, Spacing, Shadows } from '../../constants/Theme';
import StyledText from '../ui/StyledText';
import { Message } from '../../services/ChatService';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  message: Message;
  style?: ViewStyle;
  showMetadata?: boolean;
  metadata?: {
    testCategory?: string;
    responseTime?: number;
    accuracy?: number;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  style,
  showMetadata = false,
  metadata
}) => {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const isUser = message.isUser;

  // Determine gradient colors based on sender
  const gradientColors = isUser
    ? (colors.primaryGradient?.colors as [string, string]) ?? ['#0A84FF', '#0055FF'] as [string, string]
    : (colors.cardBackgroundGradient?.colors as [string, string]) ?? ['#2a2a2a', '#1a1a1a'] as [string, string];

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer,
      style
    ]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
          isUser ? Shadows.small : null
        ]}
      >
        <StyledText
          style={{
            ...styles.text,
            color: isUser ? colors.textOnPrimary : colors.text,
          }}
        >
          {message.text}
        </StyledText>

        <StyledText
          style={{
            ...styles.timestamp,
            color: isUser ? colors.textOnPrimary : colors.textSecondary,
          }}
        >
          {formatTimestamp(message.timestamp)}
        </StyledText>

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

const formatTimestamp = (timestamp: string | Date) => {
  const now = new Date();
  const messageDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  botContainer: {
    alignSelf: 'flex-start',
    marginRight: '20%',
  },
  bubble: {
    padding: Spacing.m,
    borderRadius: BorderRadius.large,
    minHeight: 40,
  },
  userBubble: {
    borderBottomRightRadius: BorderRadius.small,
  },
  botBubble: {
    borderBottomLeftRadius: BorderRadius.small,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
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
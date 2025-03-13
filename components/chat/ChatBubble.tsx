import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { BorderRadius, Spacing } from '../../constants/Theme';
import StyledText from '../ui/StyledText';
import { Message } from '../../services/ChatService';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  message: Message;
  style?: ViewStyle;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, style }) => {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const isUser = message.isUser;
  const bubbleStyle = {
    backgroundColor: isUser ? colors.accent : colors.background,
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer,
      style
    ]}>
      <LinearGradient
        colors={isUser ? ['#0A84FF', '#0055FF'] : ['#2a2a2a', '#1a1a1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
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
      </LinearGradient>
    </View>
  );
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const messageDate = new Date(timestamp);

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
    borderTopRightRadius: BorderRadius.small,
  },
  botBubble: {
    borderTopLeftRadius: BorderRadius.small,
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
});

export default ChatBubble;
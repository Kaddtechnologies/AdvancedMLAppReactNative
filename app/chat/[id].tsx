import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '../../contexts/AppContext';
import GradientBackground from '../../components/ui/GradientBackground';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import ChatService, { Message } from '../../services/ChatService';
import { Spacing } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const flatListRef = useRef<FlatList>(null);

  const {
    activeMessages,
    setActiveMessages,
    addMessage,
    isLoading,
  } = useAppContext();

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      setRefreshing(true);
      const messages = await ChatService.getConversationHistory(id as string);
      setActiveMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSend = async (text: string) => {
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: new Date(),
        isUser: true,
        status: 'sending',
        conversationId: id as string,
      };
      addMessage(userMessage);

      // Trigger haptic feedback
      Haptics.selectionAsync();

      // Scroll to bottom
      flatListRef.current?.scrollToEnd({ animated: true });

      // Show AI typing indicator
      setIsAiTyping(true);

      // Send message using ChatService
      const response = await ChatService.sendMessage(text, id as string);

      // Update user message status
      userMessage.status = 'sent';
      addMessage(userMessage);

      // Add AI message
      const aiMessage: Message = {
        ...response,
        status: 'sent' as const,
      };

      // Trigger haptic feedback for AI response
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      addMessage(aiMessage);

      // Scroll to bottom again
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
      // Update user message status to error
      const errorMessage = {
        id: Date.now().toString(),
        text,
        timestamp: new Date(),
        isUser: true,
        status: 'error',
        conversationId: id as string,
      };
      addMessage(errorMessage);
    } finally {
      setIsAiTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  const renderTypingIndicator = () => {
    if (!isAiTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <ActivityIndicator color={colors.accent} size="small" />
      </View>
    );
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={activeMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadMessages}
              tintColor={colors.accent}
            />
          }
          ListFooterComponent={renderTypingIndicator}
        />
        <ChatInput
          onSend={handleSend}
          disabled={isAiTyping || isLoading}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: Spacing.m,
    paddingBottom: Spacing.xxl,
  },
  typingContainer: {
    padding: Spacing.m,
    alignItems: 'flex-start',
  },
});
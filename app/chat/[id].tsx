import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppContext } from '../../contexts/AppContext';
import GradientBackground from '../../components/ui/GradientBackground';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import ChatService, { Message } from '../../services/ChatService';
import { Spacing } from '../../constants/Theme';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const {
    activeMessages,
    setActiveMessages,
    addMessage,
    isLoading,
  } = useAppContext();

  const [isAiTyping, setIsAiTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('');

  useEffect(() => {
    loadMessages();
    loadConversationDetails();
  }, [id]);

  const loadConversationDetails = async () => {
    try {
      const conversations = await ChatService.getUserConversations();
      const currentConversation = conversations.find(conv => conv.id === id);
      if (currentConversation) {
        setConversationTitle(currentConversation.title);
      }
    } catch (error) {
      console.error('Error loading conversation details:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const messages = await ChatService.getConversationHistory(id as string);
      setActiveMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (text: string) => {
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: new Date().toISOString(),
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
      console.error('Error sending message in chat/[id].tsx:', error);
      // Update user message status to error
      const errorMessage = {
        id: Date.now().toString(),
        text,
        timestamp: new Date().toISOString(),
        isUser: true,
        status: 'error' as const,
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
      <Stack.Screen
        options={{
          title: conversationTitle || 'Chat',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={colors.text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={activeMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => `message-${item.id}`}
          contentContainerStyle={styles.messageList}
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
});
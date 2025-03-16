import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import ChatBubble from '../../components/chat/ChatBubble';
import GradientButton from '../../components/ui/GradientButton';
import { Spacing } from '../../constants/Theme';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppContext } from '../../contexts/AppContext';
import ChatService, { Message, Conversation } from '../../services/ChatService';
import { format } from 'date-fns';
import VoiceInput from '../../components/ui/VoiceInput';

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const flatListRef = useRef<FlatList>(null);

  const {
    activeSessionId,
    activeConversationId,
    activeMessages,
    setActiveConversation,
    setActiveMessages,
    addMessage
  } = useAppContext();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (activeMessages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeMessages]);

  // Load conversations
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await ChatService.getUserConversations();
      setConversations(data);

      // If we don't have an active conversation, set the first one
      if (!activeConversationId && data.length > 0) {
        setActiveConversation(data[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const data = await ChatService.getConversationHistory(conversationId);
      setActiveMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new conversation
  const createNewConversation = async () => {
    try {
      setIsLoading(true);
      const title = `Conversation ${conversations.length + 1}`;
      const response = await ChatService.createConversation(title);

      // Add the new conversation to the list
      const newConversation: Conversation = {
        id: response['conversationId'],
        title,
        lastMessage: '',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0,
        messageCount: 0
      };

      setConversations([newConversation, ...conversations]);
      setActiveConversation(response['conversationId']);
      router.push(`/chat/${response['conversationId']}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!message.trim() || !activeConversationId) {
      return;
    }

    try {
      setIsSending(true);

      // Add the user message to the UI immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        status: 'sent',
        conversationId: activeConversationId,
        timestamp: new Date().toISOString()
      };

      addMessage(userMessage);
      setMessage('');

      // Send the message to the API
      const metadata = activeSessionId ? { testSessionId: activeSessionId } : undefined;
      const response = await ChatService.sendMessage(message, activeConversationId);

      // Add the AI response to the UI
      addMessage(response);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  // Render a conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        activeConversationId === item.id && styles.activeConversation
      ]}
      onPress={() => setActiveConversation(item.id)}
    >
      <View style={styles.conversationIcon}>
        <FontAwesome
          name="comments"
          size={16}
          color={activeConversationId === item.id ? colors.accent : colors.accentSecondary}
        />
      </View>
      <View style={styles.conversationInfo}>
        <StyledText variant="bodySmall" weight="medium" numberOfLines={1}>
          {item.title}
        </StyledText>
        {item.lastMessage && (
          <StyledText variant="secondary" numberOfLines={1} style={styles.lastMessage}>
            {item.lastMessage}
          </StyledText>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Sidebar with conversations */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <StyledText variant="sectionHeader" weight="medium">
              Conversations
            </StyledText>
            <TouchableOpacity
              style={styles.newButton}
              onPress={createNewConversation}
              disabled={isLoading}
            >
              <FontAwesome name="plus" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {isLoading && !activeConversationId ? (
            <ActivityIndicator color={colors.accent} style={styles.loader} />
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={item => item.id}
              renderItem={renderConversationItem}
              contentContainerStyle={styles.conversationsList}
            />
          )}
        </View>

        {/* Chat area */}
        <View style={styles.chatArea}>
          {activeConversationId ? (
            <>
              {/* Messages */}
              <FlatList
                ref={flatListRef}
                data={activeMessages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <ChatBubble
                    message={item}
                    showMetadata={!!activeSessionId}
                    metadata={item.metadata}
                  />
                )}
                contentContainerStyle={styles.messagesList}
                ListEmptyComponent={
                  isLoading ? (
                    <ActivityIndicator color={colors.accent} style={styles.loader} />
                  ) : (
                    <View style={styles.emptyState}>
                      <FontAwesome name="comments" size={48} color={colors.accentSecondary} />
                      <StyledText variant="body" style={styles.emptyStateText}>
                        No messages yet. Start a conversation!
                      </StyledText>
                    </View>
                  )
                }
              />

              {/* Input area */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
                style={styles.inputContainer}
              >
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.accentSecondary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                    editable={!isSending}
                  />
                  <VoiceInput
                    onTextChange={(text) => setMessage(text)}
                    disabled={isSending}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!message.trim() || isSending) && styles.sendButtonDisabled
                  ]}
                  onPress={sendMessage}
                  disabled={!message.trim() || isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <FontAwesome name="send" size={16} color={colors.text} />
                  )}
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="comments" size={48} color={colors.accentSecondary} />
              <StyledText variant="body" style={styles.emptyStateText}>
                Select a conversation or create a new one.
              </StyledText>
              <GradientButton
                title="New Conversation"
                onPress={createNewConversation}
                style={styles.newConversationButton}
              />
            </View>
          )}
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 250,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  newButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationsList: {
    padding: Spacing.s,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    borderRadius: 8,
    marginBottom: Spacing.s,
  },
  activeConversation: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  conversationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
  },
  conversationInfo: {
    flex: 1,
  },
  lastMessage: {
    opacity: 0.7,
    marginTop: 2,
  },
  chatArea: {
    flex: 1,
    flexDirection: 'column',
  },
  messagesList: {
    flexGrow: 1,
    padding: Spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    color: 'white',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(166,124,109,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: Spacing.m,
    opacity: 0.7,
  },
  newConversationButton: {
    marginTop: Spacing.l,
    minWidth: 200,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    marginRight: Spacing.s,
  },
});

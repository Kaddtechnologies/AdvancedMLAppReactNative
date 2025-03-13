import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';

import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import { Colors } from '../../constants/Colors';
import { Spacing, BorderRadius } from '../../constants/Theme';
import ChatService, { Conversation } from '../../services/ChatService';

export default function ConversationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setError(null);
      const data = await ChatService.getUserConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadConversations();
  }, [loadConversations]);

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim()) return;

    try {
      setIsCreatingConversation(true);
      setError(null);

      // Trigger haptic feedback
      Haptics.selectionAsync();

      const conversationId = await ChatService.createConversation(newConversationTitle.trim());

      // Add new conversation to the list
      const newConversation: Conversation = {
        id: conversationId,
        title: newConversationTitle.trim(),
        unreadCount: 0,
        lastMessageTimestamp: new Date(),
      };

      setConversations([newConversation, ...conversations]);
      setNewConversationTitle('');
      setIsCreatingConversation(false);

      // Navigate to the new conversation
      router.push(`/chat/${conversationId}`);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create conversation. Please try again.');
      setIsCreatingConversation(false);
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    Haptics.selectionAsync();
    router.push(`/chat/${conversation.id}`);
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    return format(timestamp, 'MMM d, h:mm a');
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => handleConversationPress(item)}
      style={styles.conversationContainer}
    >
      <GradientCard style={styles.conversationCard}>
        <View style={styles.conversationHeader}>
          <StyledText style={{ ...styles.title, fontSize: 16, fontWeight: '500' }} numberOfLines={1}>
            {item.title}
          </StyledText>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <StyledText style={{ fontSize: 12, color: '#FFFFFF' }}>
                {item.unreadCount}
              </StyledText>
            </View>
          )}
        </View>

        <View style={styles.conversationFooter}>
          {item.lastMessage && (
            <StyledText style={{ ...styles.lastMessage, fontSize: 14, opacity: 0.7 }} numberOfLines={1}>
              {item.lastMessage}
            </StyledText>
          )}
          {item.lastMessageTimestamp && (
            <StyledText style={{ fontSize: 12, opacity: 0.7 }}>
              {formatTimestamp(item.lastMessageTimestamp)}
            </StyledText>
          )}
        </View>
      </GradientCard>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome name="comments" size={48} color={colors.accentSecondary} />
      <StyledText style={{ ...styles.emptyStateText, fontSize: 16 }}>
        No conversations yet. Start one below!
      </StyledText>
    </View>
  );

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <StyledText style={{ fontSize: 24, fontWeight: 'bold' }}>
            Conversations
          </StyledText>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <StyledText style={{ fontSize: 14, color: '#FF3B30' }}>
              {error}
            </StyledText>
          </View>
        )}

        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter conversation title..."
            placeholderTextColor={colors.accentSecondary}
            value={newConversationTitle}
            onChangeText={setNewConversationTitle}
            onSubmitEditing={handleCreateConversation}
            editable={!isCreatingConversation}
          />
          <TouchableOpacity
            style={[
              styles.createButton,
              (!newConversationTitle.trim() || isCreatingConversation) && styles.createButtonDisabled
            ]}
            onPress={handleCreateConversation}
            disabled={!newConversationTitle.trim() || isCreatingConversation}
          >
            {isCreatingConversation ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <FontAwesome name="plus" size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
  listContent: {
    padding: 16,
  },
  conversationContainer: {
    marginBottom: 16,
  },
  conversationCard: {
    padding: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.dark.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
});
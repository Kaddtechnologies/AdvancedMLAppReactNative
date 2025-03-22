import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, MessageSquarePlus, ChevronRight } from 'lucide-react-native';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientButton from '../../components/ui/GradientButton';
import GradientCard from '../../components/ui/GradientCard';
import { Spacing, BorderRadius, Shadows } from '../../constants/Theme';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import ChatService from '../../services/ChatService';
import { format } from 'date-fns';

// Updated conversation interface to match backend model
interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  isActive: boolean;
}

export default function ConversationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load conversations
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await ChatService.getUserConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
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
        id: response.conversationId,
        userId: 'current-user', // This should come from your auth context
        title,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        isActive: true
      };

      setConversations(prevConversations => [newConversation, ...prevConversations]);
      router.push(`/chat/${response.conversationId}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      setIsDeleting(true);
      await ChatService.deleteConversation(conversationId);
      setConversations(conversations.filter(conv => conv.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      Alert.alert('Error', 'Failed to delete conversation. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete all conversations
  const deleteAllConversations = async () => {
    Alert.alert(
      'Delete All Conversations',
      'Are you sure you want to delete all conversations? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await ChatService.deleteAllConversations('current-user'); // Replace with actual user ID
              setConversations([]);
            } catch (error) {
              console.error('Error deleting all conversations:', error);
              Alert.alert('Error', 'Failed to delete all conversations. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  // Render a conversation item
  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <GradientCard
        style={styles.conversationCard}
        withShadow={true}
      >
        <View style={styles.conversationContent}>
          <View style={styles.conversationInfo}>
            <StyledText
              variant="cardTitle"
              weight="semibold"
              numberOfLines={1}
              style={styles.conversationTitle}
            >
              {item.title}
            </StyledText>
            <StyledText
              variant="bodySmall"
              style={styles.conversationTimestamp}
            >
              {formatTimestamp(item.lastMessageAt)}
            </StyledText>
          </View>

          <View style={styles.conversationActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteConversation(item.id)}
              disabled={isDeleting}
            >
              <Trash2
                size={20}
                color={colors.textSecondary}
                style={{ opacity: isDeleting ? 0.5 : 1 }}
              />
            </TouchableOpacity>
            <ChevronRight size={20} color={colors.textSecondary} />
          </View>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <StyledText variant="sectionHeader" weight="semibold">
            Recent Conversations
          </StyledText>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={deleteAllConversations}
              disabled={isDeleting || conversations.length === 0}
            >
              <Trash2
                size={20}
                color={colors.textSecondary}
                style={{ opacity: (isDeleting || conversations.length === 0) ? 0.5 : 1 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={createNewConversation}
              disabled={isLoading}
            >
              <MessageSquarePlus
                size={20}
                color={colors.accent}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.accent} />
            <StyledText variant="bodySmall" style={styles.loadingText}>
              Loading conversations...
            </StyledText>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquarePlus size={48} color={colors.accentSecondary} />
            <StyledText variant="body" style={styles.emptyStateText}>
              No conversations yet
            </StyledText>
            <GradientButton
              title="Start New Chat"
              onPress={createNewConversation}
              style={styles.newChatButton}
              size="small"
              icon={MessageSquarePlus}
            />
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={item => `conversation-${item.id}`}
            renderItem={renderConversationItem}
            contentContainerStyle={styles.conversationsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  conversationsList: {
    padding: Spacing.m,
  },
  conversationCard: {
    marginBottom: Spacing.s,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationInfo: {
    flex: 1,
    marginRight: Spacing.s,
  },
  conversationTitle: {
    marginBottom: 2,
  },
  conversationTimestamp: {
    color: Colors.dark.textSecondary,
  },
  conversationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: Spacing.s,
    marginRight: Spacing.s,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.s,
    color: Colors.dark.textSecondary,
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
    marginBottom: Spacing.l,
    color: Colors.dark.textSecondary,
  },
  newChatButton: {
    minWidth: 200,
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Plus, MessageCircle, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAppContext } from '../../contexts/AppContext';
import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientCard from '../../components/ui/GradientCard';
import GradientButton from '../../components/ui/GradientButton';
import ConversationsDrawer from '../../components/ui/ConversationsDrawer';
import ChatService, { Conversation } from '../../services/ChatService';
import { Spacing } from '../../constants/Theme';

export default function ConversationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const { isLoading: contextLoading, setIsLoading: setContextLoading } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const userConversations = await ChatService.getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const handleNewConversation = async () => {
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const newConversation = await ChatService.createNewConversation();
      router.push(`/chat/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    router.push(`/chat/${conversation.id}`);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      setLoading(true);
      await ChatService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      <GradientCard style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <MessageCircle color={colors.accent} size={24} />
          </View>
          <View style={styles.textContainer}>
            <StyledText style={styles.title} numberOfLines={1}>
              {item.title}
            </StyledText>
            <StyledText style={styles.subtitle}>
              {new Date(item.lastMessageAt).toLocaleDateString()}
            </StyledText>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteConversation(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </GradientCard>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MessageCircle size={60} color={colors.textSecondary} />
      <StyledText style={styles.emptyTitle}>No Conversations Yet</StyledText>
      <StyledText style={styles.emptySubtitle}>
        Start a new conversation to begin chatting with the AI
      </StyledText>
      <GradientButton
        title="New Conversation"
        onPress={handleNewConversation}
        style={styles.newButton}
        icon={Plus}
        disabled={loading}
      />
    </View>
  );

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <StyledText style={styles.headerTitle}>Conversations</StyledText>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsDrawerVisible(true)}
          >
            <Menu color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {loading && conversations.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <>
            {conversations.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            )}

            {conversations.length > 0 && (
              <TouchableOpacity
                style={styles.fab}
                onPress={handleNewConversation}
                disabled={loading}
              >
                <Plus color="#fff" size={24} />
              </TouchableOpacity>
            )}
          </>
        )}

        <ConversationsDrawer
          isVisible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          conversations={conversations}
          onConversationPress={handleConversationPress}
          onDeleteConversation={handleDeleteConversation}
          onNewConversation={handleNewConversation}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: Spacing.m,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.l,
    paddingBottom: 100, // Extra space for FAB
  },
  conversationItem: {
    marginBottom: Spacing.m,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  newButton: {
    minWidth: 200,
  },
});
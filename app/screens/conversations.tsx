import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Clipboard,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';

import GradientBackground from '../../components/ui/GradientBackground';
import StyledText from '../../components/ui/StyledText';
import GradientButton from '../../components/ui/GradientButton';
import ConversationsDrawer from '../../components/ui/ConversationsDrawer';
import { Colors } from '../../constants/Colors';
import { Spacing } from '../../constants/Theme';
import ChatService, { Conversation } from '../../services/ChatService';

const CONVERSATIONS_CACHE_KEY = '@conversations_cache';
const isDevelopment = Constants.expoConfig?.extra?.ENV === 'development' || __DEV__;

export default function ConversationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Load cached conversations
  const loadCachedConversations = async () => {
    try {
      const cached = await AsyncStorage.getItem(CONVERSATIONS_CACHE_KEY);
      if (cached) {
        setConversations(JSON.parse(cached));
      }
    } catch (err) {
      console.warn('Error loading cached conversations:', err);
    }
  };

  // Save conversations to cache
  const cacheConversations = async (data: Conversation[]) => {
    try {
      await AsyncStorage.setItem(CONVERSATIONS_CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Error caching conversations:', err);
    }
  };

  const loadConversations = useCallback(async () => {
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setError('No internet connection. Showing cached conversations.');
        await loadCachedConversations();
        return;
      }

      setError(null);
      const data = await ChatService.getUserConversations();
      setConversations(data);
      await cacheConversations(data);
    } catch (err: any) {
      console.error('Error loading conversations:', err);
      let errorMessage = '';

      // Always show detailed error information
      errorMessage = `Error ${err.response?.status || 'unknown'}: ${err.message}\n`;
      if (err.response?.data) {
        errorMessage += `\nServer Response: ${JSON.stringify(err.response.data, null, 2)}`;
      }
      if (err.config?.url) {
        errorMessage += `\nEndpoint: ${err.config.url}`;
      }

      setError(errorMessage);
      await loadCachedConversations();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleConversationPress = (conversation: Conversation) => {
    Haptics.selectionAsync();
    setIsDrawerVisible(false);
    router.push(`/chat/${conversation.id}`);
  };

  const handleNewConversation = () => {
    Haptics.selectionAsync();
    router.push('/chat');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              Haptics.selectionAsync();
              setIsDrawerVisible(true);
            }}
          >
            <Menu color={colors.text} size={24} />
          </TouchableOpacity>
          <StyledText style={styles.title}>Conversations</StyledText>
          <TouchableOpacity
            style={styles.newButton}
            onPress={handleNewConversation}
          >
            <Plus color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorHeader}>
              <ScrollView style={styles.errorScroll}>
                <StyledText style={styles.errorText}>
                  {error}
                </StyledText>
              </ScrollView>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Clipboard.setString(error);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
              >
                <FontAwesome
                  name="copy"
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && (
          <View style={styles.emptyState}>
            <StyledText style={styles.emptyTitle}>Welcome!</StyledText>
            <StyledText style={styles.emptyText}>
              Start a new conversation to begin chatting with our AI assistant.
            </StyledText>
            <GradientButton
              title="New Conversation"
              onPress={handleNewConversation}
              style={styles.emptyButton}
              icon={Plus}
              iconPosition="left"
            />
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <StyledText style={styles.loadingText}>
              Loading conversations...
            </StyledText>
          </View>
        )}

        {/* Conversations Drawer */}
        <ConversationsDrawer
          isVisible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          conversations={conversations}
          onConversationPress={handleConversationPress}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
    maxHeight: '50%',
  } as ViewStyle,
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  } as ViewStyle,
  errorScroll: {
    flex: 1,
    paddingHorizontal: 4,
    marginRight: 8,
  } as ViewStyle,
  errorText: {
    color: '#FFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
    textAlign: 'left',
  } as TextStyle,
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  } as ViewStyle,
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.m,
    fontSize: 16,
    opacity: 0.7,
  },
});
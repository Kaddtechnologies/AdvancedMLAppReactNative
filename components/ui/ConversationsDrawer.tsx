import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MessageCircle, Plus, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';

import StyledText from './StyledText';
import GradientCard from './GradientCard';
import GradientButton from './GradientButton';
import { Colors } from '../../constants/Colors';
import { Conversation } from '../../services/ChatService';
import { Spacing } from '../../constants/Theme';
import { useAppContext } from '../../contexts/AppContext';

interface ConversationsDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onConversationPress: (conversation: Conversation) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onNewConversation?: () => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.85, 400);

export default function ConversationsDrawer({
  isVisible,
  onClose,
  conversations,
  onConversationPress,
  onDeleteConversation,
  onNewConversation,
}: ConversationsDrawerProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { isLoading } = useAppContext();

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Trigger haptic feedback when drawer opens
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, fadeAnim]);

  const handleConversationPress = (conversation: Conversation) => {
    onConversationPress(conversation);
    onClose();
    
    // Trigger haptic feedback on selection
    Haptics.selectionAsync();
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (onDeleteConversation) {
      onDeleteConversation(conversationId);
      
      // Trigger haptic feedback on delete
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleNewConversation = () => {
    if (onNewConversation) {
      onNewConversation();
      onClose();
      
      // Trigger haptic feedback on new conversation
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      <GradientCard style={styles.conversationCard}>
        <View style={styles.conversationContent}>
          <MessageCircle size={20} color={colors.accent} style={styles.conversationIcon} />
          <View style={styles.conversationTextContainer}>
            <StyledText style={styles.conversationTitle} numberOfLines={1}>
              {item.title}
            </StyledText>
            <StyledText style={styles.conversationDate}>
              {format(new Date(item.lastMessageAt), 'MMM d, yyyy')}
            </StyledText>
          </View>
          {onDeleteConversation && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteConversation(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </GradientCard>
    </TouchableOpacity>
  );

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          backgroundColor: `rgba(0, 0, 0, ${colorScheme === 'dark' ? 0.7 : 0.5})`,
        },
      ]}
    >
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: colors.cardBackgroundGradient.colors[0],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.drawerContent}>
              <View style={styles.header}>
                <StyledText style={styles.title}>Conversations</StyledText>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {onNewConversation && (
                <GradientButton
                  title="New Conversation"
                  onPress={handleNewConversation}
                  style={styles.newButton}
                  icon={Plus}
                  disabled={isLoading}
                />
              )}

              {conversations.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MessageCircle size={40} color={colors.textSecondary} />
                  <StyledText style={styles.emptyText}>No conversations yet</StyledText>
                  <StyledText style={styles.emptySubtext}>
                    Start a new conversation to begin chatting
                  </StyledText>
                </View>
              ) : (
                <FlatList
                  data={conversations}
                  renderItem={renderConversationItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.conversationsList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  newButton: {
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  conversationsList: {
    paddingHorizontal: Spacing.l,
    paddingBottom: 100,
  },
  conversationItem: {
    marginBottom: Spacing.m,
  },
  conversationCard: {
    padding: 0,
    overflow: 'hidden',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
  },
  conversationIcon: {
    marginRight: Spacing.m,
  },
  conversationTextContainer: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  conversationDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
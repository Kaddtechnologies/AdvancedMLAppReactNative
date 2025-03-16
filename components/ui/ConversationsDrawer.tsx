import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MessageCircle } from 'lucide-react-native';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native';

import StyledText from './StyledText';
import GradientCard from './GradientCard';
import { Colors } from '../../constants/Colors';
import { Conversation } from '../../services/ChatService';

interface ConversationsDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onConversationPress: (conversation: Conversation) => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.85, 400);

export default function ConversationsDrawer({
  isVisible,
  onClose,
  conversations,
  onConversationPress,
}: ConversationsDrawerProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const router = useRouter();

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
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <LinearGradient
            colors={['rgba(30,30,30,0.9)', 'rgba(20,20,20,0.8)']}
            start={colors.navBarGradient.start}
            end={colors.navBarGradient.end}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <StyledText style={styles.title}>Conversations</StyledText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationItem}
                onPress={() => {
                  Haptics.selectionAsync();
                  onConversationPress(conversation);
                }}
              >
                <GradientCard style={styles.conversationCard}>
                  <View style={styles.conversationIcon}>
                    <MessageCircle color={colors.accent} size={24} />
                  </View>
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <StyledText style={styles.conversationTitle} numberOfLines={1}>
                        {conversation.title}
                      </StyledText>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <StyledText style={styles.unreadText}>
                            {conversation.unreadCount}
                          </StyledText>
                        </View>
                      )}
                    </View>
                    {conversation.lastMessage && (
                      <StyledText style={styles.lastMessage} numberOfLines={2}>
                        {conversation.lastMessage}
                      </StyledText>
                    )}
                    {conversation.lastMessageTimestamp && (
                      <StyledText style={styles.timestamp}>
                        {formatTimestamp(conversation.lastMessageTimestamp)}
                      </StyledText>
                    )}
                  </View>
                </GradientCard>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </BlurView>
      </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    marginBottom: 12,
  },
  conversationCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conversationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
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
    paddingHorizontal: 8,
  },
  unreadText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
  },
});
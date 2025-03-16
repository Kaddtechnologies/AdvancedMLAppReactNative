import { useAppContext } from '../contexts/AppContext';
import FirebaseService from './FirebaseService';
import apiClient from './ApiConfig';
import * as Sentry from '@sentry/react-native';

// Types for Chat API
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  status: 'sending' | 'sent' | 'error';
  conversationId: string;
  metadata?: {
    responseTime?: number;
    testCategory?: string;
    testSessionId?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  messageCount: number;
}

export interface ChatRequestModel {
  userId: string;
  message: string;
  conversationId?: string;
  metadata?: {
    testCategory?: string;
    testSessionId?: string;
  };
}

export interface CreateConversationRequest {
  userId: string;
  title: string;
}

export interface FeedbackRequest {
  chatId: string;
  userId: string;
  rating: number;
  comments: string;
}

// Default user ID as fallback
const DEFAULT_USER_ID = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b';

/**
 * Service for interacting with the Chat API
 */
class ChatService {
  private baseUrl = '/api/Chat';

  /**
   * Get the current user ID from Firebase or use default
   */
  private async getUserId(): Promise<string> {
    try {
      // Try to get user ID from Firebase
      const firebaseUser = FirebaseService.getCurrentUser();
      if (firebaseUser && firebaseUser.uid) {
        return firebaseUser.uid;
      }

      // If no Firebase user, try to get from SecureStore
      const uid = await FirebaseService.getUid();
      if (uid) {
        return uid;
      }
    } catch (error) {
      console.warn('Error getting user ID, using default:', error);
      Sentry.captureException(error, {
        tags: {
          component: 'ChatService',
          method: 'getUserId',
        },
      });
    }

    // Fallback to default
    return DEFAULT_USER_ID;
  }

  /**
   * Send a message to the AI
   */
  async sendMessage(text: string, conversationId: string): Promise<Message> {
    try {
      const userId = await FirebaseService.getUid();
      if (!userId) throw new Error('User not authenticated');

      const requestModel: ChatRequestModel = {
        userId,
        message: text,
        conversationId,
      };

      const { data } = await apiClient.post(`${this.baseUrl}/send`, requestModel);
      return {
        id: data.id,
        text: data.message || data.text,
        timestamp: new Date(data.timestamp).toISOString(),
        isUser: false,
        status: 'sent' as const,
        conversationId,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string, limit: number = 50): Promise<Message[]> {
    try {
      const userId = await FirebaseService.getUid();
      if (!userId) throw new Error('User not authenticated');

      const { data } = await apiClient.get(
        `${this.baseUrl}/history/${conversationId}`,
        {
          params: {
            limit,
            userId
          }
        }
      );
      return data.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        timestamp: new Date(msg.timestamp),
        isUser: msg.isUser,
        status: 'sent',
        conversationId,
      }));
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Get user conversations
   */
  async getUserConversations(limit: number = 10): Promise<Conversation[]> {
    try {
      const userId = await FirebaseService.getUid();
      if (!userId) throw new Error('User not authenticated');

      const { data } = await apiClient.get(
        `${this.baseUrl}/conversations`,
        {
          params: {
            limit,
            userId
          }
        }
      );

      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      return data.map((conv: any) => ({
        id: conv.id,
        title: conv.title,
        lastMessage: conv.lastMessage,
        lastMessageTimestamp: conv.lastMessageTimestamp ? new Date(conv.lastMessageTimestamp).toISOString() : undefined,
        unreadCount: conv.unreadCount || 0,
        messageCount: conv.messageCount || 0,
      }));
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      throw error;
    }
  }

  /**
   * Create a new conversation
   */
  async createConversation(title: string): Promise<string> {
    try {
      const userId = await FirebaseService.getUid();
      if (!userId) throw new Error('User not authenticated');

      const request: CreateConversationRequest = {
        userId,
        title,
      };

      const { data } = await apiClient.post(`${this.baseUrl}/conversation`, request);
      return data.conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Submit feedback for a chat message
   */
  async submitFeedback(chatId: string, rating: number, comments: string): Promise<void> {
    try {
      const userId = await this.getUserId();

      Sentry.addBreadcrumb({
        category: 'chat',
        message: 'Submitting feedback',
        level: 'info',
        data: { chatId, userId, rating }
      });

      const request: FeedbackRequest = {
        chatId,
        userId,
        rating,
        comments
      };

      await apiClient.post(`${this.baseUrl}/feedback`, request);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'ChatService',
          method: 'submitFeedback',
        },
      });
      throw error;
    }
  }
}

export default new ChatService();
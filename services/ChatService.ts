import apiClient from './ApiConfig';

// Types for Chat API
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  metadata?: {
    testCategory?: string;
    responseTime?: number;
    accuracy?: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTimestamp: string;
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

// Fixed user ID from project specifications
const FIXED_USER_ID = 'a6d3028d-a025-493f-a75a-8ee5e88ff52b';

/**
 * Service for interacting with the Chat API
 */
class ChatService {
  /**
   * Send a message to the AI
   */
  async sendMessage(message: string, conversationId?: string, metadata?: any): Promise<Message> {
    const request: ChatRequestModel = {
      userId: FIXED_USER_ID,
      message,
      conversationId,
      metadata
    };

    const response = await apiClient.post('/api/Chat/send', request);
    return response.data;
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string, limit: number = 50): Promise<Message[]> {
    const response = await apiClient.get(`/api/Chat/history/${conversationId}`, {
      params: {
        limit,
        userId: FIXED_USER_ID
      }
    });
    return response.data;
  }

  /**
   * Get user conversations
   */
  async getUserConversations(limit: number = 10): Promise<Conversation[]> {
    const response = await apiClient.get('/api/Chat/conversations', {
      params: {
        limit,
        userId: FIXED_USER_ID
      }
    });
    return response.data;
  }

  /**
   * Create a new conversation
   */
  async createConversation(title: string): Promise<{ conversationId: string }> {
    const request: CreateConversationRequest = {
      userId: FIXED_USER_ID,
      title
    };

    const response = await apiClient.post('/api/Chat/conversation', request);
    return response.data;
  }
}

export default new ChatService();
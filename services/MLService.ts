import apiClient from './ApiConfig';
import { Message } from './ChatService';

// Types for ML API
export interface SentimentAnalysisRequest {
  text: string;
  conversationId?: string;
}

export interface SentimentResult {
  text: string;
  sentiment: string;
  score: number;
  timestamp: string;
}

export interface ClassificationRequest {
  text: string;
  categories?: string[];
}

export interface ClassificationResult {
  text: string;
  category: string;
  confidence: number;
}

export interface ConversationAnalysisRequest {
  conversationId: string;
  messages: {
    text: string;
    senderId: string;
    timestamp: string;
  }[];
}

export interface ConversationAnalysisResponse {
  overallSentiment: string;
  messageCount: number;
  details: SentimentResult[];
}

/**
 * Service for interacting with the ML API
 */
class MLService {
  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string, conversationId?: string): Promise<SentimentResult> {
    const request: SentimentAnalysisRequest = {
      text,
      conversationId
    };

    const response = await apiClient.post('/api/ML/sentiment', request);
    return response.data;
  }

  /**
   * Classify text into categories
   */
  async classifyText(text: string, categories?: string[]): Promise<ClassificationResult> {
    const request: ClassificationRequest = {
      text,
      categories
    };

    const response = await apiClient.post('/api/ML/classify', request);
    return response.data;
  }

  /**
   * Analyze a conversation
   */
  async analyzeConversation(
    conversationId: string,
    messages: Message[]
  ): Promise<ConversationAnalysisResponse> {
    const formattedMessages = messages.map(msg => ({
      text: msg.text,
      senderId: msg.isUser ? 'user' : 'ai',
      timestamp: msg.timestamp
    }));

    const request: ConversationAnalysisRequest = {
      conversationId,
      messages: formattedMessages
    };

    const response = await apiClient.post('/api/ML/analyze-conversation', request);
    return response.data;
  }
}

export default new MLService();
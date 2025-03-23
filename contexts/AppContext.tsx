import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseService from '../services/FirebaseService';
import TestSessionService, { TestSession } from '../services/TestSessionService';
import { Message } from '../services/ChatService';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from '../components/common/ErrorBoundary';
import * as SecureStore from 'expo-secure-store';

interface ApiClient {
  get: (url: string) => Promise<Response>;
  post: (url: string, data: any) => Promise<Response>;
  put: (url: string, data: any) => Promise<Response>;
  delete: (url: string) => Promise<Response>;
}

interface AppContextType {
  apiClient: ApiClient;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  testSessions: TestSession[];
  activeSessionId: string | null;
  activeConversationId: string | null;
  activeMessages: Message[];
  metricsHistory: any;
  sharedInfo: any;

  // Actions
  setIsLoading: (isLoading: boolean) => void;
  refreshTestSessions: () => Promise<void>;
  refreshMetricsHistory: () => Promise<void>;
  refreshSharedInfo: () => Promise<void>;
  setActiveSession: (sessionId: string | null) => void;
  setActiveConversation: (conversationId: string | null) => void;
  setActiveMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<any>({});
  const [sharedInfo, setSharedInfo] = useState<any>({});

  // Initialize API client with authentication
  const apiClient: ApiClient = {
    get: async (url: string) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    post: async (url: string, data: any) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    put: async (url: string, data: any) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    delete: async (url: string) => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
  };

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Starting app initialization...');
      setIsLoading(true);
      setError(null);

      try {
        Sentry.addBreadcrumb({
          category: 'app',
          message: 'Starting app initialization',
          level: 'info',
        });

        // Initialize Firebase with error handling
        console.log('Initializing Firebase...');
        try {
          await FirebaseService.initialize();
          console.log('Firebase initialized successfully');
          Sentry.addBreadcrumb({
            category: 'firebase',
            message: 'Firebase initialized successfully',
            level: 'info',
          });
        } catch (firebaseError) {
          console.error('Error initializing Firebase:', firebaseError);
          // Log error but continue - Firebase is not critical for app function
          Sentry.captureException(firebaseError, {
            tags: {
              component: 'AppContext',
              method: 'initializeApp',
              step: 'firebase_init'
            }
          });
        }

        // Load test sessions with error handling
        console.log('Loading test sessions...');
        try {
          await refreshTestSessions();
          console.log('Test sessions loaded successfully');
          Sentry.addBreadcrumb({
            category: 'data',
            message: 'Test sessions loaded',
            level: 'info',
          });
        } catch (sessionsError) {
          console.error('Error loading test sessions:', sessionsError);
          // Non-critical error, continue with empty sessions
          setTestSessions([]);
          Sentry.captureException(sessionsError, {
            tags: {
              component: 'AppContext',
              method: 'initializeApp',
              step: 'load_sessions'
            }
          });
        }

        // Load metrics history with error handling
        console.log('Loading metrics history...');
        try {
          await refreshMetricsHistory();
          console.log('Metrics history loaded successfully');
          Sentry.addBreadcrumb({
            category: 'data',
            message: 'Metrics history loaded',
            level: 'info',
          });
        } catch (metricsError) {
          console.error('Error loading metrics history:', metricsError);
          // Non-critical error, continue with empty metrics
          setMetricsHistory({});
          Sentry.captureException(metricsError, {
            tags: {
              component: 'AppContext',
              method: 'initializeApp',
              step: 'load_metrics'
            }
          });
        }

        // Load shared info with error handling
        console.log('Loading shared info...');
        try {
          await refreshSharedInfo();
          console.log('Shared info loaded successfully');
          Sentry.addBreadcrumb({
            category: 'data',
            message: 'Shared info loaded',
            level: 'info',
          });
        } catch (infoError) {
          console.error('Error loading shared info:', infoError);
          // Non-critical error, continue with empty shared info
          setSharedInfo({});
          Sentry.captureException(infoError, {
            tags: {
              component: 'AppContext',
              method: 'initializeApp',
              step: 'load_shared_info'
            }
          });
        }

        // Check authentication status
        try {
          const userId = await FirebaseService.getUid();
          const isAuth = !!userId;
          setIsAuthenticated(isAuth);

          if (isAuth) {
            Sentry.setUser({ id: userId });
            Sentry.addBreadcrumb({
              category: 'auth',
              message: 'User context set in Sentry',
              level: 'info',
            });
          } else {
            // Proceed as unauthenticated user
            console.log('No authenticated user, proceeding in unauthenticated state');
            Sentry.addBreadcrumb({
              category: 'auth',
              message: 'Proceeding without authentication',
              level: 'info',
            });
          }
        } catch (userError) {
          console.error('Error checking authentication:', userError);
          // Proceed as unauthenticated user
          setIsAuthenticated(false);
          Sentry.captureException(userError);
        }

        Sentry.addBreadcrumb({
          category: 'app',
          message: 'App initialization completed',
          level: 'info',
        });
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to initialize app');
        Sentry.captureException(error, {
          tags: {
            component: 'AppContext',
            method: 'initializeApp',
            step: 'global_init'
          }
        });
      } finally {
        // Always proceed by setting loading to false
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };

    // Start initialization immediately
    initializeApp();
  }, []);

  // Refresh test sessions
  const refreshTestSessions = async () => {
    try {
      const sessions = await TestSessionService.getTestSessions();
      setTestSessions(sessions);
    } catch (error) {
      console.error('Error refreshing test sessions:', error);
      Sentry.captureException(error);
    }
  };

  // Refresh metrics history
  const refreshMetricsHistory = async () => {
    try {
      const history = await TestSessionService.getMetricsHistory();
      setMetricsHistory(history);
    } catch (error) {
      console.error('Error refreshing metrics history:', error);
      Sentry.captureException(error);
    }
  };

  // Refresh shared info
  const refreshSharedInfo = async () => {
    try {
      const info = await TestSessionService.getSharedInfo();
      setSharedInfo(info);
    } catch (error) {
      console.error('Error refreshing shared info:', error);
      Sentry.captureException(error);
    }
  };

  // Set active session
  const handleSetActiveSession = (sessionId: string | null) => {
    try {
      setActiveSessionId(sessionId);

      // If we have a session ID, find the session and set the conversation ID
      if (sessionId) {
        const session = testSessions.find(s => s.id === sessionId);
        if (session && session.conversationId) {
          setActiveConversationId(session.conversationId);

          // Add breadcrumb for session change
          Sentry.addBreadcrumb({
            category: 'session',
            message: `Changed active session to ${sessionId}`,
            level: 'info',
          });
        } else {
          setActiveConversationId(null);
        }
      } else {
        setActiveConversationId(null);
      }

      // Clear active messages
      setActiveMessages([]);
    } catch (error) {
      console.error('Error setting active session:', error);
      Sentry.captureException(error);
    }
  };

  // Add a message to the active messages
  const addMessage = (message: Message) => {
    try {
      setActiveMessages(prevMessages => [...prevMessages, message]);

      // Add breadcrumb for message
      Sentry.addBreadcrumb({
        category: 'message',
        message: `Added message: ${message.id}`,
        level: 'info',
        data: {
          messageId: message.id,
          isUser: message.isUser,
          conversationId: activeConversationId,
        },
      });
    } catch (error) {
      console.error('Error adding message:', error);
      Sentry.captureException(error);
    }
  };

  const value: AppContextType = {
    apiClient,
    isLoading,
    error,
    isAuthenticated,
    testSessions,
    activeSessionId,
    activeConversationId,
    activeMessages,
    metricsHistory,
    sharedInfo,

    setIsLoading,
    refreshTestSessions,
    refreshMetricsHistory,
    refreshSharedInfo,
    setActiveSession: handleSetActiveSession,
    setActiveConversation: setActiveConversationId,
    setActiveMessages,
    addMessage,
  };

  return (
    <ErrorBoundary>
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    </ErrorBoundary>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

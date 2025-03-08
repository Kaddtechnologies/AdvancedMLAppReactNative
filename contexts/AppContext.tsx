import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseService from '../services/FirebaseService';
import TestSessionService, { TestSession } from '../services/TestSessionService';
import { Message } from '../services/ChatService';

// Define the context state type
interface AppContextState {
  isLoading: boolean;
  isAuthenticated: boolean;
  testSessions: TestSession[];
  activeSessionId: string | null;
  activeConversationId: string | null;
  activeMessages: Message[];
  metricsHistory: any;
  sharedInfo: any;

  // Actions
  refreshTestSessions: () => Promise<void>;
  refreshMetricsHistory: () => Promise<void>;
  refreshSharedInfo: () => Promise<void>;
  setActiveSession: (sessionId: string | null) => void;
  setActiveConversation: (conversationId: string | null) => void;
  setActiveMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

// Create the context with default values
const AppContext = createContext<AppContextState>({
  isLoading: true,
  isAuthenticated: false,
  testSessions: [],
  activeSessionId: null,
  activeConversationId: null,
  activeMessages: [],
  metricsHistory: {},
  sharedInfo: {},

  refreshTestSessions: async () => {},
  refreshMetricsHistory: async () => {},
  refreshSharedInfo: async () => {},
  setActiveSession: () => {},
  setActiveConversation: () => {},
  setActiveMessages: () => {},
  addMessage: () => {},
});

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<any>({});
  const [sharedInfo, setSharedInfo] = useState<any>({});

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Firebase
        await FirebaseService.initialize();

        // Load test sessions
        await refreshTestSessions();

        // Load metrics history
        await refreshMetricsHistory();

        // Load shared info
        await refreshSharedInfo();

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Refresh test sessions
  const refreshTestSessions = async () => {
    try {
      const sessions = await TestSessionService.getTestSessions();
      setTestSessions(sessions);
    } catch (error) {
      console.error('Error refreshing test sessions:', error);
    }
  };

  // Refresh metrics history
  const refreshMetricsHistory = async () => {
    try {
      const history = await TestSessionService.getMetricsHistory();
      setMetricsHistory(history);
    } catch (error) {
      console.error('Error refreshing metrics history:', error);
    }
  };

  // Refresh shared info
  const refreshSharedInfo = async () => {
    try {
      const info = await TestSessionService.getSharedInfo();
      setSharedInfo(info);
    } catch (error) {
      console.error('Error refreshing shared info:', error);
    }
  };

  // Set active session
  const handleSetActiveSession = (sessionId: string | null) => {
    setActiveSessionId(sessionId);

    // If we have a session ID, find the session and set the conversation ID
    if (sessionId) {
      const session = testSessions.find(s => s.id === sessionId);
      if (session && session.conversationId) {
        setActiveConversationId(session.conversationId);
      } else {
        setActiveConversationId(null);
      }
    } else {
      setActiveConversationId(null);
    }

    // Clear active messages
    setActiveMessages([]);
  };

  // Add a message to the active messages
  const addMessage = (message: Message) => {
    setActiveMessages(prevMessages => [...prevMessages, message]);
  };

  // Context value
  const contextValue: AppContextState = {
    isLoading,
    isAuthenticated,
    testSessions,
    activeSessionId,
    activeConversationId,
    activeMessages,
    metricsHistory,
    sharedInfo,

    refreshTestSessions,
    refreshMetricsHistory,
    refreshSharedInfo,
    setActiveSession: handleSetActiveSession,
    setActiveConversation: setActiveConversationId,
    setActiveMessages,
    addMessage,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

export default AppContext;
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import axios from '../lib/api';

const ChatContext = createContext(null);

const makeWelcomeMessage = () => ({
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm the RentiFi support assistant. I can help you with bookings, listings, payments, and more. Try asking me to find properties in a city!",
  ts: Date.now(),
  properties: [],
});

const MAX_HISTORY_FOR_API = 12;

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [makeWelcomeMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, []);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearChat = useCallback(() => {
    setMessages([makeWelcomeMessage()]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (userText) => {
      const trimmed = userText?.trim();
      if (!trimmed || trimmed.length === 0) return;
      if (trimmed.length > 500) return;

      const userMsg = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        ts: Date.now(),
        properties: [],
      };

      let historyForApi = [];

      setMessages((prev) => {
        // Build history from current messages (excluding welcome and the message
        // we're about to send — it's passed separately as `message` in the body)
        historyForApi = prev
          .filter((m) => m.id !== 'welcome')
          .slice(-MAX_HISTORY_FOR_API)
          .map(({ role, content }) => ({ role, content }));
        return [...prev, userMsg];
      });

      setIsLoading(true);
      setError(null);
      scrollToBottom();

      try {
        const { data } = await axios.post('/api/chat', {
          message: trimmed,
          history: historyForApi,
        });

        if (data.success) {
          const assistantMsg = {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            ts: Date.now(),
            // Attach live property results (may be empty array)
            properties: Array.isArray(data.properties) ? data.properties : [],
          };
          setMessages((prev) => [...prev, assistantMsg]);
          scrollToBottom();
        } else {
          setError(data.message || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        const msg =
          err.response?.status === 429
            ? 'Too many messages — please wait a moment before trying again.'
            : err.response?.data?.message ||
              'Could not reach the support service. Please try again.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [scrollToBottom]
  );

  const value = {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
    messages,
    isLoading,
    error,
    clearChat,
    sendMessage,
    bottomRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

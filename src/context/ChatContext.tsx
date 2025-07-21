import React, { createContext, useContext, useState } from 'react';
import { Message } from '../types';

interface ChatContextType {
  messages: Message[];
  updateMessages: (messages: Message[]) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      updateMessages, 
      isOpen, 
      setIsOpen,
      isExpanded,
      setIsExpanded
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
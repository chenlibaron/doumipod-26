import React, { createContext, useState, useContext, useCallback, FC, ReactNode } from 'react';
import { GenerateContentResponse, Chat } from "@google/genai";
import { startAITutorChat } from '../services/api';
import { AITutorMessage } from '../types';

interface AITutorContextType {
    messages: AITutorMessage[];
    isLoading: boolean;
    error: string | null;
    initializeAiTutorChat: () => void;
    sendMessage: (input: string) => Promise<void>;
}

const AITutorContext = createContext<AITutorContextType | undefined>(undefined);

export const AITutorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [aiTutorSession, setAiTutorSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<AITutorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeAiTutorChat = useCallback(() => {
    if (!aiTutorSession) {
      setIsLoading(true);
      setError(null);
      try {
        const session = startAITutorChat();
        setAiTutorSession(session);
        setMessages([{ role: 'model', text: "안녕하세요! Welcome to your personal AI Korean Tutor. How can I help you learn today? 😊" }]);
      } catch (err) {
        console.error("Failed to start AI Tutor chat:", err);
        setError("Could not start AI Tutor. Please check your API key.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [aiTutorSession]);

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || !aiTutorSession || isLoading) return;

    const userMessage: AITutorMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiTutorSession.sendMessageStream({ message: userInput });
      let modelResponse = '';
      const emptyModelMessage: AITutorMessage = { role: 'model', text: '' };
      setMessages(prev => [...prev, emptyModelMessage]);
      
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          modelResponse += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = modelResponse;
            return newMessages;
          });
        }
      }
    } catch (err) {
      console.error('AI Tutor chat error:', err);
      const errorMessage: AITutorMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      setError('An error occurred while communicating with the AI Tutor.');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    messages,
    isLoading,
    error,
    initializeAiTutorChat,
    sendMessage,
  };

  return <AITutorContext.Provider value={value}>{children}</AITutorContext.Provider>;
};

export const useAITutor = (): AITutorContextType => {
  const context = useContext(AITutorContext);
  if (context === undefined) {
    throw new Error('useAITutor must be used within an AITutorProvider');
  }
  return context;
};
import { useState } from 'react';
import { generateId } from 'ai';
import dayjs from 'dayjs';

import { ClientMessage } from '@/types/ai.types';
import { Repository } from '@/types/github.types';

export function useChat(repository: Repository | null, accessToken?: string | null) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [latestMarkdownId, setLatestMarkdownId] = useState<string | null>(null);

  const sendMessage = async (input: string) => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message to chat
    const userMessageId = generateId();
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: userMessageId,
        role: 'user',
        display: input,
        timestamp: dayjs().format('DD/MM hh:mm A')
      }
    ]);

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        body: JSON.stringify({
          history: messages,
          input: input,
          repository: repository,
          accessToken: accessToken
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      const newMessageId = generateId();
      setLatestMarkdownId(newMessageId);

      // Add initial empty assistant message
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: newMessageId,
          role: 'assistant',
          display: '',
          timestamp: dayjs().format('DD/MM hh:mm A')
        }
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          result += decoder.decode(value, { stream: true });

          // Update the assistant message with the streamed content
          setMessages((currentMessages) => {
            const messageIndex = currentMessages.findIndex(
              (message) => message.id === newMessageId
            );
            if (messageIndex === -1) return currentMessages;

            return currentMessages.map((message, index) => {
              if (index === messageIndex) {
                return { ...message, display: result };
              }
              return message;
            });
          });
        }
      }
    } catch (error) {
      console.error('Error in chat processing:', error);
      // Optionally add an error message to the chat
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setLatestMarkdownId(null);
  };

  return {
    messages,
    latestMarkdownId,
    isProcessing,
    sendMessage,
    clearChat
  };
}

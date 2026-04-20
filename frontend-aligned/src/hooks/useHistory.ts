import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import type { ChatSession } from '../types/session';
import type { ChatMessage } from '../types/chat';

function toFrontendMessage(raw: { id: string; content: string; sender: string; timestamp: string }): ChatMessage {
  return {
    id: raw.id,
    content: raw.content,
    sender: raw.sender as 'user' | 'ai',
    timestamp: new Date(raw.timestamp),
  };
}

export const useSessions = () =>
  useQuery({
    queryKey: ['chat', 'sessions'],
    queryFn: async (): Promise<ChatSession[]> => {
      const { sessions } = await chatService.getSessions();
      return sessions.map((s) => ({
        id: s.id,
        title: s.title,
        clientName: s.clientName ?? 'No Client',
        timestamp: new Date(s.timestamp),
        messageCount: s.messageCount,
        isPinned: s.isPinned,
        summary: s.summary || '',
        messages: [],
        tags: s.tags ?? [],
      }));
    },
    retry: 2,
  });

export const useSessionMessages = (sessionId: string | null) =>
  useQuery({
    queryKey: ['chat', 'messages', sessionId],
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!sessionId) return [];
      const { messages } = await chatService.getSessionMessages(sessionId);
      return messages.map(toFrontendMessage);
    },
    enabled: !!sessionId,
    retry: 2,
  });

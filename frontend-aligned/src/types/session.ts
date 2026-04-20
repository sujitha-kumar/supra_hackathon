import type { ChatMessage } from './chat';

export interface ChatSession {
  id: string;
  title: string;
  clientName: string;
  timestamp: Date;
  messageCount: number;
  isPinned: boolean;
  summary: string;
  messages: ChatMessage[];
  tags: string[];
}

export interface PinnedOutput {
  id: string;
  sessionId: string;
  content: string;
  timestamp: Date;
  title: string;
}

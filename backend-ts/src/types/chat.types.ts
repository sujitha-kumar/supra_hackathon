export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  clientName?: string;
  timestamp: string;
  messageCount: number;
  isPinned: boolean;
  summary: string;
  messages?: ChatMessage[];
  tags: string[];
}

export interface CreateSessionRequest {
  client_id?: number;
  title?: string;
}

export interface CreateSessionResponse extends ChatSession {
  messages: ChatMessage[];
}

export interface SessionsResponse {
  sessions: ChatSession[];
}

export interface SessionMessagesResponse {
  sessionId: string;
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
  client_id?: number;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiResponse: ChatMessage;
}

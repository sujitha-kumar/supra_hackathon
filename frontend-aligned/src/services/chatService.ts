import { apiClient } from '../lib/axios';

export type MessageSender = 'user' | 'ai';

export interface ChatMessageResponse {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
}

export interface CreateSessionRequest {
  client_id?: number;
  title?: string;
}

export interface CreateSessionResponse {
  id: string;
  title: string;
  clientName?: string;
  timestamp: string;
  messageCount: number;
  isPinned: boolean;
  summary: string;
  tags: string[];
  messages: ChatMessageResponse[];
}

export interface SendMessageRequest {
  session_id: string;
  message: string;
  client_id?: number;
}

export interface SendMessageResponse {
  userMessage: ChatMessageResponse;
  aiResponse: ChatMessageResponse;
}

export interface SessionMessagesResponse {
  sessionId: string;
  messages: ChatMessageResponse[];
}

export const chatService = {
  createSession: async (request?: CreateSessionRequest): Promise<CreateSessionResponse> => {
    const response = await apiClient.post<CreateSessionResponse>('/chat/session', request);
    return response.data;
  },

  sendMessage: async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>('/chat/message', request);
    return response.data;
  },

  getSessions: async (): Promise<{ sessions: Array<Omit<CreateSessionResponse, 'messages'>> }> => {
    const response = await apiClient.get<{ sessions: Array<Omit<CreateSessionResponse, 'messages'>> }>('/chat/sessions');
    return response.data;
  },

  getSessionMessages: async (sessionId: string): Promise<SessionMessagesResponse> => {
    const response = await apiClient.get<SessionMessagesResponse>(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },
};

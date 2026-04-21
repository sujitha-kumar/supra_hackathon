import { apiClient } from '../lib/axios';

export type MessageSender = 'user' | 'ai';
export type SupportedLanguage = 'english' | 'hindi' | 'tamil' | 'telugu' | 'kannada';

export interface ChatMessageResponse {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
}

export interface CreateSessionRequest {
  client_id?: string;
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
  client_id?: string;
  language?: SupportedLanguage;
}

export interface SendMessageResponse {
  userMessage: ChatMessageResponse;
  aiResponse: ChatMessageResponse;
}

export interface SessionMessagesResponse {
  sessionId: string;
  messages: ChatMessageResponse[];
}

export interface TranslateMessageRequest {
  text: string;
  language: SupportedLanguage;
}

export interface TranslateMessageResponse {
  translatedText: string;
  language: SupportedLanguage;
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

  translateMessage: async (request: TranslateMessageRequest): Promise<TranslateMessageResponse> => {
    const response = await apiClient.post<TranslateMessageResponse>('/chat/translate', request);
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

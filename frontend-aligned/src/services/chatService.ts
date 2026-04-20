import { apiClient } from '../lib/axios';

export interface ChatRequest {
  message: string;
  clientContext?: string;
  sessionId?: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const chatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat/message', request);
    return response.data;
  },

  getHistory: async (sessionId: string): Promise<ChatResponse[]> => {
    const response = await apiClient.get(`/chat/history/${sessionId}`);
    return response.data;
  },

  createSession: async (clientId?: string): Promise<{ sessionId: string }> => {
    const response = await apiClient.post('/chat/session', { clientId });
    return response.data;
  },

  getSessions: async (): Promise<Array<{ id: string; title: string; timestamp: string }>> => {
    const response = await apiClient.get('/chat/sessions');
    return response.data;
  },
};

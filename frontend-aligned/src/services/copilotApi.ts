import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = config.apiBaseUrl.endsWith('/api')
  ? config.apiBaseUrl.slice(0, -4)
  : config.apiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: config.aiApiKey ? { 'x-ai-api-key': config.aiApiKey } : undefined,
});

interface CopilotChatRequest {
  message: string;
  clientId?: number | string | null;
  clientData?: unknown;
  sessionId?: string | null;
  language?: string;
}

interface CopilotChatResponse {
  content?: string;
  data?: {
    content?: string;
    response?: string;
  };
}

interface AnalyzeClientRequest {
  ruleOutput: unknown;
  query: string;
  clientId?: number | null;
  language?: string;
}

const copilotApi = {
  async sendCopilotMessage({
    message,
    clientId = null,
    clientData = null,
    sessionId = null,
    language = 'en',
  }: CopilotChatRequest): Promise<CopilotChatResponse> {
    const response = await api.post('/api/copilot/chat', {
      message,
      clientId,
      clientData,
      sessionId,
      language,
    });

    return response.data;
  },

  async analyzeWithRuleEngine(clientDataOrId: unknown): Promise<any> {
    const payload =
      typeof clientDataOrId === 'string'
        ? { clientId: clientDataOrId }
        : { clientData: clientDataOrId };

    const response = await api.post('/api/rule-engine/analyze', payload);
    return response.data.data;
  },

  async searchClients(name: string): Promise<any[]> {
    const response = await api.get('/api/clients/search', {
      params: { name },
    });

    return response.data.data || [];
  },

  async searchWebAndAnswer(message: string, clientData: unknown = null): Promise<CopilotChatResponse> {
    const response = await api.post('/api/copilot/chat', {
      message,
      clientData,
      route: 'WEB_SEARCH',
    });

    return response.data;
  },

  async analyzeClient({
    ruleOutput,
    query,
    clientId = null,
    language = 'english',
  }: AnalyzeClientRequest): Promise<string> {
    const response = await api.post<CopilotChatResponse>('/api/copilot/chat', {
      message: query,
      clientId,
      language,
      route: 'PORTFOLIO',
      clientData: {
        ruleOutput,
      },
    });

    const payload = response.data;
    return payload.content || payload.data?.content || payload.data?.response || 'Analysis generated.';
  },
};

export default copilotApi;

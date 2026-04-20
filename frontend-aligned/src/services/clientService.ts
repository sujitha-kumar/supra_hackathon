import { apiClient } from '../lib/axios';
import type { Client } from '../types/api';

export interface ClientsQueryParams {
  segment?: string;
  risk_profile?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  limit: number;
  offset: number;
}

export interface PortfolioResponse {
  portfolio_id: number;
  client_id: number;
  total_value: number;
  allocations: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  last_updated: string;
}

export interface PerformanceData {
  month: string;
  value: number;
}

export interface PerformanceResponse {
  data: PerformanceData[];
}

export interface Interaction {
  interaction_id: number;
  client_id: number;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
  created_at: string;
}

export interface InteractionsResponse {
  interactions: Interaction[];
}

export type BriefInsightPriority = 'high' | 'medium' | 'low';

export interface BriefInsight {
  id: number;
  text: string;
  priority: BriefInsightPriority;
}

export interface ClientBriefResponse {
  client_id: number;
  generated_at: string;
  summary: string;
  patterns: string[];
  talking_points: string[];
  insights: BriefInsight[];
}

export const clientService = {
  getAll: async (params?: ClientsQueryParams): Promise<ClientsResponse> => {
    const response = await apiClient.get<ClientsResponse>('/clients', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  },

  getProfile: async (id: number): Promise<Client> => {
    const response = await apiClient.get<Client>(`/clients/${id}/profile`);
    return response.data;
  },

  getPortfolio: async (id: number): Promise<PortfolioResponse> => {
    const response = await apiClient.get<PortfolioResponse>(`/clients/${id}/portfolio`);
    return response.data;
  },

  getPerformance: async (id: number): Promise<PerformanceResponse> => {
    const response = await apiClient.get<PerformanceResponse>(`/clients/${id}/performance`);
    return response.data;
  },

  getInteractions: async (id: number, limit: number = 10): Promise<InteractionsResponse> => {
    const response = await apiClient.get<InteractionsResponse>(`/clients/${id}/interactions`, {
      params: { limit },
    });
    return response.data;
  },

  getBrief: async (id: number): Promise<ClientBriefResponse> => {
    const response = await apiClient.get<ClientBriefResponse>(`/clients/${id}/brief`);
    return response.data;
  },
};

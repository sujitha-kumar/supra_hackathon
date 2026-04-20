import { apiClient } from '../lib/axios';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  aum: number;
  riskTolerance: string;
}

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const response = await apiClient.post('/clients', client);
    return response.data;
  },

  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    const response = await apiClient.patch(`/clients/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};

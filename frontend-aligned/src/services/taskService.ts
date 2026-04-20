import { apiClient } from '../lib/axios';
import type { Task } from '../types/task';

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },

  update: async (id: string, updates: Partial<Task>): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  toggleComplete: async (id: string): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
};

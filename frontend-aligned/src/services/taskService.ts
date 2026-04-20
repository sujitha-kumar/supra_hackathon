import { apiClient } from '../lib/axios';
import type { Task } from '../types/task';

interface TasksApiResponse {
  tasks: Array<Omit<Task, 'dueDate'> & { dueDate: string }>;
  total: number;
}

interface CreateTaskPayload {
  client_id?: number;
  title: string;
  description: string;
  priority: Task['priority'];
  due_date: string;
  assignee?: string;
  tags?: string[];
}

interface ToggleResponse {
  id: string;
  status: Task['status'];
  updatedAt: string;
}

function toTask(raw: Omit<Task, 'dueDate'> & { dueDate: string }): Task {
  return { ...raw, dueDate: new Date(raw.dueDate) };
}

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get<TasksApiResponse>('/tasks');
    return response.data.tasks.map(toTask);
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await apiClient.post<Omit<Task, 'dueDate'> & { dueDate: string }>('/tasks', payload);
    return toTask(response.data);
  },

  toggleComplete: async (id: string): Promise<ToggleResponse> => {
    const response = await apiClient.patch<ToggleResponse>(`/tasks/${id}/toggle`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

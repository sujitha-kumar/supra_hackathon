export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignee: string;
  clientName?: string;
  tags: string[];
}

export interface CreateTaskRequest {
  client_id?: number;
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  assignee?: string;
  tags?: string[];
}

export interface CreateTaskResponse extends Task {
  createdAt: string;
}

export interface TasksQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  client_id?: number;
  limit?: number;
  offset?: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface ToggleTaskResponse {
  id: string;
  status: TaskStatus;
  updatedAt: string;
}

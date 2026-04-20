import { TaskRepository } from '../repositories/task.repository';
import {
  Task,
  TasksQueryParams,
  TasksResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  ToggleTaskResponse,
  AppError,
  ErrorCodes,
} from '../types';

export class TaskService {
  private repository: TaskRepository;

  constructor() {
    this.repository = new TaskRepository();
  }

  async getTasks(params: TasksQueryParams): Promise<TasksResponse> {
    return await this.repository.findAll(params);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);

    if (!task) {
      throw new AppError(404, ErrorCodes.TASK_NOT_FOUND, 'Task not found');
    }

    return task;
  }

  async createTask(taskData: CreateTaskRequest): Promise<CreateTaskResponse> {
    const task = await this.repository.create(taskData);

    return {
      ...task,
      createdAt: new Date().toISOString(),
    };
  }

  async toggleTaskStatus(id: string): Promise<ToggleTaskResponse> {
    const exists = await this.repository.findById(id);

    if (!exists) {
      throw new AppError(404, ErrorCodes.TASK_NOT_FOUND, 'Task not found');
    }

    return await this.repository.toggleStatus(id);
  }

  async deleteTask(id: string): Promise<void> {
    const exists = await this.repository.findById(id);

    if (!exists) {
      throw new AppError(404, ErrorCodes.TASK_NOT_FOUND, 'Task not found');
    }

    await this.repository.delete(id);
  }
}

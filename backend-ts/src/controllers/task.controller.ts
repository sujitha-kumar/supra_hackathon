import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { TasksQueryParams, CreateTaskRequest } from '../types';

export class TaskController {
  private service: TaskService;

  constructor() {
    this.service = new TaskService();
  }

  getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: TasksQueryParams = {
        status: req.query.status as TasksQueryParams['status'],
        priority: req.query.priority as TasksQueryParams['priority'],
        client_id: req.query.client_id ? parseInt(req.query.client_id as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const result = await this.service.getTasks(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: CreateTaskRequest = req.body;
      const task = await this.service.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  toggleTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await this.service.toggleTaskStatus(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      await this.service.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

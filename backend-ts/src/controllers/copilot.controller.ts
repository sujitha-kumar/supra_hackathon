import { Request, Response, NextFunction } from 'express';
import { CopilotService } from '../services/copilot.service';
import { TaskSuggestionRequest } from '../types/copilot.types';

export class CopilotController {
  private service: CopilotService;

  constructor() {
    this.service = new CopilotService();
  }

  getInsights = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.getInsights();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getTaskSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { client_id }: TaskSuggestionRequest = req.body;
      const result = await this.service.generateTaskSuggestions(client_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

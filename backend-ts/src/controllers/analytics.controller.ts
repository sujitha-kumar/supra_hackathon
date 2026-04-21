import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { Period } from '../types';

export class AnalyticsController {
  private service: AnalyticsService;

  constructor() {
    this.service = new AnalyticsService();
  }

  getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dashboard = await this.service.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  };

  getAUMTrend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const period = (req.query.period as Period) || '1Y';
      const trend = await this.service.getAUMTrend(period);
      res.json(trend);
    } catch (error) {
      next(error);
    }
  };

  getFunnel = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const funnel = await this.service.getConversionFunnel();
      res.json(funnel);
    } catch (error) {
      next(error);
    }
  };

  getInsights = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const insights = await this.service.getInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  };
}

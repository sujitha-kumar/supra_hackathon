import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/client.service';
import { ClientsQueryParams } from '../repositories/client.repository';

export class ClientController {
  private service: ClientService;

  constructor() {
    this.service = new ClientService();
  }

  getClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: ClientsQueryParams = {
        segment: req.query.segment as string,
        risk_profile: req.query.risk_profile as ClientsQueryParams['risk_profile'],
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      const result = await this.service.getClients(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getClientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const client = await this.service.getClientById(id);
      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  getClientProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const client = await this.service.getClientById(id);
      res.json(client);
    } catch (error) {
      next(error);
    }
  };

  getClientPortfolio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const portfolio = await this.service.getClientPortfolio(id);
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  };

  getClientPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const performance = await this.service.getClientPerformance(id);
      res.json(performance);
    } catch (error) {
      next(error);
    }
  };

  getClientInteractions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const interactions = await this.service.getClientInteractions(id, limit);
      res.json(interactions);
    } catch (error) {
      next(error);
    }
  };

  getClientBrief = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const brief = await this.service.getClientBrief(id);
      res.json(brief);
    } catch (error) {
      next(error);
    }
  };
}

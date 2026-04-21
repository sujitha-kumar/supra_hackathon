import { Request, Response, NextFunction } from 'express';
import { ChatService } from '../services/chat.service';
import { CreateSessionRequest, SendMessageRequest, TranslateMessageRequest } from '../types';

export class ChatController {
  private readonly service: ChatService;

  constructor() {
    this.service = new ChatService();
  }

  createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionData: CreateSessionRequest = req.body;
      const session = await this.service.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  };

  getSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await this.service.getAllSessions();
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  };

  getSessionMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.sessionId;
      const messages = await this.service.getSessionMessages(sessionId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messageData: SendMessageRequest = req.body;
      const result = await this.service.sendMessage(messageData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  translateMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request: TranslateMessageRequest = req.body;
      const result = await this.service.translateMessage(request);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

import { ChatRepository } from '../repositories/chat.repository';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionsResponse,
  SessionMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  AppError,
  ErrorCodes,
} from '../types';
import { ClientRepository } from '../repositories/client.repository';
import { CopilotService } from './copilot.service';
import { generateAIResponse } from '../utils/aiClient';

export class ChatService {
  private repository: ChatRepository;
  private clientRepository: ClientRepository;
  private copilotService: CopilotService;

  constructor() {
    this.repository = new ChatRepository();
    this.clientRepository = new ClientRepository();
    this.copilotService = new CopilotService();
  }

  async createSession(sessionData: CreateSessionRequest): Promise<CreateSessionResponse> {
    const session = await this.repository.createSession(sessionData);
    return {
      ...session,
      messages: session.messages || [],
    };
  }

  async getAllSessions(): Promise<SessionsResponse> {
    const sessions = await this.repository.findAllSessions();
    return { sessions };
  }

  async getSessionMessages(sessionId: string): Promise<SessionMessagesResponse> {
    const exists = await this.repository.sessionExists(sessionId);

    if (!exists) {
      throw new AppError(404, ErrorCodes.SESSION_NOT_FOUND, 'Chat session not found');
    }

    const messages = await this.repository.findSessionMessages(sessionId);
    return { sessionId, messages };
  }

  async sendMessage(messageData: SendMessageRequest): Promise<SendMessageResponse> {
    const exists = await this.repository.sessionExists(messageData.session_id);

    if (!exists) {
      throw new AppError(404, ErrorCodes.SESSION_NOT_FOUND, 'Chat session not found');
    }

    const userMessage = await this.repository.saveMessage(
      messageData.session_id,
      messageData.message,
      'user'
    );

    const aiResponseText = await this.buildAIResponse(messageData);

    const aiResponse = await this.repository.saveMessage(
      messageData.session_id,
      aiResponseText,
      'ai'
    );

    return { userMessage, aiResponse };
  }

  private async buildAIResponse(messageData: SendMessageRequest): Promise<string> {
    if (!messageData.client_id) {
      return this.getGenericResponse(messageData.message);
    }

    try {
      const client = await this.clientRepository.findById(messageData.client_id);
      if (!client) {
        return this.getGenericResponse(messageData.message);
      }


      const [portfolio, interactions] = await Promise.all([
        this.clientRepository.getPortfolio(messageData.client_id),
        this.clientRepository.getInteractions(messageData.client_id, 5),
      ]);

      const normalized = messageData.message.toLowerCase();
      const isClientsIntent =
        normalized === 'clients' ||
        normalized.startsWith('clients ') ||
        normalized.includes(' clients ');

      if (isClientsIntent) {
        return await this.copilotService.generateClientInsightsP0P6(
          { client, portfolio, interactions },
          messageData.message
        );
      }

      const copilotResponse = await this.copilotService.generateResponse(
        { client, portfolio, interactions },
        messageData.message
      );

      return `${copilotResponse.explanation}\n\n**Suggested Action:** ${copilotResponse.suggestion}`;
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      return this.getGenericResponse(messageData.message);
    }
  }

  private async getGenericResponse(message: string): Promise<string> {
    try {
      const systemPrompt = `You are an AI copilot for a wealth management Relationship Manager (RM) at FundsIndia, a mutual fund investment platform in India.
Your role is to help RMs prepare for client calls and answer questions about portfolios, SIPs, market conditions, and investment strategies.
Use Indian financial terminology (SIP, MF, AUM, SEBI, XIRR, CAGR, etc.) and format currency in Indian style (₹1,23,456).
Be concise, professional, and actionable. Always end with a specific suggested action for the RM.

Format your response as:
[2-4 sentence analysis or answer]

**Suggested Action:** [one specific action the RM should take]`;

      const text = await generateAIResponse(systemPrompt, message);
      return text;
    } catch {
      return (
        'I can help with portfolio summaries, risk analysis, SIP performance, rebalancing, and call preparation.\n\n' +
        'Try asking:\n' +
        '- "What is a good opening line for a client call?"\n' +
        '- "How do I explain SIP underperformance to a client?"\n' +
        '- "What are current market risks for equity funds?"\n\n' +
        '**Suggested Action:** Select a client from the sidebar to get context-aware, personalized insights.'
      );
    }
  }
}

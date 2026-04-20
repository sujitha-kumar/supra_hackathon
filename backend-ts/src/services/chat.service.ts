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

  private getGenericResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('portfolio') || lower.includes('summary')) {
      return (
        'Here is a quick portfolio overview based on available data.\n\n' +
        '- Review current allocation and ensure it aligns with the agreed risk profile.\n' +
        '- Identify any concentration risk and confirm liquidity needs.\n\n' +
        '**Suggested Action:** Schedule a portfolio review call with the client.'
      );
    }

    if (lower.includes('risk')) {
      return (
        'Risk snapshot for this client:\n\n' +
        '- Confirm risk tolerance and investment time horizon.\n' +
        '- Check equity/debt balance versus target allocation.\n' +
        '- Review drawdown comfort and rebalancing rules.\n\n' +
        '**Suggested Action:** Request a client to complete an updated risk assessment form.'
      );
    }

    if (lower.includes('rebalance')) {
      return (
        'Rebalancing considerations:\n\n' +
        '- Compare current allocation versus model allocation for risk profile.\n' +
        '- Prioritize tax-aware moves and avoid unnecessary churn.\n' +
        '- Set execution window and confirm transaction costs.\n\n' +
        '**Suggested Action:** Prepare a rebalancing proposal for client approval.'
      );
    }

    return (
      'I can help with portfolio summaries, risk analysis, rebalancing, and call preparation.\n\n' +
      'Try asking: "Give me a portfolio summary" or "What are the risk factors?" or "Should we rebalance?"\n\n' +
      '**Suggested Action:** Select a client from the sidebar to get context-aware insights.'
    );
  }
}

import { ChatRepository } from '../repositories/chat.repository';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  SessionsResponse,
  SessionMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  SupportedLanguage,
  TranslateMessageRequest,
  TranslateMessageResponse,
  AppError,
  ErrorCodes,
} from '../types';
import { ClientRepository } from '../repositories/client.repository';
import { CopilotService } from './copilot.service';
import { generateAIResponse } from '../utils/aiClient';

export class ChatService {
  private readonly repository: ChatRepository;
  private readonly clientRepository: ClientRepository;
  private readonly copilotService: CopilotService;

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

  async translateMessage(request: TranslateMessageRequest): Promise<TranslateMessageResponse> {
    if (request.language === 'english') {
      return {
        translatedText: request.text,
        language: request.language,
      };
    }

    let translatedText: string;

    try {
      translatedText = await this.translateText(request.text, request.language);
    } catch (error) {
      console.error('Translation failed, using local fallback:', error);
      translatedText = this.fallbackTranslateText(request.text, request.language);
    }

    return {
      translatedText,
      language: request.language,
    };
  }

  private async buildAIResponse(messageData: SendMessageRequest): Promise<string> {
    if (!messageData.client_id) {
      return this.getGenericResponse(messageData.message, messageData.language);
    }

    try {
      const client = await this.clientRepository.findById(messageData.client_id);
      if (!client) {
        return this.getGenericResponse(messageData.message, messageData.language);
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
        const responseText = await this.copilotService.generateClientInsightsP0P6(
          { client, portfolio, interactions },
          messageData.message
        );

        return this.translateIfRequired(responseText, messageData.language);
      }

      const copilotResponse = await this.copilotService.generateResponse(
        { client, portfolio, interactions },
        messageData.message
      );

      const responseText = `${copilotResponse.explanation}\n\n**Suggested Action:** ${copilotResponse.suggestion}`;
      return this.translateIfRequired(responseText, messageData.language);
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);

      if (messageData.client_id) {
        const client = await this.clientRepository.findById(messageData.client_id);
        if (client) {
          const portfolio = await this.clientRepository.getPortfolio(messageData.client_id);
          const contextualFallback = this.buildContextualFallbackResponse(
            client,
            portfolio,
            messageData.message
          );
          return this.translateIfRequired(contextualFallback, messageData.language);
        }
      }

      return this.getGenericResponse(messageData.message, messageData.language);
    }
  }

  private buildContextualFallbackResponse(
    client: Awaited<ReturnType<ClientRepository['findById']>>,
    portfolio: Awaited<ReturnType<ClientRepository['getPortfolio']>>,
    query: string
  ): string {
    const safeClient = client as NonNullable<typeof client>;
    const equity = Number(portfolio?.equity_pct ?? 0);
    const debt = Number(portfolio?.debt_pct ?? 0);
    const cash = Number(portfolio?.cash_pct ?? 0);
    const riskScore = Number(safeClient.risk_score ?? 0);
    const riskProfile = safeClient.risk_profile || 'Moderate';

    const normalized = query.toLowerCase();

    if (normalized.includes('risk')) {
      return (
        `${safeClient.name} is tagged as ${riskProfile} risk with score ${riskScore || 'N/A'}/10. ` +
        `Current allocation is Equity ${equity}%, Debt ${debt}%, Cash ${cash}%. ` +
        `${equity > 70 ? 'Equity concentration is high for this profile and needs review.' : 'Risk appears broadly aligned, but periodic review is advised.'}\n\n` +
        `**Suggested Action:** Schedule a risk-alignment review and discuss target allocation bands with the client.`
      );
    }

    if (normalized.includes('action') || normalized.includes('next') || normalized.includes('call')) {
      return (
        `For ${safeClient.name}, use a 3-step call flow: portfolio snapshot, risk alignment, and next quarter plan. ` +
        `Lead with allocation (Equity ${equity}%, Debt ${debt}%, Cash ${cash}%) and link to client goals.\n\n` +
        `**Suggested Action:** Propose one concrete move (rebalance or hold) and set a follow-up date before ending the call.`
      );
    }

    return (
      `${safeClient.name}'s current profile is ${riskProfile} with allocation Equity ${equity}%, Debt ${debt}%, Cash ${cash}. ` +
      `I can help with risk explanation, rebalancing narrative, and call talking points based on this context.\n\n` +
      `**Suggested Action:** Ask a focused question such as "What should I say about rebalancing?" for a tailored response.`
    );
  }

  private async getGenericResponse(
    message: string,
    language: SupportedLanguage = 'english'
  ): Promise<string> {
    try {
      const systemPrompt = `You are an AI copilot for a wealth management Relationship Manager (RM) at FundsIndia, a mutual fund investment platform in India.
Your role is to help RMs prepare for client calls and answer questions about portfolios, SIPs, market conditions, and investment strategies.
Use Indian financial terminology (SIP, MF, AUM, SEBI, XIRR, CAGR, etc.) and format currency in Indian style (₹1,23,456).
Be concise, professional, and actionable. Always end with a specific suggested action for the RM.

Format your response as:
[2-4 sentence analysis or answer]

**Suggested Action:** [one specific action the RM should take]`;

      const text = await generateAIResponse(systemPrompt, message);
      return this.translateIfRequired(text, language);
    } catch {
      const fallbackText = (
        'I can help with portfolio summaries, risk analysis, SIP performance, rebalancing, and call preparation.\n\n' +
        'Try asking:\n' +
        '- "What is a good opening line for a client call?"\n' +
        '- "How do I explain SIP underperformance to a client?"\n' +
        '- "What are current market risks for equity funds?"\n\n' +
        '**Suggested Action:** Select a client from the sidebar to get context-aware, personalized insights.'
      );

      return this.translateIfRequired(fallbackText, language);
    }
  }

  private async translateIfRequired(text: string, language: SupportedLanguage = 'english'): Promise<string> {
    if (language === 'english') {
      return text;
    }

    try {
      return await this.translateText(text, language);
    } catch (error) {
      console.error('AI translation failed, using local fallback:', error);
      return this.fallbackTranslateText(text, language);
    }
  }

  private async translateText(text: string, language: SupportedLanguage): Promise<string> {
    const targetLanguage = this.getLanguageLabel(language);
    const systemPrompt = `You are a financial services translation assistant for FundsIndia.
Translate the provided content into ${targetLanguage}.
Preserve the meaning, tone, structure, bullet points, numbers, percentages, and markdown emphasis.
Do not add commentary. Return only the translated text.`;

    return generateAIResponse(systemPrompt, text);
  }

  private getLanguageLabel(language: SupportedLanguage): string {
    switch (language) {
      case 'hindi':
        return 'Hindi';
      case 'tamil':
        return 'Tamil';
      case 'telugu':
        return 'Telugu';
      case 'kannada':
        return 'Kannada';
      default:
        return 'English';
    }
  }

  private fallbackTranslateText(text: string, language: SupportedLanguage): string {
    const exactMatch = this.getExactFallbackTranslation(text, language);
    if (exactMatch) {
      return exactMatch;
    }

    const suggestedActionLabel = this.getSuggestedActionLabel(language);
    return text.replace('**Suggested Action:**', `**${suggestedActionLabel}:**`);
  }

  private getExactFallbackTranslation(text: string, language: SupportedLanguage): string | null {
    const genericFallback =
      'I can help with portfolio summaries, risk analysis, SIP performance, rebalancing, and call preparation.\n\n' +
      'Try asking:\n' +
      '- "What is a good opening line for a client call?"\n' +
      '- "How do I explain SIP underperformance to a client?"\n' +
      '- "What are current market risks for equity funds?"\n\n' +
      '**Suggested Action:** Select a client from the sidebar to get context-aware, personalized insights.';

    if (text !== genericFallback) {
      return null;
    }

    switch (language) {
      case 'hindi':
        return (
          'मैं पोर्टफोलियो सारांश, जोखिम विश्लेषण, SIP प्रदर्शन, रीबैलेंसिंग और कॉल तैयारी में मदद कर सकता हूँ।\n\n' +
          'आप यह पूछ सकते हैं:\n' +
          '- "क्लाइंट कॉल के लिए एक अच्छी शुरुआती पंक्ति क्या हो सकती है?"\n' +
          '- "मैं क्लाइंट को SIP के कम प्रदर्शन के बारे में कैसे समझाऊँ?"\n' +
          '- "इक्विटी फंड्स के लिए मौजूदा मार्केट रिस्क क्या हैं?"\n\n' +
          '**सुझाया गया अगला कदम:** साइडबार से एक क्लाइंट चुनें ताकि आपको संदर्भ-आधारित व्यक्तिगत इनसाइट्स मिल सकें।'
        );
      case 'tamil':
        return (
          'போர்ட்ஃபோலியோ சுருக்கம், அபாய மதிப்பீடு, SIP செயல்திறன், மீளச்சீரமைப்பு மற்றும் அழைப்பு தயாரிப்பில் நான் உதவ முடியும்.\n\n' +
          'நீங்கள் இவ்வாறு கேட்கலாம்:\n' +
          '- "கிளையண்ட் கால் தொடங்க நல்ல ஆரம்ப வரி என்ன?"\n' +
          '- "SIP குறைந்த செயல்திறனை கிளையண்டுக்கு எப்படி விளக்குவது?"\n' +
          '- "இக்விட்டி ஃபண்டுகளுக்கான தற்போதைய சந்தை அபாயங்கள் என்ன?"\n\n' +
          '**பரிந்துரைக்கப்படும் அடுத்த செயல்:** தனிப்பயன் உள்ளடக்கத்தை பெற சைட்பாரில் இருந்து ஒரு கிளையண்டை தேர்வு செய்யவும்.'
        );
      case 'telugu':
        return (
          'పోర్ట్‌ఫోలియో సమరీలు, రిస్క్ విశ్లేషణ, SIP పనితీరు, రీబ్యాలెన్సింగ్ మరియు కాల్ సిద్ధతలో నేను సహాయం చేయగలను.\n\n' +
          'మీరు ఇలా అడగవచ్చు:\n' +
          '- "క్లయింట్ కాల్ కోసం మంచి ప్రారంభ వాక్యం ఏమిటి?"\n' +
          '- "SIP పనితీరు తగ్గిన విషయాన్ని క్లయింట్‌కు ఎలా వివరించాలి?"\n' +
          '- "ఈక్విటీ ఫండ్స్‌కు సంబంధించిన ప్రస్తుత మార్కెట్ రిస్క్‌లు ఏమిటి?"\n\n' +
          '**సూచించిన తదుపరి చర్య:** సందర్భానికి సరిపోయే వ్యక్తిగత సూచనలు పొందడానికి సైడ్‌బార్‌లో ఒక క్లయింట్‌ను ఎంచుకోండి.'
        );
      case 'kannada':
        return (
          'ಪೋರ್ಟ್‌ಫೋಲಿಯೊ ಸಾರಾಂಶ, ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ, SIP ಕಾರ್ಯಕ್ಷಮತೆ, ರೀಬ್ಯಾಲೆನ್ಸಿಂಗ್ ಮತ್ತು ಕಾಲ್ ಸಿದ್ಧತೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು.\n\n' +
          'ನೀವು ಹೀಗೆ ಕೇಳಬಹುದು:\n' +
          '- "ಕ್ಲೈಂಟ್ ಕಾಲ್‌ಗೆ ಒಳ್ಳೆಯ ಆರಂಭಿಕ ಸಾಲು ಯಾವುದು?"\n' +
          '- "SIP ಕಡಿಮೆ ಪ್ರದರ್ಶನವನ್ನು ಕ್ಲೈಂಟ್‌ಗೆ ಹೇಗೆ ವಿವರಿಸಬೇಕು?"\n' +
          '- "ಈಕ್ವಿಟಿ ಫಂಡ್‌ಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಅಪಾಯಗಳು ಯಾವುವು?"\n\n' +
          '**ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಕ್ರಮ:** ವೈಯಕ್ತಿಕ ಸಂದರ್ಭಾಧಾರಿತ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಲು ಸೈಡ್ಬಾರ್‌ನಿಂದ ಕ್ಲೈಂಟ್ ಆಯ್ಕೆಮಾಡಿ.'
        );
      default:
        return null;
    }
  }

  private getSuggestedActionLabel(language: SupportedLanguage): string {
    switch (language) {
      case 'hindi':
        return 'सुझाया गया अगला कदम';
      case 'tamil':
        return 'பரிந்துரைக்கப்படும் அடுத்த செயல்';
      case 'telugu':
        return 'సూచించిన తదుపరి చర్య';
      case 'kannada':
        return 'ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಕ್ರಮ';
      default:
        return 'Suggested Action';
    }
  }
}

import { ClientRepository } from '../repositories/client.repository';
import type { Client, Portfolio, Interaction } from '../repositories/client.repository';
import { generateAIResponse } from '../utils/aiClient';
import {
  ClientContext,
  CopilotResponse,
  TaskSuggestion,
  TaskSuggestionResponse,
  CopilotInsightsResponse,
  CopilotInsight,
} from '../types/copilot.types';
import { AppError, ErrorCodes } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CopilotService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  buildClientContextString(client: Client, portfolio: Portfolio | null, interactions: Interaction[]): string {
    const allocationSummary = portfolio
      ? `Equity: ${portfolio.equity_pct}%, Debt: ${portfolio.debt_pct}%, Gold/Alt: ${portfolio.alt_pct}%, Cash: ${portfolio.cash_pct}%`
      : 'Portfolio data unavailable';

    const recentInteractions = interactions
      .slice(0, 3)
      .map((i) => `- ${i.type} on ${new Date(i.created_at).toLocaleDateString('en-IN')}: ${i.notes}`)
      .join('\n');

    return `
CLIENT PROFILE:
- Name: ${client.name}
- Segment: ${client.segment}
- Risk Profile: ${client.risk_profile}
- Risk Score: ${client.risk_score}/10
- Total AUM: ₹${client.total_aum.toLocaleString('en-IN')}
- Last Contacted: ${client.last_contacted_at ? new Date(client.last_contacted_at).toLocaleDateString('en-IN') : 'Never'}

PORTFOLIO ALLOCATION:
${allocationSummary}
${portfolio ? `Total Portfolio Value: ₹${portfolio.total_value.toLocaleString('en-IN')}` : ''}

RECENT INTERACTIONS:
${recentInteractions || 'No recent interactions recorded'}
    `.trim();
  }

  async generateResponse(context: ClientContext, query: string): Promise<CopilotResponse> {
    const contextString = this.buildClientContextString(
      context.client,
      context.portfolio,
      context.interactions
    );

    const systemPrompt = `You are a senior wealth management AI copilot assisting a Relationship Manager (RM) in India.
Your role is to provide professional, data-driven insights about client portfolios.
Always maintain an RM-friendly tone: confident, concise, and actionable.
Use Indian financial terminology where appropriate (SIP, MF, AUM, SEBI, etc.).

${contextString}

INSTRUCTIONS:
- Analyze the query in the context of the client data above
- Provide a professional response (3-5 sentences)
- End with exactly one line starting with "SUGGESTED ACTION:" followed by a specific action

Format:
[Your analysis here]

SUGGESTED ACTION: [one specific actionable recommendation]`;

    const aiText = await generateAIResponse(systemPrompt, query);

    const suggestionMatch = aiText.match(/SUGGESTED ACTION:\s*(.+?)$/m);
    const suggestion = suggestionMatch?.[1]?.trim() ?? 'Schedule a portfolio review call with this client.';
    const explanation = aiText.replace(/SUGGESTED ACTION:.*$/m, '').trim();

    return {
      explanation: explanation || aiText,
      suggestion,
      confidence: 'high',
      context: {
        clientName: context.client.name,
        segment: context.client.segment,
        riskProfile: context.client.risk_profile,
        totalAUM: context.client.total_aum,
      },
    };
  }

  async generateTaskSuggestions(clientId: number): Promise<TaskSuggestionResponse> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new AppError(404, ErrorCodes.CLIENT_NOT_FOUND, 'Client not found');
    }

    const portfolio = await this.clientRepository.getPortfolio(clientId);
    const interactions = await this.clientRepository.getInteractions(clientId, 5);
    const contextString = this.buildClientContextString(client, portfolio, interactions);

    const systemPrompt = `You are a wealth management AI. Based on the client context, suggest 3 specific actionable tasks for the Relationship Manager.

${contextString}

Return ONLY valid JSON, no markdown, no extra text:
{"suggestions":[{"title":"string","description":"string","priority":"high|medium|low|urgent","reasoning":"string"}]}`;

    try {
      const aiText = await generateAIResponse(systemPrompt, 'Generate task suggestions');
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { suggestions: TaskSuggestion[] };
        if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
          return { suggestions: parsed.suggestions };
        }
      }
    } catch {
      // Fall through to fallback
    }

    return this.getFallbackTaskSuggestions(client, portfolio);
  }

  async getInsights(): Promise<CopilotInsightsResponse> {
    const { clients } = await this.clientRepository.findAll({ limit: 50, offset: 0 });
    const insights: CopilotInsight[] = [];

    for (const client of clients) {
      if (client.risk_score >= 8) {
        insights.push({
          id: uuidv4(),
          title: `High Risk Alert: ${client.name}`,
          description: `Client has a risk score of ${client.risk_score}/10. Verify portfolio alignment with ${client.risk_profile} risk tolerance.`,
          type: 'risk_alert',
          priority: 'high',
          clientId: client.client_id,
          clientName: client.name,
          actionRequired: true,
        });
      }

      const daysSinceContact = client.last_contacted_at
        ? Math.floor((Date.now() - new Date(client.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysSinceContact > 30) {
        insights.push({
          id: uuidv4(),
          title: `Follow-up Required: ${client.name}`,
          description: `No contact in ${daysSinceContact} days. Schedule a portfolio review call.`,
          type: 'follow_up',
          priority: daysSinceContact > 60 ? 'high' : 'medium',
          clientId: client.client_id,
          clientName: client.name,
          actionRequired: true,
        });
      }

      if (client.segment === 'UHNI' && client.total_aum > 10_000_000) {
        insights.push({
          id: uuidv4(),
          title: `Opportunity: ${client.name}`,
          description: `UHNI client with ₹${(client.total_aum / 10_000_000).toFixed(1)}Cr AUM. Consider premium product offerings.`,
          type: 'opportunity',
          priority: 'medium',
          clientId: client.client_id,
          clientName: client.name,
          actionRequired: false,
        });
      }
    }

    // Sort: high priority first, then risk_alerts, then follow_ups
    const sorted = insights.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return {
      insights: sorted.slice(0, 10),
      generatedAt: new Date().toISOString(),
    };
  }

  private getFallbackTaskSuggestions(client: Client, portfolio: Portfolio | null): TaskSuggestionResponse {
    const suggestions: TaskSuggestion[] = [
      {
        title: `Quarterly Portfolio Review — ${client.name}`,
        description: `Conduct quarterly review to ensure alignment with ${client.risk_profile} risk profile and update financial goals.`,
        priority: 'high',
        reasoning: 'Regular reviews maintain client trust and ensure portfolio health.',
      },
      {
        title: 'Risk Score Validation',
        description: `Current risk score is ${client.risk_score}/10. Validate against current market conditions and re-run KYC assessment.`,
        priority: 'medium',
        reasoning: 'Risk scores should be reassessed every 6 months per SEBI guidelines.',
      },
    ];

    if (portfolio && portfolio.cash_pct > 20) {
      suggestions.push({
        title: 'Address Elevated Cash Position',
        description: `Portfolio holds ${portfolio.cash_pct}% in cash (above 20% threshold). Discuss deployment strategy — consider STP or lump-sum MF allocation.`,
        priority: 'urgent',
        reasoning: 'High cash position suggests missed return opportunity in current market.',
      });
    } else {
      suggestions.push({
        title: 'Asset Allocation Review',
        description: 'Review current allocation against model portfolio for segment and risk profile match.',
        priority: 'low',
        reasoning: 'Periodic rebalancing maintains target risk-return profile.',
      });
    }

    return { suggestions };
  }
}

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

  async generateClientInsightsP0P6(
    context: ClientContext,
    _query: string
  ): Promise<string> {
    const client = context.client;
    const portfolio = context.portfolio;
    const interactions = context.interactions;

    const allocationSummary = portfolio
      ? `Equity ${portfolio.equity_pct}%, Debt ${portfolio.debt_pct}%, Gold/Alt ${portfolio.alt_pct}%, Cash ${portfolio.cash_pct}%`
      : 'Portfolio data unavailable';

    const lastInteraction = interactions[0]
      ? `${interactions[0].type} on ${new Date(interactions[0].created_at).toLocaleDateString('en-IN')}: ${interactions[0].notes}`
      : 'No recent interactions recorded';

    const daysSinceContact = client.last_contacted_at
      ? Math.floor((Date.now() - new Date(client.last_contacted_at).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const keyRisks: string[] = [];
    if (client.risk_score >= 8) keyRisks.push(`High risk score ${client.risk_score}/10 (${client.risk_profile})`);
    if (portfolio && portfolio.cash_pct > 20) keyRisks.push(`Elevated cash ${portfolio.cash_pct}% (deployment drag)`);
    if (daysSinceContact !== null && daysSinceContact > 30) keyRisks.push(`No contact in ${daysSinceContact} days (retention risk)`);
    if (!portfolio) keyRisks.push('Missing portfolio data (limits risk and allocation checks)');

    const riskAlignmentCheck = portfolio
      ? `Client risk profile: ${client.risk_profile} (score ${client.risk_score}/10). Allocation on record: ${allocationSummary}.`
      : `Client risk profile: ${client.risk_profile} (score ${client.risk_score}/10). Allocation unavailable.`;

    const fiRecommendations: string[] = [];
    if (portfolio && portfolio.cash_pct > 20) {
      fiRecommendations.push(`Create a cash deployment plan for ~${portfolio.cash_pct}% cash via STP over 4–8 weeks`);
    }
    if (client.risk_score >= 8) {
      fiRecommendations.push('Run an updated risk suitability check before any incremental equity exposure');
    }
    if (daysSinceContact !== null && daysSinceContact > 30) {
      fiRecommendations.push('Schedule a structured review touchpoint (agenda: goals, allocation, liquidity, next actions)');
    }

    const suggestedActions: string[] = [];
    if (fiRecommendations.length > 0) {
      suggestedActions.push(...fiRecommendations.slice(0, 2));
    } else {
      suggestedActions.push(
        `No action trigger detected from provided fields (risk_score ${client.risk_score}/10${daysSinceContact !== null ? `, last_contacted ${daysSinceContact}d` : ''}${portfolio ? `, cash ${portfolio.cash_pct}%` : ''}); provide target allocation/goals/liquidity to refine next steps`
      );
    }

    const productRecommendations: string[] = [];
    if (portfolio && portfolio.cash_pct > 20) {
      productRecommendations.push('STP from liquid fund into core MF allocation (phased)');
    }
    if (client.segment === 'UHNI' && client.total_aum > 10_000_000) {
      productRecommendations.push('Structured/premium solutions shortlist aligned to risk profile');
    }

    const supportActions: string[] = [];
    if (daysSinceContact !== null && daysSinceContact > 30) {
      supportActions.push('Draft a client-ready review note and meeting invite with 3-point agenda');
    }
    supportActions.push('Pull last 5 interactions and confirm pending client requests before outreach');

    const marketSummary =
      'No market data provided in the client dataset; market view omitted to avoid speculation.';

    const impactOnPortfolio = portfolio
      ? `Without market inputs, focus on internal drivers: allocation mix (${allocationSummary}) and any cash drag.`
      : 'Portfolio impact cannot be assessed because portfolio allocation is unavailable.';

    const recentTransactions = 'No transaction feed provided in the dataset.';
    const allocationImpact = portfolio ? `Current allocation: ${allocationSummary}.` : 'Allocation unavailable.';
    const rebalancingNeeds = portfolio
      ? portfolio.cash_pct > 20
        ? `Yes — prioritize deploying excess cash; rebalance only after confirming risk suitability.`
        : 'No clear rebalance trigger detected from provided allocation alone.'
      : 'Cannot assess rebalancing without portfolio allocation data.';

    const detectedSignals = daysSinceContact !== null && daysSinceContact > 60 ? 'Prolonged inactivity / low engagement.' : 'No explicit life-event signals in data.';
    const financialImpact = daysSinceContact !== null && daysSinceContact > 60 ? 'Potential attrition / missed wallet-share opportunity.' : 'Not enough data to quantify.';
    const suggestedAdjustments = daysSinceContact !== null && daysSinceContact > 60 ? 'Reconfirm goals, horizon, and liquidity; refresh IPS notes.' : 'None from provided data.';

    const lastActions = lastInteraction;
    const behavioralInsight = daysSinceContact !== null ? `Last contacted ${daysSinceContact} days ago.` : 'Last contacted date not available.';
    const riskGoalImpact = daysSinceContact !== null && daysSinceContact > 30 ? 'Follow-up delay increases retention risk; may affect execution of next portfolio actions.' : 'No immediate behavior risk detected from contact cadence.';

    return [
      'P0: User Risk & Portfolio Overview',
      `- Risk Profile: ${client.risk_profile} (score ${client.risk_score}/10)`,
      `- Allocation Summary: ${allocationSummary}`,
      '- Performance Analysis: Not available in provided data',
      `- Risk Alignment Check: ${riskAlignmentCheck}`,
      `- Key Risks: ${keyRisks.length ? keyRisks.join('; ') : 'No material risks detected from provided fields'}`,
      'P1: Market Intelligence',
      `- Market Summary: ${marketSummary}`,
      `- Impact on Portfolio: ${impactOnPortfolio}`,
      `- FI Recommendations: ${fiRecommendations.length ? fiRecommendations.join('; ') : 'No market-based recommendations (no market data provided)'}`,
      `- Suggested Actions: ${suggestedActions.join('; ')}`,
      'P2: Cash Flow & External Updates',
      `- Recent Transactions: ${recentTransactions}`,
      `- Allocation Impact: ${allocationImpact}`,
      `- Rebalancing Needs: ${rebalancingNeeds}`,
      'P3: Life Event Tracking',
      `- Detected Signals: ${detectedSignals}`,
      `- Financial Impact: ${financialImpact}`,
      `- Suggested Adjustments: ${suggestedAdjustments}`,
      'P4: Recent User Behavior',
      `- Last Actions: ${lastActions}`,
      `- Behavioral Insight: ${behavioralInsight}`,
      `- Risk/Goal Impact: ${riskGoalImpact}`,
      'P5: Product Recommendations',
      `- Recommended Products: ${productRecommendations.length ? productRecommendations.join('; ') : 'None suggested from provided data'}`,
      `- Rationale: Based on client segment (${client.segment}), risk profile (${client.risk_profile}), and observed allocation/cash position`,
      `- Priority: ${portfolio && portfolio.cash_pct > 20 ? 'high' : 'medium'}`,
      'P6: Support & Assistance',
      `- Suggested Support Actions: ${supportActions.join('; ')}`,
      '- Platform Guidance: Use chat follow-ups to request: target allocation, goals, upcoming liquidity needs, and any product constraints',
    ].join('\n');
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
    const sorted = [...insights].sort((a, b) => {
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

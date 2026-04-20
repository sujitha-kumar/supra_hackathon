import { ClientRepository, Client, ClientsQueryParams, PerformanceData, Interaction } from '../repositories/client.repository';
import { AppError, ErrorCodes } from '../types';

export interface ClientsResponse {
  clients: Client[];
  total: number;
  limit: number;
  offset: number;
}

export interface PortfolioResponse {
  portfolio_id: number;
  client_id: number;
  total_value: number;
  allocations: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
  last_updated: string;
}

export interface PerformanceResponse {
  data: PerformanceData[];
}

export interface InteractionsResponse {
  interactions: Interaction[];
}

export type BriefInsightPriority = 'high' | 'medium' | 'low';

export interface BriefInsight {
  id: number;
  text: string;
  priority: BriefInsightPriority;
}

export interface ClientBriefResponse {
  client_id: number;
  generated_at: string;
  summary: string;
  patterns: string[];
  talking_points: string[];
  insights: BriefInsight[];
}

export class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  async getClients(params: ClientsQueryParams): Promise<ClientsResponse> {
    const { clients, total } = await this.repository.findAll(params);

    return {
      clients,
      total,
      limit: params.limit || 50,
      offset: params.offset || 0,
    };
  }

  async getClientById(id: number): Promise<Client> {
    const client = await this.repository.findById(id);

    if (!client) {
      throw new AppError(404, ErrorCodes.CLIENT_NOT_FOUND, 'Client not found');
    }

    return client;
  }

  async getClientPortfolio(id: number): Promise<PortfolioResponse> {
    await this.getClientById(id);

    const portfolio = await this.repository.getPortfolio(id);

    if (!portfolio) {
      throw new AppError(404, ErrorCodes.CLIENT_NOT_FOUND, 'Portfolio not found');
    }

    return {
      portfolio_id: portfolio.portfolio_id,
      client_id: portfolio.client_id,
      total_value: portfolio.total_value,
      allocations: {
        equity: portfolio.equity_pct,
        debt: portfolio.debt_pct,
        gold: portfolio.alt_pct,
        cash: portfolio.cash_pct,
      },
      last_updated: portfolio.last_updated,
    };
  }

  async getClientPerformance(id: number): Promise<PerformanceResponse> {
    await this.getClientById(id);

    const data = await this.repository.getPerformance(id);

    return { data };
  }

  async getClientInteractions(id: number, limit: number = 10): Promise<InteractionsResponse> {
    await this.getClientById(id);

    const interactions = await this.repository.getInteractions(id, limit);

    return { interactions };
  }

  async getClientBrief(id: number): Promise<ClientBriefResponse> {
    const client = await this.getClientById(id);

    const [portfolio, performance, interactions] = await Promise.all([
      this.repository.getPortfolio(id),
      this.repository.getPerformance(id),
      this.repository.getInteractions(id, 5),
    ]);

    const generatedAt = new Date().toISOString();

    const patterns: string[] = [];
    const talkingPoints: string[] = [];
    const insights: BriefInsight[] = [];

    if (portfolio) {
      const maxAllocation = Math.max(
        portfolio.equity_pct,
        portfolio.debt_pct,
        portfolio.alt_pct,
        portfolio.cash_pct
      );

      if (maxAllocation === portfolio.equity_pct) {
        patterns.push('Portfolio is equity-heavy relative to other asset classes.');
      } else if (maxAllocation === portfolio.debt_pct) {
        patterns.push('Portfolio is debt-heavy, indicating a conservative allocation tilt.');
      } else if (maxAllocation === portfolio.alt_pct) {
        patterns.push('Alternatives allocation is notable compared to other asset classes.');
      } else {
        patterns.push('Cash allocation is elevated, indicating potential redeployment opportunity.');
      }

      if (portfolio.cash_pct >= 10) {
        insights.push({
          id: 1,
          priority: 'medium',
          text: `Cash allocation is ${portfolio.cash_pct}%. Consider deploying cash based on goals and market view.`,
        });
      }
    }

    if (client.risk_score >= 8) {
      patterns.push('High risk score; ensure portfolio drawdown tolerance is aligned.');
      talkingPoints.push('Reconfirm risk appetite and time horizon; discuss volatility expectations.');
      insights.push({
        id: insights.length + 1,
        priority: 'high',
        text: `Risk score is ${client.risk_score}/10. Consider stress-test and downside protection discussion.`,
      });
    } else if (client.risk_score <= 4) {
      patterns.push('Lower risk score; client may prefer stability and predictable outcomes.');
      talkingPoints.push('Discuss capital preservation objectives and income planning.');
    }

    if (performance.length >= 2) {
      const first = performance[0].value;
      const last = performance[performance.length - 1].value;
      const changePct = first > 0 ? ((last - first) / first) * 100 : 0;
      if (changePct >= 5) {
        patterns.push('Portfolio value trend is up over the recent period.');
        talkingPoints.push('Acknowledge performance and discuss rebalancing to target allocations.');
      } else if (changePct <= -5) {
        patterns.push('Portfolio value trend is down over the recent period.');
        talkingPoints.push('Discuss drawdown drivers and whether allocation adjustments are needed.');
        insights.push({
          id: insights.length + 1,
          priority: 'high',
          text: 'Recent performance shows a noticeable dip. Prepare a calm, data-backed explanation and next steps.',
        });
      } else {
        patterns.push('Portfolio value trend is relatively stable over the recent period.');
      }
    }

    if (interactions.length === 0) {
      insights.push({
        id: insights.length + 1,
        priority: 'high',
        text: 'No recent interactions logged. Consider scheduling a check-in call.',
      });
      talkingPoints.push('Schedule a touchpoint and share a concise portfolio update.');
    } else {
      insights.push({
        id: insights.length + 1,
        priority: 'low',
        text: `Last interaction: ${interactions[0].type} (${new Date(interactions[0].created_at).toLocaleDateString()}).`,
      });
    }

    if (talkingPoints.length === 0) {
      talkingPoints.push('Provide a quick portfolio summary and confirm next review cadence.');
    }

    const summaryParts: string[] = [];
    summaryParts.push(`${client.name} (${client.segment}) has a ${client.risk_profile.toLowerCase()} risk profile.`);
    summaryParts.push(`Total AUM is ₹${client.total_aum.toLocaleString()} and risk score is ${client.risk_score}/10.`);
    if (portfolio) {
      summaryParts.push(
        `Allocation: Equity ${portfolio.equity_pct}%, Debt ${portfolio.debt_pct}%, Alternatives ${portfolio.alt_pct}%, Cash ${portfolio.cash_pct}%.`
      );
    }

    return {
      client_id: id,
      generated_at: generatedAt,
      summary: summaryParts.join(' '),
      patterns,
      talking_points: talkingPoints,
      insights,
    };
  }
}

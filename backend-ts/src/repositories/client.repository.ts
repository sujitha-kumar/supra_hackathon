import { supabase } from '../config/supabase';

// JSONB column shapes matching the new clients table schema
export interface ClientPortfolioJson {
  equity_pct: number;
  debt_pct: number;
  hybrid_pct: number;
  cash_pct: number;
  sip_active: boolean;
  total_value: number;
}

export interface ClientPerformanceJson {
  return_1m: number;
  return_3m: number;
  return_1y: number;
  return_3y: number;
  benchmark_1m: number;
  benchmark_3m: number;
  benchmark_1y: number;
  benchmark_3y: number;
}

export interface ClientMarketJson {
  trend: string;
  volatility_index: number;
  sentiment: string;
}

export interface ClientBehaviorJson {
  last_action: string | null;
  action_frequency: string;
  investment_style: string;
}

export interface ClientTransactionsJson {
  recent_equity_increase: boolean;
  recent_debt_increase: boolean;
  recent_withdrawal: boolean;
  redemption_pattern: string;
}

export interface Client {
  /** UUID primary key (new schema uses `id` instead of `client_id`) */
  id: string;
  /** Alias for id — kept for backward compatibility with existing service code */
  client_id: string;
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  risk_profile: 'Low' | 'Moderate' | 'High' | 'Aggressive';
  /** Derived from portfolio.total_value for backward compat */
  segment: 'HNI' | 'UHNI' | 'Retail';
  /** Derived from risk_profile for backward compat */
  risk_score: number;
  /** Derived from portfolio.total_value for backward compat */
  total_aum: number;
  /** Not in new schema — always undefined */
  last_contacted_at?: string;
  // JSONB columns
  portfolio: ClientPortfolioJson;
  performance: ClientPerformanceJson;
  market: ClientMarketJson;
  behavior: ClientBehaviorJson;
  transactions: ClientTransactionsJson;
  evaluated_at: string;
  created_at: string;
  updated_at: string;
}

export interface ClientsQueryParams {
  segment?: string;
  risk_profile?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class ClientRepository {
  async findAll(params: ClientsQueryParams): Promise<{ clients: Client[]; total: number }> {
    let query = supabase.from('clients').select('*', { count: 'exact' });

    if (params.risk_profile) {
      query = query.eq('risk_profile', params.risk_profile);
    }

    // segment is now derived — skip DB filter for it

    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,email.ilike.%${params.search}%,pan.ilike.%${params.search}%`
      );
    }

    const limit = params.limit || 50;
    const offset = params.offset || 0;

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const clients = (data || []).map((row: Record<string, unknown>) => this.mapToClient(row));

    return {
      clients,
      total: count || 0,
    };
  }

  async findById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return this.mapToClient(data);
  }

  /**
   * Reads portfolio data from the clients.portfolio JSONB column.
   * The separate portfolios table is no longer used.
   */
  async getPortfolio(clientId: string): Promise<Portfolio | null> {
    const client = await this.findById(clientId);
    if (!client) return null;

    const p = client.portfolio;
    return {
      portfolio_id: 0,
      client_id: client.id,
      total_value: p.total_value ?? 0,
      equity_pct: p.equity_pct ?? 0,
      debt_pct: p.debt_pct ?? 0,
      alt_pct: p.hybrid_pct ?? 0,  // hybrid_pct maps to alt_pct
      cash_pct: p.cash_pct ?? 0,
      last_updated: client.updated_at,
    };
  }

  async getPerformance(clientId: string): Promise<PerformanceData[]> {
    // Build synthetic monthly data from the performance JSONB column
    const client = await this.findById(clientId);
    if (!client) return [];

    const perf = client.performance;
    const now = new Date();
    const result: PerformanceData[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build approx monthly values from return percentages
    const totalValue = client.portfolio.total_value ?? 0;
    const val1y = totalValue / (1 + (perf.return_1y ?? 0) / 100);
    const val3m = totalValue / (1 + (perf.return_3m ?? 0) / 100);
    const val1m = totalValue / (1 + (perf.return_1m ?? 0) / 100);

    const months = [
      { offset: 12, value: val1y },
      { offset: 9,  value: (val1y + val3m) / 2 },
      { offset: 6,  value: (val3m + val1m) / 2 },
      { offset: 3,  value: val3m },
      { offset: 1,  value: val1m },
      { offset: 0,  value: totalValue },
    ];

    for (const m of months) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - m.offset);
      result.push({ month: monthNames[d.getMonth()], value: Math.round(m.value) });
    }

    return result;
  }

  async getInteractions(clientId: string, limit: number = 10): Promise<Interaction[]> {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return [];
      }

      return (data || []).map((row: Record<string, unknown>) => this.mapToInteraction(row));
    } catch {
      return [];
    }
  }

  private deriveRiskScore(riskProfile: string): number {
    switch (riskProfile) {
      case 'Low':         return 3;
      case 'Moderate':    return 5;
      case 'High':        return 7;
      case 'Aggressive':  return 9;
      default:            return 5;
    }
  }

  private deriveSegment(totalValue: number): Client['segment'] {
    if (totalValue >= 10_000_000) return 'UHNI';
    if (totalValue >= 2_000_000)  return 'HNI';
    return 'Retail';
  }

  private mapToClient(row: Record<string, unknown>): Client {
    const portfolio = (row.portfolio as ClientPortfolioJson) ?? {
      equity_pct: 0, debt_pct: 0, hybrid_pct: 0, cash_pct: 0, sip_active: false, total_value: 0,
    };
    const performance = (row.performance as ClientPerformanceJson) ?? {
      return_1m: 0, return_3m: 0, return_1y: 0, return_3y: 0,
      benchmark_1m: 0, benchmark_3m: 0, benchmark_1y: 0, benchmark_3y: 0,
    };
    const market = (row.market as ClientMarketJson) ?? {
      trend: 'neutral', volatility_index: 0, sentiment: 'neutral',
    };
    const behavior = (row.behavior as ClientBehaviorJson) ?? {
      last_action: null, action_frequency: 'quarterly', investment_style: 'moderate',
    };
    const transactions = (row.transactions as ClientTransactionsJson) ?? {
      recent_equity_increase: false, recent_debt_increase: false,
      recent_withdrawal: false, redemption_pattern: 'none',
    };

    const id = row.id as string;
    const riskProfile = (row.risk_profile as Client['risk_profile']) || 'Moderate';
    const totalValue = portfolio.total_value ?? 0;

    return {
      id,
      client_id: id,                          // backward-compat alias
      name: row.name as string,
      pan: row.pan as string,
      email: row.email as string | undefined,
      phone: row.phone as string | undefined,
      risk_profile: riskProfile,
      segment: this.deriveSegment(totalValue),
      risk_score: this.deriveRiskScore(riskProfile),
      total_aum: totalValue,
      last_contacted_at: undefined,
      portfolio,
      performance,
      market,
      behavior,
      transactions,
      evaluated_at: (row.evaluated_at as string) ?? (row.created_at as string),
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  private mapToInteraction(row: Record<string, unknown>): Interaction {
    return {
      interaction_id: row.interaction_id as number,
      client_id: row.client_id as string,
      type: row.type as Interaction['type'],
      notes: row.notes as string,
      created_at: row.created_at as string,
    };
  }
}

export interface Portfolio {
  portfolio_id: number;
  client_id: string;
  total_value: number;
  equity_pct: number;
  debt_pct: number;
  alt_pct: number;
  cash_pct: number;
  last_updated: string;
}

export interface PerformanceData {
  month: string;
  value: number;
}

export interface Interaction {
  interaction_id: number;
  client_id: string;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
  created_at: string;
}

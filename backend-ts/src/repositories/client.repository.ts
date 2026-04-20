import { supabase } from '../config/supabase';

export interface Client {
  client_id: number;
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  segment: 'HNI' | 'UHNI' | 'Retail';
  risk_profile: 'Moderate' | 'Aggressive' | 'Conservative';
  risk_score: number;
  total_aum: number;
  last_contacted_at?: string;
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

    if (params.segment) {
      query = query.eq('segment', params.segment);
    }

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

  async findById(id: number): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return this.mapToClient(data);
  }


  async getPortfolio(clientId: number): Promise<Portfolio | null> {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return this.mapToPortfolio(data);
  }

  async getPerformance(clientId: number): Promise<PerformanceData[]> {
    const { data, error } = await supabase
      .from('portfolio_performance')
      .select('*')
      .eq('client_id', clientId)
      .order('date', { ascending: true })
      .limit(10);

    if (error) {
      throw error;
    }

    return (data || []).map((row: Record<string, unknown>) => this.mapToPerformance(row));
  }

  async getInteractions(clientId: number, limit: number = 10): Promise<Interaction[]> {
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map((row: Record<string, unknown>) => this.mapToInteraction(row));
  }

  private mapToClient(row: Record<string, unknown>): Client {
    return {
      client_id: row.client_id as number,
      name: row.name as string,
      pan: row.pan as string,
      email: row.email as string | undefined,
      phone: row.phone as string | undefined,
      segment: row.segment as Client['segment'],
      risk_profile: row.risk_profile as Client['risk_profile'],
      risk_score: row.risk_score as number,
      total_aum: row.total_aum as number,
      last_contacted_at: row.last_contacted_at as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  private mapToPortfolio(row: Record<string, unknown>): Portfolio {
    return {
      portfolio_id: row.portfolio_id as number,
      client_id: row.client_id as number,
      total_value: row.total_value as number,
      equity_pct: row.equity_pct as number,
      debt_pct: row.debt_pct as number,
      alt_pct: row.alt_pct as number,
      cash_pct: row.cash_pct as number,
      last_updated: row.last_updated as string,
    };
  }

  private mapToPerformance(row: Record<string, unknown>): PerformanceData {
    const date = new Date(row.date as string);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      month: monthNames[date.getMonth()],
      value: row.portfolio_value as number,
    };
  }

  private mapToInteraction(row: Record<string, unknown>): Interaction {
    return {
      interaction_id: row.interaction_id as number,
      client_id: row.client_id as number,
      type: row.type as Interaction['type'],
      notes: row.notes as string,
      created_at: row.created_at as string,
    };
  }
}

export interface Portfolio {
  portfolio_id: number;
  client_id: number;
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
  client_id: number;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
  created_at: string;
}

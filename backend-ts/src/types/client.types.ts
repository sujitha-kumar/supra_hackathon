export type RiskLevel = 'low' | 'medium' | 'high' | 'very-high';
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'overdue';

export interface Client {
  id: number;
  name: string;
  pan: string;
  company: string;
  email: string;
  phone: string;
  aum: string;
  ytd: number;
  risk: RiskLevel;
  status: ClientStatus;
  lastContact: string;
  projects: number;
  joinDate: string;
  tags: string[];
}

export interface ClientProfile extends Client {
}

export interface PortfolioOverview {
  totalAUM: string;
  ytdReturn: number;
  riskScore: number;
  riskLevel: RiskLevel;
  allocations: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
}

export interface Holding {
  id: number;
  name: string;
  type: string;
  value: string;
  allocation: number;
  return: number;
}

export interface PerformanceData {
  month: string;
  value: number;
}

export interface Transaction {
  id: number;
  date: string;
  type: 'buy' | 'sell' | 'dividend';
  asset: string;
  amount: string;
  status: 'completed' | 'pending';
}

export interface Interaction {
  id: number;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'chat';
  summary: string;
  duration?: string;
}

export interface ClientBrief {
  clientId: number;
  clientName: string;
  brief: string;
  keyPoints: string[];
  riskFactors: string[];
  opportunities: string[];
  generatedAt: string;
}

export interface ClientsQueryParams {
  segment?: string;
  risk_profile?: RiskLevel;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  limit: number;
  offset: number;
}

export interface HoldingsResponse {
  holdings: Holding[];
}

export interface PerformanceResponse {
  performance: PerformanceData[];
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export interface InteractionsResponse {
  interactions: Interaction[];
}

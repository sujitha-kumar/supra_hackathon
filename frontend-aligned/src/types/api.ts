// API Response Types based on Database Schema

// ============================================
// CLIENT TYPES
// ============================================

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
  /** UUID primary key */
  id: string;
  /** Alias for id (backward compat) */
  client_id: string;
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  risk_profile: 'Low' | 'Moderate' | 'High' | 'Aggressive';
  /** Derived from portfolio.total_value */
  segment: 'HNI' | 'UHNI' | 'Retail';
  /** Derived from risk_profile */
  risk_score: number;
  /** Derived from portfolio.total_value */
  total_aum: number;
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

export interface CreateClientRequest {
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  risk_profile: 'Low' | 'Moderate' | 'High' | 'Aggressive';
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  risk_profile?: 'Low' | 'Moderate' | 'High' | 'Aggressive';
}

// ============================================
// PORTFOLIO TYPES
// ============================================

export interface Portfolio {
  portfolio_id: number;
  client_id: string;
  total_value: number;
  equity_pct: number;
  debt_pct: number;
  alt_pct: number;
  cash_pct: number;
  sip_active?: boolean;
  last_updated: string;
}

export interface Holding {
  holding_id: number;
  client_id: string;
  asset_name: string;
  asset_type: string;
  value: number;
  units: number;
  last_updated: string;
}

export interface PortfolioPerformance {
  id: number;
  client_id: string;
  date: string;
  portfolio_value: number;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export interface Transaction {
  transaction_id: number;
  client_id: string;
  type: 'BUY' | 'SELL' | 'SIP';
  asset_name: string;
  amount: number;
  transaction_date: string;
}

export interface CreateTransactionRequest {
  client_id: string;
  type: 'BUY' | 'SELL' | 'SIP';
  asset_name: string;
  amount: number;
}

// ============================================
// INTERACTION TYPES
// ============================================

export interface Interaction {
  interaction_id: number;
  client_id: string;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
  created_at: string;
}

export interface CreateInteractionRequest {
  client_id: string;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
}

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  task_id: number;
  client_id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
  status: 'Pending' | 'Completed';
  created_at: string;
}

export interface CreateTaskRequest {
  client_id: string;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
  due_date?: string;
  status?: 'Pending' | 'Completed';
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatSession {
  session_id: number;
  client_id: string;
  created_at: string;
  message_count?: number;
}

export interface ChatMessage {
  message_id: number;
  session_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  session_id: number;
  message: string;
  client_id?: string;
}

export interface CreateSessionRequest {
  client_id: string;
}

// ============================================
// AI BRIEF TYPES
// ============================================

export interface AIBrief {
  id: number;
  client_id: string;
  summary: string;
  generated_at: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface DashboardAnalytics {
  total_clients: number;
  total_aum: number;
  aum_growth: number;
  active_clients: number;
  overdue_tasks: number;
  pending_tasks: number;
}

export interface AUMTrendData {
  month: string;
  aum: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ConversionFunnel {
  stages: ConversionFunnelStage[];
  conversion_rate: number;
}

export interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface AnalyticsSnapshot {
  id: number;
  total_clients: number;
  total_aum: number;
  aum_growth: number;
  overdue_tasks: number;
  created_at: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  user: User;
}

// ============================================
// API QUERY PARAMS
// ============================================

export interface ClientsQueryParams {
  segment?: 'HNI' | 'UHNI' | 'Retail';
  risk_profile?: 'Low' | 'Moderate' | 'High' | 'Aggressive';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface TasksQueryParams {
  client_id?: string;
  status?: 'Pending' | 'Completed';
  priority?: 'High' | 'Medium' | 'Low';
  limit?: number;
  offset?: number;
}

export interface TransactionsQueryParams {
  type?: 'BUY' | 'SELL' | 'SIP';
  limit?: number;
  offset?: number;
}

export interface PerformanceQueryParams {
  period?: '1M' | '3M' | '6M' | '1Y' | 'ALL';
}

export interface ChatSessionsQueryParams {
  client_id?: string;
  limit?: number;
  offset?: number;
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// SEARCH TYPES
// ============================================

export interface SearchResults {
  clients: Client[];
  tasks: Task[];
  transactions: Transaction[];
}

export interface SearchQueryParams {
  q: string;
  limit?: number;
}

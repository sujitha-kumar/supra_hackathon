// API Response Types based on Database Schema

// ============================================
// CLIENT TYPES
// ============================================

export interface Client {
  client_id: number;
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  segment: 'HNI' | 'UHNI' | 'Retail';
  risk_profile: 'Moderate' | 'Aggressive' | 'Conservative';
  risk_score: number; // 0-10
  total_aum: number;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  name: string;
  pan: string;
  email?: string;
  phone?: string;
  segment: 'HNI' | 'UHNI' | 'Retail';
  risk_profile: 'Moderate' | 'Aggressive' | 'Conservative';
  risk_score: number;
  total_aum?: number;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  segment?: 'HNI' | 'UHNI' | 'Retail';
  risk_profile?: 'Moderate' | 'Aggressive' | 'Conservative';
  risk_score?: number;
  total_aum?: number;
  last_contacted_at?: string;
}

// ============================================
// PORTFOLIO TYPES
// ============================================

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

export interface Holding {
  holding_id: number;
  client_id: number;
  asset_name: string;
  asset_type: string;
  value: number;
  units: number;
  last_updated: string;
}

export interface PortfolioPerformance {
  id: number;
  client_id: number;
  date: string;
  portfolio_value: number;
}

// ============================================
// TRANSACTION TYPES
// ============================================

export interface Transaction {
  transaction_id: number;
  client_id: number;
  type: 'BUY' | 'SELL' | 'SIP';
  asset_name: string;
  amount: number;
  transaction_date: string;
}

export interface CreateTransactionRequest {
  client_id: number;
  type: 'BUY' | 'SELL' | 'SIP';
  asset_name: string;
  amount: number;
}

// ============================================
// INTERACTION TYPES
// ============================================

export interface Interaction {
  interaction_id: number;
  client_id: number;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
  created_at: string;
}

export interface CreateInteractionRequest {
  client_id: number;
  type: 'Call' | 'Email' | 'Meeting';
  notes: string;
}

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  task_id: number;
  client_id: number;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  due_date: string;
  status: 'Pending' | 'Completed';
  created_at: string;
}

export interface CreateTaskRequest {
  client_id: number;
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
  client_id: number;
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
  client_id?: number;
}

export interface CreateSessionRequest {
  client_id: number;
}

// ============================================
// AI BRIEF TYPES
// ============================================

export interface AIBrief {
  id: number;
  client_id: number;
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
  risk_profile?: 'Moderate' | 'Aggressive' | 'Conservative';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface TasksQueryParams {
  client_id?: number;
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
  client_id?: number;
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

export type TrendDirection = 'up' | 'down';
export type InsightType = 'opportunity' | 'risk' | 'trend';
export type InsightPriority = 'low' | 'medium' | 'high';
export type Period = '6M' | '1Y' | 'ALL';

export interface DashboardStat {
  id: number;
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: string;
}

export interface DashboardResponse {
  totalClients: number;
  activeClients: number;
  totalAUM: string;
  aumGrowth: number;
  avgPortfolioSize: string;
  clientRetention: number;
  overdueTasks: number;
  stats: DashboardStat[];
}

export interface AUMTrendData {
  month: string;
  value: number;
}

export interface AUMTrendResponse {
  aumTrend: AUMTrendData[];
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface FunnelResponse {
  conversionFunnel: FunnelStage[];
}

export interface Insight {
  id: number;
  title: string;
  description: string;
  type: InsightType;
  priority: InsightPriority;
  generatedAt: string;
}

export interface InsightsResponse {
  insights: Insight[];
}

export interface AUMTrendQueryParams {
  period?: Period;
}

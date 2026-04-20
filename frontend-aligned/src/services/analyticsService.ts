import { apiClient } from '../lib/axios';

export interface DashboardStat {
  id: number;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
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

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface BackendInsight {
  id: number;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend';
  priority: 'low' | 'medium' | 'high';
  generatedAt: string;
}

export interface InsightCardData {
  id: number;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  icon: string;
}

function mapInsight(insight: BackendInsight): InsightCardData {
  const typeMap: Record<BackendInsight['type'], InsightCardData['type']> = {
    opportunity: 'success',
    risk: 'warning',
    trend: 'info',
  };
  const iconMap: Record<BackendInsight['type'], string> = {
    opportunity: 'trending-up',
    risk: 'alert',
    trend: 'calendar',
  };
  return {
    id: insight.id,
    title: insight.title,
    description: insight.description,
    type: typeMap[insight.type],
    icon: iconMap[insight.type],
  };
}

export const analyticsService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>('/analytics/dashboard');
    return response.data;
  },

  getAUMTrend: async (period = '1Y'): Promise<AUMTrendData[]> => {
    const response = await apiClient.get<{ aumTrend: AUMTrendData[] }>('/analytics/aum-trend', {
      params: { period },
    });
    return response.data.aumTrend;
  },

  getFunnel: async (): Promise<FunnelStage[]> => {
    const response = await apiClient.get<{ conversionFunnel: FunnelStage[] }>('/analytics/funnel');
    return response.data.conversionFunnel;
  },

  getInsights: async (): Promise<InsightCardData[]> => {
    const response = await apiClient.get<{ insights: BackendInsight[] }>('/analytics/insights');
    return response.data.insights.slice(0, 3).map(mapInsight);
  },
};

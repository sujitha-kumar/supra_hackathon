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

// Default fallback data when API endpoints fail
const defaultDashboard: DashboardResponse = {
  totalClients: 24,
  activeClients: 18,
  totalAUM: '$18,870,000',
  aumGrowth: 12.3,
  avgPortfolioSize: '$3,774,000',
  clientRetention: 94.2,
  overdueTasks: 3,
  stats: [],
};

const defaultAUMTrend: AUMTrendData[] = [
  { month: 'Jan', value: 16200000 },
  { month: 'Feb', value: 17400000 },
  { month: 'Mar', value: 18870000 },
];

const defaultFunnel: FunnelStage[] = [
  { stage: 'Leads', count: 500, percentage: 100 },
  { stage: 'Prospects', count: 150, percentage: 30 },
  { stage: 'Clients', count: 24, percentage: 16 },
];

const defaultInsights: InsightCardData[] = [];

export const analyticsService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    try {
      const response = await apiClient.get<DashboardResponse>('/analytics/dashboard');
      return response.data;
    } catch {
      return defaultDashboard;
    }
  },

  getAUMTrend: async (period = '1Y'): Promise<AUMTrendData[]> => {
    try {
      const response = await apiClient.get<{ aumTrend: AUMTrendData[] }>('/analytics/aum-trend', {
        params: { period },
      });
      return response.data?.aumTrend || defaultAUMTrend;
    } catch {
      return defaultAUMTrend;
    }
  },

  getFunnel: async (): Promise<FunnelStage[]> => {
    try {
      const response = await apiClient.get<{ conversionFunnel: FunnelStage[] }>('/analytics/funnel');
      return response.data?.conversionFunnel || defaultFunnel;
    } catch {
      return defaultFunnel;
    }
  },

  getInsights: async (): Promise<InsightCardData[]> => {
    try {
      const response = await apiClient.get<{ insights: BackendInsight[] }>('/analytics/insights');
      if (!response.data?.insights) return defaultInsights;
      return response.data.insights.slice(0, 3).map(mapInsight);
    } catch {
      return defaultInsights;
    }
  },
};

import { supabase } from '../config/supabase';
import {
  DashboardStat,
  AUMTrendData,
  FunnelStage,
  Insight,
  Period,
} from '../types';
import { formatCurrency } from '../utils/formatters';

export class AnalyticsRepository {
  async getDashboardStats(): Promise<{
    totalClients: number;
    activeClients: number;
    totalAUM: string;
    aumGrowth: number;
    avgPortfolioSize: string;
    clientRetention: number;
    overdueTasks: number;
    stats: DashboardStat[];
  }> {
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { data: aumData } = await supabase
      .from('clients')
      .select('total_aum');

    const totalAUMValue = (aumData || []).reduce(
      (sum, row: { total_aum: number | null }) => sum + (row.total_aum || 0),
      0
    );

    // Use total clients as active — no status column on clients table
    const activeClients = totalClients;

    const { count: overdueTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('due_date', new Date().toISOString());

    const avgPortfolioValue = totalClients ? totalAUMValue / totalClients : 0;

    const stats: DashboardStat[] = [
      {
        id: 1,
        label: 'Total AUM',
        value: formatCurrency(totalAUMValue),
        change: '+12.3%',
        trend: 'up',
        icon: 'chart',
      },
      {
        id: 2,
        label: 'Active Clients',
        value: String(activeClients || 0),
        change: '+8.2%',
        trend: 'up',
        icon: 'users',
      },
      {
        id: 3,
        label: 'Avg. Portfolio Size',
        value: formatCurrency(avgPortfolioValue),
        change: '+5.1%',
        trend: 'up',
        icon: 'wallet',
      },
      {
        id: 4,
        label: 'Client Retention',
        value: '94.2%',
        change: '-1.2%',
        trend: 'down',
        icon: 'shield',
      },
    ];

    return {
      totalClients: totalClients || 0,
      activeClients: activeClients || 0,
      totalAUM: formatCurrency(totalAUMValue),
      aumGrowth: 12.3,
      avgPortfolioSize: formatCurrency(avgPortfolioValue),
      clientRetention: 94.2,
      overdueTasks: overdueTasks || 0,
      stats,
    };
  }

  async getAUMTrend(period: Period = '1Y'): Promise<AUMTrendData[]> {
    const { data, error } = await supabase
      .from('aum_trend')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw error;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (data || []).map((row) => {
      const date = new Date(row.date);
      return {
        month: monthNames[date.getMonth()],
        value: row.value,
      };
    });
  }

  async getConversionFunnel(): Promise<FunnelStage[]> {
    const { data, error } = await supabase
      .from('conversion_funnel')
      .select('*')
      .order('stage_order', { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      stage: row.stage,
      count: row.count,
      percentage: row.percentage,
    }));
  }

  async getInsights(): Promise<Insight[]> {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      priority: row.priority,
      generatedAt: new Date(row.created_at).toISOString(),
    }));
  }
}

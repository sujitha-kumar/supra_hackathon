import { AnalyticsRepository } from '../repositories/analytics.repository';
import {
  DashboardResponse,
  AUMTrendResponse,
  FunnelResponse,
  InsightsResponse,
  Period,
} from '../types';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getDashboard(): Promise<DashboardResponse> {
    return await this.repository.getDashboardStats();
  }

  async getAUMTrend(period: Period = '1Y'): Promise<AUMTrendResponse> {
    const aumTrend = await this.repository.getAUMTrend(period);

    return { aumTrend };
  }

  async getConversionFunnel(): Promise<FunnelResponse> {
    const conversionFunnel = await this.repository.getConversionFunnel();

    return { conversionFunnel };
  }

  async getInsights(): Promise<InsightsResponse> {
    const insights = await this.repository.getInsights();

    return { insights };
  }
}

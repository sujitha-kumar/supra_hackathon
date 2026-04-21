import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useAnalyticsDashboard = () =>
  useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsService.getDashboard(),
    retry: 1,
  });

export const useAUMTrend = (period = '1Y') =>
  useQuery({
    queryKey: ['analytics', 'aum-trend', period],
    queryFn: () => analyticsService.getAUMTrend(period),
    retry: 1,
  });

export const useFunnel = () =>
  useQuery({
    queryKey: ['analytics', 'funnel'],
    queryFn: () => analyticsService.getFunnel(),
    retry: 1,
  });

export const useInsights = () =>
  useQuery({
    queryKey: ['analytics', 'insights'],
    queryFn: () => analyticsService.getInsights(),
    retry: 1,
  });

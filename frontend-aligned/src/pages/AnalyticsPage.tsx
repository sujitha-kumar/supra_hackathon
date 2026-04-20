import React from 'react';
import { PageWrapper } from '../components/layout';
import { StatCard, InsightCard, AUMTrendChart, ConversionFunnel } from '../components/analytics';
import { CardSkeleton } from '../components/ui/Skeleton';
import {
  useAnalyticsDashboard,
  useAUMTrend,
  useFunnel,
  useInsights,
} from '../hooks/useAnalytics';

export const AnalyticsPage: React.FC = () => {
  const dashboard = useAnalyticsDashboard();
  const aumTrend = useAUMTrend();
  const funnel = useFunnel();
  const insights = useInsights();

  return (
    <PageWrapper title="Analytics" subtitle="Track your performance and insights">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dashboard.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : (dashboard.data?.stats ?? []).map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={stat.icon}
              />
            ))}
      </div>

      {/* Insights grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {insights.isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : (insights.data ?? []).map((insight) => (
              <InsightCard
                key={insight.id}
                title={insight.title}
                description={insight.description}
                type={insight.type}
                icon={insight.icon}
              />
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aumTrend.isLoading ? (
          <CardSkeleton />
        ) : (aumTrend.data ?? []).length > 0 ? (
          <AUMTrendChart data={aumTrend.data!} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center text-gray-500 text-sm">
            No AUM trend data available
          </div>
        )}

        {funnel.isLoading ? (
          <CardSkeleton />
        ) : (funnel.data ?? []).length > 0 ? (
          <ConversionFunnel data={funnel.data!} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center text-gray-500 text-sm">
            No funnel data available
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

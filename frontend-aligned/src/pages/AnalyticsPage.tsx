import React from 'react';
import { PageWrapper } from '../components/layout';
import { StatCard, InsightCard, AUMTrendChart, ConversionFunnel } from '../components/analytics';
import { mockAnalyticsData } from '../data/mockAnalytics';

export const AnalyticsPage: React.FC = () => {
  return (
    <PageWrapper
      title="Analytics"
      subtitle="Track your performance and insights"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {mockAnalyticsData.stats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {mockAnalyticsData.insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            type={insight.type}
            icon={insight.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AUMTrendChart data={mockAnalyticsData.aumTrend} />
        <ConversionFunnel data={mockAnalyticsData.conversionFunnel} />
      </div>
    </PageWrapper>
  );
};

import React from 'react';
import { Card } from '../ui';

export const AIContextPanel: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: 'High Priority Clients',
      description: '3 clients have overdue portfolio reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-danger',
      bgColor: 'bg-red-50',
    },
    {
      id: 2,
      title: 'Compliance Alerts',
      description: '2 KYC documents expiring this week',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-warning',
      bgColor: 'bg-orange-50',
    },
    {
      id: 3,
      title: 'Rebalancing Required',
      description: '5 portfolios need rebalancing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-brand',
      bgColor: 'bg-blue-50',
    },
  ];

  const suggestions = [
    'Review Sarah Johnson\'s portfolio allocation',
    'Update KYC for Lisa Anderson',
    'Schedule Q4 meetings with high-value clients',
    'Generate tax optimization reports',
  ];

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">AI Insights</h3>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-xl ${insight.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <div className={insight.color}>{insight.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Task Suggestions</h3>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </Card>

      <Card padding="md" className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-gray-700">
              Tasks linked to clients automatically appear in their profile and trigger relevant notifications.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

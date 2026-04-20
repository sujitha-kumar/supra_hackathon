import React from 'react';
import { Card, Badge } from '../ui';

export const RecommendedActions: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      title: 'Rebalance Portfolio',
      description: 'Equity allocation is 5% above target',
      priority: 'high' as const,
      dueDate: '2 days',
    },
    {
      id: 2,
      title: 'Review Tax Strategy',
      description: 'Optimize tax-loss harvesting opportunities',
      priority: 'medium' as const,
      dueDate: '1 week',
    },
    {
      id: 3,
      title: 'Quarterly Review',
      description: 'Schedule Q4 portfolio review meeting',
      priority: 'low' as const,
      dueDate: '2 weeks',
    },
  ];

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const variants = {
      high: 'danger' as const,
      medium: 'warning' as const,
      low: 'success' as const,
    };
    return <Badge variant={variants[priority]} size="sm">{priority}</Badge>;
  };

  return (
    <Card padding="md" className="bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-start gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          <p className="text-sm text-gray-600">Suggested next actions</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
              {getPriorityBadge(rec.priority)}
            </div>
            <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Due in {rec.dueDate}</span>
              <button className="text-xs text-brand hover:text-blue-700 font-medium">
                Take Action →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

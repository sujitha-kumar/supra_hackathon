import React from 'react';
import { PageWrapper } from '../components/layout';
import { Card, Badge } from '../components/ui';

export const HistoryPage: React.FC = () => {
  const historyItems = [
    { id: 1, action: 'Client Added', user: 'John Doe', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Task Completed', user: 'Jane Smith', time: '4 hours ago', type: 'success' },
    { id: 3, action: 'Project Updated', user: 'Mike Johnson', time: '6 hours ago', type: 'warning' },
    { id: 4, action: 'Client Removed', user: 'Sarah Wilson', time: '1 day ago', type: 'danger' },
    { id: 5, action: 'New Message', user: 'Tom Brown', time: '2 days ago', type: 'default' },
  ];

  return (
    <PageWrapper
      title="Activity History"
      subtitle="Track all actions and changes in your workspace"
    >
      <Card padding="md">
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-brand transition-colors"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{item.action}</h3>
                  <Badge variant={item.type as any}>{item.type}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  by {item.user} • {item.time}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
};

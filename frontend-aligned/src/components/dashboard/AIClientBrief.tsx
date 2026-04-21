import React from 'react';
import { Card } from '../ui';
import { useClients, useClientBrief } from '../../hooks/useClients';

export const AIClientBrief: React.FC = () => {
  // Use the first client from the live list so we always have a valid UUID
  const { data: clientsData } = useClients({ limit: 1 });
  const firstClientId = clientsData?.clients?.[0]?.id ?? null;
  const { data, isLoading, error } = useClientBrief(firstClientId);

  return (
    <Card padding="md" className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
          <p className="text-sm text-gray-600">Powered by intelligent analysis</p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        ) : error ? (
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-700">Failed to load AI insights.</p>
          </div>
        ) : data && data.insights.length > 0 ? (
          data.insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200"
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                insight.priority === 'high' ? 'bg-danger' :
                insight.priority === 'medium' ? 'bg-warning' :
                'bg-success'
              }`} />
              <p className="text-sm text-gray-700 flex-1">{insight.text}</p>
            </div>
          ))
        ) : (
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-700">No insights available.</p>
          </div>
        )}
      </div>

      <button className="mt-4 w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        View All Insights
      </button>
    </Card>
  );
};

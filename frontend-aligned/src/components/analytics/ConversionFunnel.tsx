import React from 'react';
import { Card } from '../ui';

interface ConversionFunnelProps {
  data: { stage: string; count: number; percentage: number }[];
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  return (
    <Card padding="md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Conversion Funnel</h3>
        <p className="text-sm text-gray-600">Client acquisition pipeline</p>
      </div>

      <div className="space-y-4">
        {data.map((stage, index) => {
          const isFirst = index === 0;
          const isLast = index === data.length - 1;
          
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm ${
                    isFirst ? 'bg-brand' : isLast ? 'bg-success' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{stage.count}</p>
                  <p className="text-xs text-gray-600">{stage.percentage}%</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isFirst ? 'bg-gradient-to-r from-brand to-blue-500' :
                      isLast ? 'bg-gradient-to-r from-success to-green-500' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>

              {index < data.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Conversion Rate</span>
          <span className="text-lg font-bold text-success">
            {data[data.length - 1].percentage}%
          </span>
        </div>
      </div>
    </Card>
  );
};

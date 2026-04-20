import React from 'react';
import { Card } from '../ui';

interface PerformanceData {
  month: string;
  value: number;
}

interface PortfolioPerformanceChartProps {
  data: PerformanceData[];
}

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  const formatValue = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
          <p className="text-sm text-gray-600">Last 10 months trend</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brand rounded-full"></div>
            <span className="text-sm text-gray-600">Portfolio Value</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-64">
        {data.map((item, index) => {
          const height = getBarHeight(item.value);
          const isLast = index === data.length - 1;
          
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex items-end justify-center h-48">
                <div className="relative w-full max-w-[40px] group">
                  <div
                    className={`w-full bg-gradient-to-t ${
                      isLast ? 'from-brand to-blue-500' : 'from-gray-300 to-gray-400'
                    } rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer`}
                    style={{ height: `${height}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatValue(item.value)}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(data[data.length - 1].value)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Growth</p>
          <p className="text-2xl font-bold text-success">
            +{formatValue(data[data.length - 1].value - data[0].value)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Change</p>
          <p className="text-2xl font-bold text-success">
            +{(((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  );
};

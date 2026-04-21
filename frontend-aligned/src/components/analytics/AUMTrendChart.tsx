import React from 'react';
import { Card } from '../ui';

interface AUMTrendChartProps {
  data: { month: string; value: number }[];
}

export const AUMTrendChart: React.FC<AUMTrendChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  const formatValue = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  return (
    <Card padding="md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">AUM Trend</h3>
        <p className="text-sm text-gray-600">Total assets under management over time</p>
      </div>

      <div className="flex items-end justify-between gap-2 h-64 mb-4">
        {data.map((item, index) => {
          const height = getBarHeight(item.value);
          const isLast = index === data.length - 1;
          
          return (
            <div key={`${item.month}-${index}`} className="flex-1 flex flex-col items-center gap-2">
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

      <div className="pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Current AUM</p>
          <p className="text-xl font-bold text-gray-900">{formatValue(data[data.length - 1].value)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Growth</p>
          <p className="text-xl font-bold text-success">
            +{formatValue(data[data.length - 1].value - data[0].value)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Change</p>
          <p className="text-xl font-bold text-success">
            +{(((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';
import { Card } from '../ui';

interface AllocationGridProps {
  allocations: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
}

export const AllocationGrid: React.FC<AllocationGridProps> = ({ allocations }) => {
  const allocationCards = [
    {
      label: 'Equity',
      percentage: allocations.equity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Debt',
      percentage: allocations.debt,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Gold',
      percentage: allocations.gold,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Cash',
      percentage: allocations.cash,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {allocationCards.map((card) => (
        <Card key={card.label} padding="md" className={card.bgColor}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">{card.label}</span>
            <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{card.percentage}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${card.percentage}%` }}
            />
          </div>
          <p className={`mt-2 text-xs ${card.textColor} font-medium`}>
            {card.percentage}% of portfolio
          </p>
        </Card>
      ))}
    </div>
  );
};

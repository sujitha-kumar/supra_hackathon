import React from 'react';
import { Card } from '../ui';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  icon: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description, type, icon }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          iconBg: 'bg-success',
          textColor: 'text-success',
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-50',
          iconBg: 'bg-warning',
          textColor: 'text-warning',
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          iconBg: 'bg-brand',
          textColor: 'text-brand',
        };
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'trending-up':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const config = getConfig();

  return (
    <Card padding="md" className={config.bgColor}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
          {getIcon()}
        </div>
        <div>
          <h3 className={`font-semibold ${config.textColor} mb-1`}>{title}</h3>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </Card>
  );
};

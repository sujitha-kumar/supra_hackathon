import React from 'react';
import { Card, Badge } from '../ui';

interface Holding {
  id: string;
  type: string;
  allocation: number;
  value: string;
  return: number;
}

export interface ClientContextData {
  name: string;
  company: string;
  status: 'active' | 'inactive' | 'pending' | 'overdue';
  risk: 'low' | 'medium' | 'high' | 'very-high';
  lastContact: string;
  projects: number;
}

export interface PortfolioContextData {
  holdings: Holding[];
  totalAUM: string;
  ytdReturn: number;
}

interface ClientContextPanelProps {
  client: ClientContextData;
  portfolio: PortfolioContextData;
}

export const ClientContextPanel: React.FC<ClientContextPanelProps> = ({ client, portfolio }) => {
  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 space-y-6 overflow-y-auto">
      <Card padding="md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-lg">{getInitials(client.name)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-600">{client.company}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <Badge variant={client.status === 'active' ? 'success' : 'default'} size="sm">
              {client.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Risk Level</span>
            <Badge
              variant={client.risk === 'low' ? 'success' : client.risk === 'medium' ? 'warning' : 'danger'}
              size="sm"
            >
              {client.risk}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Contact</span>
            <span className="text-gray-900">{client.lastContact}</span>
          </div>
        </div>
      </Card>

      <Card padding="md" className="bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-danger rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-danger mb-1">Compliance Alert</h4>
            <p className="text-sm text-gray-700">
              Portfolio rebalancing required. Equity allocation exceeds risk tolerance by 5%.
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <h4 className="font-semibold text-gray-900 mb-4">Holdings Snapshot</h4>
        <div className="space-y-3">
          {portfolio.holdings.slice(0, 3).map((holding) => (
            <div key={holding.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{holding.type}</p>
                <p className="text-xs text-gray-600">{holding.allocation}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{holding.value}</p>
                <p className={`text-xs font-medium ${holding.return >= 0 ? 'text-success' : 'text-danger'}`}>
                  {holding.return >= 0 ? '+' : ''}{holding.return}%
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-sm text-brand hover:text-blue-700 font-medium">
          View Full Portfolio →
        </button>
      </Card>

      <Card padding="md">
        <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total AUM</span>
            <span className="font-semibold text-gray-900">{portfolio.totalAUM}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">YTD Return</span>
            <span className={`font-semibold ${portfolio.ytdReturn >= 0 ? 'text-success' : 'text-danger'}`}>
              {portfolio.ytdReturn >= 0 ? '+' : ''}{portfolio.ytdReturn}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Tasks</span>
            <span className="font-semibold text-gray-900">{client.projects}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

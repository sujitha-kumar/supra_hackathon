import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Badge, Card, Button } from '../components/ui';
import { AllocationGrid, PortfolioPerformanceChart, QuickActions, RecommendedActions } from '../components/client';
import { extendedMockClients } from '../data/extendedMockClients';
import { mockPortfolioData } from '../data/mockPortfolio';

export const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'transactions' | 'notes'>('overview');

  const client = extendedMockClients.find(c => c.id === Number(id)) || extendedMockClients[0];
  const portfolio = mockPortfolioData;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      'low': { variant: 'success' as const, label: 'Low Risk' },
      'medium': { variant: 'warning' as const, label: 'Medium Risk' },
      'high': { variant: 'danger' as const, label: 'High Risk' },
      'very-high': { variant: 'danger' as const, label: 'Very High' },
    };
    const config = variants[riskLevel as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'holdings' as const, label: 'Holdings' },
    { id: 'transactions' as const, label: 'Transactions' },
    { id: 'notes' as const, label: 'Notes' },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-gray-600 hover:text-brand transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Clients
          </button>
        </div>

        <Card padding="lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {getInitials(client.name)}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                  <div className="flex items-center gap-2">
                    {client.tags.map((tag) => (
                      <Badge key={tag} variant="brand" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm">{client.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Last contact: {client.lastContact}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <Card padding="md" className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 min-w-[280px]">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total AUM</p>
                    <p className="text-3xl font-bold text-gray-900">{portfolio.totalAUM}</p>
                    <p className={`text-sm font-medium ${
                      portfolio.ytdReturn >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {portfolio.ytdReturn >= 0 ? '+' : ''}{portfolio.ytdReturn}% YTD
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Risk Score</p>
                      {getRiskBadge(portfolio.riskLevel)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-success via-warning to-danger h-2 rounded-full"
                        style={{ width: `${portfolio.riskScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{portfolio.riskScore}/100</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Copilot Brief</h3>
              <p className="text-gray-700 mb-4">
                {client.name} is a {client.tags.includes('Premium') ? 'premium' : 'valued'} client with strong portfolio performance. 
                Current allocation is well-balanced but consider rebalancing equity exposure. 
                Recommend scheduling a quarterly review to discuss tax optimization strategies and upcoming investment opportunities.
              </p>
              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm">
                  Generate Full Report
                </Button>
                <Button variant="secondary" size="sm">
                  Ask AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="border-b border-gray-200">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AllocationGrid allocations={portfolio.allocations} />
              <PortfolioPerformanceChart data={portfolio.performance} />
            </div>

            <div className="space-y-6">
              <QuickActions />
              <RecommendedActions />
            </div>
          </div>
        )}

        {activeTab === 'holdings' && (
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Holdings</h3>
            <div className="space-y-3">
              {portfolio.holdings.map((holding) => (
                <div
                  key={holding.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900">{holding.name}</p>
                    <p className="text-sm text-gray-600">{holding.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{holding.value}</p>
                    <p className={`text-sm font-medium ${
                      holding.return >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      {holding.return >= 0 ? '+' : ''}{holding.return}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{holding.allocation}% of portfolio</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {portfolio.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-green-100' :
                      transaction.type === 'sell' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        transaction.type === 'buy' ? 'text-success' :
                        transaction.type === 'sell' ? 'text-danger' :
                        'text-brand'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {transaction.type === 'buy' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        )}
                        {transaction.type === 'sell' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        )}
                        {transaction.type === 'dividend' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-600">{transaction.asset}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                  <Badge variant={transaction.status === 'completed' ? 'success' : 'warning'} size="sm">
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'notes' && (
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Client Notes</h3>
              <Button variant="primary" size="sm">
                Add Note
              </Button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Initial Consultation</p>
                  <span className="text-sm text-gray-500">2023-01-15</span>
                </div>
                <p className="text-sm text-gray-700">
                  Client expressed interest in balanced portfolio with moderate risk. Discussed long-term goals and retirement planning.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">Q2 Review</p>
                  <span className="text-sm text-gray-500">2023-06-20</span>
                </div>
                <p className="text-sm text-gray-700">
                  Portfolio performing well. Client satisfied with returns. Discussed potential rebalancing for Q3.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};

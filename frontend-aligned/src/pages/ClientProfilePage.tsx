import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Badge, Card, Button } from '../components/ui';
import { QuickActions, RecommendedActions, AllocationGrid, PortfolioPerformanceChart } from '../components/client';
import { useClientProfile, useClientPortfolio, useClientPerformance } from '../hooks/useClients';
import type { Client } from '../types/api';

export const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'transactions' | 'notes'>('overview');

  const { data: client, isLoading, error } = useClientProfile(Number(id));
  const { data: portfolio, isLoading: portfolioLoading } = useClientPortfolio(Number(id));
  const { data: performance, isLoading: performanceLoading } = useClientPerformance(Number(id));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRiskBadge = (riskProfile: Client['risk_profile']) => {
    const variants = {
      'Conservative': { variant: 'success' as const, label: 'Conservative' },
      'Moderate': { variant: 'warning' as const, label: 'Moderate' },
      'Aggressive': { variant: 'danger' as const, label: 'Aggressive' },
    };
    const config = variants[riskProfile];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading client profile...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !client) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600">{error instanceof Error ? error.message : 'Client not found'}</p>
            <Button className="mt-4" onClick={() => navigate('/clients')}>Back to Clients</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

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
                  <Badge variant="brand" size="sm">{client.segment}</Badge>
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
                    <span className="text-sm">PAN: {client.pan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Last contact: {formatDate(client.last_contacted_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <Card padding="md" className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 min-w-[280px]">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total AUM</p>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(client.total_aum)}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Risk Profile</p>
                      {getRiskBadge(client.risk_profile)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-success via-warning to-danger h-2 rounded-full"
                        style={{ width: `${client.risk_score * 10}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{client.risk_score}/10</p>
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
                {client.name} is a {client.segment} segment client with a {client.risk_profile.toLowerCase()} risk profile. 
                Current AUM: {formatCurrency(client.total_aum)}. Risk score: {client.risk_score}/10. 
                Recommend regular portfolio reviews and risk assessment updates.
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
              {portfolioLoading ? (
                <Card padding="md">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                  </div>
                </Card>
              ) : portfolio ? (
                <>
                  <AllocationGrid allocations={portfolio.allocations} />
                  {performanceLoading ? (
                    <Card padding="md">
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                      </div>
                    </Card>
                  ) : performance?.data && performance.data.length > 0 ? (
                    <PortfolioPerformanceChart data={performance.data} />
                  ) : (
                    <Card padding="md">
                      <p className="text-gray-600">No performance data available</p>
                    </Card>
                  )}
                </>
              ) : (
                <Card padding="md">
                  <p className="text-gray-600">No portfolio data available</p>
                </Card>
              )}
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
              <p className="text-gray-600">Holdings data will be loaded from separate endpoint.</p>
            </div>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              <p className="text-gray-600">Transactions data will be loaded from separate endpoint.</p>
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

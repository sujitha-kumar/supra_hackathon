import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Button } from '../components/ui';
import { QuickActionsPanel, AIClientBrief } from '../components/dashboard';
import { useClients } from '../hooks/useClients';
import type { Client } from '../types/api';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Map filter → risk_profile for the new schema
  const riskProfileMap: Record<string, string | undefined> = {
    all: undefined,
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    aggressive: 'Aggressive',
  };

  const { data: clientsData, isLoading } = useClients({
    limit: 10,
    risk_profile: riskProfileMap[activeFilter],
    search: searchQuery.trim().length >= 2 ? searchQuery.trim() : undefined,
  });

  const clients = clientsData?.clients || [];

  const filters = [
    { id: 'all',        label: 'All Clients' },
    { id: 'low',        label: 'Low Risk' },
    { id: 'moderate',   label: 'Moderate' },
    { id: 'high',       label: 'High Risk' },
    { id: 'aggressive', label: 'Aggressive' },
  ];

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAskAI = () => {
    const query = searchQuery.trim();
    if (!query) return;

    const normalized = query.toLowerCase();
    const isClientsIntent =
      normalized === 'clients' ||
      normalized.startsWith('clients ') ||
      normalized.includes(' clients ');

    if (isClientsIntent) {
      navigate('/chat', { state: { initialQuery: query, intent: 'clients' } });
      return;
    }

    navigate('/chat', { state: { initialQuery: query } });
  };

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCurrentGreeting()}, Welcome back!
          </h1>
          <p className="text-gray-600 mb-6">
            Manage your clients and track your progress
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search clients, projects, or tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
                className="w-full px-6 py-4 pl-12 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all text-lg"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button variant="primary" size="lg" className="px-8" onClick={handleAskAI}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ask AI
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-brand hover:text-brand'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
                <button
                  className="text-sm text-brand hover:text-blue-700 font-medium"
                  onClick={() => navigate('/clients')}
                >
                  View all →
                </button>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              ) : clients.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">No clients found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-sm font-medium text-gray-600">Client</th>
                        <th className="text-left py-3 px-3 text-sm font-medium text-gray-600">Risk</th>
                        <th className="text-left py-3 px-3 text-sm font-medium text-gray-600">AUM</th>
                        <th className="text-left py-3 px-3 text-sm font-medium text-gray-600">1Y Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client: Client) => {
                        const riskColor =
                          client.risk_profile === 'Low' ? 'text-green-600' :
                          client.risk_profile === 'Moderate' ? 'text-yellow-600' :
                          client.risk_profile === 'High' ? 'text-orange-600' : 'text-red-600';
                        const ret1y = client.performance?.return_1y;
                        const retColor = ret1y !== undefined ? (ret1y >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500';
                        return (
                          <tr
                            key={client.id}
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-brand to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-semibold text-xs">
                                    {client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                                  <p className="text-xs text-gray-500">{client.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-sm font-medium ${riskColor}`}>{client.risk_profile}</span>
                            </td>
                            <td className="py-3 px-3">
                              <p className="text-sm font-semibold text-gray-900">
                                {client.total_aum >= 10_000_000
                                  ? `₹${(client.total_aum / 10_000_000).toFixed(1)}Cr`
                                  : `₹${(client.total_aum / 100_000).toFixed(1)}L`}
                              </p>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-sm font-medium ${retColor}`}>
                                {ret1y !== undefined ? `${ret1y > 0 ? '+' : ''}${ret1y}%` : '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <QuickActionsPanel />
            <AIClientBrief />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

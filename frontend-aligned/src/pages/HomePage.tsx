import React, { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { Button } from '../components/ui';
import { RecentClientsTable, QuickActionsPanel, AIClientBrief } from '../components/dashboard';
import { mockClients } from '../data/mockClients';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All Clients' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'inactive', label: 'Inactive' },
  ];

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
            <Button variant="primary" size="lg" className="px-8">
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
            <RecentClientsTable clients={mockClients} />
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

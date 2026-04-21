import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Button, Badge, Card, DataTable, Pagination } from '../components/ui';
import { useClients } from '../hooks/useClients';
import type { Client } from '../types/api';

export const ClientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const queryParams = useMemo(() => ({
    search: searchQuery || undefined,
    segment: segmentFilter !== 'all' ? segmentFilter : undefined,
    risk_profile: riskFilter !== 'all' ? riskFilter : undefined,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  }), [searchQuery, segmentFilter, riskFilter, currentPage]);

  const { data, isLoading, error } = useClients(queryParams);

  const clients = data?.clients || [];
  const totalClients = data?.total || 0;
  const totalPages = Math.ceil(totalClients / itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRiskBadge = (risk: Client['risk_profile']) => {
    const normalizedRisk = String(risk || '').toLowerCase();
    if (normalizedRisk === 'low')         return <Badge variant="success" size="sm">Low</Badge>;
    if (normalizedRisk === 'high')        return <Badge variant="warning" size="sm">High</Badge>;
    if (normalizedRisk === 'aggressive')  return <Badge variant="danger" size="sm">Aggressive</Badge>;
    return <Badge variant="warning" size="sm">Moderate</Badge>;
  };

  const getSegmentBadge = (segment: Client['segment']) => {
    const variants = {
      'Retail': { variant: 'default' as const, label: 'Retail' },
      'HNI': { variant: 'brand' as const, label: 'HNI' },
      'UHNI': { variant: 'success' as const, label: 'UHNI' },
    };
    const normalizedSegment = String(segment || '').toUpperCase();
    const config =
      normalizedSegment === 'RETAIL'
        ? variants.Retail
        : normalizedSegment === 'UHNI'
          ? variants.UHNI
          : variants.HNI;
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
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

  const columns = [
    {
      key: 'name' as const,
      header: 'Client',
      width: '20%',
      render: (client: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {getInitials(client.name)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{client.name}</p>
            <p className="text-sm text-gray-500">{client.email || client.pan}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      width: '15%',
      render: (client) => (
        <div>
          <p className="text-gray-900">{client.segment}</p>
          <p className="text-sm text-gray-500">Score: {client.risk_score}/10</p>
        </div>
      ),
    },
    {
      key: 'aum',
      header: 'AUM',
      width: '12%',
      render: (client) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(client.total_aum)}</p>
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'Risk Profile',
      width: '12%',
      render: (client) => getRiskBadge(client.risk_profile),
    },
    {
      key: 'segment',
      header: 'Segment',
      width: '10%',
      render: (client) => getSegmentBadge(client.segment),
    },
    {
      key: 'lastContact',
      header: 'Last Contact',
      width: '12%',
      render: (client) => (
        <p className="text-gray-600 text-sm">{formatDate(client.last_contacted_at)}</p>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '10%',
      align: 'right',
      render: (client) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${client.client_id}`);
            }}
            className="p-2 text-gray-600 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit client:', client.client_id);
            }}
            className="p-2 text-gray-600 hover:text-brand hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-5 w-96 animate-pulse rounded bg-gray-100" />

          <div className="flex items-center gap-4">
            <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <Card padding="sm">
            <div className="space-y-3 p-2">
              <div className="grid grid-cols-6 gap-4 border-b border-gray-100 pb-3">
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 animate-pulse rounded bg-gray-200" />
              </div>

              {['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6'].map((rowKey) => (
                <div key={rowKey} className="grid grid-cols-6 items-center gap-4 rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-28 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="ml-auto h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Clients</h2>
            <p className="text-gray-600">{error instanceof Error ? error.message : 'Failed to load clients'}</p>
            <Button className="mt-4" onClick={() => globalThis.location.reload()}>Retry</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const handleExport = () => {
    console.log('Exporting clients data...');
  };

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients Directory</h1>
            <p className="text-gray-600 mt-1">Manage and track all your client relationships</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleExport}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
            <Button variant="primary" onClick={handleAddClient}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Client
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, company, or PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
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

          <select
            value={segmentFilter}
            onChange={(e) => {
              setSegmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all bg-white"
          >
            <option value="all">All Segments</option>
            <option value="Retail">Retail</option>
            <option value="HNI">HNI</option>
            <option value="UHNI">UHNI</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all bg-white"
          >
            <option value="all">All Risk Profiles</option>
            <option value="Conservative">Conservative</option>
            <option value="Moderate">Moderate</option>
            <option value="Aggressive">Aggressive</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {clients.length} of {totalClients} clients
          </p>
        </div>

        <Card padding="sm">
          <DataTable
            columns={columns as any}
            data={clients as any}
            onRowClick={(client: any) => navigate(`/clients/${client.client_id}`)}
            emptyMessage="No clients found matching your criteria"
          />
          
          {totalClients > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalClients}
              itemsPerPage={itemsPerPage}
            />
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

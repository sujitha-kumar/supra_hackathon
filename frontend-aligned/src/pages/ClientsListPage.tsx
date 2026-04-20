import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Button, Badge, Card, DataTable, Pagination } from '../components/ui';
import type { Column } from '../components/ui';
import { extendedMockClients } from '../data/extendedMockClients';
import type { ExtendedClient } from '../data/extendedMockClients';

export const ClientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const savedViews = [
    { id: 'all', label: 'All Clients', count: extendedMockClients.length },
    { id: 'active', label: 'Active', count: extendedMockClients.filter(c => c.status === 'active').length },
    { id: 'overdue', label: 'Overdue', count: extendedMockClients.filter(c => c.status === 'overdue').length },
    { id: 'premium', label: 'Premium', count: extendedMockClients.filter(c => c.tags.includes('Premium')).length },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRiskBadge = (risk: ExtendedClient['risk']) => {
    const variants = {
      'low': { variant: 'success' as const, label: 'Low Risk' },
      'medium': { variant: 'warning' as const, label: 'Medium' },
      'high': { variant: 'danger' as const, label: 'High Risk' },
      'very-high': { variant: 'danger' as const, label: 'Very High' },
    };
    const config = variants[risk];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getStatusBadge = (status: ExtendedClient['status']) => {
    const variants = {
      'active': { variant: 'success' as const, label: 'Active' },
      'pending': { variant: 'warning' as const, label: 'Pending' },
      'inactive': { variant: 'default' as const, label: 'Inactive' },
      'overdue': { variant: 'danger' as const, label: 'Overdue' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const columns: Column<ExtendedClient>[] = [
    {
      key: 'name',
      header: 'Client',
      width: '20%',
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {getInitials(client.name)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{client.name}</p>
            <p className="text-sm text-gray-500">PAN: {client.pan}</p>
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
          <p className="text-gray-900">{client.company}</p>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>
      ),
    },
    {
      key: 'aum',
      header: 'AUM',
      width: '12%',
      render: (client) => (
        <div>
          <p className="font-semibold text-gray-900">{client.aum}</p>
          <p className={`text-sm font-medium ${
            client.ytd >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {client.ytd >= 0 ? '+' : ''}{client.ytd}% YTD
          </p>
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'Risk Profile',
      width: '12%',
      render: (client) => getRiskBadge(client.risk),
    },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      render: (client) => getStatusBadge(client.status),
    },
    {
      key: 'lastContact',
      header: 'Last Contact',
      width: '12%',
      render: (client) => (
        <p className="text-gray-600 text-sm">{client.lastContact}</p>
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
              navigate(`/clients/${client.id}`);
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
              console.log('Edit client:', client.id);
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

  const filteredClients = extendedMockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || client.risk === riskFilter;
    
    const matchesView = 
      activeView === 'all' ||
      (activeView === 'active' && client.status === 'active') ||
      (activeView === 'overdue' && client.status === 'overdue') ||
      (activeView === 'premium' && client.tags.includes('Premium'));

    return matchesSearch && matchesStatus && matchesRisk && matchesView;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all bg-white"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="very-high">Very High Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {savedViews.map((view) => (
            <button
              key={view.id}
              onClick={() => {
                setActiveView(view.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeView === view.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-brand hover:text-brand'
              }`}
            >
              {view.label}
              <span className={`ml-2 ${
                activeView === view.id ? 'text-blue-200' : 'text-gray-500'
              }`}>
                ({view.count})
              </span>
            </button>
          ))}
        </div>

        <Card padding="sm">
          <DataTable
            columns={columns}
            data={paginatedClients}
            onRowClick={(client) => navigate(`/clients/${client.id}`)}
            rowClassName={(client) =>
              client.status === 'overdue' ? 'bg-red-50 hover:bg-red-100' : ''
            }
            emptyMessage="No clients found matching your criteria"
          />
          
          {filteredClients.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredClients.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

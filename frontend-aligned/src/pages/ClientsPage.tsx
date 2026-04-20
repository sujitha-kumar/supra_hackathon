import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Card, Button, Badge, Input } from '../components/ui';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();

  const clients = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', status: 'active', projects: 5 },
    { id: 2, name: 'TechStart Inc', email: 'hello@techstart.com', status: 'active', projects: 3 },
    { id: 3, name: 'Global Solutions', email: 'info@global.com', status: 'inactive', projects: 8 },
    { id: 4, name: 'Innovation Labs', email: 'team@innovation.com', status: 'active', projects: 2 },
  ];

  return (
    <PageWrapper
      title="Clients"
      subtitle="Manage your client relationships"
      actions={
        <Button variant="primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Button>
      }
    >
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input placeholder="Search clients..." />
          </div>
          <Button variant="secondary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            padding="md"
            hover
            className="cursor-pointer"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {client.name.charAt(0)}
                </span>
              </div>
              <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                {client.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{client.email}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{client.projects} projects</span>
              <span className="text-brand font-medium">View details →</span>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
};

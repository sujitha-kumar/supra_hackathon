import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card } from '../ui';
import type { Client } from '../../data/mockClients';

interface RecentClientsTableProps {
  clients: Client[];
}

export const RecentClientsTable: React.FC<RecentClientsTableProps> = ({ clients }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm">Active</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'inactive':
        return <Badge variant="default" size="sm">Inactive</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
        <button className="text-sm text-brand hover:text-blue-700 font-medium">
          View all →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Client</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Contact</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Projects</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(client.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-900">{client.company}</p>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(client.status)}
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-600">{client.lastContact}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-gray-900">{client.revenue}</p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-gray-600">{client.projects}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

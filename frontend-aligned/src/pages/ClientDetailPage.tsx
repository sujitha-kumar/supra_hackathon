import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';

export const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <PageWrapper
      title="Client Details"
      subtitle={`Viewing information for client #${id}`}
      actions={
        <>
          <Button variant="secondary" onClick={() => navigate('/clients')}>
            Back to Clients
          </Button>
          <Button variant="primary">Edit Client</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Company Name</p>
                <p className="font-medium text-gray-900">Acme Corporation</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge variant="success">Active</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">contact@acme.com</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200 hover:border-brand transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Project {i}</h3>
                    <Badge variant="brand">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Started on Jan {i}, 2024</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$24,500</p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Person</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">CEO</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              Send Message
            </Button>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

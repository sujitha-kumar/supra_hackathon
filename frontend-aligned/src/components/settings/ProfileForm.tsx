import React, { useState } from 'react';
import { Card, Input, Button } from '../ui';

export const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Wealth Management Inc.',
    role: 'Senior Advisor',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
  };

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-sm text-gray-600">Manage your personal information and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-brand to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{formData.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{formData.email}</p>
            <Button variant="secondary" size="sm">
              Change Photo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Input
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

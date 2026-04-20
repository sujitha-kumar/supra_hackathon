import React from 'react';
import { Button, Input } from '../ui';
import { ClientSearchInput } from './ClientSearchInput';

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  clientName: string;
  tags: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onChange: (field: keyof TaskFormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title <span className="text-danger">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Enter task title..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe the task in detail..."
          rows={4}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority <span className="text-danger">*</span>
          </label>
          <select
            value={formData.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => onChange('dueDate', e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
      </div>

      <ClientSearchInput
        value={formData.clientName}
        onChange={(value) => onChange('clientName', value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags <span className="text-gray-400">(comma-separated)</span>
        </label>
        <Input
          value={formData.tags}
          onChange={(e) => onChange('tags', e.target.value)}
          placeholder="e.g., Compliance, Review, Portfolio"
        />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button variant="primary" onClick={onSubmit} className="flex-1">
          Create Task
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

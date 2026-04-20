import React from 'react';
import { Button } from '../ui';

interface TasksToolbarProps {
  onCreateTask: () => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export const TasksToolbar: React.FC<TasksToolbarProps> = ({
  onCreateTask,
  filterStatus,
  onFilterChange,
}) => {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === filter.id
                ? 'bg-brand text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-brand hover:text-brand'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Button variant="primary" onClick={onCreateTask}>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Task
      </Button>
    </div>
  );
};

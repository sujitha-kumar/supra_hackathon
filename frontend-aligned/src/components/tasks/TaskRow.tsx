import React from 'react';
import { Badge } from '../ui';
import type { Task } from '../../types/task';

interface TaskRowProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onToggleComplete }) => {
  const isOverdue = task.dueDate < new Date() && task.status !== 'completed';
  const isToday = task.dueDate.toDateString() === new Date().toDateString();

  const getPriorityBadge = () => {
    const variants = {
      urgent: { variant: 'danger' as const, label: 'Urgent' },
      high: { variant: 'warning' as const, label: 'High' },
      medium: { variant: 'default' as const, label: 'Medium' },
      low: { variant: 'success' as const, label: 'Low' },
    };
    const config = variants[task.priority];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getStatusBadge = () => {
    const variants = {
      pending: { variant: 'default' as const, label: 'Pending' },
      'in-progress': { variant: 'brand' as const, label: 'In Progress' },
      completed: { variant: 'success' as const, label: 'Completed' },
    };
    const config = variants[task.status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const formatDueDate = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (isToday) return 'Today';
    return task.dueDate.toLocaleDateString('en-US', options);
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        task.status === 'completed'
          ? 'bg-gray-50 border-gray-200 opacity-60'
          : isOverdue
          ? 'bg-red-50 border-red-200 hover:shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggleComplete(task.id)}
        className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3 mb-2">
          <h3
            className={`font-medium ${
              task.status === 'completed'
                ? 'text-gray-500 line-through'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {task.clientName && (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {task.clientName}
            </span>
          )}
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {getPriorityBadge()}
        {getStatusBadge()}
        <div
          className={`text-sm font-medium min-w-[80px] text-right ${
            isOverdue ? 'text-danger' : isToday ? 'text-warning' : 'text-gray-600'
          }`}
        >
          {formatDueDate()}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TaskRow } from './TaskRow';
import type { Task } from '../../types/task';

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  onToggleComplete: (taskId: string) => void;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({ title, tasks, icon, onToggleComplete }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-600">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggleComplete={onToggleComplete} />
        ))}
      </div>
    </div>
  );
};

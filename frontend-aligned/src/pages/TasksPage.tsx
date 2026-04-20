import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { TasksToolbar, TaskGroup } from '../components/tasks';
import { ListSkeleton } from '../components/ui/Skeleton';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const { tasks, isLoading, isError, toggleTask } = useTasks();

  const handleToggleComplete = (taskId: string) => {
    toggleTask(taskId);
  };

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  const filteredTasks = tasks.filter((task: Task) => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const overdueTasks = filteredTasks.filter(
    (task) => {
      const d = new Date(task.dueDate);
      d.setHours(0, 0, 0, 0);
      return d < today && task.status !== 'completed';
    }
  );

  const todayTasks = filteredTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const tomorrowTasks = filteredTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === tomorrow.getTime();
  });

  const upcomingTasks = filteredTasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() > tomorrow.getTime();
  });

  return (
    <PageWrapper title="Tasks" subtitle="Manage your tasks and to-dos">
      <TasksToolbar
        onCreateTask={handleCreateTask}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {isLoading && <ListSkeleton items={4} />}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load tasks. Please refresh the page.
        </div>
      )}

      {!isLoading && !isError && (
        <div>
          <TaskGroup
            title="Overdue"
            tasks={overdueTasks}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onToggleComplete={handleToggleComplete}
          />

          <TaskGroup
            title="Today"
            tasks={todayTasks}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            onToggleComplete={handleToggleComplete}
          />

          <TaskGroup
            title="Tomorrow"
            tasks={tomorrowTasks}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            }
            onToggleComplete={handleToggleComplete}
          />

          <TaskGroup
            title="Upcoming"
            tasks={upcomingTasks}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            onToggleComplete={handleToggleComplete}
          />

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all'
                  ? 'Create your first task to get started'
                  : `No ${filterStatus} tasks at the moment`}
              </p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

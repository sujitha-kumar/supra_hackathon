import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { useTaskStore } from '../store';
import type { Task } from '../types/task';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { setTasks, setLoading, setError } = useTaskStore();

  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      setLoading(true);
      try {
        const tasks = await taskService.getAll();
        setTasks(tasks);
        return tasks;
      } catch (error) {
        setError('Failed to fetch tasks');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => taskService.create(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => taskService.toggleComplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    toggleTask: toggleMutation.mutate,
    deleteTask: deleteMutation.mutate,
  };
};

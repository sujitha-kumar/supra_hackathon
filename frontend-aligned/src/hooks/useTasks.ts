import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAll(),
    retry: 2,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => taskService.toggleComplete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        (old ?? []).map((t) =>
          t.id === id
            ? { ...t, status: t.status === 'completed' ? 'pending' : ('completed' as Task['status']) }
            : t
        )
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        (old ?? []).filter((t) => t.id !== id)
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    toggleTask: (id: string) => toggleMutation.mutate(id),
    deleteTask: (id: string) => deleteMutation.mutate(id),
    isToggling: toggleMutation.isPending,
  };
};

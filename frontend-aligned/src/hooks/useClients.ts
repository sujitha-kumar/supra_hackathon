import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService, type Client } from '../services/clientService';
import { useClientStore } from '../store';

export const useClients = () => {
  const queryClient = useQueryClient();
  const { setClients, setLoading, setError } = useClientStore();

  const query = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      setLoading(true);
      try {
        const clients = await clientService.getAll();
        setClients(clients);
        return clients;
      } catch (error) {
        setError('Failed to fetch clients');
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (client: Omit<Client, 'id'>) => clientService.create(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Client> }) =>
      clientService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  return {
    clients: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
  };
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getById(id),
    enabled: !!id,
  });
};

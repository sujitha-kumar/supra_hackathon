import { useQuery } from '@tanstack/react-query';
import { clientService, type ClientsQueryParams } from '../services/clientService';

export const useClients = (params?: ClientsQueryParams) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getAll(params),
    staleTime: 30000,
    gcTime: 30000,
  });
};

export const useClient = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getById(id!),
    enabled: !!id,
    staleTime: 60000,
    gcTime: 60000,
  });
};

export const useClientProfile = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['client', id, 'profile'],
    queryFn: () => clientService.getProfile(id!),
    enabled: !!id,
    staleTime: 60000,
    gcTime: 60000,
  });
};

export const useClientPortfolio = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['client', id, 'portfolio'],
    queryFn: () => clientService.getPortfolio(id!),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useClientPerformance = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['client', id, 'performance'],
    queryFn: () => clientService.getPerformance(id!),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useClientInteractions = (id: string | null | undefined, limit: number = 10) => {
  return useQuery({
    queryKey: ['client', id, 'interactions', limit],
    queryFn: () => clientService.getInteractions(id!, limit),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useClientBrief = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['client', id, 'brief'],
    queryFn: () => clientService.getBrief(id!),
    enabled: !!id,
    staleTime: 30000,
  });
};

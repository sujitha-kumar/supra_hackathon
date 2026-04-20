import { create } from 'zustand';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  aum: number;
  riskTolerance: string;
}

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  setClients: (clients: Client[]) => void;
  setSelectedClient: (client: Client | null) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  setClients: (clients) => set({ clients }),

  setSelectedClient: (client) => set({ selectedClient: client }),

  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
    })),

  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      ),
      selectedClient:
        state.selectedClient?.id === id
          ? { ...state.selectedClient, ...updates }
          : state.selectedClient,
    })),

  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
      selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));

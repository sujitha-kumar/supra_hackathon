# Backend Integration Guide

## Quick Start

### 1. Install and Run Backend

```bash
cd backend-ts
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Update Frontend API Client

In your frontend `src/lib/axios.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### 3. Test Connection

Visit `http://localhost:3001/health` - should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Frontend Service Updates

### Client Service

Replace mock data in `src/services/clientService.ts`:

```typescript
import api from '../lib/axios';
import { Client, PortfolioOverview } from '../types';

export const clientService = {
  async getClients(params?: {
    segment?: string;
    risk_profile?: string;
    search?: string;
  }) {
    const { data } = await api.get('/clients', { params });
    return data;
  },

  async getClientById(id: number) {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  async getClientPortfolio(id: number) {
    const { data } = await api.get(`/clients/${id}/portfolio`);
    return data;
  },

  async getClientBrief(id: number) {
    const { data } = await api.get(`/clients/${id}/brief`);
    return data;
  },
};
```

### Task Service

Replace mock data in `src/services/taskService.ts`:

```typescript
import api from '../lib/axios';

export const taskService = {
  async getTasks(params?: {
    status?: string;
    priority?: string;
    client_id?: number;
  }) {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  async createTask(taskData: {
    title: string;
    description: string;
    priority: string;
    due_date: string;
    client_id?: number;
  }) {
    const { data } = await api.post('/tasks', taskData);
    return data;
  },

  async toggleTask(id: string) {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data;
  },

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  },
};
```

### Chat Service

Replace mock AI in `src/services/chatService.ts`:

```typescript
import api from '../lib/axios';

export const chatService = {
  async createSession(clientId?: number) {
    const { data } = await api.post('/chat/sessions', {
      client_id: clientId,
    });
    return data;
  },

  async getSessions() {
    const { data } = await api.get('/chat/sessions');
    return data;
  },

  async getMessages(sessionId: string) {
    const { data } = await api.get(`/chat/sessions/${sessionId}/messages`);
    return data;
  },

  async sendMessage(sessionId: string, message: string, clientId?: number) {
    const { data } = await api.post('/chat/message', {
      session_id: sessionId,
      message,
      client_id: clientId,
    });
    return data;
  },
};
```

### Analytics Service

Replace mock data in `src/services/analyticsService.ts`:

```typescript
import api from '../lib/axios';

export const analyticsService = {
  async getDashboard() {
    const { data } = await api.get('/analytics/dashboard');
    return data;
  },

  async getAUMTrend(period: '6M' | '1Y' | 'ALL' = '1Y') {
    const { data } = await api.get('/analytics/aum-trend', {
      params: { period },
    });
    return data;
  },

  async getFunnel() {
    const { data } = await api.get('/analytics/funnel');
    return data;
  },

  async getInsights() {
    const { data } = await api.get('/analytics/insights');
    return data;
  },
};
```

## React Query Hooks

Update your hooks to use real API:

### useClients Hook

```typescript
import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';

export function useClients(params?: {
  segment?: string;
  risk_profile?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getClients(params),
  });
}

export function useClient(id: number) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
  });
}
```

### useTasks Hook

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export function useTasks(params?: {
  status?: string;
  priority?: string;
}) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getTasks(params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => taskService.toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

## Error Handling

Add global error interceptor in `src/lib/axios.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { error: message, code } = error.response.data;
      console.error(`API Error [${code}]:`, message);
      
      // Handle specific error codes
      if (code === 'UNAUTHORIZED') {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Testing Backend

### Test Clients API

```bash
curl http://localhost:3001/api/clients
```

### Test Tasks API

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test",
    "priority": "medium",
    "due_date": "2024-12-31"
  }'
```

### Test Chat API

```bash
# Create session
curl -X POST http://localhost:3001/api/chat/sessions \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Chat"}'

# Send message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-id-here",
    "message": "What are the market trends?"
  }'
```

## Migration Checklist

- [ ] Backend running on port 3001
- [ ] Frontend axios configured
- [ ] Client service updated
- [ ] Task service updated
- [ ] Chat service updated
- [ ] Analytics service updated
- [ ] React Query hooks updated
- [ ] Error handling added
- [ ] All pages tested
- [ ] Mock data removed

## Common Issues

### CORS Error
- Ensure `CORS_ORIGIN` in `.env` matches frontend URL
- Default: `http://localhost:5173`

### 404 Errors
- Check API base URL in axios config
- Verify backend is running on port 3001

### Type Mismatches
- Backend types match frontend exactly
- Check `API_CONTRACTS.md` for response formats

### Gemini API Errors
- Verify `GEMINI_API_KEY` is set
- Check API quota and billing

### Supabase Errors
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check database tables exist
- Verify RLS policies if enabled

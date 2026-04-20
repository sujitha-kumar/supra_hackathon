# Installation Guide

## Required Dependencies

Install the following packages for state management and API integration:

```bash
npm install zustand axios @tanstack/react-query
```

### Package Descriptions:

- **zustand**: Lightweight state management library
- **axios**: HTTP client for API requests
- **@tanstack/react-query**: Data fetching and caching library

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3001/api
```

## Usage

### Zustand Stores

```typescript
import { useAuthStore, useClientStore, useChatStore, useTaskStore } from './store';

// In your component
const { user, login, logout } = useAuthStore();
const { clients, addClient } = useClientStore();
const { messages, sendMessage } = useChatStore();
const { tasks, toggleTaskComplete } = useTaskStore();
```

### React Query Hooks

```typescript
import { useClients, useTasks } from './hooks';

// In your component
const { clients, isLoading, createClient } = useClients();
const { tasks, toggleTask } = useTasks();
```

### API Services

```typescript
import { clientService, chatService, taskService } from './services';

// Direct API calls
const clients = await clientService.getAll();
const response = await chatService.sendMessage({ message: 'Hello' });
const tasks = await taskService.getAll();
```

## Next Steps

1. Install dependencies: `npm install zustand axios @tanstack/react-query`
2. Set up environment variables
3. Connect to backend API
4. Replace mock data with API calls
5. Integrate AI service for chat functionality

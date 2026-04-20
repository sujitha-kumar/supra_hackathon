# API Contracts - TypeScript Backend

**Strict Contract Lock** - All endpoints must match these exact specifications.

---

## 1. Clients API

### GET /api/clients
**Description:** Get all clients with optional filtering

**Query Parameters:**
```typescript
{
  segment?: string;           // Filter by segment
  risk_profile?: 'low' | 'medium' | 'high' | 'very-high';
  search?: string;            // Search by name, email, or PAN
  limit?: number;             // Default: 50
  offset?: number;            // Default: 0
}
```

**Response:** `200 OK`
```typescript
{
  clients: Array<{
    id: number;
    name: string;
    pan: string;
    company: string;
    email: string;
    phone: string;
    aum: string;              // Formatted: "$2,450,000"
    ytd: number;              // Percentage: 12.5
    risk: 'low' | 'medium' | 'high' | 'very-high';
    status: 'active' | 'inactive' | 'pending' | 'overdue';
    lastContact: string;      // Relative time: "2 hours ago"
    projects: number;
    joinDate: string;         // ISO date: "2023-01-15"
    tags: string[];
  }>;
  total: number;
  limit: number;
  offset: number;
}
```

---

### GET /api/clients/:id
**Description:** Get single client profile

**Response:** `200 OK`
```typescript
{
  id: number;
  name: string;
  pan: string;
  company: string;
  email: string;
  phone: string;
  aum: string;
  ytd: number;
  risk: 'low' | 'medium' | 'high' | 'very-high';
  status: 'active' | 'inactive' | 'pending' | 'overdue';
  lastContact: string;
  projects: number;
  joinDate: string;
  tags: string[];
}
```

**Error:** `404 Not Found`
```typescript
{
  error: "Client not found";
  code: "CLIENT_NOT_FOUND";
}
```

---

### GET /api/clients/:id/profile
**Description:** Get detailed client profile (same as GET /api/clients/:id)

**Response:** Same as GET /api/clients/:id

---

### GET /api/clients/:id/portfolio
**Description:** Get client portfolio overview

**Response:** `200 OK`
```typescript
{
  totalAUM: string;           // "$2,450,000"
  ytdReturn: number;          // 12.5
  riskScore: number;          // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'very-high';
  allocations: {
    equity: number;           // Percentage: 55
    debt: number;             // 30
    gold: number;             // 10
    cash: number;             // 5
  };
}
```

---

### GET /api/clients/:id/holdings
**Description:** Get client portfolio holdings

**Response:** `200 OK`
```typescript
{
  holdings: Array<{
    id: number;
    name: string;
    type: string;             // "Equity", "Debt", "Gold", "Cash"
    value: string;            // "$500,000"
    allocation: number;       // Percentage: 20.4
    return: number;           // Percentage: 8.5
  }>;
}
```

---

### GET /api/clients/:id/performance
**Description:** Get portfolio performance chart data

**Query Parameters:**
```typescript
{
  period?: '6M' | '1Y' | 'ALL';  // Default: '1Y'
}
```

**Response:** `200 OK`
```typescript
{
  performance: Array<{
    month: string;            // "Jan", "Feb", etc.
    value: number;            // Absolute value: 2100000
  }>;
}
```

---

### GET /api/clients/:id/transactions
**Description:** Get client transaction history

**Query Parameters:**
```typescript
{
  limit?: number;             // Default: 10
  offset?: number;            // Default: 0
}
```

**Response:** `200 OK`
```typescript
{
  transactions: Array<{
    id: number;
    date: string;             // ISO date: "2024-01-15"
    type: 'buy' | 'sell' | 'dividend';
    asset: string;
    amount: string;           // "$50,000"
    status: 'completed' | 'pending';
  }>;
  total: number;
}
```

---

### GET /api/clients/:id/interactions
**Description:** Get client interaction history

**Query Parameters:**
```typescript
{
  limit?: number;             // Default: 5
}
```

**Response:** `200 OK`
```typescript
{
  interactions: Array<{
    id: number;
    date: string;             // ISO date
    type: 'call' | 'email' | 'meeting' | 'chat';
    summary: string;
    duration?: string;        // "30 mins"
  }>;
}
```

---

### GET /api/clients/:id/brief
**Description:** Get AI-generated client brief

**Response:** `200 OK`
```typescript
{
  clientId: number;
  clientName: string;
  brief: string;              // AI-generated summary
  keyPoints: string[];
  riskFactors: string[];
  opportunities: string[];
  generatedAt: string;        // ISO timestamp
}
```

---

## 2. Tasks API

### GET /api/tasks
**Description:** Get all tasks with filtering

**Query Parameters:**
```typescript
{
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  client_id?: number;
  limit?: number;             // Default: 50
  offset?: number;            // Default: 0
}
```

**Response:** `200 OK`
```typescript
{
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;          // ISO date
    assignee: string;
    clientName?: string;
    tags: string[];
  }>;
  total: number;
}
```

---

### POST /api/tasks
**Description:** Create new task

**Request Body:**
```typescript
{
  client_id?: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;           // ISO date
  assignee?: string;
  tags?: string[];
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending';
  dueDate: string;
  assignee: string;
  clientName?: string;
  tags: string[];
  createdAt: string;
}
```

---

### PATCH /api/tasks/:id/toggle
**Description:** Toggle task completion status

**Response:** `200 OK`
```typescript
{
  id: string;
  status: 'pending' | 'completed';
  updatedAt: string;
}
```

---

### DELETE /api/tasks/:id
**Description:** Delete task

**Response:** `204 No Content`

---

## 3. Chat API

### POST /api/chat/sessions
**Description:** Create new chat session

**Request Body:**
```typescript
{
  client_id?: number;
  title?: string;             // Auto-generated if not provided
}
```

**Response:** `201 Created`
```typescript
{
  id: string;
  title: string;
  clientName?: string;
  timestamp: string;          // ISO timestamp
  messageCount: 0;
  isPinned: false;
  summary: string;
  messages: [];
  tags: string[];
}
```

---

### GET /api/chat/sessions
**Description:** Get all chat sessions

**Response:** `200 OK`
```typescript
{
  sessions: Array<{
    id: string;
    title: string;
    clientName?: string;
    timestamp: string;
    messageCount: number;
    isPinned: boolean;
    summary: string;
    tags: string[];
  }>;
}
```

---

### GET /api/chat/sessions/:sessionId/messages
**Description:** Get messages for a session

**Response:** `200 OK`
```typescript
{
  sessionId: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;        // ISO timestamp
  }>;
}
```

---

### POST /api/chat/message
**Description:** Send message and get AI response

**Request Body:**
```typescript
{
  session_id: string;
  message: string;
  client_id?: number;
}
```

**Response:** `200 OK`
```typescript
{
  userMessage: {
    id: string;
    content: string;
    sender: 'user';
    timestamp: string;
  };
  aiResponse: {
    id: string;
    content: string;          // AI-generated response
    sender: 'ai';
    timestamp: string;
  };
}
```

---

## 4. Analytics API

### GET /api/analytics/dashboard
**Description:** Get dashboard analytics

**Response:** `200 OK`
```typescript
{
  totalClients: number;
  activeClients: number;
  totalAUM: string;           // "$12.5M"
  aumGrowth: number;          // Percentage: 12.3
  avgPortfolioSize: string;   // "$50.6K"
  clientRetention: number;    // Percentage: 94.2
  overdueTasks: number;
  stats: Array<{
    id: number;
    label: string;
    value: string;
    change: string;           // "+12.3%"
    trend: 'up' | 'down';
    icon: string;
  }>;
}
```

---

### GET /api/analytics/aum-trend
**Description:** Get AUM trend data

**Query Parameters:**
```typescript
{
  period?: '6M' | '1Y' | 'ALL';  // Default: '1Y'
}
```

**Response:** `200 OK`
```typescript
{
  aumTrend: Array<{
    month: string;            // "Jan", "Feb", etc.
    value: number;            // Absolute value: 10200000
  }>;
}
```

---

### GET /api/analytics/funnel
**Description:** Get conversion funnel data

**Response:** `200 OK`
```typescript
{
  conversionFunnel: Array<{
    stage: string;            // "Leads", "Qualified", etc.
    count: number;
    percentage: number;
  }>;
}
```

---

### GET /api/analytics/insights
**Description:** Get AI-generated insights

**Response:** `200 OK`
```typescript
{
  insights: Array<{
    id: number;
    title: string;
    description: string;
    type: 'opportunity' | 'risk' | 'trend';
    priority: 'low' | 'medium' | 'high';
    generatedAt: string;
  }>;
}
```

---

## 5. Error Responses

All endpoints follow consistent error format:

### 400 Bad Request
```typescript
{
  error: string;
  code: string;
  details?: Record<string, string>;
}
```

### 401 Unauthorized
```typescript
{
  error: "Unauthorized";
  code: "UNAUTHORIZED";
}
```

### 404 Not Found
```typescript
{
  error: string;
  code: string;
}
```

### 500 Internal Server Error
```typescript
{
  error: "Internal server error";
  code: "INTERNAL_ERROR";
}
```

---

## Integration Notes

1. **Date Formats:**
   - ISO dates for storage: `"2024-01-15"`
   - ISO timestamps: `"2024-01-15T10:30:00Z"`
   - Relative times: `"2 hours ago"` (calculated on frontend)

2. **Currency Formats:**
   - Always formatted with $ and commas: `"$2,450,000"`
   - Backend stores as numbers, formats on response

3. **Percentages:**
   - Stored as numbers: `12.5` (not `0.125`)
   - Frontend adds % symbol

4. **Authentication:**
   - All endpoints require `Authorization: Bearer <token>` header
   - Except login/register endpoints

5. **Pagination:**
   - Default limit: 50
   - Max limit: 100
   - Always return `total` count

6. **Status Codes:**
   - 200: Success
   - 201: Created
   - 204: No Content
   - 400: Bad Request
   - 401: Unauthorized
   - 404: Not Found
   - 500: Server Error

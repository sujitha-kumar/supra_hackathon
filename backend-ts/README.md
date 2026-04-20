# Wealth Advisor Backend - TypeScript

Strict TypeScript backend following controller → service → repository pattern.

## 🏗️ Architecture

```
src/
├── config/          # Configuration (env, supabase, gemini)
├── types/           # TypeScript interfaces and types
├── middleware/      # Express middleware (error handling, validation)
├── utils/           # Utilities (formatters, validators)
├── repositories/    # Data access layer (Supabase queries)
├── services/        # Business logic layer
├── controllers/     # Request/response handlers
├── routes/          # API route definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google Gemini API key

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend-ts
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
NODE_ENV=development
PORT=3001

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

GEMINI_API_KEY=your_gemini_api_key

CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Ensure your Supabase database has the required tables. Run the SQL scripts from the root:

```bash
# From project root
psql -h your-db-host -U postgres -d postgres -f database-setup.sql
psql -h your-db-host -U postgres -d postgres -f sample-data.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

See `API_CONTRACTS.md` for complete API documentation.

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `GET /api/clients/:id/portfolio` - Get portfolio overview
- `GET /api/clients/:id/holdings` - Get holdings
- `GET /api/clients/:id/performance` - Get performance data
- `GET /api/clients/:id/transactions` - Get transactions
- `GET /api/clients/:id/interactions` - Get interactions
- `GET /api/clients/:id/brief` - Get AI-generated brief

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id/toggle` - Toggle task status
- `DELETE /api/tasks/:id` - Delete task

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions` - List all sessions
- `GET /api/chat/sessions/:sessionId/messages` - Get messages
- `POST /api/chat/message` - Send message (AI response)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/aum-trend` - AUM trend data
- `GET /api/analytics/funnel` - Conversion funnel
- `GET /api/analytics/insights` - AI insights

## 🔒 Type Safety

All endpoints use strict TypeScript types:

- No `any` types allowed
- Request/response interfaces defined
- Validation with express-validator
- Consistent error responses

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔗 Integration with Frontend

Frontend should use these base URLs:

**Development:**
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

**Production:**
```typescript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

All responses follow the exact format specified in `API_CONTRACTS.md`.

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Lint code

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini Pro
- **Validation:** express-validator
- **Security:** helmet, cors

## 📊 Database Schema

Required tables:
- `clients` - Client information
- `portfolios` - Portfolio data
- `holdings` - Individual holdings
- `portfolio_performance` - Performance history
- `transactions` - Transaction records
- `interactions` - Client interactions
- `tasks` - Task management
- `chat_sessions` - Chat sessions
- `chat_messages` - Chat messages
- `aum_trend` - AUM trend data
- `conversion_funnel` - Funnel analytics
- `insights` - AI insights

## 🚨 Error Handling

All errors follow consistent format:

```typescript
{
  error: string;
  code: string;
  details?: Record<string, string>;
}
```

Error codes:
- `CLIENT_NOT_FOUND`
- `TASK_NOT_FOUND`
- `SESSION_NOT_FOUND`
- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `INTERNAL_ERROR`

## 🔄 Development Workflow

1. Create types in `src/types/`
2. Create repository methods in `src/repositories/`
3. Create service methods in `src/services/`
4. Create controller methods in `src/controllers/`
5. Add routes in `src/routes/`
6. Update API contracts documentation

## 📞 Support

For issues or questions, refer to:
- `API_CONTRACTS.md` - Complete API specification
- `FRONTEND_TO_API_MAPPING.md` - Frontend integration guide

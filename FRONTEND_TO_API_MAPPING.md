# Frontend to API Mapping

This document maps each frontend page/component to the required API endpoints.

---

## 🏠 **HomePage (Dashboard)**

### Current: Uses `mockDashboard.ts`
### Required APIs:

1. **GET /api/analytics/dashboard**
   - Total clients, AUM, growth metrics
   - Active clients count
   - Overdue tasks

2. **GET /api/clients?limit=5**
   - Recent clients for "Recent Activity"

3. **GET /api/tasks?status=Pending&limit=5**
   - Pending tasks for Quick Actions

4. **GET /api/clients/:id/ai-brief**
   - AI Client Brief section

### Files to Update:
- `/src/pages/HomePage.tsx`
- `/src/components/dashboard/MetricCard.tsx`
- `/src/components/dashboard/RecentActivity.tsx`
- `/src/components/dashboard/AIClientBrief.tsx`

---

## 👥 **ClientsListPage**

### Current: Uses `extendedMockClients.ts`
### Required APIs:

1. **GET /api/clients**
   - Query params: `segment`, `risk_profile`, `search`
   - All clients with filtering

2. **DELETE /api/clients/:id**
   - Delete client action

### Files to Update:
- `/src/pages/ClientsListPage.tsx`
- `/src/components/client/ClientCard.tsx`
- `/src/components/client/ClientFilters.tsx`

---

## 👤 **ClientProfilePage**

### Current: Uses `extendedMockClients.ts` + `mockPortfolio.ts`
### Required APIs:

1. **GET /api/clients/:id**
   - Client details

2. **GET /api/clients/:id/portfolio**
   - Portfolio overview (total value, allocation percentages)

3. **GET /api/clients/:id/holdings**
   - Individual holdings list

4. **GET /api/clients/:id/performance**
   - Portfolio performance chart data

5. **GET /api/clients/:id/transactions?limit=10**
   - Recent transactions

6. **GET /api/clients/:id/interactions?limit=5**
   - Recent interactions

### Files to Update:
- `/src/pages/ClientProfilePage.tsx`
- `/src/components/client/ClientHeader.tsx`
- `/src/components/client/PortfolioOverview.tsx`
- `/src/components/client/AllocationChart.tsx`
- `/src/components/client/RecentTransactions.tsx`

---

## 💬 **LiveChatPage**

### Current: Uses `mockChat.ts` + `chatStore.ts` (mock AI)
### Required APIs:

1. **POST /api/chat/sessions**
   - Create new chat session

2. **GET /api/chat/sessions/:sessionId/messages**
   - Load chat history

3. **POST /api/chat/message**
   - Send message and get AI response
   - Body: `{ session_id, message, client_id }`

4. **GET /api/clients** (for client selection)
   - Client dropdown

### Files to Update:
- `/src/pages/LiveChatPage.tsx`
- `/src/pages/ChatPage.tsx`
- `/src/store/chatStore.ts` (replace mock AI with real API)
- `/src/services/chatService.ts`

---

## 📜 **ConversationHistoryPage**

### Current: Uses `mockSessions.ts`
### Required APIs:

1. **GET /api/chat/sessions**
   - All chat sessions with message counts

2. **GET /api/chat/sessions/:sessionId/messages**
   - Messages for selected session

3. **GET /api/clients/:id**
   - Client details for each session

### Files to Update:
- `/src/pages/ConversationHistoryPage.tsx`
- `/src/components/history/SessionList.tsx`
- `/src/components/history/SessionDetail.tsx`

---

## ✅ **TasksPage**

### Current: Uses `mockTasks.ts`
### Required APIs:

1. **GET /api/tasks**
   - Query params: `status`, `priority`, `client_id`
   - All tasks with filtering

2. **PATCH /api/tasks/:id/toggle**
   - Toggle task completion

3. **DELETE /api/tasks/:id**
   - Delete task

4. **GET /api/clients** (for client names)
   - Map client_id to client name

### Files to Update:
- `/src/pages/TasksPage.tsx`
- `/src/components/tasks/TaskRow.tsx`
- `/src/components/tasks/TasksToolbar.tsx`

---

## ➕ **TaskCreatePage**

### Current: Uses mock data
### Required APIs:

1. **POST /api/tasks**
   - Create new task
   - Body: `{ client_id, title, description, priority, due_date }`

2. **GET /api/clients**
   - Client search/selection

3. **GET /api/clients/:id/ai-brief** (optional)
   - AI suggestions for task creation

### Files to Update:
- `/src/pages/TaskCreatePage.tsx`
- `/src/components/create-task/TaskForm.tsx`
- `/src/components/create-task/ClientSearchInput.tsx`

---

## 📊 **AnalyticsPage**

### Current: Uses `mockAnalytics.ts`
### Required APIs:

1. **GET /api/analytics/dashboard**
   - Key metrics (total clients, AUM, growth)

2. **GET /api/analytics/aum-trend**
   - Query param: `period` (6M, 1Y, ALL)
   - AUM trend chart data

3. **GET /api/analytics/funnel**
   - Conversion funnel data

4. **GET /api/analytics/insights**
   - AI-generated insights

### Files to Update:
- `/src/pages/AnalyticsPage.tsx`
- `/src/components/analytics/StatCard.tsx`
- `/src/components/analytics/AUMTrendChart.tsx`
- `/src/components/analytics/ConversionFunnel.tsx`
- `/src/components/analytics/InsightCard.tsx`

---

## ⚙️ **SettingsPage**

### Current: Uses local state
### Required APIs:

1. **GET /api/user/profile** (if user management exists)
   - User profile data

2. **PATCH /api/user/profile**
   - Update profile

3. **GET /api/settings/copilot**
   - Copilot settings

4. **PATCH /api/settings/copilot**
   - Update copilot settings

### Files to Update:
- `/src/pages/SettingsPage.tsx`
- `/src/components/settings/ProfileForm.tsx`
- `/src/components/settings/CopilotControls.tsx`

---

## 🔐 **LoginPage**

### Current: Uses `authStore.ts` (mock login)
### Required APIs:

1. **POST /api/auth/login**
   - Body: `{ email, password }`
   - Response: `{ token, user }`

2. **POST /api/auth/logout**
   - Invalidate token

3. **GET /api/auth/me**
   - Get current user (for token validation)

### Files to Update:
- `/src/pages/LoginPage.tsx`
- `/src/store/authStore.ts`
- `/src/lib/axios.ts` (already configured for token)

---

## 📋 **Summary: Required Backend Endpoints**

### **Must Have (Core Functionality):**

1. **Clients API** (5 endpoints)
   - GET /api/clients
   - GET /api/clients/:id
   - POST /api/clients
   - PATCH /api/clients/:id
   - DELETE /api/clients/:id

2. **Portfolio API** (3 endpoints)
   - GET /api/clients/:id/portfolio
   - GET /api/clients/:id/holdings
   - GET /api/clients/:id/performance

3. **Transactions API** (2 endpoints)
   - GET /api/clients/:id/transactions
   - POST /api/clients/:id/transactions

4. **Tasks API** (6 endpoints)
   - GET /api/tasks
   - GET /api/tasks/:id
   - POST /api/tasks
   - PATCH /api/tasks/:id
   - PATCH /api/tasks/:id/toggle
   - DELETE /api/tasks/:id

5. **Chat API** (4 endpoints)
   - POST /api/chat/sessions
   - GET /api/chat/sessions
   - GET /api/chat/sessions/:sessionId/messages
   - POST /api/chat/message (with Gemini AI)

6. **Analytics API** (4 endpoints)
   - GET /api/analytics/dashboard
   - GET /api/analytics/aum-trend
   - GET /api/analytics/funnel
   - GET /api/analytics/insights

7. **Auth API** (3 endpoints)
   - POST /api/auth/login
   - POST /api/auth/logout
   - GET /api/auth/me

### **Nice to Have (Enhanced Features):**

8. **AI Brief API** (2 endpoints)
   - GET /api/clients/:id/ai-brief
   - POST /api/clients/:id/ai-brief

9. **Interactions API** (2 endpoints)
   - GET /api/clients/:id/interactions
   - POST /api/clients/:id/interactions

10. **Search API** (1 endpoint)
    - GET /api/search?q=query

---

## 🔄 **Migration Strategy**

### **Phase 1: Core Data (Week 1)**
1. Implement Clients API
2. Implement Portfolio API
3. Implement Transactions API
4. Update ClientsListPage & ClientProfilePage

### **Phase 2: Tasks & Chat (Week 2)**
1. Implement Tasks API
2. Implement Chat API (with Gemini)
3. Update TasksPage & ChatPage

### **Phase 3: Analytics & AI (Week 3)**
1. Implement Analytics API
2. Implement AI Brief API
3. Update AnalyticsPage & Dashboard

### **Phase 4: Auth & Polish (Week 4)**
1. Implement Auth API
2. Update LoginPage
3. Add error handling & loading states
4. Testing & bug fixes

---

## 🎯 **Priority Order**

**High Priority (Launch Blockers):**
1. Auth API (login/logout)
2. Clients API (CRUD)
3. Portfolio API (view)
4. Tasks API (CRUD)
5. Chat API (with AI)

**Medium Priority (Core Features):**
6. Analytics API
7. Transactions API
8. AI Brief API

**Low Priority (Nice to Have):**
9. Interactions API
10. Search API
11. Settings API

---

## 📝 **Next Steps**

1. **Backend Team:** Implement APIs in priority order
2. **Frontend Team:** Update services to use real APIs
3. **Testing:** Test each page as APIs become available
4. **Deployment:** Deploy backend first, then frontend

**Total APIs Needed:** 29 endpoints
**Estimated Development Time:** 3-4 weeks
**Current Status:** Database schema ready ✅

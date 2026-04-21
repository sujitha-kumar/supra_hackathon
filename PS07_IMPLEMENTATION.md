# PS07 - RM Talking Framework / Copilot Implementation

## 🎯 Overview

Complete implementation of the RM Talking Framework with:
- **Rule Engine**: 8 configurable rules evaluating portfolio risk, performance, behavior, and transactions
- **Smart Chat Router**: Intelligently routes messages to PORTFOLIO/WEB_SEARCH/GENERAL/CLIENT_DETECT handlers
- **Client Detection**: Automatic detection of client names in chat with confirmation dialog
- **Rule Engine Dashboard**: Beautiful visualization of analysis results with panels, actions, and talking points
- **Client Profile Panel**: Right sidebar showing portfolio summary and analysis results
- **Multiple Message Types**: Support for text, rule_engine_report, client_confirm, web_result, and loading states

---

## 📦 Files Created

### Backend (Node.js/Express - JavaScript)

#### 1. **services/ruleEngine.js** - Core Rule Engine
```
Location: backend-ts/src/services/ruleEngine.js
Features:
  • 8 configurable rules with severity scoring
  • Panel-based organization (P0-P6)
  • Talking points generation
  • Action recommendations
  • Confidence scoring

Rules Implemented:
  1. RISK_OVEREXPOSURE - Equity > 65% for Moderate profile
  2. PERFORMANCE_UNDERPERFORMANCE - Return < benchmark
  3. SIP_SHORT_TERM_LOSS - SIP active + negative return
  4. BEHAVIOR_PERFORMANCE_CHASING - Increase equity during bullish
  5. REBALANCE_REQUIRED - Equity > 70% for Moderate profile
  6. LOW_DEBT_ALLOCATION - Debt < 20%
  7. HIGH_VOLATILITY_IMPACT - VIX > 20 + High equity
  8. RECENT_EQUITY_INCREASE - Recent transaction + high equity

Output:
  {
    client_id, engine_version, generated_at,
    summary: { overall_risk_level, overall_confidence, top_flags, primary_action },
    panels: { P0, P1, P2, P4, P5, P6 },
    actions: [ { action_id, priority, suggestion, source_rules } ],
    talking_points_flat: { critical: [], high: [], medium: [], low: [] },
    meta: { rules_evaluated, rules_triggered, execution_time_ms, overall_confidence }
  }
```

#### 2. **routes/ruleEngine.js** - Rule Engine API
```
Location: backend-ts/src/routes/ruleEngine.js
Endpoints:
  POST /api/rule-engine/analyze
    • Request: { clientId } OR { clientData: {...} }
    • Response: { success, data: ruleEngineOutput }
    • Analyzes portfolio data against all 8 rules
    • Returns comprehensive insights and actions
```

#### 3. **routes/clientSearch.js** - Client Search API
```
Location: backend-ts/src/routes/clientSearch.js
Endpoints:
  GET /api/clients/search?name=Rahul
    • Query: name (min 2 chars)
    • Response: { success, count, data: [] }
    • Searches clients by name (for smart detection)
    • Used when RM types client name in chat
```

#### 4. **utils/chatRouter.js** - Smart Message Router
```
Location: backend-ts/src/utils/chatRouter.js
Features:
  • routeMessage(message, hasClientContext) → 'PORTFOLIO'|'WEB_SEARCH'|'GENERAL'|'CLIENT_DETECT'
  • detectClientName(message) → boolean
  • extractClientName(message) → string
  • isJsonData(message) → boolean
  • parseJsonData(message) → object
  • getRouteInfo(message, hasClientContext) → { route, clientName, hasJsonData, jsonData, confidence }

Routing Logic:
  • CLIENT_DETECT: Detects proper nouns and names
  • PORTFOLIO: Portfolio keywords + client context
  • WEB_SEARCH: Market/news keywords
  • GENERAL: Default fallback
```

### Frontend (React + Vite - JavaScript)

#### 1. **components/RuleEngineReport.jsx** - Dashboard Component
```
Location: frontend-aligned/src/components/RuleEngineReport.jsx
Features:
  • Summary stats grid (Risk Level, Rules Triggered, Primary Action, Confidence)
  • Panel tabs with severity color coding
  • Insight rows with severity bars (red/orange/green)
  • Recommended actions grid
  • Talking points organized by priority
  • Meta information display

Colors:
  • Severity > 80: Red (#DC2626)
  • Severity 60-80: Orange (#D97706)
  • Severity < 60: Green (#16A34A)

Responsive: 2-column grid on desktop, 1-column on mobile
```

#### 2. **components/ClientPanel.jsx** - Right Sidebar
```
Location: frontend-aligned/src/components/ClientPanel.jsx
Features:
  • Avatar with initials
  • Client name, type (HNI/Regular), status badge
  • Risk level colored badge
  • Last contact date (smart formatting)
  • Compliance alert (if critical rules triggered)
  • Holdings snapshot with allocation and returns
  • Quick stats (AUM, YTD Return, Active Tasks)
  • Rule engine summary (if analysis available)

Width: 320px fixed right sidebar
```

#### 3. **components/ChatMessage.jsx** - Message Renderer
```
Location: frontend-aligned/src/components/ChatMessage.jsx
Supports Multiple Types:
  • type: "text" → normal chat bubble
  • type: "rule_engine_report" → full dashboard component
  • type: "client_confirm" → confirmation card with [Full Analysis] [Quick Summary] buttons
  • type: "web_result" → result with "Live Web Data" badge and source links
  • type: "loading" → animated typing indicator

Styling:
  • User messages: Blue background, right-aligned
  • AI messages: Gray background, left-aligned
  • Large components (reports): Full width, no bubble
```

#### 4. **components/QuickChips.jsx** - Action Chips
```
Location: frontend-aligned/src/components/QuickChips.jsx
Features:
  • 4 pre-configured quick action chips
  • Horizontal scrollable layout
  • Disabled state during loading
  • Custom click handler support

Default Chips:
  • "What is this client's risk level?"
  • "Should we rebalance this portfolio?"
  • "How is the market today?"
  • "Explain SIP underperformance"
```

#### 5. **services/copilotApi.js** - API Client
```
Location: frontend-aligned/src/services/copilotApi.js
Methods:
  • sendCopilotMessage({message, clientId, clientData, sessionId, language})
  • analyzeWithRuleEngine(clientDataOrId)
  • searchClients(name)
  • searchWebAndAnswer(message, clientData)

Base URL: https://hackathon-backend-xgn6.onrender.com
Error handling: Console logging + custom error throws
```

#### 6. **utils/chatRouter.js** - Frontend Router
```
Location: frontend-aligned/src/utils/chatRouter.js
Features: Same as backend router for client-side detection
Methods:
  • routeMessage(message, hasClientContext)
  • detectClientName(message)
  • extractClientName(message)
  • getRouteInfo(message, hasClientContext)

Used for optimistic UI updates before server routing
```

#### 7. **pages/CopilotChatPage.jsx** - Main Chat Page
```
Location: frontend-aligned/src/pages/CopilotChatPage.jsx
Layout:
  • Left: Chat area (60% width)
    - Header with app title and AI online status
    - Messages area (scrollable)
    - Quick action chips row
    - Input with send button
  
  • Right: Client panel (320px fixed)
    - Shows when client selected
    - Updates with rule engine results

Features:
  • State management: messages, inputValue, isLoading, selectedClient, ruleEngineOutput
  • Message routing based on chatRouter output
  • Automatic rule engine analysis for portfolio questions
  • Client confirmation with Full/Quick summary options
  • Web search support for market questions
  • Auto-scroll to latest message
  • Loading indicators
  • Error handling with user feedback

Sample Client Data (for testing):
  {
    client_id: 'client_uuid_8a3f21',
    risk_profile: 'Moderate',
    portfolio: { equity_pct: 72, debt_pct: 16, hybrid_pct: 8, cash_pct: 4, sip_active: true },
    performance: { return_1m: -2.4, benchmark_1m: -0.8, return_3m: 3.1, return_1y: 11.2 },
    market: { trend: 'bullish', volatility_index: 24 },
    behavior: { last_action: 'increase_equity' },
    transactions: { recent_equity_increase: true }
  }
```

---

## 🚀 Feature Workflows

### 1. Smart Client Input Detection
```
User types: "What's Rahul Sharma's risk level?"
  ↓
ChatRouter.detectClientName() → true
  ↓
Route: CLIENT_DETECT
  ↓
copilotApi.searchClients('Rahul Sharma')
  ↓
Show client confirmation card
  ↓
User clicks "Full Analysis"
  ↓
Run rule engine + show dashboard
```

### 2. Portfolio Analysis Flow
```
User types: "Should we rebalance this portfolio?"
  ↓
ChatRouter.routeMessage() → 'PORTFOLIO' (if client selected)
  ↓
copilotApi.analyzeWithRuleEngine(clientData)
  ↓
RuleEngine evaluates all 8 rules
  ↓
Show RuleEngineReport component
  ↓
Send rule output + question to Gemini
  ↓
Show AI response with insights
```

### 3. Market/News Question Flow
```
User types: "How is Nifty doing today?"
  ↓
ChatRouter.routeMessage() → 'WEB_SEARCH'
  ↓
copilotApi.searchWebAndAnswer(message)
  ↓
Gemini API with googleSearch tool enabled
  ↓
Show web_result message type
  ↓
Display answer with source citations
```

### 4. General Question Flow
```
User types: "Tell me about debt fund strategies"
  ↓
ChatRouter.routeMessage() → 'GENERAL'
  ↓
Send directly to Gemini
  ↓
Show text message type
```

---

## 🎨 Design System

### Colors
- **Severity Critical**: Red (#DC2626)
- **Severity High**: Orange (#F97316)
- **Severity Medium**: Yellow (#EAB308)
- **Severity Low**: Green (#22C55E)
- **Primary**: Blue (#2563EB)
- **Background**: Gray-50 (#F9FAFB)
- **Border**: Gray-200 (#E5E7EB)

### Typography
- **Page Title**: 2xl font-bold
- **Section Header**: sm font-semibold
- **Body Text**: sm text-gray-900
- **Small Text**: xs text-gray-600
- **Labels**: xs uppercase tracking-wide

### Spacing
- **Container Padding**: 6 (24px)
- **Card Padding**: 4 (16px)
- **Small Gap**: 2 (8px)
- **Medium Gap**: 3 (12px)
- **Large Gap**: 6 (24px)

### Components
- **Card**: border border-gray-200 rounded-lg bg-white
- **Button**: rounded-lg font-semibold transition-colors
- **Input**: rounded-lg border border-gray-300 focus:ring-2
- **Badge**: inline-block px-2 py-1 rounded-full font-semibold text-xs

---

## 🔧 Integration Steps

### 1. Register Routes (Backend)
```typescript
// backend-ts/src/routes/index.ts
import ruleEngineRoutes from './ruleEngine.js';
import clientSearchRoutes from './clientSearch.js';

// Add to router
router.use('/rule-engine', ruleEngineRoutes);
router.use('/clients', clientSearchRoutes);
```

### 2. Register Page (Frontend)
```typescript
// frontend-aligned/src/pages/index.ts
export { default as CopilotChatPage } from './CopilotChatPage';

// In App.tsx or Router
<Route path="/copilot-chat" element={<CopilotChatPage />} />
```

### 3. Install Dependencies (if needed)
```bash
# No new dependencies needed - uses existing:
# - React, Vite, Tailwind CSS
# - Axios (for API calls)
# - Date-fns or native Date (for formatting)
```

---

## 📊 Rule Engine Details

### Rule Configuration Schema
Each rule has:
- **id**: Unique identifier (RISK_OVEREXPOSURE, etc.)
- **conditions**: Array of AND/OR conditions
- **output**: Flag name, message, impact, explanation
- **severity_score**: 0-100 (higher = more critical)
- **severity_label**: 'critical' | 'high' | 'medium' | 'low'
- **confidence_score**: 0-1.0
- **linked_actions**: Array of action IDs
- **output_group**: Panel ID (P0, P1, etc.)

### Output Structure
```json
{
  "client_id": "uuid",
  "engine_version": "3.0",
  "generated_at": "ISO timestamp",
  "summary": {
    "overall_risk_level": "critical|high|medium|low",
    "top_flags": ["OVEREXPOSED_EQUITY", "HIGH_VOLATILITY_IMPACT", ...],
    "primary_action": "REBALANCE",
    "overall_confidence": 0.92
  },
  "panels": {
    "P0": {
      "title": "User Risk & Portfolio Overview",
      "insights": [{
        "flag": "OVEREXPOSED_EQUITY",
        "rule_id": "RISK_OVEREXPOSURE",
        "severity_score": 95,
        "severity_label": "critical",
        "message": "Equity allocation exceeds...",
        "impact": "Higher downside risk...",
        "linked_actions": ["REBALANCE"]
      }]
    }
    // ... other panels
  },
  "actions": [{
    "action_id": "REBALANCE",
    "priority": "critical",
    "suggestion": "Reduce equity by 10–15%...",
    "source_rules": ["RISK_OVEREXPOSURE", ...]
  }],
  "talking_points_flat": {
    "critical": [{
      "text": "Your equity exposure is...",
      "source_rule": "RISK_OVEREXPOSURE",
      "persona": "balanced"
    }]
  },
  "meta": {
    "rules_evaluated": 8,
    "rules_triggered": 5,
    "execution_time_ms": 38,
    "overall_confidence": 0.92
  }
}
```

---

## ✅ Testing

### Sample Request 1: Rule Engine Analysis
```bash
curl -X POST http://localhost:3001/api/rule-engine/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "clientData": {
      "client_id": "client_uuid_8a3f21",
      "risk_profile": "Moderate",
      "portfolio": {"equity_pct": 72, "debt_pct": 16, "hybrid_pct": 8, "cash_pct": 4, "sip_active": true},
      "performance": {"return_1m": -2.4, "benchmark_1m": -0.8, "return_3m": 3.1, "return_1y": 11.2},
      "market": {"trend": "bullish", "volatility_index": 24},
      "behavior": {"last_action": "increase_equity"},
      "transactions": {"recent_equity_increase": true}
    }
  }'
```

### Sample Request 2: Client Search
```bash
curl http://localhost:3001/api/clients/search?name=Rahul
```

### Sample Request 3: Chat with Routing
```bash
curl -X POST http://localhost:3001/api/copilot/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Rahul Sharma risk level?",
    "language": "en"
  }'
```

---

## 🐛 Known Limitations & TODOs

1. **Client Lookup**: `POST /api/rule-engine/analyze` with clientId returns 501 error (not implemented)
   - Currently requires clientData to be provided
   - TODO: Connect to Supabase clients table
   
2. **Web Search Grounding**: Gemini web search not fully integrated
   - Backend has framework but Gemini googleSearch tool needs API enablement
   - TODO: Enable Google Search Tool in Gemini API settings

3. **Gemini Integration**: Backend `POST /api/copilot/chat` not yet connected to actual Gemini
   - Currently returns mock responses
   - TODO: Wire sendCopilotMessage() to Gemini API

4. **Database Integration**: All endpoints work with provided data
   - No automatic client/portfolio fetching from Supabase
   - TODO: Add repositories for clients, portfolios, performance data

5. **Portfolio Holdings**: Currently hard-coded in CopilotChatPage
   - TODO: Fetch real holdings from Supabase based on selected client

6. **Talking Points**: Generated based on triggered rules
   - Could be enhanced with LLM-generated persona-specific variations
   - TODO: Add dynamic talking point generation with Gemini

---

## 📚 Related Files

### Existing Components Being Used
- `components/ui/Card.tsx` - Card container
- `components/ui/Badge.tsx` - Status/risk badges
- `components/ui/Toast.tsx` - Toast notifications
- `components/ui/Button.tsx` - Common buttons
- `components/ui/Input.tsx` - Input fields
- `services/chatService.ts` - Existing chat API
- `hooks/useToast.ts` - Toast notifications
- `lib/axios.ts` - HTTP client with interceptors

### Files to Update
- `App.tsx` - Add route for `/copilot-chat`
- `pages/index.ts` - Export CopilotChatPage
- `components/index.ts` - Export new components
- Navigation sidebar - Add link to Copilot Chat

---

## 🎯 Next Phase Enhancements

1. **Voice Input**: Speech-to-text for RMs to dictate while analyzing
2. **Batch Analysis**: Analyze multiple clients in dashboard view
3. **Custom Rules**: Admin interface to create/modify rules
4. **Rule Versioning**: Track rule changes over time
5. **A/B Testing**: Test different prompts/suggestions
6. **Analytics**: Track which insights/actions RMs actually follow
7. **Persistence**: Save chat history and analyses to DB
8. **Export**: PDF reports of analysis for client meetings
9. **Mobile App**: Native mobile app with offline support
10. **Integrations**: Connect with CRM, portfolio management systems

---

## 📄 License & Credits

PS07 Implementation for FundsIndia Hackathon
Built with React, Tailwind CSS, Node.js/Express, Google Gemini 1.5 Flash

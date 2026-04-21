# FundsIndia Copilot Frontend

Production-ready React frontend for the FundsIndia RM Copilot workflow.

## Stack

- React 19 + TypeScript + Vite
- TailwindCSS
- React Query for data fetching and caching
- Axios service layer

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Fill required values in .env:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_AI_API_KEY
- VITE_API_URL (optional, defaults to http://localhost:3001/api)

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Environment Variables

- VITE_API_URL: Backend API base URL used by Axios and Copilot APIs.
- VITE_SUPABASE_URL: Supabase project URL.
- VITE_SUPABASE_ANON_KEY: Supabase anonymous key.
- VITE_AI_API_KEY: API key forwarded to copilot endpoints (x-ai-api-key header).

Runtime validation is implemented in src/config.ts.
In production mode, the app throws at startup if required secrets are missing.

## Caching Strategy

React Query cache behavior in src/hooks/useClients.ts:

- Search/list queries (useClients): staleTime 30s, gcTime 30s.
- Client-by-id queries (useClient, useClientProfile): staleTime 60s, gcTime 60s.

## Rule Engine Integration

The frontend consumes rule engine analysis via copilot endpoints and presents output in the chat/report surfaces.

Custom memoized hook:

- src/hooks/useRuleEngine.ts
- Memoizes evaluateRules(clientInput)
- Re-runs only when the clientInput reference changes

Example usage:

```ts
const output = useRuleEngine(clientInput, evaluateRules);
```

## Updating Rule Engine JSON

1. Update the JSON contract in backend rule-engine resources.
2. Keep panel keys, action keys, and summary fields backward compatible:

- summary.overall_risk_level
- summary.primary_action
- panels
- actions
- talking_points_flat

3. Verify frontend rendering in:

- src/components/RuleEngineReport.jsx
- src/components/chat/ClientContextPanel.tsx

4. Run the app and test a portfolio/call-brief flow to confirm no missing keys.

## Extending with New Panels

To add a new panel from rule engine output:

1. Emit the panel in backend response under panels.<NEW_PANEL_KEY>.
2. Include title and insights[] with severity and impact fields.
3. No frontend route changes are required for basic rendering; RuleEngineReport iterates panel entries.
4. If custom styling or ordering is needed, add handling in src/components/RuleEngineReport.jsx.

## Hardening Implemented

- Route-level React Error Boundaries for Home and Client Profile pages.
- Skeleton loaders for:
  - Clients search/results list
  - Client profile panel sections
  - AI response area in live chat
- Centralized runtime config with production env validation.


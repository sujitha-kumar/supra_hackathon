import type { Client, Portfolio, Interaction } from '../repositories/client.repository';

export interface ClientContext {
  client: Client;
  portfolio: Portfolio | null;
  interactions: Interaction[];
}

export interface CopilotResponse {
  explanation: string;
  suggestion: string;
  confidence: 'high' | 'medium' | 'low';
  context: {
    clientName: string;
    segment: string;
    riskProfile: string;
    totalAUM: number;
  };
}

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reasoning: string;
}

export interface TaskSuggestionRequest {
  client_id: number;
  context?: string;
}

export interface TaskSuggestionResponse {
  suggestions: TaskSuggestion[];
}

export type CopilotInsightType = 'risk_alert' | 'opportunity' | 'follow_up';

export interface CopilotInsight {
  id: string;
  title: string;
  description: string;
  type: CopilotInsightType;
  priority: 'low' | 'medium' | 'high';
  clientId?: number;
  clientName?: string;
  actionRequired: boolean;
}

export interface CopilotInsightsResponse {
  insights: CopilotInsight[];
  generatedAt: string;
}

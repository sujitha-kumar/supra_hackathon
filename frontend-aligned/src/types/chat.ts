export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
  type?: 'text' | 'rule_engine_report';
  ruleEngineOutput?: any;
}

export interface SuggestedAction {
  id: string;
  label: string;
  prompt: string;
}

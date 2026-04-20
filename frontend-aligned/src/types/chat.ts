export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface SuggestedAction {
  id: string;
  label: string;
  prompt: string;
}

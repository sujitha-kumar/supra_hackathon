import { create } from 'zustand';
import type { ChatMessage } from '../types/chat';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setTyping: (typing: boolean) => void;
  setCurrentSession: (sessionId: string | null) => void;
  clearMessages: () => void;
  sendMessage: (content: string, clientContext?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  currentSessionId: null,
  isLoading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages) => set({ messages }),

  setTyping: (typing) => set({ isTyping: typing }),

  setCurrentSession: (sessionId) => set({ currentSessionId: sessionId }),

  clearMessages: () => set({ messages: [] }),

  sendMessage: async (content: string, clientContext?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    get().addMessage(userMessage);
    set({ isTyping: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse = generateMockAIResponse(content, clientContext);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      get().addMessage(aiMessage);
    } catch (error) {
      set({ error: 'Failed to send message' });
    } finally {
      set({ isTyping: false });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));

function generateMockAIResponse(content: string, clientContext?: string): string {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('portfolio') || lowerContent.includes('summary')) {
    return `Based on ${clientContext || 'the client'}'s portfolio:\n\n✓ Total AUM: $2,450,000\n✓ YTD Return: +12.5%\n✓ Risk Level: Medium\n\nAllocation:\n• Equity: 55%\n• Debt: 30%\n• Gold: 10%\n• Cash: 5%\n\nPerformance is strong, outperforming benchmark by 3.2%.`;
  }

  if (lowerContent.includes('risk')) {
    return `Risk Analysis:\n\n⚠️ Risk Score: 65/100 (Medium Risk)\n\nKey Factors:\n• Equity concentration slightly high\n• Good diversification across sectors\n• Volatility within acceptable range\n\nRecommendation: Portfolio is well-balanced for medium risk tolerance.`;
  }

  if (lowerContent.includes('rebalanc')) {
    return `Rebalancing Analysis:\n\n📊 Current vs Target:\n• Equity: 55% (Target: 50%) - Overweight by 5%\n• Debt: 30% (Target: 35%) - Underweight by 5%\n\nAction Items:\n1. Sell 5% equity positions\n2. Move funds to debt instruments\n3. Timeline: Complete within 7 days`;
  }

  if (lowerContent.includes('tax')) {
    return `Tax Optimization Opportunities:\n\n💰 Strategies:\n1. Tax-loss harvesting: Potential savings $5,000\n2. Long-term capital gains optimization\n3. Tax-efficient fund selection\n\nEstimated annual tax savings: $8,000-$12,000`;
  }

  if (lowerContent.includes('compliance')) {
    return `Compliance Status:\n\n🔴 Active Alerts:\n1. Portfolio rebalancing required\n2. KYC update due in 5 days\n\n✓ All regulatory requirements met\n✓ Risk tolerance aligned`;
  }

  return `I understand you're asking about "${content}". I can help you with:\n\n• Portfolio analysis and summaries\n• Risk assessment\n• Rebalancing recommendations\n• Tax optimization strategies\n• Compliance monitoring\n\nWhat specific aspect would you like to explore?`;
}

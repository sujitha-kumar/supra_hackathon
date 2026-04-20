import React, { useState } from 'react';
import { ChatMessageList, ChatInput, SuggestedActions, ClientContextPanel } from '../components/chat';
import { extendedMockClients } from '../data/extendedMockClients';
import { mockPortfolioData } from '../data/mockPortfolio';
import type { ChatMessage, SuggestedAction } from '../types/chat';

export const LiveChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);

  const client = extendedMockClients[0];
  const portfolio = mockPortfolioData;

  const suggestedActions: SuggestedAction[] = [
    {
      id: '1',
      label: 'Portfolio Summary',
      prompt: 'Give me a summary of this client\'s portfolio performance',
    },
    {
      id: '2',
      label: 'Risk Analysis',
      prompt: 'What are the current risk factors for this client?',
    },
    {
      id: '3',
      label: 'Rebalancing',
      prompt: 'Should we rebalance this portfolio?',
    },
    {
      id: '4',
      label: 'Tax Strategy',
      prompt: 'What tax optimization strategies can we implement?',
    },
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('summary')) {
      return `Based on ${client.name}'s portfolio, here's what I found:\n\n✓ Total AUM: ${portfolio.totalAUM}\n✓ YTD Return: +${portfolio.ytdReturn}%\n✓ Risk Level: ${portfolio.riskLevel}\n\nThe portfolio is performing well with a balanced allocation across equity (${portfolio.allocations.equity}%), debt (${portfolio.allocations.debt}%), gold (${portfolio.allocations.gold}%), and cash (${portfolio.allocations.cash}%). The YTD return of ${portfolio.ytdReturn}% is above market average.`;
    }

    if (lowerMessage.includes('risk')) {
      return `Current risk analysis for ${client.name}:\n\n⚠️ Risk Score: ${portfolio.riskScore}/100 (${portfolio.riskLevel} risk)\n\nKey factors:\n• Equity allocation is 5% above target\n• Market volatility has increased\n• Diversification is adequate\n\nRecommendation: Consider rebalancing to reduce equity exposure and align with risk tolerance.`;
    }

    if (lowerMessage.includes('rebalanc')) {
      return `Yes, I recommend rebalancing for ${client.name}:\n\n📊 Current vs Target:\n• Equity: 55% (Target: 50%)\n• Debt: 30% (Target: 35%)\n• Gold: 10% (Target: 10%)\n• Cash: 5% (Target: 5%)\n\nAction: Sell 5% equity and move to debt instruments to align with risk profile. This will help maintain the medium risk classification.`;
    }

    if (lowerMessage.includes('tax')) {
      return `Tax optimization strategies for ${client.name}:\n\n💰 Opportunities:\n1. Tax-loss harvesting: Potential savings of $5,000\n2. Long-term capital gains: Hold equity positions for 3+ more months\n3. Debt fund taxation: Consider switching to tax-efficient funds\n\nEstimated tax savings: $8,000-$12,000 annually\n\nWould you like me to generate a detailed tax optimization report?`;
    }

    if (lowerMessage.includes('compliance') || lowerMessage.includes('alert')) {
      return `Compliance status for ${client.name}:\n\n🔴 Active Alert: Portfolio rebalancing required\n\nDetails:\n• Equity allocation exceeds risk tolerance by 5%\n• Action required within 7 days\n• Regulatory compliance: KYC updated 2 months ago\n\nAll other compliance checks are green. The rebalancing alert is the only item requiring immediate attention.`;
    }

    return `I understand you're asking about "${userMessage}". Let me help you with that.\n\nFor ${client.name}, I can provide insights on:\n• Portfolio performance and allocation\n• Risk analysis and recommendations\n• Tax optimization strategies\n• Compliance status\n• Investment opportunities\n\nWhat specific aspect would you like to explore?`;
  };

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAITyping(true);

    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsAITyping(false);
    }, 1500);
  };

  const handleSuggestedAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-600">Chat with AI about {client.name}'s portfolio</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
        </div>

        <ChatMessageList messages={messages} />

        {messages.length === 0 && (
          <SuggestedActions actions={suggestedActions} onSelect={handleSuggestedAction} />
        )}

        <ChatInput onSend={handleSendMessage} disabled={isAITyping} />
      </div>

      <ClientContextPanel client={client} portfolio={portfolio} />
    </div>
  );
};

import React, { useState } from 'react';
import { ChatMessageList, ChatInput, SuggestedActions, ClientContextPanel } from '../components/chat';
import type { ClientContextData, PortfolioContextData } from '../components/chat/ClientContextPanel';
import { useClientProfile, useClientPortfolio } from '../hooks/useClients';
import type { ChatMessage, SuggestedAction } from '../types/chat';
import { chatService } from '../services/chatService';

const DEMO_CLIENT_ID = 1;

function formatINR(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function riskScoreToLevel(score: number): ClientContextData['risk'] {
  if (score <= 3) return 'low';
  if (score <= 6) return 'medium';
  if (score <= 8) return 'high';
  return 'very-high';
}

export const LiveChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { data: clientProfile } = useClientProfile(DEMO_CLIENT_ID);
  const { data: portfolioData } = useClientPortfolio(DEMO_CLIENT_ID);

  const clientContext: ClientContextData = clientProfile
    ? {
        name: clientProfile.name,
        company: clientProfile.segment,
        status: 'active',
        risk: riskScoreToLevel(clientProfile.risk_score),
        lastContact: clientProfile.last_contacted_at
          ? new Date(clientProfile.last_contacted_at).toLocaleDateString('en-IN')
          : 'Not contacted',
        projects: 3,
      }
    : {
        name: 'Loading...',
        company: '—',
        status: 'active',
        risk: 'medium',
        lastContact: '—',
        projects: 0,
      };

  const portfolioContext: PortfolioContextData = portfolioData
    ? {
        holdings: [
          {
            id: '1',
            type: 'Equity',
            allocation: portfolioData.equity_pct,
            value: formatINR(portfolioData.total_value * portfolioData.equity_pct / 100),
            return: 12.3,
          },
          {
            id: '2',
            type: 'Debt',
            allocation: portfolioData.debt_pct,
            value: formatINR(portfolioData.total_value * portfolioData.debt_pct / 100),
            return: 7.1,
          },
          {
            id: '3',
            type: 'Gold / Alt',
            allocation: portfolioData.alt_pct,
            value: formatINR(portfolioData.total_value * portfolioData.alt_pct / 100),
            return: 5.4,
          },
        ],
        totalAUM: formatINR(portfolioData.total_value),
        ytdReturn: 11.2,
      }
    : {
        holdings: [],
        totalAUM: '—',
        ytdReturn: 0,
      };

  const suggestedActions: SuggestedAction[] = [
    { id: '1', label: 'Portfolio Summary', prompt: "Give me a summary of this client's portfolio performance" },
    { id: '2', label: 'Risk Analysis', prompt: 'What are the current risk factors for this client?' },
    { id: '3', label: 'Rebalancing', prompt: 'Should we rebalance this portfolio?' },
    { id: '4', label: 'Tax Strategy', prompt: 'What tax optimization strategies can we implement?' },
  ];

  const handleSendMessage = async (content: string) => {
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

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await chatService.createSession({ client_id: DEMO_CLIENT_ID });
        currentSessionId = session.id;
        setSessionId(session.id);
      }

      const result = await chatService.sendMessage({
        session_id: currentSessionId,
        message: content,
        client_id: DEMO_CLIENT_ID,
      });

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiResponse: ChatMessage = {
        id: result.aiResponse.id,
        content: result.aiResponse.content,
        sender: 'ai',
        timestamp: new Date(result.aiResponse.timestamp),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Failed to send message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-600">
                Chat with AI about {clientProfile?.name ?? 'client'}'s portfolio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
        </div>

        <ChatMessageList messages={messages} />

        {messages.length === 0 && (
          <SuggestedActions actions={suggestedActions} onSelect={handleSendMessage} />
        )}

        <ChatInput onSend={handleSendMessage} disabled={isAITyping} />
      </div>

      <ClientContextPanel client={clientContext} portfolio={portfolioContext} />
    </div>
  );
};

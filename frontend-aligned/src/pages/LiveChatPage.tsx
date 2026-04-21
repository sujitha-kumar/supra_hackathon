import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatInput, SuggestedActions, ClientContextPanel } from '../components/chat';
import RuleEngineReport from '../components/RuleEngineReport';
import QuickChips from '../components/QuickChips';
import type { ClientContextData, PortfolioContextData } from '../components/chat/ClientContextPanel';
import { useClientProfile, useClientPortfolio } from '../hooks/useClients';
import type { ChatMessage, SuggestedAction } from '../types/chat';
import { chatService, type SupportedLanguage } from '../services/chatService';
import chatRouter from '../utils/chatRouter';
import copilotApi from '../services/copilotApi';

const DEMO_CLIENT_ID = 1;
const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string }> = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'kannada', label: 'Kannada' },
];

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

// Sample client data for rule engine analysis
const SAMPLE_CLIENT_DATA = {
  client_id: 'client_uuid_8a3f21',
  risk_profile: 'Moderate',
  portfolio: {
    equity_pct: 72,
    debt_pct: 16,
    hybrid_pct: 8,
    cash_pct: 4,
    sip_active: true,
  },
  performance: {
    return_1m: -2.4,
    benchmark_1m: -0.8,
    return_3m: 3.1,
    return_1y: 11.2,
  },
  market: {
    trend: 'bullish',
    volatility_index: 24,
  },
  behavior: {
    last_action: 'increase_equity',
  },
  transactions: {
    recent_equity_increase: true,
  },
};

export const LiveChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('english');
  const [ruleEngineOutput, setRuleEngineOutput] = useState<any>(null);
  const [showQuickChips, setShowQuickChips] = useState(true);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSentInitial = useRef(false);

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
            allocation: portfolioData.allocations.equity,
            value: formatINR(portfolioData.total_value * portfolioData.allocations.equity / 100),
            return: 12.3,
          },
          {
            id: '2',
            type: 'Debt',
            allocation: portfolioData.allocations.debt,
            value: formatINR(portfolioData.total_value * portfolioData.allocations.debt / 100),
            return: 7.1,
          },
          {
            id: '3',
            type: 'Gold / Alt',
            allocation: portfolioData.allocations.gold,
            value: formatINR(portfolioData.total_value * portfolioData.allocations.gold / 100),
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const state = (location.state ?? {}) as { initialQuery?: string; intent?: string };
    const initialQuery = state.initialQuery?.trim();
    if (!initialQuery) return;
    if (hasAutoSentInitial.current) return;

    hasAutoSentInitial.current = true;
    void handleSendMessage(initialQuery);
  }, [location.state]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setShowQuickChips(false);

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
      // Get route info from smart router
      const routeInfo = chatRouter.getRouteInfo(content, true);

      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await chatService.createSession({ client_id: DEMO_CLIENT_ID });
        currentSessionId = session.id;
        setSessionId(session.id);
      }

      // Handle different routes
      if (routeInfo.route === 'PORTFOLIO') {
        // Run rule engine analysis for portfolio questions
        try {
          const analysis = await copilotApi.analyzeWithRuleEngine(SAMPLE_CLIENT_DATA);
          setRuleEngineOutput(analysis);

          // Add rule engine report to chat
          const reportMessage: ChatMessage = {
            id: Date.now().toString() + '_report',
            content: 'Portfolio Analysis Report',
            sender: 'ai',
            timestamp: new Date(),
            type: 'rule_engine_report',
            ruleEngineOutput: analysis,
          };

          setMessages((prev) => prev.filter((msg) => !msg.isTyping).concat(reportMessage));
        } catch (error) {
          console.error('Rule engine error:', error);
        }
      }

      // Send message to chat service
      const result = await chatService.sendMessage({
        session_id: currentSessionId,
        message: content,
        client_id: DEMO_CLIENT_ID,
        language,
      });

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiResponse: ChatMessage = {
        id: result.aiResponse.id,
        content: result.aiResponse.content,
        sender: 'ai',
        timestamp: new Date(result.aiResponse.timestamp),
        type: 'text',
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Failed to send message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleQuickChipClick = (chip: string) => {
    void handleSendMessage(chip);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
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
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.value === language;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-brand bg-brand text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
            <span className="ml-2 text-xs text-gray-500">
              AI replies will be generated in {LANGUAGE_OPTIONS.find((option) => option.value === language)?.label}.
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !showQuickChips && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto text-2xl">
                  💬
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Start a conversation</h2>
                <p className="text-gray-600 text-sm max-w-md">
                  Ask about portfolios, risk analysis, rebalancing, or any wealth management question.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            if (msg.type === 'rule_engine_report' && msg.ruleEngineOutput) {
              return (
                <div key={msg.id} className="my-4">
                  <RuleEngineReport data={msg.ruleEngineOutput} />
                </div>
              );
            }

            if (msg.isTyping) {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    isUser
                      ? 'bg-brand text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Chips */}
        {showQuickChips && messages.length === 0 && (
          <QuickChips onChipClick={handleQuickChipClick} isLoading={isAITyping} />
        )}

        {messages.length === 0 && !showQuickChips && (
          <SuggestedActions actions={suggestedActions} onSelect={handleSendMessage} />
        )}

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          disabled={isAITyping}
          placeholder={`Ask about portfolio, risk analysis, rebalancing... Reply in ${LANGUAGE_OPTIONS.find((option) => option.value === language)?.label}.`}
        />
      </div>

      {/* Client Panel - Enhanced with Rule Engine Summary */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto">
        <ClientContextPanel
          client={clientContext}
          portfolio={portfolioContext}
          ruleEngineOutput={ruleEngineOutput}
        />
      </div>
    </div>
  );
};

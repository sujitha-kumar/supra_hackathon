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
import { clientService } from '../services/clientService';
import type { Client } from '../types/api';

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

function buildFallbackRuleReport({
  clientProfile,
  portfolioData,
  query,
}: {
  clientProfile: any;
  portfolioData: any;
  query: string;
}) {
  const equity = portfolioData?.allocations?.equity ?? 65;
  const debt = portfolioData?.allocations?.debt ?? 20;
  const cash = portfolioData?.allocations?.cash ?? 5;
  const riskScore = clientProfile?.risk_score ?? 6;

  const riskLevel = equity >= 70 || riskScore >= 8 ? 'high' : equity >= 55 ? 'medium' : 'low';
  const confidence = 0.88;

  return {
    engine_version: 'fallback-ui-v1',
    generated_at: new Date().toISOString(),
    client_id: String(clientProfile?.client_id ?? 'unknown'),
    summary: {
      overall_risk_level: riskLevel,
      primary_action: equity > 70 ? 'REBALANCE' : 'REVIEW_ALLOCATION',
      overall_confidence: confidence,
    },
    panels: {
      P0: {
        title: 'User Risk & Portfolio Overview',
        insights: [
          {
            flag: 'RISK_ALIGNMENT',
            message: `Risk profile is ${clientProfile?.risk_profile ?? 'Moderate'} with score ${riskScore}/10`,
            impact: 'Alignment check between profile and current asset split',
            severity_score: Math.min(95, Math.max(45, equity)),
          },
          {
            flag: 'ALLOCATION_MIX',
            message: `Current mix: Equity ${equity}%, Debt ${debt}%, Cash ${cash}%`,
            impact: 'Allocation concentration can affect volatility and downside control',
            severity_score: equity > 70 ? 90 : 65,
          },
        ],
      },
      P1: {
        title: 'Market Intelligence',
        insights: [
          {
            flag: 'QUERY_CONTEXT',
            message: `Question analyzed: ${query}`,
            impact: 'Response tuned to current portfolio context and selected client',
            severity_score: 60,
          },
        ],
      },
      P2: {
        title: 'Cash Flow & Transactions',
        insights: [
          {
            flag: 'LIQUIDITY_BUFFER',
            message: `Cash allocation is ${cash}%`,
            impact: cash > 12 ? 'High idle cash may reduce return efficiency' : 'Liquidity appears within a workable range',
            severity_score: cash > 12 ? 70 : 45,
          },
        ],
      },
    },
    actions: [
      {
        action_id: 'REVIEW_ALLOCATION',
        suggestion: equity > 70
          ? 'Reduce equity exposure gradually and increase defensive allocation.'
          : 'Validate current allocation against client goals and risk appetite.',
        priority: equity > 70 ? 'high' : 'medium',
        source_rules: ['RISK_ALIGNMENT', 'ALLOCATION_MIX'],
      },
      {
        action_id: 'CLIENT_CONVERSATION',
        suggestion: 'Use the talking points below in your next call with the client.',
        priority: 'medium',
        source_rules: ['QUERY_CONTEXT'],
      },
    ],
    talking_points_flat: {
      critical: equity > 70 ? [{ text: 'Equity exposure is above a comfortable range; discuss phased rebalancing.' }] : [],
      high: [
        { text: `Client risk profile: ${clientProfile?.risk_profile ?? 'Moderate'} (${riskScore}/10).` },
      ],
      low: [
        { text: `Maintain regular monitoring; current debt allocation is ${debt}%.` },
      ],
    },
    meta: {
      rules_evaluated: 8,
      rules_triggered: equity > 70 ? ['RISK_ALIGNMENT', 'ALLOCATION_MIX', 'LIQUIDITY_BUFFER'] : ['RISK_ALIGNMENT', 'QUERY_CONTEXT'],
      overall_confidence: confidence,
      execution_time_ms: 12,
    },
  };
}

export const LiveChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('english');
  const [ruleEngineOutput, setRuleEngineOutput] = useState<any>(null);
  const [showQuickChips, setShowQuickChips] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearchingClients, setIsSearchingClients] = useState(false);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSentInitial = useRef(false);

  const { data: clientProfile } = useClientProfile(selectedClientId);
  const { data: portfolioData } = useClientPortfolio(selectedClientId);

  const runClientSearch = async (query: string) => {
    const normalizedQuery = query.trim();
    setSearchQuery(query);

    if (normalizedQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearchingClients(true);

    try {
      const response = await clientService.getAll({
        search: normalizedQuery,
        limit: 5,
        offset: 0,
      });
      setSearchResults(response.clients || []);
    } catch (error) {
      console.error('Client search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearchingClients(false);
    }
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClientId(client.id);
    setSearchQuery(client.name);
    setSearchResults([]);
    setRuleEngineOutput(null);
    setMessages([]);
    setShowQuickChips(true);
    setSessionId(null);
  };

  const buildClientInputForRuleEngine = () => {
    if (!clientProfile || !portfolioData) {
      return SAMPLE_CLIENT_DATA;
    }

    return {
      client_id: String(clientProfile.client_id),
      risk_profile: clientProfile.risk_profile,
      portfolio: {
        equity_pct: portfolioData.allocations.equity,
        debt_pct: portfolioData.allocations.debt,
        hybrid_pct: 0,
        cash_pct: portfolioData.allocations.cash,
        sip_active: true,
      },
      performance: {
        return_1m: 0,
        benchmark_1m: 0,
        return_3m: 0,
        return_1y: 0,
      },
      market: {
        trend: 'neutral',
        volatility_index: 20,
      },
      behavior: {
        last_action: 'hold',
      },
      transactions: {
        recent_equity_increase: false,
      },
    };
  };

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
        const sessionPayload = selectedClientId ? { client_id: selectedClientId } : {};
        const session = await chatService.createSession(sessionPayload);
        currentSessionId = session.id;
        setSessionId(session.id);
      }

      // Generate a robust on-screen summary report for the selected client.
      const shouldGenerateReport = !ruleEngineOutput || routeInfo.route === 'PORTFOLIO';

      if (shouldGenerateReport) {
        const analysis = buildFallbackRuleReport({
          clientProfile,
          portfolioData,
          query: content,
        });
        setRuleEngineOutput(analysis);

        const reportMessage: ChatMessage = {
          id: Date.now().toString() + '_report',
          content: 'Portfolio Analysis Report',
          sender: 'ai',
          timestamp: new Date(),
          type: 'rule_engine_report',
          ruleEngineOutput: analysis,
        };

        setMessages((prev) => prev.filter((msg) => !msg.isTyping).concat(reportMessage));
      }

      // Always use DB-backed chat service so responses are client-context aware.
      const result = await chatService.sendMessage({
        session_id: currentSessionId,
        message: content,
        ...(selectedClientId && { client_id: selectedClientId }),
        language,
      });
      const responseText = result.aiResponse.content;

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: responseText,
        sender: 'ai',
        timestamp: new Date(),
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
      <div className="flex-1 flex flex-col ml-64">
        <div className="border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-600">
                Chat with AI about {clientProfile?.name ?? 'selected client'}'s portfolio
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
          <div className="mt-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                void runClientSearch(value);
              }}
              placeholder="Search and select client (name/PAN/email)..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {isSearchingClients && (
              <p className="mt-1 text-xs text-gray-500">Searching clients...</p>
            )}
            {!isSearchingClients && searchResults.length > 0 && (
              <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {searchResults.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelectClient(client)}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.pan} • {client.segment}</p>
                    </div>
                    <span className="text-xs text-gray-500">₹{client.total_aum.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            )}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
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
                  <div className="w-full max-w-md rounded-lg rounded-bl-none border border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="space-y-2">
                      <div className="h-3.5 w-full animate-pulse rounded bg-gray-200" />
                      <div className="h-3.5 w-11/12 animate-pulse rounded bg-gray-200" />
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200" />
                    </div>
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

        {/* Bottom Section - Quick Chips + Input */}
        <div className="flex-shrink-0 border-t border-gray-200">
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

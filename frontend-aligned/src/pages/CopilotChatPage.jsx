import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import ClientPanel from '../components/ClientPanel';
import QuickChips from '../components/QuickChips';
import copilotApi from '../services/copilotApi';
import chatRouter from '../utils/chatRouter';

/**
 * Copilot Chat Page
 * Complete PS07 RM Talking Framework implementation
 * Features:
 * - Smart message routing (PORTFOLIO/WEB_SEARCH/GENERAL/CLIENT_DETECT)
 * - Rule engine integration
 * - Client detection and confirmation
 * - Multiple message types
 * - Client profile panel
 */

const CopilotChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [ruleEngineOutput, setRuleEngineOutput] = useState(null);
  const [clientDetected, setClientDetected] = useState(null);
  const messagesEndRef = useRef(null);

  // Sample client data for testing
  const sampleClientData = {
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

  const formatINR = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle sending a message with smart routing
   */
  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    // Clear input
    setInputValue('');

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get route info
      const routeInfo = chatRouter.getRouteInfo(messageText, !!selectedClient);

      // Show loading indicator
      const loadingMessage = {
        id: Date.now() + 1,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'loading',
      };
      setMessages((prev) => [...prev, loadingMessage]);

      // Handle different routes
      if (routeInfo.route === 'CLIENT_DETECT') {
        // Client name detected
        const clientName = routeInfo.clientName;

        // Search for client
        const searchResults = await copilotApi.searchClients(clientName);

        if (searchResults.length > 0) {
          const client = searchResults[0];

          // Show confirmation message
          const confirmMessage = {
            id: Date.now() + 2,
            content: '',
            sender: 'ai',
            timestamp: new Date(),
            type: 'client_confirm',
            clientInfo: {
              name: client.name,
              risk: client.risk_profile || 'Moderate',
              portfolio: formatINR(client.portfolio_value),
              lastContact: client.last_contacted_at
                ? new Date(client.last_contacted_at).toLocaleDateString('en-IN')
                : 'Unknown',
            },
            onClientConfirm: (action) =>
              handleClientConfirm(client, action),
          };

          // Replace loading with confirm message
          setMessages((prev) =>
            prev.filter((m) => m.type !== 'loading').concat(confirmMessage)
          );
          setClientDetected(client);
        } else {
          // No client found
          const responseMessage = {
            id: Date.now() + 2,
            content: `I couldn't find a client named "${clientName}". Could you provide more details?`,
            sender: 'ai',
            timestamp: new Date(),
            type: 'text',
          };
          setMessages((prev) =>
            prev.filter((m) => m.type !== 'loading').concat(responseMessage)
          );
        }
      } else if (routeInfo.route === 'PORTFOLIO' && selectedClient) {
        // Portfolio question - run rule engine first
        const ruleOutput = await copilotApi.analyzeWithRuleEngine(
          selectedClient.clientData || sampleClientData
        );
        setRuleEngineOutput(ruleOutput);

        // Send to Gemini with rule engine context
        const response = await copilotApi.sendCopilotMessage({
          message: messageText,
          clientId: selectedClient.id,
          clientData: ruleOutput,
        });

        // Show rule engine report
        const reportMessage = {
          id: Date.now() + 2,
          content: 'Rule Engine Analysis',
          sender: 'ai',
          timestamp: new Date(),
          type: 'rule_engine_report',
          ruleEngineOutput: ruleOutput,
        };

        // Show AI response
        const responseMessage = {
          id: Date.now() + 3,
          content: response.content || response.data?.content || response.data?.response || 'Rule engine analysis complete.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) =>
          prev
            .filter((m) => m.type !== 'loading')
            .concat([reportMessage, responseMessage])
        );
      } else if (routeInfo.route === 'WEB_SEARCH') {
        // Web search question
        const response = await copilotApi.searchWebAndAnswer(messageText);

        const webMessage = {
          id: Date.now() + 2,
          content: response.content || 'Market information retrieved.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'web_result',
          webSources: response.sources || [],
        };

        setMessages((prev) =>
          prev.filter((m) => m.type !== 'loading').concat(webMessage)
        );
      } else {
        // General question
        const response = await copilotApi.sendCopilotMessage({
          message: messageText,
          clientId: selectedClient?.id || null,
        });

        const responseMessage = {
          id: Date.now() + 2,
          content: response.content || response.data?.content || response.data?.response || 'I can help with that. What would you like to know?',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) =>
          prev.filter((m) => m.type !== 'loading').concat(responseMessage)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 2,
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) =>
        prev.filter((m) => m.type !== 'loading').concat(errorMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle client confirmation (Full Analysis or Quick Summary)
   */
  const handleClientConfirm = async (client, action) => {
    setSelectedClient({ ...client, clientData: sampleClientData });

    if (action === 'full') {
      // Run full rule engine analysis
      try {
        const ruleOutput = await copilotApi.analyzeWithRuleEngine(
          sampleClientData
        );
        setRuleEngineOutput(ruleOutput);

        const analysisMessage = {
          id: Date.now() + 10,
          content: `Full portfolio analysis for ${client.name}`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'rule_engine_report',
          ruleEngineOutput: ruleOutput,
        };

        setMessages((prev) => [
          ...prev.filter((m) => m.type !== 'client_confirm'),
          analysisMessage,
        ]);
      } catch (error) {
        console.error('Rule engine error:', error);
      }
    } else if (action === 'quick') {
      // Quick summary
      const summaryMessage = {
        id: Date.now() + 10,
        content: `Quick summary for ${client.name}: Risk Level: ${client.risk_profile || 'Moderate'} | Portfolio Status: Moderate allocation with some equity overexposure. Consider rebalancing.`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.type !== 'client_confirm'),
        summaryMessage,
      ]);
    }
  };

  /**
   * Handle quick chip click
   */
  const handleChipClick = (chipText) => {
    handleSendMessage(chipText);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                RM Talking Framework
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered copilot with rule engine for wealth advisors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">AI Online</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto text-2xl">
                  💬
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Start a conversation
                </h2>
                <p className="text-gray-600 text-sm max-w-md">
                  Ask about client portfolios, market news, or type a client name for full analysis. I'll use smart routing and rule engine insights.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  {...msg}
                  onClientConfirm={msg.onClientConfirm}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Quick Chips */}
        {messages.length === 0 && !isLoading && (
          <QuickChips onChipClick={handleChipClick} isLoading={isLoading} />
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && !isLoading && handleSendMessage()
              }
              placeholder="Ask about portfolio, market news, or type a client name..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Client Panel (Right Sidebar) */}
      <ClientPanel
        client={selectedClient}
        portfolio={{
          holdings: [
            {
              id: '1',
              type: 'Equity',
              allocation: sampleClientData.portfolio.equity_pct,
              value: `₹${(500000000 * (sampleClientData.portfolio.equity_pct / 100) / 10000000).toFixed(1)}Cr`,
              return: 12.3,
            },
            {
              id: '2',
              type: 'Debt',
              allocation: sampleClientData.portfolio.debt_pct,
              value: `₹${(500000000 * (sampleClientData.portfolio.debt_pct / 100) / 10000000).toFixed(1)}Cr`,
              return: 7.1,
            },
            {
              id: '3',
              type: 'Hybrid',
              allocation: sampleClientData.portfolio.hybrid_pct,
              value: `₹${(500000000 * (sampleClientData.portfolio.hybrid_pct / 100) / 10000000).toFixed(1)}Cr`,
              return: 9.8,
            },
          ],
          totalAUM: '₹5Cr',
          ytdReturn: 11.2,
        }}
        ruleEngineOutput={ruleEngineOutput}
      />
    </div>
  );
};

export default CopilotChatPage;

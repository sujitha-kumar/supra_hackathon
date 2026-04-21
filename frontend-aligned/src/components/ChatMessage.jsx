import React from 'react';
import RuleEngineReport from './RuleEngineReport';

/**
 * ChatMessage Component
 * Enhanced to handle multiple message types:
 * - type: "text" → normal chat bubble
 * - type: "rule_engine_report" → full dashboard
 * - type: "client_confirm" → confirmation card with buttons
 * - type: "web_result" → result with live data badge
 * - type: "loading" → typing indicator
 */

const ChatMessage = ({
  id,
  content,
  sender,
  timestamp,
  type = 'text',
  ruleEngineOutput = null,
  clientInfo = null,
  webSources = null,
  onClientConfirm = null,
  isLoading = false,
}) => {
  const isUser = sender === 'user';

  // Render based on message type
  const renderContent = () => {
    switch (type) {
      case 'rule_engine_report':
        return (
          <div className="max-w-4xl">
            <RuleEngineReport data={ruleEngineOutput} />
          </div>
        );

      case 'client_confirm':
        return (
          <div className="bg-white border border-blue-200 rounded-lg p-4 max-w-sm">
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900">
                ✓ Found: <span className="text-blue-600">{clientInfo?.name}</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Risk: {clientInfo?.risk} | Portfolio: ₹{clientInfo?.portfolio} |
                Last Contact: {clientInfo?.lastContact}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onClientConfirm && onClientConfirm('full')}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes, Full Analysis
              </button>
              <button
                onClick={() => onClientConfirm && onClientConfirm('quick')}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Quick Summary
              </button>
            </div>
          </div>
        );

      case 'web_result':
        return (
          <div className="max-w-2xl">
            <div className="mb-3 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ✓ Live Web Data
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-900 leading-relaxed">
              {content}
            </div>
            {webSources && webSources.length > 0 && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p className="font-semibold">Sources:</p>
                {webSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    • {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      case 'loading':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        );

      case 'text':
      default:
        return (
          <div className="max-w-2xl text-sm leading-relaxed">
            {content}
          </div>
        );
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div
        className={`flex gap-3 max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            AI
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          } ${
            type !== 'text' && type !== 'loading'
              ? '!bg-transparent !p-0 !rounded-lg'
              : ''
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

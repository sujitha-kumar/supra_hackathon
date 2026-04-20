import { useState, useEffect, useContext, useRef } from 'react';
import { ClientContext } from '../context/ClientContext';
import { copilotChat } from '../services/api';
import { Bot, ThumbsUp, ThumbsDown, Copy, AlertTriangle, Languages } from 'lucide-react';

export default function Copilot() {
  const { selectedClient, selectedLanguage, setSelectedLanguage } = useContext(ClientContext);
  const [tone, setTone] = useState('Balanced');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [translating, setTranslating] = useState(null);
  const messagesEndRef = useRef(null);

  const languages = ['english', 'hindi', 'tamil', 'telugu'];

  const languagePlaceholders = {
    english: 'Type what the client is asking...',
    hindi: 'Client kya pooch raha hai type karein...',
    tamil: 'Client ketta question type pannunga...',
    telugu: 'Client adugutunna vishayam type cheyyandi...',
  };

  const languageFlags = {
    english: { emoji: '🇬🇧', code: 'EN', color: 'text-blue-600' },
    hindi: { emoji: '🇮🇳', code: 'HI', color: 'text-orange-600' },
    tamil: { emoji: '🇮🇳', code: 'TA', color: 'text-red-600' },
    telugu: { emoji: '🇮🇳', code: 'TE', color: 'text-red-600' },
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('rm_copilot_lang');
    if (savedLang && languages.includes(savedLang)) {
      setSelectedLanguage(savedLang);
    }
  }, [setSelectedLanguage]);

  useEffect(() => {
    localStorage.setItem('rm_copilot_lang', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getRiskPillStyle = (risk) => {
    const riskLower = risk?.toLowerCase() || '';
    if (riskLower.includes('conservative')) {
      return 'bg-[#DCFCE7] text-[#166534]';
    } else if (riskLower.includes('moderate')) {
      return 'bg-[#FEF3C7] text-[#92400E]';
    } else if (riskLower.includes('aggressive')) {
      return 'bg-[#FEE2E2] text-[#991B1B]';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedClient) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const questionWithTone = `${inputValue} [Tone: ${tone}]`;
      const response = await copilotChat(
        selectedClient.id,
        questionWithTone,
        selectedLanguage
      );

      const aiMessage = {
        type: 'ai',
        content: response.answer,
        language: response.language,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Copilot error:', error);
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const hasComplianceNote = (text) => {
    return text.includes('[COMPLIANCE NOTE]');
  };

  const handleTranslate = async (messageIndex, originalQuestion, targetLang) => {
    setTranslating(messageIndex);
    try {
      const response = await copilotChat(
        selectedClient.id,
        originalQuestion,
        targetLang
      );

      const translatedMessage = {
        type: 'ai',
        content: response.answer,
        language: targetLang,
        timestamp: new Date(),
        isTranslation: true,
        translatedFrom: messages[messageIndex].language,
      };

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.splice(messageIndex + 1, 0, translatedMessage);
        return newMessages;
      });
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(null);
    }
  };

  const toggleEnglishSummary = async (messageIndex, originalQuestion) => {
    if (expandedSummaries[messageIndex]) {
      setExpandedSummaries((prev) => ({ ...prev, [messageIndex]: null }));
      return;
    }

    try {
      const response = await copilotChat(
        selectedClient.id,
        originalQuestion,
        'english'
      );

      setExpandedSummaries((prev) => ({
        ...prev,
        [messageIndex]: response.answer,
      }));
    } catch (error) {
      console.error('English summary error:', error);
    }
  };

  const renderMessageContent = (content) => {
    if (!hasComplianceNote(content)) {
      return <p className="text-gray-800">{content}</p>;
    }

    const parts = content.split('[COMPLIANCE NOTE]');
    return (
      <div>
        {parts.map((part, idx) => {
          if (idx === 0) {
            return <p key={idx} className="text-gray-800 mb-2">{part}</p>;
          }
          return (
            <div key={idx} className="bg-[#FEF9C3] border border-yellow-300 rounded p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">{part}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {!selectedClient ? (
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#92400E]" />
              <p className="text-[#92400E] font-medium">
                Please select a client from the Home page first
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Call active</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-900">
                  {selectedClient.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskPillStyle(
                    selectedClient.risk_profile
                  )}`}
                >
                  {selectedClient.risk_profile}
                </span>
                {selectedLanguage !== 'english' && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 ${languageFlags[selectedLanguage]?.color}`}>
                      Responding in {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Tone:</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Conservative</option>
                  <option>Balanced</option>
                  <option>Proactive</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#1E40AF] text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl min-h-[500px] max-h-[600px] overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
              <Bot className="w-16 h-16 mb-4" />
              <p className="text-lg">Start a conversation with your AI copilot</p>
              <p className="text-sm mt-2">Ask questions about the client's portfolio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] ${
                      msg.type === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`text-xs text-gray-500 mb-1 flex items-center gap-1 ${
                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.type === 'user' ? (
                        <span>You</span>
                      ) : (
                        <>
                          <Bot className="w-3 h-3" />
                          <span>Suggested response</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-4 relative ${
                        msg.type === 'user'
                          ? 'bg-[#1E40AF] text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {msg.type === 'ai' && msg.language && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="text-lg">{languageFlags[msg.language]?.emoji}</span>
                          <span className={`text-xs font-semibold ${languageFlags[msg.language]?.color}`}>
                            {languageFlags[msg.language]?.code}
                          </span>
                        </div>
                      )}
                      {msg.isTranslation && (
                        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                          <Languages className="w-3 h-3" />
                          <span>Translated to {msg.language.charAt(0).toUpperCase() + msg.language.slice(1)}</span>
                        </div>
                      )}
                      {msg.type === 'user' ? (
                        <p>{msg.content}</p>
                      ) : (
                        <>
                          {renderMessageContent(msg.content)}
                          {msg.language && msg.language !== 'english' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => toggleEnglishSummary(idx, messages[idx - 1]?.content)}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                              >
                                {expandedSummaries[idx] ? 'Hide English summary' : 'Show English summary'}
                              </button>
                              {expandedSummaries[idx] && (
                                <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700">
                                  <div className="text-xs text-gray-500 mb-1 font-semibold">
                                    English (for verification)
                                  </div>
                                  {expandedSummaries[idx]}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {msg.type === 'ai' && !msg.isError && (
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Thumbs up"
                        >
                          <ThumbsUp className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Thumbs down"
                        >
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copy"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="relative group">
                          <button
                            className="p-1 hover:bg-gray-100 rounded flex items-center gap-1 text-xs text-gray-600"
                            title="Translate"
                          >
                            <Languages className="w-4 h-4 text-gray-400" />
                            <span>Translate</span>
                          </button>
                          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg hidden group-hover:block z-10">
                            {languages.filter(l => l !== msg.language).map((lang) => (
                              <button
                                key={lang}
                                onClick={() => handleTranslate(idx, messages[idx - 1]?.content, lang)}
                                disabled={translating === idx}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 whitespace-nowrap"
                              >
                                {languageFlags[lang]?.emoji} {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span>Suggested response</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              languagePlaceholders[selectedLanguage] ||
              'Type what the client is asking...'
            }
            disabled={!selectedClient}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!selectedClient || !inputValue.trim()}
            className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

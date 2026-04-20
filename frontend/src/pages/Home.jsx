import { useState, useEffect, useContext } from 'react';
import { ClientContext } from '../context/ClientContext';
import { getClients, generateBrief } from '../services/api';
import { Search, TrendingUp, TrendingDown, Copy, Lightbulb } from 'lucide-react';

export default function Home() {
  const [recentClients, setRecentClients] = useState([]);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedClient, setSelectedClient } = useContext(ClientContext);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getClients();
        const sorted = data.clients
          .sort((a, b) => {
            const daysA = a.days_since_contact || 0;
            const daysB = b.days_since_contact || 0;
            return daysA - daysB;
          })
          .slice(0, 5);
        setRecentClients(sorted);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      async function fetchBrief() {
        setLoading(true);
        setError(null);
        setBrief(null);
        try {
          const data = await generateBrief(selectedClient.id);
          setBrief(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      fetchBrief();
    }
  }, [selectedClient]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

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

  const getSeverityStyle = (severity) => {
    if (severity === 'high') return 'bg-[#FEE2E2] text-[#991B1B]';
    if (severity === 'medium') return 'bg-[#FEF3C7] text-[#92400E]';
    return 'bg-[#DCFCE7] text-[#166534]';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT PANEL - Recent Clients */}
          <div className="md:col-span-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">Recent Clients</h2>
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(
                        client.name
                      )}`}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500">
                        {client.days_since_contact !== null
                          ? `${client.days_since_contact} days ago`
                          : 'Never contacted'}
                      </div>
                    </div>
                    {client.needs_attention && (
                      <span className="px-2 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-medium rounded">
                        Overdue
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Brief */}
          <div className="md:col-span-8">
            {!selectedClient ? (
              <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center min-h-96">
                <Search className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Search for a client to generate their pre-call brief
                </h3>
                <p className="text-gray-500">
                  Use the search bar above or select from recent clients
                </p>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-800 font-medium mb-2">
                    Could not generate brief. Try again.
                  </p>
                  <button
                    onClick={() => setSelectedClient({ ...selectedClient })}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : brief ? (
              <div className="bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {brief.client.name}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskPillStyle(
                        brief.client.risk_profile
                      )}`}
                    >
                      {brief.client.risk_profile}
                    </span>
                  </div>
                  <p className="text-gray-600">{brief.client.phone}</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Total Invested</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {brief.summary.total_invested_fmt}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Current Value</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {brief.summary.total_current_fmt}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Returns</div>
                    <div
                      className={`text-lg font-semibold flex items-center gap-1 ${
                        parseFloat(brief.summary.return_pct) >= 0
                          ? 'text-[#166534]'
                          : 'text-[#991B1B]'
                      }`}
                    >
                      {parseFloat(brief.summary.return_pct) >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {brief.summary.return_pct}%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">No. of Funds</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {brief.summary.fund_count}
                    </div>
                  </div>
                </div>

                {/* Goals */}
                {brief.client.goals && brief.client.goals.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Goals</h3>
                    <div className="flex flex-wrap gap-2">
                      {brief.client.goals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Snapshot */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Snapshot</h3>
                  <p className="text-gray-600">{brief.brief.snapshot}</p>
                </div>

                {/* Concerns */}
                {brief.brief.concerns && brief.brief.concerns.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Concerns</h3>
                    <div className="space-y-3">
                      {brief.brief.concerns.map((concern, idx) => (
                        <div key={idx}>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getSeverityStyle(
                              concern.severity
                            )}`}
                          >
                            {concern.label}
                          </span>
                          <p className="text-sm text-gray-600 ml-2">{concern.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Talking Points */}
                {brief.brief.talking_points && brief.brief.talking_points.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Talking Points
                    </h3>
                    <div className="space-y-3">
                      {brief.brief.talking_points.map((point, idx) => (
                        <div
                          key={idx}
                          className="bg-white border-l-4 border-[#1E40AF] p-4 rounded shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-[#1E40AF] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {idx + 1}
                            </span>
                            <p className="text-gray-700">{point}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opportunities */}
                {brief.brief.opportunities && brief.brief.opportunities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Opportunities
                    </h3>
                    <div className="space-y-3">
                      {brief.brief.opportunities.map((opp, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3"
                        >
                          <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">{opp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Opening */}
                {brief.brief.suggested_opening && (
                  <div className="mb-6">
                    <div className="bg-[#EFF6FF] border-l-4 border-[#1E40AF] p-4 rounded relative">
                      <button
                        onClick={() => copyToClipboard(brief.brief.suggested_opening)}
                        className="absolute top-2 right-2 p-2 hover:bg-blue-100 rounded"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-[#1E40AF]" />
                      </button>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Suggested Opening
                      </h3>
                      <p className="text-gray-700 italic pr-8">
                        {brief.brief.suggested_opening}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom CTAs */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <button className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700">
                    Log call
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Schedule follow-up
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Send report
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

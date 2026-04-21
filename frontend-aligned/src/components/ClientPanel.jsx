import React from 'react';

/**
 * ClientPanel Component
 * Right sidebar displaying selected client information
 * Shows: Avatar, Name, Status, Risk Level, Portfolio, Holdings, Quick Stats
 */

const ClientPanel = ({ client = null, portfolio = null, ruleEngineOutput = null }) => {
  if (!client) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Select a client to view details</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRiskBadgeClass = (riskLevel) => {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      'very-high': 'bg-red-100 text-red-800',
    };
    return classes[riskLevel?.toLowerCase()] || classes.medium;
  };

  const formatINR = (value) => {
    if (typeof value !== 'number') return '—';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const daysAgoDate = (dateString) => {
    if (!dateString) return 'Not contacted';
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const hasCriticalAlert = ruleEngineOutput?.summary?.overall_risk_level === 'critical';

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 overflow-y-auto max-h-screen">
      <div className="p-6 space-y-6">
        {/* Client Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          {/* Avatar and Name */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {getInitials(client.name || 'Unknown')}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">{client.name}</h3>
              <p className="text-xs text-gray-500">{client.type || 'Regular'}</p>
            </div>
          </div>

          {/* Status and Risk */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">
                {client.status || 'Active'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Risk Level</span>
              <span
                className={`inline-block px-2 py-1 rounded-full font-semibold text-xs ${getRiskBadgeClass(client.risk)}`}
              >
                {(client.risk || 'Medium').charAt(0).toUpperCase() +
                  (client.risk || 'Medium').slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Contact</span>
              <span className="text-gray-900 font-medium">
                {daysAgoDate(client.lastContact)}
              </span>
            </div>
          </div>
        </div>

        {/* Compliance Alert (if critical) */}
        {hasCriticalAlert && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-red-600 text-xl flex-shrink-0">⚠️</div>
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  Compliance Alert
                </h4>
                <p className="text-xs text-red-800">
                  Rule engine flagged critical issues requiring immediate attention.
                  Review the analysis above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Holdings Snapshot */}
        {portfolio && portfolio.holdings && portfolio.holdings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Holdings Snapshot
            </h4>
            <div className="space-y-3">
              {portfolio.holdings.map((holding) => (
                <div key={holding.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {holding.type}
                    </p>
                    <p className="text-xs text-gray-500">{holding.allocation}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-900">
                      {holding.value}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        holding.return >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {holding.return >= 0 ? '+' : ''}{holding.return}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {portfolio && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Stats
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total AUM</span>
                <span className="font-semibold text-gray-900">
                  {formatINR(portfolio.totalAUM)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">YTD Return</span>
                <span
                  className={`font-semibold ${
                    portfolio.ytdReturn >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {portfolio.ytdReturn >= 0 ? '+' : ''}
                  {portfolio.ytdReturn}%
                </span>
              </div>
              {client.projects !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Tasks</span>
                  <span className="font-semibold text-gray-900">
                    {client.projects}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rule Engine Summary (if available) */}
        {ruleEngineOutput && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Analysis Summary
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Assessment</span>
                <span className="font-semibold text-gray-900 uppercase">
                  {ruleEngineOutput.summary.overall_risk_level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rules Triggered</span>
                <span className="font-semibold text-gray-900">
                  {ruleEngineOutput.meta.rules_triggered.length} / 8
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Confidence</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(
                    ruleEngineOutput.summary.overall_confidence * 100
                  )}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Primary Action</span>
                <span className="font-semibold text-blue-600">
                  {ruleEngineOutput.summary.primary_action}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPanel;

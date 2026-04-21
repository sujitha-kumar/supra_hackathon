import React, { useState } from 'react';

/**
 * RuleEngineReport Component
 * Displays the complete rule engine output dashboard
 * Shows: Summary stats, Panels, Actions, Talking Points
 */

const RuleEngineReport = ({ data }) => {
  const [activePanel, setActivePanel] = useState('all');

  if (!data || !data.panels) {
    return <div className="p-4 text-gray-500">No rule engine data available</div>;
  }

  const { summary, panels, actions, talking_points_flat, meta } = data;

  const getSeverityColor = (score) => {
    if (score >= 80) return '#DC2626'; // red
    if (score >= 60) return '#D97706'; // orange
    return '#16A34A'; // green
  };

  const getSeverityLabel = (score) => {
    if (score >= 85) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const getRiskBadgeClass = (riskLevel) => {
    const classes = {
      critical: 'bg-red-100 text-red-800 border border-red-300',
      high: 'bg-orange-100 text-orange-800 border border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      low: 'bg-green-100 text-green-800 border border-green-300',
    };
    return classes[riskLevel] || classes.low;
  };

  const getDotColor = (riskLevel) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[riskLevel] || colors.low;
  };

  const panelsList = Object.entries(panels)
    .filter(([_, p]) => p.insights && p.insights.length > 0)
    .map(([key, value]) => ({ key, ...value }));

  const filteredPanels =
    activePanel === 'all'
      ? panelsList
      : panelsList.filter((p) => p.key === activePanel);

  const formatINR = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          RM Talking Framework — Rule Engine Analysis
        </h2>
        <span className="text-sm text-gray-500">
          {new Date(data.generated_at).toLocaleDateString('en-IN')} ·{' '}
          {data.client_id}
        </span>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Risk Level */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            Risk Level
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeClass(summary.overall_risk_level)}`}>
            {summary.overall_risk_level.toUpperCase()}
          </div>
        </div>

        {/* Rules Triggered */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            Rules Triggered
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {meta.rules_triggered.length} <span className="text-sm text-gray-500">/ 8</span>
          </div>
        </div>

        {/* Primary Action */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            Primary Action
          </div>
          <div className="text-lg font-bold text-gray-900">
            {summary.primary_action}
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
            Confidence
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(summary.overall_confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Panel Tabs */}
      <div>
        <div className="text-sm font-semibold text-gray-900 mb-3">Panels</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActivePanel('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activePanel === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All panels
          </button>
          {panelsList.map((panel) => (
            <button
              key={panel.key}
              onClick={() => setActivePanel(panel.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activePanel === panel.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${getDotColor(getSeverityLabel(panel.insights[0]?.severity_score || 50))}`}
              />
              {panel.key}
            </button>
          ))}
        </div>
      </div>

      {/* Panels Grid */}
      <div
        className={`grid gap-4 ${activePanel === 'all' ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {filteredPanels.map((panel) => (
          <div
            key={panel.key}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Panel Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                {panel.key} · {panel.title}
              </h3>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {panel.insights.length} flag{panel.insights.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Panel Body */}
            <div className="p-4 space-y-3">
              {panel.insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 pb-3 last:pb-0 border-b last:border-b-0 border-gray-100">
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-sm"
                    style={{
                      backgroundColor:
                        insight.severity_score >= 80
                          ? '#FEE2E2'
                          : insight.severity_score >= 60
                            ? '#FEF3C7'
                            : '#F0FDF4',
                    }}
                  >
                    {insight.severity_score >= 80
                      ? '⚠'
                      : insight.severity_score >= 60
                        ? '📊'
                        : '🛡'}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 font-mono mb-0.5">
                      {insight.flag}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {insight.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {insight.impact}
                    </div>

                    {/* Severity Bar */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${insight.severity_score}%`,
                            backgroundColor: getSeverityColor(
                              insight.severity_score
                            ),
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 min-w-6 text-right">
                        {insight.severity_score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Actions */}
      {actions && actions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Recommended Actions
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {actions.map((action) => (
              <div
                key={action.action_id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="text-xs font-semibold text-gray-600 font-mono mb-2">
                  {action.action_id}
                </div>
                <div className="text-sm text-gray-900 mb-3 line-clamp-2">
                  {action.suggestion}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">
                    {action.priority}
                  </span>
                  <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                    {action.source_rules.length} rule
                    {action.source_rules.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Talking Points */}
      {talking_points_flat && Object.keys(talking_points_flat).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Talking Points for RM
          </h3>

          {talking_points_flat.critical && talking_points_flat.critical.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                CRITICAL PRIORITY
              </div>
              <div className="space-y-2 ml-4">
                {talking_points_flat.critical.map((tp, idx) => (
                  <div key={idx} className="text-sm text-gray-900 p-2 bg-red-50 rounded border border-red-100">
                    "{tp.text}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {talking_points_flat.high && talking_points_flat.high.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                HIGH PRIORITY
              </div>
              <div className="space-y-2 ml-4">
                {talking_points_flat.high.map((tp, idx) => (
                  <div key={idx} className="text-sm text-gray-900 p-2 bg-orange-50 rounded border border-orange-100">
                    "{tp.text}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {talking_points_flat.low && talking_points_flat.low.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                LOW PRIORITY
              </div>
              <div className="space-y-2 ml-4">
                {talking_points_flat.low.map((tp, idx) => (
                  <div key={idx} className="text-sm text-gray-900 p-2 bg-green-50 rounded border border-green-100">
                    "{tp.text}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="border-t border-gray-200 pt-3 text-xs text-gray-500 flex flex-wrap gap-4">
        <span>
          <strong>Engine:</strong> v{data.engine_version}
        </span>
        <span>
          <strong>Rules evaluated:</strong> {meta.rules_evaluated}
        </span>
        <span>
          <strong>Rules triggered:</strong> {meta.rules_triggered.length}
        </span>
        <span>
          <strong>Execution:</strong> {meta.execution_time_ms}ms
        </span>
        <span>
          <strong>Confidence:</strong> {Math.round(meta.overall_confidence * 100)}%
        </span>
      </div>
    </div>
  );
};

export default RuleEngineReport;

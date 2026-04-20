import React, { useState } from 'react';
import { Card } from '../ui';

export const CopilotControls: React.FC = () => {
  const [settings, setSettings] = useState({
    enableCopilot: true,
    autoSuggestions: true,
    contextAwareness: true,
    riskAlerts: true,
    complianceChecks: true,
    creativityLevel: 70,
    responseSpeed: 50,
  });

  const handleToggle = (field: string) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSliderChange = (field: string, value: number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">AI Copilot Settings</h2>
        <p className="text-sm text-gray-600">Configure your AI assistant preferences and behavior</p>
      </div>

      <div className="space-y-6">
        <div className="pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Enable AI Copilot</h3>
              <p className="text-sm text-gray-600">Turn on AI-powered assistance across the platform</p>
            </div>
            <button
              onClick={() => handleToggle('enableCopilot')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableCopilot ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableCopilot ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Features</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto Suggestions</p>
              <p className="text-sm text-gray-600">Automatically suggest tasks and actions</p>
            </div>
            <button
              onClick={() => handleToggle('autoSuggestions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSuggestions ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSuggestions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Context Awareness</p>
              <p className="text-sm text-gray-600">Use client data for personalized insights</p>
            </div>
            <button
              onClick={() => handleToggle('contextAwareness')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.contextAwareness ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.contextAwareness ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Risk Alerts</p>
              <p className="text-sm text-gray-600">Get notified about portfolio risks</p>
            </div>
            <button
              onClick={() => handleToggle('riskAlerts')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.riskAlerts ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.riskAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Compliance Checks</p>
              <p className="text-sm text-gray-600">Automatic compliance monitoring</p>
            </div>
            <button
              onClick={() => handleToggle('complianceChecks')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.complianceChecks ? 'bg-brand' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.complianceChecks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 space-y-6">
          <h3 className="font-semibold text-gray-900">AI Behavior</h3>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">Creativity Level</label>
              <span className="text-sm font-semibold text-brand">{settings.creativityLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.creativityLevel}
              onChange={(e) => handleSliderChange('creativityLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${settings.creativityLevel}%, rgb(229, 231, 235) ${settings.creativityLevel}%, rgb(229, 231, 235) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-gray-900">Response Speed</label>
              <span className="text-sm font-semibold text-brand">{settings.responseSpeed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.responseSpeed}
              onChange={(e) => handleSliderChange('responseSpeed', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${settings.responseSpeed}%, rgb(229, 231, 235) ${settings.responseSpeed}%, rgb(229, 231, 235) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Thorough</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 bg-blue-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">About AI Copilot</h4>
              <p className="text-sm text-gray-700">
                Your AI assistant learns from your preferences and adapts to your workflow. All data is encrypted and processed securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

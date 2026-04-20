import React from 'react';
import { Button } from '../ui';

interface AISuggestionBannerProps {
  suggestion: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
  };
  onApply: () => void;
  onDismiss: () => void;
}

export const AISuggestionBanner: React.FC<AISuggestionBannerProps> = ({
  suggestion,
  onApply,
  onDismiss,
}) => {
  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Suggestion</h3>
              <p className="text-sm text-gray-700">Based on recent client activity and compliance alerts</p>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-lg p-3 mb-3">
            <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Due: {suggestion.dueDate}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Priority: {suggestion.priority}
              </span>
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={onApply}>
            Apply Suggestion
          </Button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { SuggestedAction } from '../../types/chat';

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onSelect: (prompt: string) => void;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({ actions, onSelect }) => {
  return (
    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
      <p className="text-xs font-medium text-gray-600 mb-2">Suggested Questions:</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action.prompt)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:border-brand hover:text-brand hover:bg-blue-50 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

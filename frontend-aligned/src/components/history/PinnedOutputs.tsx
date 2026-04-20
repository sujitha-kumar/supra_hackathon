import React from 'react';
import { Card } from '../ui';
import type { PinnedOutput } from '../../types/session';

interface PinnedOutputsProps {
  outputs: PinnedOutput[];
}

export const PinnedOutputs: React.FC<PinnedOutputsProps> = ({ outputs }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (outputs.length === 0) {
    return null;
  }

  return (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
        </svg>
        <h3 className="font-semibold text-gray-900">Pinned Outputs</h3>
      </div>

      <div className="space-y-3">
        {outputs.map((output) => (
          <Card key={output.id} padding="sm" className="bg-white">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{output.title}</h4>
              <span className="text-xs text-gray-500">{formatDate(output.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{output.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

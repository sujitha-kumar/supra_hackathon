import React from 'react';

/**
 * QuickChips Component
 * Displays quick action chips above the chat input
 * Helps users quickly ask common questions
 */

const QuickChips = ({ onChipClick, isLoading = false }) => {
  const chips = [
    "What is this client's risk level?",
    'Should we rebalance this portfolio?',
    'How is the market today?',
    'Explain SIP underperformance',
  ];

  return (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onChipClick(chip)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickChips;

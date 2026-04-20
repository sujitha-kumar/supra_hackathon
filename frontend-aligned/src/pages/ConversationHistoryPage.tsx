import React, { useState } from 'react';
import { SessionList, SessionDetail, PinnedOutputs } from '../components/history';
import { mockSessions, mockPinnedOutputs } from '../data/mockSessions';

export const ConversationHistoryPage: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(mockSessions[0]?.id || null);

  const selectedSession = mockSessions.find((s) => s.id === selectedSessionId);
  const pinnedOutputsForSession = mockPinnedOutputs.filter(
    (output) => output.sessionId === selectedSessionId
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="w-96 border-r border-gray-200">
        <SessionList
          sessions={mockSessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedSession ? (
          <>
            {pinnedOutputsForSession.length > 0 && (
              <PinnedOutputs outputs={pinnedOutputsForSession} />
            )}
            <div className="flex-1 overflow-hidden">
              <SessionDetail session={selectedSession} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversation Selected</h3>
              <p className="text-gray-600">Select a conversation from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

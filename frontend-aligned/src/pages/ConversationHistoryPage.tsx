import React, { useState } from 'react';
import { SessionList, SessionDetail, PinnedOutputs } from '../components/history';
import { ListSkeleton } from '../components/ui/Skeleton';
import { useSessions, useSessionMessages } from '../hooks/useHistory';

export const ConversationHistoryPage: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { data: sessions = [], isLoading, isError } = useSessions();
  const { data: messages = [], isLoading: isLoadingMessages } = useSessionMessages(selectedSessionId);

  const selectedSession = selectedSessionId
    ? sessions.find((s) => s.id === selectedSessionId) ?? null
    : null;

  const sessionWithMessages = selectedSession
    ? { ...selectedSession, messages }
    : null;

  return (
    <div className="flex h-screen bg-white ml-64 overflow-hidden">
      <div className="w-96 border-r border-gray-200">
        {isLoading ? (
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation History</h2>
            <ListSkeleton items={5} />
          </div>
        ) : isError ? (
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation History</h2>
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              Failed to load sessions.
            </p>
          </div>
        ) : (
          <SessionList
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoadingMessages && selectedSessionId ? (
          <div className="p-6">
            <ListSkeleton items={3} />
          </div>
        ) : sessionWithMessages ? (
          <>
            {/* PinnedOutputs requires pinned flag — skip unless session is pinned */}
            {sessionWithMessages.isPinned && (
              <PinnedOutputs outputs={[]} />
            )}
            <div className="flex-1 overflow-hidden">
              <SessionDetail session={sessionWithMessages} />
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
              <p className="text-gray-600">
                {sessions.length === 0
                  ? 'No conversations yet. Start a chat to create history.'
                  : 'Select a conversation from the list to view details.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

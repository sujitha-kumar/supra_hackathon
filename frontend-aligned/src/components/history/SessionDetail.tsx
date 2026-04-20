import React from 'react';
import { ChatMessageList } from '../chat';
import { Badge } from '../ui';
import type { ChatSession } from '../../types/session';

interface SessionDetailProps {
  session: ChatSession;
}

export const SessionDetail: React.FC<SessionDetailProps> = ({ session }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{session.title}</h2>
              {session.isPinned && (
                <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
                </svg>
              )}
            </div>
            <p className="text-gray-600 mb-2">Client: {session.clientName}</p>
            <p className="text-sm text-gray-700">{session.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.tags.map((tag) => (
            <Badge key={tag} variant="brand" size="sm">
              {tag}
            </Badge>
          ))}
          <span className="text-sm text-gray-500 ml-auto">
            {new Intl.DateTimeFormat('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }).format(session.timestamp)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatMessageList messages={session.messages} />
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{session.messageCount} messages</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-lg hover:bg-blue-700 transition-colors">
              Continue Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

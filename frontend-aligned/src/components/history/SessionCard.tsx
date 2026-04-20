import React from 'react';
import { Badge } from '../ui';
import type { ChatSession } from '../../types/session';

interface SessionCardProps {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, isSelected, onClick }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? 'border-brand bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${isSelected ? 'text-brand' : 'text-gray-900'}`}>
              {session.title}
            </h3>
            {session.isPinned && (
              <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            )}
          </div>
          <p className="text-sm text-gray-600">{session.clientName}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{session.summary}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {session.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {session.messageCount}
          </span>
          <span>{formatDate(session.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PageWrapper } from '../components/layout';
import { Card, Input, Button } from '../components/ui';

export const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, sender: 'John Doe', text: 'Hey, how are you?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Me', text: 'I\'m good! Working on the new project.', time: '10:32 AM', isMe: true },
    { id: 3, sender: 'John Doe', text: 'Great! Let me know if you need any help.', time: '10:33 AM', isMe: false },
  ];

  return (
    <PageWrapper title="Chat" subtitle="Communicate with your team">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card padding="sm" className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 px-2">Conversations</h2>
          <div className="space-y-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  i === 1 ? 'bg-brand text-white' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    i === 1 ? 'bg-white/20' : 'bg-brand'
                  }`}>
                    <span className={`font-semibold text-sm ${i === 1 ? 'text-white' : 'text-white'}`}>
                      U{i}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${i === 1 ? 'text-white' : 'text-gray-900'}`}>
                      User {i}
                    </p>
                    <p className={`text-xs truncate ${i === 1 ? 'text-white/80' : 'text-gray-500'}`}>
                      Last message preview...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md" className="lg:col-span-3 flex flex-col h-[600px]">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md ${msg.isMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-xl ${
                      msg.isMe
                        ? 'bg-brand text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button variant="primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};

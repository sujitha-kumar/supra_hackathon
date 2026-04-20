import React, { useState } from 'react';
import { extendedMockClients } from '../../data/extendedMockClients';

interface ClientSearchInputProps {
  value: string;
  onChange: (clientName: string) => void;
}

export const ClientSearchInput: React.FC<ClientSearchInputProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);

  const filteredClients = extendedMockClients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (clientName: string) => {
    setSearchQuery(clientName);
    onChange(clientName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Client <span className="text-gray-400">(optional)</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a client..."
          className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && searchQuery && filteredClients.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredClients.slice(0, 5).map((client) => (
            <button
              key={client.id}
              onClick={() => handleSelect(client.name)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-brand to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.company}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

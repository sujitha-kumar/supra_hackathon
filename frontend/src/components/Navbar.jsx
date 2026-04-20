import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClientContext } from '../context/ClientContext';
import { searchClients } from '../services/api';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { setSelectedClient } = useContext(ClientContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchQuery.trim().length > 0) {
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchClients(searchQuery);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRiskPillStyle = (risk) => {
    const riskLower = risk?.toLowerCase() || '';
    if (riskLower.includes('conservative')) {
      return 'bg-green-100 text-green-800';
    } else if (riskLower.includes('moderate')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (riskLower.includes('aggressive')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setSearchQuery('');
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/copilot', label: 'Live Copilot' },
    { path: '/clients', label: 'Clients' },
  ];

  return (
    <nav className="bg-[#0F172A] h-14 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">FundsIndia</span>
          <span className="text-[#60A5FA] text-sm">RM Copilot</span>
        </div>

        <div className="hidden md:flex items-center flex-1 justify-center max-w-md mx-8" ref={searchRef}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                {searchResults.slice(0, 8).map((client) => (
                  <div
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(
                        client.name
                      )}`}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.phone}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskPillStyle(
                        client.risk_profile
                      )}`}
                    >
                      {client.risk_profile}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-[#60A5FA] border-b-2 border-[#60A5FA]'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-[#0F172A] border-t border-gray-700">
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setShowMobileMenu(false);
              }}
              className={`block w-full text-left px-4 py-3 text-sm font-medium ${
                isActive(link.path) ? 'text-[#60A5FA] bg-gray-800' : 'text-[#94A3B8]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

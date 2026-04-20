import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../context/ClientContext';
import { getClients } from '../services/api';
import { TrendingUp, TrendingDown, Users, AlertCircle, Calendar } from 'lucide-react';

export default function Clients() {
  const [clientsData, setClientsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedClient } = useContext(ClientContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getClients();
        setClientsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      return 'bg-[#DCFCE7] text-[#166534]';
    } else if (riskLower.includes('moderate')) {
      return 'bg-[#FEF3C7] text-[#92400E]';
    } else if (riskLower.includes('aggressive')) {
      return 'bg-[#FEE2E2] text-[#991B1B]';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const handleViewBrief = (client) => {
    setSelectedClient(client);
    navigate('/');
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    getClients()
      .then((data) => setClientsData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Clients Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Could not load clients
            </h2>
            <p className="text-gray-600 mb-6">Check your connection and try again</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Clients Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                <p className="text-3xl font-bold text-[#1E40AF]">
                  {clientsData?.stats?.total_clients || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-[#1E40AF] opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Need Attention</p>
                <p
                  className={`text-3xl font-bold ${
                    (clientsData?.stats?.need_attention || 0) > 0
                      ? 'text-[#991B1B]'
                      : 'text-gray-400'
                  }`}
                >
                  {clientsData?.stats?.need_attention || 0}
                </p>
              </div>
              <AlertCircle
                className={`w-12 h-12 opacity-20 ${
                  (clientsData?.stats?.need_attention || 0) > 0
                    ? 'text-[#991B1B]'
                    : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">SIPs This Week</p>
                <p className="text-3xl font-bold text-[#166534]">
                  {clientsData?.stats?.sips_this_week || 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-[#166534] opacity-20" />
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Returns %
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientsData?.clients?.map((client) => {
                  const returnPct = parseFloat(client.return_pct);
                  const isPositive = returnPct >= 0;

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(
                              client.name
                            )}`}
                          >
                            {getInitials(client.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {client.name}
                            </div>
                            <div className="text-xs text-gray-500">{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.total_invested_fmt}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.total_current_fmt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            isPositive
                              ? 'bg-[#DCFCE7] text-[#166534]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {client.return_pct}%
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskPillStyle(
                            client.risk_profile
                          )}`}
                        >
                          {client.risk_profile}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm ${
                            client.days_since_contact > 30
                              ? 'text-[#991B1B] font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {client.days_since_contact !== null
                            ? `${client.days_since_contact} days ago`
                            : 'Never'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {client.needs_attention ? (
                          <span className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-medium rounded-full">
                            Needs attention
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewBrief(client)}
                          className="px-4 py-2 bg-[#1E40AF] text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          View brief
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

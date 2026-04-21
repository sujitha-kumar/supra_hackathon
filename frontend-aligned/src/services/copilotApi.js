import axios from 'axios';

// Use localhost for development, fallback to environment variable for production
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://hackathon-backend-xgn6.onrender.com'
);

const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Copilot API Service
 * Handles all chat, rule engine, and client search requests
 */

const copilotApi = {
  /**
   * POST /api/copilot/chat
   * Send a chat message with smart routing
   */
  async sendCopilotMessage({
    message,
    clientId = null,
    clientData = null,
    sessionId = null,
    language = 'en',
  }) {
    try {
      const response = await api.post('/api/copilot/chat', {
        message,
        clientId,
        clientData,
        sessionId,
        language,
      });
      return response.data;
    } catch (error) {
      console.error('Copilot message error:', error);
      throw error;
    }
  },

  /**
   * POST /api/rule-engine/analyze
   * Run rule engine analysis on client data
   */
  async analyzeWithRuleEngine(clientDataOrId) {
    try {
      const payload =
        typeof clientDataOrId === 'string'
          ? { clientId: clientDataOrId }
          : { clientData: clientDataOrId };

      const response = await api.post('/api/rule-engine/analyze', payload);
      return response.data.data;
    } catch (error) {
      console.error('Rule engine analysis error:', error);
      throw error;
    }
  },

  /**
   * GET /api/clients/search?name=Rahul
   * Search for clients by name
   */
  async searchClients(name) {
    try {
      const response = await api.get('/api/clients/search', {
        params: { name },
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Client search error:', error);
      throw error;
    }
  },

  /**
   * POST /api/copilot/chat with web search enabled
   * For market/news questions that need live data
   */
  async searchWebAndAnswer(message, clientData = null) {
    try {
      const response = await api.post('/api/copilot/chat', {
        message,
        clientData,
        route: 'WEB_SEARCH',
      });
      return response.data;
    } catch (error) {
      console.error('Web search error:', error);
      throw error;
    }
  },
};

export default copilotApi;

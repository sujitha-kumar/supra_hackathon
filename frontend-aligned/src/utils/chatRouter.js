/**
 * Smart Chat Router (Frontend)
 * Routes messages to appropriate handler based on content
 */

class ChatRouter {
  constructor() {
    this.portfolioKeywords = [
      'portfolio',
      'sip',
      'fund',
      'return',
      'loss',
      'profit',
      'rebalance',
      'equity',
      'debt',
      'risk',
      'allocation',
      'performance',
      'nav',
      'investment',
      'goal',
      'benchmark',
      'holding',
      'folio',
      'asset',
      'exposure',
    ];

    this.webSearchKeywords = [
      'market',
      'nifty',
      'sensex',
      'news',
      'today',
      'war',
      'rbi',
      'interest rate',
      'inflation',
      'economy',
      'budget',
      'weather',
      'current',
      'latest',
      'now',
      'happening',
      'live',
      'trending',
      'stock',
      'index',
      'fed',
      'rate',
      'policy',
    ];
  }

  /**
   * Route a message to appropriate handler
   * Returns: 'PORTFOLIO' | 'WEB_SEARCH' | 'CLIENT_DETECT' | 'GENERAL'
   */
  routeMessage(message, hasClientContext = false) {
    const msgLower = message.toLowerCase();

    // Check if message contains client name patterns
    if (this.detectClientName(message)) {
      return 'CLIENT_DETECT';
    }

    // Check if it's a portfolio question
    if (
      this.portfolioKeywords.some((k) => msgLower.includes(k)) &&
      hasClientContext
    ) {
      return 'PORTFOLIO';
    }

    // Check if it's a web search question
    if (this.webSearchKeywords.some((k) => msgLower.includes(k))) {
      return 'WEB_SEARCH';
    }

    // Default to general question
    return 'GENERAL';
  }

  /**
   * Detect if message contains a client name
   * Simple heuristic: capitalized words that look like names
   */
  detectClientName(message) {
    // Check for patterns like "Rahul", "Sharma", "Mr. Rahul Sharma", etc.
    const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g;
    const names = message.match(namePattern);

    if (!names || names.length === 0) return false;

    // If message contains multiple capital words (like "Rahul Sharma"), likely a name
    if (names.length >= 2) return true;

    // Check for keywords that indicate we're talking about a specific client
    const contextKeywords = [
      'client',
      'account',
      'customer',
      'mr',
      'ms',
      'mrs',
      'portfolio',
      'analysis',
      'review',
    ];
    return contextKeywords.some((k) => message.toLowerCase().includes(k));
  }

  /**
   * Extract likely client name from message
   */
  extractClientName(message) {
    const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/;
    const match = message.match(namePattern);
    return match ? match[0] : null;
  }

  /**
   * Check if message contains JSON data (client data pasted directly)
   */
  isJsonData(message) {
    const trimmed = message.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ? true
      : false;
  }

  /**
   * Parse JSON from message
   */
  parseJsonData(message) {
    try {
      return JSON.parse(message.trim());
    } catch (e) {
      return null;
    }
  }

  /**
   * Get route info with metadata
   */
  getRouteInfo(message, hasClientContext = false) {
    const route = this.routeMessage(message, hasClientContext);

    return {
      route,
      clientName: route === 'CLIENT_DETECT' ? this.extractClientName(message) : null,
      hasJsonData: this.isJsonData(message),
      jsonData: this.isJsonData(message) ? this.parseJsonData(message) : null,
      confidence: this.getConfidence(route),
    };
  }

  /**
   * Confidence score for routing decision
   */
  getConfidence(route) {
    const confidences = {
      CLIENT_DETECT: 0.85,
      PORTFOLIO: 0.88,
      WEB_SEARCH: 0.80,
      GENERAL: 0.70,
    };
    return confidences[route] || 0.70;
  }
}

// Export singleton instance
export default new ChatRouter();

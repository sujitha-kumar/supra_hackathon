/**
 * Rule Engine API Routes
 * POST /api/rule-engine/analyze - Analyze client data with rule engine
 */

const express = require('express');
const ruleEngine = require('../services/ruleEngine');

const router = express.Router();

/**
 * POST /api/rule-engine/analyze
 * Analyzes client portfolio data using the rule engine
 *
 * Request body:
 * - Option 1: { clientId: "uuid" } - fetch from DB
 * - Option 2: { clientData: {...} } - use provided data
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { clientId, clientData } = req.body;

    if (!clientId && !clientData) {
      return res.status(400).json({
        error: 'Either clientId or clientData is required',
      });
    }

    let dataToAnalyze = clientData;

    // If clientId provided, fetch from Supabase
    if (clientId && !clientData) {
      // TODO: Fetch client data from database
      // For now, return error
      return res.status(501).json({
        error: 'Client ID lookup not yet implemented. Provide clientData instead.',
      });
    }

    // Validate required fields in clientData
    if (!dataToAnalyze.client_id) {
      dataToAnalyze.client_id = dataToAnalyze.client_id || 'temp_client_' + Date.now();
    }

    // Run rule engine
    const output = ruleEngine.analyzeClient(dataToAnalyze);

    res.json({
      success: true,
      data: output,
    });
  } catch (error) {
    console.error('Rule engine error:', error);
    next(error);
  }
});

module.exports = router;

/**
 * Client Search Routes
 * GET /api/clients/search?name=Rahul - Search for clients by name
 */

const express = require('express');
const router = express.Router();

// TODO: Import client repository when converting to JS
// const { clientRepository } = require('../repositories');

/**
 * GET /api/clients/search?name=Rahul
 * Search for clients by name (for smart client detection in chat)
 */
router.get('/search', async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Name query must be at least 2 characters',
      });
    }

    // TODO: Implement search in Supabase
    // const results = await clientRepository.searchByName(name);

    // Mock response for now
    const mockResults = [
      {
        id: 1,
        name: 'Rahul Sharma',
        type: 'HNI',
        status: 'active',
        risk_profile: 'Moderate',
        portfolio_value: 5000000,
        last_contacted_at: '2026-04-15T10:30:00Z',
        equity_pct: 72,
        debt_pct: 16,
        hybrid_pct: 8,
        cash_pct: 4,
      },
    ];

    const filtered = mockResults.filter((c) =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('Client search error:', error);
    next(error);
  }
});

module.exports = router;

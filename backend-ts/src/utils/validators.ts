import { body, query, param } from 'express-validator';

export const clientValidators = {
  getClients: [
    query('segment').optional().isString(),
    query('risk_profile').optional().isIn(['low', 'medium', 'high', 'very-high']),
    query('search').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  getClientById: [
    param('id').isString().notEmpty(),
  ],
  getPerformance: [
    param('id').isString().notEmpty(),
    query('period').optional().isIn(['6M', '1Y', 'ALL']),
  ],
  getTransactions: [
    param('id').isString().notEmpty(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
};

export const taskValidators = {
  getTasks: [
    query('status').optional().isIn(['pending', 'in-progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('client_id').optional().isString().notEmpty(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  createTask: [
    body('client_id').optional().isString().notEmpty(),
    body('title').isString().notEmpty().trim(),
    body('description').isString().notEmpty().trim(),
    body('priority').isIn(['low', 'medium', 'high', 'urgent']),
    body('due_date').isISO8601(),
    body('assignee').optional().isString().trim(),
    body('tags').optional().isArray(),
  ],
  toggleTask: [
    param('id').isString().notEmpty(),
  ],
  deleteTask: [
    param('id').isString().notEmpty(),
  ],
};

export const chatValidators = {
  createSession: [
    body('client_id').optional().isString().notEmpty(),
    body('title').optional().isString().trim(),
  ],
  getMessages: [
    param('sessionId').isString().notEmpty(),
  ],
  sendMessage: [
    body('session_id').isString().notEmpty(),
    body('message').isString().notEmpty().trim(),
    body('client_id').optional().isString().notEmpty(),
    body('language').optional().isIn(['english', 'hindi', 'tamil', 'telugu', 'kannada']),
  ],
  translateMessage: [
    body('text').isString().notEmpty().trim(),
    body('language').isIn(['english', 'hindi', 'tamil', 'telugu', 'kannada']),
  ],
};

export const analyticsValidators = {
  getAUMTrend: [
    query('period').optional().isIn(['6M', '1Y', 'ALL']),
  ],
};

import { Router } from 'express';
import { CopilotController } from '../controllers/copilot.controller';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const controller = new CopilotController();

router.get('/insights', controller.getInsights);

router.post(
  '/task-suggestion',
  [body('client_id').isInt({ min: 1 })],
  validateRequest,
  controller.getTaskSuggestions
);

export default router;

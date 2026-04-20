import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { chatValidators } from '../utils/validators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const controller = new ChatController();

router.post('/session', chatValidators.createSession, validateRequest, controller.createSession);
router.post('/sessions', chatValidators.createSession, validateRequest, controller.createSession);
router.get('/sessions', controller.getSessions);
router.get('/sessions/:sessionId/messages', chatValidators.getMessages, validateRequest, controller.getSessionMessages);
router.post('/message', chatValidators.sendMessage, validateRequest, controller.sendMessage);

export default router;

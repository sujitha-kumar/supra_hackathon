import { Router } from 'express';
import clientRoutes from './client.routes';
import taskRoutes from './task.routes';
import chatRoutes from './chat.routes';
import analyticsRoutes from './analytics.routes';
import copilotRoutes from './copilot.routes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ruleEngineRoutes = require('./ruleEngine.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const clientSearchRoutes = require('./clientSearch.js');

const router = Router();

router.use('/clients', clientRoutes);
router.use('/clients', clientSearchRoutes);
router.use('/tasks', taskRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/copilot', copilotRoutes);
router.use('/rule-engine', ruleEngineRoutes);

export default router;

import { Router } from 'express';
import clientRoutes from './client.routes';
import taskRoutes from './task.routes';
import chatRoutes from './chat.routes';
import analyticsRoutes from './analytics.routes';
import copilotRoutes from './copilot.routes';

const router = Router();

router.use('/clients', clientRoutes);
router.use('/tasks', taskRoutes);
router.use('/chat', chatRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/copilot', copilotRoutes);

export default router;

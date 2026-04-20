import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { analyticsValidators } from '../utils/validators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const controller = new AnalyticsController();

router.get('/dashboard', controller.getDashboard);
router.get('/aum-trend', analyticsValidators.getAUMTrend, validateRequest, controller.getAUMTrend);
router.get('/funnel', controller.getFunnel);
router.get('/insights', controller.getInsights);

export default router;

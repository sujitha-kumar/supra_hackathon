import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { clientValidators } from '../utils/validators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const controller = new ClientController();

router.get('/', clientValidators.getClients, validateRequest, controller.getClients);
router.get('/:id', clientValidators.getClientById, validateRequest, controller.getClientById);
router.get('/:id/profile', clientValidators.getClientById, validateRequest, controller.getClientProfile);
router.get('/:id/portfolio', clientValidators.getClientById, validateRequest, controller.getClientPortfolio);
router.get('/:id/performance', clientValidators.getClientById, validateRequest, controller.getClientPerformance);
router.get('/:id/interactions', clientValidators.getClientById, validateRequest, controller.getClientInteractions);
router.get('/:id/brief', clientValidators.getClientById, validateRequest, controller.getClientBrief);

export default router;

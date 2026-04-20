import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { taskValidators } from '../utils/validators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const controller = new TaskController();

router.get('/', taskValidators.getTasks, validateRequest, controller.getTasks);
router.post('/', taskValidators.createTask, validateRequest, controller.createTask);
router.patch('/:id/toggle', taskValidators.toggleTask, validateRequest, controller.toggleTask);
router.delete('/:id', taskValidators.deleteTask, validateRequest, controller.deleteTask);

export default router;

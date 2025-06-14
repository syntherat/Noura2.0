import express from 'express';
import multer from 'multer';
import PlannerController from '../controllers/plannerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Apply auth middleware to all planner routes
router.use(authMiddleware);

router.post('/', upload.single('file'), PlannerController.createPlan);
router.get('/', PlannerController.getPlans);
router.get('/:id', PlannerController.getPlan);
router.delete('/:id', PlannerController.deletePlan);
router.patch('/schedule/:id', PlannerController.updateScheduleItem);

export default router;
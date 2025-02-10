// backend/src/routes/stats.routes.ts

import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';

const router = Router();

router.get('/dashboard', statsController.getDashboardStats);
router.get('/email-events', statsController.getEmailEvents);

export default router;
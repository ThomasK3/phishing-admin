// backend/src/routes/campaign.routes.ts

import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';
import type { RequestHandler } from 'express';

const router = Router();

// Přetypování controllerů na RequestHandler
const { 
  getAll, 
  create, 
  getById, 
  update, 
  delete: deleteController 
} = campaignController as Record<string, RequestHandler>;

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteController);  // přejmenováno z 'delete', protože je to rezervované slovo

export default router;
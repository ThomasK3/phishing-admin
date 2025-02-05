// backend/src/routes/group.routes.ts 

import { Router } from 'express';
import { groupController } from '../controllers/group.controller';
import type { RequestHandler } from 'express';

const router = Router();

const {
  getAll,
  create,
  getById,
  update,
  delete: deleteGroup
} = groupController as Record<string, RequestHandler>;

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteGroup);

export default router;
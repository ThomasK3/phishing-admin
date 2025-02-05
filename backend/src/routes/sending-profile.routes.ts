// src/routes/sending-profile.routes.ts
import { Router } from 'express';
import { sendingProfileController } from '../controllers/sending-profile.controller';
import type { RequestHandler } from 'express';

const router = Router();

const {
  getAll,
  create,
  getById,
  update,
  delete: deleteProfile
} = sendingProfileController as Record<string, RequestHandler>;

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteProfile);

router.post(
  '/:id/test-connection',
  sendingProfileController.testConnection as RequestHandler
);
router.post(
  '/:id/test-email', 
  sendingProfileController.testEmail as RequestHandler
);

export default router;
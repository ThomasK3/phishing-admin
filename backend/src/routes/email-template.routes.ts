// src/routes/email-template.routes.ts
import { Router } from 'express';
import { emailTemplateController } from '../controllers/email-template.controller';
import type { RequestHandler } from 'express';

const router = Router();

const {
  getAll,
  create, 
  getById,
  update,
  delete: deleteTemplate
} = emailTemplateController as Record<string, RequestHandler>;

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deleteTemplate);

export default router;
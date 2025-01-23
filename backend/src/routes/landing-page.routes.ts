// src/routes/landing-page.routes.ts
import { Router } from 'express';
import { landingPageController } from '../controllers/landing-page.controller';
import type { RequestHandler } from 'express';

const router = Router();

// Přetypování controllerů na RequestHandler
const { 
  getAll, 
  create, 
  getById, 
  update, 
  delete: deletePage,
  incrementVisits,
  incrementSubmissions 
} = landingPageController as Record<string, RequestHandler>;

router.get('/', getAll);
router.post('/', create); 
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', deletePage);
router.post('/:id/visits', incrementVisits);
router.post('/:id/submissions', incrementSubmissions);

export default router;
import { Router } from 'express';
import { campaignController } from '../controllers/campaign.controller';

const router = Router();

router.get('/', campaignController.getAll);
router.post('/', campaignController.create);
router.get('/:id', campaignController.getById);
router.put('/:id', campaignController.update);
router.delete('/:id', campaignController.delete);

export default router;
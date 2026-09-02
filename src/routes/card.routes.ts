import { Router } from 'express';
import { validateCardHandler } from '../controllers/card.controller';

const router = Router();

router.post('/validate-card', validateCardHandler);

export default router;

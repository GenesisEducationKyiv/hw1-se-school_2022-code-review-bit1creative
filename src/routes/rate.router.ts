import express from 'express';
import { RateController } from '../controllers/rate.controller';

const router = express.Router();

router.get('/rate', RateController.getRateBTCUAHController);

export default router;

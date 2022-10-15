import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/status', (req: Request, res: Response) => {
    res.status(200).send({ status: true });
});

export default router;

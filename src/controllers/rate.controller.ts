import { Request, Response, NextFunction } from 'express';
import { RateErrors } from '../constants/errors';
import { RateService } from '../services/rate/rate.service';

export class RateController {
    static getRateBTCUAHController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const price = await RateService.getRateBTCUAHService();
            if (!!price) return res.status(200).send(price);
            return res.status(400).send(RateErrors.rateFetchFail);
        } catch (err) {
            next(err);
        }
    };
}

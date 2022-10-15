import { Request, Response, NextFunction } from 'express';
import * as EmailService from '../services/email/email.service';
import { LocalStorageErrors } from '../constants/errors';
import { EmailRouterRes } from '../constants/responses';

export class EmailController {
    static subscribe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { email } = req.query;
            const { error, email: resEmail } =
                await EmailService._EmailsDBRepository.addEmailToDB(
                    email as string
                );

            if (error) {
                if (error === LocalStorageErrors.ValueAlreadyExists) {
                    return res.status(403).send(resEmail);
                }
                throw new Error(EmailRouterRes.EmailAddError);
            }
            return res.status(200).send(EmailRouterRes.EmailAddSuccess);
        } catch (err) {
            next(err);
        }
    };

    static sendEmails = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { status, message } = await EmailService.sendEmails();
            res.status(status).send(message);
        } catch (err) {
            next(err);
        }
    };
}

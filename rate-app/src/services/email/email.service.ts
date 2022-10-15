import LocalDBStorage, { ILocalDBStorage } from '../../libs/fs';
import { sendEmailsNodemailer } from '../../libs/nodemailer';

import { GetEmailsFromDB, IEmailsDBRepository } from './email.interfaces';
import { EmailErrors, LocalStorageErrors } from '../../constants/errors';
import { parseEmails } from './helpers';
import { RateService } from '../rate/rate.service';

class EmailsDBRepository implements IEmailsDBRepository {
    private _localDBStorage: ILocalDBStorage;

    constructor(localStorage: ILocalDBStorage) {
        this._localDBStorage = localStorage;
    }

    async addEmailToDB(email: string): Promise<GetEmailsFromDB> {
        try {
            const _email = await this._localDBStorage.write(email);
            return { error: null, email: _email };
        } catch (error: any) {
            if (error?.cause === LocalStorageErrors.ValueAlreadyExists) {
                return { error: error.message, email: error.cause };
            }
            return { error: error.message, email: email };
        }
    }

    async getEmailsFromDB(): Promise<string> {
        return await this._localDBStorage.read();
    }
}

export const _EmailsDBRepository = new EmailsDBRepository(LocalDBStorage);

export const sendEmails = async () => {
    const rate = await RateService.getRateBTCUAHService();
    const emails = await _EmailsDBRepository.getEmailsFromDB();
    const emailsArray = parseEmails(emails);

    if (rate && emails.length) {
        const info = await sendEmailsNodemailer(rate, emailsArray);
        if (info.rejected.length !== emailsArray.length) {
            return { status: 200, message: 'E-mailʼи відправлено' };
        }
    }
    throw new Error(EmailErrors.DidntSent);
};

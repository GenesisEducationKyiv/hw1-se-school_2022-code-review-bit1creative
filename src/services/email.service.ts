import LocalDBStorage, { ILocalDBStorage } from '../libs/fs';
import { getRateBTCUAH_Binance } from '../api/binance';
import { sendEmailsNodemailer } from '../libs/nodemailer';

import { pathToFileDB, pathToFolderDB } from '../config';
import { EmailErrors, LocalStorageErrors } from '../constants/errors';
import { parseEmails } from './helpers';

type GetEmailsFromDB = {
    error: null | string;
    email: string;
};

interface IEmailsDBRepository {
    addEmailToDB(email: string): Promise<GetEmailsFromDB>;
    getEmailsFromDB(): Promise<string>;
}

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
    const { price } = await getRateBTCUAH_Binance();
    const emails = await _EmailsDBRepository.getEmailsFromDB();
    const emailsArray = parseEmails(emails);

    if (price && emails.length) {
        const info = await sendEmailsNodemailer(price, emailsArray);
        if (info.rejected.length !== emailsArray.length) {
            return { status: 200, message: 'E-mailʼи відправлено' };
        }
    }
    throw new Error(EmailErrors.DidntSent);
};

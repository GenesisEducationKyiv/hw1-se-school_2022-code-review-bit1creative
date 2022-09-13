import fs from 'fs';
import { getEmailsFromDB, fsCreateDB, fsAddEmailToDB } from '../libs/fs';
import { getRateBTCUAH } from '../api/binance';
import { sendEmailsNodemailer } from '../libs/nodemailer';

import { pathToFileDB, pathToFolderDB } from '../constants/essentials';
import { EmailErrors } from '../constants/errors';
import { parseEmails } from './helpers';

export const addEmailToDB = async (email: string) => {
    const emails = await getEmailsFromDB();
    const emailsArray = parseEmails(emails);

    if (!emailsArray.length) {
        await fsCreateDB(pathToFolderDB);
    }

    if (emailsArray.includes(email)) return { status: 409, message: email };

    await fsAddEmailToDB(pathToFileDB, `,${email}`);
    return { status: 200, message: 'E-mail додано' };
};

export const sendEmails = async () => {
    const { price } = await getRateBTCUAH();
    const emails = await getEmailsFromDB();
    const emailsArray = parseEmails(emails);

    if (price && emails.length) {
        const info = await sendEmailsNodemailer(price, emailsArray);
        if (info.rejected.length !== emailsArray.length) {
            return { status: 200, message: 'E-mailʼи відправлено' };
        }
    }
    throw new Error(EmailErrors.didntSent);
};

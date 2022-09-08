import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
    FALLBACK_AUTH_EMAIL,
    FALLBACK_APP_PASS,
} from '../constants/nodemailer';

export const sendEmailsNodemailer = async (rate: string, emails: string[]) => {
    const authEmail = process.env.GMAIL_AUTH_MAIL ?? FALLBACK_AUTH_EMAIL;
    const pass = process.env.GMAIL_APP_PASS ?? FALLBACK_APP_PASS;

    const template = createMailTemplate(rate);

    const transporter = createNodemailerTransport(authEmail, pass);

    const info = await sendEmails({
        transporter,
        authEmail,
        emails,
        rate,
        template,
    });

    return info;
};

const createMailTemplate = (rate: string) => `<b>BTC/UAH: ${rate}</b>`;

const createNodemailerTransport = (mail: string, pass: string) =>
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mail,
            pass: pass,
        },
    });

type SendEmails = {
    transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    authEmail: string;
    emails: string[];
    rate: string;
    template: string;
};

const sendEmails = async ({
    transporter,
    authEmail,
    emails,
    rate,
    template,
}: SendEmails) =>
    await transporter.sendMail({
        from: `"Genesis School" <${authEmail}>`,
        to: emails,
        subject: 'BTCUAH Rate',
        text: rate,
        html: template,
    });

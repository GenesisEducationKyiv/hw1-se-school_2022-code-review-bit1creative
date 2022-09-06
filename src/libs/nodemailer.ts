import * as nodemailer from 'nodemailer';

const mailTemplate = (rate: string) => `<b>BTC/UAH: ${rate}</b>`;

export const sendEmails = async (rate: string, emailsArray: string[]) => {
    const authMail = process.env.GMAIL_AUTH_MAIL;
    const pass = process.env.GMAIL_APP_PASS;
    const template = mailTemplate(rate);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: authMail,
            pass: pass,
        },
    });

    const info = await transporter.sendMail({
        from: `"Genesis School" <${authMail}>`,
        to: emailsArray,
        subject: 'BTCUAH Rate',
        text: rate,
        html: template,
    });

    return info;
};

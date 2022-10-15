import { sendEmailsNodemailer } from '../nodemailer';

const OLD_ENV = process.env;
const rate = '22000';
const emailsArray = ['email1@gmail.com', 'email2@gmail.com'];
const mockSendMailReturn = { message: 'sent' };

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        // cannot path var here because jest hoists all mocks
        sendMail: jest.fn().mockReturnValue({ message: 'sent' }),
    }),
}));

beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
});

describe('Nodemailer lib tests', () => {
    it('Send emails', async () => {
        process.env.GMAIL_AUTH_MAIL = 'gmailauth@gmail.com';
        process.env.GMAIL_APP_PASS = 'gmailpass';

        const res = await sendEmailsNodemailer(rate, emailsArray);

        expect(res).toStrictEqual(mockSendMailReturn);
    });
});

import request from 'supertest';
import fs, { promises } from 'fs';
import nock from 'nock';
import App from '../../../app';
import * as nodemailer from '../../../libs/nodemailer';

import { pathToFileDB, pathToFolderDB } from '../../../constants/essentials';
import { EmailErrors } from '../../../constants/errors';
import { binanceUri } from '../../../constants/essentials';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const mockedEmailsInDB = 'email1@gmail.com,email2@gmail.com';
const mockedExistsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
jest.spyOn(promises, 'readFile').mockReturnValue(
    new Promise((res, rej) => res(mockedEmailsInDB))
);

beforeAll(() => {
    jest.restoreAllMocks();
    fs.rmSync(pathToFolderDB, { recursive: true, force: true });
});

afterEach(() => {
    jest.clearAllMocks();
    fs.rmSync(pathToFolderDB, { recursive: true, force: true });
});

afterAll(() => {
    fs.rmSync(pathToFolderDB, { recursive: true, force: true });
});

describe('[integration test] - Email route', () => {
    describe('route `subscribe`', () => {
        it('works fine', async () => {
            await request(App)
                .post('/subscribe')
                .query({ email: 'email@gmail.com' })
                .expect(200)
                .then((response) => {
                    expect(response.text).toStrictEqual('E-mail додано');
                });
        });

        it('throws an error if email was not provided', async () => {
            await request(App)
                .post('/subscribe')
                .expect(500)
                .catch((err) =>
                    expect(err.message).toStrictEqual(
                        EmailErrors.noEmailProvided
                    )
                );
        });

        it('throws an error if wrong email format', async () => {
            await request(App)
                .post('/subscribe')
                .query({ email: 'email' })
                .expect(500)
                .catch((err) =>
                    expect(err.message).toStrictEqual(
                        EmailErrors.badEmailFormat
                    )
                );
        });

        it('returns 409 if email already in DB', async () => {
            fs.rmSync(pathToFolderDB, { recursive: true, force: true });
            const mockEmail = 'email@gmail.com';

            await fs.promises.mkdir(pathToFolderDB);
            await fs.promises.writeFile(pathToFileDB, mockEmail);

            await request(App)
                .post('/subscribe')
                .query({ email: mockEmail })
                .expect(409)
                .then((response) =>
                    expect(response.text).toStrictEqual(mockEmail)
                );
        });
    });

    describe('route `sendEmails`', () => {
        const mockedBinanceRes = { symbol: 'BTCUAH', price: '20000' };

        beforeEach(() => {
            nock(binanceUri)
                .get('/ticker/price')
                .query({ symbol: 'BTCUAH' })
                .reply(200, mockedBinanceRes);
        });

        it('works fine', async () => {
            fs.rmSync(pathToFolderDB, { recursive: true, force: true });
            const mockEmail = 'email@gmail.com';

            await fs.promises.mkdir(pathToFolderDB);
            await fs.promises.writeFile(pathToFileDB, mockEmail);

            jest.spyOn(nodemailer, 'sendEmails').mockReturnValue(
                new Promise((res, rej) =>
                    res({
                        rejected: [],
                        envelope: {
                            from: false,
                            to: [''],
                        },
                        messageId: '',
                        accepted: [''],
                        pending: [''],
                        response: '',
                    } as SMTPTransport.SentMessageInfo)
                )
            );

            await request(App).post('/sendEmails').expect(200);
        });

        it('throws error if emails wasnt sent', async () => {
            fs.rmSync(pathToFolderDB, { recursive: true, force: true });
            const mockEmail = 'email@gmail.com';

            await fs.promises.mkdir(pathToFolderDB);
            await fs.promises.writeFile(pathToFileDB, mockEmail);

            jest.spyOn(nodemailer, 'sendEmails').mockReturnValue(
                new Promise((res, rej) =>
                    res({
                        rejected: [mockEmail],
                        envelope: {
                            from: false,
                            to: [''],
                        },
                        messageId: '',
                        accepted: [''],
                        pending: [''],
                        response: '',
                    } as SMTPTransport.SentMessageInfo)
                )
            );

            await request(App)
                .post('/sendEmails')
                .expect(500)
                .catch((err) =>
                    expect(err.message).toStrictEqual(EmailErrors.didntSent)
                );
        });
    });
});

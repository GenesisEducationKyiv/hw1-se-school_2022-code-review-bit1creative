import fs, { promises } from 'fs';
import { getEmailsFromDB } from '../fs';

const mockedEmailsInDB = 'email@gmail.com,email2@gmail.com';
const mockedExistsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

beforeAll(() => {
    jest.resetAllMocks();
})

afterAll(() => {
    jest.resetAllMocks();
});

describe('fs lib test', () => {
    it('returns an empty array if there is no db (folder with file)', async () => {
        const emails = await getEmailsFromDB();

        expect(emails).toStrictEqual('');
    });

    it('returns parsed emails', async () => {
        jest.spyOn(promises, 'readFile').mockReturnValue(
            new Promise((res, rej) => res(mockedEmailsInDB))
        );
        mockedExistsSyncSpy.mockReturnValue(true);

        const emails = await getEmailsFromDB();

        expect(emails).toStrictEqual(mockedEmailsInDB);
    });
});

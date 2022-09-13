import { existsSync } from 'fs';
import { mkdir, appendFile, readFile } from 'fs/promises';

import { pathToFolderDB, pathToFileDB } from '../constants/essentials';

export const getEmailsFromDB = async () => {
    if (existsSync(pathToFolderDB)) {
        return await fsReadDB(pathToFileDB);
    }
    return '';
};

const fsReadDB = async (path: string) => {
    return await readFile(path, {
        encoding: 'utf8',
        flag: 'r',
    });
};

export const fsCreateDB = async (path: string) => {
    await mkdir(path, { recursive: true });
};

export const fsAddEmailToDB = async (path: string, email: string) => {
    await appendFile(path, `,${email}`);
};

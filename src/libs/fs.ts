import { existsSync, read } from 'fs';
import { mkdir, appendFile, readFile } from 'fs/promises';
import { LocalStorageErrors } from '../constants/errors';

import { pathToFolderDB, pathToFileDB } from '../config';

export interface ILocalDBStorage {
    write(value: string): Promise<string>;
    read(): Promise<string>;
}

class LocalDBStorage implements ILocalDBStorage {
    private _pathToFolderDB: string;
    private _pathToFileDB: string;

    constructor(pathToFolderDB: string, pathToFileDB: string) {
        this._pathToFolderDB = pathToFolderDB;
        this._pathToFileDB = pathToFileDB;
    }

    async write(value: string): Promise<string> {
        const data = await this.read();
        if (!data.length) {
            this.fsCreateFolder(this._pathToFolderDB);
        }

        if (data.includes(value)) {
            throw new Error(LocalStorageErrors.ValueAlreadyExists, {
                //@ts-ignore
                cause: value,
            });
        }

        return await this.fsWrite(this._pathToFileDB, value);
    }

    async read(): Promise<string> {
        if (existsSync(this._pathToFileDB)) {
            return await this.fsReadFile(this._pathToFileDB);
        }
        return '';
    }

    private async fsReadFile(path: string): Promise<string> {
        return await readFile(path, {
            encoding: 'utf8',
            flag: 'r',
        });
    }

    private async fsCreateFolder(path: string): Promise<void> {
        await mkdir(path, { recursive: true });
    }

    private async fsWrite(path: string, data: string): Promise<string> {
        await appendFile(path, `,${data}`);
        return data;
    }
}

export default new LocalDBStorage(pathToFolderDB, pathToFileDB);

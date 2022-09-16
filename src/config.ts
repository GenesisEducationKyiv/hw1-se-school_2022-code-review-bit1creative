import path from 'path';

// crypto providers
export const binanceUri = 'https://api.binance.com/api/v3';
export const coinapiUri = 'https://rest.coinapi.io/v1';

export enum cryptoCurrencyProviders {
    default = 'COINAPI',
    binance = 'BINANCE',
    coinapi = 'COINAPI',
}

// local db
export const pathToFolderDB = path.join(__dirname, './data');
export const pathToFileDB = path.join(pathToFolderDB, 'emails.txt');

// cashing
export const cacheTTL = 5 * 60; // 5 minutes
export const cacheRateKeyBTCUAH = 'BTCUAH';

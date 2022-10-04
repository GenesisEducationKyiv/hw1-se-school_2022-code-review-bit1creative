import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

interface ENV {
    PORT: number | undefined;
    GMAIL_AUTH_MAIL: string | undefined;
    GMAIL_APP_PASS: string | undefined;
    CRYPTO_CURRENCY_PROVIDER: string | undefined;
    COIN_API_KEY: string | undefined;
}

interface Config {
    PORT: number;
    GMAIL_AUTH_MAIL: string;
    GMAIL_APP_PASS: string;
    CRYPTO_CURRENCY_PROVIDER: string;
    COIN_API_KEY: string;
    BINANCE_URI: string;
    COINAPI_URI: string;
    PATH_TO_FILE_DB: string;
    PATH_TO_FOLDER_DB: string;
    CACHE_TTL: number;
    CACHE_RATE_KEY_BTCUAH: string;
    CRYPTO_CURRENCY_PROVIDERS: { [key: string]: string };
}

const generateEnvConfig = () => ({
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    GMAIL_AUTH_MAIL: process.env.GMAIL_AUTH_MAIL,
    GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
    CRYPTO_CURRENCY_PROVIDER: process.env.CRYPTO_CURRENCY_PROVIDER,
    COIN_API_KEY: process.env.COIN_API_KEY,
});

const getSanitzedConfig = (envConfig: ENV): Config => {
    for (const [key, value] of Object.entries(envConfig)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }

    const config = Object.create(envConfig);

    config.BINANCE_URI = 'https://api.binance.com/api/v3';
    config.COINAPI_URI = 'https://rest.coinapi.io/v1';
    config.PATH_TO_FILE_DB = path.join(__dirname, './data');
    config.PATH_TO_FOLDER_DB = path.join(config.PATH_TO_FILE_DB, 'emails.txt');
    config.CACHE_TTL = 5 * 60; // 5 minutes
    config.CACHE_RATE_KEY_BTCUAH = 'BTCUAH';
    config.CRYPTO_CURRENCY_PROVIDERS = {
        default: 'COINAPI',
        binance: 'BINANCE',
        coinapi: 'COINAPI',
    };

    return config as Config;
};

const envConfig = generateEnvConfig();

const config = getSanitzedConfig(envConfig);

export default config as Config;

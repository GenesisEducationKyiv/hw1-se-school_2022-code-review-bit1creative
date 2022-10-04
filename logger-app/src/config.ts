import dotenv from 'dotenv';
dotenv.config();

interface ENV {
    PORT: number | undefined;
}

interface Config {
    PORT: number;
}

const generateEnvConfig = () => ({
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
});

const getSanitzedConfig = (envConfig: ENV): Config => {
    for (const [key, value] of Object.entries(envConfig)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }

    const config = Object.create(envConfig);

    return config as Config;
};

const envConfig = generateEnvConfig();

const config = getSanitzedConfig(envConfig);

export default config as Config;

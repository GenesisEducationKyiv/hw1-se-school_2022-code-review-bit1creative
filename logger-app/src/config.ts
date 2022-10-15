import dotenv from 'dotenv';
dotenv.config();

interface ENV {
  PORT: number | undefined;
  RABBITMQ_URL: string | undefined;
  RABBITMQ_PORT: string | undefined;
  RABBITMQ_ERROR_CHANNEL: string | undefined;
  RABBITMQ_EVENT_CHANNEL: string | undefined;
}

interface Config {
  PORT: number;
  RABBITMQ_URL: string;
  RABBITMQ_PORT: string;
  RABBITMQ_ERROR_CHANNEL: string;
  RABBITMQ_EVENT_CHANNEL: string;
}

const generateEnvConfig = () => ({
  PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  RABBITMQ_PORT: process.env.RABBITMQ_PORT,
  RABBITMQ_ERROR_CHANNEL: process.env.RABBITMQ_ERROR_CHANNEL,
  RABBITMQ_EVENT_CHANNEL: process.env.RABBITMQ_EVENT_CHANNEL
});

const getSanitizedConfig = (envConfig: ENV): Config => {
  for (const [key, value] of Object.entries(envConfig)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  const config = Object.create(envConfig);

  return config as Config;
};

const envConfig = generateEnvConfig();

const config = getSanitizedConfig(envConfig);

export default config as Config;

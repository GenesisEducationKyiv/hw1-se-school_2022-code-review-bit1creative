import config from './config';
import { RabbitMQChannel } from './libs/rabbitMQ';

export const initAMQP = async () => {
  const channel = await new RabbitMQChannel();

  await channel.assertQueue(config.RABBITMQ_ERROR_CHANNEL, { durable: false });
  await channel.assertQueue(config.RABBITMQ_EVENT_CHANNEL, { durable: false });

  console.log('AMQP Connected and Set-up');
};

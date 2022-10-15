import config from './config';
import {
    consumerCurryConstructor,
    RabbitMQChannelConsumer,
} from './libs/rabbitMQ';
import { ErrorLoggerAMQP } from './logger/error';
import { EventLoggerAMQP } from './logger/event';

const AMQPErrorLogger = new ErrorLoggerAMQP();
const AMQPEventLogger = new EventLoggerAMQP();

export const initAMQP = async () => {
    const consumer = await new RabbitMQChannelConsumer();

    await consumer.assertQueue(config.RABBITMQ_ERROR_CHANNEL, {
        durable: false,
    });
    await consumer.assertQueue(config.RABBITMQ_EVENT_CHANNEL, {
        durable: false,
    });

    const consumerCurry = consumerCurryConstructor(await consumer.getChannel());

    consumer.consume(
        config.RABBITMQ_ERROR_CHANNEL,
        consumerCurry(AMQPErrorLogger.parseAndLog)
    );

    consumer.consume(
        config.RABBITMQ_EVENT_CHANNEL,
        consumerCurry(AMQPEventLogger.parseAndLog)
    );

    console.log('AMQP Connected and Set-up');
};

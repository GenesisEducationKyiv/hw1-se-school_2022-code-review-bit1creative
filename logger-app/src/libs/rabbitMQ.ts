import client, { Connection, Channel, ConsumeMessage } from 'amqplib';
import config from '../config';

interface IRabbitMQChannel {
    getChannel(): Promise<Channel>;
    assertQueue(queueName: string, ...args: any[]): Promise<void>;
}

interface IRabbitMQChannelConsumer extends IRabbitMQChannel {
    consume(queueName: string, queueHandler: QueueHandler): Promise<void>;
}

export class RabbitMQChannel implements IRabbitMQChannel {
    private static instance: Channel | null = null;

    constructor() {}

    public async getChannel(): Promise<Channel> {
        if (!RabbitMQChannel.instance) {
            RabbitMQChannel.instance = await new RabbitMQChannel().init();
        }

        return RabbitMQChannel.instance;
    }

    private async init(): Promise<Channel> {
        const connection: Connection = await client.connect(
            `${config.RABBITMQ_URL}:${config.RABBITMQ_PORT}`
        );
        const channel: Channel = await connection.createChannel();

        return channel;
    }

    public async assertQueue(queueName: string, ...args: any[]) {
        const channel = await this.getChannel();
        await channel.assertQueue(queueName, ...args);
    }
}

type QueueHandler = (msg: ConsumeMessage | null) => void;

export class RabbitMQChannelConsumer
    extends RabbitMQChannel
    implements IRabbitMQChannelConsumer
{
    constructor() {
        super();
    }

    public async consume(
        queueName: string,
        queueHandler: QueueHandler
    ): Promise<void> {
        const channel = await super.getChannel();
        channel.consume(queueName, queueHandler);
    }
}

export const consumerCurryConstructor =
    (channel: Channel) =>
    (msgHandler: (msg: ConsumeMessage | null, channel: Channel) => void) =>
    (msg: ConsumeMessage | null) => {
        msgHandler(msg, channel);
    };

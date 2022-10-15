import client, { Connection, Channel, ConsumeMessage } from 'amqplib';
import config from '../config';

interface IRabbitMQChannel {
    getChannel(): Promise<Channel>;
    assertQueue(queueName: string, ...args: any[]): Promise<void>;
}

export interface IRabbitMQChannelPublisher extends IRabbitMQChannel {
    sendMessage(queueName: string, message: Buffer): Promise<void>;
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

export class RabbitMQChannelPublisher
    extends RabbitMQChannel
    implements IRabbitMQChannelPublisher
{
    constructor() {
        super();
    }

    public async sendMessage(
        queueName: string,
        message: Buffer
    ): Promise<void> {
        const channel = await super.getChannel();
        channel.sendToQueue(queueName, message);
    }
}

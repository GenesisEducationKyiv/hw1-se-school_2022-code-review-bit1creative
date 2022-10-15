import config from '../../config';
import { IRabbitMQChannelPublisher } from '../../libs/rabbitMQ';
import { IRateFetcherChain, RateFetcherApiRes } from './rate.interfaces';

class RateFetcherDecorator implements IRateFetcherChain {
    protected fetcher: IRateFetcherChain;

    constructor(fetcher: IRateFetcherChain) {
        this.fetcher = fetcher;
    }

    public getRate(): Promise<RateFetcherApiRes> {
        return this.fetcher.getRate();
    }

    public setNext(nextRateFetchChain: IRateFetcherChain) {
        this.fetcher.setNext(nextRateFetchChain);

        return this.fetcher;
    }
}

export class RateLogger extends RateFetcherDecorator {
    private logger: IRabbitMQChannelPublisher | null = null;

    constructor(fetcher: IRateFetcherChain, logger: IRabbitMQChannelPublisher) {
        super(fetcher);
        this.logger = logger;
    }

    public getRate(): Promise<RateFetcherApiRes> {
        if (this.logger) {
            const message = {
                service: 'RATE APP',
                name: 'get rate request',
            };

            this.logger.sendMessage(
                config.RABBITMQ_EVENT_CHANNEL,
                Buffer.from(JSON.stringify(message))
            );
        }
        return super.getRate();
    }
}

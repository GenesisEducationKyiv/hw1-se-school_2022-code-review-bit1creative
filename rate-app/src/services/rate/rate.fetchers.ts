import { getRateBTCUAH_Binance } from '../../api/binance';
import { getRateBTCUAH_CoinApi } from '../../api/coinapi';
import config from '../../config';
import { RabbitMQChannelPublisher } from '../../libs/rabbitMQ';
import { RateLogger } from './rate.fetcher-decorator';
import {
    IRateFetcherChain,
    IRateFetcherCreator,
    RateFetcherChain,
} from './rate.interfaces';
import { RateFetcherProxy } from './rate.proxy';

class RateFetcherBinance extends RateFetcherChain {
    async getRate() {
        try {
            const { price } = await getRateBTCUAH_Binance();
            return { rate: price, error: null };
        } catch (error) {
            return await super.getRate();
        }
    }
}
class RateFetcherCoinApi extends RateFetcherChain {
    async getRate() {
        try {
            const { rate } = await getRateBTCUAH_CoinApi();
            return { rate: String(rate), error: null };
        } catch (error) {
            return await super.getRate();
        }
    }
}

// Can be replaced with some API later
class FallBackFetcher extends RateFetcherChain {
    async getRate() {
        return { rate: String(0), error: null };
    }
}

class RateFetcherCreator implements IRateFetcherCreator {
    private fetchers: Map<string, IRateFetcherChain> = new Map();

    constructor() {}

    register(name: string, fetcher: IRateFetcherChain) {
        if (!this.fetchers.has(name)) {
            this.fetchers.set(name, fetcher);
            fetcher.setNext(new FallBackFetcher());
        }
    }

    getFetcher(name: string) {
        return this.fetchers.get(name) ?? new FallBackFetcher();
    }
}

const RateFetcher = new RateFetcherCreator();

RateFetcher.register(
    config.CRYPTO_CURRENCY_PROVIDERS.binance,
    new RateLogger(
        new RateFetcherProxy(new RateFetcherBinance()),
        new RabbitMQChannelPublisher()
    )
);
RateFetcher.register(
    config.CRYPTO_CURRENCY_PROVIDERS.coinapi,
    new RateLogger(
        new RateFetcherProxy(new RateFetcherCoinApi()),
        new RabbitMQChannelPublisher()
    )
);

export default RateFetcher;

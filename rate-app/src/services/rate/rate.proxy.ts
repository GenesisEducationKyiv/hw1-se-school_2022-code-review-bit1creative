import { IRateFetcherChain } from './rate.interfaces';
import { MemoryNodeCache } from '../../libs/node-cache';
import config from '../../config';

export class RateFetcherProxy implements IRateFetcherChain {
    private fetcher: IRateFetcherChain;

    constructor(fetcher: IRateFetcherChain) {
        this.fetcher = fetcher;
    }

    public async getRate() {
        const cachedRate = this.getCachedRate();
        if (cachedRate) {
            return { rate: cachedRate, error: null };
        }

        const { rate, error } = await this.fetcher.getRate();

        if (rate) {
            this.setCachedRate(rate);
        }

        return { rate, error };
    }

    public setNext(nextRateFetchChain: IRateFetcherChain): IRateFetcherChain {
        return this.fetcher.setNext(nextRateFetchChain);
    }

    private getCachedRate() {
        return MemoryNodeCache.getValue(config.CACHE_RATE_KEY_BTCUAH);
    }

    private setCachedRate(rate: string) {
        MemoryNodeCache.setValue(config.CACHE_RATE_KEY_BTCUAH, rate);
    }
}

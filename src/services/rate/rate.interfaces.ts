import { getRateBTCUAH_Binance } from '../../api/binance';
import { getRateBTCUAH_CoinApi } from '../../api/coinapi';
import { RateErrors } from '../../constants/errors';
import { cacheRateKeyBTCUAH, cryptoCurrencyProviders } from '../../config';
import { MemoryNodeCache } from '../../libs/node-cache';
import { Observer } from './rate-observer';

type RateFetcherApiRes = { rate: string | null; error: any | null };

interface IRateFetcher {
    getRate(): Promise<RateFetcherApiRes>;
}

interface IRateFetcherChain extends IRateFetcher {
    setNext(nextRateFetchChain: IRateFetcherChain): IRateFetcherChain;
}

export interface IRateFetcherChainWithObserver extends IRateFetcherChain {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

//!
//TODO use decorator here
//!

export abstract class RateFetcherChain
    implements IRateFetcherChainWithObserver
{
    private fetcher: IRateFetcherChainWithObserver;
    private observers: Observer[] = [];

    public async getRate() {
        if (this.fetcher) {
            this.fetcher.attach(Observer.getObserver());
            this.notify();
            return await this.fetcher.getRate();
        }

        return {
            rate: null,
            error: new Error(RateErrors.rateFetchFail) as any,
        };
    }

    public setNext(fetcher: IRateFetcherChainWithObserver) {
        this.fetcher = fetcher;

        return fetcher;
    }

    public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        
        if (isExist) {
            return;
        }

        this.observers.push(observer);
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return;
        }

        this.observers.splice(observerIndex, 1);
    }

    public notify(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

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

class CacheRateFetcher extends RateFetcherChain {
    async getRate() {
        const cachedRate = MemoryNodeCache.getValue(cacheRateKeyBTCUAH);
        if (!cachedRate) {
            const requestRate = await super.getRate();
            if (requestRate.rate?.length) {
                MemoryNodeCache.setValue(cacheRateKeyBTCUAH, requestRate.rate);
            }
            return requestRate;
        }

        return { rate: cachedRate, error: null };
    }
}

export class RateFetcherCreator {
    static rateFetcher(service: string) {
        const cacheFetcher = new CacheRateFetcher();
        let fetcher: IRateFetcherChainWithObserver;

        switch (service) {
            case cryptoCurrencyProviders.binance:
                fetcher = new RateFetcherBinance();
                break;
            case cryptoCurrencyProviders.coinapi:
                fetcher = new RateFetcherCoinApi();
                break;
            default:
                fetcher = new RateFetcherBinance();
                break;
        }

        fetcher.setNext(new FallBackFetcher());
        cacheFetcher.setNext(fetcher);

        return cacheFetcher;
    }
}

import { RateErrors } from '../../constants/errors';

export type RateFetcherApiRes = { rate: string | null; error: any | null };

export interface IRateFetcher {
    getRate(): Promise<RateFetcherApiRes>;
}

export interface IRateFetcherChain extends IRateFetcher {
    setNext(nextRateFetchChain: IRateFetcherChain): IRateFetcherChain;
}

export abstract class RateFetcherChain implements IRateFetcherChain {
    private fetcher: IRateFetcherChain;

    public async getRate() {
        if (this.fetcher) {
            return await this.fetcher.getRate();
        }

        return {
            rate: null,
            error: new Error(RateErrors.rateFetchFail) as any,
        };
    }

    public setNext(fetcher: IRateFetcherChain) {
        this.fetcher = fetcher;

        return fetcher;
    }
}

export interface IRateFetcherCreator {
    register(name: string, fetcher: IRateFetcherChain): void;
    getFetcher(name: string): IRateFetcherChain;
}

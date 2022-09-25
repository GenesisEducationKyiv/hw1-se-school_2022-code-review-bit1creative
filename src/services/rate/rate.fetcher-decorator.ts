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
    public getRate(): Promise<RateFetcherApiRes> {
        console.log('GET RATE PROCESSING...');
        return super.getRate();
    }
}

import { cryptoCurrencyProviders } from '../../config';
import { RateFetcherCreator } from './rate.interfaces';

export class RateService {
    static getRateBTCUAHService = async () => {
        const service =
            process.env.CRYPTO_CURRENCY_PROVIDER ||
            cryptoCurrencyProviders.default;

        const { rate, error } = await RateFetcherCreator.rateFetcher(
            service
        ).getRate();

        if (error) throw new Error(error.message);

        return rate;
    };
}

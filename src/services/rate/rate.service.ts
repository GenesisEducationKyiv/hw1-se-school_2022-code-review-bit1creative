import config from '../../config';
import RateFetcher from './rate.fetchers';

export class RateService {
    static getRateBTCUAHService = async () => {
        const service =
            process.env.CRYPTO_CURRENCY_PROVIDER ||
            config.CRYPTO_CURRENCY_PROVIDERS.default;

        const { rate, error } = await RateFetcher.getFetcher(service).getRate();

        if (error) throw new Error(error.message);

        return rate;
    };
}

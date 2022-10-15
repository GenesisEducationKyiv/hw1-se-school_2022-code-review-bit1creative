import axios from 'axios';
import { coinApiResponseSchema } from '../schemas/rate.schema';
import config from '../config';

export const getRateBTCUAH_CoinApi = async () => {
    const API_KEY = config.COIN_API_KEY;

    const { data } = await axios({
        method: 'GET',
        url: `${config.COINAPI_URI}/exchangerate/BTC/UAH`,
        headers: {
            'X-CoinAPI-Key': API_KEY,
        },
    });

    return coinApiResponseSchema.parse(data);
};

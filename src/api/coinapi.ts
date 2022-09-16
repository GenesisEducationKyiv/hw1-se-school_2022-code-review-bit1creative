import axios from 'axios';
import { coinApiResponseSchema } from '../schemas/rate.schema';
import { coinapiUri } from '../config';

export const getRateBTCUAH_CoinApi = async () => {
    const API_KEY = process.env.COIN_API_KEY!;

    const { data } = await axios({
        method: 'GET',
        url: `${coinapiUri}/exchangerate/BTC/UAH`,
        headers: {
            'X-CoinAPI-Key': API_KEY,
        },
    });

    return coinApiResponseSchema.parse(data);
};

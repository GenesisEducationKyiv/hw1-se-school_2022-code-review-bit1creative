import axios from 'axios';

import { binanceRateResponseSchema } from '../schemas/rate.schema';
import { binanceUri } from '../config';

export const getRateBTCUAH_Binance = async () => {
    const { data } = await axios({
        method: 'GET',
        url: `${binanceUri}/ticker/price`,
        params: {
            symbol: 'BTCUAH',
        },
    });

    return binanceRateResponseSchema.parse(data);
};

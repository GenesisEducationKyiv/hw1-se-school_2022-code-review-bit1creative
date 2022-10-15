import axios from 'axios';

import { binanceRateResponseSchema } from '../schemas/rate.schema';
import config from '../config';

export const getRateBTCUAH_Binance = async () => {
    const { data } = await axios({
        method: 'GET',
        url: `${config.BINANCE_URI}/ticker/price`,
        params: {
            symbol: 'BTCUAH',
        },
    });

    return binanceRateResponseSchema.parse(data);
};

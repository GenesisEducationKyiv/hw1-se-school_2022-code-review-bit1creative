import nock from 'nock';
import { getRateBTCUAH } from '../binance';
import { binanceUri } from '../../constants/essentials';

const mockedBinanceRes = { symbol: 'BTCUAH', price: '20000' };

describe('binance api', () => {
    it('returns validated response', async () => {
        nock(binanceUri)
            .get('/ticker/price')
            .query({ symbol: 'BTCUAH' })
            .reply(200, mockedBinanceRes);

        const res = await getRateBTCUAH();

        expect(res).toStrictEqual(mockedBinanceRes);
    });
});

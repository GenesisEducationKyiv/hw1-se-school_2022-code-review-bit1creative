import request from 'supertest';
import nock from 'nock';
import App from '../../../app';

import { binanceUri } from '../../../config';
import { RateErrors } from '../../../constants/errors';

const mockedBinanceRes = { symbol: 'BTCUAH', price: '20000' };

beforeAll(() => {
    jest.restoreAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('[integration test] - Rate route', () => {
    it('works fine', async () => {
        nock(binanceUri)
            .get('/ticker/price')
            .query({ symbol: 'BTCUAH' })
            .reply(200, mockedBinanceRes);

        await request(App)
            .get('/rate')
            .expect(200)
            .then((response) => {
                expect(response.text).toStrictEqual(mockedBinanceRes.price);
            });
    });

    it('throws error if binance api went crazy', async () => {
        nock(binanceUri)
            .get('/ticker/price')
            .query({ symbol: 'BTCUAH' })
            .reply(200, {});

        await request(App)
            .get('/rate')
            .expect(500)
            .catch((err) =>
                expect(err.message).toStrictEqual(RateErrors.rateFetchFail)
            );
    });
});

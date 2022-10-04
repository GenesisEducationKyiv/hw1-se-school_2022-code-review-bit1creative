import App from '../../app';
import request from 'supertest';

afterEach(() => {
    jest.clearAllMocks();
});

describe('Status route', () => {
    it('Sends response with status 200 and status: true', async () => {
        const response = await request(App).get('/status');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(JSON.stringify({ status: true }));
    });
});

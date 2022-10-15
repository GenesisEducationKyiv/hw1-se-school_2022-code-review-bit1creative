import { errorHandlerMiddleware } from '../error.middleware';
import { mockAxiosError } from '../../mocks/axios';
import { mockReq, mockRes, mockNext } from '../../mocks/express';

const mockedAxiosError = mockAxiosError({
    name: 'error',
    message: 'error',
    status: '500',
});

const mockedRes = mockRes();
const mockedReq = mockReq();
const mockedNext = mockNext();

describe('Error middleware', () => {
    it('Catches the error and sends a response with its status and message', async () => {
        await errorHandlerMiddleware(
            mockedAxiosError,
            mockedReq,
            mockedRes,
            mockedNext
        );

        expect(mockedRes.status).toBeCalledWith(+mockedAxiosError.status!);
        expect(mockedRes.send).toBeCalledWith(mockedAxiosError.message);
    });
});

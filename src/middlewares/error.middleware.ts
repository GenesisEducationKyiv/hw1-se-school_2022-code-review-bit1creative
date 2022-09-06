import { NextFunction, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';

export const errorHandlerMiddleware = (
    error: Error | AxiosError,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    let status = 400;
    if(axios.isAxiosError(error)) {
        status = Number(error.status) ?? 400;
    }
    response.status(status).send(error.message);
};

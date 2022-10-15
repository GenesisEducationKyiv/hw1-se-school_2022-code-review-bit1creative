import { NextFunction, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { RabbitMQChannelPublisher } from '../libs/rabbitMQ';
import config from '../config';

export const errorHandlerMiddleware = (
    error: Error | AxiosError,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    let status = 400;
    if (axios.isAxiosError(error)) {
        status = Number(error.status) ?? 400;
    }
    try {
        const errorPublisher = new RabbitMQChannelPublisher();
        const errorMsg = {
            service: 'RATE APP',
            name: error.name,
            message: error.message,
            statusCode: status,
            ...(!!error.cause && { cause: error.cause }),
            ...(!!error.stack && { stack: error.stack }),
        };
        errorPublisher.sendMessage(
            config.RABBITMQ_ERROR_CHANNEL,
            Buffer.from(JSON.stringify(errorMsg))
        );
    } catch {
    } finally {
        response.status(status).send(error.message);
    }
};

import { Channel, ConsumeMessage } from 'amqplib';
import Logger, { ILogInfo } from './basic';

interface IErrorLogger {
    log(error: string): void;
}

export interface IErrorInfo extends ILogInfo {
    name: string;
    message: string;
    statusCode?: number;
    cause?: string;
    stack?: string;
}

class _ErrorLogger extends Logger implements IErrorLogger {
    constructor() {
        super();
    }

    log(errorInfo: string) {
        console.error(errorInfo);
    }

    protected buildLog(errorInfo: IErrorInfo) {
        const baseErrorLog = `ERROR: [${errorInfo.service}] - ${
            errorInfo.statusCode ?? ''
        } ${errorInfo.name} - ${errorInfo.message}`;

        const stack = !!errorInfo.stack ? `- at ${errorInfo.stack}` : '';
        const cause = !!errorInfo.cause ? `- cause: ${errorInfo.cause}` : '';
        const date = `- ${new Date().toISOString()}`;

        return [baseErrorLog, stack, cause, date].join(' ').trim();
    }
}

export class ErrorLoggerAMQP extends _ErrorLogger {
    constructor() {
        super();
    }

    parseAndLog(msg: ConsumeMessage | null, channel: Channel) {
        if (msg) {
            try {
                const message = JSON.parse(
                    msg.content.toString()
                ) as IErrorInfo;

                super.log(super.buildLog(message));
                channel.ack(msg);
            } catch {
                const errorInfo: IErrorInfo = {
                    name: 'buffer parsing error',
                    message: 'error while trying to log error',
                    service: 'Logger App',
                    cause: msg.content.toString(),
                };

                ErrorLogger.log(super.buildLog(errorInfo));
            }
        }
    }
}

export const ErrorLogger = new _ErrorLogger();

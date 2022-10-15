import { Channel, ConsumeMessage } from 'amqplib';
import Logger, { ILogInfo } from './basic';
import { ErrorLogger, IErrorInfo } from './error';

interface IEventLogger {
    log(error: string): void;
}

interface IEventInfo extends ILogInfo {
    name: string;
    info?: string;
}

class EventLogger extends Logger implements IEventLogger {
    constructor() {
        super();
    }

    log(eventInfo: string) {
        console.log(eventInfo);
    }

    protected buildLog(eventInfo: IEventInfo) {
        const baseEventLog = `[${eventInfo.service}] - ${eventInfo.name}`;

        const info = !!eventInfo.info ? `- ${eventInfo.info}` : '';
        const date = `- ${new Date().toISOString()}`;

        return [baseEventLog, info, date].join(' ').trim();
    }
}

export class EventLoggerAMQP extends EventLogger {
    constructor() {
        super();
    }

    parseAndLog(msg: ConsumeMessage | null, channel: Channel) {
        if (msg) {
            try {
                const message = JSON.parse(
                    msg.content.toString()
                ) as IEventInfo;

                super.log(super.buildLog(message));
                channel.ack(msg);
            } catch {
                const errorInfo: IErrorInfo = {
                    name: 'buffer parsing error',
                    message: 'error while trying to log event',
                    service: 'Logger App',
                };

                ErrorLogger.log(super.buildLog(errorInfo));
            }
        }
    }
}

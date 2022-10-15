export interface ILogInfo {
    service: string;
}

interface ILogger {
    log(logInfo: string): void;
}

export default abstract class Logger implements ILogger {
    constructor() {}

    abstract log(logInfo: string): void;

    protected abstract buildLog(logDetails: ILogInfo): void;
}

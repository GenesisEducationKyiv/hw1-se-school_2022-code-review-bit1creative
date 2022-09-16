import { Logger } from '../../utils/logger';
import {
    IRateFetcherChainWithObserver,
    RateFetcherChain,
} from './rate.interfaces';

export interface Observer {
    update(subject: IRateFetcherChainWithObserver): void;
}

export class Observer implements Observer {
    private static _observer: Observer;

    private constructor() {}

    public static getObserver(): Observer {
        if (!Observer._observer) {
            Observer._observer = new Observer();
        }

        return Observer._observer;
    }
    
    public update(subject: IRateFetcherChainWithObserver): void {
        if (subject instanceof RateFetcherChain) {
            Logger.log('Requesting for the Rate');
        }
    }
}

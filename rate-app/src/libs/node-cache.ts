import NodeCache from 'node-cache';
import config from '../config';

interface IMemoryNodeCacheStatic {
    getValue(key: string): string | undefined;
    setValue(key: string, value: string): string | undefined;
}

function fulfillInterfaceWithStatic<T>() {
    return <U extends T>(constructor: U) => {
        constructor;
    };
}

@fulfillInterfaceWithStatic<IMemoryNodeCacheStatic>()
export class MemoryNodeCache {
    private static _cache: NodeCache;

    private constructor() {}

    private static initCache(): NodeCache {
        if (!MemoryNodeCache._cache) {
            MemoryNodeCache._cache = new NodeCache({
                stdTTL: config.CACHE_TTL,
            });
        }

        return MemoryNodeCache._cache;
    }

    public static getValue(key: string) {
        MemoryNodeCache.initCache();
        return MemoryNodeCache._cache.get<string>(key);
    }

    public static setValue(key: string, value: string) {
        MemoryNodeCache.initCache();
        const success = MemoryNodeCache._cache.set(key, value);
        if (success) {
            return value;
        }
        return undefined;
    }
}

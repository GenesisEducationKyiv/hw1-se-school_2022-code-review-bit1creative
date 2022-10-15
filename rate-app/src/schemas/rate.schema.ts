import { z } from 'zod';

export const binanceRateResponseSchema = z.object({
    symbol: z.string(),
    price: z.string(),
});

export const coinApiResponseSchema = z.object({
    time: z.string(),
    asset_id_base: z.string(),
    asset_id_quote: z.string(),
    rate: z.number(),
});

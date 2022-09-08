import dotenv from 'dotenv';
import express, { Express } from 'express';

import statusRouter from './routes/status.router';
import emailRouter from './routes/email.router';
import rateRouter from './routes/rate.router';

import { errorHandlerMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app: Express = express();

app.use(errorHandlerMiddleware);

app.use(statusRouter);
app.use(emailRouter);
app.use(rateRouter);

export default app;

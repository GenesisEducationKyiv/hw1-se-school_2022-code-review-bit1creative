import express, { Express } from 'express';

import statusRouter from './routes/status.router';

// import { errorHandlerMiddleware } from './middlewares/error.middleware';

const app: Express = express();

// app.use(errorHandlerMiddleware);

app.use(statusRouter);

export default app;

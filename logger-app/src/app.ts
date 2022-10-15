import express, { Express } from 'express';

import statusRouter from './routes/status.router';

const app: Express = express();

app.use(statusRouter);

export default app;

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import 'express-async-errors';
import { apiRoutes } from './routes';
import { errorHandlerMiddleware } from './middleware/errorHandler';

export const app: Application = express();


app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-cron-key'],
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(pinoHttp());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandlerMiddleware);

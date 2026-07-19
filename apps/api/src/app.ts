import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import 'express-async-errors';
import { apiRoutes } from './routes';
import { errorHandlerMiddleware } from './middleware/errorHandler';

export const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(pinoHttp());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandlerMiddleware);

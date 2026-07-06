import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { logger } from './utils/logger';
import { cronService } from '@/services/cronService';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

const gracefulShutdown = () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('Server gracefully shut down.');
    process.exit(0);
  });

  cronService.start();
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: 'Something went wrong',
    error:
      process.env.NODE_ENV === 'production' ? 'Production Error' : err.message,
  });
};

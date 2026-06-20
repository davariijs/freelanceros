import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';

export const logger = pino({
  level: isTest
    ? 'silent'
    : process.env.NODE_ENV === 'production'
      ? 'info'
      : 'debug',
  transport: isTest
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      },
});

import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isTest ? 'silent' : isProd ? 'info' : 'debug',
  transport:
    isTest || isProd
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
});

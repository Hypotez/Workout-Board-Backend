import env from '../config/env';

const loggerSetup = {
  level: env.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
};

export default loggerSetup;

import env from '../config/env';
import pino from 'pino';

const logger = pino({
  level: env.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export const userServiceLogger = logger.child({ route: 'user' });
export const authServiceLogger = logger.child({ route: 'auth' });
export const settingsServiceLogger = logger.child({ route: 'settings' });

export const databaseLogger = logger.child({ service: 'database' });
export const httpClientLogger = logger.child({ service: 'httpClient' });

export default logger;

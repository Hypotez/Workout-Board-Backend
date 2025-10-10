import env from '../config/env';
import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    colorize({ all: false }),
    timestamp(),
    errors({ stack: true }),
    printf((info) => {
      if (info.stack) {
        return `[${info.timestamp}] [${info.level}]: ${info.stack}`;
      }
      return `[${info.timestamp}] [${info.level}]: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});

export default logger;

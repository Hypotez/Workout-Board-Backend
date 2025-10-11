import express from 'express';
import cors from 'cors';

import env from './config/env';

import { apiResponseMiddleware, cookieAuth } from './middleware/middleware';
import logger from './logger/logger';
import user from './routes/user';
import auth from './routes/auth';
import HevyClient from './service/hevy/hevyClient';
import DatabaseService from './service/db';

import { Service } from './types/service';
import { ResponseHelpers } from './types/express';

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;
const FRONTEND_URL = env.FRONTEND_URL;

declare module 'express-serve-static-core' {
  export interface Request {
    service: Service;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Response extends ResponseHelpers {}
}

async function startServer() {
  const DB = new DatabaseService();

  await DB.initialize();

  const app = express();

  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(apiResponseMiddleware);

  app.use((req, _, next) => {
    req.service = {
      hevyClient: new HevyClient(),
      db: DB,
    };

    next();
  });

  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', cookieAuth, user);

  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT} NODE_ENV=${NODE_ENV}`);
  });
}

startServer();

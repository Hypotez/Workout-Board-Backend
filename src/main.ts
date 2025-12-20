import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

import env from './config/env';

import logger from './logger/logger';
import user from './routes/user';
import auth from './routes/auth';
import settings from './routes/settings';
import HevyClient from './service/hevy/hevyClient';
import DatabaseService from './service/db';

import { Service } from './types/service';

//import { ResponseHelpers } from './types/express';

const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;
const FRONTEND_URL = env.FRONTEND_URL;

declare module 'fastify' {
  interface FastifyRequest {
    service: Service;
    userId: string | null;
  }
}
/*
declare module 'express-serve-static-core' {
  export interface Request {
    service: Service;
    userId: string | null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Response extends ResponseHelpers {}
}
*/

async function startServer() {
  const DB = new DatabaseService();
  await DB.initialize();

  const fastify = Fastify();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(cors, {
    origin: FRONTEND_URL,
    credentials: true,
  });

  await fastify.register(cookie);

  /*
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(apiResponseMiddleware);
  app.use(cookieParser());

  app.use((req, _, next) => {
    req.service = {
      hevyClient: new HevyClient(),
      db: DB,
    };

    req.userId = null;

    next();
  });
  */

  fastify.addHook('preHandler', async (request) => {
    logger.info('inside first prehandler');
    request.service = {
      hevyClient: new HevyClient(),
      db: DB,
    };

    request.userId = null;
  });

  await fastify.register(auth, { prefix: '/api/v1/auth' });
  await fastify.register(user, { prefix: '/api/v1/user' });
  await fastify.register(settings, { prefix: '/api/v1/settings' });

  fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`Server is running on ${address} NODE_ENV=${NODE_ENV}`);
  });

  /*
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', cookieAuth, attachUserId, user);
  app.use('/api/v1/settings', cookieAuth, attachUserId, settings);

  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT} NODE_ENV=${NODE_ENV}`);
  });
  */
}

startServer();

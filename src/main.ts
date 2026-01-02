import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import env from './config/env';

import user from './routes/user';
import auth from './routes/auth';
import settings from './routes/settings';
import HevyClient from './service/hevy/hevyClient';
import DatabaseService from './service/db';

import loggerSetup from './config/logger';

import { Service } from './types/service';

const PORT = env.PORT;
const FRONTEND_URL = env.FRONTEND_URL;

declare module 'fastify' {
  interface FastifyRequest {
    service: Service;
    userId: string | null;
  }
}

async function startServer() {
  const DB = new DatabaseService();
  await DB.initialize();

  const fastify = Fastify({
    logger: loggerSetup,
  });

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Workout Board API',
        summary: 'API documentation for the Workout Board application',
        description: 'API documentation for the Workout Board application',
        version: '1.0.0',
      },
      security: [{ cookieAuth: [] }],
      tags: [
        {
          name: 'Authentication',
          description: 'Endpoints related to user authentication',
        },
        {
          name: 'User',
          description: 'Endpoints related to user information',
        },
        {
          name: 'Settings',
          description: 'Endpoints related to user settings',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'access_token',
            description:
              'Cookie-based auth. Use /api/v1/auth/login (Try it out) to receive the cookies to use some of the locked requests.',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  fastify.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
  });

  await fastify.register(cors, {
    origin: FRONTEND_URL,
    credentials: true,
  });

  await fastify.register(cookie);

  fastify.addHook('preHandler', async (request) => {
    if (request.url.startsWith('/documentation')) return;
    request.service = {
      hevyClient: new HevyClient(),
      db: DB,
    };

    request.userId = null;
  });

  await fastify.register(auth, { prefix: '/api/v1/auth' });
  await fastify.register(user, { prefix: '/api/v1/user' });
  await fastify.register(settings, { prefix: '/api/v1/settings' });

  try {
    await fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

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

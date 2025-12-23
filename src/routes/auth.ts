import { clearCookies, setCookies } from '../crypto/jwt';
import { CreateUserSchema, LoginUserSchema } from '../schemas/shared/auth';
import cookieAuth from '../hooks/cookieAuth';
import logger from '../logger/logger';
import { z } from 'zod';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/register',
    schema: {
      description: 'On success, sets authentication cookies.',
      tags: ['Authentication'],
      summary: 'Register a new user',
      body: CreateUserSchema,
      response: {
        200: z.object({}),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const user = CreateUserSchema.safeParse(request.body);

      if (!user.success) {
        logger.error('[/register] Invalid user data');
        return reply.code(400).send({ error: 'Invalid user data' });
      }

      const cookie = await request.service.db.createUser({
        username: user.data.username,
        password: user.data.password,
        email: user.data.email,
      });

      if (cookie) {
        await setCookies(reply, cookie);
        return reply.code(200).send();
      }

      logger.error('[/register] Could not create user');
      reply.code(500).send({ error: 'Could not create user' });
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/login',
    schema: {
      description: 'On success, sets authentication cookies.',
      tags: ['Authentication'],
      summary: 'Login as a user',
      body: LoginUserSchema,
      response: {
        200: z.object({}),
        400: z.object({ error: z.string() }),
        401: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const login = LoginUserSchema.safeParse(request.body);
      if (!login.success) {
        logger.error('[/login] Invalid user data');
        return reply.code(400).send({ error: 'Invalid user data' });
      }

      const cookie = await request.service.db.login(login.data);
      if (cookie) {
        await setCookies(reply, cookie);
        logger.info('[/login] User logged in successfully');
        return reply.code(200).send();
      }

      logger.error('[/login] Invalid credentials');
      return reply.code(401).send({ error: 'Unauthorized' });
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/logout',
    schema: {
      description: 'On success, clears authentication cookies.',
      tags: ['Authentication'],
      summary: 'Logout the current user',
      security: [{ cookieAuth: [] }],
      response: {
        200: z.object({}),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      clearCookies(reply);
      return reply.code(200).send();
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/validate',
    schema: {
      description: 'Validate the current user session',
      tags: ['Authentication'],
      summary: 'Validate user session',
      response: {
        200: z.object({}),
        401: z.object({ error: z.string() }),
      },
    },
    preHandler: cookieAuth,
    handler: async (_: FastifyRequest, reply: FastifyReply): Promise<void> => {
      return reply.code(200).send();
    },
  });
}

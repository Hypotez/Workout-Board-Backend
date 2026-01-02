import { clearCookies, setCookies } from '../crypto/jwt';
import {
  CreateUserSchema,
  LoginUserSchema,
  LoginUserInput,
  CreateUserInput,
} from '../schemas/shared/auth';
import cookieAuth from '../hooks/cookieAuth';
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
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) => {
      try {
        const cookie = await request.service.db.createUser(request.body);

        await setCookies(reply, cookie);
        return reply.code(200).send();
      } catch (error) {
        request.log.error(`Error during user registration: ${error}`);
        return reply.code(500).send({ error: 'User registration failed' });
      }
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
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest<{ Body: LoginUserInput }>, reply: FastifyReply) => {
      try {
        const cookie = await request.service.db.login(request.body);

        if (!cookie) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }

        await setCookies(reply, cookie);
        return reply.code(200).send();
      } catch (error) {
        request.log.error(`Error during user login: ${error}`);
        return reply.code(500).send({ error: 'Login failed' });
      }
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
    handler: async (_: FastifyRequest, reply: FastifyReply) => {
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
      security: [{ cookieAuth: [] }],
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

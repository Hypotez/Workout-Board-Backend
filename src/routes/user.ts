import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PublicUserSchema } from '../schemas/shared/user';
import attachUserId from '../hooks/attachUserId';
import cookieAuth from '../hooks/cookieAuth';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/me',
    schema: {
      description: 'Get the authenticated user',
      tags: ['User'],
      summary: 'Retrieve information about the currently authenticated user',
      response: {
        200: PublicUserSchema,
        404: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    preHandler: [cookieAuth, attachUserId],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId!;
        const user = await request.service.db.getUserById(userId);

        if (!user) {
          return reply.code(404).send({ error: 'User not found' });
        }

        return reply.code(200).send(user);
      } catch (error) {
        request.log.error(`Error fetching user data: ${error}`);
        return reply.code(500).send({ error: 'Failed to fetch user data' });
      }
    },
  });
}

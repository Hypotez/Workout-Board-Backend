import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PublicUserSchema } from '../schemas/shared/user';
import attachUserId from '../hooks/attachUserId';
import cookieAuth from '../hooks/cookieAuth';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', cookieAuth);
  fastify.addHook('preHandler', attachUserId);

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/me',
    schema: {
      response: {
        200: PublicUserSchema,
        404: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.userId!;
      const user = await request.service.db.getUserById(userId);

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      reply.code(200).send(user);
    },
  });
}

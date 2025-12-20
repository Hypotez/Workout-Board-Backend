import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import attachUserId from '../hooks/attachUserId';
import cookieAuth from '../hooks/cookieAuth';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', cookieAuth);
  fastify.addHook('preHandler', attachUserId);

  fastify.get('/me', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = request.userId!;
    const user = await request.service.db.getUserById(userId);

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    reply.code(200).send(user);
  });
}

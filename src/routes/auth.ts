import { clearCookies, setCookies } from '../crypto/jwt';
import { CreateUserSchema, LoginUserSchema } from '../schemas/shared/auth';
import cookieAuth from '../hooks/cookieAuth';
import logger from '../logger/logger';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
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
  });

  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
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
  });

  fastify.post('/logout', async (_: FastifyRequest, reply: FastifyReply): Promise<void> => {
    clearCookies(reply);
    return reply.code(200).send();
  });

  fastify.get(
    '/validate',
    { preHandler: cookieAuth },
    async (_: FastifyRequest, reply: FastifyReply): Promise<void> => {
      return reply.code(200).send();
    }
  );
}

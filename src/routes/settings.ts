import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import attachUserId from '../hooks/attachUserId';
import { SettingsSchema } from '../schemas/shared/settings';
import logger from '../logger/logger';

export default async function settingsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', attachUserId);

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = request.userId!;
    const settings = SettingsSchema.safeParse(request.body);

    if (!settings.success) {
      logger.error('[/settings] Invalid settings data');
      return reply.code(400).send({ error: 'Invalid settings data' });
    }

    const saveSettings = await request.service.db.saveUserSettings(userId, settings.data);
    if (!saveSettings) {
      return reply.code(500).send({ error: 'Failed to save settings' });
    }
    reply.code(200).send();
  });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = request.userId!;

    const settings = await request.service.db.getUserSettings(userId);
    if (!settings) {
      return reply.code(500).send({ error: 'Failed to fetch settings' });
    }
    reply.code(200).send(settings);
  });
}

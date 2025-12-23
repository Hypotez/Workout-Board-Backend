import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import attachUserId from '../hooks/attachUserId';
import { SettingsSchema } from '../schemas/shared/settings';
import { z } from 'zod';
import logger from '../logger/logger';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function settingsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', attachUserId);

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/',
    schema: {
      description: 'Save user settings.',
      tags: ['Settings'],
      summary: 'Save user settings',
      security: [{ cookieAuth: [] }],
      response: {
        200: z.object({}),
        400: z.object({ error: z.string() }),
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
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
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get user settings.',
      tags: ['Settings'],
      summary: 'Get user settings',
      security: [{ cookieAuth: [] }],
      response: {
        200: SettingsSchema,
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.userId!;

      const settings = await request.service.db.getUserSettings(userId);
      if (!settings) {
        return reply.code(500).send({ error: 'Failed to fetch settings' });
      }
      reply.code(200).send(settings);
    },
  });
}

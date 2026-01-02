import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import attachUserId from '../hooks/attachUserId';
import { SettingsSchema, Settings } from '../schemas/shared/settings';
import { z } from 'zod';
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
      body: SettingsSchema,
      response: {
        200: z.object({}),
        400: z.object({ error: z.string() }),
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest<{ Body: Settings }>, reply: FastifyReply) => {
      try {
        const userId = request.userId!;

        await request.service.db.saveUserSettings(userId, request.body);
        return reply.code(200).send();
      } catch (error) {
        request.log.error(`Error saving user settings: ${error}`);
        return reply.code(500).send({ error: 'Failed to save settings' });
      }
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Get user settings.',
      tags: ['Settings'],
      summary: 'Get user settings',
      response: {
        200: SettingsSchema,
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId!;
        const settings = await request.service.db.getUserSettings(userId);
        return reply.code(200).send(settings);
      } catch (error) {
        request.log.error(`Error fetching user settings: ${error}`);
        return reply.code(500).send({ error: 'Failed to fetch settings' });
      }
    },
  });
}

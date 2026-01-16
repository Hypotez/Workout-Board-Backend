import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import cookieAuth from '../hooks/cookieAuth';
import attachUserId from '../hooks/attachUserId';

import HevyClient from '../service/hevy/hevyClient';

import { GetRoutinesQuerySchema, type GetRoutinesQuery } from '../schemas/shared/routines';
import { GetRoutinesResponseSchema } from '../schemas/shared/hevy/routine';
import { ERRORS, errorResponse } from '../schemas/shared/error';

export default async function routinesRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
      description: 'Retrieve routines from the Hevy API for the authenticated user.',
      tags: ['Routines'],
      summary: 'Get routines (Hevy)',
      querystring: GetRoutinesQuerySchema,
      response: {
        200: GetRoutinesResponseSchema,
        400: z.object({ error: z.string() }),
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    preHandler: [cookieAuth, attachUserId],
    handler: async (
      request: FastifyRequest<{ Querystring: GetRoutinesQuery }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = request.userId;
        if (!userId) {
          return reply.code(401).send(errorResponse(ERRORS.UNAUTHORIZED));
        }

        const { page, pageSize } = request.query;

        const settings = await request.service.db.getUserSettings(userId);
        if (!settings.use_hevy_api) {
          return reply.code(400).send(errorResponse('Hevy API is disabled in settings'));
        }

        if (!settings.hevy_api_key) {
          return reply.code(400).send(errorResponse('Missing Hevy API key in settings'));
        }

        const hevyClient = new HevyClient(settings.hevy_api_key);
        const routines = await hevyClient.routines.getRoutines(page, pageSize);

        if (!routines) {
          return reply.code(500).send(errorResponse('Failed to fetch routines from Hevy'));
        }

        return reply.code(200).send(routines);
      } catch (error) {
        request.log.error(`Error fetching routines: ${error}`);
        return reply.code(500).send(errorResponse('Failed to fetch routines'));
      }
    },
  });
}

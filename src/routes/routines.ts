import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import cookieAuth from '../hooks/cookieAuth';
import attachUserId from '../hooks/attachUserId';
import requireHevyApi from '../hooks/requireHevyApi';

import { GetRoutinesQuerySchema, type GetRoutinesQuery } from '../schemas/shared/routines';
import { CreateRoutineSchema } from '../schemas/shared/hevy/routine';
import { GetRoutinesResponseSchema } from '../schemas/shared/hevy/routine';
import { errorResponse } from '../schemas/shared/error';

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
    preHandler: [cookieAuth, attachUserId, requireHevyApi],
    handler: async (
      request: FastifyRequest<{ Querystring: GetRoutinesQuery }>,
      reply: FastifyReply
    ) => {
      try {
        const { page, pageSize } = request.query;

        const routines = await request.service.hevyClient.routines.getRoutines(page, pageSize);

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

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/:id',
    schema: {
      description: 'Retrieve a routine by id from the Hevy API for the authenticated user.',
      tags: ['Routines'],
      summary: 'Get routine by id (Hevy)',
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: CreateRoutineSchema,
        400: z.object({ error: z.string() }),
        401: z.object({ error: z.string() }),
        500: z.object({ error: z.string() }),
      },
    },
    preHandler: [cookieAuth, attachUserId, requireHevyApi],
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const routine = await request.service.hevyClient.routines.getRoutineById(id);

        if (!routine) {
          return reply.code(500).send(errorResponse('Failed to fetch routines from Hevy'));
        }

        return reply.code(200).send(routine);
      } catch (error) {
        request.log.error(`Error fetching routines: ${error}`);
        return reply.code(500).send(errorResponse('Failed to fetch routines'));
      }
    },
  });
}

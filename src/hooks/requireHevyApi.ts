import { FastifyRequest, FastifyReply } from 'fastify';
import { ERRORS, errorResponse } from '../schemas/shared/error';

export default async function requireHevyApi(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId;
  if (!userId) {
    return reply.code(401).send(errorResponse(ERRORS.UNAUTHORIZED));
  }

  const settings = await request.service.db.getUserSettings(userId);
  if (!settings.use_hevy_api) {
    return reply.code(400).send(errorResponse('Hevy API is disabled in settings'));
  }

  if (!settings.hevy_api_key) {
    return reply.code(400).send(errorResponse('Missing Hevy API key in settings'));
  }

  request.service.hevyClient.setApiKey(settings.hevy_api_key);
}

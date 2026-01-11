import { getPayload } from '../crypto/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ERRORS, errorResponse } from '../schemas/shared/error';

export default async function attachUserId(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies?.access_token;
  const refreshToken = request.cookies?.refresh_token;

  let payload;
  if (refreshToken) {
    payload = getPayload(refreshToken);
  } else if (accessToken) {
    payload = getPayload(accessToken);
  }

  if (!payload?.id) {
    reply.code(401).send(errorResponse(ERRORS.UNAUTHORIZED));
    return;
  }

  request.userId = payload.id;
}

import { getPayload } from '../crypto/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

export default function attachUserId(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies?.access_token;
  const refreshToken = request.cookies?.refresh_token;

  let payload;
  if (refreshToken) {
    payload = getPayload(refreshToken);
  } else if (accessToken) {
    payload = getPayload(accessToken);
  }

  if (!payload?.id) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }

  request.userId = payload.id;
}

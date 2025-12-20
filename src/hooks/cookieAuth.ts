import {
  clearCookies,
  generateTokens,
  setCookies,
  verifyAccessToken,
  verifyRefreshToken,
  getPayload,
} from '../crypto/jwt';

import { FastifyRequest, FastifyReply } from 'fastify';

function invalidAuth(reply: FastifyReply) {
  clearCookies(reply);
  return reply.code(401).send({ error: 'Unauthorized' });
}

export default async function cookieAuth(request: FastifyRequest, reply: FastifyReply) {
  const accessToken = request.cookies?.access_token;
  const refreshToken = request.cookies?.refresh_token;

  if (!accessToken) {
    if (!refreshToken) {
      return invalidAuth(reply);
    }

    const refreshTokenValid = verifyRefreshToken(refreshToken);
    if (!refreshTokenValid) {
      return invalidAuth(reply);
    }

    const payload = getPayload(refreshToken);
    if (!payload) {
      return invalidAuth(reply);
    }

    const tokensInformation = generateTokens(payload.id);
    await setCookies(reply, tokensInformation);
    return reply.code(200).send();
  }

  const accessTokenValid = verifyAccessToken(accessToken);
  if (!accessTokenValid) {
    return invalidAuth(reply);
  }
}

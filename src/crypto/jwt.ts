import { FastifyReply } from 'fastify';
import { sign, decode, verify, SignOptions, JwtPayload } from 'jsonwebtoken';

import { CookieResponse } from '../schemas/shared/auth';
import env from '../config/env';

const JWT_ACCESS_SECRET = env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const NODE_ENV = env.NODE_ENV;

const PRODUCTION_STRING = 'production';
const ACCESS_TOKEN_STRING = 'access_token';
const REFRESH_TOKEN_STRING = 'refresh_token';
const SAME_SITE_STRING = NODE_ENV === PRODUCTION_STRING ? 'strict' : 'lax';

function verifyToken(token: string, secret: string): boolean {
  try {
    verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function signToken(id: string, secret: string, expiresIn: number): string {
  return sign({ id: id }, secret, { expiresIn: expiresIn } as SignOptions);
}

export function generateTokens(id: string): CookieResponse {
  const accessTokenExpirationSeconds = 15 * 60;
  const refreshTokenExpirationSeconds = 24 * 60 * 60;

  const accessToken = signToken(id, JWT_ACCESS_SECRET, accessTokenExpirationSeconds);
  const refreshToken = signToken(id, JWT_REFRESH_SECRET, refreshTokenExpirationSeconds);

  const timeNow = Math.floor(Date.now() / 1000);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    access_token_expiration: timeNow + accessTokenExpirationSeconds,
    refresh_token_expiration: timeNow + refreshTokenExpirationSeconds,
  };
}

export function setCookies(reply: FastifyReply, cookieResponse: CookieResponse): void {
  reply.cookie(ACCESS_TOKEN_STRING, cookieResponse.access_token, {
    httpOnly: true,
    secure: NODE_ENV === PRODUCTION_STRING,
    sameSite: SAME_SITE_STRING,
    expires: new Date(cookieResponse.access_token_expiration * 1000),
  });

  reply.cookie(REFRESH_TOKEN_STRING, cookieResponse.refresh_token, {
    httpOnly: true,
    secure: NODE_ENV === PRODUCTION_STRING,
    sameSite: SAME_SITE_STRING,
    expires: new Date(cookieResponse.refresh_token_expiration * 1000),
  });
}

export function clearCookies(reply: FastifyReply): void {
  reply.clearCookie(ACCESS_TOKEN_STRING, {
    httpOnly: true,
    secure: NODE_ENV === PRODUCTION_STRING,
    sameSite: SAME_SITE_STRING,
  });

  reply.clearCookie(REFRESH_TOKEN_STRING, {
    httpOnly: true,
    secure: NODE_ENV === PRODUCTION_STRING,
    sameSite: SAME_SITE_STRING,
  });
}

export function verifyAccessToken(token: string): boolean {
  return verifyToken(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string): boolean {
  return verifyToken(token, JWT_REFRESH_SECRET);
}

export function getPayload(token: string): JwtPayload | null {
  return decode(token, { json: true });
}

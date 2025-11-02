import { NextFunction, Request, Response } from 'express';
import {
  ErrorResponse,
  ErrorStatusCode,
  ErrorString,
  ErrorType,
  SuccessResponse,
  SuccessStatusCode,
  SuccessString,
} from '../schemas/shared/api';
import {
  clearCookies,
  generateTokens,
  getPayload,
  setCookies,
  verifyAccessToken,
  verifyRefreshToken,
} from '../crypto/jwt';

function invalidAuth(res: Response) {
  clearCookies(res);
  return res.error('Please login', 401);
}

export async function cookieAuth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;

  if (!accessToken) {
    if (!refreshToken) {
      return invalidAuth(res);
    }

    const refreshTokenValid = verifyRefreshToken(refreshToken);
    if (!refreshTokenValid) {
      return invalidAuth(res);
    }

    const payload = getPayload(refreshToken);
    if (!payload) {
      return invalidAuth(res);
    }

    const tokensInformation = generateTokens(payload.id);
    await setCookies(res, tokensInformation);
    return next();
  }

  const accessTokenValid = verifyAccessToken(accessToken);
  if (!accessTokenValid) {
    return invalidAuth(res);
  }

  next();
}

export function attachUserId(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies?.access_token;
  const refreshToken = req.cookies?.refresh_token;

  if (refreshToken) {
    const payload = getPayload(refreshToken);
    if (!payload?.id) {
      return res.error('Unauthorized', 401);
    }
    req.userId = payload.id;
    return next();
  }

  if (accessToken) {
    const payload = getPayload(accessToken);
    if (!payload?.id) {
      return res.error('Unauthorized', 401);
    }
    req.userId = payload.id;
    return next();
  }

  return res.error('Unauthorized', 401);
}

export function apiResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function <T>(data: T, statusCode: SuccessStatusCode = 200) {
    return res.status(statusCode).json({ status: SuccessString, data: data } as SuccessResponse<T>);
  };

  res.error = function (err: ErrorType = null, statusCode: ErrorStatusCode = 400) {
    return res.status(statusCode).json({ status: ErrorString, error: err } as ErrorResponse);
  };

  next();
}

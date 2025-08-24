import { NextFunction, Request, Response } from 'express'
import { ErrorResponse, SuccessResponse, SuccessStatusCode, ErrorStatusCode,  Error, SuccessString, ErrorString } from '../types';

export function apiResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function<T> (data: T, statusCode: SuccessStatusCode = 200) {
    return res.status(statusCode).json({ status: SuccessString, data: data } as SuccessResponse<T>);
  };

  res.error = function (err: Error = null, statusCode: ErrorStatusCode = 400) {
    return res.status(statusCode).json({ status: ErrorString, error: err } as ErrorResponse);
  };

  next();
}
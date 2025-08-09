import { NextFunction, Request, Response } from 'express'

export function apiResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = function (data: any = null, statusCode: number = 200) {
    return res.status(statusCode).json({ status: "success", data: data });
  };

  res.error = function (err: string | null = null, statusCode: number = 400) {
    return res.status(statusCode).json({ status: "error", error: err });
  };

  next();
}
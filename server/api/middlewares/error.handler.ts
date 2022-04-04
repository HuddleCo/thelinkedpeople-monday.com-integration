import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'express-openapi-validator/dist/framework/types';

export default function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const errors = err.errors || [{ message: err.message }];
  res.status(err.status || 500).json({ errors });
}

import { Request, Response, NextFunction } from 'express';
import { AppError, ApiError } from '../types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    const response: ApiError = {
      error: err.message,
      code: err.code,
      details: err.details,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  console.error('Unexpected error:', err);

  const response: ApiError = {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  };

  res.status(500).json(response);
}

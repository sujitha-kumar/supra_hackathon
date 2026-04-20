import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError, ErrorCodes } from '../types';

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details: Record<string, string> = {};
    errors.array().forEach((error) => {
      if (error.type === 'field') {
        details[error.path] = error.msg;
      }
    });

    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      'Validation failed',
      details
    );
  }

  next();
}

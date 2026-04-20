export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string>;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

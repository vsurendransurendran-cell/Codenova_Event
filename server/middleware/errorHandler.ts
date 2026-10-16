import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string | number;
  errors?: Record<string, string>;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error Handler]', err);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_REGISTRATION',
        message: 'This email address is already registered for this event.',
      },
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && (err as any).errors) {
    const fieldErrors: Record<string, string> = {};
    for (const key of Object.keys((err as any).errors)) {
      fieldErrors[key] = (err as any).errors[key].message;
    }
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload failed schema validation.',
        details: fieldErrors,
      },
    });
    return;
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'The requested resource identifier format is invalid.',
      },
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred.',
      ...(err.errors ? { details: err.errors } : {}),
    },
  });
}

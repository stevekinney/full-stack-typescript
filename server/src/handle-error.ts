import chalk from 'chalk';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

/**
 * Represents a formatted validation error
 */
export interface ValidationError {
  path: (string | number)[];
  message: string;
}

/**
 * Represents the structure of an error response
 */
export interface ErrorResponseBody {
  message: string;
  errors?: ValidationError[];
  code?: string;
}

/**
 * Type guard to check if an error is a ZodError
 */
function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

/**
 * Type guard to check if an error is a standard Error object
 */
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Handles API errors by formatting them appropriately and sending
 * the correct HTTP status code
 */
export const handleError = <
  TParams = unknown,
  TResBody = unknown,
  TReqBody = unknown,
  TQuery = unknown,
>(
  request: Request<TParams, TResBody, TReqBody, TQuery>,
  response: Response,
  error: unknown,
): Response<ErrorResponseBody> => {
  // Ensure request path is defined
  if (!request.path) {
    throw new Error('Request route is not defined');
  }

  // Handle Zod validation errors
  if (isZodError(error)) {
    const formattedErrors: ValidationError[] = error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    }));

    return response.status(400).json({
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
    });
  }

  // Handle standard errors
  const message = isError(error) ? error.message : 'Unknown error';
  const path = request.path;
  const method = request.method;

  // Log the error with color-coded information
  console.error(chalk.bgRed('ERROR'), chalk.red(path), chalk.yellow(method), message);

  // Return a generic error response
  return response.status(500).json({
    message,
    code: 'INTERNAL_SERVER_ERROR',
  });
};

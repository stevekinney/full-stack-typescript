import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import chalk from 'chalk';
import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';

extendZodWithOpenApi(z);

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
export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

/**
 * Type guard to check if an error is a standard Error object
 */
export function isError(error: unknown): error is Error {
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

export const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'Error message describing what went wrong',
      example: 'Task not found',
    }),
    code: z.string().optional().openapi({
      description: 'Error code for more specific error handling',
      example: 'NOT_FOUND',
    }),
    errors: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])).openapi({
            description: 'Path to the field with the error',
            example: ['title'],
          }),
          message: z.string().openapi({
            description: 'Error message for this specific field',
            example: 'Required',
          }),
        }),
      )
      .optional()
      .openapi({
        description: 'Detailed validation errors, if applicable',
      }),
  })
  .openapi({
    description: 'Standard error response',
  });

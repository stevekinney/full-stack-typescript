import chalk from 'chalk';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';

export const handleError = (request: Request, response: Response, error: Error | unknown) => {
  if (error instanceof ZodError) {
    return response.status(400).json({ message: error.message });
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(
    chalk.bgRed('ERROR'),
    chalk.red(request.route.path),
    chalk.yellow(request.method),
    message,
  );

  response.status(500).json({ message });
};

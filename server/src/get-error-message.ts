import chalk from 'chalk';
import type { Request } from 'express';

export const getErrorMessage = (request: Request, error: Error | unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(
    chalk.bgRed('ERROR'),
    chalk.red(request.route.path),
    chalk.yellow(request.method),
    message,
  );
};

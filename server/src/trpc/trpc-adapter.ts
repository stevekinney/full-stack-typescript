import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { Router } from 'express';
import { createContext } from './trpc-context.js';
import { taskRouter } from './trpc.js';

export function createTrpcAdapter() {
  const router = Router();

  router.use('/trpc', createExpressMiddleware({ router: taskRouter, createContext }));

  return router;
}

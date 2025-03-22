import { TaskClient } from '@/client.js';
import { getDatabase } from '@/database.js';
import type { inferAsyncReturnType } from '@trpc/server';

import { PrismaClient } from '@prisma/client';

export async function createContext() {
  const database = await getDatabase();
  const tasks = new TaskClient(database);
  const prisma = new PrismaClient();

  return { tasks, prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;

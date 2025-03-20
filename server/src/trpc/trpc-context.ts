import { TaskClient } from '@/client.js';
import { getDatabase } from '@/database.js';
import type { inferAsyncReturnType } from '@trpc/server';

export async function createContext() {
  const database = await getDatabase();
  const tasks = new TaskClient(database);
  return { tasks };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const API_URL = 'http://localhost:4001';

import { CreateTask, UpdateTask } from 'busy-bee-schema';

import type { taskRouter } from '@server/src/trpc/trpc';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const client = createTRPCProxyClient<typeof taskRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
    }),
  ],
});

export const fetchTasks = async (showCompleted: boolean) => {
  return client.getTasks.query({ completed: showCompleted });
};

export const createTask = async (task: CreateTask): Promise<void> => {
  return client.createTask.mutate(task);
};

export const updateTask = async (id: string, task: UpdateTask): Promise<void> => {
  return client.updateTask.mutate({ id: Number(id), task });
};

export const deleteTask = async (id: string): Promise<void> => {
  return client.deleteTask.mutate(Number(id));
};

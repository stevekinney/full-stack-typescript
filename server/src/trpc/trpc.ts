import { initTRPC } from '@trpc/server';
import { CreateTaskSchema, TaskListQuerySchema, UpdateTaskSchema } from 'busy-bee-schema';
import { z } from 'zod';
import type { Context } from './trpc-context.js';

const t = initTRPC.context<Context>().create();

const UpdateSchema = z.object({
  id: z.coerce.number(),
  task: UpdateTaskSchema,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const taskRouter = router({
  getTasks: publicProcedure.input(TaskListQuerySchema).query(async ({ input, ctx }) => {
    const { prisma } = ctx;
    return prisma.task.findMany({
      where: { completed: !!input.completed },
    });
  }),
  createTask: publicProcedure.input(CreateTaskSchema).mutation(async ({ input, ctx }) => {
    const { prisma } = ctx;
    return prisma.task.create({
      data: input,
    });
  }),
  updateTask: publicProcedure.input(UpdateSchema).mutation(async ({ input, ctx }) => {
    const tasks = ctx.tasks;
    const { id, task } = input;
    return tasks.updateTask(id, task);
  }),
  deleteTask: publicProcedure.input(z.coerce.number()).mutation(async ({ input, ctx }) => {
    const tasks = ctx.tasks;
    return tasks.deleteTask(input);
  }),
});

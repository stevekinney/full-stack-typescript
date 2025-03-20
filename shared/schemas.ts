import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.coerce.number().int(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.coerce.boolean(),
});

export const TaskParamsSchema = TaskSchema.pick({ id: true });
export const TaskQuerySchema = TaskSchema.pick({ completed: true }).partial();

export const TasksSchema = z.array(TaskSchema);

export const NewTaskSchema = TaskSchema.omit({ id: true, completed: true });
export const UpdateTaskSchema = TaskSchema.partial().omit({ id: true });

export {};

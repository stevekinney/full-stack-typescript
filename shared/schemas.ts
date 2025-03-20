import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.coerce.boolean().default(false),
});

export const CreateTaskSchema = TaskSchema.omit({ id: true });
export const UpdateTaskSchema = TaskSchema.partial().omit({ id: true });

export const TaskListSchema = z.array(TaskSchema);

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type TaskList = z.infer<typeof TaskListSchema>;

export {};

import { z } from 'zod';
import { TaskCreateInputObjectSchema } from './objects/TaskCreateInput.schema';
import { TaskUncheckedCreateInputObjectSchema } from './objects/TaskUncheckedCreateInput.schema';

export const TaskCreateOneSchema = z.object({
  data: z.union([TaskCreateInputObjectSchema, TaskUncheckedCreateInputObjectSchema]),
});

import { z } from 'zod';
import { TaskUpdateInputObjectSchema } from './objects/TaskUpdateInput.schema';
import { TaskUncheckedUpdateInputObjectSchema } from './objects/TaskUncheckedUpdateInput.schema';
import { TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskUpdateOneSchema = z.object({
  data: z.union([TaskUpdateInputObjectSchema, TaskUncheckedUpdateInputObjectSchema]),
  where: TaskWhereUniqueInputObjectSchema,
});

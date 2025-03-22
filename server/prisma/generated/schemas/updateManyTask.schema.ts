import { z } from 'zod';
import { TaskUpdateManyMutationInputObjectSchema } from './objects/TaskUpdateManyMutationInput.schema';
import { TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';

export const TaskUpdateManySchema = z.object({
  data: TaskUpdateManyMutationInputObjectSchema,
  where: TaskWhereInputObjectSchema.optional(),
});

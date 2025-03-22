import { z } from 'zod';
import { TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';
import { TaskOrderByWithAggregationInputObjectSchema } from './objects/TaskOrderByWithAggregationInput.schema';
import { TaskScalarWhereWithAggregatesInputObjectSchema } from './objects/TaskScalarWhereWithAggregatesInput.schema';
import { TaskScalarFieldEnumSchema } from './enums/TaskScalarFieldEnum.schema';

export const TaskGroupBySchema = z.object({
  where: TaskWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      TaskOrderByWithAggregationInputObjectSchema,
      TaskOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: TaskScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(TaskScalarFieldEnumSchema),
});

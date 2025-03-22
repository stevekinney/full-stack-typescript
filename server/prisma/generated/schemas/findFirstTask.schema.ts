import { z } from 'zod';
import { TaskOrderByWithRelationInputObjectSchema } from './objects/TaskOrderByWithRelationInput.schema';
import { TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';
import { TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';
import { TaskScalarFieldEnumSchema } from './enums/TaskScalarFieldEnum.schema';

export const TaskFindFirstSchema = z.object({
  orderBy: z
    .union([
      TaskOrderByWithRelationInputObjectSchema,
      TaskOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: TaskWhereInputObjectSchema.optional(),
  cursor: TaskWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(TaskScalarFieldEnumSchema).optional(),
});

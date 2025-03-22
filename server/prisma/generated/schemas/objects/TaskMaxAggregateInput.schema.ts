import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaskMaxAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    title: z.literal(true).optional(),
    description: z.literal(true).optional(),
    completed: z.literal(true).optional(),
  })
  .strict();

export const TaskMaxAggregateInputObjectSchema = Schema;

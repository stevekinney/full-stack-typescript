import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.TaskCreateInput> = z
  .object({
    title: z.string(),
    description: z.string().optional().nullable(),
    completed: z.boolean().optional(),
  })
  .strict();

export const TaskCreateInputObjectSchema = Schema;

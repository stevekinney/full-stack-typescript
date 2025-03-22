import { z } from 'zod';
import { TaskWhereInputObjectSchema } from './objects/TaskWhereInput.schema';

export const TaskDeleteManySchema = z.object({ where: TaskWhereInputObjectSchema.optional() });

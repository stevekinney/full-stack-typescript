import { z } from 'zod';
import { TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskDeleteOneSchema = z.object({ where: TaskWhereUniqueInputObjectSchema });

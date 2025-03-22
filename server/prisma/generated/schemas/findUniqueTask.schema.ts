import { z } from 'zod';
import { TaskWhereUniqueInputObjectSchema } from './objects/TaskWhereUniqueInput.schema';

export const TaskFindUniqueSchema = z.object({ where: TaskWhereUniqueInputObjectSchema });

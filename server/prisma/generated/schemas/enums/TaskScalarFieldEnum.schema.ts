import { z } from 'zod';

export const TaskScalarFieldEnumSchema = z.enum(['id', 'title', 'description', 'completed']);

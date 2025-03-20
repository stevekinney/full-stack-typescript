import cors from 'cors';
import express, { type Request, type Response } from 'express';
import type { Database } from 'sqlite';
import { z } from 'zod';
import { handleError } from './handle-error.js';

import { CreateTaskSchema, UpdateTaskSchema } from 'busy-bee-schema';
import { TaskClient } from './client.js';
import { createTrpcAdapter } from './trpc/trpc-adapter.js';

export async function createServer(database: Database) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', createTrpcAdapter());

  const client = new TaskClient(database);

  app.get('/tasks', async (req: Request, res: Response) => {
    const { completed } = req.query;

    try {
      const tasks = await client.getAllTasks({ completed: completed === 'true' });
      return res.json(tasks || []);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Get a specific task
  app.get('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const task = await client.getTask(Number(id));

      if (!task) return res.status(404).json({ message: 'Task not found' });

      return res.json(task);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  app.post('/tasks', async (req, res) => {
    try {
      const task = CreateTaskSchema.parse(req.body);
      if (!task.title) return res.status(400).json({ message: 'Title is required' });

      await client.createTask(task);
      const tasks = await client.getAllTasks({ completed: false });
      return res.status(201).json(tasks[0]);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Update a task
  app.put('/tasks/:id', async (req, res) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const previous = await client.getTask(id);
      if (!previous) return res.status(404).json({ message: 'Task not found' });

      const updates = UpdateTaskSchema.parse(req.body);
      const task = { ...previous, ...updates };

      await client.updateTask(id, task);
      const updated = await client.getTask(id);
      return res.status(200).json(updated);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Delete a task
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const task = await client.getTask(Number(id));
      if (!task) return res.status(404).json({ message: 'Task not found' });

      await client.deleteTask(Number(id));
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  return app;
}

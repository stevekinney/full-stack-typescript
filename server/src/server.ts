import cors from 'cors';
import express, { type Request, type Response } from 'express';
import type { Database } from 'sqlite';
import { handleError } from './get-error-message.js';

export async function createServer(database: Database) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const incompleteTasks = await database.prepare('SELECT * FROM tasks whERE completed = 0');
  const completedTasks = await database.prepare('SELECT * FROM tasks WHERE completed = 1');
  const getTask = await database.prepare('SELECT * FROM tasks WHERE id = ?');
  const createTask = await database.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)');
  const deleteTask = await database.prepare('DELETE FROM tasks WHERE id = ?');
  const updateTask = await database.prepare(
    `UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`,
  );

  app.get('/tasks', async (req: Request, res: Response) => {
    const { completed } = req.query;
    const query = completed === 'true' ? completedTasks : incompleteTasks;

    try {
      const tasks = await query.all();
      return res.json(tasks);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Get a specific task
  app.get('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const task = await getTask.get([id]);

      if (!task) return res.status(404).json({ message: 'Task not found' });

      return res.json(task);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  app.post('/tasks', async (req: Request, res: Response) => {
    const task = req.body;

    if (!task.title) return res.status(400).json({ message: 'Title is required' });

    try {
      await createTask.run([task.title, task.description]);
      return res.sendStatus(201);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Update a task
  app.put('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const previous = await getTask.get([id]);
    const updates = req.body;
    const task = { ...previous, ...updates };

    try {
      await updateTask.run([task.title, task.description, task.completed, id]);
      return res.sendStatus(200);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Delete a task
  app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await deleteTask.run([id]);
      return res.sendStatus(200);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  return app;
}

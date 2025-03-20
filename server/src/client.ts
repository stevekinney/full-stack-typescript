import { CreateTask, TaskListSchema, TaskSchema, UpdateTask } from 'busy-bee-schema';
import { Database } from 'sqlite';
import { z } from 'zod';

export class TaskClient {
  private database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  async getAllTasks({ completed }: { completed: boolean }) {
    const query = completed
      ? await this.database.prepare('SELECT * FROM tasks WHERE completed = 1')
      : await this.database.prepare('SELECT * FROM tasks WHERE completed = 0');

    return TaskListSchema.parse(await query.all());
  }

  async getTask(id: number) {
    const query = await this.database.prepare('SELECT * FROM tasks WHERE id = ?');
    return TaskSchema.or(z.undefined()).parse(await query.get([id]));
  }

  async createTask(task: CreateTask) {
    const query = await this.database.prepare(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
    );
    await query.run([task.title, task.description]);
  }

  async updateTask(id: number, task: UpdateTask) {
    const previous = TaskSchema.parse(await this.getTask(id));
    const updated = { ...previous, ...task };

    const query = await this.database.prepare(
      `UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`,
    );

    await query.run([updated.title, updated.description, updated.completed, id]);
  }

  async deleteTask(id: number) {
    const query = await this.database.prepare('DELETE FROM tasks WHERE id = ?');
    await query.run([id]);
  }
}

import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Application } from 'express';
import type { Database } from 'sqlite';

import { getDatabase } from './database.js';
import { createServer } from './server.js';

const booleanOrBinary = (expected: true | false | 0 | 1) => ({
  asymmetricMatch: (value: unknown) => !!value === !!expected,
  toString: () => `Expected ${!!expected}`,
});

describe('Tasks API', () => {
  let app: Application;
  let database: Database;

  beforeEach(async () => {
    database = await getDatabase(':memory:', true); // Force a new database instance
    app = await createServer(database);
  });

  describe('GET /tasks', () => {
    it('should return an empty list when no tasks exist', async () => {
      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all tasks', async () => {
      // Create a task using the API
      const postResponse = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });

      expect(postResponse.status).toBe(201);

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        title: 'Test Task',
        description: 'Test Description',
      });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task when found', async () => {
      // Create a task
      await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });
      const getAllResponse = await request(app).get('/tasks');
      const taskId = getAllResponse.body[0].id;

      const response = await request(app).get(`/tasks/${taskId}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
      });
    });

    it('should return 404 if the task is not found', async () => {
      const response = await request(app).get('/tasks/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task and return 201', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New Task', description: 'Task description' });

      expect(response.status).toBe(201);

      // Verify the task was created
      const getResponse = await request(app).get('/tasks');

      expect(getResponse.body.length).toBe(1);
      expect(getResponse.body[0]).toMatchObject({
        title: 'New Task',
        description: 'Task description',
        completed: booleanOrBinary(0), // Default should be false (0)
      });
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app).post('/tasks').send({ description: 'No title provided' });
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task and return 200', async () => {
      // Create a task
      await request(app)
        .post('/tasks')
        .send({ title: 'Task to update', description: 'Old description' });
      const getAllResponse = await request(app).get('/tasks');
      const taskId = getAllResponse.body[0].id;

      // Update the task
      const updateResponse = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ title: 'Updated Task', description: 'Updated Description', completed: false });
      expect(updateResponse.status).toBe(200);

      // Verify the update
      const getUpdatedResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getUpdatedResponse.body).toMatchObject({
        id: taskId,
        title: 'Updated Task',
        description: 'Updated Description',
        completed: booleanOrBinary(0),
      });
    });

    it('should update a task to mark it as completed', async () => {
      // Create a task (default completed is false)
      await request(app)
        .post('/tasks')
        .send({ title: 'Task to complete', description: 'Will be completed' });
      const getAllResponse = await request(app).get('/tasks');
      const taskId = getAllResponse.body.find(
        (task: { title: string }) => task.title === 'Task to complete',
      ).id;

      // Mark the task as completed
      const updateResponse = await request(app).put(`/tasks/${taskId}`).send({
        title: 'Task to complete',
        description: 'Will be completed',
        completed: true,
      });
      expect(updateResponse.status).toBe(200);

      // Verify the task is now completed
      const getUpdatedResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getUpdatedResponse.body).toMatchObject({
        id: taskId,
        title: 'Task to complete',
        description: 'Will be completed',
        completed: booleanOrBinary(1), // true is represented as 1 in SQLite
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task and return 200', async () => {
      // Create a task
      await request(app)
        .post('/tasks')
        .send({ title: 'Task to delete', description: 'To be deleted' });
      const getAllResponse = await request(app).get('/tasks');
      const taskId = getAllResponse.body[0].id;

      // Delete the task
      const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
      expect(deleteResponse.status).toBe(200);

      // Verify deletion
      const getDeletedResponse = await request(app).get(`/tasks/${taskId}`);
      expect(getDeletedResponse.status).toBe(404);
      expect(getDeletedResponse.body).toEqual({ message: 'Task not found' });
    });
  });
});

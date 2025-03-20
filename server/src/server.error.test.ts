import request from 'supertest';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import type { Application } from 'express';
import type { Database } from 'sqlite';

import { getDatabase } from './database.js';
import { createServer } from './server.js';
import * as handleErrorModule from './handle-error.js';

describe('Server Error Handling', () => {
  let app: Application;
  let database: Database;
  let mockHandleError: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Setup a fresh database for each test
    database = await getDatabase(':memory:', true);
    
    // Mock handleError to return a predictable response
    mockHandleError = vi.fn().mockImplementation((req, res) => {
      return res.status(500).json({ message: 'Test error', code: 'TEST_ERROR' });
    });
    
    vi.spyOn(handleErrorModule, 'handleError').mockImplementation(mockHandleError);
    
    // Create the server with our database
    app = await createServer(database);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /tasks', () => {
    it('should filter tasks by completed=true', async () => {
      // Create a completed task
      await database.exec(`
        INSERT INTO tasks (title, description, completed) 
        VALUES ('Completed Task', 'This task is done', 1)
      `);
      
      // Create an incomplete task
      await database.exec(`
        INSERT INTO tasks (title, description, completed) 
        VALUES ('Incomplete Task', 'This task is not done', 0)
      `);
      
      // Get only completed tasks
      const response = await request(app).get('/tasks?completed=true');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Completed Task');
    });

    it('should handle database errors', async () => {
      // Mock the database to throw an error on query execution
      const originalPrepare = database.prepare.bind(database);
      vi.spyOn(database, 'prepare').mockImplementation(async (sql) => {
        if (sql.includes('SELECT * FROM tasks')) {
          return {
            all: vi.fn().mockRejectedValue(new Error('Database error')),
            get: vi.fn(),
            run: vi.fn(),
          };
        }
        // For other SQL statements, return the original implementation
        return await originalPrepare(sql);
      });
      
      // We need to recreate the server with our mocked database
      app = await createServer(database);
      
      // Make the request
      const response = await request(app).get('/tasks');
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Test error', code: 'TEST_ERROR' });
      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('GET /tasks/:id', () => {
    it('should handle database errors', async () => {
      // Mock the database to throw an error on get execution
      const originalPrepare = database.prepare.bind(database);
      vi.spyOn(database, 'prepare').mockImplementation(async (sql) => {
        if (sql.includes('SELECT * FROM tasks WHERE id = ?')) {
          return {
            all: vi.fn(),
            get: vi.fn().mockRejectedValue(new Error('Database error')),
            run: vi.fn(),
          };
        }
        return await originalPrepare(sql);
      });
      
      // We need to recreate the server with our mocked database
      app = await createServer(database);
      
      // Make the request
      const response = await request(app).get('/tasks/1');
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Test error', code: 'TEST_ERROR' });
      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('POST /tasks', () => {
    it('should handle database errors', async () => {
      // Mock the database to throw an error on run execution
      const originalPrepare = database.prepare.bind(database);
      vi.spyOn(database, 'prepare').mockImplementation(async (sql) => {
        if (sql.includes('INSERT INTO tasks')) {
          return {
            all: vi.fn(),
            get: vi.fn(),
            run: vi.fn().mockRejectedValue(new Error('Database error')),
          };
        }
        return await originalPrepare(sql);
      });
      
      // We need to recreate the server with our mocked database
      app = await createServer(database);
      
      // Make the request
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New Task', description: 'Task description' });
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Test error', code: 'TEST_ERROR' });
      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should handle database errors', async () => {
      // First create a task so we have something to update
      await database.exec(`
        INSERT INTO tasks (title, description, completed) 
        VALUES ('Task to Update', 'Will throw error on update', 0)
      `);
      
      // Get the task ID
      const result = await database.get('SELECT id FROM tasks WHERE title = ?', ['Task to Update']);
      const taskId = result.id;
      
      // Mock the database to throw an error on run execution for UPDATE
      const originalPrepare = database.prepare.bind(database);
      vi.spyOn(database, 'prepare').mockImplementation(async (sql) => {
        if (sql.includes('UPDATE tasks')) {
          return {
            all: vi.fn(),
            get: vi.fn(),
            run: vi.fn().mockRejectedValue(new Error('Database error')),
          };
        }
        return await originalPrepare(sql);
      });
      
      // We need to recreate the server with our mocked database
      app = await createServer(database);
      
      // Make the request
      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ title: 'Updated Title', description: 'Updated Description' });
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Test error', code: 'TEST_ERROR' });
      expect(mockHandleError).toHaveBeenCalled();
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should handle database errors', async () => {
      // First create a task so we have something to delete
      await database.exec(`
        INSERT INTO tasks (title, description, completed) 
        VALUES ('Task to Delete', 'Will throw error on delete', 0)
      `);
      
      // Get the task ID
      const result = await database.get('SELECT id FROM tasks WHERE title = ?', ['Task to Delete']);
      const taskId = result.id;
      
      // Mock the database to throw an error on run execution for DELETE
      const originalPrepare = database.prepare.bind(database);
      vi.spyOn(database, 'prepare').mockImplementation(async (sql) => {
        if (sql.includes('DELETE FROM tasks')) {
          return {
            all: vi.fn(),
            get: vi.fn(),
            run: vi.fn().mockRejectedValue(new Error('Database error')),
          };
        }
        return await originalPrepare(sql);
      });
      
      // We need to recreate the server with our mocked database
      app = await createServer(database);
      
      // Make the request
      const response = await request(app).delete(`/tasks/${taskId}`);
      
      // Verify the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Test error', code: 'TEST_ERROR' });
      expect(mockHandleError).toHaveBeenCalled();
    });
  });
});
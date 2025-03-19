import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from './server';

const testUser = {
  name: 'John Doe',
  email: 'john@example.com',
};

describe('User API Routes', () => {
  let createdUserId: string;

  // Test the POST /users route
  describe('POST /users', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app).post('/users').send(testUser).expect(201);

      // Save the ID for other tests
      createdUserId = response.body.id;

      // Verify the response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Name and email are required');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/users').send({ name: testUser.name }).expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Name and email are required');
    });
  });

  // Test the GET /users route
  describe('GET /users', () => {
    // Create a test user first
    beforeEach(async () => {
      if (!createdUserId) {
        const response = await request(app).post('/users').send(testUser);
        createdUserId = response.body.id;
      }
    });

    it('should return all users', async () => {
      const response = await request(app).get('/users').expect(200);

      // Check that response is an array
      expect(Array.isArray(response.body)).toBeTruthy();

      // Check if our test user is in the response
      const foundUser = response.body.find((user: any) => user.id === createdUserId);
      expect(foundUser).toBeDefined();
      expect(foundUser.name).toBe(testUser.name);
      expect(foundUser.email).toBe(testUser.email);
    });
  });

  // Test the GET /users/:id route
  describe('GET /users/:id', () => {
    beforeEach(async () => {
      if (!createdUserId) {
        const response = await request(app).post('/users').send(testUser);
        createdUserId = response.body.id;
      }
    });

    it('should return a single user by ID', async () => {
      const response = await request(app).get(`/users/${createdUserId}`).expect(200);

      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = 'non-existent-id';
      const response = await request(app).get(`/users/${nonExistentId}`).expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User not found');
    });
  });

  // Test the PUT /users/:id route
  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      if (!createdUserId) {
        const response = await request(app).post('/users').send(testUser);
        createdUserId = response.body.id;
      }
    });

    it('should update user name when only name is provided', async () => {
      const updatedName = 'Jane Doe';
      const response = await request(app)
        .put(`/users/${createdUserId}`)
        .send({ name: updatedName })
        .expect(200);

      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.name).toBe(updatedName);
      expect(response.body.email).toBe(testUser.email); // Email should remain unchanged
    });

    it('should update user email when only email is provided', async () => {
      const updatedEmail = 'jane@example.com';
      const response = await request(app)
        .put(`/users/${createdUserId}`)
        .send({ email: updatedEmail })
        .expect(200);

      // At this point, the name might have been changed by the previous test
      const currentName = response.body.name;

      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.email).toBe(updatedEmail);
      expect(response.body.name).toBe(currentName); // Name should remain unchanged from previous state
    });

    it('should update both name and email when both are provided', async () => {
      const updates = {
        name: 'John Smith',
        email: 'john.smith@example.com',
      };

      const response = await request(app).put(`/users/${createdUserId}`).send(updates).expect(200);

      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.email).toBe(updates.email);
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = 'non-existent-id';
      const response = await request(app)
        .put(`/users/${nonExistentId}`)
        .send({ name: 'New Name' })
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User not found');
    });
  });

  // Test the DELETE /users/:id route
  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      // Create a new user for delete tests to ensure we have a fresh ID
      const response = await request(app).post('/users').send({
        name: 'Delete Test User',
        email: 'delete@example.com',
      });
      createdUserId = response.body.id;
    });

    it('should delete a user by ID', async () => {
      // Delete the user
      await request(app).delete(`/users/${createdUserId}`).expect(204);

      // Verify the user no longer exists
      await request(app).get(`/users/${createdUserId}`).expect(404);
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = 'non-existent-id';
      const response = await request(app).delete(`/users/${nonExistentId}`).expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User not found');
    });
  });
});

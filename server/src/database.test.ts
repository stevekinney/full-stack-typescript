import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDatabase } from './database.js';

describe('database', () => {
  beforeEach(() => {
    // Reset the module so we get a fresh databaseInstance for each test
    vi.resetModules();
  });

  it('should return a new database connection when forceNew is true', async () => {
    const db1 = await getDatabase(':memory:', true);
    const db2 = await getDatabase(':memory:', true);
    
    // These should be different instances
    expect(db1).not.toBe(db2);
  });

  it('should return the existing database instance when one exists', async () => {
    // Create a database instance
    const db1 = await getDatabase(':memory:', false);
    
    // Get the database again without forcing a new instance
    const db2 = await getDatabase(':memory:', false);
    
    // These should be the same instance
    expect(db1).toBe(db2);
  });

  it('should handle default filename based on NODE_ENV', async () => {
    // Save original NODE_ENV
    const originalNodeEnv = process.env.NODE_ENV;
    
    try {
      // Test with NODE_ENV=test
      process.env.NODE_ENV = 'test';
      const dbTest = await getDatabase(undefined, true);
      expect(dbTest).toBeDefined();
      
      // Test with NODE_ENV=production
      process.env.NODE_ENV = 'production';
      const dbProd = await getDatabase(undefined, true);
      expect(dbProd).toBeDefined();
    } finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
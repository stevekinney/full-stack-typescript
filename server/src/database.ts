import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export async function getDatabase(
  filename = process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite',
) {
  const database = await open({
    filename,
    driver: sqlite3.Database,
  });

  await database.exec(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      completed BOOLEAN DEFAULT 0
    )
  `);

  return database;
}

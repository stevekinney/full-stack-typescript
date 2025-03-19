import { PartialTask, Task } from './types';

const API_URL = 'http://localhost:4001';

// Get all tasks
export const fetchTasks = async (showCompleted: boolean): Promise<Task[]> => {
  const url = new URL(`/tasks`, API_URL);

  if (showCompleted) {
    url.searchParams.set('completed', 'true');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return await response.json();
};

export const getTask = async (id: string): Promise<Task> => {
  const url = new URL(`/tasks/${id}`, API_URL);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }

  return (await response.json()) as Task;
};

// Create a new task
export const createTask = async (task: PartialTask): Promise<void> => {
  const url = new URL('/tasks', API_URL);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }
};

// Update a task
export const updateTask = async (id: string, task: PartialTask): Promise<void> => {
  const url = new URL(`/tasks/${id}`, API_URL);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  const url = new URL(`/tasks/${id}`, API_URL);

  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as api from '../api';

import { useSearchParams } from '@/utilities/use-search-params';
import type { PartialTask, Task } from '../types';

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  createTask: (task: PartialTask) => Promise<void>;
  updateTask: (id: string, task: PartialTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams] = useSearchParams();

  const completed = useMemo(() => searchParams.get('completed') === 'true', [searchParams]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const tasks = await api.fetchTasks(completed);
      setTasks(tasks);
    } catch (error) {
      setError(error as Error);
    }

    setLoading(false);
  }, [setTasks, setLoading, setError, completed]);

  const createTask = useCallback(
    async (task: PartialTask) => {
      setLoading(true);
      try {
        await api.createTask(task);
        await fetchTasks();
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    },
    [fetchTasks, setLoading, setError],
  );

  const updateTask = useCallback(
    async (id: string, task: PartialTask) => {
      setLoading(true);
      try {
        await api.updateTask(id, task);
        await fetchTasks();
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    },
    [fetchTasks, setLoading, setError],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.deleteTask(id);
        await fetchTasks();
      } catch (error) {
        setError(error as Error);
      }
      setLoading(false);
    },
    [fetchTasks, setLoading, setError],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, completed]);

  const value = {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {loading && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading tasks
        </div>
      )}
      {children}
    </TaskContext.Provider>
  );
};

import { useTasks } from '@/contexts/task-context';
import type { Task as TaskItem } from '@/types';
import { useToggle } from '@/utilities/use-toggle';
import { Button } from './button';
import { TaskForm } from './task-form';

export const Task = (task: TaskItem) => {
  const { deleteTask, updateTask } = useTasks();
  const [editing, toggleEditing] = useToggle();

  return (
    <li
      id={`task-${task.id}`}
      className="space-y-4 rounded bg-slate-50 p-4 transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-slate-800"
      aria-labelledby={`task-title-${task.id}`}
    >
      <article
        className="flex items-center justify-between gap-8"
        onKeyDown={(e) => {
          if (e.key === 'Delete') {
            deleteTask(task.id);
          }
        }}
      >
        <input
          type="checkbox"
          className="mr-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-purple-500"
          onChange={() => {
            updateTask(task.id, {
              completed: !task.completed,
            });
          }}
          checked={task.completed}
          aria-labelledby={`task-title-${task.id}`}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="w-full">
          <h3
            id={`task-title-${task.id}`}
            className="text-lg font-medium text-gray-900 dark:text-white"
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={toggleEditing} aria-label={`Edit task: ${task.title}`}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            variant="destructive"
            aria-label={`Delete task: ${task.title}`}
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </Button>
        </div>
      </article>

      {editing && <TaskForm task={task} onSubmit={toggleEditing} />}
    </li>
  );
};

import { ComponentProps, useState, type FormEventHandler } from 'react';

import { Button } from './button';
import { Input } from './input';

import { useTasks } from '@/contexts/task-context';
import { PartialTask, Task } from '@/types';
import { cx } from '@/utilities/cx';

type TaskFormProps = ComponentProps<'form'> & {
  task?: Task;
};

export const TaskForm = ({ task, onSubmit, className, ...props }: TaskFormProps) => {
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const data = new FormData(e.target as HTMLFormElement);
    const taskData = Object.fromEntries(data.entries()) as PartialTask;

    if (task) {
      updateTask(task.id, { ...task, ...taskData });
    } else {
      createTask(taskData);
    }

    if (onSubmit) onSubmit(e);

    // Reset form fields
    setTitle('');
    setDescription('');
  };

  return (
    <form
      className={cx(
        'space-y-4 rounded-lg bg-slate-50 transition-colors duration-200 dark:bg-slate-800',
        className,
      )}
      onSubmit={handleSubmit}
      aria-label={task ? 'Edit task' : 'Create new task'}
      {...props}
    >
      <Input
        label="Title"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title…"
        required
      />

      <Input
        label="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description…"
      />

      <div aria-label="Form Controls" className="flex justify-end space-x-2" role="group">
        <Button type="submit" variant="primary">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

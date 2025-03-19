import { useTasks } from '../contexts/task-context';

import { Task } from './task';
import { EmptyState } from './empty-state';
import { Error } from './error';

export const TaskList = () => {
  const { tasks, error } = useTasks();

  if (error) {
    return <Error error={error} />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <section aria-labelledby="task-list-heading">
      <h2 id="task-list-heading" className="sr-only">
        Tasks
      </h2>
      <ul className="space-y-4" role="list" aria-label="Task list">
        {tasks.map((task) => (
          <Task key={task.id} {...task} />
        ))}
      </ul>
    </section>
  );
};

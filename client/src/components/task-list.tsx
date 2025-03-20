import { useTasks } from '../contexts/task-context';

import { EmptyState, LoadingState } from './empty-state';
import { Error } from './error';
import { Task } from './task';

export const TaskList = () => {
  const { tasks, error, loading } = useTasks();

  if (error) {
    return <Error error={error} />;
  }

  if (tasks.length === 0) {
    return loading ? <LoadingState /> : <EmptyState />;
  }

  return (
    <section aria-labelledby="task-list-heading">
      <h2 id="task-list-heading" className="sr-only">
        Tasks
      </h2>
      <ul className="space-y-4" aria-label="Task list">
        {tasks.map((task) => (
          <Task key={task.id} {...task} />
        ))}
      </ul>
    </section>
  );
};

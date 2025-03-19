import { Header } from './components/header';
import { TaskForm } from './components/task-form';
import { TaskList } from './components/task-list';

export const Application = () => {
  return (
    <div className="min-h-screen transition-colors duration-200 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <main id="main" tabIndex={-1} className="space-y-8">
          <TaskForm className="border-1 p-6" />
          <TaskList />
        </main>
      </div>
    </div>
  );
};

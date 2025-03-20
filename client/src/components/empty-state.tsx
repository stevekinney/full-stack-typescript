export const EmptyState = () => {
  return (
    <div
      className="flex min-h-96 w-full items-center justify-center bg-slate-50 p-4 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
      role="status"
      aria-live="polite"
      tabIndex={0}
    >
      <p>No tasks found. Create one!</p>
      <span className="sr-only">Use the form above to create a new task.</span>
    </div>
  );
};

export const LoadingState = () => {
  return (
    <div 
      className="flex min-h-96 animate-pulse items-center justify-center space-y-4 rounded bg-slate-50 p-4 dark:bg-slate-800"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading tasks...</span>
    </div>
  );
};

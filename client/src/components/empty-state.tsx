export const EmptyState = () => {
  return (
    <div
      className="p-4 text-center text-gray-700 dark:text-gray-300"
      role="status"
      aria-live="polite"
      tabIndex={0}
    >
      <p>No tasks found. Create one!</p>
      <span className="sr-only">Use the form above to create a new task.</span>
    </div>
  );
};

export const Error = ({ error }: { error: Error }) => {
  return (
    <div
      className="p-4 text-center text-red-500 dark:text-red-400"
      role="alert"
      aria-live="assertive"
    >
      {error.message}
    </div>
  );
};

import { cx } from '@/utilities/cx';
import { kebabCase } from 'change-case';
import type { ComponentProps } from 'react';

export type InputProps = ComponentProps<'input'> & {
  label: string;
};

export const Input = ({
  label,
  className,
  required,
  id = kebabCase(label),
  ...props
}: InputProps) => {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      id={`${id}-label`}
    >
      <div
        className={cx(
          'flex items-center gap-1',
          required &&
            "after:h-1.5 after:w-1.5 after:rounded-full after:bg-red-600 after:content-['']",
        )}
      >
        {label}
        {required && <span className="sr-only">(Required)</span>}
      </div>

      <input
        id={id}
        className={cx(
          'peer mt-1 block w-full rounded-md p-2 ring-1 transition-colors duration-200',
          'bg-white text-slate-900 ring-purple-900 dark:bg-slate-700 dark:text-white dark:ring-slate-900',
          'focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none',
          className,
        )}
        required={required}
        aria-labelledby={`${id}-label`}
        aria-required={required ? 'true' : undefined}
        {...props}
      />
    </label>
  );
};

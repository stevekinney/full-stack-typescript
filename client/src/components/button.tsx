import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cx } from '@/utilities/cx';

const button = cva(
  [
    'rounded-md',
    'px-3',
    'py-2',
    'text-sm',
    'font-semibold',
    'shadow-sm',
    'ring-purple-500',
    'outline-purple-400',
    'focus-visible:outline',
    'focus-visible:outline-1',
    'focus-visible:outline-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:shadow-none',
    'disabled:transition-none',
    'disabled:focus-visible:outline-none',
    'disabled:focus-visible:ring-0',
    'disabled:focus-visible:ring-offset-0',
    'disabled:focus-visible:ring-inset',
    'transition-colors',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-purple-600',
          'text-white',
          'hover:bg-purple-700',
          'dark:bg-purple-700',
          'dark:hover:bg-purple-800',
        ],
        secondary: [
          'ring-1',
          'ring-inset',
          'bg-purple-50',
          'text-slate-950',
          'ring-purple-800',
          'hover:bg-purple-100',
          'dark:bg-slate-600',
          'dark:text-slate-50',
          'dark:ring-slate-900',
        ],
        destructive: [
          'bg-red-700',
          'text-white',
          'hover:bg-red-800',
          'focus-visible:outline-red-400',
        ],
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
);

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>;

export const Button = ({ className, variant = 'secondary', ...props }: ButtonProps) => {
  return (
    <button
      className={cx(button({ variant }), className)}
      aria-disabled={props.disabled}
      {...props}
    />
  );
};

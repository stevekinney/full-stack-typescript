import { clsx } from 'clsx';
import { twMerge as merge } from 'tailwind-merge';

/**
 * Merge class names and remove duplicates.
 * @param inputs A list of class names or boolean values.
 */
export const cx = (...inputs: (string | boolean | null | undefined)[]): string => {
  return merge(clsx(inputs));
};

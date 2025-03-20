import { useSearchParams } from '@/utilities/use-search-params';
import { cx } from 'class-variance-authority';
import { ThemeToggle } from './theme-toggle';

const activeClass = cx(
  'text-gray-900 dark:text-white underline underline-offset-4 decoration-purple-500',
);

export const Header = () => {
  const [searchParams] = useSearchParams();
  const completed = searchParams.get('completed') === 'true';

  return (
    <header className="mb-8 flex items-center justify-between" role="banner">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Busy Bee</h1>
      <nav className="flex items-center gap-4" aria-label="Filter tasks">
        <a
          href="/"
          className={cx('text-sm text-gray-500 hover:underline', !completed && activeClass)}
        >
          Incomplete
        </a>
        <a
          href="/?completed=true"
          className={cx('text-sm text-gray-500 hover:underline', completed && activeClass)}
        >
          Completed
        </a>
      </nav>
      <ThemeToggle />
    </header>
  );
};

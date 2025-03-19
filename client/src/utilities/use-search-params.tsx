import { useCallback, useState } from 'react';

const getSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams;
};

/**
 * Custom hook to manage search parameters.
 * @returns A tuple containing the current search parameters and a function to update them.
 */
export const useSearchParams = () => {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(getSearchParams());

  const updateSearchParams = useCallback(
    () => setSearchParams(getSearchParams()),
    [setSearchParams],
  );

  return [searchParams, updateSearchParams] as const;
};

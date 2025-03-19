import { useCallback, useState } from 'react';

export const useToggle = (initial = false) => {
  const [active, setToggle] = useState(initial);

  const toggle = useCallback(() => setToggle((prev) => !prev), [setToggle]);

  return [active, toggle] as const;
};

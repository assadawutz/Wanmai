import { useEffect, useState } from 'react';

export function usePersistentState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      setState(JSON.parse(raw) as T);
    } catch {
      setState(initial);
    }
  }, [initial, key]);

  const setPersisted = (value: T): void => {
    setState(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // degraded mode: keep in-memory
    }
  };

  return [state, setPersisted];
}

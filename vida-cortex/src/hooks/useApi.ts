import { useState, useEffect } from 'react';

// ========================================
// GENERIC API HOOK
// ========================================

interface UseApiOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialData, autoFetch = true } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// ========================================
// POLLING HOOK (for real-time updates)
// ========================================

export function usePolling<T>(
  apiFunction: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const { data, loading, error, refetch } = useApi(apiFunction, { autoFetch: enabled });

  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      refetch();
    }, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, refetch]);

  return { data, loading, error, refetch };
}

// ========================================
// MUTATION HOOK (for POST/PUT/DELETE)
// ========================================

export function useMutation<TData, TVariables = void>(
  mutationFunction: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFunction(variables);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
}

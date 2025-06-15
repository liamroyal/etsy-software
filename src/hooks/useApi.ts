import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData,
    onSuccess,
    onError,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    // Check cache first
    if (cacheKey && !isRefresh) {
      const cachedItem = cache.get(cacheKey);
      if (cachedItem && Date.now() - cachedItem.timestamp < cacheDuration) {
        setData(cachedItem.data);
        return;
      }
    }

    try {
      isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      const result = await fetcher();
      
      // Update cache
      if (cacheKey) {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only fetch on mount

  const refresh = () => fetchData(true);
  const clearCache = () => cacheKey && cache.delete(cacheKey);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refresh,
    clearCache,
  };
} 
import { useState, useEffect, useCallback } from "react";

interface FetchOptions {
  method?: string;
  headers?: HeadersInit;
  token: string;
  body?: BodyInit | null;
}

const useFetch = <T>(url: string, options?: FetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: options?.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options?.token}`,
          ...options?.headers,
        },
        body: options?.body || null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options?.body, options?.headers, options?.method, options?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, trigger]);

  const refetch = () => setTrigger((prev) => prev + 1);

  return { data, loading, error, refetch };
};

export default useFetch;
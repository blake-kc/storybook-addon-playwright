import { useState, useCallback } from 'react';

type ArgsType<T> = T extends (...args: infer U) => unknown ? U : never;

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
type AsyncApiCallReturnType<T extends Function> = ThenArg<ReturnType<T>>;

export const useAsyncApiCall = <T extends Function>(
  func: T,
  setResponseResult = true,
) => {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<string>();

  const [result, setResult] = useState<AsyncApiCallReturnType<T>>();

  const makeCall = useCallback(
    async (
      ...args: ArgsType<T>
    ): Promise<AsyncApiCallReturnType<T> | Error> => {
      setError(undefined);
      setResult(undefined);
      setInProgress(true);
      let data;
      try {
        data = await func(...args);
        if (setResponseResult) setResult(data);
        setInProgress(false);
      } catch (error) {
        setInProgress(false);
        setError(error.message);
        return new Error(error.message);
      }
      return data;
    },
    [func, setResponseResult],
  );

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, []);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return { clearError, clearResult, error, inProgress, makeCall, result };
};
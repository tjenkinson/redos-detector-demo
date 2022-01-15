import type { Calculate, ResultOrError } from './calculate-worker';
import * as Comlink from 'comlink';

export type CalculateHandle = {
  abort: () => void;
  result: Promise<ResultOrError>;
};

export const aborted: unique symbol = Symbol('aborted');

export function calculate(pattern: string, unicode: boolean): CalculateHandle {
  const worker = new Worker(new URL('./calculate-worker.ts', import.meta.url), {
    type: 'module',
  });

  const calculateWorker = Comlink.wrap<Calculate>(worker);
  let onAbort: () => void;
  const abortedPromise = new Promise<never>((_, _onAbort) => {
    onAbort = () => _onAbort(aborted);
  });
  const fakeDelay = new Promise<void>((resolve) =>
    setTimeout(() => resolve(), 200)
  );
  return {
    abort: () => {
      onAbort();
      worker.terminate();
      calculateWorker[Comlink.releaseProxy]();
    },
    result: Promise.race([
      abortedPromise,
      calculateWorker(pattern, unicode).then(async (res) => {
        await fakeDelay;
        return res;
      }),
    ]),
  };
}

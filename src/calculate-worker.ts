import type { RedosDetectorResult } from 'redos-detector';
import { sequence } from './sequence';
import * as Comlink from 'comlink';

export type Result = {
  type: 'result';
  result: RedosDetectorResult;
  included: Set<number>;
};

export type ResultOrError =
  | Result
  | {
      type: 'error';
      message: string;
    };

export type Calculate = (
  pattern: string,
  unicode: boolean
) => Promise<ResultOrError>;

const calculate: Calculate = async (pattern: string, unicode: boolean) => {
  try {
    const { isSafePattern } = await import('./redos-detector-is-safe-pattern');
    const result = isSafePattern(pattern, {
      unicode,
    });
    const included: Set<number> = new Set();
    result.trails.forEach(({ trail }) => {
      trail.forEach(({ a, b }) => {
        [a, b].forEach((side) => {
          const nodes = [
            side.node,
            ...side.backreferenceStack.map(({ node }) => node),
          ];
          nodes.forEach((node) => {
            sequence(node.start.offset, node.end.offset).forEach((offset) => {
              included.add(offset);
            });
          });
        });
      });
    });
    return { type: 'result', result, included };
  } catch (e: any) {
    console.error(e);
    return { type: 'error', message: e.message || 'Unknown error.' };
  }
};

Comlink.expose(calculate);

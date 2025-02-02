import type { RecordKey } from './utils/unique';
import * as uniqueExec from './utils/unique';

/**
 * Module to generate unique entries.
 */
export class Unique {
  /**
   * Maximum time `unique.exec` will attempt to run before aborting.
   *
   * @deprecated Use options instead.
   */
  maxTime = 10;

  /**
   * Maximum retries `unique.exec` will recurse before aborting (max loop depth).
   *
   * @deprecated Use options instead.
   */
  maxRetries = 10;

  constructor() {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(Unique.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Generates a unique result using the results of the given method.
   * Used unique entries will be stored internally and filtered from subsequent calls.
   *
   * @template Method The type of the method to execute.
   * @param method The method used to generate the values.
   * @param args The arguments used to call the method.
   * @param options The optional options used to configure this method.
   * @param options.startTime This parameter does nothing.
   * @param options.maxTime The time in milliseconds this method may take before throwing an error. Defaults to `50`.
   * @param options.maxRetries The total number of attempts to try before throwing an error. Defaults to `50`.
   * @param options.currentIterations This parameter does nothing.
   * @param options.exclude The value or values that should be excluded/skipped. Defaults to `[]`.
   * @param options.compare The function used to determine whether a value was already returned. Defaults to check the existence of the key.
   *
   * @example
   * faker.unique(faker.name.firstName) // 'Corbin'
   */
  unique<Method extends (...parameters) => RecordKey>(
    method: Method,
    args?: Parameters<Method>,
    options: {
      startTime?: number;
      maxTime?: number;
      maxRetries?: number;
      currentIterations?: number;
      exclude?: RecordKey | RecordKey[];
      compare?: (obj: Record<RecordKey, RecordKey>, key: RecordKey) => 0 | -1;
    } = {}
  ): ReturnType<Method> {
    const { maxTime = this.maxTime, maxRetries = this.maxRetries } = options;
    return uniqueExec.exec(method, args, {
      ...options,
      startTime: new Date().getTime(),
      maxTime,
      maxRetries,
      currentIterations: 0,
    });
  }
}

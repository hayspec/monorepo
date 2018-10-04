import { Spec } from '@hayspec/spec';
import * as glob from 'fast-glob';

/**
 *
 */
export interface RunnerResult {
  file: string;
  spec: Spec;
}

/**
 *
 */
export interface RunnerOptions {
  cwd?: string;
  deep?: boolean;
  dot?: boolean;
}

 /**
 *
 */
export class Runner {
  protected options: RunnerOptions;
  public results: RunnerResult[] = [];

  /**
   * 
   */
  public constructor(options?: RunnerOptions) {
    this.options = {
      cwd: process.cwd(),
      deep: true,
      dot: false,
      ...options,
    };
  }

  /**
   * 
   */
  public async require(...patterns: string[]) {
    const options = {
      absolute: true,
      ...this.options,
    };
    const files = await glob(patterns, options) as string[];

    files.forEach((file) => {
      this.loadSpec(file);
    });
  }

  /**
   *
   */
  public clear () {
    this.results = [];
    return this;
  }

  /**
   * 
   * NOTE: Due to different NPM package managers, the `instanceof` check my be
   * inconsistent thus the function checks for presence of the `test` method.
   */
  protected async loadSpec(file: string) {
    const spec = require(file);

    if (typeof spec.test !== 'undefined') {
      this.results.push({ file, spec });
    } else if (spec.default && typeof spec.default.test !== 'undefined') {
      this.results.push({ file, spec: spec.default });
    }
  }

}

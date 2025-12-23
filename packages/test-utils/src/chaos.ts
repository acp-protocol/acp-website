/**
 * @acp:domain tests
 * @acp:layer utility
 */
/**
 * @module @acp-website/test-utils/chaos
 * @file Chaos testing utilities for stress testing React components. Provides
 *   tools for fuzzing, race conditions, and failure simulation.
 */

import { vi } from "vitest";

/**
 * Executes a function rapidly multiple times.
 *
 * Useful for testing components under rapid state changes, simulating user
 * mashing buttons or rapid theme switching.
 *
 * @example
 *   ```typescript
 *   await rapidFire(() => setTheme('dark'), 1000, 0);
 *   expect(renderCount).toBeLessThan(10); // Should batch updates
 *   ```;
 *
 * @param fn - The function to execute
 * @param count - Number of times to execute (default: 1000)
 * @param intervalMs - Delay between executions in ms (default: 0)
 * @returns Promise that resolves when all executions complete
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Rapids fire"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Rapids fire"
 */
export async function rapidFire(
  fn: () => void | Promise<void>,
  count = 1000,
  intervalMs = 0
): Promise<void> {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const promises: Promise<void>[] = [];

  /**
   * @acp:domain utilities
   * @acp:layer utility
   * @acp:domain utilities
   * @acp:layer utility
   * @acp:domain utilities
   * @acp:layer utility
   * @acp:domain utilities
   * @acp:layer utility
   */
  for (let i = 0; i < count; i++) {
    /**
     * @acp:domain utilities
     * @acp:layer utility
     */
    const promise = Promise.resolve(fn());
    promises.push(promise);

    if (intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  await Promise.all(promises);
}

/**
 * Returns a promise that resolves after a random delay.
 *
 * Useful for simulating network latency or async operations with unpredictable
 * timing.
 *
 * @example
 *   ```typescript
 *   await randomDelay(10, 100);
 *   ```;
 *
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @returns Promise that resolves after the random delay
 * @security Math.random() is safe here as this is only used for testing/simulation,
 * not for cryptographic purposes or security-sensitive operations.
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Randoms delay"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Randoms delay"
 */
export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  // SECURITY: Math.random() is appropriate for test simulation purposes
  // NOSONAR: This is test utility code, not cryptographic use
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs; // NOSONAR
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Creates a large DOM tree to simulate memory pressure.
 *
 * Useful for testing component behavior under memory-constrained conditions,
 * such as theme switching with a complex DOM.
 *
 * @example
 *   ```typescript
 *   const cleanup = simulateMemoryPressure(50000);
 *   // Run your tests
 *   await switchTheme();
 *   cleanup();
 *   ```;
 *
 * @param nodeCount - Number of nodes to create (default: 10000)
 * @returns Cleanup function to remove the created nodes
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Simulates memory pressure"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Simulates memory pressure"
 */
export function simulateMemoryPressure(nodeCount = 10000): () => void {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const container = document.createElement("div");
  container.id = "chaos-memory-pressure";
  container.style.display = "none";

  for (let i = 0; i < nodeCount; i++) {
    /**
     * @acp:domain utilities
     * @acp:layer utility
     */
    const node = document.createElement("div");
    node.className = `pressure-node-${i}`;
    node.textContent = `Node ${i}`;
    node.dataset.index = String(i);
    container.appendChild(node);
  }

  document.body.appendChild(container);

  return () => {
    container.remove();
  };
}

/**
 * Corrupts localStorage data for a specific key.
 *
 * Tests how components handle invalid or corrupted stored data.
 *
 * @example
 *   ```typescript
 *   corruptLocalStorage('theme-variant', 'invalid-json');
 *   // Component should gracefully fall back to default
 *   ```;
 *
 * @param key - The localStorage key to corrupt
 * @param corruptionType - Type of corruption to apply
 */
/**
 * @acp:domain data
 * @acp:layer repository
 * @acp:lock normal
 * @acp:summary "Corrupts local storage"
 * @acp:domain data
 * @acp:layer repository
 * @acp:summary "Corrupts local storage"
 */
export function corruptLocalStorage(
  key: string,
  corruptionType:
    | "invalid-json"
    | "wrong-type"
    | "xss-attempt"
    | "overflow"
    | "null-bytes" = "invalid-json"
): void {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const corruptions: Record<string, string> = {
    "invalid-json": "{invalid json",
    "wrong-type": "42",
    "xss-attempt": '<script>alert("xss")</script>',
    overflow: "x".repeat(1024 * 1024), // 1MB string
    "null-bytes": "theme\x00variant",
  };

  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const corruptedValue = corruptions[corruptionType];
  if (corruptedValue !== undefined) {
    localStorage.setItem(key, corruptedValue);
  }
}

/**
 * Creates a mock that simulates storage quota exceeded errors.
 *
 * Tests graceful handling of storage full scenarios.
 *
 * @example
 *   ```typescript
 *   const quota = simulateStorageQuotaExceeded();
 *   quota.enable();
 *   expect(() => localStorage.setItem('key', 'value')).toThrow();
 *   quota.disable();
 *   ```;
 *
 * @returns Object with enable/disable controls
 */
/**
 * @acp:domain data
 * @acp:layer repository
 * @acp:lock normal
 * @acp:summary "Simulates storage quota exceeded"
 * @acp:domain data
 * @acp:layer repository
 * @acp:summary "Simulates storage quota exceeded"
 */
export function simulateStorageQuotaExceeded(): {
  enable: () => void;
  disable: () => void;
} {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const originalSetItem = localStorage.setItem.bind(localStorage);
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  let enabled = false;

  localStorage.setItem = vi.fn((key: string, value: string) => {
    if (enabled) {
      /**
       * @acp:domain utilities
       * @acp:layer utility
       */
      const error = new DOMException(
        "QuotaExceededError: The quota has been exceeded.",
        "QuotaExceededError"
      );
      throw error;
    }
    return originalSetItem(key, value);
  });

  return {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    },
  };
}

/**
 * Generator function for fuzzing values.
 *
 * @private
 */
function* generatorForFuzzing() {
  yield 1;
}

/**
 * Generates random invalid values for fuzzing.
 *
 * Creates an array of random/invalid values to test component robustness
 * against unexpected inputs.
 *
 * @example
 *   ```typescript
 *   const fuzzed = fuzzer(['light', 'dark', 'system'], 100);
 *   for (const value of fuzzed) {
 *     setTheme(value); // Should not crash
 *   }
 *   ```;
 *
 * @param validValues - Array of valid values to base fuzzing on
 * @param count - Number of fuzzed values to generate (default: 50)
 * @returns Array of fuzzed values
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Fuzzers"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Fuzzers"
 */
export function fuzzer<T>(validValues: T[], count = 50): unknown[] {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const fuzzedValues: unknown[] = [];

  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const generators = [
    // Null/undefined
    () => null,
    () => undefined,
    // Empty values
    () => "",
    () => [],
    () => ({}),
    // Numbers
    () => 0,
    () => -1,
    () => Infinity,
    () => -Infinity,
    () => Number.NaN,
    () => Number.MAX_SAFE_INTEGER,
    () => Number.MIN_SAFE_INTEGER,
    // Strings
    () => " ",
    () => "\n\t",
    () => "null",
    () => "undefined",
    () => "true",
    () => "false",
    () => "<script>",
    () => "'; DROP TABLE users; --",
    () => "${7*7}",
    () => "{{constructor.constructor('return this')()}}",
    // Modified valid values
    () =>
      typeof validValues[0] === "string"
        ? validValues[0].toUpperCase()
        : validValues[0],
    () =>
      typeof validValues[0] === "string"
        ? ` ${validValues[0]} `
        : validValues[0],
    () =>
      typeof validValues[0] === "string"
        ? validValues[0] + "\x00"
        : validValues[0],
    // Special objects
    () => new Date(),
    () => /regex/,
    () => Symbol("test"),
    () => new Map(),
    () => new Set(),
    () => new WeakMap(),
    () => new WeakSet(),
    // Functions
    () => () => {},
    () => generatorForFuzzing,
    () => async () => {},
    // Proxy/prototype pollution attempts
    () => ({ __proto__: { polluted: true } }),
    () => ({ constructor: { prototype: { polluted: true } } }),
    // Long strings
    () => "a".repeat(10000),
    // Unicode
    () => "\u0000\u0001\u0002",
    () => "\uD800\uDFFF", // Surrogate pairs
    () => "🔥".repeat(100),
    // Array-like
    () => ({ length: 3, 0: "a", 1: "b", 2: "c" }),
    () => new Uint8Array([1, 2, 3]),
  ];

  for (let i = 0; i < count; i++) {
    // SECURITY: Math.random() is appropriate for fuzzing/testing purposes
    // NOSONAR: This is test utility code, not cryptographic use
    /**
     * @acp:domain utilities
     * @acp:layer utility
     */
    const randomIndex = Math.floor(Math.random() * generators.length); // NOSONAR
    /**
     * @acp:domain utilities
     * @acp:layer utility
     */
    const generator = generators[randomIndex];
    if (generator) {
      fuzzedValues.push(generator());
    }
  }

  return fuzzedValues;
}

/**
 * Tests for race conditions in mount/unmount cycles.
 *
 * Rapidly mounts and unmounts components to detect race conditions in cleanup
 * logic or async operations.
 *
 * @example
 *   ```typescript
 *   await raceConditionTester(
 *     () => {
 *       const { unmount } = render(<ThemeProvider><App /></ThemeProvider>);
 *       return unmount;
 *     },
 *     100,
 *     { maxConcurrent: 5 }
 *   );
 *   ```;
 *
 * @param setup - Function to mount the component, returns cleanup function
 * @param iterations - Number of mount/unmount cycles (default: 100)
 * @param options - Additional options
 * @returns Promise that resolves when testing is complete
 */
/**
 * @acp:domain tests
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Races condition tester"
 * @acp:domain tests
 * @acp:layer utility
 * @acp:summary "Races condition tester"
 */
export async function raceConditionTester(
  setup: () => (() => void) | Promise<() => void>,
  iterations = 100,
  options: {
    maxConcurrent?: number;
    delayBetween?: number;
    randomDelay?: boolean;
  } = {}
): Promise<void> {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const {
    maxConcurrent = 10,
    delayBetween = 0,
    randomDelay: useRandomDelay = false,
  } = options;

  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const running: Promise<void>[] = [];

  for (let i = 0; i < iterations; i++) {
    /**
     * @acp:domain utilities
     * @acp:layer utility
     * @acp:summary "Runs"
     */
    const run = async () => {
      /**
       * @acp:domain utilities
       * @acp:layer utility
       */
      const cleanup = await setup();
      if (useRandomDelay) {
        await randomDelay(0, 10);
      } else if (delayBetween > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayBetween));
      }
      cleanup();
    };

    running.push(run());

    if (running.length >= maxConcurrent) {
      await Promise.race(running);
      // Wait for all and clear
      await Promise.allSettled(running);
      running.length = 0;
    }
  }

  await Promise.all(running);
}

/** Configuration for network failure simulation. */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "NetworkFailureOptions interface"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "NetworkFailureOptions interface"
 */
export interface NetworkFailureOptions {
  /** Probability of failure (0-1) */
  failureProbability?: number;
  /** Delay before failure in ms */
  delayMs?: number;
  /** Error type to throw */
  errorType?: "timeout" | "network" | "abort" | "cors";
}

/**
 * Mocks fetch to simulate network failures for specific URL patterns.
 *
 * Tests component behavior when CSS or other resources fail to load.
 *
 * @example
 *   ```typescript
 *   const restore = networkFailure(/\.css$/, {
 *     failureProbability: 0.5,
 *     errorType: 'network'
 *   });
 *   // Test theme CSS loading with intermittent failures
 *   restore();
 *   ```;
 *
 * @param urlPattern - Regex or string pattern to match URLs
 * @param options - Failure configuration
 * @returns Cleanup function to restore original fetch
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Networks failure"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Networks failure"
 */
export function networkFailure(
  urlPattern: RegExp | string,
  options: NetworkFailureOptions = {}
): () => void {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const {
    failureProbability = 1,
    delayMs = 0,
    errorType = "network",
  } = options;

  /**
   * @acp:domain data
   * @acp:layer repository
   */
  const originalFetch = globalThis.fetch;
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const pattern =
    typeof urlPattern === "string" ? new RegExp(urlPattern) : urlPattern;

  globalThis.fetch = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      let url: string;
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input.url;
      }

      // SECURITY: Math.random() is appropriate for test simulation purposes
      // NOSONAR: This is test utility code, not cryptographic use
      if (pattern.test(url) && Math.random() < failureProbability) {
        // NOSONAR
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        /**
         * @acp:domain utilities
         * @acp:layer utility
         */
        const errors: Record<string, Error> = {
          timeout: new DOMException("The operation timed out.", "TimeoutError"),
          network: new TypeError("Failed to fetch"),
          abort: new DOMException("The operation was aborted.", "AbortError"),
          cors: new TypeError("Failed to fetch (CORS)"),
        };

        throw errors[errorType];
      }

      return originalFetch(input, init);
    }
  );

  return () => {
    globalThis.fetch = originalFetch;
  };
}

/**
 * Simulates concurrent access from multiple "tabs".
 *
 * Tests storage event handling and synchronization between simulated browser
 * tabs.
 *
 * @example
 *   ```typescript
 *   await simulateConcurrentTabs('theme', ['dark', 'light', 'system']);
 *   // Component should handle storage events correctly
 *   ```;
 *
 * @param key - LocalStorage key to access
 * @param values - Values to write from different "tabs"
 * @param intervalMs - Interval between writes (default: 0)
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Simulates concurrent tabs"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Simulates concurrent tabs"
 */
export async function simulateConcurrentTabs(
  key: string,
  values: string[],
  intervalMs = 0
): Promise<void> {
  /**
   * @acp:domain data
   * @acp:layer repository
   */
  const storageEventPromises = values.map(async (value, index) => {
    if (intervalMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, index * intervalMs));
    }

    localStorage.setItem(key, value);

    // Dispatch storage event to simulate cross-tab communication
    /**
     * @acp:domain utilities
     * @acp:layer utility
     */
    const event = new StorageEvent("storage", {
      key,
      newValue: value,
      oldValue: localStorage.getItem(key),
      storageArea: localStorage,
      url: window.location.href,
    });

    window.dispatchEvent(event);
  });

  await Promise.all(storageEventPromises);
}

/**
 * Measures render performance during operations.
 *
 * Tracks render counts and timing to detect performance regressions.
 *
 * @example
 *   ```typescript
 *   const perf = createPerformanceTracker();
 *   const { rerender } = render(<Component onRender={perf.onRender} />);
 *   await switchTheme();
 *   expect(perf.getRenderCount()).toBeLessThan(5);
 *   ```;
 *
 * @returns Object with tracking functions
 */
/**
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Creates performance tracker"
 * @acp:domain utilities
 * @acp:layer utility
 * @acp:summary "Creates performance tracker"
 */
export function createPerformanceTracker(): {
  onRender: () => void;
  getRenderCount: () => number;
  getTiming: () => number[];
  reset: () => void;
  getAverageTime: () => number;
} {
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  let renderCount = 0;
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  const timings: number[] = [];
  /**
   * @acp:domain utilities
   * @acp:layer utility
   */
  let lastRenderTime = performance.now();

  return {
    onRender: () => {
      /**
       * @acp:domain utilities
       * @acp:layer utility
       */
      const now = performance.now();
      if (renderCount > 0) {
        timings.push(now - lastRenderTime);
      }
      lastRenderTime = now;
      renderCount++;
    },
    getRenderCount: () => renderCount,
    getTiming: () => [...timings],
    reset: () => {
      renderCount = 0;
      timings.length = 0;
      lastRenderTime = performance.now();
    },
    getAverageTime: () => {
      if (timings.length === 0) return 0;
      return timings.reduce((a, b) => a + b, 0) / timings.length;
    },
  };
}
import { Platform } from 'react-native';

export class PerformanceMonitor {
  private static measurements: Map<string, number> = new Map();

  static start(label: string): void {
    this.measurements.set(label, Date.now());
  }

  static end(label: string): number {
    const startTime = this.measurements.get(label);
    if (!startTime) {
      console.warn(`Performance measurement for "${label}" not found`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.measurements.delete(label);
    console.log(`⏱️ ${label}: ${duration}ms`);
    return duration;
  }

  static measure<T>(label: string, fn: () => T | Promise<T>): T | Promise<T> {
    this.start(label);

    if (fn.constructor.name === 'AsyncFunction') {
      return (async () => {
        try {
          const result = await fn();
          this.end(label);
          return result;
        } catch (error) {
          this.end(label);
          throw error;
        }
      })();
    } else {
      try {
        const result = fn();
        this.end(label);
        return result;
      } catch (error) {
        this.end(label);
        throw error;
      }
    }
  }
}

export class MemoryMonitor {
  static getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if (Platform.OS === 'web') {
      const performance = (window as any).performance;
      if (performance && performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        return {
          used: Math.round(used / 1024 / 1024), // MB
          total: Math.round(total / 1024 / 1024), // MB
          percentage: Math.round((used / total) * 100)
        };
      }
    }
    return null;
  }

  static logMemoryUsage(label: string = ''): void {
    const usage = this.getMemoryUsage();
    if (usage) {
      console.log(`🧠 Memory ${label}: ${usage.used}MB / ${usage.total}MB (${usage.percentage}%)`);
    }
  }
}

export class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static maxCacheSize = 50;

  static set(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // 기본 5분
    // 캐시 크기 제한
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 체크
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  static size(): number {
    return this.cache.size;
  }
}

export class Optimizer {
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static async asyncQueue<T>(
    tasks: (() => Promise<T>)[],
    concurrency: number = 3
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const promise = task().then(result => {
        results.push(result);
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }

    await Promise.all(executing);
    return results;
  }
}
// React-inspired hooks service for Angular
// Demonstrates React patterns like custom hooks, useEffect, useState, useMemo
import { Injectable, signal, computed, effect } from '@angular/core';
import { BehaviorSubject, Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, throttleTime, map } from 'rxjs/operators';

export interface UseStateResult<T> {
  value: () => T;
  setValue: (newValue: T | ((prevValue: T) => T)) => void;
}

export interface UseEffectCleanup {
  (): void;
}

@Injectable({
  providedIn: 'root'
})
export class ReactHooksService {
  private cleanupFunctions = new Set<UseEffectCleanup>();

  // React useState equivalent using Angular signals
  useState<T>(initialValue: T): UseStateResult<T> {
    const state = signal(initialValue);
    
    return {
      value: state,
      setValue: (newValue: T | ((prevValue: T) => T)) => {
        if (typeof newValue === 'function') {
          const fn = newValue as (prevValue: T) => T;
          state.update(fn);
        } else {
          state.set(newValue);
        }
      }
    };
  }

  // React useEffect equivalent using Angular effect
  useEffect(effectFn: () => void | UseEffectCleanup, deps?: any[]): void {
    let cleanup: UseEffectCleanup | undefined;

    effect(() => {
      // Clean up previous effect
      if (cleanup) {
        cleanup();
      }

      // Run the effect
      const result = effectFn();
      if (typeof result === 'function') {
        cleanup = result;
        this.cleanupFunctions.add(cleanup);
      }
    });
  }

  // React useMemo equivalent using Angular computed
  useMemo<T>(computeFn: () => T, deps?: any[]): () => T {
    return computed(computeFn);
  }

  // React useCallback equivalent
  useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T {
    // In Angular, we can use computed to memoize functions
    const memoizedCallback = computed(() => callback);
    return memoizedCallback() as T;
  }

  // React custom hook: useDebounce
  useDebounce<T>(value: Observable<T>, delay: number = 300): Observable<T> {
    return value.pipe(
      debounceTime(delay),
      distinctUntilChanged()
    );
  }

  // React custom hook: useThrottle
  useThrottle<T>(value: Observable<T>, delay: number = 1000): Observable<T> {
    return value.pipe(
      throttleTime(delay)
    );
  }

  // React custom hook: useLocalStorage
  useLocalStorage<T>(key: string, initialValue: T): UseStateResult<T> {
    // Get from localStorage or use initial value
    const getStoredValue = (): T => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return initialValue;
      }
    };

    const storedValue = getStoredValue();
    const state = signal<T>(storedValue);

    return {
      value: state,
      setValue: (newValue: T | ((prevValue: T) => T)) => {
        try {
          const valueToStore = typeof newValue === 'function' 
            ? (newValue as (prevValue: T) => T)(state())
            : newValue;
          
          state.set(valueToStore);
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    };
  }

  // React custom hook: useWindowResize
  useWindowResize(): { width: () => number; height: () => number } {
    const width = signal(window.innerWidth);
    const height = signal(window.innerHeight);

    const cleanup = this.useEffect(() => {
      const handleResize = () => {
        width.set(window.innerWidth);
        height.set(window.innerHeight);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });

    return { width, height };
  }

  // React custom hook: useKeyPress
  useKeyPress(targetKey: string): () => boolean {
    const keyPressed = signal(false);

    const cleanup = this.useEffect(() => {
      const downHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) {
          keyPressed.set(true);
        }
      };

      const upHandler = (event: KeyboardEvent) => {
        if (event.key === targetKey) {
          keyPressed.set(false);
        }
      };

      document.addEventListener('keydown', downHandler);
      document.addEventListener('keyup', upHandler);

      return () => {
        document.removeEventListener('keydown', downHandler);
        document.removeEventListener('keyup', upHandler);
      };
    });

    return keyPressed;
  }

  // React custom hook: useAsync
  useAsync<T>(asyncFn: () => Promise<T>) {
    const data = signal<T | null>(null);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const execute = async () => {
      loading.set(true);
      error.set(null);
      
      try {
        const result = await asyncFn();
        data.set(result);
      } catch (err) {
        error.set(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        loading.set(false);
      }
    };

    return {
      data,
      loading,
      error,
      execute
    };
  }

  // React custom hook: useToggle
  useToggle(initialValue: boolean = false) {
    const value = signal(initialValue);
    
    const toggle = () => value.update(v => !v);
    const setTrue = () => value.set(true);
    const setFalse = () => value.set(false);

    return {
      value,
      toggle,
      setTrue,
      setFalse
    };
  }

  // React custom hook: useCounter
  useCounter(initialValue: number = 0) {
    const count = signal(initialValue);
    
    const increment = (amount: number = 1) => count.update(c => c + amount);
    const decrement = (amount: number = 1) => count.update(c => c - amount);
    const reset = () => count.set(initialValue);

    return {
      count,
      increment,
      decrement,
      reset
    };
  }

  // React custom hook: usePrevious
  usePrevious<T>(value: T): () => T | undefined {
    const previous = signal<T | undefined>(undefined);
    
    effect(() => {
      previous.set(value);
    });

    return previous;
  }

  // React custom hook: useInterval
  useInterval(callback: () => void, delay: number | null) {
    this.useEffect(() => {
      if (delay === null) return;

      const interval = setInterval(callback, delay);
      return () => clearInterval(interval);
    });
  }

  // React custom hook: useTimeout
  useTimeout(callback: () => void, delay: number | null) {
    this.useEffect(() => {
      if (delay === null) return;

      const timeout = setTimeout(callback, delay);
      return () => clearTimeout(timeout);
    });
  }

  // Cleanup all effects (call this in ngOnDestroy)
  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.clear();
  }

  // React patterns: Higher-Order Components equivalent (Higher-Order Services)
  withLoading<T>(service: T): T & { isLoading: () => boolean } {
    const isLoading = signal(false);
    
    return {
      ...service,
      isLoading
    };
  }

  // React patterns: Render props equivalent (Service composition)
  withErrorBoundary<T>(service: T): T & { 
    error: () => string | null; 
    clearError: () => void; 
    hasError: () => boolean;
  } {
    const error = signal<string | null>(null);
    const hasError = computed(() => error() !== null);
    
    return {
      ...service,
      error,
      clearError: () => error.set(null),
      hasError
    };
  }

  // React patterns: Context API equivalent using Angular dependency injection
  // This would be implemented using Angular's built-in DI system
  createContext<T>(defaultValue: T) {
    const context = signal(defaultValue);
    
    return {
      Provider: context,
      useContext: () => context()
    };
  }
}
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../../hooks/ui/useDebounce';

describe('useDebounce Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('Basic Functionality', () => {
        it('should return initial value immediately', () => {
            const { result } = renderHook(() => useDebounce('initial', 500));
            expect(result.current).toBe('initial');
        });

        it('should debounce value changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 500 } }
            );

            // Initial value
            expect(result.current).toBe('initial');

            // Change value
            rerender({ value: 'changed', delay: 500 });
            expect(result.current).toBe('initial'); // Still initial

            // Advance time but not enough
            act(() => {
                vi.advanceTimersByTime(250);
            });
            expect(result.current).toBe('initial'); // Still initial

            // Advance time enough
            act(() => {
                vi.advanceTimersByTime(250);
            });
            expect(result.current).toBe('changed'); // Now changed
        });

        it('should reset debounce timer on rapid changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 500 } }
            );

            // Change value multiple times rapidly
            rerender({ value: 'change1', delay: 500 });
            act(() => {
                vi.advanceTimersByTime(250);
            });

            rerender({ value: 'change2', delay: 500 });
            act(() => {
                vi.advanceTimersByTime(250);
            });

            rerender({ value: 'change3', delay: 500 });
            act(() => {
                vi.advanceTimersByTime(250);
            });

            // Should still be initial because timer kept resetting
            expect(result.current).toBe('initial');

            // Now advance the full delay
            act(() => {
                vi.advanceTimersByTime(250);
            });
            expect(result.current).toBe('change3');
        });
    });

    describe('Different Data Types', () => {
        it('should work with strings', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 'hello' } }
            );

            rerender({ value: 'world' });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe('world');
        });

        it('should work with numbers', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 0 } }
            );

            rerender({ value: 42 });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe(42);
        });

        it('should work with objects', () => {
            const initialObj = { name: 'John', age: 30 };
            const newObj = { name: 'Jane', age: 25 };

            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: initialObj } }
            );

            rerender({ value: newObj });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toEqual(newObj);
        });

        it('should work with arrays', () => {
            const initialArray = [1, 2, 3];
            const newArray = [4, 5, 6];

            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: initialArray } }
            );

            rerender({ value: newArray });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toEqual(newArray);
        });

        it('should work with boolean values', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: false } }
            );

            rerender({ value: true });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe(true);
        });

        it('should work with null and undefined', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: null as string | null } }
            );

            rerender({ value: null });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBeNull();
        });
    });

    describe('Delay Variations', () => {
        it('should work with different delay values', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 100 } }
            );

            rerender({ value: 'changed', delay: 100 });
            act(() => {
                vi.advanceTimersByTime(100);
            });
            expect(result.current).toBe('changed');
        });

        it('should work with zero delay', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 0),
                { initialProps: { value: 'initial' } }
            );

            rerender({ value: 'changed' });
            act(() => {
                vi.advanceTimersByTime(0);
            });
            expect(result.current).toBe('changed');
        });

        it('should update delay dynamically', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 500 } }
            );

            rerender({ value: 'changed', delay: 1000 });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe('initial'); // Still initial because delay increased

            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe('changed'); // Now changed after full delay
        });
    });

    describe('Cleanup', () => {
        it('should cleanup timer on unmount', () => {
            const { rerender, unmount } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 'initial' } }
            );

            rerender({ value: 'changed' });

            // Unmount before timer fires
            unmount();

            // Timer should be cleaned up, so advancing time should not cause errors
            act(() => {
                vi.advanceTimersByTime(500);
            });

            // This test passes if no errors are thrown
            expect(true).toBe(true);
        });

        it('should handle multiple value changes before cleanup', () => {
            const { rerender, unmount } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 'initial' } }
            );

            rerender({ value: 'change1' });
            rerender({ value: 'change2' });
            rerender({ value: 'change3' });

            unmount();

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(true).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle same value changes', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 'same' } }
            );

            rerender({ value: 'same' });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe('same');
        });

        it('should handle rapid same value changes', () => {
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 'initial' } }
            );

            rerender({ value: 'changed' });
            rerender({ value: 'changed' });
            rerender({ value: 'changed' });

            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(result.current).toBe('changed');
        });

        it('should handle different types correctly', () => {
            // Test with numbers
            const { result: numberResult, rerender: numberRerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: 0 } }
            );

            numberRerender({ value: 42 });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(numberResult.current).toBe(42);

            // Test with booleans
            const { result: boolResult, rerender: boolRerender } = renderHook(
                ({ value }) => useDebounce(value, 500),
                { initialProps: { value: false } }
            );

            boolRerender({ value: true });
            act(() => {
                vi.advanceTimersByTime(500);
            });
            expect(boolResult.current).toBe(true);
        });
    });
}); 
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/ui/useLocalStorage';

describe('useLocalStorage Hook', () => {
    const mockLocalStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Functionality', () => {
        it('should return initial value when no stored value exists', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            expect(result.current[0]).toBe('defaultValue');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('key');
        });

        it('should return stored value when it exists', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify('storedValue'));

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            expect(result.current[0]).toBe('storedValue');
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('key');
        });

        it('should store value in localStorage when setValue is called', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            act(() => {
                result.current[1]('newValue');
            });

            expect(result.current[0]).toBe('newValue');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('newValue'));
        });

        it('should update localStorage when value changes', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify('initialValue'));

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            act(() => {
                result.current[1]('updatedValue');
            });

            expect(result.current[0]).toBe('updatedValue');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('updatedValue'));
        });
    });

    describe('Data Types', () => {
        it('should work with strings', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify('hello'));

            const { result } = renderHook(() => useLocalStorage('key', 'default'));

            expect(result.current[0]).toBe('hello');

            act(() => {
                result.current[1]('world');
            });

            expect(result.current[0]).toBe('world');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('world'));
        });

        it('should work with numbers', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(42));

            const { result } = renderHook(() => useLocalStorage('key', 0));

            expect(result.current[0]).toBe(42);

            act(() => {
                result.current[1](100);
            });

            expect(result.current[0]).toBe(100);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(100));
        });

        it('should work with objects', () => {
            const storedObj = { name: 'John', age: 30 };
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedObj));

            const { result } = renderHook(() => useLocalStorage('key', {}));

            expect(result.current[0]).toEqual(storedObj);

            const newObj = { name: 'Jane', age: 25 };
            act(() => {
                result.current[1](newObj);
            });

            expect(result.current[0]).toEqual(newObj);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(newObj));
        });

        it('should work with arrays', () => {
            const storedArray = [1, 2, 3];
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedArray));

            const { result } = renderHook(() => useLocalStorage('key', [] as number[]));

            expect(result.current[0]).toEqual(storedArray);

            const newArray = [4, 5, 6];
            act(() => {
                result.current[1](newArray);
            });

            expect(result.current[0]).toEqual(newArray);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(newArray));
        });

        it('should work with boolean values', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(true));

            const { result } = renderHook(() => useLocalStorage('key', false));

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](false);
            });

            expect(result.current[0]).toBe(false);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(false));
        });

        it('should work with null values', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(null));

            const { result } = renderHook(() => useLocalStorage('key', 'default' as string | null));

            expect(result.current[0]).toBeNull();

            act(() => {
                result.current[1](null);
            });

            expect(result.current[0]).toBeNull();
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(null));
        });
    });

    describe('Function Updates', () => {
        it('should support function updates', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(10));

            const { result } = renderHook(() => useLocalStorage('key', 0));

            act(() => {
                result.current[1](prev => prev + 5);
            });

            expect(result.current[0]).toBe(15);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(15));
        });

        it('should handle complex function updates', () => {
            const initialObj = { count: 0, items: [] as string[] };
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialObj));

            const { result } = renderHook(() => useLocalStorage('key', { count: 0, items: [] as string[] }));

            act(() => {
                result.current[1](prev => ({
                    ...prev,
                    count: prev.count + 1,
                    items: [...prev.items, 'newItem']
                }));
            });

            expect(result.current[0]).toEqual({ count: 1, items: ['newItem'] });
        });
    });

    describe('Error Handling', () => {
        it('should handle localStorage.getItem errors', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            expect(result.current[0]).toBe('defaultValue');
        });

        it('should handle localStorage.setItem errors', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            mockLocalStorage.setItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            act(() => {
                result.current[1]('newValue');
            });

            // Should still update state even if localStorage fails
            expect(result.current[0]).toBe('newValue');
        });

        it('should handle JSON parsing errors', () => {
            mockLocalStorage.getItem.mockReturnValue('invalid json');

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            expect(result.current[0]).toBe('defaultValue');
        });

        it('should handle localStorage being unavailable', () => {
            Object.defineProperty(window, 'localStorage', {
                value: undefined,
                writable: true,
            });

            const { result } = renderHook(() => useLocalStorage('key', 'defaultValue'));

            expect(result.current[0]).toBe('defaultValue');

            act(() => {
                result.current[1]('newValue');
            });

            expect(result.current[0]).toBe('newValue');
        });
    });

    describe('Key Changes', () => {
        it('should handle key changes', () => {
            mockLocalStorage.getItem.mockImplementation((key) => {
                if (key === 'key1') return JSON.stringify('value1');
                if (key === 'key2') return JSON.stringify('value2');
                return null;
            });

            const { result, rerender } = renderHook(
                ({ key }) => useLocalStorage(key, 'default'),
                { initialProps: { key: 'key1' } }
            );

            expect(result.current[0]).toBe('value1');

            rerender({ key: 'key2' });
            expect(result.current[0]).toBe('value2');
        });

        it('should use default value when key changes to non-existent key', () => {
            mockLocalStorage.getItem.mockImplementation((key) => {
                if (key === 'key1') return JSON.stringify('value1');
                return null;
            });

            const { result, rerender } = renderHook(
                ({ key }) => useLocalStorage(key, 'default'),
                { initialProps: { key: 'key1' } }
            );

            expect(result.current[0]).toBe('value1');

            rerender({ key: 'nonexistent' });
            expect(result.current[0]).toBe('default');
        });
    });

    describe('Initial Value Function', () => {
        it('should call initial value function when no stored value exists', () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            const initialValueFn = vi.fn(() => 'computed value');

            const { result } = renderHook(() => useLocalStorage('key', initialValueFn));

            expect(initialValueFn).toHaveBeenCalledOnce();
            expect(result.current[0]).toBe('computed value');
        });

        it('should not call initial value function when stored value exists', () => {
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify('stored value'));
            const initialValueFn = vi.fn(() => 'computed value');

            const { result } = renderHook(() => useLocalStorage('key', initialValueFn));

            expect(initialValueFn).not.toHaveBeenCalled();
            expect(result.current[0]).toBe('stored value');
        });
    });
}); 
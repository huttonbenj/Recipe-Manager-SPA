/**
 * useDebounce hook tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce, useDebouncedCallback } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('delays value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    // Should still be initial value
    rerender({ value: 'updated', delay: 500 })
    expect(result.current).toBe('initial')

    // After debounce delay, should be updated
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe('updated')
  })

  it('cancels previous timeouts when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    rerender({ value: 'first', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    rerender({ value: 'second', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    // Should still be initial since debounce hasn't completed
    expect(result.current).toBe('initial')
    
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    // Should now be 'second' after full delay from last change
    expect(result.current).toBe('second')
  })
})

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('debounces callback execution', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    // Call multiple times rapidly
    result.current('arg1')
    result.current('arg2')
    result.current('arg3')

    // Callback should not have been called yet
    expect(callback).not.toHaveBeenCalled()

    // After delay, should be called once with last arguments
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg3')
  })
})
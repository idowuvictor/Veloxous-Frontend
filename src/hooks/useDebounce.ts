import { useState, useEffect } from 'react'

/**
 * A custom React hook that debounces a value.
 * It will update the returned value only after the specified delay has passed
 * without the input value changing.
 *
 * @param value The value to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Return a cleanup function that will be called every time useEffect is re-called.
    // This prevents the debounced value from changing if the value changes within the delay period.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Only re-call effect if value or delay changes

  return debouncedValue
}
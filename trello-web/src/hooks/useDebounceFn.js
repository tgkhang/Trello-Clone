import { debounce } from 'lodash'
import { useMemo } from 'react'

export const useDebounceFn = (fnToDebounce, delay = 500) => {
  if (isNaN(delay) || delay < 0) {
    throw new Error('Delay must be a non-negative number')
  }

  if (!fnToDebounce || typeof fnToDebounce !== 'function') {
    throw new Error('First argument must be a function')
  }

  // useMemo ensures the debounced instance is created once and reused across renders.
  // A new instance is only created if fnToDebounce or delay actually changes.
  return useMemo(() => debounce(fnToDebounce, delay), [fnToDebounce, delay])
}

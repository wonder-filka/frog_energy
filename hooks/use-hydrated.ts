import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// false during SSR and hydration, true afterwards: render time-dependent
// values (timers, Date.now()) only when this is true to avoid hydration mismatches
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

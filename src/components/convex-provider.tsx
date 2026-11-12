import { ConvexProvider, ConvexReactClient } from 'convex/react'
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

/**
 * Wraps the app in a Convex provider when a deployment URL is configured.
 * When VITE_CONVEX_URL is missing (fresh checkout, before `npx convex dev`),
 * pages render a setup notice instead of crashing — useConvexReady() lets
 * them branch before any useQuery runs.
 */
const ConvexReadyContext = createContext(false)

export function useConvexReady(): boolean {
  return useContext(ConvexReadyContext)
}

export function PollPulseProvider({ children }: { children: ReactNode }) {
  const url = import.meta.env.VITE_CONVEX_URL as string | undefined
  const [client] = useState<ConvexReactClient | null>(() =>
    url ? new ConvexReactClient(url) : null,
  )

  if (!client) {
    return (
      <ConvexReadyContext.Provider value={false}>
        {children}
      </ConvexReadyContext.Provider>
    )
  }

  return (
    <ConvexReadyContext.Provider value={true}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexReadyContext.Provider>
  )
}

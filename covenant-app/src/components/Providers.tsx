'use client'

import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected, metaMask } from 'wagmi/connectors'

const connectors = [
  injected(),
  metaMask(),
  // Temporarily disable WalletConnect to avoid relayer issues
  // walletConnect({
  //   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  // }),
]

const config = createConfig({
  chains: [baseSepolia], // Base Sepolia testnet for testing
  connectors,
  transports: {
    [baseSepolia.id]: http('https://base-sepolia.public.blastapi.io', {
      batch: false,
      retryCount: 2,
      timeout: 20000,
    }),
  },
  ssr: false,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  // Add error boundary for connection issues
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('Connection interrupted') || 
          event.reason?.message?.includes('Fatal socket error') ||
          event.reason?.message?.includes('relayer')) {
        console.warn('Connection issue detected, ignoring...', event.reason)
        event.preventDefault()
      }
    }

    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('relayer') || 
          event.message?.includes('socket') ||
          event.message?.includes('WalletConnect')) {
        console.warn('Wallet connection error, ignoring...', event.message)
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
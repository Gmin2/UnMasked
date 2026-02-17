import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { NovaSdk } from 'nova-sdk-js'
import { useWallet } from './WalletProvider'
import { NOVA_CONFIG } from '@/config/constants'

interface NovaContextValue {
  sdk: NovaSdk | null
  isReady: boolean
}

const NovaContext = createContext<NovaContextValue>({ sdk: null, isReady: false })

export function NovaProvider({ children }: { children: ReactNode }) {
  const { accountId } = useWallet()
  const [sdk, setSdk] = useState<NovaSdk | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!accountId) {
      setSdk(null)
      setIsReady(false)
      return
    }

    const instance = new NovaSdk(accountId, {
      contractId: NOVA_CONFIG.contractId,
      mcpUrl: NOVA_CONFIG.mcpUrl,
      rpcUrl: NOVA_CONFIG.rpcUrl,
      apiKey: import.meta.env.VITE_NOVA_API_KEY || undefined,
    })
    setSdk(instance)
    setIsReady(true)
  }, [accountId])

  return (
    <NovaContext.Provider value={{ sdk, isReady }}>
      {children}
    </NovaContext.Provider>
  )
}

export function useNova() {
  return useContext(NovaContext)
}
